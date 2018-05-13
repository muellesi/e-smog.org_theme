/*!
 * Bootstrap Table of Contents v<%= version %> (http://afeld.github.io/bootstrap-toc/)
 * Copyright 2015 Aidan Feldman
 * Licensed under MIT (https://github.com/afeld/bootstrap-toc/blob/gh-pages/LICENSE.md) */
 (function($) {
    'use strict';
  
    window.Toc = {
      helpers: {
        // return all matching elements in the set, or their descendants
        findOrFilter: function($el, selector) {
          // http://danielnouri.org/notes/2011/03/14/a-jquery-find-that-also-finds-the-root-element/
          // http://stackoverflow.com/a/12731439/358804
          var $descendants = $el.find(selector);
          return $el.filter(selector).add($descendants).filter(':not([data-toc-skip])');
        },
  
        createNavList: function() {
          return $('<nav class="nav"></nav>');
        },
  
        createChildNavList: function($parent) {
          var $childList = this.createNavList();
          $parent.append($childList);
          return $childList;
        },
  
        generateNavEl: function(anchor, text) {
          var $a = $('<a class="nav-link"></a>');
          $a.attr('href', '#' + anchor);
          $a.text(text);
          return $a;
        },
  
        generateNavItem: function(headingEl) {
          var anchor = headingEl.id;
          var $heading = $(headingEl);
          var text = $heading.data('toc-text') || $heading.text();
          return this.generateNavEl(anchor, text);
        },
  
        // Find the first heading level (`<h1>`, then `<h2>`, etc.) that has more than one element. Defaults to 1 (for `<h1>`).
        getTopLevel: function($scope) {
          for (var i = 1; i <= 6; i++) {
            var $headings = this.findOrFilter($scope, 'h' + i);
            if ($headings.length > 1) {
              return i;
            }
          }
  
          return 1;
        },
  
        // returns the elements for the top level, and the next below it
        getHeadings: function($scope, topLevel) {
          var topSelector = 'h' + topLevel;
  
          var secondaryLevel = topLevel + 1;
          var secondarySelector = 'h' + secondaryLevel;

          var tertiaryLevel = topLevel + 2;
          var tertiarySelector = 'h' + tertiaryLevel;

          return this.findOrFilter($scope, topSelector + ',' + secondarySelector + ',' + tertiarySelector);
        },
  
        getNavLevel: function(el) {
          return parseInt(el.tagName.charAt(1), 10);
        },
  
        populateNav: function($topContext, topLevel, $headings) {
          var $context = $topContext;
          var $prevNav;
  
          var helpers = this;
          $headings.each(function(i, el) {
            var $newNav = helpers.generateNavItem(el);
            var navLevel = helpers.getNavLevel(el);
  
            // determine the proper $context
            if (navLevel === topLevel) {
              // use top level
              $context = $topContext;
            } else if ($prevNav && $context === $topContext) {
              // create a new level of the tree and switch to it
              $context = helpers.createChildNavList($context);
            } // else use the current $context
  
            $context.append($newNav);
  
            $prevNav = $newNav;
          });
        },
      },
  
      // accepts a jQuery object, or an options object
      init: function() {
        var $topContext = $("#scrollspy-nav");
        var $scope = $("main");
        var topLevel = this.helpers.getTopLevel($scope);
        var $headings = this.helpers.getHeadings($scope, topLevel);
        this.helpers.populateNav($topContext, topLevel, $headings);
      }
    };
  })(jQuery);