import { HOME } from '../../scripts/constants.js';
import { getMetadata } from '../../scripts/aem.js';

const breadcrumbOverrides = {
  'aem-boilerplate': 'Index',
};

const getPageTitle = async (url) => {
  // Check for any manual override
  const overrideKey = Object.keys(breadcrumbOverrides).find((key) => url.includes(key));
  if (overrideKey) return breadcrumbOverrides[overrideKey];

  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title')?.innerText || '';
  }

  return '';
};

const getAllPathsExceptCurrent = async (paths, startLevel) => {
  const result = [];
  const startLevelVal = parseInt(startLevel, 10) || 1;

  const rawPaths = paths.replace(/^\/|\/$/g, '').split('/');

  // Skip any initial system folders
  const ignoreUntil = ['content', 'eds-wknd'];
  let filteredPaths = [...rawPaths];
  // eslint-disable-next-line max-len
  const firstValidIndex = rawPaths.findIndex((folder) => !ignoreUntil.includes(folder.toLowerCase()));
  if (firstValidIndex > 0) {
    filteredPaths = rawPaths.slice(firstValidIndex);
  }

  let pathVal = '';
  for (let i = 0; i <= filteredPaths.length - 2; i += 1) {
    pathVal = `${pathVal}/${filteredPaths[i]}`;
    let url = `${window.location.origin}${pathVal}`;
    if (window.location.host.includes('author')) {
      url = `${window.location.origin}${pathVal}.html`;
    }

    if (i >= startLevelVal - 1) {
      // eslint-disable-next-line no-await-in-loop
      const name = await getPageTitle(url);
      if (name) {
        result.push({ pathVal, name, url });
      }
    }
  }

  return result;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;

  if (path.name !== 'HomePage') {
    pathLink.innerText = path.name;
  } else {
    pathLink.title = path.label;
    pathLink.innerHTML = HOME;
  }

  return pathLink;
};

export default async function decorate(block) {
  const [hideBreadcrumbVal, startLevelVal, hideCurrentPageVal] = block.children;
  const hideBreadcrumb = hideBreadcrumbVal?.textContent.trim() || 'false';
  const hideCurrentPage = hideCurrentPageVal?.textContent.trim() || 'false';

  let startLevel = startLevelVal?.textContent.trim() || 1;
  const metaBreadcrumbLevel = getMetadata('breadcrumblevel');
  if (metaBreadcrumbLevel) {
    startLevel = metaBreadcrumbLevel;
  }

  block.innerHTML = '';
  if (hideBreadcrumb === 'true') return;

  const breadcrumb = document.createElement('nav');
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');

  const HomeLink = createLink({
    path: '', name: 'HomePage', url: window.location.origin, label: 'Home',
  });
  const breadcrumbLinks = [HomeLink.outerHTML];

  window.setTimeout(async () => {
    const path = window.location.pathname;
    const paths = await getAllPathsExceptCurrent(path, startLevel);

    paths.forEach((pathPart) => {
      breadcrumbLinks.push(createLink(pathPart).outerHTML);
    });

    if (hideCurrentPage === 'false') {
      const currentPath = document.createElement('span');
      let currentTitle = document.querySelector('title').innerText;
      currentTitle = currentTitle
        .replace(/^div\s\|\s*/i, '')
        .replace(/\s\|\s*Pricefx$/i, '');
      currentPath.innerText = currentTitle;
      breadcrumbLinks.push(currentPath.outerHTML);
    }

    breadcrumb.innerHTML = breadcrumbLinks.join(
      '<span class="breadcrumb-separator"></span>',
    );
    block.append(breadcrumb);
  }, 0);
}
