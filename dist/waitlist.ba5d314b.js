// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/parcel-bundler/src/builtins/bundle-url.js":[function(require,module,exports) {
var bundleURL = null;
function getBundleURLCached() {
  if (!bundleURL) {
    bundleURL = getBundleURL();
  }
  return bundleURL;
}
function getBundleURL() {
  // Attempt to find the URL of the current script and use that as the base URL
  try {
    throw new Error();
  } catch (err) {
    var matches = ('' + err.stack).match(/(https?|file|ftp|chrome-extension|moz-extension):\/\/[^)\n]+/g);
    if (matches) {
      return getBaseURL(matches[0]);
    }
  }
  return '/';
}
function getBaseURL(url) {
  return ('' + url).replace(/^((?:https?|file|ftp|chrome-extension|moz-extension):\/\/.+)?\/[^/]+(?:\?.*)?$/, '$1') + '/';
}
exports.getBundleURL = getBundleURLCached;
exports.getBaseURL = getBaseURL;
},{}],"node_modules/parcel-bundler/src/builtins/bundle-loader.js":[function(require,module,exports) {
var getBundleURL = require('./bundle-url').getBundleURL;
function loadBundlesLazy(bundles) {
  if (!Array.isArray(bundles)) {
    bundles = [bundles];
  }
  var id = bundles[bundles.length - 1];
  try {
    return Promise.resolve(require(id));
  } catch (err) {
    if (err.code === 'MODULE_NOT_FOUND') {
      return new LazyPromise(function (resolve, reject) {
        loadBundles(bundles.slice(0, -1)).then(function () {
          return require(id);
        }).then(resolve, reject);
      });
    }
    throw err;
  }
}
function loadBundles(bundles) {
  return Promise.all(bundles.map(loadBundle));
}
var bundleLoaders = {};
function registerBundleLoader(type, loader) {
  bundleLoaders[type] = loader;
}
module.exports = exports = loadBundlesLazy;
exports.load = loadBundles;
exports.register = registerBundleLoader;
var bundles = {};
function loadBundle(bundle) {
  var id;
  if (Array.isArray(bundle)) {
    id = bundle[1];
    bundle = bundle[0];
  }
  if (bundles[bundle]) {
    return bundles[bundle];
  }
  var type = (bundle.substring(bundle.lastIndexOf('.') + 1, bundle.length) || bundle).toLowerCase();
  var bundleLoader = bundleLoaders[type];
  if (bundleLoader) {
    return bundles[bundle] = bundleLoader(getBundleURL() + bundle).then(function (resolved) {
      if (resolved) {
        module.bundle.register(id, resolved);
      }
      return resolved;
    }).catch(function (e) {
      delete bundles[bundle];
      throw e;
    });
  }
}
function LazyPromise(executor) {
  this.executor = executor;
  this.promise = null;
}
LazyPromise.prototype.then = function (onSuccess, onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.then(onSuccess, onError);
};
LazyPromise.prototype.catch = function (onError) {
  if (this.promise === null) this.promise = new Promise(this.executor);
  return this.promise.catch(onError);
};
},{"./bundle-url":"node_modules/parcel-bundler/src/builtins/bundle-url.js"}],"node_modules/@supabase/functions-js/dist/module/helper.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveFetch = void 0;
const resolveFetch = customFetch => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => require("_bundle_loader")(require.resolve('@supabase/node-fetch')).then(({
      default: fetch
    }) => fetch(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
exports.resolveFetch = resolveFetch;
},{"_bundle_loader":"node_modules/parcel-bundler/src/builtins/bundle-loader.js","@supabase/node-fetch":[["browser.b6f259d9.js","node_modules/@supabase/node-fetch/browser.js"],"browser.b6f259d9.js.map","node_modules/@supabase/node-fetch/browser.js"]}],"node_modules/@supabase/functions-js/dist/module/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionsRelayError = exports.FunctionsHttpError = exports.FunctionsFetchError = exports.FunctionsError = exports.FunctionRegion = void 0;
class FunctionsError extends Error {
  constructor(message, name = 'FunctionsError', context) {
    super(message);
    this.name = name;
    this.context = context;
  }
}
exports.FunctionsError = FunctionsError;
class FunctionsFetchError extends FunctionsError {
  constructor(context) {
    super('Failed to send a request to the Edge Function', 'FunctionsFetchError', context);
  }
}
exports.FunctionsFetchError = FunctionsFetchError;
class FunctionsRelayError extends FunctionsError {
  constructor(context) {
    super('Relay Error invoking the Edge Function', 'FunctionsRelayError', context);
  }
}
exports.FunctionsRelayError = FunctionsRelayError;
class FunctionsHttpError extends FunctionsError {
  constructor(context) {
    super('Edge Function returned a non-2xx status code', 'FunctionsHttpError', context);
  }
}
// Define the enum for the 'region' property
exports.FunctionsHttpError = FunctionsHttpError;
var FunctionRegion;
(function (FunctionRegion) {
  FunctionRegion["Any"] = "any";
  FunctionRegion["ApNortheast1"] = "ap-northeast-1";
  FunctionRegion["ApNortheast2"] = "ap-northeast-2";
  FunctionRegion["ApSouth1"] = "ap-south-1";
  FunctionRegion["ApSoutheast1"] = "ap-southeast-1";
  FunctionRegion["ApSoutheast2"] = "ap-southeast-2";
  FunctionRegion["CaCentral1"] = "ca-central-1";
  FunctionRegion["EuCentral1"] = "eu-central-1";
  FunctionRegion["EuWest1"] = "eu-west-1";
  FunctionRegion["EuWest2"] = "eu-west-2";
  FunctionRegion["EuWest3"] = "eu-west-3";
  FunctionRegion["SaEast1"] = "sa-east-1";
  FunctionRegion["UsEast1"] = "us-east-1";
  FunctionRegion["UsWest1"] = "us-west-1";
  FunctionRegion["UsWest2"] = "us-west-2";
})(FunctionRegion || (exports.FunctionRegion = FunctionRegion = {}));
},{}],"node_modules/@supabase/functions-js/dist/module/FunctionsClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.FunctionsClient = void 0;
var _helper = require("./helper");
var _types = require("./types");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class FunctionsClient {
  constructor(url, {
    headers = {},
    customFetch,
    region = _types.FunctionRegion.Any
  } = {}) {
    this.url = url;
    this.headers = headers;
    this.region = region;
    this.fetch = (0, _helper.resolveFetch)(customFetch);
  }
  /**
   * Updates the authorization header
   * @param token - the new jwt token sent in the authorisation header
   */
  setAuth(token) {
    this.headers.Authorization = `Bearer ${token}`;
  }
  /**
   * Invokes a function
   * @param functionName - The name of the Function to invoke.
   * @param options - Options for invoking the Function.
   */
  invoke(functionName, options = {}) {
    var _a;
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const {
          headers,
          method,
          body: functionArgs
        } = options;
        let _headers = {};
        let {
          region
        } = options;
        if (!region) {
          region = this.region;
        }
        if (region && region !== 'any') {
          _headers['x-region'] = region;
        }
        let body;
        if (functionArgs && (headers && !Object.prototype.hasOwnProperty.call(headers, 'Content-Type') || !headers)) {
          if (typeof Blob !== 'undefined' && functionArgs instanceof Blob || functionArgs instanceof ArrayBuffer) {
            // will work for File as File inherits Blob
            // also works for ArrayBuffer as it is the same underlying structure as a Blob
            _headers['Content-Type'] = 'application/octet-stream';
            body = functionArgs;
          } else if (typeof functionArgs === 'string') {
            // plain string
            _headers['Content-Type'] = 'text/plain';
            body = functionArgs;
          } else if (typeof FormData !== 'undefined' && functionArgs instanceof FormData) {
            // don't set content-type headers
            // Request will automatically add the right boundary value
            body = functionArgs;
          } else {
            // default, assume this is JSON
            _headers['Content-Type'] = 'application/json';
            body = JSON.stringify(functionArgs);
          }
        }
        const response = yield this.fetch(`${this.url}/${functionName}`, {
          method: method || 'POST',
          // headers priority is (high to low):
          // 1. invoke-level headers
          // 2. client-level headers
          // 3. default Content-Type header
          headers: Object.assign(Object.assign(Object.assign({}, _headers), this.headers), headers),
          body
        }).catch(fetchError => {
          throw new _types.FunctionsFetchError(fetchError);
        });
        const isRelayError = response.headers.get('x-relay-error');
        if (isRelayError && isRelayError === 'true') {
          throw new _types.FunctionsRelayError(response);
        }
        if (!response.ok) {
          throw new _types.FunctionsHttpError(response);
        }
        let responseType = ((_a = response.headers.get('Content-Type')) !== null && _a !== void 0 ? _a : 'text/plain').split(';')[0].trim();
        let data;
        if (responseType === 'application/json') {
          data = yield response.json();
        } else if (responseType === 'application/octet-stream') {
          data = yield response.blob();
        } else if (responseType === 'text/event-stream') {
          data = response;
        } else if (responseType === 'multipart/form-data') {
          data = yield response.formData();
        } else {
          // default to text
          data = yield response.text();
        }
        return {
          data,
          error: null
        };
      } catch (error) {
        return {
          data: null,
          error
        };
      }
    });
  }
}
exports.FunctionsClient = FunctionsClient;
},{"./helper":"node_modules/@supabase/functions-js/dist/module/helper.js","./types":"node_modules/@supabase/functions-js/dist/module/types.js"}],"node_modules/@supabase/functions-js/dist/module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "FunctionRegion", {
  enumerable: true,
  get: function () {
    return _types.FunctionRegion;
  }
});
Object.defineProperty(exports, "FunctionsClient", {
  enumerable: true,
  get: function () {
    return _FunctionsClient.FunctionsClient;
  }
});
Object.defineProperty(exports, "FunctionsError", {
  enumerable: true,
  get: function () {
    return _types.FunctionsError;
  }
});
Object.defineProperty(exports, "FunctionsFetchError", {
  enumerable: true,
  get: function () {
    return _types.FunctionsFetchError;
  }
});
Object.defineProperty(exports, "FunctionsHttpError", {
  enumerable: true,
  get: function () {
    return _types.FunctionsHttpError;
  }
});
Object.defineProperty(exports, "FunctionsRelayError", {
  enumerable: true,
  get: function () {
    return _types.FunctionsRelayError;
  }
});
var _FunctionsClient = require("./FunctionsClient");
var _types = require("./types");
},{"./FunctionsClient":"node_modules/@supabase/functions-js/dist/module/FunctionsClient.js","./types":"node_modules/@supabase/functions-js/dist/module/types.js"}],"node_modules/@supabase/postgrest-js/dist/module/PostgrestError.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
class PostgrestError extends Error {
  constructor(context) {
    super(context.message);
    this.name = 'PostgrestError';
    this.details = context.details;
    this.hint = context.hint;
    this.code = context.code;
  }
}
exports.default = PostgrestError;
},{}],"node_modules/@supabase/postgrest-js/dist/module/PostgrestBuilder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _nodeFetch = _interopRequireDefault(require("@supabase/node-fetch"));
var _PostgrestError = _interopRequireDefault(require("./PostgrestError"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
// @ts-ignore

class PostgrestBuilder {
  constructor(builder) {
    this.shouldThrowOnError = false;
    this.method = builder.method;
    this.url = builder.url;
    this.headers = builder.headers;
    this.schema = builder.schema;
    this.body = builder.body;
    this.shouldThrowOnError = builder.shouldThrowOnError;
    this.signal = builder.signal;
    this.isMaybeSingle = builder.isMaybeSingle;
    if (builder.fetch) {
      this.fetch = builder.fetch;
    } else if (typeof fetch === 'undefined') {
      this.fetch = _nodeFetch.default;
    } else {
      this.fetch = fetch;
    }
  }
  /**
   * If there's an error with the query, throwOnError will reject the promise by
   * throwing the error instead of returning it as part of a successful response.
   *
   * {@link https://github.com/supabase/supabase-js/issues/92}
   */
  throwOnError() {
    this.shouldThrowOnError = true;
    return this;
  }
  then(onfulfilled, onrejected) {
    // https://postgrest.org/en/stable/api.html#switching-schemas
    if (this.schema === undefined) {
      // skip
    } else if (['GET', 'HEAD'].includes(this.method)) {
      this.headers['Accept-Profile'] = this.schema;
    } else {
      this.headers['Content-Profile'] = this.schema;
    }
    if (this.method !== 'GET' && this.method !== 'HEAD') {
      this.headers['Content-Type'] = 'application/json';
    }
    // NOTE: Invoke w/o `this` to avoid illegal invocation error.
    // https://github.com/supabase/postgrest-js/pull/247
    const _fetch = this.fetch;
    let res = _fetch(this.url.toString(), {
      method: this.method,
      headers: this.headers,
      body: JSON.stringify(this.body),
      signal: this.signal
    }).then(async res => {
      var _a, _b, _c;
      let error = null;
      let data = null;
      let count = null;
      let status = res.status;
      let statusText = res.statusText;
      if (res.ok) {
        if (this.method !== 'HEAD') {
          const body = await res.text();
          if (body === '') {
            // Prefer: return=minimal
          } else if (this.headers['Accept'] === 'text/csv') {
            data = body;
          } else if (this.headers['Accept'] && this.headers['Accept'].includes('application/vnd.pgrst.plan+text')) {
            data = body;
          } else {
            data = JSON.parse(body);
          }
        }
        const countHeader = (_a = this.headers['Prefer']) === null || _a === void 0 ? void 0 : _a.match(/count=(exact|planned|estimated)/);
        const contentRange = (_b = res.headers.get('content-range')) === null || _b === void 0 ? void 0 : _b.split('/');
        if (countHeader && contentRange && contentRange.length > 1) {
          count = parseInt(contentRange[1]);
        }
        // Temporary partial fix for https://github.com/supabase/postgrest-js/issues/361
        // Issue persists e.g. for `.insert([...]).select().maybeSingle()`
        if (this.isMaybeSingle && this.method === 'GET' && Array.isArray(data)) {
          if (data.length > 1) {
            error = {
              // https://github.com/PostgREST/postgrest/blob/a867d79c42419af16c18c3fb019eba8df992626f/src/PostgREST/Error.hs#L553
              code: 'PGRST116',
              details: `Results contain ${data.length} rows, application/vnd.pgrst.object+json requires 1 row`,
              hint: null,
              message: 'JSON object requested, multiple (or no) rows returned'
            };
            data = null;
            count = null;
            status = 406;
            statusText = 'Not Acceptable';
          } else if (data.length === 1) {
            data = data[0];
          } else {
            data = null;
          }
        }
      } else {
        const body = await res.text();
        try {
          error = JSON.parse(body);
          // Workaround for https://github.com/supabase/postgrest-js/issues/295
          if (Array.isArray(error) && res.status === 404) {
            data = [];
            error = null;
            status = 200;
            statusText = 'OK';
          }
        } catch (_d) {
          // Workaround for https://github.com/supabase/postgrest-js/issues/295
          if (res.status === 404 && body === '') {
            status = 204;
            statusText = 'No Content';
          } else {
            error = {
              message: body
            };
          }
        }
        if (error && this.isMaybeSingle && ((_c = error === null || error === void 0 ? void 0 : error.details) === null || _c === void 0 ? void 0 : _c.includes('0 rows'))) {
          error = null;
          status = 200;
          statusText = 'OK';
        }
        if (error && this.shouldThrowOnError) {
          throw new _PostgrestError.default(error);
        }
      }
      const postgrestResponse = {
        error,
        data,
        count,
        status,
        statusText
      };
      return postgrestResponse;
    });
    if (!this.shouldThrowOnError) {
      res = res.catch(fetchError => {
        var _a, _b, _c;
        return {
          error: {
            message: `${(_a = fetchError === null || fetchError === void 0 ? void 0 : fetchError.name) !== null && _a !== void 0 ? _a : 'FetchError'}: ${fetchError === null || fetchError === void 0 ? void 0 : fetchError.message}`,
            details: `${(_b = fetchError === null || fetchError === void 0 ? void 0 : fetchError.stack) !== null && _b !== void 0 ? _b : ''}`,
            hint: '',
            code: `${(_c = fetchError === null || fetchError === void 0 ? void 0 : fetchError.code) !== null && _c !== void 0 ? _c : ''}`
          },
          data: null,
          count: null,
          status: 0,
          statusText: ''
        };
      });
    }
    return res.then(onfulfilled, onrejected);
  }
}
exports.default = PostgrestBuilder;
},{"@supabase/node-fetch":"node_modules/@supabase/node-fetch/browser.js","./PostgrestError":"node_modules/@supabase/postgrest-js/dist/module/PostgrestError.js"}],"node_modules/@supabase/postgrest-js/dist/module/PostgrestTransformBuilder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PostgrestBuilder = _interopRequireDefault(require("./PostgrestBuilder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class PostgrestTransformBuilder extends _PostgrestBuilder.default {
  /**
   * Perform a SELECT on the query result.
   *
   * By default, `.insert()`, `.update()`, `.upsert()`, and `.delete()` do not
   * return modified rows. By calling this method, modified rows are returned in
   * `data`.
   *
   * @param columns - The columns to retrieve, separated by commas
   */
  select(columns) {
    // Remove whitespaces except when quoted
    let quoted = false;
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : '*').split('').map(c => {
      if (/\s/.test(c) && !quoted) {
        return '';
      }
      if (c === '"') {
        quoted = !quoted;
      }
      return c;
    }).join('');
    this.url.searchParams.set('select', cleanedColumns);
    if (this.headers['Prefer']) {
      this.headers['Prefer'] += ',';
    }
    this.headers['Prefer'] += 'return=representation';
    return this;
  }
  /**
   * Order the query result by `column`.
   *
   * You can call this method multiple times to order by multiple columns.
   *
   * You can order referenced tables, but it only affects the ordering of the
   * parent table if you use `!inner` in the query.
   *
   * @param column - The column to order by
   * @param options - Named parameters
   * @param options.ascending - If `true`, the result will be in ascending order
   * @param options.nullsFirst - If `true`, `null`s appear first. If `false`,
   * `null`s appear last.
   * @param options.referencedTable - Set this to order a referenced table by
   * its columns
   * @param options.foreignTable - Deprecated, use `options.referencedTable`
   * instead
   */
  order(column, {
    ascending = true,
    nullsFirst,
    foreignTable,
    referencedTable = foreignTable
  } = {}) {
    const key = referencedTable ? `${referencedTable}.order` : 'order';
    const existingOrder = this.url.searchParams.get(key);
    this.url.searchParams.set(key, `${existingOrder ? `${existingOrder},` : ''}${column}.${ascending ? 'asc' : 'desc'}${nullsFirst === undefined ? '' : nullsFirst ? '.nullsfirst' : '.nullslast'}`);
    return this;
  }
  /**
   * Limit the query result by `count`.
   *
   * @param count - The maximum number of rows to return
   * @param options - Named parameters
   * @param options.referencedTable - Set this to limit rows of referenced
   * tables instead of the parent table
   * @param options.foreignTable - Deprecated, use `options.referencedTable`
   * instead
   */
  limit(count, {
    foreignTable,
    referencedTable = foreignTable
  } = {}) {
    const key = typeof referencedTable === 'undefined' ? 'limit' : `${referencedTable}.limit`;
    this.url.searchParams.set(key, `${count}`);
    return this;
  }
  /**
   * Limit the query result by starting at an offset (`from`) and ending at the offset (`from + to`).
   * Only records within this range are returned.
   * This respects the query order and if there is no order clause the range could behave unexpectedly.
   * The `from` and `to` values are 0-based and inclusive: `range(1, 3)` will include the second, third
   * and fourth rows of the query.
   *
   * @param from - The starting index from which to limit the result
   * @param to - The last index to which to limit the result
   * @param options - Named parameters
   * @param options.referencedTable - Set this to limit rows of referenced
   * tables instead of the parent table
   * @param options.foreignTable - Deprecated, use `options.referencedTable`
   * instead
   */
  range(from, to, {
    foreignTable,
    referencedTable = foreignTable
  } = {}) {
    const keyOffset = typeof referencedTable === 'undefined' ? 'offset' : `${referencedTable}.offset`;
    const keyLimit = typeof referencedTable === 'undefined' ? 'limit' : `${referencedTable}.limit`;
    this.url.searchParams.set(keyOffset, `${from}`);
    // Range is inclusive, so add 1
    this.url.searchParams.set(keyLimit, `${to - from + 1}`);
    return this;
  }
  /**
   * Set the AbortSignal for the fetch request.
   *
   * @param signal - The AbortSignal to use for the fetch request
   */
  abortSignal(signal) {
    this.signal = signal;
    return this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be one row (e.g. using `.limit(1)`), otherwise this
   * returns an error.
   */
  single() {
    this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    return this;
  }
  /**
   * Return `data` as a single object instead of an array of objects.
   *
   * Query result must be zero or one row (e.g. using `.limit(1)`), otherwise
   * this returns an error.
   */
  maybeSingle() {
    // Temporary partial fix for https://github.com/supabase/postgrest-js/issues/361
    // Issue persists e.g. for `.insert([...]).select().maybeSingle()`
    if (this.method === 'GET') {
      this.headers['Accept'] = 'application/json';
    } else {
      this.headers['Accept'] = 'application/vnd.pgrst.object+json';
    }
    this.isMaybeSingle = true;
    return this;
  }
  /**
   * Return `data` as a string in CSV format.
   */
  csv() {
    this.headers['Accept'] = 'text/csv';
    return this;
  }
  /**
   * Return `data` as an object in [GeoJSON](https://geojson.org) format.
   */
  geojson() {
    this.headers['Accept'] = 'application/geo+json';
    return this;
  }
  /**
   * Return `data` as the EXPLAIN plan for the query.
   *
   * You need to enable the
   * [db_plan_enabled](https://supabase.com/docs/guides/database/debugging-performance#enabling-explain)
   * setting before using this method.
   *
   * @param options - Named parameters
   *
   * @param options.analyze - If `true`, the query will be executed and the
   * actual run time will be returned
   *
   * @param options.verbose - If `true`, the query identifier will be returned
   * and `data` will include the output columns of the query
   *
   * @param options.settings - If `true`, include information on configuration
   * parameters that affect query planning
   *
   * @param options.buffers - If `true`, include information on buffer usage
   *
   * @param options.wal - If `true`, include information on WAL record generation
   *
   * @param options.format - The format of the output, can be `"text"` (default)
   * or `"json"`
   */
  explain({
    analyze = false,
    verbose = false,
    settings = false,
    buffers = false,
    wal = false,
    format = 'text'
  } = {}) {
    var _a;
    const options = [analyze ? 'analyze' : null, verbose ? 'verbose' : null, settings ? 'settings' : null, buffers ? 'buffers' : null, wal ? 'wal' : null].filter(Boolean).join('|');
    // An Accept header can carry multiple media types but postgrest-js always sends one
    const forMediatype = (_a = this.headers['Accept']) !== null && _a !== void 0 ? _a : 'application/json';
    this.headers['Accept'] = `application/vnd.pgrst.plan+${format}; for="${forMediatype}"; options=${options};`;
    if (format === 'json') return this;else return this;
  }
  /**
   * Rollback the query.
   *
   * `data` will still be returned, but the query is not committed.
   */
  rollback() {
    var _a;
    if (((_a = this.headers['Prefer']) !== null && _a !== void 0 ? _a : '').trim().length > 0) {
      this.headers['Prefer'] += ',tx=rollback';
    } else {
      this.headers['Prefer'] = 'tx=rollback';
    }
    return this;
  }
  /**
   * Override the type of the returned `data`.
   *
   * @typeParam NewResult - The new result type to override with
   */
  returns() {
    return this;
  }
}
exports.default = PostgrestTransformBuilder;
},{"./PostgrestBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestBuilder.js"}],"node_modules/@supabase/postgrest-js/dist/module/PostgrestFilterBuilder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PostgrestTransformBuilder = _interopRequireDefault(require("./PostgrestTransformBuilder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class PostgrestFilterBuilder extends _PostgrestTransformBuilder.default {
  /**
   * Match only rows where `column` is equal to `value`.
   *
   * To check if the value of `column` is NULL, you should use `.is()` instead.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  eq(column, value) {
    this.url.searchParams.append(column, `eq.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is not equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  neq(column, value) {
    this.url.searchParams.append(column, `neq.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is greater than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gt(column, value) {
    this.url.searchParams.append(column, `gt.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is greater than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  gte(column, value) {
    this.url.searchParams.append(column, `gte.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is less than `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lt(column, value) {
    this.url.searchParams.append(column, `lt.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is less than or equal to `value`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  lte(column, value) {
    this.url.searchParams.append(column, `lte.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-sensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  like(column, pattern) {
    this.url.searchParams.append(column, `like.${pattern}`);
    return this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAllOf(column, patterns) {
    this.url.searchParams.append(column, `like(all).{${patterns.join(',')}}`);
    return this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-sensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  likeAnyOf(column, patterns) {
    this.url.searchParams.append(column, `like(any).{${patterns.join(',')}}`);
    return this;
  }
  /**
   * Match only rows where `column` matches `pattern` case-insensitively.
   *
   * @param column - The column to filter on
   * @param pattern - The pattern to match with
   */
  ilike(column, pattern) {
    this.url.searchParams.append(column, `ilike.${pattern}`);
    return this;
  }
  /**
   * Match only rows where `column` matches all of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAllOf(column, patterns) {
    this.url.searchParams.append(column, `ilike(all).{${patterns.join(',')}}`);
    return this;
  }
  /**
   * Match only rows where `column` matches any of `patterns` case-insensitively.
   *
   * @param column - The column to filter on
   * @param patterns - The patterns to match with
   */
  ilikeAnyOf(column, patterns) {
    this.url.searchParams.append(column, `ilike(any).{${patterns.join(',')}}`);
    return this;
  }
  /**
   * Match only rows where `column` IS `value`.
   *
   * For non-boolean columns, this is only relevant for checking if the value of
   * `column` is NULL by setting `value` to `null`.
   *
   * For boolean columns, you can also set `value` to `true` or `false` and it
   * will behave the same way as `.eq()`.
   *
   * @param column - The column to filter on
   * @param value - The value to filter with
   */
  is(column, value) {
    this.url.searchParams.append(column, `is.${value}`);
    return this;
  }
  /**
   * Match only rows where `column` is included in the `values` array.
   *
   * @param column - The column to filter on
   * @param values - The values array to filter with
   */
  in(column, values) {
    const cleanedValues = Array.from(new Set(values)).map(s => {
      // handle postgrest reserved characters
      // https://postgrest.org/en/v7.0.0/api.html#reserved-characters
      if (typeof s === 'string' && new RegExp('[,()]').test(s)) return `"${s}"`;else return `${s}`;
    }).join(',');
    this.url.searchParams.append(column, `in.(${cleanedValues})`);
    return this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * `column` contains every element appearing in `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  contains(column, value) {
    if (typeof value === 'string') {
      // range types can be inclusive '[', ']' or exclusive '(', ')' so just
      // keep it simple and accept a string
      this.url.searchParams.append(column, `cs.${value}`);
    } else if (Array.isArray(value)) {
      // array
      this.url.searchParams.append(column, `cs.{${value.join(',')}}`);
    } else {
      // json
      this.url.searchParams.append(column, `cs.${JSON.stringify(value)}`);
    }
    return this;
  }
  /**
   * Only relevant for jsonb, array, and range columns. Match only rows where
   * every element appearing in `column` is contained by `value`.
   *
   * @param column - The jsonb, array, or range column to filter on
   * @param value - The jsonb, array, or range value to filter with
   */
  containedBy(column, value) {
    if (typeof value === 'string') {
      // range
      this.url.searchParams.append(column, `cd.${value}`);
    } else if (Array.isArray(value)) {
      // array
      this.url.searchParams.append(column, `cd.{${value.join(',')}}`);
    } else {
      // json
      this.url.searchParams.append(column, `cd.${JSON.stringify(value)}`);
    }
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is greater than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGt(column, range) {
    this.url.searchParams.append(column, `sr.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or greater than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeGte(column, range) {
    this.url.searchParams.append(column, `nxl.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is less than any element in `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLt(column, range) {
    this.url.searchParams.append(column, `sl.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where every element in
   * `column` is either contained in `range` or less than any element in
   * `range`.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeLte(column, range) {
    this.url.searchParams.append(column, `nxr.${range}`);
    return this;
  }
  /**
   * Only relevant for range columns. Match only rows where `column` is
   * mutually exclusive to `range` and there can be no element between the two
   * ranges.
   *
   * @param column - The range column to filter on
   * @param range - The range to filter with
   */
  rangeAdjacent(column, range) {
    this.url.searchParams.append(column, `adj.${range}`);
    return this;
  }
  /**
   * Only relevant for array and range columns. Match only rows where
   * `column` and `value` have an element in common.
   *
   * @param column - The array or range column to filter on
   * @param value - The array or range value to filter with
   */
  overlaps(column, value) {
    if (typeof value === 'string') {
      // range
      this.url.searchParams.append(column, `ov.${value}`);
    } else {
      // array
      this.url.searchParams.append(column, `ov.{${value.join(',')}}`);
    }
    return this;
  }
  /**
   * Only relevant for text and tsvector columns. Match only rows where
   * `column` matches the query string in `query`.
   *
   * @param column - The text or tsvector column to filter on
   * @param query - The query text to match with
   * @param options - Named parameters
   * @param options.config - The text search configuration to use
   * @param options.type - Change how the `query` text is interpreted
   */
  textSearch(column, query, {
    config,
    type
  } = {}) {
    let typePart = '';
    if (type === 'plain') {
      typePart = 'pl';
    } else if (type === 'phrase') {
      typePart = 'ph';
    } else if (type === 'websearch') {
      typePart = 'w';
    }
    const configPart = config === undefined ? '' : `(${config})`;
    this.url.searchParams.append(column, `${typePart}fts${configPart}.${query}`);
    return this;
  }
  /**
   * Match only rows where each column in `query` keys is equal to its
   * associated value. Shorthand for multiple `.eq()`s.
   *
   * @param query - The object to filter with, with column names as keys mapped
   * to their filter values
   */
  match(query) {
    Object.entries(query).forEach(([column, value]) => {
      this.url.searchParams.append(column, `eq.${value}`);
    });
    return this;
  }
  /**
   * Match only rows which doesn't satisfy the filter.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to be negated to filter with, following
   * PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  not(column, operator, value) {
    this.url.searchParams.append(column, `not.${operator}.${value}`);
    return this;
  }
  /**
   * Match only rows which satisfy at least one of the filters.
   *
   * Unlike most filters, `filters` is used as-is and needs to follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure it's properly sanitized.
   *
   * It's currently not possible to do an `.or()` filter across multiple tables.
   *
   * @param filters - The filters to use, following PostgREST syntax
   * @param options - Named parameters
   * @param options.referencedTable - Set this to filter on referenced tables
   * instead of the parent table
   * @param options.foreignTable - Deprecated, use `referencedTable` instead
   */
  or(filters, {
    foreignTable,
    referencedTable = foreignTable
  } = {}) {
    const key = referencedTable ? `${referencedTable}.or` : 'or';
    this.url.searchParams.append(key, `(${filters})`);
    return this;
  }
  /**
   * Match only rows which satisfy the filter. This is an escape hatch - you
   * should use the specific filter methods wherever possible.
   *
   * Unlike most filters, `opearator` and `value` are used as-is and need to
   * follow [PostgREST
   * syntax](https://postgrest.org/en/stable/api.html#operators). You also need
   * to make sure they are properly sanitized.
   *
   * @param column - The column to filter on
   * @param operator - The operator to filter with, following PostgREST syntax
   * @param value - The value to filter with, following PostgREST syntax
   */
  filter(column, operator, value) {
    this.url.searchParams.append(column, `${operator}.${value}`);
    return this;
  }
}
exports.default = PostgrestFilterBuilder;
},{"./PostgrestTransformBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestTransformBuilder.js"}],"node_modules/@supabase/postgrest-js/dist/module/PostgrestQueryBuilder.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PostgrestFilterBuilder = _interopRequireDefault(require("./PostgrestFilterBuilder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class PostgrestQueryBuilder {
  constructor(url, {
    headers = {},
    schema,
    fetch
  }) {
    this.url = url;
    this.headers = headers;
    this.schema = schema;
    this.fetch = fetch;
  }
  /**
   * Perform a SELECT query on the table or view.
   *
   * @param columns - The columns to retrieve, separated by commas. Columns can be renamed when returned with `customName:columnName`
   *
   * @param options - Named parameters
   *
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   *
   * @param options.count - Count algorithm to use to count rows in the table or view.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  select(columns, {
    head = false,
    count
  } = {}) {
    const method = head ? 'HEAD' : 'GET';
    // Remove whitespaces except when quoted
    let quoted = false;
    const cleanedColumns = (columns !== null && columns !== void 0 ? columns : '*').split('').map(c => {
      if (/\s/.test(c) && !quoted) {
        return '';
      }
      if (c === '"') {
        quoted = !quoted;
      }
      return c;
    }).join('');
    this.url.searchParams.set('select', cleanedColumns);
    if (count) {
      this.headers['Prefer'] = `count=${count}`;
    }
    return new _PostgrestFilterBuilder.default({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform an INSERT into the table or view.
   *
   * By default, inserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to insert. Pass an object to insert a single row
   * or an array to insert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count inserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   *
   * @param options.defaultToNull - Make missing fields default to `null`.
   * Otherwise, use the default value for the column. Only applies for bulk
   * inserts.
   */
  insert(values, {
    count,
    defaultToNull = true
  } = {}) {
    const method = 'POST';
    const prefersHeaders = [];
    if (this.headers['Prefer']) {
      prefersHeaders.push(this.headers['Prefer']);
    }
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    if (!defaultToNull) {
      prefersHeaders.push('missing=default');
    }
    this.headers['Prefer'] = prefersHeaders.join(',');
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map(column => `"${column}"`);
        this.url.searchParams.set('columns', uniqueColumns.join(','));
      }
    }
    return new _PostgrestFilterBuilder.default({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform an UPSERT on the table or view. Depending on the column(s) passed
   * to `onConflict`, `.upsert()` allows you to perform the equivalent of
   * `.insert()` if a row with the corresponding `onConflict` columns doesn't
   * exist, or if it does exist, perform an alternative action depending on
   * `ignoreDuplicates`.
   *
   * By default, upserted rows are not returned. To return it, chain the call
   * with `.select()`.
   *
   * @param values - The values to upsert with. Pass an object to upsert a
   * single row or an array to upsert multiple rows.
   *
   * @param options - Named parameters
   *
   * @param options.onConflict - Comma-separated UNIQUE column(s) to specify how
   * duplicate rows are determined. Two rows are duplicates if all the
   * `onConflict` columns are equal.
   *
   * @param options.ignoreDuplicates - If `true`, duplicate rows are ignored. If
   * `false`, duplicate rows are merged with existing rows.
   *
   * @param options.count - Count algorithm to use to count upserted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   *
   * @param options.defaultToNull - Make missing fields default to `null`.
   * Otherwise, use the default value for the column. This only applies when
   * inserting new rows, not when merging with existing rows under
   * `ignoreDuplicates: false`. This also only applies when doing bulk upserts.
   */
  upsert(values, {
    onConflict,
    ignoreDuplicates = false,
    count,
    defaultToNull = true
  } = {}) {
    const method = 'POST';
    const prefersHeaders = [`resolution=${ignoreDuplicates ? 'ignore' : 'merge'}-duplicates`];
    if (onConflict !== undefined) this.url.searchParams.set('on_conflict', onConflict);
    if (this.headers['Prefer']) {
      prefersHeaders.push(this.headers['Prefer']);
    }
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    if (!defaultToNull) {
      prefersHeaders.push('missing=default');
    }
    this.headers['Prefer'] = prefersHeaders.join(',');
    if (Array.isArray(values)) {
      const columns = values.reduce((acc, x) => acc.concat(Object.keys(x)), []);
      if (columns.length > 0) {
        const uniqueColumns = [...new Set(columns)].map(column => `"${column}"`);
        this.url.searchParams.set('columns', uniqueColumns.join(','));
      }
    }
    return new _PostgrestFilterBuilder.default({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform an UPDATE on the table or view.
   *
   * By default, updated rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param values - The values to update with
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count updated rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  update(values, {
    count
  } = {}) {
    const method = 'PATCH';
    const prefersHeaders = [];
    if (this.headers['Prefer']) {
      prefersHeaders.push(this.headers['Prefer']);
    }
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    this.headers['Prefer'] = prefersHeaders.join(',');
    return new _PostgrestFilterBuilder.default({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      body: values,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
  /**
   * Perform a DELETE on the table or view.
   *
   * By default, deleted rows are not returned. To return it, chain the call
   * with `.select()` after filters.
   *
   * @param options - Named parameters
   *
   * @param options.count - Count algorithm to use to count deleted rows.
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  delete({
    count
  } = {}) {
    const method = 'DELETE';
    const prefersHeaders = [];
    if (count) {
      prefersHeaders.push(`count=${count}`);
    }
    if (this.headers['Prefer']) {
      prefersHeaders.unshift(this.headers['Prefer']);
    }
    this.headers['Prefer'] = prefersHeaders.join(',');
    return new _PostgrestFilterBuilder.default({
      method,
      url: this.url,
      headers: this.headers,
      schema: this.schema,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
}
exports.default = PostgrestQueryBuilder;
},{"./PostgrestFilterBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestFilterBuilder.js"}],"node_modules/@supabase/postgrest-js/dist/module/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;
const version = exports.version = '1.15.2';
},{}],"node_modules/@supabase/postgrest-js/dist/module/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_HEADERS = void 0;
var _version = require("./version");
const DEFAULT_HEADERS = exports.DEFAULT_HEADERS = {
  'X-Client-Info': `postgrest-js/${_version.version}`
};
},{"./version":"node_modules/@supabase/postgrest-js/dist/module/version.js"}],"node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _PostgrestQueryBuilder = _interopRequireDefault(require("./PostgrestQueryBuilder"));
var _PostgrestFilterBuilder = _interopRequireDefault(require("./PostgrestFilterBuilder"));
var _constants = require("./constants");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * PostgREST client.
 *
 * @typeParam Database - Types for the schema from the [type
 * generator](https://supabase.com/docs/reference/javascript/next/typescript-support)
 *
 * @typeParam SchemaName - Postgres schema to switch to. Must be a string
 * literal, the same one passed to the constructor. If the schema is not
 * `"public"`, this must be supplied manually.
 */
class PostgrestClient {
  // TODO: Add back shouldThrowOnError once we figure out the typings
  /**
   * Creates a PostgREST client.
   *
   * @param url - URL of the PostgREST endpoint
   * @param options - Named parameters
   * @param options.headers - Custom headers
   * @param options.schema - Postgres schema to switch to
   * @param options.fetch - Custom fetch
   */
  constructor(url, {
    headers = {},
    schema,
    fetch
  } = {}) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, _constants.DEFAULT_HEADERS), headers);
    this.schemaName = schema;
    this.fetch = fetch;
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    const url = new URL(`${this.url}/${relation}`);
    return new _PostgrestQueryBuilder.default(url, {
      headers: Object.assign({}, this.headers),
      schema: this.schemaName,
      fetch: this.fetch
    });
  }
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return new PostgrestClient(this.url, {
      headers: this.headers,
      schema,
      fetch: this.fetch
    });
  }
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, {
    head = false,
    get = false,
    count
  } = {}) {
    let method;
    const url = new URL(`${this.url}/rpc/${fn}`);
    let body;
    if (head || get) {
      method = head ? 'HEAD' : 'GET';
      Object.entries(args)
      // params with undefined value needs to be filtered out, otherwise it'll
      // show up as `?param=undefined`
      .filter(([_, value]) => value !== undefined)
      // array values need special syntax
      .map(([name, value]) => [name, Array.isArray(value) ? `{${value.join(',')}}` : `${value}`]).forEach(([name, value]) => {
        url.searchParams.append(name, value);
      });
    } else {
      method = 'POST';
      body = args;
    }
    const headers = Object.assign({}, this.headers);
    if (count) {
      headers['Prefer'] = `count=${count}`;
    }
    return new _PostgrestFilterBuilder.default({
      method,
      url,
      headers,
      schema: this.schemaName,
      body,
      fetch: this.fetch,
      allowEmpty: false
    });
  }
}
exports.default = PostgrestClient;
},{"./PostgrestQueryBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestQueryBuilder.js","./PostgrestFilterBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestFilterBuilder.js","./constants":"node_modules/@supabase/postgrest-js/dist/module/constants.js"}],"node_modules/@supabase/postgrest-js/dist/module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "PostgrestBuilder", {
  enumerable: true,
  get: function () {
    return _PostgrestBuilder.default;
  }
});
Object.defineProperty(exports, "PostgrestClient", {
  enumerable: true,
  get: function () {
    return _PostgrestClient.default;
  }
});
Object.defineProperty(exports, "PostgrestFilterBuilder", {
  enumerable: true,
  get: function () {
    return _PostgrestFilterBuilder.default;
  }
});
Object.defineProperty(exports, "PostgrestQueryBuilder", {
  enumerable: true,
  get: function () {
    return _PostgrestQueryBuilder.default;
  }
});
Object.defineProperty(exports, "PostgrestTransformBuilder", {
  enumerable: true,
  get: function () {
    return _PostgrestTransformBuilder.default;
  }
});
var _PostgrestClient = _interopRequireDefault(require("./PostgrestClient"));
var _PostgrestQueryBuilder = _interopRequireDefault(require("./PostgrestQueryBuilder"));
var _PostgrestFilterBuilder = _interopRequireDefault(require("./PostgrestFilterBuilder"));
var _PostgrestTransformBuilder = _interopRequireDefault(require("./PostgrestTransformBuilder"));
var _PostgrestBuilder = _interopRequireDefault(require("./PostgrestBuilder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./PostgrestClient":"node_modules/@supabase/postgrest-js/dist/module/PostgrestClient.js","./PostgrestQueryBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestQueryBuilder.js","./PostgrestFilterBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestFilterBuilder.js","./PostgrestTransformBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestTransformBuilder.js","./PostgrestBuilder":"node_modules/@supabase/postgrest-js/dist/module/PostgrestBuilder.js"}],"node_modules/@supabase/realtime-js/dist/module/lib/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;
const version = exports.version = '2.9.5';
},{}],"node_modules/@supabase/realtime-js/dist/module/lib/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WS_CLOSE_NORMAL = exports.VSN = exports.TRANSPORTS = exports.SOCKET_STATES = exports.DEFAULT_TIMEOUT = exports.DEFAULT_HEADERS = exports.CONNECTION_STATE = exports.CHANNEL_STATES = exports.CHANNEL_EVENTS = void 0;
var _version = require("./version");
const DEFAULT_HEADERS = exports.DEFAULT_HEADERS = {
  'X-Client-Info': `realtime-js/${_version.version}`
};
const VSN = exports.VSN = '1.0.0';
const DEFAULT_TIMEOUT = exports.DEFAULT_TIMEOUT = 10000;
const WS_CLOSE_NORMAL = exports.WS_CLOSE_NORMAL = 1000;
var SOCKET_STATES;
(function (SOCKET_STATES) {
  SOCKET_STATES[SOCKET_STATES["connecting"] = 0] = "connecting";
  SOCKET_STATES[SOCKET_STATES["open"] = 1] = "open";
  SOCKET_STATES[SOCKET_STATES["closing"] = 2] = "closing";
  SOCKET_STATES[SOCKET_STATES["closed"] = 3] = "closed";
})(SOCKET_STATES || (exports.SOCKET_STATES = SOCKET_STATES = {}));
var CHANNEL_STATES;
(function (CHANNEL_STATES) {
  CHANNEL_STATES["closed"] = "closed";
  CHANNEL_STATES["errored"] = "errored";
  CHANNEL_STATES["joined"] = "joined";
  CHANNEL_STATES["joining"] = "joining";
  CHANNEL_STATES["leaving"] = "leaving";
})(CHANNEL_STATES || (exports.CHANNEL_STATES = CHANNEL_STATES = {}));
var CHANNEL_EVENTS;
(function (CHANNEL_EVENTS) {
  CHANNEL_EVENTS["close"] = "phx_close";
  CHANNEL_EVENTS["error"] = "phx_error";
  CHANNEL_EVENTS["join"] = "phx_join";
  CHANNEL_EVENTS["reply"] = "phx_reply";
  CHANNEL_EVENTS["leave"] = "phx_leave";
  CHANNEL_EVENTS["access_token"] = "access_token";
})(CHANNEL_EVENTS || (exports.CHANNEL_EVENTS = CHANNEL_EVENTS = {}));
var TRANSPORTS;
(function (TRANSPORTS) {
  TRANSPORTS["websocket"] = "websocket";
})(TRANSPORTS || (exports.TRANSPORTS = TRANSPORTS = {}));
var CONNECTION_STATE;
(function (CONNECTION_STATE) {
  CONNECTION_STATE["Connecting"] = "connecting";
  CONNECTION_STATE["Open"] = "open";
  CONNECTION_STATE["Closing"] = "closing";
  CONNECTION_STATE["Closed"] = "closed";
})(CONNECTION_STATE || (exports.CONNECTION_STATE = CONNECTION_STATE = {}));
},{"./version":"node_modules/@supabase/realtime-js/dist/module/lib/version.js"}],"node_modules/@supabase/realtime-js/dist/module/lib/timer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
/**
 * Creates a timer that accepts a `timerCalc` function to perform calculated timeout retries, such as exponential backoff.
 *
 * @example
 *    let reconnectTimer = new Timer(() => this.connect(), function(tries){
 *      return [1000, 5000, 10000][tries - 1] || 10000
 *    })
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 *    reconnectTimer.scheduleTimeout() // fires after 5000
 *    reconnectTimer.reset()
 *    reconnectTimer.scheduleTimeout() // fires after 1000
 */
class Timer {
  constructor(callback, timerCalc) {
    this.callback = callback;
    this.timerCalc = timerCalc;
    this.timer = undefined;
    this.tries = 0;
    this.callback = callback;
    this.timerCalc = timerCalc;
  }
  reset() {
    this.tries = 0;
    clearTimeout(this.timer);
  }
  // Cancels any previous scheduleTimeout and schedules callback
  scheduleTimeout() {
    clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.tries = this.tries + 1;
      this.callback();
    }, this.timerCalc(this.tries + 1));
  }
}
exports.default = Timer;
},{}],"node_modules/@supabase/realtime-js/dist/module/lib/serializer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// This file draws heavily from https://github.com/phoenixframework/phoenix/commit/cf098e9cf7a44ee6479d31d911a97d3c7430c6fe
// License: https://github.com/phoenixframework/phoenix/blob/master/LICENSE.md
class Serializer {
  constructor() {
    this.HEADER_LENGTH = 1;
  }
  decode(rawPayload, callback) {
    if (rawPayload.constructor === ArrayBuffer) {
      return callback(this._binaryDecode(rawPayload));
    }
    if (typeof rawPayload === 'string') {
      return callback(JSON.parse(rawPayload));
    }
    return callback({});
  }
  _binaryDecode(buffer) {
    const view = new DataView(buffer);
    const decoder = new TextDecoder();
    return this._decodeBroadcast(buffer, view, decoder);
  }
  _decodeBroadcast(buffer, view, decoder) {
    const topicSize = view.getUint8(1);
    const eventSize = view.getUint8(2);
    let offset = this.HEADER_LENGTH + 2;
    const topic = decoder.decode(buffer.slice(offset, offset + topicSize));
    offset = offset + topicSize;
    const event = decoder.decode(buffer.slice(offset, offset + eventSize));
    offset = offset + eventSize;
    const data = JSON.parse(decoder.decode(buffer.slice(offset, buffer.byteLength)));
    return {
      ref: null,
      topic: topic,
      event: event,
      payload: data
    };
  }
}
exports.default = Serializer;
},{}],"node_modules/@supabase/realtime-js/dist/module/lib/push.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../lib/constants");
class Push {
  /**
   * Initializes the Push
   *
   * @param channel The Channel
   * @param event The event, for example `"phx_join"`
   * @param payload The payload, for example `{user_id: 123}`
   * @param timeout The push timeout in milliseconds
   */
  constructor(channel, event, payload = {}, timeout = _constants.DEFAULT_TIMEOUT) {
    this.channel = channel;
    this.event = event;
    this.payload = payload;
    this.timeout = timeout;
    this.sent = false;
    this.timeoutTimer = undefined;
    this.ref = '';
    this.receivedResp = null;
    this.recHooks = [];
    this.refEvent = null;
  }
  resend(timeout) {
    this.timeout = timeout;
    this._cancelRefEvent();
    this.ref = '';
    this.refEvent = null;
    this.receivedResp = null;
    this.sent = false;
    this.send();
  }
  send() {
    if (this._hasReceived('timeout')) {
      return;
    }
    this.startTimeout();
    this.sent = true;
    this.channel.socket.push({
      topic: this.channel.topic,
      event: this.event,
      payload: this.payload,
      ref: this.ref,
      join_ref: this.channel._joinRef()
    });
  }
  updatePayload(payload) {
    this.payload = Object.assign(Object.assign({}, this.payload), payload);
  }
  receive(status, callback) {
    var _a;
    if (this._hasReceived(status)) {
      callback((_a = this.receivedResp) === null || _a === void 0 ? void 0 : _a.response);
    }
    this.recHooks.push({
      status,
      callback
    });
    return this;
  }
  startTimeout() {
    if (this.timeoutTimer) {
      return;
    }
    this.ref = this.channel.socket._makeRef();
    this.refEvent = this.channel._replyEventName(this.ref);
    const callback = payload => {
      this._cancelRefEvent();
      this._cancelTimeout();
      this.receivedResp = payload;
      this._matchReceive(payload);
    };
    this.channel._on(this.refEvent, {}, callback);
    this.timeoutTimer = setTimeout(() => {
      this.trigger('timeout', {});
    }, this.timeout);
  }
  trigger(status, response) {
    if (this.refEvent) this.channel._trigger(this.refEvent, {
      status,
      response
    });
  }
  destroy() {
    this._cancelRefEvent();
    this._cancelTimeout();
  }
  _cancelRefEvent() {
    if (!this.refEvent) {
      return;
    }
    this.channel._off(this.refEvent, {});
  }
  _cancelTimeout() {
    clearTimeout(this.timeoutTimer);
    this.timeoutTimer = undefined;
  }
  _matchReceive({
    status,
    response
  }) {
    this.recHooks.filter(h => h.status === status).forEach(h => h.callback(response));
  }
  _hasReceived(status) {
    return this.receivedResp && this.receivedResp.status === status;
  }
}
exports.default = Push;
},{"../lib/constants":"node_modules/@supabase/realtime-js/dist/module/lib/constants.js"}],"node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REALTIME_PRESENCE_LISTEN_EVENTS = void 0;
/*
  This file draws heavily from https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/assets/js/phoenix/presence.js
  License: https://github.com/phoenixframework/phoenix/blob/d344ec0a732ab4ee204215b31de69cf4be72e3bf/LICENSE.md
*/
var REALTIME_PRESENCE_LISTEN_EVENTS;
(function (REALTIME_PRESENCE_LISTEN_EVENTS) {
  REALTIME_PRESENCE_LISTEN_EVENTS["SYNC"] = "sync";
  REALTIME_PRESENCE_LISTEN_EVENTS["JOIN"] = "join";
  REALTIME_PRESENCE_LISTEN_EVENTS["LEAVE"] = "leave";
})(REALTIME_PRESENCE_LISTEN_EVENTS || (exports.REALTIME_PRESENCE_LISTEN_EVENTS = REALTIME_PRESENCE_LISTEN_EVENTS = {}));
class RealtimePresence {
  /**
   * Initializes the Presence.
   *
   * @param channel - The RealtimeChannel
   * @param opts - The options,
   *        for example `{events: {state: 'state', diff: 'diff'}}`
   */
  constructor(channel, opts) {
    this.channel = channel;
    this.state = {};
    this.pendingDiffs = [];
    this.joinRef = null;
    this.caller = {
      onJoin: () => {},
      onLeave: () => {},
      onSync: () => {}
    };
    const events = (opts === null || opts === void 0 ? void 0 : opts.events) || {
      state: 'presence_state',
      diff: 'presence_diff'
    };
    this.channel._on(events.state, {}, newState => {
      const {
        onJoin,
        onLeave,
        onSync
      } = this.caller;
      this.joinRef = this.channel._joinRef();
      this.state = RealtimePresence.syncState(this.state, newState, onJoin, onLeave);
      this.pendingDiffs.forEach(diff => {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
      });
      this.pendingDiffs = [];
      onSync();
    });
    this.channel._on(events.diff, {}, diff => {
      const {
        onJoin,
        onLeave,
        onSync
      } = this.caller;
      if (this.inPendingSyncState()) {
        this.pendingDiffs.push(diff);
      } else {
        this.state = RealtimePresence.syncDiff(this.state, diff, onJoin, onLeave);
        onSync();
      }
    });
    this.onJoin((key, currentPresences, newPresences) => {
      this.channel._trigger('presence', {
        event: 'join',
        key,
        currentPresences,
        newPresences
      });
    });
    this.onLeave((key, currentPresences, leftPresences) => {
      this.channel._trigger('presence', {
        event: 'leave',
        key,
        currentPresences,
        leftPresences
      });
    });
    this.onSync(() => {
      this.channel._trigger('presence', {
        event: 'sync'
      });
    });
  }
  /**
   * Used to sync the list of presences on the server with the
   * client's state.
   *
   * An optional `onJoin` and `onLeave` callback can be provided to
   * react to changes in the client's local presences across
   * disconnects and reconnects with the server.
   *
   * @internal
   */
  static syncState(currentState, newState, onJoin, onLeave) {
    const state = this.cloneDeep(currentState);
    const transformedState = this.transformState(newState);
    const joins = {};
    const leaves = {};
    this.map(state, (key, presences) => {
      if (!transformedState[key]) {
        leaves[key] = presences;
      }
    });
    this.map(transformedState, (key, newPresences) => {
      const currentPresences = state[key];
      if (currentPresences) {
        const newPresenceRefs = newPresences.map(m => m.presence_ref);
        const curPresenceRefs = currentPresences.map(m => m.presence_ref);
        const joinedPresences = newPresences.filter(m => curPresenceRefs.indexOf(m.presence_ref) < 0);
        const leftPresences = currentPresences.filter(m => newPresenceRefs.indexOf(m.presence_ref) < 0);
        if (joinedPresences.length > 0) {
          joins[key] = joinedPresences;
        }
        if (leftPresences.length > 0) {
          leaves[key] = leftPresences;
        }
      } else {
        joins[key] = newPresences;
      }
    });
    return this.syncDiff(state, {
      joins,
      leaves
    }, onJoin, onLeave);
  }
  /**
   * Used to sync a diff of presence join and leave events from the
   * server, as they happen.
   *
   * Like `syncState`, `syncDiff` accepts optional `onJoin` and
   * `onLeave` callbacks to react to a user joining or leaving from a
   * device.
   *
   * @internal
   */
  static syncDiff(state, diff, onJoin, onLeave) {
    const {
      joins,
      leaves
    } = {
      joins: this.transformState(diff.joins),
      leaves: this.transformState(diff.leaves)
    };
    if (!onJoin) {
      onJoin = () => {};
    }
    if (!onLeave) {
      onLeave = () => {};
    }
    this.map(joins, (key, newPresences) => {
      var _a;
      const currentPresences = (_a = state[key]) !== null && _a !== void 0 ? _a : [];
      state[key] = this.cloneDeep(newPresences);
      if (currentPresences.length > 0) {
        const joinedPresenceRefs = state[key].map(m => m.presence_ref);
        const curPresences = currentPresences.filter(m => joinedPresenceRefs.indexOf(m.presence_ref) < 0);
        state[key].unshift(...curPresences);
      }
      onJoin(key, currentPresences, newPresences);
    });
    this.map(leaves, (key, leftPresences) => {
      let currentPresences = state[key];
      if (!currentPresences) return;
      const presenceRefsToRemove = leftPresences.map(m => m.presence_ref);
      currentPresences = currentPresences.filter(m => presenceRefsToRemove.indexOf(m.presence_ref) < 0);
      state[key] = currentPresences;
      onLeave(key, currentPresences, leftPresences);
      if (currentPresences.length === 0) delete state[key];
    });
    return state;
  }
  /** @internal */
  static map(obj, func) {
    return Object.getOwnPropertyNames(obj).map(key => func(key, obj[key]));
  }
  /**
   * Remove 'metas' key
   * Change 'phx_ref' to 'presence_ref'
   * Remove 'phx_ref' and 'phx_ref_prev'
   *
   * @example
   * // returns {
   *  abc123: [
   *    { presence_ref: '2', user_id: 1 },
   *    { presence_ref: '3', user_id: 2 }
   *  ]
   * }
   * RealtimePresence.transformState({
   *  abc123: {
   *    metas: [
   *      { phx_ref: '2', phx_ref_prev: '1' user_id: 1 },
   *      { phx_ref: '3', user_id: 2 }
   *    ]
   *  }
   * })
   *
   * @internal
   */
  static transformState(state) {
    state = this.cloneDeep(state);
    return Object.getOwnPropertyNames(state).reduce((newState, key) => {
      const presences = state[key];
      if ('metas' in presences) {
        newState[key] = presences.metas.map(presence => {
          presence['presence_ref'] = presence['phx_ref'];
          delete presence['phx_ref'];
          delete presence['phx_ref_prev'];
          return presence;
        });
      } else {
        newState[key] = presences;
      }
      return newState;
    }, {});
  }
  /** @internal */
  static cloneDeep(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
  /** @internal */
  onJoin(callback) {
    this.caller.onJoin = callback;
  }
  /** @internal */
  onLeave(callback) {
    this.caller.onLeave = callback;
  }
  /** @internal */
  onSync(callback) {
    this.caller.onSync = callback;
  }
  /** @internal */
  inPendingSyncState() {
    return !this.joinRef || this.joinRef !== this.channel._joinRef();
  }
}
exports.default = RealtimePresence;
},{}],"node_modules/@supabase/realtime-js/dist/module/lib/transformers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.toTimestampString = exports.toNumber = exports.toJson = exports.toBoolean = exports.toArray = exports.convertColumn = exports.convertChangeData = exports.convertCell = exports.PostgresTypes = void 0;
/**
 * Helpers to convert the change Payload into native JS types.
 */
// Adapted from epgsql (src/epgsql_binary.erl), this module licensed under
// 3-clause BSD found here: https://raw.githubusercontent.com/epgsql/epgsql/devel/LICENSE
var PostgresTypes;
(function (PostgresTypes) {
  PostgresTypes["abstime"] = "abstime";
  PostgresTypes["bool"] = "bool";
  PostgresTypes["date"] = "date";
  PostgresTypes["daterange"] = "daterange";
  PostgresTypes["float4"] = "float4";
  PostgresTypes["float8"] = "float8";
  PostgresTypes["int2"] = "int2";
  PostgresTypes["int4"] = "int4";
  PostgresTypes["int4range"] = "int4range";
  PostgresTypes["int8"] = "int8";
  PostgresTypes["int8range"] = "int8range";
  PostgresTypes["json"] = "json";
  PostgresTypes["jsonb"] = "jsonb";
  PostgresTypes["money"] = "money";
  PostgresTypes["numeric"] = "numeric";
  PostgresTypes["oid"] = "oid";
  PostgresTypes["reltime"] = "reltime";
  PostgresTypes["text"] = "text";
  PostgresTypes["time"] = "time";
  PostgresTypes["timestamp"] = "timestamp";
  PostgresTypes["timestamptz"] = "timestamptz";
  PostgresTypes["timetz"] = "timetz";
  PostgresTypes["tsrange"] = "tsrange";
  PostgresTypes["tstzrange"] = "tstzrange";
})(PostgresTypes || (exports.PostgresTypes = PostgresTypes = {}));
/**
 * Takes an array of columns and an object of string values then converts each string value
 * to its mapped type.
 *
 * @param {{name: String, type: String}[]} columns
 * @param {Object} record
 * @param {Object} options The map of various options that can be applied to the mapper
 * @param {Array} options.skipTypes The array of types that should not be converted
 *
 * @example convertChangeData([{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age:'33'}, {})
 * //=>{ first_name: 'Paul', age: 33 }
 */
const convertChangeData = (columns, record, options = {}) => {
  var _a;
  const skipTypes = (_a = options.skipTypes) !== null && _a !== void 0 ? _a : [];
  return Object.keys(record).reduce((acc, rec_key) => {
    acc[rec_key] = convertColumn(rec_key, columns, record, skipTypes);
    return acc;
  }, {});
};
/**
 * Converts the value of an individual column.
 *
 * @param {String} columnName The column that you want to convert
 * @param {{name: String, type: String}[]} columns All of the columns
 * @param {Object} record The map of string values
 * @param {Array} skipTypes An array of types that should not be converted
 * @return {object} Useless information
 *
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, [])
 * //=> 33
 * @example convertColumn('age', [{name: 'first_name', type: 'text'}, {name: 'age', type: 'int4'}], {first_name: 'Paul', age: '33'}, ['int4'])
 * //=> "33"
 */
exports.convertChangeData = convertChangeData;
const convertColumn = (columnName, columns, record, skipTypes) => {
  const column = columns.find(x => x.name === columnName);
  const colType = column === null || column === void 0 ? void 0 : column.type;
  const value = record[columnName];
  if (colType && !skipTypes.includes(colType)) {
    return convertCell(colType, value);
  }
  return noop(value);
};
/**
 * If the value of the cell is `null`, returns null.
 * Otherwise converts the string value to the correct type.
 * @param {String} type A postgres column type
 * @param {String} value The cell value
 *
 * @example convertCell('bool', 't')
 * //=> true
 * @example convertCell('int8', '10')
 * //=> 10
 * @example convertCell('_int4', '{1,2,3,4}')
 * //=> [1,2,3,4]
 */
exports.convertColumn = convertColumn;
const convertCell = (type, value) => {
  // if data type is an array
  if (type.charAt(0) === '_') {
    const dataType = type.slice(1, type.length);
    return toArray(value, dataType);
  }
  // If not null, convert to correct type.
  switch (type) {
    case PostgresTypes.bool:
      return toBoolean(value);
    case PostgresTypes.float4:
    case PostgresTypes.float8:
    case PostgresTypes.int2:
    case PostgresTypes.int4:
    case PostgresTypes.int8:
    case PostgresTypes.numeric:
    case PostgresTypes.oid:
      return toNumber(value);
    case PostgresTypes.json:
    case PostgresTypes.jsonb:
      return toJson(value);
    case PostgresTypes.timestamp:
      return toTimestampString(value);
    // Format to be consistent with PostgREST
    case PostgresTypes.abstime: // To allow users to cast it based on Timezone
    case PostgresTypes.date: // To allow users to cast it based on Timezone
    case PostgresTypes.daterange:
    case PostgresTypes.int4range:
    case PostgresTypes.int8range:
    case PostgresTypes.money:
    case PostgresTypes.reltime: // To allow users to cast it based on Timezone
    case PostgresTypes.text:
    case PostgresTypes.time: // To allow users to cast it based on Timezone
    case PostgresTypes.timestamptz: // To allow users to cast it based on Timezone
    case PostgresTypes.timetz: // To allow users to cast it based on Timezone
    case PostgresTypes.tsrange:
    case PostgresTypes.tstzrange:
      return noop(value);
    default:
      // Return the value for remaining types
      return noop(value);
  }
};
exports.convertCell = convertCell;
const noop = value => {
  return value;
};
const toBoolean = value => {
  switch (value) {
    case 't':
      return true;
    case 'f':
      return false;
    default:
      return value;
  }
};
exports.toBoolean = toBoolean;
const toNumber = value => {
  if (typeof value === 'string') {
    const parsedValue = parseFloat(value);
    if (!Number.isNaN(parsedValue)) {
      return parsedValue;
    }
  }
  return value;
};
exports.toNumber = toNumber;
const toJson = value => {
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch (error) {
      console.log(`JSON parse error: ${error}`);
      return value;
    }
  }
  return value;
};
/**
 * Converts a Postgres Array into a native JS array
 *
 * @example toArray('{}', 'int4')
 * //=> []
 * @example toArray('{"[2021-01-01,2021-12-31)","(2021-01-01,2021-12-32]"}', 'daterange')
 * //=> ['[2021-01-01,2021-12-31)', '(2021-01-01,2021-12-32]']
 * @example toArray([1,2,3,4], 'int4')
 * //=> [1,2,3,4]
 */
exports.toJson = toJson;
const toArray = (value, type) => {
  if (typeof value !== 'string') {
    return value;
  }
  const lastIdx = value.length - 1;
  const closeBrace = value[lastIdx];
  const openBrace = value[0];
  // Confirm value is a Postgres array by checking curly brackets
  if (openBrace === '{' && closeBrace === '}') {
    let arr;
    const valTrim = value.slice(1, lastIdx);
    // TODO: find a better solution to separate Postgres array data
    try {
      arr = JSON.parse('[' + valTrim + ']');
    } catch (_) {
      // WARNING: splitting on comma does not cover all edge cases
      arr = valTrim ? valTrim.split(',') : [];
    }
    return arr.map(val => convertCell(type, val));
  }
  return value;
};
/**
 * Fixes timestamp to be ISO-8601. Swaps the space between the date and time for a 'T'
 * See https://github.com/supabase/supabase/issues/18
 *
 * @example toTimestampString('2019-09-10 00:00:00')
 * //=> '2019-09-10T00:00:00'
 */
exports.toArray = toArray;
const toTimestampString = value => {
  if (typeof value === 'string') {
    return value.replace(' ', 'T');
  }
  return value;
};
exports.toTimestampString = toTimestampString;
},{}],"node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.REALTIME_SUBSCRIBE_STATES = exports.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = exports.REALTIME_LISTEN_TYPES = exports.REALTIME_CHANNEL_STATES = void 0;
var _constants = require("./lib/constants");
var _push = _interopRequireDefault(require("./lib/push"));
var _timer = _interopRequireDefault(require("./lib/timer"));
var _RealtimePresence = _interopRequireDefault(require("./RealtimePresence"));
var Transformers = _interopRequireWildcard(require("./lib/transformers"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
var REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
(function (REALTIME_POSTGRES_CHANGES_LISTEN_EVENT) {
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["ALL"] = "*";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["INSERT"] = "INSERT";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["UPDATE"] = "UPDATE";
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT["DELETE"] = "DELETE";
})(REALTIME_POSTGRES_CHANGES_LISTEN_EVENT || (exports.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = REALTIME_POSTGRES_CHANGES_LISTEN_EVENT = {}));
var REALTIME_LISTEN_TYPES;
(function (REALTIME_LISTEN_TYPES) {
  REALTIME_LISTEN_TYPES["BROADCAST"] = "broadcast";
  REALTIME_LISTEN_TYPES["PRESENCE"] = "presence";
  /**
   * listen to Postgres changes.
   */
  REALTIME_LISTEN_TYPES["POSTGRES_CHANGES"] = "postgres_changes";
})(REALTIME_LISTEN_TYPES || (exports.REALTIME_LISTEN_TYPES = REALTIME_LISTEN_TYPES = {}));
var REALTIME_SUBSCRIBE_STATES;
(function (REALTIME_SUBSCRIBE_STATES) {
  REALTIME_SUBSCRIBE_STATES["SUBSCRIBED"] = "SUBSCRIBED";
  REALTIME_SUBSCRIBE_STATES["TIMED_OUT"] = "TIMED_OUT";
  REALTIME_SUBSCRIBE_STATES["CLOSED"] = "CLOSED";
  REALTIME_SUBSCRIBE_STATES["CHANNEL_ERROR"] = "CHANNEL_ERROR";
})(REALTIME_SUBSCRIBE_STATES || (exports.REALTIME_SUBSCRIBE_STATES = REALTIME_SUBSCRIBE_STATES = {}));
const REALTIME_CHANNEL_STATES = exports.REALTIME_CHANNEL_STATES = _constants.CHANNEL_STATES;
/** A channel is the basic building block of Realtime
 * and narrows the scope of data flow to subscribed clients.
 * You can think of a channel as a chatroom where participants are able to see who's online
 * and send and receive messages.
 */
class RealtimeChannel {
  constructor( /** Topic name can be any string. */
  topic, params = {
    config: {}
  }, socket) {
    this.topic = topic;
    this.params = params;
    this.socket = socket;
    this.bindings = {};
    this.state = _constants.CHANNEL_STATES.closed;
    this.joinedOnce = false;
    this.pushBuffer = [];
    this.subTopic = topic.replace(/^realtime:/i, '');
    this.params.config = Object.assign({
      broadcast: {
        ack: false,
        self: false
      },
      presence: {
        key: ''
      }
    }, params.config);
    this.timeout = this.socket.timeout;
    this.joinPush = new _push.default(this, _constants.CHANNEL_EVENTS.join, this.params, this.timeout);
    this.rejoinTimer = new _timer.default(() => this._rejoinUntilConnected(), this.socket.reconnectAfterMs);
    this.joinPush.receive('ok', () => {
      this.state = _constants.CHANNEL_STATES.joined;
      this.rejoinTimer.reset();
      this.pushBuffer.forEach(pushEvent => pushEvent.send());
      this.pushBuffer = [];
    });
    this._onClose(() => {
      this.rejoinTimer.reset();
      this.socket.log('channel', `close ${this.topic} ${this._joinRef()}`);
      this.state = _constants.CHANNEL_STATES.closed;
      this.socket._remove(this);
    });
    this._onError(reason => {
      if (this._isLeaving() || this._isClosed()) {
        return;
      }
      this.socket.log('channel', `error ${this.topic}`, reason);
      this.state = _constants.CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this.joinPush.receive('timeout', () => {
      if (!this._isJoining()) {
        return;
      }
      this.socket.log('channel', `timeout ${this.topic}`, this.joinPush.timeout);
      this.state = _constants.CHANNEL_STATES.errored;
      this.rejoinTimer.scheduleTimeout();
    });
    this._on(_constants.CHANNEL_EVENTS.reply, {}, (payload, ref) => {
      this._trigger(this._replyEventName(ref), payload);
    });
    this.presence = new _RealtimePresence.default(this);
    this.broadcastEndpointURL = this._broadcastEndpointURL();
  }
  /** Subscribe registers your client with the server */
  subscribe(callback, timeout = this.timeout) {
    var _a, _b;
    if (!this.socket.isConnected()) {
      this.socket.connect();
    }
    if (this.joinedOnce) {
      throw `tried to subscribe multiple times. 'subscribe' can only be called a single time per channel instance`;
    } else {
      const {
        config: {
          broadcast,
          presence
        }
      } = this.params;
      this._onError(e => callback && callback('CHANNEL_ERROR', e));
      this._onClose(() => callback && callback('CLOSED'));
      const accessTokenPayload = {};
      const config = {
        broadcast,
        presence,
        postgres_changes: (_b = (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.map(r => r.filter)) !== null && _b !== void 0 ? _b : []
      };
      if (this.socket.accessToken) {
        accessTokenPayload.access_token = this.socket.accessToken;
      }
      this.updateJoinPayload(Object.assign({
        config
      }, accessTokenPayload));
      this.joinedOnce = true;
      this._rejoin(timeout);
      this.joinPush.receive('ok', ({
        postgres_changes: serverPostgresFilters
      }) => {
        var _a;
        this.socket.accessToken && this.socket.setAuth(this.socket.accessToken);
        if (serverPostgresFilters === undefined) {
          callback && callback('SUBSCRIBED');
          return;
        } else {
          const clientPostgresBindings = this.bindings.postgres_changes;
          const bindingsLen = (_a = clientPostgresBindings === null || clientPostgresBindings === void 0 ? void 0 : clientPostgresBindings.length) !== null && _a !== void 0 ? _a : 0;
          const newPostgresBindings = [];
          for (let i = 0; i < bindingsLen; i++) {
            const clientPostgresBinding = clientPostgresBindings[i];
            const {
              filter: {
                event,
                schema,
                table,
                filter
              }
            } = clientPostgresBinding;
            const serverPostgresFilter = serverPostgresFilters && serverPostgresFilters[i];
            if (serverPostgresFilter && serverPostgresFilter.event === event && serverPostgresFilter.schema === schema && serverPostgresFilter.table === table && serverPostgresFilter.filter === filter) {
              newPostgresBindings.push(Object.assign(Object.assign({}, clientPostgresBinding), {
                id: serverPostgresFilter.id
              }));
            } else {
              this.unsubscribe();
              callback && callback('CHANNEL_ERROR', new Error('mismatch between server and client bindings for postgres changes'));
              return;
            }
          }
          this.bindings.postgres_changes = newPostgresBindings;
          callback && callback('SUBSCRIBED');
          return;
        }
      }).receive('error', error => {
        callback && callback('CHANNEL_ERROR', new Error(JSON.stringify(Object.values(error).join(', ') || 'error')));
        return;
      }).receive('timeout', () => {
        callback && callback('TIMED_OUT');
        return;
      });
    }
    return this;
  }
  presenceState() {
    return this.presence.state;
  }
  async track(payload, opts = {}) {
    return await this.send({
      type: 'presence',
      event: 'track',
      payload
    }, opts.timeout || this.timeout);
  }
  async untrack(opts = {}) {
    return await this.send({
      type: 'presence',
      event: 'untrack'
    }, opts);
  }
  on(type, filter, callback) {
    return this._on(type, filter, callback);
  }
  /**
   * Sends a message into the channel.
   *
   * @param args Arguments to send to channel
   * @param args.type The type of event to send
   * @param args.event The name of the event being sent
   * @param args.payload Payload to be sent
   * @param opts Options to be used during the send process
   */
  async send(args, opts = {}) {
    var _a, _b;
    if (!this._canPush() && args.type === 'broadcast') {
      const {
        event,
        payload: endpoint_payload
      } = args;
      const options = {
        method: 'POST',
        headers: {
          apikey: (_a = this.socket.apiKey) !== null && _a !== void 0 ? _a : '',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [{
            topic: this.subTopic,
            event,
            payload: endpoint_payload
          }]
        })
      };
      try {
        const response = await this._fetchWithTimeout(this.broadcastEndpointURL, options, (_b = opts.timeout) !== null && _b !== void 0 ? _b : this.timeout);
        if (response.ok) {
          return 'ok';
        } else {
          return 'error';
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          return 'timed out';
        } else {
          return 'error';
        }
      }
    } else {
      return new Promise(resolve => {
        var _a, _b, _c;
        const push = this._push(args.type, args, opts.timeout || this.timeout);
        if (args.type === 'broadcast' && !((_c = (_b = (_a = this.params) === null || _a === void 0 ? void 0 : _a.config) === null || _b === void 0 ? void 0 : _b.broadcast) === null || _c === void 0 ? void 0 : _c.ack)) {
          resolve('ok');
        }
        push.receive('ok', () => resolve('ok'));
        push.receive('error', () => resolve('error'));
        push.receive('timeout', () => resolve('timed out'));
      });
    }
  }
  updateJoinPayload(payload) {
    this.joinPush.updatePayload(payload);
  }
  /**
   * Leaves the channel.
   *
   * Unsubscribes from server events, and instructs channel to terminate on server.
   * Triggers onClose() hooks.
   *
   * To receive leave acknowledgements, use the a `receive` hook to bind to the server ack, ie:
   * channel.unsubscribe().receive("ok", () => alert("left!") )
   */
  unsubscribe(timeout = this.timeout) {
    this.state = _constants.CHANNEL_STATES.leaving;
    const onClose = () => {
      this.socket.log('channel', `leave ${this.topic}`);
      this._trigger(_constants.CHANNEL_EVENTS.close, 'leave', this._joinRef());
    };
    this.rejoinTimer.reset();
    // Destroy joinPush to avoid connection timeouts during unscription phase
    this.joinPush.destroy();
    return new Promise(resolve => {
      const leavePush = new _push.default(this, _constants.CHANNEL_EVENTS.leave, {}, timeout);
      leavePush.receive('ok', () => {
        onClose();
        resolve('ok');
      }).receive('timeout', () => {
        onClose();
        resolve('timed out');
      }).receive('error', () => {
        resolve('error');
      });
      leavePush.send();
      if (!this._canPush()) {
        leavePush.trigger('ok', {});
      }
    });
  }
  /** @internal */
  _broadcastEndpointURL() {
    let url = this.socket.endPoint;
    url = url.replace(/^ws/i, 'http');
    url = url.replace(/(\/socket\/websocket|\/socket|\/websocket)\/?$/i, '');
    return url.replace(/\/+$/, '') + '/api/broadcast';
  }
  async _fetchWithTimeout(url, options, timeout) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    const response = await this.socket.fetch(url, Object.assign(Object.assign({}, options), {
      signal: controller.signal
    }));
    clearTimeout(id);
    return response;
  }
  /** @internal */
  _push(event, payload, timeout = this.timeout) {
    if (!this.joinedOnce) {
      throw `tried to push '${event}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;
    }
    let pushEvent = new _push.default(this, event, payload, timeout);
    if (this._canPush()) {
      pushEvent.send();
    } else {
      pushEvent.startTimeout();
      this.pushBuffer.push(pushEvent);
    }
    return pushEvent;
  }
  /**
   * Overridable message hook
   *
   * Receives all events for specialized message handling before dispatching to the channel callbacks.
   * Must return the payload, modified or unmodified.
   *
   * @internal
   */
  _onMessage(_event, payload, _ref) {
    return payload;
  }
  /** @internal */
  _isMember(topic) {
    return this.topic === topic;
  }
  /** @internal */
  _joinRef() {
    return this.joinPush.ref;
  }
  /** @internal */
  _trigger(type, payload, ref) {
    var _a, _b;
    const typeLower = type.toLocaleLowerCase();
    const {
      close,
      error,
      leave,
      join
    } = _constants.CHANNEL_EVENTS;
    const events = [close, error, leave, join];
    if (ref && events.indexOf(typeLower) >= 0 && ref !== this._joinRef()) {
      return;
    }
    let handledPayload = this._onMessage(typeLower, payload, ref);
    if (payload && !handledPayload) {
      throw 'channel onMessage callbacks must return the payload, modified or unmodified';
    }
    if (['insert', 'update', 'delete'].includes(typeLower)) {
      (_a = this.bindings.postgres_changes) === null || _a === void 0 ? void 0 : _a.filter(bind => {
        var _a, _b, _c;
        return ((_a = bind.filter) === null || _a === void 0 ? void 0 : _a.event) === '*' || ((_c = (_b = bind.filter) === null || _b === void 0 ? void 0 : _b.event) === null || _c === void 0 ? void 0 : _c.toLocaleLowerCase()) === typeLower;
      }).map(bind => bind.callback(handledPayload, ref));
    } else {
      (_b = this.bindings[typeLower]) === null || _b === void 0 ? void 0 : _b.filter(bind => {
        var _a, _b, _c, _d, _e, _f;
        if (['broadcast', 'presence', 'postgres_changes'].includes(typeLower)) {
          if ('id' in bind) {
            const bindId = bind.id;
            const bindEvent = (_a = bind.filter) === null || _a === void 0 ? void 0 : _a.event;
            return bindId && ((_b = payload.ids) === null || _b === void 0 ? void 0 : _b.includes(bindId)) && (bindEvent === '*' || (bindEvent === null || bindEvent === void 0 ? void 0 : bindEvent.toLocaleLowerCase()) === ((_c = payload.data) === null || _c === void 0 ? void 0 : _c.type.toLocaleLowerCase()));
          } else {
            const bindEvent = (_e = (_d = bind === null || bind === void 0 ? void 0 : bind.filter) === null || _d === void 0 ? void 0 : _d.event) === null || _e === void 0 ? void 0 : _e.toLocaleLowerCase();
            return bindEvent === '*' || bindEvent === ((_f = payload === null || payload === void 0 ? void 0 : payload.event) === null || _f === void 0 ? void 0 : _f.toLocaleLowerCase());
          }
        } else {
          return bind.type.toLocaleLowerCase() === typeLower;
        }
      }).map(bind => {
        if (typeof handledPayload === 'object' && 'ids' in handledPayload) {
          const postgresChanges = handledPayload.data;
          const {
            schema,
            table,
            commit_timestamp,
            type,
            errors
          } = postgresChanges;
          const enrichedPayload = {
            schema: schema,
            table: table,
            commit_timestamp: commit_timestamp,
            eventType: type,
            new: {},
            old: {},
            errors: errors
          };
          handledPayload = Object.assign(Object.assign({}, enrichedPayload), this._getPayloadRecords(postgresChanges));
        }
        bind.callback(handledPayload, ref);
      });
    }
  }
  /** @internal */
  _isClosed() {
    return this.state === _constants.CHANNEL_STATES.closed;
  }
  /** @internal */
  _isJoined() {
    return this.state === _constants.CHANNEL_STATES.joined;
  }
  /** @internal */
  _isJoining() {
    return this.state === _constants.CHANNEL_STATES.joining;
  }
  /** @internal */
  _isLeaving() {
    return this.state === _constants.CHANNEL_STATES.leaving;
  }
  /** @internal */
  _replyEventName(ref) {
    return `chan_reply_${ref}`;
  }
  /** @internal */
  _on(type, filter, callback) {
    const typeLower = type.toLocaleLowerCase();
    const binding = {
      type: typeLower,
      filter: filter,
      callback: callback
    };
    if (this.bindings[typeLower]) {
      this.bindings[typeLower].push(binding);
    } else {
      this.bindings[typeLower] = [binding];
    }
    return this;
  }
  /** @internal */
  _off(type, filter) {
    const typeLower = type.toLocaleLowerCase();
    this.bindings[typeLower] = this.bindings[typeLower].filter(bind => {
      var _a;
      return !(((_a = bind.type) === null || _a === void 0 ? void 0 : _a.toLocaleLowerCase()) === typeLower && RealtimeChannel.isEqual(bind.filter, filter));
    });
    return this;
  }
  /** @internal */
  static isEqual(obj1, obj2) {
    if (Object.keys(obj1).length !== Object.keys(obj2).length) {
      return false;
    }
    for (const k in obj1) {
      if (obj1[k] !== obj2[k]) {
        return false;
      }
    }
    return true;
  }
  /** @internal */
  _rejoinUntilConnected() {
    this.rejoinTimer.scheduleTimeout();
    if (this.socket.isConnected()) {
      this._rejoin();
    }
  }
  /**
   * Registers a callback that will be executed when the channel closes.
   *
   * @internal
   */
  _onClose(callback) {
    this._on(_constants.CHANNEL_EVENTS.close, {}, callback);
  }
  /**
   * Registers a callback that will be executed when the channel encounteres an error.
   *
   * @internal
   */
  _onError(callback) {
    this._on(_constants.CHANNEL_EVENTS.error, {}, reason => callback(reason));
  }
  /**
   * Returns `true` if the socket is connected and the channel has been joined.
   *
   * @internal
   */
  _canPush() {
    return this.socket.isConnected() && this._isJoined();
  }
  /** @internal */
  _rejoin(timeout = this.timeout) {
    if (this._isLeaving()) {
      return;
    }
    this.socket._leaveOpenTopic(this.topic);
    this.state = _constants.CHANNEL_STATES.joining;
    this.joinPush.resend(timeout);
  }
  /** @internal */
  _getPayloadRecords(payload) {
    const records = {
      new: {},
      old: {}
    };
    if (payload.type === 'INSERT' || payload.type === 'UPDATE') {
      records.new = Transformers.convertChangeData(payload.columns, payload.record);
    }
    if (payload.type === 'UPDATE' || payload.type === 'DELETE') {
      records.old = Transformers.convertChangeData(payload.columns, payload.old_record);
    }
    return records;
  }
}
exports.default = RealtimeChannel;
},{"./lib/constants":"node_modules/@supabase/realtime-js/dist/module/lib/constants.js","./lib/push":"node_modules/@supabase/realtime-js/dist/module/lib/push.js","./lib/timer":"node_modules/@supabase/realtime-js/dist/module/lib/timer.js","./RealtimePresence":"node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js","./lib/transformers":"node_modules/@supabase/realtime-js/dist/module/lib/transformers.js"}],"node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("./lib/constants");
var _timer = _interopRequireDefault(require("./lib/timer"));
var _serializer = _interopRequireDefault(require("./lib/serializer"));
var _RealtimeChannel = _interopRequireDefault(require("./RealtimeChannel"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const noop = () => {};
const NATIVE_WEBSOCKET_AVAILABLE = typeof WebSocket !== 'undefined';
class RealtimeClient {
  /**
   * Initializes the Socket.
   *
   * @param endPoint The string WebSocket endpoint, ie, "ws://example.com/socket", "wss://example.com", "/socket" (inherited host & protocol)
   * @param options.transport The Websocket Transport, for example WebSocket.
   * @param options.timeout The default timeout in milliseconds to trigger push timeouts.
   * @param options.params The optional params to pass when connecting.
   * @param options.headers The optional headers to pass when connecting.
   * @param options.heartbeatIntervalMs The millisec interval to send a heartbeat message.
   * @param options.logger The optional function for specialized logging, ie: logger: (kind, msg, data) => { console.log(`${kind}: ${msg}`, data) }
   * @param options.encode The function to encode outgoing messages. Defaults to JSON: (payload, callback) => callback(JSON.stringify(payload))
   * @param options.decode The function to decode incoming messages. Defaults to Serializer's decode.
   * @param options.reconnectAfterMs he optional function that returns the millsec reconnect interval. Defaults to stepped backoff off.
   */
  constructor(endPoint, options) {
    var _a;
    this.accessToken = null;
    this.apiKey = null;
    this.channels = [];
    this.endPoint = '';
    this.headers = _constants.DEFAULT_HEADERS;
    this.params = {};
    this.timeout = _constants.DEFAULT_TIMEOUT;
    this.heartbeatIntervalMs = 30000;
    this.heartbeatTimer = undefined;
    this.pendingHeartbeatRef = null;
    this.ref = 0;
    this.logger = noop;
    this.conn = null;
    this.sendBuffer = [];
    this.serializer = new _serializer.default();
    this.stateChangeCallbacks = {
      open: [],
      close: [],
      error: [],
      message: []
    };
    /**
     * Use either custom fetch, if provided, or default fetch to make HTTP requests
     *
     * @internal
     */
    this._resolveFetch = customFetch => {
      let _fetch;
      if (customFetch) {
        _fetch = customFetch;
      } else if (typeof fetch === 'undefined') {
        _fetch = (...args) => require("_bundle_loader")(require.resolve('@supabase/node-fetch')).then(({
          default: fetch
        }) => fetch(...args));
      } else {
        _fetch = fetch;
      }
      return (...args) => _fetch(...args);
    };
    this.endPoint = `${endPoint}/${_constants.TRANSPORTS.websocket}`;
    if (options === null || options === void 0 ? void 0 : options.transport) {
      this.transport = options.transport;
    } else {
      this.transport = null;
    }
    if (options === null || options === void 0 ? void 0 : options.params) this.params = options.params;
    if (options === null || options === void 0 ? void 0 : options.headers) this.headers = Object.assign(Object.assign({}, this.headers), options.headers);
    if (options === null || options === void 0 ? void 0 : options.timeout) this.timeout = options.timeout;
    if (options === null || options === void 0 ? void 0 : options.logger) this.logger = options.logger;
    if (options === null || options === void 0 ? void 0 : options.heartbeatIntervalMs) this.heartbeatIntervalMs = options.heartbeatIntervalMs;
    const accessToken = (_a = options === null || options === void 0 ? void 0 : options.params) === null || _a === void 0 ? void 0 : _a.apikey;
    if (accessToken) {
      this.accessToken = accessToken;
      this.apiKey = accessToken;
    }
    this.reconnectAfterMs = (options === null || options === void 0 ? void 0 : options.reconnectAfterMs) ? options.reconnectAfterMs : tries => {
      return [1000, 2000, 5000, 10000][tries - 1] || 10000;
    };
    this.encode = (options === null || options === void 0 ? void 0 : options.encode) ? options.encode : (payload, callback) => {
      return callback(JSON.stringify(payload));
    };
    this.decode = (options === null || options === void 0 ? void 0 : options.decode) ? options.decode : this.serializer.decode.bind(this.serializer);
    this.reconnectTimer = new _timer.default(async () => {
      this.disconnect();
      this.connect();
    }, this.reconnectAfterMs);
    this.fetch = this._resolveFetch(options === null || options === void 0 ? void 0 : options.fetch);
  }
  /**
   * Connects the socket, unless already connected.
   */
  connect() {
    if (this.conn) {
      return;
    }
    if (this.transport) {
      this.conn = new this.transport(this._endPointURL(), undefined, {
        headers: this.headers
      });
      return;
    }
    if (NATIVE_WEBSOCKET_AVAILABLE) {
      this.conn = new WebSocket(this._endPointURL());
      this.setupConnection();
      return;
    }
    this.conn = new WSWebSocketDummy(this._endPointURL(), undefined, {
      close: () => {
        this.conn = null;
      }
    });
    require("_bundle_loader")(require.resolve('ws')).then(({
      default: WS
    }) => {
      this.conn = new WS(this._endPointURL(), undefined, {
        headers: this.headers
      });
      this.setupConnection();
    });
  }
  /**
   * Disconnects the socket.
   *
   * @param code A numeric status code to send on disconnect.
   * @param reason A custom reason for the disconnect.
   */
  disconnect(code, reason) {
    if (this.conn) {
      this.conn.onclose = function () {}; // noop
      if (code) {
        this.conn.close(code, reason !== null && reason !== void 0 ? reason : '');
      } else {
        this.conn.close();
      }
      this.conn = null;
      // remove open handles
      this.heartbeatTimer && clearInterval(this.heartbeatTimer);
      this.reconnectTimer.reset();
    }
  }
  /**
   * Returns all created channels
   */
  getChannels() {
    return this.channels;
  }
  /**
   * Unsubscribes and removes a single channel
   * @param channel A RealtimeChannel instance
   */
  async removeChannel(channel) {
    const status = await channel.unsubscribe();
    if (this.channels.length === 0) {
      this.disconnect();
    }
    return status;
  }
  /**
   * Unsubscribes and removes all channels
   */
  async removeAllChannels() {
    const values_1 = await Promise.all(this.channels.map(channel => channel.unsubscribe()));
    this.disconnect();
    return values_1;
  }
  /**
   * Logs the message.
   *
   * For customized logging, `this.logger` can be overridden.
   */
  log(kind, msg, data) {
    this.logger(kind, msg, data);
  }
  /**
   * Returns the current state of the socket.
   */
  connectionState() {
    switch (this.conn && this.conn.readyState) {
      case _constants.SOCKET_STATES.connecting:
        return _constants.CONNECTION_STATE.Connecting;
      case _constants.SOCKET_STATES.open:
        return _constants.CONNECTION_STATE.Open;
      case _constants.SOCKET_STATES.closing:
        return _constants.CONNECTION_STATE.Closing;
      default:
        return _constants.CONNECTION_STATE.Closed;
    }
  }
  /**
   * Returns `true` is the connection is open.
   */
  isConnected() {
    return this.connectionState() === _constants.CONNECTION_STATE.Open;
  }
  channel(topic, params = {
    config: {}
  }) {
    const chan = new _RealtimeChannel.default(`realtime:${topic}`, params, this);
    this.channels.push(chan);
    return chan;
  }
  /**
   * Push out a message if the socket is connected.
   *
   * If the socket is not connected, the message gets enqueued within a local buffer, and sent out when a connection is next established.
   */
  push(data) {
    const {
      topic,
      event,
      payload,
      ref
    } = data;
    const callback = () => {
      this.encode(data, result => {
        var _a;
        (_a = this.conn) === null || _a === void 0 ? void 0 : _a.send(result);
      });
    };
    this.log('push', `${topic} ${event} (${ref})`, payload);
    if (this.isConnected()) {
      callback();
    } else {
      this.sendBuffer.push(callback);
    }
  }
  /**
   * Sets the JWT access token used for channel subscription authorization and Realtime RLS.
   *
   * @param token A JWT string.
   */
  setAuth(token) {
    this.accessToken = token;
    this.channels.forEach(channel => {
      token && channel.updateJoinPayload({
        access_token: token
      });
      if (channel.joinedOnce && channel._isJoined()) {
        channel._push(_constants.CHANNEL_EVENTS.access_token, {
          access_token: token
        });
      }
    });
  }
  /**
   * Return the next message ref, accounting for overflows
   *
   * @internal
   */
  _makeRef() {
    let newRef = this.ref + 1;
    if (newRef === this.ref) {
      this.ref = 0;
    } else {
      this.ref = newRef;
    }
    return this.ref.toString();
  }
  /**
   * Unsubscribe from channels with the specified topic.
   *
   * @internal
   */
  _leaveOpenTopic(topic) {
    let dupChannel = this.channels.find(c => c.topic === topic && (c._isJoined() || c._isJoining()));
    if (dupChannel) {
      this.log('transport', `leaving duplicate topic "${topic}"`);
      dupChannel.unsubscribe();
    }
  }
  /**
   * Removes a subscription from the socket.
   *
   * @param channel An open subscription.
   *
   * @internal
   */
  _remove(channel) {
    this.channels = this.channels.filter(c => c._joinRef() !== channel._joinRef());
  }
  /**
   * Sets up connection handlers.
   *
   * @internal
   */
  setupConnection() {
    if (this.conn) {
      this.conn.binaryType = 'arraybuffer';
      this.conn.onopen = () => this._onConnOpen();
      this.conn.onerror = error => this._onConnError(error);
      this.conn.onmessage = event => this._onConnMessage(event);
      this.conn.onclose = event => this._onConnClose(event);
    }
  }
  /**
   * Returns the URL of the websocket.
   *
   * @internal
   */
  _endPointURL() {
    return this._appendParams(this.endPoint, Object.assign({}, this.params, {
      vsn: _constants.VSN
    }));
  }
  /** @internal */
  _onConnMessage(rawMessage) {
    this.decode(rawMessage.data, msg => {
      let {
        topic,
        event,
        payload,
        ref
      } = msg;
      if (ref && ref === this.pendingHeartbeatRef || event === (payload === null || payload === void 0 ? void 0 : payload.type)) {
        this.pendingHeartbeatRef = null;
      }
      this.log('receive', `${payload.status || ''} ${topic} ${event} ${ref && '(' + ref + ')' || ''}`, payload);
      this.channels.filter(channel => channel._isMember(topic)).forEach(channel => channel._trigger(event, payload, ref));
      this.stateChangeCallbacks.message.forEach(callback => callback(msg));
    });
  }
  /** @internal */
  _onConnOpen() {
    this.log('transport', `connected to ${this._endPointURL()}`);
    this._flushSendBuffer();
    this.reconnectTimer.reset();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => this._sendHeartbeat(), this.heartbeatIntervalMs);
    this.stateChangeCallbacks.open.forEach(callback => callback());
  }
  /** @internal */
  _onConnClose(event) {
    this.log('transport', 'close', event);
    this._triggerChanError();
    this.heartbeatTimer && clearInterval(this.heartbeatTimer);
    this.reconnectTimer.scheduleTimeout();
    this.stateChangeCallbacks.close.forEach(callback => callback(event));
  }
  /** @internal */
  _onConnError(error) {
    this.log('transport', error.message);
    this._triggerChanError();
    this.stateChangeCallbacks.error.forEach(callback => callback(error));
  }
  /** @internal */
  _triggerChanError() {
    this.channels.forEach(channel => channel._trigger(_constants.CHANNEL_EVENTS.error));
  }
  /** @internal */
  _appendParams(url, params) {
    if (Object.keys(params).length === 0) {
      return url;
    }
    const prefix = url.match(/\?/) ? '&' : '?';
    const query = new URLSearchParams(params);
    return `${url}${prefix}${query}`;
  }
  /** @internal */
  _flushSendBuffer() {
    if (this.isConnected() && this.sendBuffer.length > 0) {
      this.sendBuffer.forEach(callback => callback());
      this.sendBuffer = [];
    }
  }
  /** @internal */
  _sendHeartbeat() {
    var _a;
    if (!this.isConnected()) {
      return;
    }
    if (this.pendingHeartbeatRef) {
      this.pendingHeartbeatRef = null;
      this.log('transport', 'heartbeat timeout. Attempting to re-establish connection');
      (_a = this.conn) === null || _a === void 0 ? void 0 : _a.close(_constants.WS_CLOSE_NORMAL, 'hearbeat timeout');
      return;
    }
    this.pendingHeartbeatRef = this._makeRef();
    this.push({
      topic: 'phoenix',
      event: 'heartbeat',
      payload: {},
      ref: this.pendingHeartbeatRef
    });
    this.setAuth(this.accessToken);
  }
}
exports.default = RealtimeClient;
class WSWebSocketDummy {
  constructor(address, _protocols, options) {
    this.binaryType = 'arraybuffer';
    this.onclose = () => {};
    this.onerror = () => {};
    this.onmessage = () => {};
    this.onopen = () => {};
    this.readyState = _constants.SOCKET_STATES.connecting;
    this.send = () => {};
    this.url = null;
    this.url = address;
    this.close = options.close;
  }
}
},{"./lib/constants":"node_modules/@supabase/realtime-js/dist/module/lib/constants.js","./lib/timer":"node_modules/@supabase/realtime-js/dist/module/lib/timer.js","./lib/serializer":"node_modules/@supabase/realtime-js/dist/module/lib/serializer.js","./RealtimeChannel":"node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js","_bundle_loader":"node_modules/parcel-bundler/src/builtins/bundle-loader.js","@supabase/node-fetch":[["browser.b6f259d9.js","node_modules/@supabase/node-fetch/browser.js"],"browser.b6f259d9.js.map","node_modules/@supabase/node-fetch/browser.js"],"ws":[["browser.b7049da6.js","node_modules/ws/browser.js"],"browser.b7049da6.js.map","node_modules/ws/browser.js"]}],"node_modules/@supabase/realtime-js/dist/module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "REALTIME_CHANNEL_STATES", {
  enumerable: true,
  get: function () {
    return _RealtimeChannel.REALTIME_CHANNEL_STATES;
  }
});
Object.defineProperty(exports, "REALTIME_LISTEN_TYPES", {
  enumerable: true,
  get: function () {
    return _RealtimeChannel.REALTIME_LISTEN_TYPES;
  }
});
Object.defineProperty(exports, "REALTIME_POSTGRES_CHANGES_LISTEN_EVENT", {
  enumerable: true,
  get: function () {
    return _RealtimeChannel.REALTIME_POSTGRES_CHANGES_LISTEN_EVENT;
  }
});
Object.defineProperty(exports, "REALTIME_PRESENCE_LISTEN_EVENTS", {
  enumerable: true,
  get: function () {
    return _RealtimePresence.REALTIME_PRESENCE_LISTEN_EVENTS;
  }
});
Object.defineProperty(exports, "REALTIME_SUBSCRIBE_STATES", {
  enumerable: true,
  get: function () {
    return _RealtimeChannel.REALTIME_SUBSCRIBE_STATES;
  }
});
Object.defineProperty(exports, "RealtimeChannel", {
  enumerable: true,
  get: function () {
    return _RealtimeChannel.default;
  }
});
Object.defineProperty(exports, "RealtimeClient", {
  enumerable: true,
  get: function () {
    return _RealtimeClient.default;
  }
});
Object.defineProperty(exports, "RealtimePresence", {
  enumerable: true,
  get: function () {
    return _RealtimePresence.default;
  }
});
var _RealtimeClient = _interopRequireDefault(require("./RealtimeClient"));
var _RealtimeChannel = _interopRequireWildcard(require("./RealtimeChannel"));
var _RealtimePresence = _interopRequireWildcard(require("./RealtimePresence"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./RealtimeClient":"node_modules/@supabase/realtime-js/dist/module/RealtimeClient.js","./RealtimeChannel":"node_modules/@supabase/realtime-js/dist/module/RealtimeChannel.js","./RealtimePresence":"node_modules/@supabase/realtime-js/dist/module/RealtimePresence.js"}],"node_modules/@supabase/storage-js/dist/module/lib/errors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageUnknownError = exports.StorageError = exports.StorageApiError = void 0;
exports.isStorageError = isStorageError;
class StorageError extends Error {
  constructor(message) {
    super(message);
    this.__isStorageError = true;
    this.name = 'StorageError';
  }
}
exports.StorageError = StorageError;
function isStorageError(error) {
  return typeof error === 'object' && error !== null && '__isStorageError' in error;
}
class StorageApiError extends StorageError {
  constructor(message, status) {
    super(message);
    this.name = 'StorageApiError';
    this.status = status;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status
    };
  }
}
exports.StorageApiError = StorageApiError;
class StorageUnknownError extends StorageError {
  constructor(message, originalError) {
    super(message);
    this.name = 'StorageUnknownError';
    this.originalError = originalError;
  }
}
exports.StorageUnknownError = StorageUnknownError;
},{}],"node_modules/@supabase/storage-js/dist/module/lib/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveResponse = exports.resolveFetch = void 0;
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const resolveFetch = customFetch => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => require("_bundle_loader")(require.resolve('@supabase/node-fetch')).then(({
      default: fetch
    }) => fetch(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
exports.resolveFetch = resolveFetch;
const resolveResponse = () => __awaiter(void 0, void 0, void 0, function* () {
  if (typeof Response === 'undefined') {
    // @ts-ignore
    return (yield require("_bundle_loader")(require.resolve('@supabase/node-fetch'))).Response;
  }
  return Response;
});
exports.resolveResponse = resolveResponse;
},{"_bundle_loader":"node_modules/parcel-bundler/src/builtins/bundle-loader.js","@supabase/node-fetch":[["browser.b6f259d9.js","node_modules/@supabase/node-fetch/browser.js"],"browser.b6f259d9.js.map","node_modules/@supabase/node-fetch/browser.js"]}],"node_modules/@supabase/storage-js/dist/module/lib/fetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.get = get;
exports.post = post;
exports.put = put;
exports.remove = remove;
var _errors = require("./errors");
var _helpers = require("./helpers");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const _getErrorMessage = err => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const handleError = (error, reject) => __awaiter(void 0, void 0, void 0, function* () {
  const Res = yield (0, _helpers.resolveResponse)();
  if (error instanceof Res) {
    error.json().then(err => {
      reject(new _errors.StorageApiError(_getErrorMessage(err), error.status || 500));
    }).catch(err => {
      reject(new _errors.StorageUnknownError(_getErrorMessage(err), err));
    });
  } else {
    reject(new _errors.StorageUnknownError(_getErrorMessage(error), error));
  }
});
const _getRequestParams = (method, options, parameters, body) => {
  const params = {
    method,
    headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
  };
  if (method === 'GET') {
    return params;
  }
  params.headers = Object.assign({
    'Content-Type': 'application/json'
  }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
function _handleRequest(fetcher, method, url, options, parameters, body) {
  return __awaiter(this, void 0, void 0, function* () {
    return new Promise((resolve, reject) => {
      fetcher(url, _getRequestParams(method, options, parameters, body)).then(result => {
        if (!result.ok) throw result;
        if (options === null || options === void 0 ? void 0 : options.noResolveJson) return result;
        return result.json();
      }).then(data => resolve(data)).catch(error => handleError(error, reject));
    });
  });
}
function get(fetcher, url, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'GET', url, options, parameters);
  });
}
function post(fetcher, url, body, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'POST', url, options, parameters, body);
  });
}
function put(fetcher, url, body, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'PUT', url, options, parameters, body);
  });
}
function remove(fetcher, url, body, options, parameters) {
  return __awaiter(this, void 0, void 0, function* () {
    return _handleRequest(fetcher, 'DELETE', url, options, parameters, body);
  });
}
},{"./errors":"node_modules/@supabase/storage-js/dist/module/lib/errors.js","./helpers":"node_modules/@supabase/storage-js/dist/module/lib/helpers.js"}],"node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _errors = require("../lib/errors");
var _fetch = require("../lib/fetch");
var _helpers = require("../lib/helpers");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
const DEFAULT_SEARCH_OPTIONS = {
  limit: 100,
  offset: 0,
  sortBy: {
    column: 'name',
    order: 'asc'
  }
};
const DEFAULT_FILE_OPTIONS = {
  cacheControl: '3600',
  contentType: 'text/plain;charset=UTF-8',
  upsert: false
};
class StorageFileApi {
  constructor(url, headers = {}, bucketId, fetch) {
    this.url = url;
    this.headers = headers;
    this.bucketId = bucketId;
    this.fetch = (0, _helpers.resolveFetch)(fetch);
  }
  /**
   * Uploads a file to an existing bucket or replaces an existing file at the specified path with a new one.
   *
   * @param method HTTP method.
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadOrUpdate(method, path, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let body;
        const options = Object.assign(Object.assign({}, DEFAULT_FILE_OPTIONS), fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), method === 'POST' && {
          'x-upsert': String(options.upsert)
        });
        if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
          body = new FormData();
          body.append('cacheControl', options.cacheControl);
          body.append('', fileBody);
        } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
          body = fileBody;
          body.append('cacheControl', options.cacheControl);
        } else {
          body = fileBody;
          headers['cache-control'] = `max-age=${options.cacheControl}`;
          headers['content-type'] = options.contentType;
        }
        const cleanPath = this._removeEmptyFolders(path);
        const _path = this._getFinalPath(cleanPath);
        const res = yield this.fetch(`${this.url}/object/${_path}`, Object.assign({
          method,
          body: body,
          headers
        }, (options === null || options === void 0 ? void 0 : options.duplex) ? {
          duplex: options.duplex
        } : {}));
        const data = yield res.json();
        if (res.ok) {
          return {
            data: {
              path: cleanPath,
              id: data.Id,
              fullPath: data.Key
            },
            error: null
          };
        } else {
          const error = data;
          return {
            data: null,
            error
          };
        }
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Uploads a file to an existing bucket.
   *
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  upload(path, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.uploadOrUpdate('POST', path, fileBody, fileOptions);
    });
  }
  /**
   * Upload a file with a token generated from `createSignedUploadUrl`.
   * @param path The file path, including the file name. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to upload.
   * @param token The token generated from `createSignedUploadUrl`
   * @param fileBody The body of the file to be stored in the bucket.
   */
  uploadToSignedUrl(path, token, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      const cleanPath = this._removeEmptyFolders(path);
      const _path = this._getFinalPath(cleanPath);
      const url = new URL(this.url + `/object/upload/sign/${_path}`);
      url.searchParams.set('token', token);
      try {
        let body;
        const options = Object.assign({
          upsert: DEFAULT_FILE_OPTIONS.upsert
        }, fileOptions);
        const headers = Object.assign(Object.assign({}, this.headers), {
          'x-upsert': String(options.upsert)
        });
        if (typeof Blob !== 'undefined' && fileBody instanceof Blob) {
          body = new FormData();
          body.append('cacheControl', options.cacheControl);
          body.append('', fileBody);
        } else if (typeof FormData !== 'undefined' && fileBody instanceof FormData) {
          body = fileBody;
          body.append('cacheControl', options.cacheControl);
        } else {
          body = fileBody;
          headers['cache-control'] = `max-age=${options.cacheControl}`;
          headers['content-type'] = options.contentType;
        }
        const res = yield this.fetch(url.toString(), {
          method: 'PUT',
          body: body,
          headers
        });
        const data = yield res.json();
        if (res.ok) {
          return {
            data: {
              path: cleanPath,
              fullPath: data.Key
            },
            error: null
          };
        } else {
          const error = data;
          return {
            data: null,
            error
          };
        }
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed upload URL.
   * Signed upload URLs can be used to upload files to the bucket without further authentication.
   * They are valid for 2 hours.
   * @param path The file path, including the current file name. For example `folder/image.png`.
   */
  createSignedUploadUrl(path) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/object/upload/sign/${_path}`, {}, {
          headers: this.headers
        });
        const url = new URL(this.url + data.url);
        const token = url.searchParams.get('token');
        if (!token) {
          throw new _errors.StorageError('No token returned by API');
        }
        return {
          data: {
            signedUrl: url.toString(),
            path,
            token
          },
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Replaces an existing file at the specified path with a new one.
   *
   * @param path The relative file path. Should be of the format `folder/subfolder/filename.png`. The bucket must already exist before attempting to update.
   * @param fileBody The body of the file to be stored in the bucket.
   */
  update(path, fileBody, fileOptions) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.uploadOrUpdate('PUT', path, fileBody, fileOptions);
    });
  }
  /**
   * Moves an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-new.png`.
   */
  move(fromPath, toPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/object/move`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Copies an existing file to a new path in the same bucket.
   *
   * @param fromPath The original file path, including the current file name. For example `folder/image.png`.
   * @param toPath The new file path, including the new file name. For example `folder/image-copy.png`.
   */
  copy(fromPath, toPath) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/object/copy`, {
          bucketId: this.bucketId,
          sourceKey: fromPath,
          destinationKey: toPath
        }, {
          headers: this.headers
        });
        return {
          data: {
            path: data.Key
          },
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a signed URL. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param path The file path, including the current file name. For example `folder/image.png`.
   * @param expiresIn The number of seconds until the signed URL expires. For example, `60` for a URL which is valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  createSignedUrl(path, expiresIn, options) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        let _path = this._getFinalPath(path);
        let data = yield (0, _fetch.post)(this.fetch, `${this.url}/object/sign/${_path}`, Object.assign({
          expiresIn
        }, (options === null || options === void 0 ? void 0 : options.transform) ? {
          transform: options.transform
        } : {}), {
          headers: this.headers
        });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? '' : options.download}` : '';
        const signedUrl = encodeURI(`${this.url}${data.signedURL}${downloadQueryParam}`);
        data = {
          signedUrl
        };
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Creates multiple signed URLs. Use a signed URL to share a file for a fixed amount of time.
   *
   * @param paths The file paths to be downloaded, including the current file names. For example `['folder/image.png', 'folder2/image2.png']`.
   * @param expiresIn The number of seconds until the signed URLs expire. For example, `60` for URLs which are valid for one minute.
   * @param options.download triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   */
  createSignedUrls(paths, expiresIn, options) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/object/sign/${this.bucketId}`, {
          expiresIn,
          paths
        }, {
          headers: this.headers
        });
        const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `&download=${options.download === true ? '' : options.download}` : '';
        return {
          data: data.map(datum => Object.assign(Object.assign({}, datum), {
            signedUrl: datum.signedURL ? encodeURI(`${this.url}${datum.signedURL}${downloadQueryParam}`) : null
          })),
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Downloads a file from a private bucket. For public buckets, make a request to the URL returned from `getPublicUrl` instead.
   *
   * @param path The full path and file name of the file to be downloaded. For example `folder/image.png`.
   * @param options.transform Transform the asset before serving it to the client.
   */
  download(path, options) {
    return __awaiter(this, void 0, void 0, function* () {
      const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined';
      const renderPath = wantsTransformation ? 'render/image/authenticated' : 'object';
      const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
      const queryString = transformationQuery ? `?${transformationQuery}` : '';
      try {
        const _path = this._getFinalPath(path);
        const res = yield (0, _fetch.get)(this.fetch, `${this.url}/${renderPath}/${_path}${queryString}`, {
          headers: this.headers,
          noResolveJson: true
        });
        const data = yield res.blob();
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * A simple convenience function to get the URL for an asset in a public bucket. If you do not want to use this function, you can construct the public URL by concatenating the bucket URL with the path to the asset.
   * This function does not verify if the bucket is public. If a public URL is created for a bucket which is not public, you will not be able to download the asset.
   *
   * @param path The path and name of the file to generate the public URL for. For example `folder/image.png`.
   * @param options.download Triggers the file as a download if set to true. Set this parameter as the name of the file if you want to trigger the download with a different filename.
   * @param options.transform Transform the asset before serving it to the client.
   */
  getPublicUrl(path, options) {
    const _path = this._getFinalPath(path);
    const _queryString = [];
    const downloadQueryParam = (options === null || options === void 0 ? void 0 : options.download) ? `download=${options.download === true ? '' : options.download}` : '';
    if (downloadQueryParam !== '') {
      _queryString.push(downloadQueryParam);
    }
    const wantsTransformation = typeof (options === null || options === void 0 ? void 0 : options.transform) !== 'undefined';
    const renderPath = wantsTransformation ? 'render/image' : 'object';
    const transformationQuery = this.transformOptsToQueryString((options === null || options === void 0 ? void 0 : options.transform) || {});
    if (transformationQuery !== '') {
      _queryString.push(transformationQuery);
    }
    let queryString = _queryString.join('&');
    if (queryString !== '') {
      queryString = `?${queryString}`;
    }
    return {
      data: {
        publicUrl: encodeURI(`${this.url}/${renderPath}/public/${_path}${queryString}`)
      }
    };
  }
  /**
   * Deletes files within the same bucket
   *
   * @param paths An array of files to delete, including the path and file name. For example [`'folder/image.png'`].
   */
  remove(paths) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.remove)(this.fetch, `${this.url}/object/${this.bucketId}`, {
          prefixes: paths
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Get file metadata
   * @param id the file id to retrieve metadata
   */
  // async getMetadata(
  //   id: string
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await get(this.fetch, `${this.url}/metadata/${id}`, { headers: this.headers })
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Update file metadata
   * @param id the file id to update metadata
   * @param meta the new file metadata
   */
  // async updateMetadata(
  //   id: string,
  //   meta: Metadata
  // ): Promise<
  //   | {
  //       data: Metadata
  //       error: null
  //     }
  //   | {
  //       data: null
  //       error: StorageError
  //     }
  // > {
  //   try {
  //     const data = await post(
  //       this.fetch,
  //       `${this.url}/metadata/${id}`,
  //       { ...meta },
  //       { headers: this.headers }
  //     )
  //     return { data, error: null }
  //   } catch (error) {
  //     if (isStorageError(error)) {
  //       return { data: null, error }
  //     }
  //     throw error
  //   }
  // }
  /**
   * Lists all the files within a bucket.
   * @param path The folder path.
   */
  list(path, options, parameters) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const body = Object.assign(Object.assign(Object.assign({}, DEFAULT_SEARCH_OPTIONS), options), {
          prefix: path || ''
        });
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/object/list/${this.bucketId}`, body, {
          headers: this.headers
        }, parameters);
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  _getFinalPath(path) {
    return `${this.bucketId}/${path}`;
  }
  _removeEmptyFolders(path) {
    return path.replace(/^\/|\/$/g, '').replace(/\/+/g, '/');
  }
  transformOptsToQueryString(transform) {
    const params = [];
    if (transform.width) {
      params.push(`width=${transform.width}`);
    }
    if (transform.height) {
      params.push(`height=${transform.height}`);
    }
    if (transform.resize) {
      params.push(`resize=${transform.resize}`);
    }
    if (transform.format) {
      params.push(`format=${transform.format}`);
    }
    if (transform.quality) {
      params.push(`quality=${transform.quality}`);
    }
    return params.join('&');
  }
}
exports.default = StorageFileApi;
},{"../lib/errors":"node_modules/@supabase/storage-js/dist/module/lib/errors.js","../lib/fetch":"node_modules/@supabase/storage-js/dist/module/lib/fetch.js","../lib/helpers":"node_modules/@supabase/storage-js/dist/module/lib/helpers.js"}],"node_modules/@supabase/storage-js/dist/module/lib/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;
// generated by genversion
const version = exports.version = '2.5.5';
},{}],"node_modules/@supabase/storage-js/dist/module/lib/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_HEADERS = void 0;
var _version = require("./version");
const DEFAULT_HEADERS = exports.DEFAULT_HEADERS = {
  'X-Client-Info': `storage-js/${_version.version}`
};
},{"./version":"node_modules/@supabase/storage-js/dist/module/lib/version.js"}],"node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _constants = require("../lib/constants");
var _errors = require("../lib/errors");
var _fetch = require("../lib/fetch");
var _helpers = require("../lib/helpers");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
class StorageBucketApi {
  constructor(url, headers = {}, fetch) {
    this.url = url;
    this.headers = Object.assign(Object.assign({}, _constants.DEFAULT_HEADERS), headers);
    this.fetch = (0, _helpers.resolveFetch)(fetch);
  }
  /**
   * Retrieves the details of all Storage buckets within an existing project.
   */
  listBuckets() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.get)(this.fetch, `${this.url}/bucket`, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Retrieves the details of an existing Storage bucket.
   *
   * @param id The unique identifier of the bucket you would like to retrieve.
   */
  getBucket(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.get)(this.fetch, `${this.url}/bucket/${id}`, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Creates a new Storage bucket
   *
   * @param id A unique identifier for the bucket you are creating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations. By default, buckets are private.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   * @returns newly created bucket id
   */
  createBucket(id, options = {
    public: false
  }) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/bucket`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Updates a Storage bucket
   *
   * @param id A unique identifier for the bucket you are updating.
   * @param options.public The visibility of the bucket. Public buckets don't require an authorization token to download objects, but still require a valid token for all other operations.
   * @param options.fileSizeLimit specifies the max file size in bytes that can be uploaded to this bucket.
   * The global file size limit takes precedence over this value.
   * The default value is null, which doesn't set a per bucket file size limit.
   * @param options.allowedMimeTypes specifies the allowed mime types that this bucket can accept during upload.
   * The default value is null, which allows files with all mime types to be uploaded.
   * Each mime type specified can be a wildcard, e.g. image/*, or a specific mime type, e.g. image/png.
   */
  updateBucket(id, options) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.put)(this.fetch, `${this.url}/bucket/${id}`, {
          id,
          name: id,
          public: options.public,
          file_size_limit: options.fileSizeLimit,
          allowed_mime_types: options.allowedMimeTypes
        }, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Removes all objects inside a single bucket.
   *
   * @param id The unique identifier of the bucket you would like to empty.
   */
  emptyBucket(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.post)(this.fetch, `${this.url}/bucket/${id}/empty`, {}, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * Deletes an existing bucket. A bucket can't be deleted with existing objects inside it.
   * You must first `empty()` the bucket.
   *
   * @param id The unique identifier of the bucket you would like to delete.
   */
  deleteBucket(id) {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        const data = yield (0, _fetch.remove)(this.fetch, `${this.url}/bucket/${id}`, {}, {
          headers: this.headers
        });
        return {
          data,
          error: null
        };
      } catch (error) {
        if ((0, _errors.isStorageError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
}
exports.default = StorageBucketApi;
},{"../lib/constants":"node_modules/@supabase/storage-js/dist/module/lib/constants.js","../lib/errors":"node_modules/@supabase/storage-js/dist/module/lib/errors.js","../lib/fetch":"node_modules/@supabase/storage-js/dist/module/lib/fetch.js","../lib/helpers":"node_modules/@supabase/storage-js/dist/module/lib/helpers.js"}],"node_modules/@supabase/storage-js/dist/module/StorageClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.StorageClient = void 0;
var _StorageFileApi = _interopRequireDefault(require("./packages/StorageFileApi"));
var _StorageBucketApi = _interopRequireDefault(require("./packages/StorageBucketApi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
class StorageClient extends _StorageBucketApi.default {
  constructor(url, headers = {}, fetch) {
    super(url, headers, fetch);
  }
  /**
   * Perform file operation in a bucket.
   *
   * @param id The bucket id to operate on.
   */
  from(id) {
    return new _StorageFileApi.default(this.url, this.headers, id, this.fetch);
  }
}
exports.StorageClient = StorageClient;
},{"./packages/StorageFileApi":"node_modules/@supabase/storage-js/dist/module/packages/StorageFileApi.js","./packages/StorageBucketApi":"node_modules/@supabase/storage-js/dist/module/packages/StorageBucketApi.js"}],"node_modules/@supabase/storage-js/dist/module/lib/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"node_modules/@supabase/storage-js/dist/module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  StorageClient: true
};
Object.defineProperty(exports, "StorageClient", {
  enumerable: true,
  get: function () {
    return _StorageClient.StorageClient;
  }
});
var _StorageClient = require("./StorageClient");
var _types = require("./lib/types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _errors = require("./lib/errors");
Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errors[key];
    }
  });
});
},{"./StorageClient":"node_modules/@supabase/storage-js/dist/module/StorageClient.js","./lib/types":"node_modules/@supabase/storage-js/dist/module/lib/types.js","./lib/errors":"node_modules/@supabase/storage-js/dist/module/lib/errors.js"}],"node_modules/@supabase/supabase-js/dist/module/lib/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;
const version = exports.version = '2.43.1';
},{}],"node_modules/@supabase/supabase-js/dist/module/lib/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DEFAULT_REALTIME_OPTIONS = exports.DEFAULT_HEADERS = exports.DEFAULT_GLOBAL_OPTIONS = exports.DEFAULT_DB_OPTIONS = exports.DEFAULT_AUTH_OPTIONS = void 0;
var _version = require("./version");
let JS_ENV = '';
// @ts-ignore
if (typeof Deno !== 'undefined') {
  JS_ENV = 'deno';
} else if (typeof document !== 'undefined') {
  JS_ENV = 'web';
} else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
  JS_ENV = 'react-native';
} else {
  JS_ENV = 'node';
}
const DEFAULT_HEADERS = exports.DEFAULT_HEADERS = {
  'X-Client-Info': `supabase-js-${JS_ENV}/${_version.version}`
};
const DEFAULT_GLOBAL_OPTIONS = exports.DEFAULT_GLOBAL_OPTIONS = {
  headers: DEFAULT_HEADERS
};
const DEFAULT_DB_OPTIONS = exports.DEFAULT_DB_OPTIONS = {
  schema: 'public'
};
const DEFAULT_AUTH_OPTIONS = exports.DEFAULT_AUTH_OPTIONS = {
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  flowType: 'implicit'
};
const DEFAULT_REALTIME_OPTIONS = exports.DEFAULT_REALTIME_OPTIONS = {};
},{"./version":"node_modules/@supabase/supabase-js/dist/module/lib/version.js"}],"node_modules/@supabase/supabase-js/dist/module/lib/fetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.resolveHeadersConstructor = exports.resolveFetch = exports.fetchWithAuth = void 0;
var _nodeFetch = _interopRequireWildcard(require("@supabase/node-fetch"));
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && {}.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
// @ts-ignore

