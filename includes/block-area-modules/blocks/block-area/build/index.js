/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/block-area-wizard/index.jsx":
/*!*****************************************!*\
  !*** ./src/block-area-wizard/index.jsx ***!
  \*****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockAreaWizard)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _steps__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./steps */ "./src/block-area-wizard/steps/index.js");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../icon */ "./src/icon.jsx");

/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */


const STEPS = ['intro',
// Choose "Query by Block Area", "Select Specific Block Module", or "Create New Module"
'query-a',
// We enter the query block area setup, first we either select or create a new block area slug.
'query-b',
// We either select the category slug, select inheirt category, or no category and thus we'd just pick whatever is most recent in the block area.
'query-c',
// We review the settings and then click finish.
'create-a',
// We enter the block module setup, we can give it a title and select whether it should publish immediately or at a future date (draft).
'create-b',
// We enter the block area setup, first we either select or create a new block area slug or we determine we don't want a block area, we explain that means we will only pull in this block module and then we set the ref.
'create-c',
// We review the settings and then click finish.
'select-a' // We open a modal with the templateparts like selector. There is no revie stage here, we immediately set the ref and load the block module.
];
function BlockAreaWizard({
  attributes,
  setAttributes,
  blockModules,
  isResolving,
  context,
  clientId
}) {
  const {
    templateSlug
  } = context;
  const [blockAreaSlug, setBlockAreaSlug] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(attributes?.blockAreaSlug);
  const [categorySlug, setCategorySlug] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(attributes?.categorySlug);
  const [inheritCategory, setInheritCategory] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(attributes?.inheritCategory);
  const [allowCategorySelection, setAllowCategorySelection] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const toggleAllowCategorySelection = () => {
    setAllowCategorySelection(!allowCategorySelection);
  };
  const [activeStep, setActiveStep] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('intro');
  const setNextStep = nextStep => {
    setActiveStep(nextStep);
  };
  const [buttonState, setButtonState] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({
    variant: 'secondary',
    isLoading: false,
    text: 'Next',
    onClick: null,
    disabled: false
  });
  const [newBlockAreaName, setNewBlockAreaName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const allowPrevious = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    switch (activeStep) {
      case 'intro':
        return null;
      case 'query-a':
        return true;
      case 'query-b':
        return true;
      case 'query-c':
        return true;
      case 'create-a':
        return true;
      case 'create-b':
        return true;
      case 'select-a':
        return true;
      default:
        return true;
    }
  }, [activeStep]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Placeholder, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Block Area', 'prc-platform-core'),
    isColumnLayout: true,
    icon: () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_icon__WEBPACK_IMPORTED_MODULE_4__["default"], {
      color: null
    })
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block-area-edit__placeholder-inner"
  }, ['intro', 'create-a'].includes(activeStep) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_steps__WEBPACK_IMPORTED_MODULE_3__.Intro, {
    isResolving,
    blockModules,
    buttonState,
    setButtonState,
    setNextStep,
    isResolving
  }), activeStep === 'query-a' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_steps__WEBPACK_IMPORTED_MODULE_3__.QueryA, {
    blockAreaSlug,
    setBlockAreaSlug,
    newBlockAreaName,
    setNewBlockAreaName,
    setNextStep,
    buttonState,
    setButtonState
  }), activeStep === 'query-b' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_steps__WEBPACK_IMPORTED_MODULE_3__.QueryB, {
    categorySlug,
    setCategorySlug,
    templateSlug,
    allowCategorySelection,
    inheritCategory,
    toggleAllowCategorySelection,
    setInheritCategory,
    buttonState,
    setButtonState,
    setNextStep
  }), activeStep === 'query-c' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_steps__WEBPACK_IMPORTED_MODULE_3__.QueryC, {
    blockAreaSlug,
    categorySlug,
    inheritCategory,
    newBlockAreaName,
    setAttributes,
    setNextStep,
    buttonState,
    setButtonState
  }), activeStep === 'select-a' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_steps__WEBPACK_IMPORTED_MODULE_3__.SelectA, {
    clientId,
    onSelect: ({
      id
    }) => {
      setAttributes({
        ref: id
      });
    },
    onClose: () => {
      setNextStep('intro');
    }
  }), activeStep === 'create-a' && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_steps__WEBPACK_IMPORTED_MODULE_3__.CreateA, {
    onCreate: id => {
      setAttributes({
        ref: id
      });
    },
    setNextStep
  }), !['intro', 'create-a'].includes(activeStep) && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block-area-edit__toolbar"
  }, null !== allowPrevious && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    disabled: !allowPrevious,
    onClick: () => {
      if (null !== allowPrevious) {
        // if activeStep is query-a we're going back to intro, if its query-b we're going back to query-a, if its query-c we're going back to query-b.
        // if activestep is create-a we're going back to intro, if its create-b we're going back to create-a.
        // if activeStep is select-a we're going back to intro.
        if ('intro' === activeStep) {
          setActiveStep('intro');
        } else if ('query-a' === activeStep) {
          setActiveStep('intro');
        } else if ('query-b' === activeStep) {
          setActiveStep('query-a');
        } else if ('query-c' === activeStep) {
          setActiveStep('query-b');
        } else if ('create-a' === activeStep) {
          setActiveStep('intro');
        } else if ('create-b' === activeStep) {
          setActiveStep('create-a');
        } else if ('select-a' === activeStep) {
          setActiveStep('intro');
        }
      }
    }
  }, "Back"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: buttonState.variant,
    disabled: buttonState.disabled,
    onClick: () => {
      if (null !== buttonState.onClick) {
        buttonState.onClick();
      }
    }
  }, buttonState.text))));
}

/***/ }),

/***/ "./src/block-area-wizard/steps/_step.jsx":
/*!***********************************************!*\
  !*** ./src/block-area-wizard/steps/_step.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Step)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);

function Step(props) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
    className: "block-area-edit__step"
  }, props.children);
}

/***/ }),

/***/ "./src/block-area-wizard/steps/create-a.jsx":
/*!**************************************************!*\
  !*** ./src/block-area-wizard/steps/create-a.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CreateA)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../functions */ "./src/functions/index.js");

/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */



/**
 * Internal Dependencies
 */

