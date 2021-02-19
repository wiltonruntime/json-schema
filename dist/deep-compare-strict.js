define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.deepCompareStrict = void 0;
    function deepCompareStrict(a, b) {
        var typeofa = typeof a;
        if (typeofa !== typeof b) {
            return false;
        }
        if (Array.isArray(a)) {
            if (!Array.isArray(b)) {
                return false;
            }
            var length = a.length;
            if (length !== b.length) {
                return false;
            }
            for (var i = 0; i < length; i++) {
                if (!deepCompareStrict(a[i], b[i])) {
                    return false;
                }
            }
            return true;
        }
        if (typeofa === 'object') {
            if (!a || !b) {
                return a === b;
            }
            var aKeys = Object.keys(a);
            var bKeys = Object.keys(b);
            var length = aKeys.length;
            if (length !== bKeys.length) {
                return false;
            }
            for (var _i = 0, aKeys_1 = aKeys; _i < aKeys_1.length; _i++) {
                var k = aKeys_1[_i];
                if (!deepCompareStrict(a[k], b[k])) {
                    return false;
                }
            }
            return true;
        }
        return a === b;
    }
    exports.deepCompareStrict = deepCompareStrict;
});
