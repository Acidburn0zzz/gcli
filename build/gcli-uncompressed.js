/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Ajax.org Code Editor (ACE).
 *
 * The Initial Developer of the Original Code is
 * Ajax.org B.V.
 * Portions created by the Initial Developer are Copyright (C) 2010
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com)
 *      Fabian Jakobs <fabian AT ajax DOT org>
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * Define a module along with a payload
 * @param module a name for the payload
 * @param payload a function to call with (require, exports, module) params
 */

(function() {

if (window.require) {
    require.packaged = true;
    return;
}

var _define = function(module, deps, payload) {
    if (typeof module !== 'string') {
        if (_define.original)
            _define.original.apply(window, arguments);
        else {
            console.error('dropping module because define wasn\'t a string.');
            console.trace();
        }
        return;
    }

    if (arguments.length == 2)
        payload = deps;

    if (!define.modules)
        define.modules = {};

    define.modules[module] = payload;
};
if (window.define)
    _define.original = window.define;

window.define = _define;


/**
 * Get at functionality define()ed using the function above
 */
var _require = function(module, callback) {
    if (Object.prototype.toString.call(module) === "[object Array]") {
        var params = [];
        for (var i = 0, l = module.length; i < l; ++i) {
            var dep = lookup(module[i]);
            if (!dep && _require.original)
                return _require.original.apply(window, arguments);
            params.push(dep);
        }
        if (callback) {
            callback.apply(null, params);
        }
    }
    else if (typeof module === 'string') {
        var payload = lookup(module);
        if (!payload && _require.original)
            return _require.original.apply(window, arguments);

        if (callback) {
            callback();
        }

        return payload;
    }
    else {
        if (_require.original)
            return _require.original.apply(window, arguments);
    }
};

if (window.require)
    _require.original = window.require;

window.require = _require;
require.packaged = true;

/**
 * Internal function to lookup moduleNames and resolve them by calling the
 * definition function if needed.
 */
var lookup = function(moduleName) {
    var module = define.modules[moduleName];
    if (module == null) {
        console.error('Missing module: ' + moduleName);
        return null;
    }

    if (typeof module === 'function') {
        var exports = {};
        module(require, exports, { id: moduleName, uri: '' });
        // cache the resulting module object for next time
        define.modules[moduleName] = exports;
        return exports;
    }

    return module;
};

})();
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/index', ['require', 'exports', 'module' , 'gcli/ui/index', 'gcli/canon', 'gcli/cli', 'gcli/promise', 'gcli/types', 'gcli/commands/help', 'gcli/ui/field'], function(require, exports, module) {
var gcli = exports;

//window.gcli = window.require.s.contexts._.defined['gcli/index'];

var ui = require('gcli/ui/index');
var canon = require('gcli/canon');
var cli = require('gcli/cli');
var Promise = require('gcli/promise').Promise;


gcli.createView = ui.createView;

gcli.addCommand = canon.addCommand;
gcli.addCommands = canon.addCommands;
gcli.removeCommand = canon.removeCommand;
gcli.removeCommands = canon.removeCommands;
gcli.globalReportList = canon.globalReportList;

gcli.Requisition = cli.Requisition;
gcli.getEnvironment = cli.getEnvironment;

gcli.createPromise = function createPromise() {
    return new Promise();
};

gcli.startup = function() {
    require('gcli/types').startup();
    require('gcli/commands/help').startup();
    require('gcli/cli').startup();
    require('gcli/ui/field').startup();
};

gcli.shutdown = function() {
    require('gcli/ui/field').shutdown();
    require('gcli/cli').shutdown();
    require('gcli/commands/help').shutdown();
    require('gcli/types').shutdown();
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *      Julian Viereck (julian.viereck@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/index', ['require', 'exports', 'module' , 'gcli/util', 'gcli/cli', 'gcli/ui/request_view', 'gcli/ui/popup', 'gcli/ui/inputter', 'gcli/ui/hinter', 'gcli/ui/arg_fetch', 'gcli/ui/menu', 'gcli/ui/domtemplate'], function(require, exports, module) {
var ui = exports;


var console = require('gcli/util').console;

var Requisition = require('gcli/cli').Requisition;

ui.RequestsView = require('gcli/ui/request_view').RequestsView;
ui.Popup = require('gcli/ui/popup').Popup;
ui.Inputter = require('gcli/ui/inputter').Inputter;
ui.Hinter = require('gcli/ui/hinter').Hinter;

ui.ArgFetcher = require('gcli/ui/arg_fetch').ArgFetcher;
ui.Menu = require('gcli/ui/menu').Menu;
ui.Templater = require('gcli/ui/domtemplate').Templater;


/**
 * A class to handle the simplest UI implementation
 */
function createView(options) {
    options = options || {};

    // The requisition depends on no UI components
    if (options.requisition == null) {
        options.requisition = new Requisition(options.env);
    }
    else if (typeof options.requisition === 'function') {
        options.requisition = new options.requisition(options);
    }

    // The inputter should depend only on the requisition
    if (options.inputter == null) {
        options.inputter = new ui.Inputter(options);
    }
    else if (typeof options.inputter === 'function') {
        options.inputter = new options.inputter(options);
    }

    // We need to init the popup children before the Popup itself
    if (options.children == null) {
        options.children = [
            new ui.Hinter(options),
            new ui.RequestsView(options)
        ];
    }
    else {
        for (var i = 0; i < options.children.length; i++) {
            if (typeof options.children[i] === 'function') {
                options.children[i] = new options.children[i](options);
            }
        }
    }

    // The Popup has most dependencies
    if (options.popup == null) {
        options.popup = new ui.Popup(options);
    }
    else if (typeof options.popup === 'function') {
        options.popup = new options.popup(options);
    }

    options.inputter.update();
}

ui.createView = createView;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/util', ['require', 'exports', 'module' ], function(require, exports, module) {

/*
 * This module is a Pilot-Lite. It exports a number of objects that replicate
 * parts of the Pilot project. It aims to be mostly API compatible, while
 * removing the submodule complexity and helping us make things work inside
 * Firefox.
 * The Pilot compatible exports are: console/dom/event
 *
 * In addition it contains a small event library similar to EventEmitter but
 * which makes it harder to mistake the event in use.
 */


//------------------------------------------------------------------------------

/**
 * This object represents a "safe console" object that forwards debugging
 * messages appropriately without creating a dependency on Firebug in Firefox.
 */
var console = {};

var noop = function() {};

// These are the functions that are available in Chrome 4/5, Safari 4
// and Firefox 3.6. Don't add to this list without checking browser support
var NAMES = [
  "assert", "count", "debug", "dir", "dirxml", "error", "group", "groupEnd",
  "info", "log", "profile", "profileEnd", "time", "timeEnd", "trace", "warn"
];

if (typeof(window) === 'undefined') {
  // We're in a web worker. Forward to the main thread so the messages
  // will show up.
  NAMES.forEach(function(name) {
    console[name] = function() {
      var args = Array.prototype.slice.call(arguments);
      var msg = { op: 'log', method: name, args: args };
      postMessage(JSON.stringify(msg));
    };
  });
} else {
  // For each of the console functions, copy them if they exist, stub if not
  NAMES.forEach(function(name) {
    if (window.console && window.console[name]) {
      console[name] = Function.prototype.bind.call(window.console[name], window.console);
    } else {
      console[name] = noop;
    }
  });
}

exports.console = console;


//------------------------------------------------------------------------------

/**
 * Create an event.
 * For use as follows:
 *   function Hat() {
 *     this.putOn = createEvent();
 *     ...
 *   }
 *   Hat.prototype.adorn = function(person) {
 *     this.putOn({ hat: hat, person: person });
 *     ...
 *   }
 *
 *   var hat = new Hat();
 *   hat.putOn.add(function(ev) {
 *     console.log('The hat ', ev.hat, ' has is worn by ', ev.person);
 *   }, scope);
 */
exports.createEvent = function() {
  var handlers = [];

  /**
   * This is how the event is triggered.
   * @param {object} ev The event object to be passed to the event listeners
   */
  var event = function(ev) {
    handlers.forEach(function(handler) {
      handler.func.apply(handler.scope, [ ev ]);
    });
  };

  /**
   * Add a new handler function
   * @param {function} func The function to call when this event is triggered
   * @param {object} scope Optional 'this' object for the function call
   */
  event.add = function(func, scope) {
    handlers.push({ func: func, scope: scope });
  };

  /**
   * Remove a handler function added through add(). Both func and scope must
   * be strict equals (===) the values used in the call to add()
   * @param {function} func The function to call when this event is triggered
   * @param {object} scope Optional 'this' object for the function call
   */
  event.remove = function(func, scope) {
    handlers = handlers.filter(function(test) {
      return test.func !== func && test.scope !== scope;
    });
  };

  /**
   * Remove all handlers.
   * Reset the state of this event back to it's post create state
   */
  event.removeAll = function() {
    handlers = [];
  };

  return event;
};


//------------------------------------------------------------------------------

var dom = {};

var NS_XHTML = "http://www.w3.org/1999/xhtml";
var NS_XUL = "http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul";

/**
 * Pass-through to createElement or createElementNS
 * @param {string} tag The name of the tag to create
 * @param {string} ns Custom namespace
 * @param {HTMLDocument} doc The document in which to create the element
 * @returns {HTMLElement} The created element
 */
dom.createElement = function(tag, ns, doc) {
  var doc = doc || document;
  return doc.createElementNS ?
         doc.createElementNS(ns || NS_XHTML, tag) :
         doc.createElement(tag);
};

/**
 * Remove all the child nodes from this node
 * @param {HTMLElement} el The element that should have it's children removed
 */
dom.clearElement = function(el) {
  while (el.hasChildNodes()) {
    el.removeChild(el.firstChild);
  }
};

if (!document.documentElement.classList) {
  /**
   * Is the given element marked with the given CSS class?
   */
  dom.hasCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g);
    return classes.indexOf(name) !== -1;
  };

  /**
   * Add a CSS class to the list of classes on the given node
   */
  dom.addCssClass = function(el, name) {
    if (!dom.hasCssClass(el, name)) {
      el.className += " " + name;
    }
  };

  /**
   * Remove a CSS class from the list of classes on the given node
   */
  dom.removeCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g);
    while (true) {
      var index = classes.indexOf(name);
      if (index == -1) {
        break;
      }
      classes.splice(index, 1);
    }
    el.className = classes.join(" ");
  };

  /**
   * Add the named CSS class from the element if it is not already present or
   * remove it if is present.
   */
  dom.toggleCssClass = function(el, name) {
    var classes = el.className.split(/\s+/g), add = true;
    while (true) {
      var index = classes.indexOf(name);
      if (index == -1) {
        break;
      }
      add = false;
      classes.splice(index, 1);
    }
    if (add) {
      classes.push(name);
    }

    el.className = classes.join(" ");
    return add;
  };
} else {
  /*
   * classList shim versions of methods above.
   * See the functions above for documentation
   */
  dom.hasCssClass = function(el, name) {
    return el.classList.contains(name);
  };

  dom.addCssClass = function(el, name) {
    el.classList.add(name);
  };

  dom.removeCssClass = function(el, name) {
    el.classList.remove(name);
  };

  dom.toggleCssClass = function(el, name) {
    return el.classList.toggle(name);
  };
}

/**
 * Add or remove a CSS class from the list of classes on the given node
 * depending on the value of <tt>include</tt>
 */
dom.setCssClass = function(node, className, include) {
  if (include) {
    dom.addCssClass(node, className);
  } else {
    dom.removeCssClass(node, className);
  }
};

/**
 * Create a style element in the document head, and add the given CSS text to
 * it.
 * @param {string} cssText The CSS declarations to append
 * @param {HTMLDocument} doc The document element to work from
 */
dom.importCssString = function(cssText, doc) {
  doc = doc || document;

  if (doc.createStyleSheet) {
    var sheet = doc.createStyleSheet();
    sheet.cssText = cssText;
  }
  else {
    var style = doc.createElementNS ?
        doc.createElementNS(NS_XHTML, "style") :
        doc.createElement("style");

    style.appendChild(doc.createTextNode(cssText));

    var head = doc.getElementsByTagName("head")[0] || doc.documentElement;
    head.appendChild(style);
  }
};

/**
 * Shim for window.getComputedStyle
 */
dom.computedStyle = function(element, style) {
  var win = element.ownerDocument.defaultView;
  if (win.getComputedStyle) {
    var styles = win.getComputedStyle(element, "") || {};
    return styles[style] || "";
  }
  else {
    return element.currentStyle[style];
  }
};

/**
 * Using setInnerHtml(foo) rather than innerHTML = foo allows us to enable
 * tweaks in XHTML documents.
 */
dom.setInnerHtml = function(el, html) {
  if (el.namespaceURI === NS_XHTML) {
    dom.clearElement(el);
    var range = el.ownerDocument.createRange();
    html = "<div xmlns='" + NS_XHTML + "'>" + html + "</div>";
    el.appendChild(range.createContextualFragment(html));
  }
  else {
    el.innerHTML = html;
  }
};

/**
 * Shim to textarea.selectionStart
 */
dom.getSelectionStart = function(textarea) {
  try {
    return textarea.selectionStart || 0;
  }
  catch (e) {
    return 0;
  }
};

/**
 * Shim to textarea.selectionStart
 */
dom.setSelectionStart = function(textarea, start) {
  return textarea.selectionStart = start;
};

/**
 * Shim to textarea.selectionEnd
 */
dom.getSelectionEnd = function(textarea) {
  try {
    return textarea.selectionEnd || 0;
  } catch (e) {
    return 0;
  }
};

/**
 * Shim to textarea.selectionEnd
 */
dom.setSelectionEnd = function(textarea, end) {
  return textarea.selectionEnd = end;
};

exports.dom = dom;


//------------------------------------------------------------------------------

/**
 * Various event utilities
 */
var event = {};

/**
 * Shim for lack of addEventListener on old IE.
 */
event.addListener = function(elem, type, callback) {
  if (elem.addEventListener) {
    return elem.addEventListener(type, callback, false);
  }
  if (elem.attachEvent) {
    var wrapper = function() {
      callback(window.event);
    };
    callback._wrapper = wrapper;
    elem.attachEvent("on" + type, wrapper);
  }
};

/**
 * Shim for lack of removeEventListener on old IE.
 */
event.removeListener = function(elem, type, callback) {
  if (elem.removeEventListener) {
    return elem.removeEventListener(type, callback, false);
  }
  if (elem.detachEvent) {
    elem.detachEvent("on" + type, callback._wrapper || callback);
  }
};

/**
 * Prevents propagation and clobbers the default action of the passed event
 */
event.stopEvent = function(e) {
  event.stopPropagation(e);
  if (e.preventDefault) {
    e.preventDefault();
  }
  return false;
};

/**
 * Prevents propagation of the event
 */
event.stopPropagation = function(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }
  else {
    e.cancelBubble = true;
  }
};

/**
 * Browser detection. Used only for places where feature detection doesn't make
 * sense.
 */
var os = (navigator.platform.match(/mac|win|linux/i) || ["other"])[0].toLowerCase();
// oldGecko == rev < 2.0
var isOldGecko = window.controllers && window.navigator.product === "Gecko" && /rv\:1/.test(navigator.userAgent);
// Is the user using a browser that identifies itself as Mac OS
var isMac = (os === "mac");
// Is this Opera
var isOpera = window.opera && Object.prototype.toString.call(window.opera) == "[object Opera]";

var MODIFIER_KEYS = { 16: 'Shift', 17: 'Ctrl', 18: 'Alt', 224: 'Meta' };
var FUNCTION_KEYS = {
    8: "Backspace", 9: "Tab", 13: "Return", 19: "Pause", 27: "Esc",
    32: "Space", 33: "PageUp", 34: "PageDown", 35: "End", 36: "Home",
    37: "Left", 38: "Up", 39: "Right", 40: "Down",
    44: "Print", 45: "Insert", 46: "Delete",
    112: "F1", 113: "F2", 114: "F3", 115: "F4", 116: "F5", 117: "F6",
    118: "F7", 119: "F8", 120: "F9", 121: "F10", 122: "F11", 123: "F12",
    144: "Numlock", 145: "Scrolllock"
};

function normalizeCommandKeys(callback, ev, keyCode) {
    var hashId = 0;
    if (isOpera && isMac) {
        hashId = 0 | (ev.metaKey ? 1 : 0) | (ev.altKey ? 2 : 0)
            | (ev.shiftKey ? 4 : 0) | (ev.ctrlKey ? 8 : 0);
    } else {
        hashId = 0 | (ev.ctrlKey ? 1 : 0) | (ev.altKey ? 2 : 0)
            | (ev.shiftKey ? 4 : 0) | (ev.metaKey ? 8 : 0);
    }

    if (keyCode in MODIFIER_KEYS) {
        switch (MODIFIER_KEYS[keyCode]) {
            case "Alt":
                hashId = 2;
                break;
            case "Shift":
                hashId = 4;
                break;
            case "Ctrl":
                hashId = 1;
                break;
            default:
                hashId = 8;
                break;
        }
        keyCode = 0;
    }

    if (hashId & 8 && (keyCode == 91 || keyCode == 93)) {
        keyCode = 0;
    }

    // If there is no hashID and the keyCode is not a function key, then
    // we don't call the callback as we don't handle a command key here
    // (it's a normal key/character input).
    if (hashId == 0 && !(keyCode in FUNCTION_KEYS)) {
        return false;
    }

    return callback(ev, hashId, keyCode);
}

/**
 * Shim to fix bugs in old Firefox and Mac/Opera
 */
event.addCommandKeyListener = function(el, callback) {
    var addListener = event.addListener;
    if (isOldGecko) {
        // Old versions of Gecko aka. Firefox < 4.0 didn't repeat the keydown
        // event if the user pressed the key for a longer time. Instead, the
        // keydown event was fired once and later on only the keypress event.
        // To emulate the 'right' keydown behavior, the keyCode of the initial
        // keyDown event is stored and in the following keypress events the
        // stores keyCode is used to emulate a keyDown event.
        var lastKeyDownKeyCode = null;
        addListener(el, "keydown", function(e) {
            lastKeyDownKeyCode = e.keyCode;
        });
        addListener(el, "keypress", function(e) {
            return normalizeCommandKeys(callback, e, lastKeyDownKeyCode);
        });
    } else {
        var lastDown = null;

        addListener(el, "keydown", function(e) {
            lastDown = e.keyIdentifier || e.keyCode;
            return normalizeCommandKeys(callback, e, e.keyCode);
        });

        // repeated keys are fired as keypress and not keydown events
        if (isMac && isOpera) {
            addListener(el, "keypress", function(e) {
                var keyId = e.keyIdentifier || e.keyCode;
                if (lastDown !== keyId) {
                    return normalizeCommandKeys(callback, e, e.keyCode);
                } else {
                    lastDown = null;
                }
            });
        }
    }
};

exports.event = event;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/cli', ['require', 'exports', 'module' , 'gcli/util', 'gcli/canon', 'gcli/types', 'gcli/argument'], function(require, exports, module) {


var console = require('gcli/util').console;
var createEvent = require('gcli/util').createEvent;

var canon = require('gcli/canon');

var types = require('gcli/types');
var Status = require('gcli/types').Status;
var Conversion = require('gcli/types').Conversion;
var ArrayType = require('gcli/types').ArrayType;
var StringType = require('gcli/types').StringType;
var BooleanType = require('gcli/types').BooleanType;
var SelectionType = require('gcli/types').SelectionType;

var Argument = require('gcli/argument').Argument;
var ArrayArgument = require('gcli/argument').ArrayArgument;
var NamedArgument = require('gcli/argument').NamedArgument;
var TrueNamedArgument = require('gcli/argument').TrueNamedArgument;
var MergedArgument = require('gcli/argument').MergedArgument;


/**
 * Assignment is a link between a parameter and the data for that parameter.
 * The data for the parameter is available as in the preferred type and as
 * an Argument for the CLI.
 * <p>We also record validity information where applicable.
 * <p>For values, null and undefined have distinct definitions. null means
 * that a value has been provided, undefined means that it has not.
 * Thus, null is a valid default value, and common because it identifies an
 * parameter that is optional. undefined means there is no value from
 * the command line.
 *
 * <h2>Events<h2>
 * Assignment publishes the following event:<ul>
 * <li>assignmentChange: Either the value or the text has changed. It is likely
 * that any UI component displaying this argument will need to be updated.
 * The event object looks like:
 * <tt>{ assignment: ..., conversion: ..., oldConversion: ... }</tt>
 * @constructor
 */
function Assignment(param, paramIndex) {
    this.param = param;
    this.paramIndex = paramIndex;
    this.assignmentChange = createEvent();

    this.setDefault();
};

/**
 * The parameter that we are assigning to
 * @readonly
 */
Assignment.prototype.param = undefined;

Assignment.prototype.conversion = undefined;

/**
 * The index of this parameter in the parent Requisition. paramIndex === -1
 * is the command assignment although this should not be relied upon, it is
 * better to test param instanceof CommandAssignment
 */
Assignment.prototype.paramIndex = undefined;

/**
 * Easy accessor for conversion.arg
 */
Assignment.prototype.getArg = function() {
    return this.conversion.arg;
};

/**
 * Easy accessor for conversion.value
 */
Assignment.prototype.getValue = function() {
    return this.conversion.value;
};

/**
 * Easy (and safe) accessor for conversion.message
 */
Assignment.prototype.getMessage = function() {
    return this.conversion.message ? this.conversion.message : '';
};

/**
 * Easy (and safe) accessor for conversion.getPredictions()
 */
Assignment.prototype.getPredictions = function() {
    return this.conversion.getPredictions();
};

/**
 * Report on the status of the last parse() conversion.
 * We force mutations to happen through this method rather than have
 * setValue and setArgument functions to help maintain integrity when we
 * have ArrayArguments and don't want to get confused. This way assignments
 * are just containers for a conversion rather than things that store
 * a connection between an arg/value.
 * @see types.Conversion
 */
Assignment.prototype.setConversion = function(conversion) {
    var oldConversion = this.conversion;

    this.conversion = conversion;
    this.conversion.assign(this);

    if (this.conversion.equals(oldConversion)) {
        return;
    }

    this.assignmentChange({
        assignment: this,
        conversion: this.conversion,
        oldConversion: oldConversion
    });
};

/**
 * Find a default value for the conversion either from the parameter, or from
 * the type, or failing that by parsing an empty argument.
 */
Assignment.prototype.setDefault = function() {
    var conversion;
    if (this.param.getDefault) {
        conversion = this.param.getDefault();
    }
    else if (this.param.type.getDefault) {
        conversion = this.param.type.getDefault();
    }
    else {
        conversion = this.param.type.parse(new Argument());
    }

    this.setConversion(conversion);
};

/**
 * Make sure that there is some content for this argument by using an
 * Argument of '' if needed.
 * <p>TODO: It isn't clear if we should be sending events from this method.
 * It should only be called when structural changes are happening in which
 * case we're going to ignore the event anyway. But on the other hand
 * perhaps this function shouldn't need to know how it is used, and should
 * do the inefficient thing.
 */
Assignment.prototype.ensureVisibleArgument = function() {
    if (!this.conversion.arg.isBlank()) {
        return false;
    }

    var arg = this.conversion.arg.beget('', {
        prefixSpace: this.param instanceof CommandAssignment
    });
    this.conversion = this.param.type.parse(arg);
    this.conversion.assign(this);

    return true;
};

/**
 * Work out what the status of the current conversion is which involves looking
 * not only at the conversion, but also checking if data has been provided
 * where it should.
 * @param arg For assignments with multiple args (e.g. array assignments) we
 * can narrow the search for status to a single argument.
 */
Assignment.prototype.getStatus = function(arg) {
    if (this.param.isDataRequired() && !this.conversion.isDataProvided()) {
        return Status.ERROR;
    }

    // Selection/Boolean types with a defined range of values will say that
    // '' is INCOMPLETE, but the parameter may be optional, so we don't ask
    // if the user doesn't need to enter something and hasn't done so.
    if (!this.param.isDataRequired() && this.getArg().isBlank()) {
        return Status.VALID;
    }

    return this.conversion.getStatus(arg);
};

/**
 * Basically <tt>value = conversion.predictions[0])</tt> done in a safe
 * way.
 */
Assignment.prototype.complete = function() {
    var predictions = this.conversion.getPredictions();
    if (predictions.length > 0) {
        var value = predictions[0];
        var text = this.param.type.stringify(value);
        var arg = this.conversion.arg.beget(text);
        var conversion = new Conversion(value, arg);
        this.setConversion(conversion);
    }
};

/**
 * Replace the current value with the lower value if such a concept
 * exists.
 */
Assignment.prototype.decrement = function() {
    var replacement = this.param.type.decrement(this.conversion.value);
    if (replacement != null) {
        var str = this.param.type.stringify(replacement);
        var arg = this.conversion.arg.beget(str);
        var conversion = new Conversion(replacement, arg);
        this.setConversion(conversion);
    }
};

/**
 * Replace the current value with the higher value if such a concept
 * exists.
 */
Assignment.prototype.increment = function() {
    var replacement = this.param.type.increment(this.conversion.value);
    if (replacement != null) {
        var str = this.param.type.stringify(replacement);
        var arg = this.conversion.arg.beget(str);
        var conversion = new Conversion(replacement, arg);
        this.setConversion(conversion);
    }
};

/**
 * Helper when we're rebuilding command lines.
 */
Assignment.prototype.toString = function() {
    return this.conversion.toString();
};

exports.Assignment = Assignment;


/**
 * Select from the available commands
 */
var command = new SelectionType({
    name: 'command',
    data: function() {
        return canon.getCommands();
    },
    stringify: function(command) {
        return command.name;
    },
    fromString: function(str) {
        return canon.getCommand(str);
    }
});


/**
 * Registration and de-registration.
 */
exports.startup = function() {
    types.registerType(command);

    CommandAssignment.prototype = new Assignment(new canon.Parameter({
        name: '__command',
        type: 'command',
        description: 'The command to execute'
    }), -1);

    CommandAssignment.prototype.getStatus = function(arg) {
        return Status.combine(
            Assignment.prototype.getStatus.call(this, arg),
            this.conversion.value && !this.conversion.value.exec ?
                Status.INCOMPLETE : Status.VALID
        );
    };

    UnassignedAssignment.prototype = new Assignment(new canon.Parameter({
        name: '__unassigned',
        type: 'string'
    }), -1);

    UnassignedAssignment.prototype.getStatus = function(arg) {
        return Status.ERROR;
    };

    UnassignedAssignment.prototype.setUnassigned = function(args) {
        if (!args || args.length === 0) {
            this.setDefault();
        }
        else {
            var conversion = this.param.type.parse(new MergedArgument(args));
            this.setConversion(conversion);
        }
    };
};

exports.shutdown = function() {
    types.unregisterType(command);
};


/**
 * This is a special assignment to reflect the command itself.
 */
function CommandAssignment() { }

/**
 * Special assignment used when ignoring parameters that don't have a home
 */
function UnassignedAssignment() { }


/**
 * A Requisition collects the information needed to execute a command.
 * There is no point in a requisition for parameter-less commands because there
 * is no information to collect. A Requisition is a collection of assignments
 * of values to parameters, each handled by an instance of Assignment.
 *
 * <h2>Events<h2>
 * <p>Requisition publishes the following events:
 * <ul>
 * <li>commandChange: The command has changed. It is likely that a UI
 * structure will need updating to match the parameters of the new command.
 * The event object looks like { command: A }
 * <li>assignmentChange: This is a forward of the Assignment.assignmentChange
 * event. It is fired when any assignment (except the commandAssignment)
 * changes.
 * <li>inputChange: The text to be mirrored in a command line has changed.
 * The event object looks like { newText: X }.
 * </ul>
 * @constructor
 */
function Requisition(env) {
    this.env = env;

    // The command that we are about to execute.
    // @see setCommandConversion()
    this.commandAssignment = new CommandAssignment();

    // The object that stores of Assignment objects that we are filling out.
    // The Assignment objects are stored under their param.name for named
    // lookup. Note: We make use of the property of Javascript objects that
    // they are not just hashmaps, but linked-list hashmaps which iterate in
    // insertion order.
    // _assignments excludes the commandAssignment.
    this._assignments = {};

    // The count of assignments. Excludes the commandAssignment
    this.assignmentCount = 0;

    // Used to store cli arguments in the order entered on the cli
    this._args = null;

    // Used to store cli arguments that were not assigned to parameters
    this._unassigned = new UnassignedAssignment();

    // Temporarily set this to true to prevent _onAssignmentChange resetting
    // argument positions
    this._structuralChangeInProgress = false;

    // Pre-bind the event listeners
    this.commandAssignment.assignmentChange.add(this._onCommandAssignmentChange, this);

    this.reportList = canon.globalReportList;

    this.assignmentChange = createEvent();
    this.commandChange = createEvent();
    this.inputChange = createEvent();
}

