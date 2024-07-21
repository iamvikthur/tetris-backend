import createDebug from 'debug';
import TelegramBot from 'node-telegram-bot-api';

const debug = createDebug('bot:dev');

const development = async (bot: TelegramBot) => {
  const botInfo = (await bot.getMe()).username;

  debug('Bot runs in development mode');
  debug(`${botInfo} deleting webhook`);
  await bot.deleteWebHook();
  debug(`${botInfo} starting polling`);

  await bot.startPolling();

  process.once('SIGINT', async () => await bot.stopPolling());
  process.once('SIGTERM', async () => await bot.stopPolling());
};

export { development };
