function collapse_toc_elements_on_click (nav_li_a){
    /*
      When an `a' element in the TOC is clicked, its parent
      `li' element's active attribute is toggled.  This causes
      the element to toggle between minimized and maximized
      states.  The active attribute is documented in bootstrap.
      https://getbootstrap.com/docs/4.0/components/navbar/#nav
    */
    $(nav_li_a).parent().toggleClass("active");
}

$( document ).ready(function() {
    // When the document is loaded and ready, bind the
    // function `collapse_toc_elements_on_click' to the
    // `a' elements in the table of contents.
    $("#text-table-of-contents a").click(function() {
        collapse_toc_elements_on_click(this);
    });
});

$(function() {
    function replace_admonition (tag, map, language) {
        var language = document.documentElement.lang;
        var translations = map.get(tag);
        var readable = translations.get(language) || translations.get("en"); // fallback to english
        $(`span.${tag}:not(#table-of-contents *)`) .parent().parent()
            .replaceWith(`<p id='${this.id}' class='admonition-title ${tag}'>${readable}</p>`);
        $(`div.${tag}`).before(`<p class='admonition-title ${tag}'>${readable}</p>`)
    }
    const map = new Map()
          .set("note", new Map()
               .set("en", "Note")
               .set("de", "Hinweis"))
          .set("seealso", new Map()
               .set("en", "See also")
               .set("de", "Siehe auch"))
          .set("warning", new Map()
               .set("en", "Warning")
               .set("de", "Warnung"))
          .set("caution", new Map()
               .set("en", "Caution")
               .set("de", "Vorsicht"))
          .set("attention", new Map()
               .set("en", "Attention")
               .set("de", "Obacht"))
          .set("tip", new Map()
               .set("en", "Tip")
               .set("de", "Tipp"))
          .set("important", new Map()
               .set("en", "Important")
               .set("de", "Wichtig"))
          .set("hint", new Map()
               .set("en", "Hint")
               .set("de", "Hinweis"))
          .set("error", new Map()
               .set("en", "Error")
               .set("de", "Fehler"))
          .set("danger", new Map()
               .set("en", "Danger")
               .set("de", "Gefahr"))
    ;
    replace_admonition('note', map);
    replace_admonition('seealso', map);
    replace_admonition('warning', map);
    replace_admonition('caution', map);
    replace_admonition('attention', map);
    replace_admonition('tip', map);
    replace_admonition('important', map);
    replace_admonition('hint', map);
    replace_admonition('error', map);
    replace_admonition('danger', map);
});

$( document ).ready(function() {

    // Shift nav in mobile when clicking the menu.
    $(document).on('click', "[data-toggle='wy-nav-top']", function() {
      $("[data-toggle='wy-nav-shift']").toggleClass("shift");
      $("[data-toggle='rst-versions']").toggleClass("shift");
    });
    // Close menu when you click a link.
    $(document).on('click', ".wy-menu-vertical .current ul li a", function() {
      $("[data-toggle='wy-nav-shift']").removeClass("shift");
      $("[data-toggle='rst-versions']").toggleClass("shift");
    });
    $(document).on('click', "[data-toggle='rst-current-version']", function() {
      $("[data-toggle='rst-versions']").toggleClass("shift-up");
    });
    // Make tables responsive
    $("table.docutils:not(.field-list)").wrap("<div class='wy-table-responsive'></div>");
});

$( document ).ready(function() {
    $('#text-table-of-contents ul').first().addClass('nav');
                                        // ScrollSpy also requires that we use
                                        // a Bootstrap nav component.
    $('body').scrollspy({target: '#text-table-of-contents'});

    // DON'T add sticky table headers (Fix issue #69?)
    // $('table').stickyTableHeaders();

    // set the height of tableOfContents
    var $postamble = $('#postamble');
    var $tableOfContents = $('#table-of-contents');
    $tableOfContents.css({paddingBottom: $postamble.outerHeight()});

    // add TOC button
    var toggleSidebar = $('<div id="toggle-sidebar"><a href="#table-of-contents"><h2>Table of Contents</h2></a></div>');
    $('#content').prepend(toggleSidebar);

    // add close button when sidebar showed in mobile screen
    var closeBtn = $('<a class="close-sidebar" href="#">Close</a>');
    var tocTitle = $('#table-of-contents').find('h2');
    tocTitle.append(closeBtn);
});

window.SphinxRtdTheme = (function (jquery) {
    var stickyNav = (function () {
        var navBar,
            win,
            stickyNavCssClass = 'stickynav',
            applyStickNav = function () {
                if (navBar.height() <= win.height()) {
                    navBar.addClass(stickyNavCssClass);
                } else {
                    navBar.removeClass(stickyNavCssClass);
                }
            },
            enable = function () {
                applyStickNav();
                win.on('resize', applyStickNav);
            },
            init = function () {
                navBar = jquery('nav.wy-nav-side:first');
                win    = jquery(window);
            };
        jquery(init);
        return {
            enable : enable
        };
    }());
    return {
        StickyNav : stickyNav
    };
}($));
