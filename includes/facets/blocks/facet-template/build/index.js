(()=>{"use strict";var e,t={583:()=>{const e=window.wp.i18n,t=window.wp.blocks,a=window.React,r=window.prcComponents,l=window.prcBlockUtils,c=window.wp.blockEditor,o=window.wp.element,n=window.wp.components,p=window.wp.data;function i({attributes:e,setAttributes:r,context:l,clientId:i}){const{replaceInnerBlocks:s}=(0,p.useDispatch)("core/block-editor"),{facetName:m,facetLabel:u,facetType:f}=e,{facetsContextProvider:d}=l,b=(0,o.useMemo)((()=>{if(!d)return[{label:"No Facets Found",value:""}];const e=[{label:"Select a Facet",value:""}];return Object.keys(d).forEach((t=>{e.push({label:d[t].label,value:d[t].name})})),e}),[d]);return(0,a.createElement)(c.InspectorControls,null,(0,a.createElement)(n.PanelBody,{title:"Facet Template"},(0,a.createElement)("div",null,(0,a.createElement)(n.SelectControl,{label:"Facet",help:"Select a facet from those registered with FacetWP.",options:b,value:m,onChange:e=>{const a=e,l=d[a].type,c=d[a].label;r({facetName:a,facetType:l,facetLabel:c});const o=((e,t)=>{const a={interactiveNamespace:"prc-platform/facets-context-provider",isInteractive:!0};console.log("getTemplateForType",e,t);const r=t.replace(/_/g," ").replace(/\w\S*/g,(e=>e.replace(/^\w/,(e=>e.toUpperCase()))))+" Value";switch(e){case"checkboxes":return[["prc-block/form-input-checkbox",{type:"checkbox",label:r,...a}]];case"dropdown":case"yearly":return[["prc-block/form-input-select",{placeholder:r,...a}]];case"date_range":return[["prc-block/form-input-select",{placeholder:r,...a}],["prc-block/form-input-select",{placeholder:r,...a}]];default:return[["prc-block/form-input-checkbox",{type:"radio",label:r,...a}]]}})(l,a);s(i,(0,t.createBlocksFromInnerBlocksTemplate)(o),!1)}}),(0,a.createElement)(n.ExternalLink,{href:"/pewresearch-org/wp-admin/options-general.php?page=facetwp"},"FacetWP Settings"))))}const s=window.prcIcons,m=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/facet-template","version":"0.1.0","title":"Facet Template","category":"theme","description":"Display a facet given its slug and type as a block","attributes":{"facetName":{"type":"string","default":""},"facetType":{"type":"string"},"facetLabel":{"type":"string"}},"supports":{"anchor":true,"html":false,"spacing":{"blockGap":true,"margin":["top","bottom"],"padding":true,"__experimentalDefaultControls":{"padding":true}},"typography":{"fontSize":true,"lineHeight":true,"__experimentalFontFamily":true,"__experimentalFontWeight":true,"__experimentalFontStyle":true,"__experimentalTextTransform":true,"__experimentalTextDecoration":true,"__experimentalLetterSpacing":true,"__experimentalDefaultControls":{"fontSize":true,"__experimentalFontFamily":true}},"interactivity":true},"selectors":{"root":".wp-block-prc-platform-facet-template","typography":"h5"},"usesContext":["postType","templateSlug","previewPostType","facetsContextProvider"],"providesContext":{"prc-facets/template/facetType":"facetType","prc-facets/template/facetName":"facetName","prc-facets/template/facetLabel":"facetLabel"},"textdomain":"facet-template","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css"}'),{name:u}=m,f={icon:function(){return(0,a.createElement)(s.Icon,{icon:s.icons.faFilterList,width:21,preserveAspectRatio:"xMidYMid meet"})},edit:function({attributes:t,setAttributes:o,context:n,clientId:p,isSelected:s}){const{facetName:m,facetType:u,facetLabel:f}=t,d=(0,c.useBlockProps)({style:{"--block-gap":(0,l.getBlockGapSupportValue)(t)}}),b=(0,a.useMemo)((()=>["dropdown","yearly","date_range"].includes(u)?[{label:"Dropdown"}]:[{label:"Item 1"},{label:"Item 2"},{label:"Item 3"}]),[u]);return(0,a.createElement)(a.Fragment,null,(0,a.createElement)(i,{attributes:t,setAttributes:o,context:n,clientId:p}),(0,a.createElement)("div",{...d},(0,a.createElement)(c.RichText,{tagName:"h5",placeholder:(0,e.__)("Facet Template","prc"),value:f,onChange:e=>o({facetLabel:e}),keepPlaceholderOnFocus:!0,className:"wp-block-prc-platform-facet-template__label"}),(0,a.createElement)(r.InnerBlocksAsContextTemplate,{clientId:p,allowedBlocks:["prc-block/form-input-checkbox","prc-block/form-input-select"],blockContexts:b,isResolving:!1,loadingLabel:"Loading Facet..."})))},save:function({attributes:e}){return(0,a.createElement)(c.InnerBlocks.Content,null)}};(0,t.registerBlockType)(u,{...m,...f})}},a={};function r(e){var l=a[e];if(void 0!==l)return l.exports;var c=a[e]={exports:{}};return t[e](c,c.exports,r),c.exports}r.m=t,e=[],r.O=(t,a,l,c)=>{if(!a){var o=1/0;for(s=0;s<e.length;s++){for(var[a,l,c]=e[s],n=!0,p=0;p<a.length;p++)(!1&c||o>=c)&&Object.keys(r.O).every((e=>r.O[e](a[p])))?a.splice(p--,1):(n=!1,c<o&&(o=c));if(n){e.splice(s--,1);var i=l();void 0!==i&&(t=i)}}return t}c=c||0;for(var s=e.length;s>0&&e[s-1][2]>c;s--)e[s]=e[s-1];e[s]=[a,l,c]},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={826:0,431:0};r.O.j=t=>0===e[t];var t=(t,a)=>{var l,c,[o,n,p]=a,i=0;if(o.some((t=>0!==e[t]))){for(l in n)r.o(n,l)&&(r.m[l]=n[l]);if(p)var s=p(r)}for(t&&t(a);i<o.length;i++)c=o[i],r.o(e,c)&&e[c]&&e[c][0](),e[c]=0;return r.O(s)},a=globalThis.webpackChunkfacet_template=globalThis.webpackChunkfacet_template||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var l=r.O(void 0,[431],(()=>r(583)));l=r.O(l)})();
//# sourceMappingURL=index.js.map