(()=>{"use strict";const e=window.wp.blocks,t=window.prcIcons,i=window.ReactJSXRuntime,r=window.wp.blockEditor,n=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/facets-results-info","version":"1.0.0","title":"Facets Results Info","category":"theme","description":"Display the number of results and the range of results being displayed.","attributes":{},"supports":{"anchor":true,"html":false,"multiple":false,"reusable":false,"color":{"text":true,"link":true},"spacing":{"blockGap":true,"margin":["top","bottom"],"padding":true,"__experimentalDefaultControls":{"padding":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true,"__experimentalFontFamily":true}},"interactivity":{"clientNavigation":true}},"usesContext":["postType","templateSlug","previewPostType","facetsContextProvider"],"textdomain":"facets-pager","editorScript":"file:./index.js","style":"file:./style-index.css","render":"file:./render.php","viewScriptModule":"file:./view.js"}'),{name:s}=n,o={icon:function(){return(0,i.jsx)(t.Icon,{icon:"filters"})},edit:function({attributes:e,setAttributes:t,context:n,clientId:s,isSelected:o}){const l=(0,r.useBlockProps)();return(0,i.jsx)("div",{...l,children:(0,i.jsx)("span",{children:"Displaying 1-10 of 20 results"})})}};(0,e.registerBlockType)(s,{...n,...o})})();
//# sourceMappingURL=index.js.map