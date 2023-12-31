
const Corbado = require('@corbado/node-sdk');
import type { NextApiRequest, NextApiResponse } from "next"

const projectID = process.env.CORBADO_PROJECT_ID;
const apiSecret = process.env.API_SECRET;


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
 
const config = new Corbado.Configuration(projectID, apiSecret);
const corbado = new Corbado.SDK(config);

    const {loginIdentifier, loginIdentifierType} = req.body;

    try {
        // use the Corbado SDK to create the association token
        // see https://api.corbado.com/docs/api/#tag/Association-Tokens/operation/AssociationTokenCreate) for details
        const associationToken = await corbado.associationTokens.create(loginIdentifier, loginIdentifierType, {
            remoteAddress: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
            userAgent: req.headers['user-agent'],
        });

        if (associationToken?.data?.token) {
            return res.status(200).send(associationToken.data.token);
        } else {
            return res.status(200).send({error: 'error_creating_association_token'});
        }
    } catch (err) {
        console.log(err)
        res.status(200).send({error: 'error_creating_association_token'});
    }
}
