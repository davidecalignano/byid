# byId [![Build Status](https://travis-ci.org/davidecalignano/byid.svg?branch=master)](https://travis-ci.org/davidecalignano/byid) [![Coverage Status](https://coveralls.io/repos/github/davidecalignano/byid/badge.svg?branch=master)](https://coveralls.io/github/davidecalignano/byid?branch=master)
Makes array of objects accessible

## Motivation
**ById** is inspired by the [normalized way](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) to handle the state in redux and the [*normalizr*](https://github.com/paularmstrong/normalizr) utility.

Unlike *normalizr*, **byId** does not group the data in entities and you don't create relationship data on entities to preserve the information on nested objects, but rather it maintains the object structure as the input and normalizes all the arrays recursivly based on a schema which specify what should be normalized and what not.

## Advantages
- The normalization makes easy to access to array of items withouth iterating over it.
- Improves performances.

## Install

```bash
npm install byid
```

## API
* [normalize](#normalizedata-schema)
* [denormalize](#denormalizedata-schema)

## `normalize(data, schema)`
Return the normalized data based on the provided schema.

* `data`: **required** Data that needs normalization.
* `schema`: **required** An object that defines the schema of what needs normalizations and additionally specify the key (default *id*). All the data not specified in the schema will be copied in the new object as is.

## Usage

```js
import { normalize } from 'byid';
const data = {
    name: 'Mark',
    posts: [{id: 123, comments: []}, {id: 456, comments: []}]
}
const schema = {
    posts: {}
}

const output = normalize(data, schema)

```

### Output
```js
{
    name: 'Mark',
    posts: {
        ids: [123, 456],
        byId: {
            123: {id: 123, comments: []},
            456: {id: 456, comments: []}
        }
    }
}
```

## `denormalize(data, schema)`
Return the original data based on the provided schema.

* `data`: **required** Data that needs to be reverted in the original shape.
* `schema`: **required** The schema provided in the normalization.

## Usage

```js
import { denormalize } from 'byid';
const data = {
    name: 'Mark',
    posts: {
        ids: [123, 456],
        byId: {
            123: {id: 123, comments: []},
            456: {id: 456, comments: []}
        }
    }
}
const schema = {
    posts: {}
}

const output = denormalize(data, schema)

```

### Output
```js
{
    name: 'Mark',
    posts: [{id: 123, comments: []}, {id: 456, comments: []}]
}
```

## Dependencies
None.

## Examples
Coming soon.


