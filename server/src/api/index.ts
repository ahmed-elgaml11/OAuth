import express from "express";
import firstResponse from "../types/firstResponse";
const router = express.Router();
import authRoutes from './routes/auth.routes'
router.get<{}, firstResponse>('/', (req, res) => {
    res.json({
        message: 'hello from api.'
    })
})


router.use('/auth', authRoutes)


export default router