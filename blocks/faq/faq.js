/* eslint-disable linebreak-style */
export default async function decorate(block) {
  try {
    // Fetch the FAQ data from the GraphQL API
    const response = await fetch('/graphql/execute.json/eds-wknd/faqs');
    const data = await response.json();

    // Get the FAQ items from the response
    const items = data?.data?.faqModelList?.items || [];

    // Clear existing children (if any)
    block.replaceChildren();

    // Create a container for the FAQ accordion
    const accordionContainer = document.createElement('div');
    accordionContainer.classList.add('faq-accordion-container');

    // Loop through each FAQ item and create the accordion elements
    items.forEach((item, index) => {
      const accordionItem = document.createElement('div');
      accordionItem.classList.add('faq-accordion-item');

      // Create the header for the accordion item (question)
      const header = document.createElement('button');
      header.classList.add('faq-accordion-header');
      header.textContent = item.question || 'No Question Available';
      header.setAttribute('aria-expanded', 'false');
      header.setAttribute('aria-controls', `faq-accordion-item-${index}`);

      // Create the content (answer) for the accordion item
      const content = document.createElement('div');
      content.classList.add('faq-accordion-content');
      content.id = `faq-accordion-item-${index}`;
      content.textContent = item.answer?.plaintext || 'No Answer Available';
      content.style.display = 'none';

      // Add event listener to toggle the accordion visibility
      header.addEventListener('click', () => {
        const isExpanded = header.getAttribute('aria-expanded') === 'true';
        header.setAttribute('aria-expanded', !isExpanded);
        content.style.display = isExpanded ? 'none' : 'block';
      });

      // Append the header and content to the accordion item
      accordionItem.appendChild(header);
      accordionItem.appendChild(content);

      // Add the accordion item to the container
      accordionContainer.appendChild(accordionItem);
    });

    // Append the accordion container to the block
    block.appendChild(accordionContainer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching data:', error);
  }

  // Optional: Log the meta tag information if needed
  const metaTag = document.querySelector('meta[name="cq-tags"]');
  const content = metaTag ? metaTag.getAttribute('content') : null;
  // eslint-disable-next-line no-console
  console.log('AEM TAG: ', content, block);
}
