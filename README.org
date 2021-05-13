#+TITLE:     How to export Org mode files into awesome HTML in 2 minutes
#+AUTHOR:    Fabrice Niessen
#+EMAIL:     (concat "fniessen" at-sign "pirilampo.org")
#+DESCRIPTION: Org-HTML export made simple.
#+KEYWORDS:  org-mode, export, html, theme, style, css, js, bigblow
#+LANGUAGE:  en
#+OPTIONS:   H:4 toc:t num:2

#+PROPERTY:  header-args :padline no
#+SETUPFILE: ~/org/theme-readtheorg.setup

#+html: <a href="http://opensource.org/licenses/GPL-3.0">
#+html:   <img src="http://img.shields.io/:license-gpl-blue.svg" alt=":license-gpl-blue.svg" />
#+html: </a>
#+html: <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=VCVAS6KPDQ4JC&lc=BE&item_number=org%2dhtml%2dthemes&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted">
#+html:   <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" alt="btn_donate_LG.gif" />
#+html: </a>

* Overview

** Description

Though you can easily override CSS stylesheets and add your own HTML themes, we
can say (or write) that Org mode provides a /basic/ HTML support.

*Org-HMTL themes* is an open source framework for providing you with a list of
very nice (cross-browser) themes for all your Org documents.  Use them to *style
your docs*, and your colleagues will come up to tell you that you are a genius!

Share this content by tweeting this page:

#+html: <script src="http://platform.twitter.com/widgets.js"></script>
#+html: <a href="https://twitter.com/share" class="twitter-share-button" data-via="f_niessen">Tweet</a>

