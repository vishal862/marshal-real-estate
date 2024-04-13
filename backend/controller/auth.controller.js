import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ email }, { username }],
  });

  if (existedUser) {
    //we have to erite errorHandler inside next is bcz it is a middleware that is declared inside index.js
    return next(errorHandler(400, "USER EXISTS"));
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);

  const user = new User({ username, email, password: hashedPassword });

  try {
    await user.save();
    res.status(201).json("USER CREATED SUCCESSFULLY");
  } catch (error) {
    next(errorHandler(500, "user exist"));
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validatedUser = await User.findOne({ email });

    if (!validatedUser) {
      return next(errorHandler(404, "User Not Found!"));
    }

    const validPass = bcryptjs.compareSync(password, validatedUser.password);

    if (!validPass) {
      return next(errorHandler(500, "Invalid SignIn Credentials!"));
    }

    const token = jwt.sign({ id: validatedUser._id }, process.env.TOKEN_SECRET);

    //The password property is assigned to the variable pass.
    // All other properties of validatedUser._doc are collected into the rest object.
    // This destructuring operation effectively separates the password property from the rest of the user document's properties

    const { password: pass, ...rest } = validatedUser._doc;

    res
      .cookie("access_token", token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

export const google = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.TOKEN_SECRET);
      const { password: pass, ...rest } = user._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          req.body.name.split(' ').join('').toLowerCase() +
          Math.random().toString(36).slice(-4),
        email: req.body.email,
        password: hashedPassword,
        avatar: req.body.photo,
      });
      await newUser.save();
      const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET);
      const { password: pass, ...rest } = newUser._doc;
      res
        .cookie('access_token', token, { httpOnly: true })
        .status(200)
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};

export const signout = async (req,res,next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json("Signed Out Successfully")
  } catch (error) {
    next(error)
  }
}
