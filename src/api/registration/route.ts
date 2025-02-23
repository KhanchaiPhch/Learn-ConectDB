import express, { Request, Response } from "express";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // import locale
import jwt from "jsonwebtoken";
import { user } from "../../mongDB/userSchema";
import { auth } from "../../mongDB/authSchema";

export const tempAccount = express();

tempAccount.post("/jwtTempAccount", async (req: Request, res: Response) => {
  const { firstName, lastName, birthDate, idCard, email } = req.body;
  try {
    await user.create({
      firstName: firstName,
      lastName: lastName,
      birthDate: birthDate,
      idCard: idCard,
      email: email,
    });

    // dayjs.extend(isLeapYear) // use plugin
    // dayjs.locale('zh-cn') // use locale

    let conunt = await user.countDocuments();
    // console.log(conunt)

    const myDate = dayjs();
    // console.log(myDate.format('YYYYMMDD'));

    const password = await user.findOne({
      idCard: idCard,
    });

    const time = dayjs();

    let timeAdd = time.add(30, "minute");
    // console.log(timeAdd)

    await auth.insertOne({
      username: `TA${myDate.format("YYYYMMDD")}${conunt}`,
      password: password?.idCard?.slice(7),
      exp: `${myDate.format(`YYYY-MM-DD`)} ${timeAdd.format(`HH:mm:ss`)}`,
    });

    let data = {
      username: `TA${myDate.format("YYYYMMDD")}${conunt}`,
      password: password?.idCard?.slice(7),
      exp: `${myDate.format(`YYYY-MM-DD`)} ${timeAdd.format(`HH:mm:ss`)}`,
    };

    let privateKey = "shhhh";
    let token = jwt.sign({ data }, "shhhh", { expiresIn: "30m" });

    res.status(200).send({
      status: 200,
      msg: "success",
      token,
    });
  } catch (error) {
    res.status(500).send({
      status: "OK",
      msg: `Catch ${error}`,
    });
  }
});

tempAccount.post("/verify", async (req: Request, res: Response) => {
  const { authorization }: any = req.headers;
  console.log(authorization);
  try {
    jwt.verify(
      authorization.split(" ")[1] || "",
      "shhhh",
      (err: any, user: any) => {
        if (err) {
          res.status(400).send({
            status: 400,
            msg: "Unauthor",
          });
        } else {
          res.status(200).send({
            status: 200,
            msg: "Success",
            user
          });
        }
      }
    );
  } catch (error) {
    res.status(500).send({
      status: "OK",
      msg: `Catch ${error}`,
    });
  }
});
