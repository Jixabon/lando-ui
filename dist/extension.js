module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/extension.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/ansi-regex/index.js":
/*!******************************************!*\
  !*** ./node_modules/ansi-regex/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = options => {
	options = Object.assign({
		onlyFirst: false
	}, options);

	const pattern = [
		'[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:[a-zA-Z\\d]*(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)',
		'(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))'
	].join('|');

	return new RegExp(pattern, options.onlyFirst ? undefined : 'g');
};


/***/ }),

/***/ "./node_modules/open/index.js":
/*!************************************!*\
  !*** ./node_modules/open/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(__dirname) {
const {promisify} = __webpack_require__(/*! util */ "util");
const path = __webpack_require__(/*! path */ "path");
const childProcess = __webpack_require__(/*! child_process */ "child_process");
const fs = __webpack_require__(/*! fs */ "fs");
const isWsl = __webpack_require__(/*! is-wsl */ "./node_modules/open/node_modules/is-wsl/index.js");

const pAccess = promisify(fs.access);
const pExecFile = promisify(childProcess.execFile);

// Path to included `xdg-open`.
const localXdgOpenPath = path.join(__dirname, 'xdg-open');

// Convert a path from WSL format to Windows format:
// `/mnt/c/Program Files/Example/MyApp.exe` → `C:\Program Files\Example\MyApp.exe`
const wslToWindowsPath = async path => {
	const {stdout} = await pExecFile('wslpath', ['-w', path]);
	return stdout.trim();
};

module.exports = async (target, options) => {
	if (typeof target !== 'string') {
		throw new TypeError('Expected a `target`');
	}

	options = {
		wait: false,
		background: false,
		url: false,
		...options
	};

	let command;
	let appArguments = [];
	const cliArguments = [];
	const childProcessOptions = {};

	if (Array.isArray(options.app)) {
		appArguments = options.app.slice(1);
		options.app = options.app[0];
	}

	// Encodes the target as if it were an URL. Especially useful to get
	// double-quotes through the “double-quotes on Windows caveat”, but it
	// can be used on any platform.
	if (options.url) {
		target = encodeURI(target);
	}

	if (process.platform === 'darwin') {
		command = 'open';

		if (options.wait) {
			cliArguments.push('--wait-apps');
		}

		if (options.background) {
			cliArguments.push('--background');
		}

		if (options.app) {
			cliArguments.push('-a', options.app);
		}
	} else if (process.platform === 'win32' || isWsl) {
		command = 'cmd' + (isWsl ? '.exe' : '');
		cliArguments.push('/s', '/c', 'start', '""', '/b');

		// Always quoting target allows for URLs/paths to have spaces and unmarked characters, as `cmd.exe` will
		// interpret them as plain text to be forwarded as one unique argument. Enabling `windowsVerbatimArguments`
		// disables Node.js's default quotes and escapes handling (https://git.io/fjdem).
		// References:
		// - Issues #17, #44, #55, #77, #101, #115
		// - Pull requests: #74, #98
		//
		// As a result, all double-quotes are stripped from the `target` and do not get to your desired destination.
		target = `"${target}"`;
		childProcessOptions.windowsVerbatimArguments = true;

		if (options.wait) {
			cliArguments.push('/wait');
		}

		if (options.app) {
			if (isWsl && options.app.startsWith('/mnt/')) {
				const windowsPath = await wslToWindowsPath(options.app);
				// eslint-disable-next-line require-atomic-updates
				options.app = windowsPath;
			}

			cliArguments.push(options.app);
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}
	} else {
		if (options.app) {
			command = options.app;
		} else {
			// When bundled by Webpack, there's no actual package file path and no local `xdg-open`.
			const isBundled =  false || __dirname === '/';

			// Check if local `xdg-open` exists and is executable.
			let exeLocalXdgOpen = false;
			try {
				await pAccess(localXdgOpenPath, fs.constants.X_OK);
				exeLocalXdgOpen = true;
			} catch (_) {}

			const useSystemXdgOpen = process.versions.electron ||
				process.platform === 'android' || isBundled || !exeLocalXdgOpen;
			command = useSystemXdgOpen ? 'xdg-open' : localXdgOpenPath;
		}

		if (appArguments.length > 0) {
			cliArguments.push(...appArguments);
		}

		if (!options.wait) {
			// `xdg-open` will block the process unless stdio is ignored
			// and it's detached from the parent even if it's unref'd.
			childProcessOptions.stdio = 'ignore';
			childProcessOptions.detached = true;
		}
	}

	cliArguments.push(target);

	if (process.platform === 'darwin' && appArguments.length > 0) {
		cliArguments.push('--args', ...appArguments);
	}

	const subprocess = childProcess.spawn(command, cliArguments, childProcessOptions);

	if (options.wait) {
		return new Promise((resolve, reject) => {
			subprocess.once('error', reject);

			subprocess.once('close', exitCode => {
				if (exitCode > 0) {
					reject(new Error(`Exited with code ${exitCode}`));
					return;
				}

				resolve(subprocess);
			});
		});
	}

	subprocess.unref();

	return subprocess;
};

/* WEBPACK VAR INJECTION */}.call(this, "/"))

/***/ }),

/***/ "./node_modules/open/node_modules/is-wsl/index.js":
/*!********************************************************!*\
  !*** ./node_modules/open/node_modules/is-wsl/index.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const os = __webpack_require__(/*! os */ "os");
const fs = __webpack_require__(/*! fs */ "fs");

const isWsl = () => {
	if (process.platform !== 'linux') {
		return false;
	}

	if (os.release().toLowerCase().includes('microsoft')) {
		return true;
	}

	try {
		return fs.readFileSync('/proc/version', 'utf8').toLowerCase().includes('microsoft');
	} catch (_) {
		return false;
	}
};

if (process.env.__IS_WSL_TEST__) {
	module.exports = isWsl;
} else {
	module.exports = isWsl();
}


/***/ }),

/***/ "./node_modules/strip-ansi/index.js":
/*!******************************************!*\
  !*** ./node_modules/strip-ansi/index.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

const ansiRegex = __webpack_require__(/*! ansi-regex */ "./node_modules/ansi-regex/index.js");

const stripAnsi = string => typeof string === 'string' ? string.replace(ansiRegex(), '') : string;

module.exports = stripAnsi;
module.exports.default = stripAnsi;


/***/ }),

/***/ "./node_modules/yaml/dist/Anchors.js":
/*!*******************************************!*\
  !*** ./node_modules/yaml/dist/Anchors.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Alias = _interopRequireDefault(__webpack_require__(/*! ./schema/Alias */ "./node_modules/yaml/dist/schema/Alias.js"));

var _Map = _interopRequireDefault(__webpack_require__(/*! ./schema/Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _Merge = _interopRequireDefault(__webpack_require__(/*! ./schema/Merge */ "./node_modules/yaml/dist/schema/Merge.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _Seq = _interopRequireDefault(__webpack_require__(/*! ./schema/Seq */ "./node_modules/yaml/dist/schema/Seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class Anchors {
  static validAnchorNode(node) {
    return node instanceof _Scalar.default || node instanceof _Seq.default || node instanceof _Map.default;
  }

  constructor(prefix) {
    _defineProperty(this, "map", {});

    this.prefix = prefix;
  }

  createAlias(node, name) {
    this.setAnchor(node, name);
    return new _Alias.default(node);
  }

  createMergePair(...sources) {
    const merge = new _Merge.default();
    merge.value.items = sources.map(s => {
      if (s instanceof _Alias.default) {
        if (s.source instanceof _Map.default) return s;
      } else if (s instanceof _Map.default) {
        return this.createAlias(s);
      }

      throw new Error('Merge sources must be Map nodes or their Aliases');
    });
    return merge;
  }

  getName(node) {
    const {
      map
    } = this;
    return Object.keys(map).find(a => map[a] === node);
  }

  getNode(name) {
    return this.map[name];
  }

  newName(prefix) {
    if (!prefix) prefix = this.prefix;
    const names = Object.keys(this.map);

    for (let i = 1; true; ++i) {
      const name = `${prefix}${i}`;
      if (!names.includes(name)) return name;
    }
  } // During parsing, map & aliases contain CST nodes


  resolveNodes() {
    const {
      map,
      _cstAliases
    } = this;
    Object.keys(map).forEach(a => {
      map[a] = map[a].resolved;
    });

    _cstAliases.forEach(a => {
      a.source = a.source.resolved;
    });

    delete this._cstAliases;
  }

  setAnchor(node, name) {
    if (node != null && !Anchors.validAnchorNode(node)) {
      throw new Error('Anchors may only be set for Scalar, Seq and Map nodes');
    }

    if (name && /[\x00-\x19\s,[\]{}]/.test(name)) {
      throw new Error('Anchor names must not contain whitespace or control characters');
    }

    const {
      map
    } = this;
    const prev = node && Object.keys(map).find(a => map[a] === node);

    if (prev) {
      if (!name) {
        return prev;
      } else if (prev !== name) {
        delete map[prev];
        map[name] = node;
      }
    } else {
      if (!name) {
        if (!node) return null;
        name = this.newName();
      }

      map[name] = node;
    }

    return name;
  }

}

exports.default = Anchors;

/***/ }),

/***/ "./node_modules/yaml/dist/Document.js":
/*!********************************************!*\
  !*** ./node_modules/yaml/dist/Document.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _addComment = _interopRequireDefault(__webpack_require__(/*! ./addComment */ "./node_modules/yaml/dist/addComment.js"));

var _Anchors = _interopRequireDefault(__webpack_require__(/*! ./Anchors */ "./node_modules/yaml/dist/Anchors.js"));

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ./errors */ "./node_modules/yaml/dist/errors.js");

var _listTagNames = _interopRequireDefault(__webpack_require__(/*! ./listTagNames */ "./node_modules/yaml/dist/listTagNames.js"));

var _schema = _interopRequireDefault(__webpack_require__(/*! ./schema */ "./node_modules/yaml/dist/schema/index.js"));

var _Alias = _interopRequireDefault(__webpack_require__(/*! ./schema/Alias */ "./node_modules/yaml/dist/schema/Alias.js"));

var _Collection = _interopRequireWildcard(__webpack_require__(/*! ./schema/Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./schema/Node */ "./node_modules/yaml/dist/schema/Node.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _toJSON = _interopRequireDefault(__webpack_require__(/*! ./toJSON */ "./node_modules/yaml/dist/toJSON.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isCollectionItem = node => node && [_constants.Type.MAP_KEY, _constants.Type.MAP_VALUE, _constants.Type.SEQ_ITEM].includes(node.type);

class Document {
  constructor(options) {
    this.anchors = new _Anchors.default(options.anchorPrefix);
    this.commentBefore = null;
    this.comment = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.errors = [];
    this.options = options;
    this.schema = null;
    this.tagPrefixes = [];
    this.version = null;
    this.warnings = [];
  }

  assertCollectionContents() {
    if (this.contents instanceof _Collection.default) return true;
    throw new Error('Expected a YAML collection as document contents');
  }

  add(value) {
    this.assertCollectionContents();
    return this.contents.add(value);
  }

  addIn(path, value) {
    this.assertCollectionContents();
    this.contents.addIn(path, value);
  }

  delete(key) {
    this.assertCollectionContents();
    return this.contents.delete(key);
  }

  deleteIn(path) {
    if ((0, _Collection.isEmptyPath)(path)) {
      if (this.contents == null) return false;
      this.contents = null;
      return true;
    }

    this.assertCollectionContents();
    return this.contents.deleteIn(path);
  }

  getDefaults() {
    return Document.defaults[this.version] || Document.defaults[this.options.version] || {};
  }

  get(key, keepScalar) {
    return this.contents instanceof _Collection.default ? this.contents.get(key, keepScalar) : undefined;
  }

  getIn(path, keepScalar) {
    if ((0, _Collection.isEmptyPath)(path)) return !keepScalar && this.contents instanceof _Scalar.default ? this.contents.value : this.contents;
    return this.contents instanceof _Collection.default ? this.contents.getIn(path, keepScalar) : undefined;
  }

  has(key) {
    return this.contents instanceof _Collection.default ? this.contents.has(key) : false;
  }

  hasIn(path) {
    if ((0, _Collection.isEmptyPath)(path)) return this.contents !== undefined;
    return this.contents instanceof _Collection.default ? this.contents.hasIn(path) : false;
  }

  set(key, value) {
    this.assertCollectionContents();
    this.contents.set(key, value);
  }

  setIn(path, value) {
    if ((0, _Collection.isEmptyPath)(path)) this.contents = value;else {
      this.assertCollectionContents();
      this.contents.setIn(path, value);
    }
  }

  setSchema() {
    if (!this.schema) this.schema = new _schema.default(Object.assign({}, this.getDefaults(), this.options));
  }

  parse(node, prevDoc) {
    if (this.options.keepCstNodes) this.cstNode = node;
    if (this.options.keepNodeTypes) this.type = 'DOCUMENT';
    const {
      directives = [],
      contents = [],
      directivesEndMarker,
      error,
      valueRange
    } = node;

    if (error) {
      if (!error.source) error.source = this;
      this.errors.push(error);
    }

    this.parseDirectives(directives, prevDoc);
    if (directivesEndMarker) this.directivesEndMarker = true;
    this.range = valueRange ? [valueRange.start, valueRange.end] : null;
    this.setSchema();
    this.anchors._cstAliases = [];
    this.parseContents(contents);
    this.anchors.resolveNodes();

    if (this.options.prettyErrors) {
      for (const error of this.errors) if (error instanceof _errors.YAMLError) error.makePretty();

      for (const warn of this.warnings) if (warn instanceof _errors.YAMLError) warn.makePretty();
    }

    return this;
  }

  parseDirectives(directives, prevDoc) {
    const directiveComments = [];
    let hasDirectives = false;
    directives.forEach(directive => {
      const {
        comment,
        name
      } = directive;

      switch (name) {
        case 'TAG':
          this.resolveTagDirective(directive);
          hasDirectives = true;
          break;

        case 'YAML':
        case 'YAML:1.0':
          this.resolveYamlDirective(directive);
          hasDirectives = true;
          break;

        default:
          if (name) {
            const msg = `YAML only supports %TAG and %YAML directives, and not %${name}`;
            this.warnings.push(new _errors.YAMLWarning(directive, msg));
          }

      }

      if (comment) directiveComments.push(comment);
    });

    if (prevDoc && !hasDirectives && '1.1' === (this.version || prevDoc.version || this.options.version)) {
      const copyTagPrefix = ({
        handle,
        prefix
      }) => ({
        handle,
        prefix
      });

      this.tagPrefixes = prevDoc.tagPrefixes.map(copyTagPrefix);
      this.version = prevDoc.version;
    }

    this.commentBefore = directiveComments.join('\n') || null;
  }

  parseContents(contents) {
    const comments = {
      before: [],
      after: []
    };
    const contentNodes = [];
    let spaceBefore = false;
    contents.forEach(node => {
      if (node.valueRange) {
        if (contentNodes.length === 1) {
          const msg = 'Document is not valid YAML (bad indentation?)';
          this.errors.push(new _errors.YAMLSyntaxError(node, msg));
        }

        const res = this.resolveNode(node);

        if (spaceBefore) {
          res.spaceBefore = true;
          spaceBefore = false;
        }

        contentNodes.push(res);
      } else if (node.comment !== null) {
        const cc = contentNodes.length === 0 ? comments.before : comments.after;
        cc.push(node.comment);
      } else if (node.type === _constants.Type.BLANK_LINE) {
        spaceBefore = true;

        if (contentNodes.length === 0 && comments.before.length > 0 && !this.commentBefore) {
          // space-separated comments at start are parsed as document comments
          this.commentBefore = comments.before.join('\n');
          comments.before = [];
        }
      }
    });

    switch (contentNodes.length) {
      case 0:
        this.contents = null;
        comments.after = comments.before;
        break;

      case 1:
        this.contents = contentNodes[0];

        if (this.contents) {
          const cb = comments.before.join('\n') || null;

          if (cb) {
            const cbNode = this.contents instanceof _Collection.default && this.contents.items[0] ? this.contents.items[0] : this.contents;
            cbNode.commentBefore = cbNode.commentBefore ? `${cb}\n${cbNode.commentBefore}` : cb;
          }
        } else {
          comments.after = comments.before.concat(comments.after);
        }

        break;

      default:
        this.contents = contentNodes;

        if (this.contents[0]) {
          this.contents[0].commentBefore = comments.before.join('\n') || null;
        } else {
          comments.after = comments.before.concat(comments.after);
        }

    }

    this.comment = comments.after.join('\n') || null;
  }

  resolveTagDirective(directive) {
    const [handle, prefix] = directive.parameters;

    if (handle && prefix) {
      if (this.tagPrefixes.every(p => p.handle !== handle)) {
        this.tagPrefixes.push({
          handle,
          prefix
        });
      } else {
        const msg = 'The %TAG directive must only be given at most once per handle in the same document.';
        this.errors.push(new _errors.YAMLSemanticError(directive, msg));
      }
    } else {
      const msg = 'Insufficient parameters given for %TAG directive';
      this.errors.push(new _errors.YAMLSemanticError(directive, msg));
    }
  }

  resolveYamlDirective(directive) {
    let [version] = directive.parameters;
    if (directive.name === 'YAML:1.0') version = '1.0';

    if (this.version) {
      const msg = 'The %YAML directive must only be given at most once per document.';
      this.errors.push(new _errors.YAMLSemanticError(directive, msg));
    }

    if (!version) {
      const msg = 'Insufficient parameters given for %YAML directive';
      this.errors.push(new _errors.YAMLSemanticError(directive, msg));
    } else {
      if (!Document.defaults[version]) {
        const v0 = this.version || this.options.version;
        const msg = `Document will be parsed as YAML ${v0} rather than YAML ${version}`;
        this.warnings.push(new _errors.YAMLWarning(directive, msg));
      }

      this.version = version;
    }
  }

  resolveTagName(node) {
    const {
      tag,
      type
    } = node;
    let nonSpecific = false;

    if (tag) {
      const {
        handle,
        suffix,
        verbatim
      } = tag;

      if (verbatim) {
        if (verbatim !== '!' && verbatim !== '!!') return verbatim;
        const msg = `Verbatim tags aren't resolved, so ${verbatim} is invalid.`;
        this.errors.push(new _errors.YAMLSemanticError(node, msg));
      } else if (handle === '!' && !suffix) {
        nonSpecific = true;
      } else {
        let prefix = this.tagPrefixes.find(p => p.handle === handle);

        if (!prefix) {
          const dtp = this.getDefaults().tagPrefixes;
          if (dtp) prefix = dtp.find(p => p.handle === handle);
        }

        if (prefix) {
          if (suffix) {
            if (handle === '!' && (this.version || this.options.version) === '1.0') {
              if (suffix[0] === '^') return suffix;

              if (/[:/]/.test(suffix)) {
                // word/foo -> tag:word.yaml.org,2002:foo
                const vocab = suffix.match(/^([a-z0-9-]+)\/(.*)/i);
                return vocab ? `tag:${vocab[1]}.yaml.org,2002:${vocab[2]}` : `tag:${suffix}`;
              }
            }

            return prefix.prefix + decodeURIComponent(suffix);
          }

          this.errors.push(new _errors.YAMLSemanticError(node, `The ${handle} tag has no suffix.`));
        } else {
          const msg = `The ${handle} tag handle is non-default and was not declared.`;
          this.errors.push(new _errors.YAMLSemanticError(node, msg));
        }
      }
    }

    switch (type) {
      case _constants.Type.BLOCK_FOLDED:
      case _constants.Type.BLOCK_LITERAL:
      case _constants.Type.QUOTE_DOUBLE:
      case _constants.Type.QUOTE_SINGLE:
        return _schema.default.defaultTags.STR;

      case _constants.Type.FLOW_MAP:
      case _constants.Type.MAP:
        return _schema.default.defaultTags.MAP;

      case _constants.Type.FLOW_SEQ:
      case _constants.Type.SEQ:
        return _schema.default.defaultTags.SEQ;

      case _constants.Type.PLAIN:
        return nonSpecific ? _schema.default.defaultTags.STR : null;

      default:
        return null;
    }
  }

  resolveNode(node) {
    if (!node) return null;
    const {
      anchors,
      errors,
      schema
    } = this;
    let hasAnchor = false;
    let hasTag = false;
    const comments = {
      before: [],
      after: []
    };
    const props = isCollectionItem(node.context.parent) ? node.context.parent.props.concat(node.props) : node.props;

    for (const _ref of props) {
      const {
        start,
        end
      } = _ref;

      switch (node.context.src[start]) {
        case _constants.Char.COMMENT:
          {
            if (!node.commentHasRequiredWhitespace(start)) {
              const msg = 'Comments must be separated from other tokens by white space characters';
              errors.push(new _errors.YAMLSemanticError(node, msg));
            }

            const c = node.context.src.slice(start + 1, end);
            const {
              header,
              valueRange
            } = node;

            if (valueRange && (start > valueRange.start || header && start > header.start)) {
              comments.after.push(c);
            } else {
              comments.before.push(c);
            }
          }
          break;

        case _constants.Char.ANCHOR:
          if (hasAnchor) {
            const msg = 'A node can have at most one anchor';
            errors.push(new _errors.YAMLSemanticError(node, msg));
          }

          hasAnchor = true;
          break;

        case _constants.Char.TAG:
          if (hasTag) {
            const msg = 'A node can have at most one tag';
            errors.push(new _errors.YAMLSemanticError(node, msg));
          }

          hasTag = true;
          break;
      }
    }

    if (hasAnchor) {
      const name = node.anchor;
      const prev = anchors.getNode(name); // At this point, aliases for any preceding node with the same anchor
      // name have already been resolved, so it may safely be renamed.

      if (prev) anchors.map[anchors.newName(name)] = prev; // During parsing, we need to store the CST node in anchors.map as
      // anchors need to be available during resolution to allow for
      // circular references.

      anchors.map[name] = node;
    }

    let res;

    if (node.type === _constants.Type.ALIAS) {
      if (hasAnchor || hasTag) {
        const msg = 'An alias node must not specify any properties';
        errors.push(new _errors.YAMLSemanticError(node, msg));
      }

      const name = node.rawValue;
      const src = anchors.getNode(name);

      if (!src) {
        const msg = `Aliased anchor not found: ${name}`;
        errors.push(new _errors.YAMLReferenceError(node, msg));
        return null;
      } // Lazy resolution for circular references


      res = new _Alias.default(src);

      anchors._cstAliases.push(res);
    } else {
      const tagName = this.resolveTagName(node);

      if (tagName) {
        res = schema.resolveNodeWithFallback(this, node, tagName);
      } else {
        if (node.type !== _constants.Type.PLAIN) {
          const msg = `Failed to resolve ${node.type} node here`;
          errors.push(new _errors.YAMLSyntaxError(node, msg));
          return null;
        }

        try {
          res = schema.resolveScalar(node.strValue || '');
        } catch (error) {
          if (!error.source) error.source = node;
          errors.push(error);
          return null;
        }
      }
    }

    if (res) {
      res.range = [node.range.start, node.range.end];
      if (this.options.keepCstNodes) res.cstNode = node;
      if (this.options.keepNodeTypes) res.type = node.type;
      const cb = comments.before.join('\n');

      if (cb) {
        res.commentBefore = res.commentBefore ? `${res.commentBefore}\n${cb}` : cb;
      }

      const ca = comments.after.join('\n');
      if (ca) res.comment = res.comment ? `${res.comment}\n${ca}` : ca;
    }

    return node.resolved = res;
  }

  listNonDefaultTags() {
    return (0, _listTagNames.default)(this.contents).filter(t => t.indexOf(_schema.default.defaultPrefix) !== 0);
  }

  setTagPrefix(handle, prefix) {
    if (handle[0] !== '!' || handle[handle.length - 1] !== '!') throw new Error('Handle must start and end with !');

    if (prefix) {
      const prev = this.tagPrefixes.find(p => p.handle === handle);
      if (prev) prev.prefix = prefix;else this.tagPrefixes.push({
        handle,
        prefix
      });
    } else {
      this.tagPrefixes = this.tagPrefixes.filter(p => p.handle !== handle);
    }
  }

  stringifyTag(tag) {
    if ((this.version || this.options.version) === '1.0') {
      const priv = tag.match(/^tag:private\.yaml\.org,2002:([^:/]+)$/);
      if (priv) return '!' + priv[1];
      const vocab = tag.match(/^tag:([a-zA-Z0-9-]+)\.yaml\.org,2002:(.*)/);
      return vocab ? `!${vocab[1]}/${vocab[2]}` : `!${tag.replace(/^tag:/, '')}`;
    } else {
      let p = this.tagPrefixes.find(p => tag.indexOf(p.prefix) === 0);

      if (!p) {
        const dtp = this.getDefaults().tagPrefixes;
        p = dtp && dtp.find(p => tag.indexOf(p.prefix) === 0);
      }

      if (!p) return tag[0] === '!' ? tag : `!<${tag}>`;
      const suffix = tag.substr(p.prefix.length).replace(/[!,[\]{}]/g, ch => ({
        '!': '%21',
        ',': '%2C',
        '[': '%5B',
        ']': '%5D',
        '{': '%7B',
        '}': '%7D'
      })[ch]);
      return p.handle + suffix;
    }
  }

  toJSON(arg) {
    const {
      keepBlobsInJSON,
      mapAsMap,
      maxAliasCount
    } = this.options;
    const keep = keepBlobsInJSON && (typeof arg !== 'string' || !(this.contents instanceof _Scalar.default));
    const ctx = {
      doc: this,
      keep,
      mapAsMap: keep && !!mapAsMap,
      maxAliasCount
    };
    const anchorNames = Object.keys(this.anchors.map);
    if (anchorNames.length > 0) ctx.anchors = anchorNames.map(name => ({
      alias: [],
      aliasCount: 0,
      count: 1,
      node: this.anchors.map[name]
    }));
    return (0, _toJSON.default)(this.contents, arg, ctx);
  }

  toString() {
    if (this.errors.length > 0) throw new Error('Document with errors cannot be stringified');
    this.setSchema();
    const lines = [];
    let hasDirectives = false;

    if (this.version) {
      let vd = '%YAML 1.2';

      if (this.schema.name === 'yaml-1.1') {
        if (this.version === '1.0') vd = '%YAML:1.0';else if (this.version === '1.1') vd = '%YAML 1.1';
      }

      lines.push(vd);
      hasDirectives = true;
    }

    const tagNames = this.listNonDefaultTags();
    this.tagPrefixes.forEach(({
      handle,
      prefix
    }) => {
      if (tagNames.some(t => t.indexOf(prefix) === 0)) {
        lines.push(`%TAG ${handle} ${prefix}`);
        hasDirectives = true;
      }
    });
    if (hasDirectives || this.directivesEndMarker) lines.push('---');

    if (this.commentBefore) {
      if (hasDirectives || !this.directivesEndMarker) lines.unshift('');
      lines.unshift(this.commentBefore.replace(/^/gm, '#'));
    }

    const ctx = {
      anchors: {},
      doc: this,
      indent: ''
    };
    let chompKeep = false;
    let contentComment = null;

    if (this.contents) {
      if (this.contents instanceof _Node.default) {
        if (this.contents.spaceBefore && (hasDirectives || this.directivesEndMarker)) lines.push('');
        if (this.contents.commentBefore) lines.push(this.contents.commentBefore.replace(/^/gm, '#')); // top-level block scalars need to be indented if followed by a comment

        ctx.forceBlockIndent = !!this.comment;
        contentComment = this.contents.comment;
      }

      const onChompKeep = contentComment ? null : () => chompKeep = true;
      const body = this.schema.stringify(this.contents, ctx, () => contentComment = null, onChompKeep);
      lines.push((0, _addComment.default)(body, '', contentComment));
    } else if (this.contents !== undefined) {
      lines.push(this.schema.stringify(this.contents, ctx));
    }

    if (this.comment) {
      if ((!chompKeep || contentComment) && lines[lines.length - 1] !== '') lines.push('');
      lines.push(this.comment.replace(/^/gm, '#'));
    }

    return lines.join('\n') + '\n';
  }

}

exports.default = Document;

_defineProperty(Document, "defaults", {
  '1.0': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: _schema.default.defaultPrefix
    }, {
      handle: '!!',
      prefix: 'tag:private.yaml.org,2002:'
    }]
  },
  '1.1': {
    schema: 'yaml-1.1',
    merge: true,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: _schema.default.defaultPrefix
    }]
  },
  '1.2': {
    schema: 'core',
    merge: false,
    tagPrefixes: [{
      handle: '!',
      prefix: '!'
    }, {
      handle: '!!',
      prefix: _schema.default.defaultPrefix
    }]
  }
});

