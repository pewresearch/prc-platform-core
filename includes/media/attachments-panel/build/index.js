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
/* harmony import */ var blob_util__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! blob-util */ "./node_modules/blob-util/dist/blob-util.es.js");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! @wordpress/media-utils */ "@wordpress/media-utils");
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var _context__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./context */ "./src/context.js");
/* harmony import */ var _drag_and_drop_zone__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./drag-and-drop-zone */ "./src/drag-and-drop-zone.jsx");
/* harmony import */ var _image__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./image */ "./src/image.jsx");
/* harmony import */ var _file__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./file */ "./src/file.jsx");

/**
 * External Dependencies
 */


/**
 * WordPress Dependencies
 */







/**
 * Internal Dependencies
 */




function resetAttachmentsMigration(postId) {
  console.log(`resetAttachmentsMigration(${postId}):`);
  _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_5___default()({
    path: '/prc-api/v3/migration/migrate-attachments/',
    method: 'POST',
    data: {
      postId
    }
  }).then(data => {
    console.log(data);
    if (data.success) {
      window.location.reload();
    }
  }).catch(error => {
    console.error(error);
  });
}
function Images() {
  const {
    attachments,
    loading,
    debouncedSearchTerm
  } = (0,_context__WEBPACK_IMPORTED_MODULE_8__.useAttachments)();
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
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, loading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null) : filteredAttachments.map(image => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_image__WEBPACK_IMPORTED_MODULE_10__["default"], {
    ...image
  })));
}
function Files() {
  const {
    attachments,
    loading,
    debouncedSearchTerm
  } = (0,_context__WEBPACK_IMPORTED_MODULE_8__.useAttachments)();
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

  // Filter attachments by title and filename.
  const filteredAttachments = sortedAttachments.filter(attachment => '' === debouncedSearchTerm || attachment.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || attachment.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)("div", null, loading ? (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Spinner, null) : filteredAttachments.map(file => (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_file__WEBPACK_IMPORTED_MODULE_11__["default"], {
    ...file
  })));
}
function AttachmentsList() {
  const {
    attachments,
    searchTerm,
    setSearchTerm,
    mediaEditor
  } = (0,_context__WEBPACK_IMPORTED_MODULE_8__.useAttachments)();
  const postId = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useSelect)(select => select('core/editor').getCurrentPostId());
  return (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Attachments'),
    initialOpen: true,
    className: "prc-attachments-list"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.BaseControl, {
    id: "prc-media-zone",
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Drag and drop images to attach them to the post. Click on an image to select the image size to insert into the editor, or "shift + click" an image to insert at 640-wide.', 'prc-block-plugins')
  }, 0 < attachments.length && (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_element__WEBPACK_IMPORTED_MODULE_4__.Fragment, null, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    variant: "secondary",
    onClick: () => mediaEditor.open()
  }, "Edit Attachments"), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.CardDivider, null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.TextControl, {
    label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Filter Attachments'),
    value: searchTerm,
    onChange: value => setSearchTerm(value)
  }), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_drag_and_drop_zone__WEBPACK_IMPORTED_MODULE_9__["default"], null))), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Images'),
    initialOpen: attachments.length > 0,
    className: "prc-attachments-list__images"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Images, null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Files'),
    className: "prc-attachments-list__files",
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(Files, null)), (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.PanelBody, {
    title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Danger Zone'),
    className: "prc-attachments-list__danger-zone",
    initialOpen: false
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.BaseControl, {
    label: "Reset Attachments",
    help: "If there are attachments present on this post we will only add new attachments. Otherwise, all attachments from the legacy post will be copied to this post.",
    id: "prc-reset-attachments"
  }, (0,react__WEBPACK_IMPORTED_MODULE_0__.createElement)(_wordpress_components__WEBPACK_IMPORTED_MODULE_3__.Button, {
    isDestructive: true,
    onClick: () => {
      resetAttachmentsMigration(postId);
    }
  }, "Copy Attachments From Legacy"))));
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
    getBlockInsertionPoint,
    selectedBlockClientId,
    selectedBlockIsImageBlock,
    selectedBlockAttrs
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_7__.useSelect)(select => ({
    postType: select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__.store).getCurrentPostType(),
    postId: select(_wordpress_editor__WEBPACK_IMPORTED_MODULE_4__.store).getCurrentPostId(),
    imageBlocks: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getBlocks().filter(block => 'core/image' === block.name),
    coverBlocks: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getBlocks().filter(block => 'core/cover' === block.name && 'image' === block.attributes.backgroundType),
    getBlockInsertionPoint: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getBlockInsertionPoint,
    selectedBlockClientId: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getSelectedBlockClientId(),
    selectedBlockIsImageBlock: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getSelectedBlock()?.name === 'core/image',
    selectedBlockAttrs: select(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_5__.store).getSelectedBlock()?.attributes
  }), []);
  const {
    insertBlock,
    replaceBlock
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
  const handleImageReplacement = (id, url, attachmentLink) => {
    // Check that what we're replacing is actually an image.
    if (selectedBlockIsImageBlock) {
      // get the attachment page
      // get the sizeSlug from the existing block if it exists..., otherwise default to 640-wide
      const sizeSlug = selectedBlockAttrs.sizeSlug || '310-wide';
      const attrs = selectedBlockAttrs;
      attrs.id = id;
      attrs.url = url;
      attrs.sizeSlug = sizeSlug;
      if (attachmentLink) {
        attrs.href = attachmentLink;
      }
      const newImageBlock = (0,_wordpress_blocks__WEBPACK_IMPORTED_MODULE_6__.createBlock)('core/image', {
        ...attrs
      });
      replaceBlock(selectedBlockClientId, newImageBlock);
    }
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
    handleImageReplacement,
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
  type,
  filename,
  editLink,
  attachmentLink
}) {
  const {
    insertedImageIds,
    handleImageInsertion,
    handleImageReplacement
  } = (0,_context__WEBPACK_IMPORTED_MODULE_8__.useAttachments)();
  const {
    selectBlock
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_6__.useDispatch)(_wordpress_block_editor__WEBPACK_IMPORTED_MODULE_4__.store);
  const isActive = Object.keys(insertedImageIds).includes(id.toString());
  const [modalActive, toggleModal] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_5__.useState)(false);
  const leftShiftKeyPressed = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useKeyPress)('Shift');
  const leftOptKeyPressed = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useKeyPress)('Alt');
  const leftCommandKeyPressed = (0,_prc_hooks__WEBPACK_IMPORTED_MODULE_2__.useKeyPress)('metaKey');

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
      } else if (leftOptKeyPressed) {
        handleImageReplacement(id, url, attachmentLink);
      } else if (leftCommandKeyPressed) {
        window.open(editLink, '_blank');
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

/***/ "./node_modules/blob-util/dist/blob-util.es.js":
/*!*****************************************************!*\
  !*** ./node_modules/blob-util/dist/blob-util.es.js ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   arrayBufferToBinaryString: () => (/* binding */ arrayBufferToBinaryString),
