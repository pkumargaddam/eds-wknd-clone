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

    // Create a container for the FAQ block
    const faqContainer = document.createElement('div');
    faqContainer.classList.add('faq-container');

    // Loop through each FAQ item and create the FAQ elements
    items.forEach((item) => {
      const faqItem = document.createElement('div');
      faqItem.classList.add('faq-item');

      // Create the question for the FAQ item
      const question = document.createElement('h3');
      question.classList.add('faq-question');
      question.textContent = item.question || 'No Question Available';

      // Create the answer for the FAQ item
      const answer = document.createElement('p');
      answer.classList.add('faq-answer');
      answer.textContent = item.answer?.plaintext || 'No Answer Available';

      // Append the question and answer to the FAQ item
      faqItem.appendChild(question);
      faqItem.appendChild(answer);

      // Add the FAQ item to the container
      faqContainer.appendChild(faqItem);
    });

    // Append the FAQ container to the block
    block.appendChild(faqContainer);
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