function CreateA({
  defaultTitle = 'Block Module',
  blockAreaId,
  categoryId,
  onCreate = () => {},
  setNextStep
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.EntityCreateNewModal, {
    defaultTitle,
    onClose: () => {
      setNextStep('intro');
    },
    onSubmit: newTitle => {
      (0,_functions__WEBPACK_IMPORTED_MODULE_4__.createBlockModule)(newTitle, blockAreaId, categoryId, 'publish').then(response => {
        console.log("then...", response);
        onCreate(response.id);
      });
    }
  }));
}

/***/ }),

/***/ "./src/block-area-wizard/steps/index.js":
/*!**********************************************!*\
  !*** ./src/block-area-wizard/steps/index.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   CreateA: () => (/* reexport safe */ _create_a__WEBPACK_IMPORTED_MODULE_4__["default"]),
/* harmony export */   Intro: () => (/* reexport safe */ _intro__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   QueryA: () => (/* reexport safe */ _query_a__WEBPACK_IMPORTED_MODULE_1__["default"]),
/* harmony export */   QueryB: () => (/* reexport safe */ _query_b__WEBPACK_IMPORTED_MODULE_2__["default"]),
/* harmony export */   QueryC: () => (/* reexport safe */ _query_c__WEBPACK_IMPORTED_MODULE_3__["default"]),
/* harmony export */   SelectA: () => (/* reexport safe */ _select_a__WEBPACK_IMPORTED_MODULE_5__["default"])
/* harmony export */ });
/* harmony import */ var _intro__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./intro */ "./src/block-area-wizard/steps/intro.jsx");
/* harmony import */ var _query_a__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./query-a */ "./src/block-area-wizard/steps/query-a.jsx");
/* harmony import */ var _query_b__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./query-b */ "./src/block-area-wizard/steps/query-b.jsx");
/* harmony import */ var _query_c__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./query-c */ "./src/block-area-wizard/steps/query-c.jsx");
/* harmony import */ var _create_a__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./create-a */ "./src/block-area-wizard/steps/create-a.jsx");
/* harmony import */ var _select_a__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./select-a */ "./src/block-area-wizard/steps/select-a.jsx");








/***/ }),

/***/ "./src/block-area-wizard/steps/intro.jsx":
/*!***********************************************!*\
  !*** ./src/block-area-wizard/steps/intro.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Intro)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _step__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./_step */ "./src/block-area-wizard/steps/_step.jsx");

/**
 * WordPress Dependencies
 */




function Intro({
  isResolving,
  blockModules = [],
  setNextStep
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_step__WEBPACK_IMPORTED_MODULE_3__["default"], null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "You can configure a block area to dynamically query the latest module. You can also restrict it by category. Alternatively, you can choose an existing block module or create a new one."), isResolving && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, null), !isResolving && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "primary",
    onClick: () => setNextStep('query-a')
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Configure Area')), !isResolving && !!blockModules.length && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    onClick: () => setNextStep('select-a')
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose Module')), !isResolving && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    onClick: () => setNextStep('create-a')
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Start Blank Module')));
}

/***/ }),

/***/ "./src/block-area-wizard/steps/query-a.jsx":
/*!*************************************************!*\
  !*** ./src/block-area-wizard/steps/query-a.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryA)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prc/hooks */ "@prc/hooks");
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prc_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _step__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./_step */ "./src/block-area-wizard/steps/_step.jsx");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../constants */ "./src/constants.js");

/**
 * External Dependencies
 */




/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */


const CreateNewButton = ({
  setButtonState,
  buttonState,
  setCreateNewBlockArea
}) => {
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setButtonState({
      ...buttonState,
      text: 'Create New Block Area',
      disabled: false,
      onClick: () => setCreateNewBlockArea(true)
    });
  }, []);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, "No Block Area could be found with that name, please create a new one.");
};
const CreateNewField = ({
  setNewBlockAreaName,
  setNextStep,
  setButtonState,
  buttonState
}) => {
  const [newBlockAreaName, setBlockAreaName] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const debouncedBlockAreaName = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useDebounce)(newBlockAreaName, 500);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (debouncedBlockAreaName.length < 3) {
      setButtonState({
        ...buttonState,
        disabled: true
      });
    } else {
      setButtonState({
        ...buttonState,
        text: 'Continue...',
        disabled: false,
        onClick: () => {
          setNewBlockAreaName(debouncedBlockAreaName);
          setNextStep('query-b');
        }
      });
    }
  }, [debouncedBlockAreaName]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('New Block Area Name', 'prc-platform-core'),
    value: newBlockAreaName,
    onChange: value => setBlockAreaName(value)
  });
};

/**
 * Search for a block area,
 * @param {*} param0
 * @returns
 */
function QueryA({
  blockAreaSlug,
  setBlockAreaSlug,
  setNewBlockAreaName,
  setNextStep,
  buttonState,
  setButtonState
}) {
  const [tempBlockAreaSlug, setTempBlockAreaSlug] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(blockAreaSlug);
  const [blockAreaId, blockAreaName] = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useTaxonomy)(_constants__WEBPACK_IMPORTED_MODULE_6__.TAXONOMY, blockAreaSlug);
  const [createNewBlockArea, setCreateNewBlockArea] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const buttonArgs = {
      ...buttonState,
      text: 'Next',
      disabled: true,
      onClick: () => {
        setBlockAreaSlug(tempBlockAreaSlug);
        setNextStep('query-b');
      }
    };
    if (tempBlockAreaSlug && tempBlockAreaSlug.length > 0) {
      buttonArgs.disabled = false;
    }
    setButtonState(buttonArgs);
  }, [tempBlockAreaSlug]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_step__WEBPACK_IMPORTED_MODULE_5__["default"], null, false === createNewBlockArea && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.WPEntitySearch, {
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Search for an existing block area, or create a new one', 'prc-platform-core'),
    searchLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)(`Search for ${_constants__WEBPACK_IMPORTED_MODULE_6__.TAXONOMY_LABEL}`),
    entityType: "taxonomy",
    entitySubType: _constants__WEBPACK_IMPORTED_MODULE_6__.TAXONOMY,
    entityId: blockAreaId || false,
    searchValue: blockAreaName || '',
    onSelect: entity => {
      console.log('Block Area Entity: ', entity);
      setTempBlockAreaSlug(entity.slug);
    },
    onKeyEnter: () => {
      console.log("Enter Key Pressed");
    },
    onKeyESC: () => {
      console.log("ESC Key Pressed");
    },
    perPage: 10,
    showExcerpt: true,
    createNew: () => {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CreateNewButton, {
        buttonState,
        setButtonState,
        setCreateNewBlockArea
      });
    }
  }), true === createNewBlockArea && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(CreateNewField, {
    setNewBlockAreaName,
    setNextStep,
    setButtonState,
    buttonState
  }));
}

