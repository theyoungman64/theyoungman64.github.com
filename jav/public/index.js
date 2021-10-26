let data
document.addEventListener('DOMContentLoaded', init, false);
window.addEventListener('scroll', () => {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;

  if (clientHeight + scrollTop >= scrollHeight - 5) {
    addItems();
  }
});

async function init() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  data = await fetchingData();
  addItems();
}

async function fetchingData() {
  try {
    let mgtResponse = await (await fetch('https://my.galanov.tech/jav')).json();
    return mgtResponse;
  } catch (error) {
    return await (await fetch('/jav/public/javs.json')).json()
  }
}

function addItems() {
  let container = document.querySelector('.row');
  if (data.length > 0) {
    let items = getItems({ hash: window.location.hash });
    if (items) {
      items.forEach(item => {
        container.innerHTML += renderCards(item);
      });
    }
  }
}

function getItems({ hash }) {
  if (hash === '#recent') return getRecentItems();
  // if (hash === '#actress') return getActress();
  if (/#\?actress=\w+/.test(hash)) return getItemsByActress({ actress: hash.split('=')[1] });
  return getRandomItems();
}

function getActress() {
  return ['satu', 'dua'];
}

function getRecentItems() {
  let getedItem = data.slice(0, 5);
  data.splice(0, 5);
  return getedItem;
}

function getItemsByActress({ actress }) {
  let actressClean = decodeURIComponent(actress).toLowerCase();
  let dataByActress = data.filter(item => item.actress.join().toLowerCase().includes(actressClean));
  if (dataByActress.length == document.querySelectorAll('#video-list .card.medium').length) return false;
  return dataByActress;
}

function getRandomItems() {
  let indexof5 = get5RandomNumber();
  let getedItems = data.filter((item, i) => indexof5.includes(i));
  data = data.filter((item, i) => !indexof5.includes(i));
  return getedItems;
}

function searchByActress(keyword) {
  return data.filter(item => {
    return item.actress.join().toLowerCase().includes(keyword)
  })
}

function addItems() {
  let container = document.querySelector('.row');
  if (data.length > 0) {
    let items = window.location.hash == '#recent' ? getItems() : getRandomItems();
    items.forEach(item => {
      container.innerHTML += renderCards(item);
    });
  }
}

function get5RandomNumber() {
  let number = [];
  while (number.length < 5) {
    let ranNumber = Math.floor(Math.random() * data.length);
    if (!number.includes(ranNumber)) {
      number.push(ranNumber);
    }
  }
  return number;
}

function renderAddItemsButton() {
  return `<div class="row">
    <a class="waves-effect waves-light btn" onclick="addItems()">Load More</a>
  </div>`
}

function renderCards({ imgUrl, title, fakyutubUrl }) {
  return `<div class="col s12 l4">
  <div class="card medium">
    <div class="card-image">
      <img class="activator" loading='lazy' src="${imgUrl}.jpg">
    </div>
    <div class="card-content">
      <p>${title}</p>
    </div>
    <div class="card-action">
      <a href="${fakyutubUrl}">FK</a>
      <a href="/video/redirector?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length - 1]}&resolution=480p">480</a>
      <a href="/video/redirector?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length - 1]}&resolution=720p">720</a>
      <a href="/video/redirector?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length - 1]}&resolution=1080p">1080</a>
    </div>
  </div>`;
}