const getPageTitle = async (url) => {
  const resp = await fetch(url);
  if (resp.ok) {
    const html = document.createElement('div');
    html.innerHTML = await resp.text();
    return html.querySelector('title')?.innerText || '';
  }
  return '';
};

const getOnlyParentPath = async (paths) => {
  const rawPaths = paths.replace(/^\/|\/$/g, '').split('/');

  const parentParts = rawPaths.slice(0, -1);

  if (parentParts.length === 0) return null;

  const parentPath = `/${parentParts.join('/')}`;
  const parentUrl = `${window.location.origin}${parentPath}.html`;

  const name = await getPageTitle(parentUrl);
  const lastFolderName = parentParts[parentParts.length - 1];
  return { pathVal: parentPath, name: name || lastFolderName, url: parentUrl };
};

const createLink = (path) => {
  const pathLink = document.createElement('a');
  pathLink.href = path.url;
  pathLink.innerText = path.name;
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

  window.setTimeout(async () => {
    const path = window.location.pathname;

    const parentPath = await getOnlyParentPath(path);
    if (parentPath) {
      breadcrumbLinks.push(createLink(parentPath).outerHTML);
    }

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
