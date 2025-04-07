export default function decorate(block) {
  block.querySelectorAll('[data-aue-model="accordionitem"]').forEach((item) => {
    const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');
    label.addEventListener('click', () => {
      block.querySelectorAll('[data-aue-model="accordionitem"].open').forEach((openItem) => {
        if (openItem !== item) {
          openItem.classList.remove('open');
        }
      });
      item.classList.toggle('open');
    });
  });
}