/***/ }),

/***/ "./node_modules/yaml/dist/addComment.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/addComment.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addCommentBefore = addCommentBefore;
exports.default = addComment;

function addCommentBefore(str, indent, comment) {
  if (!comment) return str;
  const cc = comment.replace(/[\s\S]^/gm, `$&${indent}#`);
  return `#${cc}\n${indent}${str}`;
}

function addComment(str, indent, comment) {
  return !comment ? str : comment.indexOf('\n') === -1 ? `${str} #${comment}` : `${str}\n` + comment.replace(/^/gm, `${indent || ''}#`);
}

/***/ }),

/***/ "./node_modules/yaml/dist/constants.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/constants.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Type = exports.Char = void 0;
const Char = {
  ANCHOR: '&',
  COMMENT: '#',
  TAG: '!',
  DIRECTIVES_END: '-',
  DOCUMENT_END: '.'
};
exports.Char = Char;
const Type = {
  ALIAS: 'ALIAS',
  BLANK_LINE: 'BLANK_LINE',
  BLOCK_FOLDED: 'BLOCK_FOLDED',
  BLOCK_LITERAL: 'BLOCK_LITERAL',
  COMMENT: 'COMMENT',
  DIRECTIVE: 'DIRECTIVE',
  DOCUMENT: 'DOCUMENT',
  FLOW_MAP: 'FLOW_MAP',
  FLOW_SEQ: 'FLOW_SEQ',
  MAP: 'MAP',
  MAP_KEY: 'MAP_KEY',
  MAP_VALUE: 'MAP_VALUE',
  PLAIN: 'PLAIN',
  QUOTE_DOUBLE: 'QUOTE_DOUBLE',
  QUOTE_SINGLE: 'QUOTE_SINGLE',
  SEQ: 'SEQ',
  SEQ_ITEM: 'SEQ_ITEM'
};
exports.Type = Type;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Alias.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/cst/Alias.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Alias extends _Node.default {
  /**
   * Parses an *alias from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */
  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;

    let offset = _Node.default.endOfIdentifier(src, start + 1);

    this.valueRange = new _Range.default(start + 1, offset);
    offset = _Node.default.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.default = Alias;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/BlankLine.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/cst/BlankLine.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class BlankLine extends _Node.default {
  constructor() {
    super(_constants.Type.BLANK_LINE);
  }

  get includesTrailingLines() {
    return true;
  }
  /**
   * Parses blank lines from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first \n character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = start + 1;

    while (_Node.default.atBlank(src, offset)) {
      const lineEnd = _Node.default.endOfWhiteSpace(src, offset);

      if (lineEnd === '\n') offset = lineEnd + 1;else break;
    }

    this.range = new _Range.default(start, offset);
    return offset;
  }

}

exports.default = BlankLine;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/BlockValue.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/cst/BlockValue.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.Chomp = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Chomp = {
  CLIP: 'CLIP',
  KEEP: 'KEEP',
  STRIP: 'STRIP'
};
exports.Chomp = Chomp;

class BlockValue extends _Node.default {
  constructor(type, props) {
    super(type, props);
    this.blockIndent = null;
    this.chomping = Chomp.CLIP;
    this.header = null;
  }

  get includesTrailingLines() {
    return this.chomping === Chomp.KEEP;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (this.valueRange.isEmpty()) return '';
    let lastNewLine = null;
    let ch = src[end - 1];

    while (ch === '\n' || ch === '\t' || ch === ' ') {
      end -= 1;

      if (end <= start) {
        if (this.chomping === Chomp.KEEP) break;else return '';
      }

      if (ch === '\n') lastNewLine = end;
      ch = src[end - 1];
    }

    let keepStart = end + 1;

    if (lastNewLine) {
      if (this.chomping === Chomp.KEEP) {
        keepStart = lastNewLine;
        end = this.valueRange.end;
      } else {
        end = lastNewLine;
      }
    }

    const bi = indent + this.blockIndent;
    const folded = this.type === _constants.Type.BLOCK_FOLDED;
    let atStart = true;
    let str = '';
    let sep = '';
    let prevMoreIndented = false;

    for (let i = start; i < end; ++i) {
      for (let j = 0; j < bi; ++j) {
        if (src[i] !== ' ') break;
        i += 1;
      }

      const ch = src[i];

      if (ch === '\n') {
        if (sep === '\n') str += '\n';else sep = '\n';
      } else {
        const lineEnd = _Node.default.endOfLine(src, i);

        const line = src.slice(i, lineEnd);
        i = lineEnd;

        if (folded && (ch === ' ' || ch === '\t') && i < keepStart) {
          if (sep === ' ') sep = '\n';else if (!prevMoreIndented && !atStart && sep === '\n') sep = '\n\n';
          str += sep + line; //+ ((lineEnd < end && src[lineEnd]) || '')

          sep = lineEnd < end && src[lineEnd] || '';
          prevMoreIndented = true;
        } else {
          str += sep + line;
          sep = folded && i < keepStart ? ' ' : '\n';
          prevMoreIndented = false;
        }

        if (atStart && line !== '') atStart = false;
      }
    }

    return this.chomping === Chomp.STRIP ? str : str + '\n';
  }

  parseBlockHeader(start) {
    const {
      src
    } = this.context;
    let offset = start + 1;
    let bi = '';

    while (true) {
      const ch = src[offset];

      switch (ch) {
        case '-':
          this.chomping = Chomp.STRIP;
          break;

        case '+':
          this.chomping = Chomp.KEEP;
          break;

        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          bi += ch;
          break;

        default:
          this.blockIndent = Number(bi) || null;
          this.header = new _Range.default(start, offset);
          return offset;
      }

      offset += 1;
    }
  }

  parseBlockValue(start) {
    const {
      indent,
      src
    } = this.context;
    let offset = start;
    let valueEnd = start;
    let bi = this.blockIndent ? indent + this.blockIndent - 1 : indent;
    let minBlockIndent = 1;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      offset += 1;
      if (_Node.default.atDocumentBoundary(src, offset)) break;

      const end = _Node.default.endOfBlockIndent(src, bi, offset); // should not include tab?


      if (end === null) break;

      if (!this.blockIndent) {
        // no explicit block indent, none yet detected
        const lineIndent = end - (offset + indent);

        if (src[end] !== '\n') {
          // first line with non-whitespace content
          if (lineIndent < minBlockIndent) {
            offset -= 1;
            break;
          }

          this.blockIndent = lineIndent;
          bi = indent + this.blockIndent - 1;
        } else if (lineIndent > minBlockIndent) {
          // empty line with more whitespace
          minBlockIndent = lineIndent;
        }
      }

      if (src[end] === '\n') {
        offset = end;
      } else {
        offset = valueEnd = _Node.default.endOfLine(src, end);
      }
    }

    if (this.chomping !== Chomp.KEEP) {
      offset = src[valueEnd] ? valueEnd + 1 : valueEnd;
    }

    this.valueRange = new _Range.default(start + 1, offset);
    return offset;
  }
  /**
   * Parses a block value from the source
   *
   * Accepted forms are:
   * ```
   * BS
   * block
   * lines
   *
   * BS #comment
   * block
   * lines
   * ```
   * where the block style BS matches the regexp `[|>][-+1-9]*` and block lines
   * are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this block
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = this.parseBlockHeader(start);
    offset = _Node.default.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    offset = this.parseBlockValue(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.header ? this.header.setOrigRange(cr, offset) : offset;
  }

}

exports.default = BlockValue;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Collection.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/cst/Collection.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.grabCollectionEndComments = grabCollectionEndComments;
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _BlankLine = _interopRequireDefault(__webpack_require__(/*! ./BlankLine */ "./node_modules/yaml/dist/cst/BlankLine.js"));

var _CollectionItem = _interopRequireDefault(__webpack_require__(/*! ./CollectionItem */ "./node_modules/yaml/dist/cst/CollectionItem.js"));

var _Comment = _interopRequireDefault(__webpack_require__(/*! ./Comment */ "./node_modules/yaml/dist/cst/Comment.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function grabCollectionEndComments(node) {
  let cnode = node;

  while (cnode instanceof _CollectionItem.default) cnode = cnode.node;

  if (!(cnode instanceof Collection)) return null;
  const len = cnode.items.length;
  let ci = -1;

  for (let i = len - 1; i >= 0; --i) {
    const n = cnode.items[i];

    if (n.type === _constants.Type.COMMENT) {
      // Keep sufficiently indented comments with preceding node
      const {
        indent,
        lineStart
      } = n.context;
      if (indent > 0 && n.range.start >= lineStart + indent) break;
      ci = i;
    } else if (n.type === _constants.Type.BLANK_LINE) ci = i;else break;
  }

  if (ci === -1) return null;
  const ca = cnode.items.splice(ci, len - ci);
  const prevEnd = ca[0].range.start;

  while (true) {
    cnode.range.end = prevEnd;
    if (cnode.valueRange && cnode.valueRange.end > prevEnd) cnode.valueRange.end = prevEnd;
    if (cnode === node) break;
    cnode = cnode.context.parent;
  }

  return ca;
}

class Collection extends _Node.default {
  static nextContentHasIndent(src, offset, indent) {
    const lineStart = _Node.default.endOfLine(src, offset) + 1;
    offset = _Node.default.endOfWhiteSpace(src, lineStart);
    const ch = src[offset];
    if (!ch) return false;
    if (offset >= lineStart + indent) return true;
    if (ch !== '#' && ch !== '\n') return false;
    return Collection.nextContentHasIndent(src, offset, indent);
  }

  constructor(firstItem) {
    super(firstItem.type === _constants.Type.SEQ_ITEM ? _constants.Type.SEQ : _constants.Type.MAP);

    for (let i = firstItem.props.length - 1; i >= 0; --i) {
      if (firstItem.props[i].start < firstItem.context.lineStart) {
        // props on previous line are assumed by the collection
        this.props = firstItem.props.slice(0, i + 1);
        firstItem.props = firstItem.props.slice(i + 1);
        const itemRange = firstItem.props[0] || firstItem.valueRange;
        firstItem.range.start = itemRange.start;
        break;
      }
    }

    this.items = [firstItem];
    const ec = grabCollectionEndComments(firstItem);
    if (ec) Array.prototype.push.apply(this.items, ec);
  }

  get includesTrailingLines() {
    return this.items.length > 0;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context; // It's easier to recalculate lineStart here rather than tracking down the
    // last context from which to read it -- eemeli/yaml#2

    let lineStart = _Node.default.startOfLine(src, start);

    const firstItem = this.items[0]; // First-item context needs to be correct for later comment handling
    // -- eemeli/yaml#17

    firstItem.context.parent = this;
    this.valueRange = _Range.default.copy(firstItem.valueRange);
    const indent = firstItem.range.start - firstItem.context.lineStart;
    let offset = start;
    offset = _Node.default.normalizeOffset(src, offset);
    let ch = src[offset];
    let atLineStart = _Node.default.endOfWhiteSpace(src, lineStart) === offset;
    let prevIncludesTrailingLines = false;

    while (ch) {
      while (ch === '\n' || ch === '#') {
        if (atLineStart && ch === '\n' && !prevIncludesTrailingLines) {
          const blankLine = new _BlankLine.default();
          offset = blankLine.parse({
            src
          }, offset);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }

          this.items.push(blankLine);
          offset -= 1; // blankLine.parse() consumes terminal newline
        } else if (ch === '#') {
          if (offset < lineStart + indent && !Collection.nextContentHasIndent(src, offset, indent)) {
            return offset;
          }

          const comment = new _Comment.default();
          offset = comment.parse({
            indent,
            lineStart,
            src
          }, offset);
          this.items.push(comment);
          this.valueRange.end = offset;

          if (offset >= src.length) {
            ch = null;
            break;
          }
        }

        lineStart = offset + 1;
        offset = _Node.default.endOfIndent(src, lineStart);

        if (_Node.default.atBlank(src, offset)) {
          const wsEnd = _Node.default.endOfWhiteSpace(src, offset);

          const next = src[wsEnd];

          if (!next || next === '\n' || next === '#') {
            offset = wsEnd;
          }
        }

        ch = src[offset];
        atLineStart = true;
      }

      if (!ch) {
        break;
      }

      if (offset !== lineStart + indent && (atLineStart || ch !== ':')) {
        if (lineStart > start) offset = lineStart;
        break;
      }

      if (firstItem.type === _constants.Type.SEQ_ITEM !== (ch === '-')) {
        let typeswitch = true;

        if (ch === '-') {
          // map key may start with -, as long as it's followed by a non-whitespace char
          const next = src[offset + 1];
          typeswitch = !next || next === '\n' || next === '\t' || next === ' ';
        }

        if (typeswitch) {
          if (lineStart > start) offset = lineStart;
          break;
        }
      }

      const node = parseNode({
        atLineStart,
        inCollection: true,
        indent,
        lineStart,
        parent: this
      }, offset);
      if (!node) return offset; // at next document start

      this.items.push(node);
      this.valueRange.end = node.valueRange.end;
      offset = _Node.default.normalizeOffset(src, node.range.end);
      ch = src[offset];
      atLineStart = false;
      prevIncludesTrailingLines = node.includesTrailingLines; // Need to reset lineStart and atLineStart here if preceding node's range
      // has advanced to check the current line's indentation level
      // -- eemeli/yaml#10 & eemeli/yaml#38

      if (ch) {
        let ls = offset - 1;
        let prev = src[ls];

        while (prev === ' ' || prev === '\t') prev = src[--ls];

        if (prev === '\n') {
          lineStart = ls + 1;
          atLineStart = true;
        }
      }

      const ec = grabCollectionEndComments(node);
      if (ec) Array.prototype.push.apply(this.items, ec);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    let str = src.slice(range.start, items[0].range.start) + String(items[0]);

    for (let i = 1; i < items.length; ++i) {
      const item = items[i];
      const {
        atLineStart,
        indent
      } = item.context;
      if (atLineStart) for (let i = 0; i < indent; ++i) str += ' ';
      str += String(item);
    }

    return _Node.default.addStringTerminator(src, range.end, str);
  }

}

exports.default = Collection;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/CollectionItem.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/cst/CollectionItem.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _BlankLine = _interopRequireDefault(__webpack_require__(/*! ./BlankLine */ "./node_modules/yaml/dist/cst/BlankLine.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class CollectionItem extends _Node.default {
  constructor(type, props) {
    super(type, props);
    this.node = null;
  }

  get includesTrailingLines() {
    return !!this.node && this.node.includesTrailingLines;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      atLineStart,
      lineStart
    } = context;
    if (!atLineStart && this.type === _constants.Type.SEQ_ITEM) this.error = new _errors.YAMLSemanticError(this, 'Sequence items must not have preceding content on the same line');
    const indent = atLineStart ? start - lineStart : context.indent;

    let offset = _Node.default.endOfWhiteSpace(src, start + 1);

    let ch = src[offset];

    while (ch === '\n' || ch === '#') {
      if (ch === '#') {
        const end = _Node.default.endOfLine(src, offset + 1);

        this.props.push(new _Range.default(offset, end));
        offset = end;
      } else {
        atLineStart = true;
        lineStart = offset + 1;

        const wsEnd = _Node.default.endOfWhiteSpace(src, lineStart);

        if (src[wsEnd] === '\n') {
          const blankLine = new _BlankLine.default();
          lineStart = blankLine.parse({
            src
          }, lineStart);
          const items = context.parent.items || context.parent.contents;
          items.push(blankLine);
        }

        offset = _Node.default.endOfIndent(src, lineStart);
      }

      ch = src[offset];
    }

    if (_Node.default.nextNodeIsIndented(ch, offset - (lineStart + indent), this.type !== _constants.Type.SEQ_ITEM)) {
      this.node = parseNode({
        atLineStart,
        inCollection: false,
        indent,
        lineStart,
        parent: this
      }, offset);
      if (this.node) offset = this.node.range.end;
    } else if (ch && lineStart > start + 1) {
      offset = lineStart - 1;
    }

    const end = this.node ? this.node.valueRange.end : offset;
    this.valueRange = new _Range.default(start, end);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    return this.node ? this.node.setOrigRanges(cr, offset) : offset;
  }

  toString() {
    const {
      context: {
        src
      },
      node,
      range,
      value
    } = this;
    if (value != null) return value;
    const str = node ? src.slice(range.start, node.range.start) + String(node) : src.slice(range.start, range.end);
    return _Node.default.addStringTerminator(src, range.end, str);
  }

}

exports.default = CollectionItem;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Comment.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/cst/Comment.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Comment extends _Node.default {
  constructor() {
    super(_constants.Type.COMMENT);
  }
  /**
   * Parses a comment line from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const offset = this.parseComment(start);
    this.range = new _Range.default(start, offset);
    return offset;
  }

}

exports.default = Comment;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Directive.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/cst/Directive.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Directive extends _Node.default {
  static endOfDirective(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '#') ch = src[offset += 1]; // last char can't be whitespace


    ch = src[offset - 1];

    while (ch === ' ' || ch === '\t') {
      offset -= 1;
      ch = src[offset - 1];
    }

    return offset;
  }

  constructor() {
    super(_constants.Type.DIRECTIVE);
    this.name = null;
  }

  get parameters() {
    const raw = this.rawValue;
    return raw ? raw.trim().split(/[ \t]+/) : [];
  }

  parseName(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '\t' && ch !== ' ') ch = src[offset += 1];

    this.name = src.slice(start, offset);
    return offset;
  }

  parseParameters(start) {
    const {
      src
    } = this.context;
    let offset = start;
    let ch = src[offset];

    while (ch && ch !== '\n' && ch !== '#') ch = src[offset += 1];

    this.valueRange = new _Range.default(start, offset);
    return offset;
  }

  parse(context, start) {
    this.context = context;
    let offset = this.parseName(start + 1);
    offset = this.parseParameters(offset);
    offset = this.parseComment(offset);
    this.range = new _Range.default(start, offset);
    return offset;
  }

}

exports.default = Directive;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Document.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/cst/Document.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _BlankLine = _interopRequireDefault(__webpack_require__(/*! ./BlankLine */ "./node_modules/yaml/dist/cst/BlankLine.js"));

var _Collection = __webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/cst/Collection.js");

var _Comment = _interopRequireDefault(__webpack_require__(/*! ./Comment */ "./node_modules/yaml/dist/cst/Comment.js"));

var _Directive = _interopRequireDefault(__webpack_require__(/*! ./Directive */ "./node_modules/yaml/dist/cst/Directive.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class Document extends _Node.default {
  static startCommentOrEndBlankLine(src, start) {
    const offset = _Node.default.endOfWhiteSpace(src, start);

    const ch = src[offset];
    return ch === '#' || ch === '\n' ? offset : start;
  }

  constructor() {
    super(_constants.Type.DOCUMENT);
    this.directives = null;
    this.contents = null;
    this.directivesEndMarker = null;
    this.documentEndMarker = null;
  }

  parseDirectives(start) {
    const {
      src
    } = this.context;
    this.directives = [];
    let atLineStart = true;
    let hasDirectives = false;
    let offset = start;

    while (!_Node.default.atDocumentBoundary(src, offset, _constants.Char.DIRECTIVES_END)) {
      offset = Document.startCommentOrEndBlankLine(src, offset);

      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new _BlankLine.default();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.directives.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          break;

        case '#':
          {
            const comment = new _Comment.default();
            offset = comment.parse({
              src
            }, offset);
            this.directives.push(comment);
            atLineStart = false;
          }
          break;

        case '%':
          {
            const directive = new _Directive.default();
            offset = directive.parse({
              parent: this,
              src
            }, offset);
            this.directives.push(directive);
            hasDirectives = true;
            atLineStart = false;
          }
          break;

        default:
          if (hasDirectives) {
            this.error = new _errors.YAMLSemanticError(this, 'Missing directives-end indicator line');
          } else if (this.directives.length > 0) {
            this.contents = this.directives;
            this.directives = [];
          }

          return offset;
      }
    }

    if (src[offset]) {
      this.directivesEndMarker = new _Range.default(offset, offset + 3);
      return offset + 3;
    }

    if (hasDirectives) {
      this.error = new _errors.YAMLSemanticError(this, 'Missing directives-end indicator line');
    } else if (this.directives.length > 0) {
      this.contents = this.directives;
      this.directives = [];
    }

    return offset;
  }

  parseContents(start) {
    const {
      parseNode,
      src
    } = this.context;
    if (!this.contents) this.contents = [];
    let lineStart = start;

    while (src[lineStart - 1] === '-') lineStart -= 1;

    let offset = _Node.default.endOfWhiteSpace(src, start);

    let atLineStart = lineStart === start;
    this.valueRange = new _Range.default(offset);

    while (!_Node.default.atDocumentBoundary(src, offset, _constants.Char.DOCUMENT_END)) {
      switch (src[offset]) {
        case '\n':
          if (atLineStart) {
            const blankLine = new _BlankLine.default();
            offset = blankLine.parse({
              src
            }, offset);

            if (offset < src.length) {
              this.contents.push(blankLine);
            }
          } else {
            offset += 1;
            atLineStart = true;
          }

          lineStart = offset;
          break;

        case '#':
          {
            const comment = new _Comment.default();
            offset = comment.parse({
              src
            }, offset);
            this.contents.push(comment);
            atLineStart = false;
          }
          break;

        default:
          {
            const iEnd = _Node.default.endOfIndent(src, offset);

            const context = {
              atLineStart,
              indent: -1,
              inFlow: false,
              inCollection: false,
              lineStart,
              parent: this
            };
            const node = parseNode(context, iEnd);
            if (!node) return this.valueRange.end = iEnd; // at next document start

            this.contents.push(node);
            offset = node.range.end;
            atLineStart = false;
            const ec = (0, _Collection.grabCollectionEndComments)(node);
            if (ec) Array.prototype.push.apply(this.contents, ec);
          }
      }

      offset = Document.startCommentOrEndBlankLine(src, offset);
    }

    this.valueRange.end = offset;

    if (src[offset]) {
      this.documentEndMarker = new _Range.default(offset, offset + 3);
      offset += 3;

      if (src[offset]) {
        offset = _Node.default.endOfWhiteSpace(src, offset);

        if (src[offset] === '#') {
          const comment = new _Comment.default();
          offset = comment.parse({
            src
          }, offset);
          this.contents.push(comment);
        }

        switch (src[offset]) {
          case '\n':
            offset += 1;
            break;

          case undefined:
            break;

          default:
            this.error = new _errors.YAMLSyntaxError(this, 'Document end marker line cannot have a non-comment suffix');
        }
      }
    }

    return offset;
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    context.root = this;
    this.context = context;
    const {
      src
    } = context;
    let offset = src.charCodeAt(start) === 0xfeff ? start + 1 : start; // skip BOM

    offset = this.parseDirectives(offset);
    offset = this.parseContents(offset);
    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.directives.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.directivesEndMarker) offset = this.directivesEndMarker.setOrigRange(cr, offset);
    this.contents.forEach(node => {
      offset = node.setOrigRanges(cr, offset);
    });
    if (this.documentEndMarker) offset = this.documentEndMarker.setOrigRange(cr, offset);
    return offset;
  }

  toString() {
    const {
      contents,
      directives,
      value
    } = this;
    if (value != null) return value;
    let str = directives.join('');

    if (contents.length > 0) {
      if (directives.length > 0 || contents[0].type === _constants.Type.COMMENT) str += '---\n';
      str += contents.join('');
    }

    if (str[str.length - 1] !== '\n') str += '\n';
    return str;
  }

}

exports.default = Document;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/FlowCollection.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/cst/FlowCollection.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _BlankLine = _interopRequireDefault(__webpack_require__(/*! ./BlankLine */ "./node_modules/yaml/dist/cst/BlankLine.js"));

var _Comment = _interopRequireDefault(__webpack_require__(/*! ./Comment */ "./node_modules/yaml/dist/cst/Comment.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class FlowCollection extends _Node.default {
  constructor(type, props) {
    super(type, props);
    this.items = null;
  }

  prevNodeIsJsonLike(idx = this.items.length) {
    const node = this.items[idx - 1];
    return !!node && (node.jsonLike || node.type === _constants.Type.COMMENT && this.nodeIsJsonLike(idx - 1));
  }
  /**
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this
   */


  parse(context, start) {
    this.context = context;
    const {
      parseNode,
      src
    } = context;
    let {
      indent,
      lineStart
    } = context;
    let char = src[start]; // { or [

    this.items = [{
      char,
      offset: start
    }];

    let offset = _Node.default.endOfWhiteSpace(src, start + 1);

    char = src[offset];

    while (char && char !== ']' && char !== '}') {
      switch (char) {
        case '\n':
          {
            lineStart = offset + 1;

            const wsEnd = _Node.default.endOfWhiteSpace(src, lineStart);

            if (src[wsEnd] === '\n') {
              const blankLine = new _BlankLine.default();
              lineStart = blankLine.parse({
                src
              }, lineStart);
              this.items.push(blankLine);
            }

            offset = _Node.default.endOfIndent(src, lineStart);

            if (offset <= lineStart + indent) {
              char = src[offset];

              if (offset < lineStart + indent || char !== ']' && char !== '}') {
                const msg = 'Insufficient indentation in flow collection';
                this.error = new _errors.YAMLSemanticError(this, msg);
              }
            }
          }
          break;

        case ',':
          {
            this.items.push({
              char,
              offset
            });
            offset += 1;
          }
          break;

        case '#':
          {
            const comment = new _Comment.default();
            offset = comment.parse({
              src
            }, offset);
            this.items.push(comment);
          }
          break;

        case '?':
        case ':':
          {
            const next = src[offset + 1];

            if (next === '\n' || next === '\t' || next === ' ' || next === ',' || // in-flow : after JSON-like key does not need to be followed by whitespace
            char === ':' && this.prevNodeIsJsonLike()) {
              this.items.push({
                char,
                offset
              });
              offset += 1;
              break;
            }
          }
        // fallthrough

        default:
          {
            const node = parseNode({
              atLineStart: false,
              inCollection: false,
              inFlow: true,
              indent: -1,
              lineStart,
              parent: this
            }, offset);

            if (!node) {
              // at next document start
              this.valueRange = new _Range.default(start, offset);
              return offset;
            }

            this.items.push(node);
            offset = _Node.default.normalizeOffset(src, node.range.end);
          }
      }

      offset = _Node.default.endOfWhiteSpace(src, offset);
      char = src[offset];
    }

    this.valueRange = new _Range.default(start, offset + 1);

    if (char) {
      this.items.push({
        char,
        offset
      });
      offset = _Node.default.endOfWhiteSpace(src, offset + 1);
      offset = this.parseComment(offset);
    }

    return offset;
  }

  setOrigRanges(cr, offset) {
    offset = super.setOrigRanges(cr, offset);
    this.items.forEach(node => {
      if (node instanceof _Node.default) {
        offset = node.setOrigRanges(cr, offset);
      } else if (cr.length === 0) {
        node.origOffset = node.offset;
      } else {
        let i = offset;

        while (i < cr.length) {
          if (cr[i] > node.offset) break;else ++i;
        }

        node.origOffset = node.offset + i;
        offset = i;
      }
    });
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      items,
      range,
      value
    } = this;
    if (value != null) return value;
    const nodes = items.filter(item => item instanceof _Node.default);
    let str = '';
    let prevEnd = range.start;
    nodes.forEach(node => {
      const prefix = src.slice(prevEnd, node.range.start);
      prevEnd = node.range.end;
      str += prefix + String(node);

      if (str[str.length - 1] === '\n' && src[prevEnd - 1] !== '\n' && src[prevEnd] === '\n') {
        // Comment range does not include the terminal newline, but its
        // stringified value does. Without this fix, newlines at comment ends
        // get duplicated.
        prevEnd += 1;
      }
    });
    str += src.slice(prevEnd, range.end);
    return _Node.default.addStringTerminator(src, range.end, str);
  }

}

