angular.module('sport.ng')
  .config(function (i18ngProvider) {

    function addKarmaBase(url) {
      if (typeof window.__karma__ !== 'undefined') return '/base' + url
      return url
    }

    i18ngProvider.init({
      // Yes, this tells i18next to block.
      //
      // i18ng calls $digest() to update template translations after init.
      // Unfortunately, we don't have a way to update translations that
      // occured anywhere else.  (Such as manually calling t() in a
      // controller or model.)
      //
      // The backbone side of the app calls it's own i18next init, and
      // then creates a global promise that's resolved once the init
      // finishes.  The angular backbone-controller then defers all
      // page loads through that promise.
      //
      // Instead of adding that sort of code to then angular side, I'm
      // just going to have it block.  It only affects initial app load.
      getAsync: false,
      lng: 'en',
      useCookie: false,
      useLocalStorage: false,
      fallbackLng: 'en',
      resGetPath: addKarmaBase('/locales/__lng__/__ns__.json')
    })
  })