/**
 * Some number that is higher than the most args we'll ever have. Would use
 * MAX_INTEGER if that made sense
 */
var MORE_THAN_THE_MOST_ARGS = 1000000;

/**
 * When any assignment changes,
 */
Requisition.prototype._onAssignmentChange = function(ev) {
    // Don't report an event if the value is unchanged
    if (ev.oldConversion != null &&
            ev.conversion.valueEquals(ev.oldConversion)) {
        return;
    }

    if (this._structuralChangeInProgress) {
        return;
    }

    this.assignmentChange(ev);

    // Both for argument position and the inputChange event, we only care
    // about changes to the argument.
    if (ev.conversion.argEquals(ev.oldConversion)) {
        return;
    }

    this._structuralChangeInProgress = true;

    // Do preceding arguments need to have dummy values applied so we don't
    // get a hole in the command line?
    if (ev.assignment.param.isPositionalAllowed()) {
        for (var i = 0; i < ev.assignment.paramIndex; i++) {
            var assignment = this.getAssignment(i);
            if (assignment.param.isPositionalAllowed()) {
                if (assignment.ensureVisibleArgument()) {
                    this._args.push(assignment.getArg());
                }
            }
        }
    }

    // Remember where we found the first match
    var index = MORE_THAN_THE_MOST_ARGS;
    for (var i = 0; i < this._args.length; i++) {
        if (this._args[i].assignment === ev.assignment) {
            if (i < index) {
                index = i;
            }
            this._args.splice(i, 1);
            i--;
        }
    }

    if (index === MORE_THAN_THE_MOST_ARGS) {
        this._args.push(ev.assignment.getArg());
    }
    else {
        // TODO: is there a way to do this that doesn't involve a loop?
        var newArgs = ev.conversion.arg.getArgs();
        for (var i = 0; i < newArgs.length; i++) {
            this._args.splice(index + i, 0, newArgs[i]);
        }
    }
    this._structuralChangeInProgress = false;

    this.inputChange();
};

/**
 * When the command changes, we need to keep a bunch of stuff in sync
 */
Requisition.prototype._onCommandAssignmentChange = function(ev) {
    this._assignments = {};

    var command = this.commandAssignment.getValue();
    if (command) {
        for (var i = 0; i < command.params.length; i++) {
            var param = command.params[i];
            var assignment = new Assignment(param, i);
            assignment.assignmentChange.add(this._onAssignmentChange, this);
            this._assignments[param.name] = assignment;
        }
    }
    this.assignmentCount = Object.keys(this._assignments).length;

    this.commandChange({
        requisition: this,
        oldValue: ev.oldValue,
        newValue: command
    });
};

/**
 * Assignments have an order, so we need to store them in an array.
 * But we also need named access ...
 */
Requisition.prototype.getAssignment = function(nameOrNumber) {
    var name = (typeof nameOrNumber === 'string') ?
        nameOrNumber :
        Object.keys(this._assignments)[nameOrNumber];
    return this._assignments[name];
},

/**
 * Where parameter name == assignment names - they are the same.
 */
Requisition.prototype.getParameterNames = function() {
    return Object.keys(this._assignments);
},

/**
 * A *shallow* clone of the assignments.
 * This is useful for systems that wish to go over all the assignments
 * finding values one way or another and wish to trim an array as they go.
 */
Requisition.prototype.cloneAssignments = function() {
    return Object.keys(this._assignments).map(function(name) {
        return this._assignments[name];
    }, this);
};

/**
 * Returns the most severe status
 */
Requisition.prototype.getStatus = function() {
    var status = Status.VALID;
    this.getAssignments(true).forEach(function(assignment) {
        var assignStatus = assignment.getStatus();
        if (assignment.getStatus() > status) {
            status = assignStatus;
        }
    }, this);
    return status;
};

/**
 * Extract the names and values of all the assignments, and return as
 * an object.
 */
Requisition.prototype.getArgsObject = function() {
    var args = {};
    this.getAssignments().forEach(function(assignment) {
        args[assignment.param.name] = assignment.getValue();
    }, this);
    return args;
};

/**
 * Access the arguments as an array.
 * @param includeCommand By default only the parameter arguments are
 * returned unless (includeCommand === true), in which case the list is
 * prepended with commandAssignment.getArg()
 */
Requisition.prototype.getAssignments = function(includeCommand) {
    var assignments = [];
    if (includeCommand === true) {
        assignments.push(this.commandAssignment);
    }
    Object.keys(this._assignments).forEach(function(name) {
        assignments.push(this.getAssignment(name));
    }, this);
    return assignments;
};

/**
 * Reset all the assignments to their default values
 */
Requisition.prototype.setDefaultArguments = function() {
    this.getAssignments().forEach(function(assignment) {
        assignment.setDefault();
    }, this);
};

/**
 * Extract a canonical version of the input
 */
Requisition.prototype.toCanonicalString = function() {
    var line = [];

    var cmd = this.commandAssignment.getValue() ?
            this.commandAssignment.getValue().name :
            this.commandAssignment.getArg().text;
    line.push(cmd);

    Object.keys(this._assignments).forEach(function(name) {
        var assignment = this._assignments[name];
        var type = assignment.param.type;
        // TODO: This will cause problems if there is a non-default value
        // after a default value. Also we need to decide when to use
        // named parameters in place of positional params. Both can wait.
        if (assignment.getValue() !== assignment.param.defaultValue) {
            line.push(' ');
            line.push(type.stringify(assignment.getValue()));
        }
    }, this);
    return line.join('');
};

/**
 * Input trace gives us an array of Argument tracing objects, one for each
 * character in the typed input, from which we can derive information about how
 * to display this typed input. It's a bit like toString on steroids.
 * <p>
 * The returned object has the following members:<ul>
 * <li>char: The character to which this arg trace refers.
 * <li>arg: The Argument to which this character is assigned.
 * <li>part: One of ['prefix'|'text'|suffix'] - how was this char understood
 * </ul>
 * <p>
 * The Argument objects are as output from #_tokenize() rather than as applied
 * to Assignments by #_assign() (i.e. they are not instances of NamedArgument,
 * ArrayArgument, etc).
 * <p>
 * To get at the arguments applied to the assignments simply call
 * <tt>arg.assignment.arg</tt>. If <tt>arg.assignment.arg !== arg</tt> then
 * the arg applied to the assignment will contain the original arg.
 * See #_assign() for details.
 */
Requisition.prototype.createInputArgTrace = function() {
    if (!this._args) {
        throw new Error('createInputMap requires a command line. See source.');
        // If this is a problem then we can fake command line input using
        // something like the code in #toCanonicalString().
    }

    var args = [];
    this._args.forEach(function(arg) {
        for (var i = 0; i < arg.prefix.length; i++) {
            args.push({ arg: arg, char: arg.prefix[i], part: 'prefix' });
        }
        for (var i = 0; i < arg.text.length; i++) {
            args.push({ arg: arg, char: arg.text[i], part: 'text' });
        }
        for (var i = 0; i < arg.suffix.length; i++) {
            args.push({ arg: arg, char: arg.suffix[i], part: 'suffix' });
        }
    });

    return args;
};

/**
 * Reconstitute the input from the args
 */
Requisition.prototype.toString = function() {
    if (this._args) {
        return this._args.map(function(arg) {
            return arg.toString();
        }).join('');
    }

    return this.toCanonicalString();
};

/**
 * Return an array of Status scores so we can create a marked up
 * version of the command line input.
 */
Requisition.prototype.getInputStatusMarkup = function() {
    var argTraces = this.createInputArgTrace();
    // We only take a status of INCOMPLETE to be INCOMPLETE when the cursor is
    // actually in the argument. Otherwise it's an error.
    // Generally the 'argument at the cursor' is the argument before the cursor
    // unless it is before the first char, in which case we take the first.
    var cursor = this.input.cursor.start === 0 ?
            0 :
            this.input.cursor.start - 1;
    var cTrace = argTraces[cursor];

    var statuses = [];
    for (var i = 0; i < argTraces.length; i++) {
        var argTrace = argTraces[i];
        var arg = argTrace.arg;
        var status = Status.VALID;
        if (argTrace.part === 'text') {
            status = arg.assignment.getStatus(arg);
            // Promote INCOMPLETE to ERROR  ...
            if (status === Status.INCOMPLETE) {
                // If the cursor is not in a position to be able to complete it
                if (arg !== cTrace.arg || cTrace.part !== 'text') {
                    // And if we're not in the command
                    if (!(arg.assignment instanceof CommandAssignment)) {
                        status = Status.ERROR;
                    }
                }
            }
        }

        statuses.push(status);
    }

    return statuses;
};

/**
 * Look through the arguments attached to our assignments for the assignment
 * at the given position.
 * @param {number} cursor The cursor position to query
 */
Requisition.prototype.getAssignmentAt = function(cursor) {
    if (!this._args) {
        throw new Error('Missing args');
    }

    // We short circuit this one because we may have no args, or no args with
    // any size and the alg below only finds arguments with size.
    if (cursor === 0) {
        return this.commandAssignment;
    }

    var assignForPos = [];
    var i, j;
    for (i = 0; i < this._args.length; i++) {
        var arg = this._args[i];
        var assignment = arg.assignment;

        // prefix and text are clearly part of the argument
        for (j = 0; j < arg.prefix.length; j++) {
            assignForPos.push(assignment);
        }
        for (j = 0; j < arg.text.length; j++) {
            assignForPos.push(assignment);
        }

        // suffix looks forwards
        if (this._args.length > i + 1) {
            // first to the next argument
            assignment = this._args[i + 1].assignment;
        }
        else if (assignment &&
                assignment.paramIndex + 1 < this.assignmentCount) {
            // then to the next assignment
            assignment = this.getAssignment(assignment.paramIndex + 1);
        }

        for (j = 0; j < arg.suffix.length; j++) {
            assignForPos.push(assignment);
        }
    }

    // TODO: Possible shortcut, we don't really need to go through all the args
    // to work out the solution to this

    return assignForPos[cursor - 1];
};

/**
 * Entry point for keyboard accelerators or anything else that wants to execute
 * a command.
 * @param command Either a command, or the name of one
 * @param env Current environment to execute the command in
 * @param args Arguments for the command
 * @param typed The typed command. This indicates that the user has taken some
 * time to craft input, in which case feedback will be given, probably using
 * the output part of the command line. If undefined, we will assume that this
 * is computer generated, and skip altering the output.
 */
Requisition.prototype.exec = function(input) {
    var command;
    var args;
    var visible = true;

    if (input) {
        if (input.args != null) {
            // Fast track by looking up the command directly since passed args
            // means there is no command line to parse.
            command = canon.getCommand(input.typed);
            if (!command) {
                console.error('Command not found: ' + command);
            }
            args = input.args;

            // Default visible to false since this is exec is probably the
            // result of a keyboard shortcut
            visible = 'visible' in input ? input.visible : false;
        }
        else {
            this.update(input);
        }
    }

    if (!command) {
        command = this.commandAssignment.getValue();
        args = this.getArgsObject();
    }

    if (!command) {
        return false;
    }

    var report = {
        command: command,
        args: args,
        typed: this.toCanonicalString(),
        completed: false,
        start: new Date()
    };

    var onComplete = function(output, error) {
        if (visible) {
            report.end = new Date();
            report.duration = report.end.getTime() - report.start.getTime();
            report.error = error;
            report.output = output;
            report.completed = true;
            this.reportList.updateReport(report);
        }
    }.bind(this);

    try {
        cachedEnv = this.env;
        var reply;

        if (command.functional) {
            var argValues = Object.keys(args).map(function(key) {
                return args[key];
            });
            var context = command.context || command;
            reply = command.exec.apply(context, argValues);
        }
        else {
            reply = command.exec(this.env, args);
        }

        if (reply != null && reply.isPromise) {
            reply.then(
                function(reply) { onComplete(reply, false); },
                function(error) { onComplete(error, true); });

            // TODO: Add progress to our promise and add a handler for it here
        }
        else {
            onComplete(reply, false);
        }
    }
    catch (ex) {
        onComplete(ex, true);
    }

    this.reportList.addReport(report);

    cachedEnv = undefined;
    return true;
};

/**
 * Hack to allow us to offer an API to get at the environment while we are
 * executing a command, but not at other times.
 */
var cachedEnv = undefined;

exports.getEnvironment = function() {
    return cachedEnv;
};

/**
 * Called by the UI when ever the user interacts with a command line input
 * @param input A structure that details the state of the input field.
 * It should look something like: { typed:a, cursor: { start:b, end:c } }
 * Where a is the contents of the input field, and b and c are the start
 * and end of the cursor/selection respectively.
 * <p>The general sequence is:
 * <ul>
 * <li>_tokenize(): convert _typed into _parts
 * <li>_split(): convert _parts into _command and _unparsedArgs
 * <li>_assign(): convert _unparsedArgs into requisition
 * </ul>
 */
Requisition.prototype.update = function(input) {
    this.input = input;
    if (this.input.cursor == null) {
        this.input.cursor = { start: input.length, end: input.length };
    }

    this._structuralChangeInProgress = true;

    this._args = this._tokenize(input.typed);

    var args = this._args.slice(0); // i.e. clone
    this._split(args);
    this._assign(args);

    this._structuralChangeInProgress = false;

    this.inputChange();
};

var OUTSIDE = 1;     // The last character was whitespace
var IN_SIMPLE = 2;   // The last character was part of a parameter
var IN_SINGLE_Q = 3; // We're inside a single quote: '
var IN_DOUBLE_Q = 4; // We're inside double quotes: "

/**
 * If the input has no spaces, quotes or escapes, we can take the fast track
 */
function isSimple(typed) {
   for (var i = 0; i < typed.length; i++) {
       var c = typed.charAt(i);
       if (c === ' ' || c === '"' || c === '\'' || c === '\\') {
           return false;
       }
   }
   return true;
}

/**
 * Split up the input taking into account ' and "
 */
Requisition.prototype._tokenize = function(typed) {
    // For blank input, place a dummy empty argument into the list
    if (typed == null || typed.length === 0) {
        return [ new Argument('', '', '') ];
    }

    if (isSimple(typed)) {
        return [ new Argument(typed, '', '') ];
    }

    var mode = OUTSIDE;

    // First we un-escape. This list was taken from:
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Guide/Core_Language_Features#Unicode
    // We are generally converting to their real values except for \', \"
    // and '\ ' which we are converting to unicode private characters so we
    // can distinguish them from ', " and ' ', which have special meaning.
    // They need swapping back post-split - see unescape2()
    typed = typed
            .replace(/\\\\/g, '\\')
            .replace(/\\b/g, '\b')
            .replace(/\\f/g, '\f')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\v/g, '\v')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\ /g, '\uF000')
            .replace(/\\'/g, '\uF001')
            .replace(/\\"/g, '\uF002');

    function unescape2(str) {
        return str
            .replace(/\uF000/g, ' ')
            .replace(/\uF001/g, '\'')
            .replace(/\uF002/g, '"');
    }

    var i = 0; // The index of the current character
    var start = 0; // Where did this section start?
    var prefix = ''; // Stuff that comes before the current argument
    var args = [];

    while (true) {
        if (i >= typed.length) {
            // There is nothing else to read - tidy up
            if (mode !== OUTSIDE) {
                var str = unescape2(typed.substring(start, i));
                args.push(new Argument(str, prefix, ''));
            }
            else {
                if (i !== start) {
                    // There's a bunch of whitespace at the end of the
                    // command add it to the last argument's suffix,
                    // creating an empty argument if needed.
                    var extra = typed.substring(start, i);
                    var lastArg = args[args.length - 1];
                    if (!lastArg) {
                        args.push(new Argument('', extra, ''));
                    }
                    else {
                        lastArg.suffix += extra;
                    }
                }
            }
            break;
        }

        var c = typed[i];
        switch (mode) {
            case OUTSIDE:
                if (c === '\'') {
                    prefix = typed.substring(start, i + 1);
                    mode = IN_SINGLE_Q;
                    start = i + 1;
                }
                else if (c === '"') {
                    prefix = typed.substring(start, i + 1);
                    mode = IN_DOUBLE_Q;
                    start = i + 1;
                }
                else if (/ /.test(c)) {
                    // Still whitespace, do nothing
                }
                else {
                    prefix = typed.substring(start, i);
                    mode = IN_SIMPLE;
                    start = i;
                }
                break;

            case IN_SIMPLE:
                // There is an edge case of xx'xx which we are assuming to
                // be a single parameter (and same with ")
                if (c === ' ') {
                    var str = unescape2(typed.substring(start, i));
                    args.push(new Argument(str, prefix, ''));
                    mode = OUTSIDE;
                    start = i;
                    prefix = '';
                }
                break;

            case IN_SINGLE_Q:
                if (c === '\'') {
                    var str = unescape2(typed.substring(start, i));
                    args.push(new Argument(str, prefix, c));
                    mode = OUTSIDE;
                    start = i + 1;
                    prefix = '';
                }
                break;

            case IN_DOUBLE_Q:
                if (c === '"') {
                    var str = unescape2(typed.substring(start, i));
                    args.push(new Argument(str, prefix, c));
                    mode = OUTSIDE;
                    start = i + 1;
                    prefix = '';
                }
                break;
        }

        i++;
    }

    return args;
};

/**
 * Looks in the canon for a command extension that matches what has been
 * typed at the command line.
 */
Requisition.prototype._split = function(args) {
    var argsUsed = 1;
    var conversion;

    while (argsUsed <= args.length) {
        var arg = (argsUsed === 1) ?
            args[0] :
            new MergedArgument(args, 0, argsUsed);
        conversion = this.commandAssignment.param.type.parse(arg);

        // We only want to carry on if this command is a parent command,
        // which means that there is a commandAssignment, but not one with
        // an exec function.
        if (!conversion.value || conversion.value.exec) {
            break;
        }

        // Previously we needed a way to hide commands depending context.
        // We have not resurrected that feature yet, but if we do we should
        // insert code here to ignore certain commands depending on the
        // context/environment

        argsUsed++;
    }

    this.commandAssignment.setConversion(conversion);

    for (var i = 0; i < argsUsed; i++) {
        args.shift();
    }

    // TODO: This could probably be re-written to consume args as we go
};

/**
 * Work out which arguments are applicable to which parameters.
 */
Requisition.prototype._assign = function(args) {
    if (!this.commandAssignment.getValue()) {
        this._unassigned.setUnassigned(args);
        return;
    }

    if (args.length === 0) {
        this.setDefaultArguments();
        this._unassigned.setDefault();
        return;
    }

    // Create an error if the command does not take parameters, but we have
    // been given them ...
    if (this.assignmentCount === 0) {
        this._unassigned.setUnassigned(args);
        return;
    }

    // Special case: if there is only 1 parameter, and that's of type
    // text, then we put all the params into the first param
    if (this.assignmentCount === 1) {
        var assignment = this.getAssignment(0);
        if (assignment.param.type instanceof StringType) {
            var arg = (args.length === 1) ?
                args[0] :
                new MergedArgument(args);
            var conversion = assignment.param.type.parse(arg);
            assignment.setConversion(conversion);
            this._unassigned.setDefault();
            return;
        }
    }

    // Positional arguments can still be specified by name, but if they are
    // then we need to ignore them when working them out positionally
    var names = this.getParameterNames();

    // We collect the arguments used in arrays here before assigning
    var arrayArgs = {};

    // Extract all the named parameters
    this.getAssignments(false).forEach(function(assignment) {
        // Loop over the arguments
        // Using while rather than loop because we remove args as we go
        var i = 0;
        while (i < args.length) {
            if (assignment.param.isKnownAs(args[i].text)) {
                var arg = args.splice(i, 1)[0];
                names = names.filter(function(test) {
                  return test !== assignment.param.name;
                });

                // boolean parameters don't have values, default to false
                if (assignment.param.type instanceof BooleanType) {
                    arg = new TrueNamedArgument(null, arg);
                }
                else {
                    var valueArg = null;
                    if (i + 1 >= args.length) {
                        // TODO: We need a setNamedArgument() because the
                        // assignment needs to know both the value and the
                        // extent of both the arguments so replacement can
                        // work. Same for the boolean case above
                        valueArg = args.splice(i, 1)[0];
                    }
                    arg = new NamedArgument(arg, valueArg);
                }

                if (assignment.param.type instanceof ArrayType) {
                    var arrayArg = arrayArgs[assignment.param.name];
                    if (!arrayArg) {
                        arrayArg = new ArrayArgument();
                        arrayArgs[assignment.param.name] = arrayArg;
                    }
                    arrayArg.addArgument(arg);
                }
                else {
                    var conversion = assignment.param.type.parse(arg);
                    assignment.setConversion(conversion);
                }
            }
            else {
                // Skip this parameter and handle as a positional parameter
                i++;
            }
        }
    }, this);

    // What's left are positional parameters assign in order
    names.forEach(function(name) {
        var assignment = this.getAssignment(name);

        // If not set positionally, and we can't set it non-positionally,
        // we have to default it to prevent previous values surviving
        if (!assignment.param.isPositionalAllowed()) {
            assignment.setDefault();
            return;
        }

        // If this is a positional array argument, then it swallows the
        // rest of the arguments.
        if (assignment.param.type instanceof ArrayType) {
            var arrayArg = arrayArgs[assignment.param.name];
            if (!arrayArg) {
                arrayArg = new ArrayArgument();
                arrayArgs[assignment.param.name] = arrayArg;
            }
            arrayArg.addArguments(args);
            args = [];
        }
        else {
            var arg = (args.length > 0) ?
                    args.splice(0, 1)[0] :
                    new Argument();

            var conversion = assignment.param.type.parse(arg);
            assignment.setConversion(conversion);
        }
    }, this);

    // Now we need to assign the array argument (if any)
    Object.keys(arrayArgs).forEach(function(name) {
        var assignment = this.getAssignment(name);
        var conversion = assignment.param.type.parse(arrayArgs[name]);
        assignment.setConversion(conversion);
    }, this);

    if (args.length > 0) {
        this._unassigned.setUnassigned(args);
    }
    else {
        this._unassigned.setDefault();
    }
};

exports.Requisition = Requisition;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/canon', ['require', 'exports', 'module' , 'gcli/util', 'gcli/types'], function(require, exports, module) {
var canon = exports;


var console = require('gcli/util').console;
var createEvent = require('gcli/util').createEvent;

var Status = require('gcli/types').Status;
var types = require('gcli/types');
var BooleanType = require('gcli/types').BooleanType;


/**
 * A lookup hash of our registered commands
 */
var commands = {};

/**
 * A sorted list of command names, we regularly want them in order, so pre-sort
 */
var commandNames = [];

/**
 * The command object is mostly just setup around a commandSpec (as passed to
 * #addCommand()). It provides some helpers like #getDescription() which is a
 * safe .description.
 */
function Command(commandSpec) {
    Object.keys(commandSpec).forEach(function(key) {
        this[key] = commandSpec[key];
    }, this);

    if (!this.name) {
        throw new Error('All registered commands must have a name');
    }

    if (this.params == null) {
        this.params = [];
    }
    if (!Array.isArray(this.params)) {
        throw new Error('command.params must be an array in ' + this.name);
    }

    // Parameters work out a short name for themselves, but to do this they
    // need a complete list of the paramNames
    var paramNames = [];
    var paramSpecs = this.params;
    this.params = [];

    paramSpecs.forEach(function(spec) {
        if (spec.group) {
            spec.params.forEach(function(paramSpec) {
                paramNames.push(paramSpec.name);
            }, this);
        }
        paramNames.push(spec.name);
    }, this);

    // Track if the user is trying to mix default params and param groups.
    // All the default parameters must come before all the param groups.
    var usingGroups = false;

    // In theory this could easily be made recursive, so param groups could
    // contain nested param groups. Current thinking is that the added
    // complexity for the UI probably isn't worth it, so this implementation
    // prevents nesting.

    paramSpecs.forEach(function(spec) {
        if (!spec.group) {
            if (usingGroups) {
                console.error('Parameters can\'t come after param groups.' +
                        ' Ignoring ' + this.name + '/' + spec.name);
            }
            else {
                var param = new Parameter(spec, this, paramNames, null);
                this.params.push(param);
            }
        } else {
            spec.params.forEach(function(ispec) {
                var param = new Parameter(ispec, this, paramNames, spec.group);
                this.params.push(param);
            }, this);

            usingGroups = true;
        }
    }, this);
};

Command.prototype = {
    /**
     * A safe version of '.description' returning '(No description)' when there
     * is no description available.
     */
    getDescription: function() {
        return this.description ? this.description : '(No description)';
    }
};


/**
 * A wrapper for a paramSpec so we can sort out shortened versions names for
 * option switches
 */
function Parameter(paramSpec, command, paramNames, groupName) {
    this.command = command || { name: 'unnamed' };

    Object.keys(paramSpec).forEach(function(key) {
        this[key] = paramSpec[key];
    }, this);
    this.description = this.description || '';
    this.groupName = groupName;

    if (!this.name) {
        throw new Error('In ' + this.command.name +
            ': all params must have a name');
    }

    // Find the shortest unique prefix of this name
    if (paramNames) {
        var uniquePrefix = this.name[0];
        for (var i = 0; i < paramNames.length; i++) {
            // Lengthen while unique is a prefix of testParam.name
            while (paramNames[i].indexOf(uniquePrefix) === 0 &&
                    uniquePrefix !== this.name) {
                uniquePrefix = this.name.substr(0, uniquePrefix.length + 1);
            }
            if (uniquePrefix === this.name) {
                break;
            }
        }
        this.uniquePrefix = uniquePrefix;
        this.regexp = new RegExp('^--?' + this.uniquePrefix);
    }

    var lookup = this.type;
    this.type = types.getType(lookup);
    if (this.type == null) {
        console.error('Known types: ' + types.getTypeNames().join(', '));
        throw new Error('In ' + this.command.name + '/' + this.name +
            ': can\'t find type for: ' + JSON.stringify(lookup));
    }

    // boolean parameters have an implicit defaultValue:false, which should
    // not be changed. See the docs.
    if (this.type instanceof BooleanType) {
        if ('defaultValue' in this) {
            console.error('In ' + this.command.name + '/' + this.name +
                    ': boolean parameters can not have a defaultValue.' +
                    ' Ignoring');
        }
        this.defaultValue = false;
    }

    // Check the defaultValue for validity. Unnecessary?
    if (this.defaultValue !== undefined) {
        try {
            var defaultText = this.type.stringify(this.defaultValue);
            var defaultConversion = this.type.parseString(defaultText);
            if (defaultConversion.getStatus() !== Status.VALID) {
                console.error('In ' + this.command.name + '/' + this.name +
                        ': Error round tripping defaultValue. status = ' +
                        defaultConversion.getStatus());
            }
        }
        catch (ex) {
            console.error('In ' + this.command.name + '/' + this.name +
                ': ' + ex);
        }
    }
}

Parameter.prototype = {
    /**
     * Does the given name uniquely identify this param (among the other params
     * in this command)
     * @param name The name to check
     */
    isKnownAs: function(name) {
        return this.regexp && this.regexp.test(name);
    },

    /**
     * Is the user required to enter data for this parameter? (i.e. has
     * defaultValue been set to something other than undefined)
     */
    isDataRequired: function() {
        return this.defaultValue === undefined;
    },

    /**
     * Are we allowed to assign data to this parameter using positional
     * parameters?
     */
    isPositionalAllowed: function() {
        return this.groupName == null;
    }
};

canon.Parameter = Parameter;

/**
 * Add a command to the canon of known commands.
 * This function is exposed to the outside world (via gcli/index). It is
 * documented in docs/index.md for all the world to see.
 * TODO: ensure this command works as documented
 * @param commandSpec The command and its metadata.
 * @param name When commands are added via addCommands() their names are
 * exposed only via the properties to which the functions are attached. This
 * allows addCommands() to inform the command what its name is.
 */
canon.addCommand = function addCommand(commandSpec, name) {
    if (typeof commandSpec === 'function') {
        if (!commandSpec.metadata) {
            throw new Error('Commands registered as functions need metdata');
        }

        if (!commandSpec.metadata.name) {
            if (!name) {
                throw new Error('All registered commands must have a name');
            }
            else {
                commandSpec.metadata.name = name;
            }
        }

        commandSpec.metadata.exec = commandSpec;
        commandSpec.metadata.functional = true;
        commandSpec = commandSpec.metadata;
    }
    else {
        commandSpec.functional = false;
        commandSpec.name = name || commandSpec.name;
    }

    commands[commandSpec.name] = new Command(commandSpec);
    commandNames.push(commandSpec.name);
    commandNames.sort();

    canon.canonChange();
};

/**
 * Remove an individual command. The opposite of #addCommand().
 * @param commandOrName Either a command name or the command itself.
 */
canon.removeCommand = function removeCommand(commandOrName) {
    var name = typeof command === 'string' ?
        commandOrName :
        commandOrName.name;
    delete commands[name];
    commandNames = commandNames.filter(function(test) {
        return test !== name;
    });

    canon.canonChange();
};

/**
 * Take a command object and register all the commands that it contains.
 * This function is exposed to the outside world (via gcli/index). It is
 * documented in docs/index.md for all the world to see.
 * TODO: ensure this command works as documented
 * @param context The command object which contains the commands to be
 * registered.
 * @param name The name of the base command (for a command set)
 */
canon.addCommands = function addCommands(context, name) {
    if (name) {
        if (!context.metadata) {
            throw new Error('name supplied to addCommands (implies command ' +
                'set) but missing metatdata on context');
        }

        canon.addCommand(context.metadata, name);
    }

    Object.keys(context).forEach(function(key) {
        var command = context[key];
        if (typeof command !== 'function') {
            return;
        }
        command.metadata = command.metadata || context[key + 'Metadata'];
        if (!command.metadata) {
            return;
        }
        command.metadata.context = command.metadata.context || context;
        canon.addCommand(command, name ? name + ' ' + key : key);
    });
};

/**
 * Remove a group of commands. The opposite of #addCommands().
 * @param context The command object which contains the commands to be
 * registered.
 * @param name The name of the base command (for a command set)
 */
canon.removeCommands = function removeCommands(context, name) {
    Object.keys(context).forEach(function(key) {
        var command = context[key];
        if (typeof command !== 'function' || !command.metadata) {
            return;
        }
        canon.removeCommand(command.metadata);
    });

    if (name) {
        canon.removeCommand(context.metadata, name);
    }
};

/**
 * Retrieve a command by name
 * @param name The name of the command to retrieve
 */
canon.getCommand = function getCommand(name) {
    return commands[name];
};

/**
 * Get an array of all the registered commands.
 */
canon.getCommands = function getCommands() {
    return Object.keys(commands).map(function(name) {
        return commands[name];
    }, this);
};

/**
 * Get an array containing the names of the registered commands.
 * WARNING: This returns live data. Do not mutate the returned array.
 */
canon.getCommandNames = function getCommandNames() {
    return commandNames;
};

/**
 * Enable people to be notified of changes to the list of commands
 */
canon.canonChange = createEvent();

/**
 * ReportList stores the reports generated by executed commands.
 * It manages the correct length of reports, and informs listeners of new
 * reports.
 */
function ReportList() {
    // The array of requests that wish to announce their presence
    this._reports = [];
    this.reportsChange = createEvent();
}

/**
 * How many requests do we store?
 */
ReportList.prototype.maxRequestLength = 100;

/**
 * Add a list to the set of known reports.
 * @param report The report to add to the list.
 */
ReportList.prototype.addReport = function(report) {
    this._reports.push(report);
    // This could probably be optimized with some maths, but 99.99% of
    // the time we will only be off by one, and I'm feeling lazy.
    while (this._reports.length > this.maxRequestLength) {
        this._reports.shiftObject();
    }

    this.reportsChange({ report: report });
};

/**
 * Add a list to the set of known reports.
 * @param report The report to add to the list.
 */
ReportList.prototype.updateReport = function(report) {
    this.reportsChange({ report: report });
};

canon.ReportList = ReportList;

/**
 * We maintain a global report list for the majority case where there is only
 * one important set of reports.
 */
canon.globalReportList = new ReportList();


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/types', ['require', 'exports', 'module' , 'gcli/util', 'gcli/argument'], function(require, exports, module) {
var types = exports;


var console = require('gcli/util').console;

var Argument = require('gcli/argument').Argument;
var TrueNamedArgument = require('gcli/argument').TrueNamedArgument;
var FalseNamedArgument = require('gcli/argument').FalseNamedArgument;
var ArrayArgument = require('gcli/argument').ArrayArgument;


/**
 * Some types can detect validity, that is to say they can distinguish between
 * valid and invalid values.
 * TODO: Change these constants to be numbers for more performance?
 */
var Status = {
    /**
     * The conversion process worked without any problem, and the value is
     * valid. There are a number of failure states, so the best way to check
     * for failure is (x !== Status.VALID)
     */
    VALID: {
        toString: function() { return 'VALID'; },
        valueOf: function() { return 0; }
    },

    /**
     * A conversion process failed, however it was noted that the string
     * provided to 'parse()' could be VALID by the addition of more characters,
     * so the typing may not be actually incorrect yet, just unfinished.
     * @see Status.ERROR
     */
    INCOMPLETE: {
        toString: function() { return 'INCOMPLETE'; },
        valueOf: function() { return 1; }
    },

    /**
     * The conversion process did not work, the value should be null and a
     * reason for failure should have been provided. In addition some
     * completion values may be available.
     * @see Status.INCOMPLETE
     */
    ERROR: {
        toString: function() { return 'ERROR'; },
        valueOf: function() { return 2; }
    },

    /**
     * A combined status is the worser of the provided statuses. The statuses
     * can be provided either as a set of arguments or a single array
     */
    combine: function() {
        var combined = Status.VALID;
        for (var i = 0; i < arguments.length; i++) {
            var status = arguments[i];
            if (Array.isArray(status)) {
                status = Status.combine.apply(null, status);
            }
            if (status > combined) {
                combined = status;
            }
        }
        return combined;
    }
};
types.Status = Status;

/**
 * The type.parse() method returns a Conversion to inform the user about not
 * only the result of a Conversion but also about what went wrong.
 * We could use an exception, and throw if the conversion failed, but that
 * seems to violate the idea that exceptions should be exceptional. Typos are
 * not. Also in order to store both a status and a message we'd still need
 * some sort of exception type...
 */
function Conversion(value, arg, status, message, completer) {
    // The result of the conversion process. Will be null if status != VALID
    this.value = value;

    // Allow us to trace where this Conversion came from
    this.arg = arg;
    if (arg == null) {
        throw new Error('missing arg');
    }

    // The status of the conversion.
    this._status = status || Status.VALID;

    // A message to go with the conversion. This could be present for any
    // status including VALID in the case where we want to note a warning for
    // example.
    // I18N: On the one hand this nasty and un-internationalized, however with
    // a command line it is hard to know where to start.
    this.message = message;

    // A array of strings which are the systems best guess at better inputs
    // than the one presented.
    // We generally expect there to be about 7 predictions (to match human list
    // comprehension ability) however it is valid to provide up to about 20,
    // or less. It is the job of the predictor to decide a smart cut-off.
    // For example if there are 4 very good matches and 4 very poor ones,
    // probably only the 4 very good matches should be presented.
    this.completer = completer;
}

types.Conversion = Conversion;

/**
 * Ensure that all arguments that are part of this conversion know what they
 * are assigned to.
 * @param assignment The Assignment (param/conversion link) to inform the
 * argument about.
 */
Conversion.prototype.assign = function(assignment) {
    this.arg.assign(assignment);
};

/**
 * Work out if there is information provided in the contained argument.
 */
Conversion.prototype.isDataProvided = function() {
    var argProvided = this.arg.text !== '';
    return this.value !== undefined || argProvided;
};

/**
 * 2 conversions are equal if and only if their args are equal (argEquals) and
 * their values are equal (valueEquals).
 * @param that The conversion object to compare against.
 */
Conversion.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null) {
        return false;
    }
    return this.valueEquals(that) && this.argEquals(that);
};

