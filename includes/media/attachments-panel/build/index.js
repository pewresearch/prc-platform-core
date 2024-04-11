/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/attachments-list.jsx":
/*!**********************************!*\
  !*** ./src/attachments-list.jsx ***!
  \**********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context */ "./src/context.js");
/* harmony import */ var _drag_and_drop_zone__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./drag-and-drop-zone */ "./src/drag-and-drop-zone.jsx");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./image */ "./src/image.jsx");
/* harmony import */ var _file__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./file */ "./src/file.jsx");

/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */




function Images() {
  const {
    attachments,
    loading,
    debouncedSearchTerm
  } = (0,_context__WEBPACK_IMPORTED_MODULE_4__.useAttachments)();
  const images = attachments.filter(attachment => attachment.type.startsWith('image/'));
  // Sort attachments by title
  const sortedAttachments = images.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const filteredAttachments = sortedAttachments.filter(attachment => '' === debouncedSearchTerm || attachment.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, loading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, null) : filteredAttachments.map(image => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_image__WEBPACK_IMPORTED_MODULE_6__["default"], {
    ...image
  })));
}
function Files() {
  const {
    attachments,
    loading,
    debouncedSearchTerm
  } = (0,_context__WEBPACK_IMPORTED_MODULE_4__.useAttachments)();
  const files = attachments.filter(attachment => attachment.type.startsWith('application/'));
  // Sort attachments by title
  const sortedAttachments = files.sort((a, b) => {
    if (a.title.toLowerCase() < b.title.toLowerCase()) {
      return -1;
    }
    if (a.title.toLowerCase() > b.title.toLowerCase()) {
      return 1;
    }
    return 0;
  });
  const filteredAttachments = sortedAttachments.filter(attachment => '' === debouncedSearchTerm || attachment.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, loading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Spinner, null) : filteredAttachments.map(file => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_file__WEBPACK_IMPORTED_MODULE_7__["default"], {
    ...file
  })));
}
function AttachmentsList() {
  const {
    attachments,
    searchTerm,
    setSearchTerm,
    mediaEditor
  } = (0,_context__WEBPACK_IMPORTED_MODULE_4__.useAttachments)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Attachments'),
    initialOpen: true,
    className: "prc-attachments-list"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.BaseControl, {
    id: "prc-media-zone",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Drag and drop images to attach them to the post. Click on an image to select the image size to insert into the editor, or "shift + click" an image to insert at 640-wide.', 'prc-block-plugins')
  }, 0 < attachments.length && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_3__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.Button, {
    variant: "secondary",
    onClick: () => mediaEditor.open()
  }, "Edit Attachments"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardDivider, null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Filter Attachments'),
    value: searchTerm,
    onChange: value => setSearchTerm(value)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.CardDivider, null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_drag_and_drop_zone__WEBPACK_IMPORTED_MODULE_5__["default"], null), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.TabPanel, {
    className: "prc-attachments-tabs",
    activeClass: "active-tab",
    onSelect: tabName => {
      console.log('Selecting tab', tabName);
    },
    tabs: [{
      name: 'images',
      title: 'Images',
      className: 'tab-images'
    }, {
      name: 'files',
      title: 'Files',
      className: 'tab-files'
    }]
  }, tab => {
    switch (tab.name) {
      case 'images':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Images, null);
      case 'files':
        return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Files, null);
    }
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AttachmentsList);

/***/ }),

/***/ "./src/attachments-panel.jsx":
/*!***********************************!*\
  !*** ./src/attachments-panel.jsx ***!
  \***********************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_edit_post__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/edit-post */ "@wordpress/edit-post");
/* harmony import */ var _wordpress_edit_post__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./context */ "./src/context.js");
/* harmony import */ var _attachments_list__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./attachments-list */ "./src/attachments-list.jsx");

/* eslint-disable max-len */
// A panel that uses filters to allow adding additional panels.
// https://github.com/WordPress/gutenberg/tree/d5915916abc45e6682f4bdb70888aa41e98aa395/packages/components/src/higher-order/with-filters

// A panel that displays all the attachments for this post, and also provides a dropzone for bulk uploading new attachments.
// React query for data management.

// @TODO
// - Searchable list, order by date or filename
// - Edit button for each image that will let you edit alt and title
// - Secondary stage before isnertion, click on image, it will show a modal asking which size, you select it and voila.

/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */



const HOOK_NAME = 'prc-platform/attachments-panel';
// With this hook other plugins can add their own panels to the attachments panel. For example, Chart Builder could potentially show it's chart exports. The entire idea of this plugin is to provide a central universe of all media assets for a post/page.

