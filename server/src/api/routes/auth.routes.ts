import express from "express";
const router = express.Router();
import { googleOAuthHandler } from '../controllers/auth.controller'
import { getGoogleUrl } from '../controllers/auth.controller'


router.get('/oauth/google', googleOAuthHandler)
router.get('/getGoogleUrl', getGoogleUrl)

export default router