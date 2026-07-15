/**
 * Toggles the expanded state of a table-of-contents entry.
 *
 * @param {HTMLElement} link
 */
function toggleTocEntry(link) {
  /*
   * When a link in the table of contents is clicked, the `active`
   * class is toggled on its parent `li` element. This switches the
   * entry between its collapsed and expanded states.
   */
  $(link).parent().toggleClass('active');
}

/**
 * Replaces exported Org admonition elements with styled titles.
 *
 * @param {string} tag
 * @param {Map<string, Map<string, string>>} translations
 * @param {string} language
 */
function replaceAdmonition(tag, translations, language) {
  const tagTranslations = translations.get(tag);

  if (!tagTranslations) {
    return;
  }

  const readable =
    tagTranslations.get(language) || tagTranslations.get('en') || tag;

  $(`span.${tag}:not(#table-of-contents *)`).each(function () {
    const id = $(this).attr('id') || '';
    const idAttribute = id ? ` id="${id}"` : '';

    $(this)
      .parent()
      .parent()
      .replaceWith(
        `<p${idAttribute} class="admonition-title ${tag}">${readable}</p>`
      );
  });

  $(`div.${tag}`).before(
    `<p class="admonition-title ${tag}">${readable}</p>`
  );
}

/**
 * Initializes translated admonition titles.
 */
function initializeAdmonitions() {
  const language = document.documentElement.lang || 'en';

  const translations = new Map([
    [
      'note',
      new Map([
        ['en', 'Note'],
        ['de', 'Hinweis'],
        ['sv', 'Notera'],
      ]),
    ],
    [
      'seealso',
      new Map([
        ['en', 'See also'],
        ['de', 'Siehe auch'],
        ['sv', 'Se även'],
      ]),
    ],
    [
      'warning',
      new Map([
        ['en', 'Warning'],
        ['de', 'Warnung'],
        ['sv', 'Varning'],
      ]),
    ],
    [
      'caution',
      new Map([
        ['en', 'Caution'],
        ['de', 'Vorsicht'],
        ['sv', 'Var försiktig'],
      ]),
    ],
    [
      'attention',
      new Map([
        ['en', 'Attention'],
        ['de', 'Obacht'],
        ['sv', 'Var uppmärksam'],
      ]),
    ],
    [
      'tip',
      new Map([
        ['en', 'Tip'],
        ['de', 'Tipp'],
        ['sv', 'Tips'],
      ]),
    ],
    [
      'important',
      new Map([
        ['en', 'Important'],
        ['de', 'Wichtig'],
        ['sv', 'Viktigt'],
      ]),
    ],
    [
      'hint',
      new Map([
        ['en', 'Hint'],
        ['de', 'Hinweis'],
        ['sv', 'Ledtråd'],
      ]),
    ],
    [
      'error',
      new Map([
        ['en', 'Error'],
        ['de', 'Fehler'],
        ['sv', 'Fel'],
      ]),
    ],
    [
      'danger',
      new Map([
        ['en', 'Danger'],
        ['de', 'Gefahr'],
        ['sv', 'Fara'],
      ]),
    ],
  ]);

  translations.forEach((_tagTranslations, tag) => {
    replaceAdmonition(tag, translations, language);
  });
}

/**
 * Initializes responsive navigation behavior.
 */
function initializeNavigation() {
  $(document).on('click', '[data-toggle="wy-nav-top"]', () => {
    $('[data-toggle="wy-nav-shift"]').toggleClass('shift');
    $('[data-toggle="rst-versions"]').toggleClass('shift');
  });

  $(document).on(
    'click',
    '.wy-menu-vertical .current ul li a',
    () => {
      $('[data-toggle="wy-nav-shift"]').removeClass('shift');
      $('[data-toggle="rst-versions"]').removeClass('shift');
    }
  );

  $(document).on('click', '[data-toggle="rst-current-version"]', () => {
    $('[data-toggle="rst-versions"]').toggleClass('shift-up');
  });
}

/**
 * Wraps exported documentation tables in responsive containers.
 */
