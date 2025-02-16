
import express, { Request, Response } from "express";
import { user } from "../../mongDB/schema";

export const tempAccount = express();

tempAccount.post("/create", async (req: Request, res: Response) => {

    console.log('asdfsdf')

    const { firstName, lastName, birthDate, idCard, email } = req.body;
    try {
        const addUsers = await user.create({
            "firstName": firstName,
            "lastName": lastName,
            "birthDate": birthDate,
            "idCard": idCard,
            "email": email
        })

        res.status(200).send({
            status: 200,
            msg: "success",
            data: {
                username: "",
                password: "",
                exp: ""
            }
        })
    } catch (error) {
        res.status(500).send({
            status: "OK",
            msg: `Catch ${error}`,
        });
    }
});