/***/ }),

/***/ "./src/block-area-wizard/steps/query-b.jsx":
/*!*************************************************!*\
  !*** ./src/block-area-wizard/steps/query-b.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryB)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prc/hooks */ "@prc/hooks");
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prc_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../constants */ "./src/constants.js");

/**
 * External Dependencies
 */



/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */

function QueryB({
  categorySlug,
  templateSlug,
  allowCategorySelection,
  inheritCategory,
  toggleAllowCategorySelection = () => {},
  setInheritCategory = () => {},
  setCategorySlug = () => {},
  buttonState,
  setButtonState,
  setNextStep
}) {
  const isCategoryTemplate = undefined !== templateSlug && templateSlug?.includes('category');
  const templateSlugCleaned = templateSlug?.replace('category-', '');
  const [templateCatId, templateCatName] = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useTaxonomy)('category', templateSlugCleaned);
  const [catId, catName] = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useTaxonomy)('category', categorySlug);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const newButtonargs = {
      ...buttonState,
      text: 'Next',
      disabled: true,
      onClick: () => setNextStep('query-c')
    };
    if (!allowCategorySelection) {
      newButtonargs.disabled = false;
    } else {
      if (!inheritCategory && !categorySlug) {
        newButtonargs.disabled = true;
      } else {
        newButtonargs.disabled = false;
      }
      if (isCategoryTemplate && !inheritCategory && !categorySlug) {
        newButtonargs.disabled = true;
      } else {
        newButtonargs.disabled = false;
      }
      if (!isCategoryTemplate && !categorySlug) {
        newButtonargs.disabled = true;
      } else {
        newButtonargs.disabled = false;
      }
      console.log("templateSlug", templateSlug);
    }
    setButtonState(newButtonargs);
  }, [allowCategorySelection, inheritCategory, categorySlug, templateSlug]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Query by Category?', 'prc-platform-core')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Query by Category'),
    checked: allowCategorySelection,
    onChange: () => toggleAllowCategorySelection()
  })), allowCategorySelection && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, isCategoryTemplate && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.BaseControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Inherit Category from Template?', 'prc-platform-core')
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: inheritCategory ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Yes', 'prc-platform-core') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No', 'prc-platform-core'),
    checked: inheritCategory,
    onChange: () => setInheritCategory(!inheritCategory)
  })), true !== inheritCategory && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.WPEntitySearch, {
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)(`Search for a category to filter ${_constants__WEBPACK_IMPORTED_MODULE_5__.TAXONOMY_LABEL} by`),
    searchLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)(`Search for a category to filter ${_constants__WEBPACK_IMPORTED_MODULE_5__.TAXONOMY_LABEL} by`),
    entityType: "taxonomy",
    entitySubType: "category",
    entityId: templateCatId || catId || false,
    searchValue: templateCatName || catName || '',
    onSelect: entity => {
      console.log('Category Entity: ', entity);
      setCategorySlug(entity.slug);
    },
    onKeyEnter: () => {
      console.log("Enter Key Pressed");
    },
    onKeyESC: () => {
      console.log("ESC Key Pressed");
    },
    perPage: 10
  })));
}

/***/ }),

/***/ "./src/block-area-wizard/steps/query-c.jsx":
/*!*************************************************!*\
  !*** ./src/block-area-wizard/steps/query-c.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ QueryC)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _step__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./_step */ "./src/block-area-wizard/steps/_step.jsx");
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../functions */ "./src/functions/index.js");

/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */


function QueryC({
  blockAreaSlug,
  categorySlug,
  inheritCategory,
  newBlockAreaName,
  setAttributes,
  setNextStep,
  buttonState,
  setButtonState
}) {
  const [preConfirm, setPreConfirm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [confirm, setConfirm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const newButtonargs = {
      ...buttonState,
      text: 'Confirm Settings',
      disabled: false,
      onClick: () => setPreConfirm(true)
    };
    setButtonState(newButtonargs);
  }, []);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (preConfirm) {
      const newButtonargs = {
        ...buttonState,
        text: 'Insert Block Area',
        disabled: false,
        variant: 'primary',
        onClick: () => setConfirm(true)
      };
      setButtonState(newButtonargs);
    }
  }, [preConfirm]);
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (confirm) {
      const newAttrs = {
        inheritCategory
      };
      if (categorySlug) {
        newAttrs.categorySlug = categorySlug;
      }
      if (newBlockAreaName) {
        (0,_functions__WEBPACK_IMPORTED_MODULE_3__.createBlockArea)(newBlockAreaName).then(newBlockAreaSlug => {
          newAttrs.blockAreaSlug = newBlockAreaSlug;
          setAttributes(newAttrs);
        });
      } else {
        if (blockAreaSlug) {
          newAttrs.blockAreaSlug = blockAreaSlug;
        }
        setAttributes(newAttrs);
      }
    }
  }, [confirm]);

  // if confirm is true then we're going to double check the below and if we're good great then well proceed, otherwise we'll setNextStep('create-a') and tell them to create a new block module.

  // Now that we have these values we're going to set them in the attributes. We're also going to do a quick query of the block modules and if we don't find one we're going to setNextStep('create-a') and tell them to create a new block module. That create-a step will need to look for categorySlug and blockAreaSlug and pass those values along to the newly created block_module post type...

  // Once we confirm the values we're going to create the block area if needs be.

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_step__WEBPACK_IMPORTED_MODULE_2__["default"], null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("h5", {
    className: "block-area-edit__review-settings-heading"
  }, "Review Block Area Settings:"), !newBlockAreaName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "This area will render the latest public ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, "block_module"), " that is in the ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, blockAreaSlug), " block area", categorySlug && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, " and ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, categorySlug), " category"), true === inheritCategory && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, " and will ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, "inherit the category"), " from available context"), "."), newBlockAreaName && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("p", null, "This area will render the latest public ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, "block_module"), " that is in the new ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, newBlockAreaName), " block area", categorySlug && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("span", null, " and ", (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("pre", null, categorySlug), " category"), "."));
}

