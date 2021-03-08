'use strict';

const { send, handleRateLimit } = require('../../helpers');
const Handler = require('../../structures/pieces/Handler');

const caption =
  'До ЗНО залишилось менше 3-х місяців😮\n' +
  'Не панікуй, а краще лови останній шанс повноцінно ' +
  'підготуватись до тестів та навести порядок в своїх знаннях!\n' +
  '<b>Спеціально для тебе команда викладачів навчального центру "Cactus"' +
  'розробила експрес-курс підготовки до ЗНО 2021 з усіх основних предметів.</b>\n' +
  '👨🏻‍🏫Формат навчання: Онлайн або оффлайн (Київ).\n' +
  '👥Міні-групи (3-7 учнів).\n' +
  '🏅Викладачі-практики із власним балом ЗНО 195+.\n' +
  '💻Закритий чат в телеграмі.\n' +
  '👩🏼‍💻Онлайн-підтримка викладачів 24/7.\n' +
  '🎯Жодної "води", лише підготовка націлена на результат.\n' +
  '⏱4.5 повноцінних навчальних годин на тиждень.\n' +
  '💵Адекватна вартість.\n' +
  'Сумніваєшся в ефективновсті наших курсів?\n' +
  '<b>Спробуй безкоштовне заняття, яке переверне твою уяву про підготовку до ЗНО.</b>\n' +
  'Для запису на безкоштовне заняття та додаткові консультації телефонуй: 067 68 55 732\n' +
  '(telegram, viber) або залишай заявку на одному з наших сайтів:\n' +
  '- cactuszno.com.ua/intensivecourse - оффлайн курси в Києві;\n' +
  '- cactuszno.com.ua/onlinecourse - онлайн-курси.';

const sendMessage = (ctx, id) =>
  ctx.telegram
    .sendPhoto(id, 'https://i.imgur.com/oiH1HND.jpeg', {
      caption,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [[{ text: 'Перейти до каналу CactusZNO', url: 'https://t.me/cactus_zno' }]],
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
      await sendMessage(ctx, user.id);
      console.log('Отправлено сообщение', user.id);
      success += 1;
    }
    send(ctx, `Отправлено успешно ${success} сообщений`);
  }
};
