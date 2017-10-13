# Nested normalization

Let's say I need to normalize the `like` array plus the `profiles` arrays in each of the like items for the data below:

```js
import { normalize } from 'byid';

const data = {
    "id": "123",
    "title": "My awesome blog post",
    "author": "Mark",
    "comments": [{
        "id": "324",
        "content": "foo"
    }, {
        "id": "273",
        "content": "bar"
    }, {
        "id": "986",
        "content": "moo"
    }],
    "like": [{
        "id": "facebook",
        "profiles": [{
            "uuid": "abcd",
            "name": "Mike",
            "timestamp": "123456789"
        }, {
            "uuid": "efgh",
            "name": "Jana",
            "timestamp": "987654321"
        }]
    }]
}

```
The schema will look like this, note we repeted the `schema` property under `like` to describe the schema child of every items, also note the `id` property which define a different key for the profiles ids.

```js

const schema = {
    like: {
        schema: {
            profiles: {
                id: 'uuid'
            }
        }
    }
}

const output = normalize(data, schema)

```

### Output
The output will contain only the `like` property and its childs normalized and everything else remained untouched.
```js
{
    "id": "123",
    "title": "My awesome blog post",
    "author": "Mark",
    "comments": [{
        "id": "324",
        "content": "foo"
    }, {
        "id": "273",
        "content": "bar"
    }, {
        "id": "986",
        "content": "moo"
    }],
    "like": {
        ids: ["facebook"],
        byId: {
            "facebook": {
                "id": "facebook",
                "profiles": {
                    "ids": ["abcd", "efgh"],
                    "byId": {
                        "abcd": {
                            "uuid": "abcd",
                            "name": "Mike",
                            "timestamp": "123456789"
                        },
                        "efgh": {
                            "uuid": "efgh",
                            "name": "Jana",
                            "timestamp": "987654321"
                        }
                    }
                }
            }
        }
    }
}
```

### Multiple normalizations
If we want to normalize the `comments` array as well, then our `schema` will look like this:
```js

const schema = {
    comments: {},
    like: {
        schema: {
            profiles: {
                id: 'uuid'
            }
        }
    }
}

```
