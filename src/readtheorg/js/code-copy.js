/**
 * Code Copy Button Functionality
 * Adds copy buttons to code blocks for easy clipboard copying.
 */

document.addEventListener('DOMContentLoaded', () => {
  const codeBlocks = document.querySelectorAll(
    'pre.src, .org-src-container pre'
  );

  codeBlocks.forEach((codeBlock) => {
    // Create copy button.
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-code-button';
    copyButton.type = 'button';
    copyButton.textContent = 'Copy';
    copyButton.setAttribute('aria-label', 'Copy code to clipboard');

    // Position the button.
    const container =
      codeBlock.closest('.org-src-container') || codeBlock.parentElement;

    if (!container) {
      return;
    }

    container.style.position = 'relative';
    container.appendChild(copyButton);

    // Add click handler.
    copyButton.addEventListener('click', async () => {
      const codeText = cleanCodeText(codeBlock);

      try {
        await copyText(codeText);
        showCopyFeedback(copyButton, true);
      } catch (error) {
        console.error('Failed to copy code:', error);
        showCopyFeedback(copyButton, false);
      }
    });
  });
});

/**
 * Extracts and cleans text from a code block.
 *
 * @param {HTMLElement} codeBlock
 * @returns {string}
 */
function cleanCodeText(codeBlock) {
  const codeText = codeBlock.textContent || codeBlock.innerText || '';

  return codeText
    .split('\n')
    .map((line) => line.replace(/^\s*\d+:\s/, ''))
    .join('\n')
    .trim();
}

/**
 * Copies text using the Clipboard API, with a fallback for older browsers.
 *
 * @param {string} text
 * @returns {Promise<void>}
 */
async function copyText(text) {
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(text);
    return;
  }

  fallbackCopy(text);
}

/**
 * Copies text using a temporary textarea.
 *
 * @param {string} text
 */
function fallbackCopy(text) {
  const textArea = document.createElement('textarea');

  textArea.value = text;
  textArea.setAttribute('readonly', '');
  textArea.style.position = 'fixed';
  textArea.style.top = '0';
  textArea.style.left = '-9999px';

  document.body.appendChild(textArea);
  textArea.select();

  const successful = document.execCommand('copy');

  document.body.removeChild(textArea);

  if (!successful) {
    throw new Error('The fallback copy command failed.');
  }
}

/**
 * Displays temporary feedback on the copy button.
 *
 * @param {HTMLButtonElement} button
 * @param {boolean} success
 */
function showCopyFeedback(button, success) {
  const originalText = button.textContent;

  button.textContent = success ? 'Copied!' : 'Failed';
  button.classList.add(success ? 'copied' : 'failed');

  window.setTimeout(() => {
    button.textContent = originalText;
    button.classList.remove('copied', 'failed');
  }, 2000);
}
