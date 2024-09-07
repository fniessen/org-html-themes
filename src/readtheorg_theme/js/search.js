// -*- mode: js2 -*-

// readh-the-org-search v1.8

console.log('custom-search.js v1.8 is being loaded');

$(document).ready(function() {
  console.log('Document ready, initializing search functionality v1.8');

  $('#table-of-contents').prepend(`
    <div id="search-container">
      <label for="search-input" class="sr-only">Search document</label>
      <input type="text" id="search-input" placeholder="Search..." aria-describedby="search-description">
      <div id="search-description" class="sr-only">Type to search the document. Use arrow keys to navigate results.</div>
      <ul id="search-results" role="listbox" aria-label="Search results"></ul>
    </div>
  `);

  const searchInput = $('#search-input');
  const searchResults = $('#search-results');
  const searchDescription = $('#search-description');
  const content = $('#content');
  let searchIndex = [];

  function createSearchIndex() {
    console.log('Creating search index');
    content.find('h1, h2, h3, h4, h5, h6, p').each(function() {
      const element = $(this);
      const text = element.text().trim();
      if (text) {
        searchIndex.push({
          text: text.toLowerCase(),
          element: element,
          type: element.prop('tagName').toLowerCase()
        });
      }
    });
    console.log(`Search index created with ${searchIndex.length} items`);
  }

  createSearchIndex();

  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  function highlightText(text, term) {
    const regex = new RegExp(`(${term})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  function performSearch() {
    const searchTerm = searchInput.val().toLowerCase();
    searchResults.empty();

    if (searchTerm.length === 0) {
      searchDescription.show();
      searchResults.hide();
      return;
    }

    searchDescription.hide();
    searchResults.show();

    if (searchTerm.length < 3) {
      searchResults.html('<li>Please enter at least 3 characters</li>');
      return;
    }

    const matches = searchIndex.filter(item => item.text.includes(searchTerm));

    if (matches.length === 0) {
      searchResults.append('<li>No results found</li>');
      return;
    }

    matches.slice(0, 10).forEach((match, index) => {
      const snippet = match.text.length > 100 ? match.text.substr(0, 100) + '...' : match.text;
      const highlightedSnippet = highlightText(snippet, searchTerm);
      const li = $(`<li role="option" tabindex="-1">${highlightedSnippet}</li>`);
      li.data('element', match.element);
      searchResults.append(li);
    });

    searchResults.children().first().attr('tabindex', '0');
  }

  const debouncedSearch = debounce(performSearch, 300);

  searchInput.on('input', debouncedSearch);

  searchResults.on('click keypress', 'li', function(e) {
    if (e.type === 'click' || (e.type === 'keypress' && e.which === 13)) {
      const element = $(this).data('element');
      const searchTerm = searchInput.val();

      // Remove existing highlights
      content.find('mark').each(function() {
        const text = $(this).text();
        $(this).replaceWith(text);
      });

      // Highlight all occurrences
      element.html(highlightText(element.text(), searchTerm));

      // Scroll to element
      $('html, body').animate({
        scrollTop: element.offset().top - 50
      }, 500);

      // Set focus to the highlighted element
      element.attr('tabindex', '-1').focus();
    }
  });

  // Keyboard navigation for search results
  searchResults.on('keydown', 'li', function(e) {
    const current = $(this);
    let target;

    switch(e.which) {
      case 38: // Up arrow
        target = current.prev();
        break;
      case 40: // Down arrow
        target = current.next();
        break;
      default: return;
    }

    if (target.length > 0) {
      current.attr('tabindex', '-1');
      target.attr('tabindex', '0').focus();
    }

    e.preventDefault();
  });

  console.log('Search functionality v1.8 initialization complete');
});