/***/ }),

/***/ "./src/block-area-wizard/steps/select-a.jsx":
/*!**************************************************!*\
  !*** ./src/block-area-wizard/steps/select-a.jsx ***!
  \**************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SelectA)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../constants */ "./src/constants.js");

/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */


/**
 * Internal Dependencies
 */

function SelectA({
  onSelect = () => {},
  onClose = () => {},
  selectedId = null,
  clientId
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.EntityPatternModal, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Choose a block module', 'prc-platform-core'),
    instructions: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Choosing a block module will always display it, overriding any block area or category queries.', 'prc-platform-core'),
    entityType: _constants__WEBPACK_IMPORTED_MODULE_3__.POST_TYPE,
    entityTypeLabel: _constants__WEBPACK_IMPORTED_MODULE_3__.POST_TYPE_LABEL,
    onSelect,
    onClose,
    clientId,
    selectedId
  });
}

/***/ }),

/***/ "./src/block-module-create.jsx":
/*!*************************************!*\
  !*** ./src/block-module-create.jsx ***!
  \*************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockModuleCreate)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _functions__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./functions */ "./src/functions/index.js");

/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */



/**
 * Internal Dependencies
 */

function BlockModuleCreate({
  blockAreaId,
  categoryId,
  setAttributes
}) {
  const [displayModal, setDisplayModal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    onClick: () => {
      setDisplayModal(!displayModal);
    }
  }, "Create New Block Module"), displayModal && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.EntityCreateNewModal, {
    defaultTitle: 'Block Module',
    onClose: () => {
      setDisplayModal(false);
    },
    onSubmit: newTitle => {
      (0,_functions__WEBPACK_IMPORTED_MODULE_3__.createBlockModule)(newTitle, blockAreaId, categoryId, 'publish').then(response => {
        console.log("then...", response);
        setAttributes({
          ref: response.id
        });
      });
    }
  }));
}

/***/ }),

/***/ "./src/constants.js":
/*!**************************!*\
  !*** ./src/constants.js ***!
  \**************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   POST_TYPE: () => (/* binding */ POST_TYPE),
/* harmony export */   POST_TYPE_LABEL: () => (/* binding */ POST_TYPE_LABEL),
/* harmony export */   POST_TYPE_REST_BASE: () => (/* binding */ POST_TYPE_REST_BASE),
/* harmony export */   TAXONOMY: () => (/* binding */ TAXONOMY),
/* harmony export */   TAXONOMY_LABEL: () => (/* binding */ TAXONOMY_LABEL),
/* harmony export */   TAXONOMY_REST_BASE: () => (/* binding */ TAXONOMY_REST_BASE)
/* harmony export */ });
// Taxonomy
const TAXONOMY = 'block_area';
const TAXONOMY_LABEL = 'Block Area';
const TAXONOMY_REST_BASE = 'block_area';
// Post Type
const POST_TYPE = 'block_module';
const POST_TYPE_LABEL = 'Block Module';
const POST_TYPE_REST_BASE = 'block_module';

/***/ }),

/***/ "./src/edit.jsx":
/*!**********************!*\
  !*** ./src/edit.jsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Edit)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _hooks__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./hooks */ "./src/hooks/index.js");
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./constants */ "./src/constants.js");
/* harmony import */ var _inspector_controls__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./inspector-controls */ "./src/inspector-controls/index.jsx");
/* harmony import */ var _block_area_wizard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./block-area-wizard */ "./src/block-area-wizard/index.jsx");
/* harmony import */ var _block_module_create__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./block-module-create */ "./src/block-module-create.jsx");

/* eslint-disable @wordpress/no-unsafe-wp-apis */
/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */





/**
 * Internal Dependencies
 */





