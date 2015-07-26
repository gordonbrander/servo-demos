const loop = (callback) => {
  var next = true;

  const tick = (t) => {
    callback(t);
    if (next) requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  return () => next = false;
};

// Do something `n` times, calling `a2b` with index.
// Results are collected into an array.
const times = (n, a2b) => {
  const results = [];
  for (var i = 0; i < n; i++) results.push(a2b(i));
  return results;
};

const reducekv = (object, next, value) => {
  var keys = Object.keys(object);
  for (var i = 0; i < keys.length; i++)
    value = next(value, keys[i], object[keys[i]]);
  return value;
};

const set = (o, k, v) => {
  o[k] = v;
  return o;
};

const mix = (a, b) => reducekv(b, set, a);

// Set attributes on an element.
const attr = (element, k, v) => {
  if (v) {
    element.setAttribute(k, v);
  } else {
    element.removeAttribute(k);
  }
  return element;
};

const attrs = (element, attributes) =>
  reducekv(attributes, attr, element);

// Mutate element styles, returning element.
const style = (element, styles) => mix(element.style, styles);

const classname = (element, name, isSet) => {
  if (isSet) {
    element.classList.add(name);
  } else {
    element.classList.remove(name);
  }
  return element;
}

const classnames = (element, classset) =>
  reducekv(classset, classname, element);

const text = (element, text) =>
  element.textContent !== text ? set(element, 'textContent', text) : element;

const memoize = (f) => {
  const cache = {};
  return (x) => cache[x] ? cache[x] : cache[x] = f(x);
};

const id = memoize((x) => document.getElementById(x));

const px = (n) => n + 'px';

const translate3d = (x, y, z) => `translate3d(${x},${y},${z})`;

// Create and append an element to parent. Returns an element.
const el = (parent, kind, id, classset) => {
  const child = document.createElement(kind);
  attr(child, 'id', id);
  if (classset) classnames(child, classset);
  parent.appendChild(child);
  return child;
};

// Bind an event handler to an element
const on = (element, event, callback) => {
  element.addEventListener(event, callback);
  return () => element.removeEventListener(event, callback);
};

// Bind an event handler for a list of events to an element.
const onAny = (element, events, callback) => {
  events.forEach(event => element.addEventListener(event, callback));
  return () =>
    events.forEach(event => element.removeEventListener(event, callback));
}

const pos2d = (element, x, y) =>
  style(element, {left: px(x), top: px(y)});

// Returns a random integer between min (included) and max (included)
// Using Math.round() will give you a non-uniform distribution!
const random = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomKey = (o) => {
  const keys = Object.keys(o);
  const i = Math.floor(Math.random() * keys.length);
  return keys[i];
};

const getRandomValue = (o) => o[getRandomKey(o)];

const fps = (begin, end) => Math.round(1000 / (end - begin));

