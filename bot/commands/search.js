const { searchNotes } = require('../trilium');

module.exports = async function searchCommand(ctx) {
  const query = ctx.message.text.replace(/^\/search\s*/i, '').trim();
  if (!query) {
    return ctx.reply('Использование: /search запрос');
  }
  try {
    const notes = await searchNotes(query);
    if (notes.length === 0) {
      return ctx.reply(`📭 Ничего не найдено по запросу «${query}»`);
    }
    const list = notes
      .slice(0, 10)
      .map((n, i) => `${i + 1}. ${n.title}`)
      .join('\n');
    ctx.reply(`🔍 Найдено ${notes.length} заметок:\n\n${list}`);
  } catch (e) {
    ctx.reply('❌ Ошибка поиска. Проверьте подключение к Trilium.');
    console.error(e);
  }
};
