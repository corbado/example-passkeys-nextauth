# Passkey integration example for NextAuth.js

This is a sample implementation of a NextAuth.js application that offers passkey authentication. For simple passkey-first authentication, the Corbado web component is used.

## File structure

```
├── pages
|   ├── api
|   |   ...
|   |   └── auth
|   |       ├── [...nextauth].ts   # Configuration of the authentication providers
|   |       └── associate.ts       # Endpoint which requests an association token from Corbado
|   |   
|   ├── auth
|   |   ├── redirect.tsx            # Page where the user gets redirected to by Corbado after authentication
|   |   └── signin.tsx              # Sign in page which also contains the Corbado web component
|   |
|   └── index.tsx                   # Main page which is shown when no path is given
|
├── .env.local                      # Contains the environment variables
```

## Prerequisites

Please follow the steps in [Getting started](https://docs.corbado.com/overview/getting-started) to create and configure
a project in the [Corbado developer panel](https://app.corbado.com/signin#register).

Paste your Corbado project ID in the applications.properties file.

## Usage

Then you can run the project locally by executing the following command inside the `/complete` folder:

```bash
npm install && npm run dev
```
