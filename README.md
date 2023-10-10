# NextAuth.js Passkey Integration Example

This is a sample implementation of a NextAuth.js application that offers passkey authentication. For simple passkey-first authentication, Corbado's [passkey association approach](https://docs.corbado.com/products/corbado-connect/connect-via-passkey-association) is used.

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
|   |   └── signin.tsx              # Sign in page which also contains the Corbado login web component
|   |
|   └── index.tsx                   # Main page which is shown when no path is given
|
├── .env.local                      # Contains the environment variables
```

## Prerequisites

Please follow the steps in [Getting started](https://docs.corbado.com/overview/getting-started) to create and configure
a project in the [Corbado developer panel](https://app.corbado.com/signin#register).

Create a .env.local file and paste your Corbado project ID in there as well as credentials for at least one OAuth provider as shown in .env.local.

## Usage

Then you can run the project locally by executing the following command:

```bash
npm install && npm run dev
```
