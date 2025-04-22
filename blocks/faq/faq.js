/* eslint-disable no-underscore-dangle */
export default async function decorate(block) {
  // Directly use the GraphQL endpoint URL
  const url = 'https://author-p51328-e442308.adobeaemcloud.com/graphql/execute.json/eds-wknd/faqs';

  // Prepare the GraphQL query
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query: `
          query {
            faqModelList {
              items {
                question
                answer {
                  plaintext
                }
              }
            }
          }
        `,
    }),
  };

  // Fetch the FAQ data from the GraphQL endpoint
  const faqResponse = await fetch(url, options);
  const index = await faqResponse.json();

  // Construct the FAQ items HTML
  let itemsHTML = '';
  index.data.faqModelList.items.forEach((item) => {
    itemsHTML += `
        <li>
          <details class="faq-details">
            <summary class="faq-heading">
              <span>${item.question}</span>
              <b></b>
            </summary>
            <div class="faq-description">${item.answer.plaintext}</div>
          </details>
        </li>`;
  });

  // Inject the FAQ content into the block element
  block.innerHTML = `
      <h2 class='section-heading'>Frequently Asked Questions</h2>
      <ul class="faq-list">
        ${itemsHTML}
      </ul>`;
}
