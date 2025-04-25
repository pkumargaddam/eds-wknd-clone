import decorateTeaser from '../teaser/teaser.js';

export default async function decorate(block) {
  const rawTeasers = [...block.children].filter((childDiv) => {
    const marker = childDiv.querySelector(':scope > div:first-child > p');
    return marker && marker.textContent.includes('teaser');
  });

  await Promise.all(rawTeasers.map(async (teaserRaw) => {
    const rows = [...teaserRaw.children];

    const configText = rows[0]?.querySelector('p')?.textContent.trim() || '';
    const blockClasses = configText.split(',').map((cls) => cls.trim()).filter(Boolean);

    // Create a new block without the config row
    const teaserBlock = document.createElement('div');
    teaserBlock.append(...rows.slice(1));

    // Apply necessary classes and block attributes
    teaserBlock.classList.add(...blockClasses, 'block');
    teaserBlock.dataset.blockName = 'teaser';
    // teaserBlock.dataset.blockStatus = 'loaded';

    // Replace old raw block
    teaserRaw.replaceWith(teaserBlock);

    // Run the actual teaser decorator
    await decorateTeaser(teaserBlock);
  }));
}