function Edit({
  attributes,
  setAttributes,
  clientId,
  context
}) {
  const {
    ref,
    blockAreaSlug,
    categorySlug: categorySlugRaw,
    inheritCategory
  } = attributes;
  const {
    templateSlug
  } = context;
  const [postStatus, setPostStatus] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('publish');
  const {
    setPostIds
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_4__.useDispatch)('prc-platform/block-area-context');

  // Theres a lot going on here so we want to optimize performance as much as possible. Below are a lot of useMemo calls to memoize the values these happen in the order they are used in the component, do not change the order.

  const isCategoryTemplate = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return undefined !== templateSlug && templateSlug.includes('category-');
  }, [templateSlug]);

  // Get the category, either from the category slug from the attributes or from the current template via site editor context.
  const categorySlug = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (true === inheritCategory && !categorySlugRaw && isCategoryTemplate) {
      return templateSlug.replace('category-', '');
    }
    return categorySlugRaw || false;
  }, [inheritCategory, categorySlugRaw, isCategoryTemplate, templateSlug]);
  const {
    blockAreaName,
    blockAreaId,
    categoryName,
    categoryId
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_5__.useTaxonomyInfo)(blockAreaSlug, categorySlug);
  const blockArea = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return {
      id: blockAreaId,
      name: blockAreaName,
      slug: blockAreaSlug
    };
  }, [blockAreaId, blockAreaName, blockAreaSlug]);
  const category = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    return {
      id: categoryId,
      name: categoryName,
      slug: categorySlug
    };
  }, [categoryId, categoryName, categorySlug]);
  const {
    blockModules,
    hasResolved,
    isResolving
  } = (0,_hooks__WEBPACK_IMPORTED_MODULE_5__.useBlockModules)({
    enabled: true,
    blockAreaId: blockArea?.id,
    categoryId: category?.id,
    ref,
    args: {
      status: postStatus
    }
  });

  /**
   * This gets the first id from the blockModules array and sets it as the blockModuleId.
   */
  const blockModuleId = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (blockModules && blockModules.length) {
      return blockModules[0].id;
    }
    return null;
  }, [blockModules]);
  const blockModule = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (blockModuleId) {
      const match = blockModules.find(blockModule => blockModule.id === blockModuleId);
      console.log("Matching block_module :", match, blockModules);
      return {
        id: blockModuleId,
        name: match?.title?.rendered,
        slug: match?.slug
      };
    }
    return null;
  }, [blockModuleId, blockModules]);
  const blockProps = (0,_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.useBlockProps)();
  const isInSetup = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    console.log("isInSetup", blockModuleId, ref, blockAreaSlug, categorySlug, attributes);
    if (null !== blockModuleId && ref) {
      return false;
    }
    if (!blockAreaSlug) {
      return true;
    }
    return false;
  }, [hasResolved, blockModuleId, blockAreaSlug, categorySlug, ref]);
  if (isInSetup) {
    return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", {
      ...blockProps
    }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_area_wizard__WEBPACK_IMPORTED_MODULE_8__["default"], {
      attributes,
      setAttributes,
      blockModules,
      isResolving,
      clientId,
      context,
      isCategoryTemplate
    }));
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.InnerBlocksAsSyncedContent, {
    postId: blockModuleId,
    postType: _constants__WEBPACK_IMPORTED_MODULE_6__.POST_TYPE,
    postTypeLabel: _constants__WEBPACK_IMPORTED_MODULE_6__.POST_TYPE_LABEL,
    blockProps,
    clientId,
    allowDetach: true,
    isMissingChildren: () => {
      return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_module_create__WEBPACK_IMPORTED_MODULE_9__["default"], {
        blockAreaId,
        categoryId,
        setAttributes
      });
    },
    collector: newRecord => {
      // The collector prop runs after all records have been fetched and can be used to pass data back up to the parent component or for this example post meta back up into the editor global data-store.
      if (newRecord) {
        const storyItemIds = newRecord?._story_item_ids;
        setPostIds(storyItemIds);
      }
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_inspector_controls__WEBPACK_IMPORTED_MODULE_7__["default"], {
    attributes,
    setAttributes,
    clientId,
    blockArea,
    category,
    blockModule,
    postStatus,
    setPostStatus
  }));
}

/***/ }),

/***/ "./src/functions/create-block-area.js":
/*!********************************************!*\
  !*** ./src/functions/create-block-area.js ***!
  \********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createBlockArea)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/url */ "@wordpress/url");
/* harmony import */ var _wordpress_url__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_url__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/**
 * WordPress Dependencies
 */





/**
 * Internal Dependencies
 */

async function createBlockArea(blockAreaName) {
  const {
    saveEntityRecord
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store);
  const slug = (0,_wordpress_url__WEBPACK_IMPORTED_MODULE_3__.cleanForSlug)(blockAreaName);
  const newBlockArea = await saveEntityRecord('taxonomy', _constants__WEBPACK_IMPORTED_MODULE_4__.TAXONOMY, {
    name: blockAreaName,
    slug
  });
  if (newBlockArea) {
    console.log('createBlockArea ->', newBlockArea);
    return newBlockArea?.slug;
  }
  return false;
}

/***/ }),

/***/ "./src/functions/create-block-module.js":
/*!**********************************************!*\
  !*** ./src/functions/create-block-module.js ***!
  \**********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ createBlockModule)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */

async function createBlockModule(blockModuleTitle, blockAreaId, categoryId, status = 'publish') {
  const args = {
    title: blockModuleTitle,
    status
  };
  if (blockAreaId) {
    args[_constants__WEBPACK_IMPORTED_MODULE_3__.TAXONOMY_REST_BASE] = [blockAreaId];
  }
  if (categoryId) {
    args['categories'] = [categoryId];
  }
  const {
    saveEntityRecord
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.dispatch)(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.store);
  const newBlockModule = await saveEntityRecord('postType', _constants__WEBPACK_IMPORTED_MODULE_3__.POST_TYPE, args);
  if (newBlockModule) {
    console.log('onCreateBlockModule', newBlockModule);
    return newBlockModule;
  }
  return false;
}

/***/ }),

/***/ "./src/functions/index.js":
/*!********************************!*\
  !*** ./src/functions/index.js ***!
  \********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createBlockArea: () => (/* reexport safe */ _create_block_area__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   createBlockModule: () => (/* reexport safe */ _create_block_module__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _create_block_area__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./create-block-area */ "./src/functions/create-block-area.js");
/* harmony import */ var _create_block_module__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./create-block-module */ "./src/functions/create-block-module.js");




/***/ }),

/***/ "./src/hooks/index.js":
/*!****************************!*\
  !*** ./src/hooks/index.js ***!
  \****************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useBlockModules: () => (/* reexport safe */ _use_block_modules__WEBPACK_IMPORTED_MODULE_0__["default"]),
/* harmony export */   useTaxonomyInfo: () => (/* reexport safe */ _use_taxonomy_info__WEBPACK_IMPORTED_MODULE_1__["default"])
/* harmony export */ });
/* harmony import */ var _use_block_modules__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./use-block-modules */ "./src/hooks/use-block-modules.js");
/* harmony import */ var _use_taxonomy_info__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./use-taxonomy-info */ "./src/hooks/use-taxonomy-info.js");




/***/ }),

/***/ "./src/hooks/use-block-modules.js":
/*!****************************************!*\
  !*** ./src/hooks/use-block-modules.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useBlockModules)
/* harmony export */ });
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/**
 * External dependencies
 */

/**
 * WordPress dependencies
 */





/**
 * Internal dependencies
 */


/**
 * Retrieves all available block modules. Optionally excludes a single block module by id.
 *
 * @param {string} excludedId Block Module ID to exclude.
 *
 * @return {{ blockModules: Array, isResolving: boolean, hasResolved: boolean }} array of block modules.
 */