exports.default = FlowCollection;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Node.js":
/*!********************************************!*\
  !*** ./node_modules/yaml/dist/cst/Node.js ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _getLinePos = _interopRequireDefault(__webpack_require__(/*! ./getLinePos */ "./node_modules/yaml/dist/cst/getLinePos.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** Root class of all nodes */
class Node {
  static addStringTerminator(src, offset, str) {
    if (str[str.length - 1] === '\n') return str;
    const next = Node.endOfWhiteSpace(src, offset);
    return next >= src.length || src[next] === '\n' ? str + '\n' : str;
  } // ^(---|...)


  static atDocumentBoundary(src, offset, sep) {
    const ch0 = src[offset];
    if (!ch0) return true;
    const prev = src[offset - 1];
    if (prev && prev !== '\n') return false;

    if (sep) {
      if (ch0 !== sep) return false;
    } else {
      if (ch0 !== _constants.Char.DIRECTIVES_END && ch0 !== _constants.Char.DOCUMENT_END) return false;
    }

    const ch1 = src[offset + 1];
    const ch2 = src[offset + 2];
    if (ch1 !== ch0 || ch2 !== ch0) return false;
    const ch3 = src[offset + 3];
    return !ch3 || ch3 === '\n' || ch3 === '\t' || ch3 === ' ';
  }

  static endOfIdentifier(src, offset) {
    let ch = src[offset];
    const isVerbatim = ch === '<';
    const notOk = isVerbatim ? ['\n', '\t', ' ', '>'] : ['\n', '\t', ' ', '[', ']', '{', '}', ','];

    while (ch && notOk.indexOf(ch) === -1) ch = src[offset += 1];

    if (isVerbatim && ch === '>') offset += 1;
    return offset;
  }

  static endOfIndent(src, offset) {
    let ch = src[offset];

    while (ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static endOfLine(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '\n') ch = src[offset += 1];

    return offset;
  }

  static endOfWhiteSpace(src, offset) {
    let ch = src[offset];

    while (ch === '\t' || ch === ' ') ch = src[offset += 1];

    return offset;
  }

  static startOfLine(src, offset) {
    let ch = src[offset - 1];
    if (ch === '\n') return offset;

    while (ch && ch !== '\n') ch = src[offset -= 1];

    return offset + 1;
  }
  /**
   * End of indentation, or null if the line's indent level is not more
   * than `indent`
   *
   * @param {string} src
   * @param {number} indent
   * @param {number} lineStart
   * @returns {?number}
   */


  static endOfBlockIndent(src, indent, lineStart) {
    const inEnd = Node.endOfIndent(src, lineStart);

    if (inEnd > lineStart + indent) {
      return inEnd;
    } else {
      const wsEnd = Node.endOfWhiteSpace(src, inEnd);
      const ch = src[wsEnd];
      if (!ch || ch === '\n') return wsEnd;
    }

    return null;
  }

  static atBlank(src, offset, endAsBlank) {
    const ch = src[offset];
    return ch === '\n' || ch === '\t' || ch === ' ' || endAsBlank && !ch;
  }

  static atCollectionItem(src, offset) {
    const ch = src[offset];
    return (ch === '?' || ch === ':' || ch === '-') && Node.atBlank(src, offset + 1, true);
  }

  static nextNodeIsIndented(ch, indentDiff, indicatorAsIndent) {
    if (!ch || indentDiff < 0) return false;
    if (indentDiff > 0) return true;
    return indicatorAsIndent && ch === '-';
  } // should be at line or string end, or at next non-whitespace char


  static normalizeOffset(src, offset) {
    const ch = src[offset];
    return !ch ? offset : ch !== '\n' && src[offset - 1] === '\n' ? offset - 1 : Node.endOfWhiteSpace(src, offset);
  } // fold single newline into space, multiple newlines to N - 1 newlines
  // presumes src[offset] === '\n'


  static foldNewline(src, offset, indent) {
    let inCount = 0;
    let error = false;
    let fold = '';
    let ch = src[offset + 1];

    while (ch === ' ' || ch === '\t' || ch === '\n') {
      switch (ch) {
        case '\n':
          inCount = 0;
          offset += 1;
          fold += '\n';
          break;

        case '\t':
          if (inCount <= indent) error = true;
          offset = Node.endOfWhiteSpace(src, offset + 2) - 1;
          break;

        case ' ':
          inCount += 1;
          offset += 1;
          break;
      }

      ch = src[offset + 1];
    }

    if (!fold) fold = ' ';
    if (ch && inCount <= indent) error = true;
    return {
      fold,
      offset,
      error
    };
  }

  constructor(type, props, context) {
    this.context = context || null;
    this.error = null;
    this.range = null;
    this.valueRange = null;
    this.props = props || [];
    this.type = type;
    this.value = null;
  }

  getPropValue(idx, key, skipKey) {
    if (!this.context) return null;
    const {
      src
    } = this.context;
    const prop = this.props[idx];
    return prop && src[prop.start] === key ? src.slice(prop.start + (skipKey ? 1 : 0), prop.end) : null;
  }

  get anchor() {
    for (let i = 0; i < this.props.length; ++i) {
      const anchor = this.getPropValue(i, _constants.Char.ANCHOR, true);
      if (anchor != null) return anchor;
    }

    return null;
  }

  get comment() {
    const comments = [];

    for (let i = 0; i < this.props.length; ++i) {
      const comment = this.getPropValue(i, _constants.Char.COMMENT, true);
      if (comment != null) comments.push(comment);
    }

    return comments.length > 0 ? comments.join('\n') : null;
  }

  commentHasRequiredWhitespace(start) {
    const {
      src
    } = this.context;
    if (this.header && start === this.header.end) return false;
    if (!this.valueRange) return false;
    const {
      end
    } = this.valueRange;
    return start !== end || Node.atBlank(src, end - 1);
  }

  get hasComment() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] === _constants.Char.COMMENT) return true;
      }
    }

    return false;
  }

  get hasProps() {
    if (this.context) {
      const {
        src
      } = this.context;

      for (let i = 0; i < this.props.length; ++i) {
        if (src[this.props[i].start] !== _constants.Char.COMMENT) return true;
      }
    }

    return false;
  }

  get includesTrailingLines() {
    return false;
  }

  get jsonLike() {
    const jsonLikeTypes = [_constants.Type.FLOW_MAP, _constants.Type.FLOW_SEQ, _constants.Type.QUOTE_DOUBLE, _constants.Type.QUOTE_SINGLE];
    return jsonLikeTypes.indexOf(this.type) !== -1;
  }

  get rangeAsLinePos() {
    if (!this.range || !this.context) return undefined;
    const start = (0, _getLinePos.default)(this.range.start, this.context.root);
    if (!start) return undefined;
    const end = (0, _getLinePos.default)(this.range.end, this.context.root);
    return {
      start,
      end
    };
  }

  get rawValue() {
    if (!this.valueRange || !this.context) return null;
    const {
      start,
      end
    } = this.valueRange;
    return this.context.src.slice(start, end);
  }

  get tag() {
    for (let i = 0; i < this.props.length; ++i) {
      const tag = this.getPropValue(i, _constants.Char.TAG, false);

      if (tag != null) {
        if (tag[1] === '<') {
          return {
            verbatim: tag.slice(2, -1)
          };
        } else {
          // eslint-disable-next-line no-unused-vars
          const [_, handle, suffix] = tag.match(/^(.*!)([^!]*)$/);
          return {
            handle,
            suffix
          };
        }
      }
    }

    return null;
  }

  get valueRangeContainsNewline() {
    if (!this.valueRange || !this.context) return false;
    const {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;

    for (let i = start; i < end; ++i) {
      if (src[i] === '\n') return true;
    }

    return false;
  }

  parseComment(start) {
    const {
      src
    } = this.context;

    if (src[start] === _constants.Char.COMMENT) {
      const end = Node.endOfLine(src, start + 1);
      const commentRange = new _Range.default(start, end);
      this.props.push(commentRange);
      return end;
    }

    return start;
  }
  /**
   * Populates the `origStart` and `origEnd` values of all ranges for this
   * node. Extended by child classes to handle descendant nodes.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRanges(cr, offset) {
    if (this.range) offset = this.range.setOrigRange(cr, offset);
    if (this.valueRange) this.valueRange.setOrigRange(cr, offset);
    this.props.forEach(prop => prop.setOrigRange(cr, offset));
    return offset;
  }

  toString() {
    const {
      context: {
        src
      },
      range,
      value
    } = this;
    if (value != null) return value;
    const str = src.slice(range.start, range.end);
    return Node.addStringTerminator(src, range.end, str);
  }

}

exports.default = Node;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/ParseContext.js":
/*!****************************************************!*\
  !*** ./node_modules/yaml/dist/cst/ParseContext.js ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _Alias = _interopRequireDefault(__webpack_require__(/*! ./Alias */ "./node_modules/yaml/dist/cst/Alias.js"));

var _BlockValue = _interopRequireDefault(__webpack_require__(/*! ./BlockValue */ "./node_modules/yaml/dist/cst/BlockValue.js"));

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/cst/Collection.js"));

var _CollectionItem = _interopRequireDefault(__webpack_require__(/*! ./CollectionItem */ "./node_modules/yaml/dist/cst/CollectionItem.js"));

var _FlowCollection = _interopRequireDefault(__webpack_require__(/*! ./FlowCollection */ "./node_modules/yaml/dist/cst/FlowCollection.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _PlainValue = _interopRequireDefault(__webpack_require__(/*! ./PlainValue */ "./node_modules/yaml/dist/cst/PlainValue.js"));

var _QuoteDouble = _interopRequireDefault(__webpack_require__(/*! ./QuoteDouble */ "./node_modules/yaml/dist/cst/QuoteDouble.js"));

var _QuoteSingle = _interopRequireDefault(__webpack_require__(/*! ./QuoteSingle */ "./node_modules/yaml/dist/cst/QuoteSingle.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

/**
 * @param {boolean} atLineStart - Node starts at beginning of line
 * @param {boolean} inFlow - true if currently in a flow context
 * @param {boolean} inCollection - true if currently in a collection context
 * @param {number} indent - Current level of indentation
 * @param {number} lineStart - Start of the current line
 * @param {Node} parent - The parent of the node
 * @param {string} src - Source of the YAML document
 */
class ParseContext {
  static parseType(src, offset, inFlow) {
    switch (src[offset]) {
      case '*':
        return _constants.Type.ALIAS;

      case '>':
        return _constants.Type.BLOCK_FOLDED;

      case '|':
        return _constants.Type.BLOCK_LITERAL;

      case '{':
        return _constants.Type.FLOW_MAP;

      case '[':
        return _constants.Type.FLOW_SEQ;

      case '?':
        return !inFlow && _Node.default.atBlank(src, offset + 1, true) ? _constants.Type.MAP_KEY : _constants.Type.PLAIN;

      case ':':
        return !inFlow && _Node.default.atBlank(src, offset + 1, true) ? _constants.Type.MAP_VALUE : _constants.Type.PLAIN;

      case '-':
        return !inFlow && _Node.default.atBlank(src, offset + 1, true) ? _constants.Type.SEQ_ITEM : _constants.Type.PLAIN;

      case '"':
        return _constants.Type.QUOTE_DOUBLE;

      case "'":
        return _constants.Type.QUOTE_SINGLE;

      default:
        return _constants.Type.PLAIN;
    }
  }

  constructor(orig = {}, {
    atLineStart,
    inCollection,
    inFlow,
    indent,
    lineStart,
    parent
  } = {}) {
    _defineProperty(this, "parseNode", (overlay, start) => {
      if (_Node.default.atDocumentBoundary(this.src, start)) return null;
      const context = new ParseContext(this, overlay);
      const {
        props,
        type,
        valueStart
      } = context.parseProps(start);
      let node;

      switch (type) {
        case _constants.Type.ALIAS:
          node = new _Alias.default(type, props);
          break;

        case _constants.Type.BLOCK_FOLDED:
        case _constants.Type.BLOCK_LITERAL:
          node = new _BlockValue.default(type, props);
          break;

        case _constants.Type.FLOW_MAP:
        case _constants.Type.FLOW_SEQ:
          node = new _FlowCollection.default(type, props);
          break;

        case _constants.Type.MAP_KEY:
        case _constants.Type.MAP_VALUE:
        case _constants.Type.SEQ_ITEM:
          node = new _CollectionItem.default(type, props);
          break;

        case _constants.Type.COMMENT:
        case _constants.Type.PLAIN:
          node = new _PlainValue.default(type, props);
          break;

        case _constants.Type.QUOTE_DOUBLE:
          node = new _QuoteDouble.default(type, props);
          break;

        case _constants.Type.QUOTE_SINGLE:
          node = new _QuoteSingle.default(type, props);
          break;

        default:
          node.error = new _errors.YAMLSyntaxError(node, `Unknown node type: ${JSON.stringify(type)}`);
          node.range = new _Range.default(start, start + 1);
          return node;
      }

      let offset = node.parse(context, valueStart);
      node.range = new _Range.default(start, offset);

      if (offset <= start) {
        node.error = new Error(`Node#parse consumed no characters`);
        node.error.parseEnd = offset;
        node.error.source = node;
        node.range.end = start + 1;
      }

      if (context.nodeStartsCollection(node)) {
        if (!node.error && !context.atLineStart && context.parent.type === _constants.Type.DOCUMENT) {
          node.error = new _errors.YAMLSyntaxError(node, 'Block collection must not have preceding content here (e.g. directives-end indicator)');
        }

        const collection = new _Collection.default(node);
        offset = collection.parse(new ParseContext(context), offset);
        collection.range = new _Range.default(start, offset);
        return collection;
      }

      return node;
    });

    this.atLineStart = atLineStart != null ? atLineStart : orig.atLineStart || false;
    this.inCollection = inCollection != null ? inCollection : orig.inCollection || false;
    this.inFlow = inFlow != null ? inFlow : orig.inFlow || false;
    this.indent = indent != null ? indent : orig.indent;
    this.lineStart = lineStart != null ? lineStart : orig.lineStart;
    this.parent = parent != null ? parent : orig.parent || {};
    this.root = orig.root;
    this.src = orig.src;
  } // for logging


  get pretty() {
    const obj = {
      start: `${this.lineStart} + ${this.indent}`,
      in: [],
      parent: this.parent.type
    };
    if (!this.atLineStart) obj.start += ' + N';
    if (this.inCollection) obj.in.push('collection');
    if (this.inFlow) obj.in.push('flow');
    return obj;
  }

  nodeStartsCollection(node) {
    const {
      inCollection,
      inFlow,
      src
    } = this;
    if (inCollection || inFlow) return false;
    if (node instanceof _CollectionItem.default) return true; // check for implicit key

    let offset = node.range.end;
    if (src[offset] === '\n' || src[offset - 1] === '\n') return false;
    offset = _Node.default.endOfWhiteSpace(src, offset);
    return src[offset] === ':';
  } // Anchor and tag are before type, which determines the node implementation
  // class; hence this intermediate step.


  parseProps(offset) {
    const {
      inFlow,
      parent,
      src
    } = this;
    const props = [];
    let lineHasProps = false;
    offset = _Node.default.endOfWhiteSpace(src, offset);
    let ch = src[offset];

    while (ch === _constants.Char.ANCHOR || ch === _constants.Char.COMMENT || ch === _constants.Char.TAG || ch === '\n') {
      if (ch === '\n') {
        const lineStart = offset + 1;

        const inEnd = _Node.default.endOfIndent(src, lineStart);

        const indentDiff = inEnd - (lineStart + this.indent);
        const noIndicatorAsIndent = parent.type === _constants.Type.SEQ_ITEM && parent.context.atLineStart;
        if (!_Node.default.nextNodeIsIndented(src[inEnd], indentDiff, !noIndicatorAsIndent)) break;
        this.atLineStart = true;
        this.lineStart = lineStart;
        lineHasProps = false;
        offset = inEnd;
      } else if (ch === _constants.Char.COMMENT) {
        const end = _Node.default.endOfLine(src, offset + 1);

        props.push(new _Range.default(offset, end));
        offset = end;
      } else {
        let end = _Node.default.endOfIdentifier(src, offset + 1);

        if (ch === _constants.Char.TAG && src[end] === ',' && /^[a-zA-Z0-9-]+\.[a-zA-Z0-9-]+,\d\d\d\d(-\d\d){0,2}\/\S/.test(src.slice(offset + 1, end + 13))) {
          // Let's presume we're dealing with a YAML 1.0 domain tag here, rather
          // than an empty but 'foo.bar' private-tagged node in a flow collection
          // followed without whitespace by a plain string starting with a year
          // or date divided by something.
          end = _Node.default.endOfIdentifier(src, end + 5);
        }

        props.push(new _Range.default(offset, end));
        lineHasProps = true;
        offset = _Node.default.endOfWhiteSpace(src, end);
      }

      ch = src[offset];
    } // '- &a : b' has an anchor on an empty node


    if (lineHasProps && ch === ':' && _Node.default.atBlank(src, offset + 1, true)) offset -= 1;
    const type = ParseContext.parseType(src, offset, inFlow);
    return {
      props,
      type,
      valueStart: offset
    };
  }
  /**
   * Parses a node from the source
   * @param {ParseContext} overlay
   * @param {number} start - Index of first non-whitespace character for the node
   * @returns {?Node} - null if at a document boundary
   */


}

exports.default = ParseContext;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/PlainValue.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/cst/PlainValue.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PlainValue extends _Node.default {
  static endOfLine(src, start, inFlow) {
    let ch = src[start];
    let offset = start;

    while (ch && ch !== '\n') {
      if (inFlow && (ch === '[' || ch === ']' || ch === '{' || ch === '}' || ch === ',')) break;
      const next = src[offset + 1];
      if (ch === ':' && (next === '\n' || next === '\t' || next === ' ' || inFlow && next === ',')) break;
      if ((ch === ' ' || ch === '\t') && next === '#') break;
      offset += 1;
      ch = next;
    }

    return offset;
  }

  get strValue() {
    if (!this.valueRange || !this.context) return null;
    let {
      start,
      end
    } = this.valueRange;
    const {
      src
    } = this.context;
    let ch = src[end - 1];

    while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[--end - 1];

    ch = src[start];

    while (start < end && (ch === '\n' || ch === '\t' || ch === ' ')) ch = src[++start];

    let str = '';

    for (let i = start; i < end; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        const {
          fold,
          offset
        } = _Node.default.foldNewline(src, i, -1);

        str += fold;
        i = offset;
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (i < end && (next === ' ' || next === '\t')) {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return str;
  }

  parseBlockValue(start) {
    const {
      indent,
      inFlow,
      src
    } = this.context;
    let offset = start;
    let valueEnd = start;

    for (let ch = src[offset]; ch === '\n'; ch = src[offset]) {
      if (_Node.default.atDocumentBoundary(src, offset + 1)) break;

      const end = _Node.default.endOfBlockIndent(src, indent, offset + 1);

      if (end === null || src[end] === '#') break;

      if (src[end] === '\n') {
        offset = end;
      } else {
        valueEnd = PlainValue.endOfLine(src, end, inFlow);
        offset = valueEnd;
      }
    }

    if (this.valueRange.isEmpty()) this.valueRange.start = start;
    this.valueRange.end = valueEnd;
    return valueEnd;
  }
  /**
   * Parses a plain value from the source
   *
   * Accepted forms are:
   * ```
   * #comment
   *
   * first line
   *
   * first line #comment
   *
   * first line
   * block
   * lines
   *
   * #comment
   * block
   * lines
   * ```
   * where block lines are empty or have an indent level greater than `indent`.
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar, may be `\n`
   */


  parse(context, start) {
    this.context = context;
    const {
      inFlow,
      src
    } = context;
    let offset = start;
    const ch = src[offset];

    if (ch && ch !== '#' && ch !== '\n') {
      offset = PlainValue.endOfLine(src, start, inFlow);
    }

    this.valueRange = new _Range.default(start, offset);
    offset = _Node.default.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);

    if (!this.hasComment || this.valueRange.isEmpty()) {
      offset = this.parseBlockValue(offset);
    }

    return offset;
  }

}

exports.default = PlainValue;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/QuoteDouble.js":
/*!***************************************************!*\
  !*** ./node_modules/yaml/dist/cst/QuoteDouble.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QuoteDouble extends _Node.default {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch && ch !== '"') {
      offset += ch === '\\' ? 2 : 1;
      ch = src[offset];
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== '"') errors.push(new _errors.YAMLSyntaxError(this, 'Missing closing "quote')); // Using String#replace is too painful with escaped newlines preceded by
    // escaped backslashes; also, this should be faster.

    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (_Node.default.atDocumentBoundary(src, i + 1)) errors.push(new _errors.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));

        const {
          fold,
          offset,
          error
        } = _Node.default.foldNewline(src, i, indent);

        str += fold;
        i = offset;
        if (error) errors.push(new _errors.YAMLSemanticError(this, 'Multi-line double-quoted string needs to be sufficiently indented'));
      } else if (ch === '\\') {
        i += 1;

        switch (src[i]) {
          case '0':
            str += '\0';
            break;
          // null character

          case 'a':
            str += '\x07';
            break;
          // bell character

          case 'b':
            str += '\b';
            break;
          // backspace

          case 'e':
            str += '\x1b';
            break;
          // escape character

          case 'f':
            str += '\f';
            break;
          // form feed

          case 'n':
            str += '\n';
            break;
          // line feed

          case 'r':
            str += '\r';
            break;
          // carriage return

          case 't':
            str += '\t';
            break;
          // horizontal tab

          case 'v':
            str += '\v';
            break;
          // vertical tab

          case 'N':
            str += '\u0085';
            break;
          // Unicode next line

          case '_':
            str += '\u00a0';
            break;
          // Unicode non-breaking space

          case 'L':
            str += '\u2028';
            break;
          // Unicode line separator

          case 'P':
            str += '\u2029';
            break;
          // Unicode paragraph separator

          case ' ':
            str += ' ';
            break;

          case '"':
            str += '"';
            break;

          case '/':
            str += '/';
            break;

          case '\\':
            str += '\\';
            break;

          case '\t':
            str += '\t';
            break;

          case 'x':
            str += this.parseCharCode(i + 1, 2, errors);
            i += 2;
            break;

          case 'u':
            str += this.parseCharCode(i + 1, 4, errors);
            i += 4;
            break;

          case 'U':
            str += this.parseCharCode(i + 1, 8, errors);
            i += 8;
            break;

          case '\n':
            // skip escaped newlines, but still trim the following line
            while (src[i + 1] === ' ' || src[i + 1] === '\t') i += 1;

            break;

          default:
            errors.push(new _errors.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(i - 1, 2)}`));
            str += '\\' + src[i];
        }
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }

  parseCharCode(offset, length, errors) {
    const {
      src
    } = this.context;
    const cc = src.substr(offset, length);
    const ok = cc.length === length && /^[0-9a-fA-F]+$/.test(cc);
    const code = ok ? parseInt(cc, 16) : NaN;

    if (isNaN(code)) {
      errors.push(new _errors.YAMLSyntaxError(this, `Invalid escape sequence ${src.substr(offset - 2, length + 2)}`));
      return src.substr(offset - 2, length + 2);
    }

    return String.fromCodePoint(code);
  }
  /**
   * Parses a "double quoted" value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteDouble.endOfQuote(src, start + 1);
    this.valueRange = new _Range.default(start, offset);
    offset = _Node.default.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.default = QuoteDouble;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/QuoteSingle.js":
/*!***************************************************!*\
  !*** ./node_modules/yaml/dist/cst/QuoteSingle.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/cst/Node.js"));

var _Range = _interopRequireDefault(__webpack_require__(/*! ./Range */ "./node_modules/yaml/dist/cst/Range.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class QuoteSingle extends _Node.default {
  static endOfQuote(src, offset) {
    let ch = src[offset];

    while (ch) {
      if (ch === "'") {
        if (src[offset + 1] !== "'") break;
        ch = src[offset += 2];
      } else {
        ch = src[offset += 1];
      }
    }

    return offset + 1;
  }
  /**
   * @returns {string | { str: string, errors: YAMLSyntaxError[] }}
   */


  get strValue() {
    if (!this.valueRange || !this.context) return null;
    const errors = [];
    const {
      start,
      end
    } = this.valueRange;
    const {
      indent,
      src
    } = this.context;
    if (src[end - 1] !== "'") errors.push(new _errors.YAMLSyntaxError(this, "Missing closing 'quote"));
    let str = '';

    for (let i = start + 1; i < end - 1; ++i) {
      const ch = src[i];

      if (ch === '\n') {
        if (_Node.default.atDocumentBoundary(src, i + 1)) errors.push(new _errors.YAMLSemanticError(this, 'Document boundary indicators are not allowed within string values'));

        const {
          fold,
          offset,
          error
        } = _Node.default.foldNewline(src, i, indent);

        str += fold;
        i = offset;
        if (error) errors.push(new _errors.YAMLSemanticError(this, 'Multi-line single-quoted string needs to be sufficiently indented'));
      } else if (ch === "'") {
        str += ch;
        i += 1;
        if (src[i] !== "'") errors.push(new _errors.YAMLSyntaxError(this, 'Unescaped single quote? This should not happen.'));
      } else if (ch === ' ' || ch === '\t') {
        // trim trailing whitespace
        const wsStart = i;
        let next = src[i + 1];

        while (next === ' ' || next === '\t') {
          i += 1;
          next = src[i + 1];
        }

        if (next !== '\n') str += i > wsStart ? src.slice(wsStart, i + 1) : ch;
      } else {
        str += ch;
      }
    }

    return errors.length > 0 ? {
      errors,
      str
    } : str;
  }
  /**
   * Parses a 'single quoted' value from the source
   *
   * @param {ParseContext} context
   * @param {number} start - Index of first character
   * @returns {number} - Index of the character after this scalar
   */


  parse(context, start) {
    this.context = context;
    const {
      src
    } = context;
    let offset = QuoteSingle.endOfQuote(src, start + 1);
    this.valueRange = new _Range.default(start, offset);
    offset = _Node.default.endOfWhiteSpace(src, offset);
    offset = this.parseComment(offset);
    return offset;
  }

}

exports.default = QuoteSingle;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/Range.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/cst/Range.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Range {
  static copy(orig) {
    return new Range(orig.start, orig.end);
  }

  constructor(start, end) {
    this.start = start;
    this.end = end || start;
  }

  isEmpty() {
    return typeof this.start !== 'number' || !this.end || this.end <= this.start;
  }
  /**
   * Set `origStart` and `origEnd` to point to the original source range for
   * this node, which may differ due to dropped CR characters.
   *
   * @param {number[]} cr - Positions of dropped CR characters
   * @param {number} offset - Starting index of `cr` from the last call
   * @returns {number} - The next offset, matching the one found for `origStart`
   */


  setOrigRange(cr, offset) {
    const {
      start,
      end
    } = this;

    if (cr.length === 0 || end <= cr[0]) {
      this.origStart = start;
      this.origEnd = end;
      return offset;
    }

    let i = offset;

    while (i < cr.length) {
      if (cr[i] > start) break;else ++i;
    }

    this.origStart = start + i;
    const nextOffset = i;

    while (i < cr.length) {
      // if end was at \n, it should now be at \r
      if (cr[i] >= end) break;else ++i;
    }

    this.origEnd = end + i;
    return nextOffset;
  }

}

exports.default = Range;

/***/ }),

/***/ "./node_modules/yaml/dist/cst/getLinePos.js":
/*!**************************************************!*\
  !*** ./node_modules/yaml/dist/cst/getLinePos.js ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getLinePos;

function findLineStarts(src) {
  const ls = [0];
  let offset = src.indexOf('\n');

  while (offset !== -1) {
    offset += 1;
    ls.push(offset);
    offset = src.indexOf('\n', offset);
  }

  return ls;
}
/**
 * Determine the line/col position matching a character offset.
 *
 * Accepts a source string or a CST document as the second parameter. With
 * the latter, starting indices for lines are cached in the document as
 * `lineStarts: number[]`.
 *
 * Returns a one-indexed `{ line, col }` location if found, or
 * `undefined` otherwise.
 *
 * @param {number} offset
 * @param {string|Document|Document[]} cst
 * @returns {{ line: number, col: number }|undefined}
 */


function getLinePos(offset, cst) {
  if (typeof offset === 'number' && offset >= 0) {
    let lineStarts, srcLength;

    if (typeof cst === 'string') {
      lineStarts = findLineStarts(cst);
      srcLength = cst.length;
    } else {
      if (Array.isArray(cst)) cst = cst[0];

      if (cst) {
        if (!cst.lineStarts) cst.lineStarts = findLineStarts(cst.context.src);
        lineStarts = cst.lineStarts;
        srcLength = cst.context.src.length;
      }
    }

    if (lineStarts && offset <= srcLength) {
      for (let i = 0; i < lineStarts.length; ++i) {
        const start = lineStarts[i];

        if (offset < start) {
          return {
            line: i,
            col: offset - lineStarts[i - 1] + 1
          };
        }

        if (offset === start) return {
          line: i + 1,
          col: 1
        };
      }

      const line = lineStarts.length;
      return {
        line,
        col: offset - lineStarts[line - 1] + 1
      };
    }
  }

  return undefined;
}

/***/ }),

