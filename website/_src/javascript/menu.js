(function ($, window, undefined) {

  "use strict";
  window.code = window.code || {};
  var menu = window.code.menu = function (options) {

    var isActive = 'is-active';
    var menuLink = '[data-menu-link]';
    var menuLinkVal = 'menuLink';

    function init () {
      handleEvent();
    }

    function handleEvent() {
      pageName();
      activeNav();
      $(menuLink).on('click', findItem);
    }

    function pageName() {
      var pageName = window.location.pathname.replace('/', '');

      $('html').addClass(pageName);
    }

    function activeNav() {
      var pageName = window.location.pathname.replace('/', '');
      var navItem = '[data-nav-link=' + pageName + ']';

      $(navItem).addClass(isActive);
    }

    function findItem(e) {
      var data = $(e.target).data(menuLinkVal);
      var item = '[data-content-item=' + data + ']';

      scrollToItem(item);
    }

    function scrollToItem(element) {
      $('html, body').animate({
        scrollTop: $(element).offset().top - 40
      }, 2000);
    }

    init();
  };

} (jQuery, window));

$(function () {
  var menu = new code.menu();
});