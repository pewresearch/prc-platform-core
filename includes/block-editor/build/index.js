/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/post-preview-publish-hook.js":
/*!******************************************!*\
  !*** ./src/post-preview-publish-hook.js ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ postPreviewPublishHook)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./regenerate-toc-action */ "./src/regenerate-toc-action.js");
/**
 * WordPress Dependencies
 */


/**
 * Internal Dependencies
 */
// Actions:

// import GenerateChartImages from './generate-chart-images';

const actions = {
  post: {
    preview: {
      start: [_regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__["default"]],
      end: []
    },
    publish: {
      start: [_regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__["default"]],
      end: []
    }
  },
  // chart: {
  // 	preview: {
  // 		start: [GenerateChartImages],
  // 		end: [],
  // 	},
  // 	publish: {
  // 		start: [GenerateChartImages],
  // 		end: [],
  // 	},
  // },
  'fact-sheet': {
    preview: {
      start: [_regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__["default"]],
      end: []
    },
    publish: {
      start: [_regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__["default"]],
      end: []
    }
  },
  'mini-course': {
    preview: {
      start: [_regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__["default"]],
      end: []
    },
    publish: {
      start: [_regenerate_toc_action__WEBPACK_IMPORTED_MODULE_1__["default"]],
      end: []
    }
  }
};
function startPreview(postId, postType) {
  if (!actions[postType]) {
    return;
  }
  if (actions[postType].preview.start && actions[postType].preview.start.length) {
    actions[postType].preview.start.forEach(action => {
      action(postId);
    });
  }
}
function endPreview(postId, postType) {
  if (!actions[postType]) {
    return;
  }
  if (actions[postType].preview.end && actions[postType].preview.end.length) {
    actions[postType].preview.end.forEach(action => {
      action(postId);
    });
  }
}
function startPublish(postId, postType) {
  if (!actions[postType]) {
    return;
  }
  if (actions[postType].publish.start && actions[postType].publish.start.length) {
    actions[postType].publish.start.forEach(action => {
      action(postId);
    });
  }
}
function endPublish(postId, postType) {
  if (!actions[postType]) {
    return;
  }
  if (actions[postType].publish.end && actions[postType].publish.end.length) {
    actions[postType].publish.end.forEach(action => {
      action(postId);
    });
  }
}
function watcher() {
  console.log('prc-platform/post-preview-publish-hook: watcher activating');
  // Setup simple functions to get the current status of the post:
  const getPostPreviewStatus = () => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor').isPreviewingPost();
  const getPostPublishStatus = () => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor').isPublishingPost();
  const getPostAutosaveStatus = () => (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor').isAutosavingPost();

  // Set initial values to compare against:
  let previewStatus = getPostPreviewStatus();
  let publishStatus = getPostPublishStatus();
  let autosaveStatus = getPostAutosaveStatus();
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.subscribe)(() => {
    // Get current values:
    const postId = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor').getCurrentPostId();
    const postType = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_0__.select)('core/editor').getCurrentPostType();
    const newPostPreviewStatus = getPostPreviewStatus();
    const newPostPublishStatus = getPostPublishStatus();
    const newPostAutosaveStatus = getPostAutosaveStatus();
    if (previewStatus !== newPostPreviewStatus) {
      console.log('start preview', postId, postType);
      startPreview(postId, postType);
    }
    if (publishStatus !== newPostPublishStatus) {
      console.log('start publish', postId, postType);
      startPublish(postId, postType);
    }
    if (autosaveStatus !== newPostAutosaveStatus) {
      console.log('autosave', postId, postType);
    }
    if (previewStatus && !newPostPreviewStatus) {
      console.log('end preview', postId, postType);
      endPreview(postId, postType);
    }
    if (publishStatus && !newPostPublishStatus) {
      console.log('end publish', postId, postType);
      endPublish(postId, postType);
    }

    // Store new values back:
    previewStatus = newPostPreviewStatus;
    publishStatus = newPostPublishStatus;
    autosaveStatus = newPostAutosaveStatus;
  });
}
function postPreviewPublishHook() {
  watcher();
}

/***/ }),

/***/ "./src/regenerate-toc-action.js":
/*!**************************************!*\
  !*** ./src/regenerate-toc-action.js ***!
  \**************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ regenerateToc)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_1__);
/**
 * WordPress Dependencies
 */


function regenerateToc(postId) {
  const path = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_1__.addQueryArgs)('/prc-api/v3/report-package/regenerate-toc', {
    post_id: postId
  });
  return new Promise((resolve, reject) => {
    _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path,
      method: 'POST'
    }).then(response => {
      console.log('Regenerate TOC response', response);
      resolve(response);
    }).catch(error => {
      console.error('Regenerate TOC error', error);
      reject(error);
    });
  });
}

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/dom-ready":
/*!**********************************!*\
  !*** external ["wp","domReady"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["domReady"];

/***/ }),

/***/ "@wordpress/hooks":
/*!*******************************!*\
  !*** external ["wp","hooks"] ***!
  \*******************************/
