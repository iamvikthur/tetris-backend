import { VercelRequest, VercelResponse } from '@vercel/node';
import createDebug from 'debug';
import TelegramBot from 'node-telegram-bot-api';

const debug = createDebug('bot:dev');

const PORT = (process.env.PORT && parseInt(process.env.PORT, 10)) || 3000;
const VERCEL_URL = `${process.env.VERCEL_URL}`;

const production = async (
  req: VercelRequest,
  res: VercelResponse,
  bot: TelegramBot,
) => {
  debug('Bot runs in production mode');
  debug(`setting webhook: ${VERCEL_URL}`);

  console.log('INSIDE PRODUCTION');

  if (!VERCEL_URL) {
    throw new Error('VERCEL_URL is not set.');
  }

  const getWebhookInfo = await bot.getWebHookInfo();
  if (getWebhookInfo.url !== VERCEL_URL + '/api') {
    debug(`deleting webhook ${VERCEL_URL}`);
    await bot.deleteWebHook();
    debug(`setting webhook: ${VERCEL_URL}/api`);
    await bot.setWebHook(`${VERCEL_URL}/api`);
  }

  if (req.method === 'POST') {
    console.log('RECEIVED POST REQUEST');
    await bot.processUpdate(req.body);
  } else {
    res.status(200).json('Listening to bot events...');
  }
  debug(`starting webhook on port: ${PORT}`);
};
export { production };
