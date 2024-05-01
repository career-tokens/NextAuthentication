import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import GoogleUser from '@/model/GoogleUser';
import GithubUser from '@/model/GithubUser';

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
    //lets use the google provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID||"",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET||"",
    }),
    //lets use the github provider
    GitHubProvider({
      clientId: process.env.GITHUB_ID||"",
      clientSecret: process.env.GITHUB_SECRET||"",
    })
    ],
    //here we are going to define the callbacks
  callbacks: {
    async signIn({ user, account }) {
       //if logged in using google then save the user under github users in 
      //database if not earlier created
      if (account?.provider === "google") {
        const { name, email } = user;
        try {
          //connect to DB
          await dbConnect();
          const userExists = await GoogleUser.findOne({ email });

          if (!userExists) {
            await GoogleUser.create({ name, email });
          }
        } catch (error) {
          console.log(error);
        }
      }
      //if logged in using github then save the user under github users in 
      //database if not earlier created
      if (account?.provider === "github") {
        const { name, email } = user;
        try {
          //connect to DB
          await dbConnect();
          const userExists = await GithubUser.findOne({ email });

          if (!userExists) {
            await GithubUser.create({ name, email });
          }
        } catch (error) {
          console.log(error);
        }
      }

      return true;
    },
      //the jwt strategy where a jwt token will be transferred to the browser
      async jwt({ token, user, account }) {
        if (user) {
          if (account?.provider === "google") {
            //if logged in using google
            token.username = user.name||"";
          }
          else if (account?.provider === "github") {
            //if logged in using github
            token.username = user.name||"";
          }
          else {
            //we will store as much data in the token so that later we can 
            //retrieve the token and access a lot of data
            token._id = user._id?.toString(); // Convert ObjectId to string
            token.isVerified = user.isVerified;
            token.username = user.username;
          }
        }
      return token;//return the token
        },
        //the session strategy
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
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