function useBlockModules({
  blockAreaId = null,
  categoryId = null,
  ref = null,
  excludeId = null,
  enabled = false,
  args = {}
}) {
  const queryArgs = {
    context: 'view',
    orderby: 'date',
    order: 'desc',
    per_page: 25
  };
  if (null !== blockAreaId) {
    queryArgs[_constants__WEBPACK_IMPORTED_MODULE_4__.TAXONOMY] = [blockAreaId];
  }
  if (null !== categoryId) {
    queryArgs['categories'] = [categoryId];
  }
  if (blockAreaId && categoryId) {
    queryArgs['tax_relation'] = 'AND';
  }
  if (null !== ref) {
    queryArgs['include'] = [ref];
  }
  console.log('postStatus', queryArgs);
  const {
    hasResolved,
    isResolving,
    records,
    status
  } = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_1__.useEntityRecords)('postType', _constants__WEBPACK_IMPORTED_MODULE_4__.POST_TYPE_REST_BASE, {
    ...queryArgs,
    ...args
  }, {
    enabled
  });

  // Filter out any block modules that have the same id as the excluded block module.
  const filteredBlockModules = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    if (!records) {
      return [];
    }
    return records.filter(blockModule => blockModule.id !== excludeId) || [];
  }, [records, excludeId]);
  return {
    blockModules: filteredBlockModules,
    isResolving,
    hasResolved
  };
}

/***/ }),

/***/ "./src/hooks/use-taxonomy-info.js":
/*!****************************************!*\
  !*** ./src/hooks/use-taxonomy-info.js ***!
  \****************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ useTaxonomyInfo)
/* harmony export */ });
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @prc/hooks */ "@prc/hooks");
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_prc_hooks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/**
 * External Dependencies
 */


/**
 * Internal Dependencies
 */


/**
 * Given a block area slug and category slug, returns the block area id and name and category id and name.
 * @param {*} blockAreaSlug
 * @param {*} categorySlug
 * @returns
 */
function useTaxonomyInfo(blockAreaSlug = null, categorySlug = null) {
  const [categoryId, categoryName] = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_0__.useTaxonomy)('category', categorySlug);
  const [blockAreaId, blockAreaName] = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_0__.useTaxonomy)(_constants__WEBPACK_IMPORTED_MODULE_1__.TAXONOMY, blockAreaSlug);
  return {
    blockAreaId,
    blockAreaName,
    categoryId,
    categoryName
  };
}

/***/ }),

/***/ "./src/icon.jsx":
/*!**********************!*\
  !*** ./src/icon.jsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconSymbolFilled)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.js");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/symbol-filled.js");

/**
 * External Dependencies
 */

function IconSymbolFilled({
  color = '#02b5d5'
}) {
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"], {
    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
    style: {
      color
    }
  });
}

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _editor_scss__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./editor.scss */ "./src/editor.scss");
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./icon */ "./src/icon.jsx");
/* harmony import */ var _edit__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./edit */ "./src/edit.jsx");
/* harmony import */ var _block_json__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block.json */ "./src/block.json");
/**
 * Registers a new block provided a unique name and an object defining its behavior.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */

/**
 * WordPress Dependencies
 */


/**
 * Internal Dependencies
 */





const {
  name
} = _block_json__WEBPACK_IMPORTED_MODULE_5__;
const settings = {
  icon: _icon__WEBPACK_IMPORTED_MODULE_3__["default"],
  edit: _edit__WEBPACK_IMPORTED_MODULE_4__["default"]
};

/**
 * Every block starts by registering a new block type definition.
 *
 * @see https://developer.wordpress.org/block-editor/developers/block-api/#registering-a-block
 */
(0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_0__.registerBlockType)(name, {
  ..._block_json__WEBPACK_IMPORTED_MODULE_5__,
  ...settings
});

/***/ }),

/***/ "./src/inspector-controls/block-area.jsx":
/*!***********************************************!*\
  !*** ./src/inspector-controls/block-area.jsx ***!
  \***********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockAreaControl)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/constants.js");

/**
 * WordPress Dependencies
 */





/**
 * Internal Dependencies
 */

function BlockAreaControl({
  attributes,
  setAttributes,
  blockArea,
  postStatus,
  setPostStatus
}) {
  const {
    metadata,
    ref
  } = attributes;
  const {
    id,
    name,
    slug
  } = blockArea;

  // Block Area:
  const [blockAreaName, setBlockAreaName] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.useEntityProp)('taxonomy', _constants__WEBPACK_IMPORTED_MODULE_4__.TAXONOMY, 'name', id);

  // This will check if the block area already has a label in the block editor and if not, it will set it to the block area name.
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!metadata?.name && blockAreaName) {
      setAttributes({
        metadata: {
          ...metadata,
          name: blockAreaName
        }
      });
    }
  }, [metadata, blockAreaName]);
  if (!id) {
    return null;
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FlexBlock, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)(`${_constants__WEBPACK_IMPORTED_MODULE_4__.TAXONOMY_LABEL} Name`),
    value: blockAreaName,
    onChange: setBlockAreaName
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FlexBlock, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Preview Latest Draft Module', 'prc-platform-core'),
    checked: 'draft' === postStatus,
    help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('This will allow you to preview and edit the latest draft module in the block area. This will not be visible on the front end, the latest published module will always be visible.', 'prc-platform-core'),
    onChange: value => {
      setPostStatus(value ? 'draft' : 'publish');
    }
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FlexBlock, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    isDestructive: true,
    variant: "secondary",
    onClick: () => {
      setAttributes({
        ref: null,
        blockAreaSlug: null,
        categorySlug: null,
        inheritCategory: null
      });
    }
  }, (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Reset Block Area'))));
}

/***/ }),

/***/ "./src/inspector-controls/block-module.jsx":
/*!*************************************************!*\
  !*** ./src/inspector-controls/block-module.jsx ***!
  \*************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ BlockModuleControl)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _constants__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../constants */ "./src/constants.js");
/* harmony import */ var _block_module_create__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../block-module-create */ "./src/block-module-create.jsx");

/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */





/**
 * Internal Dependencies
 */