const resolveFetch = customFetch => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = _nodeFetch.default;
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
exports.resolveFetch = resolveFetch;
const resolveHeadersConstructor = () => {
  if (typeof Headers === 'undefined') {
    return _nodeFetch.Headers;
  }
  return Headers;
};
exports.resolveHeadersConstructor = resolveHeadersConstructor;
const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
  const fetch = resolveFetch(customFetch);
  const HeadersConstructor = resolveHeadersConstructor();
  return (input, init) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = yield getAccessToken()) !== null && _a !== void 0 ? _a : supabaseKey;
    let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
    if (!headers.has('apikey')) {
      headers.set('apikey', supabaseKey);
    }
    if (!headers.has('Authorization')) {
      headers.set('Authorization', `Bearer ${accessToken}`);
    }
    return fetch(input, Object.assign(Object.assign({}, init), {
      headers
    }));
  });
};
exports.fetchWithAuth = fetchWithAuth;
},{"@supabase/node-fetch":"node_modules/@supabase/node-fetch/browser.js"}],"node_modules/@supabase/supabase-js/dist/module/lib/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.applySettingDefaults = applySettingDefaults;
exports.isBrowser = void 0;
exports.stripTrailingSlash = stripTrailingSlash;
exports.uuid = uuid;
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
function stripTrailingSlash(url) {
  return url.replace(/\/$/, '');
}
const isBrowser = () => typeof window !== 'undefined';
exports.isBrowser = isBrowser;
function applySettingDefaults(options, defaults) {
  const {
    db: dbOptions,
    auth: authOptions,
    realtime: realtimeOptions,
    global: globalOptions
  } = options;
  const {
    db: DEFAULT_DB_OPTIONS,
    auth: DEFAULT_AUTH_OPTIONS,
    realtime: DEFAULT_REALTIME_OPTIONS,
    global: DEFAULT_GLOBAL_OPTIONS
  } = defaults;
  return {
    db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS), dbOptions),
    auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), authOptions),
    realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS), realtimeOptions),
    global: Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS), globalOptions)
  };
}
},{}],"node_modules/@supabase/auth-js/dist/module/lib/version.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.version = void 0;
const version = exports.version = '2.64.2';
},{}],"node_modules/@supabase/auth-js/dist/module/lib/constants.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.STORAGE_KEY = exports.NETWORK_FAILURE = exports.GOTRUE_URL = exports.EXPIRY_MARGIN = exports.DEFAULT_HEADERS = exports.AUDIENCE = exports.API_VERSION_HEADER_NAME = exports.API_VERSIONS = void 0;
var _version = require("./version");
const GOTRUE_URL = exports.GOTRUE_URL = 'http://localhost:9999';
const STORAGE_KEY = exports.STORAGE_KEY = 'supabase.auth.token';
const AUDIENCE = exports.AUDIENCE = '';
const DEFAULT_HEADERS = exports.DEFAULT_HEADERS = {
  'X-Client-Info': `gotrue-js/${_version.version}`
};
const EXPIRY_MARGIN = exports.EXPIRY_MARGIN = 10; // in seconds
const NETWORK_FAILURE = exports.NETWORK_FAILURE = {
  MAX_RETRIES: 10,
  RETRY_INTERVAL: 2 // in deciseconds
};
const API_VERSION_HEADER_NAME = exports.API_VERSION_HEADER_NAME = 'X-Supabase-Api-Version';
const API_VERSIONS = exports.API_VERSIONS = {
  '2024-01-01': {
    timestamp: Date.parse('2024-01-01T00:00:00.0Z'),
    name: '2024-01-01'
  }
};
},{"./version":"node_modules/@supabase/auth-js/dist/module/lib/version.js"}],"node_modules/@supabase/auth-js/dist/module/lib/helpers.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Deferred = void 0;
exports.decodeBase64URL = decodeBase64URL;
exports.decodeJWTPayload = decodeJWTPayload;
exports.expiresAt = expiresAt;
exports.generatePKCEChallenge = generatePKCEChallenge;
exports.generatePKCEVerifier = generatePKCEVerifier;
exports.getCodeChallengeAndMethod = getCodeChallengeAndMethod;
exports.looksLikeFetchResponse = exports.isBrowser = exports.getItemAsync = void 0;
exports.parseParametersFromURL = parseParametersFromURL;
exports.parseResponseAPIVersion = parseResponseAPIVersion;
exports.resolveFetch = exports.removeItemAsync = void 0;
exports.retryable = retryable;
exports.setItemAsync = void 0;
exports.sleep = sleep;
exports.supportsLocalStorage = void 0;
exports.uuid = uuid;
var _constants = require("./constants");
function expiresAt(expiresIn) {
  const timeNow = Math.round(Date.now() / 1000);
  return timeNow + expiresIn;
}
function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0,
      v = c == 'x' ? r : r & 0x3 | 0x8;
    return v.toString(16);
  });
}
const isBrowser = () => typeof document !== 'undefined';
exports.isBrowser = isBrowser;
const localStorageWriteTests = {
  tested: false,
  writable: false
};
/**
 * Checks whether localStorage is supported on this browser.
 */
