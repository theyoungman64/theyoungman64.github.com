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

/**
 * @description append card item every time page scrolled/ load item clicked
 */
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

/**
 * 
 * @param {*} param0 
 * @returns pop item data
 */
function getItems({ hash }) {
  if (hash === '#recent') return getRecentItems();
  if (/#\?actress=\w+/.test(hash)) return getItemsByActress({ actress: hash.split('=')[1] });
  if (/#\?search=\w+/.test(hash)) return searchItem({ keyword: hash.split('=')[1] });
  return getRandomItems();
}

function searchItem({ keyword }) {
  return data.filter(item => item.title.toLowerCase().includes(decodeURIComponent(keyword).toLowerCase()))
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

function searchByActress(keyword) {
  return data.filter(item => {
    return item.actress.join().toLowerCase().includes(keyword)
  })
}

function renderAddItemsButton() {
  return `<div class="row">
    <a class="waves-effect waves-light btn" onclick="addItems()">Load More</a>
  </div>`
}

function renderCards({ imgUrl, title, fakyutubUrl, actress }) {
  return `<div class="col s12 l4">
  <div class="card medium">
    <div class="card-image">
      <img class="activator" loading='lazy' src="${imgUrl}">
    </div>
    <div class="card-content">
      <p>${title}</p>
    </div>
    ${fakyutubUrl ?
      `<div class="card-action">
      <a href="${fakyutubUrl}">FK</a>
      <a href="https://my-javtiful-favorite.herokuapp.com/video/stream?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length - 1]}&resolution=480p">480</a>
      <a href="https://my-javtiful-favorite.herokuapp.com/video/stream?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length - 1]}&resolution=720p">720</a>
      <a href="https://my-javtiful-favorite.herokuapp.com/video/stream?id=${fakyutubUrl.split('/')[fakyutubUrl.split('/').length - 1]}&resolution=1080p">1080</a>
  </div>` :
      '<div class="card-action"></div>'}
    <div class="card-reveal">
      <span class="card-title grey-text text-darken-4"><i class="material-icons right">close</i></span>
      <p>Title : ${title} </p>
      <p>Actress : </p>
      <ul>
        ${actress.map(actres => `<li><a href="/jav/?actress=${actress}">${actress}</a></li>`)}
      </ul>
    </div>
  </div>`;
}