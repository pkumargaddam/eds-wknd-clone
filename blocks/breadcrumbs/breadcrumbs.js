/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';

function normalizePath(path) {
  return path
    .replace(/^\/content\/eds-wknd/, '')
    .replace(/\/index$/, '')
    .replace(/\/index\.html$/, '')
    .replace(/\.html$/, '')
    .replace(/\/$/, '') || '/';
}

export default async function decorate(block) {
  const rawPath = window.location.pathname;
  const cleanedPath = normalizePath(rawPath);
  const segments = cleanedPath.split('/').filter(Boolean);

  const breadcrumbNav = document.createElement('nav');
  breadcrumbNav.className = 'breadcrumbs';
  breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');

  const breadcrumbList = document.createElement('ul');
  breadcrumbList.className = 'breadcrumbs__list';

  // Home link
  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeLi.appendChild(homeLink);
  breadcrumbList.appendChild(homeLi);

  // Accumulate paths and fetch titles
  let pathAccumulator = '';
  const fetchPromises = [];

  segments.forEach((segment) => {
    pathAccumulator += `/${segment}`;
    fetchPromises.push(
      ffetch('/query-index.json')
        .filter((item) => item.path === pathAccumulator)
        .first(),
    );
  });

  const results = await Promise.all(fetchPromises);

  results.forEach((item, index) => {
    const li = document.createElement('li');
    const isLast = index === results.length - 1;
    const label = item?.title || segments[index];

    if (item && !isLast) {
      const a = document.createElement('a');
      a.href = item.path;
      a.textContent = label;
      li.appendChild(a);
    } else {
      li.textContent = label;
    }

    breadcrumbList.appendChild(li);
  });

  breadcrumbNav.appendChild(breadcrumbList);
  block.innerHTML = '';
  block.appendChild(breadcrumbNav);
}