/* harmony export */   arrayBufferToBlob: () => (/* binding */ arrayBufferToBlob),
/* harmony export */   base64StringToBlob: () => (/* binding */ base64StringToBlob),
/* harmony export */   binaryStringToArrayBuffer: () => (/* binding */ binaryStringToArrayBuffer),
/* harmony export */   binaryStringToBlob: () => (/* binding */ binaryStringToBlob),
/* harmony export */   blobToArrayBuffer: () => (/* binding */ blobToArrayBuffer),
/* harmony export */   blobToBase64String: () => (/* binding */ blobToBase64String),
/* harmony export */   blobToBinaryString: () => (/* binding */ blobToBinaryString),
/* harmony export */   blobToDataURL: () => (/* binding */ blobToDataURL),
/* harmony export */   canvasToBlob: () => (/* binding */ canvasToBlob),
/* harmony export */   createBlob: () => (/* binding */ createBlob),
/* harmony export */   createObjectURL: () => (/* binding */ createObjectURL),
/* harmony export */   dataURLToBlob: () => (/* binding */ dataURLToBlob),
/* harmony export */   imgSrcToBlob: () => (/* binding */ imgSrcToBlob),
/* harmony export */   imgSrcToDataURL: () => (/* binding */ imgSrcToDataURL),
/* harmony export */   revokeObjectURL: () => (/* binding */ revokeObjectURL)
/* harmony export */ });
// TODO: including these in blob-util.ts causes typedoc to generate docs for them,
// even with --excludePrivate ¯\_(ツ)_/¯
/** @private */
function loadImage(src, crossOrigin) {
    return new Promise(function (resolve, reject) {
        var img = new Image();
        if (crossOrigin) {
            img.crossOrigin = crossOrigin;
        }
        img.onload = function () {
            resolve(img);
        };
        img.onerror = reject;
        img.src = src;
    });
}
/** @private */
function imgToCanvas(img) {
    var canvas = document.createElement('canvas');
    canvas.width = img.width;
    canvas.height = img.height;
    // copy the image contents to the canvas
    var context = canvas.getContext('2d');
    context.drawImage(img, 0, 0, img.width, img.height, 0, 0, img.width, img.height);
    return canvas;
}

