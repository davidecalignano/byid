export function normalizer(array, key) {
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
            const {
                schema: schemaChild = null,
                id: schemaId = 'id'
            } = schema[key] || {}
            if (schemaChild !== null) {
                const child = normalize(data[key], schemaChild)
                result[key] = normalizer(child, schemaId)
            } else {
                result[key] = normalizer(data[key], schemaId)
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
            const {
                schema: schemaChild = null,
                id: schemaId = 'id'
            } = schema[key] || {}
            if (schemaChild !== null) {
                result[key] = data[key].ids.map(id => {
                    return denormalize(data[key].byId[id], schemaChild)
                })
            } else {
                result[key] = denormalizer(data[key])
            }
        });

        return result
    }
}