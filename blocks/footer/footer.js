import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { highlightActiveLink } from '../../scripts/helper.js';

export default async function decorate(block) {
  // Load footer as fragment
  const footerMeta = getMetadata('footer');
  const footerPath = footerMeta ? new URL(footerMeta, window.location).pathname : '/footer';
  const fragment = await loadFragment(footerPath);

  // Clear the existing block content
  block.textContent = '';

  // Create footer container
  const footer = document.createElement('div');
  footer.classList.add('footer-box');

  // Organize footer sections
  const sections = ['brand', 'links', 'social', 'legal'];
  fragment.querySelectorAll('.section').forEach((section, index) => {
    if (sections[index]) section.classList.add(`footer-${sections[index]}`);
    footer.append(section);
  });

  // Modify brand section (logo handling)
  const footerBrand = footer.querySelector('.footer-brand');
  if (footerBrand) {
    const logo = footerBrand.querySelector('picture');
    if (logo) {
      footerBrand.innerHTML = `<a href="/" aria-label="Home" title="Home" class="home">${logo.outerHTML}</a>`;
      footerBrand.querySelector('img').setAttribute('loading', 'eager');
    }
  }

  // Adjust button styles for social links
  const socialButtons = footer.querySelectorAll('.footer-social .button');
  socialButtons.forEach((btn) => {
    btn.classList.add('social-button');
  });

  // Highlight active link
  highlightActiveLink(footer);

  // Append footer to block
  block.append(footer);
}