/**
 * Check that the value in this conversion is strict equal to the value in the
 * provided conversion.
 * @param that The conversion to compare values with
 */
Conversion.prototype.valueEquals = function(that) {
    return this.value === that.value;
};

/**
 * Check that the argument in this conversion is equal to the value in the
 * provided conversion as defined by the argument (i.e. arg.equals).
 * @param that The conversion to compare arguments with
 */
Conversion.prototype.argEquals = function(that) {
    return this.arg.equals(that.arg);
};

/**
 * Accessor for the status of this conversion
 */
Conversion.prototype.getStatus = function(arg) {
    return this._status;
};

/**
 * Defined by the toString() value provided by the argument
 */
Conversion.prototype.toString = function() {
    return this.arg.toString();
};

/**
 * If status === INCOMPLETE, then we may be able to provide predictions as to
 * how the argument can be completed.
 */
Conversion.prototype.getPredictions = function() {
    if (this.completer) {
        return this.completer();
    }
    return this.predictions || [];
};

/**
 * ArrayConversion is a special Conversion, needed because arrays are converted
 * member by member rather then as a whole, which means we can track the
 * conversion if individual array elements. So an ArrayConversion acts like a
 * normal Conversion (which is needed as Assignment requires a Conversion) but
 * it can also be devolved into a set of Conversions for each array member.
 */
function ArrayConversion(conversions, arg) {
    this.arg = arg;
    this.conversions = conversions;
    this.value = conversions.map(function(conversion) {
        return conversion.value;
    }, this);

    this._status = Status.combine(conversions.map(function(conversion) {
        return conversion.getStatus();
    }));

    // This message is just for reporting errors like "not enough values"
    // rather that for problems with individual values.
    this.message = '';

    // Predictions are generally provided by individual values
    this.predictions = [];
}

ArrayConversion.prototype = Object.create(Conversion.prototype);

ArrayConversion.prototype.assign = function(assignment) {
    this.conversions.forEach(function(conversion) {
        conversion.assign(assignment);
    }, this);
    this.assignment = assignment;
};

ArrayConversion.prototype.getStatus = function(arg) {
    if (arg && arg.conversion) {
        return arg.conversion.getStatus();
    }
    return this._status;
};

ArrayConversion.prototype.isDataProvided = function() {
    return this.conversions.length > 0;
};

ArrayConversion.prototype.valueEquals = function(that) {
    if (!(that instanceof ArrayConversion)) {
        throw new Error('Can\'t compare values with non ArrayConversion');
    }

    if (this.value === that.value) {
        return true;
    }

    if (this.value.length !== that.value.length) {
        return false;
    }

    for (var i = 0; i < this.conversions.length; i++) {
        if (!this.conversions[i].valueEquals(that.conversions[i])) {
            return false;
        }
    }

    return true;
};

ArrayConversion.prototype.toString = function() {
    return '[ ' + this.conversions.map(function(conversion) {
        return conversion.toString();
    }, this).join(', ') + ' ]';
};

types.ArrayConversion = ArrayConversion;


/**
 * Most of our types are 'static' e.g. there is only one type of 'string',
 * however some types like 'selection' and 'deferred' are customizable.
 * The basic Type type isn't useful, but does provide documentation about what
 * types do.
 */
function Type() {
};
Type.prototype = {
    /**
     * Convert the given <tt>value</tt> to a string representation.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     */
    stringify: function(value) { throw new Error("not implemented"); },

    /**
     * Convert the given <tt>arg</tt> to an instance of this type.
     * Where possible, there should be round-tripping between values and their
     * string representations.
     * @param arg An instance of <tt>Argument</tt> to convert.
     * @return Conversion
     */
    parse: function(arg) { throw new Error("not implemented"); },

    /**
     * A convenience method for times when you don't have an argument to parse
     * but instead have a string.
     * @see #parse(arg)
     */
    parseString: function(str) {
        return this.parse(new Argument(str));
    },

    /**
     * The plug-in system, and other things need to know what this type is
     * called. The name alone is not enough to fully specify a type. Types like
     * 'selection' and 'deferred' need extra data, however this function returns
     * only the name, not the extra data.
     * <p>In old bespin, equality was based on the name. This may turn out to be
     * important in Ace too.
     */
    name: undefined,

    /**
     * If there is some concept of a higher value, return it,
     * otherwise return undefined.
     */
    increment: function(value) {
        return undefined;
    },

    /**
     * If there is some concept of a lower value, return it,
     * otherwise return undefined.
     */
    decrement: function(value) {
        return undefined;
    },

    /**
     * There is interesting information (like predictions) in a conversion of
     * nothing, the output of this can sometimes be customized.
     * @return Conversion
     */
    getDefault: undefined
};
types.Type = Type;

/**
 * Private registry of types
 * Invariant: types[name] = type.name
 */
var registeredTypes = {};

types.getTypeNames = function() {
    return Object.keys(registeredTypes);
};

/**
 * Add a new type to the list available to the system.
 * You can pass 2 things to this function - either an instance of Type, in
 * which case we return this instance when #getType() is called with a 'name'
 * that matches type.name.
 * Also you can pass in a constructor (i.e. function) in which case when
 * #getType() is called with a 'name' that matches Type.prototype.name we will
 * pass the typeSpec into this constructor.
 */
types.registerType = function(type) {
    if (typeof type === 'object') {
        if (type instanceof Type) {
            if (!type.name) {
                throw new Error('All registered types must have a name');
            }
            registeredTypes[type.name] = type;
        }
        else {
            throw new Error('Can\'t registerType using: ' + type);
        }
    }
    else if (typeof type === 'function') {
        if (!type.prototype.name) {
            throw new Error('All registered types must have a name');
        }
        registeredTypes[type.prototype.name] = type;
    }
    else {
        throw new Error('Unknown type: ' + type);
    }
};

types.registerTypes = function registerTypes(newTypes) {
    Object.keys(newTypes).forEach(function(name) {
        var type = newTypes[name];
        type.name = name;
        newTypes.registerType(type);
    });
};

/**
 * Remove a type from the list available to the system
 */
types.deregisterType = function(type) {
    delete registeredTypes[type.name];
};

/**
 * Find a type, previously registered using #registerType()
 */
types.getType = function(typeSpec) {
    var type;
    if (typeof typeSpec === 'string') {
        type = registeredTypes[typeSpec];
        if (typeof type === 'function') {
            type = new type();
        }
        return type;
    }

    if (typeof typeSpec === 'object') {
        if (!typeSpec.name) {
            throw new Error('Missing \'name\' member to typeSpec');
        }

        type = registeredTypes[typeSpec.name];
        if (typeof type === 'function') {
            type = new type(typeSpec);
        }
        return type;
    }

    throw new Error('Can\'t extract type from ' + typeSpec);
};


/**
 * 'string' the most basic string type that doesn't need to convert
 */
function StringType(typeSpec) {
    if (typeSpec != null) {
        throw new Error('StringType can not be customized');
    }
}

StringType.prototype = new Type();

StringType.prototype.stringify = function(value) {
    if (value == null) {
        return '';
    }
    return value.toString();
};

StringType.prototype.parse = function(arg) {
    return new Conversion(arg.text, arg);
};

StringType.prototype.name = 'string';

types.StringType = StringType;


/**
 * We don't currently plan to distinguish between integers and floats
 */
function NumberType(typeSpec) {
    if (typeSpec) {
        this.min = typeSpec.min;
        this.max = typeSpec.max;
        this.step = typeSpec.step;
    }
}

NumberType.prototype = new Type();

NumberType.prototype.stringify = function(value) {
    if (value == null) {
        return '';
    }
    return '' + value;
};

NumberType.prototype.parse = function(arg) {
    if (arg.text.replace(/\s/g, '').length === 0) {
        return new Conversion(null, arg, Status.INCOMPLETE, '');
    }

    var value = parseInt(arg.text, 10);
    if (isNaN(value)) {
        return new Conversion(value, arg, Status.ERROR,
            'Can\'t convert "' + arg.text + '" to a number.');
    }

    if (this.max != null && value > this.max) {
        return new Conversion(value, arg, Status.ERROR,
            '' + value + ' is greater that maximum allowed: ' + this.max + '.');
    }

    if (this.min != null && value < this.min) {
        return new Conversion(value, arg, Status.ERROR,
            '' + value + ' is smaller that minimum allowed: ' + this.min + '.');
    }

    return new Conversion(value, arg);
};

NumberType.prototype.decrement = function(value) {
    return (this.min != null && value - 1 >= this.min) ? value - 1 : value;
};

NumberType.prototype.increment = function(value) {
    return (this.max != null && value + 1 <= this.max) ? value + 1 : value;
};

NumberType.prototype.name = 'number';

types.NumberType = NumberType;


/**
 * One of a known set of options
 */
function SelectionType(typeSpec) {
    if (typeSpec) {
        Object.keys(typeSpec).forEach(function(key) {
            this[key] = typeSpec[key];
        }, this);
    }
};

SelectionType.prototype = new Type();

SelectionType.prototype.stringify = function(value) {
    return typeof value === 'string' ? value : value.name;
};

SelectionType.prototype.getLookup = function() {
    if (this.lookup) {
        if (typeof this.lookup === 'function') {
            return this.lookup();
        }
        return this.lookup;
    }

    if (Array.isArray(this.data)) {
        this.lookup = this._dataToLookup(this.data);
        return this.lookup;
    }

    if (typeof(this.data) === 'function') {
        return this._dataToLookup(this.data());
    }

    throw new Error('SelectionType has no data');
};

SelectionType.prototype._dataToLookup = function(data) {
    var lookup = {};
    data.forEach(function(option) {
        var name = (typeof option === 'string') ? option : option.name;
        lookup[name] = option;
    }, this);
    return lookup;
};

SelectionType.prototype._findCompletions = function(arg) {
    var completions = {};

    var lookup = this.getLookup();
    var matchedValue = lookup[arg.text];
    if (matchedValue !== undefined) {
        completions[arg.text] = matchedValue;
    }
    else {
        Object.keys(lookup).forEach(function(name) {
            if (name.indexOf(arg.text) === 0) {
                completions[name] = lookup[name];
            }
        }, this);
    }

    return completions;
};

SelectionType.prototype.parse = function(arg) {
    var completions = this._findCompletions(arg);
    var matches = Object.keys(completions).length;
    if (matches === 1 && completions[arg.text] != null) {
        return new Conversion(completions[arg.text], arg);
    }

    // This is something of a hack it basically allows us to tell the
    // setting type to forget its last setting hack.
    if (this.noMatch) {
        this.noMatch();
    }

    // Especially at startup completions live over the time that things change
    // so we provide a completion function rather than completion values
    var completer = function() {
        var matches = this._findCompletions(arg);
        return Object.keys(matches).map(function(name) {
            return matches[name];
        });
    }.bind(this);

    if (matches > 0) {
        return new Conversion(null, arg, Status.INCOMPLETE, '', completer);
    }

    var msg = 'Can\'t use \'' + arg.text + '\'.';
    return new Conversion(null, arg, Status.ERROR, msg, completer);
};

SelectionType.prototype.fromString = function(str) {
    return str;
};

SelectionType.prototype.decrement = function(value) {
    var data = (typeof this.data === 'function') ? this.data() : this.data;
    var index;
    if (value == null) {
        index = data.length - 1;
    }
    else {
        var name = this.stringify(value);
        var index = data.indexOf(name);
        index = (index === 0 ? data.length - 1 : index - 1);
    }
    return this.fromString(data[index]);
};

SelectionType.prototype.increment = function(value) {
    var data = (typeof this.data === 'function') ? this.data() : this.data;
    var index;
    if (value == null) {
        index = 0;
    }
    else {
        var name = this.stringify(value);
        var index = data.indexOf(name);
        index = (index === data.length - 1 ? 0 : index + 1);
    }
    return this.fromString(data[index]);
};

SelectionType.prototype.name = 'selection';

types.SelectionType = SelectionType;


/**
 * true/false values
 */
function BooleanType(typeSpec) {
    if (typeSpec != null) {
        throw new Error('BooleanType can not be customized');
    }
}

BooleanType.prototype = new SelectionType();

BooleanType.prototype.lookup = { 'true': true, 'false': false };

BooleanType.prototype.parse = function(arg) {
    if (arg instanceof TrueNamedArgument) {
        return new Conversion(true, arg);
    }
    if (arg instanceof FalseNamedArgument) {
        return new Conversion(false, arg);
    }
    return SelectionType.prototype.parse.call(this, arg);
};

BooleanType.prototype.stringify = function(value) {
    return '' + value;
};

BooleanType.prototype.fromString = function(str) {
    return str === 'true' ? true : false;
};

BooleanType.prototype.getDefault = function() {
    return new Conversion(false, new Argument(''));
};

BooleanType.prototype.name = 'boolean';

types.BooleanType = BooleanType;


/**
 * A we don't know right now, but hope to soon.
 */
function DeferredType(typeSpec) {
    if (typeof typeSpec.defer !== 'function') {
        throw new Error('Instances of DeferredType need typeSpec.defer to be a function that returns a type');
    }
    Object.keys(typeSpec).forEach(function(key) {
        this[key] = typeSpec[key];
    }, this);
};

DeferredType.prototype = new Type();

DeferredType.prototype.stringify = function(value) {
    return this.defer().stringify(value);
};

DeferredType.prototype.parse = function(arg) {
    return this.defer().parse(arg);
};

DeferredType.prototype.decrement = function(value) {
    var deferred = this.defer();
    return (deferred.decrement ? deferred.decrement(value) : undefined);
};

DeferredType.prototype.increment = function(value) {
    var deferred = this.defer();
    return (deferred.increment ? deferred.increment(value) : undefined);
};

DeferredType.prototype.increment = function(value) {
    var deferred = this.defer();
    return (deferred.increment ? deferred.increment(value) : undefined);
};

DeferredType.prototype.name = 'deferred';

types.DeferredType = DeferredType;


/**
 * 'blank' is a type for use with DeferredType when we don't know yet.
 * It should not be used anywhere else.
 */
function BlankType(typeSpec) {
    if (typeSpec != null) {
        throw new Error('BlankType can not be customized');
    }
}

BlankType.prototype = new Type();

BlankType.prototype.stringify = function(value) {
    return '';
};

BlankType.prototype.parse = function(arg) {
    return new Conversion(null, arg);
};

BlankType.prototype.name = 'blank';

types.BlankType = BlankType;


/**
 * A set of objects of the same type
 */
function ArrayType(typeSpec) {
    if (!typeSpec.subtype) {
        console.error('Array.typeSpec is missing subtype. Assuming string.' +
            JSON.stringify(typeSpec));
        typeSpec.subtype = 'string';
    }

    Object.keys(typeSpec).forEach(function(key) {
        this[key] = typeSpec[key];
    }, this);
    this.subtype = types.getType(this.subtype);
};

ArrayType.prototype = new Type();

ArrayType.prototype.stringify = function(values) {
    // TODO: Check for strings with spaces and add quotes
    return values.join(' ');
};

ArrayType.prototype.parse = function(arg) {
    if (arg instanceof ArrayArgument) {
        var conversions = arg.getArguments().map(function(subArg) {
            var conversion = this.subtype.parse(subArg);
            // Hack alert. ArrayConversion needs to be able to answer questions
            // about the status of individual conversions in addition to the
            // overall state. This allows us to do that easily.
            subArg.conversion = conversion;
            return conversion;
        }, this);
        return new ArrayConversion(conversions, arg);
    }
    else {
        console.error('non ArrayArgument to ArrayType.parse', arg);
        throw new Error('non ArrayArgument to ArrayType.parse');
    }
};

ArrayType.prototype.getDefault = function() {
    return new ArrayConversion([], new ArrayArgument());
};

ArrayType.prototype.name = 'array';

types.ArrayType = ArrayType;


/**
 * Registration and de-registration.
 */
types.startup = function() {
    types.registerType(StringType);
    types.registerType(NumberType);
    types.registerType(BooleanType);
    types.registerType(BlankType);
    types.registerType(SelectionType);
    types.registerType(DeferredType);
    types.registerType(ArrayType);
};

types.shutdown = function() {
    types.unregisterType(StringType);
    types.unregisterType(NumberType);
    types.unregisterType(BooleanType);
    types.unregisterType(BlankType);
    types.unregisterType(SelectionType);
    types.unregisterType(DeferredType);
    types.unregisterType(ArrayType);
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/argument', ['require', 'exports', 'module' , 'gcli/util'], function(require, exports, module) {
var argument = exports;


var console = require('gcli/util').console;

/**
 * We record where in the input string an argument comes so we can report
 * errors against those string positions.
 * @param text The string (trimmed) that contains the argument
 * @param prefix Knowledge of quotation marks and whitespace used prior to the
 * text in the input string allows us to re-generate the original input from
 * the arguments.
 * @param suffix Any quotation marks and whitespace used after the text.
 * Whitespace is normally placed in the prefix to the succeeding argument, but
 * can be used here when this is the last argument.
 * @constructor
 */
function Argument(text, prefix, suffix) {
    if (text === undefined) {
        this.text = '';
        this.prefix = '';
        this.suffix = '';
    }
    else {
        this.text = text;
        this.prefix = prefix !== undefined ? prefix : '';
        this.suffix = suffix !== undefined ? suffix : '';
    }
}

/**
 * Return the result of merging these arguments.
 * TODO: What happens when we're merging arguments for the single string
 * case and some of the arguments are in quotation marks?
 */
Argument.prototype.merge = function(following) {
    return new Argument(
        this.text + this.suffix + following.prefix + following.text,
        this.prefix, following.suffix);
};

/**
 * Returns a new Argument like this one but with the text set to
 * <tt>replText</tt> and the end adjusted to fit.
 * @param replText Text to replace the old text value
 */
Argument.prototype.beget = function(replText, options) {
    var prefix = this.prefix;
    var suffix = this.suffix;

    var quote = (replText.indexOf(' ') >= 0 || replText.length == 0) ?
            '\'' : '';

    if (options) {
        prefix = (options.prefixSpace ? ' ' : '') + quote;
        suffix = quote;
    }

    return new Argument(replText, prefix, suffix);
};

/**
 * Is there any visible content to this argument?
 */
Argument.prototype.isBlank = function() {
    return this.text === '' &&
            this.prefix.trim() === '' &&
            this.suffix.trim() === '';
};

/**
 * We need to keep track of which assignment we've been assigned to
 */
Argument.prototype.assign = function(assignment) {
    this.assignment = assignment;
};

/**
 * Sub-classes of Argument are collections of arguments, getArgs() gets access
 * to the members of the collection in order to do things like re-create input
 * command lines. For the simple Argument case it's just an array containing
 * only this.
 */
Argument.prototype.getArgs = function() {
    return [ this ];
};

/**
 * We define equals to mean all arg properties are strict equals
 */
Argument.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null || !(that instanceof Argument)) {
        return false;
    }

    return this.text === that.text &&
           this.prefix === that.prefix && this.suffix === that.suffix;
};

/**
 * Helper when we're putting arguments back together
 */
Argument.prototype.toString = function() {
    // TODO: There is a bug here - we should re-escape escaped characters
    // But can we do that reliably?
    return this.prefix + this.text + this.suffix;
};

/**
 * Merge an array of arguments into a single argument.
 * All Arguments in the array are expected to have the same emitter
 */
Argument.merge = function(argArray, start, end) {
    start = (start === undefined) ? 0 : start;
    end = (end === undefined) ? argArray.length : end;

    var joined;
    for (var i = start; i < end; i++) {
        var arg = argArray[i];
        if (!joined) {
            joined = arg;
        }
        else {
            joined = joined.merge(arg);
        }
    }
    return joined;
};

argument.Argument = Argument;


/**
 * Commands like 'echo' with a single string argument, and used with the
 * special format like: 'echo a b c' effectively have a number of arguments
 * merged together.
 */
function MergedArgument(args, start, end) {
    if (!Array.isArray(args)) {
        throw new Error('args is not an array of Arguments');
    }

    if (start === undefined) {
        this.args = args;
    }
    else {
        this.args = args.slice(start, end);
    }

    var arg = Argument.merge(this.args);
    this.text = arg.text;
    this.prefix = arg.prefix;
    this.suffix = arg.suffix;
}

MergedArgument.prototype = Object.create(Argument.prototype);

/**
 * Keep track of which assignment we've been assigned to, and allow the
 * original args to do the same.
 */
MergedArgument.prototype.assign = function(assignment) {
    this.args.forEach(function(arg) {
        arg.assign(assignment);
    }, this);

    this.assignment = assignment;
};

MergedArgument.prototype.getArgs = function() {
    return this.args;
};

