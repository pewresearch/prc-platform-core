!function(){"use strict";var e={n:function(t){var n=t&&t.__esModule?function(){return t.default}:function(){return t};return e.d(n,{a:n}),n},d:function(t,n){for(var o in n)e.o(n,o)&&!e.o(t,o)&&Object.defineProperty(t,o,{enumerable:!0,get:n[o]})},o:function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}},t=window.wp.blocks,n=window.React,o=window.prcIcons;window.wp.i18n;var r=window.wp.element,i=window.wp.blockEditor,c=window.wp.apiFetch,s=e.n(c);var a=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/facets-context-provider","version":"0.1.0","title":"Facets Context Provider","description":"Handles passing facets context to query blocks and facet ui blocks.","category":"theme","keywords":["facets","query","loop"],"supports":{"anchor":false,"html":false,"reusable":false,"multiple":false,"interactivity":true},"usesContext":["postType","templateSlug","previewPostType","facetsContextProvider"],"textdomain":"prc-facets-context-provider","editorScript":"file:./index.js","viewScript":"file:./view/index.js"}');const{name:l}=a,u={icon:function(){return(0,n.createElement)(o.Icon,{icon:o.icons.faFilterListSolid,width:21,preserveAspectRatio:"xMidYMid meet"})},edit:function({clientId:e,context:t}){const{settings:o,isLoading:c}=function(){const[e,t]=(0,r.useState)(null),[n,o]=(0,r.useState)(!0);return(0,r.useEffect)((()=>{s()({path:"/prc-api/v3/facets/get-settings"}).then((e=>{const n=(e=>{const{facets:t}=e,n={};return Object.keys(t).forEach((e=>{const o=t[e].name;n[o]={name:o,label:t[e].label,source:t[e].source,type:t[e].type,show_expanded:t[e]?.show_expanded,limit:t[e]?.count,soft_limit:t[e]?.soft_limit,label_any:t[e]?.label_any,format:t[e]?.format,hierarchical:t[e]?.hierarchical}})),n})(e);t(n),o(!1)})).catch((e=>{t(null),o(!1)}))}),[]),(0,r.useMemo)((()=>({settings:e,isLoading:n})),[e,n])}(),a=(0,r.useMemo)((()=>({facetsContextProvider:{...o},...t})),[o,t]),l=(0,i.useBlockProps)(),u=(0,i.useInnerBlocksProps)(l,{});return(0,n.createElement)(i.BlockContextProvider,{key:`facets-context-provider-${e}`,value:a},(0,n.createElement)("div",{...u}))},save:function(){return(0,n.createElement)(i.InnerBlocks.Content,null)}};(0,t.registerBlockType)(l,{...a,...u})}();
//# sourceMappingURL=index.js.map