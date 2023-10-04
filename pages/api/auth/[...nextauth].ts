import NextAuth, { NextAuthOptions } from "next-auth"
import GoogleProvider from "next-auth/providers/google"
import FacebookProvider from "next-auth/providers/facebook"
import GithubProvider from "next-auth/providers/github"
import TwitterProvider from "next-auth/providers/twitter"
import Auth0Provider from "next-auth/providers/auth0"
import CredentialsProvider from "next-auth/providers/credentials"
import * as jose from "jose";

const projectID = process.env.CORBADO_PROJECT_ID;

export const authOptions: NextAuthOptions = {
  // https://next-auth.js.org/configuration/providers/oauth

  // kannst du mir ggf.
  providers: [
    FacebookProvider({
      clientId: process.env.FACEBOOK_ID,
      clientSecret: process.env.FACEBOOK_SECRET,
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
    TwitterProvider({
      clientId: process.env.TWITTER_ID,
      clientSecret: process.env.TWITTER_SECRET,
    }),
    Auth0Provider({
      clientId: process.env.AUTH0_ID,
      clientSecret: process.env.AUTH0_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    }),
    CredentialsProvider({
      name: 'webauthn',
      credentials: {},
      async authorize(cred, req) {
        if(cred.provider !== "corbado") return null;

        // Get the token from the cookie
        var cbo_short_session = req.headers.cookie.split("; ").find(row => row.startsWith("cbo_short_session"));
        var token = cbo_short_session.split("=")[1];

        // Get the JWKS URL from the project ID
        var issuer = "https://" + projectID + ".frontendapi.corbado.io";
        var jwksUrl = issuer + "/.well-known/jwks"; 

        // Initialize the JWKS client
        const JWKS = jose.createRemoteJWKSet(new URL(jwksUrl), {
          cacheMaxAge: 10 * 60 * 1000
        })
        const options = {
            issuer: issuer,
        }
        try {

        // Verify the token
            const {payload} = await jose.jwtVerify(token, JWKS, options)
            if (payload.iss === issuer) {

              //
              //Next steps: Load data from database here to always have all the data available in the session
              return { email: payload.email, name: payload.name, image: null};
            }else{
              console.log("issuer not valid")
            }
        }
        catch (e) {
            console.log("Error: ", e)
        }
      }
  })
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin"
      return token
    },
  },
  pages: {
    signIn: '/auth/signin'
  }
}

export default NextAuth(authOptions)