const supportsLocalStorage = () => {
  if (!isBrowser()) {
    return false;
  }
  try {
    if (typeof globalThis.localStorage !== 'object') {
      return false;
    }
  } catch (e) {
    // DOM exception when accessing `localStorage`
    return false;
  }
  if (localStorageWriteTests.tested) {
    return localStorageWriteTests.writable;
  }
  const randomKey = `lswt-${Math.random()}${Math.random()}`;
  try {
    globalThis.localStorage.setItem(randomKey, randomKey);
    globalThis.localStorage.removeItem(randomKey);
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = true;
  } catch (e) {
    // localStorage can't be written to
    // https://www.chromium.org/for-testers/bug-reporting-guidelines/uncaught-securityerror-failed-to-read-the-localstorage-property-from-window-access-is-denied-for-this-document
    localStorageWriteTests.tested = true;
    localStorageWriteTests.writable = false;
  }
  return localStorageWriteTests.writable;
};
/**
 * Extracts parameters encoded in the URL both in the query and fragment.
 */
exports.supportsLocalStorage = supportsLocalStorage;
function parseParametersFromURL(href) {
  const result = {};
  const url = new URL(href);
  if (url.hash && url.hash[0] === '#') {
    try {
      const hashSearchParams = new URLSearchParams(url.hash.substring(1));
      hashSearchParams.forEach((value, key) => {
        result[key] = value;
      });
    } catch (e) {
      // hash is not a query string
    }
  }
  // search parameters take precedence over hash parameters
  url.searchParams.forEach((value, key) => {
    result[key] = value;
  });
  return result;
}
const resolveFetch = customFetch => {
  let _fetch;
  if (customFetch) {
    _fetch = customFetch;
  } else if (typeof fetch === 'undefined') {
    _fetch = (...args) => require("_bundle_loader")(require.resolve('@supabase/node-fetch')).then(({
      default: fetch
    }) => fetch(...args));
  } else {
    _fetch = fetch;
  }
  return (...args) => _fetch(...args);
};
exports.resolveFetch = resolveFetch;
const looksLikeFetchResponse = maybeResponse => {
  return typeof maybeResponse === 'object' && maybeResponse !== null && 'status' in maybeResponse && 'ok' in maybeResponse && 'json' in maybeResponse && typeof maybeResponse.json === 'function';
};
// Storage helpers
exports.looksLikeFetchResponse = looksLikeFetchResponse;
const setItemAsync = async (storage, key, data) => {
  await storage.setItem(key, JSON.stringify(data));
};
exports.setItemAsync = setItemAsync;
const getItemAsync = async (storage, key) => {
  const value = await storage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (_a) {
    return value;
  }
};
exports.getItemAsync = getItemAsync;
const removeItemAsync = async (storage, key) => {
  await storage.removeItem(key);
};
exports.removeItemAsync = removeItemAsync;
function decodeBase64URL(value) {
  const key = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  let base64 = '';
  let chr1, chr2, chr3;
  let enc1, enc2, enc3, enc4;
  let i = 0;
  value = value.replace('-', '+').replace('_', '/');
  while (i < value.length) {
    enc1 = key.indexOf(value.charAt(i++));
    enc2 = key.indexOf(value.charAt(i++));
    enc3 = key.indexOf(value.charAt(i++));
    enc4 = key.indexOf(value.charAt(i++));
    chr1 = enc1 << 2 | enc2 >> 4;
    chr2 = (enc2 & 15) << 4 | enc3 >> 2;
    chr3 = (enc3 & 3) << 6 | enc4;
    base64 = base64 + String.fromCharCode(chr1);
    if (enc3 != 64 && chr2 != 0) {
      base64 = base64 + String.fromCharCode(chr2);
    }
    if (enc4 != 64 && chr3 != 0) {
      base64 = base64 + String.fromCharCode(chr3);
    }
  }
  return base64;
}
/**
 * A deferred represents some asynchronous work that is not yet finished, which
 * may or may not culminate in a value.
 * Taken from: https://github.com/mike-north/types/blob/master/src/async.ts
 */
