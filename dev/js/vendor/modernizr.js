/*!
 * modernizr v3.5.0
 * Build https://modernizr.com/download?-cssanimations-csscalc-csscolumns-cssgradients-csspositionsticky-csstransforms-csstransforms3d-csstransitions-flexbox-flexboxlegacy-flexboxtweener-geolocation-history-inputtypes-localstorage-sessionstorage-touchevents-webworkers-addtest-mq-setclasses-dontmin
 *
 * Copyright (c)
 *  Faruk Ates
 *  Paul Irish
 *  Alex Sexton
 *  Ryan Seddon
 *  Patrick Kettner
 *  Stu Cox
 *  Richard Herrera

 * MIT License
 */

/*
 * Modernizr tests which native CSS3 and HTML5 features are available in the
 * current UA and makes the results available to you in two ways: as properties on
 * a global `Modernizr` object, and as classes on the `<html>` element. This
 * information allows you to progressively enhance your pages with a granular level
 * of control over the experience.
*/

;(function(window, document, undefined){
    var classes = [];


    var tests = [];


    /**
     *
     * ModernizrProto is the constructor for Modernizr
     *
     * @class
     * @access public
     */

    var ModernizrProto = {
      // The current version, dummy
      _version: '3.5.0',

      // Any settings that don't work as separate modules
      // can go in here as configuration.
      _config: {
        'classPrefix': '',
        'enableClasses': true,
        'enableJSClass': true,
        'usePrefixes': true
      },

      // Queue of tests
      _q: [],

      // Stub these for people who are listening
      on: function(test, cb) {
        // I don't really think people should do this, but we can
        // safe guard it a bit.
        // -- NOTE:: this gets WAY overridden in src/addTest for actual async tests.
        // This is in case people listen to synchronous tests. I would leave it out,
        // but the code to *disallow* sync tests in the real version of this
        // function is actually larger than this.
        var self = this;
        setTimeout(function() {
          cb(self[test]);
        }, 0);
      },

      addTest: function(name, fn, options) {
        tests.push({name: name, fn: fn, options: options});
      },

      addAsyncTest: function(fn) {
        tests.push({name: null, fn: fn});
      }
    };



    // Fake some of Object.create so we can force non test results to be non "own" properties.
    var Modernizr = function() {};
    Modernizr.prototype = ModernizrProto;

    // Leak modernizr globally when you `require` it rather than force it here.
    // Overwrite name so constructor name is nicer :D
    Modernizr = new Modernizr();


  /*!
  {
    "name": "Geolocation API",
    "property": "geolocation",
    "caniuse": "geolocation",
    "tags": ["media"],
    "notes": [{
      "name": "MDN documentation",
      "href": "https://developer.mozilla.org/en-US/docs/WebAPI/Using_geolocation"
    }],
    "polyfills": [
      "joshuabell-polyfill",
      "webshims",
      "geo-location-javascript",
      "geolocation-api-polyfill"
    ]
  }
  !*/
  /* DOC
  Detects support for the Geolocation API for users to provide their location to web applications.
  */

    // geolocation is often considered a trivial feature detect...
    // Turns out, it's quite tricky to get right:
    //
    // Using !!navigator.geolocation does two things we don't want. It:
    //   1. Leaks memory in IE9: github.com/Modernizr/Modernizr/issues/513
    //   2. Disables page caching in WebKit: webk.it/43956
    //
    // Meanwhile, in Firefox < 8, an about:config setting could expose
    // a false positive that would throw an exception: bugzil.la/688158

    Modernizr.addTest('geolocation', 'geolocation' in navigator);

  /*!
  {
    "name": "History API",
    "property": "history",
    "caniuse": "history",
    "tags": ["history"],
    "authors": ["Hay Kranen", "Alexander Farkas"],
    "notes": [{
      "name": "W3C Spec",
      "href": "https://www.w3.org/TR/html51/browsers.html#the-history-interface"
    }, {
      "name": "MDN documentation",
      "href": "https://developer.mozilla.org/en-US/docs/Web/API/window.history"
    }],
    "polyfills": ["historyjs", "html5historyapi"]
  }
  !*/
  /* DOC
  Detects support for the History API for manipulating the browser session history.
  */

    Modernizr.addTest('history', function() {
      // Issue #733
      // The stock browser on Android 2.2 & 2.3, and 4.0.x returns positive on history support
      // Unfortunately support is really buggy and there is no clean way to detect
      // these bugs, so we fall back to a user agent sniff :(
      var ua = navigator.userAgent;

      // We only want Android 2 and 4.0, stock browser, and not Chrome which identifies
      // itself as 'Mobile Safari' as well, nor Windows Phone (issue #1471).
      if ((ua.indexOf('Android 2.') !== -1 ||
          (ua.indexOf('Android 4.0') !== -1)) &&
          ua.indexOf('Mobile Safari') !== -1 &&
          ua.indexOf('Chrome') === -1 &&
          ua.indexOf('Windows Phone') === -1 &&
      // Since all documents on file:// share an origin, the History apis are
      // blocked there as well
          location.protocol !== 'file:'
      ) {
        return false;
      }

      // Return the regular check
      return (window.history && 'pushState' in window.history);
    });

  /*!
  {
    "name": "Local Storage",
    "property": "localstorage",
    "caniuse": "namevalue-storage",
    "tags": ["storage"],
    "knownBugs": [],
    "notes": [],
    "warnings": [],
    "polyfills": [
      "joshuabell-polyfill",
      "cupcake",
      "storagepolyfill",
      "amplifyjs",
      "yui-cacheoffline"
    ]
  }
  !*/

    // In FF4, if disabled, window.localStorage should === null.

    // Normally, we could not test that directly and need to do a
    //   `('localStorage' in window)` test first because otherwise Firefox will
    //   throw bugzil.la/365772 if cookies are disabled

    // Similarly, in Chrome with "Block third-party cookies and site data" enabled,
    // attempting to access `window.sessionStorage` will throw an exception. crbug.com/357625

    // Also in iOS5 Private Browsing mode, attempting to use localStorage.setItem
    // will throw the exception:
    //   QUOTA_EXCEEDED_ERROR DOM Exception 22.
    // Peculiarly, getItem and removeItem calls do not throw.

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files

    Modernizr.addTest('localstorage', function() {
      var mod = 'modernizr';
      try {
        localStorage.setItem(mod, mod);
        localStorage.removeItem(mod);
        return true;
      } catch (e) {
        return false;
      }
    });

  /*!
  {
    "name": "Session Storage",
    "property": "sessionstorage",
    "tags": ["storage"],
    "polyfills": ["joshuabell-polyfill", "cupcake", "sessionstorage"]
  }
  !*/

    // Because we are forced to try/catch this, we'll go aggressive.

    // Just FWIW: IE8 Compat mode supports these features completely:
    //   www.quirksmode.org/dom/html5.html
    // But IE8 doesn't support either with local files
    Modernizr.addTest('sessionstorage', function() {
      var mod = 'modernizr';
      try {
        sessionStorage.setItem(mod, mod);
        sessionStorage.removeItem(mod);
        return true;
      } catch (e) {
        return false;
      }
    });

  /*!
  {
    "name": "Web Workers",
    "property": "webworkers",
    "caniuse" : "webworkers",
    "tags": ["performance", "workers"],
    "notes": [{
      "name": "W3C Reference",
      "href": "https://www.w3.org/TR/workers/"
    }, {
      "name": "HTML5 Rocks article",
      "href": "http://www.html5rocks.com/en/tutorials/workers/basics/"
    }, {
      "name": "MDN documentation",
      "href": "https://developer.mozilla.org/en-US/docs/Web/Guide/Performance/Using_web_workers"
    }],
    "polyfills": ["fakeworker", "html5shims"]
  }
  !*/
  /* DOC
  Detects support for the basic `Worker` API from the Web Workers spec. Web Workers provide a simple means for web content to run scripts in background threads.
  */

    Modernizr.addTest('webworkers', 'Worker' in window);


    /**
     * is returns a boolean if the typeof an obj is exactly type.
     *
     * @access private
     * @function is
     * @param {*} obj - A thing we want to check the type of
     * @param {string} type - A string to compare the typeof against
     * @returns {boolean}
     */

    function is(obj, type) {
      return typeof obj === type;
    }
    ;

    /**
     * Run through all tests and detect their support in the current UA.
     *
     * @access private
     */

    function testRunner() {
      var featureNames;
      var feature;
      var aliasIdx;
      var result;
      var nameIdx;
      var featureName;
      var featureNameSplit;

      for (var featureIdx in tests) {
        if (tests.hasOwnProperty(featureIdx)) {
          featureNames = [];
          feature = tests[featureIdx];
          // run the test, throw the return value into the Modernizr,
          // then based on that boolean, define an appropriate className
          // and push it into an array of classes we'll join later.
          //
          // If there is no name, it's an 'async' test that is run,
          // but not directly added to the object. That should
          // be done with a post-run addTest call.
          if (feature.name) {
            featureNames.push(feature.name.toLowerCase());

            if (feature.options && feature.options.aliases && feature.options.aliases.length) {
              // Add all the aliases into the names list
              for (aliasIdx = 0; aliasIdx < feature.options.aliases.length; aliasIdx++) {
                featureNames.push(feature.options.aliases[aliasIdx].toLowerCase());
              }
            }
          }

          // Run the test, or use the raw value if it's not a function
          result = is(feature.fn, 'function') ? feature.fn() : feature.fn;


          // Set each of the names on the Modernizr object
          for (nameIdx = 0; nameIdx < featureNames.length; nameIdx++) {
            featureName = featureNames[nameIdx];
            // Support dot properties as sub tests. We don't do checking to make sure
            // that the implied parent tests have been added. You must call them in
            // order (either in the test, or make the parent test a dependency).
            //
            // Cap it to TWO to make the logic simple and because who needs that kind of subtesting
            // hashtag famous last words
            featureNameSplit = featureName.split('.');

            if (featureNameSplit.length === 1) {
              Modernizr[featureNameSplit[0]] = result;
            } else {
              // cast to a Boolean, if not one already
              if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
                Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
              }

              Modernizr[featureNameSplit[0]][featureNameSplit[1]] = result;
            }

            classes.push((result ? '' : 'no-') + featureNameSplit.join('-'));
          }
        }
      }
    }
    ;

    /**
     * docElement is a convenience wrapper to grab the root element of the document
     *
     * @access private
     * @returns {HTMLElement|SVGElement} The root element of the document
     */

    var docElement = document.documentElement;


    /**
     * A convenience helper to check if the document we are running in is an SVG document
     *
     * @access private
     * @returns {boolean}
     */

    var isSVG = docElement.nodeName.toLowerCase() === 'svg';


    /**
     * setClasses takes an array of class names and adds them to the root element
     *
     * @access private
     * @function setClasses
     * @param {string[]} classes - Array of class names
     */

    // Pass in an and array of class names, e.g.:
    //  ['no-webp', 'borderradius', ...]
    function setClasses(classes) {
      var className = docElement.className;
      var classPrefix = Modernizr._config.classPrefix || '';

      if (isSVG) {
        className = className.baseVal;
      }

      // Change `no-js` to `js` (independently of the `enableClasses` option)
      // Handle classPrefix on this too
      if (Modernizr._config.enableJSClass) {
        var reJS = new RegExp('(^|\\s)' + classPrefix + 'no-js(\\s|$)');
        className = className.replace(reJS, '$1' + classPrefix + 'js$2');
      }

      if (Modernizr._config.enableClasses) {
        // Add the new classes
        className += ' ' + classPrefix + classes.join(' ' + classPrefix);
        if (isSVG) {
          docElement.className.baseVal = className;
        } else {
          docElement.className = className;
        }
      }

    }

    ;

    /**
     * hasOwnProp is a shim for hasOwnProperty that is needed for Safari 2.0 support
     *
     * @author kangax
     * @access private
     * @function hasOwnProp
     * @param {object} object - The object to check for a property
     * @param {string} property - The property to check for
     * @returns {boolean}
     */

    // hasOwnProperty shim by kangax needed for Safari 2.0 support
    var hasOwnProp;

    (function() {
      var _hasOwnProperty = ({}).hasOwnProperty;
      /* istanbul ignore else */
      /* we have no way of testing IE 5.5 or safari 2,
       * so just assume the else gets hit */
      if (!is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined')) {
        hasOwnProp = function(object, property) {
          return _hasOwnProperty.call(object, property);
        };
      }
      else {
        hasOwnProp = function(object, property) { /* yes, this can give false positives/negatives, but most of the time we don't care about those */
          return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
        };
      }
    })();




     // _l tracks listeners for async tests, as well as tests that execute after the initial run
    ModernizrProto._l = {};

    /**
     * Modernizr.on is a way to listen for the completion of async tests. Being
     * asynchronous, they may not finish before your scripts run. As a result you
     * will get a possibly false negative `undefined` value.
     *
     * @memberof Modernizr
     * @name Modernizr.on
     * @access public
     * @function on
     * @param {string} feature - String name of the feature detect
     * @param {function} cb - Callback function returning a Boolean - true if feature is supported, false if not
     * @example
     *
     * ```js
     * Modernizr.on('flash', function( result ) {
     *   if (result) {
     *    // the browser has flash
     *   } else {
     *     // the browser does not have flash
     *   }
     * });
     * ```
     */

    ModernizrProto.on = function(feature, cb) {
      // Create the list of listeners if it doesn't exist
      if (!this._l[feature]) {
        this._l[feature] = [];
      }

      // Push this test on to the listener list
      this._l[feature].push(cb);

      // If it's already been resolved, trigger it on next tick
      if (Modernizr.hasOwnProperty(feature)) {
        // Next Tick
        setTimeout(function() {
          Modernizr._trigger(feature, Modernizr[feature]);
        }, 0);
      }
    };

    /**
     * _trigger is the private function used to signal test completion and run any
     * callbacks registered through [Modernizr.on](#modernizr-on)
     *
     * @memberof Modernizr
     * @name Modernizr._trigger
     * @access private
     * @function _trigger
     * @param {string} feature - string name of the feature detect
     * @param {function|boolean} [res] - A feature detection function, or the boolean =
     * result of a feature detection function
     */

    ModernizrProto._trigger = function(feature, res) {
      if (!this._l[feature]) {
        return;
      }

      var cbs = this._l[feature];

      // Force async
      setTimeout(function() {
        var i, cb;
        for (i = 0; i < cbs.length; i++) {
          cb = cbs[i];
          cb(res);
        }
      }, 0);

      // Don't trigger these again
      delete this._l[feature];
    };

    /**
     * addTest allows you to define your own feature detects that are not currently
     * included in Modernizr (under the covers it's the exact same code Modernizr
     * uses for its own [feature detections](https://github.com/Modernizr/Modernizr/tree/master/feature-detects)). Just like the offical detects, the result
     * will be added onto the Modernizr object, as well as an appropriate className set on
     * the html element when configured to do so
     *
     * @memberof Modernizr
     * @name Modernizr.addTest
     * @optionName Modernizr.addTest()
     * @optionProp addTest
     * @access public
     * @function addTest
     * @param {string|object} feature - The string name of the feature detect, or an
     * object of feature detect names and test
     * @param {function|boolean} test - Function returning true if feature is supported,
     * false if not. Otherwise a boolean representing the results of a feature detection
     * @example
     *
     * The most common way of creating your own feature detects is by calling
     * `Modernizr.addTest` with a string (preferably just lowercase, without any
     * punctuation), and a function you want executed that will return a boolean result
     *
     * ```js
     * Modernizr.addTest('itsTuesday', function() {
     *  var d = new Date();
     *  return d.getDay() === 2;
     * });
     * ```
     *
     * When the above is run, it will set Modernizr.itstuesday to `true` when it is tuesday,
     * and to `false` every other day of the week. One thing to notice is that the names of
     * feature detect functions are always lowercased when added to the Modernizr object. That
     * means that `Modernizr.itsTuesday` will not exist, but `Modernizr.itstuesday` will.
     *
     *
     *  Since we only look at the returned value from any feature detection function,
     *  you do not need to actually use a function. For simple detections, just passing
     *  in a statement that will return a boolean value works just fine.
     *
     * ```js
     * Modernizr.addTest('hasJquery', 'jQuery' in window);
     * ```
     *
     * Just like before, when the above runs `Modernizr.hasjquery` will be true if
     * jQuery has been included on the page. Not using a function saves a small amount
     * of overhead for the browser, as well as making your code much more readable.
     *
     * Finally, you also have the ability to pass in an object of feature names and
     * their tests. This is handy if you want to add multiple detections in one go.
     * The keys should always be a string, and the value can be either a boolean or
     * function that returns a boolean.
     *
     * ```js
     * var detects = {
     *  'hasjquery': 'jQuery' in window,
     *  'itstuesday': function() {
     *    var d = new Date();
     *    return d.getDay() === 2;
     *  }
     * }
     *
     * Modernizr.addTest(detects);
     * ```
     *
     * There is really no difference between the first methods and this one, it is
     * just a convenience to let you write more readable code.
     */

    function addTest(feature, test) {

      if (typeof feature == 'object') {
        for (var key in feature) {
          if (hasOwnProp(feature, key)) {
            addTest(key, feature[ key ]);
          }
        }
      } else {

        feature = feature.toLowerCase();
        var featureNameSplit = feature.split('.');
        var last = Modernizr[featureNameSplit[0]];

        // Again, we don't check for parent test existence. Get that right, though.
        if (featureNameSplit.length == 2) {
          last = last[featureNameSplit[1]];
        }

        if (typeof last != 'undefined') {
          // we're going to quit if you're trying to overwrite an existing test
          // if we were to allow it, we'd do this:
          //   var re = new RegExp("\\b(no-)?" + feature + "\\b");
          //   docElement.className = docElement.className.replace( re, '' );
          // but, no rly, stuff 'em.
          return Modernizr;
        }

        test = typeof test == 'function' ? test() : test;

        // Set the value (this is the magic, right here).
        if (featureNameSplit.length == 1) {
          Modernizr[featureNameSplit[0]] = test;
        } else {
          // cast to a Boolean, if not one already
          if (Modernizr[featureNameSplit[0]] && !(Modernizr[featureNameSplit[0]] instanceof Boolean)) {
            Modernizr[featureNameSplit[0]] = new Boolean(Modernizr[featureNameSplit[0]]);
          }

          Modernizr[featureNameSplit[0]][featureNameSplit[1]] = test;
        }

        // Set a single class (either `feature` or `no-feature`)
        setClasses([(!!test && test != false ? '' : 'no-') + featureNameSplit.join('-')]);

        // Trigger the event
        Modernizr._trigger(feature, test);
      }

      return Modernizr; // allow chaining.
    }

    // After all the tests are run, add self to the Modernizr prototype
    Modernizr._q.push(function() {
      ModernizrProto.addTest = addTest;
    });




    /**
     * List of property values to set for css tests. See ticket #21
     * http://git.io/vUGl4
     *
     * @memberof Modernizr
     * @name Modernizr._prefixes
     * @optionName Modernizr._prefixes
     * @optionProp prefixes
     * @access public
     * @example
     *
     * Modernizr._prefixes is the internal list of prefixes that we test against
     * inside of things like [prefixed](#modernizr-prefixed) and [prefixedCSS](#-code-modernizr-prefixedcss). It is simply
     * an array of kebab-case vendor prefixes you can use within your code.
     *
     * Some common use cases include
     *
     * Generating all possible prefixed version of a CSS property
     * ```js
     * var rule = Modernizr._prefixes.join('transform: rotate(20deg); ');
     *
     * rule === 'transform: rotate(20deg); webkit-transform: rotate(20deg); moz-transform: rotate(20deg); o-transform: rotate(20deg); ms-transform: rotate(20deg);'
     * ```
     *
     * Generating all possible prefixed version of a CSS value
     * ```js
     * rule = 'display:' +  Modernizr._prefixes.join('flex; display:') + 'flex';
     *
     * rule === 'display:flex; display:-webkit-flex; display:-moz-flex; display:-o-flex; display:-ms-flex; display:flex'
     * ```
     */

    // we use ['',''] rather than an empty array in order to allow a pattern of .`join()`ing prefixes to test
    // values in feature detects to continue to work
    var prefixes = (ModernizrProto._config.usePrefixes ? ' -webkit- -moz- -o- -ms- '.split(' ') : ['','']);

    // expose these for the plugin API. Look in the source for how to join() them against your input
    ModernizrProto._prefixes = prefixes;



    /**
     * createElement is a convenience wrapper around document.createElement. Since we
     * use createElement all over the place, this allows for (slightly) smaller code
     * as well as abstracting away issues with creating elements in contexts other than
     * HTML documents (e.g. SVG documents).
     *
     * @access private
     * @function createElement
     * @returns {HTMLElement|SVGElement} An HTML or SVG element
     */

    function createElement() {
      if (typeof document.createElement !== 'function') {
        // This is the case in IE7, where the type of createElement is "object".
        // For this reason, we cannot call apply() as Object is not a Function.
        return document.createElement(arguments[0]);
      } else if (isSVG) {
        return document.createElementNS.call(document, 'http://www.w3.org/2000/svg', arguments[0]);
      } else {
        return document.createElement.apply(document, arguments);
      }
    }

    ;
  /*!
  {
    "name": "CSS Calc",
    "property": "csscalc",
    "caniuse": "calc",
    "tags": ["css"],
    "builderAliases": ["css_calc"],
    "authors": ["@calvein"]
  }
  !*/
  /* DOC
  Method of allowing calculated values for length units. For example:

  ```css
  //lem {
    width: calc(100% - 3em);
  }
  ```
  */

    Modernizr.addTest('csscalc', function() {
      var prop = 'width:';
      var value = 'calc(10px);';
      var el = createElement('a');

      el.style.cssText = prop + prefixes.join(value + prop);

      return !!el.style.length;
    });

  /*!
  {
    "name": "CSS Gradients",
    "caniuse": "css-gradients",
    "property": "cssgradients",
    "tags": ["css"],
    "knownBugs": ["False-positives on webOS (https://github.com/Modernizr/Modernizr/issues/202)"],
    "notes": [{
      "name": "Webkit Gradient Syntax",
      "href": "https://webkit.org/blog/175/introducing-css-gradients/"
    },{
      "name": "Linear Gradient Syntax",
      "href": "https://developer.mozilla.org/en-US/docs/Web/CSS/linear-gradient"
    },{
      "name": "W3C Gradient Spec",
      "href": "https://drafts.csswg.org/css-images-3/#gradients"
    }]
  }
  !*/


    Modernizr.addTest('cssgradients', function() {

      var str1 = 'background-image:';
      var str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));';
      var css = '';
      var angle;

      for (var i = 0, len = prefixes.length - 1; i < len; i++) {
        angle = (i === 0 ? 'to ' : '');
        css += str1 + prefixes[i] + 'linear-gradient(' + angle + 'left top, #9f9, white);';
      }

      if (Modernizr._config.usePrefixes) {
      // legacy webkit syntax (FIXME: remove when syntax not in use anymore)
        css += str1 + '-webkit-' + str2;
      }

      var elem = createElement('a');
      var style = elem.style;
      style.cssText = css;

      // IE6 returns undefined so cast to string
      return ('' + style.backgroundImage).indexOf('gradient') > -1;
    });

  /*!
  {
    "name": "CSS position: sticky",
    "property": "csspositionsticky",
    "tags": ["css"],
    "builderAliases": ["css_positionsticky"],
    "notes": [{
      "name": "Chrome bug report",
      "href":"https://code.google.com/p/chromium/issues/detail?id=322972"
    }],
    "warnings": [ "using position:sticky on anything but top aligned elements is buggy in Chrome < 37 and iOS <=7+" ]
  }
  !*/

    // Sticky positioning - constrains an element to be positioned inside the
    // intersection of its container box, and the viewport.
    Modernizr.addTest('csspositionsticky', function() {
      var prop = 'position:';
      var value = 'sticky';
      var el = createElement('a');
      var mStyle = el.style;

      mStyle.cssText = prop + prefixes.join(value + ';' + prop).slice(0, -prop.length);

      return mStyle.position.indexOf(value) !== -1;
    });


    /**
     * since we have a fairly large number of input tests that don't mutate the input
     * we create a single element that can be shared with all of those tests for a
     * minor perf boost
     *
     * @access private
     * @returns {HTMLInputElement}
     */
    var inputElem = createElement('input');

  /*!
  {
    "name": "Form input types",
    "property": "inputtypes",
    "caniuse": "forms",
    "tags": ["forms"],
    "authors": ["Mike Taylor"],
    "polyfills": [
      "jquerytools",
      "webshims",
      "h5f",
      "webforms2",
      "nwxforms",
      "fdslider",
      "html5slider",
      "galleryhtml5forms",
      "jscolor",
      "html5formshim",
      "selectedoptionsjs",
      "formvalidationjs"
    ]
  }
  !*/
  /* DOC
  Detects support for HTML5 form input types and exposes Boolean subproperties with the results:

  ```javascript
  Modernizr.inputtypes.color
  Modernizr.inputtypes.date
  Modernizr.inputtypes.datetime
  Modernizr.inputtypes['datetime-local']
  Modernizr.inputtypes.email
  Modernizr.inputtypes.month
  Modernizr.inputtypes.number
  Modernizr.inputtypes.range
  Modernizr.inputtypes.search
  Modernizr.inputtypes.tel
  Modernizr.inputtypes.time
  Modernizr.inputtypes.url
  Modernizr.inputtypes.week
  ```
  */

    // Run through HTML5's new input types to see if the UA understands any.
    //   This is put behind the tests runloop because it doesn't return a
    //   true/false like all the other tests; instead, it returns an object
    //   containing each input type with its corresponding true/false value

    // Big thanks to @miketaylr for the html5 forms expertise. miketaylr.com/
    var inputtypes = 'search tel url email datetime date month week time datetime-local number range color'.split(' ');
    var inputs = {};

    Modernizr.inputtypes = (function(props) {
      var len = props.length;
      var smile = '1)';
      var inputElemType;
      var defaultView;
      var bool;

      for (var i = 0; i < len; i++) {

        inputElem.setAttribute('type', inputElemType = props[i]);
        bool = inputElem.type !== 'text' && 'style' in inputElem;

        // We first check to see if the type we give it sticks..
        // If the type does, we feed it a textual value, which shouldn't be valid.
        // If the value doesn't stick, we know there's input sanitization which infers a custom UI
        if (bool) {

          inputElem.value         = smile;
          inputElem.style.cssText = 'position:absolute;visibility:hidden;';

          if (/^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined) {

            docElement.appendChild(inputElem);
            defaultView = document.defaultView;

            // Safari 2-4 allows the smiley as a value, despite making a slider
            bool =  defaultView.getComputedStyle &&
              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
              // Mobile android web browser has false positive, so must
              // check the height to see if the widget is actually there.
              (inputElem.offsetHeight !== 0);

            docElement.removeChild(inputElem);

          } else if (/^(search|tel)$/.test(inputElemType)) {
            // Spec doesn't define any special parsing or detectable UI
            //   behaviors so we pass these through as true

            // Interestingly, opera fails the earlier test, so it doesn't
            //  even make it here.

          } else if (/^(url|email)$/.test(inputElemType)) {
            // Real url and email support comes with prebaked validation.
            bool = inputElem.checkValidity && inputElem.checkValidity() === false;

          } else {
            // If the upgraded input compontent rejects the :) text, we got a winner
            bool = inputElem.value != smile;
          }
        }

        inputs[ props[i] ] = !!bool;
      }
      return inputs;
    })(inputtypes);

  /*!
  {
    "name": "CSS Supports",
    "property": "supports",
    "caniuse": "css-featurequeries",
    "tags": ["css"],
    "builderAliases": ["css_supports"],
    "notes": [{
      "name": "W3 Spec",
      "href": "http://dev.w3.org/csswg/css3-conditional/#at-supports"
    },{
      "name": "Related Github Issue",
      "href": "https://github.com/Modernizr/Modernizr/issues/648"
    },{
      "name": "W3 Info",
      "href": "http://dev.w3.org/csswg/css3-conditional/#the-csssupportsrule-interface"
    }]
  }
  !*/

    var newSyntax = 'CSS' in window && 'supports' in window.CSS;
    var oldSyntax = 'supportsCSS' in window;
    Modernizr.addTest('supports', newSyntax || oldSyntax);


    /**
     * getBody returns the body of a document, or an element that can stand in for
     * the body if a real body does not exist
     *
     * @access private
     * @function getBody
     * @returns {HTMLElement|SVGElement} Returns the real body of a document, or an
     * artificially created element that stands in for the body
     */

    function getBody() {
      // After page load injecting a fake body doesn't work so check if body exists
      var body = document.body;

      if (!body) {
        // Can't use the real body create a fake one.
        body = createElement(isSVG ? 'svg' : 'body');
        body.fake = true;
      }

      return body;
    }

    ;

    /**
     * injectElementWithStyles injects an element with style element and some CSS rules
     *
     * @access private
     * @function injectElementWithStyles
     * @param {string} rule - String representing a css rule
     * @param {function} callback - A function that is used to test the injected element
     * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
     * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
     * @returns {boolean}
     */

    function injectElementWithStyles(rule, callback, nodes, testnames) {
      var mod = 'modernizr';
      var style;
      var ret;
      var node;
      var docOverflow;
      var div = createElement('div');
      var body = getBody();

      if (parseInt(nodes, 10)) {
        // In order not to give false positives we create a node for each test
        // This also allows the method to scale for unspecified uses
        while (nodes--) {
          node = createElement('div');
          node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
          div.appendChild(node);
        }
      }

      style = createElement('style');
      style.type = 'text/css';
      style.id = 's' + mod;

      // IE6 will false positive on some tests due to the style element inside the test div somehow interfering offsetHeight, so insert it into body or fakebody.
      // Opera will act all quirky when injecting elements in documentElement when page is served as xml, needs fakebody too. #270
      (!body.fake ? div : body).appendChild(style);
      body.appendChild(div);

      if (style.styleSheet) {
        style.styleSheet.cssText = rule;
      } else {
        style.appendChild(document.createTextNode(rule));
      }
      div.id = mod;

      if (body.fake) {
        //avoid crashing IE8, if background image is used
        body.style.background = '';
        //Safari 5.13/5.1.4 OSX stops loading if ::-webkit-scrollbar is used and scrollbars are visible
        body.style.overflow = 'hidden';
        docOverflow = docElement.style.overflow;
        docElement.style.overflow = 'hidden';
        docElement.appendChild(body);
      }

      ret = callback(div, rule);
      // If this is done after page load we don't want to remove the body so check if body exists
      if (body.fake) {
        body.parentNode.removeChild(body);
        docElement.style.overflow = docOverflow;
        // Trigger layout so kinetic scrolling isn't disabled in iOS6+
        // eslint-disable-next-line
        docElement.offsetHeight;
      } else {
        div.parentNode.removeChild(div);
      }

      return !!ret;

    }

    ;

    /**
     * Modernizr.mq tests a given media query, live against the current state of the window
     * adapted from matchMedia polyfill by Scott Jehl and Paul Irish
     * gist.github.com/786768
     *
     * @memberof Modernizr
     * @name Modernizr.mq
     * @optionName Modernizr.mq()
     * @optionProp mq
     * @access public
     * @function mq
     * @param {string} mq - String of the media query we want to test
     * @returns {boolean}
     * @example
     * Modernizr.mq allows for you to programmatically check if the current browser
     * window state matches a media query.
     *
     * ```js
     *  var query = Modernizr.mq('(min-width: 900px)');
     *
     *  if (query) {
     *    // the browser window is larger than 900px
     *  }
     * ```
     *
     * Only valid media queries are supported, therefore you must always include values
     * with your media query
     *
     * ```js
     * // good
     *  Modernizr.mq('(min-width: 900px)');
     *
     * // bad
     *  Modernizr.mq('min-width');
     * ```
     *
     * If you would just like to test that media queries are supported in general, use
     *
     * ```js
     *  Modernizr.mq('only all'); // true if MQ are supported, false if not
     * ```
     *
     *
     * Note that if the browser does not support media queries (e.g. old IE) mq will
     * always return false.
     */

    var mq = (function() {
      var matchMedia = window.matchMedia || window.msMatchMedia;
      if (matchMedia) {
        return function(mq) {
          var mql = matchMedia(mq);
          return mql && mql.matches || false;
        };
      }

      return function(mq) {
        var bool = false;

        injectElementWithStyles('@media ' + mq + ' { #modernizr { position: absolute; } }', function(node) {
          bool = (window.getComputedStyle ?
                  window.getComputedStyle(node, null) :
                  node.currentStyle).position == 'absolute';
        });

        return bool;
      };
    })();


    ModernizrProto.mq = mq;



    /**
     * testStyles injects an element with style element and some CSS rules
     *
     * @memberof Modernizr
     * @name Modernizr.testStyles
     * @optionName Modernizr.testStyles()
     * @optionProp testStyles
     * @access public
     * @function testStyles
     * @param {string} rule - String representing a css rule
     * @param {function} callback - A function that is used to test the injected element
     * @param {number} [nodes] - An integer representing the number of additional nodes you want injected
     * @param {string[]} [testnames] - An array of strings that are used as ids for the additional nodes
     * @returns {boolean}
     * @example
     *
     * `Modernizr.testStyles` takes a CSS rule and injects it onto the current page
     * along with (possibly multiple) DOM elements. This lets you check for features
     * that can not be detected by simply checking the [IDL](https://developer.mozilla.org/en-US/docs/Mozilla/Developer_guide/Interface_development_guide/IDL_interface_rules).
     *
     * ```js
     * Modernizr.testStyles('#modernizr { width: 9px; color: papayawhip; }', function(elem, rule) {
     *   // elem is the first DOM node in the page (by default #modernizr)
     *   // rule is the first argument you supplied - the CSS rule in string form
     *
     *   addTest('widthworks', elem.style.width === '9px')
     * });
     * ```
     *
     * If your test requires multiple nodes, you can include a third argument
     * indicating how many additional div elements to include on the page. The
     * additional nodes are injected as children of the `elem` that is returned as
     * the first argument to the callback.
     *
     * ```js
     * Modernizr.testStyles('#modernizr {width: 1px}; #modernizr2 {width: 2px}', function(elem) {
     *   document.getElementById('modernizr').style.width === '1px'; // true
     *   document.getElementById('modernizr2').style.width === '2px'; // true
     *   elem.firstChild === document.getElementById('modernizr2'); // true
     * }, 1);
     * ```
     *
     * By default, all of the additional elements have an ID of `modernizr[n]`, where
     * `n` is its index (e.g. the first additional, second overall is `#modernizr2`,
     * the second additional is `#modernizr3`, etc.).
     * If you want to have more meaningful IDs for your function, you can provide
     * them as the fourth argument, as an array of strings
     *
     * ```js
     * Modernizr.testStyles('#foo {width: 10px}; #bar {height: 20px}', function(elem) {
     *   elem.firstChild === document.getElementById('foo'); // true
     *   elem.lastChild === document.getElementById('bar'); // true
     * }, 2, ['foo', 'bar']);
     * ```
     *
     */

    var testStyles = ModernizrProto.testStyles = injectElementWithStyles;

  /*!
  {
    "name": "Touch Events",
    "property": "touchevents",
    "caniuse" : "touch",
    "tags": ["media", "attribute"],
    "notes": [{
      "name": "Touch Events spec",
      "href": "https://www.w3.org/TR/2013/WD-touch-events-20130124/"
    }],
    "warnings": [
      "Indicates if the browser supports the Touch Events spec, and does not necessarily reflect a touchscreen device"
    ],
    "knownBugs": [
      "False-positive on some configurations of Nokia N900",
      "False-positive on some BlackBerry 6.0 builds – https://github.com/Modernizr/Modernizr/issues/372#issuecomment-3112695"
    ]
  }
  !*/
  /* DOC
  Indicates if the browser supports the W3C Touch Events API.

  This *does not* necessarily reflect a touchscreen device:

  * Older touchscreen devices only emulate mouse events
  * Modern IE touch devices implement the Pointer Events API instead: use `Modernizr.pointerevents` to detect support for that
  * Some browsers & OS setups may enable touch APIs when no touchscreen is connected
  * Future browsers may implement other event models for touch interactions

  See this article: [You Can't Detect A Touchscreen](http://www.stucox.com/blog/you-cant-detect-a-touchscreen/).

  It's recommended to bind both mouse and touch/pointer events simultaneously – see [this HTML5 Rocks tutorial](http://www.html5rocks.com/en/mobile/touchandmouse/).

  This test will also return `true` for Firefox 4 Multitouch support.
  */

    // Chrome (desktop) used to lie about its support on this, but that has since been rectified: http://crbug.com/36415
    Modernizr.addTest('touchevents', function() {
      var bool;
      if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
        bool = true;
      } else {
        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['@media (', prefixes.join('touch-enabled),('), 'heartz', ')', '{#modernizr{top:9px;position:absolute}}'].join('');
        testStyles(query, function(node) {
          bool = node.offsetTop === 9;
        });
      }
      return bool;
    });


    /**
     * If the browsers follow the spec, then they would expose vendor-specific styles as:
     *   elem.style.WebkitBorderRadius
     * instead of something like the following (which is technically incorrect):
     *   elem.style.webkitBorderRadius

     * WebKit ghosts their properties in lowercase but Opera & Moz do not.
     * Microsoft uses a lowercase `ms` instead of the correct `Ms` in IE8+
     *   erik.eae.net/archives/2008/03/10/21.48.10/

     * More here: github.com/Modernizr/Modernizr/issues/issue/21
     *
     * @access private
     * @returns {string} The string representing the vendor-specific style properties
     */

    var omPrefixes = 'Moz O ms Webkit';


    var cssomPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.split(' ') : []);
    ModernizrProto._cssomPrefixes = cssomPrefixes;


    /**
     * List of JavaScript DOM values used for tests
     *
     * @memberof Modernizr
     * @name Modernizr._domPrefixes
     * @optionName Modernizr._domPrefixes
     * @optionProp domPrefixes
     * @access public
     * @example
     *
     * Modernizr._domPrefixes is exactly the same as [_prefixes](#modernizr-_prefixes), but rather
     * than kebab-case properties, all properties are their Capitalized variant
     *
     * ```js
     * Modernizr._domPrefixes === [ "Moz", "O", "ms", "Webkit" ];
     * ```
     */

    var domPrefixes = (ModernizrProto._config.usePrefixes ? omPrefixes.toLowerCase().split(' ') : []);
    ModernizrProto._domPrefixes = domPrefixes;



    /**
     * contains checks to see if a string contains another string
     *
     * @access private
     * @function contains
     * @param {string} str - The string we want to check for substrings
     * @param {string} substr - The substring we want to search the first string for
     * @returns {boolean}
     */

    function contains(str, substr) {
      return !!~('' + str).indexOf(substr);
    }

    ;

    /**
     * cssToDOM takes a kebab-case string and converts it to camelCase
     * e.g. box-sizing -> boxSizing
     *
     * @access private
     * @function cssToDOM
     * @param {string} name - String name of kebab-case prop we want to convert
     * @returns {string} The camelCase version of the supplied name
     */

    function cssToDOM(name) {
      return name.replace(/([a-z])-([a-z])/g, function(str, m1, m2) {
        return m1 + m2.toUpperCase();
      }).replace(/^-/, '');
    }
    ;

    /**
     * fnBind is a super small [bind](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind) polyfill.
     *
     * @access private
     * @function fnBind
     * @param {function} fn - a function you want to change `this` reference to
     * @param {object} that - the `this` you want to call the function with
     * @returns {function} The wrapped version of the supplied function
     */

    function fnBind(fn, that) {
      return function() {
        return fn.apply(that, arguments);
      };
    }

    ;

    /**
     * testDOMProps is a generic DOM property test; if a browser supports
     *   a certain property, it won't return undefined for it.
     *
     * @access private
     * @function testDOMProps
     * @param {array.<string>} props - An array of properties to test for
     * @param {object} obj - An object or Element you want to use to test the parameters again
     * @param {boolean|object} elem - An Element to bind the property lookup again. Use `false` to prevent the check
     * @returns {false|*} returns false if the prop is unsupported, otherwise the value that is supported
     */
    function testDOMProps(props, obj, elem) {
      var item;

      for (var i in props) {
        if (props[i] in obj) {

          // return the property name as a string
          if (elem === false) {
            return props[i];
          }

          item = obj[props[i]];

          // let's bind a function
          if (is(item, 'function')) {
            // bind to obj unless overriden
            return fnBind(item, elem || obj);
          }

          // return the unbound function or obj or value
          return item;
        }
      }
      return false;
    }

    ;

    /**
     * Create our "modernizr" element that we do most feature tests on.
     *
     * @access private
     */

    var modElem = {
      elem: createElement('modernizr')
    };

    // Clean up this element
    Modernizr._q.push(function() {
      delete modElem.elem;
    });



    var mStyle = {
      style: modElem.elem.style
    };

    // kill ref for gc, must happen before mod.elem is removed, so we unshift on to
    // the front of the queue.
    Modernizr._q.unshift(function() {
      delete mStyle.style;
    });



    /**
     * domToCSS takes a camelCase string and converts it to kebab-case
     * e.g. boxSizing -> box-sizing
     *
     * @access private
     * @function domToCSS
     * @param {string} name - String name of camelCase prop we want to convert
     * @returns {string} The kebab-case version of the supplied name
     */

    function domToCSS(name) {
      return name.replace(/([A-Z])/g, function(str, m1) {
        return '-' + m1.toLowerCase();
      }).replace(/^ms-/, '-ms-');
    }
    ;


    /**
     * wrapper around getComputedStyle, to fix issues with Firefox returning null when
     * called inside of a hidden iframe
     *
     * @access private
     * @function computedStyle
     * @param {HTMLElement|SVGElement} - The element we want to find the computed styles of
     * @param {string|null} [pseudoSelector]- An optional pseudo element selector (e.g. :before), of null if none
     * @returns {CSSStyleDeclaration}
     */

    function computedStyle(elem, pseudo, prop) {
      var result;

      if ('getComputedStyle' in window) {
        result = getComputedStyle.call(window, elem, pseudo);
        var console = window.console;

        if (result !== null) {
          if (prop) {
            result = result.getPropertyValue(prop);
          }
        } else {
          if (console) {
            var method = console.error ? 'error' : 'log';
            console[method].call(console, 'getComputedStyle returning null, its possible modernizr test results are inaccurate');
          }
        }
      } else {
        result = !pseudo && elem.currentStyle && elem.currentStyle[prop];
      }

      return result;
    }

    ;

    /**
     * nativeTestProps allows for us to use native feature detection functionality if available.
     * some prefixed form, or false, in the case of an unsupported rule
     *
     * @access private
     * @function nativeTestProps
     * @param {array} props - An array of property names
     * @param {string} value - A string representing the value we want to check via @supports
     * @returns {boolean|undefined} A boolean when @supports exists, undefined otherwise
     */

    // Accepts a list of property names and a single value
    // Returns `undefined` if native detection not available
    function nativeTestProps(props, value) {
      var i = props.length;
      // Start with the JS API: http://www.w3.org/TR/css3-conditional/#the-css-interface
      if ('CSS' in window && 'supports' in window.CSS) {
        // Try every prefixed variant of the property
        while (i--) {
          if (window.CSS.supports(domToCSS(props[i]), value)) {
            return true;
          }
        }
        return false;
      }
      // Otherwise fall back to at-rule (for Opera 12.x)
      else if ('CSSSupportsRule' in window) {
        // Build a condition string for every prefixed variant
        var conditionText = [];
        while (i--) {
          conditionText.push('(' + domToCSS(props[i]) + ':' + value + ')');
        }
        conditionText = conditionText.join(' or ');
        return injectElementWithStyles('@supports (' + conditionText + ') { #modernizr { position: absolute; } }', function(node) {
          return computedStyle(node, null, 'position') == 'absolute';
        });
      }
      return undefined;
    }
    ;

    // testProps is a generic CSS / DOM property test.

    // In testing support for a given CSS property, it's legit to test:
    //    `elem.style[styleName] !== undefined`
    // If the property is supported it will return an empty string,
    // if unsupported it will return undefined.

    // We'll take advantage of this quick test and skip setting a style
    // on our modernizr element, but instead just testing undefined vs
    // empty string.

    // Property names can be provided in either camelCase or kebab-case.

    function testProps(props, prefixed, value, skipValueTest) {
      skipValueTest = is(skipValueTest, 'undefined') ? false : skipValueTest;

      // Try native detect first
      if (!is(value, 'undefined')) {
        var result = nativeTestProps(props, value);
        if (!is(result, 'undefined')) {
          return result;
        }
      }

      // Otherwise do it properly
      var afterInit, i, propsLength, prop, before;

      // If we don't have a style element, that means we're running async or after
      // the core tests, so we'll need to create our own elements to use

      // inside of an SVG element, in certain browsers, the `style` element is only
      // defined for valid tags. Therefore, if `modernizr` does not have one, we
      // fall back to a less used element and hope for the best.
      // for strict XHTML browsers the hardly used samp element is used
      var elems = ['modernizr', 'tspan', 'samp'];
      while (!mStyle.style && elems.length) {
        afterInit = true;
        mStyle.modElem = createElement(elems.shift());
        mStyle.style = mStyle.modElem.style;
      }

      // Delete the objects if we created them.
      function cleanElems() {
        if (afterInit) {
          delete mStyle.style;
          delete mStyle.modElem;
        }
      }

      propsLength = props.length;
      for (i = 0; i < propsLength; i++) {
        prop = props[i];
        before = mStyle.style[prop];

        if (contains(prop, '-')) {
          prop = cssToDOM(prop);
        }

        if (mStyle.style[prop] !== undefined) {

          // If value to test has been passed in, do a set-and-check test.
          // 0 (integer) is a valid property value, so check that `value` isn't
          // undefined, rather than just checking it's truthy.
          if (!skipValueTest && !is(value, 'undefined')) {

            // Needs a try catch block because of old IE. This is slow, but will
            // be avoided in most cases because `skipValueTest` will be used.
            try {
              mStyle.style[prop] = value;
            } catch (e) {}

            // If the property value has changed, we assume the value used is
            // supported. If `value` is empty string, it'll fail here (because
            // it hasn't changed), which matches how browsers have implemented
            // CSS.supports()
            if (mStyle.style[prop] != before) {
              cleanElems();
              return prefixed == 'pfx' ? prop : true;
            }
          }
          // Otherwise just return true, or the property name if this is a
          // `prefixed()` call
          else {
            cleanElems();
            return prefixed == 'pfx' ? prop : true;
          }
        }
      }
      cleanElems();
      return false;
    }

    ;

    /**
     * testPropsAll tests a list of DOM properties we want to check against.
     * We specify literally ALL possible (known and/or likely) properties on
     * the element including the non-vendor prefixed one, for forward-
     * compatibility.
     *
     * @access private
     * @function testPropsAll
     * @param {string} prop - A string of the property to test for
     * @param {string|object} [prefixed] - An object to check the prefixed properties on. Use a string to skip
     * @param {HTMLElement|SVGElement} [elem] - An element used to test the property and value against
     * @param {string} [value] - A string of a css value
     * @param {boolean} [skipValueTest] - An boolean representing if you want to test if value sticks when set
     * @returns {false|string} returns the string version of the property, or false if it is unsupported
     */
    function testPropsAll(prop, prefixed, elem, value, skipValueTest) {

      var ucProp = prop.charAt(0).toUpperCase() + prop.slice(1),
        props = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

      // did they call .prefixed('boxSizing') or are we just testing a prop?
      if (is(prefixed, 'string') || is(prefixed, 'undefined')) {
        return testProps(props, prefixed, value, skipValueTest);

        // otherwise, they called .prefixed('requestAnimationFrame', window[, elem])
      } else {
        props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
        return testDOMProps(props, prefixed, elem);
      }
    }

    // Modernizr.testAllProps() investigates whether a given style property,
    // or any of its vendor-prefixed variants, is recognized
    //
    // Note that the property names must be provided in the camelCase variant.
    // Modernizr.testAllProps('boxSizing')
    ModernizrProto.testAllProps = testPropsAll;



    /**
     * testAllProps determines whether a given CSS property is supported in the browser
     *
     * @memberof Modernizr
     * @name Modernizr.testAllProps
     * @optionName Modernizr.testAllProps()
     * @optionProp testAllProps
     * @access public
     * @function testAllProps
     * @param {string} prop - String naming the property to test (either camelCase or kebab-case)
     * @param {string} [value] - String of the value to test
     * @param {boolean} [skipValueTest=false] - Whether to skip testing that the value is supported when using non-native detection
     * @example
     *
     * testAllProps determines whether a given CSS property, in some prefixed form,
     * is supported by the browser.
     *
     * ```js
     * testAllProps('boxSizing')  // true
     * ```
     *
     * It can optionally be given a CSS value in string form to test if a property
     * value is valid
     *
     * ```js
     * testAllProps('display', 'block') // true
     * testAllProps('display', 'penguin') // false
     * ```
     *
     * A boolean can be passed as a third parameter to skip the value check when
     * native detection (@supports) isn't available.
     *
     * ```js
     * testAllProps('shapeOutside', 'content-box', true);
     * ```
     */

    function testAllProps(prop, value, skipValueTest) {
      return testPropsAll(prop, undefined, undefined, value, skipValueTest);
    }
    ModernizrProto.testAllProps = testAllProps;

  /*!
  {
    "name": "CSS Animations",
    "property": "cssanimations",
    "caniuse": "css-animation",
    "polyfills": ["transformie", "csssandpaper"],
    "tags": ["css"],
    "warnings": ["Android < 4 will pass this test, but can only animate a single property at a time"],
    "notes": [{
      "name" : "Article: 'Dispelling the Android CSS animation myths'",
      "href": "https://goo.gl/OGw5Gm"
    }]
  }
  !*/
  /* DOC
  Detects whether or not elements can be animated using CSS
  */

    Modernizr.addTest('cssanimations', testAllProps('animationName', 'a', true));

  /*!
  {
    "name": "CSS Columns",
    "property": "csscolumns",
    "caniuse": "multicolumn",
    "polyfills": ["css3multicolumnjs"],
    "tags": ["css"]
  }
  !*/


    (function() {

      Modernizr.addTest('csscolumns', function() {
        var bool = false;
        var test = testAllProps('columnCount');
        try {
          bool = !!test
          if (bool) {
            bool = new Boolean(bool);
          }
        } catch (e) {}

        return bool;
      });

      var props = ['Width', 'Span', 'Fill', 'Gap', 'Rule', 'RuleColor', 'RuleStyle', 'RuleWidth', 'BreakBefore', 'BreakAfter', 'BreakInside'];
      var name, test;

      for (var i = 0; i < props.length; i++) {
        name = props[i].toLowerCase();
        test = testAllProps('column' + props[i]);

        // break-before, break-after & break-inside are not "column"-prefixed in spec
        if (name === 'breakbefore' || name === 'breakafter' || name == 'breakinside') {
          test = test || testAllProps(props[i]);
        }

        Modernizr.addTest('csscolumns.' + name, test);
      }


    })();


  /*!
  {
    "name": "Flexbox",
    "property": "flexbox",
    "caniuse": "flexbox",
    "tags": ["css"],
    "notes": [{
      "name": "The _new_ flexbox",
      "href": "http://dev.w3.org/csswg/css3-flexbox"
    }],
    "warnings": [
      "A `true` result for this detect does not imply that the `flex-wrap` property is supported; see the `flexwrap` detect."
    ]
  }
  !*/
  /* DOC
  Detects support for the Flexible Box Layout model, a.k.a. Flexbox, which allows easy manipulation of layout order and sizing within a container.
  */

    Modernizr.addTest('flexbox', testAllProps('flexBasis', '1px', true));

  /*!
  {
    "name": "Flexbox (legacy)",
    "property": "flexboxlegacy",
    "tags": ["css"],
    "polyfills": ["flexie"],
    "notes": [{
      "name": "The _old_ flexbox",
      "href": "https://www.w3.org/TR/2009/WD-css3-flexbox-20090723/"
    }]
  }
  !*/

    Modernizr.addTest('flexboxlegacy', testAllProps('boxDirection', 'reverse', true));

  /*!
  {
    "name": "Flexbox (tweener)",
    "property": "flexboxtweener",
    "tags": ["css"],
    "polyfills": ["flexie"],
    "notes": [{
      "name": "The _inbetween_ flexbox",
      "href": "https://www.w3.org/TR/2011/WD-css3-flexbox-20111129/"
    }],
    "warnings": ["This represents an old syntax, not the latest standard syntax."]
  }
  !*/

    Modernizr.addTest('flexboxtweener', testAllProps('flexAlign', 'end', true));

  /*!
  {
    "name": "CSS Transforms",
    "property": "csstransforms",
    "caniuse": "transforms2d",
    "tags": ["css"]
  }
  !*/

    Modernizr.addTest('csstransforms', function() {
      // Android < 3.0 is buggy, so we sniff and blacklist
      // http://git.io/hHzL7w
      return navigator.userAgent.indexOf('Android 2.') === -1 &&
             testAllProps('transform', 'scale(1)', true);
    });

  /*!
  {
    "name": "CSS Transforms 3D",
    "property": "csstransforms3d",
    "caniuse": "transforms3d",
    "tags": ["css"],
    "warnings": [
      "Chrome may occassionally fail this test on some systems; more info: https://code.google.com/p/chromium/issues/detail?id=129004"
    ]
  }
  !*/

    Modernizr.addTest('csstransforms3d', function() {
      var ret = !!testAllProps('perspective', '1px', true);
      var usePrefix = Modernizr._config.usePrefixes;

      // Webkit's 3D transforms are passed off to the browser's own graphics renderer.
      //   It works fine in Safari on Leopard and Snow Leopard, but not in Chrome in
      //   some conditions. As a result, Webkit typically recognizes the syntax but
      //   will sometimes throw a false positive, thus we must do a more thorough check:
      if (ret && (!usePrefix || 'webkitPerspective' in docElement.style)) {
        var mq;
        var defaultStyle = '#modernizr{width:0;height:0}';
        // Use CSS Conditional Rules if available
        if (Modernizr.supports) {
          mq = '@supports (perspective: 1px)';
        } else {
          // Otherwise, Webkit allows this media query to succeed only if the feature is enabled.
          // `@media (transform-3d),(-webkit-transform-3d){ ... }`
          mq = '@media (transform-3d)';
          if (usePrefix) {
            mq += ',(-webkit-transform-3d)';
          }
        }

        mq += '{#modernizr{width:7px;height:18px;margin:0;padding:0;border:0}}';

        testStyles(defaultStyle + mq, function(elem) {
          ret = elem.offsetWidth === 7 && elem.offsetHeight === 18;
        });
      }

      return ret;
    });

  /*!
  {
    "name": "CSS Transitions",
    "property": "csstransitions",
    "caniuse": "css-transitions",
    "tags": ["css"]
  }
  !*/

    Modernizr.addTest('csstransitions', testAllProps('transition', 'all', true));


    // Run each test
    testRunner();

    // Remove the "no-js" class if it exists
    setClasses(classes);

    delete ModernizrProto.addTest;
    delete ModernizrProto.addAsyncTest;

    // Run the things that are supposed to run after the tests
    for (var i = 0; i < Modernizr._q.length; i++) {
      Modernizr._q[i]();
    }

    // Leak Modernizr namespace
    window.Modernizr = Modernizr;


  ;

  })(window, document);
