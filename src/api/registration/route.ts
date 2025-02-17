import express, { Request, Response } from "express";
import dayjs from 'dayjs'
 import 'dayjs/locale/zh-cn' // import locale
import { user } from "../../mongDB/userSchema";
import { auth } from "../../mongDB/authSchema"

export const tempAccount = express();

tempAccount.post("/createUser", async (req: Request, res: Response) => {


    const { firstName, lastName, birthDate, idCard, email } = req.body;
    try {
        await user.create({
            "firstName": firstName,
            "lastName": lastName,
            "birthDate": birthDate,
            "idCard": idCard,
            "email": email
        })

        // dayjs.extend(isLeapYear) // use plugin
        // dayjs.locale('zh-cn') // use locale

        let conunt = await user.countDocuments()
        // console.log(conunt)

        const myDate = dayjs();
        // console.log(myDate.format('YYYYMMDD'));

        const password = await user.findOne({
            idCard: idCard
        })

        const time = dayjs()

        let timeAdd = time.add(30, 'minute')
        // console.log(timeAdd)

        await auth.insertOne({
            username: `TA${myDate.format('YYYYMMDD')}${conunt}`,
            password: password?.idCard?.slice(7),
            exp: `${myDate.format(`YYYY-MM-DD`)} ${timeAdd.format(`HH:mm:ss`)}`
        })

        res.status(200).send({
            status: 200,
            msg: "success",
            data: {
                username: `TA${myDate.format('YYYYMMDD')}${conunt}`,
                password: password?.idCard?.slice(7),
                exp: `${myDate.format(`YYYY-MM-DD`)} ${timeAdd.format(`HH:mm:ss`)}`
            }
        })
    } catch (error) {
        res.status(500).send({
            status: "OK",
            msg: `Catch ${error}`,
        });
    }
});