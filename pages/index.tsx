import Layout from "../components/layout"
import { signIn, signOut, useSession } from "next-auth/react"
import React, { useCallback, useEffect, useState } from "react";

import axios from "axios"
import ('@corbado/webcomponent');

interface AssociationToken {
  associationToken: string
}

const PASSKEY_CREATION_SUCCESSFUL = "PASSKEY_CREATION_SUCCESSFUL"
const PASSKEY_CREATION_FAILED = "PASSKEY_CREATION_FAILED"
const DEVICE_NOT_PASSKEY_READY = "DEVICE_NOT_PASSKEY_READY"

export default function IndexPage()  {

  const { data: session, status } = useSession()
  const [associationToken, setAssociationToken] = useState<AssociationToken | null>(null)
  const [ref, setRef] = useState<any | null>(null)
  const [hasPasskey, setHasPasskey] = useState<boolean>(false)
  const [hasCheckedPasskey, setHasCheckedPasskey] = useState<boolean>(false)
  const [passkeyReady, setPasskeyReady] = useState<boolean>(true)



      // The following event handlers can be used to react to different events from the web component
      const onPasskeyCreationSuccessful = useCallback((_event: CustomEvent) => {
        console.log("Passkey creation successful");
        setAssociationToken(null)
        setPasskeyReady(true)
        setHasPasskey(true)
    }, [])
  
    const onPasskeyCreationFailed = useCallback((_event: CustomEvent) => {
        console.log("Passkey creation failed");
        setAssociationToken(null)
        setHasCheckedPasskey(false)
    }, [])
  
    const onDeviceNotPasskeyReady = useCallback((_event: CustomEvent) => {
        console.log("Device not passkey ready");
        setAssociationToken(null)
        setPasskeyReady(false)
        setHasPasskey(false)
    }, [])
  
  
    // Create and remove the event listeners
    useEffect(() => {
        if (ref) {
            ref.addEventListener(PASSKEY_CREATION_SUCCESSFUL, onPasskeyCreationSuccessful)
            ref.addEventListener(PASSKEY_CREATION_FAILED, onPasskeyCreationFailed)
            ref.addEventListener(DEVICE_NOT_PASSKEY_READY, onDeviceNotPasskeyReady)
        }
  
        // Cleanup function
        return () => {
            if (ref) {
                ref.removeEventListener(PASSKEY_CREATION_SUCCESSFUL, onPasskeyCreationSuccessful)
                ref.removeEventListener(PASSKEY_CREATION_FAILED, onPasskeyCreationFailed)
                ref.removeEventListener(DEVICE_NOT_PASSKEY_READY, onDeviceNotPasskeyReady)
            }
        };
    }, [ref, onPasskeyCreationSuccessful, onPasskeyCreationFailed, onDeviceNotPasskeyReady])
  
  const handleButtonClick = async () => {
    try {
        // loginIdentifier needs to be obtained via a backend call or your current state / session management
        // it should be a dynamic value depending on the current logged-in user
        const response = await axios.post<AssociationToken>("/api/auth/associate", {
            loginIdentifier: session.user.email,
            loginIdentifierType: "email",
        })
        setHasCheckedPasskey(true)
        setHasPasskey(response.data.error != undefined)
        console.log("AssociationToken response: ", response.data)
        if(response.data.error == undefined){
        setAssociationToken(response.data)
        }
    } catch (err) {
        console.log(err)
    }
  }

    if(session?.user != undefined && !hasCheckedPasskey){
      handleButtonClick()
    }

  return (
    <Layout>
      <h1>NextAuth.js Example</h1>
      <p>
        This is an example site to demonstrate how to use{" "}
        <a href="https://next-auth.js.org">NextAuth.js</a> together with {" "}
        <a href="https://corbado.com">Corbado</a> for passkey authentication.
      </p>
      {!session?.user && (
      <>
      <p>When you are logged in, you can add a passkey to your account here!</p>
      </>
      )}
      {session?.user && !hasPasskey &&(
        <>
        
            {!associationToken && 
            <button onClick={handleButtonClick}>Add passkey to my account</button>
            }
            {associationToken && !hasPasskey && 
                    <div className="associate-container"><corbado-passkey-associate
                        project-id="pro-2808756695548043260"
                        association-token={associationToken}
                        ref={setRef}
                    />
                    </div>}
                    <style jsx>{`
        .associate-container {
          width: 200px;
          margin-left: auto;
          margin-right: auto;
          align-items: center;

        }
      `}</style>
          </>
            )}
        {session?.user && hasPasskey && (
          <>
            <p>
              <strong>You have already registered a passkey on this device!</strong>
            </p>
            </>)}

        {!passkeyReady && (
          <>
            <p>
              <strong>Your device is not passkey ready!</strong>
            </p>
            </>)}
    </Layout>
  )
}
