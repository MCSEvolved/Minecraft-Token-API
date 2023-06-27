import express from "express";
import generateToken from "./generateToken";

const router = express.Router();

router.use('/generate', generateToken)

export default router;