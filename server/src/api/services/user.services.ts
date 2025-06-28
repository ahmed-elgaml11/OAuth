import axios from "axios";
import qs from 'qs'
import {User, UserDocument } from "../models/user.model";
import { QueryOptions, RootFilterQuery, UpdateQuery } from "mongoose";

interface GoogleTokensResult {
    access_token: string;
    expires_in: number;
    refresh_token: string;
    scope: string;
    id_token: string;
}

export const getGoogleToken = async (code: string): Promise<GoogleTokensResult> => {
    try {
        const url = 'https://oauth2.googleapis.com/token'
        const body = {
            code,
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.CLIENT_SECRET,
            redirect_uri: process.env.GOOGLE_REDIRECT_URI,
            grant_type: "authorization_code"
        }

        const res = await axios.post<GoogleTokensResult>(url, qs.stringify(body), {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        return res.data

    }
    catch (err: any) {
        console.error(err.response?.data || err.message, "Failed to fetch Google Oauth Tokens");
        throw new Error(err.message);
    }

}



export const getGoogleUser = async (id_token: string, access_token: string) => {
    try {
    const res = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`,
        },
      }
    );
    return res.data;
  } catch (error: any) {
    console.error(error, "Error fetching Google user");
    throw new Error(error.message);
  }

}




export const upsertUser = async(filter: RootFilterQuery<UserDocument>, update: UpdateQuery<UserDocument>, options: QueryOptions = {}) => {
    return await User.findOneAndUpdate(filter, update, options)

}