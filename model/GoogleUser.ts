import mongoose, { Schema, Document } from "mongoose";

interface GoogleUser extends Document {
    username: string;
    email: string;
    // Add any other fields here if needed
}

const GoogleUserSchema: Schema = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique: true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
    },
    //we can also take the profile image from user's google account
});

const GoogleUser = (mongoose.models.GoogleUser as mongoose.Model<GoogleUser>) ||
    mongoose.model<GoogleUser>("GoogleUser", GoogleUserSchema);

export default GoogleUser;
