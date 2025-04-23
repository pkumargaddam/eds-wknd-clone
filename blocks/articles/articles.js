/* eslint-disable object-curly-newline */
/* eslint-disable max-len */
/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { cleanUrl } from '../../scripts/helper.js';

function generateUID() {
  return Math.random().toString(36).slice(2, 10);
}

function createTab({ tag, title }, uid, isActive = false) {
  const li = document.createElement('li');
  li.setAttribute('role', 'tab');
  li.className = 'cmp-tabs__tab';
  if (isActive) {
    li.classList.add('cmp-tabs__tab--active');
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
    }
  });

  // Tab key should only land on the active tab
  tabs.forEach((tab) => {
    tab.setAttribute('tabindex', tab.classList.contains('cmp-tabs__tab--active') ? '0' : '-1');
  });
}

export default async function decorate(block) {
  const [layoutTypeEl, childArticleEl, childArticleTagEl] = [...block.children];
  const layoutType = layoutTypeEl?.querySelector('p')?.textContent.trim();
  const childArticleRoot = cleanUrl(childArticleEl?.querySelector('a')?.getAttribute('href') || '');
  const childArticleTagRoot = cleanUrl(childArticleTagEl?.querySelector('a')?.getAttribute('href') || '');

  // Load article index
  let articleList = [];
  try {
    articleList = await ffetch('/article-index.json').all();
  } catch (e) {
    console.warn('Failed to fetch articles:', e);
    return;
  }

  block.innerHTML = '';

  if (layoutType === 'child-article') {
    const filtered = articleList.filter(({ path }) => path.startsWith(childArticleRoot) && path !== childArticleRoot);
    filtered.forEach((article) => block.appendChild(createArticleCard(article)));
    return;
  }

  // child-article-tag logic
  const uid = generateUID();
  let tags = [];
  try {
    const taxonomy = await ffetch('/taxonomy.json').all();
    // const taxonomy = [];
    // console.log('TAXO: ', await ffetch('/taxonomy.json').all());

    console.log('taxonomy: ', taxonomy);
    tags = taxonomy || [];
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
      ? articleList.filter((a) => a.tags?.includes(tagFilter))
      : articleList;
    filtered
      .filter(({ path }) => path.startsWith(childArticleTagRoot) && path !== childArticleTagRoot)
      .forEach((article) => articleContainer.appendChild(createArticleCard(article)));
  };

  const tabs = [];

  // ALL tab
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

  // Tab click behavior
  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update selected states
      tabs.forEach((t) => {
        t.classList.remove('cmp-tabs__tab--active');
        t.setAttribute('aria-selected', 'false');
        t.setAttribute('tabindex', '-1');
      });

      tab.classList.add('cmp-tabs__tab--active');
      tab.setAttribute('aria-selected', 'true');
      tab.setAttribute('tabindex', '0');
      tab.focus();

      renderArticles(tab.dataset.tag);
    });
  });
}
