const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title')?.innerText || '';
  }
  return '';
};

const getAllParentPaths = async (fullPath, startLevel = 1) => {
  const segments = fullPath.replace(/^\/|\/$/g, '').split('/');
  const indexIdx = segments.indexOf('index');
  if (indexIdx === -1) return [];

  const usefulSegments = segments.slice(indexIdx);
  const allPaths = [];

  // eslint-disable-next-line no-plusplus
  for (let i = startLevel; i < usefulSegments.length; i++) {
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
  const [hideBreadcrumbEl, startLevelEl, hideCurrentPageEl] = block.children;
  const hideBreadcrumb = hideBreadcrumbEl?.textContent.trim() === 'true';
  const hideCurrentPage = hideCurrentPageEl?.textContent.trim() === 'true';
  const startLevel = parseInt(startLevelEl?.textContent.trim(), 10) || 1;

  block.innerHTML = '';
  if (hideBreadcrumb) return;

  const breadcrumb = document.createElement('nav');
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');

  const breadcrumbLinks = [];
  const homeURL = `${window.location.origin}/content/eds-wknd/index.html`;
  breadcrumbLinks.push(createLink('Home', homeURL).outerHTML);

  const path = window.location.pathname;
  const parentPaths = await getAllParentPaths(path, startLevel);

  parentPaths.forEach((p, i) => {
    breadcrumbLinks.push('<span class="breadcrumb-separator"> </span>');
    const isLast = i === parentPaths.length - 1;

    if (isLast && hideCurrentPage) return;
    if (isLast) {
      breadcrumbLinks.push(`<span>${p.name}</span>`);
    } else {
      breadcrumbLinks.push(createLink(p.name, p.url).outerHTML);
    }
  });

  breadcrumb.innerHTML = breadcrumbLinks.join('');
  block.appendChild(breadcrumb);
}
