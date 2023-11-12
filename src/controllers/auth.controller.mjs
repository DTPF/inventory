import * as jwtService from "../services/jwt.mjs";
import User from "../models/user.model.mjs";
import jwt from "jsonwebtoken";
import key from "./responseKey.mjs";
import { transporter } from "../services/email.mjs";
import config from "../config/config.js";
import responseKey from "./responseKey.mjs";

export async function refreshTokens(req, res) {
  const { refreshToken } = req.body;
  try {
    const { id } = jwt.verify(refreshToken, process.env.AUTH_SECRET_KEY);
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        return res.status(404).send({ key: key.userNotFound });
      }
      return res.status(200).send({
        key: key.success,
        accessToken: jwtService.createAccessToken(user, 24, "hours"),
        refreshToken: jwtService.createRefreshToken(user, 24, "hours"),
      });
    } catch (err) {
      return res.status(500).send({ key: key.serverError, error: err });
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      return res.status(500).send({ key: key.tokenExpired, error: err });
    }
    return res.status(500).send({ key: key.tokenNotValid, error: err });
  }
}

export async function verifyEmail(req, res) {
  const { token } = req.params;

  try {
    const payload = jwt.verify(token, process.env.AUTH_SECRET_KEY);
    try {
      const user = await User.findOneAndUpdate(
        { email: payload.email },
        { metadata: { emailVerified: true } }
      );
      if (!user) {
        return res.status(404).send({ key: responseKey.userNotFound });
      }
      return res.status(200).send(
        `<div style='width: 100vw; height: 100vh; display: grid; place-content: center; font-size: 1.5rem'>
          <h1>Email verificado correctamente</h1>
        </div`
      );
    } catch (err) {
      return res.status(500).send({ key: responseKey.serverError });
    }
  } catch (err) {
    if (err.message === "jwt expired") {
      return res.status(500).send(
        `<div style='width: 100vw; height: 100vh; display: grid; place-content: center; font-size: 1.5rem; text-align: center'>
          <h1 style='margin-bottom: 30px'>El token ha expirado</h1>
          <a href='http://localhost:4000/api/v1/resend-email-verification/${token}'>Reenviar email</a>
        </div`
      );
    }
    return res.status(500).send(
      `<div style='width: 100vw; height: 100vh; display: grid; place-content: center; font-size: 1.5rem; text-align: center'>
        <h1 style='margin-bottom: 30px'>El token no es válido</h1>
      </div`
    );
  }
}

export async function resendEmailVerification(req, res) {
  const { token } = req.params;
  try {
    const payload = jwt.decode(token, process.env.AUTH_SECRET_KEY);
    delete payload.createToken;
    delete payload.exp;
    delete payload.iat;

    const newToken = jwtService.createAccessToken(payload, 24, "hours");
    const mailOptions = {
      from: config.app.EMAIL,
      to: payload.email,
      subject: "Verifica tu email en Palmira",
      text: `
        Hola ${payload.name} ${payload.lastname}, Para verificar tu cuenta, haz click en el siguiente enlace: http://localhost:4000/api/v1/verify/${newToken}.\n
        Este enlace caducará en 24 horas. Si no has sido tú, ignora este mensaje.
      `,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    return res.status(200).send(
      `<div style='width: 100vw; height: 100vh; display: grid; place-content: center; font-size: 1.5rem'>
        <h1>Revisa la bandeja de email y verifique para continuar</h1>
      </div`
    );
  } catch (err) {
    return res.status(500).send({ key: responseKey.serverError, err: err });
  }
}