const AttachmentsPanel = (0,_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.withFilters)(HOOK_NAME)(() =>
// const { flashPrePublishWarning } = useAttachments();
(0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_edit_post__WEBPACK_IMPORTED_MODULE_3__.PluginSidebar, {
  name: "prc-attachments-panel",
  title: "Attachments",
  icon: "admin-media"
}, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_context__WEBPACK_IMPORTED_MODULE_5__.ProvideAttachments, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_attachments_list__WEBPACK_IMPORTED_MODULE_6__["default"], null)))));
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (AttachmentsPanel);

/***/ }),

/***/ "./src/context.js":
/*!************************!*\
  !*** ./src/context.js ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   ProvideAttachments: () => (/* binding */ ProvideAttachments),
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__),
/* harmony export */   useAttachments: () => (/* binding */ useAttachments)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @prc/hooks */ "@prc/hooks");
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_prc_hooks__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/editor */ "@wordpress/editor");
/* harmony import */ var _wordpress_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/blocks */ "@wordpress/blocks");
/* harmony import */ var _wordpress_blocks__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! @wordpress/core-data */ "@wordpress/core-data");
/* harmony import */ var _wordpress_core_data__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(_wordpress_core_data__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/media-utils */ "@wordpress/media-utils");
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_9__);

/* eslint-disable max-lines-per-function */
/* eslint-disable camelcase */
/**
 * External Dependencies
 */


/**
 * WordPress dependencies
 */








const attachmentsContext = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.createContext)();

// eslint-disable-next-line no-undef
const {
  media
} = window.wp;
function useProvideAttachments() {
  const {
    postId,
    postType,
    imageBlocks = [],
    coverBlocks = [],
    chartBlocks = [],
    videoBlocks = [],
    getBlockInsertionPoint
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => ({
    postType: select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__.store).getCurrentPostType(),
    postId: select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__.store).getCurrentPostId(),
    imageBlocks: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getBlocks().filter(block => 'core/image' === block.name),
    coverBlocks: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getBlocks().filter(block => 'core/cover' === block.name && 'image' === block.attributes.backgroundType),
    getBlockInsertionPoint: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getBlockInsertionPoint
  }), []);
  const {
    insertBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store);
  const [selected, setSelected] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  const [attachments, setAttachments] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)([]);
  const [searchTerm, setSearchTerm] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)('');
  const debouncedSearchTerm = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_1__.useDebounce)(searchTerm, 500);
  const [processing, toggleProcessing] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const [loading, toggleLoading] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(true);
  const [meta, setMeta] = (0,_wordpress_core_data__WEBPACK_IMPORTED_MODULE_8__.useEntityProp)('postType', postType, 'meta');
  const updateAttachments = () => {
    if ('number' === typeof postId && false === processing) {
      toggleProcessing(true);
      _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_3___default()({
        path: `/prc-api/v3/attachments-panel/?postId=${postId}`
      }).then(data => {
        console.log('Objects found in attachments rest request...', data);
        setAttachments([...data]);
        toggleProcessing(false);
      });
    }
  };
  const onDropImage = filesList => {
    console.log('onDropImage', filesList, postId);
    // We need to ensure that the parent is set before or after uploading...
    (0,_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_9__.uploadMedia)({
      allowedTypes: ['image'],
      filesList,
      additionalData: {
        post: postId
      },
      onFileChange(a) {
        console.log('onFileChange', a);
        updateAttachments();
      },
      onError(message) {
        console.error(message);
      },
      wpAllowedMimeTypes: {
        png: 'image/png',
        'jpg|jpeg|jpe': 'image/jpeg',
        webp: 'image/webp'
      }
    });
  };
  const handleImageInsertion = (id, url, size) => {
    const insertionIndex = getBlockInsertionPoint().index;
    const newImageBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.createBlock)('core/image', {
      id,
      url,
      sizeSlug: size
    });
    insertBlock(newImageBlock, insertionIndex);
  };
  const mediaEditor = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    return media({
      title: 'Edit Attachments',
      button: {
        text: 'Update'
      },
      library: {
        uploadedTo: postId,
        selected: [selected]
      }
    });
  }, [postId, selected]);

  // When the media library closes, refresh the attachments.
  mediaEditor.on('close', () => {
    updateAttachments();
  });
  const openMediaLibrary = (attachmentId = null) => {
    // set the selected to...
    setSelected(attachmentId);
    mediaEditor.open();
    mediaEditor.on('close', () => {
      setSelected(null);
    });
  };
  const insertedImageIds = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    console.log('mergeBlocksAndReturnIdClientPairs for insertedImageIds...', coverBlocks, imageBlocks);
    const imageBlockIds = {};
    if (0 !== imageBlocks.length) {
      imageBlocks.forEach(block => {
        imageBlockIds[block.attributes.id] = {
          clientId: block.clientId
        };
      });
    }
    const coverBlockIds = {};
    if (0 !== coverBlocks.length) {
      coverBlocks.forEach(block => {
        coverBlockIds[block.attributes.id] = {
          clientId: block.clientId
        };
      });
    }

    // merge the imageBlockIds and coverBlockIds objects into one object
    return {
      ...imageBlockIds,
      ...coverBlockIds
    };
  }, [coverBlocks, imageBlocks]);

  /**
   * Checks for unused images attached to the post but not present in the editor.
   * This is just to let the user know that they have unused images.
   */
  const flashPrePublishWarning = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useMemo)(() => {
    console.log('insertedImageIds has changed');
    if (0 < attachments.length) {
      const aIds = attachments.map(d => d.id);
      const iIds = Object.keys(insertedImageIds);

      // If there are any values from aIds that are not in iIds, then we have an unused image so return true.
      if (0 < aIds.filter(a => !iIds.includes(a.toString())).length) {
        return true;
      }
      return false;
    }
    return false;
  }, [attachments, insertedImageIds]);

  /**
   * When imageids change or on init update attachments.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    console.log("attachments' effect...");
    updateAttachments();
  }, [postId]);

  /**
   * Handle toggling the loading state.
   */
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (0 < attachments.length) {
      toggleLoading(false);
    } else {
      toggleLoading(true);
    }
  }, [attachments]);
  return {
    postId,
    postType,
    insertedImageIds,
    attachments,
    loading,
    flashPrePublishWarning,
    searchTerm,
    debouncedSearchTerm,
    setSearchTerm,
    onDropImage,
    handleImageInsertion,
    mediaEditor,
    openMediaLibrary
  };
}

