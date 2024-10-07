import { Router } from "express";
import validator from "validator";
import bcrypt from "bcrypt";
import { users } from "../data/users.js";
import fs from "fs";
import path from "path";
const userRoutes = Router();
const __dirname = import.meta.dirname;

const usersFilePath = path.join(__dirname, '../data/users.js');

userRoutes
    .route('/signup')
    .get((req, res) => {
        res.render("form_signup");
    })
    .post((req, res) => {
        //TODO: перевірка існування body
        //валідація даних
        // console.log(req.body);np
        // console.log(validator.isEmail(req.body.email));
        // console.log(bcrypt.hashSync(req.body.password, 10));
        //bcrypt.compareSync()
        const hasTwoLetters = /[A-Za-zА-Яа-я]{2,}/.test(req.body.login);
        if (validator.isEmail(req.body.email) && hasTwoLetters &&
             req.body.password != "" && req.body.password == req.body.confirm_password) {
            res.cookie("user", req.body.login, {
                httpOnly: true,
                maxAge: 1000 * 60 * 60,
            });
            const hashedPassword = bcrypt.hashSync(req.body.password, 10);
            const newUser = {
                login: req.body.login,
                email: req.body.email,
                password: hashedPassword
            };
            users.push(newUser);
            const fileContent = `export const users = ${JSON.stringify(users, null, 4)};\n\n`;
            fs.writeFile(usersFilePath, fileContent, (err) => {
                res.cookie("user", req.body.login, {
                    httpOnly: true,
                    maxAge: 1000 * 60 * 60,
                });
            });
            // --  тут должен быть добавление user
        }
        res.redirect("/");
    });

    userRoutes
    .route('/logout')
    .get((req, res) => {
        res.clearCookie("user", {
            httpOnly: true,
            maxAge: 0,
        });
        res.redirect('/');
    });


export default userRoutes;