/* global Promise, Image, Blob, FileReader, atob, btoa,
   BlobBuilder, MSBlobBuilder, MozBlobBuilder, WebKitBlobBuilder, webkitURL */
/**
 * Shim for
 * [`new Blob()`](https://developer.mozilla.org/en-US/docs/Web/API/Blob.Blob)
 * to support
 * [older browsers that use the deprecated `BlobBuilder` API](http://caniuse.com/blob).
 *
 * Example:
 *
 * ```js
 * var myBlob = blobUtil.createBlob(['hello world'], {type: 'text/plain'});
 * ```
 *
 * @param parts - content of the Blob
 * @param properties - usually `{type: myContentType}`,
 *                           you can also pass a string for the content type
 * @returns Blob
 */
function createBlob(parts, properties) {
    parts = parts || [];
    properties = properties || {};
    if (typeof properties === 'string') {
        properties = { type: properties }; // infer content type
    }
    try {
        return new Blob(parts, properties);
    }
    catch (e) {
        if (e.name !== 'TypeError') {
            throw e;
        }
        var Builder = typeof BlobBuilder !== 'undefined'
            ? BlobBuilder : typeof MSBlobBuilder !== 'undefined'
            ? MSBlobBuilder : typeof MozBlobBuilder !== 'undefined'
            ? MozBlobBuilder : WebKitBlobBuilder;
        var builder = new Builder();
        for (var i = 0; i < parts.length; i += 1) {
            builder.append(parts[i]);
        }
        return builder.getBlob(properties.type);
    }
}
/**
 * Shim for
 * [`URL.createObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL.createObjectURL)
 * to support browsers that only have the prefixed
 * `webkitURL` (e.g. Android <4.4).
 *
 * Example:
 *
 * ```js
 * var myUrl = blobUtil.createObjectURL(blob);
 * ```
 *
 * @param blob
 * @returns url
 */
function createObjectURL(blob) {
    return (typeof URL !== 'undefined' ? URL : webkitURL).createObjectURL(blob);
}
/**
 * Shim for
 * [`URL.revokeObjectURL()`](https://developer.mozilla.org/en-US/docs/Web/API/URL.revokeObjectURL)
 * to support browsers that only have the prefixed
 * `webkitURL` (e.g. Android <4.4).
 *
 * Example:
 *
 * ```js
 * blobUtil.revokeObjectURL(myUrl);
 * ```
 *
 * @param url
 */
