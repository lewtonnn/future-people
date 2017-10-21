var parsedData = [];
var smallData = 'http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
var largeData = 'http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D';
var smallDataBtn = document.querySelector('.small-data');
var largeDataBtn = document.querySelector('.large-data');
var searchBtn = document.querySelector('.search-form__submit');
var searchField = document.querySelector('.search-form__field');
var loadingAni = document.querySelector('.loading');
var headers = document.querySelector('.headers');
var user = document.querySelector('.user');
var container = document.querySelector('.container');
var usercard = document.querySelector('.usercard');
var pages = document.querySelector('.pages');
var virtualContainer = document.createDocumentFragment();
var currentList;
var currentPage;
var currentId;
var currentSearch;
var currentFilter;
var currentData;
var fragmentSize = 50;



function xhrRequest(data) {
  var xhr = new XMLHttpRequest();
  xhr.open('GET', data);
  xhr.onload = function (evt) {
    try {
      parsedData = JSON.parse(evt.target.response);
      loadingAni.classList.add('visually-hidden');
      headers.classList.remove('visually-hidden');
      renderTable(parsedData);      
    } catch (err) {
      alert(err);
    }
  };
  xhr.send();
};

/**
 * Searches value in data
 * @param   {array} dataToSearch array to search in
 * @param   {string}   stringToFind value to search
 * @returns {array} 
 */
function searchEngine(dataToSearch, stringToFind) {
  return dataToSearch.filter(function (item) {
    return JSON.stringify(item).toUpperCase().indexOf(stringToFind.toUpperCase()) != -1;
  });
}

/**
 * Sorting function
 * @param   {object} data   object to sort
 * @param   {string} sortId sorting property
 * @returns {object} 
 */
function sortData(data, sortId) {
  var sortedData = data.slice();
  switch (sortId) {
    case 'id':
      sortedData = sortedData.sort(function (a, b) {
        return a.id - b.id;
      });
      break;
    case 'firstName':
      sortedData = sortedData.sort(function (a, b) {
        return (a.firstName < b.firstName) ? -1 : 1;
      });
      break;
    case 'lastName':
      sortedData = sortedData.sort(function (a, b) {
        return (a.lastName < b.lastName) ? -1 : 1;
      });
      break;
    case 'email':
      sortedData = sortedData.sort(function (a, b) {
        return (a.email < b.email) ? -1 : 1;
      });
      break;
    case 'phone':
      sortedData = sortedData.sort(function (a, b) {
        return (a.phone < b.phone) ? -1 : 1;
      });
      break;
  };
  return sortedData;
};


/**
 * Creates node for one item and adds it to virtualContainer
 * @param {number} key key of item in Obj{parsedData}
 */
function renderItem(key, data) {
  var elem = user.content.children[0].cloneNode(true);
  elem.querySelector('.id').textContent = data[key].id;
  elem.querySelector('.firstname').textContent = data[key].firstName;
  elem.querySelector('.lastname').textContent = data[key].lastName;
  elem.querySelector('.email').textContent = data[key].email;
  elem.querySelector('.phone').textContent = data[key].phone;
  elem.addEventListener('click', function (evt) {
    if (data[key].id !== currentId) {
      showUserCard(key, data);
      evt.preventDefault();
    };
  });
  virtualContainer.appendChild(elem);
};

/**
 * Shows user profile under the list
 * @param {number} key key of item in Obj{parsedData}
 */
function showUserCard(key, data) {

  usercard.querySelector('.usercard__item--name').innerHTML = `Выбран пользователь:&nbsp;<b>${data[key].firstName} ${data[key].lastName}</b>`

  usercard.querySelector('.usercard__item--description').innerHTML = `Описание:</br>&nbsp;${data[key].description}`

  usercard.querySelector('.usercard__item--address').innerHTML =
    `Адрес проживания:&nbsp;<b>${data[key].address.streetAddress}</b>`

  usercard.querySelector('.usercard__item--city').innerHTML =
    `Город:&nbsp;<b>${data[key].address.city}</b>`

  usercard.querySelector('.usercard__item--province').innerHTML =
    `Провинция/штат:&nbsp;<b>${data[key].address.state}</b>`

  usercard.querySelector('.usercard__item--zip').innerHTML =
    `Индекс:&nbsp;<b>${data[key].address.zip}</b>`;

  usercard.style.border = '1px solid #000';

  currentId = data[key].id;
};


