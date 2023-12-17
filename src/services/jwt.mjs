import moment from "moment";
import jwt from "jsonwebtoken";

export function createAccessToken(user, time, period) {
  const payload = {
    id: user._id,
    user_data: {
      firstname: user.user_data.firstname,
      lastname: user.user_data.lastname,
      email: user.user_data.email,
    },
    createToken: moment().unix(),
    exp: moment().add(time, period).unix(),
  };
  return jwt.sign(payload, process.env.AUTH_SECRET_KEY);
}

export function createRefreshToken(user, time, period) {
  const payload = {
    id: user._id,
    exp: moment().add(time, period).unix(),
  };
  return jwt.sign(payload, process.env.AUTH_SECRET_KEY);
}
