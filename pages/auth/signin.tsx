
'use client';
import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";
import { useCallback, useEffect, useState } from "react";

import '@corbado/webcomponent/pkg/auth_cui.css'

const projectID = process.env.CORBADO_PROJECT_ID;

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

              ("Initializing Corbado session")
              setSession(new Corbado.Session(projectID));
          })
          .catch(err => {
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
      <div className="associate-container">

      <corbado-passkey-associate-login 
            project-id={projectID}/>
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

        .associate-container {
          width: 200px;
          margin-left: auto;
          margin-right: auto;
          align-items: center;
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