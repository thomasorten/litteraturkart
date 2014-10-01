'use strict';

var _ = require('lodash');
var Light = require('./light.model');

// Get list of lights
exports.index = function(req, res) {
  Light.find(function (err, lights) {
    if(err) { return handleError(res, err); }
    return res.json(200, lights);
  });
};

// Get a single light
exports.show = function(req, res) {
  Light.findById(req.params.id, function (err, light) {
    if(err) { return handleError(res, err); }
    if(!light) { return res.send(404); }
    return res.json(light);
  });
};

// Creates a new light in the DB.
exports.create = function(req, res) {
  Light.create(req.body, function(err, light) {
    if(err) { return handleError(res, err); }
    return res.json(201, light);
  });
};

// Updates an existing light in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Light.findById(req.params.id, function (err, light) {
    if (err) { return handleError(res, err); }
    if(!light) { return res.send(404); }
    var updated = _.merge(light, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, light);
    });
  });
};

// Deletes a light from the DB.
exports.destroy = function(req, res) {
  Light.findById(req.params.id, function (err, light) {
    if(err) { return handleError(res, err); }
    if(!light) { return res.send(404); }
    light.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}