import browser from 'webextension-polyfill';

//import store
import store from './store';
import { wrapStore } from 'webext-redux';

wrapStore(store);

browser.runtime.onMessage.addListener((message, sender) => {
  if (message.fullScreenTabOpen) {
    browser.tabs.create({ url: 'home.html' });
  }
});
