import express from 'express';
import dotenv from 'dotenv';
import path from 'path'
dotenv.config({ path: path.join(__dirname, '../config.env') })
import session from 'express-session';
import cros from 'cors'
import firstResponse from './types/firstResponse';
import api from './api/index'
import errorHandler from './middlewares/errorHandler';
import { AppError } from './utils/appError';
var MongoDBStore = require('connect-mongodb-session')(session);



const app = express();
var store = new MongoDBStore({
    uri: process.env.DATABASE,
    collection: 'mySessions'
});
store.on('error', function (error: Error) {
    console.log(error);
});

app.use(express.json());

app.use(cros({
    origin: 'http://localhost:5500',
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))

app.use(session({
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        httpOnly: true,
        sameSite: 'lax', 
    },

    store: store
}));
app.get<{}, firstResponse>('/', (req, res) => {
    res.json({
        message: 'hello from the root'
    })
})



app.use('/api/v1', api)

app.all('*', (req, res, next) => {
    next(new AppError(`Not Found - ${req.originalUrl}`, 404))
})
app.use(errorHandler)

export default app;