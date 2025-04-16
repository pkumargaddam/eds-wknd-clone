/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';
import { cleanUrl } from '../../scripts/helper.js';

export default async function decorate(block) {
  const [layoutTypeEl, childArticleEl, childArticleTagEl] = [...block.children];

  // Extract layout type: either 'child-article' or 'child-article-tag'
  const layoutType = layoutTypeEl?.querySelector('p')?.textContent.trim();

  // Get root links for filtering
  const childArticleRoot = cleanUrl(childArticleEl?.querySelector('a')?.getAttribute('href') || '');
  const childArticleTagRoot = cleanUrl(childArticleTagEl?.querySelector('a')?.getAttribute('href') || ''
);

  // Determine active root path based on layout type
  const activeRoot = layoutType === 'child-article' ? childArticleRoot : childArticleTagRoot;

  // Fetch article index and filter based on path
  let articleList = [];
  try {
    articleList = await ffetch('/article-index.json').all();

    // Filter all child articles of the active root
    articleList = articleList.filter(({ path }) =>
      path.startsWith(activeRoot) && path !== activeRoot
    );
  } catch (e) {
    console.warn('Failed to fetch or filter article data:', e);
    return;
  }

  // Clear existing block content
  block.innerHTML = '';

  // Create and append each article card
  articleList.forEach((article) => {
    const {
      path,
      title = '',
      description = '',
      image = '',
      imageAlt = '',
    } = article;

    const articleEl = document.createElement('article');
    articleEl.className = 'article-content';

    // Image wrapper
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

    // Title link
    const titleLink = document.createElement('a');
    titleLink.className = 'article-title--link';
    titleLink.href = path;

    const titleSpan = document.createElement('span');
    titleSpan.className = 'article-title';
    titleSpan.textContent = title;

    titleLink.appendChild(titleSpan);

    // Description
    const desc = document.createElement('span');
    desc.className = 'article-description';
    desc.textContent = description;

    // Append all parts
    articleEl.appendChild(imageLink);
    articleEl.appendChild(titleLink);
    articleEl.appendChild(desc);

    block.appendChild(articleEl);
  });
}
