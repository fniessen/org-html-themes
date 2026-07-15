// hideshow.js --- HideShow JS file
//
// Copyright (C) 2014-2026 Fabrice Niessen. All rights reserved.
//
// This file is free software: you can redistribute it and/or
// modify it under the terms of the GNU General Public License as
// published by the Free Software Foundation, either version 3 of
// the License, or (at your option) any later version.
//
// This file is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
// GNU General Public License for more details.
//
// Author: Fabrice Niessen <(concat "fniessen" at-sign "pirilampo.org")>
// URL: https://github.com/fniessen/hide-show/
// Version: 20140912.1722

// var HS_COLLAPSIBLE_HEADERS = $('h3, h4, h5'); // collapsible headers

if (typeof window.HS_STARTUP_FOLDED === 'undefined') {
    window.HS_STARTUP_FOLDED = false;   // Show just the overview, or show all.
}

if (typeof window.HS_SHOW_ALL_TEXT === 'undefined') {
  window.HS_SHOW_ALL_TEXT = '[Expand all]';
}

if (typeof window.HS_HIDE_ALL_TEXT === 'undefined') {
  window.HS_HIDE_ALL_TEXT = '[Collapse all]';
}

if (typeof window.HS_ALWAYS_DISPLAY_ICON === 'undefined') {
  window.HS_ALWAYS_DISPLAY_ICON = false; // Display an icon for all states, or
                                        // just when closed.
}

if (typeof window.HS_ICON_CLOSED === 'undefined') {
  window.HS_ICON_CLOSED = '&#x25BA;';    // black right-pointing pointer
}

if (typeof window.HS_ICON_OPEN === 'undefined') {
  window.HS_ICON_OPEN = '&#x25BC;';      // black down-pointing triangle
}

if (typeof window.HS_ICON_EMPTY === 'undefined') {
  window.HS_ICON_EMPTY = '&#x25A0;';     // black square
}

if (typeof window.HS_SHOW_ALL_OPEN_DONE_TREES === 'undefined') {
  window.HS_SHOW_ALL_OPEN_DONE_TREES = false; // Expand all will open DONE trees.
}

if (typeof window.HS_CLASS === 'undefined') {
  window.HS_CLASS = 'hsCollapsible';
}

let nbReviewTotalTasks = 0;

/**
 * Returns the first heading directly contained in an outline element.
 *
 * @param {JQuery} $outline
 * @returns {JQuery}
 */
function hsGetHeader($outline) {
  return $outline.children(':header').first();
}

/**
 * Returns whether a heading belongs to a collapsible outline.
 *
 * @param {JQuery} $header
 * @returns {boolean}
 */
function hsIsCollapsible($header) {
  return $header.parent().hasClass(window.HS_CLASS);
}

/**
 * Replaces the current state icon on a heading.
 *
 * @param {JQuery} $header
 * @param {string|null} icon
 */
function hsSetIcon($header, icon) {
  $header.children('.ellipsis').remove();

  if (!icon) {
    return;
  }

  $('<span>', {
    class: 'ellipsis',
    html: ` ${icon}`,
  }).appendTo($header);
}

/**
 * Expands a heading.
 *
 * @param {JQuery} $header
 */
function hsExpand($header) {
  hsExpand2($header, true);
}

/**
 * Expands a heading and optionally allows expansion of DONE entries.
 *
 * @param {JQuery} $header
 * @param {boolean} expandDoneHeader
 */
function hsExpand2($header, expandDoneHeader) {
  if (!hsIsCollapsible($header)) {
    return;
  }

  if (hsIsDoneHeader($header) && !expandDoneHeader) {
    return;
  }

  hsSetIcon(
    $header,
    window.HS_ALWAYS_DISPLAY_ICON ? window.HS_ICON_OPEN : null
  );

  $header
    .parent()
    .removeClass('hsCollapsed')
    .addClass('hsExpanded');

  $header.nextAll().show();
}

/**
 * Expands a heading and all its collapsed ancestors.
 *
 * @param {JQuery} $header
 */
function hsExpandParents($header) {
  hsExpand($header);

  $header.parents('.hsCollapsed').each(function () {
    hsExpand(hsGetHeader($(this)));
  });
}

/**
 * Collapses a heading and all its expanded ancestors.
 *
 * @param {JQuery} $header
 */
function hsCollapseParents($header) {
  hsCollapse($header);

  $header.parents('.hsExpanded').each(function () {
    hsCollapse(hsGetHeader($(this)));
  });
}

/**
 * Collapses a heading.
 *
 * @param {JQuery} $header
 */
function hsCollapse($header) {
  if (!hsIsCollapsible($header)) {
    return;
  }

  hsSetIcon($header, window.HS_ICON_CLOSED);

  $header
    .parent()
    .removeClass('hsExpanded')
    .addClass('hsCollapsed');

  $header.nextAll().hide();
}

/**
 * Toggles a heading between its expanded and collapsed states.
 *
 * @param {JQuery} $header
 */