function revokeObjectURL(url) {
    return (typeof URL !== 'undefined' ? URL : webkitURL).revokeObjectURL(url);
}
/**
 * Convert a `Blob` to a binary string.
 *
 * Example:
 *
 * ```js
 * blobUtil.blobToBinaryString(blob).then(function (binaryString) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the binary string
 */
function blobToBinaryString(blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        var hasBinaryString = typeof reader.readAsBinaryString === 'function';
        reader.onloadend = function () {
            var result = reader.result || '';
            if (hasBinaryString) {
                return resolve(result);
            }
            resolve(arrayBufferToBinaryString(result));
        };
        reader.onerror = reject;
        if (hasBinaryString) {
            reader.readAsBinaryString(blob);
        }
        else {
            reader.readAsArrayBuffer(blob);
        }
    });
}
/**
 * Convert a base64-encoded string to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.base64StringToBlob(base64String);
 * ```
 * @param base64 - base64-encoded string
 * @param type - the content type (optional)
 * @returns Blob
 */
function base64StringToBlob(base64, type) {
    var parts = [binaryStringToArrayBuffer(atob(base64))];
    return type ? createBlob(parts, { type: type }) : createBlob(parts);
}
/**
 * Convert a binary string to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.binaryStringToBlob(binaryString);
 * ```
 *
 * @param binary - binary string
 * @param type - the content type (optional)
 * @returns Blob
 */
function binaryStringToBlob(binary, type) {
    return base64StringToBlob(btoa(binary), type);
}
/**
 * Convert a `Blob` to a binary string.
 *
 * Example:
 *
 * ```js
 * blobUtil.blobToBase64String(blob).then(function (base64String) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the binary string
 */
function blobToBase64String(blob) {
    return blobToBinaryString(blob).then(btoa);
}
/**
 * Convert a data URL string
 * (e.g. `'data:image/png;base64,iVBORw0KG...'`)
 * to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.dataURLToBlob(dataURL);
 * ```
 *
 * @param dataURL - dataURL-encoded string
 * @returns Blob
 */
function dataURLToBlob(dataURL) {
    var type = dataURL.match(/data:([^;]+)/)[1];
    var base64 = dataURL.replace(/^[^,]+,/, '');
    var buff = binaryStringToArrayBuffer(atob(base64));
    return createBlob([buff], { type: type });
}
/**
 * Convert a `Blob` to a data URL string
 * (e.g. `'data:image/png;base64,iVBORw0KG...'`).
 *
 * Example:
 *
 * ```js
 * var dataURL = blobUtil.blobToDataURL(blob);
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the data URL string
 */
function blobToDataURL(blob) {
    return blobToBase64String(blob).then(function (base64String) {
        return 'data:' + blob.type + ';base64,' + base64String;
    });
}
/**
 * Convert an image's `src` URL to a data URL by loading the image and painting
 * it to a `canvas`.
 *
 * Note: this will coerce the image to the desired content type, and it
 * will only paint the first frame of an animated GIF.
 *
 * Examples:
 *
 * ```js
 * blobUtil.imgSrcToDataURL('http://mysite.com/img.png').then(function (dataURL) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * ```js
 * blobUtil.imgSrcToDataURL('http://some-other-site.com/img.jpg', 'image/jpeg',
 *                          'Anonymous', 1.0).then(function (dataURL) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param src - image src
 * @param type - the content type (optional, defaults to 'image/png')
 * @param crossOrigin - for CORS-enabled images, set this to
 *                                         'Anonymous' to avoid "tainted canvas" errors
 * @param quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns Promise that resolves with the data URL string
 */
function imgSrcToDataURL(src, type, crossOrigin, quality) {
    type = type || 'image/png';
    return loadImage(src, crossOrigin).then(imgToCanvas).then(function (canvas) {
        return canvas.toDataURL(type, quality);
    });
}
/**
 * Convert a `canvas` to a `Blob`.
 *
 * Examples:
 *
 * ```js
 * blobUtil.canvasToBlob(canvas).then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * Most browsers support converting a canvas to both `'image/png'` and `'image/jpeg'`. You may
 * also want to try `'image/webp'`, which will work in some browsers like Chrome (and in other browsers, will just fall back to `'image/png'`):
 *
 * ```js
 * blobUtil.canvasToBlob(canvas, 'image/webp').then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param canvas - HTMLCanvasElement
 * @param type - the content type (optional, defaults to 'image/png')
 * @param quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns Promise that resolves with the `Blob`
 */
