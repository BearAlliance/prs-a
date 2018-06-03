const options = [
  'key',
  'host',
  'logLevel'
];

function saveOptions(e) {
  let lsObj = {};
  options.forEach((option) => {
    lsObj[option] = document.querySelector(`#${option}`).value;
  });
  browser.storage.local.set(lsObj);

  e.preventDefault();
}

function restoreOptions() {
  let gettingItem = browser.storage.local.get(options);
  gettingItem.then((res) => {
    options.forEach((option) => {
      if(res[option]) document.querySelector(`#${option}`).value = res[option];
    });
  });
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);