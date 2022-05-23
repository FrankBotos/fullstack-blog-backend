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
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/graphpack/config/index.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/config/index.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const cosmiconfig = __webpack_require__(/*! cosmiconfig */ "cosmiconfig");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const defaultConfig = __webpack_require__(/*! ./webpack.config */ "./node_modules/graphpack/config/webpack.config.js");

const explorer = cosmiconfig('graphpack').search();

const loadServerConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};
  return {
    port: Number(process.env.PORT),
    ...userConfig.server
  };
};

const loadWebpackConfig = async () => {
  const result = await explorer;
  const userConfig = result ? typeof result.config === 'function' ? result.config(defaultConfig.mode) : result.config : {};

  if (typeof userConfig.webpack === 'function') {
    return userConfig.webpack({
      config: defaultConfig,
      webpack
    });
  }

  return { ...defaultConfig,
    ...userConfig.webpack
  };
};

exports.loadServerConfig = loadServerConfig;
exports.loadWebpackConfig = loadWebpackConfig;

/***/ }),

/***/ "./node_modules/graphpack/config/webpack.config.js":
/*!*********************************************************!*\
  !*** ./node_modules/graphpack/config/webpack.config.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

const FriendlyErrorsWebpackPlugin = __webpack_require__(/*! friendly-errors-webpack-plugin */ "friendly-errors-webpack-plugin");

const fs = __webpack_require__(/*! fs */ "fs");

const path = __webpack_require__(/*! path */ "path");

const webpack = __webpack_require__(/*! webpack */ "webpack");

const nodeExternals = __webpack_require__(/*! webpack-node-externals */ "webpack-node-externals");

const isDev = "development" !== 'production';
const isWebpack = typeof __webpack_require__.m === 'object';
const hasBabelRc = fs.existsSync(path.resolve('babel.config.js'));

if (hasBabelRc && !isWebpack) {
  console.info('🐠 Using babel.config.js defined in your app root');
}

module.exports = {
  devtool: 'source-map',
  entry: {
    // We take care of setting up entry file under lib/index.js
    index: ['graphpack']
  },
  // When bundling with Webpack for the backend you usually don't want to bundle
  // its node_modules dependencies. This creates an externals function that
  // ignores node_modules when bundling in Webpack.
  externals: [nodeExternals({
    whitelist: [/^graphpack$/]
  })],
  mode: isDev ? 'development' : 'production',
  module: {
    rules: [{
      test: /\.(gql|graphql)/,
      use: 'graphql-tag/loader'
    }, {
      test: /\.(js|ts)$/,
      use: [{
        loader: /*require.resolve*/(/*! babel-loader */ "babel-loader"),
        options: {
          babelrc: true,
          cacheDirectory: true,
          presets: hasBabelRc ? undefined : [/*require.resolve*/(/*! babel-preset-graphpack */ "babel-preset-graphpack")]
        }
      }]
    }, {
      test: /\.mjs$/,
      type: 'javascript/auto'
    }]
  },
  node: {
    __filename: true,
    __dirname: true
  },
  optimization: {
    noEmitOnErrors: true
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'commonjs2',
    path: path.join(process.cwd(), './build'),
    sourceMapFilename: '[name].map'
  },
  performance: {
    hints: false
  },
  plugins: [new webpack.optimize.LimitChunkCountPlugin({
    maxChunks: 1
  }), new webpack.EnvironmentPlugin({
    DEBUG: false,
    GRAPHPACK_SRC_DIR: path.resolve(process.cwd(), 'src'),
    NODE_ENV: 'development'
  }), new FriendlyErrorsWebpackPlugin({
    clearConsole: isDev
  })],
  resolve: {
    extensions: ['.ts', '.js']
  },
  stats: 'minimal',
  target: 'node'
};

/***/ }),

/***/ "./node_modules/graphpack/lib/server.js":
/*!**********************************************!*\
  !*** ./node_modules/graphpack/lib/server.js ***!
  \**********************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! apollo-server */ "apollo-server");
/* harmony import */ var apollo_server__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(apollo_server__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! apollo-server-express */ "apollo-server-express");
/* harmony import */ var apollo_server_express__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(apollo_server_express__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _srcFiles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./srcFiles */ "./node_modules/graphpack/lib/srcFiles.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../config */ "./node_modules/graphpack/config/index.js");
/* harmony import */ var _config__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_config__WEBPACK_IMPORTED_MODULE_3__);