MergedArgument.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null || !(that instanceof MergedArgument)) {
        return false;
    }

    // TODO: do we need to check that args is the same?

    return this.text === that.text &&
           this.prefix === that.prefix && this.suffix === that.suffix;
};

argument.MergedArgument = MergedArgument;


/**
 * TrueNamedArguments are for when we have an argument like --verbose which
 * has a boolean value, and thus the opposite of '--verbose' is ''.
 */
function TrueNamedArgument(name, arg) {
    this.arg = arg;
    this.text = arg ? arg.text : '--' + name;
    this.prefix = arg ? arg.prefix : ' ';
    this.suffix = arg ? arg.suffix : '';
}

TrueNamedArgument.prototype = Object.create(Argument.prototype);

TrueNamedArgument.prototype.assign = function(assignment) {
    if (this.arg) {
        this.arg.assign(assignment);
    }
    this.assignment = assignment;
};

TrueNamedArgument.prototype.getArgs = function() {
    // NASTY! getArgs has a fairly specific use: in removing used arguments
    // from a command line. Unlike other arguments which are EITHER used
    // in assignments directly OR grouped in things like MergedArguments,
    // TrueNamedArgument is used raw from the UI, or composed of another arg
    // from the CLI, so we return both here so they can both be removed.
    return this.arg ? [ this, this.arg ] : [ this ];
};

TrueNamedArgument.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null || !(that instanceof TrueNamedArgument)) {
        return false;
    }

    return this.text === that.text &&
           this.prefix === that.prefix && this.suffix === that.suffix;
};

argument.TrueNamedArgument = TrueNamedArgument;


/**
 * FalseNamedArguments are for when we don't have an argument like --verbose
 * which has a boolean value, and thus the opposite of '' is '--verbose'.
 */
function FalseNamedArgument() {
    this.text = '';
    this.prefix = '';
    this.suffix = '';
}

FalseNamedArgument.prototype = Object.create(Argument.prototype);

FalseNamedArgument.prototype.getArgs = function() {
    return [ ];
};

FalseNamedArgument.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null || !(that instanceof FalseNamedArgument)) {
        return false;
    }

    return this.text === that.text &&
           this.prefix === that.prefix && this.suffix === that.suffix;
};

argument.FalseNamedArgument = FalseNamedArgument;


/**
 * A named argument is for cases where we have input in one of the following
 * formats:
 * <ul>
 * <li>--param value
 * <li>-p value
 * <li>--pa value
 * <li>-p:value
 * <li>--param=value
 * <li>etc
 * </ul>
 * The general format is:
 * /--?{unique-param-name-prefix}[ :=]{value}/
 * We model this as a normal argument but with a long prefix.
 */
function NamedArgument(nameArg, valueArg) {
    this.nameArg = nameArg;
    this.valueArg = valueArg;

    this.text = valueArg.text;
    this.prefix = nameArg.toString() + valueArg.prefix;
    this.suffix = valueArg.suffix;
}

NamedArgument.prototype = Object.create(Argument.prototype);

NamedArgument.prototype.assign = function(assignment) {
    this.nameArg.assign(assignment);
    this.valueArg.assign(assignment);
    this.assignment = assignment;
};

NamedArgument.prototype.getArgs = function() {
    return [ this.nameArg, this.valueArg ];
};

NamedArgument.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null) {
        return false;
    }

    if (!(that instanceof NamedArgument)) {
        return false;
    }

    // TODO: do we need to check that nameArg and valueArg are the same?

    return this.text === that.text &&
           this.prefix === that.prefix && this.suffix === that.suffix;
};

argument.NamedArgument = NamedArgument;


/**
 *
 */
function ArrayArgument() {
    this.args = [];
}

ArrayArgument.prototype = Object.create(Argument.prototype);

ArrayArgument.prototype.addArgument = function(arg) {
    this.args.push(arg);
};

ArrayArgument.prototype.addArguments = function(args) {
    Array.prototype.push.apply(this.args, args);
};

ArrayArgument.prototype.getArguments = function() {
    return this.args;
};

ArrayArgument.prototype.assign = function(assignment) {
    this.args.forEach(function(arg) {
        arg.assign(assignment);
    }, this);

    this.assignment = assignment;
};

ArrayArgument.prototype.getArgs = function() {
    return this.args;
};

ArrayArgument.prototype.equals = function(that) {
    if (this === that) {
        return true;
    }
    if (that == null) {
        return false;
    }

    if (!(that instanceof ArrayArgument)) {
        return false;
    }

    if (this.args.length !== that.args.length) {
        return false;
    }

    for (var i = 0; i < this.args.length; i++) {
        if (!this.args[i].equals(that.args[i])) {
            return false;
        }
    }

    return true;
};

/**
 * Helper when we're putting arguments back together
 */
ArrayArgument.prototype.toString = function() {
    return '{' + this.args.map(function(arg) {
        return arg.toString();
    }, this).join(',') + '}';
};

argument.ArrayArgument = ArrayArgument;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/request_view', ['require', 'exports', 'module' , 'gcli/util', 'gcli/canon', 'gcli/ui/domtemplate', 'text!gcli/ui/request_view.css', 'text!gcli/ui/request_view.html'], function(require, exports, module) {
var requestView = exports;


var dom = require('gcli/util').dom;
var event = require('gcli/util').event;

var canon = require('gcli/canon');
var Templater = require('gcli/ui/domtemplate').Templater;

var requestViewCss = require('text!gcli/ui/request_view.css');
var requestViewHtml = require('text!gcli/ui/request_view.html');


/**
 * Work out the path for images.
 * TODO: This should probably live in some utility area somewhere
 */
function imageUrl(path) {
    try {
        return require('text!gcli/ui/' + path);
    }
    catch (ex) {
        var filename = module.id.split('/').pop() + '.js';
        var imagePath;

        if (module.uri.substr(-filename.length) !== filename) {
            console.error('Can\'t work out path from module.uri/module.id');
            return path;
        }

        if (module.uri) {
            var end = module.uri.length - filename.length - 1;
            return module.uri.substr(0, end) + '/' + path;
        }

        return filename + '/' + path;
    }
}


/**
 * A wrapper for a set of rows|command outputs.
 * Register with the canon to be notified of new requests
 */
function RequestsView(options) {
    this.doc = options.document;
    this.inputter = options.inputter;
    this.requ = options.requisition;
    this.reportList = options.reportList || canon.globalReportList;

    this.element = options.requestElement || 'gcliReports';
    if (typeof this.element === 'string') {
        var name = this.element;
        this.element = this.doc.getElementById(name);

        if (!this.element) {
            this.autoHide = true;

            this.element = dom.createElement('div', null, this.doc);
        }
    }

    dom.addCssClass(this.element, 'gcliReports');

    this.reportList.reportsChange.add(this.onReportsChange, this);
}

RequestsView.prototype.onReportsChange = function(ev) {
    if (!ev.report.view) {
        ev.report.view = new RequestView(ev.report, this);
    }
    ev.report.view.onRequestChange(ev);
};

RequestsView.prototype.setHeight = function(height) {
    this.element.style.height = height + 'px';
};

requestView.RequestsView = RequestsView;


/**
 * Adds a row to the CLI output display
 */
function RequestView(request, requestsView) {
    this.request = request;
    this.requestsView = requestsView;

    this.imageUrl = imageUrl;

    // Elements attached to this by the templater. For info only
    this.rowin = null;
    this.rowout = null;
    this.output = null;
    this.hide = null;
    this.show = null;
    this.duration = null;
    this.throb = null;

    // Setup the template on first use
    if (!RequestView._row) {
        dom.importCssString(requestViewCss, this.requestsView.doc);

        var templates = dom.createElement('div', null, this.requestsView.doc);
        dom.setInnerHtml(templates, requestViewHtml);
        RequestView._row = templates.querySelector('.gcliRow');
    }

    new Templater().processNode(RequestView._row.cloneNode(true), this);

    this.requestsView.element.appendChild(this.rowin);
    this.requestsView.element.appendChild(this.rowout);
};

RequestView.prototype = {
    /**
     * A single click on an invocation line in the console copies the command
     * to the command line
     */
    copyToInput: function() {
        if (this.requestsView.inputter) {
            this.requestsView.inputter.setInput(this.request.typed);
        }
    },

    /**
     * A double click on an invocation line in the console executes the command
     */
    execute: function(ev) {
        if (this.requestsView.requ) {
            this.requestsView.requ.exec({ typed: this.request.typed });
        }
    },

    hideOutput: function(ev) {
        this.output.style.display = 'none';
        dom.addCssClass(this.hide, 'cmd_hidden');
        dom.removeCssClass(this.show, 'cmd_hidden');

        event.stopPropagation(ev);
    },

    showOutput: function(ev) {
        this.output.style.display = 'block';
        dom.removeCssClass(this.hide, 'cmd_hidden');
        dom.addCssClass(this.show, 'cmd_hidden');

        event.stopPropagation(ev);
    },

    remove: function(ev) {
        this.requestsView.element.removeChild(this.rowin);
        this.requestsView.element.removeChild(this.rowout);
        event.stopPropagation(ev);
    },

    onRequestChange: function(ev) {
        dom.setInnerHtml(this.duration, this.request.duration != null ?
            'completed in ' + (this.request.duration / 1000) + ' sec ' :
            '');

        dom.clearElement(this.output);

        var node;
        if (this.request.output != null) {
            if (this.request.output instanceof HTMLElement) {
                this.output.appendChild(this.request.output);
            }
            else {
                node = dom.createElement('p', null, this.requestsView.doc);
                dom.setInnerHtml(node, this.request.output.toString());
                this.output.appendChild(node);
            }
        }

        // We need to see the output of the latest command entered
        // Certain browsers have a bug such that scrollHeight is too small
        // when content does not fill the client area of the element
        var scrollHeight = Math.max(this.requestsView.element.scrollHeight,
              this.requestsView.element.clientHeight);
        this.requestsView.element.scrollTop =
              scrollHeight - this.requestsView.element.clientHeight;

        dom.setCssClass(this.output, 'cmd_error', this.request.error);

        this.throb.style.display = this.request.completed ? 'none' : 'block';
    }
};

requestView.RequestView = RequestView;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is DomTemplate.
 *
 * The Initial Developer of the Original Code is Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/domtemplate', ['require', 'exports', 'module' , 'gcli/util'], function(require, exports, module) {
var domtemplate = exports;


var console = require('gcli/util').console;

// WARNING: do not 'use_strict' without reading the notes in envEval;

/**
 * A templater that allows one to quickly template DOM nodes.
 */
function Templater() {
  this.scope = [];
};

/**
 * Recursive function to walk the tree processing the attributes as it goes.
 * @param node the node to process. If you pass a string in instead of a DOM
 * element, it is assumed to be an id for use with document.getElementById()
 * @param data the data to use for node processing.
 */
Templater.prototype.processNode = function(node, data) {
  if (typeof node === 'string') {
    node = document.getElementById(node);
  }
  if (data === null || data === undefined) {
    data = {};
  }
  this.scope.push(node.nodeName + (node.id ? '#' + node.id : ''));
  try {
    // Process attributes
    if (node.attributes && node.attributes.length) {
      // We need to handle 'foreach' and 'if' first because they might stop
      // some types of processing from happening, and foreach must come first
      // because it defines new data on which 'if' might depend.
      if (node.hasAttribute('foreach')) {
        this.processForEach(node, data);
        return;
      }
      if (node.hasAttribute('if')) {
        if (!this.processIf(node, data)) {
          return;
        }
      }
      // Only make the node available once we know it's not going away
      data.__element = node;
      // It's good to clean up the attributes when we've processed them,
      // but if we do it straight away, we mess up the array index
      var attrs = Array.prototype.slice.call(node.attributes);
      for (var i = 0; i < attrs.length; i++) {
        var value = attrs[i].value;
        var name = attrs[i].name;
        this.scope.push(name);
        try {
          if (name === 'save') {
            // Save attributes are a setter using the node
            value = this.stripBraces(value);
            this.property(value, data, node);
            node.removeAttribute('save');
          } else if (name.substring(0, 2) === 'on') {
            // Event registration relies on property doing a bind
            value = this.stripBraces(value);
            var func = this.property(value, data);
            if (typeof func !== 'function') {
              this.handleError('Expected ' + value +
                ' to resolve to a function, but got ' + typeof func);
            }
            node.removeAttribute(name);
            var capture = node.hasAttribute('capture' + name.substring(2));
            node.addEventListener(name.substring(2), func, capture);
            if (capture) {
              node.removeAttribute('capture' + name.substring(2));
            }
          } else {
            // Replace references in all other attributes
            var self = this;
            var newValue = value.replace(/\$\{[^}]*\}/g, function(path) {
              return self.envEval(path.slice(2, -1), data, value);
            });
            // Remove '_' prefix of attribute names so the DOM won't try
            // to use them before we've processed the template
            if (name.charAt(0) === '_') {
              node.removeAttribute(name);
              node.setAttribute(name.substring(1), newValue);
            } else if (value !== newValue) {
              attrs[i].value = newValue;
            }
          }
        } finally {
          this.scope.pop();
        }
      }
    }

    // Loop through our children calling processNode. First clone them, so the
    // set of nodes that we visit will be unaffected by additions or removals.
    var childNodes = Array.prototype.slice.call(node.childNodes);
    for (var j = 0; j < childNodes.length; j++) {
      this.processNode(childNodes[j], data);
    }

    if (node.nodeType === 3 /*Node.TEXT_NODE*/) {
      this.processTextNode(node, data);
    }
  } finally {
    this.scope.pop();
  }
};

/**
 * Handle <x if="${...}">
 * @param node An element with an 'if' attribute
 * @param data The data to use with envEval
 * @returns true if processing should continue, false otherwise
 */
Templater.prototype.processIf = function(node, data) {
  this.scope.push('if');
  try {
    var originalValue = node.getAttribute('if');
    var value = this.stripBraces(originalValue);
    var recurse = true;
    try {
      var reply = this.envEval(value, data, originalValue);
      recurse = !!reply;
    } catch (ex) {
      this.handleError('Error with \'' + value + '\'', ex);
      recurse = false;
    }
    if (!recurse) {
      node.parentNode.removeChild(node);
    }
    node.removeAttribute('if');
    return recurse;
  } finally {
    this.scope.pop();
  }
};

/**
 * Handle <x foreach="param in ${array}"> and the special case of
 * <loop foreach="param in ${array}">
 * @param node An element with a 'foreach' attribute
 * @param data The data to use with envEval
 */
Templater.prototype.processForEach = function(node, data) {
  this.scope.push('foreach');
  try {
    var originalValue = node.getAttribute('foreach');
    var value = originalValue;

    var paramName = 'param';
    if (value.charAt(0) === '$') {
      // No custom loop variable name. Use the default: 'param'
      value = this.stripBraces(value);
    } else {
      // Extract the loop variable name from 'NAME in ${ARRAY}'
      var nameArr = value.split(' in ');
      paramName = nameArr[0].trim();
      value = this.stripBraces(nameArr[1].trim());
    }
    node.removeAttribute('foreach');
    try {
      var self = this;
      // Process a single iteration of a loop
      var processSingle = function(member, clone, ref) {
        ref.parentNode.insertBefore(clone, ref);
        data[paramName] = member;
        self.processNode(clone, data);
        delete data[paramName];
      };

      // processSingle is no good for <loop> nodes where we want to work on
      // the childNodes rather than the node itself
      var processAll = function(scope, member) {
        self.scope.push(scope);
        try {
          if (node.nodeName === 'LOOP') {
            for (var i = 0; i < node.childNodes.length; i++) {
              var clone = node.childNodes[i].cloneNode(true);
              processSingle(member, clone, node);
            }
          } else {
            var clone = node.cloneNode(true);
            clone.removeAttribute('foreach');
            processSingle(member, clone, node);
          }
        } finally {
          self.scope.pop();
        }
      };

      var reply = this.envEval(value, data, originalValue);
      if (Array.isArray(reply)) {
        reply.forEach(function(data, i) {
          processAll('' + i, data);
        }, this);
      } else {
        for (var param in reply) {
          if (reply.hasOwnProperty(param)) {
            processAll(param, param);
          }
        }
      }
      node.parentNode.removeChild(node);
    } catch (ex) {
      this.handleError('Error with \'' + value + '\'', ex);
    }
  } finally {
    this.scope.pop();
  }
};

/**
 * Take a text node and replace it with another text node with the ${...}
 * sections parsed out. We replace the node by altering node.parentNode but
 * we could probably use a DOM Text API to achieve the same thing.
 * @param node The Text node to work on
 * @param data The data to use in calls to envEval
 */
Templater.prototype.processTextNode = function(node, data) {
  // Replace references in other attributes
  var value = node.data;
  // We can't use the string.replace() with function trick (see generic
  // attribute processing in processNode()) because we need to support
  // functions that return DOM nodes, so we can't have the conversion to a
  // string.
  // Instead we process the string as an array of parts. In order to split
  // the string up, we first replace '${' with '\uF001$' and '}' with '\uF002'
  // We can then split using \uF001 or \uF002 to get an array of strings
  // where scripts are prefixed with $.
  // \uF001 and \uF002 are just unicode chars reserved for private use.
  value = value.replace(/\$\{([^}]*)\}/g, '\uF001$$$1\uF002');
  var parts = value.split(/\uF001|\uF002/);
  if (parts.length > 1) {
    parts.forEach(function(part) {
      if (part === null || part === undefined || part === '') {
        return;
      }
      if (part.charAt(0) === '$') {
        part = this.envEval(part.slice(1), data, node.data);
      }
      // It looks like this was done a few lines above but see envEval
      if (part === null) {
        part = "null";
      }
      if (part === undefined) {
        part = "undefined";
      }
      // if (isDOMElement(part)) { ... }
      if (typeof part.cloneNode !== 'function') {
        part = node.ownerDocument.createTextNode(part.toString());
      }
      node.parentNode.insertBefore(part, node);
    }, this);
    node.parentNode.removeChild(node);
  }
};

/**
 * Warn of string does not begin '${' and end '}'
 * @param str the string to check.
 * @return The string stripped of ${ and }, or untouched if it does not match
 */
Templater.prototype.stripBraces = function(str) {
  if (!str.match(/\$\{.*\}/g)) {
    this.handleError('Expected ' + str + ' to match ${...}');
    return str;
  }
  return str.slice(2, -1);
};

/**
 * Combined getter and setter that works with a path through some data set.
 * For example:
 * <ul>
 * <li>property('a.b', { a: { b: 99 }}); // returns 99
 * <li>property('a', { a: { b: 99 }}); // returns { b: 99 }
 * <li>property('a', { a: { b: 99 }}, 42); // returns 99 and alters the
 * input data to be { a: { b: 42 }}
 * </ul>
 * @param path An array of strings indicating the path through the data, or
 * a string to be cut into an array using <tt>split('.')</tt>
 * @param data An object to look in for the <tt>path</tt> argument
 * @param newValue (optional) If defined, this value will replace the
 * original value for the data at the path specified.
 * @return The value pointed to by <tt>path</tt> before any
 * <tt>newValue</tt> is applied.
 */
Templater.prototype.property = function(path, data, newValue) {
  this.scope.push(path);
  try {
    if (typeof path === 'string') {
      path = path.split('.');
    }
    var value = data[path[0]];
    if (path.length === 1) {
      if (newValue !== undefined) {
        data[path[0]] = newValue;
      }
      if (typeof value === 'function') {
        return function() {
          return value.apply(data, arguments);
        };
      }
      return value;
    }
    if (!value) {
      this.handleError('Can\'t find path=' + path);
      return null;
    }
    return this.property(path.slice(1), value, newValue);
  } finally {
    this.scope.pop();
  }
};

/**
 * Like eval, but that creates a context of the variables in <tt>env</tt> in
 * which the script is evaluated.
 * WARNING: This script uses 'with' which is generally regarded to be evil.
 * The alternative is to create a Function at runtime that takes X parameters
 * according to the X keys in the env object, and then call that function using
 * the values in the env object. This is likely to be slow, but workable.
 * @param script The string to be evaluated.
 * @param env The environment in which to eval the script.
 * @param context Optional debugging string in case of failure
 * @return The return value of the script, or the error message if the script
 * execution failed.
 */
Templater.prototype.envEval = function(script, env, context) {
  with (env) {
    try {
      this.scope.push(context);
      return eval(script);
    } catch (ex) {
      this.handleError('Template error evaluating \'' + script + '\'' +
          ' environment=' + Object.keys(env).join(', '), ex);
      return script;
    } finally {
      this.scope.pop();
    }
  }
};

/**
 * A generic way of reporting errors, for easy overloading in different
 * environments.
 * @param message the error message to report.
 * @param ex optional associated exception.
 */
Templater.prototype.handleError = function(message, ex) {
  this.logError(message);
  this.logError('In: ' + this.scope.join(' > '));
  if (ex) {
    this.logError(ex);
  }
};


/**
 * A generic way of reporting errors, for easy overloading in different
 * environments.
 * @param message the error message to report.
 */
Templater.prototype.logError = function(message) {
  console.log(message);
};

