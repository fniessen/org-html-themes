// hideshow.js --- HideShow JS file
//
// Copyright (C) 2014 All Right Reserved, Fabrice Niessen
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

if (typeof HS_STARTUP_FOLDED === 'undefined') {
    var HS_STARTUP_FOLDED = false;      // Show just the overview, or show all.
}

if (typeof HS_SHOW_ALL_TEXT === 'undefined') {
    var HS_SHOW_ALL_TEXT = '[Expand all]';
}
if (typeof HS_HIDE_ALL_TEXT === 'undefined') {
    var HS_HIDE_ALL_TEXT = '[Collapse all]';
}

if (typeof HS_ALWAYS_DISPLAY_ICON === 'undefined') {
    var HS_ALWAYS_DISPLAY_ICON = false; // Display an icon for all states, or
                                        // just when closed.
}

if (typeof HS_ICON_CLOSED === 'undefined') {
    var HS_ICON_CLOSED = '&#x25BA;';    // black right-pointing pointer
}
if (typeof HS_ICON_OPEN === 'undefined') {
    var HS_ICON_OPEN = '&#x25BC;';      // black down-pointing triangle
}
if (typeof HS_ICON_EMPTY === 'undefined') {
    var HS_ICON_EMPTY = '&#x25A0;';     // black square
}

if (typeof HS_SHOW_ALL_OPEN_DONE_TREES === 'undefined') {
    var HS_SHOW_ALL_OPEN_DONE_TREES = false; // Expand all will open DONE trees.
}

if (typeof HS_CLASS === 'undefined') {
    var HS_CLASS = 'hsCollapsible';
}

// Expand a header
function hsExpand(header) {
    hsExpand2(header, true);
}

// Expand a header
function hsExpand2(header, expandDoneHeader) {
    // Ignore non collapsible entries
    if (!header.parent().hasClass(HS_CLASS)) return;

    // Do not expand DONE node if not required
    if (hsIsDoneHeader(header) && !expandDoneHeader) return;

    header.children('span[class="ellipsis"]').remove();
    if (HS_ALWAYS_DISPLAY_ICON == true) {
        header.append('<span class="ellipsis"> ' + HS_ICON_OPEN + '</span>');
    }
    header.parent().removeClass('hsCollapsed').addClass('hsExpanded');
    header.nextAll().show();
}

// Expand a header and all its parents
function hsExpandParents(header) {
    hsExpand(header);
    header.parents('.hsCollapsed').each(function() {
        hsExpand($(this).children(':header'));
    });
}

// Collapse a header and all its parents
function hsCollapseParents(header) {
    hsCollapse(header);
    header.parents('.hsExpanded').each(function() {
        hsCollapse($(this).children(':header'));
    });
}

// Collapse a header
function hsCollapse(header) {
    // Ignore non collapsible entries
    if (!header.parent().hasClass(HS_CLASS)) return;

    header.children('span[class="ellipsis"]').remove();
    header.append('<span class="ellipsis"> ' + HS_ICON_CLOSED + '</span>');
    header.parent().removeClass('hsExpanded').addClass('hsCollapsed');
    // header.nextAll().hide('fast');
    header.nextAll().hide();
}

// Toggle a header
function hsToggleCollapsing(header) {
    if (header.parent().hasClass('hsCollapsed'))
        hsExpand(header);
    else if (header.parent().hasClass('hsExpanded'))
        hsCollapse(header);
}

// Expand all headers
function hsExpandAll() {
    $('#content .hsCollapsed').each(function() {
        hsExpand2($(this).children(':header'), HS_SHOW_ALL_OPEN_DONE_TREES);
    });
}

// Collapse all headers
function hsCollapseAll() {
    $('#content .hsExpanded').each(function() {
        hsCollapse($(this).children(':header'));
    });
}

// Collapse all visible headers
function hsCollapseAllVisible() {
    $('#content .hsExpanded:visible').each(function() {
        hsCollapse($(this).children(':header'));
    });
}

// Add click events to H3/H4/H5 headers which have contents.
function hsInit() {
    for (var i = 3; i <= 5; i++) {
        $('#content .outline-' + i).each(function() {
            var header = $(this).children(':header');
            if (header.siblings().length > 0) {
                $(this).addClass(HS_CLASS);
                header.css({cursor: 'pointer'});
                header.click(function() {
                    hsToggleCollapsing($(this)); });

                // Allow to override global Collapse/Expand default on an entry
                // basis (see property `:HTML_CONTAINER_CLASS:')
                if (header.parent().hasClass('hsCollapsed')) {
                    hsCollapse(header);
                } else if (header.parent().hasClass('hsExpanded')) {
                    hsExpand(header);
                } else {
                    hsSetDefaultVisibility(header);
                }
            }
            else {
                if (HS_ALWAYS_DISPLAY_ICON == true) {
                    header.append('<span class="ellipsis"> ' + HS_ICON_EMPTY
                                   + '</span>');
                }
                $(this).addClass('hsEmpty');
            }
        });
    }

    // Add buttons
    $('.title').after($('<div class="buttons dontprint"></div>'));
    $('.buttons').append($('<span>' + HS_SHOW_ALL_TEXT + '</span>')
                 .addClass('hsButton')
                 .click(hsExpandAll));
    $('.buttons').append($('<span>' + HS_HIDE_ALL_TEXT + '</span>')
                 .addClass('hsButton')
                 .click(hsCollapseAll));
}

