export default async function decorate(block) {
  const endpoint = 'https://author-p51328-e442308.adobeaemcloud.com/graphql/execute.json/eds-wknd/faqs';
  const url = `${endpoint}?ts=${Date.now()}`;

  try {
    const res = await fetch(url);
    const json = await res.json();
    const items = json?.data?.faqModelList?.items || [];

    if (!items.length) {
      block.innerHTML = '<p>No FAQs found.</p>';
      return;
    }

    const listItems = items.map((item) => `
        <li class="faq-item">
          <details class="faq-details">
            <summary class="faq-heading">
              <span>${item.question}</span>
              <b></b>
            </summary>
            <div class="faq-description">
              ${item.answer?.plaintext || ''}
            </div>
          </details>
        </li>
      `).join('');

    block.innerHTML = `
        <h2 class="section-heading">Frequently Asked Questions</h2>
        <ul class="faq-list">${listItems}</ul>
      `;
  } catch (error) {
    console.error('Error loading FAQs:', error);
    block.innerHTML = '<p>Unable to load FAQ data. Please try again later.</p>';
  }
}
