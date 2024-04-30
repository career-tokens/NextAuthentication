import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export const authOptions: NextAuthOptions = {
    providers: [
      //first we will use the credential provider
    CredentialsProvider({
      id: 'credentials',
        name: 'Credentials',
      //telling what credentials we will use
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
        },
      //defining the custom authorise function
        async authorize(credentials: any): Promise<any> {
          //connect to DB
        await dbConnect();
            try {
                //searching whether there's an user with username or email
                //same as credentials.identifier(basically the email)
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
                //user not found
          if (!user) {
            throw new Error('No user found with this email');
                }
                //user is not verified
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
                }
                //in case the user exists and is verified, then we will
                //check whether the password is correct or not
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
                );
                //if the password is correct, return the user
          if (isPasswordCorrect) {
            return user;
          } else //throw an error
          {
            throw new Error('Incorrect password');
          }
        } catch (err: any) {
          throw new Error(err);
        }
      },
    }),
    ],
    //here we are going to define the callbacks
    callbacks: {
      //the jwt strategy where a jwt token will be transferred to the browser
    async jwt({ token, user }) {
            if (user) {
                //we will store as much data in the token so that later we can 
                //retrieve the token and access a lot of data
        token._id = user._id?.toString(); // Convert ObjectId to string
        token.isVerified = user.isVerified;
        token.username = user.username;
      }
      return token;//return the token
        },
        //the session strategy
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.username = token.username;
      }
      return session;
    },
    },
    //strategy to use
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};