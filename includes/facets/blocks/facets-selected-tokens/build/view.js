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
/* eslint-disable camelcase */
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
  let start;
  let end;

  // if there is only one page, show all results, end is total_rows
  if (total_pages === 1) {
    start = 1;
    end = total_rows;
  } else {
    // otherwise, show the range of results on the current page
    // if page is less than or equal to 1, start is 1, else calculate start
    start = page <= 1 ? 1 : page * per_page + 1;
    // if page is less than or equal to 1, end is per_page (eg. 10),
    // else calculate end (eg. page on 2 -> 2 * 10 + 10 = 30)
    end = page <= 1 ? per_page : page * per_page + per_page;
  }
  const message = `Displaying ${start} - ${end} of ${total_rows} results`;
  return message;
};
const {
  state
} = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)('prc-platform/facets-selected-tokens', {
  state: {
    get targetStore() {
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.state) {
        return false;
      }
      return targetStore;
    },
    get pagerText() {
      const {
        targetStore
      } = state;
      const {
        pager
      } = targetStore.state.data;
      return createPagerText(pager);
    },
    get tokens() {
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.state) {
        return;
      }
      const selected = targetStore.state.getSelected;
      if (!selected) {
        return [];
      }
      const tokens = Object.keys(selected).flatMap(slug => {
        const values = selected[slug];
        return values.map(value => ({
          slug,
          value,
          label: value.replace(/-/g, ' ').replace(/\b\w/g, char => char.toUpperCase())
        }));
      });
      console.log('get tokens:::', tokens);
      return tokens;
    }
  },
  actions: {
    getSelectedTokens: () => {
      return state.getSelectedFacets;
    },
    onTokenClick: () => {
      const {
        ref,
        props
      } = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.getElement)();
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.actions || !targetStore.actions.onClear) {
        return;
      }
      console.log('onTokenClick', ref, props, targetStore);
      const facetSlug = ref.getAttribute('data-facet-slug');
      const facetValue = ref.getAttribute('data-facet-value');
      targetStore.actions.onClear(facetSlug, facetValue);
    },
    onReset: () => {
      const targetStore = (0,_wordpress_interactivity__WEBPACK_IMPORTED_MODULE_0__.store)(targetNamespace);
      if (!targetStore.actions || !targetStore.actions.onClear) {
        return;
      }
      console.log('onReset', targetStore);
      // redirect back to this page but with no query args and if /page/x/ is in the url, remove it.
      window.location = window.location.href.split('?')[0].replace(/\/page\/\d+\//, '/');
    }
  },
  callbacks: {
    hasTokens: () => {
      if (state.tokens.length) {
        return true;
      }
      return false;
    }
  }
});
})();


//# sourceMappingURL=view.js.map