class Deferred {
  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;
    this.promise = new Deferred.promiseConstructor((res, rej) => {
      // eslint-disable-next-line @typescript-eslint/no-extra-semi
      ;
      this.resolve = res;
      this.reject = rej;
    });
  }
}
exports.Deferred = Deferred;
Deferred.promiseConstructor = Promise;
// Taken from: https://stackoverflow.com/questions/38552003/how-to-decode-jwt-token-in-javascript-without-using-a-library
function decodeJWTPayload(token) {
  // Regex checks for base64url format
  const base64UrlRegex = /^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}=?$|[a-z0-9_-]{2}(==)?$)$/i;
  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new Error('JWT is not valid: not a JWT structure');
  }
  if (!base64UrlRegex.test(parts[1])) {
    throw new Error('JWT is not valid: payload is not in base64url format');
  }
  const base64Url = parts[1];
  return JSON.parse(decodeBase64URL(base64Url));
}
/**
 * Creates a promise that resolves to null after some time.
 */
async function sleep(time) {
  return await new Promise(accept => {
    setTimeout(() => accept(null), time);
  });
}
/**
 * Converts the provided async function into a retryable function. Each result
 * or thrown error is sent to the isRetryable function which should return true
 * if the function should run again.
 */
function retryable(fn, isRetryable) {
  const promise = new Promise((accept, reject) => {
    // eslint-disable-next-line @typescript-eslint/no-extra-semi
    ;
    (async () => {
      for (let attempt = 0; attempt < Infinity; attempt++) {
        try {
          const result = await fn(attempt);
          if (!isRetryable(attempt, null, result)) {
            accept(result);
            return;
          }
        } catch (e) {
          if (!isRetryable(attempt, e)) {
            reject(e);
            return;
          }
        }
      }
    })();
  });
  return promise;
}
function dec2hex(dec) {
  return ('0' + dec.toString(16)).substr(-2);
}
// Functions below taken from: https://stackoverflow.com/questions/63309409/creating-a-code-verifier-and-challenge-for-pkce-auth-on-spotify-api-in-reactjs
function generatePKCEVerifier() {
  const verifierLength = 56;
  const array = new Uint32Array(verifierLength);
  if (typeof crypto === 'undefined') {
    const charSet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
    const charSetLen = charSet.length;
    let verifier = '';
    for (let i = 0; i < verifierLength; i++) {
      verifier += charSet.charAt(Math.floor(Math.random() * charSetLen));
    }
    return verifier;
  }
  crypto.getRandomValues(array);
  return Array.from(array, dec2hex).join('');
}
async function sha256(randomString) {
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(randomString);
  const hash = await crypto.subtle.digest('SHA-256', encodedData);
  const bytes = new Uint8Array(hash);
  return Array.from(bytes).map(c => String.fromCharCode(c)).join('');
}
function base64urlencode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function generatePKCEChallenge(verifier) {
  const hasCryptoSupport = typeof crypto !== 'undefined' && typeof crypto.subtle !== 'undefined' && typeof TextEncoder !== 'undefined';
  if (!hasCryptoSupport) {
    console.warn('WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256.');
    return verifier;
  }
  const hashed = await sha256(verifier);
  return base64urlencode(hashed);
}
async function getCodeChallengeAndMethod(storage, storageKey, isPasswordRecovery = false) {
  const codeVerifier = generatePKCEVerifier();
  let storedCodeVerifier = codeVerifier;
  if (isPasswordRecovery) {
    storedCodeVerifier += '/PASSWORD_RECOVERY';
  }
  await setItemAsync(storage, `${storageKey}-code-verifier`, storedCodeVerifier);
  const codeChallenge = await generatePKCEChallenge(codeVerifier);
  const codeChallengeMethod = codeVerifier === codeChallenge ? 'plain' : 's256';
  return [codeChallenge, codeChallengeMethod];
}
/** Parses the API version which is 2YYY-MM-DD. */
const API_VERSION_REGEX = /^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i;
function parseResponseAPIVersion(response) {
  const apiVersion = response.headers.get(_constants.API_VERSION_HEADER_NAME);
  if (!apiVersion) {
    return null;
  }
  if (!apiVersion.match(API_VERSION_REGEX)) {
    return null;
  }
  try {
    const date = new Date(`${apiVersion}T00:00:00.0Z`);
    return date;
  } catch (e) {
    return null;
  }
}
},{"./constants":"node_modules/@supabase/auth-js/dist/module/lib/constants.js","_bundle_loader":"node_modules/parcel-bundler/src/builtins/bundle-loader.js","@supabase/node-fetch":[["browser.b6f259d9.js","node_modules/@supabase/node-fetch/browser.js"],"browser.b6f259d9.js.map","node_modules/@supabase/node-fetch/browser.js"]}],"node_modules/@supabase/auth-js/dist/module/lib/errors.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CustomAuthError = exports.AuthWeakPasswordError = exports.AuthUnknownError = exports.AuthSessionMissingError = exports.AuthRetryableFetchError = exports.AuthPKCEGrantCodeExchangeError = exports.AuthInvalidTokenResponseError = exports.AuthInvalidCredentialsError = exports.AuthImplicitGrantRedirectError = exports.AuthError = exports.AuthApiError = void 0;
exports.isAuthApiError = isAuthApiError;
exports.isAuthError = isAuthError;
exports.isAuthRetryableFetchError = isAuthRetryableFetchError;
exports.isAuthWeakPasswordError = isAuthWeakPasswordError;
class AuthError extends Error {
  constructor(message, status, code) {
    super(message);
    this.__isAuthError = true;
    this.name = 'AuthError';
    this.status = status;
    this.code = code;
  }
}
exports.AuthError = AuthError;
function isAuthError(error) {
  return typeof error === 'object' && error !== null && '__isAuthError' in error;
}
class AuthApiError extends AuthError {
  constructor(message, status, code) {
    super(message, status, code);
    this.name = 'AuthApiError';
    this.status = status;
    this.code = code;
  }
}
exports.AuthApiError = AuthApiError;
function isAuthApiError(error) {
  return isAuthError(error) && error.name === 'AuthApiError';
}
class AuthUnknownError extends AuthError {
  constructor(message, originalError) {
    super(message);
    this.name = 'AuthUnknownError';
    this.originalError = originalError;
  }
}
exports.AuthUnknownError = AuthUnknownError;
class CustomAuthError extends AuthError {
  constructor(message, name, status, code) {
    super(message, status, code);
    this.name = name;
    this.status = status;
  }
}
exports.CustomAuthError = CustomAuthError;
class AuthSessionMissingError extends CustomAuthError {
  constructor() {
    super('Auth session missing!', 'AuthSessionMissingError', 400, undefined);
  }
}
exports.AuthSessionMissingError = AuthSessionMissingError;
class AuthInvalidTokenResponseError extends CustomAuthError {
  constructor() {
    super('Auth session or user missing', 'AuthInvalidTokenResponseError', 500, undefined);
  }
}
exports.AuthInvalidTokenResponseError = AuthInvalidTokenResponseError;
class AuthInvalidCredentialsError extends CustomAuthError {
  constructor(message) {
    super(message, 'AuthInvalidCredentialsError', 400, undefined);
  }
}
exports.AuthInvalidCredentialsError = AuthInvalidCredentialsError;
class AuthImplicitGrantRedirectError extends CustomAuthError {
  constructor(message, details = null) {
    super(message, 'AuthImplicitGrantRedirectError', 500, undefined);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
exports.AuthImplicitGrantRedirectError = AuthImplicitGrantRedirectError;
class AuthPKCEGrantCodeExchangeError extends CustomAuthError {
  constructor(message, details = null) {
    super(message, 'AuthPKCEGrantCodeExchangeError', 500, undefined);
    this.details = null;
    this.details = details;
  }
  toJSON() {
    return {
      name: this.name,
      message: this.message,
      status: this.status,
      details: this.details
    };
  }
}
exports.AuthPKCEGrantCodeExchangeError = AuthPKCEGrantCodeExchangeError;
class AuthRetryableFetchError extends CustomAuthError {
  constructor(message, status) {
    super(message, 'AuthRetryableFetchError', status, undefined);
  }
}
exports.AuthRetryableFetchError = AuthRetryableFetchError;
function isAuthRetryableFetchError(error) {
  return isAuthError(error) && error.name === 'AuthRetryableFetchError';
}
/**
 * This error is thrown on certain methods when the password used is deemed
 * weak. Inspect the reasons to identify what password strength rules are
 * inadequate.
 */
class AuthWeakPasswordError extends CustomAuthError {
  constructor(message, status, reasons) {
    super(message, 'AuthWeakPasswordError', status, 'weak_password');
    this.reasons = reasons;
  }
}
exports.AuthWeakPasswordError = AuthWeakPasswordError;
function isAuthWeakPasswordError(error) {
  return isAuthError(error) && error.name === 'AuthWeakPasswordError';
}
},{}],"node_modules/@supabase/auth-js/dist/module/lib/fetch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports._generateLinkResponse = _generateLinkResponse;
exports._noResolveJsonResponse = _noResolveJsonResponse;
exports._request = _request;
exports._sessionResponse = _sessionResponse;
exports._sessionResponsePassword = _sessionResponsePassword;
exports._ssoResponse = _ssoResponse;
exports._userResponse = _userResponse;
exports.handleError = handleError;
var _constants = require("./constants");
var _helpers = require("./helpers");
var _errors = require("./errors");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
const _getErrorMessage = err => err.msg || err.message || err.error_description || err.error || JSON.stringify(err);
const NETWORK_ERROR_CODES = [502, 503, 504];
async function handleError(error) {
  var _a;
  if (!(0, _helpers.looksLikeFetchResponse)(error)) {
    throw new _errors.AuthRetryableFetchError(_getErrorMessage(error), 0);
  }
  if (NETWORK_ERROR_CODES.includes(error.status)) {
    // status in 500...599 range - server had an error, request might be retryed.
    throw new _errors.AuthRetryableFetchError(_getErrorMessage(error), error.status);
  }
  let data;
  try {
    data = await error.json();
  } catch (e) {
    throw new _errors.AuthUnknownError(_getErrorMessage(e), e);
  }
  let errorCode = undefined;
  const responseAPIVersion = (0, _helpers.parseResponseAPIVersion)(error);
  if (responseAPIVersion && responseAPIVersion.getTime() >= _constants.API_VERSIONS['2024-01-01'].timestamp && typeof data === 'object' && data && typeof data.code === 'string') {
    errorCode = data.code;
  } else if (typeof data === 'object' && data && typeof data.error_code === 'string') {
    errorCode = data.error_code;
  }
  if (!errorCode) {
    // Legacy support for weak password errors, when there were no error codes
    if (typeof data === 'object' && data && typeof data.weak_password === 'object' && data.weak_password && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.reasons.reduce((a, i) => a && typeof i === 'string', true)) {
      throw new _errors.AuthWeakPasswordError(_getErrorMessage(data), error.status, data.weak_password.reasons);
    }
  } else if (errorCode === 'weak_password') {
    throw new _errors.AuthWeakPasswordError(_getErrorMessage(data), error.status, ((_a = data.weak_password) === null || _a === void 0 ? void 0 : _a.reasons) || []);
  }
  throw new _errors.AuthApiError(_getErrorMessage(data), error.status || 500, errorCode);
}
const _getRequestParams = (method, options, parameters, body) => {
  const params = {
    method,
    headers: (options === null || options === void 0 ? void 0 : options.headers) || {}
  };
  if (method === 'GET') {
    return params;
  }
  params.headers = Object.assign({
    'Content-Type': 'application/json;charset=UTF-8'
  }, options === null || options === void 0 ? void 0 : options.headers);
  params.body = JSON.stringify(body);
  return Object.assign(Object.assign({}, params), parameters);
};
async function _request(fetcher, method, url, options) {
  var _a;
  const headers = Object.assign({}, options === null || options === void 0 ? void 0 : options.headers);
  if (!headers[_constants.API_VERSION_HEADER_NAME]) {
    headers[_constants.API_VERSION_HEADER_NAME] = _constants.API_VERSIONS['2024-01-01'].name;
  }
  if (options === null || options === void 0 ? void 0 : options.jwt) {
    headers['Authorization'] = `Bearer ${options.jwt}`;
  }
  const qs = (_a = options === null || options === void 0 ? void 0 : options.query) !== null && _a !== void 0 ? _a : {};
  if (options === null || options === void 0 ? void 0 : options.redirectTo) {
    qs['redirect_to'] = options.redirectTo;
  }
  const queryString = Object.keys(qs).length ? '?' + new URLSearchParams(qs).toString() : '';
  const data = await _handleRequest(fetcher, method, url + queryString, {
    headers,
    noResolveJson: options === null || options === void 0 ? void 0 : options.noResolveJson
  }, {}, options === null || options === void 0 ? void 0 : options.body);
  return (options === null || options === void 0 ? void 0 : options.xform) ? options === null || options === void 0 ? void 0 : options.xform(data) : {
    data: Object.assign({}, data),
    error: null
  };
}
async function _handleRequest(fetcher, method, url, options, parameters, body) {
  const requestParams = _getRequestParams(method, options, parameters, body);
  let result;
  try {
    result = await fetcher(url, Object.assign({}, requestParams));
  } catch (e) {
    console.error(e);
    // fetch failed, likely due to a network or CORS error
    throw new _errors.AuthRetryableFetchError(_getErrorMessage(e), 0);
  }
  if (!result.ok) {
    await handleError(result);
  }
  if (options === null || options === void 0 ? void 0 : options.noResolveJson) {
    return result;
  }
  try {
    return await result.json();
  } catch (e) {
    await handleError(e);
  }
}
function _sessionResponse(data) {
  var _a;
  let session = null;
  if (hasSession(data)) {
    session = Object.assign({}, data);
    if (!data.expires_at) {
      session.expires_at = (0, _helpers.expiresAt)(data.expires_in);
    }
  }
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return {
    data: {
      session,
      user
    },
    error: null
  };
}
function _sessionResponsePassword(data) {
  const response = _sessionResponse(data);
  if (!response.error && data.weak_password && typeof data.weak_password === 'object' && Array.isArray(data.weak_password.reasons) && data.weak_password.reasons.length && data.weak_password.message && typeof data.weak_password.message === 'string' && data.weak_password.reasons.reduce((a, i) => a && typeof i === 'string', true)) {
    response.data.weak_password = data.weak_password;
  }
  return response;
}
function _userResponse(data) {
  var _a;
  const user = (_a = data.user) !== null && _a !== void 0 ? _a : data;
  return {
    data: {
      user
    },
    error: null
  };
}
function _ssoResponse(data) {
  return {
    data,
    error: null
  };
}
function _generateLinkResponse(data) {
  const {
      action_link,
      email_otp,
      hashed_token,
      redirect_to,
      verification_type
    } = data,
    rest = __rest(data, ["action_link", "email_otp", "hashed_token", "redirect_to", "verification_type"]);
  const properties = {
    action_link,
    email_otp,
    hashed_token,
    redirect_to,
    verification_type
  };
  const user = Object.assign({}, rest);
  return {
    data: {
      properties,
      user
    },
    error: null
  };
}
function _noResolveJsonResponse(data) {
  return data;
}
/**
 * hasSession checks if the response object contains a valid session
 * @param data A response object
 * @returns true if a session is in the response
 */
