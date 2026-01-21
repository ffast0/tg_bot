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
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2013-BbRLilJx.png", chance: 99 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2013-BbRLilJx.png", chance: 99 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2013-BbRLilJx.png", chance: 99 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2013-BbRLilJx.png", chance: 99 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%204-CV5Vs6_u.png", chance: 90 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%202-BCixSLsK.png", chance: 50 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2011-CiIeG8JM.png", chance: 40 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2010-Datq5xB_.png", chance: 20 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%205-DYMQ4HZm.png", chance: 20 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2015-B2Q0LfCJ.png", chance: 14 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2014-BY3npXfZ.png", chance: 13 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2016-DO5A4Ysf.png", chance: 10 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%2012-Dcig0oQN.png", chance: 5 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%208-kXq7AYjJ.png", chance: 1 },
    { url: "https://photos-steel-omega.vercel.app/assets/image%20copy%209-DgctOdra.png", chance: 0.8 },
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
    "Salom! /img deb yozing omadingizni sinash uchun. Agar 0.8% rasm chiqsa, screenshot qilib bot egasiga yuboring."
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
    caption: `Bu rasmning chiqish shansi: ${word.chance}% 🎇`,
  });
});
// Секретная команда — не добавляем в setMyCommands
bot.onText(/\/secret (.+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const arg = match[1]; // то, что написал пользователь после /secret
  const chanceValue = parseFloat(arg); // преобразуем в число

  const ownerId = 6332173072; // твой Telegram ID

  if (chatId !== ownerId) {
    bot.sendMessage(chatId, "❌ Эта команда недоступна.");
    return;
  }

  // Найдём все картинки с таким шансом
  const filtered = words.filter(w => w.chance === chanceValue);

  if (filtered.length > 0) {
    const word = filtered[0]; // берём первую подходящую
    bot.sendPhoto(chatId, word.url, {
      caption: `🔒 Секретная картинка (шанс ${word.chance}%)`,
    });
  } else {
    bot.sendMessage(chatId, "❌ Картинка с таким шансом не найдена.");
  }
});

export default app;