// import HistoryModel from '../models/history.model.mjs';
import bcrypt from "bcrypt"
// import ScheduleModel from '../models/schedule.model.mjs';

export async function getBaseUser() {
  // const history = await HistoryModel.find()
  // const schedule = await ScheduleModel.find()
  const psw = await bcrypt.hash('12345Ab,', 1)
  return [
    {
      userData: {
        firstname: "David",
        lastname: "Pizarro",
        email: "davidpizarrofrick@gmail.com",
        password: psw,
        tel_prefix: "+34",
        tel_suffix: "652490504",
        birth_date: "1988-02-09",
      },
      // inventory: [{
      //   type: Schema.Types.ObjectId,
      //   ref: "Inventory",
      // }],
      // categories: [{
      //   type: Schema.Types.ObjectId,
      //   ref: "Category",
      // }],
      // locations: [{
      //   type: Schema.Types.ObjectId,
      //   ref: "Location",
      // }],
      settings: {
        language: "es",
        notifications: false,
      },
      metadata: {
        email_verified: true,
        rate: "trial",
      }
    }
  ]
}