function canvasToBlob(canvas, type, quality) {
    if (typeof canvas.toBlob === 'function') {
        return new Promise(function (resolve) {
            canvas.toBlob(resolve, type, quality);
        });
    }
    return Promise.resolve(dataURLToBlob(canvas.toDataURL(type, quality)));
}
/**
 * Convert an image's `src` URL to a `Blob` by loading the image and painting
 * it to a `canvas`.
 *
 * Note: this will coerce the image to the desired content type, and it
 * will only paint the first frame of an animated GIF.
 *
 * Examples:
 *
 * ```js
 * blobUtil.imgSrcToBlob('http://mysite.com/img.png').then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * ```js
 * blobUtil.imgSrcToBlob('http://some-other-site.com/img.jpg', 'image/jpeg',
 *                          'Anonymous', 1.0).then(function (blob) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param src - image src
 * @param type - the content type (optional, defaults to 'image/png')
 * @param crossOrigin - for CORS-enabled images, set this to
 *                                         'Anonymous' to avoid "tainted canvas" errors
 * @param quality - a number between 0 and 1 indicating image quality
 *                                     if the requested type is 'image/jpeg' or 'image/webp'
 * @returns Promise that resolves with the `Blob`
 */
function imgSrcToBlob(src, type, crossOrigin, quality) {
    type = type || 'image/png';
    return loadImage(src, crossOrigin).then(imgToCanvas).then(function (canvas) {
        return canvasToBlob(canvas, type, quality);
    });
}
/**
 * Convert an `ArrayBuffer` to a `Blob`.
 *
 * Example:
 *
 * ```js
 * var blob = blobUtil.arrayBufferToBlob(arrayBuff, 'audio/mpeg');
 * ```
 *
 * @param buffer
 * @param type - the content type (optional)
 * @returns Blob
 */
function arrayBufferToBlob(buffer, type) {
    return createBlob([buffer], type);
}
/**
 * Convert a `Blob` to an `ArrayBuffer`.
 *
 * Example:
 *
 * ```js
 * blobUtil.blobToArrayBuffer(blob).then(function (arrayBuff) {
 *   // success
 * }).catch(function (err) {
 *   // error
 * });
 * ```
 *
 * @param blob
 * @returns Promise that resolves with the `ArrayBuffer`
 */
function blobToArrayBuffer(blob) {
    return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onloadend = function () {
            var result = reader.result || new ArrayBuffer(0);
            resolve(result);
        };
        reader.onerror = reject;
        reader.readAsArrayBuffer(blob);
    });
}
/**
 * Convert an `ArrayBuffer` to a binary string.
 *
 * Example:
 *
 * ```js
 * var myString = blobUtil.arrayBufferToBinaryString(arrayBuff)
 * ```
 *
 * @param buffer - array buffer
 * @returns binary string
 */
function arrayBufferToBinaryString(buffer) {
    var binary = '';
    var bytes = new Uint8Array(buffer);
    var length = bytes.byteLength;
    var i = -1;
    while (++i < length) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
}
/**
 * Convert a binary string to an `ArrayBuffer`.
 *
 * ```js
 * var myBuffer = blobUtil.binaryStringToArrayBuffer(binaryString)
 * ```
 *
 * @param binary - binary string
 * @returns array buffer
 */
function binaryStringToArrayBuffer(binary) {
    var length = binary.length;
    var buf = new ArrayBuffer(length);
    var arr = new Uint8Array(buf);
    var i = -1;
    while (++i < length) {
        arr[i] = binary.charCodeAt(i);
    }
    return buf;
}




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