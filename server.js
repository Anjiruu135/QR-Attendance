import express from "express";
import cors from "cors";
import { router as routes } from "./src/routes/routes.js";
import dotenv from "dotenv";
import nodemailer from "nodemailer";

dotenv.config();

const app = express();
const port = process.env.PORT || 3002;

app.use(express.json());

app.use(
  cors({
    origin: [process.env.CORS_ORIGIN],
    methods: ["POST", "GET", "DELETE"],
    credentials: true,
  })
);

app.post('/send-email', async (req, res) => {
  const { email, subject, message } = req.body;

  let transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      secure: false,
      auth: {
          user: 'techtitaninnovations@outlook.com',
          pass: 'techtitansecurity135',
      },
  });

  let mailOptions = {
      from: 'techtitaninnovations@outlook.com',
      to: email,
      subject: subject,
      text: message,
  };

  try {
      let info = await transporter.sendMail(mailOptions);
      console.log('Message sent: %s', info.messageId);
      res.status(200).send('Email sent');
  } catch (error) {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
  }
});

app.options("*", cors());

app.use((req, res, next) => {
  console.log('Request Headers:', req.headers);
  next();
});

app.use("/", routes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
