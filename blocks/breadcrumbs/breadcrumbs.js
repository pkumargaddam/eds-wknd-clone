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

  // Filter out unwanted folders
  const filteredPaths = rawPaths.filter((part) => part && !['content', 'eds-wknd', 'index', 'aem-boilerplate'].includes(part.toLowerCase()));

  // Get the parent folder (second last part)
  const parentFolder = filteredPaths.length >= 2 ? filteredPaths[filteredPaths.length - 2] : null;

  if (!parentFolder) return null;

  let parentUrl = `${window.location.origin}/${filteredPaths.slice(0, -1).join('/')}`;
  if (window.location.host.includes('author')) {
    parentUrl += '.html';
  }

  const name = await getPageTitle(parentUrl);
  return { pathVal: `/${parentFolder}`, name: name || parentFolder, url: parentUrl };
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

    // ➔ Only add the parent folder
    const parentPath = await getOnlyParentPath(path);
    if (parentPath) {
      breadcrumbLinks.push(createLink(parentPath).outerHTML);
    }

    // ➔ Add the current page title
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