function hasSession(data) {
  return data.access_token && data.refresh_token && data.expires_in;
}
},{"./constants":"node_modules/@supabase/auth-js/dist/module/lib/constants.js","./helpers":"node_modules/@supabase/auth-js/dist/module/lib/helpers.js","./errors":"node_modules/@supabase/auth-js/dist/module/lib/errors.js"}],"node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _fetch = require("./lib/fetch");
var _helpers = require("./lib/helpers");
var _errors = require("./lib/errors");
var __rest = void 0 && (void 0).__rest || function (s, e) {
  var t = {};
  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];
  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};
class GoTrueAdminApi {
  constructor({
    url = '',
    headers = {},
    fetch
  }) {
    this.url = url;
    this.headers = headers;
    this.fetch = (0, _helpers.resolveFetch)(fetch);
    this.mfa = {
      listFactors: this._listFactors.bind(this),
      deleteFactor: this._deleteFactor.bind(this)
    };
  }
  /**
   * Removes a logged-in session.
   * @param jwt A valid, logged-in JWT.
   * @param scope The logout sope.
   */
  async signOut(jwt, scope = 'global') {
    try {
      await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/logout?scope=${scope}`, {
        headers: this.headers,
        jwt,
        noResolveJson: true
      });
      return {
        data: null,
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * Sends an invite link to an email address.
   * @param email The email address of the user.
   * @param options Additional options to be included when inviting.
   */
  async inviteUserByEmail(email, options = {}) {
    try {
      return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/invite`, {
        body: {
          email,
          data: options.data
        },
        headers: this.headers,
        redirectTo: options.redirectTo,
        xform: _fetch._userResponse
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Generates email links and OTPs to be sent via a custom email provider.
   * @param email The user's email.
   * @param options.password User password. For signup only.
   * @param options.data Optional user metadata. For signup only.
   * @param options.redirectTo The redirect url which should be appended to the generated link
   */
  async generateLink(params) {
    try {
      const {
          options
        } = params,
        rest = __rest(params, ["options"]);
      const body = Object.assign(Object.assign({}, rest), options);
      if ('newEmail' in rest) {
        // replace newEmail with new_email in request body
        body.new_email = rest === null || rest === void 0 ? void 0 : rest.newEmail;
        delete body['newEmail'];
      }
      return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/admin/generate_link`, {
        body: body,
        headers: this.headers,
        xform: _fetch._generateLinkResponse,
        redirectTo: options === null || options === void 0 ? void 0 : options.redirectTo
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            properties: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  // User Admin API
  /**
   * Creates a new user.
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async createUser(attributes) {
    try {
      return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/admin/users`, {
        body: attributes,
        headers: this.headers,
        xform: _fetch._userResponse
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Get a list of users.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   * @param params An object which supports `page` and `perPage` as numbers, to alter the paginated results.
   */
  async listUsers(params) {
    var _a, _b, _c, _d, _e, _f, _g;
    try {
      const pagination = {
        nextPage: null,
        lastPage: 0,
        total: 0
      };
      const response = await (0, _fetch._request)(this.fetch, 'GET', `${this.url}/admin/users`, {
        headers: this.headers,
        noResolveJson: true,
        query: {
          page: (_b = (_a = params === null || params === void 0 ? void 0 : params.page) === null || _a === void 0 ? void 0 : _a.toString()) !== null && _b !== void 0 ? _b : '',
          per_page: (_d = (_c = params === null || params === void 0 ? void 0 : params.perPage) === null || _c === void 0 ? void 0 : _c.toString()) !== null && _d !== void 0 ? _d : ''
        },
        xform: _fetch._noResolveJsonResponse
      });
      if (response.error) throw response.error;
      const users = await response.json();
      const total = (_e = response.headers.get('x-total-count')) !== null && _e !== void 0 ? _e : 0;
      const links = (_g = (_f = response.headers.get('link')) === null || _f === void 0 ? void 0 : _f.split(',')) !== null && _g !== void 0 ? _g : [];
      if (links.length > 0) {
        links.forEach(link => {
          const page = parseInt(link.split(';')[0].split('=')[1].substring(0, 1));
          const rel = JSON.parse(link.split(';')[1].split('=')[1]);
          pagination[`${rel}Page`] = page;
        });
        pagination.total = parseInt(total);
      }
      return {
        data: Object.assign(Object.assign({}, users), pagination),
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            users: []
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Get user by id.
   *
   * @param uid The user's unique identifier
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async getUserById(uid) {
    try {
      return await (0, _fetch._request)(this.fetch, 'GET', `${this.url}/admin/users/${uid}`, {
        headers: this.headers,
        xform: _fetch._userResponse
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Updates the user data.
   *
   * @param attributes The data you want to update.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async updateUserById(uid, attributes) {
    try {
      return await (0, _fetch._request)(this.fetch, 'PUT', `${this.url}/admin/users/${uid}`, {
        body: attributes,
        headers: this.headers,
        xform: _fetch._userResponse
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Delete a user. Requires a `service_role` key.
   *
   * @param id The user id you want to remove.
   * @param shouldSoftDelete If true, then the user will be soft-deleted (setting `deleted_at` to the current timestamp and disabling their account while preserving their data) from the auth schema.
   * Defaults to false for backward compatibility.
   *
   * This function should only be called on a server. Never expose your `service_role` key in the browser.
   */
  async deleteUser(id, shouldSoftDelete = false) {
    try {
      return await (0, _fetch._request)(this.fetch, 'DELETE', `${this.url}/admin/users/${id}`, {
        headers: this.headers,
        body: {
          should_soft_delete: shouldSoftDelete
        },
        xform: _fetch._userResponse
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  async _listFactors(params) {
    try {
      const {
        data,
        error
      } = await (0, _fetch._request)(this.fetch, 'GET', `${this.url}/admin/users/${params.userId}/factors`, {
        headers: this.headers,
        xform: factors => {
          return {
            data: {
              factors
            },
            error: null
          };
        }
      });
      return {
        data,
        error
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  async _deleteFactor(params) {
    try {
      const data = await (0, _fetch._request)(this.fetch, 'DELETE', `${this.url}/admin/users/${params.userId}/factors/${params.id}`, {
        headers: this.headers
      });
      return {
        data,
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
}
exports.default = GoTrueAdminApi;
},{"./lib/fetch":"node_modules/@supabase/auth-js/dist/module/lib/fetch.js","./lib/helpers":"node_modules/@supabase/auth-js/dist/module/lib/helpers.js","./lib/errors":"node_modules/@supabase/auth-js/dist/module/lib/errors.js"}],"node_modules/@supabase/auth-js/dist/module/lib/local-storage.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.localStorageAdapter = void 0;
exports.memoryLocalStorageAdapter = memoryLocalStorageAdapter;
var _helpers = require("./helpers");
/**
 * Provides safe access to the globalThis.localStorage property.
 */
const localStorageAdapter = exports.localStorageAdapter = {
  getItem: key => {
    if (!(0, _helpers.supportsLocalStorage)()) {
      return null;
    }
    return globalThis.localStorage.getItem(key);
  },
  setItem: (key, value) => {
    if (!(0, _helpers.supportsLocalStorage)()) {
      return;
    }
    globalThis.localStorage.setItem(key, value);
  },
  removeItem: key => {
    if (!(0, _helpers.supportsLocalStorage)()) {
      return;
    }
    globalThis.localStorage.removeItem(key);
  }
};
/**
 * Returns a localStorage-like object that stores the key-value pairs in
 * memory.
 */
function memoryLocalStorageAdapter(store = {}) {
  return {
    getItem: key => {
      return store[key] || null;
    },
    setItem: (key, value) => {
      store[key] = value;
    },
    removeItem: key => {
      delete store[key];
    }
  };
}
},{"./helpers":"node_modules/@supabase/auth-js/dist/module/lib/helpers.js"}],"node_modules/@supabase/auth-js/dist/module/lib/polyfills.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.polyfillGlobalThis = polyfillGlobalThis;
/**
 * https://mathiasbynens.be/notes/globalthis
 */
function polyfillGlobalThis() {
  if (typeof globalThis === 'object') return;
  try {
    Object.defineProperty(Object.prototype, '__magic__', {
      get: function () {
        return this;
      },
      configurable: true
    });
    // @ts-expect-error 'Allow access to magic'
    __magic__.globalThis = __magic__;
    // @ts-expect-error 'Allow access to magic'
    delete Object.prototype.__magic__;
  } catch (e) {
    if (typeof self !== 'undefined') {
      // @ts-expect-error 'Allow access to globals'
      self.globalThis = self;
    }
  }
}
},{}],"node_modules/@supabase/auth-js/dist/module/lib/locks.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.internals = exports.NavigatorLockAcquireTimeoutError = exports.LockAcquireTimeoutError = void 0;
exports.navigatorLock = navigatorLock;
var _helpers = require("./helpers");
/**
 * @experimental
 */
const internals = exports.internals = {
  /**
   * @experimental
   */
  debug: !!(globalThis && (0, _helpers.supportsLocalStorage)() && globalThis.localStorage && globalThis.localStorage.getItem('supabase.gotrue-js.locks.debug') === 'true')
};
/**
 * An error thrown when a lock cannot be acquired after some amount of time.
 *
 * Use the {@link #isAcquireTimeout} property instead of checking with `instanceof`.
 */
class LockAcquireTimeoutError extends Error {
  constructor(message) {
    super(message);
    this.isAcquireTimeout = true;
  }
}
exports.LockAcquireTimeoutError = LockAcquireTimeoutError;
class NavigatorLockAcquireTimeoutError extends LockAcquireTimeoutError {}
/**
 * Implements a global exclusive lock using the Navigator LockManager API. It
 * is available on all browsers released after 2022-03-15 with Safari being the
 * last one to release support. If the API is not available, this function will
 * throw. Make sure you check availablility before configuring {@link
 * GoTrueClient}.
 *
 * You can turn on debugging by setting the `supabase.gotrue-js.locks.debug`
 * local storage item to `true`.
 *
 * Internals:
 *
 * Since the LockManager API does not preserve stack traces for the async
 * function passed in the `request` method, a trick is used where acquiring the
 * lock releases a previously started promise to run the operation in the `fn`
 * function. The lock waits for that promise to finish (with or without error),
 * while the function will finally wait for the result anyway.
 *
 * @param name Name of the lock to be acquired.
 * @param acquireTimeout If negative, no timeout. If 0 an error is thrown if
 *                       the lock can't be acquired without waiting. If positive, the lock acquire
 *                       will time out after so many milliseconds. An error is
 *                       a timeout if it has `isAcquireTimeout` set to true.
 * @param fn The operation to run once the lock is acquired.
 */
exports.NavigatorLockAcquireTimeoutError = NavigatorLockAcquireTimeoutError;
async function navigatorLock(name, acquireTimeout, fn) {
  if (internals.debug) {
    console.log('@supabase/gotrue-js: navigatorLock: acquire lock', name, acquireTimeout);
  }
  const abortController = new globalThis.AbortController();
  if (acquireTimeout > 0) {
    setTimeout(() => {
      abortController.abort();
      if (internals.debug) {
        console.log('@supabase/gotrue-js: navigatorLock acquire timed out', name);
      }
    }, acquireTimeout);
  }
  // MDN article: https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request
  return await globalThis.navigator.locks.request(name, acquireTimeout === 0 ? {
    mode: 'exclusive',
    ifAvailable: true
  } : {
    mode: 'exclusive',
    signal: abortController.signal
  }, async lock => {
    if (lock) {
      if (internals.debug) {
        console.log('@supabase/gotrue-js: navigatorLock: acquired', name, lock.name);
      }
      try {
        return await fn();
      } finally {
        if (internals.debug) {
          console.log('@supabase/gotrue-js: navigatorLock: released', name, lock.name);
        }
      }
    } else {
      if (acquireTimeout === 0) {
        if (internals.debug) {
          console.log('@supabase/gotrue-js: navigatorLock: not immediately available', name);
        }
        throw new NavigatorLockAcquireTimeoutError(`Acquiring an exclusive Navigator LockManager lock "${name}" immediately failed`);
      } else {
        if (internals.debug) {
          try {
            const result = await globalThis.navigator.locks.query();
            console.log('@supabase/gotrue-js: Navigator LockManager state', JSON.stringify(result, null, '  '));
          } catch (e) {
            console.warn('@supabase/gotrue-js: Error when querying Navigator LockManager state', e);
          }
        }
        // Browser is not following the Navigator LockManager spec, it
        // returned a null lock when we didn't use ifAvailable. So we can
        // pretend the lock is acquired in the name of backward compatibility
        // and user experience and just run the function.
        console.warn('@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request');
        return await fn();
      }
    }
  });
}
},{"./helpers":"node_modules/@supabase/auth-js/dist/module/lib/helpers.js"}],"node_modules/@supabase/auth-js/dist/module/GoTrueClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _GoTrueAdminApi = _interopRequireDefault(require("./GoTrueAdminApi"));
var _constants = require("./lib/constants");
var _errors = require("./lib/errors");
var _fetch = require("./lib/fetch");
var _helpers = require("./lib/helpers");
var _localStorage = require("./lib/local-storage");
var _polyfills = require("./lib/polyfills");
var _version = require("./lib/version");
var _locks = require("./lib/locks");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
(0, _polyfills.polyfillGlobalThis)(); // Make "globalThis" available
const DEFAULT_OPTIONS = {
  url: _constants.GOTRUE_URL,
  storageKey: _constants.STORAGE_KEY,
  autoRefreshToken: true,
  persistSession: true,
  detectSessionInUrl: true,
  headers: _constants.DEFAULT_HEADERS,
  flowType: 'implicit',
  debug: false,
  hasCustomAuthorizationHeader: false
};
/** Current session will be checked for refresh at this interval. */
const AUTO_REFRESH_TICK_DURATION = 30 * 1000;
/**
 * A token refresh will be attempted this many ticks before the current session expires. */
const AUTO_REFRESH_TICK_THRESHOLD = 3;
async function lockNoOp(name, acquireTimeout, fn) {
  return await fn();
}
class GoTrueClient {
  /**
   * Create a new client for use in the browser.
   */
  constructor(options) {
    var _a, _b;
    this.memoryStorage = null;
    this.stateChangeEmitters = new Map();
    this.autoRefreshTicker = null;
    this.visibilityChangedCallback = null;
    this.refreshingDeferred = null;
    /**
     * Keeps track of the async client initialization.
     * When null or not yet resolved the auth state is `unknown`
     * Once resolved the the auth state is known and it's save to call any further client methods.
     * Keep extra care to never reject or throw uncaught errors
     */
    this.initializePromise = null;
    this.detectSessionInUrl = true;
    this.hasCustomAuthorizationHeader = false;
    this.suppressGetSessionWarning = false;
    this.lockAcquired = false;
    this.pendingInLock = [];
    /**
     * Used to broadcast state change events to other tabs listening.
     */
    this.broadcastChannel = null;
    this.logger = console.log;
    this.instanceID = GoTrueClient.nextInstanceID;
    GoTrueClient.nextInstanceID += 1;
    if (this.instanceID > 0 && (0, _helpers.isBrowser)()) {
      console.warn('Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.');
    }
    const settings = Object.assign(Object.assign({}, DEFAULT_OPTIONS), options);
    this.logDebugMessages = !!settings.debug;
    if (typeof settings.debug === 'function') {
      this.logger = settings.debug;
    }
    this.persistSession = settings.persistSession;
    this.storageKey = settings.storageKey;
    this.autoRefreshToken = settings.autoRefreshToken;
    this.admin = new _GoTrueAdminApi.default({
      url: settings.url,
      headers: settings.headers,
      fetch: settings.fetch
    });
    this.url = settings.url;
    this.headers = settings.headers;
    this.fetch = (0, _helpers.resolveFetch)(settings.fetch);
    this.lock = settings.lock || lockNoOp;
    this.detectSessionInUrl = settings.detectSessionInUrl;
    this.flowType = settings.flowType;
    this.hasCustomAuthorizationHeader = settings.hasCustomAuthorizationHeader;
    if (settings.lock) {
      this.lock = settings.lock;
    } else if ((0, _helpers.isBrowser)() && ((_a = globalThis === null || globalThis === void 0 ? void 0 : globalThis.navigator) === null || _a === void 0 ? void 0 : _a.locks)) {
      this.lock = _locks.navigatorLock;
    } else {
      this.lock = lockNoOp;
    }
    this.mfa = {
      verify: this._verify.bind(this),
      enroll: this._enroll.bind(this),
      unenroll: this._unenroll.bind(this),
      challenge: this._challenge.bind(this),
      listFactors: this._listFactors.bind(this),
      challengeAndVerify: this._challengeAndVerify.bind(this),
      getAuthenticatorAssuranceLevel: this._getAuthenticatorAssuranceLevel.bind(this)
    };
    if (this.persistSession) {
      if (settings.storage) {
        this.storage = settings.storage;
      } else {
        if ((0, _helpers.supportsLocalStorage)()) {
          this.storage = _localStorage.localStorageAdapter;
        } else {
          this.memoryStorage = {};
          this.storage = (0, _localStorage.memoryLocalStorageAdapter)(this.memoryStorage);
        }
      }
    } else {
      this.memoryStorage = {};
      this.storage = (0, _localStorage.memoryLocalStorageAdapter)(this.memoryStorage);
    }
    if ((0, _helpers.isBrowser)() && globalThis.BroadcastChannel && this.persistSession && this.storageKey) {
      try {
        this.broadcastChannel = new globalThis.BroadcastChannel(this.storageKey);
      } catch (e) {
        console.error('Failed to create a new BroadcastChannel, multi-tab state changes will not be available', e);
      }
      (_b = this.broadcastChannel) === null || _b === void 0 ? void 0 : _b.addEventListener('message', async event => {
        this._debug('received broadcast notification from other tab or client', event);
        await this._notifyAllSubscribers(event.data.event, event.data.session, false); // broadcast = false so we don't get an endless loop of messages
      });
    }
    this.initialize();
  }
  _debug(...args) {
    if (this.logDebugMessages) {
      this.logger(`GoTrueClient@${this.instanceID} (${_version.version}) ${new Date().toISOString()}`, ...args);
    }
    return this;
  }
  /**
   * Initializes the client session either from the url or from storage.
   * This method is automatically called when instantiating the client, but should also be called
   * manually when checking for an error from an auth redirect (oauth, magiclink, password recovery, etc).
   */
  async initialize() {
    if (this.initializePromise) {
      return await this.initializePromise;
    }
    this.initializePromise = (async () => {
      return await this._acquireLock(-1, async () => {
        return await this._initialize();
      });
    })();
    return await this.initializePromise;
  }
  /**
   * IMPORTANT:
   * 1. Never throw in this method, as it is called from the constructor
   * 2. Never return a session from this method as it would be cached over
   *    the whole lifetime of the client
   */
  async _initialize() {
    try {
      const isPKCEFlow = (0, _helpers.isBrowser)() ? await this._isPKCEFlow() : false;
      this._debug('#_initialize()', 'begin', 'is PKCE flow', isPKCEFlow);
      if (isPKCEFlow || this.detectSessionInUrl && this._isImplicitGrantFlow()) {
        const {
          data,
          error
        } = await this._getSessionFromURL(isPKCEFlow);
        if (error) {
          this._debug('#_initialize()', 'error detecting session from URL', error);
          // hacky workaround to keep the existing session if there's an error returned from identity linking
          // TODO: once error codes are ready, we should match against it instead of the message
          if ((error === null || error === void 0 ? void 0 : error.message) === 'Identity is already linked' || (error === null || error === void 0 ? void 0 : error.message) === 'Identity is already linked to another user') {
            return {
              error
            };
          }
          // failed login attempt via url,
          // remove old session as in verifyOtp, signUp and signInWith*
          await this._removeSession();
          return {
            error
          };
        }
        const {
          session,
          redirectType
        } = data;
        this._debug('#_initialize()', 'detected session in URL', session, 'redirect type', redirectType);
        await this._saveSession(session);
        setTimeout(async () => {
          if (redirectType === 'recovery') {
            await this._notifyAllSubscribers('PASSWORD_RECOVERY', session);
          } else {
            await this._notifyAllSubscribers('SIGNED_IN', session);
          }
        }, 0);
        return {
          error: null
        };
      }
      // no login attempt via callback url try to recover session from storage
      await this._recoverAndRefresh();
      return {
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          error
        };
      }
      return {
        error: new _errors.AuthUnknownError('Unexpected error during initialization', error)
      };
    } finally {
      await this._handleVisibilityChange();
      this._debug('#_initialize()', 'end');
    }
  }
  /**
   * Creates a new anonymous user.
   *
   * @returns A session where the is_anonymous claim in the access token JWT set to true
   */
  async signInAnonymously(credentials) {
    var _a, _b, _c;
    try {
      await this._removeSession();
      const res = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/signup`, {
        headers: this.headers,
        body: {
          data: (_b = (_a = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _a === void 0 ? void 0 : _a.data) !== null && _b !== void 0 ? _b : {},
          gotrue_meta_security: {
            captcha_token: (_c = credentials === null || credentials === void 0 ? void 0 : credentials.options) === null || _c === void 0 ? void 0 : _c.captchaToken
          }
        },
        xform: _fetch._sessionResponse
      });
      const {
        data,
        error
      } = res;
      if (error || !data) {
        return {
          data: {
            user: null,
            session: null
          },
          error: error
        };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers('SIGNED_IN', session);
      }
      return {
        data: {
          user,
          session
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Creates a new user.
   *
   * Be aware that if a user account exists in the system you may get back an
   * error message that attempts to hide this information from the user.
   * This method has support for PKCE via email signups. The PKCE flow cannot be used when autoconfirm is enabled.
   *
   * @returns A logged-in session if the server has "autoconfirm" ON
   * @returns A user if the server has "autoconfirm" OFF
   */
  async signUp(credentials) {
    var _a, _b, _c;
    try {
      await this._removeSession();
      let res;
      if ('email' in credentials) {
        const {
          email,
          password,
          options
        } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === 'pkce') {
          ;
          [codeChallenge, codeChallengeMethod] = await (0, _helpers.getCodeChallengeAndMethod)(this.storage, this.storageKey);
        }
        res = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/signup`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: {
            email,
            password,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          xform: _fetch._sessionResponse
        });
      } else if ('phone' in credentials) {
        const {
          phone,
          password,
          options
        } = credentials;
        res = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/signup`, {
          headers: this.headers,
          body: {
            phone,
            password,
            data: (_b = options === null || options === void 0 ? void 0 : options.data) !== null && _b !== void 0 ? _b : {},
            channel: (_c = options === null || options === void 0 ? void 0 : options.channel) !== null && _c !== void 0 ? _c : 'sms',
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            }
          },
          xform: _fetch._sessionResponse
        });
      } else {
        throw new _errors.AuthInvalidCredentialsError('You must provide either an email or phone number and a password');
      }
      const {
        data,
        error
      } = res;
      if (error || !data) {
        return {
          data: {
            user: null,
            session: null
          },
          error: error
        };
      }
      const session = data.session;
      const user = data.user;
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers('SIGNED_IN', session);
      }
      return {
        data: {
          user,
          session
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user with an email and password or phone and password.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or that the
   * email/phone and password combination is wrong or that the account can only
   * be accessed via social login.
   */
  async signInWithPassword(credentials) {
    try {
      await this._removeSession();
      let res;
      if ('email' in credentials) {
        const {
          email,
          password,
          options
        } = credentials;
        res = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            email,
            password,
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            }
          },
          xform: _fetch._sessionResponsePassword
        });
      } else if ('phone' in credentials) {
        const {
          phone,
          password,
          options
        } = credentials;
        res = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/token?grant_type=password`, {
          headers: this.headers,
          body: {
            phone,
            password,
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            }
          },
          xform: _fetch._sessionResponsePassword
        });
      } else {
        throw new _errors.AuthInvalidCredentialsError('You must provide either an email or phone number and a password');
      }
      const {
        data,
        error
      } = res;
      if (error) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      } else if (!data || !data.session || !data.user) {
        return {
          data: {
            user: null,
            session: null
          },
          error: new _errors.AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers('SIGNED_IN', data.session);
      }
      return {
        data: Object.assign({
          user: data.user,
          session: data.session
        }, data.weak_password ? {
          weakPassword: data.weak_password
        } : null),
        error
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Log in an existing user via a third-party provider.
   * This method supports the PKCE flow.
   */
  async signInWithOAuth(credentials) {
    var _a, _b, _c, _d;
    await this._removeSession();
    return await this._handleProviderSignIn(credentials.provider, {
      redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
      scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
      queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
      skipBrowserRedirect: (_d = credentials.options) === null || _d === void 0 ? void 0 : _d.skipBrowserRedirect
    });
  }
  /**
   * Log in an existing user by exchanging an Auth Code issued during the PKCE flow.
   */
  async exchangeCodeForSession(authCode) {
    await this.initializePromise;
    return this._acquireLock(-1, async () => {
      return this._exchangeCodeForSession(authCode);
    });
  }
  async _exchangeCodeForSession(authCode) {
    const storageItem = await (0, _helpers.getItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
    const [codeVerifier, redirectType] = (storageItem !== null && storageItem !== void 0 ? storageItem : '').split('/');
    const {
      data,
      error
    } = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/token?grant_type=pkce`, {
      headers: this.headers,
      body: {
        auth_code: authCode,
        code_verifier: codeVerifier
      },
      xform: _fetch._sessionResponse
    });
    await (0, _helpers.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
    if (error) {
      return {
        data: {
          user: null,
          session: null,
          redirectType: null
        },
        error
      };
    } else if (!data || !data.session || !data.user) {
      return {
        data: {
          user: null,
          session: null,
          redirectType: null
        },
        error: new _errors.AuthInvalidTokenResponseError()
      };
    }
    if (data.session) {
      await this._saveSession(data.session);
      await this._notifyAllSubscribers('SIGNED_IN', data.session);
    }
    return {
      data: Object.assign(Object.assign({}, data), {
        redirectType: redirectType !== null && redirectType !== void 0 ? redirectType : null
      }),
      error
    };
  }
  /**
   * Allows signing in with an OIDC ID token. The authentication provider used
   * should be enabled and configured.
   */
  async signInWithIdToken(credentials) {
    await this._removeSession();
    try {
      const {
        options,
        provider,
        token,
        access_token,
        nonce
      } = credentials;
      const res = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/token?grant_type=id_token`, {
        headers: this.headers,
        body: {
          provider,
          id_token: token,
          access_token,
          nonce,
          gotrue_meta_security: {
            captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
          }
        },
        xform: _fetch._sessionResponse
      });
      const {
        data,
        error
      } = res;
      if (error) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      } else if (!data || !data.session || !data.user) {
        return {
          data: {
            user: null,
            session: null
          },
          error: new _errors.AuthInvalidTokenResponseError()
        };
      }
      if (data.session) {
        await this._saveSession(data.session);
        await this._notifyAllSubscribers('SIGNED_IN', data.session);
      }
      return {
        data,
        error
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Log in a user using magiclink or a one-time password (OTP).
   *
   * If the `{{ .ConfirmationURL }}` variable is specified in the email template, a magiclink will be sent.
   * If the `{{ .Token }}` variable is specified in the email template, an OTP will be sent.
   * If you're using phone sign-ins, only an OTP will be sent. You won't be able to send a magiclink for phone sign-ins.
   *
   * Be aware that you may get back an error message that will not distinguish
   * between the cases where the account does not exist or, that the account
   * can only be accessed via social login.
   *
   * Do note that you will need to configure a Whatsapp sender on Twilio
   * if you are using phone sign in with the 'whatsapp' channel. The whatsapp
   * channel is not supported on other providers
   * at this time.
   * This method supports PKCE when an email is passed.
   */
  async signInWithOtp(credentials) {
    var _a, _b, _c, _d, _e;
    try {
      await this._removeSession();
      if ('email' in credentials) {
        const {
          email,
          options
        } = credentials;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === 'pkce') {
          ;
          [codeChallenge, codeChallengeMethod] = await (0, _helpers.getCodeChallengeAndMethod)(this.storage, this.storageKey);
        }
        const {
          error
        } = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/otp`, {
          headers: this.headers,
          body: {
            email,
            data: (_a = options === null || options === void 0 ? void 0 : options.data) !== null && _a !== void 0 ? _a : {},
            create_user: (_b = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _b !== void 0 ? _b : true,
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            },
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      if ('phone' in credentials) {
        const {
          phone,
          options
        } = credentials;
        const {
          data,
          error
        } = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/otp`, {
          headers: this.headers,
          body: {
            phone,
            data: (_c = options === null || options === void 0 ? void 0 : options.data) !== null && _c !== void 0 ? _c : {},
            create_user: (_d = options === null || options === void 0 ? void 0 : options.shouldCreateUser) !== null && _d !== void 0 ? _d : true,
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            },
            channel: (_e = options === null || options === void 0 ? void 0 : options.channel) !== null && _e !== void 0 ? _e : 'sms'
          }
        });
        return {
          data: {
            user: null,
            session: null,
            messageId: data === null || data === void 0 ? void 0 : data.message_id
          },
          error
        };
      }
      throw new _errors.AuthInvalidCredentialsError('You must provide either an email or phone number.');
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Log in a user given a User supplied OTP or TokenHash received through mobile or email.
   */
  async verifyOtp(params) {
    var _a, _b;
    try {
      if (params.type !== 'email_change' && params.type !== 'phone_change') {
        // we don't want to remove the authenticated session if the user is performing an email_change or phone_change verification
        await this._removeSession();
      }
      let redirectTo = undefined;
      let captchaToken = undefined;
      if ('options' in params) {
        redirectTo = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo;
        captchaToken = (_b = params.options) === null || _b === void 0 ? void 0 : _b.captchaToken;
      }
      const {
        data,
        error
      } = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/verify`, {
        headers: this.headers,
        body: Object.assign(Object.assign({}, params), {
          gotrue_meta_security: {
            captcha_token: captchaToken
          }
        }),
        redirectTo,
        xform: _fetch._sessionResponse
      });
      if (error) {
        throw error;
      }
      if (!data) {
        throw new Error('An error occurred on token verification.');
      }
      const session = data.session;
      const user = data.user;
      if (session === null || session === void 0 ? void 0 : session.access_token) {
        await this._saveSession(session);
        await this._notifyAllSubscribers(params.type == 'recovery' ? 'PASSWORD_RECOVERY' : 'SIGNED_IN', session);
      }
      return {
        data: {
          user,
          session
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Attempts a single-sign on using an enterprise Identity Provider. A
   * successful SSO attempt will redirect the current page to the identity
   * provider authorization page. The redirect URL is implementation and SSO
   * protocol specific.
   *
   * You can use it by providing a SSO domain. Typically you can extract this
   * domain by asking users for their email address. If this domain is
   * registered on the Auth instance the redirect will use that organization's
   * currently active SSO Identity Provider for the login.
   *
   * If you have built an organization-specific login page, you can use the
   * organization's SSO Identity Provider UUID directly instead.
   */
  async signInWithSSO(params) {
    var _a, _b, _c;
    try {
      await this._removeSession();
      let codeChallenge = null;
      let codeChallengeMethod = null;
      if (this.flowType === 'pkce') {
        ;
        [codeChallenge, codeChallengeMethod] = await (0, _helpers.getCodeChallengeAndMethod)(this.storage, this.storageKey);
      }
      return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/sso`, {
        body: Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({}, 'providerId' in params ? {
          provider_id: params.providerId
        } : null), 'domain' in params ? {
          domain: params.domain
        } : null), {
          redirect_to: (_b = (_a = params.options) === null || _a === void 0 ? void 0 : _a.redirectTo) !== null && _b !== void 0 ? _b : undefined
        }), ((_c = params === null || params === void 0 ? void 0 : params.options) === null || _c === void 0 ? void 0 : _c.captchaToken) ? {
          gotrue_meta_security: {
            captcha_token: params.options.captchaToken
          }
        } : null), {
          skip_http_redirect: true,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod
        }),
        headers: this.headers,
        xform: _fetch._ssoResponse
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * Sends a reauthentication OTP to the user's email or phone number.
   * Requires the user to be signed-in.
   */
  async reauthenticate() {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._reauthenticate();
    });
  }
  async _reauthenticate() {
    try {
      return await this._useSession(async result => {
        const {
          data: {
            session
          },
          error: sessionError
        } = result;
        if (sessionError) throw sessionError;
        if (!session) throw new _errors.AuthSessionMissingError();
        const {
          error
        } = await (0, _fetch._request)(this.fetch, 'GET', `${this.url}/reauthenticate`, {
          headers: this.headers,
          jwt: session.access_token
        });
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Resends an existing signup confirmation email, email change email, SMS OTP or phone change OTP.
   */
  async resend(credentials) {
    try {
      if (credentials.type != 'email_change' && credentials.type != 'phone_change') {
        await this._removeSession();
      }
      const endpoint = `${this.url}/resend`;
      if ('email' in credentials) {
        const {
          email,
          type,
          options
        } = credentials;
        const {
          error
        } = await (0, _fetch._request)(this.fetch, 'POST', endpoint, {
          headers: this.headers,
          body: {
            email,
            type,
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            }
          },
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo
        });
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      } else if ('phone' in credentials) {
        const {
          phone,
          type,
          options
        } = credentials;
        const {
          data,
          error
        } = await (0, _fetch._request)(this.fetch, 'POST', endpoint, {
          headers: this.headers,
          body: {
            phone,
            type,
            gotrue_meta_security: {
              captcha_token: options === null || options === void 0 ? void 0 : options.captchaToken
            }
          }
        });
        return {
          data: {
            user: null,
            session: null,
            messageId: data === null || data === void 0 ? void 0 : data.message_id
          },
          error
        };
      }
      throw new _errors.AuthInvalidCredentialsError('You must provide either an email or phone number and a type');
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Returns the session, refreshing it if necessary.
   *
   * The session returned can be null if the session is not detected which can happen in the event a user is not signed-in or has logged out.
   *
   * **IMPORTANT:** This method loads values directly from the storage attached
   * to the client. If that storage is based on request cookies for example,
   * the values in it may not be authentic and therefore it's strongly advised
   * against using this method and its results in such circumstances. A warning
   * will be emitted if this is detected. Use {@link #getUser()} instead.
   */
  async getSession() {
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return this._useSession(async result => {
        return result;
      });
    });
    return result;
  }
  /**
   * Acquires a global lock based on the storage key.
   */
  async _acquireLock(acquireTimeout, fn) {
    this._debug('#_acquireLock', 'begin', acquireTimeout);
    try {
      if (this.lockAcquired) {
        const last = this.pendingInLock.length ? this.pendingInLock[this.pendingInLock.length - 1] : Promise.resolve();
        const result = (async () => {
          await last;
          return await fn();
        })();
        this.pendingInLock.push((async () => {
          try {
            await result;
          } catch (e) {
            // we just care if it finished
          }
        })());
        return result;
      }
      return await this.lock(`lock:${this.storageKey}`, acquireTimeout, async () => {
        this._debug('#_acquireLock', 'lock acquired for storage key', this.storageKey);
        try {
          this.lockAcquired = true;
          const result = fn();
          this.pendingInLock.push((async () => {
            try {
              await result;
            } catch (e) {
              // we just care if it finished
            }
          })());
          await result;
          // keep draining the queue until there's nothing to wait on
          while (this.pendingInLock.length) {
            const waitOn = [...this.pendingInLock];
            await Promise.all(waitOn);
            this.pendingInLock.splice(0, waitOn.length);
          }
          return await result;
        } finally {
          this._debug('#_acquireLock', 'lock released for storage key', this.storageKey);
          this.lockAcquired = false;
        }
      });
    } finally {
      this._debug('#_acquireLock', 'end');
    }
  }
  /**
   * Use instead of {@link #getSession} inside the library. It is
   * semantically usually what you want, as getting a session involves some
   * processing afterwards that requires only one client operating on the
   * session at once across multiple tabs or processes.
   */
  async _useSession(fn) {
    this._debug('#_useSession', 'begin');
    try {
      // the use of __loadSession here is the only correct use of the function!
      const result = await this.__loadSession();
      return await fn(result);
    } finally {
      this._debug('#_useSession', 'end');
    }
  }
  /**
   * NEVER USE DIRECTLY!
   *
   * Always use {@link #_useSession}.
   */
  async __loadSession() {
    this._debug('#__loadSession()', 'begin');
    if (!this.lockAcquired) {
      this._debug('#__loadSession()', 'used outside of an acquired lock!', new Error().stack);
    }
    try {
      let currentSession = null;
      const maybeSession = await (0, _helpers.getItemAsync)(this.storage, this.storageKey);
      this._debug('#getSession()', 'session from storage', maybeSession);
      if (maybeSession !== null) {
        if (this._isValidSession(maybeSession)) {
          currentSession = maybeSession;
        } else {
          this._debug('#getSession()', 'session from storage is not valid');
          await this._removeSession();
        }
      }
      if (!currentSession) {
        return {
          data: {
            session: null
          },
          error: null
        };
      }
      const hasExpired = currentSession.expires_at ? currentSession.expires_at <= Date.now() / 1000 : false;
      this._debug('#__loadSession()', `session has${hasExpired ? '' : ' not'} expired`, 'expires_at', currentSession.expires_at);
      if (!hasExpired) {
        if (this.storage.isServer) {
          const suppressWarning = this.suppressGetSessionWarning;
          const proxySession = new Proxy(currentSession, {
            get(target, prop, receiver) {
              if (!suppressWarning && prop === 'user') {
                // only show warning when the user object is being accessed from the server
                console.warn('Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and many not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server.');
              }
              return Reflect.get(target, prop, receiver);
            }
          });
          currentSession = proxySession;
        }
        return {
          data: {
            session: currentSession
          },
          error: null
        };
      }
      const {
        session,
        error
      } = await this._callRefreshToken(currentSession.refresh_token);
      if (error) {
        return {
          data: {
            session: null
          },
          error
        };
      }
      return {
        data: {
          session
        },
        error: null
      };
    } finally {
      this._debug('#__loadSession()', 'end');
    }
  }
  /**
   * Gets the current user details if there is an existing session. This method
   * performs a network request to the Supabase Auth server, so the returned
   * value is authentic and can be used to base authorization rules on.
   *
   * @param jwt Takes in an optional access token JWT. If no JWT is provided, the JWT from the current session is used.
   */
  async getUser(jwt) {
    if (jwt) {
      return await this._getUser(jwt);
    }
    await this.initializePromise;
    const result = await this._acquireLock(-1, async () => {
      return await this._getUser();
    });
    return result;
  }
  async _getUser(jwt) {
    try {
      if (jwt) {
        return await (0, _fetch._request)(this.fetch, 'GET', `${this.url}/user`, {
          headers: this.headers,
          jwt: jwt,
          xform: _fetch._userResponse
        });
      }
      return await this._useSession(async result => {
        var _a, _b, _c;
        const {
          data,
          error
        } = result;
        if (error) {
          throw error;
        }
        // returns an error if there is no access_token or custom authorization header
        if (!((_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) && !this.hasCustomAuthorizationHeader) {
          return {
            data: {
              user: null
            },
            error: new _errors.AuthSessionMissingError()
          };
        }
        return await (0, _fetch._request)(this.fetch, 'GET', `${this.url}/user`, {
          headers: this.headers,
          jwt: (_c = (_b = data.session) === null || _b === void 0 ? void 0 : _b.access_token) !== null && _c !== void 0 ? _c : undefined,
          xform: _fetch._userResponse
        });
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Updates user data for a logged in user.
   */
  async updateUser(attributes, options = {}) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._updateUser(attributes, options);
    });
  }
  async _updateUser(attributes, options = {}) {
    try {
      return await this._useSession(async result => {
        const {
          data: sessionData,
          error: sessionError
        } = result;
        if (sessionError) {
          throw sessionError;
        }
        if (!sessionData.session) {
          throw new _errors.AuthSessionMissingError();
        }
        const session = sessionData.session;
        let codeChallenge = null;
        let codeChallengeMethod = null;
        if (this.flowType === 'pkce' && attributes.email != null) {
          ;
          [codeChallenge, codeChallengeMethod] = await (0, _helpers.getCodeChallengeAndMethod)(this.storage, this.storageKey);
        }
        const {
          data,
          error: userError
        } = await (0, _fetch._request)(this.fetch, 'PUT', `${this.url}/user`, {
          headers: this.headers,
          redirectTo: options === null || options === void 0 ? void 0 : options.emailRedirectTo,
          body: Object.assign(Object.assign({}, attributes), {
            code_challenge: codeChallenge,
            code_challenge_method: codeChallengeMethod
          }),
          jwt: session.access_token,
          xform: _fetch._userResponse
        });
        if (userError) throw userError;
        session.user = data.user;
        await this._saveSession(session);
        await this._notifyAllSubscribers('USER_UPDATED', session);
        return {
          data: {
            user: session.user
          },
          error: null
        };
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Decodes a JWT (without performing any validation).
   */
  _decodeJWT(jwt) {
    return (0, _helpers.decodeJWTPayload)(jwt);
  }
  /**
   * Sets the session data from the current session. If the current session is expired, setSession will take care of refreshing it to obtain a new session.
   * If the refresh token or access token in the current session is invalid, an error will be thrown.
   * @param currentSession The current session that minimally contains an access token and refresh token.
   */
  async setSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._setSession(currentSession);
    });
  }
  async _setSession(currentSession) {
    try {
      if (!currentSession.access_token || !currentSession.refresh_token) {
        throw new _errors.AuthSessionMissingError();
      }
      const timeNow = Date.now() / 1000;
      let expiresAt = timeNow;
      let hasExpired = true;
      let session = null;
      const payload = (0, _helpers.decodeJWTPayload)(currentSession.access_token);
      if (payload.exp) {
        expiresAt = payload.exp;
        hasExpired = expiresAt <= timeNow;
      }
      if (hasExpired) {
        const {
          session: refreshedSession,
          error
        } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return {
            data: {
              user: null,
              session: null
            },
            error: error
          };
        }
        if (!refreshedSession) {
          return {
            data: {
              user: null,
              session: null
            },
            error: null
          };
        }
        session = refreshedSession;
      } else {
        const {
          data,
          error
        } = await this._getUser(currentSession.access_token);
        if (error) {
          throw error;
        }
        session = {
          access_token: currentSession.access_token,
          refresh_token: currentSession.refresh_token,
          user: data.user,
          token_type: 'bearer',
          expires_in: expiresAt - timeNow,
          expires_at: expiresAt
        };
        await this._saveSession(session);
        await this._notifyAllSubscribers('SIGNED_IN', session);
      }
      return {
        data: {
          user: session.user,
          session
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            session: null,
            user: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Returns a new session, regardless of expiry status.
   * Takes in an optional current session. If not passed in, then refreshSession() will attempt to retrieve it from getSession().
   * If the current session's refresh token is invalid, an error will be thrown.
   * @param currentSession The current session. If passed in, it must contain a refresh token.
   */
  async refreshSession(currentSession) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._refreshSession(currentSession);
    });
  }
  async _refreshSession(currentSession) {
    try {
      return await this._useSession(async result => {
        var _a;
        if (!currentSession) {
          const {
            data,
            error
          } = result;
          if (error) {
            throw error;
          }
          currentSession = (_a = data.session) !== null && _a !== void 0 ? _a : undefined;
        }
        if (!(currentSession === null || currentSession === void 0 ? void 0 : currentSession.refresh_token)) {
          throw new _errors.AuthSessionMissingError();
        }
        const {
          session,
          error
        } = await this._callRefreshToken(currentSession.refresh_token);
        if (error) {
          return {
            data: {
              user: null,
              session: null
            },
            error: error
          };
        }
        if (!session) {
          return {
            data: {
              user: null,
              session: null
            },
            error: null
          };
        }
        return {
          data: {
            user: session.user,
            session
          },
          error: null
        };
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            user: null,
            session: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Gets the session data from a URL string
   */
  async _getSessionFromURL(isPKCEFlow) {
    try {
      if (!(0, _helpers.isBrowser)()) throw new _errors.AuthImplicitGrantRedirectError('No browser detected.');
      if (this.flowType === 'implicit' && !this._isImplicitGrantFlow()) {
        throw new _errors.AuthImplicitGrantRedirectError('Not a valid implicit grant flow url.');
      } else if (this.flowType == 'pkce' && !isPKCEFlow) {
        throw new _errors.AuthPKCEGrantCodeExchangeError('Not a valid PKCE flow url.');
      }
      const params = (0, _helpers.parseParametersFromURL)(window.location.href);
      if (isPKCEFlow) {
        if (!params.code) throw new _errors.AuthPKCEGrantCodeExchangeError('No code detected.');
        const {
          data,
          error
        } = await this._exchangeCodeForSession(params.code);
        if (error) throw error;
        const url = new URL(window.location.href);
        url.searchParams.delete('code');
        window.history.replaceState(window.history.state, '', url.toString());
        return {
          data: {
            session: data.session,
            redirectType: null
          },
          error: null
        };
      }
      if (params.error || params.error_description || params.error_code) {
        throw new _errors.AuthImplicitGrantRedirectError(params.error_description || 'Error in URL with unspecified error_description', {
          error: params.error || 'unspecified_error',
          code: params.error_code || 'unspecified_code'
        });
      }
      const {
        provider_token,
        provider_refresh_token,
        access_token,
        refresh_token,
        expires_in,
        expires_at,
        token_type
      } = params;
      if (!access_token || !expires_in || !refresh_token || !token_type) {
        throw new _errors.AuthImplicitGrantRedirectError('No session defined in URL');
      }
      const timeNow = Math.round(Date.now() / 1000);
      const expiresIn = parseInt(expires_in);
      let expiresAt = timeNow + expiresIn;
      if (expires_at) {
        expiresAt = parseInt(expires_at);
      }
      const actuallyExpiresIn = expiresAt - timeNow;
      if (actuallyExpiresIn * 1000 <= AUTO_REFRESH_TICK_DURATION) {
        console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${actuallyExpiresIn}s, should have been closer to ${expiresIn}s`);
      }
      const issuedAt = expiresAt - expiresIn;
      if (timeNow - issuedAt >= 120) {
        console.warn('@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale', issuedAt, expiresAt, timeNow);
      } else if (timeNow - issuedAt < 0) {
        console.warn('@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clok for skew', issuedAt, expiresAt, timeNow);
      }
      const {
        data,
        error
      } = await this._getUser(access_token);
      if (error) throw error;
      const session = {
        provider_token,
        provider_refresh_token,
        access_token,
        expires_in: expiresIn,
        expires_at: expiresAt,
        refresh_token,
        token_type,
        user: data.user
      };
      // Remove tokens from URL
      window.location.hash = '';
      this._debug('#_getSessionFromURL()', 'clearing window.location.hash');
      return {
        data: {
          session,
          redirectType: params.type
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            session: null,
            redirectType: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Checks if the current URL contains parameters given by an implicit oauth grant flow (https://www.rfc-editor.org/rfc/rfc6749.html#section-4.2)
   */
  _isImplicitGrantFlow() {
    const params = (0, _helpers.parseParametersFromURL)(window.location.href);
    return !!((0, _helpers.isBrowser)() && (params.access_token || params.error_description));
  }
  /**
   * Checks if the current URL and backing storage contain parameters given by a PKCE flow
   */
  async _isPKCEFlow() {
    const params = (0, _helpers.parseParametersFromURL)(window.location.href);
    const currentStorageContent = await (0, _helpers.getItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
    return !!(params.code && currentStorageContent);
  }
  /**
   * Inside a browser context, `signOut()` will remove the logged in user from the browser session and log them out - removing all items from localstorage and then trigger a `"SIGNED_OUT"` event.
   *
   * For server-side management, you can revoke all refresh tokens for a user by passing a user's JWT through to `auth.api.signOut(JWT: string)`.
   * There is no way to revoke a user's access token jwt until it expires. It is recommended to set a shorter expiry on the jwt for this reason.
   *
   * If using `others` scope, no `SIGNED_OUT` event is fired!
   */
  async signOut(options = {
    scope: 'global'
  }) {
    await this.initializePromise;
    return await this._acquireLock(-1, async () => {
      return await this._signOut(options);
    });
  }
  async _signOut({
    scope
  } = {
    scope: 'global'
  }) {
    return await this._useSession(async result => {
      var _a;
      const {
        data,
        error: sessionError
      } = result;
      if (sessionError) {
        return {
          error: sessionError
        };
      }
      const accessToken = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token;
      if (accessToken) {
        const {
          error
        } = await this.admin.signOut(accessToken, scope);
        if (error) {
          // ignore 404s since user might not exist anymore
          // ignore 401s since an invalid or expired JWT should sign out the current session
          if (!((0, _errors.isAuthApiError)(error) && (error.status === 404 || error.status === 401 || error.status === 403))) {
            return {
              error
            };
          }
        }
      }
      if (scope !== 'others') {
        await this._removeSession();
        await (0, _helpers.removeItemAsync)(this.storage, `${this.storageKey}-code-verifier`);
        await this._notifyAllSubscribers('SIGNED_OUT', null);
      }
      return {
        error: null
      };
    });
  }
  /**
   * Receive a notification every time an auth event happens.
   * @param callback A callback function to be invoked when an auth event happens.
   */
  onAuthStateChange(callback) {
    const id = (0, _helpers.uuid)();
    const subscription = {
      id,
      callback,
      unsubscribe: () => {
        this._debug('#unsubscribe()', 'state change callback with id removed', id);
        this.stateChangeEmitters.delete(id);
      }
    };
    this._debug('#onAuthStateChange()', 'registered callback with id', id);
    this.stateChangeEmitters.set(id, subscription);
    (async () => {
      await this.initializePromise;
      await this._acquireLock(-1, async () => {
        this._emitInitialSession(id);
      });
    })();
    return {
      data: {
        subscription
      }
    };
  }
  async _emitInitialSession(id) {
    return await this._useSession(async result => {
      var _a, _b;
      try {
        const {
          data: {
            session
          },
          error
        } = result;
        if (error) throw error;
        await ((_a = this.stateChangeEmitters.get(id)) === null || _a === void 0 ? void 0 : _a.callback('INITIAL_SESSION', session));
        this._debug('INITIAL_SESSION', 'callback id', id, 'session', session);
      } catch (err) {
        await ((_b = this.stateChangeEmitters.get(id)) === null || _b === void 0 ? void 0 : _b.callback('INITIAL_SESSION', null));
        this._debug('INITIAL_SESSION', 'callback id', id, 'error', err);
        console.error(err);
      }
    });
  }
  /**
   * Sends a password reset request to an email address. This method supports the PKCE flow.
   *
   * @param email The email address of the user.
   * @param options.redirectTo The URL to send the user to after they click the password reset link.
   * @param options.captchaToken Verification token received when the user completes the captcha on the site.
   */
  async resetPasswordForEmail(email, options = {}) {
    let codeChallenge = null;
    let codeChallengeMethod = null;
    if (this.flowType === 'pkce') {
      ;
      [codeChallenge, codeChallengeMethod] = await (0, _helpers.getCodeChallengeAndMethod)(this.storage, this.storageKey, true // isPasswordRecovery
      );
    }
    try {
      return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/recover`, {
        body: {
          email,
          code_challenge: codeChallenge,
          code_challenge_method: codeChallengeMethod,
          gotrue_meta_security: {
            captcha_token: options.captchaToken
          }
        },
        headers: this.headers,
        redirectTo: options.redirectTo
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * Gets all the identities linked to a user.
   */
  async getUserIdentities() {
    var _a;
    try {
      const {
        data,
        error
      } = await this.getUser();
      if (error) throw error;
      return {
        data: {
          identities: (_a = data.user.identities) !== null && _a !== void 0 ? _a : []
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * Links an oauth identity to an existing user.
   * This method supports the PKCE flow.
   */
  async linkIdentity(credentials) {
    var _a;
    try {
      const {
        data,
        error
      } = await this._useSession(async result => {
        var _a, _b, _c, _d, _e;
        const {
          data,
          error
        } = result;
        if (error) throw error;
        const url = await this._getUrlForProvider(`${this.url}/user/identities/authorize`, credentials.provider, {
          redirectTo: (_a = credentials.options) === null || _a === void 0 ? void 0 : _a.redirectTo,
          scopes: (_b = credentials.options) === null || _b === void 0 ? void 0 : _b.scopes,
          queryParams: (_c = credentials.options) === null || _c === void 0 ? void 0 : _c.queryParams,
          skipBrowserRedirect: true
        });
        return await (0, _fetch._request)(this.fetch, 'GET', url, {
          headers: this.headers,
          jwt: (_e = (_d = data.session) === null || _d === void 0 ? void 0 : _d.access_token) !== null && _e !== void 0 ? _e : undefined
        });
      });
      if (error) throw error;
      if ((0, _helpers.isBrowser)() && !((_a = credentials.options) === null || _a === void 0 ? void 0 : _a.skipBrowserRedirect)) {
        window.location.assign(data === null || data === void 0 ? void 0 : data.url);
      }
      return {
        data: {
          provider: credentials.provider,
          url: data === null || data === void 0 ? void 0 : data.url
        },
        error: null
      };
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            provider: credentials.provider,
            url: null
          },
          error
        };
      }
      throw error;
    }
  }
  /**
   * Unlinks an identity from a user by deleting it. The user will no longer be able to sign in with that identity once it's unlinked.
   */
  async unlinkIdentity(identity) {
    try {
      return await this._useSession(async result => {
        var _a, _b;
        const {
          data,
          error
        } = result;
        if (error) {
          throw error;
        }
        return await (0, _fetch._request)(this.fetch, 'DELETE', `${this.url}/user/identities/${identity.identity_id}`, {
          headers: this.headers,
          jwt: (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : undefined
        });
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * Generates a new JWT.
   * @param refreshToken A valid refresh token that was returned on login.
   */
  async _refreshAccessToken(refreshToken) {
    const debugName = `#_refreshAccessToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, 'begin');
    try {
      const startedAt = Date.now();
      // will attempt to refresh the token with exponential backoff
      return await (0, _helpers.retryable)(async attempt => {
        if (attempt > 0) {
          await (0, _helpers.sleep)(200 * Math.pow(2, attempt - 1)); // 200, 400, 800, ...
        }
        this._debug(debugName, 'refreshing attempt', attempt);
        return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/token?grant_type=refresh_token`, {
          body: {
            refresh_token: refreshToken
          },
          headers: this.headers,
          xform: _fetch._sessionResponse
        });
      }, (attempt, error) => {
        const nextBackOffInterval = 200 * Math.pow(2, attempt);
        return error && (0, _errors.isAuthRetryableFetchError)(error) &&
        // retryable only if the request can be sent before the backoff overflows the tick duration
        Date.now() + nextBackOffInterval - startedAt < AUTO_REFRESH_TICK_DURATION;
      });
    } catch (error) {
      this._debug(debugName, 'error', error);
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: {
            session: null,
            user: null
          },
          error
        };
      }
      throw error;
    } finally {
      this._debug(debugName, 'end');
    }
  }
  _isValidSession(maybeSession) {
    const isValidSession = typeof maybeSession === 'object' && maybeSession !== null && 'access_token' in maybeSession && 'refresh_token' in maybeSession && 'expires_at' in maybeSession;
    return isValidSession;
  }
  async _handleProviderSignIn(provider, options) {
    const url = await this._getUrlForProvider(`${this.url}/authorize`, provider, {
      redirectTo: options.redirectTo,
      scopes: options.scopes,
      queryParams: options.queryParams
    });
    this._debug('#_handleProviderSignIn()', 'provider', provider, 'options', options, 'url', url);
    // try to open on the browser
    if ((0, _helpers.isBrowser)() && !options.skipBrowserRedirect) {
      window.location.assign(url);
    }
    return {
      data: {
        provider,
        url
      },
      error: null
    };
  }
  /**
   * Recovers the session from LocalStorage and refreshes
   * Note: this method is async to accommodate for AsyncStorage e.g. in React native.
   */
  async _recoverAndRefresh() {
    var _a;
    const debugName = '#_recoverAndRefresh()';
    this._debug(debugName, 'begin');
    try {
      const currentSession = await (0, _helpers.getItemAsync)(this.storage, this.storageKey);
      this._debug(debugName, 'session from storage', currentSession);
      if (!this._isValidSession(currentSession)) {
        this._debug(debugName, 'session is not valid');
        if (currentSession !== null) {
          await this._removeSession();
        }
        return;
      }
      const timeNow = Math.round(Date.now() / 1000);
      const expiresWithMargin = ((_a = currentSession.expires_at) !== null && _a !== void 0 ? _a : Infinity) < timeNow + _constants.EXPIRY_MARGIN;
      this._debug(debugName, `session has${expiresWithMargin ? '' : ' not'} expired with margin of ${_constants.EXPIRY_MARGIN}s`);
      if (expiresWithMargin) {
        if (this.autoRefreshToken && currentSession.refresh_token) {
          const {
            error
          } = await this._callRefreshToken(currentSession.refresh_token);
          if (error) {
            console.error(error);
            if (!(0, _errors.isAuthRetryableFetchError)(error)) {
              this._debug(debugName, 'refresh failed with a non-retryable error, removing the session', error);
              await this._removeSession();
            }
          }
        }
      } else {
        // no need to persist currentSession again, as we just loaded it from
        // local storage; persisting it again may overwrite a value saved by
        // another client with access to the same local storage
        await this._notifyAllSubscribers('SIGNED_IN', currentSession);
      }
    } catch (err) {
      this._debug(debugName, 'error', err);
      console.error(err);
      return;
    } finally {
      this._debug(debugName, 'end');
    }
  }
  async _callRefreshToken(refreshToken) {
    var _a, _b;
    if (!refreshToken) {
      throw new _errors.AuthSessionMissingError();
    }
    // refreshing is already in progress
    if (this.refreshingDeferred) {
      return this.refreshingDeferred.promise;
    }
    const debugName = `#_callRefreshToken(${refreshToken.substring(0, 5)}...)`;
    this._debug(debugName, 'begin');
    try {
      this.refreshingDeferred = new _helpers.Deferred();
      const {
        data,
        error
      } = await this._refreshAccessToken(refreshToken);
      if (error) throw error;
      if (!data.session) throw new _errors.AuthSessionMissingError();
      await this._saveSession(data.session);
      await this._notifyAllSubscribers('TOKEN_REFRESHED', data.session);
      const result = {
        session: data.session,
        error: null
      };
      this.refreshingDeferred.resolve(result);
      return result;
    } catch (error) {
      this._debug(debugName, 'error', error);
      if ((0, _errors.isAuthError)(error)) {
        const result = {
          session: null,
          error
        };
        if (!(0, _errors.isAuthRetryableFetchError)(error)) {
          await this._removeSession();
          await this._notifyAllSubscribers('SIGNED_OUT', null);
        }
        (_a = this.refreshingDeferred) === null || _a === void 0 ? void 0 : _a.resolve(result);
        return result;
      }
      (_b = this.refreshingDeferred) === null || _b === void 0 ? void 0 : _b.reject(error);
      throw error;
    } finally {
      this.refreshingDeferred = null;
      this._debug(debugName, 'end');
    }
  }
  async _notifyAllSubscribers(event, session, broadcast = true) {
    const debugName = `#_notifyAllSubscribers(${event})`;
    this._debug(debugName, 'begin', session, `broadcast = ${broadcast}`);
    try {
      if (this.broadcastChannel && broadcast) {
        this.broadcastChannel.postMessage({
          event,
          session
        });
      }
      const errors = [];
      const promises = Array.from(this.stateChangeEmitters.values()).map(async x => {
        try {
          await x.callback(event, session);
        } catch (e) {
          errors.push(e);
        }
      });
      await Promise.all(promises);
      if (errors.length > 0) {
        for (let i = 0; i < errors.length; i += 1) {
          console.error(errors[i]);
        }
        throw errors[0];
      }
    } finally {
      this._debug(debugName, 'end');
    }
  }
  /**
   * set currentSession and currentUser
   * process to _startAutoRefreshToken if possible
   */
  async _saveSession(session) {
    this._debug('#_saveSession()', session);
    // _saveSession is always called whenever a new session has been acquired
    // so we can safely suppress the warning returned by future getSession calls
    this.suppressGetSessionWarning = true;
    await (0, _helpers.setItemAsync)(this.storage, this.storageKey, session);
  }
  async _removeSession() {
    this._debug('#_removeSession()');
    await (0, _helpers.removeItemAsync)(this.storage, this.storageKey);
  }
  /**
   * Removes any registered visibilitychange callback.
   *
   * {@see #startAutoRefresh}
   * {@see #stopAutoRefresh}
   */
  _removeVisibilityChangedCallback() {
    this._debug('#_removeVisibilityChangedCallback()');
    const callback = this.visibilityChangedCallback;
    this.visibilityChangedCallback = null;
    try {
      if (callback && (0, _helpers.isBrowser)() && (window === null || window === void 0 ? void 0 : window.removeEventListener)) {
        window.removeEventListener('visibilitychange', callback);
      }
    } catch (e) {
      console.error('removing visibilitychange callback failed', e);
    }
  }
  /**
   * This is the private implementation of {@link #startAutoRefresh}. Use this
   * within the library.
   */
  async _startAutoRefresh() {
    await this._stopAutoRefresh();
    this._debug('#_startAutoRefresh()');
    const ticker = setInterval(() => this._autoRefreshTokenTick(), AUTO_REFRESH_TICK_DURATION);
    this.autoRefreshTicker = ticker;
    if (ticker && typeof ticker === 'object' && typeof ticker.unref === 'function') {
      // ticker is a NodeJS Timeout object that has an `unref` method
      // https://nodejs.org/api/timers.html#timeoutunref
      // When auto refresh is used in NodeJS (like for testing) the
      // `setInterval` is preventing the process from being marked as
      // finished and tests run endlessly. This can be prevented by calling
      // `unref()` on the returned object.
      ticker.unref();
      // @ts-ignore
    } else if (typeof Deno !== 'undefined' && typeof Deno.unrefTimer === 'function') {
      // similar like for NodeJS, but with the Deno API
      // https://deno.land/api@latest?unstable&s=Deno.unrefTimer
      // @ts-ignore
      Deno.unrefTimer(ticker);
    }
    // run the tick immediately, but in the next pass of the event loop so that
    // #_initialize can be allowed to complete without recursively waiting on
    // itself
    setTimeout(async () => {
      await this.initializePromise;
      await this._autoRefreshTokenTick();
    }, 0);
  }
  /**
   * This is the private implementation of {@link #stopAutoRefresh}. Use this
   * within the library.
   */
  async _stopAutoRefresh() {
    this._debug('#_stopAutoRefresh()');
    const ticker = this.autoRefreshTicker;
    this.autoRefreshTicker = null;
    if (ticker) {
      clearInterval(ticker);
    }
  }
  /**
   * Starts an auto-refresh process in the background. The session is checked
   * every few seconds. Close to the time of expiration a process is started to
   * refresh the session. If refreshing fails it will be retried for as long as
   * necessary.
   *
   * If you set the {@link GoTrueClientOptions#autoRefreshToken} you don't need
   * to call this function, it will be called for you.
   *
   * On browsers the refresh process works only when the tab/window is in the
   * foreground to conserve resources as well as prevent race conditions and
   * flooding auth with requests. If you call this method any managed
   * visibility change callback will be removed and you must manage visibility
   * changes on your own.
   *
   * On non-browser platforms the refresh process works *continuously* in the
   * background, which may not be desirable. You should hook into your
   * platform's foreground indication mechanism and call these methods
   * appropriately to conserve resources.
   *
   * {@see #stopAutoRefresh}
   */
  async startAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._startAutoRefresh();
  }
  /**
   * Stops an active auto refresh process running in the background (if any).
   *
   * If you call this method any managed visibility change callback will be
   * removed and you must manage visibility changes on your own.
   *
   * See {@link #startAutoRefresh} for more details.
   */
  async stopAutoRefresh() {
    this._removeVisibilityChangedCallback();
    await this._stopAutoRefresh();
  }
  /**
   * Runs the auto refresh token tick.
   */
  async _autoRefreshTokenTick() {
    this._debug('#_autoRefreshTokenTick()', 'begin');
    try {
      await this._acquireLock(0, async () => {
        try {
          const now = Date.now();
          try {
            return await this._useSession(async result => {
              const {
                data: {
                  session
                }
              } = result;
              if (!session || !session.refresh_token || !session.expires_at) {
                this._debug('#_autoRefreshTokenTick()', 'no session');
                return;
              }
              // session will expire in this many ticks (or has already expired if <= 0)
              const expiresInTicks = Math.floor((session.expires_at * 1000 - now) / AUTO_REFRESH_TICK_DURATION);
              this._debug('#_autoRefreshTokenTick()', `access token expires in ${expiresInTicks} ticks, a tick lasts ${AUTO_REFRESH_TICK_DURATION}ms, refresh threshold is ${AUTO_REFRESH_TICK_THRESHOLD} ticks`);
              if (expiresInTicks <= AUTO_REFRESH_TICK_THRESHOLD) {
                await this._callRefreshToken(session.refresh_token);
              }
            });
          } catch (e) {
            console.error('Auto refresh tick failed with error. This is likely a transient error.', e);
          }
        } finally {
          this._debug('#_autoRefreshTokenTick()', 'end');
        }
      });
    } catch (e) {
      if (e.isAcquireTimeout || e instanceof _locks.LockAcquireTimeoutError) {
        this._debug('auto refresh token tick lock not available');
      } else {
        throw e;
      }
    }
  }
  /**
   * Registers callbacks on the browser / platform, which in-turn run
   * algorithms when the browser window/tab are in foreground. On non-browser
   * platforms it assumes always foreground.
   */
  async _handleVisibilityChange() {
    this._debug('#_handleVisibilityChange()');
    if (!(0, _helpers.isBrowser)() || !(window === null || window === void 0 ? void 0 : window.addEventListener)) {
      if (this.autoRefreshToken) {
        // in non-browser environments the refresh token ticker runs always
        this.startAutoRefresh();
      }
      return false;
    }
    try {
      this.visibilityChangedCallback = async () => await this._onVisibilityChanged(false);
      window === null || window === void 0 ? void 0 : window.addEventListener('visibilitychange', this.visibilityChangedCallback);
      // now immediately call the visbility changed callback to setup with the
      // current visbility state
      await this._onVisibilityChanged(true); // initial call
    } catch (error) {
      console.error('_handleVisibilityChange', error);
    }
  }
  /**
   * Callback registered with `window.addEventListener('visibilitychange')`.
   */
  async _onVisibilityChanged(calledFromInitialize) {
    const methodName = `#_onVisibilityChanged(${calledFromInitialize})`;
    this._debug(methodName, 'visibilityState', document.visibilityState);
    if (document.visibilityState === 'visible') {
      if (this.autoRefreshToken) {
        // in browser environments the refresh token ticker runs only on focused tabs
        // which prevents race conditions
        this._startAutoRefresh();
      }
      if (!calledFromInitialize) {
        // called when the visibility has changed, i.e. the browser
        // transitioned from hidden -> visible so we need to see if the session
        // should be recovered immediately... but to do that we need to acquire
        // the lock first asynchronously
        await this.initializePromise;
        await this._acquireLock(-1, async () => {
          if (document.visibilityState !== 'visible') {
            this._debug(methodName, 'acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting');
            // visibility has changed while waiting for the lock, abort
            return;
          }
          // recover the session
          await this._recoverAndRefresh();
        });
      }
    } else if (document.visibilityState === 'hidden') {
      if (this.autoRefreshToken) {
        this._stopAutoRefresh();
      }
    }
  }
  /**
   * Generates the relevant login URL for a third-party provider.
   * @param options.redirectTo A URL or mobile address to send the user to after they are confirmed.
   * @param options.scopes A space-separated list of scopes granted to the OAuth application.
   * @param options.queryParams An object of key-value pairs containing query parameters granted to the OAuth application.
   */
  async _getUrlForProvider(url, provider, options) {
    const urlParams = [`provider=${encodeURIComponent(provider)}`];
    if (options === null || options === void 0 ? void 0 : options.redirectTo) {
      urlParams.push(`redirect_to=${encodeURIComponent(options.redirectTo)}`);
    }
    if (options === null || options === void 0 ? void 0 : options.scopes) {
      urlParams.push(`scopes=${encodeURIComponent(options.scopes)}`);
    }
    if (this.flowType === 'pkce') {
      const [codeChallenge, codeChallengeMethod] = await (0, _helpers.getCodeChallengeAndMethod)(this.storage, this.storageKey);
      const flowParams = new URLSearchParams({
        code_challenge: `${encodeURIComponent(codeChallenge)}`,
        code_challenge_method: `${encodeURIComponent(codeChallengeMethod)}`
      });
      urlParams.push(flowParams.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.queryParams) {
      const query = new URLSearchParams(options.queryParams);
      urlParams.push(query.toString());
    }
    if (options === null || options === void 0 ? void 0 : options.skipBrowserRedirect) {
      urlParams.push(`skip_http_redirect=${options.skipBrowserRedirect}`);
    }
    return `${url}?${urlParams.join('&')}`;
  }
  async _unenroll(params) {
    try {
      return await this._useSession(async result => {
        var _a;
        const {
          data: sessionData,
          error: sessionError
        } = result;
        if (sessionError) {
          return {
            data: null,
            error: sessionError
          };
        }
        return await (0, _fetch._request)(this.fetch, 'DELETE', `${this.url}/factors/${params.factorId}`, {
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#enroll}
   */
  async _enroll(params) {
    try {
      return await this._useSession(async result => {
        var _a, _b;
        const {
          data: sessionData,
          error: sessionError
        } = result;
        if (sessionError) {
          return {
            data: null,
            error: sessionError
          };
        }
        const {
          data,
          error
        } = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/factors`, {
          body: {
            friendly_name: params.friendlyName,
            factor_type: params.factorType,
            issuer: params.issuer
          },
          headers: this.headers,
          jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
        });
        if (error) {
          return {
            data: null,
            error
          };
        }
        if ((_b = data === null || data === void 0 ? void 0 : data.totp) === null || _b === void 0 ? void 0 : _b.qr_code) {
          data.totp.qr_code = `data:image/svg+xml;utf-8,${data.totp.qr_code}`;
        }
        return {
          data,
          error: null
        };
      });
    } catch (error) {
      if ((0, _errors.isAuthError)(error)) {
        return {
          data: null,
          error
        };
      }
      throw error;
    }
  }
  /**
   * {@see GoTrueMFAApi#verify}
   */
  async _verify(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async result => {
          var _a;
          const {
            data: sessionData,
            error: sessionError
          } = result;
          if (sessionError) {
            return {
              data: null,
              error: sessionError
            };
          }
          const {
            data,
            error
          } = await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/factors/${params.factorId}/verify`, {
            body: {
              code: params.code,
              challenge_id: params.challengeId
            },
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
          if (error) {
            return {
              data: null,
              error
            };
          }
          await this._saveSession(Object.assign({
            expires_at: Math.round(Date.now() / 1000) + data.expires_in
          }, data));
          await this._notifyAllSubscribers('MFA_CHALLENGE_VERIFIED', data);
          return {
            data,
            error
          };
        });
      } catch (error) {
        if ((0, _errors.isAuthError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challenge}
   */
  async _challenge(params) {
    return this._acquireLock(-1, async () => {
      try {
        return await this._useSession(async result => {
          var _a;
          const {
            data: sessionData,
            error: sessionError
          } = result;
          if (sessionError) {
            return {
              data: null,
              error: sessionError
            };
          }
          return await (0, _fetch._request)(this.fetch, 'POST', `${this.url}/factors/${params.factorId}/challenge`, {
            headers: this.headers,
            jwt: (_a = sessionData === null || sessionData === void 0 ? void 0 : sessionData.session) === null || _a === void 0 ? void 0 : _a.access_token
          });
        });
      } catch (error) {
        if ((0, _errors.isAuthError)(error)) {
          return {
            data: null,
            error
          };
        }
        throw error;
      }
    });
  }
  /**
   * {@see GoTrueMFAApi#challengeAndVerify}
   */
  async _challengeAndVerify(params) {
    // both _challenge and _verify independently acquire the lock, so no need
    // to acquire it here
    const {
      data: challengeData,
      error: challengeError
    } = await this._challenge({
      factorId: params.factorId
    });
    if (challengeError) {
      return {
        data: null,
        error: challengeError
      };
    }
    return await this._verify({
      factorId: params.factorId,
      challengeId: challengeData.id,
      code: params.code
    });
  }
  /**
   * {@see GoTrueMFAApi#listFactors}
   */
  async _listFactors() {
    // use #getUser instead of #_getUser as the former acquires a lock
    const {
      data: {
        user
      },
      error: userError
    } = await this.getUser();
    if (userError) {
      return {
        data: null,
        error: userError
      };
    }
    const factors = (user === null || user === void 0 ? void 0 : user.factors) || [];
    const totp = factors.filter(factor => factor.factor_type === 'totp' && factor.status === 'verified');
    return {
      data: {
        all: factors,
        totp
      },
      error: null
    };
  }
  /**
   * {@see GoTrueMFAApi#getAuthenticatorAssuranceLevel}
   */
  async _getAuthenticatorAssuranceLevel() {
    return this._acquireLock(-1, async () => {
      return await this._useSession(async result => {
        var _a, _b;
        const {
          data: {
            session
          },
          error: sessionError
        } = result;
        if (sessionError) {
          return {
            data: null,
            error: sessionError
          };
        }
        if (!session) {
          return {
            data: {
              currentLevel: null,
              nextLevel: null,
              currentAuthenticationMethods: []
            },
            error: null
          };
        }
        const payload = this._decodeJWT(session.access_token);
        let currentLevel = null;
        if (payload.aal) {
          currentLevel = payload.aal;
        }
        let nextLevel = currentLevel;
        const verifiedFactors = (_b = (_a = session.user.factors) === null || _a === void 0 ? void 0 : _a.filter(factor => factor.status === 'verified')) !== null && _b !== void 0 ? _b : [];
        if (verifiedFactors.length > 0) {
          nextLevel = 'aal2';
        }
        const currentAuthenticationMethods = payload.amr || [];
        return {
          data: {
            currentLevel,
            nextLevel,
            currentAuthenticationMethods
          },
          error: null
        };
      });
    });
  }
}
exports.default = GoTrueClient;
GoTrueClient.nextInstanceID = 0;
},{"./GoTrueAdminApi":"node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js","./lib/constants":"node_modules/@supabase/auth-js/dist/module/lib/constants.js","./lib/errors":"node_modules/@supabase/auth-js/dist/module/lib/errors.js","./lib/fetch":"node_modules/@supabase/auth-js/dist/module/lib/fetch.js","./lib/helpers":"node_modules/@supabase/auth-js/dist/module/lib/helpers.js","./lib/local-storage":"node_modules/@supabase/auth-js/dist/module/lib/local-storage.js","./lib/polyfills":"node_modules/@supabase/auth-js/dist/module/lib/polyfills.js","./lib/version":"node_modules/@supabase/auth-js/dist/module/lib/version.js","./lib/locks":"node_modules/@supabase/auth-js/dist/module/lib/locks.js"}],"node_modules/@supabase/auth-js/dist/module/AuthAdminApi.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _GoTrueAdminApi = _interopRequireDefault(require("./GoTrueAdminApi"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AuthAdminApi = _GoTrueAdminApi.default;
var _default = exports.default = AuthAdminApi;
},{"./GoTrueAdminApi":"node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js"}],"node_modules/@supabase/auth-js/dist/module/AuthClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _GoTrueClient = _interopRequireDefault(require("./GoTrueClient"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
const AuthClient = _GoTrueClient.default;
var _default = exports.default = AuthClient;
},{"./GoTrueClient":"node_modules/@supabase/auth-js/dist/module/GoTrueClient.js"}],"node_modules/@supabase/auth-js/dist/module/lib/types.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
},{}],"node_modules/@supabase/auth-js/dist/module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  GoTrueAdminApi: true,
  GoTrueClient: true,
  AuthAdminApi: true,
  AuthClient: true,
  navigatorLock: true,
  NavigatorLockAcquireTimeoutError: true,
  lockInternals: true
};
Object.defineProperty(exports, "AuthAdminApi", {
  enumerable: true,
  get: function () {
    return _AuthAdminApi.default;
  }
});
Object.defineProperty(exports, "AuthClient", {
  enumerable: true,
  get: function () {
    return _AuthClient.default;
  }
});
Object.defineProperty(exports, "GoTrueAdminApi", {
  enumerable: true,
  get: function () {
    return _GoTrueAdminApi.default;
  }
});
Object.defineProperty(exports, "GoTrueClient", {
  enumerable: true,
  get: function () {
    return _GoTrueClient.default;
  }
});
Object.defineProperty(exports, "NavigatorLockAcquireTimeoutError", {
  enumerable: true,
  get: function () {
    return _locks.NavigatorLockAcquireTimeoutError;
  }
});
Object.defineProperty(exports, "lockInternals", {
  enumerable: true,
  get: function () {
    return _locks.internals;
  }
});
Object.defineProperty(exports, "navigatorLock", {
  enumerable: true,
  get: function () {
    return _locks.navigatorLock;
  }
});
var _GoTrueAdminApi = _interopRequireDefault(require("./GoTrueAdminApi"));
var _GoTrueClient = _interopRequireDefault(require("./GoTrueClient"));
var _AuthAdminApi = _interopRequireDefault(require("./AuthAdminApi"));
var _AuthClient = _interopRequireDefault(require("./AuthClient"));
var _types = require("./lib/types");
Object.keys(_types).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _types[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _types[key];
    }
  });
});
var _errors = require("./lib/errors");
Object.keys(_errors).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _errors[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _errors[key];
    }
  });
});
var _locks = require("./lib/locks");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
},{"./GoTrueAdminApi":"node_modules/@supabase/auth-js/dist/module/GoTrueAdminApi.js","./GoTrueClient":"node_modules/@supabase/auth-js/dist/module/GoTrueClient.js","./AuthAdminApi":"node_modules/@supabase/auth-js/dist/module/AuthAdminApi.js","./AuthClient":"node_modules/@supabase/auth-js/dist/module/AuthClient.js","./lib/types":"node_modules/@supabase/auth-js/dist/module/lib/types.js","./lib/errors":"node_modules/@supabase/auth-js/dist/module/lib/errors.js","./lib/locks":"node_modules/@supabase/auth-js/dist/module/lib/locks.js"}],"node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SupabaseAuthClient = void 0;
var _authJs = require("@supabase/auth-js");
class SupabaseAuthClient extends _authJs.AuthClient {
  constructor(options) {
    super(options);
  }
}
exports.SupabaseAuthClient = SupabaseAuthClient;
},{"@supabase/auth-js":"node_modules/@supabase/auth-js/dist/module/index.js"}],"node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _functionsJs = require("@supabase/functions-js");
var _postgrestJs = require("@supabase/postgrest-js");
var _realtimeJs = require("@supabase/realtime-js");
var _storageJs = require("@supabase/storage-js");
var _constants = require("./lib/constants");
var _fetch = require("./lib/fetch");
var _helpers = require("./lib/helpers");
var _SupabaseAuthClient = require("./lib/SupabaseAuthClient");
var __awaiter = void 0 && (void 0).__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }
  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }
    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }
    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }
    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};
/**
 * Supabase Client.
 *
 * An isomorphic Javascript client for interacting with Postgres.
 */
class SupabaseClient {
  /**
   * Create a new client for use in the browser.
   * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
   * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
   * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
   * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
   * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
   * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
   * @param options.realtime Options passed along to realtime-js constructor.
   * @param options.global.fetch A custom fetch implementation.
   * @param options.global.headers Any additional headers to send with each network request.
   */
  constructor(supabaseUrl, supabaseKey, options) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    this.supabaseUrl = supabaseUrl;
    this.supabaseKey = supabaseKey;
    if (!supabaseUrl) throw new Error('supabaseUrl is required.');
    if (!supabaseKey) throw new Error('supabaseKey is required.');
    const _supabaseUrl = (0, _helpers.stripTrailingSlash)(supabaseUrl);
    this.realtimeUrl = `${_supabaseUrl}/realtime/v1`.replace(/^http/i, 'ws');
    this.authUrl = `${_supabaseUrl}/auth/v1`;
    this.storageUrl = `${_supabaseUrl}/storage/v1`;
    this.functionsUrl = `${_supabaseUrl}/functions/v1`;
    // default storage key uses the supabase project ref as a namespace
    const defaultStorageKey = `sb-${new URL(this.authUrl).hostname.split('.')[0]}-auth-token`;
    const DEFAULTS = {
      db: _constants.DEFAULT_DB_OPTIONS,
      realtime: _constants.DEFAULT_REALTIME_OPTIONS,
      auth: Object.assign(Object.assign({}, _constants.DEFAULT_AUTH_OPTIONS), {
        storageKey: defaultStorageKey
      }),
      global: _constants.DEFAULT_GLOBAL_OPTIONS
    };
    const settings = (0, _helpers.applySettingDefaults)(options !== null && options !== void 0 ? options : {}, DEFAULTS);
    this.storageKey = (_b = (_a = settings.auth) === null || _a === void 0 ? void 0 : _a.storageKey) !== null && _b !== void 0 ? _b : '';
    this.headers = (_d = (_c = settings.global) === null || _c === void 0 ? void 0 : _c.headers) !== null && _d !== void 0 ? _d : {};
    this.auth = this._initSupabaseAuthClient((_e = settings.auth) !== null && _e !== void 0 ? _e : {}, this.headers, (_f = settings.global) === null || _f === void 0 ? void 0 : _f.fetch);
    this.fetch = (0, _fetch.fetchWithAuth)(supabaseKey, this._getAccessToken.bind(this), (_g = settings.global) === null || _g === void 0 ? void 0 : _g.fetch);
    this.realtime = this._initRealtimeClient(Object.assign({
      headers: this.headers
    }, settings.realtime));
    this.rest = new _postgrestJs.PostgrestClient(`${_supabaseUrl}/rest/v1`, {
      headers: this.headers,
      schema: (_h = settings.db) === null || _h === void 0 ? void 0 : _h.schema,
      fetch: this.fetch
    });
    this._listenForAuthEvents();
  }
  /**
   * Supabase Functions allows you to deploy and invoke edge functions.
   */
  get functions() {
    return new _functionsJs.FunctionsClient(this.functionsUrl, {
      headers: this.headers,
      customFetch: this.fetch
    });
  }
  /**
   * Supabase Storage allows you to manage user-generated content, such as photos or videos.
   */
  get storage() {
    return new _storageJs.StorageClient(this.storageUrl, this.headers, this.fetch);
  }
  /**
   * Perform a query on a table or a view.
   *
   * @param relation - The table or view name to query
   */
  from(relation) {
    return this.rest.from(relation);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.schema
  /**
   * Select a schema to query or perform an function (rpc) call.
   *
   * The schema needs to be on the list of exposed schemas inside Supabase.
   *
   * @param schema - The schema to query
   */
  schema(schema) {
    return this.rest.schema(schema);
  }
  // NOTE: signatures must be kept in sync with PostgrestClient.rpc
  /**
   * Perform a function call.
   *
   * @param fn - The function name to call
   * @param args - The arguments to pass to the function call
   * @param options - Named parameters
   * @param options.head - When set to `true`, `data` will not be returned.
   * Useful if you only need the count.
   * @param options.get - When set to `true`, the function will be called with
   * read-only access mode.
   * @param options.count - Count algorithm to use to count rows returned by the
   * function. Only applicable for [set-returning
   * functions](https://www.postgresql.org/docs/current/functions-srf.html).
   *
   * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
   * hood.
   *
   * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
   * statistics under the hood.
   *
   * `"estimated"`: Uses exact count for low numbers and planned count for high
   * numbers.
   */
  rpc(fn, args = {}, options = {}) {
    return this.rest.rpc(fn, args, options);
  }
  /**
   * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
   *
   * @param {string} name - The name of the Realtime channel.
   * @param {Object} opts - The options to pass to the Realtime channel.
   *
   */
  channel(name, opts = {
    config: {}
  }) {
    return this.realtime.channel(name, opts);
  }
  /**
   * Returns all Realtime channels.
   */
  getChannels() {
    return this.realtime.getChannels();
  }
  /**
   * Unsubscribes and removes Realtime channel from Realtime client.
   *
   * @param {RealtimeChannel} channel - The name of the Realtime channel.
   *
   */
  removeChannel(channel) {
    return this.realtime.removeChannel(channel);
  }
  /**
   * Unsubscribes and removes all Realtime channels from Realtime client.
   */
  removeAllChannels() {
    return this.realtime.removeAllChannels();
  }
  _getAccessToken() {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
      const {
        data
      } = yield this.auth.getSession();
      return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : null;
    });
  }
  _initSupabaseAuthClient({
    autoRefreshToken,
    persistSession,
    detectSessionInUrl,
    storage,
    storageKey,
    flowType,
    debug
  }, headers, fetch) {
    var _a;
    const authHeaders = {
      Authorization: `Bearer ${this.supabaseKey}`,
      apikey: `${this.supabaseKey}`
    };
    return new _SupabaseAuthClient.SupabaseAuthClient({
      url: this.authUrl,
      headers: Object.assign(Object.assign({}, authHeaders), headers),
      storageKey: storageKey,
      autoRefreshToken,
      persistSession,
      detectSessionInUrl,
      storage,
      flowType,
      debug,
      fetch,
      // auth checks if there is a custom authorizaiton header using this flag
      // so it knows whether to return an error when getUser is called with no session
      hasCustomAuthorizationHeader: (_a = 'Authorization' in this.headers) !== null && _a !== void 0 ? _a : false
    });
  }
  _initRealtimeClient(options) {
    return new _realtimeJs.RealtimeClient(this.realtimeUrl, Object.assign(Object.assign({}, options), {
      params: Object.assign({
        apikey: this.supabaseKey
      }, options === null || options === void 0 ? void 0 : options.params)
    }));
  }
  _listenForAuthEvents() {
    let data = this.auth.onAuthStateChange((event, session) => {
      this._handleTokenChanged(event, 'CLIENT', session === null || session === void 0 ? void 0 : session.access_token);
    });
    return data;
  }
  _handleTokenChanged(event, source, token) {
    if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') && this.changedAccessToken !== token) {
      // Token has changed
      this.realtime.setAuth(token !== null && token !== void 0 ? token : null);
      this.changedAccessToken = token;
    } else if (event === 'SIGNED_OUT') {
      // Token is removed
      this.realtime.setAuth(this.supabaseKey);
      if (source == 'STORAGE') this.auth.signOut();
      this.changedAccessToken = undefined;
    }
  }
}
exports.default = SupabaseClient;
},{"@supabase/functions-js":"node_modules/@supabase/functions-js/dist/module/index.js","@supabase/postgrest-js":"node_modules/@supabase/postgrest-js/dist/module/index.js","@supabase/realtime-js":"node_modules/@supabase/realtime-js/dist/module/index.js","@supabase/storage-js":"node_modules/@supabase/storage-js/dist/module/index.js","./lib/constants":"node_modules/@supabase/supabase-js/dist/module/lib/constants.js","./lib/fetch":"node_modules/@supabase/supabase-js/dist/module/lib/fetch.js","./lib/helpers":"node_modules/@supabase/supabase-js/dist/module/lib/helpers.js","./lib/SupabaseAuthClient":"node_modules/@supabase/supabase-js/dist/module/lib/SupabaseAuthClient.js"}],"node_modules/@supabase/supabase-js/dist/module/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  createClient: true,
  SupabaseClient: true,
  FunctionsHttpError: true,
  FunctionsFetchError: true,
  FunctionsRelayError: true,
  FunctionsError: true,
  FunctionRegion: true
};
Object.defineProperty(exports, "FunctionRegion", {
  enumerable: true,
  get: function () {
    return _functionsJs.FunctionRegion;
  }
});
Object.defineProperty(exports, "FunctionsError", {
  enumerable: true,
  get: function () {
    return _functionsJs.FunctionsError;
  }
});
Object.defineProperty(exports, "FunctionsFetchError", {
  enumerable: true,
  get: function () {
    return _functionsJs.FunctionsFetchError;
  }
});
Object.defineProperty(exports, "FunctionsHttpError", {
  enumerable: true,
  get: function () {
    return _functionsJs.FunctionsHttpError;
  }
});
Object.defineProperty(exports, "FunctionsRelayError", {
  enumerable: true,
  get: function () {
    return _functionsJs.FunctionsRelayError;
  }
});
Object.defineProperty(exports, "SupabaseClient", {
  enumerable: true,
  get: function () {
    return _SupabaseClient.default;
  }
});
exports.createClient = void 0;
var _SupabaseClient = _interopRequireDefault(require("./SupabaseClient"));
var _authJs = require("@supabase/auth-js");
Object.keys(_authJs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _authJs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _authJs[key];
    }
  });
});
var _functionsJs = require("@supabase/functions-js");
var _realtimeJs = require("@supabase/realtime-js");
Object.keys(_realtimeJs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _realtimeJs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _realtimeJs[key];
    }
  });
});
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
/**
 * Creates a new Supabase Client.
 */
