export default function decorate(block) {
  // Ensure the block has the correct class
  block.classList.add('accordion');

  // Select all accordion items within this specific block
  block.querySelectorAll('[data-aue-model="accordionitem"]').forEach((item) => {
    const label = item.querySelector('[data-aue-prop="accordionitemlabel"]');

    if (label) {
      label.addEventListener('click', () => {
        // Close other items if single-expand mode is enabled
        const isSingleExpand = block.classList.contains('single-expand');
        if (isSingleExpand) {
          block.querySelectorAll('[data-aue-model="accordionitem"].open').forEach((openItem) => {
            if (openItem !== item) {
              openItem.classList.remove('open');
            }
          });
        }

        // Toggle the clicked item
        item.classList.toggle('open');
      });
    }
  });
}
