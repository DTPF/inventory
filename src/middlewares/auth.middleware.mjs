import jwt from "jsonwebtoken";
import User from "../models/user.model.mjs";
import responseKey from "../controllers/responseKey.mjs";

export const ensureAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return res.status(403).send({ key: responseKey.tokenNotFound });
  }
  const token = req.headers.authorization.replace(/['"]+/g, "");
  try {
    var payload = jwt.verify(token, process.env.AUTH_SECRET_KEY);
  } catch (err) {
    if (err.message === "jwt expired") {
      return res.status(500).send({ key: responseKey.tokenExpired });
    }
    return res.status(500).send({ key: responseKey.tokenNotValid });
  }
  const { id, email } = payload;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(500).send({ key: responseKey.userNotFound });
  }
  if (user.id !== id) {
    return res.status(501).send({ key: responseKey.tokenNotValid });
  }
  req.user = payload;
  next();
};