import express from 'express';
import { getAuth } from 'firebase-admin/auth';

const router = express.Router();

const UID  = 'official-mcs-minecraft-server'

router.get('/', async (req, res) => {
    // Generate a custom token
    console.log('Generating custom token')
    let customToken;
    try {
        customToken = await getAuth().createCustomToken(UID);
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Error generating token');
        return;
    }

    // Fetch auth server to exchange custom token for access token
    console.log('Exchanging custom token for idtoken at auth server')
    const response = await fetch('https://api.mcsynergy.nl/auth/exchange-custom-token', {
        method: 'GET',
        headers: {
            'custom-token': customToken
        }
    });

    // Check if the response was successful
    console.log('Received response from auth server')
    if (response.status !== 200) {
        console.log('Error exchanging custom token, not a statuscode 200')
        console.log('Received Statuscode: ' + response.status)
        console.log('Received StatusText: ' + response.statusText)

        res.status(500).send('Error exchanging custom token');
        return;
    }

    const data = await response.json();
    if (!data.idToken) {
        console.log('Error exchanging custom token, did not receive idtoken', data)
        res.status(500).send('Error exchanging custom token');
        return;
    }
    console.log('Exchanged custom token for idtoken')

    // Send the idtoken to the client
    res.status(200).send(data.idToken);
});

export default router;