domtemplate.Templater = Templater;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *      Julian Viereck (julian.viereck@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/popup', ['require', 'exports', 'module' , 'gcli/util'], function(require, exports, module) {
var cliView = exports;


var dom = require('gcli/util').dom;
var event = require('gcli/util').event;
var console = require('gcli/util').console;


/**
 * Some implementations of GCLI require an element to be visible whenever the
 * GCLI has the focus.
 * This can be somewhat tricky because the definition of 'has the focus' is
 * one where a group of elements could have the focus.
 */
function Popup(options) {
    this.doc = options.document || document;

    this.inputter = options.inputter;
    this.children = options.children;
    this.style = options.style || Popup.style.doubleColumnFirstFixedLeft;

    // Focus Management.
    this.outputHideTimeout;
    this.preventBlurTimeout;
    this.preventBlurInputFocus;

    this.showOutput = this.showOutput.bind(this);
    this.hideOutput = this.hideOutput.bind(this);
    this.preventBlur = this.preventBlur.bind(this);
    this.resizer = this.resizer.bind(this);
    this.autoHide = false;

    this.element = options.popupElement || 'gcliOutput';
    if (typeof this.element === 'string') {
        var name = this.element;
        this.element = this.doc.getElementById(name);

        if (!this.element) {
            this.autoHide = true;
            this.element = dom.createElement('div', null, this.doc);
            this.element.id = name;
            if (this.inputter) {
                this.inputter.appendAfter(this.element);
            }

            this.element.style.position = 'absolute';
            this.element.style.zIndex = '999';
        }

        // this.element.style.overflow = 'auto';
    }

    // Allow options to override the autoHide option
    if (options.autoHide != null) {
        this.autoHide = options.autoHide;
    }

    this.children.forEach(function(child) {
        if (child.element) {
            this.element.appendChild(child.element);
        }
    }, this);

    this.win = this.element.ownerDocument.defaultView;

    event.addListener(this.win, 'resize', this.resizer);
    this.resizer();

    // Attach events to this.output to check if any DOM node inside of the
    // output node is focused/clicked on. This kind of events prevent the
    // output node from getting hidden.
    // If any of the DOM nodes inside of output get blurred, hide the
    // output node. If the focus is set to a different node in output,
    // the focus event will prevent closing the output.
    // The third argument to addEventListener MUST be set to true!
    this.element.addEventListener('click', this.preventBlur, true);
    this.element.addEventListener('mousedown', this.preventBlur, true);
    this.element.addEventListener('focus', this.preventBlur, true);
    this.element.addEventListener('blur', this.hideOutput,  true);

    if (this.inputter) {
        this.inputter.sendFocusEventsToPopup(this);
    }

    if (this.style === Popup.style.doubleColumnFirstFixedLeft) {
        var left = this.children[0].element;
        left.style.position = 'absolute';
        left.style.bottom = '0';
        left.style.left = '0';
        left.style.maxWidth = '300px';

        var right = this.children[1].element;
        right.style.position = 'absolute';
        right.style.bottom = '0';
        right.style.left = '320px';
        right.style.right = '0';

        // What height should the output panel be, by default?
        this._outputHeight = 300;
    }
    else if (this.style === Popup.style.singleColumnVariable) {
        this._outputHeight = -1;
    }
    else {
        throw new Error('Invalid style setting');
    }

    // Adjust to the current outputHeight only when we created the output
    if (this.autoHide) {
        this.setOutputHeight(this._outputHeight);
    }

    // Hide the cli's output at after startup.
    this.hideOutput();
}

/**
 * A way to customize chunks of CSS in one go.
 * This is a bit of a hack, perhaps we'll move to injected CSS or something
 * later when we know more about what needs customizing.
 */
Popup.style = {
    doubleColumnFirstFixedLeft: 'doubleColumnFirstFixedLeft',
    singleColumnVariable: 'singleColumnVariable'
};

/**
 * Configuration point - how high should the output window be?
 */
Popup.prototype.setOutputHeight = function(outputHeight) {
    if (outputHeight == null) {
        this._outputHeight = outputHeight;
    }

    if (this._outputHeight === -1) {
        return;
    }

    this.element.style.height = this._outputHeight + 'px';
    this.children.forEach(function(child) {
        if (child.setHeight) {
            child.setHeight(this._outputHeight);
        }
    }, this);
};

/**
 * Tweak CSS to show the output popup
 */
Popup.prototype.showOutput = function() {
    if (this.autoHide) {
        this.element.style.display = 'inline-block';
        // Ensure that no outputHideTimer is called.
        this.preventBlur();
    }
};

/**
 * Hide the popup using a CSS tweak
 */
Popup.prototype.hideOutput = function() {
    if (this.preventBlurTimeout) {
        // We are not allowed to blur. Check if we are allowed to
        // focus the input element again which is in some situations
        // necessary to ensure that one DOM node has the focus.
        // Call input.focus after the current call stack is empty.
        if (!this.preventBlurInputFocus && this.inputter) {
            this.win.setTimeout(function() {
                this.inputter.focus();
            }.bind(this), 0);
        }
        return;
    }
    else {
        // Set's a timer to hide the output element. This timer might
        // get canceled due to calls to preventBlur.
        this.outputHideTimeout = this.win.setTimeout(function() {
            if (this.autoHide) {
                this.element.style.display = 'none';
            }
        }.bind(this), 100);
    }
};

/**
 * If you click from the input element to the popup, we don't want to
 * hide the popup (which we normally do on input blur) so we attach
 * this to a number of related events, and it prevents the popup from
 * getting hidden
 */
Popup.prototype.preventBlur = function(ev) {
    // Prevent hiding the output element.
    this.win.clearTimeout(this.outputHideTimeout);

    if (ev) {
        // If this function was called by an event, check if the
        // element that was clicked/focused has a blur event. If so,
        // set this.preventBlurInputFocus in order to prevent hideOutput()
        // from focusing the input element.
        var isInput = ev.target.tagName === 'INPUT' &&
                ev.target.type !== 'submit' && ev.target.type !== 'button';
        if (ev.target.tagName === 'SELECT' || isInput) {
            this.preventBlurInputFocus = true;
        }
    }

    // Setup a timer to prevent hiding the output node until the call
    // stack is finished. This is necessary, as mousedown/click events
    // occurred sometimes before the input.blur event, but the
    // input.blur event should be prevented.
    if (this.preventBlurTimeout) {
        this.win.clearTimeout(this.preventBlurTimeout);
    }
    this.preventBlurTimeout = this.win.setTimeout(function() {
        this.preventBlurTimeout = null;
        this.preventBlurInputFocus = false;

        // If blurring was prevented due to selecting/focusing a check
        // box, the focus has to be set to the input element again such
        // that one DOM element on the cli has the focus (the checkbox
        // DOM input element doesn't have a blur event).
        if (ev && ev.target.type === 'checkbox' && this.inputter) {
            this.inputter.focus();
        }
    }.bind(this), 0);
};

/**
 * To be called on window resize or any time we want to align the elements
 * with the input box.
 */
Popup.prototype.resizer = function() {
    if (this.autoHide) {
        var rect = this.inputter.getDimensionRect();
        if (!rect) {
            return;
        }

        this.element.style.top = 'auto';
        var bottom = this.doc.documentElement.clientHeight - rect.top;
        this.element.style.bottom = bottom + 'px';
        this.element.style.left = rect.left + 'px';

        if (this.style === Popup.style.doubleColumnFirstFixedLeft) {
            this.element.style.width = (rect.width - 80) + 'px';
        }
    }
};

cliView.Popup = Popup;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *      Julian Viereck (julian.viereck@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/inputter', ['require', 'exports', 'module' , 'gcli/util', 'gcli/types', 'gcli/ui/domtemplate', 'text!gcli/ui/inputter.css'], function(require, exports, module) {
var cliView = exports;


var console = require('gcli/util').console;
var event = require('gcli/util').event;
var dom = require('gcli/util').dom;

var Status = require('gcli/types').Status;
var Templater = require('gcli/ui/domtemplate').Templater;

var inputterCss = require('text!gcli/ui/inputter.css');


/**
 * We only want to import inputterCss once so this tracks whether or not we have
 * done it. Note technically it's only once per document, so perhaps we should
 * have a list of documents into which we've imported the CSS?
 */
var inputterCssImported = false;

/**
 * A wrapper to take care of the functions concerning an input element
 */
function Inputter(options) {
    if (!inputterCssImported && !options.preStyled) {
        dom.importCssString(inputterCss, this.doc);
        inputterCssImported = true;
    }

    this.requ = options.requisition;

    // Suss out where the input element is
    this.element = options.inputElement || 'gcliInput';
    if (typeof this.element === 'string') {
        this.doc = options.document || document;
        var name = this.element;
        this.element = this.doc.getElementById(name);
        if (!this.element) {
            throw new Error('No element with id=' + name + '.');
        }
    }
    else {
        // Assume we've been passed in the correct node
        this.doc = this.element.ownerDocument;
    }

    this.element.spellcheck = false;

    // Ensure that TAB/UP/DOWN isn't handled by the browser
    event.addCommandKeyListener(this.element, this.onCommandKey.bind(this));
    event.addListener(this.element, 'keyup', this.onKeyUp.bind(this));

    // Use our document if no other is supplied
    options.document = options.document || this.doc;

    if (options.completer == null) {
        options.completer = new Completer(options);
    }
    else if (typeof options.completer === 'function') {
        options.completer = new options.completer(options);
    }
    this.completer = options.completer;
    this.completer.decorate(this);

    // cursor position affects hint severity.
    event.addListener(this.element, 'mouseup', function(ev) {
        this.completer.update();
    }.bind(this));

    this.requ.inputChange.add(this.onInputChange, this);
}

Inputter.prototype.onInputChange = function() {
    this.element.value = this.requ.toString();
    this.completer.update();
};

/**
 * When the input element gets/loses focus make sure we tell the popup so it
 * can show/hide accordingly.
 */
Inputter.prototype.sendFocusEventsToPopup = function(popup) {
    event.addListener(this.element, "focus", popup.showOutput);
    event.addListener(this.element, "blur", popup.hideOutput);
};

Inputter.prototype.focus = function() {
    this.element.focus();
};

Inputter.prototype.getDimensionRect = function() {
    if (!this.element.getClientRects) {
        // TODO: how can we make up for this?
        return;
    }
    var rect = this.element.getClientRects()[0];
    rect.width = rect.right - rect.left;
    rect.height = rect.bottom - rect.top;
    return rect;
};

/**
 * Utility to add an element into the DOM after the input element.
 */
Inputter.prototype.appendAfter = function(element) {
    this.element.parentNode.insertBefore(element, this.element.nextSibling);
};

/**
 * Ensure certain keys (arrows, tab, etc) that we would like to handle
 * are not handled by the browser
 */
Inputter.prototype.onCommandKey = function(ev, hashId, key) {
    if (key === 9 /*TAB*/ || key === 38 /*UP*/ || key === 40 /*DOWN*/) {
        event.stopEvent(ev);
    }
};

/**
 * Just set the input field to a value without executing anything
 */
Inputter.prototype.setInput = function(str) {
    this.element.value = str;
    this.update();
};

/**
 * The main keyboard processing loop
 */
Inputter.prototype.onKeyUp = function(ev) {
    // RETURN does a special exec/highlight thing
    if (ev.keyCode === 13 /*RETURN*/) {
        var worst = this.requ.getStatus();
        // Deny RETURN unless the command might work
        if (worst === Status.VALID) {
            this.requ.exec();
            this.element.value = '';
        }

        // Idea: If the user has pressed return, but the input can't work,
        // then highlight the error region.
        // This has the problem that the habit of pressing return to get to
        // the error is very dangerous, and also that it requires a new
        // API into Requisition
        /*
        else {
            var position = this.requ.getFirstNonValidPosition();
            dom.setSelectionStart(this.element, position.start);
            dom.setSelectionEnd(this.element, position.end);
        }
        */
    }

    this.update();

    // Special actions which delegate to the assignment
    var start = dom.getSelectionStart(this.element);
    var current = this.requ.getAssignmentAt(start);
    if (current) {
        // TAB does a special complete thing
        if (ev.keyCode === 9 /*TAB*/) {
            current.complete();
        }

        // UP/DOWN look for some history
        if (ev.keyCode === 38 /*UP*/) {
            current.increment();
        }
        if (ev.keyCode === 40 /*DOWN*/) {
            current.decrement();
        }
    }
};

/**
 * Actually parse the input and make sure we're all up to date
 */
Inputter.prototype.update = function() {
    this.updateCli();
    this.completer.update();
};

/**
 * Update the requisition with the contents of the input element.
 */
Inputter.prototype.updateCli = function() {
    var input = {
        typed: this.element.value,
        cursor: {
            start: dom.getSelectionStart(this.element),
            end: dom.getSelectionEnd(this.element.selectionEnd)
        }
    };

    this.requ.update(input);
};

cliView.Inputter = Inputter;


/**
 * Completer is an 'input-like' element that sits  an input element annotating
 * it with visual goodness.
 */
function Completer(options) {
    this.doc = options.document;
    this.requ = options.requisition;
    this.elementCreated = false;

    this.element = options.completeElement || 'gcliComplete';
    if (typeof this.element === 'string') {
        var name = this.element;
        this.element = this.doc.getElementById(name);

        if (!this.element) {
            this.elementCreated = true;
            this.element = dom.createElement('div', null, this.doc);
            this.element.className = 'gcliCompletion VALID';
        }
    }

    if (options.inputBackgroundElement) {
        this.backgroundElement = options.inputBackgroundElement;
    }
    else {
        this.backgroundElement = this.element;
    }
}

/**
 * A list of the styles that decorate() should copy to make the completion
 * element look like the input element. backgroundColor is a spiritual part of
 * this list, but see comment in decorate()
 */
Completer.copyStyles = [
    'color', 'fontSize', 'fontFamily', 'fontWeight', 'fontStyle'
];

/**
 * Make ourselves visually similar to the input element, and make the input
 * element transparent so our background shines through
 */
Completer.prototype.decorate = function(inputter) {
    this.inputter = inputter;
    this.input = inputter.element;

    // If we were told which element to use, then assume it is already
    // correctly positioned. Otherwise insert it alongside the input element
    if (this.elementCreated) {
        this.inputter.appendAfter(this.element);

        Completer.copyStyles.forEach(function(style) {
            this.element.style[style] = dom.computedStyle(this.input, style);
        }, this);
        // It's not clear why backgroundColor doesn't work when used from
        // computedStyle, but it doesn't. Patches welcome!
        this.element.style.backgroundColor = this.input.style.backgroundColor;

        this.input.style.backgroundColor = 'transparent';

        // Make room for the prompt
        this.input.style.paddingLeft = '16px';

        var resizer = this.resizer.bind(this);
        event.addListener(this.doc.defaultView, 'resize', resizer);
        resizer();
    }
};

/**
 * Ensure that the completion element is the same size and the inputter element
 */
Completer.prototype.resizer = function() {
    var rect = this.inputter.getDimensionRect();
    if (!rect) {
        console.log('Skipping resize, missing getClientRects');
        return;
    }

    this.element.style.top = rect.top + 'px';
    this.element.style.height = rect.height + 'px';
    this.element.style.lineHeight = rect.height + 'px';
    this.element.style.left = rect.left + 'px';
    this.element.style.width = rect.width + 'px';
};

/**
 * Bring the completion element up to date with what the requisition says
 */
Completer.prototype.update = function() {
    var start = dom.getSelectionStart(this.input);
    var current = this.requ.getAssignmentAt(start);
    var predictions = current.getPredictions();

    // Update the completer element with prompt/error marker/TAB info
    dom.removeCssClass(this.backgroundElement, Status.VALID.toString());
    dom.removeCssClass(this.backgroundElement, Status.INCOMPLETE.toString());
    dom.removeCssClass(this.backgroundElement, Status.ERROR.toString());

    var completion = '<span class="gcliPrompt">&gt;</span> ';
    if (this.input.value.length > 0) {
        var scores = this.requ.getInputStatusMarkup();
        completion += this.markupStatusScore(scores);
    }

    // Display the '-> prediction' at the end of the completer element
    if (this.input.value.length > 0 && predictions.length > 0) {
        var tab = predictions[0];
        tab = tab.name ? tab.name : tab;
        completion += ' &#xa0;<span class="gcliCompl">&#x21E5; ' +
                tab + '</span>';
    }
    dom.setInnerHtml(this.element, '<span>' + completion + '</span>');
    var status = this.requ.getStatus();

    dom.addCssClass(this.backgroundElement, status.toString());
};

/**
 * Mark-up an array of Status values with spans
 */
Completer.prototype.markupStatusScore = function(scores) {
    var completion = '';
    // Create mark-up
    var i = 0;
    var lastStatus = -1;
    while (true) {
        if (lastStatus !== scores[i]) {
            completion += '<span class="' + scores[i].toString() + '">';
            lastStatus = scores[i];
        }
        completion += this.input.value[i];
        i++;
        if (i === this.input.value.length) {
            completion += '</span>';
            break;
        }
        if (lastStatus !== scores[i]) {
            completion += '</span>';
        }
    }

    return completion;
};

cliView.Completer = Completer;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *      Julian Viereck (julian.viereck@gmail.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/hinter', ['require', 'exports', 'module' , 'gcli/util', 'gcli/ui/arg_fetch', 'gcli/ui/menu', 'text!gcli/ui/hinter.css'], function(require, exports, module) {
var cliView = exports;


var dom = require('gcli/util').dom;
var console = require('gcli/util').console;

var ArgFetcher = require('gcli/ui/arg_fetch').ArgFetcher;
var Menu = require('gcli/ui/menu').Menu;

var hinterCss = require('text!gcli/ui/hinter.css');

/**
 * We only want to import hinterCss once so this tracks whether or not we have
 * done it. Note technically it's only once per document, so perhaps we should
 * have a list of documents into which we've imported the CSS?
 */
var hinterCssImported = false;

/**
 * A container to show either an ArgFetcher or a Menu depending on the state
 * of the requisition.
 */
function Hinter(options) {
    options = options || {};

    this.doc = options.document;
    this.requ = options.requisition;

    if (!hinterCssImported) {
        dom.importCssString(hinterCss, this.doc);
        hinterCssImported = true;
    }

    this.element = dom.createElement('div', null, this.doc);
    this.element.className = 'gcliHintParent';

    this.hinter = dom.createElement('div', null, this.doc);
    this.hinter.className = 'gcliHints';
    this.element.appendChild(this.hinter);

    this.menu = options.menu || new Menu(this.doc, this.requ);
    this.hinter.appendChild(this.menu.element);

    this.argFetcher = options.argFetcher || new ArgFetcher(this.doc, this.requ);
    this.hinter.appendChild(this.argFetcher.element);

    this.requ.commandChange.add(this.onCommandChange, this);
    this.onCommandChange();
}

Hinter.prototype.setHeight = function(height) {
    this.element.style.maxHeight = height + 'px';
};

/**
 * Update the hint to reflect the changed command
 */
Hinter.prototype.onCommandChange = function(ev) {
    if (!this.requ.commandAssignment.getValue()) {
        this.menu.show();
        this.argFetcher.hide();
    }
    else {
        if (ev && ev.oldValue === ev.newValue) {
            return; // Just the text has changed
        }

        this.argFetcher.completeRequisition();
        this.menu.hide();
    }
};

cliView.Hinter = Hinter;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/arg_fetch', ['require', 'exports', 'module' , 'gcli/util', 'gcli/ui/field', 'gcli/ui/domtemplate', 'text!gcli/ui/arg_fetch.css', 'text!gcli/ui/arg_fetch.html'], function(require, exports, module) {
var argFetch = exports;


var dom = require('gcli/util').dom;
var field = require('gcli/ui/field');
var Templater = require('gcli/ui/domtemplate').Templater;

var editorCss = require('text!gcli/ui/arg_fetch.css');
var argFetchHtml = require('text!gcli/ui/arg_fetch.html');


/**
 *
 */
function ArgFetcher(doc, requ) {
    this.doc = doc;
    this.requ = requ;

    // FF can be really hard to debug if doc is null, so we check early on
    if (!this.doc) {
        throw new Error('No document');
    }

    this.element =  dom.createElement('div', null, this.doc);
    this.element.className = 'gcliCliEle';
    // We cache the fields we create so we can destroy them later
    this.fields = [];

    this.tmpl = new Templater();

    // Pull the HTML into the DOM, but don't add it to the document
    if (!ArgFetcher.reqTempl) {
        dom.importCssString(editorCss, this.doc);

        var templates = dom.createElement('div', null, this.doc);
        dom.setInnerHtml(templates, argFetchHtml);
        ArgFetcher.reqTempl = templates.querySelector('#gcliReqTempl');
    }
}

/**
 *
 */
ArgFetcher.prototype.hide = function() {
    this.element.style.display = 'none';
};

/**
 *
 */
ArgFetcher.prototype.completeRequisition = function() {
    this.fields.forEach(function(field) { field.destroy(); });
    this.fields = [];

    var reqEle = ArgFetcher.reqTempl.cloneNode(true);
    this.tmpl.processNode(reqEle, this);
    dom.clearElement(this.element);
    this.element.appendChild(reqEle);
    this.element.style.display = 'block';
};

/**
 * Called by the template process in #onCommandChange() to get an instance
 * of field for each assignment.
 */
ArgFetcher.prototype.getInputFor = function(assignment) {
    var newField = field.getField(this.doc,
            assignment.param.type,
            !assignment.param.isPositionalAllowed(),
            assignment.param.name,
            this.requ);

    // TODO remove on delete
    newField.fieldChanged.add(function(ev) {
        assignment.setConversion(ev.conversion);
    }, this);
    assignment.assignmentChange.add(function(ev) {
        // Don't report an event if the value is unchanged
        if (ev.oldConversion != null &&
                ev.conversion.valueEquals(ev.oldConversion)) {
            return;
        }

        newField.setConversion(ev.conversion);
    });

    this.fields.push(newField);
    newField.setConversion(this.assignment.conversion);

    // HACK: we add the field as a property of the assignment so that
    // #linkMessageElement() can tell the field how to report errors.
    assignment.field = newField;

    return newField.element;
};

/**
 * Called by the template to setup an mutable message field
 */
ArgFetcher.prototype.linkMessageElement = function(assignment, element) {
    // HACK: See #getInputFor()
    var field = assignment.field;
    if (field == null) {
        console.error('Missing field for ' + JSON.stringify(assignment));
        return 'Missing field';
    }
    field.setMessageElement(element);
    return '';
};

/**
 * Event handler added by the template menu.html
 */
ArgFetcher.prototype.onFormOk = function(ev) {
    this.requ.exec();
};

/**
 * Event handler added by the template menu.html
 */
ArgFetcher.prototype.onFormCancel = function(ev) {
    this.requ.clear();
};

argFetch.ArgFetcher = ArgFetcher;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/field', ['require', 'exports', 'module' , 'gcli/util', 'gcli/argument', 'gcli/types'], function(require, exports, module) {
var field = exports;


var dom = require('gcli/util').dom;
var console = require('gcli/util').console;
var createEvent = require('gcli/util').createEvent;

var Argument = require('gcli/argument').Argument;
var TrueNamedArgument = require('gcli/argument').TrueNamedArgument;
var FalseNamedArgument = require('gcli/argument').FalseNamedArgument;
var ArrayArgument = require('gcli/argument').ArrayArgument;

var Conversion = require('gcli/types').Conversion;
var ArrayConversion = require('gcli/types').ArrayConversion;

var StringType = require('gcli/types').StringType;
var NumberType = require('gcli/types').NumberType;
var BooleanType = require('gcli/types').BooleanType;
var BlankType = require('gcli/types').BlankType;
var SelectionType = require('gcli/types').SelectionType;
var DeferredType = require('gcli/types').DeferredType;
var ArrayType = require('gcli/types').ArrayType;


/**
 * On startup we need to:
 * 1. Add 3 sets of elements to the DOM for:
 * - command line output
 * - input hints
 * - completion
 * 2. Attach a set of events so the command line works
 */
field.startup = function() {
    addField(StringField);
    addField(NumberField);
    addField(BooleanField);
    addField(SelectionField);
    addField(DeferredField);
    addField(BlankField);
    addField(ArrayField);
};

field.shutdown = function() {
    removeField(StringField);
    removeField(NumberField);
    removeField(BooleanField);
    removeField(SelectionField);
    removeField(DeferredField);
    removeField(BlankField);
    removeField(ArrayField);
};

/**
 * A Field is a way to get input for a single parameter.
 * This class is designed to be inherited from. It is important that children
 * ensure that the constructor is called during their creation to ensure that
 * the fieldChanged event is initialized.
 * @param doc The document we use in calling createElement
 */
function Field(doc, type, named, name, requ) {
    this.fieldChanged = createEvent();
}

Field.prototype.element = undefined;

Field.prototype.destroy = function() {
    throw new Error('Field should not be used directly');
};

Field.prototype.setConversion = function(conversion) {
    throw new Error('Field should not be used directly');
};

Field.prototype.getConversion = function() {
    throw new Error('Field should not be used directly');
};

Field.prototype.setMessageElement = function(element) {
    this.messageElement = element;
};

Field.prototype.setMessage = function(message) {
    if (this.messageElement) {
        if (message == null) {
            message = '';
        }
        dom.setInnerHtml(this.messageElement, message);
    }
};

Field.prototype.onFieldChange = function() {
    var conversion = this.getConversion();
    this.fieldChanged({ conversion: conversion });
    this.setMessage(conversion.message);
};

/**
 *
 */
Field.claim = function() {
    throw new Error('Field should not be used directly');
};
Field.MATCH = 5;
Field.DEFAULT_MATCH = 4;
Field.IF_NOTHING_BETTER = 1;
Field.NO_MATCH = 0;


/**
 * Managing the current list of Fields
 */
var fieldCtors = [];
function addField(fieldCtor) {
    if (typeof fieldCtor !== 'function') {
        console.error('addField erroring on ', fieldCtor);
        throw new Error('addField requires a Field constructor');
    }
    fieldCtors.push(fieldCtor);
}

function removeField(field) {
    if (typeof field !== 'string') {
        fields = fields.filter(function(test) {
          return test !== field;
        });
        delete fields[field];
    }
    else if (field instanceof Field) {
        removeField(field.name);
    }
    else {
        console.error('removeField erroring on ', field);
        throw new Error('removeField requires an instance of Field');
    }
}

function getField(doc, type, named, name, requ) {
    var ctor;
    var highestClaim = -1;
    fieldCtors.forEach(function(fieldCtor) {
        var claim = fieldCtor.claim(type);
        if (claim > highestClaim) {
            highestClaim = claim;
            ctor = fieldCtor;
        }
    });

    if (!ctor) {
        console.error('Can\'t find field for ', type, ' in ', fieldCtors);
    }

    return new ctor(doc, type, named, name, requ);
}

field.Field = Field;
field.addField = addField;
field.removeField = removeField;
field.getField = getField;


/**
 * A field that allows editing of strings
 */
function StringField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.arg = new Argument();

    this.element = dom.createElement('input', null, this.doc);
    this.element.type = 'text';

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('keyup', this.onFieldChange, false);
}

StringField.prototype = new Field();

StringField.prototype.destroy = function() {
    this.element.removeEventListener('keyup', this.onKeyup, false);
};

StringField.prototype.setConversion = function(conversion) {
    this.arg = conversion.arg;
    this.element.value = conversion.arg.text;
    this.setMessage(conversion.message);
};

StringField.prototype.getConversion = function() {
    // This tweaks the prefix/suffix of the argument to fit
    this.arg = this.arg.beget(this.element.value, { prefixSpace: true });
    return this.type.parse(this.arg);
};

StringField.claim = function(type) {
    return type instanceof StringType ? Field.MATCH : Field.IF_NOTHING_BETTER;
};

field.StringField = StringField;


/**
 * A field that allows editing of numbers using an [input type=number] field
 */
function NumberField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.arg = new Argument();

    this.element = dom.createElement('input', null, this.doc);
    this.element.type = 'number';
    if (this.type.max) {
        this.element.max = this.type.max;
    }
    if (this.type.min) {
        this.element.min = this.type.min;
    }
    if (this.type.step) {
        this.element.step = this.type.step;
    }

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('keyup', this.onFieldChange, false);
}

NumberField.prototype = new Field();

NumberField.claim = function(type) {
    return type instanceof NumberType ? Field.MATCH : Field.NO_MATCH;
};

NumberField.prototype.destroy = function() {
    this.element.removeEventListener('keyup', this.onKeyup, false);
};

NumberField.prototype.setConversion = function(conversion) {
    this.arg = conversion.arg;
    this.element.value = conversion.arg.text;
    this.setMessage(conversion.message);
};

NumberField.prototype.getConversion = function() {
    this.arg = this.arg.beget(this.element.value, { prefixSpace: true });
    return this.type.parse(this.arg);
};

field.NumberField = NumberField;


/**
 * A field that uses a checkbox to toggle a boolean field
 */
function BooleanField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.name = name;
    this.named = named;

    this.element = dom.createElement('input', null, this.doc);
    this.element.type = 'checkbox';

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('change', this.onFieldChange, false);
}

BooleanField.prototype = new Field();

BooleanField.claim = function(type) {
    return type instanceof BooleanType ? Field.MATCH : Field.NO_MATCH;
};

BooleanField.prototype.destroy = function() {
    this.element.removeEventListener('change', this.onChange, false);
};

BooleanField.prototype.setConversion = function(conversion) {
    this.element.checked = conversion.value;
    this.setMessage(conversion.message);
};

BooleanField.prototype.getConversion = function() {
    var value = this.element.checked;
    var arg = this.named ?
        value ? new TrueNamedArgument(this.name) : new FalseNamedArgument() :
        new Argument(' ' + value);
    return new Conversion(value, arg);
};

field.BooleanField = BooleanField;


/**
 * Model an instanceof SelectionType as a select input box.
 * <p>There are 3 slightly overlapping concepts to be aware of:
 * <ul>
 * <li>value: This is the (probably non-string) value, known as a value by the
 *     assignment
 * <li>optValue: This is the text value as known by the DOM option element, as
 *     in &lt;option value=XXX%gt...
 * <li>optText: This is the contents of the DOM option element.
 * </ul>
 */
function SelectionField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.opts = {};
    this.defaultText = 'Select a ' + this.type.name + ' ...';

    this.element = dom.createElement('select', null, this.doc);
    this._addOption(null, this.defaultText, SelectionField.DEFAULT_VALUE);
    var lookup = this.type.getLookup();
    Object.keys(lookup).forEach(function(name) {
        this._addOption(lookup[name], name);
    }, this);

    this.onFieldChange = this.onFieldChange.bind(this);
    this.element.addEventListener('change', this.onFieldChange, false);
}

SelectionField.prototype = new Field();

SelectionField.claim = function(type) {
    return type instanceof SelectionType ? Field.DEFAULT_MATCH : Field.NO_MATCH;
};

SelectionField.prototype.destroy = function() {
    this.element.removeEventListener('change', this.onChange, false);
};

SelectionField.prototype.setConversion = function(conversion) {
    var optValue = SelectionField.DEFAULT_VALUE;
    Object.keys(this.opts).some(function(key) {
        var opt = this.opts[key];
        if (opt.value === conversion.value) {
            optValue = opt.optValue;
            return true;
        }
        return false;
    }, this);
    this.element.value = optValue;
    this.setMessage(conversion.message);
};

SelectionField.prototype.getConversion = function() {
    var value = this.element.value === SelectionField.DEFAULT_VALUE ?
            null :
            this.opts[this.element.value].value;
    var arg = new Argument(this.type.stringify(value), ' ');
    return new Conversion(value, arg);
};

SelectionField.prototype._addOption = function(value, optText, optValue) {
    optValue = optValue || optText;
    this.opts[optValue] = {
        value: value,
        optText: optText,
        optValue: optValue
    };
    var option = dom.createElement('option', null, this.doc);
    option.innerHTML = optText;
    option.value = optValue;
    this.element.appendChild(option);
};

SelectionField.DEFAULT_VALUE = '__SelectionField.DEFAULT_VALUE';

field.SelectionField = SelectionField;


/**
 * A field that works with deferred types by delaying resoluion until that last
 * possible time
 */
function DeferredField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.named = named;
    this.name = name;
    this.requ = requ;
    this.requ.assignmentChange.add(this.update, this);

    this.element = dom.createElement('div', null, this.doc);
    this.update();
}

DeferredField.prototype = new Field();

DeferredField.prototype.update = function() {
    var subtype = this.type.defer();
    if (subtype === this.subtype) {
        return;
    }

    if (this.field) {
        this.field.destroy();
    }

    this.subtype = subtype;
    this.field = getField(this.doc, subtype, this.named, this.name, this.requ);
    this.field.fieldChanged.add(this.fieldChanged, this);

    dom.clearElement(this.element);
    this.element.appendChild(this.field.element);
};

DeferredField.claim = function(type) {
    return type instanceof DeferredType ? Field.MATCH : Field.NO_MATCH;
};

DeferredField.prototype.destroy = function() {
    this.requ.assignmentChange.remove(this.update, this);
};

DeferredField.prototype.setConversion = function(conversion) {
    this.field.setConversion(conversion);
};

DeferredField.prototype.getConversion = function() {
    return this.field.getConversion();
};

field.DeferredField = DeferredField;


/**
 * For use with deferred types that do not yet have anything to resolve to.
 * BlankFields are not for general use.
 */
function BlankField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.element = dom.createElement('div', null, this.doc);
}

BlankField.prototype = new Field();

BlankField.claim = function(type) {
    return type instanceof BlankType ? Field.MATCH : Field.NO_MATCH;
};

BlankField.prototype.destroy = function() { };

BlankField.prototype.setConversion = function() { };

BlankField.prototype.getConversion = function() {
    return new Conversion(null);
};

field.BlankField = BlankField;


/**
 * Adds add/delete buttons to a normal field allowing there to be many values
 * given for a parameter.
 */
function ArrayField(doc, type, named, name, requ) {
    this.doc = doc;
    this.type = type;
    this.named = named;
    this.name = name;
    this.requ = requ;

    this._onAdd = this._onAdd.bind(this);
    this.members = [];

    // <div class=gcliArrayParent save="${element}">
    this.element = dom.createElement('div', null, this.doc);
    this.element.className = 'gcliArrayParent';

    // <div class=gcliArrayMbrAdd onclick="${_onAdd}" save="${addButton}">
    this.addButton = dom.createElement('button', null, this.doc);
    this.addButton.className = 'gcliArrayMbrAdd';
    this.addButton.addEventListener('click', this._onAdd, false);
    this.addButton.innerHTML = 'Add';
    this.element.appendChild(this.addButton);

    // <div class=gcliArrayMbrs save="${mbrElement}">
    this.container = dom.createElement('div', null, this.doc);
    this.container.className = 'gcliArrayMbrs';
    this.element.appendChild(this.container);

    this.onFieldChange = this.onFieldChange.bind(this);
}

ArrayField.prototype = new Field();

ArrayField.claim = function(type) {
    return type instanceof ArrayType ? Field.MATCH : Field.NO_MATCH;
};

ArrayField.prototype.destroy = function() {
    this.addButton.removeEventListener('click', this._onAdd, false);
};

ArrayField.prototype.setConversion = function(conversion) {
    // TODO: do the members need any de-reg?
    // TODO: this is too brutal - it removes focus from any the current field
    dom.clearElement(this.container);
    this.members = [];

    conversion.conversions.forEach(function(subConversion) {
        this._onAdd(null, subConversion);
    }, this);
};

ArrayField.prototype.getConversion = function() {
    var conversions = [];
    var arrayArg = new ArrayArgument();
    for (var i = 0; i < this.members.length; i++) {
        var conversion = this.members[i].field.getConversion();
        conversions.push(conversion);
        arrayArg.addArgument(conversion.arg);
    }
    return new ArrayConversion(conversions, arrayArg);
};

