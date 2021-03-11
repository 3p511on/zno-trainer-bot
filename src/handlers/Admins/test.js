'use strict';

const { send, handleRateLimit } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

const caption = nick =>
  `<b>👋 Привіт${nick ? `, ${nick}` : ''}! 😉</b>

Дякуємо за користування ботом ☺️
📅 До ЗНО-2021 з математики залишилось: <b>77 днів</b>

💬 Вже через декілька тижнів відбудеться пробне ЗНО
💬 Нервуєш, що залишається менше часу, а ще багато тем треба вивчити та закріпити? 

- Не хвилюйся 😉

✅ Ми розпочинаємо серію Онлайн-Інтенсивів, щоб підсилити тебе 📚📈
Перший Онлайн-Інтенсив відбудеться вже 20-го березня 2021 року:

📕 Тема: <b>«Тригонометрія»</b>

<b>На якій ти дізнаєшся:</b>
🧩 про поняття радіанного вимірювання кутів, та одиничне коло
🧩 про число π, поняття sin, cos, tg та ctg
🧩 що таке тригонометричні функції та як побудувати їх графіки?
🧩 як розв’язувати тригонометричні вирази  та виконувати їхні перетворення?
🧩 як розв’язувати тригонометричні рівняння?
 
⏳ Тривалість сесії: <b>3 год. 45 хв.</b>
 
Саме зараз час підтягнути:
📚 Теорію і 📐 Практику`;

const sendMessage = (ctx, id, nick = '') =>
  ctx.telegram
    .sendPhoto(id, 'https://i.imgur.com/wtmswBc.jpg', {
      caption: caption(nick),
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '📱Реєструйся за посиланням ↩️', url: 'https://secure.wayforpay.com/payment/ZnoMathematicsUA' }],
        ],
      },
    })
    // eslint-disable-next-line no-empty-function
    .catch(err => {
      if (err.code === 429) handleRateLimit(ctx, err);
      console.error('Не получилось отправить сообщение');
    });

module.exports = class extends Handler {
  constructor(...args) {
    super(...args, {
      name: 'test',
      types: ['command', 'action'],
    });
  }

  async run(ctx, userID) {
    if (!userID || ![546886852, 409482221].includes(ctx.from.id)) return;

    let success = 0;
    for await (const user of ctx.users) {
      // eslint-disable-next-line no-empty-function
      const data = (await ctx.telegram.getChat(user.id).catch(() => {})) || {};
      await sendMessage(ctx, user.id, data.first_name);
      console.log('Отправлено сообщение', user.id);
      success += 1;
    }
    send(ctx, `Отправлено успешно ${success} сообщений`);
  }
};
