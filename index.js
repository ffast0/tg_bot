import express from "express";
import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";

dotenv.config();

const token = process.env.TOKEN_API;
const bot = new TelegramBot(token); 

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Telegram bot is running on Vercel!");
});

app.post("/webhook", (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

const words = [
    { url: "http://localhost:5173/public/image%20copy%2013.png", chance: 99 },
    { url: "http://localhost:5173/public/image%20copy%2013.png", chance: 99 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%204-CV5Vs6_u.png", chance: 90 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%202-BCixSLsK.png", chance: 50 },
    { url: "http://localhost:5173/public/image%20copy%2011.png", chance: 40 },
    { url: "http://localhost:5173/public/image%20copy%2010.png", chance: 20 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%205-DYMQ4HZm.png", chance: 20 },
    { url: "http://localhost:5173/public/image%20copy%2015.png", chance: 14 },
    { url: "http://localhost:5173/public/image%20copy%2014.png", chance: 13 },
    { url: "http://localhost:5173/public/image%20copy%2016.png", chance: 10 },
    { url: "http://localhost:5173/public/image%20copy%2012.png", chance: 5 },
    { url: "http://localhost:5173/public/image%20copy%209.png", chance: 1 },
    { url: "http://localhost:5173/public/image%20copy%208.png", chance: 0.1 },
];

function getRandomWord() {
  const total = words.reduce((sum, w) => sum + w.chance, 0);
  let rand = Math.random() * total;
  for (let w of words) {
    if (rand < w.chance) return w;
    rand -= w.chance;
  }
}


const cooldowns = {};
const COOLDOWN_TIME = 1 * 1000; 

bot.setMyCommands([
  { command: "/start", description: "Qayta ishga tushirish 🔄" },
  { command: "/img", description: "Rasimlar" },
]);

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Salom! /img deb yozing omadingizni sinash uchun. Agar 0.1% rasm chiqsa, screenshot qilib bot egasiga yuboring."
  );
});

bot.onText(/\/img/, (msg) => {
  const chatId = msg.chat.id;
  const now = Date.now();

  if (cooldowns[chatId] && now - cooldowns[chatId] < COOLDOWN_TIME) {
    const remaining = Math.ceil((COOLDOWN_TIME - (now - cooldowns[chatId])) / 1000);
    bot.sendMessage(chatId, `⏳ kutib turing ${remaining} sekund, keyingi xabar jonatishdan oldin`);
    return;
  }

  cooldowns[chatId] = now;

  const word = getRandomWord();
  bot.sendPhoto(chatId, word.url, {
    caption: `||Bu rasmning chiqish shansi: ${word.chance}% 🎇||`,
  });
});

export default app;