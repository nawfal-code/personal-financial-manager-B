import jwt from "jsonwebtoken";
import mongoose from "mongoose";

const authMiddleware = (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token && req.cookies?.token) token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Authorization token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    if (!decoded?._id) return res.status(401).json({ message: "Invalid token payload" });

    req.user = new mongoose.Types.ObjectId(decoded._id);

    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Session expired, please login again" });
    }
    return res.status(401).json({ message: "Invalid authentication token" });
  }
};

export default authMiddleware;
