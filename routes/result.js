import express from "express";
import { GetUserResult, SaveResult } from "../controller/result-controller.js";
import authToken from "../middleware/authentication.js";

const router = express.Router();

router.get('/get-user-result/:userEmail', GetUserResult);
router.post('/save-result', authToken, SaveResult);

export default router;