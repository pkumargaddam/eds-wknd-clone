/* eslint-disable linebreak-style */
export default async function decorate(block) {
  try {
    const response = await fetch('/graphql/execute.json/eds-wknd/faqs');
    const data = await response.json();

    const faqs = data?.data?.faqModelList?.items || [];

    block.replaceChildren();

    const accordionContainer = document.createElement('div');
    accordionContainer.classList.add('accordion-container');

    faqs.forEach((faq, index) => {
      const accordionItem = document.createElement('div');
      accordionItem.classList.add('accordion-item');

      const questionButton = document.createElement('button');
      questionButton.classList.add('accordion-question');
      questionButton.textContent = faq.question ?? `Question ${index + 1}`;
      questionButton.setAttribute('aria-expanded', 'false');

      const answerDiv = document.createElement('div');
      answerDiv.classList.add('accordion-answer');
      answerDiv.textContent = faq.answer?.plaintext ?? 'No answer available';
      answerDiv.style.display = 'none';

      questionButton.addEventListener('click', () => {
        const isExpanded = questionButton.getAttribute('aria-expanded') === 'true';
        questionButton.setAttribute('aria-expanded', String(!isExpanded));
        answerDiv.style.display = isExpanded ? 'none' : 'block';
      });

      accordionItem.appendChild(questionButton);
      accordionItem.appendChild(answerDiv);
      accordionContainer.appendChild(accordionItem);
    });

    block.appendChild(accordionContainer);
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Error fetching FAQs:', error);
  }
}
