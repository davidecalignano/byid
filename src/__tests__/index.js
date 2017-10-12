import {
    normalize
} from '../';

describe('byId', () => {

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


    it('should return the input', () => {
        const schema = {}
        expect(normalize(input, schema)).toEqual(input)
    })

    it('should return the input normalized', () => {
        const schema = {
            comments: {}
        }
        expect(normalize(input, schema)).toEqual({
            ...input,
            comments: {
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
            }
        })
    })

    it('should return the input normalized deep', () => {
        const schema = {
            like: {
                schema: {
                    profiles: {
                        id: 'uuid'
                    }
                }
            }
        }

        expect(normalize(input, schema)).toEqual({
            ...input,
            like: {
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
        })
    })
})