// Returns true if a header is a DONE header
function hsIsDoneHeader(header) {
    return $('span.done', header).length;
}

// Sets the default visibility state to a header
function hsSetDefaultVisibility(header) {
    if (HS_STARTUP_FOLDED) {
        hsCollapse(header);
    }
    else {
        if (!hsIsDoneHeader(header) | HS_SHOW_ALL_OPEN_DONE_TREES) {
            hsExpand(header);
        }
        else {
            hsCollapse(header);
        }
    }
}

// Expands an anchor, i.e. expand all parent headers
function hsExpandAnchor(id) {
    // alert(id);
    if (id) {
        // alert($(id + '.hsNode').length);
        $(id).parents('.hsCollapsed').each(function() {
            hsExpand2($(this).children(':header'), true);
        });
    }
}

// Search for next task to review, starting from beginning of current tab.
// If BACKWARD is true, search in the reverse direction.
function hsReviewTaskNext(backward) {
    // If no tasks to review at all, do nothing.
    if ($('.outline-2 span.todo').length == 0) return;

    if ($('.hsReviewing').length == 0) { // reviewing is starting
        $('body').addClass('hsReviewing');
        $('.hsReviewPanel').addClass('hsReviewing');
        $('body').prepend('<div id="hsOverlay"></div>');
        hsAddReviewingPanels();

        hsCollapseAll();
        // Get first task to review on each tab and expand it
        $('.outline-2').each(function(){
            var firstTodo = $(this).find('span.todo:first').parent().parent();
            firstTodo.addClass('hsReview');
            hsExpandParents($(firstTodo).children(':header'));
        });
    }
    else {
        // Get all todos
        var todosElements = $('.outline-2:visible span.todo').parent().parent();
        // alert(todosElements.length);
        var todos = jQuery.makeArray(todosElements);
        if (backward) {
            todos = todos.reverse();
        }

        // Find current review item and review the next one
        var foundReview = false;
        var index;
        for (index = 0; index < todos.length; ++index) {
            var todo = todos[index];
            if (foundReview) {
                $(todo).addClass('hsReview');
                hsExpandParents($(todo).children(':header'));
                break;
            }
            if ($(todo).hasClass('hsReview')) {
                foundReview = true;
                if (index < todos.length - 1) {
                    $(todo).removeClass('hsReview');
                    hsCollapseParents($(todo).children(':header'));
                }
            }
        }

        // Update reviewing panel
        if (index < todos.length) {
            var reviewItem = index + 1;
            if (backward) {
                reviewItem = todos.length - index;
            }

            $('.outline-2:visible .hsReviewingPanel .hsReviewItem').text(reviewItem);
        }
    }

    // Scroll to the current review item
    $('html, body').animate({
        scrollTop: $(".hsReview:visible").offset().top
    }, 200);
}

// go to previous task to review
function hsReviewTaskPrev() {
    hsReviewTaskNext(true);
}

// stop reviewing tasks
function hsReviewTaskQuit() {
    $('body').removeClass('hsReviewing');
    $('.hsReviewPanel').removeClass('hsReviewing');
    $('.hsReview').removeClass('hsReview');
    $('#hsOverlay').remove();
    $('.hsReviewingPanel').remove();
}

function hsHideTodoKeyword(kw) {
    $('span.' + kw).addClass('hsHidden').parent().parent().hide();
}

function hsShowTodoKeyword(kw) {
    $('span.' + kw).removeClass('hsHidden').parent().parent().show();
    // XXX Show if parent is not collapsed!
}

function hsAddReviewPanels() {
    $('.outline-2').each(function(e) {
        var nbItems = $(this).find('span.todo').length;
        if (nbItems > 0) {
            $(this).prepend('<div class="hsReviewPanel hsUnselectable" onclick="hsReviewTaskNext()">'
                            + 'Press r or click here<br>'
                            + 'to review ' + nbItems + ' tasks<br>'
                            + '(out of ' +  nbReviewTotalTasks + ' tasks)</div>');
        }
    });
}

function hsAddReviewingPanels() {
    $('.outline-2').each(function(e) {
        var nbItems = $(this).find('span.todo').length;
        if (nbItems > 0) {
            $(this).prepend('<div class="hsReviewingPanel hsUnselectable">Reviewing task <span class="hsReviewItem">1</span> / ' + nbItems + '<br>'
                            + '(out of ' +  nbReviewTotalTasks + ' tasks)<br>'
                            + 'Shortcuts: '
                            + '<span class="hsReviewButton" onclick="hsReviewTaskNext()">r (next)</span> - '
                            + '<span class="hsReviewButton" onclick="hsReviewTaskPrev()">R (previous)</span>'
                            + '</div>');
        }
        else {
            $(this).prepend('<div class="hsReviewingPanel hsUnselectable">No task to review<br>'
                            + '(out of ' +  nbReviewTotalTasks + ' tasks)<br>'
                            + 'Shortcuts: '
                            + '<span class="hsReviewButton" onclick="hsReviewTaskNext()">r (next)</span> - '
                            + '<span class="hsReviewButton" onclick="hsReviewTaskPrev()">R (previous)</span>'
                            + '</div>');
        }
    });
}

var nbReviewTotalTasks;

$(document).ready(function() {
    nbReviewTotalTasks = $('.outline-2 span.todo').length;
    hsAddReviewPanels();
});
