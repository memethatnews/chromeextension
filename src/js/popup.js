import "../img/icon128.png";
import "../img/icon48.png";

import "../css/normalize.css";
import "../css/reset.local.css";
import "../css/typography.css";
import "../css/popup.css";

import { waitMs } from "./time";
const DATA_URL = "https://memethatnews.com/mtn_data.json";

const debug = require("debug")("mtn:popup");

const createRedditCard = (item) => {
  const bqElem = document.createElement("blockquote");
  bqElem.className = "reddit-card";
  bqElem.innerHTML = `<a href="${item.url}">${item.title}</a> from <a href="${item.sub_url}">${item.sub_name}</a>`;
  return bqElem;
};

const fetchRedditData = async () => {
  debug("fetching cache data");

  const { mtnData } = await new Promise((resolve) => {
    chrome.storage.local.get(["mtnData"], function (result) {
      resolve(result);
    });
  });
  debug("cache data", mtnData);
  if (mtnData && mtnData.items && mtnData.updated) {
    const updatedDate = new Date(mtnData.updated);
    // after 12h the data is considered stale
    const ttl = 12 * 3600 * 1000;
    if (Math.abs(new Date() - updatedDate) < ttl) {
      // simulate "Searching" screen - otherwise users might think
      // the extension is stuck...
      await waitMs(800);
      return { items: mtnData.items };
    } else {
      debug("cache data is stale, fetching fresh data");
    }
  }

  debug("downloading latest mtn news data");
  try {
    const resp = await window.fetch(DATA_URL);
    const jsonData = await resp.json();

    debug("got data setting cache", jsonData);
    await new Promise((resolve) => {
      chrome.storage.local.set(
        { mtnData: { items: jsonData, updated: new Date().toISOString() } },
        () => {
          resolve();
        }
      );
    });

    return { items: jsonData };
  } catch (err) {
    debug(`error while fetching data: ${err}`);
    return { items: [] };
  }
};

const updateDom = (matches) => {
  debug("got matches", matches);
  const wrapper = document.getElementById("matches");
  for (const match of matches) {
    const card = createRedditCard(match);
    wrapper.appendChild(card);
  }
};

const showLatestPosts = (items) => {
  debug("showLatestPosts", items);
  const wrapper = document.getElementById("latest-posts");
  items.map((item) => {
    wrapper.appendChild(createRedditCard(item));
  });
  wrapper.classList.remove("invisible");
};

const updateDomShowNoMatches = (items) => {
  debug("updateDomShowNoMatches", items);
  const nomatchesElm = document.getElementById("no-matches");
  nomatchesElm.classList.remove("invisible");

  showLatestPosts(items.slice(0, 5));
};

const matchData = (list, url, title) => {
  const urlMatches = list.items.filter(
    (item) => item && item.article_url && item.article_url === url
  );
  if (urlMatches.length > 0) {
    return urlMatches;
  }

  const titleMatches = list.items.filter(
    (item) =>
      item &&
      item.article_title &&
      (`${title}`
        .toLowerCase()
        .indexOf(`${item.article_title}`.toLowerCase()) !== -1 ||
        `${item.article_title}`
          .toLowerCase()
          .indexOf(`${title}`.toLowerCase()) !== -1)
  );

  return titleMatches;
};

window.onload = async () => {
  const tab = await getActiveTab();
  if (!tab) {
    return;
  }
  debug("tab", tab);

  const list = await fetchRedditData();
  debug(`fetched reddit data`, list);

  const matches = matchData(list, tab.url, tab.title);

  const searchElm = document.getElementById("search-slice");
  searchElm.classList.add("invisible");
  debug("matches", matches);
  if (matches.length) {
    debug("got matches", matches);
    updateDom(matches);
  } else {
    debug("no matches...", matches);
    updateDomShowNoMatches(list.items);
  }
};

const getActiveTab = () => {
  return new Promise((resolve) => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      resolve(tabs.length ? tabs[0] : null);
    });
  });
};
