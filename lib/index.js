'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.normalizer = normalizer;
exports.denormalizer = denormalizer;
exports.normalize = normalize;
exports.denormalize = denormalize;
function normalizer(array, key) {
    if (!array.length) {
        return {
            byId: {},
            ids: []
        };
    }

    return array.reduce(function (obj, item) {
        obj.ids = obj.ids || [];
        obj.byId = obj.byId || {};

        obj.ids.push(item[key]);
        obj.byId[item[key]] = item;

        return obj;
    }, {});
}

function denormalizer(object) {
    return object.ids.map(function (id) {
        return object.byId[id];
    });
}

function normalize(data, schema) {
    if (Array.isArray(data)) {
        return data.map(function (item) {
            return normalize(item, schema);
        });
    } else {
        var result = _extends({}, data);
        Object.keys(schema).forEach(function (key) {
            var _ref = schema[key] || {},
                _ref$schema = _ref.schema,
                schemaChild = _ref$schema === undefined ? null : _ref$schema,
                _ref$id = _ref.id,
                schemaId = _ref$id === undefined ? 'id' : _ref$id;

            if (schemaChild !== null) {
                var child = normalize(data[key], schemaChild);
                result[key] = normalizer(child, schemaId);
            } else {
                result[key] = normalizer(data[key], schemaId);
            }
        });

        return result;
    }
}

function denormalize(data, schema) {
    if (Array.isArray(data)) {
        return data.map(function (item) {
            return denormalize(item, schema);
        });
    } else {
        var result = _extends({}, data);
        Object.keys(schema).forEach(function (key) {
            var _ref2 = schema[key] || {},
                _ref2$schema = _ref2.schema,
                schemaChild = _ref2$schema === undefined ? null : _ref2$schema,
                _ref2$id = _ref2.id,
                schemaId = _ref2$id === undefined ? 'id' : _ref2$id;

            if (schemaChild !== null) {
                result[key] = data[key].ids.map(function (id) {
                    return denormalize(data[key].byId[id], schemaChild);
                });
            } else {
                result[key] = denormalizer(data[key]);
            }
        });

        return result;
    }
}