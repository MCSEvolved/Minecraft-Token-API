import express from 'express';
import { getAuth } from 'firebase-admin/auth';

const router = express.Router();

const UID  = 'official-mcs-minecraft-server'

router.get('/', async (req, res) => {
    // Check if the password is provided in the Authorization header
    const password = req.get('Authorization') 
    if (!password) {
        return res.status(401).send('No password provided in Authorization header');
    }

    // Check if the password is correct
    if (password !== process.env.PASSWORD) {
        return res.status(401).send('Invalid password');
    }

    // Generate a custom token
    console.log('Generating custom token')
    let customToken;
    try {
        customToken = await getAuth().createCustomToken(UID);
        console.log(customToken)
    }
    catch (error) {
        console.log(error)
        res.status(500).send('Error generating token');
        return;
    }

    // Fetch auth server to exchange custom token for access token
    console.log('Exchanging custom token for idtoken at auth server')
    const response = await fetch('https://api.mcsynergy.nl/auth/exchange-custom-token', {
        method: 'POST',
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

        return res.status(500).send('Error exchanging custom token');
    }

    if (!response.body) {
        console.log('Error exchanging custom token, did not receive body', response)
        return res.status(500).send('Error exchanging custom token');
    }

    let data;
    try {
        data = await response.json();
    }
    catch (error) {
        console.log('Error exchanging custom token, could not parse body', error)
        return res.status(500).send('Error exchanging custom token');
    }

    if (!data.idToken) {
        console.log('Error exchanging custom token, did not receive idtoken')
        return res.status(500).send('Error exchanging custom token');
    }
    console.log('Exchanged custom token for idtoken')

    // Send the idtoken to the client
    res.status(200).send({"idToken": data.idToken});
});

export default router;