/**
 * Creates virtualContainer with n nodes and adds it to container
 * @param {number} startKey    starting key in parsedData
 * @param {number} fragmentSize number of nodes to add
 */
function renderFragment(startKey, fragmentSize, data) {

  if (startKey + fragmentSize <= data.length) {
    for (var i = startKey; i < startKey + fragmentSize; i++) {
      renderItem(i, data);
    };
  } else {
    for (var i = startKey; i < data.length; i++) {
      renderItem(i, data);
    };
  };
  container.appendChild(virtualContainer);
};


/**
 * Creates buttons to switch pages
 */
function createPageButtons(data) {
  if (data.length > fragmentSize) {
    for (let i = 0; i < Math.ceil(data.length / fragmentSize); i++) {
      var pageLink = document.createElement('li');
      pageLink.textContent = i + 1;
      pageLink.addEventListener('click', function (evt) {
        if (currentPage != evt.target) {
          container.innerHTML = '';
          renderFragment(i * fragmentSize, fragmentSize, data);
          if (currentPage) {
            currentPage.classList.remove('clicked-button');
          };
          evt.target.classList.add('clicked-button');
          currentPage = evt.target;
        };
      });
      pages.appendChild(pageLink);
    };
  };
};

function clearTable() {
  container.innerHTML = '';
  pages.innerHTML = '';
  usercard.children.innerHTML = '';
};

/**
 * Resnders table
 * @param {obj} data data to render
 */
function renderTable(data) {
  renderFragment(0, fragmentSize, data);
  createPageButtons(data);
  currentData = data;
}


smallDataBtn.addEventListener('click', function (evt) {
  if (currentList != evt.target) {
    currentSearch = '';
    clearTable();
    loadingAni.classList.remove('visually-hidden');
    xhrRequest(smallData);
    if (currentList) {
      currentList.classList.remove('clicked-button');
    };
    evt.target.classList.add('clicked-button');
    currentList = evt.target;
    evt.preventDefault();
  };
});

largeDataBtn.addEventListener('click', function (evt) {
  if (currentList != evt.target) {
    currentSearch = '';
    clearTable();
    loadingAni.classList.remove('visually-hidden');
    xhrRequest(largeData);
    if (currentList) {
      currentList.classList.remove('clicked-button');
    };
    evt.target.classList.add('clicked-button');
    currentList = evt.target;
    evt.preventDefault();
  };
});

searchBtn.addEventListener('click', function (evt) {
  if (currentSearch != searchField.value) {
    var searchResult = searchEngine(parsedData, searchField.value);
    clearTable();
    renderTable(searchResult);
    currentSearch = searchField.value;
    //    evt.preventDefault();
  }
});

headers.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('headers__item')) {
    var sortedData = sortData(currentData, evt.target.id);
    if (currentFilter && currentFilter != evt.target) {
      currentFilter.style.backgroundImage = '';
    };
    if (!evt.target.classList.contains('reversedSortOrder')) {
      clearTable();
      renderTable(sortedData);
      evt.target.classList.add('reversedSortOrder');
      evt.target.style.backgroundImage = 'url(\'img/uparrow.svg\')';
      currentFilter = evt.target;
    } else {
      sortedData.reverse();
      clearTable();
      renderTable(sortedData);
      evt.target.classList.remove('reversedSortOrder');
      evt.target.style.backgroundImage = 'url(\'img/downarrow.svg\')';
      currentFilter = evt.target;
    }
  }
});
