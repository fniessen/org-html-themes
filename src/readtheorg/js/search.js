// -*- mode: js -*-

// read-the-org-search

// Configuration
const SEARCH_VERSION = 'v1.12';
const MINIMUM_SEARCH_LENGTH = 3;
const SEARCH_DEBOUNCE_DELAY = 300;
const SEARCH_SCROLL_OFFSET = 50;
const SEARCH_SCROLL_DURATION = 500;
const SEARCH_SNIPPET_LENGTH = 100;

// Default configuration
window.searchConfig = {
  enableSearch: true,
  searchResultLimit: 0,
};

/**
 * Enables the search feature.
 */
function enableSearch() {
  window.searchConfig.enableSearch = true;
}

/**
 * Disables the search feature.
 */
function disableSearch() {
  window.searchConfig.enableSearch = false;
}

/**
 * Sets the maximum number of displayed search results.
 *
 * A value of 0 disables the limit.
 *
 * @param {number} searchResultLimit
 */
function setSearchLimit(searchResultLimit) {
  const normalizedLimit = Number(searchResultLimit);

  window.searchConfig.searchResultLimit =
    Number.isFinite(normalizedLimit) && normalizedLimit >= 0
      ? Math.floor(normalizedLimit)
      : 0;
}

console.log(`custom-search.js ${SEARCH_VERSION} is being loaded`);

$(document).ready(() => {
  console.log(`Document ready, initializing search ${SEARCH_VERSION}`);

  const {
    enableSearch: isSearchEnabled,
    searchResultLimit,
  } = window.searchConfig;

  if (!isSearchEnabled) {
    console.log('Search functionality is disabled');
    return;
  }

  const $tableOfContents = $('#table-of-contents');
  const $content = $('#content');

  if (!$tableOfContents.length || !$content.length) {
    console.warn(
      'Search initialization skipped because the table of contents or content container was not found.'
    );
    return;
  }

  $tableOfContents.prepend(`
    <div id="search-container">
      <input
        id="search-input"
        type="search"
        placeholder="Search doc"
        autocomplete="off"
        aria-controls="search-results"
        aria-describedby="search-description"
      >
      <ul
        id="search-results"
        role="listbox"
        aria-label="Search results"
        hidden
      ></ul>
    </div>
  `);

  const $searchInput = $('#search-input');
  const $searchResults = $('#search-results');
  const $searchDescription = $('#search-description');

  const searchIndex = createSearchIndex($content);

  console.log(`Search index created with ${searchIndex.length} items`);

  $searchInput.on(
    'input',
    debounce(() => {
      performSearch({
        $searchInput,
        $searchResults,
        $searchDescription,
        searchIndex,
        searchResultLimit,
      });
    }, SEARCH_DEBOUNCE_DELAY)
  );

  $searchResults.on('click', 'li[data-search-result]', function () {
    activateSearchResult({
      $result: $(this),
      $content,
      searchTerm: String($searchInput.val() || '').trim(),
    });
  });

  $searchResults.on('keydown', 'li[data-search-result]', function (event) {
    handleSearchResultKeydown(event, $(this));
  });

  console.log(`Search ${SEARCH_VERSION} initialization complete`);
});

/**
 * Creates an index of searchable document elements.
 *
 * @param {JQuery} $content
 * @returns {Array<{text: string, normalizedText: string, element: JQuery}>}
 */
function createSearchIndex($content) {
  const searchIndex = [];

  $content.find('h1, h2, h3, h4, h5, h6, p').each(function () {
    const $element = $(this);
    const text = $element.text().trim();

    if (!text) {
      return;
    }

    searchIndex.push({
      text,
      normalizedText: text.toLocaleLowerCase(),
      element: $element,
    });
  });

  return searchIndex;
}

/**
 * Delays execution until calls have stopped for the specified duration.
 *
 * @param {Function} callback
 * @param {number} delay
 * @returns {Function}
 */
function debounce(callback, delay) {
  let timeoutId;

  return (...args) => {
    window.clearTimeout(timeoutId);

    timeoutId = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };
}

/**
 * Escapes text for safe insertion into HTML.
 *
 * @param {string} text
 * @returns {string}
 */
function escapeHtml(text) {
  return $('<div>').text(text).html();
}

/**
 * Escapes characters that have a special meaning in regular expressions.
 *
 * @param {string} text
 * @returns {string}
 */
function escapeRegularExpression(text) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlights matching text while escaping the original content.
 *
 * @param {string} text
 * @param {string} searchTerm
 * @returns {string}
 */
function highlightText(text, searchTerm) {
  const escapedText = escapeHtml(text);
  const escapedTerm = escapeRegularExpression(escapeHtml(searchTerm));

  if (!escapedTerm) {
    return escapedText;
  }

  const pattern = new RegExp(`(${escapedTerm})`, 'gi');

  return escapedText.replace(pattern, '<mark>$1</mark>');
}

/**
 * Runs a search and renders matching results.
 *
 * @param {Object} options
 * @param {JQuery} options.$searchInput
 * @param {JQuery} options.$searchResults
 * @param {JQuery} options.$searchDescription
 * @param {Array} options.searchIndex
 * @param {number} options.searchResultLimit
 */
