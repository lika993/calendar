export class Calendar {
  constructor(blockId, events, renderCard) {
    this.id = blockId;
    this.events = events;

    this.daysOfWeek = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
    this.months = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

    let d = new Date();
    this.currentMonth = d.getMonth();
    this.currentYear = d.getFullYear();
    this.currentDay = d.getDate();

    this.renderCard = renderCard;
  }

  nextMonth() {
    if (this.currentMonth == 11) {
      this.currentMonth = 0;
      this.currentYear = this.currentYear + 1;
    } else {
      this.currentMonth = this.currentMonth + 1;
    }
    this.showCurrentDateBlock();
  }

  previousMonth() {
    if (this.currentMonth == 0) {
      this.currentMonth = 11;
      this.currentYear = this.currentYear - 1;
    } else {
      this.currentMonth = this.currentMonth - 1;
    }
    this.showCurrentDateBlock();
  };

  showCurrentDateBlock() {
    this.renderViewByDate(this.currentYear, this.currentMonth);
  };

  getLastDayOfLastMonth(y, m) {
    return m == 0 ? new Date(y - 1, 11, 0).getDate() : new Date(y, m, 0).getDate();
  }

  printMonthAndYear(html, y, m) {
    html += '<thead><tr>';
    html += '<td colspan="7">' + this.months[m] + ' ' + y + '</td>';
    html += '</tr></thead>';

    return html;
  }

  printHeadingDaysOfWeek(html) {
    html += '<tr class="days">';

    for (let i = 0; i < this.daysOfWeek.length; i++) {
      html += '<td>' + this.daysOfWeek[i] + '</td>';
    }

    html += '</tr>';

    return html;
  }

  startNewLine(html) {
    return html + '<tr>';
  }

  htmlByMonday(y, m, day, dayOfWeek, html) {
    let firstDayOfMonth = new Date(y, m, 7).getDay(),
      lastDayOfLastMonth = this.getLastDayOfLastMonth(y, m);


    if (dayOfWeek == 1) {
      this.startNewLine(html);
    } else if (day == 1) {
      html += '<tr>';
      let nextMonthLastDays = lastDayOfLastMonth - firstDayOfMonth + 1;

      for (let j = 0; j < firstDayOfMonth; j++) {
        html += '<td class="not-current">' + nextMonthLastDays + '</td>';
        nextMonthLastDays++;
      }
    }

    return html;
  }

  findEventByDate(y, m, day) {
    return this.events.find((event) => {
      let date = new Date(event.date);
      return date.getFullYear() === y && date.getMonth() === m && date.getDate() === day;
    });
  }

  printEvent(event) {
    let html = '';

    if (event) {
      return html +`<div class="event-title" id="${event.id}">` + event.title + '</div>';
    }
    return html;
  }

  renderPopupHtml(event) {
    return `<div class="popup" id="popup-${event.id}">` +
      this.renderCard(event) +
      `</div>`;
  }

  printDay(y, m, day, html) {
    let date = new Date();
    let year = date.getFullYear();
    let month = date.getMonth();
    let currentEvent = this.findEventByDate(y, m, day);
    let eventHtml = currentEvent ? this.printEvent(currentEvent) : '';
    let popupHtml = currentEvent ? this.renderPopupHtml(currentEvent) : '';

    if (year == this.currentYear && month == this.currentMonth && day == this.currentDay) {
      html += '<td class="today">' + popupHtml + day + eventHtml + '</td>';
    } else {
      html += '<td class="normal">' + popupHtml + day + eventHtml + '</td>';
    }

    return html;
  }

  closeLineOnSunday(dayOfWeek, html) {
    if (dayOfWeek == 0) {
      html += '</tr>';
    }
    return html;
  }

  htmlIfLastDayOfMonthIsNotSunday(y, m, dayOfWeek, day, html) {
    let lastDateOfMonth = new Date(y, m + 1, 0).getDate();

    if (dayOfWeek !== 0 && day == lastDateOfMonth) {
      let nextMonthFirstDays = 1;

      for (dayOfWeek; dayOfWeek < 7; dayOfWeek++) {
        html += '<td class="not-current">' + nextMonthFirstDays + '</td>';
        nextMonthFirstDays++;
      }
    }
    return html;
  }

  renderViewByDate(y, m) {
    let lastDateOfMonth = new Date(y, m + 1, 0).getDate();

    let html = '<table>';
    html += this.printMonthAndYear(html, y, m);
    html = this.printHeadingDaysOfWeek(html);

    for (let day = 1; day <= lastDateOfMonth; day++) {
      let dayOfWeek = new Date(y, m, day).getDay();
      html = this.htmlByMonday(y, m, day, dayOfWeek, html);
      html = this.printDay(y, m, day, html);
      html = this.closeLineOnSunday(dayOfWeek, html);
      html = this.htmlIfLastDayOfMonthIsNotSunday(y, m, dayOfWeek, day, html);
    }

    html += '</table>';

    document.getElementById(this.id).innerHTML = html;
  };
}