Follow [[https://twitter.com/f_niessen][f_niessen]] on Twitter for updates on Org-HTML themes!

** Requirements

Org mode version 8 (or later) is required.

If such a version is not bundled with your Emacs, install one from ELPA.

* Gallery
:PROPERTIES:
:ID:       79e0ed21-c3b0-4f00-bdab-29fbff9dcad4
:END:

This is a list of available *HTML themes for Org mode*, which you can use right
now!  Well, I hope to have more than one in a couple of weeks...

** Bigblow

Bigblow is perfect for your work: it is a clean design aimed at optimal *Org
mode experience in your browser*.  It looks just awesome!

#+ATTR_HTML: :width 640
[[https://www.youtube.com/watch?v=DnSGSiXYuOk][file:docs/bigblow.png]]

Click on the image for a quick [[https://www.youtube.com/watch?v=DnSGSiXYuOk][demo of Bigblow]] (2:49 min, no audio).

Keyboard shortcuts to save time and boost your productivity:

| Shortcut | What it does                      |
|----------+-----------------------------------|
| =?= or =h=   | Access the *dashboard*              |
| =n=        | Move to the *next* main heading     |
| =p=        | Move to the *previous* main heading |
| =b=        | Scroll up                         |
| =<=        | Scroll to top                     |
| =>=        | Scroll to bottom                  |
| =-=        | Collapse all                      |
| =+=        | Expand all                        |
| =r=        | Go to next task in list           |
| =R=        | Go to previous task in list       |
| =q=        | Stop reviewing the list of tasks  |
| =g=        | Reload the page                   |

*** Quotations about Bigblow

"Very very nice, I enjoy it a lot." \\
-- /Ista Zahn/

"This is awesome.  I love it!" \\
-- /Rainer M Krug/

"This is awesome!!" \\
-- /Mehul Sanghvi/

"This very nice html theme. [...]  I cannot use another emacs-theme than your
[[https://github.com/fniessen/emacs-leuven-theme][emacs-leuven-theme]], and it is going to be probably the same with your html
theme!" \\
-- /Joseph Vidal-Rosset/

"Thanks a lot for sharing [...] the wonderful Bigblow theme.  I create lot of
specification for other team members to use.  It has always been a trouble to
share and maintain such spec.  Now, I can create a much neater spec which is
available for the team's reference as a webpage." \\
-- /Shankar R./

"I like Bigblow the best.  I've exported most of my Org files using this theme
and published them within my company's intranet.  Thanks for sharing this
wonderful package!" \\
-- /Richard K./

** ReadTheOrg

ReadTheOrg is a clone of the official -- and great! -- [[https://github.com/snide/sphinx_rtd_theme][Sphinx theme]] used in the
[[http://docs.readthedocs.org/en/latest/][Read The Docs]] site.  It gives a beautiful and professional style to all your Org
docs.

*Thanks to its creator(s)!*

#+ATTR_HTML: :width 640
[[file:docs/readtheorg.png]]

#+begin_note
While the original theme shines on mobile devices as well, ReadTheOrg does not
stay completely functional.

I don't have a lot of time to maintain this project due to other
responsibilities.  Help is welcome to work on that (and eventually improve the
default structure of the HTML export)!
#+end_note

*** Quotations about ReadTheOrg

"OMG.  The ReadTheOrg theme for exported HTML from org mode files is eye
wateringly beautiful.  Thank you!" \\
-- /Rob Stewart/

"It is fantastic, so beautiful.  I will switch several of my pages over to
this theme." \\
-- /Carsten D./

"That is incredibly impressive.  Thanks for this." \\
-- /Noah R./

"Thank you!  I enjoy your themes.  The best ones I've ever found." \\
-- /Kang T./

"Awesome theme.  Wonderful job.  You're doing a wonderful thing --- it will
enable people (at least those who use Emacs and Org mode) to put together
on-line reference works in a much-more usable fashion than is currently
available." \\
-- /D. C. Toedt/

"Extremely useful." \\
-- /Thomas S. Dye/

"This is amazing, I've been looking for something like this for a LONG time!
I will share." \\
-- /Edward H./

* Demo

I've written a [[file:tests/org-mode-syntax-example.org][demo page]] for the themes that provides a maximal working support
of Org mode syntax.

Please see the [[https://github.com/fniessen/refcard-org-mode][Org mode refcard]] page for full examples of headings, code,
admonitions, footnotes, tables and other details.

* Using a theme

Using a theme from the [[id:79e0ed21-c3b0-4f00-bdab-29fbff9dcad4][theme gallery]] for your own Org documents is very easy:

1. You *add a* =#+SETUPFILE:= *directive* in the preamble of your document (to include
   the necessary CSS and JavaScript files).

   You can either use an URL of the following type for the "setup file" of your
   chosen theme:

   #+begin_src org :exports code
   ,#+SETUPFILE: https://fniessen.github.io/org-html-themes/org/theme-NAME.setup
   #+end_src

   (where ~NAME~ is either ~bigblow~ or ~readtheorg~)

   or, if you *cloned or downloaded* the Org-HTML themes project -- to get no
   dependency on an Internet connection --, use a (relative or absolute) path to
   the /local/ "setup file" and copy the =src= folder from the cloned folder
   into the same folder as the file you want to export:

   #+begin_src org :exports code
   ,#+SETUPFILE: PATH/TO/GIT/REPO/org/theme-NAME-local.setup
   #+end_src

2. Then, you *export* your Org mode file *to HTML* with =org-html-export-to-html= or
   with =C-c C-e h h=.

* Customizing a theme

You love those themes, but you still would like to override particular HTML
tags?  Some examples do follow...

Before doing that, though, if you think it really is an improvement that could
server other persons as well, including me, you're invited to submit your
change...

** Change the background code blocks

Here's an example to insert into your Org documents:

#+begin_src org :tangle no
# Change the background of source block.
,#+HTML_HEAD: <style>pre.src{background:#343131;color:white;} </style>
#+end_src

** Unset body width limit of ReadTheOrg

Solution provided by Malcolm Cook:

#+begin_src org :tangle no
,#+HTML_HEAD: <style> #content{max-width:1800px;}</style>
,#+HTML_HEAD: <style> p{max-width:800px;}</style>
,#+HTML_HEAD: <style> li{max-width:800px;}</style
#+end_src

* Contributing

** Issues

Report issues and suggest features and improvements on the [[https://github.com/fniessen/org-html-themes/issues/new][GitHub issue tracker]].

** Patches

I love contributions!  Patches under any form are always welcome!

** Donations

If you use the org-html-themes project (or any of [[https://github.com/fniessen/][my other projects]]) and feel it
is making your life better and easier, you can show your appreciation and help
support future development by making today a [[https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=VCVAS6KPDQ4JC&lc=BE&item_number=org%2dhtml%2dthemes&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted][donation]] through PayPal.  Thank
you!

Regardless of the donations, org-html-themes will always be free both as in
beer and as in speech.

** Follow me

I have an [[https://twitter.com/f_niessen][f_niessen]] account on Twitter.  You should follow it.

* License

Copyright (C) 2011-2021 Fabrice Niessen.

Author: Fabrice Niessen \\
Keywords: org-mode html themes

This program is free software; you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR
A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see http://www.gnu.org/licenses/.

#+html: <a href="http://opensource.org/licenses/GPL-3.0">
#+html:   <img src="http://img.shields.io/:license-gpl-blue.svg" alt=":license-gpl-blue.svg" />
#+html: </a>
#+html: <a href="https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=VCVAS6KPDQ4JC&lc=BE&item_number=org%2dhtml%2dthemes&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donate_LG%2egif%3aNonHosted">
#+html:   <img src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" alt="btn_donate_LG.gif" />
#+html: </a>
