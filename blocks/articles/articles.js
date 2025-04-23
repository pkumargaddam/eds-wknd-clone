/* eslint-disable no-unused-vars */
/* eslint-disable no-nested-ternary */
/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable no-console */

import ffetch from '../../scripts/ffetch.js';
import { cleanUrl } from '../../scripts/helper.js';

function generateUID() {
  return Math.random().toString(36).slice(2, 10);
}

function getDepth(path = '') {
  return path.split('/').filter(Boolean).length;
}

function sortArticles(articles, orderBy, sortDir) {
  return articles.sort((a, b) => {
    let valA;
    let valB;

    if (orderBy === 'title') {
      valA = a.title?.toLowerCase() || '';
      valB = b.title?.toLowerCase() || '';
    } else {
      valA = new Date(a.lastModified || 0);
      valB = new Date(b.lastModified || 0);
    }

    const result = valA > valB ? 1 : valA < valB ? -1 : 0;
    return sortDir === 'ascending' ? result : -result;
  });
}

function createTab({ tag, title }, uid, isActive = false) {
  const li = document.createElement('li');
  li.setAttribute('role', 'tab');
  li.className = 'tag';
  if (isActive) {
    li.classList.add('tag--active');
    li.setAttribute('tabindex', '0');
    li.setAttribute('aria-selected', 'true');
  } else {
    li.setAttribute('tabindex', '-1');
    li.setAttribute('aria-selected', 'false');
  }
  li.id = `tabs-${uid}-tab`;
  li.setAttribute('aria-controls', `tabs-${uid}-tabpanel`);
  li.dataset.tag = tag;
  li.textContent = title;
  return li;
}

function createArticleCard(article) {
  const { path, title = '', description = '', image = '', imageAlt = '' } = article;

  const articleEl = document.createElement('article');
  articleEl.className = 'article-content';

  const imageLink = document.createElement('a');
  imageLink.className = 'article-image--link';
  imageLink.href = path;

  const imageContainer = document.createElement('div');
  imageContainer.className = 'article-image';

  const cmpImage = document.createElement('div');
  cmpImage.className = 'cmp-image';

  const img = document.createElement('img');
  img.src = image;
  img.alt = imageAlt;
  img.loading = 'lazy';
  img.className = 'cmp-image__image';
  img.width = 765;
  img.height = 535;

  cmpImage.appendChild(img);
  imageContainer.appendChild(cmpImage);
  imageLink.appendChild(imageContainer);

  const titleLink = document.createElement('a');
  titleLink.className = 'article-title--link';
  titleLink.href = path;

  const titleSpan = document.createElement('span');
  titleSpan.className = 'article-title';
  titleSpan.textContent = title;

  titleLink.appendChild(titleSpan);

  const desc = document.createElement('span');
  desc.className = 'article-description';
  desc.textContent = description;

  articleEl.appendChild(imageLink);
  articleEl.appendChild(titleLink);
  articleEl.appendChild(desc);

  return articleEl;
}

function setupTabKeyboardNavigation(tabList) {
  const tabs = [...tabList.querySelectorAll('[role="tab"]')];

  tabList.addEventListener('keydown', (e) => {
    const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);
    if (e.key === 'ArrowRight') {
      const nextTab = tabs[(currentIndex + 1) % tabs.length];
      nextTab.focus();
    } else if (e.key === 'ArrowLeft') {
      const prevTab = tabs[(currentIndex - 1 + tabs.length) % tabs.length];
      prevTab.focus();
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      document.activeElement.click();
    }
  });

  tabs.forEach((tab) => {
    tab.setAttribute('tabindex', tab.classList.contains('tag--active') ? '0' : '-1');
  });
}

export default async function decorate(block) {
  const [
    layoutTypeEl,
    childParentEl,
    childDepthEl,
    tagParentEl,
    tagDepthEl,
    fixedParentEl,
    orderEl,
    sortEl,
  ] = [...block.children];

  const layoutType = layoutTypeEl?.querySelector('p')?.textContent.trim();
  const childParent = cleanUrl(childParentEl?.querySelector('a')?.getAttribute('href') || '');
  const childDepth = parseInt(childDepthEl?.querySelector('p')?.textContent.trim(), 10);
  const tagParent = cleanUrl(tagParentEl?.querySelector('a')?.getAttribute('href') || '');
  const tagDepth = parseInt(tagDepthEl?.querySelector('p')?.textContent.trim(), 10);
  const order = orderEl?.querySelector('p')?.textContent.trim(); // title or last-modified-date
  const sort = sortEl?.querySelector('p')?.textContent.trim(); // ascending or descending

  let articleList = [];
  try {
    articleList = await ffetch('/article-index.json').all();
  } catch (e) {
    console.warn('Failed to fetch articles:', e);
    return;
  }

  block.innerHTML = '';

  const parentPath = layoutType === 'child-article' ? childParent : tagParent;
  const parentDepth = getDepth(parentPath);
  const maxDepth = layoutType === 'child-article' ? childDepth : tagDepth;

  const baseFiltered = articleList.filter(({ path }) => {
    const isChild = path.startsWith(parentPath) && path !== parentPath;
    const currentDepth = getDepth(path);
    return isChild && currentDepth > parentDepth && currentDepth <= parentDepth + maxDepth;
  });

  const sortedArticles = sortArticles(baseFiltered, order, sort);

  if (layoutType === 'child-article') {
    const articleContainer = document.createElement('div');
    articleContainer.className = 'article-list';

    sortedArticles.forEach((article) => articleContainer.appendChild(createArticleCard(article)));

    block.appendChild(articleContainer);
    return;
  }

  // child-article-tag layout
  const uid = generateUID();
  let tags = [];
  try {
    tags = await ffetch('/taxonomy.json').all();
  } catch (e) {
    console.warn('Failed to fetch tags:', e);
    return;
  }

  const tabList = document.createElement('ol');
  tabList.className = 'tag-list';
  tabList.setAttribute('role', 'tablist');
  tabList.setAttribute('aria-multiselectable', 'false');

  const articleContainer = document.createElement('div');
  articleContainer.className = 'article-list';

  const renderArticles = (tagFilter = '') => {
    articleContainer.innerHTML = '';
    const filtered = tagFilter
      ? sortedArticles.filter((a) => a.tags?.includes(tagFilter))
      : sortedArticles;
    filtered.forEach((article) => articleContainer.appendChild(createArticleCard(article)));
  };

  const tabs = [];

  const allTab = createTab({ tag: '', title: 'ALL' }, uid, true);
  tabs.push(allTab);
  tabList.appendChild(allTab);

  tags.forEach((tagData) => {
    const tab = createTab(tagData, uid, false);
    tabs.push(tab);
    tabList.appendChild(tab);
  });

  block.appendChild(tabList);
  block.appendChild(articleContainer);

  setupTabKeyboardNavigation(tabList);
  renderArticles();

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      tabs.forEach((t) => {
        t.classList.remove('tag--active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      tab.classList.add('tag--active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tab.focus();

      renderArticles(tab.dataset.tag);
    });
  });
}
