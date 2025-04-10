export default async function decorate(block) {
  const [
    pageLinkWrapper,
    inheritPageLinkWrapper,
    pretitleWrapper,
    titleWrapper,
    descriptionWrapper,
    ctaLabelWrapper,
    ctaLinkWrapper,
    openInNewTabWrapper,
    imageWrapper,
  ] = [...block.children];

  const pageLinkEl = pageLinkWrapper.querySelector('a');
  const inheritPageLinkEl = inheritPageLinkWrapper?.querySelector('p');
  const pretitleEl = pretitleWrapper?.querySelector('p');
  const titleEl = titleWrapper?.querySelector('p');
  const descriptionEl = descriptionWrapper?.querySelector('p');
  const ctaLabelEl = ctaLabelWrapper?.querySelector('p');
  const ctaLinkEl = ctaLinkWrapper?.querySelector('a');
  const openInNewTabEl = openInNewTabWrapper?.querySelector('p');
  const pictureEl = imageWrapper?.querySelector('picture');

  let inheritedTitle = '';
  let inheritedDescription = '';
  let inheritedImageURL = '';
  let inheritedAlt = '';

  if (inheritPageLinkEl?.textContent.trim() === 'true' && pageLinkEl?.href) {
    try {
      const pagePath = pageLinkEl.getAttribute('href');
      const infinityURL = `https://author-p51328-e442308.adobeaemcloud.com${pagePath}.infinity.json`;
      const resp = await fetch(infinityURL);
      if (resp.ok) {
        const pageData = await resp.json();
        inheritedTitle = pageData.pageTitle || '';
        inheritedDescription = pageData['jcr:description'] || '';
        inheritedImageURL = pageData.image?.fileReference || '';
        inheritedAlt = pageData.image?.alt || '';
      }
    } catch (e) {
      console.warn('Failed to load page data from .infinity.json', e);
    }
  }

  const teaser = document.createElement('div');
  teaser.className = 'cmp-teaser';

  const content = document.createElement('div');
  content.className = 'cmp-teaser__content';

  const pretitle = document.createElement('p');
  pretitle.className = 'cmp-teaser__pretitle';
  pretitle.textContent = pretitleEl?.textContent || '';
  content.append(pretitle);

  const title = document.createElement('h2');
  title.className = 'cmp-teaser__title';
  title.textContent = inheritedTitle || titleEl?.textContent || '';
  content.append(title);

  const description = document.createElement('div');
  description.className = 'cmp-teaser__description';
  description.textContent = inheritedDescription || descriptionEl?.textContent || '';
  content.append(description);

  const ctaContainer = document.createElement('div');
  ctaContainer.className = 'cmp-teaser__action-container';

  const ctaLink = document.createElement('a');
  ctaLink.className = 'cmp-teaser__action-link';
  ctaLink.href = ctaLinkEl?.getAttribute('href') || '#';
  ctaLink.textContent = ctaLabelEl?.textContent || '';
  if (openInNewTabEl?.textContent.trim() === 'true') {
    ctaLink.setAttribute('target', '_blank');
  }
  ctaContainer.append(ctaLink);
  content.append(ctaContainer);

  const imageContainer = document.createElement('div');
  imageContainer.className = 'cmp-teaser__image';

  if (inheritedImageURL) {
    const img = document.createElement('img');
    img.src = inheritedImageURL;
    img.alt = inheritedAlt || '';
    imageContainer.append(img);
  } else if (pictureEl) {
    imageContainer.append(pictureEl);
  }

  teaser.append(content, imageContainer);

  // Clear and rebuild block content
  block.textContent = '';
  block.classList.remove('block');
  block.append(teaser);
}
