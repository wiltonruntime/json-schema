define(["require", "exports", "./pointer.js"], function (require, exports, pointer_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.dereference = exports.initialBaseURI = exports.ignoredKeyword = exports.schemaMapKeyword = exports.schemaArrayKeyword = exports.schemaKeyword = void 0;
    exports.schemaKeyword = {
        additionalItems: true,
        unevaluatedItems: true,
        items: true,
        contains: true,
        additionalProperties: true,
        unevaluatedProperties: true,
        propertyNames: true,
        not: true,
        if: true,
        then: true,
        else: true
    };
    exports.schemaArrayKeyword = {
        items: true,
        allOf: true,
        anyOf: true,
        oneOf: true
    };
    exports.schemaMapKeyword = {
        $defs: true,
        definitions: true,
        properties: true,
        patternProperties: true,
        dependentSchemas: true
    };
    exports.ignoredKeyword = {
        id: true,
        $id: true,
        $ref: true,
        $schema: true,
        $anchor: true,
        $vocabulary: true,
        $comment: true,
        default: true,
        enum: true,
        const: true,
        required: true,
        type: true,
        maximum: true,
        minimum: true,
        exclusiveMaximum: true,
        exclusiveMinimum: true,
        multipleOf: true,
        maxLength: true,
        minLength: true,
        pattern: true,
        format: true,
        maxItems: true,
        minItems: true,
        uniqueItems: true,
        maxProperties: true,
        minProperties: true
    };
    /**
     * Default base URI for schemas without an $id.
     * https://json-schema.org/draft/2019-09/json-schema-core.html#initial-base
     * https://tools.ietf.org/html/rfc3986#section-5.1
     */
    exports.initialBaseURI = "";
    function dereference(schema, lookup, baseURI, basePointer) {
        if (lookup === void 0) { lookup = Object.create(null); }
        if (baseURI === void 0) { baseURI = exports.initialBaseURI; }
        if (basePointer === void 0) { basePointer = ''; }
        if (schema && typeof schema === 'object' && !Array.isArray(schema)) {
            var id = schema.$id || schema.id;
            if (id) {
                var url = baseURI + id;
                var hashIdx = url.indexOf("#");
                if (hashIdx > 0) {
                    lookup[url] = schema;
                }
                else {
                    url = url.substring(0, hashIdx); // normalize hash https://url.spec.whatwg.org/#dom-url-hash
                    if (basePointer === '') {
                        baseURI = url;
                    }
                    else {
                        dereference(schema, lookup, baseURI);
                    }
                }
            }
        }
        else if (schema !== true && schema !== false) {
            return lookup;
        }
        // compute the schema's URI and add it to the mapping.
        var schemaURI = baseURI + (basePointer ? '#' + basePointer : '');
        if (lookup[schemaURI] !== undefined) {
            throw new Error("Duplicate schema URI \"" + schemaURI + "\".");
        }
        lookup[schemaURI] = schema;
        // exit early if this is a boolean schema.
        if (schema === true || schema === false) {
            return lookup;
        }
        // set the schema's absolute URI.
        if (schema.__absolute_uri__ === undefined) {
            Object.defineProperty(schema, '__absolute_uri__', {
                enumerable: false,
                value: schemaURI
            });
        }
        // if a $ref is found, resolve it's absolute URI.
        if (schema.$ref && schema.__absolute_ref__ === undefined) {
            var url = baseURI + schema.$ref;
            Object.defineProperty(schema, '__absolute_ref__', {
                enumerable: false,
                value: url
            });
        }
        // if an $anchor is found, compute it's URI and add it to the mapping.
        if (schema.$anchor) {
            var url = baseURI + '#' + schema.$anchor;
            lookup[url] = schema;
        }
        // process subschemas.
        for (var key in schema) {
            if (exports.ignoredKeyword[key]) {
                continue;
            }
            var keyBase = basePointer + "/" + pointer_js_1.encodePointer(key);
            var subSchema = schema[key];
            if (Array.isArray(subSchema)) {
                if (exports.schemaArrayKeyword[key]) {
                    var length = subSchema.length;
                    for (var i = 0; i < length; i++) {
                        dereference(subSchema[i], lookup, baseURI, keyBase + "/" + i);
                    }
                }
            }
            else if (exports.schemaMapKeyword[key]) {
                for (var subKey in subSchema) {
                    dereference(subSchema[subKey], lookup, baseURI, keyBase + "/" + pointer_js_1.encodePointer(subKey));
                }
            }
            else {
                dereference(subSchema, lookup, baseURI, keyBase);
            }
        }
        return lookup;
    }
    exports.dereference = dereference;
});
// schema identification examples
// https://json-schema.org/draft/2019-09/json-schema-core.html#rfc.appendix.A
// $ref delegation
// https://github.com/json-schema-org/json-schema-spec/issues/514
// output format
// https://json-schema.org/draft/2019-09/json-schema-core.html#output
// JSON pointer
// https://tools.ietf.org/html/rfc6901
// JSON relative pointer
// https://tools.ietf.org/html/draft-handrews-relative-json-pointer-01
