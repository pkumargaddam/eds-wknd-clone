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