// Hook for child components to get the context object ...
// ... and re-render when it changes.
const useAttachments = () => (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useContext)(attachmentsContext);

// Available to any child component that calls useAttachments()
function ProvideAttachments({
  children
}) {
  const provider = useProvideAttachments();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(attachmentsContext.Provider, {
    value: provider
  }, children);
}

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (ProvideAttachments);

/***/ }),

/***/ "./src/drag-and-drop-zone.jsx":
/*!************************************!*\
  !*** ./src/drag-and-drop-zone.jsx ***!
  \************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./context */ "./src/context.js");

/**
 * WordPress Dependencies
 */




/**
 * Internal Dependencies
 */

function DragAndDropZone() {
  const {
    onDropImage
  } = (0,_context__WEBPACK_IMPORTED_MODULE_4__.useAttachments)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_3__.MediaUploadCheck, {
    fallback: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)(`Drag and drop your files here and they will be attached to this post.`)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_2__.DropZone, {
    onFilesDrop: a => onDropImage(a),
    onHTMLDrop: b => console.log('onHTMLDrop...', b),
    onDrop: c => console.log('onDrop...', c)
  }));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (DragAndDropZone);

/***/ }),

/***/ "./src/file.jsx":
/*!**********************!*\
  !*** ./src/file.jsx ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prc/hooks */ "@prc/hooks");
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prc_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./context */ "./src/context.js");

/**
 * External Dependencies
 */



/**
 * WordPress Dependencies
 */






/**
 * Internal Dependencies
 */

function File({
  id,
  url,
  title,
  type
}) {
  const {
    openMediaLibrary
  } = (0,_context__WEBPACK_IMPORTED_MODULE_8__.useAttachments)();
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.BaseControl, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    key: id,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('prc-attachments-list__file'),
    onClick: () => {
      openMediaLibrary(id);
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, title)));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (File);

/***/ }),

/***/ "./src/image.jsx":
/*!***********************!*\
  !*** ./src/image.jsx ***!
  \***********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! classnames */ "classnames");
/* harmony import */ var classnames__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @prc/hooks */ "@prc/hooks");
/* harmony import */ var _prc_hooks__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_prc_hooks__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/block-editor */ "@wordpress/block-editor");
/* harmony import */ var _wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./context */ "./src/context.js");

/**
 * External Dependencies
 */



/**
 * WordPress Dependencies
 */






/**
 * Internal Dependencies
 */