const createClient = (supabaseUrl, supabaseKey, options) => {
  return new _SupabaseClient.default(supabaseUrl, supabaseKey, options);
};
exports.createClient = createClient;
},{"./SupabaseClient":"node_modules/@supabase/supabase-js/dist/module/SupabaseClient.js","@supabase/auth-js":"node_modules/@supabase/auth-js/dist/module/index.js","@supabase/functions-js":"node_modules/@supabase/functions-js/dist/module/index.js","@supabase/realtime-js":"node_modules/@supabase/realtime-js/dist/module/index.js"}],"supabaseClient.js":[function(require,module,exports) {
var _require = require('@supabase/supabase-js'),
  createClient = _require.createClient;
var supabaseUrl = 'https://scjipuhdlilqyrvcecji.supabase.co';
var supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNjamlwdWhkbGlscXlydmNlY2ppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTUxNzYyOTIsImV4cCI6MjAzMDc1MjI5Mn0.8eCubG5Y6dTJXcfVjTASHrfVJjUueroqBDOfc8HX5dg';
var supabase = createClient(supabaseUrl, supabaseKey);
module.exports = {
  supabase: supabase
};
},{"@supabase/supabase-js":"node_modules/@supabase/supabase-js/dist/module/index.js"}],"waitlist.js":[function(require,module,exports) {
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, catch: function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
var _require = require('./supabaseClient'),
  supabase = _require.supabase;
function init() {
  loadWaitlistedTickets();
  document.getElementById('waitlistSelect').addEventListener('change', function () {
    var ticketId = this.value;
    if (ticketId) {
      loadTicketDetails(ticketId);
    }
  });
  document.getElementById('confirmTicketButton').addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
    return _regeneratorRuntime().wrap(function _callee$(_context) {
      while (1) switch (_context.prev = _context.next) {
        case 0:
          if (!confirm("Are you sure you want to confirm this ticket?")) {
            _context.next = 4;
            break;
          }
          _context.next = 3;
          return updateTicketStatus(1);
        case 3:
          // 1 for confirmed
          location.reload(); // Refresh the page after updating
        case 4:
        case "end":
          return _context.stop();
      }
    }, _callee);
  })));
  document.getElementById('cancelTicketButton').addEventListener('click', /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
    return _regeneratorRuntime().wrap(function _callee2$(_context2) {
      while (1) switch (_context2.prev = _context2.next) {
        case 0:
          if (!confirm("Are you sure you want to cancel this ticket?")) {
            _context2.next = 4;
            break;
          }
          _context2.next = 3;
          return updateTicketStatus(3);
        case 3:
          // 3 for cancelled
          location.reload(); // Refresh the page after updating
        case 4:
        case "end":
          return _context2.stop();
      }
    }, _callee2);
  })));
}
function loadWaitlistedTickets() {
  return _loadWaitlistedTickets.apply(this, arguments);
}
function _loadWaitlistedTickets() {
  _loadWaitlistedTickets = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3() {
    var _yield$supabase$from$, data, error, ticketSelect;
    return _regeneratorRuntime().wrap(function _callee3$(_context3) {
      while (1) switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return supabase.from('Waitlist_Ticket').select('Ticket_ID, SeatID, TicketStatus');
        case 2:
          _yield$supabase$from$ = _context3.sent;
          data = _yield$supabase$from$.data;
          error = _yield$supabase$from$.error;
          if (!error) {
            _context3.next = 8;
            break;
          }
          console.error('Error loading waitlisted tickets:', error);
          return _context3.abrupt("return");
        case 8:
          ticketSelect = document.getElementById('waitlistSelect');
          ticketSelect.innerHTML = '<option value="">Select a Ticket</option>';
          data.forEach(function (ticket) {
            var option = document.createElement('option');
            option.value = ticket.Ticket_ID;
            option.textContent = "Ticket ID: ".concat(ticket.Ticket_ID);
            ticketSelect.appendChild(option);
          });
        case 11:
        case "end":
          return _context3.stop();
      }
    }, _callee3);
  }));
  return _loadWaitlistedTickets.apply(this, arguments);
}
function loadTicketDetails(_x) {
  return _loadTicketDetails.apply(this, arguments);
}
function _loadTicketDetails() {
  _loadTicketDetails = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(ticketId) {
    var _yield$supabase$from$2, data, error, seatDisplay, statusDisplay, _yield$supabase$from$3, statusData, statusError;
    return _regeneratorRuntime().wrap(function _callee4$(_context4) {
      while (1) switch (_context4.prev = _context4.next) {
        case 0:
          console.log("Fetching details for ticket ID: ".concat(ticketId));
          _context4.next = 3;
          return supabase.from('Waitlist_Ticket').select('SeatID, TicketStatus').eq('Ticket_ID', ticketId).single();
        case 3:
          _yield$supabase$from$2 = _context4.sent;
          data = _yield$supabase$from$2.data;
          error = _yield$supabase$from$2.error;
          if (!error) {
            _context4.next = 9;
            break;
          }
          console.error('Error fetching ticket details:', error);
          return _context4.abrupt("return");
        case 9:
          console.log('Fetched data:', data);
          seatDisplay = document.getElementById('seatDisplay');
          if (seatDisplay) {
            seatDisplay.value = data.SeatID;
            console.log('Seat displayed:', data.SeatID);
          } else {
            console.error('Seat display element not found');
          }
          statusDisplay = document.getElementById('ticketStatus');
          if (!statusDisplay) {
            _context4.next = 26;
            break;
          }
          _context4.next = 16;
          return supabase.from('TicketStatus').select('StatusName').eq('Status_ID', data.TicketStatus).single();
        case 16:
          _yield$supabase$from$3 = _context4.sent;
          statusData = _yield$supabase$from$3.data;
          statusError = _yield$supabase$from$3.error;
          if (!statusError) {
            _context4.next = 22;
            break;
          }
          console.error('Error fetching status name:', statusError);
          return _context4.abrupt("return");
        case 22:
          statusDisplay.value = statusData.StatusName;
          console.log('Status displayed:', statusData.StatusName);
          _context4.next = 27;
          break;
        case 26:
          console.error('Status display element not found');
        case 27:
        case "end":
          return _context4.stop();
      }
    }, _callee4);
  }));
  return _loadTicketDetails.apply(this, arguments);
}
function updateTicketStatus(_x2) {
  return _updateTicketStatus.apply(this, arguments);
} // Check if DOM is fully loaded before initializing
function _updateTicketStatus() {
  _updateTicketStatus = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee5(newStatus) {
    var ticketId, _yield$supabase$from$4, error;
    return _regeneratorRuntime().wrap(function _callee5$(_context5) {
      while (1) switch (_context5.prev = _context5.next) {
        case 0:
          ticketId = document.getElementById('waitlistSelect').value;
          if (ticketId) {
            _context5.next = 4;
            break;
          }
          alert('Please select a ticket to proceed.');
          return _context5.abrupt("return");
        case 4:
          _context5.next = 6;
          return supabase.from('Ticket').update({
            TicketStatus: newStatus
          }).match({
            Ticket_ID: ticketId
          });
        case 6:
          _yield$supabase$from$4 = _context5.sent;
          error = _yield$supabase$from$4.error;
          if (error) {
            console.error('Error updating ticket status:', error);
            alert('Failed to update the ticket status. Please try again.');
          } else {
            alert('Ticket status updated successfully.');
          }
        case 9:
        case "end":
          return _context5.stop();
      }
    }, _callee5);
  }));
  return _updateTicketStatus.apply(this, arguments);
}
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
},{"./supabaseClient":"supabaseClient.js"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}
module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50761" + '/');
  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);
    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);
          if (didAccept) {
            handled = true;
          }
        }
      });

      // Enable HMR for CSS by default.
      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });
      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else if (location.reload) {
        // `location` global exists in a web worker context but lacks `.reload()` function.
        location.reload();
      }
    }
    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }
    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }
    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}
function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}
function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}
function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }
  var parents = [];
  var k, d, dep;
  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }
  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }
  return parents;
}
function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}
function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }
  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }
  if (checkedAssets[id]) {
    return;
  }
  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }
  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}
function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }
  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }
  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }
}
},{}],"node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js":[function(require,module,exports) {
module.exports = function loadJSBundle(bundle) {
  return new Promise(function (resolve, reject) {
    var script = document.createElement('script');
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';
    script.src = bundle;
    script.onerror = function (e) {
      script.onerror = script.onload = null;
      reject(e);
    };
    script.onload = function () {
      script.onerror = script.onload = null;
      resolve();
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  });
};
},{}],0:[function(require,module,exports) {
var b=require("node_modules/parcel-bundler/src/builtins/bundle-loader.js");b.register("js",require("node_modules/parcel-bundler/src/builtins/loaders/browser/js-loader.js"));b.load([["browser.b6f259d9.js","node_modules/@supabase/node-fetch/browser.js"]]).then(function(){require("waitlist.js");});
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js",0], null)
//# sourceMappingURL=/waitlist.ba5d314b.js.map