/***/ "./node_modules/yaml/dist/cst/parse.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/cst/parse.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parse;

var _Document = _interopRequireDefault(__webpack_require__(/*! ./Document */ "./node_modules/yaml/dist/cst/Document.js"));

var _ParseContext = _interopRequireDefault(__webpack_require__(/*! ./ParseContext */ "./node_modules/yaml/dist/cst/ParseContext.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Published as 'yaml/parse-cst'
function parse(src) {
  const cr = [];

  if (src.indexOf('\r') !== -1) {
    src = src.replace(/\r\n?/g, (match, offset) => {
      if (match.length > 1) cr.push(offset);
      return '\n';
    });
  }

  const documents = [];
  let offset = 0;

  do {
    const doc = new _Document.default();
    const context = new _ParseContext.default({
      src
    });
    offset = doc.parse(context, offset);
    documents.push(doc);
  } while (offset < src.length);

  documents.setOrigRanges = () => {
    if (cr.length === 0) return false;

    for (let i = 1; i < cr.length; ++i) cr[i] -= i;

    let crOffset = 0;

    for (let i = 0; i < documents.length; ++i) {
      crOffset = documents[i].setOrigRanges(cr, crOffset);
    }

    cr.splice(0, cr.length);
    return true;
  };

  documents.toString = () => documents.join('...\n');

  return documents;
}

/***/ }),

/***/ "./node_modules/yaml/dist/deprecation.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/deprecation.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.warnFileDeprecation = warnFileDeprecation;
exports.warnOptionDeprecation = warnOptionDeprecation;

/* global global, console */
function warn(msg) {
  if (global && global.process && global.process.emitWarning) {
    global.process.emitWarning(msg, 'DeprecationWarning');
  } else {
    // eslint-disable-next-line no-console
    console.warn(`DeprecationWarning: ${msg}`);
  }
}

function warnFileDeprecation(filename) {
  if (global && global._YAML_SILENCE_DEPRECATION_WARNINGS) return;
  const path = filename.replace(/.*yaml[/\\]/i, '').replace(/\.js$/, '').replace(/\\/g, '/');
  warn(`The endpoint 'yaml/${path}' will be removed in a future release.`);
}

const warned = {};

function warnOptionDeprecation(name, alternative) {
  if (global && global._YAML_SILENCE_DEPRECATION_WARNINGS) return;
  if (warned[name]) return;
  warned[name] = true;
  let msg = `The option '${name}' will be removed in a future release`;
  msg += alternative ? `, use '${alternative}' instead.` : '.';
  warn(msg);
}

/***/ }),

/***/ "./node_modules/yaml/dist/errors.js":
/*!******************************************!*\
  !*** ./node_modules/yaml/dist/errors.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YAMLWarning = exports.YAMLSyntaxError = exports.YAMLSemanticError = exports.YAMLReferenceError = exports.YAMLError = void 0;

var _Node = _interopRequireDefault(__webpack_require__(/*! ./cst/Node */ "./node_modules/yaml/dist/cst/Node.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class YAMLError extends Error {
  constructor(name, source, message) {
    if (!message || !(source instanceof _Node.default)) throw new Error(`Invalid arguments for new ${name}`);
    super();
    this.name = name;
    this.message = message;
    this.source = source;
  }

  makePretty() {
    if (this.source) {
      this.nodeType = this.source.type;
      this.range = this.source.range;
      this.linePos = this.source.rangeAsLinePos;
      delete this.source;
    }
  }

}

exports.YAMLError = YAMLError;

class YAMLReferenceError extends YAMLError {
  constructor(source, message) {
    super('YAMLReferenceError', source, message);
  }

}

exports.YAMLReferenceError = YAMLReferenceError;

class YAMLSemanticError extends YAMLError {
  constructor(source, message) {
    super('YAMLSemanticError', source, message);
  }

}

exports.YAMLSemanticError = YAMLSemanticError;

class YAMLSyntaxError extends YAMLError {
  constructor(source, message) {
    super('YAMLSyntaxError', source, message);
  }

}

exports.YAMLSyntaxError = YAMLSyntaxError;

class YAMLWarning extends YAMLError {
  constructor(source, message) {
    super('YAMLWarning', source, message);
  }

}

exports.YAMLWarning = YAMLWarning;

/***/ }),

/***/ "./node_modules/yaml/dist/foldFlowLines.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/foldFlowLines.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = foldFlowLines;
exports.FOLD_QUOTED = exports.FOLD_BLOCK = exports.FOLD_FLOW = void 0;
const FOLD_FLOW = 'flow';
exports.FOLD_FLOW = FOLD_FLOW;
const FOLD_BLOCK = 'block';
exports.FOLD_BLOCK = FOLD_BLOCK;
const FOLD_QUOTED = 'quoted'; // presumes i+1 is at the start of a line
// returns index of last newline in more-indented block

exports.FOLD_QUOTED = FOLD_QUOTED;

const consumeMoreIndentedLines = (text, i) => {
  let ch = text[i + 1];

  while (ch === ' ' || ch === '\t') {
    do {
      ch = text[i += 1];
    } while (ch && ch !== '\n');

    ch = text[i + 1];
  }

  return i;
};
/**
 * Tries to keep input at up to `lineWidth` characters, splitting only on spaces
 * not followed by newlines or spaces unless `mode` is `'quoted'`. Lines are
 * terminated with `\n` and started with `indent`.
 *
 * @param {string} text
 * @param {string} indent
 * @param {string} [mode='flow'] `'block'` prevents more-indented lines
 *   from being folded; `'quoted'` allows for `\` escapes, including escaped
 *   newlines
 * @param {Object} options
 * @param {number} [options.indentAtStart] Accounts for leading contents on
 *   the first line, defaulting to `indent.length`
 * @param {number} [options.lineWidth=80]
 * @param {number} [options.minContentWidth=20] Allow highly indented lines to
 *   stretch the line width
 * @param {function} options.onFold Called once if the text is folded
 * @param {function} options.onFold Called once if any line of text exceeds
 *   lineWidth characters
 */


function foldFlowLines(text, indent, mode, {
  indentAtStart,
  lineWidth = 80,
  minContentWidth = 20,
  onFold,
  onOverflow
}) {
  if (!lineWidth || lineWidth < 0) return text;
  const endStep = Math.max(1 + minContentWidth, 1 + lineWidth - indent.length);
  if (text.length <= endStep) return text;
  const folds = [];
  const escapedFolds = {};
  let end = lineWidth - (typeof indentAtStart === 'number' ? indentAtStart : indent.length);
  let split = undefined;
  let prev = undefined;
  let overflow = false;
  let i = -1;

  if (mode === FOLD_BLOCK) {
    i = consumeMoreIndentedLines(text, i);
    if (i !== -1) end = i + endStep;
  }

  for (let ch; ch = text[i += 1];) {
    if (mode === FOLD_QUOTED && ch === '\\') {
      switch (text[i + 1]) {
        case 'x':
          i += 3;
          break;

        case 'u':
          i += 5;
          break;

        case 'U':
          i += 9;
          break;

        default:
          i += 1;
      }
    }

    if (ch === '\n') {
      if (mode === FOLD_BLOCK) i = consumeMoreIndentedLines(text, i);
      end = i + endStep;
      split = undefined;
    } else {
      if (ch === ' ' && prev && prev !== ' ' && prev !== '\n' && prev !== '\t') {
        // space surrounded by non-space can be replaced with newline + indent
        const next = text[i + 1];
        if (next && next !== ' ' && next !== '\n' && next !== '\t') split = i;
      }

      if (i >= end) {
        if (split) {
          folds.push(split);
          end = split + endStep;
          split = undefined;
        } else if (mode === FOLD_QUOTED) {
          // white-space collected at end may stretch past lineWidth
          while (prev === ' ' || prev === '\t') {
            prev = ch;
            ch = text[i += 1];
            overflow = true;
          } // i - 2 accounts for not-dropped last char + newline-escaping \


          folds.push(i - 2);
          escapedFolds[i - 2] = true;
          end = i - 2 + endStep;
          split = undefined;
        } else {
          overflow = true;
        }
      }
    }

    prev = ch;
  }

  if (overflow && onOverflow) onOverflow();
  if (folds.length === 0) return text;
  if (onFold) onFold();
  let res = text.slice(0, folds[0]);

  for (let i = 0; i < folds.length; ++i) {
    const fold = folds[i];
    const end = folds[i + 1] || text.length;
    if (mode === FOLD_QUOTED && escapedFolds[fold]) res += `${text[fold]}\\`;
    res += `\n${indent}${text.slice(fold + 1, end)}`;
  }

  return res;
}

/***/ }),

/***/ "./node_modules/yaml/dist/index.js":
/*!*****************************************!*\
  !*** ./node_modules/yaml/dist/index.js ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parse = _interopRequireDefault(__webpack_require__(/*! ./cst/parse */ "./node_modules/yaml/dist/cst/parse.js"));

var _Document = _interopRequireDefault(__webpack_require__(/*! ./Document */ "./node_modules/yaml/dist/Document.js"));

var _errors = __webpack_require__(/*! ./errors */ "./node_modules/yaml/dist/errors.js");

var _schema = _interopRequireDefault(__webpack_require__(/*! ./schema */ "./node_modules/yaml/dist/schema/index.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* global console */
const defaultOptions = {
  anchorPrefix: 'a',
  customTags: null,
  keepCstNodes: false,
  keepNodeTypes: true,
  keepBlobsInJSON: true,
  mapAsMap: false,
  maxAliasCount: 100,
  prettyErrors: false,
  // TODO Set true in v2
  version: '1.2'
};

function createNode(value, wrapScalars = true, tag) {
  if (tag === undefined && typeof wrapScalars === 'string') {
    tag = wrapScalars;
    wrapScalars = true;
  }

  const options = Object.assign({}, _Document.default.defaults[defaultOptions.version], defaultOptions);
  const schema = new _schema.default(options);
  return schema.createNode(value, wrapScalars, tag);
}

class Document extends _Document.default {
  constructor(options) {
    super(Object.assign({}, defaultOptions, options));
  }

}

function parseAllDocuments(src, options) {
  const stream = [];
  let prev;

  for (const cstDoc of (0, _parse.default)(src)) {
    const doc = new Document(options);
    doc.parse(cstDoc, prev);
    stream.push(doc);
    prev = doc;
  }

  return stream;
}

function parseDocument(src, options) {
  const cst = (0, _parse.default)(src);
  const doc = new Document(options).parse(cst[0]);

  if (cst.length > 1) {
    const errMsg = 'Source contains multiple documents; please use YAML.parseAllDocuments()';
    doc.errors.unshift(new _errors.YAMLSemanticError(cst[1], errMsg));
  }

  return doc;
}

function parse(src, options) {
  const doc = parseDocument(src, options); // eslint-disable-next-line no-console

  doc.warnings.forEach(warning => console.warn(warning));
  if (doc.errors.length > 0) throw doc.errors[0];
  return doc.toJSON();
}

function stringify(value, options) {
  const doc = new Document(options);
  doc.contents = value;
  return String(doc);
}

var _default = {
  createNode,
  defaultOptions,
  Document,
  parse,
  parseAllDocuments,
  parseCST: _parse.default,
  parseDocument,
  stringify
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/listTagNames.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/listTagNames.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./schema/Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./schema/Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const visit = (node, tags) => {
  if (node && typeof node === 'object') {
    const {
      tag
    } = node;

    if (node instanceof _Collection.default) {
      if (tag) tags[tag] = true;
      node.items.forEach(n => visit(n, tags));
    } else if (node instanceof _Pair.default) {
      visit(node.key, tags);
      visit(node.value, tags);
    } else if (node instanceof _Scalar.default) {
      if (tag) tags[tag] = true;
    }
  }

  return tags;
};

var _default = node => Object.keys(visit(node, {}));

exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Alias.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/schema/Alias.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _toJSON = _interopRequireDefault(__webpack_require__(/*! ../toJSON */ "./node_modules/yaml/dist/toJSON.js"));

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/schema/Node.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const getAliasCount = (node, anchors) => {
  if (node instanceof Alias) {
    const anchor = anchors.find(a => a.node === node.source);
    return anchor.count * anchor.aliasCount;
  } else if (node instanceof _Collection.default) {
    let count = 0;

    for (const item of node.items) {
      const c = getAliasCount(item, anchors);
      if (c > count) count = c;
    }

    return count;
  } else if (node instanceof _Pair.default) {
    const kc = getAliasCount(node.key, anchors);
    const vc = getAliasCount(node.value, anchors);
    return Math.max(kc, vc);
  }

  return 1;
};

class Alias extends _Node.default {
  static stringify({
    range,
    source
  }, {
    anchors,
    doc,
    implicitKey,
    inStringifyKey
  }) {
    let anchor = Object.keys(anchors).find(a => anchors[a] === source);
    if (!anchor && inStringifyKey) anchor = doc.anchors.getName(source) || doc.anchors.newName();
    if (anchor) return `*${anchor}${implicitKey ? ' ' : ''}`;
    const msg = doc.anchors.getName(source) ? 'Alias node must be after source node' : 'Source node not found for alias node';
    throw new Error(`${msg} [${range}]`);
  }

  constructor(source) {
    super();
    this.source = source;
    this.type = _constants.Type.ALIAS;
  }

  set tag(t) {
    throw new Error('Alias nodes cannot have tags');
  }

  toJSON(arg, ctx) {
    if (!ctx) return (0, _toJSON.default)(this.source, arg, ctx);
    const {
      anchors,
      maxAliasCount
    } = ctx;
    const anchor = anchors.find(a => a.node === this.source);

    if (!anchor || !anchor.res) {
      const msg = 'This should not happen: Alias anchor was not resolved?';
      if (this.cstNode) throw new _errors.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
    }

    if (maxAliasCount >= 0) {
      anchor.count += 1;
      if (anchor.aliasCount === 0) anchor.aliasCount = getAliasCount(this.source, anchors);

      if (anchor.count * anchor.aliasCount > maxAliasCount) {
        const msg = 'Excessive alias count indicates a resource exhaustion attack';
        if (this.cstNode) throw new _errors.YAMLReferenceError(this.cstNode, msg);else throw new ReferenceError(msg);
      }
    }

    return anchor.res;
  } // Only called when stringifying an alias mapping key while constructing
  // Object output.


  toString(ctx) {
    return Alias.stringify(this, ctx);
  }

}

exports.default = Alias;

_defineProperty(Alias, "default", true);

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Collection.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/schema/Collection.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.isEmptyPath = void 0;

var _addComment = _interopRequireDefault(__webpack_require__(/*! ../addComment */ "./node_modules/yaml/dist/addComment.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/schema/Node.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// null, undefined, or an empty non-string iterable (e.g. [])
const isEmptyPath = path => path == null || typeof path === 'object' && path[Symbol.iterator]().next().done;

exports.isEmptyPath = isEmptyPath;

class Collection extends _Node.default {
  constructor(...args) {
    super(...args);

    _defineProperty(this, "items", []);
  }

  addIn(path, value) {
    if (isEmptyPath(path)) this.add(value);else {
      const [key, ...rest] = path;
      const node = this.get(key, true);
      if (node instanceof Collection) node.addIn(rest, value);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  }

  deleteIn([key, ...rest]) {
    if (rest.length === 0) return this.delete(key);
    const node = this.get(key, true);
    if (node instanceof Collection) return node.deleteIn(rest);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
  }

  getIn([key, ...rest], keepScalar) {
    const node = this.get(key, true);
    if (rest.length === 0) return !keepScalar && node instanceof _Scalar.default ? node.value : node;else return node instanceof Collection ? node.getIn(rest, keepScalar) : undefined;
  }

  hasAllNullValues() {
    return this.items.every(node => {
      if (!(node instanceof _Pair.default)) return false;
      const n = node.value;
      return n == null || n instanceof _Scalar.default && n.value == null && !n.commentBefore && !n.comment && !n.tag;
    });
  }

  hasIn([key, ...rest]) {
    if (rest.length === 0) return this.has(key);
    const node = this.get(key, true);
    return node instanceof Collection ? node.hasIn(rest) : false;
  }

  setIn([key, ...rest], value) {
    if (rest.length === 0) {
      this.set(key, value);
    } else {
      const node = this.get(key, true);
      if (node instanceof Collection) node.setIn(rest, value);else throw new Error(`Expected YAML collection at ${key}. Remaining path: ${rest}`);
    }
  } // overridden in implementations


  toJSON() {
    return null;
  }

  toString(ctx, {
    blockItem,
    flowChars,
    isMap,
    itemIndent
  }, onComment, onChompKeep) {
    const {
      doc,
      indent
    } = ctx;
    const inFlow = this.type && this.type.substr(0, 4) === 'FLOW' || ctx.inFlow;
    if (inFlow) itemIndent += '  ';
    const allNullValues = isMap && this.hasAllNullValues();
    ctx = Object.assign({}, ctx, {
      allNullValues,
      indent: itemIndent,
      inFlow,
      type: null
    });
    let chompKeep = false;
    let hasItemWithNewLine = false;
    const nodes = this.items.reduce((nodes, item, i) => {
      let comment;

      if (item) {
        if (!chompKeep && item.spaceBefore) nodes.push({
          type: 'comment',
          str: ''
        });
        if (item.commentBefore) item.commentBefore.match(/^.*$/gm).forEach(line => {
          nodes.push({
            type: 'comment',
            str: `#${line}`
          });
        });
        if (item.comment) comment = item.comment;
        if (inFlow && (!chompKeep && item.spaceBefore || item.commentBefore || item.comment || item.key && (item.key.commentBefore || item.key.comment) || item.value && (item.value.commentBefore || item.value.comment))) hasItemWithNewLine = true;
      }

      chompKeep = false;
      let str = doc.schema.stringify(item, ctx, () => comment = null, () => chompKeep = true);
      if (inFlow && !hasItemWithNewLine && str.includes('\n')) hasItemWithNewLine = true;
      if (inFlow && i < this.items.length - 1) str += ',';
      str = (0, _addComment.default)(str, itemIndent, comment);
      if (chompKeep && (comment || inFlow)) chompKeep = false;
      nodes.push({
        type: 'item',
        str
      });
      return nodes;
    }, []);
    let str;

    if (nodes.length === 0) {
      str = flowChars.start + flowChars.end;
    } else if (inFlow) {
      const {
        start,
        end
      } = flowChars;
      const strings = nodes.map(n => n.str);

      if (hasItemWithNewLine || strings.reduce((sum, str) => sum + str.length + 2, 2) > Collection.maxFlowStringSingleLineLength) {
        str = start;

        for (const s of strings) {
          str += s ? `\n  ${indent}${s}` : '\n';
        }

        str += `\n${indent}${end}`;
      } else {
        str = `${start} ${strings.join(' ')} ${end}`;
      }
    } else {
      const strings = nodes.map(blockItem);
      str = strings.shift();

      for (const s of strings) str += s ? `\n${indent}${s}` : '\n';
    }

    if (this.comment) {
      str += '\n' + this.comment.replace(/^/gm, `${indent}#`);
      if (onComment) onComment();
    } else if (chompKeep && onChompKeep) onChompKeep();

    return str;
  }

}

exports.default = Collection;

_defineProperty(Collection, "maxFlowStringSingleLineLength", 60);

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Map.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/schema/Map.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findPair = findPair;
exports.default = void 0;

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findPair(items, key) {
  const k = key instanceof _Scalar.default ? key.value : key;

  for (const it of items) {
    if (it instanceof _Pair.default) {
      if (it.key === key || it.key === k) return it;
      if (it.key && it.key.value === k) return it;
    }
  }

  return undefined;
}

class YAMLMap extends _Collection.default {
  add(pair) {
    if (!pair) pair = new _Pair.default(pair);else if (!(pair instanceof _Pair.default)) pair = new _Pair.default(pair.key || pair, pair.value);
    const prev = findPair(this.items, pair.key);
    if (prev) throw new Error(`Key ${pair.key} already set`);
    this.items.push(pair);
  }

  delete(key) {
    const it = findPair(this.items, key);
    if (!it) return false;
    const del = this.items.splice(this.items.indexOf(it), 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const it = findPair(this.items, key);
    const node = it && it.value;
    return !keepScalar && node instanceof _Scalar.default ? node.value : node;
  }

  has(key) {
    return !!findPair(this.items, key);
  }

  set(key, value) {
    const prev = findPair(this.items, key);
    if (prev) prev.value = value;else this.items.push(new _Pair.default(key, value));
  }
  /**
   * @param {*} arg ignored
   * @param {*} ctx Conversion context, originally set in Document#toJSON()
   * @param {Class} Type If set, forces the returned collection type
   * @returns {*} Instance of Type, Map, or Object
   */


  toJSON(_, ctx, Type) {
    const map = Type ? new Type() : ctx && ctx.mapAsMap ? new Map() : {};
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const item of this.items) item.addToJSMap(ctx, map);

    return map;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);

    for (const item of this.items) {
      if (!(item instanceof _Pair.default)) throw new Error(`Map items must all be pairs; found ${JSON.stringify(item)} instead`);
    }

    return super.toString(ctx, {
      blockItem: n => n.str,
      flowChars: {
        start: '{',
        end: '}'
      },
      isMap: true,
      itemIndent: ctx.indent || ''
    }, onComment, onChompKeep);
  }

}

exports.default = YAMLMap;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Merge.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/schema/Merge.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.MERGE_KEY = void 0;

var _Map = _interopRequireDefault(__webpack_require__(/*! ./Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _Seq = _interopRequireDefault(__webpack_require__(/*! ./Seq */ "./node_modules/yaml/dist/schema/Seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MERGE_KEY = '<<';
exports.MERGE_KEY = MERGE_KEY;

class Merge extends _Pair.default {
  constructor(pair) {
    if (pair instanceof _Pair.default) {
      let seq = pair.value;

      if (!(seq instanceof _Seq.default)) {
        seq = new _Seq.default();
        seq.items.push(pair.value);
        seq.range = pair.value.range;
      }

      super(pair.key, seq);
      this.range = pair.range;
    } else {
      super(new _Scalar.default(MERGE_KEY), new _Seq.default());
    }

    this.type = 'MERGE_PAIR';
  } // If the value associated with a merge key is a single mapping node, each of
  // its key/value pairs is inserted into the current mapping, unless the key
  // already exists in it. If the value associated with the merge key is a
  // sequence, then this sequence is expected to contain mapping nodes and each
  // of these nodes is merged in turn according to its order in the sequence.
  // Keys in mapping nodes earlier in the sequence override keys specified in
  // later mapping nodes. -- http://yaml.org/type/merge.html


  addToJSMap(ctx, map) {
    for (const _ref of this.value.items) {
      const {
        source
      } = _ref;
      if (!(source instanceof _Map.default)) throw new Error('Merge sources must be maps');
      const srcMap = source.toJSON(null, ctx, Map);

      for (const [key, value] of srcMap) {
        if (map instanceof Map) {
          if (!map.has(key)) map.set(key, value);
        } else if (map instanceof Set) {
          map.add(key);
        } else {
          if (!map.hasOwnProperty(key)) map[key] = value;
        }
      }
    }

    return map;
  }

  toString(ctx, onComment) {
    const seq = this.value;
    if (seq.items.length > 1) return super.toString(ctx, onComment);
    this.value = seq.items[0];
    const str = super.toString(ctx, onComment);
    this.value = seq;
    return str;
  }

}

exports.default = Merge;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Node.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/schema/Node.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

class Node {}

exports.default = Node;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Pair.js":
/*!***********************************************!*\
  !*** ./node_modules/yaml/dist/schema/Pair.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _addComment = _interopRequireDefault(__webpack_require__(/*! ../addComment */ "./node_modules/yaml/dist/addComment.js"));

var _toJSON = _interopRequireDefault(__webpack_require__(/*! ../toJSON */ "./node_modules/yaml/dist/toJSON.js"));

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/schema/Node.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Published as 'yaml/pair'
const stringifyKey = (key, jsKey, ctx) => {
  if (jsKey === null) return '';
  if (typeof jsKey !== 'object') return String(jsKey);
  if (key instanceof _Node.default && ctx && ctx.doc) return key.toString({
    anchors: {},
    doc: ctx.doc,
    indent: '',
    inFlow: true,
    inStringifyKey: true
  });
  return JSON.stringify(jsKey);
};

class Pair extends _Node.default {
  constructor(key, value = null) {
    super();
    this.key = key;
    this.value = value;
    this.type = 'PAIR';
  }

  get commentBefore() {
    return this.key && this.key.commentBefore;
  }

  set commentBefore(cb) {
    if (this.key == null) this.key = new _Scalar.default(null);
    this.key.commentBefore = cb;
  }

  addToJSMap(ctx, map) {
    const key = (0, _toJSON.default)(this.key, '', ctx);

    if (map instanceof Map) {
      const value = (0, _toJSON.default)(this.value, key, ctx);
      map.set(key, value);
    } else if (map instanceof Set) {
      map.add(key);
    } else {
      const stringKey = stringifyKey(this.key, key, ctx);
      map[stringKey] = (0, _toJSON.default)(this.value, stringKey, ctx);
    }

    return map;
  }

  toJSON(_, ctx) {
    const pair = ctx && ctx.mapAsMap ? new Map() : {};
    return this.addToJSMap(ctx, pair);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx || !ctx.doc) return JSON.stringify(this);
    let {
      key,
      value
    } = this;
    let keyComment = key instanceof _Node.default && key.comment;
    const explicitKey = !key || keyComment || key instanceof _Collection.default;
    const {
      doc,
      indent
    } = ctx;
    ctx = Object.assign({}, ctx, {
      implicitKey: !explicitKey,
      indent: indent + '  '
    });
    let chompKeep = false;
    let str = doc.schema.stringify(key, ctx, () => keyComment = null, () => chompKeep = true);
    str = (0, _addComment.default)(str, ctx.indent, keyComment);

    if (ctx.allNullValues) {
      if (this.comment) {
        str = (0, _addComment.default)(str, ctx.indent, this.comment);
        if (onComment) onComment();
      } else if (chompKeep && !keyComment && onChompKeep) onChompKeep();

      return ctx.inFlow ? str : `? ${str}`;
    }

    str = explicitKey ? `? ${str}\n${indent}:` : `${str}:`;

    if (this.comment) {
      // expected (but not strictly required) to be a single-line comment
      str = (0, _addComment.default)(str, ctx.indent, this.comment);
      if (onComment) onComment();
    }

    let vcb = '';
    let valueComment = null;

    if (value instanceof _Node.default) {
      if (value.spaceBefore) vcb = '\n';

      if (value.commentBefore) {
        const cs = value.commentBefore.replace(/^/gm, `${ctx.indent}#`);
        vcb += `\n${cs}`;
      }

      valueComment = value.comment;
    } else if (value && typeof value === 'object') {
      value = doc.schema.createNode(value, true);
    }

    ctx.implicitKey = false;
    chompKeep = false;
    const valueStr = doc.schema.stringify(value, ctx, () => valueComment = null, () => chompKeep = true);
    let ws = ' ';

    if (vcb || this.comment) {
      ws = `${vcb}\n${ctx.indent}`;
    } else if (!explicitKey && value instanceof _Collection.default) {
      const flow = valueStr[0] === '[' || valueStr[0] === '{';
      if (!flow || valueStr.includes('\n')) ws = `\n${ctx.indent}`;
    }

    if (chompKeep && !valueComment && onChompKeep) onChompKeep();
    return (0, _addComment.default)(str + ws + valueStr, ctx.indent, valueComment);
  }

}

exports.default = Pair;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Scalar.js":
/*!*************************************************!*\
  !*** ./node_modules/yaml/dist/schema/Scalar.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toJSON = _interopRequireDefault(__webpack_require__(/*! ../toJSON */ "./node_modules/yaml/dist/toJSON.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/schema/Node.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Published as 'yaml/scalar'
class Scalar extends _Node.default {
  constructor(value) {
    super();
    this.value = value;
  }

  toJSON(arg, ctx) {
    return ctx && ctx.keep ? this.value : (0, _toJSON.default)(this.value, arg, ctx);
  }

  toString() {
    return String(this.value);
  }

}

exports.default = Scalar;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/Seq.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/schema/Seq.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _toJSON = _interopRequireDefault(__webpack_require__(/*! ../toJSON */ "./node_modules/yaml/dist/toJSON.js"));

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Published as 'yaml/seq'
function asItemIndex(key) {
  let idx = key instanceof _Scalar.default ? key.value : key;
  if (idx && typeof idx === 'string') idx = Number(idx);
  return Number.isInteger(idx) && idx >= 0 ? idx : null;
}

class YAMLSeq extends _Collection.default {
  add(value) {
    this.items.push(value);
  }

  delete(key) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return false;
    const del = this.items.splice(idx, 1);
    return del.length > 0;
  }

  get(key, keepScalar) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') return undefined;
    const it = this.items[idx];
    return !keepScalar && it instanceof _Scalar.default ? it.value : it;
  }

  has(key) {
    const idx = asItemIndex(key);
    return typeof idx === 'number' && idx < this.items.length;
  }

  set(key, value) {
    const idx = asItemIndex(key);
    if (typeof idx !== 'number') throw new Error(`Expected a valid index, not ${key}.`);
    this.items[idx] = value;
  }

  toJSON(_, ctx) {
    const seq = [];
    if (ctx && ctx.onCreate) ctx.onCreate(seq);
    let i = 0;

    for (const item of this.items) seq.push((0, _toJSON.default)(item, String(i++), ctx));

    return seq;
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    return super.toString(ctx, {
      blockItem: n => n.type === 'comment' ? n.str : `- ${n.str}`,
      flowChars: {
        start: '[',
        end: ']'
      },
      isMap: false,
      itemIndent: (ctx.indent || '') + '  '
    }, onComment, onChompKeep);
  }

}

exports.default = YAMLSeq;

/***/ }),