if (!(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"] && Object.keys(_srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"]).length > 0)) {
  throw Error(`Couldn't find any resolvers. Please add resolvers to your src/resolvers.js`);
}

const createServer = config => {
  const {
    applyMiddleware,
    port: serverPort,
    ...options
  } = config;
  const port = Number(process.env.PORT) || serverPort || 4000; // Pull out fields that are not relevant for the apollo server
  // Use apollo-server-express when middleware detected

  if (applyMiddleware && applyMiddleware.app && typeof applyMiddleware.app.listen === 'function') {
    const server = new apollo_server_express__WEBPACK_IMPORTED_MODULE_1__["ApolloServer"](options);
    server.applyMiddleware(applyMiddleware);
    return applyMiddleware.app.listen({
      port
    }, () => console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`));
  } // Use apollo-server


  const server = new apollo_server__WEBPACK_IMPORTED_MODULE_0__["ApolloServer"](options);
  return server.listen({
    port
  }).then(({
    url
  }) => console.log(`🚀 Server ready at ${url}`));
};

const startServer = async () => {
  // Load server config from graphpack.config.js
  const config = await Object(_config__WEBPACK_IMPORTED_MODULE_3__["loadServerConfig"])();
  createServer({ ...config,
    context: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["context"],
    resolvers: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["resolvers"],
    typeDefs: _srcFiles__WEBPACK_IMPORTED_MODULE_2__["typeDefs"]
  });
};

startServer();

/***/ }),

/***/ "./node_modules/graphpack/lib/srcFiles.js":
/*!************************************************!*\
  !*** ./node_modules/graphpack/lib/srcFiles.js ***!
  \************************************************/
/*! exports provided: importFirst, context, resolvers, typeDefs */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "importFirst", function() { return importFirst; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "context", function() { return context; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resolvers", function() { return resolvers; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "typeDefs", function() { return typeDefs; });
const importFirst = req => req.keys().map(mod => req(mod).default || req(mod))[0]; // Optionally import modules

const context = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$"));
const resolvers = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$"));
const typeDefs = importFirst(__webpack_require__("./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$"));

/***/ }),

/***/ "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$":
/*!**********************************************************!*\
  !*** ./src sync ^\.\/(context|context\/index)\.(js|ts)$ ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

function webpackEmptyContext(req) {
	var e = new Error("Cannot find module '" + req + "'");
	e.code = 'MODULE_NOT_FOUND';
	throw e;
}
webpackEmptyContext.keys = function() { return []; };
webpackEmptyContext.resolve = webpackEmptyContext;
module.exports = webpackEmptyContext;
webpackEmptyContext.id = "./src sync recursive ^\\.\\/(context|context\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$":
/*!**************************************************************!*\
  !*** ./src sync ^\.\/(resolvers|resolvers\/index)\.(js|ts)$ ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./resolvers.js": "./src/resolvers.js"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(resolvers|resolvers\\/index)\\.(js|ts)$";

/***/ }),

/***/ "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$":
/*!********************************************************************!*\
  !*** ./src sync ^\.\/(schema|schema\/index)\.(gql|graphql|js|ts)$ ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var map = {
	"./schema.graphql": "./src/schema.graphql"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src sync recursive ^\\.\\/(schema|schema\\/index)\\.(gql|graphql|js|ts)$";

/***/ }),

/***/ "./src/db.js":
/*!*******************!*\
  !*** ./src/db.js ***!
  \*******************/
/*! exports provided: users, posts, comments, bookmarks, favoriteUsers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "users", function() { return users; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "posts", function() { return posts; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "comments", function() { return comments; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "bookmarks", function() { return bookmarks; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "favoriteUsers", function() { return favoriteUsers; });
let users = [{
  id: 1,
  name: "John Doe",
  email: "john@gmail.com",
  age: 22,
  uniquenickname: "john-doe",
  password: 'placeholder'
}, {
  id: 2,
  name: "Jane Doe",
  email: "jane@gmail.com",
  age: 23,
  uniquenickname: "jane-doe",
  password: 'placeholder'
}, {
  id: 3,
  name: "Person Three",
  email: "personthree@gmail.com",
  age: 25,
  uniquenickname: "person-three",
  password: 'placeholder'
}];
let posts = [{
  id: 1,
  userid: 2,
  title: "Blog Post 1",
  content: "This is content for blog post 1",
  slug: "blog-post-1",
  lastupdate: "Wed May 11 2022",
  views: 125
}, {
  id: 2,
  userid: 2,
  title: "Blog Post 2",
  content: "This is content for blog post 2",
  slug: "blog-post-2",
  lastupdate: "Sat May 14 2022",
  views: 0
}, {
  id: 3,
  userid: 3,
  title: "Blog Post 3",
  content: "This is content for blog post 3",
  slug: "blog-post-3",
  lastupdate: "Wed May 11 2022",
  views: 0
}, {
  id: 4,
  userid: 3,
  title: "Test Post",
  content: "This is content for blog post 4",
  slug: "test-post",
  lastupdate: "Sun May 15 2022",
  views: 0
}, {
  id: 5,
  userid: 3,
  title: "ASDF Post",
  content: "This is content for blog post 5",
  slug: "asdf-post",
  lastupdate: "Wed May 11 2022",
  views: 0
}, {
  id: 6,
  userid: 2,
  title: "Another Entry",
  content: "This is content for blog post 6",
  slug: "another-entry",
  lastupdate: "Sat May 21 2022",
  views: 0
}];
let comments = [{
  id: 1,
  userid: 2,
  postid: 5,
  content: "This is content for comment 1",
  lastupdate: "Wed May 11 2022"
}, {
  id: 2,
  userid: 2,
  postid: 3,
  content: "This is content for comment 2",
  lastupdate: "Sat May 14 2022"
}, {
  id: 3,
  userid: 3,
  postid: 2,
  content: "This is content for comment 3",
  lastupdate: "Sun May 15 2022"
}, {
  id: 4,
  userid: 3,
  postid: 1,
  content: "This is content for comment 4",
  lastupdate: "Wed May 11 2022"
}, {
  id: 5,
  userid: 1,
  postid: 1,
  content: "This is content for comment 5",
  lastupdate: "Wed May 10 2022"
}, {
  id: 6,
  userid: 2,
  postid: 1,
  content: "This is content for comment 6",
  lastupdate: "Wed May 11 2022"
}, {
  id: 7,
  userid: 1,
  postid: 1,
  content: "This is content for comment 7",
  lastupdate: "Wed May 12 2022"
}];
let bookmarks = [{
  id: 1,
  userid: 1,
  postid: 2
}, {
  id: 2,
  userid: 1,
  postid: 3
}, {
  id: 3,
  userid: 2,
  postid: 5
}, {
  id: 4,
  userid: 2,
  postid: 2
}];
let favoriteUsers = [{
  id: 1,
  userid: 1,
  favoriteuserid: 2
}, {
  id: 2,
  userid: 1,
  favoriteuserid: 3
}, {
  id: 3,
  userid: 2,
  favoriteuserid: 3
}, {
  id: 4,
  userid: 2,
  favoriteuserid: 1
}];

/***/ }),

/***/ "./src/resolvers.js":
/*!**************************!*\
  !*** ./src/resolvers.js ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _db__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./db */ "./src/db.js");


const bcrypt = __webpack_require__(/*! bcrypt */ "bcrypt");

const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';
var hashToCompare = null;
bcrypt.hash(myPlaintextPassword, saltRounds, function (err, hash) {// Store hash in your password DB.
  //console.log(hash)
  //hashToCompare = hash;
}); // Load hash from your password DB.

bcrypt.compare(myPlaintextPassword, hashToCompare, function (err, result) {// result == true
  //console.log('match')
});
bcrypt.compare(someOtherPlaintextPassword, hashToCompare, function (err, result) {// result == false
  //console.log('not match')
}); //manually hash passwords for hardcoded users, so we have initial data to work with
//for new users, this process takes place in "createuser"

_db__WEBPACK_IMPORTED_MODULE_0__["users"].map(user => {
  if (user.password == "placeholder") {
    bcrypt.hash(user.password, saltRounds, function (err, hash) {
      user.password = hash;
    });
  }
});
const resolvers = {
  Query: {
    user: (parent, {
      id
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["users"].find(user => user.id == id);
    },
    users: (parent, args, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["users"];
    },
    userslug: (parent, {
      slug
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["users"].find(user => user.uniquenickname == slug);
    },
    post: (parent, {
      id
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["posts"].find(post => post.id == id);
    },
    postslug: (parent, {
      slug
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["posts"].find(post => post.slug == slug);
    },
    postuserid: (parent, {
      userid
    }, context, info) => {
      //console.log(posts.filter(post => post.userid == userid))
      return _db__WEBPACK_IMPORTED_MODULE_0__["posts"].filter(post => post.userid == userid);
    },
    posts: (parent, args, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["posts"];
    },
    comments: (parent, args, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["comments"];
    },
    commentsbypostid: (parent, {
      postid
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["comments"].filter(comment => comment.postid == postid);
    },
    bookmarks: (parent, {
      userid
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].filter(bookmark => bookmark.userid == userid);
    },
    favoriteusers: (parent, {
      userid
    }, context, info) => {
      return _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].filter(favUser => favUser.userid == userid);
    },
    userLogin: async (parent, {
      username,
      password
    }, context, info) => {
      var index = _db__WEBPACK_IMPORTED_MODULE_0__["users"].findIndex(user => user.uniquenickname == username);

      if (index != -1) {
        const res = await bcrypt.compare(password, _db__WEBPACK_IMPORTED_MODULE_0__["users"].at(index).password);

        if (res != true) {
          throw new Error("Inccorect pass!");
        }
      } else {
        throw new Error("That user does not exist!");
      } //if we passed all checks, user is logged in, and we return user info


      return _db__WEBPACK_IMPORTED_MODULE_0__["users"].at(index);
    }
  },
  Mutation: {
    createUser: (parent, {
      id,
      name,
      email,
      age,
      uniquenickname,
      password
    }, context, info) => {
      const newUser = {
        id,
        name,
        email,
        age,
        uniquenickname,
        password
      };
      _db__WEBPACK_IMPORTED_MODULE_0__["users"].map(user => {
        if (newUser.uniquenickname == user.uniquenickname) {
          throw new Error("Sorry, a user with that unique url already exists.");
        }
      });
      _db__WEBPACK_IMPORTED_MODULE_0__["users"].push(newUser); //find new user by id, and hash the password

      _db__WEBPACK_IMPORTED_MODULE_0__["users"].forEach(user => {
        if (user.id == id) {
          bcrypt.hash(user.password, saltRounds, function (err, hash) {
            user.password = hash;
          });
        }
      });
      return newUser;
    },
    updateUser: (parent, {
      id,
      name,
      email,
      age
    }, context, info) => {
      let newUser = _db__WEBPACK_IMPORTED_MODULE_0__["users"].find(user => user.id === id);
      newUser.name = name;
      newUser.email = email;
      newUser.age = age;
      return newUser;
    },
    deleteUser: (parent, {
      id
    }, context, info) => {
      const userIndex = _db__WEBPACK_IMPORTED_MODULE_0__["users"].findIndex(user => user.id == id); //console.log(userIndex);

      if (userIndex === -1) throw new Error("User not found.");

      async function deleteAssociatedData() {
        //if a user is deleted, delete their bookmarks, their posts, their comments, and their favorited users
        //1.delete all associated bookmarks (bookmarks belonging to deleted user, and bookmarks belonging to other users, who bookmarked deleted user's posts)
        const userPosts = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].filter(post => {
          return post.userid == id;
        });
        var bookmarksAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].filter(bm => {
          //first we remove all bookmarks saved by the user about to be deleted
          return bm.userid != id;
        }); //next we iterate through deleted user's posts, and delete all bookmarks related to that post

        userPosts.forEach(post => {
          bookmarksAfterDelete = bookmarksAfterDelete.filter(bookmark => {
            return bookmark.postid != post.id;
          });
        }); //lastly we update the original bookmark list with our filtered values

        _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].splice(0, _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].length, ...bookmarksAfterDelete); //2.delete associated favorites (favorites belonging to the deleted user, and favorites beloning to other users, who favorited to be deleted user)

        var favsAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].filter(fav => {
          //delete favorite users beloning to user about to be deleted
          return fav.userid != id;
        });
        favsAfterDelete = favsAfterDelete.filter(fav => {
          //delete user from other users' favorite lists
          return fav.favoriteuserid != id;
        }); //update favorites list with new values

        _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].splice(0, _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].length, ...favsAfterDelete); //3.delete all comments made by user, and all comments made by other users on their posts

        var commentsAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["comments"].filter(comment => {
          return comment.userid != id;
        });
        userPosts.forEach(post => {
          commentsAfterDelete = commentsAfterDelete.filter(comment => {
            return comment.postid != post.id;
          });
        }); //update with new values

        _db__WEBPACK_IMPORTED_MODULE_0__["comments"].splice(0, _db__WEBPACK_IMPORTED_MODULE_0__["comments"].length, ...commentsAfterDelete); //4.finally, we delete the user's posts

        var postsAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].filter(post => {
          return post.userid != id;
        });
        _db__WEBPACK_IMPORTED_MODULE_0__["posts"].splice(0, _db__WEBPACK_IMPORTED_MODULE_0__["posts"].length, ...postsAfterDelete); //console.log(posts);
      }

      deleteAssociatedData();
      const deletedUsers = _db__WEBPACK_IMPORTED_MODULE_0__["users"].splice(userIndex, 1);
      return deletedUsers[0];
    },
    createPost: (parent, {
      id,
      userid,
      title,
      content,
      slug
    }, context, info) => {
      var lastupdate = new Date(Date.now()).toDateString(); //console.log(updateTime);
      //console.log('ran with' + content);

      var views = 0;
      const newPost = {
        id,
        userid,
        title,
        content,
        slug,
        lastupdate,
        views
      };
      const userPosts = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].filter(blogpost => {
        return blogpost.userid == userid;
      });
      userPosts.map(blogpost => {
        if (blogpost.slug == slug) {
          throw new Error("Please use a unique post title.");
        }
      });
      _db__WEBPACK_IMPORTED_MODULE_0__["posts"].push(newPost);
      return newPost;
    },
    updatePost: (parent, {
      id,
      title,
      content,
      slug
    }, context, info) => {
      var lastupdate = new Date(Date.now()).toDateString(); //console.log('ran update with' + id + ' ' + content + ' ' + slug);

      let newPost = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].find(post => post.id == id);
      const userPosts = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].filter(blogpost => {
        return blogpost.userid == newPost.userid;
      });
      const userPostsMinusCurrent = userPosts.filter(blogpost => {
        return blogpost.slug != newPost.slug;
      });
      userPostsMinusCurrent.map(blogpost => {
        if (blogpost.slug == slug) {
          throw new Error("A previous post has that title! Please use a unique post title.");
        }
      });
      newPost.title = title;
      newPost.content = content;
      newPost.slug = slug;
      newPost.lastupdate = lastupdate;
      return newPost;
    },
    deletePost: (parent, {
      id
    }, context, info) => {
      //when a post is deleted, we must also delete all bookmarks referencing that post, and all comments for that post
      var bookmarksAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].filter(bookmark => {
        return bookmark.postid != id;
      });
      _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].splice(0, _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].length, ...bookmarksAfterDelete);
      var commentsAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["comments"].filter(comment => {
        return comment.postid != id;
      });
      _db__WEBPACK_IMPORTED_MODULE_0__["comments"].splice(0, _db__WEBPACK_IMPORTED_MODULE_0__["comments"].length, ...commentsAfterDelete);
      const postIndex = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].findIndex(post => post.id == id);
      if (postIndex === -1) throw new Error("Post not found.");
      const deletedPosts = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].splice(postIndex, 1);
      return deletedPosts[0];
    },
    createComment: (parent, {
      id,
      userid,
      postid,
      content
    }, context, info) => {
      var lastupdate = new Date(Date.now()).toDateString(); //console.log(updateTime);
      //console.log('ran with' + content);

      const newComment = {
        id,
        userid,
        postid,
        content,
        lastupdate
      };
      _db__WEBPACK_IMPORTED_MODULE_0__["comments"].push(newComment);
      return newComment;
    },
    deleteComment: (parent, {
      id
    }, context, info) => {
      const commentIndex = _db__WEBPACK_IMPORTED_MODULE_0__["comments"].findIndex(comment => comment.id == id);
      if (commentIndex === -1) throw new Error("Comment not found.");
      const deletedComments = _db__WEBPACK_IMPORTED_MODULE_0__["comments"].splice(commentIndex, 1);
      return deletedComments[0];
    },
    incrementViews: (parent, {
      postid
    }, context, info) => {
      const postRef = _db__WEBPACK_IMPORTED_MODULE_0__["posts"].find(post => post.id == postid);
      postRef.views++;
      return postRef;
    },
    createBookmark: (parent, {
      id,
      userid,
      postid
    }, context, info) => {
      const newBookmark = {
        id,
        userid,
        postid
      };
      _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].push(newBookmark);
      return newBookmark;
    },
    deleteBookmark: (parent, {
      id
    }, context, info) => {
      const bmIndex = _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].findIndex(bm => bm.id == id); //console.log(bmIndex);

      if (bmIndex === -1) throw new Error("Bookmark not found.");
      const bookmarksAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["bookmarks"].splice(bmIndex, 1);
      return bookmarksAfterDelete[0];
    },
    deleteFavoriteUser: (parent, {
      id
    }, context, info) => {
      const favIndex = _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].findIndex(fav => fav.id == id); //console.log(bmIndex);

      if (favIndex === -1) throw new Error("Favorite user not found.");
      const favoriteUsersAfterDelete = _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].splice(favIndex, 1);
      return favoriteUsersAfterDelete[0];
    },
    createFavoriteUser: (parent, {
      id,
      userid,
      favoriteuserid
    }, context, info) => {
      const newFav = {
        id,
        userid,
        favoriteuserid
      };
      _db__WEBPACK_IMPORTED_MODULE_0__["favoriteUsers"].push(newFav);
      return newFav;
    }
  }
};
/* harmony default export */ __webpack_exports__["default"] = (resolvers);

/***/ }),

/***/ "./src/schema.graphql":
/*!****************************!*\
  !*** ./src/schema.graphql ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {


    var doc = {"kind":"Document","definitions":[{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"User"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"name"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"email"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"age"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"uniquenickname"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"password"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Post"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"title"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"slug"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastupdate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"views"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Comment"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"postid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"content"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"lastupdate"},"arguments":[],"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Bookmark"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"postid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"FavoriteUser"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"id"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"favoriteuserid"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Query"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"users"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"user"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userslug"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"slug"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"posts"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"post"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"postslug"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"slug"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"postuserid"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"comments"},"arguments":[],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"commentsbypostid"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"bookmarks"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"favoriteusers"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"ListType","type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FavoriteUser"}}}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"userLogin"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"username"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]}]},{"kind":"ObjectTypeDefinition","name":{"kind":"Name","value":"Mutation"},"interfaces":[],"directives":[],"fields":[{"kind":"FieldDefinition","name":{"kind":"Name","value":"createUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"age"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"uniquenickname"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"password"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updateUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"name"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"email"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"age"},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Int"}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"User"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createPost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"slug"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"updatePost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"title"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"slug"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deletePost"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"content"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteComment"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Comment"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"incrementViews"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NamedType","name":{"kind":"Name","value":"Post"}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createBookmark"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"postid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteBookmark"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"Bookmark"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"createFavoriteUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"userid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]},{"kind":"InputValueDefinition","name":{"kind":"Name","value":"favoriteuserid"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FavoriteUser"}}},"directives":[]},{"kind":"FieldDefinition","name":{"kind":"Name","value":"deleteFavoriteUser"},"arguments":[{"kind":"InputValueDefinition","name":{"kind":"Name","value":"id"},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}},"directives":[]}],"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"FavoriteUser"}}},"directives":[]}]}],"loc":{"start":0,"end":1769}};
    doc.loc.source = {"body":"type User {\r\n  id: ID!\r\n  name: String!\r\n  email: String!\r\n  age: Int\r\n  uniquenickname: String!\r\n  password: String!\r\n}\r\n\r\ntype Post {\r\n  id: ID!\r\n  userid: ID!\r\n  title: String!\r\n  content: String!\r\n  slug: String!\r\n  lastupdate: String\r\n  views: Int\r\n}\r\n\r\ntype Comment {\r\n  id: ID!\r\n  userid: ID!\r\n  postid: ID!\r\n  content: String!\r\n  lastupdate: String\r\n}\r\n\r\ntype Bookmark {\r\n  id: ID!\r\n  userid: ID!\r\n  postid: ID!\r\n}\r\n\r\ntype FavoriteUser {\r\n  id: ID!\r\n  userid: ID!\r\n  favoriteuserid: ID!\r\n}\r\n\r\ntype Query {\r\n  users: [User!]!\r\n  user(id: ID!): User!\r\n  userslug(slug: String!): User!\r\n\r\n  posts: [Post!]!\r\n  post(id: ID!): Post!\r\n  postslug(slug: String!): Post!\r\n  postuserid(userid: ID!): [Post!]!\r\n\r\n  comments: [Comment!]!\r\n  commentsbypostid(postid: ID!): [Comment!]!\r\n\r\n  bookmarks(userid: ID!): [Bookmark!]!\r\n  favoriteusers(userid: ID!) : [FavoriteUser!]!\r\n\r\n  userLogin(username: String!, password: String!): User!\r\n\r\n\r\n}\r\n\r\ntype Mutation {\r\n  createUser(id: ID!, name: String!, email: String!, age: Int, uniquenickname: String!, password: String!): User!\r\n  updateUser(id: ID!, name: String, email: String, age: Int): User!\r\n  deleteUser(id: ID!): User!\r\n\r\n\r\n  createPost(id: ID!, userid: ID!, title: String!, content: String!, slug: String!): Post!\r\n  updatePost(id: ID!, title: String!, content: String!, slug: String!): Post!\r\n  deletePost(id: ID!): Post!\r\n\r\n  createComment(id: ID!, userid: ID!, postid: ID!, content: String!): Comment!\r\n  deleteComment(id: ID!): Comment!\r\n\r\n  incrementViews(postid: ID!): Post\r\n\r\n  createBookmark(id: ID!, userid: ID!, postid: ID!): Bookmark!\r\n  deleteBookmark(id: ID!): Bookmark!\r\n\r\n  createFavoriteUser(id: ID!, userid: ID!, favoriteuserid: ID!): FavoriteUser!\r\n  deleteFavoriteUser(id: ID!): FavoriteUser!\r\n}\r\n","name":"GraphQL request","locationOffset":{"line":1,"column":1}};
  

    var names = {};
    function unique(defs) {
      return defs.filter(
        function(def) {
          if (def.kind !== 'FragmentDefinition') return true;
          var name = def.name.value
          if (names[name]) {
            return false;
          } else {
            names[name] = true;
            return true;
          }
        }
      )
    }
  

      module.exports = doc;
    


/***/ }),

/***/ 0:
/*!***********************!*\
  !*** multi graphpack ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! graphpack */"./node_modules/graphpack/lib/server.js");


/***/ }),

/***/ "apollo-server":
/*!********************************!*\
  !*** external "apollo-server" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server");

/***/ }),

/***/ "apollo-server-express":
/*!****************************************!*\
  !*** external "apollo-server-express" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("apollo-server-express");

/***/ }),

/***/ "babel-loader":
/*!*******************************!*\
  !*** external "babel-loader" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-loader");

/***/ }),

/***/ "babel-preset-graphpack":
/*!*****************************************!*\
  !*** external "babel-preset-graphpack" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("babel-preset-graphpack");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("bcrypt");

/***/ }),

/***/ "cosmiconfig":
/*!******************************!*\
  !*** external "cosmiconfig" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("cosmiconfig");

/***/ }),

/***/ "friendly-errors-webpack-plugin":
/*!*************************************************!*\
  !*** external "friendly-errors-webpack-plugin" ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("friendly-errors-webpack-plugin");

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),

/***/ "webpack":
/*!**************************!*\
  !*** external "webpack" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack");

/***/ }),

/***/ "webpack-node-externals":
/*!*****************************************!*\
  !*** external "webpack-node-externals" ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("webpack-node-externals");

/***/ })

/******/ });
//# sourceMappingURL=index.map