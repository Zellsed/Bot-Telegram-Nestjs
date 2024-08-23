import { Markup } from 'telegraf';

export function actionButtons() {
  return Markup.inlineKeyboard(
    [
      Markup.button.callback('➕ Create task', 'create'),
      Markup.button.callback('📖 Function list', 'list'),
      Markup.button.callback('✔️ Complete', 'done'),
      Markup.button.callback('✏ Edit again', 'edit'),
      Markup.button.callback('❌ Want to delete', 'delete'),
    ],
    {
      columns: 2,
    },
  );
}
