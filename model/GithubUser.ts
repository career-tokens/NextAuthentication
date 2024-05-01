import mongoose, { Schema, Document } from "mongoose";

interface GithubUser extends Document {
    username: string;
    // Add any other fields here if needed
}

const GithubUserSchema: Schema = new Schema({
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

    //we can also take the profile image from user's Github account
});

const GithubUser = (mongoose.models.GithubUser as mongoose.Model<GithubUser>) ||
    mongoose.model<GithubUser>("GithubUser", GithubUserSchema);

export default GithubUser;
