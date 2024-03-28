import * as __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__ from "@wordpress/interactivity";
/******/ var __webpack_modules__ = ({

/***/ "@wordpress/interactivity":
/*!*******************************************!*\
  !*** external "@wordpress/interactivity" ***!
  \*******************************************/
/***/ ((module) => {

var x = (y) => {
	var x = {}; __webpack_require__.d(x, y); return x
} 
var y = (x) => (() => (x))
module.exports = __WEBPACK_EXTERNAL_MODULE__wordpress_interactivity_8e89b257__;

/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ /* webpack/runtime/make namespace object */
/******/ (() => {
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ })();
/******/ 
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
(() => {
/*!*********************!*\
  !*** ./src/view.js ***!
  \*********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/interactivity */ "@wordpress/interactivity");
/**
 * WordPress Dependencies
 */


/**
 * Internal Dependencies
 */
const targetNamespace = 'prc-platform/facets-context-provider';
const createPagerText = pager => {
  const {
    page,
    per_page,
    total_pages,
    total_rows
  } = pager;
  // return something like "Displaying 1 - 10 of 100"
  const start = page <= 1 ? 1 : page * per_page + 1;
  const end = page <= 1 ? per_page : page * per_page + per_page;
  return `Displaying ${start} - ${end} of ${total_rows} results`;
};
const {
  state
} = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('prc-platform/facets-selected-tokens', {
  state: {
    tokens: []
  },
  actions: {
    onTokenClick: () => {
      const {
        ref,
        props
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      console.log('onTokenClick', ref, props);
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.actions || !targetStore.actions.onClear) {
        return;
      }
      const facetSlug = ref.getAttribute('data-facet-slug');
      targetStore.actions.onClear(facetSlug);
    },
    onReset: () => {
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.actions || !targetStore.actions.onClear) {
        return;
      }
      targetStore.actions.onClear();
    }
  },
  callbacks: {
    hasTokens: () => {
      if (state.tokens.length) {
        return true;
      }
      return false;
    },
    updateTokens: () => {
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.state) {
        return;
      }
      const {
        pager
      } = targetStore.state.data;
      state.pagerText = createPagerText(pager);
      const selected = targetStore.state.getSelected;
      // map selected onto tokens...
      const tokens = Object.keys(selected).map(slug => {
        const values = selected[slug];
        return {
          slug,
          label: values.join(', ')
        };
      });
      state.tokens = tokens;
    }
  }
});
})();


//# sourceMappingURL=view.js.map