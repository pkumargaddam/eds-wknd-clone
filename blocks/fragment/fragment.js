/* eslint-disable no-underscore-dangle */

export default async function decorate(block) {
  try {
    // Fetching tag and variation values from the block's children (if any)
    const props = [...block.children];
    const tag = props[0]?.textContent.trim() || 'transactions'; // Default tag is 'transactions'
    const variation = props[1]?.textContent.trim() || 'master'; // Default variation is 'master'

    // Construct the GraphQL query URL with tag and variation
    const graphqlURL = 'https://author-p51328-e442308.adobeaemcloud.com/graphql/execute.json/eds-wknd/faqs';
    const cachebuster = Math.floor(Math.random() * 1000); // Cache busting for fresh data

    // Pass `tag` and `variation` as query parameters
    const url = `${graphqlURL}?ts=${cachebuster}&tag=${tag}&variation=${variation}`;

    // Fetching the FAQ data
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const faqResponse = await fetch(url, options);
    if (!faqResponse.ok) {
      throw new Error('Failed to fetch FAQ data');
    }

    const faqData = await faqResponse.json();

    // Render the FAQ list
    let itemsHTML = '';
    faqData.data.faqModelList.items.forEach((item) => {
      itemsHTML += `
        <li>
          <details class="faq-details">
            <summary class="faq-heading">
              <span class="faq-question">${item.question}</span>
              <b></b>
            </summary>
            <div class="faq-description">${item.answer.plaintext}</div>
          </details>
        </li>
      `;
    });

    // Updating the block's HTML with the FAQ list
    block.innerHTML = `
      <h2 class="section-heading">Frequently Asked Questions</h2>
      <ul class="faq-list">
        ${itemsHTML}
      </ul>
    `;
  } catch (error) {
    console.error('Error fetching FAQ data:', error);
    block.innerHTML = '<p>Failed to load FAQ data. Please try again later.</p>';
  }
}
