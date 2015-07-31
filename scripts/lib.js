'use strict';

var loop = function loop(callback) {
  var next = true;
  var frames = 0;
  var then = 0;

  var tick = function tick(t) {
    if (t === null) t = Date.now();
    callback(frames, t, t - then);
    frames = frames + 1;
    then = t;
    if (next) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);

  return function () {
    return next = false;
  };
};

// Do something `n` times, calling `a2b` with index.
// Results are collected into an array.
var times = function times(n, a2b) {
  var results = [];
  for (var i = 0; i < n; i++) results.push(a2b(i));
  return results;
};

var reducekv = function reducekv(object, next, value) {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i++) value = next(value, keys[i], object[keys[i]]);
  return value;
};

var set = function set(o, k, v) {
  o[k] = v;
  return o;
};

var mix = function mix(a, b) {
  return reducekv(b, set, a);
};

// Set attributes on an element.
var attr = function attr(element, k, v) {
  if (v) {
    element.setAttribute(k, v);
  } else {
    element.removeAttribute(k);
  }
  return element;
};

var attrs = function attrs(element, attributes) {
  return reducekv(attributes, attr, element);
};

// Mutate element styles, returning element.
var style = function style(element, styles) {
  return mix(element.style, styles);
};

var classname = function classname(element, name, isSet) {
  if (isSet) {
    element.classList.add(name);
  } else {
    element.classList.remove(name);
  }
  return element;
};

var classnames = function classnames(element, classset) {
  return reducekv(classset, classname, element);
};

var text = function text(element, _text) {
  return element.textContent !== _text ? set(element, 'textContent', _text) : element;
};

var id = function id(x) {
  return document.getElementById(x);
};

var px = function px(n) {
  return n + 'px';
};

var translate3d = function translate3d(x, y, z) {
  return 'translate3d(' + x + ',' + y + ',' + z + ')';
};

var rgba = function rgba(r, g, b, a) {
  return 'rgba(' + r + ', ' + g + ', ' + b + ', ' + a + ')';
};

// Create and append an element to parent. Returns an element.
var el = function el(parent, kind, id, classset) {
  var child = document.createElement(kind);
  attr(child, 'id', id);
  if (classset) classnames(child, classset);
  parent.appendChild(child);
  return child;
};

// Bind an event handler to an element, returning element.
var on = function on(element, event, callback) {
  element.addEventListener(event, callback);
  return element;
};

// Remove an event handler from an element, returning element.
var off = function off(element, event, callback) {
  element.addEventListener(event, callback);
  return element;
};

// Bind an object full of event handlers, where key is the event name.
// Returns an unbinding function to remove the listeners.
var events = function events(element, _events) {
  reducekv(_events, on, element);
  // Call this function to detach listeners
  return function () {
    return reducekv(_events, off, element);
  };
};

var pos2d = function pos2d(element, x, y) {
  return style(element, { left: px(x), top: px(y) });
};

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
var random = function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var getRandomKey = function getRandomKey(o) {
  var keys = Object.keys(o);
  var i = Math.floor(Math.random() * keys.length);
  return keys[i];
};

var getRandomValue = function getRandomValue(o) {
  return o[getRandomKey(o)];
};

var getJson = function getJson(url) {
  return fetch(url).then(function (response) {
    return response.json();
  });
};