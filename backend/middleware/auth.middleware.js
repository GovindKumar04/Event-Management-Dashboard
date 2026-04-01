import jwt from "jsonwebtoken";
import User from "../models/User.js";

const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return next(createError("Not authorized. No token provided", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return next(createError("User no longer exists", 401));
    }

    req.user = user;
    next();
  } catch (error) {
    next(createError("Invalid or expired token", 401));
  }
};

export const requireOrganizer = (req, res, next) => {
  if (!req.user) {
    return next(createError("Not authorized", 401));
  }

  if (req.user.role !== "organizer") {
    return next(createError("Only organizers can perform this action", 403));
  }

  next();
};