function BlockModuleControl({
  setAttributes,
  blockArea,
  category,
  blockModule
}) {
  const {
    id,
    name,
    slug
  } = blockModule;
  const blockAreaId = blockArea?.id;
  const categoryId = category?.id;

  // Block Module:
  const [blockModuleTitle, setBlockModuleTitle] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.useEntityProp)('postType', _constants__WEBPACK_IMPORTED_MODULE_4__.POST_TYPE, 'title', id);
  const [blockModuleLink] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_2__.useEntityProp)('postType', _constants__WEBPACK_IMPORTED_MODULE_4__.POST_TYPE, 'link', id);
  if (!id) {
    return null;
  }
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FlexBlock, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    __nextHasNoMarginBottom: true,
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)(`${_constants__WEBPACK_IMPORTED_MODULE_4__.POST_TYPE_LABEL} Title`),
    value: blockModuleTitle,
    onChange: setBlockModuleTitle
  })), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.FlexBlock, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_module_create__WEBPACK_IMPORTED_MODULE_5__["default"], {
    blockAreaId,
    categoryId,
    setAttributes
  })));
}

/***/ }),

/***/ "./src/inspector-controls/category.jsx":
/*!*********************************************!*\
  !*** ./src/inspector-controls/category.jsx ***!
  \*********************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CategoryControl)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/components */ "@prc/components");
/* harmony import */ var _prc_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);

/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */





/**
 * Internal Dependencies
 */

function CategoryControl({
  attributes,
  setAttributes,
  category
}) {
  const {
    id,
    name,
    slug
  } = category;
  const {
    inheritCategory,
    categorySlug
  } = attributes;
  const categoryValue = (0,react__WEBPACK_IMPORTED_MODULE_0__.useMemo)(() => {
    if (!id) {
      return [];
    }
    return [{
      value: slug,
      title: name
    }];
  }, [id, name, slug]);
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.FlexBlock, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.ToggleControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Inherit Category', 'prc-platform-core'),
    checked: inheritCategory,
    onChange: value => {
      setAttributes({
        inheritCategory: value,
        categorySlug: true === value ? null : categorySlug
      });
    }
  }), !inheritCategory && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_prc_components__WEBPACK_IMPORTED_MODULE_1__.TermSelect, {
    onChange: value => {
      console.log("onChange...", value);
      // if value is empty we shoudl setCategory to null
      if (!value) {
        setAttributes({
          categorySlug: null
        });
      } else {
        setAttributes({
          categorySlug: value.slug
        });
      }
    },
    taxonomy: 'category',
    value: categoryValue,
    maxTerms: 1
  }));
}

/***/ }),

/***/ "./src/inspector-controls/index.jsx":
/*!******************************************!*\
  !*** ./src/inspector-controls/index.jsx ***!
  \******************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Controls)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _block_area__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./block-area */ "./src/inspector-controls/block-area.jsx");
/* harmony import */ var _block_module__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./block-module */ "./src/inspector-controls/block-module.jsx");
/* harmony import */ var _category__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./category */ "./src/inspector-controls/category.jsx");

/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */






/**
 * Internal Dependencies
 */



function Controls({
  attributes,
  setAttributes,
  clientId,
  blockArea,
  category,
  blockModule,
  postStatus,
  setPostStatus
}) {
  const {
    ref
  } = attributes;
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_2__.InspectorControls, null, !ref && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(react__WEBPACK_IMPORTED_MODULE_0__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Block Area'),
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Flex, {
    direction: "column",
    gap: '10px'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_area__WEBPACK_IMPORTED_MODULE_5__["default"], {
    attributes,
    setAttributes,
    blockArea,
    blockModule,
    postStatus,
    setPostStatus
  }))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Category'),
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Flex, {
    direction: "column",
    gap: '10px'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_category__WEBPACK_IMPORTED_MODULE_7__["default"], {
    attributes,
    setAttributes,
    category
  })))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Block Module'),
    initialOpen: true
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_4__.Flex, {
    direction: "column",
    gap: '10px'
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_block_module__WEBPACK_IMPORTED_MODULE_6__["default"], {
    setAttributes,
    blockArea,
    category,
    blockModule
  }))));
}

/***/ }),

/***/ "./src/editor.scss":
/*!*************************!*\
  !*** ./src/editor.scss ***!
  \*************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.js":
/*!******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.js ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/**
 * WordPress dependencies
 */


/** @typedef {{icon: JSX.Element, size?: number} & import('@wordpress/primitives').SVGProps} IconProps */

/**
 * Return an SVG icon.
 *
 * @param {IconProps}                                 props icon is the SVG component to render
 *                                                          size is a number specifiying the icon size in pixels
 *                                                          Other props will be passed to wrapped SVG component
 * @param {import('react').ForwardedRef<HTMLElement>} ref   The forwarded ref to the SVG element.
 *
 * @return {JSX.Element}  Icon component
 */
function Icon({
  icon,
  size = 24,
  ...props
}, ref) {
  return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
    width: size,
    height: size,
    ...props,
    ref
  });
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = ((0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(Icon));
//# sourceMappingURL=index.js.map

/***/ }),

/***/ "./node_modules/@wordpress/icons/build-module/library/symbol-filled.js":
/*!*****************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/symbol-filled.js ***!
  \*****************************************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__);

/**
 * WordPress dependencies
 */

const symbolFilled = (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.SVG, {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 24 24"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_1__.Path, {
  d: "M21.3 10.8l-5.6-5.6c-.7-.7-1.8-.7-2.5 0l-5.6 5.6c-.7.7-.7 1.8 0 2.5l5.6 5.6c.3.3.8.5 1.2.5s.9-.2 1.2-.5l5.6-5.6c.8-.7.8-1.9.1-2.5zm-17.6 1L10 5.5l-1-1-6.3 6.3c-.7.7-.7 1.8 0 2.5L9 19.5l1.1-1.1-6.3-6.3c-.2 0-.2-.2-.1-.3z"
}));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (symbolFilled);
//# sourceMappingURL=symbol-filled.js.map

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "@prc/components":
/*!********************************!*\
  !*** external "prcComponents" ***!
  \********************************/
/***/ ((module) => {

module.exports = window["prcComponents"];

/***/ }),

/***/ "@prc/hooks":
/*!***************************!*\
  !*** external "prcHooks" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["prcHooks"];

/***/ }),

/***/ "@wordpress/block-editor":
/*!*************************************!*\
  !*** external ["wp","blockEditor"] ***!
  \*************************************/
/***/ ((module) => {

module.exports = window["wp"]["blockEditor"];

/***/ }),

