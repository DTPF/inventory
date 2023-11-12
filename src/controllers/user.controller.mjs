import User from "../models/user.model.mjs";
import bcrypt, { compare } from "bcrypt";
import * as jwt from "../services/jwt.mjs";
import key from "./responseKey.mjs";
import config from "../config/config.js";
import { transporter } from "../services/email.mjs";

export async function ping(req, res) {
  return res.status(200).send({ key: "pong" });
}

export async function signUp(req, res) {
  const { firstname, lastname, email, password, repeat_password, phone_number, birth_date } = req.body;

  if (!firstname) {
    return res.status(400).send({ key: key.nameRequired });
  }
  if (!lastname) {
    return res.status(400).send({ key: key.lastnameRequired });
  }
  if (!email) {
    return res.status(400).send({ key: key.emailRequired });
  }
  if (!password) {
    return res.status(400).send({ key: key.passwordRequired });
  }
  if (!repeat_password) {
    return res.status(400).send({ key: key.rPasswordRequired });
  }
  if (!phone_number) {
    return res.status(400).send({ key: key.phoneRequired });
  }
  if (password.toString() !== repeat_password.toString()) {
    return res.status(400).send({ key: key.passwordsNotMatch });
  }

  const newUser = new User({
    firstname: firstname,
    lastname: lastname,
    email: email,
    password: password,
    phone_number: phone_number,
    birth_date: birth_date,
    settings: {
      language: "es|ES",
      notifications: false,
    },
    metadata: {
      email_verified: false,
      rate: "trial",
    },
  });

  bcrypt.hash(
    password,
    Math.floor(config.app.SALT_ROUNDS),
    async function (err, hash) {
      if (err) {
        return res.status(500).send({ key: key.passwordEncryptError });
      }
      try {
        newUser.password = hash;
        const userSaved = await newUser.save();
        userSaved.password = undefined;
        userSaved.__v = undefined;
        const token = jwt.createAccessToken(newUser, 24, "hours");

        const mailOptions = {
          from: config.app.EMAIL,
          to: email,
          subject: "Verifica tu email en D'inventary",
          text: `
          Hola ${firstname} ${lastname}, ¡Gracias por registrarte en D'inventary!\n 
          Para verificar tu cuenta, haz click en el siguiente enlace: http://localhost:4000/api/v1/verify/${token}.\n
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
        return res.status(200).send({ key: key.success, user: userSaved });
      } catch (err) {
        if (err.code === 11000) {
          return res.status(500).send({ key: key.userExists });
        }
        console.log(err);
        return res.status(500).send({ key: key.serverError });
      }
    }
  );
}

export async function signIn(req, res) {
  const { email: emailN, password } = req.body;
  const email = emailN.toLowerCase();
  if (!email) {
    return res.status(400).send({ key: key.emailRequired });
  }
  if (!password) {
    return res.status(400).send({ key: key.passwordRequired });
  }

  try {
    const userStored = await User.findOne({ email });
    if (!userStored) {
      return res.status(404).send({ key: key.userNotFound });
    }
    compare(password, userStored.password, (err, check) => {
      if (err) {
        return res.status(500).send({ key: key.serverError });
      }
      if (!check) {
        return res.status(404).send({ key: key.passwordsNotValid });
      }
      userStored.password = undefined;
      return res.status(200).send({
        key: key.success,
        accessToken: jwt.createAccessToken(userStored, 24, "hours"),
        refreshToken: jwt.createRefreshToken(userStored, 24, "hours"),
      });
    });
  } catch (err) {
    return res.status(500).send({ key: key.serverError, err: err });
  }
}

export async function getUser(req, res) {
  const { email } = req.user;
  try {
    const userStored = await User.findOne({ email })
      .lean()
      .exec();
    if (!userStored) {
      return res.status(404).send({ key: key.userNotFound });
    }
    userStored.password = undefined;
    return res.status(200).send({ key: key.success, user: userStored });
  } catch (err) {
    return res.status(500).send({ key: key.serverError, err: err });
  }
}