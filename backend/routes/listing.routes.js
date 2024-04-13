import express from "express";
import {
  deleteListing,
  getListing,
  getListings,
  updateListing,
  userListing,
} from "../controller/listing.controller.js";
import { verifyUser } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyUser, userListing);
router.delete("/delete/:id", verifyUser, deleteListing);
router.post("/update/:id", verifyUser, updateListing);
router.get("/get/:id", getListing);
router.get("/get",getListings);


export default router;
 