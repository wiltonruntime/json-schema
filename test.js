/*
 * Copyright 2021, alex at staticlibs.net
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

define([
    "assert",
    "json-schema",
    "json!./test/wilton/schema.json",
    "json!./test/wilton/petstore.json"
], function(assert, jsonSchema, schema, petstore) {
    "use strict";

    // simple
    var validator = new jsonSchema.Validator({
        type: "number"
    });
    var result = validator.validate(7);
    assert.equal(result.valid, true);
    assert.equal(result.errors.length, 0);

    // openapi v3 schema
    var sv = new jsonSchema.Validator(schema);
    var sr = sv.validate(petstore);
    assert.equal(sr.valid, true);
    assert.equal(sr.errors.length, 0);

    // fail
    petstore.failprop = 42;
    var fr = sv.validate(petstore);
    assert.equal(fr.valid, false);
    assert.equal(fr.errors.length, 2);

    print("test: json-schema");

    return function() {
    };
});
