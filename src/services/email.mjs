import config from '../config/config.js';
import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: config.services.EMAIL,
    pass: config.services.EMAIL_PASSWORD,
  },
});