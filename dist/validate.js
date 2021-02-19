var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
define(["require", "exports", "./deep-compare-strict.js", "./dereference.js", "./format.js", "./pointer.js", "./ucs2-length.js"], function (require, exports, deep_compare_strict_js_1, dereference_js_1, format_js_1, pointer_js_1, ucs2_length_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.validate = void 0;
    function validate(instance, schema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, schemaLocation, evaluated) {
        if (draft === void 0) { draft = '2019-09'; }
        if (lookup === void 0) { lookup = dereference_js_1.dereference(schema); }
        if (shortCircuit === void 0) { shortCircuit = true; }
        if (recursiveAnchor === void 0) { recursiveAnchor = null; }
        if (instanceLocation === void 0) { instanceLocation = '#'; }
        if (schemaLocation === void 0) { schemaLocation = '#'; }
        if (schema === true) {
            return { valid: true, errors: [] };
        }
        if (schema === false) {
            return {
                valid: false,
                errors: [
                    {
                        instanceLocation: instanceLocation,
                        keyword: 'false',
                        keywordLocation: instanceLocation,
                        error: 'False boolean schema.'
                    }
                ]
            };
        }
        var rawInstanceType = typeof instance;
        var instanceType;
        switch (rawInstanceType) {
            case 'boolean':
            case 'number':
            case 'string':
                instanceType = rawInstanceType;
                break;
            case 'object':
                if (instance === null) {
                    instanceType = 'null';
                }
                else if (Array.isArray(instance)) {
                    instanceType = 'array';
                    evaluated = evaluated || { items: -1 };
                }
                else {
                    instanceType = 'object';
                    evaluated = evaluated || { properties: Object.create(null) };
                }
                break;
            default:
                // undefined, bigint, function, symbol
                throw new Error("Instances of \"" + rawInstanceType + "\" type are not supported.");
        }
        var $ref = schema.$ref, $recursiveRef = schema.$recursiveRef, $recursiveAnchor = schema.$recursiveAnchor, $type = schema.type, $const = schema.const, $enum = schema.enum, $required = schema.required, $not = schema.not, $anyOf = schema.anyOf, $allOf = schema.allOf, $oneOf = schema.oneOf, $if = schema.if, $then = schema.then, $else = schema.else, $format = schema.format, $properties = schema.properties, $patternProperties = schema.patternProperties, $additionalProperties = schema.additionalProperties, $unevaluatedProperties = schema.unevaluatedProperties, $minProperties = schema.minProperties, $maxProperties = schema.maxProperties, $propertyNames = schema.propertyNames, $dependentRequired = schema.dependentRequired, $dependentSchemas = schema.dependentSchemas, $dependencies = schema.dependencies, $items = schema.items, $additionalItems = schema.additionalItems, $unevaluatedItems = schema.unevaluatedItems, $contains = schema.contains, $minContains = schema.minContains, $maxContains = schema.maxContains, $minItems = schema.minItems, $maxItems = schema.maxItems, $uniqueItems = schema.uniqueItems, $minimum = schema.minimum, $maximum = schema.maximum, $exclusiveMinimum = schema.exclusiveMinimum, $exclusiveMaximum = schema.exclusiveMaximum, $multipleOf = schema.multipleOf, $minLength = schema.minLength, $maxLength = schema.maxLength, $pattern = schema.pattern, __absolute_ref__ = schema.__absolute_ref__;
        var errors = [];
        if ($ref !== undefined) {
            var uri = __absolute_ref__ || $ref;
            var refSchema = lookup[uri];
            if (refSchema === undefined) {
                var message = "Unresolved $ref \"" + $ref + "\".";
                if (__absolute_ref__ && __absolute_ref__ !== $ref) {
                    message += "  Absolute URI \"" + __absolute_ref__ + "\".";
                }
                message += "\nKnown schemas:\n- " + Object.keys(lookup).join('\n- ');
                throw new Error(message);
            }
            var keywordLocation = schemaLocation + "/$ref";
            var result = validate(instance, refSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated);
            if (!result.valid) {
                errors.push.apply(errors, __spreadArrays([{
                        instanceLocation: instanceLocation,
                        keyword: '$ref',
                        keywordLocation: keywordLocation,
                        error: 'A subschema had errors.'
                    }], result.errors));
            }
            if (draft === '4' || draft === '7') {
                return { valid: errors.length === 0, errors: errors };
            }
        }
        if ($recursiveAnchor === true && recursiveAnchor === null) {
            recursiveAnchor = schema;
        }
        if ($recursiveRef === '#') {
            var keywordLocation = schemaLocation + "/$recursiveRef";
            var result = validate(instance, recursiveAnchor === null ? schema : recursiveAnchor, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated);
            if (!result.valid) {
                errors.push.apply(errors, __spreadArrays([{
                        instanceLocation: instanceLocation,
                        keyword: '$recursiveRef',
                        keywordLocation: keywordLocation,
                        error: 'A subschema had errors.'
                    }], result.errors));
            }
        }
        if (Array.isArray($type)) {
            var length = $type.length;
            var valid = false;
            for (var i = 0; i < length; i++) {
                if (instanceType === $type[i] ||
                    ($type[i] === 'integer' &&
                        instanceType === 'number' &&
                        instance % 1 === 0 &&
                        instance === instance)) {
                    valid = true;
                    break;
                }
            }
            if (!valid) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'type',
                    keywordLocation: schemaLocation + "/type",
                    error: "Instance type \"" + instanceType + "\" is invalid. Expected \"" + $type.join('", "') + "\"."
                });
            }
        }
        else if ($type === 'integer') {
            if (instanceType !== 'number' || instance % 1 || instance !== instance) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'type',
                    keywordLocation: schemaLocation + "/type",
                    error: "Instance type \"" + instanceType + "\" is invalid. Expected \"" + $type + "\"."
                });
            }
        }
        else if ($type !== undefined && instanceType !== $type) {
            errors.push({
                instanceLocation: instanceLocation,
                keyword: 'type',
                keywordLocation: schemaLocation + "/type",
                error: "Instance type \"" + instanceType + "\" is invalid. Expected \"" + $type + "\"."
            });
        }
        if ($const !== undefined) {
            if (instanceType === 'object' || instanceType === 'array') {
                if (!deep_compare_strict_js_1.deepCompareStrict(instance, $const)) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'const',
                        keywordLocation: schemaLocation + "/const",
                        error: "Instance does not match " + JSON.stringify($const) + "."
                    });
                }
            }
            else if (instance !== $const) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'const',
                    keywordLocation: schemaLocation + "/const",
                    error: "Instance does not match " + JSON.stringify($const) + "."
                });
            }
        }
        if ($enum !== undefined) {
            if (instanceType === 'object' || instanceType === 'array') {
                if (!$enum.some(function (value) { return deep_compare_strict_js_1.deepCompareStrict(instance, value); })) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'enum',
                        keywordLocation: schemaLocation + "/enum",
                        error: "Instance does not match any of " + JSON.stringify($enum) + "."
                    });
                }
            }
            else if (!$enum.some(function (value) { return instance === value; })) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'enum',
                    keywordLocation: schemaLocation + "/enum",
                    error: "Instance does not match any of " + JSON.stringify($enum) + "."
                });
            }
        }
        if ($not !== undefined) {
            var keywordLocation = schemaLocation + "/not";
            var result = validate(instance, $not, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation /*,
            evaluated*/);
            if (result.valid) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'not',
                    keywordLocation: keywordLocation,
                    error: 'Instance matched "not" schema.'
                });
            }
        }
        if ($anyOf !== undefined) {
            var keywordLocation = schemaLocation + "/anyOf";
            var errorsLength = errors.length;
            var anyValid = false;
            for (var i = 0; i < $anyOf.length; i++) {
                var subSchema = $anyOf[i];
                var result = validate(instance, subSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation + "/" + i, evaluated);
                errors.push.apply(errors, result.errors);
                anyValid = anyValid || result.valid;
            }
            if (anyValid) {
                errors.length = errorsLength;
            }
            else {
                errors.splice(errorsLength, 0, {
                    instanceLocation: instanceLocation,
                    keyword: 'anyOf',
                    keywordLocation: keywordLocation,
                    error: 'Instance does not match any subschemas.'
                });
            }
        }
        if ($allOf !== undefined) {
            var keywordLocation = schemaLocation + "/allOf";
            var errorsLength = errors.length;
            var allValid = true;
            for (var i = 0; i < $allOf.length; i++) {
                var subSchema = $allOf[i];
                var result = validate(instance, subSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation + "/" + i, evaluated);
                errors.push.apply(errors, result.errors);
                allValid = allValid && result.valid;
            }
            if (allValid) {
                errors.length = errorsLength;
            }
            else {
                errors.splice(errorsLength, 0, {
                    instanceLocation: instanceLocation,
                    keyword: 'allOf',
                    keywordLocation: keywordLocation,
                    error: "Instance does not match every subschema."
                });
            }
        }
        if ($oneOf !== undefined) {
            var keywordLocation_1 = schemaLocation + "/oneOf";
            var errorsLength = errors.length;
            var matches = $oneOf.filter(function (subSchema, i) {
                var result = validate(instance, subSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation_1 + "/" + i, evaluated);
                errors.push.apply(errors, result.errors);
                return result.valid;
            }).length;
            if (matches === 1) {
                errors.length = errorsLength;
            }
            else {
                errors.splice(errorsLength, 0, {
                    instanceLocation: instanceLocation,
                    keyword: 'oneOf',
                    keywordLocation: keywordLocation_1,
                    error: "Instance does not match exactly one subschema (" + matches + " matches)."
                });
            }
        }
        if ($if !== undefined) {
            var keywordLocation = schemaLocation + "/if";
            var conditionResult = validate(instance, $if, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation, evaluated).valid;
            if (conditionResult) {
                if ($then !== undefined) {
                    var thenResult = validate(instance, $then, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, schemaLocation + "/then", evaluated);
                    if (!thenResult.valid) {
                        errors.push.apply(errors, __spreadArrays([{
                                instanceLocation: instanceLocation,
                                keyword: 'if',
                                keywordLocation: keywordLocation,
                                error: "Instance does not match \"then\" schema."
                            }], thenResult.errors));
                    }
                }
            }
            else if ($else !== undefined) {
                var elseResult = validate(instance, $else, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, schemaLocation + "/else", evaluated);
                if (!elseResult.valid) {
                    errors.push.apply(errors, __spreadArrays([{
                            instanceLocation: instanceLocation,
                            keyword: 'if',
                            keywordLocation: keywordLocation,
                            error: "Instance does not match \"else\" schema."
                        }], elseResult.errors));
                }
            }
        }
        if (instanceType === 'object') {
            if ($required !== undefined) {
                for (var _i = 0, $required_1 = $required; _i < $required_1.length; _i++) {
                    var key = $required_1[_i];
                    if (!(key in instance)) {
                        errors.push({
                            instanceLocation: instanceLocation,
                            keyword: 'required',
                            keywordLocation: schemaLocation + "/required",
                            error: "Instance does not have required property \"" + key + "\"."
                        });
                    }
                }
            }
            var keys = Object.keys(instance);
            if ($minProperties !== undefined && keys.length < $minProperties) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'minProperties',
                    keywordLocation: schemaLocation + "/minProperties",
                    error: "Instance does not have at least " + $minProperties + " properties."
                });
            }
            if ($maxProperties !== undefined && keys.length > $maxProperties) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'maxProperties',
                    keywordLocation: schemaLocation + "/maxProperties",
                    error: "Instance does not have at least " + $maxProperties + " properties."
                });
            }
            if ($propertyNames !== undefined) {
                var keywordLocation = schemaLocation + "/propertyNames";
                for (var key in instance) {
                    var subInstancePointer = instanceLocation + "/" + pointer_js_1.encodePointer(key);
                    var result = validate(key, $propertyNames, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
                    if (!result.valid) {
                        errors.push.apply(errors, __spreadArrays([{
                                instanceLocation: instanceLocation,
                                keyword: 'propertyNames',
                                keywordLocation: keywordLocation,
                                error: "Property name \"" + key + "\" does not match schema."
                            }], result.errors));
                    }
                }
            }
            if ($dependentRequired !== undefined) {
                var keywordLocation = schemaLocation + "/dependantRequired";
                for (var key in $dependentRequired) {
                    if (key in instance) {
                        var required = $dependentRequired[key];
                        for (var _a = 0, required_1 = required; _a < required_1.length; _a++) {
                            var dependantKey = required_1[_a];
                            if (!(dependantKey in instance)) {
                                errors.push({
                                    instanceLocation: instanceLocation,
                                    keyword: 'dependentRequired',
                                    keywordLocation: keywordLocation,
                                    error: "Instance has \"" + key + "\" but does not have \"" + dependantKey + "\"."
                                });
                            }
                        }
                    }
                }
            }
            if ($dependentSchemas !== undefined) {
                for (var key in $dependentSchemas) {
                    var keywordLocation = schemaLocation + "/dependentSchemas";
                    if (key in instance) {
                        var result = validate(instance, $dependentSchemas[key], draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation + "/" + pointer_js_1.encodePointer(key), evaluated);
                        if (!result.valid) {
                            errors.push.apply(errors, __spreadArrays([{
                                    instanceLocation: instanceLocation,
                                    keyword: 'dependentSchemas',
                                    keywordLocation: keywordLocation,
                                    error: "Instance has \"" + key + "\" but does not match dependant schema."
                                }], result.errors));
                        }
                    }
                }
            }
            if ($dependencies !== undefined) {
                var keywordLocation = schemaLocation + "/dependencies";
                for (var key in $dependencies) {
                    if (key in instance) {
                        var propsOrSchema = $dependencies[key];
                        if (Array.isArray(propsOrSchema)) {
                            for (var _b = 0, propsOrSchema_1 = propsOrSchema; _b < propsOrSchema_1.length; _b++) {
                                var dependantKey = propsOrSchema_1[_b];
                                if (!(dependantKey in instance)) {
                                    errors.push({
                                        instanceLocation: instanceLocation,
                                        keyword: 'dependencies',
                                        keywordLocation: keywordLocation,
                                        error: "Instance has \"" + key + "\" but does not have \"" + dependantKey + "\"."
                                    });
                                }
                            }
                        }
                        else {
                            var result = validate(instance, propsOrSchema, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation, keywordLocation + "/" + pointer_js_1.encodePointer(key));
                            if (!result.valid) {
                                errors.push.apply(errors, __spreadArrays([{
                                        instanceLocation: instanceLocation,
                                        keyword: 'dependencies',
                                        keywordLocation: keywordLocation,
                                        error: "Instance has \"" + key + "\" but does not match dependant schema."
                                    }], result.errors));
                            }
                        }
                    }
                }
            }
            var thisEvaluated = Object.create(null);
            if (!evaluated || !evaluated.properties) {
                throw new Error('evaluated.properties should be an object');
            }
            var stop = false;
            if ($properties !== undefined) {
                var keywordLocation = schemaLocation + "/properties";
                for (var key in $properties) {
                    if (!(key in instance)) {
                        continue;
                    }
                    var subInstancePointer = instanceLocation + "/" + pointer_js_1.encodePointer(key);
                    var result = validate(instance[key], $properties[key], draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation + "/" + pointer_js_1.encodePointer(key));
                    if (result.valid) {
                        evaluated.properties[key] = thisEvaluated[key] = true;
                    }
                    else {
                        stop = shortCircuit;
                        errors.push.apply(errors, __spreadArrays([{
                                instanceLocation: instanceLocation,
                                keyword: 'properties',
                                keywordLocation: keywordLocation,
                                error: "Property \"" + key + "\" does not match schema."
                            }], result.errors));
                        if (stop)
                            break;
                    }
                }
            }
            if (!stop && $patternProperties !== undefined) {
                var keywordLocation = schemaLocation + "/patternProperties";
                for (var pattern in $patternProperties) {
                    var regex = new RegExp(pattern);
                    var subSchema = $patternProperties[pattern];
                    for (var key in instance) {
                        if (!regex.test(key)) {
                            continue;
                        }
                        var subInstancePointer = instanceLocation + "/" + pointer_js_1.encodePointer(key);
                        var result = validate(instance[key], subSchema, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation + "/" + pointer_js_1.encodePointer(pattern));
                        if (result.valid) {
                            evaluated.properties[key] = thisEvaluated[key] = true;
                        }
                        else {
                            stop = shortCircuit;
                            errors.push.apply(errors, __spreadArrays([{
                                    instanceLocation: instanceLocation,
                                    keyword: 'patternProperties',
                                    keywordLocation: keywordLocation,
                                    error: "Property \"" + key + "\" matches pattern \"" + pattern + "\" but does not match associated schema."
                                }], result.errors));
                        }
                    }
                }
            }
            if (!stop && $additionalProperties !== undefined) {
                var keywordLocation = schemaLocation + "/additionalProperties";
                for (var key in instance) {
                    if (thisEvaluated[key]) {
                        continue;
                    }
                    var subInstancePointer = instanceLocation + "/" + pointer_js_1.encodePointer(key);
                    var result = validate(instance[key], $additionalProperties, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
                    if (result.valid) {
                        evaluated.properties[key] = true;
                    }
                    else {
                        stop = shortCircuit;
                        errors.push.apply(errors, __spreadArrays([{
                                instanceLocation: instanceLocation,
                                keyword: 'additionalProperties',
                                keywordLocation: keywordLocation,
                                error: "Property \"" + key + "\" does not match additional properties schema."
                            }], result.errors));
                    }
                }
            }
            else if (!stop && $unevaluatedProperties !== undefined) {
                var keywordLocation = schemaLocation + "/unevaluatedProperties";
                for (var key in instance) {
                    if (!evaluated.properties[key]) {
                        var subInstancePointer = instanceLocation + "/" + pointer_js_1.encodePointer(key);
                        var result = validate(instance[key], $unevaluatedProperties, draft, lookup, shortCircuit, recursiveAnchor, subInstancePointer, keywordLocation);
                        if (result.valid) {
                            evaluated.properties[key] = true;
                        }
                        else {
                            errors.push.apply(errors, __spreadArrays([{
                                    instanceLocation: instanceLocation,
                                    keyword: 'unevaluatedProperties',
                                    keywordLocation: keywordLocation,
                                    error: "Property \"" + key + "\" does not match unevaluated properties schema."
                                }], result.errors));
                        }
                    }
                }
            }
        }
        else if (instanceType === 'array') {
            if ($maxItems !== undefined && instance.length > $maxItems) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'maxItems',
                    keywordLocation: schemaLocation + "/maxItems",
                    error: "Array has too many items (" + instance.length + " > " + $maxItems + ")."
                });
            }
            if ($minItems !== undefined && instance.length < $minItems) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'minItems',
                    keywordLocation: schemaLocation + "/minItems",
                    error: "Array has too few items (" + instance.length + " < " + $minItems + ")."
                });
            }
            if (!evaluated || evaluated.items === undefined) {
                throw new Error('evaluated.items should be a number');
            }
            var length = instance.length;
            var i = 0;
            var stop = false;
            if ($items !== undefined) {
                var keywordLocation = schemaLocation + "/items";
                if (Array.isArray($items)) {
                    var length2 = Math.min($items.length, length);
                    for (; i < length2; i++) {
                        var result = validate(instance[i], $items[i], draft, lookup, shortCircuit, recursiveAnchor, instanceLocation + "/" + i, keywordLocation + "/" + i);
                        if (!result.valid) {
                            stop = shortCircuit;
                            errors.push.apply(errors, __spreadArrays([{
                                    instanceLocation: instanceLocation,
                                    keyword: 'items',
                                    keywordLocation: keywordLocation,
                                    error: "Items did not match schema."
                                }], result.errors));
                            if (stop)
                                break;
                        }
                    }
                }
                else {
                    for (; i < length; i++) {
                        var result = validate(instance[i], $items, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation + "/" + i, keywordLocation);
                        if (!result.valid) {
                            stop = shortCircuit;
                            errors.push.apply(errors, __spreadArrays([{
                                    instanceLocation: instanceLocation,
                                    keyword: 'items',
                                    keywordLocation: keywordLocation,
                                    error: "Items did not match schema."
                                }], result.errors));
                            if (stop)
                                break;
                        }
                    }
                }
                evaluated.items = Math.max(i, evaluated.items);
                if (!stop && $additionalItems !== undefined) {
                    var keywordLocation_2 = schemaLocation + "/additionalItems";
                    for (; i < length; i++) {
                        var result = validate(instance[i], $additionalItems, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation + "/" + i, keywordLocation_2);
                        if (!result.valid) {
                            stop = shortCircuit;
                            errors.push.apply(errors, __spreadArrays([{
                                    instanceLocation: instanceLocation,
                                    keyword: 'additionalItems',
                                    keywordLocation: keywordLocation_2,
                                    error: "Items did not match additional items schema."
                                }], result.errors));
                        }
                    }
                    evaluated.items = Math.max(i, evaluated.items);
                }
            }
            if (!stop && $unevaluatedItems !== undefined) {
                var keywordLocation = schemaLocation + "/unevaluatedItems";
                for (i = Math.max(evaluated.items, 0); i < length; i++) {
                    var result = validate(instance[i], $unevaluatedItems, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation + "/" + i, keywordLocation);
                    if (!result.valid) {
                        errors.push.apply(errors, __spreadArrays([{
                                instanceLocation: instanceLocation,
                                keyword: 'unevaluatedItems',
                                keywordLocation: keywordLocation,
                                error: "Items did not match unevaluated items schema."
                            }], result.errors));
                    }
                }
                evaluated.items = Math.max(i, evaluated.items);
            }
            if ($contains !== undefined) {
                if (length === 0 && $minContains === undefined) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'contains',
                        keywordLocation: schemaLocation + "/contains",
                        error: "Array is empty. It must contain at least one item matching the schema."
                    });
                }
                else if ($minContains !== undefined && length < $minContains) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'minContains',
                        keywordLocation: schemaLocation + "/minContains",
                        error: "Array has less items (" + length + ") than minContains (" + $minContains + ")."
                    });
                }
                else {
                    var keywordLocation = schemaLocation + "/contains";
                    var errorsLength = errors.length;
                    var contained = 0;
                    for (var i_1 = 0; i_1 < length; i_1++) {
                        var result = validate(instance[i_1], $contains, draft, lookup, shortCircuit, recursiveAnchor, instanceLocation + "/" + i_1, keywordLocation);
                        if (result.valid) {
                            contained++;
                            if ($minContains === undefined && $maxContains === undefined) {
                                break;
                            }
                        }
                        else {
                            errors.push.apply(errors, result.errors);
                        }
                    }
                    if (contained >= ($minContains || 0)) {
                        errors.length = errorsLength;
                    }
                    if ($minContains === undefined &&
                        $maxContains === undefined &&
                        contained === 0) {
                        errors.splice(errorsLength, 0, {
                            instanceLocation: instanceLocation,
                            keyword: 'contains',
                            keywordLocation: keywordLocation,
                            error: "Array does not contain item matching schema."
                        });
                    }
                    else if ($minContains !== undefined && contained < $minContains) {
                        errors.push({
                            instanceLocation: instanceLocation,
                            keyword: 'minContains',
                            keywordLocation: schemaLocation + "/minContains",
                            error: "Array must contain at least " + $minContains + " items matching schema. Only " + contained + " items were found."
                        });
                    }
                    else if ($maxContains !== undefined && contained > $maxContains) {
                        errors.push({
                            instanceLocation: instanceLocation,
                            keyword: 'maxContains',
                            keywordLocation: schemaLocation + "/maxContains",
                            error: "Array may contain at most " + $maxContains + " items matching schema. " + contained + " items were found."
                        });
                    }
                }
            }
            if ($uniqueItems) {
                for (var j = 0; j < length; j++) {
                    var a = instance[j];
                    var ao = typeof a === 'object' && a !== null;
                    for (var k = 0; k < length; k++) {
                        if (j === k) {
                            continue;
                        }
                        var b = instance[k];
                        var bo = typeof b === 'object' && b !== null;
                        if (a === b || (ao && bo && deep_compare_strict_js_1.deepCompareStrict(a, b))) {
                            errors.push({
                                instanceLocation: instanceLocation,
                                keyword: 'uniqueItems',
                                keywordLocation: schemaLocation + "/uniqueItems",
                                error: "Duplicate items at indexes " + j + " and " + k + "."
                            });
                            j = 9007199254740991; // Number.MAX_SAFE_INTEGER;
                            k = 9007199254740991; // Number.MAX_SAFE_INTEGER;
                        }
                    }
                }
            }
        }
        else if (instanceType === 'number') {
            if (draft === '4') {
                if ($minimum !== undefined &&
                    (($exclusiveMinimum === true && instance <= $minimum) ||
                        instance < $minimum)) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'minimum',
                        keywordLocation: schemaLocation + "/minimum",
                        error: instance + " is less than " + ($exclusiveMinimum ? 'or equal to ' : '') + " " + $minimum + "."
                    });
                }
                if ($maximum !== undefined &&
                    (($exclusiveMaximum === true && instance >= $maximum) ||
                        instance > $maximum)) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'maximum',
                        keywordLocation: schemaLocation + "/maximum",
                        error: instance + " is greater than " + ($exclusiveMaximum ? 'or equal to ' : '') + " " + $maximum + "."
                    });
                }
            }
            else {
                if ($minimum !== undefined && instance < $minimum) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'minimum',
                        keywordLocation: schemaLocation + "/minimum",
                        error: instance + " is less than " + $minimum + "."
                    });
                }
                if ($maximum !== undefined && instance > $maximum) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'maximum',
                        keywordLocation: schemaLocation + "/maximum",
                        error: instance + " is greater than " + $maximum + "."
                    });
                }
                if ($exclusiveMinimum !== undefined && instance <= $exclusiveMinimum) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'exclusiveMinimum',
                        keywordLocation: schemaLocation + "/exclusiveMinimum",
                        error: instance + " is less than " + $exclusiveMinimum + "."
                    });
                }
                if ($exclusiveMaximum !== undefined && instance >= $exclusiveMaximum) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'exclusiveMaximum',
                        keywordLocation: schemaLocation + "/exclusiveMaximum",
                        error: instance + " is greater than or equal to " + $exclusiveMaximum + "."
                    });
                }
            }
            if ($multipleOf !== undefined) {
                var remainder = instance % $multipleOf;
                if (Math.abs(0 - remainder) >= 1.1920929e-7 &&
                    Math.abs($multipleOf - remainder) >= 1.1920929e-7) {
                    errors.push({
                        instanceLocation: instanceLocation,
                        keyword: 'multipleOf',
                        keywordLocation: schemaLocation + "/multipleOf",
                        error: instance + " is not a multiple of " + $multipleOf + "."
                    });
                }
            }
        }
        else if (instanceType === 'string') {
            var length = $minLength === undefined && $maxLength === undefined
                ? 0
                : ucs2_length_js_1.ucs2length(instance);
            if ($minLength !== undefined && length < $minLength) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'minLength',
                    keywordLocation: schemaLocation + "/minLength",
                    error: "String is too short (" + length + " < " + $minLength + ")."
                });
            }
            if ($maxLength !== undefined && length > $maxLength) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'maxLength',
                    keywordLocation: schemaLocation + "/maxLength",
                    error: "String is too long (" + length + " > " + $maxLength + ")."
                });
            }
            if ($pattern !== undefined && !new RegExp($pattern).test(instance)) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'pattern',
                    keywordLocation: schemaLocation + "/pattern",
                    error: "String does not match pattern."
                });
            }
            if ($format !== undefined &&
                format_js_1.fastFormat[$format] &&
                !format_js_1.fastFormat[$format](instance)) {
                errors.push({
                    instanceLocation: instanceLocation,
                    keyword: 'format',
                    keywordLocation: schemaLocation + "/format",
                    error: "String does not match format \"" + $format + "\"."
                });
            }
        }
        return { valid: errors.length === 0, errors: errors };
    }
    exports.validate = validate;
});
