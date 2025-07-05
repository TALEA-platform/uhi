(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.MaplibreGeocoder = factory());
})(this, (function () { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */


    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    var immutable;
    var hasRequiredImmutable;

    function requireImmutable () {
    	if (hasRequiredImmutable) return immutable;
    	hasRequiredImmutable = 1;
    	immutable = extend;

    	var hasOwnProperty = Object.prototype.hasOwnProperty;

    	function extend() {
    	    var target = {};

    	    for (var i = 0; i < arguments.length; i++) {
    	        var source = arguments[i];

    	        for (var key in source) {
    	            if (hasOwnProperty.call(source, key)) {
    	                target[key] = source[key];
    	            }
    	        }
    	    }

    	    return target
    	}
    	return immutable;
    }

    var fuzzy = {exports: {}};

    /*
     * Fuzzy
     * https://github.com/myork/fuzzy
     *
     * Copyright (c) 2012 Matt York
     * Licensed under the MIT license.
     */

    var hasRequiredFuzzy;

    function requireFuzzy () {
    	if (hasRequiredFuzzy) return fuzzy.exports;
    	hasRequiredFuzzy = 1;
    	(function (module, exports) {
    		(function() {

    		var fuzzy = {};

    		// Use in node or in browser
    		{
    		  module.exports = fuzzy;
    		}

    		// Return all elements of `array` that have a fuzzy
    		// match against `pattern`.
    		fuzzy.simpleFilter = function(pattern, array) {
    		  return array.filter(function(str) {
    		    return fuzzy.test(pattern, str);
    		  });
    		};

    		// Does `pattern` fuzzy match `str`?
    		fuzzy.test = function(pattern, str) {
    		  return fuzzy.match(pattern, str) !== null;
    		};

    		// If `pattern` matches `str`, wrap each matching character
    		// in `opts.pre` and `opts.post`. If no match, return null
    		fuzzy.match = function(pattern, str, opts) {
    		  opts = opts || {};
    		  var patternIdx = 0
    		    , result = []
    		    , len = str.length
    		    , totalScore = 0
    		    , currScore = 0
    		    // prefix
    		    , pre = opts.pre || ''
    		    // suffix
    		    , post = opts.post || ''
    		    // String to compare against. This might be a lowercase version of the
    		    // raw string
    		    , compareString =  opts.caseSensitive && str || str.toLowerCase()
    		    , ch;

    		  pattern = opts.caseSensitive && pattern || pattern.toLowerCase();

    		  // For each character in the string, either add it to the result
    		  // or wrap in template if it's the next string in the pattern
    		  for(var idx = 0; idx < len; idx++) {
    		    ch = str[idx];
    		    if(compareString[idx] === pattern[patternIdx]) {
    		      ch = pre + ch + post;
    		      patternIdx += 1;

    		      // consecutive characters should increase the score more than linearly
    		      currScore += 1 + currScore;
    		    } else {
    		      currScore = 0;
    		    }
    		    totalScore += currScore;
    		    result[result.length] = ch;
    		  }

    		  // return rendered string if we have a match for every char
    		  if(patternIdx === pattern.length) {
    		    // if the string is an exact match with pattern, totalScore should be maxed
    		    totalScore = (compareString === pattern) ? Infinity : totalScore;
    		    return {rendered: result.join(''), score: totalScore};
    		  }

    		  return null;
    		};

    		// The normal entry point. Filters `arr` for matches against `pattern`.
    		// It returns an array with matching values of the type:
    		//
    		//     [{
    		//         string:   '<b>lah' // The rendered string
    		//       , index:    2        // The index of the element in `arr`
    		//       , original: 'blah'   // The original element in `arr`
    		//     }]
    		//
    		// `opts` is an optional argument bag. Details:
    		//
    		//    opts = {
    		//        // string to put before a matching character
    		//        pre:     '<b>'
    		//
    		//        // string to put after matching character
    		//      , post:    '</b>'
    		//
    		//        // Optional function. Input is an entry in the given arr`,
    		//        // output should be the string to test `pattern` against.
    		//        // In this example, if `arr = [{crying: 'koala'}]` we would return
    		//        // 'koala'.
    		//      , extract: function(arg) { return arg.crying; }
    		//    }
    		fuzzy.filter = function(pattern, arr, opts) {
    		  if(!arr || arr.length === 0) {
    		    return [];
    		  }
    		  if (typeof pattern !== 'string') {
    		    return arr;
    		  }
    		  opts = opts || {};
    		  return arr
    		    .reduce(function(prev, element, idx, arr) {
    		      var str = element;
    		      if(opts.extract) {
    		        str = opts.extract(element);
    		      }
    		      var rendered = fuzzy.match(pattern, str, opts);
    		      if(rendered != null) {
    		        prev[prev.length] = {
    		            string: rendered.rendered
    		          , score: rendered.score
    		          , index: idx
    		          , original: element
    		        };
    		      }
    		      return prev;
    		    }, [])

    		    // Sort by score. Browsers are inconsistent wrt stable/unstable
    		    // sorting, so force stable by using the index in the case of tie.
    		    // See http://ofb.net/~sethml/is-sort-stable.html
    		    .sort(function(a,b) {
    		      var compare = b.score - a.score;
    		      if(compare) return compare;
    		      return a.index - b.index;
    		    });
    		};


    		}()); 
    	} (fuzzy));
    	return fuzzy.exports;
    }

    var list;
    var hasRequiredList;

    function requireList () {
    	if (hasRequiredList) return list;
    	hasRequiredList = 1;

    	var List = function(component) {
    	  this.component = component;
    	  this.items = [];
    	  this.active = component.options.noInitialSelection ? -1 : 0;
    	  this.wrapper = document.createElement('div');
    	  this.wrapper.className = 'suggestions-wrapper';
    	  this.element = document.createElement('ul');
    	  this.element.className = 'suggestions';
    	  this.wrapper.appendChild(this.element);

    	  // selectingListItem is set to true in the time between the mousedown and mouseup when clicking an item in the list
    	  // mousedown on a list item will cause the input to blur which normally hides the list, so this flag is used to keep
    	  // the list open until the mouseup
    	  this.selectingListItem = false;

    	  component.el.parentNode.insertBefore(this.wrapper, component.el.nextSibling);
    	  return this;
    	};

    	List.prototype.show = function() {
    	  this.element.style.display = 'block';
    	};

    	List.prototype.hide = function() {
    	  this.element.style.display = 'none';
    	};

    	List.prototype.add = function(item) {
    	  this.items.push(item);
    	};

    	List.prototype.clear = function() {
    	  this.items = [];
    	  this.active = this.component.options.noInitialSelection ? -1 : 0;
    	};

    	List.prototype.isEmpty = function() {
    	  return !this.items.length;
    	};

    	List.prototype.isVisible = function() {
    	  return this.element.style.display === 'block';
    	};

    	List.prototype.draw = function() {
    	  this.element.innerHTML = '';

    	  if (this.items.length === 0) {
    	    this.hide();
    	    return;
    	  }

    	  for (var i = 0; i < this.items.length; i++) {
    	    this.drawItem(this.items[i], this.active === i);
    	  }

    	  this.show();
    	};

    	List.prototype.drawItem = function(item, active) {
    	  var li = document.createElement('li'),
    	    a = document.createElement('a');

    	  if (active) li.className += ' active';

    	  a.innerHTML = item.string;

    	  li.appendChild(a);
    	  this.element.appendChild(li);

    	  li.addEventListener('mousedown', function() {
    	    this.selectingListItem = true;
    	  }.bind(this));

    	  li.addEventListener('mouseup', function() {
    	    this.handleMouseUp.call(this, item);
    	  }.bind(this));
    	};

    	List.prototype.handleMouseUp = function(item) {
    	  this.selectingListItem = false;
    	  this.component.value(item.original);
    	  this.clear();
    	  this.draw();
    	};

    	List.prototype.move = function(index) {
    	  this.active = index;
    	  this.draw();
    	};

    	List.prototype.previous = function() {
    	  this.move(this.active <= 0 ? this.items.length - 1 : this.active - 1);
    	};

    	List.prototype.next = function() {
    	  this.move(this.active >= this.items.length - 1 ? 0 : this.active + 1);
    	};

    	List.prototype.drawError = function(msg){
    	  var li = document.createElement('li');

    	  li.innerHTML = msg;

    	  this.element.appendChild(li);
    	  this.show();
    	};

    	list = List;
    	return list;
    }

    var suggestions;
    var hasRequiredSuggestions;

    function requireSuggestions () {
    	if (hasRequiredSuggestions) return suggestions;
    	hasRequiredSuggestions = 1;

    	var extend = requireImmutable();
    	var fuzzy = requireFuzzy();
    	var List = requireList();

    	var Suggestions = function(el, data, options) {
    	  options = options || {};

    	  this.options = extend({
    	    minLength: 2,
    	    limit: 5,
    	    filter: true,
    	    hideOnBlur: true,
    	    noInitialSelection: true
    	  }, options);

    	  this.el = el;
    	  this.data = data || [];
    	  this.list = new List(this);

    	  this.query = '';
    	  this.selected = null;

    	  this.list.draw();

    	  this.el.addEventListener('keyup', function(e) {
    	    this.handleKeyUp(e.keyCode, e);
    	  }.bind(this), false);

    	  this.el.addEventListener('keydown', function(e) {
    	    this.handleKeyDown(e);
    	  }.bind(this));

    	  this.el.addEventListener('focus', function() {
    	    this.handleFocus();
    	  }.bind(this));

    	  this.el.addEventListener('blur', function() {
    	    this.handleBlur();
    	  }.bind(this));

    	  this.el.addEventListener('paste', function(e) {
    	    this.handlePaste(e);
    	  }.bind(this));

    	  // use user-provided render function if given, otherwise just use the default
    	  this.render = (this.options.render) ? this.options.render.bind(this) : this.render.bind(this);

    	  this.getItemValue = (this.options.getItemValue) ? this.options.getItemValue.bind(this) : this.getItemValue.bind(this);

    	  return this;
    	};

    	Suggestions.prototype.handleKeyUp = function(keyCode, e) {
    	  // 40 - DOWN
    	  // 38 - UP
    	  // 27 - ESC
    	  // 13 - ENTER
    	  // 9 - TAB

    	  if (keyCode === 40 ||
    	      keyCode === 38 ||
    	      keyCode === 27 ||
    	      keyCode === 9) return;
    	      
    	  if (keyCode === 13) {
    	    if (this.list.items[this.list.active]) {
    	      this.list.handleMouseUp(this.list.items[this.list.active]);
    	      e.stopPropagation();
    	    }
    	    return;
    	  }
    	  
    	  this.handleInputChange(this.el.value);

    	};

    	Suggestions.prototype.handleKeyDown = function(e) {
    	  switch (e.keyCode) {
    	    case 13: // ENTER
    	      if (this.list.active >= 0) {
    	        this.list.selectingListItem = true;
    	      }
    	      break;
    	    case 9: // TAB
    	      if (!this.list.isEmpty()) {
    	        if (this.list.isVisible()) {
    	          e.preventDefault();
    	        }
    	        this.value(this.list.active >= 0 ? this.list.items[this.list.active].original : null);
    	        this.list.hide();
    	      }
    	    break;
    	    case 27: // ESC
    	      if (!this.list.isEmpty()) this.list.hide();
    	    break;
    	    case 38: // UP
    	      this.list.previous();
    	    break;
    	    case 40: // DOWN
    	      this.list.next();
    	    break;
    	  }
    	};

    	Suggestions.prototype.handleBlur = function() {
    	  if (!this.list.selectingListItem && this.options.hideOnBlur) {
    	    this.list.hide();
    	  }
    	};

    	Suggestions.prototype.handlePaste = function(e) {
    	  if (e.clipboardData) {
    	    this.handleInputChange(e.clipboardData.getData('Text'));
    	  } else {
    	    var self = this;
    	    setTimeout(function () {
    	      self.handleInputChange(e.target.value);
    	    }, 100);
    	  }
    	};

    	Suggestions.prototype.handleInputChange = function(query) {
    	  this.query = this.normalize(query);

    	  this.list.clear();

    	  if (this.query.length < this.options.minLength) {
    	    this.list.draw();
    	    return;
    	  }

    	  this.getCandidates(function(data) {
    	    for (var i = 0; i < data.length; i++) {
    	      this.list.add(data[i]);
    	      if (i === (this.options.limit - 1)) break;
    	    }
    	    this.list.draw();
    	  }.bind(this));
    	};

    	Suggestions.prototype.handleFocus = function() {
    	  if (!this.list.isEmpty()) this.list.show();
    	  this.list.selectingListItem = false;
    	};

    	/**
    	 * Update data previously passed
    	 *
    	 * @param {Array} revisedData
    	 */
    	Suggestions.prototype.update = function(revisedData) {
    	  this.data = revisedData;
    	  this.handleKeyUp();
    	};

    	/**
    	 * Clears data
    	 */
    	Suggestions.prototype.clear = function() {
    	  this.data = [];
    	  this.list.clear();
    	};

    	/**
    	 * Normalize the results list and input value for matching
    	 *
    	 * @param {String} value
    	 * @return {String}
    	 */
    	Suggestions.prototype.normalize = function(value) {
    	  value = value.toLowerCase();
    	  return value;
    	};

    	/**
    	 * Evaluates whether an array item qualifies as a match with the current query
    	 *
    	 * @param {String} candidate a possible item from the array passed
    	 * @param {String} query the current query
    	 * @return {Boolean}
    	 */
    	Suggestions.prototype.match = function(candidate, query) {
    	  return candidate.indexOf(query) > -1;
    	};

    	Suggestions.prototype.value = function(value) {
    	  this.selected = value;
    	  this.el.value = this.getItemValue(value || { place_name: this.query });

    	  if (document.createEvent) {
    	    var e = document.createEvent('HTMLEvents');
    	    e.initEvent('change', true, false);
    	    this.el.dispatchEvent(e);
    	  } else {
    	    this.el.fireEvent('onchange');
    	  }
    	};

    	Suggestions.prototype.getCandidates = function(callback) {
    	  var options = {
    	    pre: '<strong>',
    	    post: '</strong>',
    	    extract: function(d) { return this.getItemValue(d); }.bind(this)
    	  };
    	  var results;
    	  if(this.options.filter){
    	    results = fuzzy.filter(this.query, this.data, options);

    	    results = results.map(function(item){
    	      return {
    	        original: item.original,
    	        string: this.render(item.original, item.string)
    	      };
    	    }.bind(this));
    	  }else {
    	    results = this.data.map(function(d) {
    	      var renderedString = this.render(d);
    	      return {
    	        original: d,
    	        string: renderedString
    	      };
    	    }.bind(this));
    	  }
    	  callback(results);
    	};

    	/**
    	 * For a given item in the data array, return what should be used as the candidate string
    	 *
    	 * @param {Object|String} item an item from the data array
    	 * @return {String} item
    	 */
    	Suggestions.prototype.getItemValue = function(item) {
    	  return item;
    	};

    	/**
    	 * For a given item in the data array, return a string of html that should be rendered in the dropdown
    	 * @param {Object|String} item an item from the data array
    	 * @param {String} sourceFormatting a string that has pre-formatted html that should be passed directly through the render function 
    	 * @return {String} html
    	 */
    	Suggestions.prototype.render = function(item, sourceFormatting) {
    	  if (sourceFormatting){
    	    // use existing formatting on the source string
    	    return sourceFormatting;
    	  }
    	  var boldString = (item.original) ? this.getItemValue(item.original) : this.getItemValue(item);
    	  var indexString = this.normalize(boldString);
    	  var indexOfQuery = indexString.lastIndexOf(this.query);
    	  while (indexOfQuery > -1) {
    	    var endIndexOfQuery = indexOfQuery + this.query.length;
    	    boldString = boldString.slice(0, indexOfQuery) + '<strong>' + boldString.slice(indexOfQuery, endIndexOfQuery) + '</strong>' + boldString.slice(endIndexOfQuery);
    	    indexOfQuery = indexString.slice(0, indexOfQuery).lastIndexOf(this.query);
    	  }
    	  return boldString
    	};

    	/**
    	 * Render an custom error message in the suggestions list
    	 * @param {String} msg An html string to render as an error message
    	 */
    	Suggestions.prototype.renderError = function(msg){
    	  this.list.drawError(msg);
    	};

    	suggestions = Suggestions;
    	return suggestions;
    }

    var suggestionsList;
    var hasRequiredSuggestionsList;

    function requireSuggestionsList () {
    	if (hasRequiredSuggestionsList) return suggestionsList;
    	hasRequiredSuggestionsList = 1;

    	/**
    	 * A typeahead component for inputs
    	 * @class Suggestions
    	 *
    	 * @param {HTMLInputElement} el A valid HTML input element
    	 * @param {Array} data An array of data used for results
    	 * @param {Object} options
    	 * @param {Number} [options.limit=5] Max number of results to display in the auto suggest list.
    	 * @param {Number} [options.minLength=2] Number of characters typed into an input to trigger suggestions.
    	 * @param {Boolean} [options.hideOnBlur=true] If `true`, hides the suggestions when focus is lost.
    	 * @return {Suggestions} `this`
    	 * @example
    	 * // in the browser
    	 * var input = document.querySelector('input');
    	 * var data = [
    	 *   'Roy Eldridge',
    	 *   'Roy Hargrove',
    	 *   'Rex Stewart'
    	 * ];
    	 *
    	 * new Suggestions(input, data);
    	 *
    	 * // with options
    	 * var input = document.querySelector('input');
    	 * var data = [{
    	 *   name: 'Roy Eldridge',
    	 *   year: 1911
    	 * }, {
    	 *   name: 'Roy Hargrove',
    	 *   year: 1969
    	 * }, {
    	 *   name: 'Rex Stewart',
    	 *   year: 1907
    	 * }];
    	 *
    	 * var typeahead = new Suggestions(input, data, {
    	 *   filter: false, // Disable filtering
    	 *   minLength: 3, // Number of characters typed into an input to trigger suggestions.
    	 *   limit: 3, //  Max number of results to display.
    	 *   hideOnBlur: false // Don't hide results when input loses focus
    	 * });
    	 *
    	 * // As we're passing an object of an arrays as data, override
    	 * // `getItemValue` by specifying the specific property to search on.
    	 * typeahead.getItemValue = function(item) { return item.name };
    	 *
    	 * input.addEventListener('change', function() {
    	 *   console.log(typeahead.selected); // Current selected item.
    	 * });
    	 *
    	 * // With browserify
    	 * var Suggestions = require('suggestions');
    	 *
    	 * new Suggestions(input, data);
    	 */
    	var Suggestions = requireSuggestions();
    	suggestionsList = Suggestions;

    	if (typeof window !== 'undefined') {
    	  window.Suggestions = Suggestions;
    	}
    	return suggestionsList;
    }

    var suggestionsListExports = requireSuggestionsList();
    var Typeahead = /*@__PURE__*/getDefaultExportFromCjs(suggestionsListExports);

    var subtag$2 = {exports: {}};

    var subtag$1 = subtag$2.exports;

    var hasRequiredSubtag;

    function requireSubtag () {
    	if (hasRequiredSubtag) return subtag$2.exports;
    	hasRequiredSubtag = 1;
    	(function (module) {
    		!function(root, name, make) {
    		  if (module.exports) module.exports = make();
    		  else root[name] = make();
    		}(subtag$1, 'subtag', function() {

    		  var empty = '';
    		  var pattern = /^([a-zA-Z]{2,3})(?:[_-]+([a-zA-Z]{3})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{4})(?=$|[_-]+))?(?:[_-]+([a-zA-Z]{2}|[0-9]{3})(?=$|[_-]+))?/;

    		  function match(tag) {
    		    return tag.match(pattern) || []
    		  }

    		  function split(tag) {
    		    return match(tag).filter(function(v, i) { return v && i })
    		  }

    		  function api(tag) {
    		    tag = match(tag);
    		    return {
    		      language: tag[1] || empty,
    		      extlang: tag[2] || empty,
    		      script: tag[3] || empty,
    		      region: tag[4] || empty
    		    }
    		  }

    		  function expose(target, key, value) {
    		    Object.defineProperty(target, key, {
    		      value: value,
    		      enumerable: true
    		    });
    		  }

    		  function part(position, pattern, type) {
    		    function method(tag) {
    		      return match(tag)[position] || empty
    		    }
    		    expose(method, 'pattern', pattern);
    		    expose(api, type, method);
    		  }

    		  part(1, /^[a-zA-Z]{2,3}$/, 'language');
    		  part(2, /^[a-zA-Z]{3}$/, 'extlang');
    		  part(3, /^[a-zA-Z]{4}$/, 'script');
    		  part(4, /^[a-zA-Z]{2}$|^[0-9]{3}$/, 'region');

    		  expose(api, 'split', split);

    		  return api
    		}); 
    	} (subtag$2));
    	return subtag$2.exports;
    }

    var subtagExports = requireSubtag();
    var subtag = /*@__PURE__*/getDefaultExportFromCjs(subtagExports);

    /**
     * lodash (Custom Build) <https://lodash.com/>
     * Build: `lodash modularize exports="npm" -o ./`
     * Copyright jQuery Foundation and other contributors <https://jquery.org/>
     * Released under MIT license <https://lodash.com/license>
     * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
     * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
     */

    var lodash_debounce;
    var hasRequiredLodash_debounce;

    function requireLodash_debounce () {
    	if (hasRequiredLodash_debounce) return lodash_debounce;
    	hasRequiredLodash_debounce = 1;
    	/** Used as the `TypeError` message for "Functions" methods. */
    	var FUNC_ERROR_TEXT = 'Expected a function';

    	/** Used as references for various `Number` constants. */
    	var NAN = 0 / 0;

    	/** `Object#toString` result references. */
    	var symbolTag = '[object Symbol]';

    	/** Used to match leading and trailing whitespace. */
    	var reTrim = /^\s+|\s+$/g;

    	/** Used to detect bad signed hexadecimal string values. */
    	var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

    	/** Used to detect binary string values. */
    	var reIsBinary = /^0b[01]+$/i;

    	/** Used to detect octal string values. */
    	var reIsOctal = /^0o[0-7]+$/i;

    	/** Built-in method references without a dependency on `root`. */
    	var freeParseInt = parseInt;

    	/** Detect free variable `global` from Node.js. */
    	var freeGlobal = typeof commonjsGlobal == 'object' && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;

    	/** Detect free variable `self`. */
    	var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

    	/** Used as a reference to the global object. */
    	var root = freeGlobal || freeSelf || Function('return this')();

    	/** Used for built-in method references. */
    	var objectProto = Object.prototype;

    	/**
    	 * Used to resolve the
    	 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
    	 * of values.
    	 */
    	var objectToString = objectProto.toString;

    	/* Built-in method references for those with the same name as other `lodash` methods. */
    	var nativeMax = Math.max,
    	    nativeMin = Math.min;

    	/**
    	 * Gets the timestamp of the number of milliseconds that have elapsed since
    	 * the Unix epoch (1 January 1970 00:00:00 UTC).
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 2.4.0
    	 * @category Date
    	 * @returns {number} Returns the timestamp.
    	 * @example
    	 *
    	 * _.defer(function(stamp) {
    	 *   console.log(_.now() - stamp);
    	 * }, _.now());
    	 * // => Logs the number of milliseconds it took for the deferred invocation.
    	 */
    	var now = function() {
    	  return root.Date.now();
    	};

    	/**
    	 * Creates a debounced function that delays invoking `func` until after `wait`
    	 * milliseconds have elapsed since the last time the debounced function was
    	 * invoked. The debounced function comes with a `cancel` method to cancel
    	 * delayed `func` invocations and a `flush` method to immediately invoke them.
    	 * Provide `options` to indicate whether `func` should be invoked on the
    	 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
    	 * with the last arguments provided to the debounced function. Subsequent
    	 * calls to the debounced function return the result of the last `func`
    	 * invocation.
    	 *
    	 * **Note:** If `leading` and `trailing` options are `true`, `func` is
    	 * invoked on the trailing edge of the timeout only if the debounced function
    	 * is invoked more than once during the `wait` timeout.
    	 *
    	 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
    	 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
    	 *
    	 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
    	 * for details over the differences between `_.debounce` and `_.throttle`.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Function
    	 * @param {Function} func The function to debounce.
    	 * @param {number} [wait=0] The number of milliseconds to delay.
    	 * @param {Object} [options={}] The options object.
    	 * @param {boolean} [options.leading=false]
    	 *  Specify invoking on the leading edge of the timeout.
    	 * @param {number} [options.maxWait]
    	 *  The maximum time `func` is allowed to be delayed before it's invoked.
    	 * @param {boolean} [options.trailing=true]
    	 *  Specify invoking on the trailing edge of the timeout.
    	 * @returns {Function} Returns the new debounced function.
    	 * @example
    	 *
    	 * // Avoid costly calculations while the window size is in flux.
    	 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
    	 *
    	 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
    	 * jQuery(element).on('click', _.debounce(sendMail, 300, {
    	 *   'leading': true,
    	 *   'trailing': false
    	 * }));
    	 *
    	 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
    	 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
    	 * var source = new EventSource('/stream');
    	 * jQuery(source).on('message', debounced);
    	 *
    	 * // Cancel the trailing debounced invocation.
    	 * jQuery(window).on('popstate', debounced.cancel);
    	 */
    	function debounce(func, wait, options) {
    	  var lastArgs,
    	      lastThis,
    	      maxWait,
    	      result,
    	      timerId,
    	      lastCallTime,
    	      lastInvokeTime = 0,
    	      leading = false,
    	      maxing = false,
    	      trailing = true;

    	  if (typeof func != 'function') {
    	    throw new TypeError(FUNC_ERROR_TEXT);
    	  }
    	  wait = toNumber(wait) || 0;
    	  if (isObject(options)) {
    	    leading = !!options.leading;
    	    maxing = 'maxWait' in options;
    	    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    	    trailing = 'trailing' in options ? !!options.trailing : trailing;
    	  }

    	  function invokeFunc(time) {
    	    var args = lastArgs,
    	        thisArg = lastThis;

    	    lastArgs = lastThis = undefined;
    	    lastInvokeTime = time;
    	    result = func.apply(thisArg, args);
    	    return result;
    	  }

    	  function leadingEdge(time) {
    	    // Reset any `maxWait` timer.
    	    lastInvokeTime = time;
    	    // Start the timer for the trailing edge.
    	    timerId = setTimeout(timerExpired, wait);
    	    // Invoke the leading edge.
    	    return leading ? invokeFunc(time) : result;
    	  }

    	  function remainingWait(time) {
    	    var timeSinceLastCall = time - lastCallTime,
    	        timeSinceLastInvoke = time - lastInvokeTime,
    	        result = wait - timeSinceLastCall;

    	    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
    	  }

    	  function shouldInvoke(time) {
    	    var timeSinceLastCall = time - lastCallTime,
    	        timeSinceLastInvoke = time - lastInvokeTime;

    	    // Either this is the first call, activity has stopped and we're at the
    	    // trailing edge, the system time has gone backwards and we're treating
    	    // it as the trailing edge, or we've hit the `maxWait` limit.
    	    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
    	      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
    	  }

    	  function timerExpired() {
    	    var time = now();
    	    if (shouldInvoke(time)) {
    	      return trailingEdge(time);
    	    }
    	    // Restart the timer.
    	    timerId = setTimeout(timerExpired, remainingWait(time));
    	  }

    	  function trailingEdge(time) {
    	    timerId = undefined;

    	    // Only invoke if we have `lastArgs` which means `func` has been
    	    // debounced at least once.
    	    if (trailing && lastArgs) {
    	      return invokeFunc(time);
    	    }
    	    lastArgs = lastThis = undefined;
    	    return result;
    	  }

    	  function cancel() {
    	    if (timerId !== undefined) {
    	      clearTimeout(timerId);
    	    }
    	    lastInvokeTime = 0;
    	    lastArgs = lastCallTime = lastThis = timerId = undefined;
    	  }

    	  function flush() {
    	    return timerId === undefined ? result : trailingEdge(now());
    	  }

    	  function debounced() {
    	    var time = now(),
    	        isInvoking = shouldInvoke(time);

    	    lastArgs = arguments;
    	    lastThis = this;
    	    lastCallTime = time;

    	    if (isInvoking) {
    	      if (timerId === undefined) {
    	        return leadingEdge(lastCallTime);
    	      }
    	      if (maxing) {
    	        // Handle invocations in a tight loop.
    	        timerId = setTimeout(timerExpired, wait);
    	        return invokeFunc(lastCallTime);
    	      }
    	    }
    	    if (timerId === undefined) {
    	      timerId = setTimeout(timerExpired, wait);
    	    }
    	    return result;
    	  }
    	  debounced.cancel = cancel;
    	  debounced.flush = flush;
    	  return debounced;
    	}

    	/**
    	 * Checks if `value` is the
    	 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
    	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 0.1.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
    	 * @example
    	 *
    	 * _.isObject({});
    	 * // => true
    	 *
    	 * _.isObject([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isObject(_.noop);
    	 * // => true
    	 *
    	 * _.isObject(null);
    	 * // => false
    	 */
    	function isObject(value) {
    	  var type = typeof value;
    	  return !!value && (type == 'object' || type == 'function');
    	}

    	/**
    	 * Checks if `value` is object-like. A value is object-like if it's not `null`
    	 * and has a `typeof` result of "object".
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
    	 * @example
    	 *
    	 * _.isObjectLike({});
    	 * // => true
    	 *
    	 * _.isObjectLike([1, 2, 3]);
    	 * // => true
    	 *
    	 * _.isObjectLike(_.noop);
    	 * // => false
    	 *
    	 * _.isObjectLike(null);
    	 * // => false
    	 */
    	function isObjectLike(value) {
    	  return !!value && typeof value == 'object';
    	}

    	/**
    	 * Checks if `value` is classified as a `Symbol` primitive or object.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to check.
    	 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
    	 * @example
    	 *
    	 * _.isSymbol(Symbol.iterator);
    	 * // => true
    	 *
    	 * _.isSymbol('abc');
    	 * // => false
    	 */
    	function isSymbol(value) {
    	  return typeof value == 'symbol' ||
    	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
    	}

    	/**
    	 * Converts `value` to a number.
    	 *
    	 * @static
    	 * @memberOf _
    	 * @since 4.0.0
    	 * @category Lang
    	 * @param {*} value The value to process.
    	 * @returns {number} Returns the number.
    	 * @example
    	 *
    	 * _.toNumber(3.2);
    	 * // => 3.2
    	 *
    	 * _.toNumber(Number.MIN_VALUE);
    	 * // => 5e-324
    	 *
    	 * _.toNumber(Infinity);
    	 * // => Infinity
    	 *
    	 * _.toNumber('3.2');
    	 * // => 3.2
    	 */
    	function toNumber(value) {
    	  if (typeof value == 'number') {
    	    return value;
    	  }
    	  if (isSymbol(value)) {
    	    return NAN;
    	  }
    	  if (isObject(value)) {
    	    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    	    value = isObject(other) ? (other + '') : other;
    	  }
    	  if (typeof value != 'string') {
    	    return value === 0 ? value : +value;
    	  }
    	  value = value.replace(reTrim, '');
    	  var isBinary = reIsBinary.test(value);
    	  return (isBinary || reIsOctal.test(value))
    	    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    	    : (reIsBadHex.test(value) ? NAN : +value);
    	}

    	lodash_debounce = debounce;
    	return lodash_debounce;
    }

    var lodash_debounceExports = requireLodash_debounce();
    var debounce = /*@__PURE__*/getDefaultExportFromCjs(lodash_debounceExports);

    var immutableExports = requireImmutable();
    var extend = /*@__PURE__*/getDefaultExportFromCjs(immutableExports);

    var events = {exports: {}};

    var hasRequiredEvents;

    function requireEvents () {
    	if (hasRequiredEvents) return events.exports;
    	hasRequiredEvents = 1;

    	var R = typeof Reflect === 'object' ? Reflect : null;
    	var ReflectApply = R && typeof R.apply === 'function'
    	  ? R.apply
    	  : function ReflectApply(target, receiver, args) {
    	    return Function.prototype.apply.call(target, receiver, args);
    	  };

    	var ReflectOwnKeys;
    	if (R && typeof R.ownKeys === 'function') {
    	  ReflectOwnKeys = R.ownKeys;
    	} else if (Object.getOwnPropertySymbols) {
    	  ReflectOwnKeys = function ReflectOwnKeys(target) {
    	    return Object.getOwnPropertyNames(target)
    	      .concat(Object.getOwnPropertySymbols(target));
    	  };
    	} else {
    	  ReflectOwnKeys = function ReflectOwnKeys(target) {
    	    return Object.getOwnPropertyNames(target);
    	  };
    	}

    	function ProcessEmitWarning(warning) {
    	  if (console && console.warn) console.warn(warning);
    	}

    	var NumberIsNaN = Number.isNaN || function NumberIsNaN(value) {
    	  return value !== value;
    	};

    	function EventEmitter() {
    	  EventEmitter.init.call(this);
    	}
    	events.exports = EventEmitter;
    	events.exports.once = once;

    	// Backwards-compat with node 0.10.x
    	EventEmitter.EventEmitter = EventEmitter;

    	EventEmitter.prototype._events = undefined;
    	EventEmitter.prototype._eventsCount = 0;
    	EventEmitter.prototype._maxListeners = undefined;

    	// By default EventEmitters will print a warning if more than 10 listeners are
    	// added to it. This is a useful default which helps finding memory leaks.
    	var defaultMaxListeners = 10;

    	function checkListener(listener) {
    	  if (typeof listener !== 'function') {
    	    throw new TypeError('The "listener" argument must be of type Function. Received type ' + typeof listener);
    	  }
    	}

    	Object.defineProperty(EventEmitter, 'defaultMaxListeners', {
    	  enumerable: true,
    	  get: function() {
    	    return defaultMaxListeners;
    	  },
    	  set: function(arg) {
    	    if (typeof arg !== 'number' || arg < 0 || NumberIsNaN(arg)) {
    	      throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received ' + arg + '.');
    	    }
    	    defaultMaxListeners = arg;
    	  }
    	});

    	EventEmitter.init = function() {

    	  if (this._events === undefined ||
    	      this._events === Object.getPrototypeOf(this)._events) {
    	    this._events = Object.create(null);
    	    this._eventsCount = 0;
    	  }

    	  this._maxListeners = this._maxListeners || undefined;
    	};

    	// Obviously not all Emitters should be limited to 10. This function allows
    	// that to be increased. Set to zero for unlimited.
    	EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
    	  if (typeof n !== 'number' || n < 0 || NumberIsNaN(n)) {
    	    throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received ' + n + '.');
    	  }
    	  this._maxListeners = n;
    	  return this;
    	};

    	function _getMaxListeners(that) {
    	  if (that._maxListeners === undefined)
    	    return EventEmitter.defaultMaxListeners;
    	  return that._maxListeners;
    	}

    	EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
    	  return _getMaxListeners(this);
    	};

    	EventEmitter.prototype.emit = function emit(type) {
    	  var args = [];
    	  for (var i = 1; i < arguments.length; i++) args.push(arguments[i]);
    	  var doError = (type === 'error');

    	  var events = this._events;
    	  if (events !== undefined)
    	    doError = (doError && events.error === undefined);
    	  else if (!doError)
    	    return false;

    	  // If there is no 'error' event listener then throw.
    	  if (doError) {
    	    var er;
    	    if (args.length > 0)
    	      er = args[0];
    	    if (er instanceof Error) {
    	      // Note: The comments on the `throw` lines are intentional, they show
    	      // up in Node's output if this results in an unhandled exception.
    	      throw er; // Unhandled 'error' event
    	    }
    	    // At least give some kind of context to the user
    	    var err = new Error('Unhandled error.' + (er ? ' (' + er.message + ')' : ''));
    	    err.context = er;
    	    throw err; // Unhandled 'error' event
    	  }

    	  var handler = events[type];

    	  if (handler === undefined)
    	    return false;

    	  if (typeof handler === 'function') {
    	    ReflectApply(handler, this, args);
    	  } else {
    	    var len = handler.length;
    	    var listeners = arrayClone(handler, len);
    	    for (var i = 0; i < len; ++i)
    	      ReflectApply(listeners[i], this, args);
    	  }

    	  return true;
    	};

    	function _addListener(target, type, listener, prepend) {
    	  var m;
    	  var events;
    	  var existing;

    	  checkListener(listener);

    	  events = target._events;
    	  if (events === undefined) {
    	    events = target._events = Object.create(null);
    	    target._eventsCount = 0;
    	  } else {
    	    // To avoid recursion in the case that type === "newListener"! Before
    	    // adding it to the listeners, first emit "newListener".
    	    if (events.newListener !== undefined) {
    	      target.emit('newListener', type,
    	                  listener.listener ? listener.listener : listener);

    	      // Re-assign `events` because a newListener handler could have caused the
    	      // this._events to be assigned to a new object
    	      events = target._events;
    	    }
    	    existing = events[type];
    	  }

    	  if (existing === undefined) {
    	    // Optimize the case of one listener. Don't need the extra array object.
    	    existing = events[type] = listener;
    	    ++target._eventsCount;
    	  } else {
    	    if (typeof existing === 'function') {
    	      // Adding the second element, need to change to array.
    	      existing = events[type] =
    	        prepend ? [listener, existing] : [existing, listener];
    	      // If we've already got an array, just append.
    	    } else if (prepend) {
    	      existing.unshift(listener);
    	    } else {
    	      existing.push(listener);
    	    }

    	    // Check for listener leak
    	    m = _getMaxListeners(target);
    	    if (m > 0 && existing.length > m && !existing.warned) {
    	      existing.warned = true;
    	      // No error code for this since it is a Warning
    	      // eslint-disable-next-line no-restricted-syntax
    	      var w = new Error('Possible EventEmitter memory leak detected. ' +
    	                          existing.length + ' ' + String(type) + ' listeners ' +
    	                          'added. Use emitter.setMaxListeners() to ' +
    	                          'increase limit');
    	      w.name = 'MaxListenersExceededWarning';
    	      w.emitter = target;
    	      w.type = type;
    	      w.count = existing.length;
    	      ProcessEmitWarning(w);
    	    }
    	  }

    	  return target;
    	}

    	EventEmitter.prototype.addListener = function addListener(type, listener) {
    	  return _addListener(this, type, listener, false);
    	};

    	EventEmitter.prototype.on = EventEmitter.prototype.addListener;

    	EventEmitter.prototype.prependListener =
    	    function prependListener(type, listener) {
    	      return _addListener(this, type, listener, true);
    	    };

    	function onceWrapper() {
    	  if (!this.fired) {
    	    this.target.removeListener(this.type, this.wrapFn);
    	    this.fired = true;
    	    if (arguments.length === 0)
    	      return this.listener.call(this.target);
    	    return this.listener.apply(this.target, arguments);
    	  }
    	}

    	function _onceWrap(target, type, listener) {
    	  var state = { fired: false, wrapFn: undefined, target: target, type: type, listener: listener };
    	  var wrapped = onceWrapper.bind(state);
    	  wrapped.listener = listener;
    	  state.wrapFn = wrapped;
    	  return wrapped;
    	}

    	EventEmitter.prototype.once = function once(type, listener) {
    	  checkListener(listener);
    	  this.on(type, _onceWrap(this, type, listener));
    	  return this;
    	};

    	EventEmitter.prototype.prependOnceListener =
    	    function prependOnceListener(type, listener) {
    	      checkListener(listener);
    	      this.prependListener(type, _onceWrap(this, type, listener));
    	      return this;
    	    };

    	// Emits a 'removeListener' event if and only if the listener was removed.
    	EventEmitter.prototype.removeListener =
    	    function removeListener(type, listener) {
    	      var list, events, position, i, originalListener;

    	      checkListener(listener);

    	      events = this._events;
    	      if (events === undefined)
    	        return this;

    	      list = events[type];
    	      if (list === undefined)
    	        return this;

    	      if (list === listener || list.listener === listener) {
    	        if (--this._eventsCount === 0)
    	          this._events = Object.create(null);
    	        else {
    	          delete events[type];
    	          if (events.removeListener)
    	            this.emit('removeListener', type, list.listener || listener);
    	        }
    	      } else if (typeof list !== 'function') {
    	        position = -1;

    	        for (i = list.length - 1; i >= 0; i--) {
    	          if (list[i] === listener || list[i].listener === listener) {
    	            originalListener = list[i].listener;
    	            position = i;
    	            break;
    	          }
    	        }

    	        if (position < 0)
    	          return this;

    	        if (position === 0)
    	          list.shift();
    	        else {
    	          spliceOne(list, position);
    	        }

    	        if (list.length === 1)
    	          events[type] = list[0];

    	        if (events.removeListener !== undefined)
    	          this.emit('removeListener', type, originalListener || listener);
    	      }

    	      return this;
    	    };

    	EventEmitter.prototype.off = EventEmitter.prototype.removeListener;

    	EventEmitter.prototype.removeAllListeners =
    	    function removeAllListeners(type) {
    	      var listeners, events, i;

    	      events = this._events;
    	      if (events === undefined)
    	        return this;

    	      // not listening for removeListener, no need to emit
    	      if (events.removeListener === undefined) {
    	        if (arguments.length === 0) {
    	          this._events = Object.create(null);
    	          this._eventsCount = 0;
    	        } else if (events[type] !== undefined) {
    	          if (--this._eventsCount === 0)
    	            this._events = Object.create(null);
    	          else
    	            delete events[type];
    	        }
    	        return this;
    	      }

    	      // emit removeListener for all listeners on all events
    	      if (arguments.length === 0) {
    	        var keys = Object.keys(events);
    	        var key;
    	        for (i = 0; i < keys.length; ++i) {
    	          key = keys[i];
    	          if (key === 'removeListener') continue;
    	          this.removeAllListeners(key);
    	        }
    	        this.removeAllListeners('removeListener');
    	        this._events = Object.create(null);
    	        this._eventsCount = 0;
    	        return this;
    	      }

    	      listeners = events[type];

    	      if (typeof listeners === 'function') {
    	        this.removeListener(type, listeners);
    	      } else if (listeners !== undefined) {
    	        // LIFO order
    	        for (i = listeners.length - 1; i >= 0; i--) {
    	          this.removeListener(type, listeners[i]);
    	        }
    	      }

    	      return this;
    	    };

    	function _listeners(target, type, unwrap) {
    	  var events = target._events;

    	  if (events === undefined)
    	    return [];

    	  var evlistener = events[type];
    	  if (evlistener === undefined)
    	    return [];

    	  if (typeof evlistener === 'function')
    	    return unwrap ? [evlistener.listener || evlistener] : [evlistener];

    	  return unwrap ?
    	    unwrapListeners(evlistener) : arrayClone(evlistener, evlistener.length);
    	}

    	EventEmitter.prototype.listeners = function listeners(type) {
    	  return _listeners(this, type, true);
    	};

    	EventEmitter.prototype.rawListeners = function rawListeners(type) {
    	  return _listeners(this, type, false);
    	};

    	EventEmitter.listenerCount = function(emitter, type) {
    	  if (typeof emitter.listenerCount === 'function') {
    	    return emitter.listenerCount(type);
    	  } else {
    	    return listenerCount.call(emitter, type);
    	  }
    	};

    	EventEmitter.prototype.listenerCount = listenerCount;
    	function listenerCount(type) {
    	  var events = this._events;

    	  if (events !== undefined) {
    	    var evlistener = events[type];

    	    if (typeof evlistener === 'function') {
    	      return 1;
    	    } else if (evlistener !== undefined) {
    	      return evlistener.length;
    	    }
    	  }

    	  return 0;
    	}

    	EventEmitter.prototype.eventNames = function eventNames() {
    	  return this._eventsCount > 0 ? ReflectOwnKeys(this._events) : [];
    	};

    	function arrayClone(arr, n) {
    	  var copy = new Array(n);
    	  for (var i = 0; i < n; ++i)
    	    copy[i] = arr[i];
    	  return copy;
    	}

    	function spliceOne(list, index) {
    	  for (; index + 1 < list.length; index++)
    	    list[index] = list[index + 1];
    	  list.pop();
    	}

    	function unwrapListeners(arr) {
    	  var ret = new Array(arr.length);
    	  for (var i = 0; i < ret.length; ++i) {
    	    ret[i] = arr[i].listener || arr[i];
    	  }
    	  return ret;
    	}

    	function once(emitter, name) {
    	  return new Promise(function (resolve, reject) {
    	    function errorListener(err) {
    	      emitter.removeListener(name, resolver);
    	      reject(err);
    	    }

    	    function resolver() {
    	      if (typeof emitter.removeListener === 'function') {
    	        emitter.removeListener('error', errorListener);
    	      }
    	      resolve([].slice.call(arguments));
    	    }
    	    eventTargetAgnosticAddListener(emitter, name, resolver, { once: true });
    	    if (name !== 'error') {
    	      addErrorHandlerIfEventEmitter(emitter, errorListener, { once: true });
    	    }
    	  });
    	}

    	function addErrorHandlerIfEventEmitter(emitter, handler, flags) {
    	  if (typeof emitter.on === 'function') {
    	    eventTargetAgnosticAddListener(emitter, 'error', handler, flags);
    	  }
    	}

    	function eventTargetAgnosticAddListener(emitter, name, listener, flags) {
    	  if (typeof emitter.on === 'function') {
    	    if (flags.once) {
    	      emitter.once(name, listener);
    	    } else {
    	      emitter.on(name, listener);
    	    }
    	  } else if (typeof emitter.addEventListener === 'function') {
    	    // EventTarget does not have `error` event semantics like Node
    	    // EventEmitters, we do not listen for `error` events here.
    	    emitter.addEventListener(name, function wrapListener(arg) {
    	      // IE does not have builtin `{ once: true }` support so we
    	      // have to do it manually.
    	      if (flags.once) {
    	        emitter.removeEventListener(name, wrapListener);
    	      }
    	      listener(arg);
    	    });
    	  } else {
    	    throw new TypeError('The "emitter" argument must be of type EventEmitter. Received type ' + typeof emitter);
    	  }
    	}
    	return events.exports;
    }

    var eventsExports = requireEvents();

    const exceptions = {
        'fr': {
            'name': 'France',
            'bbox': [[-4.59235, 41.380007], [9.560016, 51.148506]]
        },
        'us': {
            'name': 'United States',
            'bbox': [[-171.791111, 18.91619], [-66.96466, 71.357764]]
        },
        'ru': {
            'name': 'Russia',
            'bbox': [[19.66064, 41.151416], [190.10042, 81.2504]]
        },
        'ca': {
            'name': 'Canada',
            'bbox': [[-140.99778, 41.675105], [-52.648099, 83.23324]]
        }
    };

    /**
     * Localized values for the placeholder string
     *
     * @private
     */
    const placeholder = {
        // list drawn from https://docs.mapbox.com/api/search/#language-coverage
        'de': 'Suche', // german
        'it': 'Ricerca', //italian
        'en': 'Search', // english
        'nl': 'Zoeken', //dutch
        'fr': 'Chercher', //french
        'ca': 'Cerca', //catalan
        'he': 'לחפש', //hebrew
        'ja': 'サーチ', //japanese
        'lv': 'Meklēt', //latvian
        'pt': 'Procurar', //portuguese 
        'sr': 'Претрага', //serbian
        'zh': '搜索', //chinese-simplified
        'cs': 'Vyhledávání', //czech
        'hu': 'Keresés', //hungarian
        'ka': 'ძიება', // georgian
        'nb': 'Søke', //norwegian
        'sk': 'Vyhľadávanie', //slovak
        'th': 'ค้นหา', //thai
        'fi': 'Hae', //finnish
        'is': 'Leita', //icelandic
        'ko': '수색', //korean
        'pl': 'Szukaj', //polish
        'sl': 'Iskanje', //slovenian
        'fa': 'جستجو', //persian(aka farsi)
        'ru': 'Поиск', //russian,
        "es": "Buscar" //spanish
    };
    const errorNoResults = {
        'en': 'No results found',
        'de': 'Keine Ergebnisse gefunden',
        "es": "No hay resultados"
    };
    const errorConnectionFailed = {
        'en': 'There was an error reaching the server',
        'de': 'Verbindung fehlgeschlagen',
        "es": "Error al conectarse al servidor"
    };
    var localization = { placeholder, errorNoResults, errorConnectionFailed };

    /**
     * A regular expression to match coordinates.
     */
    const COORDINATES_REGEXP = /(-?\d+\.?\d*)[, ]+(-?\d+\.?\d*)[ ]*$/;
    /**
     * A geocoder component that works with maplibre
     */
    class MaplibreGeocoder {
        constructor(geocoderApi, options) {
            this.options = {
                zoom: 16,
                flyTo: true,
                trackProximity: true,
                showResultsWhileTyping: false,
                minLength: 2,
                reverseGeocode: false,
                limit: 5,
                enableEventLogging: true,
                marker: true,
                popup: false,
                maplibregl: undefined,
                collapsed: false,
                clearAndBlurOnEsc: false,
                clearOnBlur: false,
                proximityMinZoom: 9,
                getItemValue: (item) => {
                    return item.text !== undefined ? item.text : item.place_name;
                },
                render: function (item) {
                    // Render as a suggestion
                    if (!item.geometry) {
                        const suggestionString = item.text;
                        const indexOfMatch = suggestionString
                            .toLowerCase()
                            .indexOf(this.query.toLowerCase());
                        const lengthOfMatch = this.query.length;
                        const beforeMatch = suggestionString.substring(0, indexOfMatch);
                        const match = suggestionString.substring(indexOfMatch, indexOfMatch + lengthOfMatch);
                        const afterMatch = suggestionString.substring(indexOfMatch + lengthOfMatch);
                        return ('<div class="maplibregl-ctrl-geocoder--suggestion">' +
                            '<svg class="maplibregl-ctrl-geocoder--suggestion-icon" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg"><path d="M22.8702 20.1258H21.4248L20.9125 19.6318C22.7055 17.546 23.785 14.8382 23.785 11.8925C23.785 5.32419 18.4608 0 11.8925 0C5.32419 0 0 5.32419 0 11.8925C0 18.4608 5.32419 23.785 11.8925 23.785C14.8382 23.785 17.546 22.7055 19.6318 20.9125L20.1258 21.4248V22.8702L29.2739 32L32 29.2739L22.8702 20.1258ZM11.8925 20.1258C7.33676 20.1258 3.65923 16.4483 3.65923 11.8925C3.65923 7.33676 7.33676 3.65923 11.8925 3.65923C16.4483 3.65923 20.1258 7.33676 20.1258 11.8925C20.1258 16.4483 16.4483 20.1258 11.8925 20.1258Z" fill="#687078"/></svg>' +
                            '<div class="maplibregl-ctrl-geocoder--suggestion-info">' +
                            '<div class="maplibregl-ctrl-geocoder--suggestion-title">' +
                            beforeMatch +
                            '<span class="maplibregl-ctrl-geocoder--suggestion-match">' +
                            match +
                            "</span>" +
                            afterMatch +
                            "</div>" +
                            "</div>" +
                            "</div>");
                    }
                    // render as a search result
                    const placeName = item.place_name.split(",");
                    return ('<div class="maplibregl-ctrl-geocoder--result">' +
                        '<svg class="maplibregl-ctrl-geocoder--result-icon" viewBox="0 0 24 32" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 0C5.36571 0 0 5.38676 0 12.0471C0 21.0824 12 32 12 32C12 32 24 21.0824 24 12.0471C24 5.38676 18.6343 0 12 0ZM12 16.3496C9.63428 16.3496 7.71429 14.4221 7.71429 12.0471C7.71429 9.67207 9.63428 7.74454 12 7.74454C14.3657 7.74454 16.2857 9.67207 16.2857 12.0471C16.2857 14.4221 14.3657 16.3496 12 16.3496Z" fill="#687078"/></svg>' +
                        "<div>" +
                        '<div class="maplibregl-ctrl-geocoder--result-title">' +
                        placeName[0] +
                        "</div>" +
                        '<div class="maplibregl-ctrl-geocoder--result-address">' +
                        placeName.splice(1, placeName.length).join(",") +
                        "</div>" +
                        "</div>" +
                        "</div>");
                },
                popupRender: (item) => {
                    const placeName = item.place_name.split(",");
                    return ('<div class="maplibregl-ctrl-geocoder--suggestion popup-suggestion"><div class="maplibregl-ctrl-geocoder--suggestion-title popup-suggestion-title">' +
                        placeName[0] +
                        '</div><div class="maplibregl-ctrl-geocoder--suggestion-address popup-suggestion-address">' +
                        placeName.splice(1, placeName.length).join(",") +
                        "</div></div>");
                },
                showResultMarkers: true,
                debounceSearch: 200,
            };
            this._eventEmitter = new eventsExports.EventEmitter();
            this.options = extend({}, this.options, options);
            this.fresh = true;
            this.lastSelected = null;
            this.geocoderApi = geocoderApi;
        }
        /**
         * Add the geocoder to a container. The container can be either a `Map`, an `HTMLElement` or a CSS selector string.
         *
         * If the container is a [`Map`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map), this function will behave identically to [`Map.addControl(geocoder)`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map#addcontrol).
         * If the container is an instance of [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement), then the geocoder will be appended as a child of that [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement).
         * If the container is a [CSS selector string](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors), the geocoder will be appended to the element returned from the query.
         *
         * This function will throw an error if the container is none of the above.
         * It will also throw an error if the referenced HTML element cannot be found in the `document.body`.
         *
         * For example, if the HTML body contains the element `<div id='geocoder-container'></div>`, the following script will append the geocoder to `#geocoder-container`:
         * @example
         * ```js
         * const GeoApi = {
         *   forwardGeocode: (config) => { return { features: [] } },
         *   reverseGeocode: (config) => { return { features: [] } }
         * }
         * const geocoder = new MaplibreGeocoder(GeoAPI, {});
         * geocoder.addTo('#geocoder-container');
         * ```
         * @param container - A reference to the container to which to add the geocoder
         */
        addTo(container) {
            function addToExistingContainer(geocoder, container) {
                if (!document.body.contains(container)) {
                    throw new Error("Element provided to #addTo() exists, but is not in the DOM");
                }
                const el = geocoder.onAdd(); //returns the input elements, which are then added to the requested html container
                container.appendChild(el);
            }
            // if the container is an HTMLElement, then set the parent to be that element
            if (container instanceof HTMLElement) {
                addToExistingContainer(this, container);
            }
            // if the container is a string, treat it as a CSS query
            else if (typeof container == "string") {
                const parent = document.querySelectorAll(container);
                if (parent.length === 0) {
                    throw new Error("Element " + container + "not found.");
                }
                if (parent.length > 1) {
                    throw new Error("Geocoder can only be added to a single html element");
                }
                addToExistingContainer(this, parent[0]);
            }
            // if the container is a map, add the control like normal
            else if ('addControl' in container) {
                //  it's a maplibre-gl map, add like normal
                container.addControl(this);
            }
            else {
                throw new Error("Error: addTo must be a maplibre-gl-js map, an html element, or a CSS selector query for a single html element");
            }
        }
        onAdd(map) {
            if (map && typeof map != "string") {
                this._map = map;
            }
            this.setLanguage();
            if (this.options.localGeocoderOnly && !this.options.localGeocoder) {
                throw new Error("A localGeocoder function must be specified to use localGeocoderOnly mode");
            }
            this._onChange = this._onChange.bind(this);
            this._onKeyDown = this._onKeyDown.bind(this);
            this._onPaste = this._onPaste.bind(this);
            this._onBlur = this._onBlur.bind(this);
            this._showButton = this._showButton.bind(this);
            this._hideButton = this._hideButton.bind(this);
            this._onQueryResult = this._onQueryResult.bind(this);
            this.clear = this.clear.bind(this);
            this._updateProximity = this._updateProximity.bind(this);
            this._collapse = this._collapse.bind(this);
            this._unCollapse = this._unCollapse.bind(this);
            this._clear = this._clear.bind(this);
            this._clearOnBlur = this._clearOnBlur.bind(this);
            const el = (this.container = document.createElement("div"));
            el.className =
                "maplibregl-ctrl-geocoder maplibregl-ctrl maplibregl-ctrl-geocoder maplibregl-ctrl";
            const searchIcon = this.createIcon("search", '<path d="M7.4 2.5c-2.7 0-4.9 2.2-4.9 4.9s2.2 4.9 4.9 4.9c1 0 1.8-.2 2.5-.8l3.7 3.7c.2.2.4.3.8.3.7 0 1.1-.4 1.1-1.1 0-.3-.1-.5-.3-.8L11.4 10c.4-.8.8-1.6.8-2.5.1-2.8-2.1-5-4.8-5zm0 1.6c1.8 0 3.2 1.4 3.2 3.2s-1.4 3.2-3.2 3.2-3.3-1.3-3.3-3.1 1.4-3.3 3.3-3.3z"/>');
            this._inputEl = document.createElement("input");
            this._inputEl.type = "text";
            this._inputEl.className =
                "maplibregl-ctrl-geocoder--input";
            this.setPlaceholder();
            if (this.options.collapsed) {
                this._collapse();
                this.container.addEventListener("mouseenter", this._unCollapse);
                this.container.addEventListener("mouseleave", this._collapse);
                this._inputEl.addEventListener("focus", this._unCollapse);
            }
            if (this.options.collapsed || this.options.clearOnBlur) {
                this._inputEl.addEventListener("blur", this._onBlur);
            }
            this._inputEl.addEventListener("keydown", debounce(this._onKeyDown, this.options.debounceSearch));
            this._inputEl.addEventListener("paste", this._onPaste);
            this._inputEl.addEventListener("change", this._onChange);
            this.container.addEventListener("mouseenter", this._showButton);
            this.container.addEventListener("mouseleave", this._hideButton);
            const actions = document.createElement("div");
            actions.classList.add("maplibregl-ctrl-geocoder--pin-right");
            this._clearEl = document.createElement("button");
            this._clearEl.setAttribute("type", "button");
            this._clearEl.setAttribute("aria-label", "Clear");
            this._clearEl.addEventListener("click", this.clear);
            this._clearEl.className = "maplibregl-ctrl-geocoder--button";
            const buttonIcon = this.createIcon("close", '<path d="M3.8 2.5c-.6 0-1.3.7-1.3 1.3 0 .3.2.7.5.8L7.2 9 3 13.2c-.3.3-.5.7-.5 1 0 .6.7 1.3 1.3 1.3.3 0 .7-.2 1-.5L9 10.8l4.2 4.2c.2.3.7.3 1 .3.6 0 1.3-.7 1.3-1.3 0-.3-.2-.7-.3-1l-4.4-4L15 4.6c.3-.2.5-.5.5-.8 0-.7-.7-1.3-1.3-1.3-.3 0-.7.2-1 .3L9 7.1 4.8 2.8c-.3-.1-.7-.3-1-.3z"/>');
            this._clearEl.appendChild(buttonIcon);
            this._loadingEl = this.createIcon("loading", '<path fill="#333" d="M4.4 4.4l.8.8c2.1-2.1 5.5-2.1 7.6 0l.8-.8c-2.5-2.5-6.7-2.5-9.2 0z"/><path opacity=".1" d="M12.8 12.9c-2.1 2.1-5.5 2.1-7.6 0-2.1-2.1-2.1-5.5 0-7.7l-.8-.8c-2.5 2.5-2.5 6.7 0 9.2s6.6 2.5 9.2 0 2.5-6.6 0-9.2l-.8.8c2.2 2.1 2.2 5.6 0 7.7z"/>');
            actions.appendChild(this._clearEl);
            actions.appendChild(this._loadingEl);
            el.appendChild(searchIcon);
            el.appendChild(this._inputEl);
            el.appendChild(actions);
            this._typeahead = new Typeahead(this._inputEl, [], {
                filter: false,
                minLength: this.options.minLength,
                limit: this.options.limit,
                noInitialSelection: true,
            });
            this.container.addEventListener("click", () => {
                this._typeahead.update(this._typeahead.data);
            });
            this.setRenderFunction(this.options.render);
            this._typeahead.getItemValue = this.options.getItemValue;
            this.mapMarker = null;
            this.resultMarkers = [];
            this._handleMarker = this._handleMarker.bind(this);
            this._handleResultMarkers = this._handleResultMarkers.bind(this);
            if (this._map) {
                if (this.options.trackProximity) {
                    this._updateProximity();
                    this._map.on("moveend", this._updateProximity);
                }
                this._maplibregl = this.options.maplibregl;
                if (!this._maplibregl && this.options.marker) {
                    console.error("No maplibregl detected in options. Map markers are disabled. Please set options.maplibregl.");
                    this.options.marker = false;
                }
            }
            return el;
        }
        createIcon(name, path) {
            const icon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            icon.setAttribute("class", "maplibregl-ctrl-geocoder--icon maplibregl-ctrl-geocoder--icon-" + name);
            icon.setAttribute("viewBox", "0 0 18 18");
            icon.setAttribute("xml:space", "preserve");
            icon.setAttribute("width", "18");
            icon.setAttribute("height", "18");
            // IE does not have innerHTML for SVG nodes
            if (!("innerHTML" in icon)) {
                const SVGNodeContainer = document.createElement("div");
                SVGNodeContainer.innerHTML =
                    "<svg>" + path.valueOf().toString() + "</svg>";
                const SVGNode = SVGNodeContainer.firstChild, SVGPath = SVGNode.firstChild;
                icon.appendChild(SVGPath);
            }
            else {
                icon.innerHTML = path;
            }
            return icon;
        }
        onRemove() {
            this.container.remove();
            if (this.options.trackProximity && this._map) {
                this._map.off("moveend", this._updateProximity);
            }
            this._removeMarker();
            this._map = null;
            return this;
        }
        _onPaste(e) {
            const value = (e.clipboardData || window.clipboardData).getData("text");
            if (value.length >= this.options.minLength &&
                this.options.showResultsWhileTyping) {
                this._geocode(value);
            }
        }
        _onKeyDown(e) {
            const ESC_KEY_CODE = 27;
            const TAB_KEY_CODE = 9;
            const ENTER_KEY_CODE = 13;
            if (e.keyCode === ESC_KEY_CODE && this.options.clearAndBlurOnEsc) {
                this._clear(e);
                return this._inputEl.blur();
            }
            const value = this._inputEl.value;
            if (!value) {
                this.fresh = true;
                // the user has removed all the text
                if (e.keyCode !== TAB_KEY_CODE)
                    this.clear(e);
                return (this._clearEl.style.display = "none");
            }
            // TAB, ESC, LEFT, RIGHT, UP, DOWN
            if (e.metaKey ||
                [TAB_KEY_CODE, ESC_KEY_CODE, 37, 39, 38, 40].indexOf(e.keyCode) !== -1)
                return;
            // ENTER
            if (e.keyCode === ENTER_KEY_CODE) {
                if (!this.options.showResultsWhileTyping) {
                    if (!this._typeahead.selected) {
                        this._geocode(value);
                    }
                }
                else {
                    // Pressing enter on the search box will do a search for the currently string input
                    if (this._typeahead.selected == null &&
                        this.geocoderApi.getSuggestions) {
                        this._geocode(value, true);
                        // If suggestions API is not defined pressing enter while the input box is selected will try to fit the results into the current map view
                    }
                    else if (this._typeahead.selected == null) {
                        if (this.options.showResultMarkers) {
                            this._fitBoundsForMarkers();
                        }
                    }
                    return;
                }
            }
            // Show results while typing and greater than min length
            if (value.length >= this.options.minLength &&
                this.options.showResultsWhileTyping) {
                this._geocode(value);
            }
        }
        _showButton() {
            if (this._inputEl.value.length > 0)
                this._clearEl.style.display = "block";
        }
        _hideButton() {
            if (this._typeahead.selected)
                this._clearEl.style.display = "none";
        }
        _onBlur(e) {
            if (this.options.clearOnBlur) {
                this._clearOnBlur(e);
            }
            if (this.options.collapsed) {
                this._collapse();
            }
        }
        // Change events are fire by suggestions library whenever the enter key is pressed or input is blurred
        // This can sometimes cause strange behavior as this function is called before our own onKeyDown handler and thus
        //  we cannot depend on some internal values of the suggestion state like `selected` as those will change or before
        //  our onKeyDown handler.
        _onChange() {
            const selected = this._typeahead.selected;
            // If a suggestion was selected
            if (selected && !selected.geometry) {
                if (selected.placeId)
                    this._geocode(selected.placeId, true, true);
                else
                    this._geocode(selected.text, true);
            }
            else if (selected && JSON.stringify(selected) !== this.lastSelected) {
                this._clearEl.style.display = "none";
                if (this.options.flyTo) {
                    let flyOptions;
                    this._removeResultMarkers();
                    if (selected.properties && exceptions[selected.properties.short_code]) {
                        // Certain geocoder search results return (and therefore zoom to fit)
                        // an unexpectedly large bounding box: for example, both Russia and the
                        // USA span both sides of -180/180, or France includes the island of
                        // Reunion in the Indian Ocean. An incomplete list of these exceptions
                        // at ./exceptions.json provides "reasonable" bounding boxes as a
                        // short-term solution; this may be amended as necessary.
                        flyOptions = extend({}, this.options.flyTo);
                        if (this._map) {
                            this._map.fitBounds(exceptions[selected.properties.short_code].bbox, flyOptions);
                        }
                    }
                    else if (selected.bbox) {
                        const bbox = selected.bbox;
                        flyOptions = extend({}, this.options.flyTo);
                        if (this._map) {
                            this._map.fitBounds([
                                [bbox[0], bbox[1]],
                                [bbox[2], bbox[3]],
                            ], flyOptions);
                        }
                    }
                    else {
                        const defaultFlyOptions = {
                            zoom: this.options.zoom,
                        };
                        flyOptions = extend({}, defaultFlyOptions, this.options.flyTo);
                        //  ensure that center is not overriden by custom options
                        if (selected.center) {
                            flyOptions.center = selected.center;
                        }
                        else if (selected.geometry &&
                            selected.geometry.type &&
                            selected.geometry.type === "Point" &&
                            selected.geometry.coordinates) {
                            flyOptions.center = selected.geometry.coordinates;
                        }
                        if (this._map) {
                            this._map.flyTo(flyOptions);
                        }
                    }
                }
                if (this.options.marker && this._maplibregl) {
                    this._handleMarker(selected);
                }
                // After selecting a feature, re-focus the textarea and set
                // cursor at start, and reset the selected feature.
                this._inputEl.focus();
                this._inputEl.scrollLeft = 0;
                this._inputEl.setSelectionRange(0, 0);
                this.lastSelected = JSON.stringify(selected);
                this._typeahead.selected = null; // reset selection current selection value and set it to last selected
                this._eventEmitter.emit("result", { result: selected });
            }
        }
        _getConfigForRequest() {
            // Possible config proprerties to pass to client
            const keys = [
                "bbox",
                "limit",
                "proximity",
                "countries",
                "types",
                "language",
                "reverseMode",
            ];
            // Create config object
            const config = keys.reduce((config, key) => {
                if (this.options[key]) {
                    if (["countries", "types", "language"].indexOf(key) > -1) {
                        (config[key] = this.options[key].split(/[\s,]+/));
                    }
                    else {
                        (config[key] = this.options[key]);
                    }
                    if (key === "proximity" &&
                        this.options[key] &&
                        typeof this.options[key].longitude === "number" &&
                        typeof this.options[key].latitude === "number") {
                        config[key] = [
                            this.options[key].longitude,
                            this.options[key].latitude,
                        ];
                    }
                }
                return config;
            }, {});
            return config;
        }
        _geocode(searchInput_1) {
            return __awaiter(this, arguments, void 0, function* (searchInput, isSuggestion = false, isPlaceId = false) {
                this._loadingEl.style.display = "block";
                this._eventEmitter.emit("loading", { query: searchInput });
                const config = this._getConfigForRequest();
                const request = this._createGeocodeRequest(config, searchInput, isSuggestion, isPlaceId);
                const localGeocoderResults = this.options.localGeocoder
                    ? (this.options.localGeocoder(searchInput) || [])
                    : [];
                try {
                    const response = yield request;
                    yield this._handleGeocodeResponse(response, config, searchInput, isSuggestion, localGeocoderResults);
                }
                catch (err) {
                    this._handleGeocodeErrorResponse(err, localGeocoderResults);
                }
                return request;
            });
        }
        _createGeocodeRequest(config, searchInput, isSuggestion, isPlaceId) {
            if (this.options.localGeocoderOnly) {
                return Promise.resolve({});
            }
            if (this.options.reverseGeocode && COORDINATES_REGEXP.test(searchInput)) {
                // searchInput resembles coordinates, make the request a reverseGeocode
                return this._createReverseGeocodeRequest(searchInput, config);
            }
            config.query = searchInput;
            if (!this.geocoderApi.getSuggestions) {
                return this.geocoderApi.forwardGeocode(config);
            }
            if (!isSuggestion) {
                // user typed in text and should receive suggestions
                return this.geocoderApi.getSuggestions(config);
            }
            // user clicked on a suggestion
            if (this.geocoderApi.searchByPlaceId && isPlaceId) {
                // suggestion has place Id
                return this.geocoderApi.searchByPlaceId(config);
            }
            return this.geocoderApi.forwardGeocode(config);
        }
        _createReverseGeocodeRequest(searchInput, config) {
            // parse coordinates
            const coords = searchInput
                .split(/[\s(,)?]+/)
                .map((c) => parseFloat(c))
                .reverse();
            // client only accepts one type for reverseGeocode, so
            // use first config type if one, if not default to poi
            config.query = coords;
            config.limit = 1;
            // drop proximity which may have been set by trackProximity since it's not supported by the reverseGeocoder
            if ("proximity" in config) {
                delete config.proximity;
            }
            return this.geocoderApi.reverseGeocode(config);
        }
        _handleGeocodeResponse(response, config, searchInput, isSuggestion, localGeocoderResults) {
            return __awaiter(this, void 0, void 0, function* () {
                this._loadingEl.style.display = "none";
                let res = {};
                if (!response) {
                    res = {
                        type: "FeatureCollection",
                        features: [],
                    };
                }
                else {
                    res = response;
                }
                res.config = config;
                if (this.fresh) {
                    this.fresh = false;
                }
                // supplement Maplibre Geocoding API results with locally populated results
                res.features = res.features
                    ? localGeocoderResults.concat(res.features)
                    : localGeocoderResults;
                const externalGeocoderResultsPromise = this.options.externalGeocoder
                    ? (this.options.externalGeocoder(searchInput, res.features, config) || Promise.resolve([]))
                    : Promise.resolve([]);
                // supplement Geocoding API results with features returned by a promise
                try {
                    const features = yield externalGeocoderResultsPromise;
                    res.features = res.features
                        ? features.concat(res.features)
                        : features;
                }
                catch (_a) {
                    // on error, display the original result
                }
                // apply results filter if provided
                if (this.options.filter && res.features.length) {
                    res.features = res.features.filter(this.options.filter);
                }
                let results = [];
                if ('suggestions' in res) {
                    results = res.suggestions;
                }
                else if ('place' in res) {
                    results = [res.place];
                }
                else {
                    results = res.features;
                }
                if (results.length) {
                    this._clearEl.style.display = "block";
                    this._typeahead.update(results);
                    if ((!this.options.showResultsWhileTyping || isSuggestion) &&
                        this.options.showResultMarkers &&
                        (res.features.length > 0 || 'place' in res)) {
                        this._fitBoundsForMarkers();
                    }
                    this._eventEmitter.emit("results", res);
                }
                else {
                    this._clearEl.style.display = "none";
                    this._typeahead.selected = null;
                    this._renderNoResults();
                    this._eventEmitter.emit("results", res);
                }
            });
        }
        _handleGeocodeErrorResponse(error, localGeocoderResults) {
            this._loadingEl.style.display = "none";
            // in the event of an error in the Geocoding API still display results from the localGeocoder
            if (localGeocoderResults.length && this.options.localGeocoder) {
                this._clearEl.style.display = "block";
                this._typeahead.update(localGeocoderResults);
            }
            else {
                this._clearEl.style.display = "none";
                this._typeahead.selected = null;
                this._renderError();
            }
            this._eventEmitter.emit("results", { features: localGeocoderResults });
            this._eventEmitter.emit("error", { error });
        }
        /**
         * Shared logic for clearing input
         * @param ev - the event that triggered the clear, if available
         */
        _clear(ev) {
            if (ev)
                ev.preventDefault();
            this._inputEl.value = "";
            this._typeahead.selected = null;
            this._typeahead.clear();
            this._onChange();
            this._clearEl.style.display = "none";
            this._removeMarker();
            this._removeResultMarkers();
            this.lastSelected = null;
            this._eventEmitter.emit("clear");
            this.fresh = true;
        }
        /**
         * Clear and then focus the input.
         * @param ev - the event that triggered the clear, if available
         *
         */
        clear(ev) {
            this._clear(ev);
            this._inputEl.focus();
        }
        /**
         * Clear the input, without refocusing it. Used to implement clearOnBlur
         * constructor option.
         * @param ev - the blur event
         */
        _clearOnBlur(ev) {
            /*
             * If relatedTarget is not found, assume user targeted the suggestions list.
             * In that case, do not clear on blur. There are other edge cases where
             * ev.relatedTarget could be null. Clicking on list always results in null
             * relatedtarget because of upstream behavior in `suggestions`.
             *
             * The ideal solution would be to check if ev.relatedTarget is a child of
             * the list. See issue #258 for details on why we can't do that yet.
             */
            if (ev.relatedTarget) {
                this._clear(ev);
            }
        }
        _onQueryResult(results) {
            if (!('features' in results)) {
                return;
            }
            if (!results.features.length)
                return;
            const result = results.features[0];
            this._typeahead.selected = result;
            this._inputEl.value = result.place_name;
            this._onChange();
        }
        _updateProximity() {
            // proximity is designed for local scale, if the user is looking at the whole world,
            // it doesn't make sense to factor in the arbitrary centre of the map
            if (!this._map) {
                return;
            }
            if (this._map.getZoom() > this.options.proximityMinZoom) {
                const center = this._map.getCenter().wrap();
                this.setProximity({ longitude: center.lng, latitude: center.lat });
            }
            else {
                this.setProximity(null);
            }
        }
        _collapse() {
            // do not collapse if input is in focus
            if (!this._inputEl.value && this._inputEl !== document.activeElement)
                this.container.classList.add("maplibregl-ctrl-geocoder--collapsed");
        }
        _unCollapse() {
            this.container.classList.remove("maplibregl-ctrl-geocoder--collapsed");
        }
        /**
         * Set & query the input
         * @param searchInput - location name or other search input
         */
        query(searchInput) {
            return __awaiter(this, void 0, void 0, function* () {
                const results = yield this._geocode(searchInput);
                this._onQueryResult(results);
            });
        }
        _renderError() {
            const errorMessage = `<div class='maplibre-gl-geocoder--error'>${this._localize("errorConnectionFailed")}</div>`;
            this._renderMessage(errorMessage);
        }
        _renderNoResults() {
            const errorMessage = `<div class='maplibre-gl-geocoder--error maplibre-gl-geocoder--no-results'>
        ${this._localize("errorNoResults")}</div>`;
            this._renderMessage(errorMessage);
        }
        _renderMessage(msg) {
            this._typeahead.update([]);
            this._typeahead.selected = null;
            this._typeahead.clear();
            this._typeahead.renderError(msg);
        }
        /**
         * Get a localised string for a given key
         *
         * If language is provided in options, attempt to return localized string (defaults to English)
         * @param key - key in the localization object
         * @returns localized string
         */
        _localize(key) {
            const language = subtag.language(this.options.language.split(',')[0]);
            return this.options.language && (localization === null || localization === void 0 ? void 0 : localization[key][language]) ? localization[key][language] : localization[key]['en'];
        }
        /**
         * Fits the map to the current bounds for the searched results
         */
        _fitBoundsForMarkers() {
            if (this._typeahead.data.length < 1)
                return;
            // Filter out suggestions and restrict to limit
            const results = this._typeahead.data
                .filter((result) => {
                return typeof result === "string" ? false : true;
            })
                .slice(0, this.options.limit);
            this._clearEl.style.display = "none";
            if (this.options.flyTo && this._maplibregl) {
                if (this._map) {
                    const defaultFlyOptions = { padding: 100 };
                    const flyOptions = extend({}, defaultFlyOptions, this.options.flyTo);
                    const bounds = new this._maplibregl.LngLatBounds();
                    for (const feature of results) {
                        bounds.extend(feature.geometry.coordinates);
                    }
                    this._map.fitBounds(bounds, flyOptions);
                }
            }
            if (results.length > 0 && this._maplibregl) {
                this._handleResultMarkers(results);
            }
            return this;
        }
        /**
         * Set input
         * @param searchInput - location name or other search input
         */
        setInput(searchInput) {
            // Set input value to passed value and clear everything else.
            this._inputEl.value = searchInput;
            this._typeahead.selected = null;
            this._typeahead.clear();
            if (searchInput.length >= this.options.minLength &&
                this.options.showResultsWhileTyping) {
                this._geocode(searchInput);
            }
            return this;
        }
        /**
         * Set proximity
         * @param proximity - The new `options.proximity` value. This is a geographical point given as an object with `latitude` and `longitude` properties.
         */
        setProximity(proximity) {
            this.options.proximity = proximity;
            return this;
        }
        /**
         * Get proximity
         * @returns The geocoder proximity
         */
        getProximity() {
            return this.options.proximity;
        }
        /**
         * Set the render function used in the results dropdown
         * @param fn - The function to use as a render function. This function accepts a single {@link CarmenGeojsonFeature} object as input and returns a string.
         */
        setRenderFunction(fn) {
            if (fn && typeof fn == "function") {
                this._typeahead.render = fn;
            }
            return this;
        }
        /**
         * Get the function used to render the results dropdown
         *
         * @returns the render function
         */
        getRenderFunction() {
            return this._typeahead.render;
        }
        /**
         * Get the language to use in UI elements and when making search requests
         *
         * Look first at the explicitly set options otherwise use the browser's language settings
         * @param language - Specify the language to use for response text and query result weighting. Options are IETF language tags comprised of a mandatory ISO 639-1 language code and optionally one or more IETF subtags for country or script. More than one value can also be specified, separated by commas.
         */
        setLanguage(language) {
            this.options.language = language || this.options.language || navigator.language;
            return this;
        }
        /**
         * Get the language to use in UI elements and when making search requests
         * @returns The language(s) used by the plugin, if any
         */
        getLanguage() {
            return this.options.language;
        }
        /**
         * Get the zoom level the map will move to when there is no bounding box on the selected result
         * @returns the map zoom
         */
        getZoom() {
            return this.options.zoom;
        }
        /**
         * Set the zoom level
         * @param zoom - The zoom level that the map should animate to when a `bbox` isn't found in the response. If a `bbox` is found the map will fit to the `bbox`.
         * @returns this
         */
        setZoom(zoom) {
            this.options.zoom = zoom;
            return this;
        }
        /**
         * Get the parameters used to fly to the selected response, if any
         * @returns The `flyTo` option
         */
        getFlyTo() {
            return this.options.flyTo;
        }
        /**
         * Set the flyTo options
         * @param flyTo - If false, animating the map to a selected result is disabled. If true, animating the map will use the default animation parameters. If an object, it will be passed as `options` to the map [`flyTo`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map#flyto) or [`fitBounds`](https://maplibre.org/maplibre-gl-js/docs/API/classes/Map#fitbounds) method providing control over the animation of the transition.
         */
        setFlyTo(flyTo) {
            this.options.flyTo = flyTo;
            return this;
        }
        /**
         * Get the value of the placeholder string
         * @returns The input element's placeholder value
         */
        getPlaceholder() {
            return this.options.placeholder;
        }
        /**
         * Set the value of the input element's placeholder
         * @param placeholder - the text to use as the input element's placeholder
         */
        setPlaceholder(placeholder) {
            this.placeholder = placeholder ? placeholder : this.options.placeholder || this._localize("placeholder");
            this._inputEl.placeholder = this.placeholder;
            this._inputEl.setAttribute("aria-label", this.placeholder);
            return this;
        }
        /**
         * Get the bounding box used by the plugin
         * @returns the bounding box, if any
         */
        getBbox() {
            return this.options.bbox;
        }
        /**
         * Set the bounding box to limit search results to
         * @param bbox - a bounding box given as an array in the format [minX, minY, maxX, maxY].
         */
        setBbox(bbox) {
            this.options.bbox = bbox;
            return this;
        }
        /**
         * Get a list of the countries to limit search results to
         * @returns a comma separated list of countries to limit to, if any
         */
        getCountries() {
            return this.options.countries;
        }
        /**
         * Set the countries to limit search results to
         * @param countries - a comma separated list of countries to limit to
         */
        setCountries(countries) {
            this.options.countries = countries;
            return this;
        }
        /**
         * Get a list of the types to limit search results to
         * @returns a comma separated list of types to limit to
         */
        getTypes() {
            return this.options.types;
        }
        /**
         * Set the types to limit search results to
         * @param types - a comma separated list of types to limit to
         */
        setTypes(types) {
            this.options.types = types;
            return this;
        }
        /**
         * Get the minimum number of characters typed to trigger results used in the plugin
         * @returns The minimum length in characters before a search is triggered
         */
        getMinLength() {
            return this.options.minLength;
        }
        /**
         * Set the minimum number of characters typed to trigger results used by the plugin
         * @param minLength - the minimum length in characters
         */
        setMinLength(minLength) {
            this.options.minLength = minLength;
            if (this._typeahead)
                this._typeahead.options.minLength = minLength;
            return this;
        }
        /**
         * Get the limit value for the number of results to display used by the plugin
         * @returns The limit value for the number of results to display used by the plugin
         */
        getLimit() {
            return this.options.limit;
        }
        /**
         * Set the limit value for the number of results to display used by the plugin
         * @param limit - the number of search results to return
         */
        setLimit(limit) {
            this.options.limit = limit;
            if (this._typeahead)
                this._typeahead.options.limit = limit;
            return this;
        }
        /**
         * Get the filter function used by the plugin
         * @returns the filter function
         */
        getFilter() {
            return this.options.filter;
        }
        /**
         * Set the filter function used by the plugin.
         * @param filter - A function which accepts a {@link CarmenGeojsonFeature} to filter out results from the Geocoding API response before they are included in the suggestions list. Return `true` to keep the item, `false` otherwise.
         */
        setFilter(filter) {
            this.options.filter = filter;
            return this;
        }
        /**
         * Set the geocoding api used by the plugin.
         */
        setGeocoderApi(geocoderApi) {
            this.geocoderApi = geocoderApi;
            return this;
        }
        /**
         * Get the geocoding endpoint the plugin is currently set to
         * @returns the geocoding API
         */
        getGeocoderApi() {
            return this.geocoderApi;
        }
        /**
         * Handle the placement of a result marking the selected result
         * @param selected - the selected geojson feature
         */
        _handleMarker(selected) {
            // clean up any old marker that might be present
            if (!this._map) {
                return;
            }
            this._removeMarker();
            const defaultMarkerOptions = {
                color: "#4668F2",
            };
            const markerOptions = extend({}, defaultMarkerOptions, this.options.marker);
            this.mapMarker = new this._maplibregl.Marker(markerOptions);
            let popup;
            if (this.options.popup) {
                const defaultPopupOptions = {};
                const popupOptions = extend({}, defaultPopupOptions, this.options.popup);
                popup = new this._maplibregl.Popup(popupOptions).setHTML(this.options.popupRender(selected));
            }
            if (selected.center) {
                this.mapMarker.setLngLat(selected.center).addTo(this._map);
                if (this.options.popup)
                    this.mapMarker.setPopup(popup);
            }
            else if (selected.geometry &&
                selected.geometry.type &&
                selected.geometry.type === "Point" &&
                selected.geometry.coordinates) {
                this.mapMarker.setLngLat(selected.geometry.coordinates).addTo(this._map);
                if (this.options.popup)
                    this.mapMarker.setPopup(popup);
            }
            return this;
        }
        /**
         * Handle the removal of a result marker
         */
        _removeMarker() {
            if (this.mapMarker) {
                this.mapMarker.remove();
                this.mapMarker = null;
            }
        }
        /**
         * Handle the placement of a result marking the selected result
         * @param results - the top results to display on the map
         */
        _handleResultMarkers(results) {
            // clean up any old marker that might be present
            if (!this._map) {
                return;
            }
            this._removeResultMarkers();
            const defaultMarkerOptions = {
                color: "#4668F2",
            };
            let markerOptions = extend({}, defaultMarkerOptions, this.options.showResultMarkers);
            for (const result of results) {
                let el;
                if (this.options.showResultMarkers) {
                    if (this.options.showResultMarkers &&
                        this.options.showResultMarkers.element) {
                        el = this.options.showResultMarkers.element.cloneNode(true);
                        markerOptions = extend(markerOptions, { element: el });
                    }
                    const marker = new this._maplibregl.Marker(extend({}, markerOptions, { element: el }));
                    let popup;
                    if (this.options.popup) {
                        const defaultPopupOptions = {};
                        const popupOptions = extend({}, defaultPopupOptions, this.options.popup);
                        popup = new this._maplibregl.Popup(popupOptions).setHTML(this.options.popupRender(result));
                    }
                    if (result.center) {
                        marker.setLngLat(result.center).addTo(this._map);
                        if (this.options.popup)
                            marker.setPopup(popup);
                    }
                    else if (result.geometry &&
                        result.geometry.type &&
                        result.geometry.type === "Point" &&
                        result.geometry.coordinates) {
                        marker.setLngLat(result.geometry.coordinates).addTo(this._map);
                        if (this.options.popup)
                            marker.setPopup(popup);
                    }
                    this.resultMarkers.push(marker);
                }
            }
            return this;
        }
        /**
         * Handle the removal of a result marker
         */
        _removeResultMarkers() {
            if (this.resultMarkers && this.resultMarkers.length > 0) {
                this.resultMarkers.forEach(function (marker) {
                    marker.remove();
                });
                this.resultMarkers = [];
            }
        }
        /**
         * Subscribe to events that happen within the plugin.
         * @param type - name of event. Available events and the data passed into their respective event objects are:
         *
         * - __clear__ `Emitted when the input is cleared`
         * - __loading__ `{ query } Emitted when the geocoder is looking up a query`
         * - __results__ `{ results } Fired when the geocoder returns a response`
         * - __result__ `{ result } Fired when input is set`
         * - __error__ `{ error } Error as string`
         * @param fn - function that's called when the event is emitted.
         */
        on(type, fn) {
            this._eventEmitter.on(type, fn);
            return this;
        }
        /**
         * Subscribe to events that happen within the plugin only once.
         * @param type - Event name.
         * Available events and the data passed into their respective event objects are:
         *
         * - __clear__ `Emitted when the input is cleared`
         * - __loading__ `{ query } Emitted when the geocoder is looking up a query`
         * - __results__ `{ results } Fired when the geocoder returns a response`
         * - __result__ `{ result } Fired when input is set`
         * - __error__ `{ error } Error as string`
         * @returns a Promise that resolves when the event is emitted.
         */
        once(type) {
            return new Promise((resolve) => {
                this._eventEmitter.once(type, resolve);
            });
        }
        /**
         * Remove an event
         * @param type - Event name.
         * @param fn - Function that should unsubscribe to the event emitted.
         */
        off(type, fn) {
            this._eventEmitter.removeListener(type, fn);
            return this;
        }
    }

    return MaplibreGeocoder;

}));
//# sourceMappingURL=maplibre-gl-geocoder.js.map
