import type { GetServerSidePropsContext, InferGetServerSidePropsType, NextApiRequest, NextApiResponse } from "next";
import { getProviders, signIn } from "next-auth/react"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../api/auth/[...nextauth]";

const projectID = "pro-2808756695548043260";
console.log("Project ID: ", projectID)


export default function Redirect( 
   { providers }: InferGetServerSidePropsType<typeof getServerSideProps>,  req: NextApiRequest,
   res: NextApiResponse) {
  
      signIn("credentials", { provider: "corbado"})

  return (
    <>
    <p>Authenticating...</p>
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