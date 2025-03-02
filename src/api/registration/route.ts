import express, { Request, Response } from "express";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn"; // import locale
import jwt from "jsonwebtoken";
import { history } from "../../mongDB/historySchema";
import { user } from "../../mongDB/userSchema";
import { auth } from "../../mongDB/authSchema";
export const registration = express();

registration.post("/TempAccount", async (req: Request, res: Response) => {
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

    const User = await auth.insertOne({
      username: `TA${myDate.format("YYYYMMDD")}${conunt}`,
      password: password?.idCard?.slice(7),
      exp: `${myDate.format(`YYYY-MM-DD`)} ${timeAdd.format(`HH:mm:ss`)}`,
    });

    // let data = {
    //   username: `TA${myDate.format("YYYYMMDD")}${conunt}`,
    //   password: password?.idCard?.slice(7),
    //   exp: `${myDate.format(`YYYY-MM-DD`)} ${timeAdd.format(`HH:mm:ss`)}`,
    // };

    // let privateKey = "shhhh";
    // let token = jwt.sign({ data }, "shhhh", { expiresIn: "30m" });

    res.status(200).send({
      status: 200,
      msg: "success",
      data: User,
    });
  } catch (error) {
    res.status(500).send({
      status: "OK",
      msg: `Catch ${error}`,
    });
  }
});

registration.post("/login", async (req: Request, res: Response) => {
  const { authorization }: any = req.headers;
  const { username, password }: any = req.body;
  console.log(authorization);
  try {
    const data = await auth.findOne({
      username: username,
      password: password,
    });

    console.log(data);
    // let privateKey = "shhhh";
    if (!data) {
      res.status(404).send({
        status: "Error",
        msg: "ไม่พบข้อมูล",
      });
    } else {
      let token = jwt.sign({ data }, "shhhh", { expiresIn: "1m" });

      await history.create({
        username: username,
        password: password,
        tokens: token,
      });

      res.status(200).send({
        status: 200,
        msg: "success",
        data: token,
      });
    }
  } catch (error) {
    res.status(500).send({
      status: "Error",
      msg: `Catch ${error}`,
    });
  }
});

registration.post("/historicalSignin", async (req: Request, res: Response) => {
  const { authorization }: any = req.headers;
  // console.log(authorization);
  try {
    const data: any = await history.findOne({
      tokens: authorization.split(" ")[1] || "",
    });
    console.log(data);
    // let privateKey = "shhhh";
    // let token = jwt.sign({ data }, "shhhh", { expiresIn: "1m" });

    jwt.verify(
      // authorization.split(" ")[1] || "",
      data?.tokens,
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
            data: {
              record: data?._id,
            },
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
