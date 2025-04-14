/* eslint-disable linebreak-style */
/* eslint-disable import/prefer-default-export */

/**
 * Adds the 'active' class to anchor tags within the container that match the current pathname.
 * @param {Element} container - The element that contains anchor (`<a>`) tags.
 */
export function highlightActiveLink(container) {
  const currentPath = window.location.pathname.replace(/\/$/, '');
  const links = container.querySelectorAll('a');

  links.forEach((link) => {
    const linkPath = new URL(link.href, window.location.origin).pathname.replace(/\/$/, '');
    if (linkPath === currentPath) {
      link.classList.add('active');
    }
  });
}

/**
 * Cleans a given URL by removing `.html` extension and `/content/{repoName}` prefix.
 * @param {string} url - The full URL or path.
 * @returns {string} - Cleaned path (e.g. "/component/teaser-block").
 */
export function cleanUrl(url) {
  if (typeof url !== 'string' || !url.trim()) return '';

  let cleaned = url.trim();
  const repoName = 'eds-helium-xwalk';

  // Remove ".html" at the end (case insensitive)
  cleaned = cleaned.replace(/\.html$/i, '');

  // Remove repo prefix if present
  const prefixPattern = new RegExp(`^/content/${repoName}`, 'i');
  cleaned = cleaned.replace(prefixPattern, '');

  // Ensure it starts with a "/"
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`;
}
