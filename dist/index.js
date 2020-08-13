"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _objectWithoutProperties(source, excluded) { if (source == null) return {}; var target = _objectWithoutPropertiesLoose(source, excluded); var key, i; if (Object.getOwnPropertySymbols) { var sourceSymbolKeys = Object.getOwnPropertySymbols(source); for (i = 0; i < sourceSymbolKeys.length; i++) { key = sourceSymbolKeys[i]; if (excluded.indexOf(key) >= 0) continue; if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue; target[key] = source[key]; } } return target; }

function _objectWithoutPropertiesLoose(source, excluded) { if (source == null) return {}; var target = {}; var sourceKeys = Object.keys(source); var key, i; for (i = 0; i < sourceKeys.length; i++) { key = sourceKeys[i]; if (excluded.indexOf(key) >= 0) continue; target[key] = source[key]; } return target; }

function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }

function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var express = require('express');

var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json()); // example to operate on

var tasks = {
  1: {
    id: '1',
    desc: 'learn from tutorials',
    state: 'done'
  },
  2: {
    id: '2',
    desc: 'work on portfolio project',
    state: 'pending'
  }
}; // GET methods
// for users

app.get('/tasks', function (req, res) {
  res.send(tasks);
});
app.get('/tasks/:id', function (req, res) {
  res.send(tasks[req.params.id]);
}); // POST method

app.post('/tasks', function (req, res) {
  var newTask = {
    id: Object.keys(tasks).length + 1,
    desc: req.body.desc,
    state: req.body.state
  };
  tasks[Object.keys(tasks).length + 1] = newTask;
  res.send(tasks);
}); // PUT method

app.put('/tasks/:id', function (req, res) {
  tasks = _objectSpread(_objectSpread({}, tasks), {}, _defineProperty({}, req.params.id, {
    desc: req.body.desc,
    state: req.body.state
  }));
  res.send(tasks);
}); // DELETE method

app["delete"]('/tasks/:id', function (req, res) {
  var _tasks = tasks,
      _req$params$id = req.params.id,
      task = _tasks[_req$params$id],
      otherTasks = _objectWithoutProperties(_tasks, [_req$params$id].map(_toPropertyKey));

  tasks = otherTasks;
  res.send(tasks);
});
app.listen(5000, function () {
  console.log('app listening on port 5000');
});