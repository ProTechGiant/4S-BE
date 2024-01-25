import ejs from "ejs";
import { User } from "../../user/entity/user.entity";
import axios from "axios";
import FormData from "form-data";

const apiValue = `Basic ${process.env.MAIL_GUN_KEY}`;

export const sendMailToUser = async (user: User, resetLink: string) => {
  try {
    const emailContent = await ejs.renderFile(__dirname + "/../../../assets/send-mail.ejs", {
      userName: user.firstName,
      resetLink,
    });

    const data = {
      from: process.env.MAIL__GUN_FROM,
      to: user.email,
      subject: "Forget Password",
      text: resetLink,
      html: emailContent,
    };
    const formData = new FormData();

    Object.keys(data).forEach((key) => {
      formData.append(key, data[key]);
    });

    await axios.post(process.env.MAIL_GUN_URL, formData, {
      headers: {
        Authorization: `Authorization:${apiValue}`.toString(),
        "Content-Type": `multipart/form-data`,
      },
    });
  } catch (error) {
    console.error("Error sending email:", error.response ? error.response.data : error.message);
  }
};

export const sendMailToVerifyUser = async (user: User, verifyLink: string) => {
  const emailContent = await ejs.renderFile(__dirname + "/../../../assets/sennd-verification.ejs", { userName: "ebryx", verifyLink });

  const message = {
    to: user.email,
    from: process.env.MAIL__GUN_FROM,
    subject: "Verify Email",
    text: verifyLink,
    html: emailContent,
  };
  const formData = new FormData();

  Object.keys(message).forEach((key) => {
    formData.append(key, message[key]);
  });
  await axios.post(process.env.MAIL_GUN_URL, formData, {
    headers: {
      Authorization: `Authorization:${apiValue}`.toString(),
      "Content-Type": `multipart/form-data`,
    },
  });
};
