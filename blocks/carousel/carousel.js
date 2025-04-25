// export default async function decorate(block) {
//   const rawBlocks = [...block.children].filter((childDiv) => {
//     const marker = childDiv.querySelector(':scope > div:first-child > p');
//     return marker && marker.textContent.trim().length > 0;
//   });

//   await Promise.all(rawBlocks.map(async (rawBlock) => {
//     const rows = [...rawBlock.children];
//     const configText = rows[0]?.querySelector('p')?.textContent.trim() || '';
//     const blockNames = configText.split(',').map((name) => name.trim()).filter(Boolean);

//     if (blockNames.length === 0) return;

//     const primaryBlock = blockNames[0]; // e.g., 'teaser' or 'hero'

//     // Create new trimmed block without config row
//     const newBlock = document.createElement('div');
//     newBlock.append(...rows.slice(1));

//     // Add classes and metadata
//     newBlock.classList.add(...blockNames, 'block');
//     newBlock.dataset.blockName = primaryBlock;
//     newBlock.dataset.blockStatus = 'loaded';

//     // Replace raw block in DOM
//     rawBlock.replaceWith(newBlock);

//     try {
//       // Dynamically load the block's decorator
//       const mod = await import(`../${primaryBlock}/${primaryBlock}.js`);
//       await mod.default(newBlock);
//     } catch (e) {
//       console.warn(`No decorator found for block: ${primaryBlock}`, e);
//     }
//   }));
// }
