define(["require", "exports", "./deep-compare-strict.js", "./dereference.js", "./format.js", "./pointer.js", "./types.js", "./ucs2-length.js", "./validate.js", "./validator.js"], function (require, exports, deep_compare_strict_js_1, dereference_js_1, format_js_1, pointer_js_1, types_js_1, ucs2_length_js_1, validate_js_1, validator_js_1) {
    "use strict";

    var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
    }) : (function(o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
    }));
    var __exportStar = (this && this.__exportStar) || function(m, exports) {
        for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
    };

    Object.defineProperty(exports, "__esModule", { value: true });
    __exportStar(deep_compare_strict_js_1, exports);
    __exportStar(dereference_js_1, exports);
    __exportStar(format_js_1, exports);
    __exportStar(pointer_js_1, exports);
    __exportStar(types_js_1, exports);
    __exportStar(ucs2_length_js_1, exports);
    __exportStar(validate_js_1, exports);
    __exportStar(validator_js_1, exports);
});
