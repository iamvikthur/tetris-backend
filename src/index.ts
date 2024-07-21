import { VercelRequest, VercelResponse } from '@vercel/node';
import { development, production } from './core';
import TelegramBot, { Message } from 'node-telegram-bot-api';
// const TelegramBot = require('node-telegram-bot-api');

const BOT_TOKEN = process.env.BOT_TOKEN || '';
const ENVIRONMENT = process.env.NODE_ENV || '';

const bot: TelegramBot = new TelegramBot(BOT_TOKEN, { polling: false });

const web_app_url = 'https://tetris-alpha-opal.vercel.app/';

bot.onText(/\/start/, async (msg: any) => {
  const chatId = msg.chat.id;
  const imagePath = `${__dirname}/images/img.png`;

  const welcomeMessage = `
        <b>Hey, @${msg.from.username}! Welcome to Tetris Coin!</b>\nTap on the coin and see your balance rise.\n\n<b>Tetris Coin</b> is a Decentralized Exchange on the Solana Blockchain. The biggest part of Tetris Coin Token TAPS distribution will occur among the players here.\n\nGot friends, relatives, co-workers?\nBring them all into the game.\nMore buddies, more coins.`;

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '👋 Start now!', web_app: { url: web_app_url } }],
        [{ text: '💪💋 Join community', url: 'https://example.com' }],
        [{ text: '📄 Help', callback_data: 'help' }],
      ],
    },
  };

  await bot.sendPhoto(chatId, imagePath, {
    caption: welcomeMessage,
    parse_mode: 'HTML',
    ...inlineKeyboard,
  });
  //   await bot.sendMessage(chatId, welcomeMessage, inlineKeyboard);
});

bot.on('callback_query', async (callbackQuery: any) => {
  const message = callbackQuery.message;
  const data = callbackQuery.data;
  const chatId = message.chat.id;
  const imagePath = `${__dirname}/images/help.jpg`;

  const text = `<a href="https://Tetris Coin.ai/">Explore the complete guide</a>\n\n<b>Tap to Earn:</b>\nTetris Coin is an addictive clicker game where you accumulate Shares by tapping the screen.\n\n<b>Leagues:</b>\nClimb the ranks by earning more Shares and outperforming others in the leagues.\n\n<b>Boosts:</b>\nUnlock boosts and complete tasks to maximize your Shares earnings.\n\n<b>Friends:</b>\nInvite others and both of you will receive bonuses. Assist your friends in advancing to higher leagues for bigger Shares rewards.\n\n<b>The Purpose:</b>\nCollect as many Shares as possible and exchange them for TAPS.\n\nType /help to access this guide.`;

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [{ text: '👋 Start now!', web_app: { url: web_app_url } }],
      ],
    },
  };

  if (data === 'help') {
    await bot.sendPhoto(chatId, imagePath, {
      caption: text,
      parse_mode: 'HTML',
      ...inlineKeyboard,
    });
    // await bot.sendMessage(chatId, text, inlineKeyboard);
  }
});

//prod mode (Vercel)
export const startVercel = async (req: VercelRequest, res: VercelResponse) => {
  console.log('INSIDE START VERCEL');
  await production(req, res, bot);
};
//dev mode
ENVIRONMENT !== 'production' && development(bot);
