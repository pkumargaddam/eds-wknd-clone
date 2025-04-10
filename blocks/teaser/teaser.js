export default async function decorate(block) {
  // const [
  //   pageLinkEl,
  //   inheritPageLinkEl,
  //   pretitleEl,
  //   titleEl,
  //   descriptionEl,
  //   ctaLabelEl,
  //   ctaLinkEl,
  //   ctaLinkOpenEl,
  //   imageRowEl,
  // ] = [...block.children];

  // const pageLink = pageLinkEl?.querySelector('a')?.getAttribute('href') || '';
  // const inheritPageLink = inheritPageLinkEl?.textContent.trim() === 'true';
  // const ctaLabel = ctaLabelEl?.textContent || '';
  // const ctaLink = ctaLinkEl?.querySelector('a')?.getAttribute('href') || '';
  // const openInNewTab = ctaLinkOpenEl?.textContent.trim() === 'true';
  // const pretitle = pretitleEl?.textContent || '';

  // // Initialize content
  // let inheritedTitle = null;
  // let inheritedDescription = null;
  // let inheritedImageURL = null;
  // let inheritedImageAlt = null;

  // if (inheritPageLink && pageLink) {
  //   try {
  //     const url = `https://author-p51328-e442308.adobeaemcloud.com${pageLink}.infinity.json`;
  //     const res = await fetch(url);
  //     const json = await res.json();
  //     const content = json?.['jcr:content'];
  //     if (content) {
  //       inheritedTitle = content.pageTitle ?? '';
  //       inheritedDescription = content['jcr:description'] ?? '';
  //       inheritedImageURL = content.image?.fileReference ?? '';
  //       inheritedImageAlt = content.image?.alt ?? '';
  //     }
  //   } catch (e) {
  //     console.warn('Failed to fetch inherited page data:', e);
  //   }
  // }

  // const title = inheritPageLink ? inheritedTitle || '' : titleEl?.textContent || '';
  // const description = inheritPageLink ? inheritedDescription || '' : descriptionEl?.textContent || '';

  // // Build DOM
  // const teaserEl = document.createElement('div');
  // teaserEl.className = 'teaser';

  // const cmpTeaser = document.createElement('div');
  // cmpTeaser.className = 'cmp-teaser';

  // const content = document.createElement('div');
  // content.className = 'cmp-teaser__content';

  // if (pretitle) {
  //   const pre = document.createElement('p');
  //   pre.className = 'cmp-teaser__pretitle';
  //   pre.textContent = pretitle;
  //   content.appendChild(pre);
  // }

  // if (title) {
  //   const h2 = document.createElement('h2');
  //   h2.className = 'cmp-teaser__title';
  //   h2.textContent = title;
  //   content.appendChild(h2);
  // }

  // if (description) {
  //   const desc = document.createElement('div');
  //   desc.className = 'cmp-teaser__description';
  //   desc.textContent = description;
  //   content.appendChild(desc);
  // }

  // if (ctaLink && ctaLabel) {
  //   const actionContainer = document.createElement('div');
  //   actionContainer.className = 'cmp-teaser__action-container';

  //   const actionLink = document.createElement('a');
  //   actionLink.className = 'cmp-teaser__action-link';
  //   actionLink.href = ctaLink;
  //   actionLink.textContent = ctaLabel;
  //   if (openInNewTab) {
  //     actionLink.target = '_blank';
  //     actionLink.rel = 'noopener noreferrer';
  //   }

  //   actionContainer.appendChild(actionLink);
  //   content.appendChild(actionContainer);
  // }

  // cmpTeaser.appendChild(content);

  // // Image logic
  // const imageWrapper = document.createElement('div');
  // imageWrapper.className = 'cmp-teaser__image';

  // if (inheritPageLink) {
  //   // Render image from inherited page data
  //   const picture = document.createElement('picture');
  //   const img = document.createElement('img');
  //   img.src = inheritedImageURL;
  //   img.alt = inheritedImageAlt || '';
  //   img.loading = 'lazy';
  //   picture.appendChild(img);
  //   imageWrapper.appendChild(picture);
  // } else {
  //   // Grab original <picture> from DOM
  //   const pictureEl = imageRowEl?.querySelector('picture');
  //   if (pictureEl) {
  //     imageWrapper.appendChild(pictureEl.cloneNode(true));
  //   }
  // }

  // if (imageWrapper.children.length) {
  //   cmpTeaser.appendChild(imageWrapper);
  // }

  // teaserEl.appendChild(cmpTeaser);
  // block.replaceWith(teaserEl);
}
