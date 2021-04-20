import {/* inject, */ BindingScope, injectable} from '@loopback/core';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
dotenv.config();

@injectable({scope: BindingScope.TRANSIENT})
export class EmailService {
  constructor(/* Add @inject to inject parameters */) {}

  send = async (guests: string, title: string, body: string) => {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_PSW,
      },
    });

    const mailOptions = {
      from: process.env.USER_EMAIL,
      to: guests[0],
      subject: title,
      text: body,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          console.log(error);
          return reject(error);
        }
        resolve(info);
      });
    });
  };
}