/***/ "./node_modules/yaml/dist/schema/index.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/schema/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _deprecation = __webpack_require__(/*! ../deprecation */ "./node_modules/yaml/dist/deprecation.js");

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _stringify = __webpack_require__(/*! ../stringify */ "./node_modules/yaml/dist/stringify.js");

var _tags = __webpack_require__(/*! ../tags */ "./node_modules/yaml/dist/tags/index.js");

var _string = __webpack_require__(/*! ../tags/failsafe/string */ "./node_modules/yaml/dist/tags/failsafe/string.js");

var _Alias = _interopRequireDefault(__webpack_require__(/*! ./Alias */ "./node_modules/yaml/dist/schema/Alias.js"));

var _Collection = _interopRequireDefault(__webpack_require__(/*! ./Collection */ "./node_modules/yaml/dist/schema/Collection.js"));

var _Node = _interopRequireDefault(__webpack_require__(/*! ./Node */ "./node_modules/yaml/dist/schema/Node.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ./Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const isMap = ({
  type
}) => type === _constants.Type.FLOW_MAP || type === _constants.Type.MAP;

const isSeq = ({
  type
}) => type === _constants.Type.FLOW_SEQ || type === _constants.Type.SEQ;

class Schema {
  constructor({
    customTags,
    merge,
    schema,
    tags: deprecatedCustomTags
  }) {
    this.merge = !!merge;
    this.name = schema;
    this.tags = _tags.schemas[schema.replace(/\W/g, '')]; // 'yaml-1.1' -> 'yaml11'

    if (!this.tags) {
      const keys = Object.keys(_tags.schemas).map(key => JSON.stringify(key)).join(', ');
      throw new Error(`Unknown schema "${schema}"; use one of ${keys}`);
    }

    if (!customTags && deprecatedCustomTags) {
      customTags = deprecatedCustomTags;
      (0, _deprecation.warnOptionDeprecation)('tags', 'customTags');
    }

    if (Array.isArray(customTags)) {
      for (const tag of customTags) this.tags = this.tags.concat(tag);
    } else if (typeof customTags === 'function') {
      this.tags = customTags(this.tags.slice());
    }

    for (let i = 0; i < this.tags.length; ++i) {
      const tag = this.tags[i];

      if (typeof tag === 'string') {
        const tagObj = _tags.tags[tag];

        if (!tagObj) {
          const keys = Object.keys(_tags.tags).map(key => JSON.stringify(key)).join(', ');
          throw new Error(`Unknown custom tag "${tag}"; use one of ${keys}`);
        }

        this.tags[i] = tagObj;
      }
    }
  }

  createNode(value, wrapScalars, tag, ctx) {
    let tagObj;

    if (tag) {
      if (tag.startsWith('!!')) tag = Schema.defaultPrefix + tag.slice(2);
      const match = this.tags.filter(t => t.tag === tag);
      tagObj = match.find(t => !t.format) || match[0];
      if (!tagObj) throw new Error(`Tag ${tag} not found`);
    } else {
      // TODO: deprecate/remove class check
      tagObj = this.tags.find(t => (t.identify && t.identify(value) || t.class && value instanceof t.class) && !t.format);

      if (!tagObj) {
        if (typeof value.toJSON === 'function') value = value.toJSON();
        if (typeof value !== 'object') return wrapScalars ? new _Scalar.default(value) : value;
        tagObj = value instanceof Map ? _tags.tags.map : value[Symbol.iterator] ? _tags.tags.seq : _tags.tags.map;
      }
    }

    if (!ctx) ctx = {
      wrapScalars
    };else ctx.wrapScalars = wrapScalars;

    if (ctx.onTagObj) {
      ctx.onTagObj(tagObj);
      delete ctx.onTagObj;
    }

    const obj = {};

    if (value && typeof value === 'object' && ctx.prevObjects) {
      const prev = ctx.prevObjects.find(o => o.value === value);

      if (prev) {
        const alias = new _Alias.default(prev); // leaves source dirty; must be cleaned by caller

        ctx.aliasNodes.push(alias);
        return alias;
      }

      obj.value = value;
      ctx.prevObjects.push(obj);
    }

    obj.node = tagObj.createNode ? tagObj.createNode(this, value, ctx) : wrapScalars ? new _Scalar.default(value) : value;
    return obj.node;
  }

  createPair(key, value, ctx) {
    const k = this.createNode(key, ctx.wrapScalars, null, ctx);
    const v = this.createNode(value, ctx.wrapScalars, null, ctx);
    return new _Pair.default(k, v);
  } // falls back to string on no match


  resolveScalar(str, tags) {
    if (!tags) tags = this.tags;

    for (let i = 0; i < tags.length; ++i) {
      const {
        format,
        test,
        resolve
      } = tags[i];

      if (test) {
        const match = str.match(test);

        if (match) {
          let res = resolve.apply(null, match);
          if (!(res instanceof _Scalar.default)) res = new _Scalar.default(res);
          if (format) res.format = format;
          return res;
        }
      }
    }

    if (this.tags.scalarFallback) str = this.tags.scalarFallback(str);
    return new _Scalar.default(str);
  } // sets node.resolved on success


  resolveNode(doc, node, tagName) {
    const tags = this.tags.filter(({
      tag
    }) => tag === tagName);
    const generic = tags.find(({
      test
    }) => !test);
    if (node.error) doc.errors.push(node.error);

    try {
      if (generic) {
        let res = generic.resolve(doc, node);
        if (!(res instanceof _Collection.default)) res = new _Scalar.default(res);
        node.resolved = res;
      } else {
        const str = (0, _string.resolveString)(doc, node);

        if (typeof str === 'string' && tags.length > 0) {
          node.resolved = this.resolveScalar(str, tags);
        }
      }
    } catch (error) {
      if (!error.source) error.source = node;
      doc.errors.push(error);
      node.resolved = null;
    }

    if (!node.resolved) return null;
    if (tagName && node.tag) node.resolved.tag = tagName;
    return node.resolved;
  }

  resolveNodeWithFallback(doc, node, tagName) {
    const res = this.resolveNode(doc, node, tagName);
    if (node.hasOwnProperty('resolved')) return res;
    const fallback = isMap(node) ? Schema.defaultTags.MAP : isSeq(node) ? Schema.defaultTags.SEQ : Schema.defaultTags.STR;

    if (fallback) {
      doc.warnings.push(new _errors.YAMLWarning(node, `The tag ${tagName} is unavailable, falling back to ${fallback}`));
      const res = this.resolveNode(doc, node, fallback);
      res.tag = tagName;
      return res;
    } else {
      doc.errors.push(new _errors.YAMLReferenceError(node, `The tag ${tagName} is unavailable`));
    }

    return null;
  }

  getTagObject(item) {
    if (item instanceof _Alias.default) return _Alias.default;

    if (item.tag) {
      const match = this.tags.filter(t => t.tag === item.tag);
      if (match.length > 0) return match.find(t => t.format === item.format) || match[0];
    }

    let tagObj, obj;

    if (item instanceof _Scalar.default) {
      obj = item.value; // TODO: deprecate/remove class check

      const match = this.tags.filter(t => t.identify && t.identify(obj) || t.class && obj instanceof t.class);
      tagObj = match.find(t => t.format === item.format) || match.find(t => !t.format);
    } else {
      obj = item;
      tagObj = this.tags.find(t => t.nodeClass && obj instanceof t.nodeClass);
    }

    if (!tagObj) {
      const name = obj && obj.constructor ? obj.constructor.name : typeof obj;
      throw new Error(`Tag not resolved for ${name} value`);
    }

    return tagObj;
  } // needs to be called before stringifier to allow for circular anchor refs


  stringifyProps(node, tagObj, {
    anchors,
    doc
  }) {
    const props = [];
    const anchor = doc.anchors.getName(node);

    if (anchor) {
      anchors[anchor] = node;
      props.push(`&${anchor}`);
    }

    if (node.tag) {
      props.push(doc.stringifyTag(node.tag));
    } else if (!tagObj.default) {
      props.push(doc.stringifyTag(tagObj.tag));
    }

    return props.join(' ');
  }

  stringify(item, ctx, onComment, onChompKeep) {
    let tagObj;

    if (!(item instanceof _Node.default)) {
      const createCtx = {
        aliasNodes: [],
        onTagObj: o => tagObj = o,
        prevObjects: []
      };
      item = this.createNode(item, true, null, createCtx);
      const {
        anchors
      } = ctx.doc;

      for (const alias of createCtx.aliasNodes) {
        alias.source = alias.source.node;
        let name = anchors.getName(alias.source);

        if (!name) {
          name = anchors.newName();
          anchors.map[name] = alias.source;
        }
      }
    }

    ctx.tags = this;
    if (item instanceof _Pair.default) return item.toString(ctx, onComment, onChompKeep);
    if (!tagObj) tagObj = this.getTagObject(item);
    const props = this.stringifyProps(item, tagObj, ctx);
    const str = typeof tagObj.stringify === 'function' ? tagObj.stringify(item, ctx, onComment, onChompKeep) : item instanceof _Collection.default ? item.toString(ctx, onComment, onChompKeep) : (0, _stringify.stringifyString)(item, ctx, onComment, onChompKeep);
    return props ? item instanceof _Collection.default && str[0] !== '{' && str[0] !== '[' ? `${props}\n${ctx.indent}${str}` : `${props} ${str}` : str;
  }

}

exports.default = Schema;

_defineProperty(Schema, "defaultPrefix", 'tag:yaml.org,2002:');

_defineProperty(Schema, "defaultTags", {
  MAP: 'tag:yaml.org,2002:map',
  SEQ: 'tag:yaml.org,2002:seq',
  STR: 'tag:yaml.org,2002:str'
});

/***/ }),

/***/ "./node_modules/yaml/dist/schema/parseMap.js":
/*!***************************************************!*\
  !*** ./node_modules/yaml/dist/schema/parseMap.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseMap;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _PlainValue = _interopRequireDefault(__webpack_require__(/*! ../cst/PlainValue */ "./node_modules/yaml/dist/cst/PlainValue.js"));

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _Map = _interopRequireDefault(__webpack_require__(/*! ./Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _Merge = _interopRequireWildcard(__webpack_require__(/*! ./Merge */ "./node_modules/yaml/dist/schema/Merge.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _parseUtils = __webpack_require__(/*! ./parseUtils */ "./node_modules/yaml/dist/schema/parseUtils.js");

var _Alias = _interopRequireDefault(__webpack_require__(/*! ./Alias */ "./node_modules/yaml/dist/schema/Alias.js"));

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseMap(doc, cst) {
  if (cst.type !== _constants.Type.MAP && cst.type !== _constants.Type.FLOW_MAP) {
    const msg = `A ${cst.type} node cannot be resolved as a mapping`;
    doc.errors.push(new _errors.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === _constants.Type.FLOW_MAP ? resolveFlowMapItems(doc, cst) : resolveBlockMapItems(doc, cst);
  const map = new _Map.default();
  map.items = items;
  (0, _parseUtils.resolveComments)(map, comments);

  for (let i = 0; i < items.length; ++i) {
    const {
      key: iKey
    } = items[i];

    if (doc.schema.merge && iKey && iKey.value === _Merge.MERGE_KEY) {
      items[i] = new _Merge.default(items[i]);
      const sources = items[i].value.items;
      let error = null;
      sources.some(node => {
        if (node instanceof _Alias.default) {
          // During parsing, alias sources are CST nodes; to account for
          // circular references their resolved values can't be used here.
          const {
            type
          } = node.source;
          if (type === _constants.Type.MAP || type === _constants.Type.FLOW_MAP) return false;
          return error = 'Merge nodes aliases can only point to maps';
        }

        return error = 'Merge nodes can only have Alias nodes as values';
      });
      if (error) doc.errors.push(new _errors.YAMLSemanticError(cst, error));
    } else {
      for (let j = i + 1; j < items.length; ++j) {
        const {
          key: jKey
        } = items[j];

        if (iKey === jKey || iKey && jKey && iKey.hasOwnProperty('value') && iKey.value === jKey.value) {
          const msg = `Map keys must be unique; "${iKey}" is repeated`;
          doc.errors.push(new _errors.YAMLSemanticError(cst, msg));
          break;
        }
      }
    }
  }

  cst.resolved = map;
  return map;
}

const valueHasPairComment = ({
  context: {
    lineStart,
    node,
    src
  },
  props
}) => {
  if (props.length === 0) return false;
  const {
    start
  } = props[0];
  if (node && start > node.valueRange.start) return false;
  if (src[start] !== _constants.Char.COMMENT) return false;

  for (let i = lineStart; i < start; ++i) if (src[i] === '\n') return false;

  return true;
};

function resolvePairComment(item, pair) {
  if (!valueHasPairComment(item)) return;
  const comment = item.getPropValue(0, _constants.Char.COMMENT, true);
  let found = false;
  const cb = pair.value.commentBefore;

  if (cb && cb.startsWith(comment)) {
    pair.value.commentBefore = cb.substr(comment.length + 1);
    found = true;
  } else {
    const cc = pair.value.comment;

    if (!item.node && cc && cc.startsWith(comment)) {
      pair.value.comment = cc.substr(comment.length + 1);
      found = true;
    }
  }

  if (found) pair.comment = comment;
}

function resolveBlockMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let keyStart = null;

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case _constants.Type.BLANK_LINE:
        comments.push({
          afterKey: !!key,
          before: items.length
        });
        break;

      case _constants.Type.COMMENT:
        comments.push({
          afterKey: !!key,
          before: items.length,
          comment: item.comment
        });
        break;

      case _constants.Type.MAP_KEY:
        if (key !== undefined) items.push(new _Pair.default(key));
        if (item.error) doc.errors.push(item.error);
        key = doc.resolveNode(item.node);
        keyStart = null;
        break;

      case _constants.Type.MAP_VALUE:
        {
          if (key === undefined) key = null;
          if (item.error) doc.errors.push(item.error);

          if (!item.context.atLineStart && item.node && item.node.type === _constants.Type.MAP && !item.node.context.atLineStart) {
            const msg = 'Nested mappings are not allowed in compact mappings';
            doc.errors.push(new _errors.YAMLSemanticError(item.node, msg));
          }

          let valueNode = item.node;

          if (!valueNode && item.props.length > 0) {
            // Comments on an empty mapping value need to be preserved, so we
            // need to construct a minimal empty node here to use instead of the
            // missing `item.node`. -- eemeli/yaml#19
            valueNode = new _PlainValue.default(_constants.Type.PLAIN, []);
            valueNode.context = {
              parent: item,
              src: item.context.src
            };
            const pos = item.range.start + 1;
            valueNode.range = {
              start: pos,
              end: pos
            };
            valueNode.valueRange = {
              start: pos,
              end: pos
            };

            if (typeof item.range.origStart === 'number') {
              const origPos = item.range.origStart + 1;
              valueNode.range.origStart = valueNode.range.origEnd = origPos;
              valueNode.valueRange.origStart = valueNode.valueRange.origEnd = origPos;
            }
          }

          const pair = new _Pair.default(key, doc.resolveNode(valueNode));
          resolvePairComment(item, pair);
          items.push(pair);
          (0, _parseUtils.checkKeyLength)(doc.errors, cst, i, key, keyStart);
          key = undefined;
          keyStart = null;
        }
        break;

      default:
        if (key !== undefined) items.push(new _Pair.default(key));
        key = doc.resolveNode(item);
        keyStart = item.range.start;
        if (item.error) doc.errors.push(item.error);

        next: for (let j = i + 1;; ++j) {
          const nextItem = cst.items[j];

          switch (nextItem && nextItem.type) {
            case _constants.Type.BLANK_LINE:
            case _constants.Type.COMMENT:
              continue next;

            case _constants.Type.MAP_VALUE:
              break next;

            default:
              doc.errors.push(new _errors.YAMLSemanticError(item, 'Implicit map keys need to be followed by map values'));
              break next;
          }
        }

        if (item.valueRangeContainsNewline) {
          const msg = 'Implicit map keys need to be on a single line';
          doc.errors.push(new _errors.YAMLSemanticError(item, msg));
        }

    }
  }

  if (key !== undefined) items.push(new _Pair.default(key));
  return {
    comments,
    items
  };
}

function resolveFlowMapItems(doc, cst) {
  const comments = [];
  const items = [];
  let key = undefined;
  let keyStart = null;
  let explicitKey = false;
  let next = '{';

  for (let i = 0; i < cst.items.length; ++i) {
    (0, _parseUtils.checkKeyLength)(doc.errors, cst, i, key, keyStart);
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char
      } = item;

      if (char === '?' && key === undefined && !explicitKey) {
        explicitKey = true;
        next = ':';
        continue;
      }

      if (char === ':') {
        if (key === undefined) key = null;

        if (next === ':') {
          next = ',';
          continue;
        }
      } else {
        if (explicitKey) {
          if (key === undefined && char !== ',') key = null;
          explicitKey = false;
        }

        if (key !== undefined) {
          items.push(new _Pair.default(key));
          key = undefined;
          keyStart = null;

          if (char === ',') {
            next = ':';
            continue;
          }
        }
      }

      if (char === '}') {
        if (i === cst.items.length - 1) continue;
      } else if (char === next) {
        next = ':';
        continue;
      }

      doc.errors.push(new _errors.YAMLSyntaxError(cst, `Flow map contains an unexpected ${char}`));
    } else if (item.type === _constants.Type.BLANK_LINE) {
      comments.push({
        afterKey: !!key,
        before: items.length
      });
    } else if (item.type === _constants.Type.COMMENT) {
      comments.push({
        afterKey: !!key,
        before: items.length,
        comment: item.comment
      });
    } else if (key === undefined) {
      if (next === ',') doc.errors.push(new _errors.YAMLSemanticError(item, 'Separator , missing in flow map'));
      key = doc.resolveNode(item);
      keyStart = explicitKey ? null : item.range.start; // TODO: add error for non-explicit multiline plain key
    } else {
      if (next !== ',') doc.errors.push(new _errors.YAMLSemanticError(item, 'Indicator : missing in flow map entry'));
      items.push(new _Pair.default(key, doc.resolveNode(item)));
      key = undefined;
      explicitKey = false;
    }
  }

  if (cst.items[cst.items.length - 1].char !== '}') doc.errors.push(new _errors.YAMLSemanticError(cst, 'Expected flow map to end with }'));
  if (key !== undefined) items.push(new _Pair.default(key));
  return {
    comments,
    items
  };
}

/***/ }),

/***/ "./node_modules/yaml/dist/schema/parseSeq.js":
/*!***************************************************!*\
  !*** ./node_modules/yaml/dist/schema/parseSeq.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = parseSeq;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

var _Pair = _interopRequireDefault(__webpack_require__(/*! ./Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _parseUtils = __webpack_require__(/*! ./parseUtils */ "./node_modules/yaml/dist/schema/parseUtils.js");

var _Seq = _interopRequireDefault(__webpack_require__(/*! ./Seq */ "./node_modules/yaml/dist/schema/Seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parseSeq(doc, cst) {
  if (cst.type !== _constants.Type.SEQ && cst.type !== _constants.Type.FLOW_SEQ) {
    const msg = `A ${cst.type} node cannot be resolved as a sequence`;
    doc.errors.push(new _errors.YAMLSyntaxError(cst, msg));
    return null;
  }

  const {
    comments,
    items
  } = cst.type === _constants.Type.FLOW_SEQ ? resolveFlowSeqItems(doc, cst) : resolveBlockSeqItems(doc, cst);
  const seq = new _Seq.default();
  seq.items = items;
  (0, _parseUtils.resolveComments)(seq, comments);
  cst.resolved = seq;
  return seq;
}

function resolveBlockSeqItems(doc, cst) {
  const comments = [];
  const items = [];

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    switch (item.type) {
      case _constants.Type.BLANK_LINE:
        comments.push({
          before: items.length
        });
        break;

      case _constants.Type.COMMENT:
        comments.push({
          comment: item.comment,
          before: items.length
        });
        break;

      case _constants.Type.SEQ_ITEM:
        if (item.error) doc.errors.push(item.error);
        items.push(doc.resolveNode(item.node));

        if (item.hasProps) {
          const msg = 'Sequence items cannot have tags or anchors before the - indicator';
          doc.errors.push(new _errors.YAMLSemanticError(item, msg));
        }

        break;

      default:
        if (item.error) doc.errors.push(item.error);
        doc.errors.push(new _errors.YAMLSyntaxError(item, `Unexpected ${item.type} node in sequence`));
    }
  }

  return {
    comments,
    items
  };
}

