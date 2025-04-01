// Wait for the document to load
document.addEventListener('DOMContentLoaded', function() {
  // Create a new button element
  var backToTopButton = document.createElement('button');
  backToTopButton.id = 'backToTop';
  backToTopButton.textContent = '▲';

  // Style the button with JavaScript
  backToTopButton.style.position = 'fixed';
  backToTopButton.style.bottom = '20px';
  backToTopButton.style.right = '20px';
  backToTopButton.style.zIndex = '100'; // Ensure it's above other elements
  backToTopButton.style.padding = '10px 15px';
  backToTopButton.style.margin= '0px 15px';
  backToTopButton.style.fontSize = '16px';
  backToTopButton.style.backgroundColor = '#00AB6B';
  backToTopButton.style.color = 'white';
  backToTopButton.style.border = 'none';
  backToTopButton.style.borderRadius = '5px';
  backToTopButton.style.cursor = 'pointer';
  backToTopButton.style.display = 'none'; // Initially hidden

  // Add hover effect
  backToTopButton.onmouseover = function() {
    backToTopButton.style.backgroundColor = '#00DD6B 00AB6B';
  };

  backToTopButton.onmouseout = function() {
    backToTopButton.style.backgroundColor = '#00AB6B';
  };

  // Append the button to the body
  document.body.appendChild(backToTopButton);

  // Function to show or hide the button
  function toggleBackToTopButton() {
    if (window.scrollY > 0) {
      backToTopButton.style.display = 'block'; // Show the button when scrolling down
    } else {
      backToTopButton.style.display = 'none'; // Hide the button when at the top
    }
  }

  // Scroll smoothly to the top when the button is clicked
  backToTopButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  // Listen to scroll events
  window.addEventListener('scroll', toggleBackToTopButton);
  
  // Initial check to show/hide button when the page first loads
  toggleBackToTopButton();
});
