import { loadBlock } from '../../scripts/aem.js';
import { generateUID } from '../../scripts/helper.js';

// Main decorate function for initializing the carousel block
export default async function decorate(block) {
  // Filter out the valid "raw blocks" based on non-empty marker text
  const rawBlocks = [...block.children].filter((childDiv) => {
    const marker = childDiv.querySelector(':scope > div:first-child > p');
    return marker && marker.textContent.trim().length > 0;
  });

  // Create a unique ID for the carousel instance
  const carouselId = `carousel-${generateUID()}`;

  // Create carousel wrapper and assign ARIA attributes for accessibility
  const carouselWrapper = document.createElement('div');
  carouselWrapper.className = 'cmp-carousel';
  carouselWrapper.setAttribute('role', 'group');
  carouselWrapper.setAttribute('aria-live', 'polite');
  carouselWrapper.setAttribute('aria-roledescription', 'carousel');

  // Create carousel content container
  const carouselContent = document.createElement('div');
  carouselContent.className = 'cmp-carousel__content';
  carouselContent.setAttribute('aria-atomic', 'false');
  carouselContent.setAttribute('aria-live', 'polite');

  // Create the indicator list (the tabs/buttons for each slide)
  const indicators = document.createElement('ol');
  indicators.className = 'cmp-carousel__indicators';
  indicators.setAttribute('role', 'tablist');
  indicators.setAttribute('aria-label', 'Choose a slide to display');

  // Arrays to hold slide and tab elements for later reference
  const slides = [];
  const tabs = [];

  // Process each raw block to create slides
  await Promise.all(rawBlocks.map(async (rawBlock, index) => {
    const rows = [...rawBlock.children];
    const configText = rows[0]?.querySelector('p')?.textContent.trim() || '';
    const blockNames = configText.split(',').map((name) => name.trim()).filter(Boolean);
    if (blockNames.length === 0) return;

    // Primary block type (e.g., 'teaser', 'hero', etc.)
    const primaryBlock = blockNames[0];

    // Prepare a new block with the content (skip the config row)
    const newBlock = document.createElement('div');
    newBlock.append(...rows.slice(1));

    // Copy any AUE (Authoring UI Extension) attributes
    [...rawBlock.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-aue')) {
        newBlock.setAttribute(attr.name, attr.value);
      }
    });

    // Add block-specific classes and metadata
    newBlock.classList.add(...blockNames, 'block');
    newBlock.dataset.blockName = primaryBlock;

    // Generate unique IDs for slide and its tab
    const uniqueId = generateUID();
    const panelId = `${carouselId}-item-${uniqueId}-tabpanel`;
    const tabId = `${carouselId}-item-${uniqueId}-tab`;

    // Create the slide panel
    const slide = document.createElement('div');
    slide.className = 'cmp-carousel__item';
    if (index === 0) slide.classList.add('cmp-carousel__item--active'); // Set the first slide active
    slide.setAttribute('role', 'tabpanel');
    slide.setAttribute('aria-labelledby', tabId);
    slide.setAttribute('aria-roledescription', 'slide');
    slide.setAttribute('aria-label', `Slide ${index + 1} of ${rawBlocks.length}`);
    slide.id = panelId;

    slide.append(newBlock);
    carouselContent.append(slide);
    slides.push(slide);

    // Create the corresponding tab/indicator
    const indicator = document.createElement('li');
    indicator.id = tabId;
    indicator.className = 'cmp-carousel__indicator';
    if (index === 0) indicator.classList.add('cmp-carousel__indicator--active'); // Set first tab active
    indicator.setAttribute('role', 'tab');
    indicator.setAttribute('aria-controls', panelId);
    indicator.setAttribute('aria-label', `Slide ${index + 1}`);
    indicators.append(indicator);
    tabs.push(indicator);

    // Load the dynamically created block
    await loadBlock(newBlock);
  }));

  // Create previous and next action buttons
  const actions = document.createElement('div');
  actions.className = 'cmp-carousel__actions';
  actions.innerHTML = `
    <button class="cmp-carousel__action cmp-carousel__action--previous" type="button" aria-label="Previous" data-cmp-hook-carousel="previous">
      <span class="cmp-carousel__action-icon wkndicon-left-arrow"></span>
      <span class="cmp-carousel__action-text">Previous</span>
    </button>
    <button class="cmp-carousel__action cmp-carousel__action--next" type="button" aria-label="Next" data-cmp-hook-carousel="next">
      <span class="cmp-carousel__action-icon wkndicon-right-arrow"></span>
      <span class="cmp-carousel__action-text">Next</span>
    </button>
  `;

  // Assemble the carousel structure
  carouselWrapper.append(carouselContent, actions, indicators);
  block.replaceChildren(carouselWrapper);

  // === Carousel Navigation Logic ===

  let currentIndex = 0; // Track the currently active slide

  // Function to navigate to a specific slide
  function goToSlide(index) {
    if (index < 0 || index >= slides.length) return;

    // Update slide and tab active states
    slides[currentIndex].classList.remove('cmp-carousel__item--active');
    tabs[currentIndex].classList.remove('cmp-carousel__indicator--active');
    slides[index].classList.add('cmp-carousel__item--active');
    tabs[index].classList.add('cmp-carousel__indicator--active');

    currentIndex = index;
  }

  // Setup click listeners for "Next" and "Previous" buttons
  actions.querySelector('[data-cmp-hook-carousel="next"]').addEventListener('click', () => {
    goToSlide((currentIndex + 1) % slides.length);
  });

  actions.querySelector('[data-cmp-hook-carousel="previous"]').addEventListener('click', () => {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  });

  // Setup click listeners for each indicator/tab
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => {
      goToSlide(i);
    });
  });
}
