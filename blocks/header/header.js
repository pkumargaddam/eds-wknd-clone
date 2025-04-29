import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';
import { highlightActiveLink } from '../../scripts/helper.js';

// Media query to detect desktop viewport
const isDesktop = window.matchMedia('(min-width: 1024px)');

/**
 * Clones the navigation sections for mobile use,
 * adds a HOME link at the top.
 */
function cloneNavContent(navSections) {
  const clone = navSections.cloneNode(true);
  clone.classList.remove('nav-brand', 'nav-tools');

  const ul = clone.querySelector('ul');
  if (ul) {
    const homeLi = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.title = 'HOME';
    homeLink.textContent = 'HOME';
    homeLi.appendChild(homeLink);
    ul.insertBefore(homeLi, ul.firstChild);
  }

  return clone;
}

/**
 * Handles visibility of hamburger icons and
 * body class toggle based on scroll position and viewport size.
 */
function handleScrollHamburgerVisibility() {
  const desktopHamburger = document.querySelector('#nav-desktop .nav-hamburger');
  const mobileHamburger = document.querySelector('#nav-mobile .nav-hamburger');
  const navMobile = document.querySelector('#nav-mobile');

  // Toggle body class for scroll styling
  if (window.scrollY > 10) {
    document.body.classList.add('scrolling');
  } else {
    document.body.classList.remove('scrolling');
  }

  // Show/hide hamburgers based on scroll and device
  if (!isDesktop.matches) {
    if (window.scrollY > 10) {
      mobileHamburger?.classList.remove('hidden');
      desktopHamburger?.classList.add('hidden');
    } else {
      mobileHamburger?.classList.add('hidden');
      desktopHamburger?.classList.remove('hidden');
    }
  } else {
    // Reset mobile nav when switching to desktop
    mobileHamburger?.classList.add('hidden');
    desktopHamburger?.classList.remove('hidden');
    navMobile?.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('header-visible');
  }
}

/**
 * Toggles the mobile navigation open/close state.
 */
function toggleMobileNav(navMobile) {
  const isExpanded = navMobile.getAttribute('aria-expanded') === 'true';
  const willExpand = !isExpanded;

  navMobile.setAttribute('aria-expanded', willExpand.toString());

  // Apply body class for styling overlay or nav visibility
  if (!isDesktop.matches) {
    if (willExpand) {
      document.body.classList.add('header-visible');
    } else {
      document.body.classList.remove('header-visible');
    }
  }
}

/**
 * Main decorate function that builds and wires up the navigation component.
 */
export default async function decorate(block) {
  // Load nav fragment from metadata or default path
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  block.textContent = '';
  const navWrapper = document.createElement('div');
  navWrapper.className = 'nav-wrapper';

  const [brand, sections, tools] = [...fragment.children];

  // ===== Desktop Nav =====
  const navDesktop = document.createElement('nav');
  navDesktop.id = 'nav-desktop';
  navDesktop.className = 'nav-wrapper-desktop';
  navDesktop.setAttribute('aria-expanded', 'false');

  const desktopHamburger = document.createElement('div');
  desktopHamburger.classList.add('nav-hamburger');
  desktopHamburger.innerHTML = `
    <button type="button" aria-controls="nav-desktop" aria-label="Open navigation">
      <span class="nav-hamburger-icon wkndicon-menu"></span>
    </button>`;
  navDesktop.append(desktopHamburger);

  // Add brand/logo with link to homepage
  if (brand) {
    brand.classList.add('nav-brand');
    const wrapper = brand.querySelector('.default-content-wrapper');
    const picture = wrapper?.querySelector('picture');
    if (picture) {
      const anchor = document.createElement('a');
      anchor.href = '/';
      anchor.className = 'home';
      anchor.setAttribute('aria-label', 'Home');
      anchor.appendChild(picture.cloneNode(true));
      wrapper.innerHTML = '';
      wrapper.appendChild(anchor);
    }
  }

  // Add proper classes to sections and tools
  if (sections) sections.classList.add('nav-sections');
  if (tools) tools.classList.add('nav-tools');

  navDesktop.append(brand, sections, tools);

  // ===== Mobile Nav =====
  const navMobile = document.createElement('nav');
  navMobile.id = 'nav-mobile';
  navMobile.className = 'nav-wrapper-mobile';
  navMobile.setAttribute('aria-expanded', 'false');

  const mobileHamburger = document.createElement('div');
  mobileHamburger.classList.add('nav-hamburger', 'hidden');
  mobileHamburger.innerHTML = `
    <button type="button" aria-controls="nav-mobile" aria-label="Open navigation">
      <span class="nav-hamburger-icon wkndicon-menu"></span>
    </button>`;
  navMobile.append(mobileHamburger);

  // Clone nav sections for mobile and append
  const clonedSections = cloneNavContent(sections);
  navMobile.append(clonedSections);

  // ===== Event Listeners =====
  const toggleBtnHandler = () => toggleMobileNav(navMobile);
  desktopHamburger.querySelector('button').addEventListener('click', toggleBtnHandler);
  mobileHamburger.querySelector('button').addEventListener('click', toggleBtnHandler);

  // Close mobile nav on outside click
  document.addEventListener('click', (e) => {
    const isOpen = navMobile.getAttribute('aria-expanded') === 'true';
    if (!isDesktop.matches && isOpen) {
      const isClickInsideNav = navMobile.contains(e.target);
      const isClickOnHamburger = e.target.closest('.nav-hamburger');
      if (!isClickInsideNav && !isClickOnHamburger) {
        navMobile.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('header-visible');
      }
    }
  });

  // ===== Append navs and activate scroll behavior =====
  navWrapper.append(navDesktop, navMobile);
  block.append(navWrapper);

  window.addEventListener('scroll', handleScrollHamburgerVisibility);
  isDesktop.addEventListener('change', handleScrollHamburgerVisibility);
  handleScrollHamburgerVisibility(); // Initial run

  // Highlight active nav links
  highlightActiveLink(sections);
  highlightActiveLink(clonedSections);
}