function resolveFlowSeqItems(doc, cst) {
  const comments = [];
  const items = [];
  let explicitKey = false;
  let key = undefined;
  let keyStart = null;
  let next = '[';

  for (let i = 0; i < cst.items.length; ++i) {
    const item = cst.items[i];

    if (typeof item.char === 'string') {
      const {
        char
      } = item;

      if (char !== ':' && (explicitKey || key !== undefined)) {
        if (explicitKey && key === undefined) key = next ? items.pop() : null;
        items.push(new _Pair.default(key));
        explicitKey = false;
        key = undefined;
        keyStart = null;
      }

      if (char === next) {
        next = null;
      } else if (!next && char === '?') {
        explicitKey = true;
      } else if (next !== '[' && char === ':' && key === undefined) {
        if (next === ',') {
          key = items.pop();

          if (key instanceof _Pair.default) {
            const msg = 'Chaining flow sequence pairs is invalid (e.g. [ a : b : c ])';
            doc.errors.push(new _errors.YAMLSemanticError(char, msg));
          }

          if (!explicitKey) (0, _parseUtils.checkKeyLength)(doc.errors, cst, i, key, keyStart);
        } else {
          key = null;
        }

        keyStart = null;
        explicitKey = false; // TODO: add error for non-explicit multiline plain key

        next = null;
      } else if (next === '[' || char !== ']' || i < cst.items.length - 1) {
        const msg = `Flow sequence contains an unexpected ${char}`;
        doc.errors.push(new _errors.YAMLSyntaxError(cst, msg));
      }
    } else if (item.type === _constants.Type.BLANK_LINE) {
      comments.push({
        before: items.length
      });
    } else if (item.type === _constants.Type.COMMENT) {
      comments.push({
        comment: item.comment,
        before: items.length
      });
    } else {
      if (next) {
        const msg = `Expected a ${next} here in flow sequence`;
        doc.errors.push(new _errors.YAMLSemanticError(item, msg));
      }

      const value = doc.resolveNode(item);

      if (key === undefined) {
        items.push(value);
      } else {
        items.push(new _Pair.default(key, value));
        key = undefined;
      }

      keyStart = item.range.start;
      next = ',';
    }
  }

  if (cst.items[cst.items.length - 1].char !== ']') doc.errors.push(new _errors.YAMLSemanticError(cst, 'Expected flow sequence to end with ]'));
  if (key !== undefined) items.push(new _Pair.default(key));
  return {
    comments,
    items
  };
}

/***/ }),

/***/ "./node_modules/yaml/dist/schema/parseUtils.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/schema/parseUtils.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkKeyLength = checkKeyLength;
exports.resolveComments = resolveComments;

var _errors = __webpack_require__(/*! ../errors */ "./node_modules/yaml/dist/errors.js");

function checkKeyLength(errors, node, itemIdx, key, keyStart) {
  if (!key || typeof keyStart !== 'number') return;
  const item = node.items[itemIdx];
  let keyEnd = item && item.range && item.range.start;

  if (!keyEnd) {
    for (let i = itemIdx - 1; i >= 0; --i) {
      const it = node.items[i];

      if (it && it.range) {
        keyEnd = it.range.end + 2 * (itemIdx - i);
        break;
      }
    }
  }

  if (keyEnd > keyStart + 1024) {
    const k = String(key).substr(0, 8) + '...' + String(key).substr(-8);
    errors.push(new _errors.YAMLSemanticError(node, `The "${k}" key is too long`));
  }
}

function resolveComments(collection, comments) {
  for (const _ref of comments) {
    const {
      afterKey,
      before,
      comment
    } = _ref;
    let item = collection.items[before];

    if (!item) {
      if (comment !== undefined) {
        if (collection.comment) collection.comment += '\n' + comment;else collection.comment = comment;
      }
    } else {
      if (afterKey && item.value) item = item.value;

      if (comment === undefined) {
        if (afterKey || !item.commentBefore) item.spaceBefore = true;
      } else {
        if (item.commentBefore) item.commentBefore += '\n' + comment;else item.commentBefore = comment;
      }
    }
  }
}

/***/ }),

/***/ "./node_modules/yaml/dist/stringify.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/stringify.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.stringifyNumber = stringifyNumber;
exports.stringifyString = stringifyString;

var _addComment = __webpack_require__(/*! ./addComment */ "./node_modules/yaml/dist/addComment.js");

var _constants = __webpack_require__(/*! ./constants */ "./node_modules/yaml/dist/constants.js");

var _foldFlowLines = _interopRequireWildcard(__webpack_require__(/*! ./foldFlowLines */ "./node_modules/yaml/dist/foldFlowLines.js"));

var _options = __webpack_require__(/*! ./tags/options */ "./node_modules/yaml/dist/tags/options.js");

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function stringifyNumber({
  format,
  minFractionDigits,
  tag,
  value
}) {
  if (!isFinite(value)) return isNaN(value) ? '.nan' : value < 0 ? '-.inf' : '.inf';
  let n = JSON.stringify(value);

  if (!format && minFractionDigits && (!tag || tag === 'tag:yaml.org,2002:float') && /^\d/.test(n)) {
    let i = n.indexOf('.');

    if (i < 0) {
      i = n.length;
      n += '.';
    }

    let d = minFractionDigits - (n.length - i - 1);

    while (d-- > 0) n += '0';
  }

  return n;
}

function lineLengthOverLimit(str, limit) {
  const strLen = str.length;
  if (strLen <= limit) return false;

  for (let i = 0, start = 0; i < strLen; ++i) {
    if (str[i] === '\n') {
      if (i - start > limit) return true;
      start = i + 1;
      if (strLen - start <= limit) return false;
    }
  }

  return true;
}

function doubleQuotedString(value, {
  implicitKey,
  indent
}) {
  const {
    jsonEncoding,
    minMultiLineLength
  } = _options.strOptions.doubleQuoted;
  const json = JSON.stringify(value);
  if (jsonEncoding) return json;
  let str = '';
  let start = 0;

  for (let i = 0, ch = json[i]; ch; ch = json[++i]) {
    if (ch === ' ' && json[i + 1] === '\\' && json[i + 2] === 'n') {
      // space before newline needs to be escaped to not be folded
      str += json.slice(start, i) + '\\ ';
      i += 1;
      start = i;
      ch = '\\';
    }

    if (ch === '\\') switch (json[i + 1]) {
      case 'u':
        {
          str += json.slice(start, i);
          const code = json.substr(i + 2, 4);

          switch (code) {
            case '0000':
              str += '\\0';
              break;

            case '0007':
              str += '\\a';
              break;

            case '000b':
              str += '\\v';
              break;

            case '001b':
              str += '\\e';
              break;

            case '0085':
              str += '\\N';
              break;

            case '00a0':
              str += '\\_';
              break;

            case '2028':
              str += '\\L';
              break;

            case '2029':
              str += '\\P';
              break;

            default:
              if (code.substr(0, 2) === '00') str += '\\x' + code.substr(2);else str += json.substr(i, 6);
          }

          i += 5;
          start = i + 1;
        }
        break;

      case 'n':
        if (implicitKey || json[i + 2] === '"' || json.length < minMultiLineLength) {
          i += 1;
        } else {
          // folding will eat first newline
          str += json.slice(start, i) + '\n\n';

          while (json[i + 2] === '\\' && json[i + 3] === 'n' && json[i + 4] !== '"') {
            str += '\n';
            i += 2;
          }

          str += indent; // space after newline needs to be escaped to not be folded

          if (json[i + 2] === ' ') str += '\\';
          i += 1;
          start = i + 1;
        }

        break;

      default:
        i += 1;
    }
  }

  str = start ? str + json.slice(start) : json;
  return implicitKey ? str : (0, _foldFlowLines.default)(str, indent, _foldFlowLines.FOLD_QUOTED, _options.strOptions.fold);
}

function singleQuotedString(value, ctx) {
  const {
    indent,
    implicitKey
  } = ctx;

  if (implicitKey) {
    if (/\n/.test(value)) return doubleQuotedString(value, ctx);
  } else {
    // single quoted string can't have leading or trailing whitespace around newline
    if (/[ \t]\n|\n[ \t]/.test(value)) return doubleQuotedString(value, ctx);
  }

  const res = "'" + value.replace(/'/g, "''").replace(/\n+/g, `$&\n${indent}`) + "'";
  return implicitKey ? res : (0, _foldFlowLines.default)(res, indent, _foldFlowLines.FOLD_FLOW, _options.strOptions.fold);
}

function blockString({
  comment,
  type,
  value
}, ctx, onComment, onChompKeep) {
  // 1. Block can't end in whitespace unless the last line is non-empty.
  // 2. Strings consisting of only whitespace are best rendered explicitly.
  if (/\n[\t ]+$/.test(value) || /^\s*$/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  const indent = ctx.indent || (ctx.forceBlockIndent ? ' ' : '');
  const indentSize = indent ? '2' : '1'; // root is at -1

  const literal = type === _constants.Type.BLOCK_FOLDED ? false : type === _constants.Type.BLOCK_LITERAL ? true : !lineLengthOverLimit(value, _options.strOptions.fold.lineWidth - indent.length);
  let header = literal ? '|' : '>';
  if (!value) return header + '\n';
  let wsStart = '';
  let wsEnd = '';
  value = value.replace(/[\n\t ]*$/, ws => {
    const n = ws.indexOf('\n');

    if (n === -1) {
      header += '-'; // strip
    } else if (value === ws || n !== ws.length - 1) {
      header += '+'; // keep

      if (onChompKeep) onChompKeep();
    }

    wsEnd = ws.replace(/\n$/, '');
    return '';
  }).replace(/^[\n ]*/, ws => {
    if (ws.indexOf(' ') !== -1) header += indentSize;
    const m = ws.match(/ +$/);

    if (m) {
      wsStart = ws.slice(0, -m[0].length);
      return m[0];
    } else {
      wsStart = ws;
      return '';
    }
  });
  if (wsEnd) wsEnd = wsEnd.replace(/\n+(?!\n|$)/g, `$&${indent}`);
  if (wsStart) wsStart = wsStart.replace(/\n+/g, `$&${indent}`);

  if (comment) {
    header += ' #' + comment.replace(/ ?[\r\n]+/g, ' ');
    if (onComment) onComment();
  }

  if (!value) return `${header}${indentSize}\n${indent}${wsEnd}`;

  if (literal) {
    value = value.replace(/\n+/g, `$&${indent}`);
    return `${header}\n${indent}${wsStart}${value}${wsEnd}`;
  }

  value = value.replace(/\n+/g, '\n$&').replace(/(?:^|\n)([\t ].*)(?:([\n\t ]*)\n(?![\n\t ]))?/g, '$1$2') // more-indented lines aren't folded
  //         ^ ind.line  ^ empty     ^ capture next empty lines only at end of indent
  .replace(/\n+/g, `$&${indent}`);
  const body = (0, _foldFlowLines.default)(`${wsStart}${value}${wsEnd}`, indent, _foldFlowLines.FOLD_BLOCK, _options.strOptions.fold);
  return `${header}\n${indent}${body}`;
}

function plainString(item, ctx, onComment, onChompKeep) {
  const {
    comment,
    type,
    value
  } = item;
  const {
    actualString,
    implicitKey,
    indent,
    inFlow,
    tags
  } = ctx;

  if (implicitKey && /[\n[\]{},]/.test(value) || inFlow && /[[\]{},]/.test(value)) {
    return doubleQuotedString(value, ctx);
  }

  if (!value || /^[\n\t ,[\]{}#&*!|>'"%@`]|^[?-]$|^[?-][ \t]|[\n:][ \t]|[ \t]\n|[\n\t ]#|[\n\t :]$/.test(value)) {
    // not allowed:
    // - empty string, '-' or '?'
    // - start with an indicator character (except [?:-]) or /[?-] /
    // - '\n ', ': ' or ' \n' anywhere
    // - '#' not preceded by a non-space char
    // - end with ' ' or ':'
    return implicitKey || inFlow || value.indexOf('\n') === -1 ? value.indexOf('"') !== -1 && value.indexOf("'") === -1 ? singleQuotedString(value, ctx) : doubleQuotedString(value, ctx) : blockString(item, ctx, onComment, onChompKeep);
  }

  if (!implicitKey && !inFlow && type !== _constants.Type.PLAIN && value.indexOf('\n') !== -1) {
    // Where allowed & type not set explicitly, prefer block style for multiline strings
    return blockString(item, ctx, onComment, onChompKeep);
  }

  const str = value.replace(/\n+/g, `$&\n${indent}`); // May need to verify that output will be parsed as a string, as plain numbers
  // and booleans get parsed with those types, e.g. '42', 'true' & '0.9e-3'.

  if (actualString && /^[\w.+-]+$/.test(str) && typeof tags.resolveScalar(str).value !== 'string') {
    return doubleQuotedString(value, ctx);
  }

  const body = implicitKey ? str : (0, _foldFlowLines.default)(str, indent, _foldFlowLines.FOLD_FLOW, _options.strOptions.fold);

  if (comment && !inFlow && (body.indexOf('\n') !== -1 || comment.indexOf('\n') !== -1)) {
    if (onComment) onComment();
    return (0, _addComment.addCommentBefore)(body, indent, comment);
  }

  return body;
}

function stringifyString(item, ctx, onComment, onChompKeep) {
  const {
    defaultType
  } = _options.strOptions;
  const {
    implicitKey,
    inFlow
  } = ctx;
  let {
    type,
    value
  } = item;

  if (typeof value !== 'string') {
    value = String(value);
    item = Object.assign({}, item, {
      value
    });
  }

  const _stringify = _type => {
    switch (_type) {
      case _constants.Type.BLOCK_FOLDED:
      case _constants.Type.BLOCK_LITERAL:
        return blockString(item, ctx, onComment, onChompKeep);

      case _constants.Type.QUOTE_DOUBLE:
        return doubleQuotedString(value, ctx);

      case _constants.Type.QUOTE_SINGLE:
        return singleQuotedString(value, ctx);

      case _constants.Type.PLAIN:
        return plainString(item, ctx, onComment, onChompKeep);

      default:
        return null;
    }
  };

  if (type !== _constants.Type.QUOTE_DOUBLE && /[\x00-\x08\x0b-\x1f\x7f-\x9f]/.test(value)) {
    // force double quotes on control characters
    type = _constants.Type.QUOTE_DOUBLE;
  } else if ((implicitKey || inFlow) && (type === _constants.Type.BLOCK_FOLDED || type === _constants.Type.BLOCK_LITERAL)) {
    // should not happen; blocks are not valid inside flow containers
    type = _constants.Type.QUOTE_DOUBLE;
  }

  let res = _stringify(type);

  if (res === null) {
    res = _stringify(defaultType);
    if (res === null) throw new Error(`Unsupported default string type ${defaultType}`);
  }

  return res;
}

/***/ }),

/***/ "./node_modules/yaml/dist/tags/core.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/tags/core.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ../schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _stringify = __webpack_require__(/*! ../stringify */ "./node_modules/yaml/dist/stringify.js");

var _failsafe = _interopRequireDefault(__webpack_require__(/*! ./failsafe */ "./node_modules/yaml/dist/tags/failsafe/index.js"));

var _options = __webpack_require__(/*! ./options */ "./node_modules/yaml/dist/tags/options.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _failsafe.default.concat([{
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.default(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: _options.nullOptions,
  stringify: () => _options.nullOptions.nullStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:[Tt]rue|TRUE|[Ff]alse|FALSE)$/,
  resolve: str => str[0] === 't' || str[0] === 'T',
  options: _options.boolOptions,
  stringify: ({
    value
  }) => value ? _options.boolOptions.trueStr : _options.boolOptions.falseStr
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^0o([0-7]+)$/,
  resolve: (str, oct) => parseInt(oct, 8),
  stringify: ({
    value
  }) => '0o' + value.toString(8)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^[-+]?[0-9]+$/,
  resolve: str => parseInt(str, 10),
  stringify: _stringify.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^0x([0-9a-fA-F]+)$/,
  resolve: (str, hex) => parseInt(hex, 16),
  stringify: ({
    value
  }) => '0x' + value.toString(16)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: _stringify.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?(?:0|[1-9][0-9]*)(\.[0-9]*)?[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str),
  stringify: ({
    value
  }) => Number(value).toExponential()
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:0|[1-9][0-9]*)\.([0-9]*)$/,

  resolve(str, frac) {
    const node = new _Scalar.default(parseFloat(str));
    if (frac && frac[frac.length - 1] === '0') node.minFractionDigits = frac.length;
    return node;
  },

  stringify: _stringify.stringifyNumber
}]);

exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/failsafe/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/tags/failsafe/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(__webpack_require__(/*! ./map */ "./node_modules/yaml/dist/tags/failsafe/map.js"));

var _seq = _interopRequireDefault(__webpack_require__(/*! ./seq */ "./node_modules/yaml/dist/tags/failsafe/seq.js"));

