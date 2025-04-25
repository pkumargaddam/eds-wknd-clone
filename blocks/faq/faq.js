export default async function decorate(block) {
  const props = [...block.children];
  const firsttag = props[0].textContent.trim();
  const variationname = props[1].textContent.trim() || 'master';
  const cachebuster = Math.floor(Math.random() * 1000);
  const url = `https://author-p51328-e442308.adobeaemcloud.com/graphql/execute.json/eds-wknd/faqs?tag=${firsttag}&variation=${variationname}&ts=${cachebuster}`;
  try {
    // Fetch the FAQ data from the provided URL
    const faq = await fetch(url);
    const indexData = await faq.json(); // Rename index to indexData to avoid shadowing

    let itemsHTML = '';
    // Generate the FAQ accordion items
    indexData.data.faqModelList.items.forEach((item, faqItemIndex) => {
      const id = `faqItem${faqItemIndex}`;

      itemsHTML += `
        <div class="accordion-item">
          <h2 class="accordion-header" id="heading${id}">
            <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#${id}" aria-expanded="false" aria-controls="${id}">
              ${item.question}
            </button>
          </h2>
          <div id="${id}" class="accordion-collapse collapse" aria-labelledby="heading${id}" data-bs-parent="#faqAccordion">
            <div class="accordion-body">
              ${item.answer.plaintext || ''}
            </div>
          </div>
        </div>`;
    });

    // Inject the accordion container and FAQ items into the block
    block.innerHTML = `
      <h2 class="section-heading">Frequently Asked Questions</h2>
      <div class="accordion" id="faqAccordion">
        ${itemsHTML}
      </div>`;
  } catch (error) {
    // Handle the case where the data cannot be fetched
    block.innerHTML = '<p>Failed to load FAQ data.</p>';
  }
}
