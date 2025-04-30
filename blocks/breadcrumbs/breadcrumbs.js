/* eslint-disable no-console */
import ffetch from '../../scripts/ffetch.js';

export default async function decorate(block) {
  // Get current path (e.g., /us/en/adventures/yosemite)
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const segments = currentPath.split('/').filter(Boolean);

  // Create <nav> element for breadcrumbs
  const breadcrumbNav = document.createElement('nav');
  breadcrumbNav.className = 'breadcrumbs';
  breadcrumbNav.setAttribute('aria-label', 'Breadcrumb');

  const breadcrumbList = document.createElement('ul');
  breadcrumbList.className = 'breadcrumbs__list';

  // Add "Home" link
  const homeLi = document.createElement('li');
  const homeLink = document.createElement('a');
  homeLink.href = '/';
  homeLink.textContent = 'Home';
  homeLi.appendChild(homeLink);
  breadcrumbList.appendChild(homeLi);

  // Resolve each segment to a readable title from query-index.json
  let pathAccumulator = '';
  const fetchPromises = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < segments.length; i++) {
    pathAccumulator += `/${segments[i]}`;
    const segmentPath = pathAccumulator;

    fetchPromises.push(
      ffetch('/query-index.json')
        .filter((entry) => entry.path === segmentPath)
        .first(),
    );
  }

  const results = await Promise.all(fetchPromises);

  results.forEach((item, index) => {
    const li = document.createElement('li');
    const segment = segments[index];
    const isLast = index === results.length - 1;

    if (item && !isLast) {
      const a = document.createElement('a');
      a.href = item.path;
      a.textContent = item.title || segment;
      li.appendChild(a);
    } else {
      li.textContent = item?.title || segment;
    }

    breadcrumbList.appendChild(li);
  });

  breadcrumbNav.appendChild(breadcrumbList);
  block.innerHTML = '';
  block.appendChild(breadcrumbNav);
}
