const cron = require('node-cron');

// Хранилище напоминаний в памяти (не персистентное — для продакшена нужна БД)
const reminders = [];

function parseDuration(str) {
  const m = str.match(/^(\d+)(m|h|d)$/i);
  if (!m) return null;
  const val = parseInt(m[1]);
  const unit = m[2].toLowerCase();
  if (unit === 'm') return val * 60 * 1000;
  if (unit === 'h') return val * 60 * 60 * 1000;
  if (unit === 'd') return val * 24 * 60 * 60 * 1000;
  return null;
}

module.exports = async function remindCommand(ctx) {
  // /remind 30m Купить молоко
  const parts = ctx.message.text.replace(/^\/remind\s*/i, '').trim().split(/\s+/);
  if (parts.length < 2) {
    return ctx.reply('Использование: /remind 30m Текст напоминания\nЕдиницы: m (минуты), h (часы), d (дни)');
  }

  const [durationStr, ...textParts] = parts;
  const reminderText = textParts.join(' ');
  const ms = parseDuration(durationStr);

  if (!ms) {
    return ctx.reply('❌ Неверный формат времени. Пример: 30m, 2h, 1d');
  }

  const fireAt = new Date(Date.now() + ms);
  const chatId = ctx.chat.id;

  setTimeout(() => {
    ctx.telegram.sendMessage(chatId, `⏰ Напоминание: ${reminderText}`);
  }, ms);

  const timeStr = fireAt.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const dateStr = fireAt.toLocaleDateString('ru-RU');
  ctx.reply(`✅ Напоминание установлено на ${dateStr} в ${timeStr}\n📝 ${reminderText}`);
};
