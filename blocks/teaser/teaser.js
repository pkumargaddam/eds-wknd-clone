/**
 * @param {HTMLElement} block
 */
async function checkModelInfinityJson(path) {
  const url = `${path}.infinity.json`;

  try {
    const response = await fetch(url, {
      credentials: 'include', // Required for author environments with login
    });

    if (!response.ok) {
      console.error(`Failed to fetch model.infinity.json for ${path} — Status: ${response.status}`);
      return;
    }

    const data = await response.json();
    console.log(`model.infinity.json data for ${path}:`, data);
  } catch (error) {
    console.error(`Error fetching model.infinity.json for ${path}:`, error);
  }
}

export default function decorate(block) {
  console.log('Decorate Block: ', block);

  const path = block.dataset.path || 'https://author-p51328-e442308.adobeaemcloud.com/content/eds-wknd/component';

  console.log(`Checking model.infinity.json for: ${path}`);
  checkModelInfinityJson(path);
}