function initializeResponsiveTables() {
  $('table.docutils:not(.field-list)').each(function () {
    if (!$(this).parent().hasClass('wy-table-responsive')) {
      $(this).wrap('<div class="wy-table-responsive"></div>');
    }
  });
}

/**
 * Initializes the table of contents and ScrollSpy.
 */
function initializeTableOfContents() {
  const $tableOfContents = $('#table-of-contents');
  const $textTableOfContents = $('#text-table-of-contents');
  const $postamble = $('#postamble');

  $textTableOfContents.find('ul').first().addClass('nav');

  /*
   * ScrollSpy requires the table of contents to use a Bootstrap
   * navigation component.
   */
  $('body').scrollspy({
    target: '#text-table-of-contents',
  });
  $('body').scrollspy('refresh');

  /*
   * Sticky table headers are intentionally disabled.
   *
   * $('table').stickyTableHeaders();
   */

  // Set the bottom padding so the TOC does not overlap the postamble.
  if ($postamble.length && $tableOfContents.length) {
    $tableOfContents.css({
      paddingBottom: $postamble.outerHeight(),
    });
  }

  /*
   * Show the vertical scrollbar only when the table of contents exceeds the
   * available height.
   */
  function updateTocScrollbar() {
    if (!$tableOfContents.length) {
      return;
    }

    const tocElement = $tableOfContents[0];
    const needsScrollbar =
        tocElement.scrollHeight > tocElement.clientHeight + 1;

    $tableOfContents.css(
      'overflow-y',
      needsScrollbar ? 'auto' : 'hidden'
    );
  }

  /*
   * Delay the scrollbar computation until after the browser has completed
   * layout and ScrollSpy has updated the active TOC entry.
   * Two animation frames ensure all layout changes have settled.
   */
  function scheduleTocScrollbarUpdate() {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(updateTocScrollbar);
    });
  }

  // Perform the initial scrollbar computation.
  scheduleTocScrollbarUpdate();

  // Recompute the scrollbar when the viewport size changes.
  $(window)
    .off('resize.readtheorg')
    .on('resize.readtheorg', scheduleTocScrollbarUpdate);

  /*
   * Recompute the scrollbar whenever the TOC structure or its CSS
   * classes change (for example, when expanding or collapsing
   * sections).
   */
  const tocObserver = new MutationObserver(scheduleTocScrollbarUpdate);

  tocObserver.observe($tableOfContents[0], {
    attributes: true,
    childList: true,
    subtree: true,
    attributeFilter: ['class', 'style'],
  });

  // Add TOC button.
  if (!$('#toggle-sidebar').length) {
    const $toggleSidebar = $(
      '<div id="toggle-sidebar">' +
        '<a href="#table-of-contents">' +
          '<h2>Table of Contents</h2>' +
        '</a>' +
      '</div>'
    );

    $('#content').prepend($toggleSidebar);
  }

  const $tocTitle = $tableOfContents.find('h2');

  if ($tocTitle.length && !$tocTitle.find('.close-sidebar').length) {
    $tocTitle.append(
      '<a class="close-sidebar" href="#">Close</a>'
    );
  }
}

$(document).ready(() => {
  $('#text-table-of-contents').on('click', 'a', function () {
    toggleTocEntry(this);
  });

  initializeAdmonitions();
  initializeNavigation();
  initializeResponsiveTables();
  initializeTableOfContents();
});

window.SphinxRtdTheme = ((jquery) => {
  const stickyNav = (() => {
    const stickyNavClass = 'stickynav';

    let $navBar;
    let $window;

    function applyStickyNav() {
      if (!$navBar || !$navBar.length) {
        return;
      }

      if ($navBar.height() <= $window.height()) {
        $navBar.addClass(stickyNavClass);
      } else {
        $navBar.removeClass(stickyNavClass);
      }
    }

    function initialize() {
      $navBar = jquery('nav.wy-nav-side:first');
      $window = jquery(window);
    }

    function enable() {
      applyStickyNav();
      $window.on('resize', applyStickyNav);
    }

    jquery(initialize);

    return {
      enable,
    };
  })();

  return {
    StickyNav: stickyNav,
  };
})(jQuery);