/***/ ((module) => {

module.exports = window["wp"]["hooks"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ ((module) => {

module.exports = window["wp"]["url"];

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	(() => {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = (module) => {
/******/ 			var getter = module && module.__esModule ?
/******/ 				() => (module['default']) :
/******/ 				() => (module);
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/dom-ready */ "@wordpress/dom-ready");
/* harmony import */ var _wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/hooks */ "@wordpress/hooks");
/* harmony import */ var _wordpress_hooks__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _post_preview_publish_hook__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./post-preview-publish-hook */ "./src/post-preview-publish-hook.js");

/**
 * WordPress Dependencies:
 */





/**
 * Internal Dependencies:
 */

function registerPRCBlockCollection() {
  (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.registerBlockCollection)('prc-block', {
    title: 'Pew Research Center Block Library',
    icon: () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("svg", {
      id: "tiny-logo",
      "data-name": "Tiny PRC Logo",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 198 198",
      height: "20"
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("path", {
      d: "M142.83,131.63,174,162.77a98.58,98.58,0,0,0,12.74-19l-66.08-27.37a27.49,27.49,0,0,0,6-14.44l66.05,27.36a97.65,97.65,0,0,0,4.47-22.46h-44a56.14,56.14,0,0,0,.62-7.83,54.79,54.79,0,0,0-.63-7.84s0,0,0,0h44a97.65,97.65,0,0,0-4.47-22.46L126.63,96.08a27.43,27.43,0,0,0-6-14.44l66.09-27.37a98.58,98.58,0,0,0-12.74-19L142.83,66.38a54.89,54.89,0,0,0-11.05-11.06l31.14-31.14a98.08,98.08,0,0,0-19-12.73L116.52,77.52a27.57,27.57,0,0,0-14.45-6l27.36-66A98,98,0,0,0,107,1V45h0a53.41,53.41,0,0,0-7.85-.63,54.6,54.6,0,0,0-7.81.62V1A97.65,97.65,0,0,0,68.87,5.47L96.24,71.52a27.54,27.54,0,0,0-14.45,6L54.43,11.44a98.27,98.27,0,0,0-19,12.74L66.53,55.32A54.52,54.52,0,0,0,55.46,66.39s0,0,0,0L24.32,35.23a98.53,98.53,0,0,0-12.73,19L77.66,81.64a27.49,27.49,0,0,0-6,14.44l-66-27.36A97.65,97.65,0,0,0,1.15,91.18h44v0A56.28,56.28,0,0,0,44.57,99a56.14,56.14,0,0,0,.62,7.83h-44a97.65,97.65,0,0,0,4.47,22.46l66.05-27.36a27.49,27.49,0,0,0,6,14.44L11.59,143.73a98.53,98.53,0,0,0,12.73,19l31.15-31.14a54.94,54.94,0,0,0,11.06,11.06h0L35.39,173.83a98.23,98.23,0,0,0,19,12.73l27.36-66.08a27.46,27.46,0,0,0,14.45,6L68.87,192.54A98.18,98.18,0,0,0,91.33,197V153A49.75,49.75,0,0,0,107,153h0v44a97.46,97.46,0,0,0,22.45-4.47l-27.36-66a27.49,27.49,0,0,0,14.45-6l27.36,66.08a98.53,98.53,0,0,0,19-12.73l-31.14-31.14h0a54.68,54.68,0,0,0,11.06-11.06Z"
    }))
  });
}
function removeEditorPanels() {
  // We do not use Tags or Comments at Pew Research Center.
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)('core/editor').removeEditorPanel('taxonomy-panel-post_tag');
  (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)('core/editor').removeEditorPanel('discussion-panel');
}
function unregisterBlocks() {
  const toRemove = ['core/archives', 'core/calendar', 'core/latest-comments', 'core/tag-cloud', 'core/verse'];
  toRemove.forEach(blockType => {
    (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.unregisterBlockType)(blockType);
  });
  const embedVariationToRemove = ['animoto', 'spotify', 'flickr', 'cloudup', 'collegehumor', 'issuu', 'kickstarter', 'mixcloud', 'reverbnation', 'smugmug', 'amazon-kindle', 'pinterest', 'loom', 'smartframe', 'descript'];
  embedVariationToRemove.forEach(name => {
    (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_3__.unregisterBlockVariation)('core/embed', name);
  });
}
_wordpress_dom_ready__WEBPACK_IMPORTED_MODULE_1___default()(() => {
  if (null !== (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.select)('core/editor')) {
    /**
     * Remove editor panels that we do not use.
     */
    removeEditorPanels();
    /**
     * Register custom hooks.
     */
    (0,_post_preview_publish_hook__WEBPACK_IMPORTED_MODULE_5__["default"])();
  }
  /**
   * Register the "Pew Research Center" block collection.
   */
  registerPRCBlockCollection();
  /**
   * Unregister blocks that we do not use.
   */
  unregisterBlocks();
  /**
   * Removes the external media button that Jetpack so rudely adds everywhere.
   */
  (0,_wordpress_hooks__WEBPACK_IMPORTED_MODULE_4__.removeFilter)('editor.MediaUpload', 'external-media/replace-media-upload');
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map