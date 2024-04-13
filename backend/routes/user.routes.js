import express from "express";
import { deleteUser, getUser, getUserListing, test, updateUser } from "../controller/user.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.get("/test", test);
router.post("/update/:id",verifyUser, updateUser);
router.delete("/delete/:id",verifyUser,deleteUser);
router.get("/listings/:id",verifyUser,getUserListing);
router.get("/:id",verifyUser,getUser);

export default router;
