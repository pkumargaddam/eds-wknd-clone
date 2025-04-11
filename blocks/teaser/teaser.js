/* eslint-disable no-console */
import { getAEMAuthor } from '../../scripts/endpointconfig.js';

export default async function decorate(block) {
  // Destructure block children assuming fixed column structure
  const [
    pageLinkEl,
    inheritPageLinkEl,
    pretitleEl,
    titleEl,
    descriptionEl,
    ctaLabelEl,
    ctaLinkEl,
    ctaLinkOpenEl,
    imageRowEl,
  ] = [...block.children];

  // Extract values from DOM
  const pageLink = pageLinkEl?.querySelector('a')?.getAttribute('href') || '';
  const inheritPageLink = inheritPageLinkEl?.textContent.trim() === 'true';
  const ctaLabel = ctaLabelEl?.textContent.trim() || '';
  const ctaLink = ctaLinkEl?.querySelector('a')?.getAttribute('href') || '';
  const openInNewTab = ctaLinkOpenEl?.textContent.trim() === 'true';
  const pretitle = pretitleEl?.textContent.trim() || '';

  // Default values for inherited content
  let inheritedTitle = '';
  let inheritedDescription = '';
  let inheritedImageURL = '';
  let inheritedImageAlt = '';

  // Fetch page link metadata if inheritance is enabled
  if (inheritPageLink && pageLink) {
    try {
      const aemAuthorURL = getAEMAuthor();
      const res = await fetch(`${aemAuthorURL}${pageLink}.infinity.json`);
      const json = await res.json();
      const content = json?.['jcr:content'];

      if (content) {
        inheritedTitle = content.pageTitle ?? '';
        inheritedDescription = content['jcr:description'] ?? '';
        inheritedImageURL = content.image?.fileReference ?? '';
        inheritedImageAlt = content.image?.alt ?? '';
      }
    } catch (e) {
      console.warn('Failed to fetch inherited page data:', e);
    }
  }

  // Resolve title and description from inherited or block content
  const title = inheritPageLink ? inheritedTitle : (titleEl?.textContent.trim() || '');
  const description = inheritPageLink ? inheritedDescription : (descriptionEl?.textContent.trim() || '');

  // ─── Build Teaser DOM ───
  const cmpTeaser = document.createElement('div');
  cmpTeaser.className = 'cmp-teaser';

  const content = document.createElement('div');
  content.className = 'cmp-teaser__content';

  // Add optional pretitle
  if (pretitle) {
    const pre = document.createElement('p');
    pre.className = 'cmp-teaser__pretitle';
    pre.textContent = pretitle;
    content.appendChild(pre);
  }

  // Add title
  if (title) {
    const h2 = document.createElement('h2');
    h2.className = 'cmp-teaser__title';
    h2.textContent = title;
    content.appendChild(h2);
  }

  // Add description
  if (description) {
    const desc = document.createElement('div');
    desc.className = 'cmp-teaser__description';
    desc.textContent = description;
    content.appendChild(desc);
  }

  // Add CTA if defined
  if (ctaLink && ctaLabel) {
    const actionContainer = document.createElement('div');
    actionContainer.className = 'cmp-teaser__action-container button-container';

    const actionLink = document.createElement('a');
    actionLink.className = 'cmp-teaser__action-link button';
    actionLink.href = ctaLink;
    actionLink.textContent = ctaLabel;

    if (openInNewTab) {
      actionLink.target = '_blank';
      actionLink.rel = 'noopener noreferrer';
    }

    actionContainer.appendChild(actionLink);
    content.appendChild(actionContainer);
  }

  cmpTeaser.appendChild(content);

  // ─── Handle Image Logic ────
  const imageWrapper = document.createElement('div');
  imageWrapper.className = 'cmp-teaser__image';

  if (inheritPageLink && inheritedImageURL) {
    // If inherited image is available, create <picture><img></picture>
    const picture = document.createElement('picture');
    const img = document.createElement('img');
    img.src = inheritedImageURL;
    img.alt = inheritedImageAlt || '';
    img.loading = 'lazy';
    picture.appendChild(img);
    imageWrapper.appendChild(picture);
  } else {
    // Use <picture> from the original DOM
    const pictureEl = imageRowEl?.querySelector('picture');
    if (pictureEl) {
      imageWrapper.appendChild(pictureEl.cloneNode(true));
    }
  }

  if (imageWrapper.children.length > 0) {
    cmpTeaser.appendChild(imageWrapper);
  }

  block.innerHTML = '';
  block.appendChild(cmpTeaser);
}
