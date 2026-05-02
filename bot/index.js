require('dotenv').config();
const { Telegraf } = require('telegraf');

const noteCommand   = require('./commands/note');
const remindCommand = require('./commands/remind');
const searchCommand = require('./commands/search');
const todayCommand  = require('./commands/today');

if (!process.env.BOT_TOKEN) {
  console.error('BOT_TOKEN не задан в .env');
  process.exit(1);
}

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.start((ctx) =>
  ctx.reply(
    '👋 Привет! Я бот для заметок.\n\n' +
    'Команды:\n' +
    '/note [текст] — создать заметку\n' +
    '/remind [время] [текст] — напоминание (30m, 2h, 1d)\n' +
    '/search [запрос] — поиск по заметкам\n' +
    '/today — заметки за сегодня'
  )
);

bot.help((ctx) =>
  ctx.reply(
    'Доступные команды:\n' +
    '/note [текст] — создать заметку\n' +
    '/remind [время] [текст] — напоминание\n' +
    '/search [запрос] — поиск\n' +
    '/today — заметки за сегодня'
  )
);

bot.command('note',   noteCommand);
bot.command('remind', remindCommand);
bot.command('search', searchCommand);
bot.command('today',  todayCommand);

bot.on('text', (ctx) => {
  if (!ctx.message.text.startsWith('/')) {
    ctx.reply('Используй /note чтобы сохранить заметку, или /help для справки.');
  }
});

bot.launch();
console.log('🤖 Бот запущен (polling)...');

process.once('SIGINT',  () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
