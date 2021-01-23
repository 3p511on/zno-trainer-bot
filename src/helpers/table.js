'use strict';

const Extra = require('telegraf/extra');
const Markup = require('telegraf/markup');
const { alphabet } = require('./index');

class Table {
  constructor(options = {}) {
    this.rows = options.keyboardBtns || [];

    // Создание пустой таблицы
    if (!options.keyboardBtns) {
      // Добавляем буквы сверху
      this.addRow(...alphabet.slice(0, options.columns));

      // Создаем поле для указанного количества столбиков
      for (let i = 0; i < options.rows; i++) {
        this.addRow(...new Array(options.columns).fill(this.NULL_CELL));
      }
    }
  }

  get SELECTED_CELL() {
    return '🔹';
  }

  get WRONG_CELL() {
    return '❌';
  }

  get TIP_CELL() {
    return '✅';
  }

  get NULL_CELL() {
    return ' ';
  }

  addRow(...rowData) {
    const formattedData = [];
    const rowsLength = this.rows.length;
    formattedData.push(Markup.callbackButton(!rowsLength ? ' ' : rowsLength, 'blank'));
    rowData.forEach((btnName, i) => {
      formattedData.push(Markup.callbackButton(btnName, !rowsLength ? 'blank' : this.cbName(i + 1, rowsLength)));
    });
    this.rows.push([...formattedData.flat()]);
    return this;
  }

  countPoints(rightAnswers) {
    // Приводим таблицу к виду ответов в базе данных
    const choosenAnswers = this._rowsToDB();

    // Необходимо отметить все строки
    if (choosenAnswers.length < this.rows.length - 1) {
      throw new Error('errors.selectAllRows');
    }

    // Сверяем ответы и считаем баллы
    let points = 0;
    choosenAnswers.forEach((answer, i) => {
      if (answer[0] === rightAnswers[i][0] && answer[1] === rightAnswers[i][1]) {
        points += 1;
      }
    });

    return points;
  }

  _rowsToDB() {
    const choosenAnswers = [];
    this.rows.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell.text === this.SELECTED_CELL) {
          choosenAnswers.push([y, x]);
        }
      });
    });
    return choosenAnswers;
  }

  writeAnswers(rightAnswers) {
    // Приводим таблицу к виду ответов в базе данных
    const choosenAnswers = this._rowsToDB();

    // Убираем для каждого элемента колбек информацию
    this.rows.forEach(a => a.forEach(b => (b.callback_data = 'blank')));

    choosenAnswers.forEach((answer, i) => {
      const cell = this.rows[answer[0]][answer[1]];
      if (answer[0] === rightAnswers[i][0] && answer[1] === rightAnswers[i][1]) {
        cell.text = this.SELECTED_CELL;
      } else if (cell.text === this.SELECTED_CELL) {
        cell.text = this.WRONG_CELL;
        // eslint-disable-next-line capitalized-comments
        this.rows[answer[0]][rightAnswers[i][1]].text = this.TIP_CELL;
      }
    });
    return this;
  }

  cbName(x, y) {
    return `table::${x}::${y}`;
  }

  select(x, y) {
    const selectedCell = this.rows[x].find(btn => btn.text.includes(this.SELECTED_CELL));
    if (selectedCell) selectedCell.text = this.NULL_CELL;
    this.rows[x][y].text = this.SELECTED_CELL;
    return this;
  }

  getColumn(i) {
    const columnItems = [];
    this.rows.forEach(row => {
      if (row[i]) columnItems.push(row[i]);
    });
    return columnItems;
  }

  toKeyboard() {
    return Extra.markdown().markup(Markup.inlineKeyboard(this.rows));
  }
}

module.exports = Table;
