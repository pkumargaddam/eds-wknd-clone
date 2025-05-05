const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title')?.innerText || '';
  }
  return '';
};

const getAllParentPaths = async (fullPath) => {
  const rawPaths = fullPath.replace(/^\/|\/$/g, '').split('/');

  // Start breadcrumb only from 'index' onward
  const indexPosition = rawPaths.indexOf('index');
  const startIdx = indexPosition !== -1 ? indexPosition : 0;
  const meaningfulPaths = rawPaths.slice(startIdx);

  const allPaths = [];

  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < meaningfulPaths.length; i++) {
    const parentParts = meaningfulPaths.slice(0, i + 1);
    const parentPath = `/${rawPaths.slice(0, startIdx).concat(parentParts).join('/')}`;
    const parentUrl = `${window.location.origin}${parentPath}.html`;

    // eslint-disable-next-line no-await-in-loop
    const name = await getPageTitle(parentUrl);
    const displayName = name || parentParts[parentParts.length - 1];
    allPaths.push({ pathVal: parentPath, name: displayName, url: parentUrl });
  }

  return allPaths;
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  pathLink.innerText = path.name;
  pathLink.classList.add('breadcrumb-link');
  return pathLink;
};

export default async function decorate(block) {
  const [hideBreadcrumbVal, , hideCurrentPageVal] = block.children;
  const hideBreadcrumb = hideBreadcrumbVal?.textContent.trim() || 'false';
  const hideCurrentPage = hideCurrentPageVal?.textContent.trim() || 'false';

  block.innerHTML = '';
  if (hideBreadcrumb === 'true') return;

  const breadcrumb = document.createElement('nav');
  breadcrumb.setAttribute('aria-label', 'Breadcrumb');

  const breadcrumbLinks = [];

  // Add Home manually (for /index.html)
  breadcrumbLinks.push('<a href="/index.html" class="breadcrumb-link">Home</a>');

  window.setTimeout(async () => {
    const path = window.location.pathname;

    const parentPaths = await getAllParentPaths(path);

    // Remove the last item if we are not showing the current page
    if (hideCurrentPage === 'true') parentPaths.pop();

    parentPaths.forEach((p, idx) => {
      if (hideCurrentPage === 'false' && idx === parentPaths.length - 1) {
        const currentPath = document.createElement('span');
        let currentTitle = document.querySelector('title').innerText;
        currentTitle = currentTitle
          .replace(/^div\s\|\s*/i, '')
          .replace(/\s\|\s*Pricefx$/i, '');
        currentPath.innerText = currentTitle;
        breadcrumbLinks.push(currentPath.outerHTML);
      } else {
        breadcrumbLinks.push(createLink(p).outerHTML);
      }
    });

    breadcrumb.innerHTML = breadcrumbLinks.join(
      '<span class="breadcrumb-separator"> › </span>',
    );
    block.append(breadcrumb);
  }, 0);
}
