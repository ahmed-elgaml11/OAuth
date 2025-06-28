import mongoose, { Document } from 'mongoose';

export interface UserDocument extends Document {
    email: string;
    name: string;
    googleId: string;
    picture: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema({
    googleId: { type: String, unique: true, sparse: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    picture: { type: String },
},
    {
        timestamps: true,
    }
);

export const User = mongoose.model<UserDocument>("User", userSchema);

