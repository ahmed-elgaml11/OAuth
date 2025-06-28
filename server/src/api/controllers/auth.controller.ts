import crypto from 'crypto';
import { getGoogleToken, getGoogleUser, upsertUser } from "../services/user.services";
import jwt, { JwtPayload } from 'jsonwebtoken'
import { generateRefreshToken, signToken } from '../../utils/jwt'
import { Request, Response, CookieOptions } from "express"


const accessTokenCookieOptions: CookieOptions = {
    maxAge: 900000,
    httpOnly: true,
    domain: "localhost",
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
};


export const getGoogleUrl = async (req: Request, res: Response): Promise<void> => {
    const state = await crypto.randomBytes(32).toString('hex');
    req.session.oauthState = state;

    req.session.save((err) => {
        if (err) {
            console.error('Session save error:', err);
            res.status(500).send('Session error');
            return;
        }})

    const params = new URLSearchParams({
        client_id: process.env.GOOGLE_CLIENT_ID!,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI!,
        response_type: "code",
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ].join(" "),
        access_type: "offline",
        prompt: "consent",
        state,
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
    res.json({ url });
}

export const googleOAuthHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        // get the authorization code and state from qs
        const { code, state } = req.query as { code: string; state: string };
        if (!code || !state) {
            res.status(403).send("Invalid Data");
            return
        }

        if (state !== req.session.oauthState) {
            res.status(403).send("Invalid state parameter");
            return

        }



        //  get the access and the id  token 
        const { id_token, access_token } = await getGoogleToken(code)
        if (!id_token) {
            res.status(401).send("Token exchange failed");
            return

        }


        // get the user with token 
        const googleUser = jwt.decode(id_token) as JwtPayload
        //or 
        const googleUser2 = await getGoogleUser(id_token, access_token)

        if (!googleUser || !googleUser.email_verified) {
            res.status(403).json({
                status: 'error',
                message: 'Email not verified'
            });
            return

        }



        // upsert the user 
        const user = await upsertUser({
            googleId: googleUser.sub
        }, {
            email: googleUser.email,
            name: googleUser.name,
            picture: googleUser.picture,
            googleId: googleUser.sub

        }, {
            upsert: true,
            new: true
        })

        if (!user) {
            res.status(500).send("Failed to create or fetch user");
            return
        }



        // create access and refresh token and set a cookie 
        const accessToken = signToken({ ...user?.toJSON() })
        const refreshToken = generateRefreshToken({ ...user?.toJSON() })


        res.cookie('accessToken', accessToken, accessTokenCookieOptions)

        res.cookie('refreshToken', refreshToken, {
            ...accessTokenCookieOptions,
            maxAge: 7 * 24 * 60 * 60 * 1000
        })



        // redirect to the client 
        res.redirect(`${process.env.ORIGIN}/client/oauth-success.html` || 'http://localhost:3000');

    }
    catch (err) {
        console.error(err, "Failed to authorize Google user");
        res.json({
            status: 'error',
            message: 'failed to authnticate..'
        });

    }
}