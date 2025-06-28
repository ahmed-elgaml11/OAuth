// src/types/express/index.d.ts or any global .d.ts file
import session from 'express-session';

declare module 'express-session' {
    interface SessionData {
        oauthState?: string; // add any other custom keys you store in session
    }
}
