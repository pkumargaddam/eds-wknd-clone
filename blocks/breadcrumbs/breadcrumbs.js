/**
 * @param {HTMLElement} $block
 */
export default function decorate($block) {
  const rows = [...$block.children];
  const $ul = document.createElement('ul');

  rows.forEach((row) => {
    const cells = [...row.children];
    const text = cells[0]?.textContent?.trim();
    const link = cells[1]?.textContent?.trim();

    const $li = document.createElement('li');

    if (link) {
      const $a = document.createElement('a');
      $a.href = link;
      $a.textContent = text;
      $li.appendChild($a);
    } else {
      $li.textContent = text;
    }

    $ul.appendChild($li);
  });

  $block.textContent = '';
  $block.appendChild($ul);
}