function hsToggleCollapsing($header) {
  const $parent = $header.parent();

  if ($parent.hasClass('hsCollapsed')) {
    hsExpand($header);
  } else if ($parent.hasClass('hsExpanded')) {
    hsCollapse($header);
  }
}

/**
 * Expands every collapsed outline in the document.
 */
function hsExpandAll() {
  $('#content .hsCollapsed').each(function () {
    hsExpand2(
      hsGetHeader($(this)),
      window.HS_SHOW_ALL_OPEN_DONE_TREES
    );
  });
}

/**
 * Collapses every expanded outline in the document.
 */
function hsCollapseAll() {
  $('#content .hsExpanded').each(function () {
    hsCollapse(hsGetHeader($(this)));
  });
}

/**
 * Collapses every currently visible expanded outline.
 */
function hsCollapseAllVisible() {
  $('#content .hsExpanded:visible').each(function () {
    hsCollapse(hsGetHeader($(this)));
  });
}

/**
 * Returns whether a heading is marked as DONE.
 *
 * @param {JQuery} $header
 * @returns {boolean}
 */
function hsIsDoneHeader($header) {
  return $header.find('span.done').length > 0;
}

/**
 * Applies the default visibility state to a heading.
 *
 * @param {JQuery} $header
 */
function hsSetDefaultVisibility($header) {
  if (window.HS_STARTUP_FOLDED) {
    hsCollapse($header);
    return;
  }

  if (
    !hsIsDoneHeader($header) ||
    window.HS_SHOW_ALL_OPEN_DONE_TREES
  ) {
    hsExpand($header);
  } else {
    hsCollapse($header);
  }
}

/**
 * Initializes collapsible outline entries and global controls.
 */
function hsInit() {
  for (let level = 3; level <= 5; level += 1) {
    $(`#content .outline-${level}`).each(function () {
      const $outline = $(this);
      const $header = hsGetHeader($outline);

      if (!$header.length) {
        return;
      }

      if ($header.siblings().length > 0) {
        $outline.addClass(window.HS_CLASS);
        $header.css('cursor', 'pointer');

        $header.on('click', () => {
          hsToggleCollapsing($header);
        });

        if ($outline.hasClass('hsCollapsed')) {
          hsCollapse($header);
        } else if ($outline.hasClass('hsExpanded')) {
          hsExpand($header);
        } else {
          hsSetDefaultVisibility($header);
        }

        return;
      }

      if (window.HS_ALWAYS_DISPLAY_ICON) {
        hsSetIcon($header, window.HS_ICON_EMPTY);
      }

      $outline.addClass('hsEmpty');
    });
  }

  if (!$('.buttons').length) {
    $('.title').after('<div class="buttons dontprint"></div>');
  }

  const $buttons = $('.buttons');

  $('<button>', {
    type: 'button',
    class: 'hsButton',
    text: window.HS_SHOW_ALL_TEXT,
  })
    .on('click', hsExpandAll)
    .appendTo($buttons);

  $('<button>', {
    type: 'button',
    class: 'hsButton',
    text: window.HS_HIDE_ALL_TEXT,
  })
    .on('click', hsCollapseAll)
    .appendTo($buttons);
}

/**
 * Expands all collapsed parents of an anchor.
 *
 * @param {string|HTMLElement|JQuery} target
 */
function hsExpandAnchor(target) {
  if (!target) {
    return;
  }

  $(target)
    .parents('.hsCollapsed')
    .each(function () {
      hsExpand2(hsGetHeader($(this)), true);
    });
}

/**
 * Returns all visible tasks that can be reviewed.
 *
 * @param {boolean} backward
 * @returns {HTMLElement[]}
 */
function hsGetReviewTasks(backward) {
  const tasks = $('.outline-2:visible span.todo')
    .map(function () {
      return $(this).parent().parent()[0];
    })
    .get();

  return backward ? tasks.reverse() : tasks;
}

/**
 * Starts task review mode.
 */
function hsStartReview() {
  $('body').addClass('hsReviewing');
  $('.hsReviewPanel').addClass('hsReviewing');

  if (!$('#hsOverlay').length) {
    $('body').prepend('<div id="hsOverlay"></div>');
  }

  hsAddReviewingPanels();
  hsCollapseAll();

  $('.outline-2').each(function () {
    const $firstTodo = $(this)
      .find('span.todo:first')
      .parent()
      .parent();

    if (!$firstTodo.length) {
      return;
    }

    $firstTodo.addClass('hsReview');
    hsExpandParents(hsGetHeader($firstTodo));
  });
}

/**
 * Moves to the next or previous task in review mode.
 *
 * @param {boolean} [backward=false]
 */
