export default function decorate(block) {
  // Extract data from block children
  const data = {
    title: '',
    titleType: 'h2',
    linkAlignment: 'left',
    linkColors: 'black',
    linkVariations: 'default',
  };

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    if (cells.length >= 1) data.title = cells[0].textContent?.trim() || data.title;
    if (cells.length >= 2) data.titleType = cells[1].textContent?.trim() || data.titleType;
    if (cells.length >= 3) data.linkAlignment = cells[2].textContent?.trim() || data.linkAlignment;
    if (cells.length >= 4) data.linkColors = cells[3].textContent?.trim() || data.linkColors;
    // eslint-disable-next-line max-len
    if (cells.length >= 5) data.linkVariations = cells[4].textContent?.trim() || data.linkVariations;
  });

  // Create heading element based on selected titleType
  const heading = document.createElement(data.titleType);
  heading.textContent = data.title;

  // Add classes based on dropdown values
  heading.classList.add(
    `align-${data.linkAlignment}`,
    `color-${data.linkColors}`,
    `variation-${data.linkVariations}`,
  );

  // Clear and append
  block.textContent = '';
  block.append(heading);
}
