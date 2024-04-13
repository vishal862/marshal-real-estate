import { Listing } from "../models/listing.model.js";
import { errorHandler } from "../utils/errorHandler.js";

export const userListing = async (req, res, next) => {
  try {
    const listing = await Listing.create(req.body);

    return res.status(201).json(listing);
  } catch (error) {
    next(error);
  }
};

export const deleteListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not Found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(
      errorHandler(400, "You can Delete Listing Only from Your Account")
    );
  }

  try {
    await Listing.findByIdAndDelete(req.params.id);

    return res.status(200).json("Listing deleted Successfully");
  } catch (error) {
    next(error);
  }
};

export const updateListing = async (req, res, next) => {
  const listing = await Listing.findById(req.params.id);

  if (!listing) {
    return next(errorHandler(404, "Listing not Found"));
  }

  if (req.user.id !== listing.userRef) {
    return next(
      errorHandler(400, "You can Delete Listing Only from Your Account")
    );
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    return res.status(200).json(updatedListing);
  } catch (error) {
    next(error);
  }
};

export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return next(errorHandler(404, "Listing not Found"));
    }

    return res.status(200).json(listing)
  } catch (error) {
    next(error);
  }
};

export const getListings = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === false) {
      offer = { $in: [true, false] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === false) {
      furnished = { $in: [true, false] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === false) {
      parking = { $in: [true, false] };
    }

    let type = req.query.type;

    if (type === undefined || type === 'all') {
      type = { $in: ["sale", "rent"] };
    }

    const searchTerm = req.query.searchTerm || "";

    const sort = req.query.sort || "createdAt";
    
    const order = req.query.order || "desc";

    const listing = await Listing.find({
      name : {$regex : searchTerm , $options :'i'},
      offer,
      furnished,
      parking,
      type
    }).sort({[sort]:order}).limit(limit).skip(startIndex)

    return res.status(200).json(listing);

  } catch (error) {
    next(error);
  }
};
