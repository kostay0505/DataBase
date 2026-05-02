const { createNote } = require('../trilium');

module.exports = async function noteCommand(ctx) {
  const text = ctx.message.text.replace(/^\/note\s*/i, '').trim();
  if (!text) {
    return ctx.reply('Использование: /note Текст заметки');
  }
  try {
    const title = text.length > 50 ? text.slice(0, 50) + '…' : text;
    await createNote(title, text);
    ctx.reply('✅ Заметка сохранена!');
  } catch (e) {
    ctx.reply('❌ Ошибка при сохранении заметки. Проверьте подключение к Trilium.');
    console.error(e);
  }
};