function performSearch({
  $searchInput,
  $searchResults,
  $searchDescription,
  searchIndex,
  searchResultLimit,
}) {
  const searchTerm = String($searchInput.val() || '').trim();
  const normalizedSearchTerm = searchTerm.toLocaleLowerCase();

  $searchResults.empty();

  if (!searchTerm) {
    $searchDescription.removeAttr('hidden');
    $searchResults.attr('hidden', true);
    return;
  }

  $searchDescription.attr('hidden', true);
  $searchResults.removeAttr('hidden');

  if (searchTerm.length < MINIMUM_SEARCH_LENGTH) {
    renderStatusMessage(
      $searchResults,
      `Please enter at least ${MINIMUM_SEARCH_LENGTH} characters.`
    );
    return;
  }

  const matches = searchIndex.filter(({ normalizedText }) =>
    normalizedText.includes(normalizedSearchTerm)
  );

  if (!matches.length) {
    renderStatusMessage($searchResults, 'No results found.');
    return;
  }

  const limitedMatches =
    searchResultLimit > 0
      ? matches.slice(0, searchResultLimit)
      : matches;

  limitedMatches.forEach((match) => {
    const snippet =
      match.text.length > SEARCH_SNIPPET_LENGTH
        ? `${match.text.slice(0, SEARCH_SNIPPET_LENGTH)}…`
        : match.text;

    const $result = $('<li>', {
      role: 'option',
      tabindex: -1,
      'data-search-result': '',
      html: highlightText(snippet, searchTerm),
    });

    $result.data('element', match.element);
    $searchResults.append($result);
  });

  $searchResults
    .children('[data-search-result]')
    .first()
    .attr('tabindex', 0);
}

/**
 * Renders a noninteractive status message in the result list.
 *
 * @param {JQuery} $searchResults
 * @param {string} message
 */
function renderStatusMessage($searchResults, message) {
  $searchResults.append(
    $('<li>', {
      role: 'status',
      text: message,
    })
  );
}

/**
 * Activates a search result and moves focus to the matching element.
 *
 * @param {Object} options
 * @param {JQuery} options.$result
 * @param {JQuery} options.$content
 * @param {string} options.searchTerm
 */
function activateSearchResult({
  $result,
  $content,
  searchTerm,
}) {
  const $element = $result.data('element');

  if (!$element || !$element.length) {
    return;
  }

  removeSearchHighlights($content);
  highlightElementText($element, searchTerm);

  const offset = $element.offset();

  if (offset) {
    $('html, body').animate(
      {
        scrollTop: Math.max(0, offset.top - SEARCH_SCROLL_OFFSET),
      },
      SEARCH_SCROLL_DURATION
    );
  }

  $element.attr('tabindex', -1).trigger('focus');
}

/**
 * Removes highlights previously inserted by this search feature.
 *
 * @param {JQuery} $content
 */
function removeSearchHighlights($content) {
  $content.find('mark[data-search-highlight]').each(function () {
    $(this).replaceWith(document.createTextNode($(this).text()));
  });
}

/**
 * Highlights matching text nodes without replacing the element's HTML.
 *
 * @param {JQuery} $element
 * @param {string} searchTerm
 */
function highlightElementText($element, searchTerm) {
  if (!searchTerm) {
    return;
  }

  const pattern = new RegExp(
    escapeRegularExpression(searchTerm),
    'gi'
  );

  highlightTextNodes($element[0], pattern);
}

/**
 * Recursively highlights matching text nodes.
 *
 * @param {Node} node
 * @param {RegExp} pattern
 */
function highlightTextNodes(node, pattern) {
  Array.from(node.childNodes).forEach((childNode) => {
    if (childNode.nodeType === Node.TEXT_NODE) {
      replaceMatchingTextNode(childNode, pattern);
      return;
    }

    if (
      childNode.nodeType === Node.ELEMENT_NODE &&
      childNode.nodeName !== 'MARK'
    ) {
      highlightTextNodes(childNode, pattern);
    }
  });
}

/**
 * Replaces matches inside a text node with marked elements.
 *
 * @param {Text} textNode
 * @param {RegExp} pattern
 */
function replaceMatchingTextNode(textNode, pattern) {
  const text = textNode.nodeValue;
  const matches = Array.from(text.matchAll(pattern));

  if (!matches.length) {
    return;
  }

  const fragment = document.createDocumentFragment();
  let previousIndex = 0;

  matches.forEach((match) => {
    const matchIndex = match.index;

    fragment.append(
      document.createTextNode(
        text.slice(previousIndex, matchIndex)
      )
    );

    const mark = document.createElement('mark');
    mark.dataset.searchHighlight = '';
    mark.textContent = match[0];
    fragment.append(mark);

    previousIndex = matchIndex + match[0].length;
  });

  fragment.append(
    document.createTextNode(text.slice(previousIndex))
  );

  textNode.replaceWith(fragment);
}

/**
 * Handles keyboard interaction for search results.
 *
 * @param {JQuery.Event} event
 * @param {JQuery} $current
 */
function handleSearchResultKeydown(event, $current) {
  let $target;

  switch (event.key) {
    case 'ArrowUp':
      $target = $current.prevAll('[data-search-result]').first();
      break;

    case 'ArrowDown':
      $target = $current.nextAll('[data-search-result]').first();
      break;

    case 'Enter':
    case ' ':
      event.preventDefault();
      $current.trigger('click');
      return;

    case 'Escape':
      $('#search-input').trigger('focus');
      return;

    default:
      return;
  }

  event.preventDefault();

  if (!$target.length) {
    return;
  }

  $current.attr('tabindex', -1);
  $target.attr('tabindex', 0).trigger('focus');
}
