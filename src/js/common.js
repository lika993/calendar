import '../index.scss';
import IMask from 'imask';


import {Calendar} from './Calendar.js';

let eventsArr = [];

let documentLoad = () => {
  window.onload = function() {
    fetch("http://localhost:3000/list")
      .then((response) => response.json())
      .then((events) => {
        eventsArr = events;

        let calendar = new Calendar("divCal", sort(events), renderCard);

        calendar.showCurrentDateBlock();

        getElById('btnNext').onclick = function() {
          calendar.nextMonth();
        };
        getElById('btnPrev').onclick = function() {
          calendar.previousMonth();
        };

        clickBodyHandler(events);

        document.getElementById('btnNext').onclick = function() {
          calendar.nextMonth();
        };

        renderEvents(events);
      });
  }

  maskFields();
}

let sort = (events) => {
  return events.sort((a, b) => {
    let dateA = new Date(a.date);
    let dateB = new Date(b.date)
    return dateA - dateB;
  }).reverse()
}

let renderCard = (eventObj) => {
  return `<div class="popup-card event-card">` +
    `<button class="close-popup"></button>` +
    `<span class="event-card-date">Время: ${getDateToLocalFormat(eventObj.date)}, ${renderAddressHtml(eventObj.address)}</span>` +
    `<h4 class="event-card-name">${eventObj.title}</h4>` +
    `<div class="event-card-description">${eventObj.text}` +
    `<div class="secondary-info organization">Организатор: ${eventObj.organizator}</div>` +
    `<button class="subscribe-btn btn-blue" data-id="${eventObj.id}">Записаться</button>` +
    `</div>` +
    `</div>`
}

let renderEvents = (events) => {
  let html = '';

  events.forEach((eventObj) => {
    html += renderCard(eventObj);
  });

  document.querySelector('.events-list').innerHTML = html;
}

let maskFields = () => {
  let element = document.getElementById('phone');
  let maskOptions = {
    mask: '+{7}(000)000-00-00'
  };
  IMask(element, maskOptions);
}

let getDateToLocalFormat = (date) => {
  let dateValue = new Date(date);

  let options = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
  };

  return dateValue.toLocaleString("ru", options);
}

let renderAddressHtml = (address) => {
  return address ? `<br>Адрес: ${address}\n` : '';
}

let clickBodyHandler = (events) => {
  document.body.onclick = (e) => {
    const target = e.target;

    if (target.classList.contains('subscribe-btn')) {
      const btnWrapIsPopup = target.closest('.popup');

      if (btnWrapIsPopup) {
        btnWrapIsPopup.classList.remove('opened');
      }

      const eventId = target.dataset.id;
      const popup = document.querySelector('.popup-form-wrapper');
      const eventObj = findEvent(events, eventId);

      document.getElementById('event-name').innerHTML = `"${eventObj.title}"`;
      popup.classList.add('opened');
    }

    clickFilterListItem(target);
    clickEventPanel(target);
    clickPopupCloseBtn(target);
    clickDropdownOutside(target);
  };
}

let findEvent = (events, id) => {
  return events.find((eventObj) => eventObj.id == id);
}

let clickFilterListItem = (target) => {
  if (target.classList.contains('filter-list__label')) {
    target.closest('.filter-list').classList.toggle('opened');
  }

  if (target.classList.contains('filter-list__item')) {
    closeDropdown();
  }

  if (target.classList.contains('filter-list__item--down')) {
    replaceSelectText(target);
    renderEvents(sort(eventsArr));
  }

  if (target.classList.contains('filter-list__item--up')) {
    replaceSelectText(target);
    renderEvents(sortDesc(eventsArr));
  }
}


let replaceSelectText = (target) => {
  document.querySelector('.filter-list__label').innerText = target.innerText;
}

let clickEventPanel = (target) => {
  if (target.classList.contains('event-title')) {
    let id = target.getAttribute('id');
    let popup = getElById(`popup-${id}`);
    popup.classList.add("opened");
  }
}

let clickPopupCloseBtn = (target) => {
  const openedPopup = target.closest('.popup');

  if (openedPopup && target.classList.contains('close-popup')) {
    openedPopup.classList.remove('opened');
  }
}

let clickDropdownOutside = (target) => {
  const openedPopup = document.querySelector('.filter-list.opened');

  if (openedPopup && !target.closest('.filter-list__items-wrap') &&
    !target.classList.contains('filter-list__items-wrap') &&
    !target.classList.contains('filter-list__label')) {
    closeDropdown();
  }
}

let closeDropdown = () => {
  const openedPopup = document.querySelector('.filter-list.opened');
  openedPopup.classList.remove('opened');
}

let sortDesc = (events) => {
  return events.sort((a, b) => {
    let dateA = new Date(a.date);
    let dateB = new Date(b.date)
    return dateA - dateB;
  })
}

let getElById = (id) => {
  return document.getElementById(id);
}

documentLoad();
