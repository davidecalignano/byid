export function normalizer(array, key = 'id') {

    if (!Array.isArray(array)) {
        return array;
    }

    if (!array.length) {
        return {
            byId: {},
            ids: []
        };
    }

    return array.reduce(
        (obj, item) => {
            obj.ids = obj.ids || [];
            obj.byId = obj.byId || {};

            obj.ids.push(item[key]);
            obj.byId[item[key]] = item;

            return obj;
        }, {}
    );
}


export function denormalizer(object) {
    if (typeof object !== "object") {
        return object;
    }
    return object.ids.map(id => object.byId[id])
}


export function normalize(data, schema) {
    if (Array.isArray(data)) {
        return data.map(item => (
            normalize(item, schema)
        ));
    } else {
        let result = {...data};
        Object.keys(schema).forEach(function(key) {
            if(!schema[key]) {
                return data
            };

            const {
                schema: childSchema,
                id: childId
            } = schema[key];

            if (childSchema) {
                const child = normalize(data[key], childSchema)
                result[key] = normalizer(child, childId)
            } else {
                result[key] = normalizer(data[key], childId)
            }
        });

        return result
    }
}



export function denormalize(data, schema) {
    if (Array.isArray(data)) {
        return data.map(item => (
            denormalize(item, schema)
        ));
    } else {
        let result = {...data};
        Object.keys(schema).forEach(function(key) {
            if(!schema[key]) {
                return data
            };
            const { schema: childSchema } = schema[key];
            if (childSchema) {
                result[key] = data[key].ids.map(id => {
                    return denormalize(data[key].byId[id], childSchema)
                })
            } else {
                result[key] = denormalizer(data[key])
            }
        });

        return result
    }
}