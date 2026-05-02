const { getTodayNotes } = require('../trilium');

module.exports = async function todayCommand(ctx) {
  try {
    const notes = await getTodayNotes();
    if (notes.length === 0) {
      return ctx.reply('📭 Сегодня заметок нет.');
    }
    const list = notes
      .slice(0, 10)
      .map((n, i) => `${i + 1}. ${n.title}`)
      .join('\n');
    ctx.reply(`📅 Заметки за сегодня (${notes.length}):\n\n${list}`);
  } catch (e) {
    ctx.reply('❌ Не удалось получить заметки. Проверьте подключение к Trilium.');
    console.error(e);
  }
};
