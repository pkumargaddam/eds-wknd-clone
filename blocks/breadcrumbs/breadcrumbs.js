const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title')?.innerText || '';
  }
  return '';
};

const getAllParentPaths = async (fullPath, includeCurrentPage) => {
  const segments = fullPath.replace(/^\/|\/$/g, '').split('/');

  const indexIdx = segments.indexOf('index');
  if (indexIdx === -1) return [];

  const usefulSegments = segments.slice(indexIdx);
  const allPaths = [];

  const max = includeCurrentPage ? usefulSegments.length : usefulSegments.length - 1;

  // eslint-disable-next-line no-plusplus
  for (let i = 1; i < max; i++) {
    const subPathParts = segments.slice(0, indexIdx + i + 1);
    const fullSubPath = `/${subPathParts.join('/')}`;
    const url = `${window.location.origin}${fullSubPath}.html`;

    // eslint-disable-next-line no-await-in-loop
    const name = await getPageTitle(url);
    const displayName = name || usefulSegments[i];
    allPaths.push({ name: displayName, url });
  }

  return allPaths;
};

const createLink = (label, href) => {
  const a = document.createElement('a');
  a.href = href;
  a.className = 'breadcrumb-link';
  a.textContent = label;
  return a;
};

export default async function decorate(block) {
  const [hideBreadcrumbVal, , hideCurrentPageVal] = block.children;
  const hideBreadcrumb = hideBreadcrumbVal?.textContent.trim().toLowerCase() === 'true';
  const hideCurrentPage = hideCurrentPageVal?.textContent.trim().toLowerCase() === 'true';

  if (hideBreadcrumb) {
    block.innerHTML = '';
    return;
  }

  const breadcrumb = document.createElement('nav');
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');

  const breadcrumbLinks = [];

  const homeURL = `${window.location.origin}/content/eds-wknd/index.html`;
  breadcrumbLinks.push(createLink('Home', homeURL));

  const fullPath = window.location.pathname;
  const parentPaths = await getAllParentPaths(fullPath, !hideCurrentPage);

  parentPaths.forEach((p) => {
    breadcrumbLinks.push(createLink(p.name, p.url));
  });

  breadcrumbLinks.forEach((el) => breadcrumb.appendChild(el));

  block.innerHTML = '';
  block.appendChild(breadcrumb);
}
