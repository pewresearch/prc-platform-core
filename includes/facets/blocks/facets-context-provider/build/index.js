(()=>{"use strict";var e={n:t=>{var o=t&&t.__esModule?()=>t.default:()=>t;return e.d(o,{a:o}),o},d:(t,o)=>{for(var n in o)e.o(o,n)&&!e.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const t=window.wp.blocks,o=window.React,n=window.prcIcons;window.wp.i18n;const r=window.wp.element,s=window.wp.blockEditor,c=window.wp.apiFetch;var a=e.n(c);const i=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/facets-context-provider","version":"0.1.0","title":"Facets Context Provider","description":"Handles passing facets context to query blocks and facet ui blocks.","category":"theme","keywords":["facets","query","loop"],"supports":{"anchor":false,"html":false,"reusable":false,"multiple":false,"interactivity":true},"usesContext":["postType","templateSlug","previewPostType","facetsContextProvider"],"textdomain":"prc-facets-context-provider","editorScript":"file:./index.js"}'),{name:l}=i,p={icon:function(){return(0,o.createElement)(n.Icon,{icon:n.icons.faFilterListSolid,width:21,preserveAspectRatio:"xMidYMid meet"})},edit:function({clientId:e,context:t}){const{settings:n,isLoading:c}=function(){const[e,t]=(0,r.useState)(null),[o,n]=(0,r.useState)(!0);return(0,r.useEffect)((()=>{a()({path:"/prc-api/v3/facets/get-settings"}).then((e=>{const o=(e=>{const{facets:t}=e,o={};return Object.keys(t).forEach((e=>{const n=t[e].name;o[n]={name:n,label:t[e].label,source:t[e].source,type:t[e].type,show_expanded:t[e]?.show_expanded,limit:t[e]?.count,soft_limit:t[e]?.soft_limit,label_any:t[e]?.label_any,format:t[e]?.format,hierarchical:t[e]?.hierarchical}})),o})(e);t(o),n(!1)})).catch((e=>{t(null),n(!1)}))}),[]),(0,r.useMemo)((()=>({settings:e,isLoading:o})),[e,o])}(),i=(0,r.useMemo)((()=>({facetsContextProvider:{...n},...t})),[n,t]),l=(0,s.useBlockProps)(),p=(0,s.useInnerBlocksProps)(l,{});return(0,o.createElement)(s.BlockContextProvider,{key:`facets-context-provider-${e}`,value:i},(0,o.createElement)("div",{...p}))},save:function(){return(0,o.createElement)(s.InnerBlocks.Content,null)}};(0,t.registerBlockType)(l,{...i,...p})})();
//# sourceMappingURL=index.js.map