var _string = _interopRequireDefault(__webpack_require__(/*! ./string */ "./node_modules/yaml/dist/tags/failsafe/string.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = [_map.default, _seq.default, _string.default];
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/failsafe/map.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/tags/failsafe/map.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Map = _interopRequireDefault(__webpack_require__(/*! ../../schema/Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _parseMap = _interopRequireDefault(__webpack_require__(/*! ../../schema/parseMap */ "./node_modules/yaml/dist/schema/parseMap.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createMap(schema, obj, ctx) {
  const map = new _Map.default();

  if (obj instanceof Map) {
    for (const [key, value] of obj) map.items.push(schema.createPair(key, value, ctx));
  } else if (obj && typeof obj === 'object') {
    for (const key of Object.keys(obj)) map.items.push(schema.createPair(key, obj[key], ctx));
  }

  return map;
}

var _default = {
  createNode: createMap,
  default: true,
  nodeClass: _Map.default,
  tag: 'tag:yaml.org,2002:map',
  resolve: _parseMap.default
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/failsafe/seq.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/tags/failsafe/seq.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _parseSeq = _interopRequireDefault(__webpack_require__(/*! ../../schema/parseSeq */ "./node_modules/yaml/dist/schema/parseSeq.js"));

var _Seq = _interopRequireDefault(__webpack_require__(/*! ../../schema/Seq */ "./node_modules/yaml/dist/schema/Seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createSeq(schema, obj, ctx) {
  const seq = new _Seq.default();

  if (obj && obj[Symbol.iterator]) {
    for (const it of obj) {
      const v = schema.createNode(it, ctx.wrapScalars, null, ctx);
      seq.items.push(v);
    }
  }

  return seq;
}

var _default = {
  createNode: createSeq,
  default: true,
  nodeClass: _Seq.default,
  tag: 'tag:yaml.org,2002:seq',
  resolve: _parseSeq.default
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/failsafe/string.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/tags/failsafe/string.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.resolveString = void 0;

var _stringify = __webpack_require__(/*! ../../stringify */ "./node_modules/yaml/dist/stringify.js");

var _options = __webpack_require__(/*! ../options */ "./node_modules/yaml/dist/tags/options.js");

const resolveString = (doc, node) => {
  // on error, will return { str: string, errors: Error[] }
  const res = node.strValue;
  if (!res) return '';
  if (typeof res === 'string') return res;
  res.errors.forEach(error => {
    if (!error.source) error.source = node;
    doc.errors.push(error);
  });
  return res.str;
};

exports.resolveString = resolveString;
var _default = {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: resolveString,

  stringify(item, ctx, onComment, onChompKeep) {
    ctx = Object.assign({
      actualString: true
    }, ctx);
    return (0, _stringify.stringifyString)(item, ctx, onComment, onChompKeep);
  },

  options: _options.strOptions
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/index.js":
/*!**********************************************!*\
  !*** ./node_modules/yaml/dist/tags/index.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.tags = exports.schemas = void 0;

var _core = _interopRequireDefault(__webpack_require__(/*! ./core */ "./node_modules/yaml/dist/tags/core.js"));

var _failsafe = _interopRequireDefault(__webpack_require__(/*! ./failsafe */ "./node_modules/yaml/dist/tags/failsafe/index.js"));

var _json = _interopRequireDefault(__webpack_require__(/*! ./json */ "./node_modules/yaml/dist/tags/json.js"));

var _yaml = _interopRequireDefault(__webpack_require__(/*! ./yaml-1.1 */ "./node_modules/yaml/dist/tags/yaml-1.1/index.js"));

var _map = _interopRequireDefault(__webpack_require__(/*! ./failsafe/map */ "./node_modules/yaml/dist/tags/failsafe/map.js"));

var _seq = _interopRequireDefault(__webpack_require__(/*! ./failsafe/seq */ "./node_modules/yaml/dist/tags/failsafe/seq.js"));

var _binary = _interopRequireDefault(__webpack_require__(/*! ./yaml-1.1/binary */ "./node_modules/yaml/dist/tags/yaml-1.1/binary.js"));

var _omap = _interopRequireDefault(__webpack_require__(/*! ./yaml-1.1/omap */ "./node_modules/yaml/dist/tags/yaml-1.1/omap.js"));

var _pairs = _interopRequireDefault(__webpack_require__(/*! ./yaml-1.1/pairs */ "./node_modules/yaml/dist/tags/yaml-1.1/pairs.js"));

var _set = _interopRequireDefault(__webpack_require__(/*! ./yaml-1.1/set */ "./node_modules/yaml/dist/tags/yaml-1.1/set.js"));

var _timestamp = __webpack_require__(/*! ./yaml-1.1/timestamp */ "./node_modules/yaml/dist/tags/yaml-1.1/timestamp.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schemas = {
  core: _core.default,
  failsafe: _failsafe.default,
  json: _json.default,
  yaml11: _yaml.default
};
exports.schemas = schemas;
const tags = {
  binary: _binary.default,
  floatTime: _timestamp.floatTime,
  intTime: _timestamp.intTime,
  map: _map.default,
  omap: _omap.default,
  pairs: _pairs.default,
  seq: _seq.default,
  set: _set.default,
  timestamp: _timestamp.timestamp
};
exports.tags = tags;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/json.js":
/*!*********************************************!*\
  !*** ./node_modules/yaml/dist/tags/json.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _map = _interopRequireDefault(__webpack_require__(/*! ./failsafe/map */ "./node_modules/yaml/dist/tags/failsafe/map.js"));

var _seq = _interopRequireDefault(__webpack_require__(/*! ./failsafe/seq */ "./node_modules/yaml/dist/tags/failsafe/seq.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ../schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _string = __webpack_require__(/*! ./failsafe/string */ "./node_modules/yaml/dist/tags/failsafe/string.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const schema = [_map.default, _seq.default, {
  identify: value => typeof value === 'string',
  default: true,
  tag: 'tag:yaml.org,2002:str',
  resolve: _string.resolveString,
  stringify: value => JSON.stringify(value)
}, {
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.default(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^null$/,
  resolve: () => null,
  stringify: value => JSON.stringify(value)
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^true$/,
  resolve: () => true,
  stringify: value => JSON.stringify(value)
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^false$/,
  resolve: () => false,
  stringify: value => JSON.stringify(value)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^-?(?:0|[1-9][0-9]*)$/,
  resolve: str => parseInt(str, 10),
  stringify: value => JSON.stringify(value)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^-?(?:0|[1-9][0-9]*)(?:\.[0-9]*)?(?:[eE][-+]?[0-9]+)?$/,
  resolve: str => parseFloat(str),
  stringify: value => JSON.stringify(value)
}];

schema.scalarFallback = str => {
  throw new SyntaxError(`Unresolved plain scalar ${JSON.stringify(str)}`);
};

var _default = schema;
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/options.js":
/*!************************************************!*\
  !*** ./node_modules/yaml/dist/tags/options.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strOptions = exports.nullOptions = exports.boolOptions = exports.binaryOptions = void 0;

var _constants = __webpack_require__(/*! ../constants */ "./node_modules/yaml/dist/constants.js");

const binaryOptions = {
  defaultType: _constants.Type.BLOCK_LITERAL,
  lineWidth: 76
};
exports.binaryOptions = binaryOptions;
const boolOptions = {
  trueStr: 'true',
  falseStr: 'false'
};
exports.boolOptions = boolOptions;
const nullOptions = {
  nullStr: 'null'
};
exports.nullOptions = nullOptions;
const strOptions = {
  defaultType: _constants.Type.PLAIN,
  doubleQuoted: {
    jsonEncoding: false,
    minMultiLineLength: 40
  },
  fold: {
    lineWidth: 80,
    minContentWidth: 20
  }
};
exports.strOptions = strOptions;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/yaml-1.1/binary.js":
/*!********************************************************!*\
  !*** ./node_modules/yaml/dist/tags/yaml-1.1/binary.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = __webpack_require__(/*! ../../constants */ "./node_modules/yaml/dist/constants.js");

var _errors = __webpack_require__(/*! ../../errors */ "./node_modules/yaml/dist/errors.js");

var _stringify = __webpack_require__(/*! ../../stringify */ "./node_modules/yaml/dist/stringify.js");

var _string = __webpack_require__(/*! ../failsafe/string */ "./node_modules/yaml/dist/tags/failsafe/string.js");

var _options = __webpack_require__(/*! ../options */ "./node_modules/yaml/dist/tags/options.js");

/* global atob, btoa, Buffer */
var _default = {
  identify: value => value instanceof Uint8Array,
  // Buffer inherits from Uint8Array
  default: false,
  tag: 'tag:yaml.org,2002:binary',

  /**
   * Returns a Buffer in node and an Uint8Array in browsers
   *
   * To use the resulting buffer as an image, you'll want to do something like:
   *
   *   const blob = new Blob([buffer], { type: 'image/jpeg' })
   *   document.querySelector('#photo').src = URL.createObjectURL(blob)
   */
  resolve: (doc, node) => {
    if (typeof Buffer === 'function') {
      const src = (0, _string.resolveString)(doc, node);
      return Buffer.from(src, 'base64');
    } else if (typeof atob === 'function') {
      const src = atob((0, _string.resolveString)(doc, node));
      const buffer = new Uint8Array(src.length);

      for (let i = 0; i < src.length; ++i) buffer[i] = src.charCodeAt(i);

      return buffer;
    } else {
      doc.errors.push(new _errors.YAMLReferenceError(node, 'This environment does not support reading binary tags; either Buffer or atob is required'));
      return null;
    }
  },
  options: _options.binaryOptions,
  stringify: ({
    comment,
    type,
    value
  }, ctx, onComment, onChompKeep) => {
    let src;

    if (typeof Buffer === 'function') {
      src = value instanceof Buffer ? value.toString('base64') : Buffer.from(value.buffer).toString('base64');
    } else if (typeof btoa === 'function') {
      let s = '';

      for (let i = 0; i < value.length; ++i) s += String.fromCharCode(value[i]);

      src = btoa(s);
    } else {
      throw new Error('This environment does not support writing binary tags; either Buffer or btoa is required');
    }

    if (!type) type = _options.binaryOptions.defaultType;

    if (type === _constants.Type.QUOTE_DOUBLE) {
      value = src;
    } else {
      const {
        lineWidth
      } = _options.binaryOptions;
      const n = Math.ceil(src.length / lineWidth);
      const lines = new Array(n);

      for (let i = 0, o = 0; i < n; ++i, o += lineWidth) {
        lines[i] = src.substr(o, lineWidth);
      }

      value = lines.join(type === _constants.Type.BLOCK_LITERAL ? '\n' : ' ');
    }

    return (0, _stringify.stringifyString)({
      comment,
      type,
      value
    }, ctx, onComment, onChompKeep);
  }
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/yaml-1.1/index.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/tags/yaml-1.1/index.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ../../schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _stringify = __webpack_require__(/*! ../../stringify */ "./node_modules/yaml/dist/stringify.js");

var _failsafe = _interopRequireDefault(__webpack_require__(/*! ../failsafe */ "./node_modules/yaml/dist/tags/failsafe/index.js"));

var _options = __webpack_require__(/*! ../options */ "./node_modules/yaml/dist/tags/options.js");

var _binary = _interopRequireDefault(__webpack_require__(/*! ./binary */ "./node_modules/yaml/dist/tags/yaml-1.1/binary.js"));

var _omap = _interopRequireDefault(__webpack_require__(/*! ./omap */ "./node_modules/yaml/dist/tags/yaml-1.1/omap.js"));

var _pairs = _interopRequireDefault(__webpack_require__(/*! ./pairs */ "./node_modules/yaml/dist/tags/yaml-1.1/pairs.js"));

var _set = _interopRequireDefault(__webpack_require__(/*! ./set */ "./node_modules/yaml/dist/tags/yaml-1.1/set.js"));

var _timestamp = __webpack_require__(/*! ./timestamp */ "./node_modules/yaml/dist/tags/yaml-1.1/timestamp.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = _failsafe.default.concat([{
  identify: value => value == null,
  createNode: (schema, value, ctx) => ctx.wrapScalars ? new _Scalar.default(null) : null,
  default: true,
  tag: 'tag:yaml.org,2002:null',
  test: /^(?:~|[Nn]ull|NULL)?$/,
  resolve: () => null,
  options: _options.nullOptions,
  stringify: () => _options.nullOptions.nullStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:Y|y|[Yy]es|YES|[Tt]rue|TRUE|[Oo]n|ON)$/,
  resolve: () => true,
  options: _options.boolOptions,
  stringify: ({
    value
  }) => value ? _options.boolOptions.trueStr : _options.boolOptions.falseStr
}, {
  identify: value => typeof value === 'boolean',
  default: true,
  tag: 'tag:yaml.org,2002:bool',
  test: /^(?:N|n|[Nn]o|NO|[Ff]alse|FALSE|[Oo]ff|OFF)$/i,
  resolve: () => false,
  options: _options.boolOptions,
  stringify: ({
    value
  }) => value ? _options.boolOptions.trueStr : _options.boolOptions.falseStr
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'BIN',
  test: /^0b([0-1_]+)$/,
  resolve: (str, bin) => parseInt(bin.replace(/_/g, ''), 2),
  stringify: ({
    value
  }) => '0b' + value.toString(2)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'OCT',
  test: /^[-+]?0([0-7_]+)$/,
  resolve: (str, oct) => parseInt(oct.replace(/_/g, ''), 8),
  stringify: ({
    value
  }) => (value < 0 ? '-0' : '0') + value.toString(8)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  test: /^[-+]?[0-9][0-9_]*$/,
  resolve: str => parseInt(str.replace(/_/g, ''), 10),
  stringify: _stringify.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'HEX',
  test: /^0x([0-9a-fA-F_]+)$/,
  resolve: (str, hex) => parseInt(hex.replace(/_/g, ''), 16),
  stringify: ({
    value
  }) => (value < 0 ? '-0x' : '0x') + value.toString(16)
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^(?:[-+]?\.inf|(\.nan))$/i,
  resolve: (str, nan) => nan ? NaN : str[0] === '-' ? Number.NEGATIVE_INFINITY : Number.POSITIVE_INFINITY,
  stringify: _stringify.stringifyNumber
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'EXP',
  test: /^[-+]?([0-9][0-9_]*)?(\.[0-9_]*)?[eE][-+]?[0-9]+$/,
  resolve: str => parseFloat(str.replace(/_/g, '')),
  stringify: ({
    value
  }) => Number(value).toExponential()
}, {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  test: /^[-+]?(?:[0-9][0-9_]*)?\.([0-9_]*)$/,

  resolve(str, frac) {
    const node = new _Scalar.default(parseFloat(str.replace(/_/g, '')));

    if (frac) {
      const f = frac.replace(/_/g, '');
      if (f[f.length - 1] === '0') node.minFractionDigits = f.length;
    }

    return node;
  },

  stringify: _stringify.stringifyNumber
}], _binary.default, _omap.default, _pairs.default, _set.default, _timestamp.intTime, _timestamp.floatTime, _timestamp.timestamp);

exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/yaml-1.1/omap.js":
/*!******************************************************!*\
  !*** ./node_modules/yaml/dist/tags/yaml-1.1/omap.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.YAMLOMap = void 0;

var _errors = __webpack_require__(/*! ../../errors */ "./node_modules/yaml/dist/errors.js");

var _toJSON = _interopRequireDefault(__webpack_require__(/*! ../../toJSON */ "./node_modules/yaml/dist/toJSON.js"));

var _Map = _interopRequireDefault(__webpack_require__(/*! ../../schema/Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ../../schema/Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ../../schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

var _Seq = _interopRequireDefault(__webpack_require__(/*! ../../schema/Seq */ "./node_modules/yaml/dist/schema/Seq.js"));

var _pairs = __webpack_require__(/*! ./pairs */ "./node_modules/yaml/dist/tags/yaml-1.1/pairs.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class YAMLOMap extends _Seq.default {
  constructor() {
    super();

    _defineProperty(this, "add", _Map.default.prototype.add.bind(this));

    _defineProperty(this, "delete", _Map.default.prototype.delete.bind(this));

    _defineProperty(this, "get", _Map.default.prototype.get.bind(this));

    _defineProperty(this, "has", _Map.default.prototype.has.bind(this));

    _defineProperty(this, "set", _Map.default.prototype.set.bind(this));

    this.tag = YAMLOMap.tag;
  }

  toJSON(_, ctx) {
    const map = new Map();
    if (ctx && ctx.onCreate) ctx.onCreate(map);

    for (const pair of this.items) {
      let key, value;

      if (pair instanceof _Pair.default) {
        key = (0, _toJSON.default)(pair.key, '', ctx);
        value = (0, _toJSON.default)(pair.value, key, ctx);
      } else {
        key = (0, _toJSON.default)(pair, '', ctx);
      }

      if (map.has(key)) throw new Error('Ordered maps must not include duplicate keys');
      map.set(key, value);
    }

    return map;
  }

}

exports.YAMLOMap = YAMLOMap;

_defineProperty(YAMLOMap, "tag", 'tag:yaml.org,2002:omap');

function parseOMap(doc, cst) {
  const pairs = (0, _pairs.parsePairs)(doc, cst);
  const seenKeys = [];

  for (const _ref of pairs.items) {
    const {
      key
    } = _ref;

    if (key instanceof _Scalar.default) {
      if (seenKeys.includes(key.value)) {
        const msg = 'Ordered maps must not include duplicate keys';
        throw new _errors.YAMLSemanticError(cst, msg);
      } else {
        seenKeys.push(key.value);
      }
    }
  }

  return Object.assign(new YAMLOMap(), pairs);
}

function createOMap(schema, iterable, ctx) {
  const pairs = (0, _pairs.createPairs)(schema, iterable, ctx);
  const omap = new YAMLOMap();
  omap.items = pairs.items;
  return omap;
}

var _default = {
  identify: value => value instanceof Map,
  nodeClass: YAMLOMap,
  default: false,
  tag: 'tag:yaml.org,2002:omap',
  resolve: parseOMap,
  createNode: createOMap
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/yaml-1.1/pairs.js":
/*!*******************************************************!*\
  !*** ./node_modules/yaml/dist/tags/yaml-1.1/pairs.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parsePairs = parsePairs;
exports.createPairs = createPairs;
exports.default = void 0;

var _errors = __webpack_require__(/*! ../../errors */ "./node_modules/yaml/dist/errors.js");

var _Map = _interopRequireDefault(__webpack_require__(/*! ../../schema/Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ../../schema/Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _parseSeq = _interopRequireDefault(__webpack_require__(/*! ../../schema/parseSeq */ "./node_modules/yaml/dist/schema/parseSeq.js"));

var _Seq = _interopRequireDefault(__webpack_require__(/*! ../../schema/Seq */ "./node_modules/yaml/dist/schema/Seq.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function parsePairs(doc, cst) {
  const seq = (0, _parseSeq.default)(doc, cst);

  for (let i = 0; i < seq.items.length; ++i) {
    let item = seq.items[i];
    if (item instanceof _Pair.default) continue;else if (item instanceof _Map.default) {
      if (item.items.length > 1) {
        const msg = 'Each pair must have its own sequence indicator';
        throw new _errors.YAMLSemanticError(cst, msg);
      }

      const pair = item.items[0] || new _Pair.default();
      if (item.commentBefore) pair.commentBefore = pair.commentBefore ? `${item.commentBefore}\n${pair.commentBefore}` : item.commentBefore;
      if (item.comment) pair.comment = pair.comment ? `${item.comment}\n${pair.comment}` : item.comment;
      item = pair;
    }
    seq.items[i] = item instanceof _Pair.default ? item : new _Pair.default(item);
  }

  return seq;
}

function createPairs(schema, iterable, ctx) {
  const pairs = new _Seq.default();
  pairs.tag = 'tag:yaml.org,2002:pairs';

  for (const it of iterable) {
    let key, value;

    if (Array.isArray(it)) {
      if (it.length === 2) {
        key = it[0];
        value = it[1];
      } else throw new TypeError(`Expected [key, value] tuple: ${it}`);
    } else if (it && it instanceof Object) {
      const keys = Object.keys(it);

      if (keys.length === 1) {
        key = keys[0];
        value = it[key];
      } else throw new TypeError(`Expected { key: value } tuple: ${it}`);
    } else {
      key = it;
    }

    const pair = schema.createPair(key, value, ctx);
    pairs.items.push(pair);
  }

  return pairs;
}

var _default = {
  default: false,
  tag: 'tag:yaml.org,2002:pairs',
  resolve: parsePairs,
  createNode: createPairs
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/yaml-1.1/set.js":
/*!*****************************************************!*\
  !*** ./node_modules/yaml/dist/tags/yaml-1.1/set.js ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.YAMLSet = void 0;

var _errors = __webpack_require__(/*! ../../errors */ "./node_modules/yaml/dist/errors.js");

var _Map = _interopRequireWildcard(__webpack_require__(/*! ../../schema/Map */ "./node_modules/yaml/dist/schema/Map.js"));

var _Pair = _interopRequireDefault(__webpack_require__(/*! ../../schema/Pair */ "./node_modules/yaml/dist/schema/Pair.js"));

var _parseMap = _interopRequireDefault(__webpack_require__(/*! ../../schema/parseMap */ "./node_modules/yaml/dist/schema/parseMap.js"));

var _Scalar = _interopRequireDefault(__webpack_require__(/*! ../../schema/Scalar */ "./node_modules/yaml/dist/schema/Scalar.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class YAMLSet extends _Map.default {
  constructor() {
    super();
    this.tag = YAMLSet.tag;
  }

  add(key) {
    const pair = key instanceof _Pair.default ? key : new _Pair.default(key);
    const prev = (0, _Map.findPair)(this.items, pair.key);
    if (!prev) this.items.push(pair);
  }

  get(key, keepPair) {
    const pair = (0, _Map.findPair)(this.items, key);
    return !keepPair && pair instanceof _Pair.default ? pair.key instanceof _Scalar.default ? pair.key.value : pair.key : pair;
  }

  set(key, value) {
    if (typeof value !== 'boolean') throw new Error(`Expected boolean value for set(key, value) in a YAML set, not ${typeof value}`);
    const prev = (0, _Map.findPair)(this.items, key);

    if (prev && !value) {
      this.items.splice(this.items.indexOf(prev), 1);
    } else if (!prev && value) {
      this.items.push(new _Pair.default(key));
    }
  }

  toJSON(_, ctx) {
    return super.toJSON(_, ctx, Set);
  }

  toString(ctx, onComment, onChompKeep) {
    if (!ctx) return JSON.stringify(this);
    if (this.hasAllNullValues()) return super.toString(ctx, onComment, onChompKeep);else throw new Error('Set items must all have null values');
  }

}

exports.YAMLSet = YAMLSet;

_defineProperty(YAMLSet, "tag", 'tag:yaml.org,2002:set');

function parseSet(doc, cst) {
  const map = (0, _parseMap.default)(doc, cst);
  if (!map.hasAllNullValues()) throw new _errors.YAMLSemanticError(cst, 'Set items must all have null values');
  return Object.assign(new YAMLSet(), map);
}

function createSet(schema, iterable, ctx) {
  const set = new YAMLSet();

  for (const value of iterable) set.items.push(schema.createPair(value, null, ctx));

  return set;
}

var _default = {
  identify: value => value instanceof Set,
  nodeClass: YAMLSet,
  default: false,
  tag: 'tag:yaml.org,2002:set',
  resolve: parseSet,
  createNode: createSet
};
exports.default = _default;

/***/ }),

/***/ "./node_modules/yaml/dist/tags/yaml-1.1/timestamp.js":
/*!***********************************************************!*\
  !*** ./node_modules/yaml/dist/tags/yaml-1.1/timestamp.js ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.timestamp = exports.floatTime = exports.intTime = void 0;

var _stringify = __webpack_require__(/*! ../../stringify */ "./node_modules/yaml/dist/stringify.js");

const parseSexagesimal = (sign, parts) => {
  const n = parts.split(':').reduce((n, p) => n * 60 + Number(p), 0);
  return sign === '-' ? -n : n;
}; // hhhh:mm:ss.sss


const stringifySexagesimal = ({
  value
}) => {
  if (isNaN(value) || !isFinite(value)) return (0, _stringify.stringifyNumber)(value);
  let sign = '';

  if (value < 0) {
    sign = '-';
    value = Math.abs(value);
  }

  const parts = [value % 60]; // seconds, including ms

  if (value < 60) {
    parts.unshift(0); // at least one : is required
  } else {
    value = Math.round((value - parts[0]) / 60);
    parts.unshift(value % 60); // minutes

    if (value >= 60) {
      value = Math.round((value - parts[0]) / 60);
      parts.unshift(value); // hours
    }
  }

  return sign + parts.map(n => n < 10 ? '0' + String(n) : String(n)).join(':').replace(/000000\d*$/, '') // % 60 may introduce error
  ;
};

const intTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:int',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
exports.intTime = intTime;
const floatTime = {
  identify: value => typeof value === 'number',
  default: true,
  tag: 'tag:yaml.org,2002:float',
  format: 'TIME',
  test: /^([-+]?)([0-9][0-9_]*(?::[0-5]?[0-9])+\.[0-9_]*)$/,
  resolve: (str, sign, parts) => parseSexagesimal(sign, parts.replace(/_/g, '')),
  stringify: stringifySexagesimal
};
exports.floatTime = floatTime;
const timestamp = {
  identify: value => value instanceof Date,
  default: true,
  tag: 'tag:yaml.org,2002:timestamp',
  // If the time zone is omitted, the timestamp is assumed to be specified in UTC. The time part
  // may be omitted altogether, resulting in a date format. In such a case, the time part is
  // assumed to be 00:00:00Z (start of day, UTC).
  test: RegExp('^(?:' + '([0-9]{4})-([0-9]{1,2})-([0-9]{1,2})' + // YYYY-Mm-Dd
  '(?:(?:t|T|[ \\t]+)' + // t | T | whitespace
  '([0-9]{1,2}):([0-9]{1,2}):([0-9]{1,2}(\\.[0-9]+)?)' + // Hh:Mm:Ss(.ss)?
  '(?:[ \\t]*(Z|[-+][012]?[0-9](?::[0-9]{2})?))?' + // Z | +5 | -03:30
  ')?' + ')$'),
  resolve: (str, year, month, day, hour, minute, second, millisec, tz) => {
    if (millisec) millisec = (millisec + '00').substr(1, 3);
    let date = Date.UTC(year, month - 1, day, hour || 0, minute || 0, second || 0, millisec || 0);

    if (tz && tz !== 'Z') {
      let d = parseSexagesimal(tz[0], tz.slice(1));
      if (Math.abs(d) < 30) d *= 60;
      date -= 60000 * d;
    }

    return new Date(date);
  },
  stringify: ({
    value
  }) => value.toISOString().replace(/((T00:00)?:00)?\.000Z$/, '')
};
exports.timestamp = timestamp;

/***/ }),

/***/ "./node_modules/yaml/dist/toJSON.js":
/*!******************************************!*\
  !*** ./node_modules/yaml/dist/toJSON.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = toJSON;

function toJSON(value, arg, ctx) {
  if (Array.isArray(value)) return value.map((v, i) => toJSON(v, String(i), ctx));

  if (value && typeof value.toJSON === 'function') {
    const anchor = ctx && ctx.anchors && ctx.anchors.find(a => a.node === value);
    if (anchor) ctx.onCreate = res => {
      anchor.res = res;
      delete ctx.onCreate;
    };
    const res = value.toJSON(arg, ctx);
    if (anchor && ctx.onCreate) ctx.onCreate(res);
    return res;
  }

  return value;
}

/***/ }),

/***/ "./node_modules/yaml/index.js":
/*!************************************!*\
  !*** ./node_modules/yaml/index.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! ./dist */ "./node_modules/yaml/dist/index.js").default


/***/ }),

/***/ "./src/commands.ts":
/*!*************************!*\
  !*** ./src/commands.ts ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const extension_1 = __webpack_require__(/*! ./extension */ "./src/extension.ts");
const lando_1 = __webpack_require__(/*! ./lando */ "./src/lando.ts");
const json = __webpack_require__(/*! jsonc-parser */ "jsonc-parser");
const open = __webpack_require__(/*! open */ "./node_modules/open/index.js");
const fs_1 = __webpack_require__(/*! fs */ "fs");
const zlib_1 = __webpack_require__(/*! zlib */ "zlib");
function showOutput() {
    if (vscode_1.workspace.getConfiguration('lando-ui.output').get('autoShow')) {
        extension_1.outputChannel.show();
    }
}
exports.showOutput = showOutput;
function openURL(url) {
    return __awaiter(this, void 0, void 0, function* () {
        yield open(url);
    });
}
exports.openURL = openURL;
function openTreeItem(offset, provider) {
    var treeItem = provider.getTreeItem(offset);
    openURL(treeItem.label ? treeItem.label : '');
}
exports.openTreeItem = openTreeItem;
function copyToClipboard(text) {
    vscode_1.env.clipboard.writeText(text).then(() => {
        vscode_1.window.showInformationMessage(`Copied '${text}' to your clipboard`);
    });
}
exports.copyToClipboard = copyToClipboard;
function copyTreeItem(offset, provider) {
    var treeItem = provider.getTreeItem(offset);
    var text = treeItem.label;
    if (treeItem.contextValue == 'string') {
        text = text.split(': ')[1];
    }
    copyToClipboard(text);
}
exports.copyTreeItem = copyTreeItem;
function checkVersion() {
    var fullVersion = lando_1.version();
    // expecting fullVersion format like 'v3.0.0-rc.22'
    var split = fullVersion.split('-');
    split[0] = split[0].substr(1);
    var dotVersion = split[1].split('.');
    var major = dotVersion[0];
    var minor = dotVersion[1];
    var patch = dotVersion[2];
    var rcNum = split[1].split('.')[1];
    if (rcNum >= '13') {
        return true;
    }
    return false;
}
exports.checkVersion = checkVersion;
function checkAppRunning(appName) {
    var listJSON = lando_1.list();
    var runningList = json.parse(listJSON);
    if (appName in runningList) {
        return true;
    }
    return false;
}
exports.checkAppRunning = checkAppRunning;
function addWorkspaceFolderName(jsonString) {
    var parse = json.parse(jsonString);
    var newObject = {};
    if (Object.keys(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders : []).length > 1) {
        newObject['Workspace Folder'] = extension_1.getWorkspaceFolderNameFromPath();
    }
    for (var element in parse) {
        newObject[element] = parse[element];
    }
    return JSON.stringify(newObject);
}
exports.addWorkspaceFolderName = addWorkspaceFolderName;
function setButtonTo(mode) {
    switch (mode) {
        case 'start':
            extension_1.toggleButton.text = 'Lando Start';
            extension_1.toggleButton.command = 'lando-ui.start';
            break;
        case 'starting':
            extension_1.toggleButton.text = 'Lando Starting...';
            extension_1.toggleButton.command = '';
            break;
        case 'stop':
            extension_1.toggleButton.text = 'Lando Stop';
            extension_1.toggleButton.command = 'lando-ui.stop';
            break;
        case 'stopping':
            extension_1.toggleButton.text = 'Lando Stopping...';
            extension_1.toggleButton.command = '';
            break;
        case 'restarting':
            extension_1.toggleButton.text = 'Lando Restarting..';
            extension_1.toggleButton.command = '';
            break;
        case 'rebuilding':
            extension_1.toggleButton.text = 'Lando Rebuilding..';
            extension_1.toggleButton.command = '';
            break;
        case 'destroying':
            extension_1.toggleButton.text = 'Lando Destroying..';
            extension_1.toggleButton.command = '';
            break;
        case 'init':
            extension_1.toggleButton.text = 'Lando Init';
            extension_1.toggleButton.command = 'lando-ui.init';
            break;
        case 'pick':
            extension_1.toggleButton.text = 'Lando Pick Folder';
            extension_1.toggleButton.command = 'lando-ui.pickWorkspaceFolder';
            break;
        default:
            extension_1.toggleButton.text = 'Loading...';
            extension_1.toggleButton.command = '';
            break;
    }
}
exports.setButtonTo = setButtonTo;
function dbUserExport() {
    let infoJson = json.parse(lando_1.info(extension_1.getWorkspaceFolderPath()));
    let dbTypes = ['mariadb', 'mangodb', 'mssql', 'mysql'];
    let databaseServices = infoJson
        .filter((service) => {
        return dbTypes.includes(service.type);
    })
        .map((service) => {
        return { label: service.service, description: 'type: ' + service.type };
    });
    if (databaseServices.length == 1) {
        dbSaveAs(databaseServices[0].label);
    }
    else {
        vscode_1.window.showQuickPick(databaseServices, { placeHolder: 'Pick a database service to export from' }).then(selected => {
            dbSaveAs(selected ? selected.label : '');
        });
    }
}
exports.dbUserExport = dbUserExport;
function dbSaveDialog(host) {
    vscode_1.window
        .showSaveDialog({
        defaultUri: vscode_1.Uri.file(extension_1.getWorkspaceFolderPath()),
        filters: { 'SQL Data File': ['sql'] },
        saveLabel: 'Export'
    })
        .then(uri => {
        writeDbFile(uri ? uri.path : '', host);
    });
}
function dbSaveAs(host) {
    vscode_1.window
        .showQuickPick([
        { label: 'Lando default', description: "Use Lando's default export location" },
        { label: 'My default and name', description: 'Use my configured export location and name file' },
        { label: 'Select and name', description: 'Choose export location and name file' }
    ], {
        placeHolder: 'Choose Save operation'
    })
        .then(selected => {
        switch (selected ? selected.label : '') {
            case 'Lando default':
                lando_1.dbExport(extension_1.getWorkspaceFolderPath(), host);
                break;
            case 'My default and name':
                vscode_1.window
                    .showInputBox({
                    prompt: 'Name your SQL file',
                    value: 'Untitled.sql',
                    validateInput: validateSQLFileName
                })
                    .then(userFileName => {
                    let exportPath = vscode_1.workspace.getConfiguration('lando-ui.database').get('exportPath');
                    if (exportPath != null && exportPath != '') {
                        writeDbFile(exportPath + '/' + userFileName, host);
                    }
                    else {
                        vscode_1.window
                            .showInputBox({
                            prompt: 'Please set your configured export location',
                            validateInput: validateTrailingSlash
                        })
                            .then(userExportPath => {
                            vscode_1.workspace.getConfiguration('lando-ui.database').update('exportPath', userExportPath);
                            writeDbFile(userExportPath + '/' + userFileName, host);
                        });
                    }
                });
                break;
            case 'Select and name':
                dbSaveDialog(host);
                break;
        }
    });
}
function writeDbFile(savePath, host) {
    fs_1.writeFile(savePath, lando_1.dbExportOut(extension_1.getWorkspaceFolderPath(), host), err => {
        if (err) {
            vscode_1.window.showErrorMessage('Failed to write file');
            extension_1.outputChannel.appendLine('-----------------------');
            extension_1.outputChannel.append('Failed to write file: ' + err);
            extension_1.outputChannel.appendLine('-----------------------');
            return;
        }
        var gzip = zlib_1.createGzip();
        var r = fs_1.createReadStream(savePath);
        var w = fs_1.createWriteStream(savePath + '.gz');
        r.pipe(gzip).pipe(w);
        fs_1.unlink(savePath, err => {
            if (err) {
                vscode_1.window.showErrorMessage('Failed to remove unzipped file');
                extension_1.outputChannel.appendLine('-----------------------');
                extension_1.outputChannel.append('Failed to remove unzipped file: ' + err);
                extension_1.outputChannel.appendLine('-----------------------');
                return;
            }
        });
        vscode_1.window.showInformationMessage('Successfully exported database from ' + host);
    });
}
function validateSQLFileName(string) {
    return string.match(/\.sql/) ? '' : 'Must contain a .sql extension';
}
function validateTrailingSlash(string) {
    return string.match(/\/$/) ? 'Must not have trailing slashes' : '';
}
function dbUserImport() {
    let infoJson = json.parse(lando_1.info(extension_1.getWorkspaceFolderPath()));
    let dbTypes = ['mariadb', 'mangodb', 'mssql', 'mysql'];
    let databaseServices = infoJson
        .filter((service) => {
        return dbTypes.includes(service.type);
    })
        .map((service) => {
        return { label: service.service, description: 'type: ' + service.type };
    });
    if (databaseServices.length == 1) {
        dbNoWipe(databaseServices[0].label);
    }
    else {
        vscode_1.window.showQuickPick(databaseServices, { placeHolder: 'Pick a database service to import to' }).then(selected => {
            dbNoWipe(selected ? selected.label : '');
        });
    }
}
exports.dbUserImport = dbUserImport;
function dbNoWipe(host) {
    vscode_1.window
        .showQuickPick([
        { label: 'Drop all tables and import' },
        {
            label: 'Import without destroying the target database'
        }
    ], {
        placeHolder: 'Choose import behavior'
    })
        .then(selected => {
        switch (selected ? selected.label : '') {
            case 'Drop all tables and import':
                dbOpenDialog(host, false);
                break;
            case 'Import without destroying the target database':
                dbOpenDialog(host, true);
                break;
        }
    });
}
function dbOpenDialog(host, noWipe) {
    vscode_1.window
        .showOpenDialog({
        defaultUri: vscode_1.Uri.file(extension_1.getWorkspaceFolderPath()),
        canSelectMany: false,
        filters: {
            'SQL Data File, GZipped SQL Data File': ['sql', 'gz', 'gzip']
        },
        openLabel: 'Import'
    })
        .then((uris) => {
        let path = uris[0].path;
        if (path.includes(extension_1.getWorkspaceFolderPath())) {
            lando_1.dbImport(extension_1.getWorkspaceFolderPath(), host, noWipe, path.replace(extension_1.getWorkspaceFolderPath() + '/', ''), false);
        }
        else {
            let pathArray = path.split('/');
            let fileName = 'tmp_' + pathArray[pathArray.length - 1];
            fs_1.copyFile(path, extension_1.getWorkspaceFolderPath() + '/' + fileName, err => {
                if (err) {
                    vscode_1.window.showErrorMessage('Failed to remove unzipped file');
                    extension_1.outputChannel.appendLine('-----------------------');
                    extension_1.outputChannel.append('Failed to remove unzipped file: ' + err);
                    extension_1.outputChannel.appendLine('-----------------------');
                    return;
                }
                lando_1.dbImport(extension_1.getWorkspaceFolderPath(), host, noWipe, fileName, true);
            });
        }
    });
}


/***/ }),

