import express from "express";
import { DeleteProfile, GetAllUsers, GetProfile, UpdateProfile } from "../controller/user-controller.js";
import authToken from "../middleware/authentication.js";

const router = express.Router();

router.get('/get-profile/:id', GetProfile);
router.get('/get-all-users', GetAllUsers);
router.put('/update-profile/:id', authToken, UpdateProfile);
router.delete('/delete-profile/:id', authToken, DeleteProfile);

export default router;