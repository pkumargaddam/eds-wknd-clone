export default function decorate(block) {
  const titleText = block.querySelector('[data-aue-prop="title"]')?.textContent || 'Title';
  const titleType = block.dataset.titleType || 'h2';
  const alignment = block.dataset.linkAlignment || 'center';
  const color = block.dataset.linkColors || 'black';
  const variation = block.dataset.linkVariations || 'default';

  const titleElement = document.createElement(titleType);
  titleElement.className = `wknd-title ${alignment} ${color} ${variation}`;
  titleElement.textContent = titleText;

  // Clear the block and add the styled title
  block.innerHTML = '';
  block.appendChild(titleElement);
}
