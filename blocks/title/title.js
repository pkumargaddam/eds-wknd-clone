export default function decorate(block) {
  const heading = block.querySelector('h1, h2, h3, h4, h5, h6');
  if (!heading) return;

  // Get titleVersion from metadata in block's dataset or structured content
  const versionEl = block.querySelector('p:last-child');

  if (versionEl) {
    const version = versionEl.textContent.trim().toLowerCase(); // 'withborder' or 'withoutborder'

    // Add version as a class to the heading
    heading.classList.add(version);

    // Optionally, hide the version text node (used only as data carrier)
    versionEl.style.display = 'none';
  }
}