/***/ "@wordpress/blocks":
/*!********************************!*\
  !*** external ["wp","blocks"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["blocks"];

/***/ }),

/***/ "@wordpress/components":
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["components"];

/***/ }),

/***/ "@wordpress/core-data":
/*!**********************************!*\
  !*** external ["wp","coreData"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["coreData"];

/***/ }),

/***/ "@wordpress/data":
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["data"];

/***/ }),

/***/ "@wordpress/element":
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["element"];

/***/ }),

/***/ "@wordpress/i18n":
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
/***/ ((module) => {

module.exports = window["wp"]["i18n"];

/***/ }),

/***/ "@wordpress/primitives":
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["primitives"];

/***/ }),

/***/ "@wordpress/url":
/*!*****************************!*\
  !*** external ["wp","url"] ***!
  \*****************************/
/***/ ((module) => {

module.exports = window["wp"]["url"];

/***/ }),

/***/ "./src/block.json":
/*!************************!*\
  !*** ./src/block.json ***!
  \************************/
/***/ ((module) => {

module.exports = /*#__PURE__*/JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/block-area","version":"3.0.0","title":"Block Area","description":"A block area is like a template part but with greater editorial control.","category":"theme","keywords":["block area","block module","topic lede","featured lede"],"attributes":{"ref":{"type":"integer"},"blockAreaSlug":{"type":"string"},"categorySlug":{"type":"string"},"inheritCategory":{"type":"boolean"}},"supports":{"anchor":true,"html":false,"interactivity":true},"usesContext":["queryId","query","queryContext","templateSlug","previewPostType"],"textdomain":"prc-block-area","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}');

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
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = __webpack_modules__;
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/chunk loaded */
/******/ 	(() => {
/******/ 		var deferred = [];
/******/ 		__webpack_require__.O = (result, chunkIds, fn, priority) => {
/******/ 			if(chunkIds) {
/******/ 				priority = priority || 0;
/******/ 				for(var i = deferred.length; i > 0 && deferred[i - 1][2] > priority; i--) deferred[i] = deferred[i - 1];
/******/ 				deferred[i] = [chunkIds, fn, priority];
/******/ 				return;
/******/ 			}
/******/ 			var notFulfilled = Infinity;
/******/ 			for (var i = 0; i < deferred.length; i++) {
/******/ 				var [chunkIds, fn, priority] = deferred[i];
/******/ 				var fulfilled = true;
/******/ 				for (var j = 0; j < chunkIds.length; j++) {
/******/ 					if ((priority & 1 === 0 || notFulfilled >= priority) && Object.keys(__webpack_require__.O).every((key) => (__webpack_require__.O[key](chunkIds[j])))) {
/******/ 						chunkIds.splice(j--, 1);
/******/ 					} else {
/******/ 						fulfilled = false;
/******/ 						if(priority < notFulfilled) notFulfilled = priority;
/******/ 					}
/******/ 				}
/******/ 				if(fulfilled) {
/******/ 					deferred.splice(i--, 1)
/******/ 					var r = fn();
/******/ 					if (r !== undefined) result = r;
/******/ 				}
/******/ 			}
/******/ 			return result;
/******/ 		};
/******/ 	})();
/******/ 	
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
/******/ 	/* webpack/runtime/jsonp chunk loading */
/******/ 	(() => {
/******/ 		// no baseURI
/******/ 		
/******/ 		// object to store loaded and loading chunks
/******/ 		// undefined = chunk not loaded, null = chunk preloaded/prefetched
/******/ 		// [resolve, reject, Promise] = chunk loading, 0 = chunk loaded
/******/ 		var installedChunks = {
/******/ 			"index": 0,
/******/ 			"./style-index": 0
/******/ 		};
/******/ 		
/******/ 		// no chunk on demand loading
/******/ 		
/******/ 		// no prefetching
/******/ 		
/******/ 		// no preloaded
/******/ 		
/******/ 		// no HMR
/******/ 		
/******/ 		// no HMR manifest
/******/ 		
/******/ 		__webpack_require__.O.j = (chunkId) => (installedChunks[chunkId] === 0);
/******/ 		
/******/ 		// install a JSONP callback for chunk loading
/******/ 		var webpackJsonpCallback = (parentChunkLoadingFunction, data) => {
/******/ 			var [chunkIds, moreModules, runtime] = data;
/******/ 			// add "moreModules" to the modules object,
/******/ 			// then flag all "chunkIds" as loaded and fire callback
/******/ 			var moduleId, chunkId, i = 0;
/******/ 			if(chunkIds.some((id) => (installedChunks[id] !== 0))) {
/******/ 				for(moduleId in moreModules) {
/******/ 					if(__webpack_require__.o(moreModules, moduleId)) {
/******/ 						__webpack_require__.m[moduleId] = moreModules[moduleId];
/******/ 					}
/******/ 				}
/******/ 				if(runtime) var result = runtime(__webpack_require__);
/******/ 			}
/******/ 			if(parentChunkLoadingFunction) parentChunkLoadingFunction(data);
/******/ 			for(;i < chunkIds.length; i++) {
/******/ 				chunkId = chunkIds[i];
/******/ 				if(__webpack_require__.o(installedChunks, chunkId) && installedChunks[chunkId]) {
/******/ 					installedChunks[chunkId][0]();
/******/ 				}
/******/ 				installedChunks[chunkId] = 0;
/******/ 			}
/******/ 			return __webpack_require__.O(result);
/******/ 		}
/******/ 		
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunk_pewresearch_prc_platform_block_area_modules"] = globalThis["webpackChunk_pewresearch_prc_platform_block_area_modules"] || [];
/******/ 		chunkLoadingGlobal.forEach(webpackJsonpCallback.bind(null, 0));
/******/ 		chunkLoadingGlobal.push = webpackJsonpCallback.bind(null, chunkLoadingGlobal.push.bind(chunkLoadingGlobal));
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module depends on other loaded chunks and execution need to be delayed
/******/ 	var __webpack_exports__ = __webpack_require__.O(undefined, ["./style-index"], () => (__webpack_require__("./src/index.js")))
/******/ 	__webpack_exports__ = __webpack_require__.O(__webpack_exports__);
/******/ 	
/******/ })()
;
//# sourceMappingURL=index.js.map