const IMAGE_SIZES = [{
  label: '200 Wide',
  value: '200-wide'
}, {
  label: '200 Wide',
  value: '200-wide'
}, {
  label: '260 Wide',
  value: '260-wide'
}, {
  label: '310 Wide',
  value: '310-wide'
}, {
  label: '420 Wide',
  value: '420-wide'
}, {
  label: '640 Wide',
  value: '640-wide'
}, {
  label: '740 Wide',
  value: '740-wide'
}, {
  label: '1400 Wide',
  value: '1400-wide'
}];
function Image({
  id,
  url,
  title,
  type
}) {
  const {
    insertedImageIds,
    handleImageInsertion
  } = (0,_context__WEBPACK_IMPORTED_MODULE_8__.useAttachments)();
  const {
    selectBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
  const isActive = Object.keys(insertedImageIds).includes(id.toString());
  const [modalActive, toggleModal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const leftShiftKeyPressed = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useKeyPress)('Shift');

  // const ref = useRef(null);

  // const handleRightClick = (ev) => {
  // 	ev.preventDefault();
  // 	alert('success!');
  // 	// Open image editor...
  // 	return false;
  // };

  // useEffect(() => {
  // 	const img = ref.current;
  // 	// subscribe event
  // 	img.addEventListener('contextmenu', handleRightClick, false);
  // 	return () => {
  // 		// unsubscribe event
  // 		img.removeEventListener('contextmenu', handleRightClick);
  // 	};
  // }, []);

  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.BaseControl, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("button", {
    type: "button",
    key: id,
    className: classnames__WEBPACK_IMPORTED_MODULE_1___default()('prc-attachments-list__image', {
      'prc-attachments-list__image--in-use': isActive
    }),
    onClick: () => {
      if (isActive) {
        selectBlock(insertedImageIds[id].clientId);
      } else if (leftShiftKeyPressed) {
        handleImageInsertion(id, url, '640-wide');
      } else {
        toggleModal(true);
      }
    }
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("img", {
    src: url,
    alt: "A attachment in the editor"
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, title)), modalActive && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.Modal, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Insert Image Into Editor', 'prc-block-plugins'),
    onRequestClose: () => toggleModal(false)
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_7__.SelectControl, {
    label: "Select Image Size",
    value: null,
    options: IMAGE_SIZES,
    onChange: newSize => handleImageInsertion(id, url, newSize)
  })));
}
/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (Image);

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ "react");
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/plugins */ "@wordpress/plugins");
/* harmony import */ var _wordpress_plugins__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _style_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./style.scss */ "./src/style.scss");
/* harmony import */ var _attachments_panel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./attachments-panel */ "./src/attachments-panel.jsx");

/**
 * WordPress Dependencies
 */


/**
 * Internal Dependencies
 */



/**
 * A panel that displays all the attachments for this post and also provides a dropzone for bulk uploading new attachments.
 * For filtering info, see: https://github.com/WordPress/gutenberg/tree/d5915916abc45e6682f4bdb70888aa41e98aa395/packages/components/src/higher-order/with-filters
 */
(0,_wordpress_plugins__WEBPACK_IMPORTED_MODULE_1__.registerPlugin)('prc-platform-attachment-panel', {
  render: () => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_attachments_panel__WEBPACK_IMPORTED_MODULE_3__["default"], null),
  icon: 'admin-media'
});

/***/ }),

/***/ "./src/style.scss":
/*!************************!*\
  !*** ./src/style.scss ***!
  \************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "React" ***!
  \************************/
/***/ ((module) => {

module.exports = window["React"];

/***/ }),

/***/ "classnames":
/*!*****************************!*\
  !*** external "classnames" ***!
  \*****************************/
/***/ ((module) => {

module.exports = window["classnames"];

/***/ }),

/***/ "@prc/hooks":
/*!***************************!*\
  !*** external "prcHooks" ***!
  \***************************/
/***/ ((module) => {

module.exports = window["prcHooks"];

/***/ }),

/***/ "@wordpress/api-fetch":
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["apiFetch"];

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

/***/ "@wordpress/edit-post":
/*!**********************************!*\
  !*** external ["wp","editPost"] ***!
  \**********************************/
/***/ ((module) => {

module.exports = window["wp"]["editPost"];

/***/ }),

/***/ "@wordpress/editor":
/*!********************************!*\
  !*** external ["wp","editor"] ***!
  \********************************/
/***/ ((module) => {

module.exports = window["wp"]["editor"];

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

/***/ "@wordpress/media-utils":
/*!************************************!*\
  !*** external ["wp","mediaUtils"] ***!
  \************************************/
/***/ ((module) => {

module.exports = window["wp"]["mediaUtils"];

/***/ }),

/***/ "@wordpress/plugins":
/*!*********************************!*\
  !*** external ["wp","plugins"] ***!
  \*********************************/
/***/ ((module) => {

module.exports = window["wp"]["plugins"];

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
/******/ 		var chunkLoadingGlobal = globalThis["webpackChunk_pewresearch_prc_platform_attachments_panel"] = globalThis["webpackChunk_pewresearch_prc_platform_attachments_panel"] || [];
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