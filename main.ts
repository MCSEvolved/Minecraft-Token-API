import './env'
import express from 'express';
import cors from 'cors';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import endpoints from './src/routes/endpoints';

const app = express();

//  Get firebase admin credentials
const FIREBASE_CREDENTIALS_PATH = process.env.FIREBASE_CREDENTIALS_PATH
if (!FIREBASE_CREDENTIALS_PATH) throw new Error('No FIREBASE_CREDENTIALS_PATH provided');
const cred = credential.cert(FIREBASE_CREDENTIALS_PATH)

// Initialize the firebase admin app
initializeAdminApp({
    credential: cred,
});

// Enable CORS
app.use(cors())

// Start the server
app.listen(process.env.PORT ?? 3000, () => {
    console.log('Server started on port: ' + process.env.PORT ?? 3000);
});

// Path the service is running on
const PATH: string = process.env.API_PATH ?? '';
console.log('Running on path: ' + PATH)

// Add all endpoints to the server
app.use(PATH, endpoints)
