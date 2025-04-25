import { loadBlock } from '../../scripts/aem.js'; // or wherever your loadBlock lives

export default async function decorate(block) {
  const rawBlocks = [...block.children].filter((childDiv) => {
    const marker = childDiv.querySelector(':scope > div:first-child > p');
    return marker && marker.textContent.trim().length > 0;
  });

  await Promise.all(rawBlocks.map(async (rawBlock) => {
    const rows = [...rawBlock.children];
    const configText = rows[0]?.querySelector('p')?.textContent.trim() || '';
    const blockNames = configText.split(',').map((name) => name.trim()).filter(Boolean);

    if (blockNames.length === 0) return;

    const primaryBlock = blockNames[0];

    // Create a new block and preserve original attributes
    const newBlock = document.createElement('div');
    newBlock.append(...rows.slice(1)); // skip the config row

    // Copy data-aue-* attributes from rawBlock to newBlock
    [...rawBlock.attributes].forEach((attr) => {
      if (attr.name.startsWith('data-aue')) {
        newBlock.setAttribute(attr.name, attr.value);
      }
    });

    // Add standard block classes and metadata
    newBlock.classList.add(...blockNames, 'block');
    newBlock.dataset.blockName = primaryBlock;

    // Replace raw block in DOM
    rawBlock.replaceWith(newBlock);

    // Load block (CSS + JS + decorator if available)
    await loadBlock(newBlock);
  }));
}
