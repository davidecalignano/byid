import {
    normalize,
    normalizer,
    denormalize,
    denormalizer
} from '../';


const denormalizedData = {
    "id": "123",
    "title": "My awesome blog post",
    "author": "Davide",
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


const normalizedData = {
    "id": "123",
    "title": "My awesome blog post",
    "author": "Davide",
    "comments": {
        ids: ["324", "273", "986"],
        byId: {
            "324": {
                "id": "324",
                "content": "foo"
            },
            "273": {
                "id": "273",
                "content": "bar"
            },
            "986": {
                "id": "986",
                "content": "moo"
            }
        }
    },
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

describe('byId/normalize', () => {

    const input = {
        "id": "123",
        "title": "My awesome blog post",
        "author": "Davide",
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

    it('should return the denormalizedData', () => {
        const schema = {}
        expect(normalize(normalizedData, schema)).toEqual(normalizedData)
    })

    it('should return the denormalizedData normalized based on schema', () => {
        const schema = {
            comments: {}
        }
        expect(normalize(denormalizedData, schema)).toEqual({
            ...denormalizedData,
            comments: normalizedData.comments
        })
    })

    it('should return the denormalizedData normalized based on nested schema and different key', () => {
        const schema = {
            like: {
                schema: {
                    profiles: {
                        id: 'uuid'
                    }
                }
            }
        }

        expect(normalize(denormalizedData, schema)).toEqual({
            ...denormalizedData,
            like: normalizedData.like
        })
    })


    it('should return the denormalizedData if schema does not match', () => {
        const schema = {
            something: {}
        }

        expect(normalize(denormalizedData, schema)).toEqual(denormalizedData)
    })

    it('should return the denormalizedData if schema is falsy', () => {
        const schema = {
            comments: null
        }
        
        expect(normalize(denormalizedData, schema)).toEqual(denormalizedData)
    })
})



describe('byId/denormalize', () => {
    it('should return the normalizedData denormalized based on schema', () => {
        const schema = {
            comments: {}
        }
        expect(denormalize(normalizedData, schema)).toEqual({
            ...normalizedData,
            comments: denormalizedData.comments
        })
    })


    it('should return the normalizedData denormalized based on nested schema and different key', () => {
        const schema = {
            like: {
                schema: {
                    profiles: {
                        id: 'uuid'
                    }
                }
            }
        }

        expect(denormalize(normalizedData, schema)).toEqual({
            ...normalizedData,
            like: denormalizedData.like
        })
    })


    it('should denormalize array of data', () => {
        const schema = {
            like: {
                schema: {
                    profiles: {
                        id: 'uuid'
                    }
                }
            }
        }

        expect(denormalize([normalizedData], schema)).toEqual([{
            ...normalizedData,
            like: denormalizedData.like
        }])
    })

    it('should return the normalizedData if schema does not match', () => {
        const schema = {
            something: {}
        }

        expect(denormalize(normalizedData, schema)).toEqual(normalizedData)
    })

    it('should return the normalizedData if schema is falsy', () => {
        const schema = {
            comments: null
        }
        
        expect(denormalize(normalizedData, schema)).toEqual(normalizedData)
    })
})



describe('byId/normalizer', () => {
    it('should normalize an array', () => {
        expect(normalizer(denormalizedData.comments, 'id')).toEqual(normalizedData.comments)
    })

    it('should normalize an empty array', () => {
        expect(normalizer([], 'id')).toEqual({
            byId: {},
            ids: []
        })
    })
})


describe('byId/denormalizer', () => {
    it('should denormalize a normalized object', () => {
        expect(denormalizer(normalizedData.comments)).toEqual(denormalizedData.comments)
    })
})