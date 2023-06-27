import express from 'express';
const router = express.Router()

router.get('/', (req, res) => {
    console.log('Received is alive check!')
    res.status(200).send('I am alive!');
});

export default router;
