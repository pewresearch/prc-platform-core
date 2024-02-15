(()=>{"use strict";const e=window.wp.blocks,t=window.React,o=window.wp.primitives,n=(0,t.createElement)(o.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,t.createElement)(o.Path,{d:"M18 11.3l-1-1.1-4 4V3h-1.5v11.3L7 10.2l-1 1.1 6.2 5.8 5.8-5.8zm.5 3.7v3.5h-13V15H4v5h16v-5h-1.5z"})),r=(window.classnames,window.prcBlockUtils,window.wp.blockEditor),i=["core/button","core/group"],s=[["core/button",{}]],a=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/dataset-download","version":"0.1.0","title":"Dataset Download","category":"theme","description":"This block allows you to download the specified dataset. First it checks for user accounts credentials and then it provides a download button.","attributes":{},"supports":{"anchor":true,"html":false,"spacing":{"blockGap":true,"margin":true,"padding":true,"__experimentalDefaultControls":{"padding":true,"margin":true}},"interactivity":true},"textdomain":"dataset-download","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php","viewScriptModule":"file:./view.js"}'),{name:l}=a,c={icon:n,edit:function({attributes:e,setAttributes:o}){const{allowedBlocks:n}=e,a=(0,r.useBlockProps)(),l=(0,r.useInnerBlocksProps)({},{allowedBlocks:n||i,templateLock:!1,template:s});return(0,t.createElement)("div",{...a},(0,t.createElement)("div",{...l}))},save:function(){return(0,t.createElement)(r.InnerBlocks.Content,null)}};(0,e.registerBlockType)(l,{...a,...c})})();
//# sourceMappingURL=index.js.map