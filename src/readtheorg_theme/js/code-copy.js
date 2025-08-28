/**
 * Code Copy Button Functionality
 * Adds copy buttons to code blocks for easy clipboard copying
 */

document.addEventListener('DOMContentLoaded', function() {
    // Add copy button to all code blocks
    const codeBlocks = document.querySelectorAll('pre.src, .org-src-container pre');
    
    codeBlocks.forEach(function(codeBlock) {
        // Create copy button
        const copyButton = document.createElement('button');
        copyButton.className = 'copy-code-button';
        copyButton.textContent = 'Copy';
        copyButton.setAttribute('aria-label', 'Copy code to clipboard');
        
        // Position the button
        const container = codeBlock.closest('.org-src-container') || codeBlock.parentElement;
        container.style.position = 'relative';
        container.appendChild(copyButton);
        
        // Add click handler
        copyButton.addEventListener('click', function() {
            // Get the code text
            let codeText = codeBlock.textContent || codeBlock.innerText;
            
            // Remove line numbers if present (format: "  1: " or " 123: ")
            const lines = codeText.split('\n');
            const cleanedLines = lines.map(line => {
                return line.replace(/^\s*\d+:\s/, '');
            });
            codeText = cleanedLines.join('\n').trim();
            
            // Copy to clipboard
            if (navigator.clipboard && window.isSecureContext) {
                // Use modern clipboard API
                navigator.clipboard.writeText(codeText).then(function() {
                    showCopyFeedback(copyButton, true);
                }).catch(function(err) {
                    console.error('Failed to copy: ', err);
                    fallbackCopy(codeText, copyButton);
                });
            } else {
                // Fallback for older browsers or non-HTTPS
                fallbackCopy(codeText, copyButton);
            }
        });
    });
    
    // Show copy feedback
    function showCopyFeedback(button, success) {
        const originalText = button.textContent;
        button.textContent = success ? 'Copied!' : 'Failed';
        button.classList.add(success ? 'copied' : 'failed');
        
        setTimeout(function() {
            button.textContent = originalText;
            button.classList.remove('copied', 'failed');
        }, 2000);
    }
    
    // Fallback copy method using textarea
    function fallbackCopy(text, button) {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
            const successful = document.execCommand('copy');
            showCopyFeedback(button, successful);
        } catch (err) {
            console.error('Fallback copy failed: ', err);
            showCopyFeedback(button, false);
        }
        
        document.body.removeChild(textArea);
    }
});