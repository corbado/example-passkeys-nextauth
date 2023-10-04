
'use client';
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { useCallback, useEffect, useState } from "react";

import '@corbado/webcomponent/pkg/auth_cui.css'

export default function SignIn( 
   { providers }: InferGetServerSidePropsType<typeof getServerSideProps>,  req: NextApiRequest,
   res: NextApiResponse) {
  const [session, setSession] = useState<any>(null);


  var providersNew = Object.values(providers);
  providersNew = providersNew.filter(function (el) {
    return el.name != "webauthn";
    });


    useEffect(() => {
      // This will run only on client-side
      
      import('@corbado/webcomponent')
          .then(module => {
              const Corbado = module.default || module;

              console.log("Initializing Corbado session")
              // bitte über .env File beziehen
              setSession(new Corbado.Session("pro-2808756695548043260"));
          })
          .catch(err => {
              console.log(err);
          });
  }, [])

  useEffect(() => {
      // Refresh the session whenever it changes
      if (session) {
          session.refresh(() => {
          });
      }
  }, [session]);

  return (
    <>
        {/*das nicht in einen zentralen Header packen?*/}
      <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous"></link>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
    <div className="parent">
      <div className="buttons">
      {providersNew.map((provider) => (
        <div key={provider.name} >
          <button className="btn btn-primary button" onClick={() => signIn(provider.id)}>
            Sign in with {provider.name}
          </button>
        </div>
      ))}
      </div>
      <div>
          {/*aus .env File holen*/}
        <corbado-auth project-id="pro-2808756695548043260" conditional="yes">
          <input name="username" id="corbado-username"
          required autoComplete="webauthn"/>
        </corbado-auth>
      </div>
      </div>
      <style jsx>{`
        .parent {
          width: 100%;
          margin-left: auto;
          margin-right: auto;
          align-items: center;

        }

        .button{
          margin-left: auto;
          margin-right: auto;
          margin-top: 10px;
          margin-bottom: 10px;
          display: block;
          border-radius: 30px;
          background-color: #1853FE;
        }
      `}</style>
    </>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);
  
  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const providers = await getProviders();
  
  return {
    props: { providers: providers ?? [] },
  }
}