ArrayField.prototype._onAdd = function(ev, subConversion) {

    // <div class=gcliArrayMbr save="${element}">
    var element = dom.createElement('div', null, this.doc);
    element.className = 'gcliArrayMbr';
    this.container.appendChild(element);

    // ${field.element}
    var field = getField(this.doc, this.type.subtype, this.named,
            this.name, this.requ);
    field.fieldChanged.add(function() {
        var conversion = this.getConversion();
        this.fieldChanged({ conversion: conversion });
        this.setMessage(conversion.message);
    }, this);

    if (subConversion) {
        field.setConversion(subConversion);
    }
    element.appendChild(field.element);

    // <div class=gcliArrayMbrDel onclick="${_onDel}">
    var delButton = dom.createElement('button', null, this.doc);
    delButton.className = 'gcliArrayMbrDel';
    delButton.addEventListener('click', this._onDel, false);
    delButton.innerHTML = 'Del';
    element.appendChild(delButton);

    var member = {
        element: element,
        field: field,
        parent: this
    };
    member.onDelete = function() {
        this.parent.container.removeChild(this.element);
        this.parent.members = this.parent.members.filter(function(test) {
          return test !== this;
        });
        this.parent.onFieldChange();
    }.bind(member);
    delButton.addEventListener('click', member.onDelete, false);

    this.members.push(member);
};

field.ArrayField = ArrayField;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/ui/menu', ['require', 'exports', 'module' , 'gcli/util', 'gcli/types', 'gcli/argument', 'gcli/canon', 'gcli/ui/domtemplate', 'text!gcli/ui/menu.css', 'text!gcli/ui/menu.html'], function(require, exports, module) {
var cliView = exports;


var dom = require('gcli/util').dom;
var console = require('gcli/util').console;

var Conversion = require('gcli/types').Conversion;
var Argument = require('gcli/argument').Argument;
var canon = require('gcli/canon');

var Templater = require('gcli/ui/domtemplate').Templater;

var menuCss = require('text!gcli/ui/menu.css');
var menuHtml = require('text!gcli/ui/menu.html');


/**
 * Menu is a display of the commands that are possible given the state of a
 * requisition.
 */
function Menu(doc, requ) {
    this.doc = doc;
    this.requ = requ;

    this.element =  dom.createElement('div', null, this.doc);
    this.element.className = 'gcliMenu';
    this.tmpl = new Templater();

    // Pull the HTML into the DOM, but don't add it to the document
    if (!Menu.optTempl) {
        dom.importCssString(menuCss, this.doc);

        var templates = dom.createElement('div', null, this.doc);
        dom.setInnerHtml(templates, menuHtml);
        Menu.optTempl = templates.querySelector('#gcliOptTempl');
    }

    canon.canonChange.add(this.update, this);
}

Menu.prototype.hide = function() {
    this.element.style.display = 'none';
};

Menu.prototype.update = function() {
    var predictions = this.requ.commandAssignment.getPredictions();
    predictions.sort(function(command1, command2) {
        return command1.name.localeCompare(command2.name);
    });
    var items = [];
    predictions.forEach(function(command) {
        if (command.description && !command.hidden) {
            items.push({
                name: command.name,
                description: command.description,
                title: command.manual || '',
                click: function() {
                    var type = this.requ.commandAssignment.param.type;
                    var text = type.stringify(command);
                    var arg = new Argument(text);
                    var conversion = new Conversion(command, arg);
                    this.requ.commandAssignment.setConversion(conversion);
                }.bind(this)
            });
        }
    }, this);
    var options = Menu.optTempl.cloneNode(true);
    this.tmpl.processNode(options, { items: items });

    dom.clearElement(this.element);
    this.element.appendChild(options);

    this.element.style.display = 'block';
};

Menu.prototype.show = function() {
    this.update();
    this.element.style.display = 'block';
};

cliView.Menu = Menu;


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/promise', ['require', 'exports', 'module' , 'gcli/util'], function(require, exports, module) {

var console = require('gcli/util').console;


/**
 * A promise can be in one of 2 states.
 * The ERROR and SUCCESS states are terminal, the PENDING state is the only
 * start state.
 */
var ERROR = -1;
var PENDING = 0;
var SUCCESS = 1;

/**
 * We give promises and ID so we can track which are outstanding
 */
var _nextId = 0;

/**
 * Outstanding promises. Handy list for debugging only.
 */
var _outstanding = [];

/**
 * Recently resolved promises. Also for debugging only.
 */
var _recent = [];

/**
 * Create an unfulfilled promise
 */
Promise = function () {
    this._status = PENDING;
    this._value = undefined;
    this._onSuccessHandlers = [];
    this._onErrorHandlers = [];

    // Debugging help
    this._id = _nextId++;
    _outstanding[this._id] = this;
};

/**
 * Yeay for RTTI.
 */
Promise.prototype.isPromise = true;

/**
 * Have we either been resolve()ed or reject()ed?
 */
Promise.prototype.isComplete = function() {
    return this._status != PENDING;
};

/**
 * Have we resolve()ed?
 */
Promise.prototype.isResolved = function() {
    return this._status == SUCCESS;
};

/**
 * Have we reject()ed?
 */
Promise.prototype.isRejected = function() {
    return this._status == ERROR;
};

/**
 * Take the specified action of fulfillment of a promise, and (optionally)
 * a different action on promise rejection.
 */
Promise.prototype.then = function(onSuccess, onError) {
    if (typeof onSuccess === 'function') {
        if (this._status === SUCCESS) {
            onSuccess.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onSuccessHandlers.push(onSuccess);
        }
    }

    if (typeof onError === 'function') {
        if (this._status === ERROR) {
            onError.call(null, this._value);
        } else if (this._status === PENDING) {
            this._onErrorHandlers.push(onError);
        }
    }

    return this;
};

/**
 * Like then() except that rather than returning <tt>this</tt> we return
 * a promise which
 */
Promise.prototype.chainPromise = function(onSuccess) {
    var chain = new Promise();
    chain._chainedFrom = this;
    this.then(function(data) {
        try {
            chain.resolve(onSuccess(data));
        } catch (ex) {
            chain.reject(ex);
        }
    }, function(ex) {
        chain.reject(ex);
    });
    return chain;
};

/**
 * Supply the fulfillment of a promise
 */
Promise.prototype.resolve = function(data) {
    return this._complete(this._onSuccessHandlers, SUCCESS, data, 'resolve');
};

/**
 * Renege on a promise
 */
Promise.prototype.reject = function(data) {
    return this._complete(this._onErrorHandlers, ERROR, data, 'reject');
};

/**
 * Internal method to be called on resolve() or reject().
 * @private
 */
Promise.prototype._complete = function(list, status, data, name) {
    // Complain if we've already been completed
    if (this._status != PENDING) {
        console.group('Promise already closed');
        console.error('Attempted ' + name + '() with ', data);
        console.error('Previous status = ', this._status,
                ', previous value = ', this._value);
        console.trace();

        console.groupEnd();
        return this;
    }

    this._status = status;
    this._value = data;

    // Call all the handlers, and then delete them
    list.forEach(function(handler) {
        handler.call(null, this._value);
    }, this);
    this._onSuccessHandlers.length = 0;
    this._onErrorHandlers.length = 0;

    // Remove the given {promise} from the _outstanding list, and add it to the
    // _recent list, pruning more than 20 recent promises from that list.
    delete _outstanding[this._id];
    _recent.push(this);
    while (_recent.length > 20) {
        _recent.shift();
    }

    return this;
};

/**
 * Takes an array of promises and returns a promise that that is fulfilled once
 * all the promises in the array are fulfilled
 * @param group The array of promises
 * @return the promise that is fulfilled when all the array is fulfilled
 */
Promise.group = function(promiseList) {
    if (!(promiseList instanceof Array)) {
        promiseList = Array.prototype.slice.call(arguments);
    }

    // If the original array has nothing in it, return now to avoid waiting
    if (promiseList.length === 0) {
        return new Promise().resolve([]);
    }

    var groupPromise = new Promise();
    var results = [];
    var fulfilled = 0;

    var onSuccessFactory = function(index) {
        return function(data) {
            results[index] = data;
            fulfilled++;
            // If the group has already failed, silently drop extra results
            if (groupPromise._status !== ERROR) {
                if (fulfilled === promiseList.length) {
                    groupPromise.resolve(results);
                }
            }
        };
    };

    promiseList.forEach(function(promise, index) {
        var onSuccess = onSuccessFactory(index);
        var onError = groupPromise.reject.bind(groupPromise);
        promise.then(onSuccess, onError);
    });

    return groupPromise;
};

exports.Promise = Promise;
exports._outstanding = _outstanding;
exports._recent = _recent;

});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/commands/help', ['require', 'exports', 'module' , 'gcli/canon', 'gcli/index'], function(require, exports, module) {
var basic = exports;


// This API is NOT public it may change without warning in the future.
var canon = require('gcli/canon');

/**
 * We export a way to customize the help message with some HTML text
 */
basic.helpMessages = {
    prefix: null,
    suffix: null
};

/**
 * 'help' command
 */
var helpCommandSpec = {
    name: 'help',
    params: [
        {
            name: 'search',
            type: 'string',
            description: 'Search string',
            defaultValue: null
        },
        {
            group: 'Options',
            params: [
                {
                    name: 'hidden',
                    type: 'boolean',
                    description: 'Include hidden'
                }
            ]
        }
    ],
    returnType: 'html',
    description: 'Get help on the available commands',
    exec: function(env, args) {
        var output = [];

        var command = canon.getCommand(args.search);
        if (command && command.exec) {
            // caught a real command
            output.push(command.description ?
                    command.description :
                    'No description for ' + args.search);
        } else {
            if (!args.search && basic.helpMessages.prefix) {
                output.push(basic.helpMessages.prefix);
            }

            if (command) {
                // We must be looking at sub-commands
                output.push('<h2>Sub-Commands of ' + command.name + '</h2>');
                output.push('<p>' + command.description + '</p>');
            }
            else if (args.search) {
                output.push('<h2>Commands starting with \'' + args.search + '\':</h2>');
            }
            else {
                output.push('<h2>Available Commands:</h2>');
            }

            var commandNames = canon.getCommandNames();
            commandNames.sort();

            output.push('<table>');
            for (var i = 0; i < commandNames.length; i++) {
                command = canon.getCommand(commandNames[i]);
                if (!args.hidden && command.hidden) {
                    continue;
                }
                if (command.description === undefined) {
                    // Ignore editor actions
                    continue;
                }
                if (args.search && command.name.indexOf(args.search) !== 0) {
                    // Filtered out by the user
                    continue;
                }
                if (!args.search && command.name.indexOf(' ') != -1) {
                    // sub command
                    continue;
                }
                if (command && command.name == args.search) {
                    // sub command, and we've already given that help
                    continue;
                }

                // todo add back a column with parameter information, perhaps?

                output.push('<tr>');
                output.push('<th class="right">' + command.name + '</th>');
                output.push('<td>' + command.description + '</td>');
                output.push('</tr>');
            }
            output.push('</table>');

            if (!args.search && basic.helpMessages.suffix) {
                output.push(basic.helpMessages.suffix);
            }
        }

        return output.join('');
    }
};


var gcli = require('gcli/index');

basic.startup = function() {
    gcli.addCommand(helpCommandSpec);
};

