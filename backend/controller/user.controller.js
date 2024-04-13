import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import { Listing } from "../models/listing.model.js";

export const test = (req, res) => {
  res.json({
    message: "Api is working",
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(400, "You can only update your own Account"));

  try {
    if (req.user.password) {
      req.user.password = bcryptjs.hashSync(req.user.password, 10);
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    const { password, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(400, "You can Delete Only your Own account!"));

  try {
    await User.findByIdAndDelete(req.user.id);

    res.clearCookie("access_token");

    res.status(200).json("User deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const getUserListing = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });

      return res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    next(errorHandler(400, "You can only view Your own listings"));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(errorHandler(404, "User Not Found"));
    }

    const { password: pass, ...rest } = user._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};