function hsReviewTaskNext(backward = false) {
  if ($('.outline-2 span.todo').length === 0) {
    return;
  }

  if (!$('body').hasClass('hsReviewing')) {
    hsStartReview();
  } else {
    const tasks = hsGetReviewTasks(backward);
    const currentIndex = tasks.findIndex((task) =>
      $(task).hasClass('hsReview')
    );

    if (currentIndex >= 0 && currentIndex < tasks.length - 1) {
      const $currentTask = $(tasks[currentIndex]);
      const $nextTask = $(tasks[currentIndex + 1]);

      $currentTask.removeClass('hsReview');
      hsCollapseParents(hsGetHeader($currentTask));

      $nextTask.addClass('hsReview');
      hsExpandParents(hsGetHeader($nextTask));
    }

    const activeIndex = tasks.findIndex((task) =>
      $(task).hasClass('hsReview')
    );

    if (activeIndex >= 0) {
      const reviewItem = backward
        ? tasks.length - activeIndex
        : activeIndex + 1;

      $('.outline-2:visible .hsReviewingPanel .hsReviewItem')
        .text(reviewItem);
    }
  }

  const $reviewItem = $('.hsReview:visible').first();
  const offset = $reviewItem.offset();

  if (offset) {
    $('html, body').animate(
      {
        scrollTop: offset.top,
      },
      200
    );
  }
}

/**
 * Moves to the previous review task.
 */
function hsReviewTaskPrev() {
  hsReviewTaskNext(true);
}

/**
 * Stops task review mode.
 */
function hsReviewTaskQuit() {
  $('body').removeClass('hsReviewing');
  $('.hsReviewPanel').removeClass('hsReviewing');
  $('.hsReview').removeClass('hsReview');
  $('#hsOverlay').remove();
  $('.hsReviewingPanel').remove();
}

/**
 * Hides tasks with the specified TODO keyword.
 *
 * @param {string} keyword
 */
function hsHideTodoKeyword(keyword) {
  $(`span.${keyword}`)
    .addClass('hsHidden')
    .parent()
    .parent()
    .hide();
}

/**
 * Shows tasks with the specified TODO keyword.
 *
 * @param {string} keyword
 */
function hsShowTodoKeyword(keyword) {
  $(`span.${keyword}`)
    .removeClass('hsHidden')
    .parent()
    .parent()
    .show();
}

/**
 * Builds a review panel.
 *
 * @param {number} taskCount
 * @returns {JQuery}
 */
function hsCreateReviewPanel(taskCount) {
  const $panel = $('<div>', {
    class: 'hsReviewPanel hsUnselectable',
  });

  $('<span>', {
    text: 'Press r or click here',
  }).appendTo($panel);

  $panel.append('<br>');

  $('<span>', {
    text: `to review ${taskCount} tasks`,
  }).appendTo($panel);

  $panel.append('<br>');

  $('<span>', {
    text: `(out of ${nbReviewTotalTasks} tasks)`,
  }).appendTo($panel);

  $panel.on('click', () => {
    hsReviewTaskNext();
  });

  return $panel;
}

/**
 * Adds inactive review panels to each second-level outline.
 */
function hsAddReviewPanels() {
  $('.outline-2').each(function () {
    const $outline = $(this);
    const taskCount = $outline.find('span.todo').length;

    if (taskCount > 0 && !$outline.children('.hsReviewPanel').length) {
      $outline.prepend(hsCreateReviewPanel(taskCount));
    }
  });
}

/**
 * Creates a clickable review command.
 *
 * @param {string} label
 * @param {Function} callback
 * @returns {JQuery}
 */
function hsCreateReviewButton(label, callback) {
  return $('<button>', {
    type: 'button',
    class: 'hsReviewButton',
    text: label,
  }).on('click', callback);
}

/**
 * Builds the panel displayed during task review.
 *
 * @param {number} taskCount
 * @returns {JQuery}
 */
function hsCreateReviewingPanel(taskCount) {
  const $panel = $('<div>', {
    class: 'hsReviewingPanel hsUnselectable',
  });

  if (taskCount > 0) {
    $panel.append('Reviewing task ');

    $('<span>', {
      class: 'hsReviewItem',
      text: '1',
    }).appendTo($panel);

    $panel.append(` / ${taskCount}`);
  } else {
    $panel.append('No task to review');
  }

  $panel.append('<br>');
  $panel.append(`(out of ${nbReviewTotalTasks} tasks)`);
  $panel.append('<br>');
  $panel.append('Shortcuts: ');

  $panel.append(
    hsCreateReviewButton('r (next)', () => {
      hsReviewTaskNext();
    })
  );

  $panel.append(' - ');

  $panel.append(
    hsCreateReviewButton('R (previous)', hsReviewTaskPrev)
  );

  $panel.append('<br>');

  $panel.append(
    hsCreateReviewButton('q (quit)', hsReviewTaskQuit)
  );

  return $panel;
}

/**
 * Adds active review panels to all second-level outlines.
 */
function hsAddReviewingPanels() {
  $('.hsReviewingPanel').remove();

  $('.outline-2').each(function () {
    const $outline = $(this);
    const taskCount = $outline.find('span.todo').length;

    $outline.prepend(hsCreateReviewingPanel(taskCount));
  });
}

$(document).ready(() => {
  nbReviewTotalTasks = $('.outline-2 span.todo').length;
  hsAddReviewPanels();
});