basic.shutdown = function() {
    gcli.removeCommand(helpCommandSpec);
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('demo/index', ['require', 'exports', 'module' , 'demo/commands/basic', 'demo/commands/bugs', 'demo/commands/demo', 'demo/commands/experimental'], function(require, exports, module) {

    exports.startup = function() {
        require('demo/commands/basic').startup();
        require('demo/commands/bugs').startup();
        require('demo/commands/demo').startup();
        require('demo/commands/experimental').startup();
    };

    exports.shutdown = function() {
        require('demo/commands/experimental').startup();
        require('demo/commands/demo').startup();
        require('demo/commands/bugs').startup();
        require('demo/commands/basic').startup();
    };

});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('demo/commands/basic', ['require', 'exports', 'module' , 'gcli/index'], function(require, exports, module) {


/**
 * 'eval' command
 */
var evalCommandSpec = {
    name: 'eval',
    params: [
        {
            name: 'javascript',
            type: 'string',
            description: 'Script to evaluate'
        }
    ],
    returnType: 'html',
    description: 'Call \'eval\' on some JavaScript',
    exec: function(env, args) {
        var resultPrefix = 'Result for <em>\'' + args.javascript + '\'</em>: ';
        try {
            var result = eval(args.javascript);

            if (result === null) {
                return resultPrefix + 'null.';
            }

            if (result === undefined) {
                return resultPrefix + 'undefined.';
            }

            if (typeof result === 'function') {
                return resultPrefix +
                    (result + '').replace(/\n/g, '<br>').replace(/ /g, '&#160');
            }

            return resultPrefix + result;
        } catch (e) {
            return '<b>Error</b>: ' + e.message;
        }
    }
};

/**
 * Arm window.alert with metadata
 */
window.alert.metadata = {
    name: 'alert',
    context: window,
    description: 'Show an alert dialog',
    params: [
        {
            name: 'message',
            type: 'string',
            description: 'Message to display'
        }
    ]
};

/**
 * 'echo' command
 */
echo.metadata = {
    name: 'echo',
    description: 'Show a message',
    params: [
        {
            name: 'message',
            type: 'string',
            description: 'Message to output'
        }
    ],
    returnType: 'string'
};
function echo(message) {
    return message;
}


var gcli = require('gcli/index');

exports.startup = function() {
    gcli.addCommand(evalCommandSpec);
    gcli.addCommand(echo);
    gcli.addCommand(window.alert);
};

exports.shutdown = function() {
    gcli.removeCommand(evalCommandSpec);
    gcli.removeCommand(echo);
    gcli.removeCommand(window.alert);
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('demo/commands/bugs', ['require', 'exports', 'module' , 'gcli/index'], function(require, exports, module) {


var gcli = require('gcli/index');

/**
 * 'bugz' command.
 * @see https://wiki.mozilla.org/Bugzilla:REST_API
 * @see https://wiki.mozilla.org/Bugzilla:REST_API:Search
 * @see http://www.bugzilla.org/docs/developer.html
 * @see https://harthur.wordpress.com/2011/03/31/bz-js/
 * @see https://github.com/harthur/bz.js
 */
var bugzCommandSpec = {
    name: 'bugz',
    returnType: 'html',
    description: 'List the bugs open in Bugzilla',
    exec: function(env, args) {
        var promise = gcli.createPromise();
        var url = 'https://api-dev.bugzilla.mozilla.org/0.9/bug' +
            '?short_desc=gcli' +
            '&short_desc_type=allwordssubstr' +
            '&bug_status=UNCONFIRMED' +
            '&bug_status=NEW' +
            '&bug_status=ASSIGNED' +
            '&bug_status=REOPENED' +
            '&component=Developer%20Tools';

        var req = new XMLHttpRequest();
        req.open('GET', url, true);
        req.setRequestHeader('Accept', 'application/json');
        req.setRequestHeader('Content-type', 'application/json');
        req.onreadystatechange = function(event) {
            if (req.readyState == 4) {
                if (req.status >= 300 || req.status < 200) {
                    promise.resolve('Error: ' + JSON.stringify(req));
                    return;
                }

                var json;
                try {
                    json = JSON.parse(req.responseText);
                }
                catch (ex) {
                    promise.resolve('Invalid JSON response: ' + ex + ': ' +
                        req.responseText);
                    return;
                }

                if (json.error) {
                    promise.resolve('Error: ' + json.error.message);
                    return;
                }

                var reply = '<p>Open devtools bugs with \'gcli\' in the summary ' +
                    '(i.e. <a href="https://bugzilla.mozilla.org/buglist.cgi?list_id=170394&short_desc=gcli&query_format=advanced&bug_status=UNCONFIRMED&bug_status=NEW&bug_status=ASSIGNED&bug_status=REOPENED&short_desc_type=allwordssubstr&component=Developer%20Tools">this search</a>):' +
                    '<ul>';
                json.bugs.forEach(function(bug) {
                    reply += '<li>' +
                        '<a href="https://bugzilla.mozilla.org/show_bug.cgi?id=' + bug.id + '"' +
                        ' target="_blank">' + bug.id + '</a>: ' +
                        escapeHtml(bug.summary) +
                        '</li>';
                });
                reply += '</ul>';
                promise.resolve(reply);
            }
        }.bind(this);
        req.send();

        return promise;
    }
};

function escapeHtml(original) {
    return original.replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#039;');
};

var gcli = require('gcli/index');

exports.startup = function() {
    gcli.addCommand(bugzCommandSpec);
};

exports.shutdown = function() {
    gcli.removeCommand(bugzCommandSpec);
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('demo/commands/demo', ['require', 'exports', 'module' , 'gcli/index'], function(require, exports, module) {


var gcli = require('gcli/index');


/**
 * 'gcli' command
 */
var example = {
    metadata: {
        description: 'Commands for playing with the UI'
    },

    onestring: {
        description: 'Single string parameter',
        params: [
            { name: 'text', type: 'string', description: 'Demo param' }
        ],
        returnType: 'html'
    },
    onestring: function(text) {
        return motivate() + 'text=' + text;
    },

    twostrings: {
        description: '2 string parameters',
        params: [
            { name: 'text1', type: 'string', description: 'First param' },
            { name: 'text2', type: 'string', description: 'Second param' }
        ],
        returnType: 'html'
    },
    twostrings: function(text1, text2) {
        return motivate() +
            'text1=\'' + text1 + '\', text2=\'' + text2 + '\'';
    }
};

var messages = [
    'GCLI wants you to trick it out in some way.</br>',
    'GCLI is your web command line.</br>',
    'GCLI would love to be like Zsh on the Web.</br>',
    'GCLI is written on the Web platform, so you can tweak it.</br>'
];
function motivate() {
    var index = Math.floor(Math.random() * messages.length);
    return messages[index];
}


exports.startup = function() {
    gcli.addCommands(example, 'gcli');
};

exports.shutdown = function() {
    gcli.removeCommands(example, 'gcli');
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('demo/commands/experimental', ['require', 'exports', 'module' , 'gcli/canon', 'gcli/types'], function(require, exports, module) {
var experimental = exports;


var canon = require('gcli/canon');
var types = require('gcli/types');
var Type = require('gcli/types').Type;
var Conversion = require('gcli/types').Conversion;

/**
 * commitObject really needs some smarts, but for now it is a clone of string
 */
var commitObject = new Type();

commitObject.stringify = function(value) {
    return value;
};

commitObject.parse = function(arg) {
    return new Conversion(arg.text, arg);
};

commitObject.name = 'commitObject';

/**
 * existingFile really needs some smarts, but for now it is a clone of string
 */
var existingFile = new Type();

existingFile.stringify = function(value) {
    return value;
};

existingFile.parse = function(arg) {
    return new Conversion(arg.text, arg);
};

existingFile.name = 'existingFile';

/**
 * 'git' command
 */
var git = {
    metadata: {
        description: 'Distributed revision control in a browser',
        manual: 'Git is a fast, scalable, distributed revision control system' +
            ' with an unusually rich command set that provides both' +
            ' high-level operations and full access to internals.'
    },

    add: {
        description: 'Add file contents to the index',
        manual: 'This command updates the index using the current content found in the working tree, to prepare the content staged for the next commit. It typically adds the current content of existing paths as a whole, but with some options it can also be used to add content with only part of the changes made to the working tree files applied, or remove paths that do not exist in the working tree anymore.' +
                '<br/>The "index" holds a snapshot of the content of the working tree, and it is this snapshot that is taken as the contents of the next commit. Thus after making any changes to the working directory, and before running the commit command, you must use the add command to add any new or modified files to the index.' +
                '<br/>This command can be performed multiple times before a commit. It only adds the content of the specified file(s) at the time the add command is run; if you want subsequent changes included in the next commit, then you must run git add again to add the new content to the index.' +
                '<br/>The git status command can be used to obtain a summary of which files have changes that are staged for the next commit.' +
                '<br/>The git add command will not add ignored files by default. If any ignored files were explicitly specified on the command line, git add will fail with a list of ignored files. Ignored files reached by directory recursion or filename globbing performed by Git (quote your globs before the shell) will be silently ignored. The git add command can be used to add ignored files with the -f (force) option.' +
                '<br/>Please see git-commit(1) for alternative ways to add content to a commit.',
        params: [
            {
                name: 'filepattern',
                type: { name: 'array', subtype: 'string' },
                description: 'Files to add content from.',
                manual: 'Fileglobs (e.g.  *.c) can be given to add all matching files. Also a leading directory name (e.g.  dir to add dir/file1 and dir/file2) can be given to add all files in the directory, recursively.'
            },
            {
                group: 'Common Options',
                params: [
                    {
                        name: 'all',
                        short: 'A',
                        type: 'boolean',
                        description: 'Like -u, but match <em>filepattern</em> against files in the working tree in addition to the index.',
                        manual: 'That means that it will find new files as well as staging modified content and removing files that are no longer in the working tree.'
                    },
                    {
                        name: 'verbose',
                        short: 'v',
                        type: 'boolean',
                        description: 'Be verbose.'
                    },
                    {
                        name: 'dry-run',
                        short: 'n',
                        type: 'boolean',
                        description: 'Don\'t actually add the file(s), just show if they exist and/or will be ignored.'
                    },
                    {
                        name: 'force',
                        short: 'f',
                        type: 'boolean',
                        description: 'Allow adding otherwise ignored files.'
                    }
                ]
            },
            {
                group: 'Advanced Options',
                params: [
                    {
                        name: 'update',
                        short: 'u',
                        type: 'boolean',
                        description: 'Only match <em>filepattern</em> against already tracked files in the index rather than the working tree.',
                        manual: 'That means that it will never stage new files, but that it will stage modified new contents of tracked files and that it will remove files from the index if the corresponding files in the working tree have been removed.<br/>If no <filepattern> is given, default to "."; in other words, update all tracked files in the current directory and its subdirectories.'
                    },
                    {
                        name: 'intent-to-add',
                        short: 'N',
                        type: 'boolean',
                        description: 'Record only the fact that the path will be added later.',
                        manual: 'An entry for the path is placed in the index with no content. This is useful for, among other things, showing the unstaged content of such files with git diff and committing them with git commit -a.'
                    },
                    {
                        name: 'refresh',
                        type: 'boolean',
                        description: 'Don\'t add the file(s), but only refresh their stat() information in the index.'
                    },
                    {
                        name: 'ignore-errors',
                        type: 'boolean',
                        description: 'If some files could not be added because of errors indexing them, do not abort the operation, but continue adding the others.',
                        manual: 'The command shall still exit with non-zero status.'
                    },
                    {
                        name: 'ignore-missing',
                        type: 'boolean',
                        description: 'By using this option the user can check if any of the given files would be ignored, no matter if they are already present in the work tree or not.',
                        manual: 'This option can only be used together with --dry-run.'
                    }
                ]
            }
        ],
        exec: function(dryRun, verbose, force, update, all, intentToAdd, refresh, ignoreErrors, ignoreMissing, filePattern) {
        }
    },

    commit: {
        description: 'Record changes to the repository',
        manual: 'Stores the current contents of the index in a new commit along with a log message from the user describing the changes.' +
                '<br/>The content to be added can be specified in several ways:' +
                '<br/>1. by using git add to incrementally "add" changes to the index before using the commit command (Note: even modified files must be "added");' +
                '<br/>2. by using git rm to remove files from the working tree and the index, again before using the commit command;' +
                '<br/>3. by listing files as arguments to the commit command, in which case the commit will ignore changes staged in the index, and instead record the current content of the listed files (which must already be known to git);' +
                '<br/>4. by using the -a switch with the commit command to automatically "add" changes from all known files (i.e. all files that are already listed in the index) and to automatically "rm" files in the index that have been removed from the working tree, and then perform the actual commit;' +
                '<br/>5. by using the --interactive switch with the commit command to decide one by one which files should be part of the commit, before finalizing the operation. Currently, this is done by invoking git add --interactive.' +
                '<br/>The --dry-run option can be used to obtain a summary of what is included by any of the above for the next commit by giving the same set of parameters (options and paths).' +
                '<br/>If you make a commit and then find a mistake immediately after that, you can recover from it with git reset.',
        params: [
            {
                name: 'all',
                short: 'a',
                type: 'boolean',
                description: 'Tell the command to automatically stage files that have been modified and deleted, but new files you have not told git about are not affected.'
            },
            {
                name: 'reuse-message',
                short: 'C',
                type: 'commitObject',
                description: 'Take an existing commit object, and reuse the log message and the authorship information (including the timestamp) when creating the commit.'
            },
            {
                name: 'reset-author',
                type: 'boolean',
                description: 'When used with --reuse-message/--amend options, declare that the authorship of the resulting commit now belongs of the committer. This also renews the author timestamp.'
            },
            {
                name: 'short',
                type: 'boolean',
                description: 'When doing a dry-run, give the output in the short-format.',
                manual: 'See git-status(1) for details. Implies --dry-run.'
            },
            {
                name: 'porcelain',
                type: 'boolean',
                description: 'When doing a dry-run, give the output in a porcelain-ready format.',
                manual: 'See git-status(1) for details. Implies --dry-run.'
            },
            {
                name: 'terminate-nul',
                short: 'z',
                type: 'boolean',
                description: 'When showing short or porcelain status output, terminate entries in the status output with NUL, instead of LF.',
                manual: 'If no format is given, implies the --porcelain output format.'
            },
            {
                name: 'file',
                short: 'F',
                type: 'existingFile',
                description: 'Take the commit message from the given file.',
                manual: ''
            },
            {
                name: 'author',
                type: 'string',
                description: 'Override the commit author.',
                manual: 'Specify an explicit author using the standard A U Thor <author@example.com[1]> format. Otherwise <author> is assumed to be a pattern and is used to search for an existing commit by that author (i.e. rev-list --all -i --author=<author>); the commit author is then copied from the first such commit found.'
            },
            {
                name: 'date',
                type: 'string', // TODO: Make this of date type
                description: 'Override the author date used in the commit.'
            },
            {
                name: 'message',
                short: 'm',
                type: 'string',
                description: 'Use the given message as the commit message.'
            },
            /*
            {
                name: 'template',
                short: 't',
                type: 'existingFile',
                description: 'Use the contents of the given file as the initial version of the commit message.',
                manual: 'The editor is invoked and you can make subsequent changes. If a message is specified using the -m or -F options, this option has no effect. This overrides the commit.template configuration variable.'
            },
            */
            {
                name: 'signoff',
                short: 's',
                type: 'boolean',
                description: 'Add Signed-off-by line by the committer at the end of the commit log message.'
            },
            {
                name: 'no-verify',
                short: 'n',
                type: 'boolean',
                description: 'This option bypasses the pre-commit and commit-msg hooks. See also githooks(5).'
            },
            {
                name: 'cleanup',
                type: {
                    name: 'selection',
                    data: [ 'verbatim', 'whitespace', 'strip', 'default' ]
                },
                description: 'This option sets how the commit message is cleaned up.',
                manual: 'The <em>default</em> mode will strip leading and trailing empty lines and commentary from the commit message only if the message is to be edited. Otherwise only whitespace removed. The <em>verbatim</em> mode does not change message at all, <em>whitespace</em> removes just leading/trailing whitespace lines and <em>strip</em> removes both whitespace and commentary.'
            },
            {
                name: 'amend',
                type: 'boolean',
                description: 'Used to amend the tip of the current branch.',
                manual: 'Prepare the tree object you would want to replace the latest commit as usual (this includes the usual -i/-o and explicit paths), and the commit log editor is seeded with the commit message from the tip of the current branch. The commit you create replaces the current tip -- if it was a merge, it will have the parents of the current tip as parents -- so the current top commit is discarded.'
            },
            {
                name: 'include',
                short: 'i',
                type: 'boolean',
                description: 'Before making a commit out of staged contents so far, stage the contents of paths given on the command line as well.',
                manual: 'This is usually not what you want unless you are concluding a conflicted merge.'
            },
            {
                name: 'only',
                short: 'o',
                type: 'boolean',
                description: 'Make a commit only from the paths specified on the command line, disregarding any contents that have been staged so far.',
                manual: 'This is the default mode of operation of git commit if any paths are given on the command line, in which case this option can be omitted. If this option is specified together with --amend, then no paths need to be specified, which can be used to amend the last commit without committing changes that have already been staged.'
            },
            {
                name: 'untracked-files',
                short: 'u',
                type: {
                    name: 'selection',
                    data: [ 'no', 'normal', 'all' ]
                },
                description: 'Show untracked files (Default: all).',
                manual: 'The mode parameter is optional, and is used to specify the handling of untracked files. The possible options are: <em>no</em> - Show no untracked files.<br/><em>normal</em> Shows untracked files and directories<br/><em>all</em> Also shows individual files in untracked directories.'
            },
            {
                name: 'verbose',
                short: 'v',
                type: 'boolean',
                description: 'Show unified diff between the HEAD commit and what would be committed at the bottom of the commit message template.',
                manual: 'Note that this diff output doesn\'t have its lines prefixed with #.'
            },
            {
                name: 'quiet',
                short: 'q',
                type: 'boolean',
                description: 'Suppress commit summary message.'
            },
            {
                name: 'dry-run',
                type: 'boolean',
                description: 'Do not create a commit, but show a list of paths that are to be committed, paths with local changes that will be left uncommitted and paths that are untracked.'
            },
            {
                name: 'status',
                type: 'boolean',
                description: 'Include the output of git-status(1) in the commit message template when using an editor to prepare the commit message.',
                manual: 'Defaults to on, but can be used to override configuration variable commit.status.'
            },
            {
                name: 'no-status',
                type: 'boolean',
                description: 'Do not include the output of git-status(1) in the commit message template when using an editor to prepare the default commit message.'
            },
            {
                name: 'file',
                type: 'existingFile[]',
                description: 'When files are given on the command line, the command commits the contents of the named files, without recording the changes already staged.',
                manual: 'The contents of these files are also staged for the next commit on top of what have been staged before.'
            }
        ],
        exec: function(env, args) {
        }
    }
};


/**
 * 'vi' command
 */
vi.metadata = {
    name: 'vi',
    description: 'Edit a file',
    params: [
        {
            name: 'file',
            type: 'existingFile',
            description: 'The file to edit'
        }
    ],
    returnType: 'html'
};
function vi(env, args) {
    return '' +
        '<textarea rows=3 cols=80 style="font-family:monospace">' +
        'One day it could be very useful to have an editor embedded in GCLI' +
        '</textarea>';
}


var canon = require('gcli/canon');

experimental.startup = function(data, reason) {
    types.registerType(commitObject);
    types.registerType(existingFile);
    canon.addCommands(git, 'git');
    canon.addCommand(vi);
};

experimental.shutdown = function(data, reason) {
    canon.removeCommands('git');
    types.unregisterType(commitObject);
    types.unregisterType(existingFile);
    canon.removeCommand(vi);
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/tests/index', ['require', 'exports', 'module' , 'test/index', 'gcli/tests/testTokenize', 'gcli/tests/testSplit', 'gcli/tests/testCli'], function(require, exports, module) {

    var test = require('test/index');

    exports.startup = function(options) {
        test.startup();

        test.addSuite('gcli/tests/testTokenize', require('gcli/tests/testTokenize'));
        test.addSuite('gcli/tests/testSplit', require('gcli/tests/testSplit'));
        test.addSuite('gcli/tests/testCli', require('gcli/tests/testCli'));

        test.run();
    };

    exports.shutdown = function() {
        test.shutdown();
    };

});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('test/index', ['require', 'exports', 'module' , 'gcli/util', 'gcli/index', 'gcli/ui/domtemplate', 'text!test/ui/test.css', 'text!test/ui/test.html'], function(require, exports, module) {
var test = exports;


var dom = require('gcli/util').dom;
var console = require('gcli/util').console;

var gcli = require('gcli/index');
var Templater = require("gcli/ui/domtemplate").Templater;

var testCss = require("text!test/ui/test.css");
var testHtml = require('text!test/ui/test.html');


/**
 * The 'test' command
 */
var testCommandSpec = {
    name: 'test',
    description: 'Runs the GCLI Unit Tests',
    params: [],
    exec: function() {
        var promise = gcli.createPromise();
        test.runAsync(function() {
            var newNode = template.cloneNode(true);
            new Templater().processNode(newNode, test.toRemote());
            promise.resolve(newNode);
        });
        return promise;
    }
};

var doc;
var template;

/**
 * This just registers a 'test' command'
 */
test.startup = function(options) {
    gcli.addCommand(testCommandSpec);

    doc = (options && options.document) ? options.document : document;
    dom.importCssString(testCss, doc);

    template = dom.createElement('div', null, doc);
    dom.setInnerHtml(template, testHtml);
};

test.shutdown = function() {
    gcli.removeCommand(testCommandSpec);
};


/**
 * Test harness data
 */
test.suites = {};

/**
 * The gap between tests when running async
 */
var delay = 10;

var currentTest = null;

var stati = {
    notrun: { index: 0, name: 'Skipped' },
    executing: { index: 1, name: 'Executing' },
    asynchronous: { index: 2, name: 'Waiting' },
    pass: { index: 3, name: 'Pass' },
    fail: { index: 4, name: 'Fail' }
};

/**
 * Add a test suite. Generally used like:
 * test.addSuite('foo', require('path/to/foo'));
 */
test.addSuite = function(name, suite) {
    test.suites[name] = new Suite(name, suite);
};

/**
 * Run all the tests synchronously
 */
test.run = function() {
    Object.keys(test.suites).forEach(function(suiteName) {
        var suite = test.suites[suiteName];
        suite.run();
    }.bind(this));
    return test.suites;
};

/**
 * Run all the tests asynchronously
 */
test.runAsync = function(callback) {
    this.runAsyncInternal(0, callback);
};

/**
 * Run all the test suits asynchronously
 */
test.runAsyncInternal = function(i, callback) {
    if (i >= Object.keys(test.suites).length) {
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }

    var suiteName = Object.keys(test.suites)[i];
    test.suites[suiteName].runAsync(function() {
        setTimeout(function() {
            test.runAsyncInternal(i + 1, callback);
        }.bind(this), delay);
    }.bind(this));
};

/**
 *
 */
test.reportToText = function() {
  return JSON.stringify(test.toRemote());
};

/**
 * Create a JSON object suitable for serialization
 */
test.toRemote = function() {
    return {
        suites: Object.keys(test.suites).map(function(suiteName) {
            return test.suites[suiteName].toRemote();
        }.bind(this))
    };
};

/**
 * Used by assert to record a failure against the current test
 */
test.recordError = function(message) {
    if (!currentTest) {
        console.error('No currentTest for ' + message);
        return;
    }

    currentTest.status = stati.fail;

    if (Array.isArray(message)) {
        currentTest.messages.push.apply(currentTest.messages, message);
    }
    else {
        currentTest.messages.push(message);
    }
};

/**
 * A suite is a group of tests
 */
function Suite(suiteName, suite) {
    this.name = suiteName;
    this.suite = suite;

    this.tests = {};
    Object.keys(suite).forEach(function(testName) {
        if (testName !== 'setup' && testName !== 'shutdown') {
            var test = new Test(this, testName, suite[testName]);
            this.tests[testName] = test;
        }
    }.bind(this));
}

/**
 * Run all the tests in this suite synchronously
 */
Suite.prototype.run = function() {
    if (typeof this.suite.setup == "function") {
        this.suite.setup();
    }

    Object.keys(this.tests).forEach(function(testName) {
        var test = this.tests[testName];
        test.run();
    }.bind(this));

    if (typeof this.suite.shutdown == "function") {
        this.suite.shutdown();
    }
};

/**
 * Run all the tests in this suite asynchronously
 */
Suite.prototype.runAsync = function(callback) {
    if (typeof this.suite.setup == "function") {
        this.suite.setup();
    }

    this.runAsyncInternal(0, function() {
        if (typeof this.suite.shutdown == "function") {
            this.suite.shutdown();
        }

        if (typeof callback === 'function') {
            callback();
        }
    }.bind(this));
};

/**
 * Function used by the async runners that can handle async recursion.
 */
Suite.prototype.runAsyncInternal = function(i, callback) {
    if (i >= Object.keys(this.tests).length) {
        if (typeof callback === 'function') {
            callback();
        }
        return;
    }

    var testName = Object.keys(this.tests)[i];
    this.tests[testName].runAsync(function() {
        setTimeout(function() {
            this.runAsyncInternal(i + 1, callback);
        }.bind(this), delay);
    }.bind(this));
};

/**
 * Create a JSON object suitable for serialization
 */
Suite.prototype.toRemote = function() {
    return {
        name: this.name,
        tests: Object.keys(this.tests).map(function(testName) {
            return this.tests[testName].toRemote();
        }.bind(this))
    };
};


/**
 * A test represents data about a single test function
 */
function Test(suite, name, func) {
    this.suite = suite;
    this.name = name;
    this.func = func;
    this.title = name.replace(/^test/, '').replace(/([A-Z])/g, ' $1');

    this.messages = [];
    this.status = stati.notrun;
}

/**
 * Run just a single test
 */
Test.prototype.run = function() {
    currentTest = this;
    this.status = stati.executing;
    this.messages = [];

    try {
        this.func.apply(this.suite);
    }
    catch (ex) {
        this.status = stati.fail;
        this.messages.push('' + ex);
        console.error(ex);
        console.trace();
    }

    if (this.status === stati.executing) {
        this.status = stati.pass;
    }

    currentTest = null;
};

/**
 * Run all the tests in this suite asynchronously
 */
Test.prototype.runAsync = function(callback) {
    setTimeout(function() {
        this.run();
        if (typeof callback === 'function') {
            callback();
        }
    }.bind(this), delay);
};

/**
 * Create a JSON object suitable for serialization
 */
Test.prototype.toRemote = function() {
    return {
        name: this.name,
        title: this.title,
        status: this.status,
        messages: this.messages
    };
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/tests/testTokenize', ['require', 'exports', 'module' , 'test/assert', 'gcli/cli'], function(require, exports, module) {

var t = require('test/assert');
var Requisition = require('gcli/cli').Requisition;

exports.testBlanks = function() {
    var args;
    var requ = new Requisition();

    args = requ._tokenize('');
    t.verifyEqual(1, args.length);
    t.verifyEqual('', args[0].text);
    t.verifyEqual('', args[0].prefix);
    t.verifyEqual('', args[0].suffix);

    args = requ._tokenize(' ');
    t.verifyEqual(1, args.length);
    t.verifyEqual('', args[0].text);
    t.verifyEqual(' ', args[0].prefix);
    t.verifyEqual('', args[0].suffix);
};

exports.testSimple = function() {
    var args;
    var requ = new Requisition();

    args = requ._tokenize('s');
    t.verifyEqual(1, args.length);
    t.verifyEqual('s', args[0].text);
    t.verifyEqual('', args[0].prefix);
    t.verifyEqual('', args[0].suffix);

    args = requ._tokenize('s s');
    t.verifyEqual(2, args.length);
    t.verifyEqual('s', args[0].text);
    t.verifyEqual('', args[0].prefix);
    t.verifyEqual('', args[0].suffix);
    t.verifyEqual('s', args[1].text);
    t.verifyEqual(' ', args[1].prefix);
    t.verifyEqual('', args[1].suffix);
};

exports.testComplex = function() {
    var args;
    var requ = new Requisition();

    args = requ._tokenize(' 1234  \'12 34\'');
    t.verifyEqual(2, args.length);
    t.verifyEqual('1234', args[0].text);
    t.verifyEqual(' ', args[0].prefix);
    t.verifyEqual('', args[0].suffix);
    t.verifyEqual('12 34', args[1].text);
    t.verifyEqual('  \'', args[1].prefix);
    t.verifyEqual('\'', args[1].suffix);

    args = requ._tokenize('12\'34 "12 34" \\'); // 12'34 "12 34" \
    t.verifyEqual(3, args.length);
    t.verifyEqual('12\'34', args[0].text);
    t.verifyEqual('', args[0].prefix);
    t.verifyEqual('', args[0].suffix);
    t.verifyEqual('12 34', args[1].text);
    t.verifyEqual(' "', args[1].prefix);
    t.verifyEqual('"', args[1].suffix);
    t.verifyEqual('\\', args[2].text);
    t.verifyEqual(' ', args[2].prefix);
    t.verifyEqual('', args[2].suffix);
};

exports.testPathological = function() {
    var args;
    var requ = new Requisition();

    args = requ._tokenize('a\\ b \\t\\n\\r \\\'x\\\" \'d'); // a_b \t\n\r \'x\" 'd
    t.verifyEqual(4, args.length);
    t.verifyEqual('a b', args[0].text);
    t.verifyEqual('', args[0].prefix);
    t.verifyEqual('', args[0].suffix);
    t.verifyEqual('\t\n\r', args[1].text);
    t.verifyEqual(' ', args[1].prefix);
    t.verifyEqual('', args[1].suffix);
    t.verifyEqual('\'x"', args[2].text);
    t.verifyEqual(' ', args[2].prefix);
    t.verifyEqual('', args[2].suffix);
    t.verifyEqual('d', args[3].text);
    t.verifyEqual(' \'', args[3].prefix);
    t.verifyEqual('', args[3].suffix);
};



});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('test/assert', ['require', 'exports', 'module' , 'test/index', 'gcli/util'], function(require, exports, module) {
var assert = exports;

var test = require('test/index');
var console = require('gcli/util').console;


assert.success = function(message) {
  console.log(message);
};

assert.fail = function(message) {
  assert._recordThrow("fail", arguments);
};

assert.assertTrue = function(value) {
  if (!value) {
    assert._recordThrow("assertTrue", arguments);
  }
};

assert.verifyTrue = function(value) {
  if (!value) {
    assert._recordTrace("verifyTrue", arguments);
  }
};

assert.assertFalse = function(value) {
  if (value) {
    assert._recordThrow("assertFalse", arguments);
  }
};

assert.verifyFalse = function(value) {
  if (value) {
    assert._recordTrace("verifyFalse", arguments);
  }
};

assert.assertNull = function(value) {
  if (value !== null) {
    assert._recordThrow("assertNull", arguments);
  }
};

assert.verifyNull = function(value) {
  if (value !== null) {
    assert._recordTrace("verifyNull", arguments);
  }
};

assert.assertNotNull = function(value) {
  if (value === null) {
    assert._recordThrow("assertNotNull", arguments);
  }
};

assert.verifyNotNull = function(value) {
  if (value === null) {
    assert._recordTrace("verifyNotNull", arguments);
  }
};

assert.assertUndefined = function(value) {
  if (value !== undefined) {
    assert._recordThrow("assertUndefined", arguments);
  }
};

assert.verifyUndefined = function(value) {
  if (value !== undefined) {
    assert._recordTrace("verifyUndefined", arguments);
  }
};

assert.assertNotUndefined = function(value) {
  if (value === undefined) {
    assert._recordThrow("assertNotUndefined", arguments);
  }
};

assert.verifyNotUndefined = function(value) {
  if (value === undefined) {
    assert._recordTrace("verifyNotUndefined", arguments);
  }
};

assert.assertNaN = function(value) {
  if (!isNaN(value)) {
    assert._recordThrow("assertNaN", arguments);
  }
};

assert.verifyNaN = function(value) {
  if (!isNaN(value)) {
    assert._recordTrace("verifyNaN", arguments);
  }
};

assert.assertNotNaN = function(value) {
  if (isNaN(value)) {
    assert._recordThrow("assertNotNaN", arguments);
  }
};

assert.verifyNotNaN = function(value) {
  if (isNaN(value)) {
    assert._recordTrace("verifyNotNaN", arguments);
  }
};

assert.assertEqual = function(expected, actual) {
  var args = Array.prototype.slice.call(arguments, 0);
  var eqData = assert._isEqual(expected, actual);
  if (!eqData.isEqual) {
    args.push.apply(args, eqData.messages);
    assert._recordThrow("assertEqual", args);
  }
};

assert.verifyEqual = function(expected, actual) {
  var args = Array.prototype.slice.call(arguments, 0);
  var eqData = assert._isEqual(expected, actual);
  if (!eqData.isEqual) {
    args.push.apply(args, eqData.messages);
    assert._recordTrace("verifyEqual", args);
  }
};

assert.assertNotEqual = function(expected, actual) {
  var args = Array.prototype.slice.call(arguments, 0);
  var eqData = assert._isEqual(expected, actual);
  if (eqData.isEqual) {
    args.push.apply(args, eqData.messages);
    assert._recordThrow("assertNotEqual", args);
  }
};

assert.verifyNotEqual = function(expected, actual) {
  var args = Array.prototype.slice.call(arguments, 0);
  var eqData = assert._isEqual(expected, actual);
  if (eqData.isEqual) {
    args.push.apply(args, eqData.messages);
    assert._recordTrace("verifyNotEqual", args);
  }
};

assert.assertSame = function(expected, actual) {
  if (expected !== actual) {
    assert._recordThrow("assertSame", arguments);
  }
};

assert.verifySame = function(expected, actual) {
  if (expected !== actual) {
    assert._recordTrace("verifySame", arguments);
  }
};

assert.assertNotSame = function(expected, actual) {
  if (expected !== actual) {
    assert._recordThrow("assertNotSame", arguments);
  }
};

assert.verifyNotSame = function(expected, actual) {
  if (expected !== actual) {
    assert._recordTrace("verifyNotSame", arguments);
  }
};

assert._recordTrace = function() {
  assert._record.apply(this, arguments);
  console.trace();
};

assert._recordThrow = function() {
  assert._record.apply(this, arguments);
  throw new Error();
};

assert._record = function() {
  console.error(arguments);
  var message = arguments[0] + "(";
  var data = arguments[1];
  if (typeof data == "string") {
    message += data;
  }
  else {
    for (var i = 0; i < data.length; i++) {
      if (i != 0){message += ", ";}
      message += data[i];
    }
  }
  message += ")";

  test.recordError(message);
};

assert._isEqual = function(expected, actual, depth) {
  var reply = { isEqual: true, messages: [] };
  if (expected === actual) {
    return reply;
  }

  if (!depth) {
    depth = 0;
  }
  // Rather than failing we assume that it works!
  if (depth > 10) {
    return reply;
  }

  if (expected == null) {
    if (actual != null) {
      reply.messages.push("expected: null, actual non-null: " + actual);
      reply.isEqual = false;
      return reply;
    }
    return reply;
  }

  if (typeof(expected) == "number" && isNaN(expected)) {
    if (!(typeof(actual) == "number" && isNaN(actual))) {
      reply.messages.push("expected: NaN, actual non-NaN: " + actual);
      reply.isEqual = false;
      return reply;
    }
    return true;
  }

  if (actual == null) {
    if (expected != null) {
      reply.messages.push("actual: null, expected non-null: " + actual);
      reply.isEqual = false;
      return reply;
    }
    return reply; // we wont get here of course ...
  }

  if (typeof expected == "object") {
    if (!(typeof actual == "object")) {
      reply.messages.push("expected object, actual not an object" + actual);
      reply.isEqual = false;
      return reply;
    }

    var actualLength = 0;
    for (var prop in actual) {
      if (typeof actual[prop] != "function" ||
          typeof expected[prop] != "function") {
        var nest = assert._isEqual(actual[prop], expected[prop], depth + 1);
        if (!nest.isEqual) {
          reply.messages.push("element '" + prop + "' does not match:");
          nest.messages.forEach(function(message) {
            reply.messages.push("  " + message);
          });
          reply.isEqual = false;
          return reply;
        }
      }
      actualLength++;
    }

    // need to check length too
    var expectedLength = 0;
    for (prop in expected) expectedLength++;
    if (actualLength != expectedLength) {
      reply.messages.push("expected object size = " + expectedLength +
          ", actual object size = " + actualLength);
      reply.isEqual = false;
      return reply;
    }
    return reply;
  }

  if (actual != expected) {
    reply.messages.push("expected = " + expected + " (type=" + typeof expected + "), " +
        "actual = " + actual + " (type=" + typeof actual + ")");
    reply.isEqual = false;
    return reply;
  }

  if (expected instanceof Array) {
    if (!(actual instanceof Array)) {
      reply.messages.push("expected array, actual not an array");
      reply.isEqual = false;
      return reply;
    }
    if (actual.length != expected.length) {
      reply.messages.push("expected array length = " + expected.length +
          ", actual array length = " + actual.length);
      reply.isEqual = false;
      return reply;
    }
    for (var i = 0; i < actual.length; i++) {
      var nest = assert._isEqual(actual[i], expected[i], depth + 1);
      if (!nest.isEqual) {
        reply.messages.push("element " + i + " does not match: " + nest);
        nest.messages.forEach(function(message) {
          reply.messages.push("  " + message);
        });
        reply.isEqual = false;
        return reply;
      }
    }

    return reply;
  }

  return reply;
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/tests/testSplit', ['require', 'exports', 'module' , 'test/assert', 'gcli/tests/commands', 'gcli/cli'], function(require, exports, module) {

var t = require('test/assert');

var commands = require('gcli/tests/commands');
var Requisition = require('gcli/cli').Requisition;

exports.setup = function() {
    commands.setup();
};

exports.shutdown = function() {
    commands.shutdown();
};

exports.testSimple = function() {
    var args;
    var requ = new Requisition();

    args = requ._tokenize('s');
    requ._split(args);
    t.verifyEqual(0, args.length);
    t.verifyEqual('s', requ.commandAssignment.getArg().text);
};

exports.testFlatCommand = function() {
    var args;
    var requ = new Requisition();

    args = requ._tokenize('tsv');
    requ._split(args);
    t.verifyEqual([], args);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);

    args = requ._tokenize('tsv a b');
    requ._split(args);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual(2, args.length);
    t.verifyEqual('a', args[0].text);
    t.verifyEqual('b', args[1].text);
};

// TODO: add tests for sub commands

});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/tests/commands', ['require', 'exports', 'module' , 'gcli/canon', 'gcli/types'], function(require, exports, module) {
var commands = exports;


var canon = require('gcli/canon');

var SelectionType = require('gcli/types').SelectionType;
var DeferredType = require('gcli/types').DeferredType;
var types = require('gcli/types');


commands.option1 = { };
commands.option2 = { };

commands.optionType = new SelectionType({
    name: 'optionType',
    lookup: { 'option1': commands.option1, 'option2': commands.option2 },
    noMatch: function() {
        this.lastOption = null;
    },
    stringify: function(option) {
        this.lastOption = option;
        return SelectionType.prototype.stringify.call(this, option);
    },
    parse: function(arg) {
        var conversion = SelectionType.prototype.parse.call(this, arg);
        this.lastOption = conversion.value;
        return conversion;
    }
});

commands.optionValue = new DeferredType({
    name: 'optionValue',
    defer: function() {
        if (commands.optionType.lastOption) {
            return commands.optionType.lastOption.type;
        }
        else {
            return types.getType('blank');
        }
    }
});

commands.tsv = {
    name: 'tsv',
    params: [
        { name: 'optionType', type: 'optionType' },
        { name: 'optionValue', type: 'optionValue' }
    ],
    exec: function(env, args) { }
};

commands.tsr = function() { };
commands.tsr.metadata = {
    name: 'tsr',
    params: [ { name: 'text', type: 'string' } ]
};

commands.tsu = function() { };
commands.tsu.metadata = {
    name: 'tsu',
    params: [ { name: 'num', type: 'number' } ]
};

commands.tsn = {
    metadata: { },

    difMetadata: { params: [ { name: 'text', type: 'string' } ] },
    dif: function(text) { },

    extMetadata: { params: [ { name: 'text', type: 'string' } ] },
    ext: function(text) { },

    exteMetadata: { params: [ { name: 'text', type: 'string' } ] },
    exte: function(text) { },

    extenMetadata: { params: [ { name: 'text', type: 'string' } ] },
    exten: function(text) { },

    extendMetadata: { params: [ { name: 'text', type: 'string' } ] },
    extend: function(text) { }
};

commands.tselarr = {
    name: 'tselarr',
    params: [
        { name: 'num', type: { name: 'selection', data: [ '1', '2', '3' ] } },
        { name: 'arr', type: { name: 'array', subtype: 'string' } },
    ],
    exec: function(env, args) {}
};

commands.tsm = {
    name: 'tsm',
    hidden: true,
    description: 'a 3-param test selection|string|number',
    params: [
        { name: 'abc', type: { name: 'selection', data: [ 'a', 'b', 'c' ] } },
        { name: 'txt', type: 'string' },
        { name: 'num', type: { name: 'number', max: 42, min: 0 } },
    ],
    exec: function(env, args) {}
};

commands.setup = function() {
    commands.option1.type = types.getType('number');
    commands.option2.type = types.getType('boolean');

    types.registerType(commands.optionType);
    types.registerType(commands.optionValue);

    canon.addCommand(commands.tsv);
    canon.addCommand(commands.tsr);
    canon.addCommand(commands.tsu);
    canon.addCommands(commands.tsn, 'tsn');
    canon.addCommand(commands.tselarr);
    canon.addCommand(commands.tsm);
};

commands.shutdown = function() {
    canon.removeCommand(commands.tsv);
    canon.removeCommand(commands.tsr);
    canon.removeCommand(commands.tsu);
    canon.removeCommands(commands.tsn, 'tsn');
    canon.removeCommand(commands.tselarr);
    canon.removeCommand(commands.tsm);

    types.deregisterType(commands.optionType);
    types.deregisterType(commands.optionValue);
};


});
/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *      Joe Walker (jwalker@mozilla.com) (original author)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

define('gcli/tests/testCli', ['require', 'exports', 'module' , 'gcli/cli', 'gcli/types', 'gcli/tests/commands', 'test/assert'], function(require, exports, module) {


var Requisition = require('gcli/cli').Requisition;
var Status = require('gcli/types').Status;
var commands = require('gcli/tests/commands');

var t = require('test/assert');

exports.setup = function() {
    commands.setup();
};

exports.shutdown = function() {
    commands.shutdown();
};


var assign1;
var assign2;
var assignC;
var requ;
var debug = false;
var status;
var prev;
var statuses;
var predictions;

function update(input) {
    if (!requ) {
      requ = new Requisition();
    }
    requ.update(input);

    if (debug) {
        console.log('####### TEST: typed="' + input.typed +
                '" cur=' + input.cursor.start +
                ' cli=', requ);
    }

    status = requ.getStatus();
    assignC = requ.getAssignmentAt(input.cursor.start);
    statuses = requ.getInputStatusMarkup().map(function(status) {
        return status.toString()[0];
    }).join('');

    if (requ.commandAssignment.getValue()) {
        assign1 = requ.getAssignment(0);
        assign2 = requ.getAssignment(1);
    }
    else {
        assign1 = undefined;
        assign2 = undefined;
    }
}

function verifyPredictionsContains(name, predictions) {
    return predictions.every(function(prediction) {
        return name === prediction || name === prediction.name;
    }, this);
}


exports.testBlank = function() {
    update({ typed: '', cursor: { start: 0, end: 0 } });
    t.verifyEqual(  '', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual(null, requ.commandAssignment.getValue());

    update({ typed: ' ', cursor: { start: 1, end: 1 } });
    t.verifyEqual(  'V', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual(null, requ.commandAssignment.getValue());

    update({ typed: ' ', cursor: { start: 0, end: 0 } });
    t.verifyEqual(  'V', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual(null, requ.commandAssignment.getValue());
};

exports.testIncompleteMultiMatch = function() {
    update({ typed: 't', cursor: { start: 1, end: 1 } });
    t.verifyEqual(  'I', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyTrue(assignC.getPredictions().length > 0);
    t.verifyTrue(assignC.getPredictions().length < 20); // could break ...
    verifyPredictionsContains('tsv', assignC.getPredictions());
    verifyPredictionsContains('tsr', assignC.getPredictions());
    t.verifyNull(requ.commandAssignment.getValue());
};

exports.testIncompleteSingleMatch = function() {
    update({ typed: 'tselar', cursor: { start: 6, end: 6 } });
    t.verifyEqual(  'IIIIII', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual(1, assignC.getPredictions().length);
    t.verifyEqual('tselarr', assignC.getPredictions()[0].name);
    t.verifyNull(requ.commandAssignment.getValue());
};

exports.testTsv = function() {
    update({ typed: 'tsv', cursor: { start: 3, end: 3 } });
    t.verifyEqual(  'VVV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);

    update({ typed: 'tsv ', cursor: { start: 4, end: 4 } });
    t.verifyEqual(  'VVVV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual(0, assignC.paramIndex);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);

    update({ typed: 'tsv ', cursor: { start: 2, end: 2 } });
    t.verifyEqual(  'VVVV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);

    update({ typed: 'tsv o', cursor: { start: 5, end: 5 } });
    t.verifyEqual(  'VVVVI', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(0, assignC.paramIndex);
    t.verifyEqual(2, assignC.getPredictions().length);
    t.verifyTrue(commands.option1, assignC.getPredictions()[0]);
    t.verifyTrue(commands.option2, assignC.getPredictions()[1]);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('o', assign1.getArg().text);
    t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsv option', cursor: { start: 10, end: 10 } });
    t.verifyEqual(  'VVVVIIIIII', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual(0, assignC.paramIndex);
    t.verifyEqual(2, assignC.getPredictions().length);
    t.verifyTrue(commands.option1, assignC.getPredictions()[0]);
    t.verifyTrue(commands.option2, assignC.getPredictions()[1]);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option', assign1.getArg().text);
    t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsv option', cursor: { start: 1, end: 1 } });
    t.verifyEqual(  'VVVVEEEEEE', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual(-1, assignC.paramIndex);
    t.verifyEqual(Status.ERROR, status);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option', assign1.getArg().text);
    t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsv option ', cursor: { start: 11, end: 11 } });
    t.verifyEqual(  'VVVVEEEEEEV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual(Status.ERROR, status); // !!!!!!!!!
    t.verifyEqual(1, assignC.paramIndex);
    t.verifyEqual(0, assignC.getPredictions().length);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option', assign1.getArg().text);
    t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsv option1', cursor: { start: 11, end: 11 } });
    t.verifyEqual(  'VVVVVVVVVVV', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option1', assign1.getArg().text);
    t.verifyEqual(commands.option1, assign1.getValue());
    t.verifyEqual(0, assignC.paramIndex);

    update({ typed: 'tsv option1 ', cursor: { start: 12, end: 12 } });
    t.verifyEqual(  'VVVVVVVVVVVV', statuses);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option1', assign1.getArg().text);
    t.verifyEqual(commands.option1, assign1.getValue());
    t.verifyEqual(1, assignC.paramIndex);

    update({ typed: 'tsv option1 6', cursor: { start: 13, end: 13 } });
    t.verifyEqual(  'VVVVVVVVVVVVV', statuses);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option1', assign1.getArg().text);
    t.verifyEqual(commands.option1, assign1.getValue());
    t.verifyEqual('6', assign2.getArg().text);
    t.verifyEqual(6, assign2.getValue());
    t.verifyEqual('number', typeof assign2.getValue());
    t.verifyEqual(1, assignC.paramIndex);

    update({ typed: 'tsv option2 6', cursor: { start: 13, end: 13 } });
    t.verifyEqual(  'VVVVVVVVVVVVE', statuses);
    t.verifyEqual('tsv', requ.commandAssignment.getValue().name);
    t.verifyEqual('option2', assign1.getArg().text);
    t.verifyEqual(commands.option2, assign1.getValue());
    t.verifyEqual('6', assign2.getArg().text);
    t.verifyEqual(undefined, assign2.getValue());
    t.verifyEqual(1, assignC.paramIndex);
};

exports.testInvalid = function() {
    update({ typed: 'fred', cursor: { start: 4, end: 4 } });
    t.verifyEqual(  'EEEE', statuses);
    t.verifyEqual('fred', requ.commandAssignment.getArg().text);
    t.verifyEqual('', requ._unassigned.getArg().text);
    t.verifyEqual(-1, assignC.paramIndex);

    update({ typed: 'fred ', cursor: { start: 5, end: 5 } });
    t.verifyEqual(  'EEEEV', statuses);
    t.verifyEqual('fred', requ.commandAssignment.getArg().text);
    t.verifyEqual('', requ._unassigned.getArg().text);
    t.verifyEqual(-1, assignC.paramIndex);

    update({ typed: 'fred one', cursor: { start: 8, end: 8 } });
    t.verifyEqual(  'EEEEVEEE', statuses);
    t.verifyEqual('fred', requ.commandAssignment.getArg().text);
    t.verifyEqual('one', requ._unassigned.getArg().text);
};

exports.testSingleString = function() {
    update({ typed: 'tsr', cursor: { start: 3, end: 3 } });
    t.verifyEqual(  'VVV', statuses);
    t.verifyEqual('tsr', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    //t.verifyEqual(undefined, assign1.getValue());
    t.verifyEqual(undefined, assign2);

    update({ typed: 'tsr ', cursor: { start: 4, end: 4 } });
    t.verifyEqual(  'VVVV', statuses);
    t.verifyEqual('tsr', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    //t.verifyEqual(undefined, assign1.getValue());
    t.verifyEqual(undefined, assign2);

    update({ typed: 'tsr h', cursor: { start: 5, end: 5 } });
    t.verifyEqual(  'VVVVV', statuses);
    t.verifyEqual('tsr', requ.commandAssignment.getValue().name);
    t.verifyEqual('h', assign1.getArg().text);
    t.verifyEqual('h', assign1.getValue());

    update({ typed: 'tsr "h h"', cursor: { start: 9, end: 9 } });
    t.verifyEqual(  'VVVVVVVVV', statuses);
    t.verifyEqual('tsr', requ.commandAssignment.getValue().name);
    t.verifyEqual('h h', assign1.getArg().text);
    t.verifyEqual('h h', assign1.getValue());

    update({ typed: 'tsr h h h', cursor: { start: 9, end: 9 } });
    t.verifyEqual(  'VVVVVVVVV', statuses);
    t.verifyEqual('tsr', requ.commandAssignment.getValue().name);
    t.verifyEqual('h h h', assign1.getArg().text);
    t.verifyEqual('h h h', assign1.getValue());
};

// TODO: Add test to see that a command without mandatory param causes ERROR

exports.testSingleNumber = function() {
    update({ typed: 'tsu', cursor: { start: 3, end: 3 } });
    t.verifyEqual(  'VVV', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsu', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsu ', cursor: { start: 4, end: 4 } });
    t.verifyEqual(  'VVVV', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsu', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsu 1', cursor: { start: 5, end: 5 } });
    t.verifyEqual(  'VVVVV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual('tsu', requ.commandAssignment.getValue().name);
    t.verifyEqual('1', assign1.getArg().text);
    t.verifyEqual(1, assign1.getValue());
    t.verifyEqual('number', typeof assign1.getValue());

    update({ typed: 'tsu x', cursor: { start: 5, end: 5 } });
    t.verifyEqual(  'VVVVE', statuses);
    t.verifyEqual(Status.ERROR, status);
    t.verifyEqual('tsu', requ.commandAssignment.getValue().name);
    t.verifyEqual('x', assign1.getArg().text);
    t.verifyNaN(assign1.getValue());
};

exports.testNestedCommand = function() {
    update({ typed: 'tsn', cursor: { start: 3, end: 3 } });
    t.verifyEqual(  'III', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsn', requ.commandAssignment.getValue().name);
    t.verifyEqual(undefined, assign1);

    update({ typed: 'tsn ', cursor: { start: 4, end: 4 } });
    t.verifyEqual(  'IIIV', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsn', requ.commandAssignment.getValue().name);
    t.verifyEqual(undefined, assign1);

    update({ typed: 'tsn x', cursor: { start: 5, end: 5 } });
    t.verifyEqual(  'EEEVE', statuses);
    t.verifyEqual(Status.ERROR, status);
    t.verifyEqual('tsn x', requ.commandAssignment.getArg().text);
    t.verifyEqual(undefined, assign1);

    update({ typed: 'tsn dif', cursor: { start: 7, end: 7 } });
    t.verifyEqual(  'VVVVVVV', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsn dif', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    //t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsn dif ', cursor: { start: 8, end: 8 } });
    t.verifyEqual(  'VVVVVVVV', statuses);
    t.verifyEqual(Status.INCOMPLETE, status);
    t.verifyEqual('tsn dif', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    //t.verifyEqual(undefined, assign1.getValue());

    update({ typed: 'tsn dif x', cursor: { start: 9, end: 9 } });
    t.verifyEqual(  'VVVVVVVVV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual('tsn dif', requ.commandAssignment.getValue().name);
    t.verifyEqual('x', assign1.getArg().text);
    t.verifyEqual('x', assign1.getValue());

    update({ typed: 'tsn ext', cursor: { start: 7, end: 7 } });
    t.verifyEqual(  'VVVVVVV', statuses);
    t.verifyEqual(Status.VALID, status);
    t.verifyEqual('tsn ext', requ.commandAssignment.getValue().name);
    //t.verifyEqual(undefined, assign1.getArg());
    //t.verifyEqual(undefined, assign1.getValue());
};


});
define("text!gcli/ui/arg_fetch.css", [], "" +
  ".gcliCmdDesc {" +
  "  font-weight: bold; text-align: center;" +
  "  margin-bottom: 5px; border-bottom: 1px solid #ddd; padding-bottom: 3px;" +
  "}" +
  "" +
  ".gcliParamGroup { font-weight: bold; }" +
  ".gcliParamName { text-align: right; font-size: 90%; }" +
  ".gcliParamError { font-size: 80%; color: #900; }" +
  ".gcliParamSubmit { text-align: right; }" +
  "" +
  ".gcliGroupSymbol { font-size: 90%; color: #666; }" +
  ".gcliRequired { font-size: 80%; color: #666; }" +
  "");

define("text!gcli/ui/arg_fetch.html", [], "" +
  "<!--" +
  "Template for an Assignment." +
  "Evaluated each time the commandAssignment changes" +
  "-->" +
  "<div id=\"gcliReqTempl\">" +
  "  <div>" +
  "    <div class=\"gcliCmdDesc\">" +
  "      ${requ.commandAssignment.getValue().getDescription()}" +
  "    </div>" +
  "    <table class=\"gcliParams\">" +
  "      <tbody class=\"gcliAssignment\"" +
  "          foreach=\"assignment in ${requ.getAssignments()}\">" +
  "        <!-- Parameter -->" +
  "        <tr class=\"gcliGroupRow\">" +
  "          <td class=\"gcliParamName\">" +
  "            <label>${assignment.param.description}:</label>" +
  "            <div class=\"gcliRequired\" if=\"${assignment.param.defaultValue !== undefined}\">(Optional)</div>" +
  "          </td>" +
  "          <td class=\"gcliParamInput\">${getInputFor(assignment)}</td>" +
  "        </tr>" +
  "        <tr class=\"gcliGroupRow\">" +
  "          <td class=\"gcliParamError\" colspan=\"2\">" +
  "            ${linkMessageElement(assignment, __element)}" +
  "          </td>" +
  "        </tr>" +
  "      </tbody>" +
  "      <tfoot>" +
  "        <tr>" +
  "          <td colspan=\"3\" class=\"gcliParamSubmit\">" +
  "            <input type=\"submit\" value=\"Cancel\" onclick=\"${onFormCancel}\"/>" +
  "            <input type=\"submit\" value=\"OK\" onclick=\"${onFormOk}\"/>" +
  "          </td>" +
  "        </tr>" +
  "      </tfoot>" +
  "    </table>" +
  "  </div>" +
  "</div>" +
  "");

define("text!gcli/ui/hinter.css", [], "" +
  ".gcliHintParent {" +
  "  color: #000;" +
  "  background: rgba(250, 250, 250, 0.8);" +
  "  border: 1px solid #AAA;" +
  "  border-top-right-radius: 5px;" +
  "  border-top-left-radius: 5px;" +
  "  margin-left: 10px;" +
  "  margin-right: 10px;" +
  "  display: inline-block;" +
  "  overflow: hidden;" +
  "}" +
  "" +
  ".gcliHints {" +
  "  overflow: auto;" +
  "  padding: 10px;" +
  "  display: inline-block;" +
  "}" +
  "" +
  ".gcliHints ul { margin: 0; padding: 0 15px; }" +
  "");

define("text!gcli/ui/inputter.css", [], "" +
  ".gcliCompletion { padding: 0; position: absolute; z-index: -1000; }" +
  ".gcliCompletion.VALID { background-color: #FFF; }" +
  ".gcliCompletion.INCOMPLETE { background-color: #DDD; }" +
  ".gcliCompletion.ERROR { background-color: #DDD; }" +
  ".gcliCompletion span { color: #FFF; }" +
  ".gcliCompletion span.INCOMPLETE { color: #DDD; border-bottom: 2px dotted #999; }" +
  ".gcliCompletion span.ERROR { color: #DDD; border-bottom: 2px dotted #F00; }" +
  "span.gcliPrompt { color: #66F; font-weight: bold; }" +
  "span.gcliCompl { color: #999; }" +
  "");

define("text!gcli/ui/menu.css", [], "" +
  "/* The items in a menu. Used primarily for the command menu */" +
  ".gcliOption { overflow: hidden; white-space: nowrap; cursor: pointer; }" +
  ".gcliOption:hover { background-color: rgb(230, 230, 230) }" +
  ".gcliOptName { padding-right: 5px; }" +
  ".gcliOptDesc { font-size: 80%; color: #999; }" +
  "");

define("text!gcli/ui/menu.html", [], "" +
  "<!--" +
  "Template for the beginnings of a command menu." +
  "This will work with things other than a command - many things are a set of" +
  "things with a name and description." +
  "In the command context it is evaluated once for every keypress in the cli" +
  "when a command has not been entered." +
  "-->" +
  "<div id=\"gcliOptTempl\">" +
  "  <div class=\"gcliOption\" foreach=\"item in ${items}\" onclick=\"${item.click}\"" +
  "      title=\"${item.title}\">" +
  "    <span class=\"gcliOptName\">${item.name}</span>" +
  "    <span class=\"gcliOptDesc\">${item.description}</span>" +
  "  </div>" +
  "</div>" +
  " ");

define("text!gcli/ui/request_view.css", [], "" +
  ".gcliReports { overflow: auto; top: 0; }" +
  "" +
  ".gcliRowIn {" +
  "  margin-top: 5px; margin-right: 5px;" +
  "  color: #333;" +
  "  background-color: #EEE;" +
  "  padding: 3px 8px 1px 1px;" +
  "  border: 1px solid #aaa;" +
  "  border-radius: 4px; -moz-border-radius: 4px; -webkit-border-radius: 4px;" +
  "}" +
  ".gcliRowIn > img { cursor: pointer; }" +
  ".gcliHover { display: none; float: right; padding: 2px 2px 0 2px; }" +
  ".gcliRowIn:hover > .gcliHover { display: inline; }" +
  ".gcliRowIn:hover > .gcliHover.gcliHidden { display: none; }" +
  ".gcliOutTyped {" +
  "  color: #000; font-family: consolas, courier, monospace;" +
  "}" +
  ".gcliRowOutput { padding-left: 10px; line-height: 1.2em; font-size: 95%; }" +
  ".gcliRowOutput strong," +
  ".gcliRowOutput b," +
  ".gcliRowOutput th," +
  ".gcliRowOutput h1," +
  ".gcliRowOutput h2," +
  ".gcliRowOutput h3 { color: #000; }" +
  ".gcliRowOutput a { font-weight: bold; color: #666; text-decoration: none; }" +
  ".gcliRowOutput a: hover { text-decoration: underline; cursor: pointer; }" +
  ".gcliRowOutput input[type=password]," +
  ".gcliRowOutput input[type=text]," +
  ".gcliRowOutput textarea {" +
  "  color: #000; font-size: 120%;" +
  "  background: transparent; padding: 3px;" +
  "  border-radius: 5px; -moz-border-radius: 5px; -webkit-border-radius: 5px;" +
  "}" +
  ".gcliRowOutput table," +
  ".gcliRowOutput td," +
  ".gcliRowOutput th { border: 0; padding: 0 2px; }" +
  ".gcliRowOutput .right { text-align: right; }" +
  "" +
  ".gcliGt {" +
  "  font-family: consolas, courier, monospace;" +
  "  color: #66F; font-weight: bold; font-size: 120%;" +
  "  padding-left: 2px;" +
  "}" +
  ".gcliDuration { font-size: 80%; }" +
  "");

define("text!gcli/ui/request_view.html", [], "" +
  "<div class=\"gcliRow\">" +
  "  <!-- The div for the input (i.e. what was typed) -->" +
  "  <div class=\"gcliRowIn\" save=\"${rowin}\"" +
  "      onclick=\"${copyToInput}\" ondblclick=\"${execute}\">" +
  "" +
  "    <!-- What the user actually typed -->" +
  "    <span class=\"gcliGt\">&gt;</span>" +
  "    <span class=\"gcliOutTyped\">${request.typed}</span>" +
  "" +
  "    <!-- The extra details that appear on hover -->" +
  "    <span class=\"gcliDuration gcliHover\" save=\"${duration}\"></span>" +
  "    <!--" +
  "    <img class=\"gcliHover\" onclick=\"${hideOutput}\" save=\"${hide}\"" +
  "        alt=\"Hide command output\" _src=\"${imageUrl('images/minus.png')}\"/>" +
  "    <img class=\"gcliHover gcliHidden\" onclick=\"${showOutput}\" save=\"${show}\"" +
  "        alt=\"Show command output\" _src=\"${imageUrl('images/plus.png')}\"/>" +
  "    <img class=\"gcliHover\" onclick=\"${remove}\"" +
  "        alt=\"Remove this command from the history\"" +
  "        _src=\"${imageUrl('images/closer.png')}\"/>" +
  "    -->" +
  "  </div>" +
  "" +
  "  <!-- The div for the command output -->" +
  "  <div class=\"gcliRowOut\" save=\"${rowout}\">" +
  "    <div class=\"gcliRowOutput\" save=\"${output}\"></div>" +
  "    <img _src=\"${imageUrl('images/throbber.gif')}\" save=\"${throb}\"/>" +
  "  </div>" +
  "</div>" +
  "");

define("text!test/ui/test.css", [], "" +
  ".gcliTestSkipped { background-color: #EEE; color: #000; }" +
  ".gcliTestExecuting { background-color: #888; color: #FFF; }" +
  ".gcliTestWaiting { background-color: #FFA; color: #000; }" +
  ".gcliTestPass { background-color: #8F8; color: #000; }" +
  ".gcliTestFail { background-color: #F00; color: #FFF; }" +
  "" +
  ".gcliTestSuite { font-family: monospace; font-size: 80%; text-align: right; }" +
  ".gcliTestTitle { font-weight: bold; }" +
  "");

define("text!test/ui/test.html", [], "" +
  "<table>" +
  "  <thead>" +
  "    <tr>" +
  "      <th>Suite</th>" +
  "      <th>Test</th>" +
  "      <th>Results</th>" +
  "      <th>Notes</th>" +
  "    </tr>" +
  "  </thead>" +
  "  <tbody foreach=\"suite in ${suites}\">" +
  "    <tr foreach=\"test in ${suite.tests}\" title=\"${suite.name}.${test.name}()\">" +
  "      <td class=\"gcliTestSuite\">${suite.name}</td>" +
  "      <td class=\"gcliTestTitle\">${test.title}</td>" +
  "      <td class=\"gcliTest${test.status.name}\">${test.status.name}</td>" +
  "      <td>${test.message || '-'}</td>" +
  "    </tr>" +
  "  </tbody>" +
  "</table>" +
  "" +
  "<div id=\"output\"> </div>" +
  "");

define("text!gcli/ui/images/closer.png", [], "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAj9JREFUeNp0ks+LUlEUx7/vV1o8Z8wUx3IEHcQmiBiQlomjRNCiZpEuEqF/oEUwq/6EhvoHggmRcJUQBM1CRJAW0aLIaGQimZJxJsWxyV/P9/R1zzWlFl04vPvOPZ9z7rnnK5imidmKRCIq+zxgdoPZ1T/ut8xeM3tcKpW6s1hhBkaj0Qj7bDebTX+324WmadxvsVigqipcLleN/d4rFoulORiLxTZY8ItOp8MBCpYkiYPj8Xjus9vtlORWoVB4KcTjcQc732dLpSRXvCZaAws6Q4WDdqsO52kNH+oCRFGEz+f7ydwBKRgMPmTXi49GI1x2D/DsznesB06ws2eDbI7w9HYN6bVjvGss4KAjwDAMq81mM2SW5Wa/3weBbz42UL9uYnVpiO2Nr9ANHSGXib2Wgm9tCYIggGKJEVkvlwgi5/FQRmTLxO6hgJVzI1x0T/fJrBtHJxPeL6tI/fsZLA6ot8lkQi8HRVbw94gkWYI5MaHrOjcCGSNRxZosy9y5cErDzn0Dqx7gcwO8WtBp4PndI35GMYqiUMUvBL5yOBz8yRfFNpbPmqgcCFh/IuHa1nR/YXGM8+oUpFhihEQiwcdRLpfVRqOBtWXWq34Gra6AXq8Hp2piZcmKT4cKnE4nwuHwdByVSmWQz+d32WCTlHG/qaHHREN9kgi0sYQfv0R4PB4EAgESQDKXy72fSy6VSnHJVatVf71eR7vd5n66mtfrRSgU4pLLZrOlf7RKK51Ok8g3/yPyR5lMZi7y3wIMAME4EigHWgKnAAAAAElFTkSuQmCC");

define("text!gcli/ui/images/dot_clear.gif", [], "data:image/gif;base64,R0lGODlhAQABAID/AMDAwAAAACH5BAEAAAAALAAAAAABAAEAAAEBMgA7");

define("text!gcli/ui/images/minus.png", [], "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAAZiS0dEANIA0gDS7KbF4AAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kFGw4xMrIJw5EAAAHcSURBVCjPhZIxSxtxGMZ/976XhJA/RA5EAyJcFksnp64hjUPBoXRyCYLQTyD0UxScu0nFwalCQSgFCVk7dXAwUAiBDA2RO4W7yN1x9+9gcyhU+pteHt4H3pfncay1LOl0OgY4BN4Ar/7KP4BvwNFwOIyWu87S2O12O8DxfD73oygiSRIAarUaxhhWV1fHwMFgMBiWxl6v9y6Koi+3t7ckSUKtVkNVAcjzvNRWVlYwxry9vLz86uzs7HjAZDKZGGstjUaDfxHHMSLC5ubmHdB2VfVwNpuZ5clxHPMcRVFwc3PTXFtbO3RFZHexWJCmabnweAaoVqvlv4vFAhHZdVX1ZZqmOI5DURR8fz/lxbp9Yrz+7bD72SfPcwBU1XdF5N5aWy2KgqIoeBzPEnWVLMseYnAcRERdVR27rrsdxzGqyutP6898+GBsNBqo6i9XVS88z9sOggAR4X94noeqXoiIHPm+H9XrdYIgIAxDwjAkTVPCMESzBy3LMprNJr7v34nIkV5dXd2fn59fG2P2siwjSRIqlQrWWlSVJFcqlQqtVot2u40xZu/s7OxnWbl+v98BjkejkT+dTgmCoDxtY2ODra2tMXBweno6fNJVgP39fQN8eKbkH09OTsqS/wHFRdHPfTSfjwAAAABJRU5ErkJggg==");

define("text!gcli/ui/images/pinaction.png", [], "data:image/png;base64,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");

define("text!gcli/ui/images/pinin.png", [], "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAC7mlDQ1BJQ0MgUHJvZmlsZQAAeAGFVM9rE0EU/jZuqdAiCFprDrJ4kCJJWatoRdQ2/RFiawzbH7ZFkGQzSdZuNuvuJrWliOTi0SreRe2hB/+AHnrwZC9KhVpFKN6rKGKhFy3xzW5MtqXqwM5+8943731vdt8ADXLSNPWABOQNx1KiEWlsfEJq/IgAjqIJQTQlVdvsTiQGQYNz+Xvn2HoPgVtWw3v7d7J3rZrStpoHhP1A4Eea2Sqw7xdxClkSAog836Epx3QI3+PY8uyPOU55eMG1Dys9xFkifEA1Lc5/TbhTzSXTQINIOJT1cVI+nNeLlNcdB2luZsbIEL1PkKa7zO6rYqGcTvYOkL2d9H5Os94+wiHCCxmtP0a4jZ71jNU/4mHhpObEhj0cGDX0+GAVtxqp+DXCFF8QTSeiVHHZLg3xmK79VvJKgnCQOMpkYYBzWkhP10xu+LqHBX0m1xOv4ndWUeF5jxNn3tTd70XaAq8wDh0MGgyaDUhQEEUEYZiwUECGPBoxNLJyPyOrBhuTezJ1JGq7dGJEsUF7Ntw9t1Gk3Tz+KCJxlEO1CJL8Qf4qr8lP5Xn5y1yw2Fb3lK2bmrry4DvF5Zm5Gh7X08jjc01efJXUdpNXR5aseXq8muwaP+xXlzHmgjWPxHOw+/EtX5XMlymMFMXjVfPqS4R1WjE3359sfzs94i7PLrXWc62JizdWm5dn/WpI++6qvJPmVflPXvXx/GfNxGPiKTEmdornIYmXxS7xkthLqwviYG3HCJ2VhinSbZH6JNVgYJq89S9dP1t4vUZ/DPVRlBnM0lSJ93/CKmQ0nbkOb/qP28f8F+T3iuefKAIvbODImbptU3HvEKFlpW5zrgIXv9F98LZua6N+OPwEWDyrFq1SNZ8gvAEcdod6HugpmNOWls05Uocsn5O66cpiUsxQ20NSUtcl12VLFrOZVWLpdtiZ0x1uHKE5QvfEp0plk/qv8RGw/bBS+fmsUtl+ThrWgZf6b8C8/UXAeIuJAAAACXBIWXMAAAsTAAALEwEAmpwYAAABZ0lEQVQ4Ea2TPUsDQRCGZ89Eo4FACkULEQs1CH4Uamfjn7GxEYJFIFXgChFsbPwzNnZioREkaiHBQtEiEEiMRm/dZ8OEGAxR4sBxx877Pju7M2estTJIxLrNuVwuMxQEx0ZkzcFHyRtjXt02559RtB2GYanTYzoryOfz+6l4Nbszf2niwffKmpGRo9sVW22mDgqFwp5C2gDMm+P32a3JB1N+n5JifUGeP9JeNxGryPLYjcwMP8rJ07Q9fZltQzyAstOJ2vVu5sKc1ZZkRBrOcKeb+HexPidvkpCN5JUcllZtpZFc5DgBWc5M2eysZuMuofMBSA4NWjx4PUCsXefMlI0QY3ewRg4NWi4ZTQsgrjYXema+e4VqtEMK6KXvu+4B9Bklt90vVKMeD2BI6DOt4rZ/Gk7WyKFBi4fNPIAJY0joM61SCCZ9tI1o0OIB8D+DBIkYaJRbCBH9mZgNt+bb++ufSSF/eX8BYcDeAzuQJVUAAAAASUVORK5CYII=");

define("text!gcli/ui/images/pinout.png", [], "data:image/png;base64,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");

define("text!gcli/ui/images/pins.png", [], "data:image/png;base64,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");

define("text!gcli/ui/images/plus.png", [], "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAA4AAAAOCAYAAAAfSC3RAAAAAXNSR0IArs4c6QAAAAZiS0dEANIA0gDS7KbF4AAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB9kFGw4yFTwuJTkAAAH7SURBVCjPdZKxa1NRFMZ/956XZMgFyyMlCZRA4hBx6lBcQ00GoYi4tEstFPwLAs7iLDi7FWuHThaUggihBDI5OWRoQAmBQFISQgvvpbwX3rsOaR4K+o2H8zvfOZxPWWtZqVarGaAJPAEe3ZW/A1+Bd+1221v1qhW4vb1dA44mk0nZ8zyCIAAgk8lgjGF9fb0PHF5cXLQTsF6vP/c879P19TVBEJDJZBARAKIoSmpra2sYY561Wq3PqtFouMBgMBgYay3ZbJZ/yfd9tNaUSqUboOKISPPq6sqsVvZ9H4AvL34B8PTj/QSO45jpdHovn883Ha31znw+JwzDpCEMQx4UloM8zyOdTif3zudztNY7jog8DMMQpRRxHPPt5TCBAEZvxlyOFTsfykRRBICIlB2t9a21Nh3HMXEc8+d7VhJHWCwWyzcohdZaHBHpO46z6fs+IsLj94XECaD4unCHL8FsNouI/HRE5Nx13c3ZbIbWOnG5HKtl+53TSq7rIiLnand31wUGnU7HjEYjlFLJZN/3yRnL1FMYY8jlcmxtbd0AFel2u7dnZ2eXxpi9xWJBEASkUimstYgIQSSkUimKxSKVSgVjzN7p6emPJHL7+/s14KjX65WHwyGz2SxZbWNjg2q12gcOT05O2n9lFeDg4MAAr/4T8rfHx8dJyH8DvvbYGzKvWukAAAAASUVORK5CYII=");

define("text!gcli/ui/images/throbber.gif", [], "data:image/gif;base64,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");
