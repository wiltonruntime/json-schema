var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
define(["require", "exports", "./dereference.js", "./validate.js"], function (require, exports, dereference_js_1, validate_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Validator = void 0;
    var Validator = /** @class */ (function () {
        function Validator(schema, draft, shortCircuit) {
            if (draft === void 0) { draft = '2019-09'; }
            if (shortCircuit === void 0) { shortCircuit = true; }
            this.schema = schema;
            this.draft = draft;
            this.shortCircuit = shortCircuit;
            this.lookup = dereference_js_1.dereference(schema);
        }
        Validator.prototype.validate = function (instance) {
            return validate_js_1.validate(instance, this.schema, this.draft, this.lookup, this.shortCircuit);
        };
        Validator.prototype.addSchema = function (schema, id) {
            if (id) {
                schema = __assign(__assign({}, schema), { $id: id });
            }
            dereference_js_1.dereference(schema, this.lookup);
        };
        return Validator;
    }());
    exports.Validator = Validator;
});
