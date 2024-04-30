import mongoose, { Schema, Document } from 'mongoose';

//a typescript interface which is simply going to tell the type of an object
//and here it extends or reuses the types of Document taken from mongoose
export interface User extends Document{
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
}

//now lets create the mongoose schema which simply assigns the type of the specific
//objects to be stored in an array and stored under the Model name in the database 
const UserSchema: Schema<User> = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        trim: true,
        unique:true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/.+\@.+\..+/, 'Please use a valid email address'],
      },
      password: {
        type: String,
        required: [true, 'Password is required'],
      },
      verifyCode: {
        type: String,
        required: [true, 'Verify Code is required'],
      },
      verifyCodeExpiry: {
        type: Date,
        required: [true, 'Verify Code Expiry is required'],
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
})

//now we are reusing the User model NextJS might have earlier created or if its the 
//first time then create the User model
const UserModel =  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

//export it
export default UserModel;