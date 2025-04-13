export default function decorate(block) {
  const buttonTextElement = block.querySelector('div > div > p');
  const linkElement = block.querySelector('.button-container a') || block.querySelector('a');

  if (buttonTextElement && linkElement) {
    const buttonText = buttonTextElement.textContent?.trim() || 'Click me';
    const buttonLink = linkElement.getAttribute('href') || '#';

    // Get alignment value from data attribute (authored via model)
    const alignmentClass = block.dataset.alignment || ''; // expects data-alignment="btn-left-align"

    // Create new button structure
    const buttonContainer = document.createElement('p');
    buttonContainer.className = `button-container ${alignmentClass}`.trim();

    const buttonLinkElement = document.createElement('a');
    buttonLinkElement.href = buttonLink;
    buttonLinkElement.className = 'button';
    buttonLinkElement.textContent = buttonText;

    // Append link inside paragraph
    buttonContainer.appendChild(buttonLinkElement);

    // Clear block and append the new button structure
    block.innerHTML = '';
    block.appendChild(buttonContainer);
  }
}
