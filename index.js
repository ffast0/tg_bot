import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const token = process.env.TOKEN_API;
const bot = new TelegramBot(token); // без polling

const app = express();
app.use(express.json());

// Главная страница
app.get("/", (req, res) => {
  res.send("Telegram bot is running on Vercel!");
});

// Webhook endpoint (фиксируем путь без токена)
app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Список картинок
const words = [
  { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%202-BCixSLsK.png", chance: 10 },
  { url: "https://photos-steel-omega.vercel.app/assets/image-BK7aG1-y.png", chance: 20 },
  { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%204-CV5Vs6_u.png", chance: 90 },
  { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%203-CTfVQxNu.png", chance: 15 },
  { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%205-DYMQ4HZm.png", chance: 20 },
  { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%206-BHxFkIpn.png", chance: 30 },
  { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%207-x69Y6r_W.png", chance: 1 },
];

function getRandomWord() {
  const total = words.reduce((sum, w) => sum + w.chance, 0);
  let rand = Math.random() * total;
  for (let w of words) {
    if (rand < w.chance) return w;
    rand -= w.chance;
  }
}

bot.setMyCommands([
  { command: "/start", description: "Qayta ishga tushirish 🔄" },
  { command: "/img", description: "Rasimlar" },
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Salom! /img deb yozing omadingizni sinash uchun. Agar 1% rasm chiqsa, screenshot qilib bot egasiga yuboring."
  );
});

bot.onText(/\/img/, (msg) => {
  const word = getRandomWord();
  bot.sendPhoto(msg.chat.id, word.url, {
    caption: `Bu rasmning chiqish shansi: ${word.chance}% 🎇`,
  });
});

export default app;