/***/ "./src/extension.ts":
/*!**************************!*\
  !*** ./src/extension.ts ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const fs = __webpack_require__(/*! fs */ "fs");
const yaml = __webpack_require__(/*! yaml */ "./node_modules/yaml/index.js");
const lando = __webpack_require__(/*! ./lando */ "./src/lando.ts");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands.ts");
const landoInfoProvider_1 = __webpack_require__(/*! ./landoInfoProvider */ "./src/landoInfoProvider.ts");
const landoListProvider_1 = __webpack_require__(/*! ./landoListProvider */ "./src/landoListProvider.ts");
var workspaceFolderPath;
var landoAppConfig;
var currentAppName;
var firstStart = true;
function activate(context) {
    // ----------------- Create Status Bar Item (button) -----------------
    exports.toggleButton = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 3);
    context.subscriptions.push(exports.toggleButton);
    commands_1.setButtonTo('start');
    // ----------------- Check version of lando (or if it's installed) -----------------
    if (commands_1.checkVersion()) {
        exports.toggleButton.show();
    }
    else {
        vscode_1.window.showErrorMessage('Lando is not installed or you are not running the required version.');
    }
    // ----------------- Create Output Channel -----------------
    exports.outputChannel = vscode_1.window.createOutputChannel('Lando UI');
    context.subscriptions.push(exports.outputChannel);
    // ----------------- Get workspace Folder -----------------
    determineWorkspaceFolder();
    // ----------------- Tree Providers -----------------
    let landoInfoProvider = new landoInfoProvider_1.LandoInfoProvider(context);
    let landoListProvider = new landoListProvider_1.LandoListProvider(context);
    let landoInfoView = vscode_1.window.createTreeView('lando-info', {
        treeDataProvider: landoInfoProvider
    });
    let landoListView = vscode_1.window.createTreeView('lando-list', {
        treeDataProvider: landoListProvider
    });
    // ----------------- Registering commands -----------------
    let registerCommand = vscode_1.commands.registerCommand;
    context.subscriptions.push(...[
        // lando UI commands
        registerCommand('lando-ui.pickWorkspaceFolder', () => pickWorkspaceFolder()),
        // lando commands
        registerCommand('lando-ui.init', () => lando.init()),
        registerCommand('lando-ui.start', () => lando.start(workspaceFolderPath)),
        registerCommand('lando-ui.stop', () => lando.stop(workspaceFolderPath)),
        registerCommand('lando-ui.restart', () => lando.restart(workspaceFolderPath)),
        registerCommand('lando-ui.poweroff', () => lando.poweroff()),
        registerCommand('lando-ui.db-export', () => commands_1.dbUserExport()),
        registerCommand('lando-ui.db-import', () => commands_1.dbUserImport()),
        // info panel commands
        registerCommand('lando-ui.info-refresh', () => landoInfoProvider.refresh()),
        registerCommand('lando-ui.info-refreshNode', offset => landoInfoProvider.refresh(offset)),
        registerCommand('lando-ui.info-openURL', offset => commands_1.openTreeItem(offset, landoInfoProvider)),
        registerCommand('lando-ui.info-copy', offset => commands_1.copyTreeItem(offset, landoInfoProvider)),
        registerCommand('lando-ui.sshService', offset => lando.sshService(offset, landoInfoProvider)),
        // list panel commands
        registerCommand('lando-ui.list-refresh', () => landoListProvider.refresh()),
        registerCommand('lando-ui.list-refreshNode', offset => landoListProvider.refresh(offset)),
        registerCommand('lando-ui.list-copy', offset => commands_1.copyTreeItem(offset, landoListProvider)),
        registerCommand('lando-ui.stopService', offset => lando.stopService(offset, landoListProvider))
    ]);
    // ----------------- Fetch lando file and grab app name from it -----------------
    if (workspaceFolderPath) {
        checkLandoFileExists(workspaceFolderPath + '/.lando.yml');
    }
    startWatcher();
    context.subscriptions.push(exports.watcher);
    // ----------------- Checking if current app is in the list of running containers -----------------
    if (commands_1.checkAppRunning(currentAppName)) {
        commands_1.setButtonTo('stop');
    }
    // ----------------- Watch for changes in configuration -----------------
    vscode_1.workspace.onDidChangeConfiguration(() => {
        determineWorkspaceFolder();
    });
    vscode_1.workspace.onDidChangeWorkspaceFolders(() => {
        determineWorkspaceFolder();
    });
    firstStart = false;
}
exports.activate = activate;
function checkLandoFileExists(landoFilePath) {
    if (fs.existsSync(landoFilePath)) {
        updateCurrentAppConfig(landoFilePath);
        vscode_1.commands.executeCommand('lando-ui.info-refresh');
        commands_1.setButtonTo('start');
        if (commands_1.checkAppRunning(currentAppName)) {
            commands_1.setButtonTo('stop');
        }
        return true;
    }
    else {
        vscode_1.commands.executeCommand('lando-ui.info-refresh');
        commands_1.setButtonTo('init');
        return false;
    }
}
exports.checkLandoFileExists = checkLandoFileExists;
function isWorkspaceFolder(folderPath) {
    var workspaceFolders = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders : [];
    var isWorkspaceFolder = false;
    workspaceFolders.forEach(folder => {
        if (folderPath === folder.uri.fsPath) {
            isWorkspaceFolder = true;
        }
    });
    return isWorkspaceFolder;
}
exports.isWorkspaceFolder = isWorkspaceFolder;
function getLandoFile(filePath) {
    return yaml.parse(fs.readFileSync(filePath, 'utf8'));
}
exports.getLandoFile = getLandoFile;
function getAppNameFromAppConfig(appConfig) {
    return appConfig ? appConfig.name.replace(/[-_]/g, '') : '';
}
exports.getAppNameFromAppConfig = getAppNameFromAppConfig;
function updateCurrentAppConfig(landoFilePath) {
    landoAppConfig = getLandoFile(landoFilePath);
    currentAppName = getAppNameFromAppConfig(landoAppConfig);
}
exports.updateCurrentAppConfig = updateCurrentAppConfig;
function pickWorkspaceFolder() {
    vscode_1.window.showWorkspaceFolderPick().then(workspaceFolder => {
        if (workspaceFolder) {
            vscode_1.workspace
                .getConfiguration('lando-ui.workspaceFolder')
                .update('default', workspaceFolder.uri.fsPath, vscode_1.ConfigurationTarget.Workspace);
        }
    });
}
exports.pickWorkspaceFolder = pickWorkspaceFolder;
function restartWorkspaceFolderDependents(newWorkspaceFolder) {
    workspaceFolderPath = newWorkspaceFolder;
    startWatcher();
    checkLandoFileExists(workspaceFolderPath + '/.lando.yml');
}
exports.restartWorkspaceFolderDependents = restartWorkspaceFolderDependents;
function startWatcher() {
    if (exports.watcher) {
        exports.watcher.dispose();
    }
    exports.watcher = vscode_1.workspace.createFileSystemWatcher(workspaceFolderPath + '/*.yml');
    exports.watcher.onDidCreate(uri => {
        if (uri.fsPath.includes('.lando.yml')) {
            updateCurrentAppConfig(workspaceFolderPath + '/.lando.yml');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
            commands_1.setButtonTo('start');
            if (commands_1.checkAppRunning(currentAppName)) {
                commands_1.setButtonTo('stop');
            }
        }
    });
    exports.watcher.onDidChange(uri => {
        if (uri.fsPath.includes('.lando.yml')) {
            updateCurrentAppConfig(workspaceFolderPath + '/.lando.yml');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
            commands_1.setButtonTo('start');
            if (commands_1.checkAppRunning(currentAppName)) {
                commands_1.setButtonTo('stop');
            }
        }
    });
    exports.watcher.onDidDelete(uri => {
        if (!fs.existsSync(workspaceFolderPath + '/.lando.yml')) {
            commands_1.setButtonTo('init');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
        }
    });
}
exports.startWatcher = startWatcher;
function getCurrentAppConfig() {
    return landoAppConfig;
}
exports.getCurrentAppConfig = getCurrentAppConfig;
function getCurrentAppName() {
    return currentAppName;
}
exports.getCurrentAppName = getCurrentAppName;
function getWorkspaceFolderPath() {
    return workspaceFolderPath;
}
exports.getWorkspaceFolderPath = getWorkspaceFolderPath;
function getWorkspaceFolderNameFromPath() {
    var pathArray = getWorkspaceFolderPath().split('/');
    return pathArray[getWorkspaceFolderPath().split('/').length - 1];
}
exports.getWorkspaceFolderNameFromPath = getWorkspaceFolderNameFromPath;
function determineWorkspaceFolder() {
    var defaultWorkspaceFolderPath = vscode_1.workspace
        .getConfiguration('lando-ui.workspaceFolder')
        .get('default');
    if (defaultWorkspaceFolderPath != undefined && defaultWorkspaceFolderPath != '') {
        if (isWorkspaceFolder(defaultWorkspaceFolderPath)) {
            workspaceFolderPath = defaultWorkspaceFolderPath;
            if (!firstStart) {
                restartWorkspaceFolderDependents(defaultWorkspaceFolderPath);
            }
        }
        else if (Object.keys(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders : []).length > 1) {
            commands_1.setButtonTo('pick');
            vscode_1.window
                .showWarningMessage('Your current default Workspace folder does not exists in this Workspace. Please select one to be the default.', ...['Select Default Folder'])
                .then(selection => {
                if (selection == 'Select Default Folder') {
                    pickWorkspaceFolder();
                }
            });
        }
        else {
            workspaceFolderPath = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : '';
            if (defaultWorkspaceFolderPath != '') {
                vscode_1.workspace.getConfiguration('lando-ui.workspaceFolder').update('default', '', vscode_1.ConfigurationTarget.Workspace);
            }
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
        }
    }
    else if (Object.keys(vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders : []).length > 1) {
        commands_1.setButtonTo('pick');
        vscode_1.window
            .showWarningMessage('There are multiple Workspace folders detected. Please select one to be the default.', ...['Select Default Folder'])
            .then(selection => {
            if (selection == 'Select Default Folder') {
                pickWorkspaceFolder();
            }
        });
    }
    else {
        workspaceFolderPath = vscode_1.workspace.workspaceFolders ? vscode_1.workspace.workspaceFolders[0].uri.fsPath : '';
        if (defaultWorkspaceFolderPath != '') {
            vscode_1.workspace.getConfiguration('lando-ui.workspaceFolder').update('default', '', vscode_1.ConfigurationTarget.Workspace);
        }
        vscode_1.commands.executeCommand('lando-ui.info-refresh');
    }
}
exports.determineWorkspaceFolder = determineWorkspaceFolder;


/***/ }),

/***/ "./src/lando.ts":
/*!**********************!*\
  !*** ./src/lando.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const extension_1 = __webpack_require__(/*! ./extension */ "./src/extension.ts");
const child_process_1 = __webpack_require__(/*! child_process */ "child_process");
const json = __webpack_require__(/*! jsonc-parser */ "jsonc-parser");
const stripAnsi = __webpack_require__(/*! strip-ansi */ "./node_modules/strip-ansi/index.js");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands.ts");
const fs_1 = __webpack_require__(/*! fs */ "fs");
function init() {
    var terminal = vscode_1.window.createTerminal('Lando Init');
    terminal.show();
    terminal.sendText('lando init');
}
exports.init = init;
function start(dir) {
    commands_1.showOutput();
    const child = child_process_1.exec('lando start', { cwd: dir });
    child.stdout.on('data', data => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
            vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
            commands_1.setButtonTo('init');
        }
        if (data.includes('Starting app')) {
            vscode_1.window.showInformationMessage('Starting your Lando app');
            commands_1.setButtonTo('starting');
        }
        if (data.includes('Your app has started up correctly')) {
            vscode_1.window.showInformationMessage('Your Lando app started successfully');
            commands_1.setButtonTo('stop');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
            vscode_1.commands.executeCommand('lando-ui.list-refresh');
        }
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
        extension_1.outputChannel.appendLine('-----------------------');
        extension_1.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        extension_1.outputChannel.appendLine('-----------------------');
    });
}
exports.start = start;
function stop(dir, isCurrentApp = true) {
    commands_1.showOutput();
    const child = child_process_1.exec('lando stop', { cwd: dir });
    child.stdout.on('data', data => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
            vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
            if (isCurrentApp)
                commands_1.setButtonTo('init');
        }
        if (data.includes('Stopping app')) {
            vscode_1.window.showInformationMessage('Stopping your Lando app');
            if (isCurrentApp)
                commands_1.setButtonTo('stopping');
        }
        if (data.includes('App stopped')) {
            vscode_1.window.showInformationMessage('Your Lando app stopped successfully');
            if (isCurrentApp)
                commands_1.setButtonTo('start');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
            vscode_1.commands.executeCommand('lando-ui.list-refresh');
        }
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
        extension_1.outputChannel.appendLine('-----------------------');
        extension_1.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        extension_1.outputChannel.appendLine('-----------------------');
    });
}
exports.stop = stop;
function stopService(offset, provider) {
    var landoFile = '';
    var app = provider.getNode(offset);
    var service = provider.getNode(provider.getChildrenOffsets(app)[0]);
    provider.getChildrenOffsets(service).forEach((offset) => {
        var prop = provider.getNode(offset);
        if (prop.parent.children[0].value == 'src') {
            landoFile = provider.getNode(provider.getChildrenOffsets(prop)[0]).value;
        }
    });
    var appName = extension_1.getAppNameFromAppConfig(extension_1.getLandoFile(landoFile));
    var dir = landoFile.replace('/.lando.yml', '');
    stop(dir, appName == extension_1.getCurrentAppName());
}
exports.stopService = stopService;
function restart(dir) {
    commands_1.showOutput();
    const child = child_process_1.exec('lando restart', { cwd: dir });
    child.stdout.on('data', data => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
            vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
            commands_1.setButtonTo('init');
        }
        if (data.includes('just so we can start it up again')) {
            vscode_1.window.showInformationMessage('Restarting your Lando app');
            commands_1.setButtonTo('restarting');
        }
        if (data.includes('Your app has started up correctly')) {
            vscode_1.window.showInformationMessage('Your Lando app has restarted successfully');
            commands_1.setButtonTo('stop');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
            vscode_1.commands.executeCommand('lando-ui.list-refresh');
        }
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
        extension_1.outputChannel.appendLine('-----------------------');
        extension_1.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        extension_1.outputChannel.appendLine('-----------------------');
    });
}
exports.restart = restart;
function poweroff() {
    commands_1.showOutput();
    const child = child_process_1.exec('lando poweroff', { encoding: 'utf8' });
    child.stdout.on('data', data => {
        if (data.includes('Spinning Lando containers down')) {
            vscode_1.window.showInformationMessage('Powering off Lando');
        }
        if (data.includes('Lando containers have been spun down')) {
            vscode_1.window.showInformationMessage('Lando has been powered off successfully');
            commands_1.setButtonTo('start');
            vscode_1.commands.executeCommand('lando-ui.info-refresh');
            vscode_1.commands.executeCommand('lando-ui.list-refresh');
        }
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
        extension_1.outputChannel.appendLine('-----------------------');
        extension_1.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        extension_1.outputChannel.appendLine('-----------------------');
    });
}
exports.poweroff = poweroff;
function info(dir) {
    try {
        var stdout = child_process_1.execSync('lando info --format json', {
            cwd: dir,
            encoding: 'utf8'
        });
        return stdout;
    }
    catch (e) {
        if (e.toString().includes('Could not find app in this dir or a reasonable amount of directories above it') ||
            e.toString().includes("Cannot set property 'opts' of undefined")) {
            return '[]';
        }
        return '[]';
    }
}
exports.info = info;
function list() {
    var stdout = child_process_1.execSync('lando list --format json', { encoding: 'utf8' });
    return stdout;
}
exports.list = list;
function config() {
    var stdout = child_process_1.execSync('lando config --format json', { encoding: 'utf8' });
    return stdout;
}
exports.config = config;
function version() {
    var stdout = child_process_1.execSync('lando version', { encoding: 'utf8' });
    return stdout;
}
exports.version = version;
function dbExport(dir, host, filePath) {
    let command = 'lando db-export';
    if (host)
        command += ' -h ' + host;
    if (filePath)
        command += ' "' + filePath + '"';
    const child = child_process_1.exec(command, { cwd: dir });
    child.stdout.on('data', data => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
            vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
            commands_1.setButtonTo('init');
        }
        if (data.includes('Failed')) {
            vscode_1.window.showWarningMessage('Failed to export database from ' + host);
        }
        if (data.includes('Success')) {
            vscode_1.window.showInformationMessage('Successfully exported database from ' + host);
        }
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
        extension_1.outputChannel.appendLine('-----------------------');
        extension_1.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        extension_1.outputChannel.appendLine('-----------------------');
    });
}
exports.dbExport = dbExport;
function dbExportOut(dir, host) {
    let command = 'lando db-export --stdout';
    if (host)
        command += ' -h ' + host;
    var stdout = child_process_1.execSync(command, { encoding: 'utf8' });
    return stdout;
}
exports.dbExportOut = dbExportOut;
function dbImport(dir, host, noWipe, filePath, isTmp) {
    let command = 'lando db-import';
    if (host)
        command += ' -h ' + host;
    if (noWipe)
        command += ' --no-wipe';
    if (filePath)
        command += ' "' + filePath + '"';
    const child = child_process_1.exec(command, { cwd: dir });
    child.stdout.on('data', data => {
        if (data.includes('Could not find app in this dir or a reasonable amount of directories above it!')) {
            vscode_1.window.showWarningMessage('Please initiate a lando project: ' + data);
            commands_1.setButtonTo('init');
        }
        if (data.includes('not found')) {
            vscode_1.window.showWarningMessage('Failed to import database into ' + host);
        }
        if (data.includes('Preparing to import')) {
            vscode_1.window.showInformationMessage('Importing database into ' + host);
        }
        if (data.includes('Import complete')) {
            vscode_1.window.showInformationMessage('Successfully imported database to ' + host);
        }
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.stderr.on('data', data => {
        extension_1.outputChannel.append(`${stripAnsi.default(data)}`);
    });
    child.on('exit', (code, signal) => {
        extension_1.outputChannel.appendLine('-----------------------');
        extension_1.outputChannel.appendLine('child process exited with ' + `code ${code} and signal ${signal}`);
        extension_1.outputChannel.appendLine('-----------------------');
        if (isTmp) {
            fs_1.unlink(extension_1.getWorkspaceFolderPath() + '/' + filePath, err => {
                if (err) {
                    vscode_1.window.showErrorMessage('Failed to remove tmp import file');
                    extension_1.outputChannel.appendLine('-----------------------');
                    extension_1.outputChannel.appendLine('Failed to remove tmp import file: ' + err);
                    extension_1.outputChannel.appendLine('-----------------------');
                    return;
                }
            });
        }
    });
}
exports.dbImport = dbImport;
function sshService(offset, provider) {
    var treeItem = provider.getTreeItem(offset);
    var terminal = vscode_1.window.createTerminal('Lando ' + treeItem.label);
    terminal.show();
    terminal.sendText('lando ssh -s ' + treeItem.label);
}
exports.sshService = sshService;
function reformatInfo(info) {
    var newInfo = {};
    var infoJson = json.parse(info);
    infoJson.forEach((element) => {
        var service = element.service;
        delete element.service;
        newInfo['service_' + service] = element;
    });
    return JSON.stringify(newInfo);
}
exports.reformatInfo = reformatInfo;
function reformatList(list) {
    var listJson = json.parse(list);
    var prop;
    for (prop in listJson) {
        if (listJson.hasOwnProperty(prop)) {
            var services = {};
            listJson[prop].forEach((element) => {
                var service = element.service;
                delete element.service;
                services[service] = element;
            });
            listJson['service_' + prop] = services;
            delete listJson[prop];
        }
    }
    return JSON.stringify(listJson);
}
exports.reformatList = reformatList;


/***/ }),

/***/ "./src/landoInfoProvider.ts":
/*!**********************************!*\
  !*** ./src/landoInfoProvider.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const extension_1 = __webpack_require__(/*! ./extension */ "./src/extension.ts");
const lando_1 = __webpack_require__(/*! ./lando */ "./src/lando.ts");
const json = __webpack_require__(/*! jsonc-parser */ "jsonc-parser");
const commands_1 = __webpack_require__(/*! ./commands */ "./src/commands.ts");
class LandoInfoProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.text = '';
        this.tree = {};
        this.parseTree();
    }
    refresh(offset) {
        this.parseTree();
        if (offset) {
            this._onDidChangeTreeData.fire(offset);
        }
        else {
            this._onDidChangeTreeData.fire();
        }
    }
    parseTree() {
        this.text = lando_1.reformatInfo(lando_1.info(extension_1.getWorkspaceFolderPath()));
        if (Object.keys(json.parse(this.text)).length <= 0) {
            this.text = '["App Not Found"]';
        }
        else {
            this.text = commands_1.addWorkspaceFolderName(this.text);
        }
        this.tree = json.parseTree(this.text);
    }
    getNode(offset) {
        const path = json.getLocation(this.text, offset).path;
        return json.findNodeAtLocation(this.tree, path);
    }
    getChildren(offset) {
        if (offset) {
            const node = this.getNode(offset);
            return Promise.resolve(this.getChildrenOffsets(node));
        }
        else {
            return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
        }
    }
    getChildrenOffsets(node) {
        const offsets = [];
        if (node.children) {
            for (const child of node.children) {
                const childNode = this.getNode(child.offset);
                if (childNode) {
                    offsets.push(childNode.offset);
                }
            }
        }
        return offsets;
    }
    getTreeItem(offset) {
        const valueNode = this.getNode(offset);
        if (valueNode) {
            let hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
            let label = this.getLabel(valueNode);
            let treeItem = new vscode_1.TreeItem(label, hasChildren
                ? valueNode.type === 'object' || valueNode.type === 'array'
                    ? vscode_1.TreeItemCollapsibleState.Expanded
                    : vscode_1.TreeItemCollapsibleState.Collapsed
                : vscode_1.TreeItemCollapsibleState.None);
            if (label.match(/^service_/)) {
                treeItem.contextValue = 'service';
                treeItem.label = treeItem.label ? treeItem.label.replace(/^service_/, '') : treeItem.label;
            }
            else if (label.includes('http')) {
                treeItem.contextValue = 'link';
            }
            else {
                treeItem.contextValue = valueNode.type;
            }
            return treeItem;
        }
        return {};
    }
    getLabel(node) {
        if (node.parent) {
            if (node.parent.type === 'array') {
                let prefix = node.parent.children ? node.parent.children.indexOf(node).toString() : '';
                if (node.type === 'object') {
                    return prefix + ':{ }';
                }
                if (node.type === 'array') {
                    return prefix + ':[ ]';
                }
                return isNaN(prefix) ? prefix + ':' + node.value.toString() : node.value.toString();
            }
            else {
                const property = node.parent.children ? node.parent.children[0].value.toString() : '';
                if (node.type === 'object') {
                    // return '{ } ' + property;
                    return property;
                }
                if (node.type === 'array') {
                    return '[ ] ' + property;
                }
                const value = node.value.toString();
                return `${property}: ${value}`;
            }
        }
        return '';
    }
}
exports.LandoInfoProvider = LandoInfoProvider;


/***/ }),

/***/ "./src/landoListProvider.ts":
/*!**********************************!*\
  !*** ./src/landoListProvider.ts ***!
  \**********************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = __webpack_require__(/*! vscode */ "vscode");
const lando_1 = __webpack_require__(/*! ./lando */ "./src/lando.ts");
const json = __webpack_require__(/*! jsonc-parser */ "jsonc-parser");
class LandoListProvider {
    constructor(context) {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.text = '';
        this.tree = {};
        this.parseTree();
    }
    refresh(offset) {
        this.parseTree();
        if (offset) {
            this._onDidChangeTreeData.fire(offset);
        }
        else {
            this._onDidChangeTreeData.fire();
        }
    }
    parseTree() {
        this.text = lando_1.reformatList(lando_1.list());
        if (Object.keys(json.parse(this.text)).length <= 0)
            this.text = '["No Running Services"]';
        this.tree = json.parseTree(this.text);
    }
    getNode(offset) {
        const path = json.getLocation(this.text, offset).path;
        return json.findNodeAtLocation(this.tree, path);
    }
    getChildren(offset) {
        if (offset) {
            var node = this.getNode(offset);
            return Promise.resolve(this.getChildrenOffsets(node));
        }
        else {
            return Promise.resolve(this.tree ? this.getChildrenOffsets(this.tree) : []);
        }
    }
    getChildrenOffsets(node) {
        const offsets = [];
        if (node.children) {
            for (const child of node.children) {
                const childNode = this.getNode(child.offset);
                if (childNode) {
                    offsets.push(childNode.offset);
                }
            }
        }
        return offsets;
    }
    getTreeItem(offset) {
        const valueNode = this.getNode(offset);
        if (valueNode) {
            let hasChildren = valueNode.type === 'object' || valueNode.type === 'array';
            let label = this.getLabel(valueNode);
            let treeItem = new vscode_1.TreeItem(label, hasChildren
                ? valueNode.type === 'object'
                    ? vscode_1.TreeItemCollapsibleState.Expanded
                    : vscode_1.TreeItemCollapsibleState.Collapsed
                : vscode_1.TreeItemCollapsibleState.None);
            if (label.match(/^service_/)) {
                if (label.includes('_global_')) {
                    treeItem.contextValue = 'service';
                }
                else {
                    treeItem.contextValue = 'app';
                }
                treeItem.label = treeItem.label ? treeItem.label.replace(/^service_/, '') : treeItem.label;
            }
            else {
                treeItem.contextValue = valueNode.type;
            }
            // special cases
            if (treeItem.contextValue === 'app' || treeItem.contextValue === 'service') {
                treeItem.collapsibleState = vscode_1.TreeItemCollapsibleState.Collapsed;
            }
            return treeItem;
        }
        return {};
    }
    getLabel(node) {
        if (node.parent) {
            if (node.parent.type === 'array') {
                let prefix = node.parent.children ? node.parent.children.indexOf(node).toString() : '';
                if (node.type === 'object') {
                    return prefix + ':{ }';
                }
                if (node.type === 'array') {
                    return prefix + ':[ ]';
                }
                return isNaN(prefix) ? prefix + ':' + node.value.toString() : node.value.toString();
            }
            else {
                const property = node.parent.children ? node.parent.children[0].value.toString() : '';
                if (node.type === 'object') {
                    // return '{ } ' + property;
                    return property;
                }
                if (node.type === 'array') {
                    return '[ ] ' + property;
                }
                const value = node.value;
                return `${property}: ${value}`;
            }
        }
        return '';
    }
}
exports.LandoListProvider = LandoListProvider;


/***/ }),

/***/ "child_process":
/*!********************************!*\
  !*** external "child_process" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("child_process");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "jsonc-parser":
/*!*******************************!*\
  !*** external "jsonc-parser" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("jsonc-parser");

/***/ }),

/***/ "os":
/*!*********************!*\
  !*** external "os" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("os");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("util");

/***/ }),

/***/ "vscode":
/*!*************************!*\
  !*** external "vscode" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("vscode");

/***/ }),

/***/ "zlib":
/*!***********************!*\
  !*** external "zlib" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("zlib");

/***/ })

/******/ });
//# sourceMappingURL=extension.js.map