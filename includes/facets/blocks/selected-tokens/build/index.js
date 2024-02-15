(()=>{"use strict";var e,t={404:()=>{window.wp.i18n;const e=window.wp.blocks,t=window.React,r=window.prcIcons,n=window.wp.element,o=window.wp.blockEditor,s=window.wp.components;function i({attributes:e,setAttributes:r,context:n}){return(0,t.createElement)(o.InspectorControls,null,(0,t.createElement)(s.PanelBody,{title:"Block Controls"},(0,t.createElement)(s.BaseControl,{label:"Do Something"},(0,t.createElement)(s.Button,{variant:"primary"},"Do Something"))))}function a({attributes:e,setAttributes:r,context:n}){return(0,t.createElement)(i,{attributes:e,setAttributes:r,context:n})}window.wp.coreData;const l=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/selected-tokens","version":"0.1.0","title":"Facet Selected Tokens","category":"theme","description":"Display a list of selected, active facets as tokens","attributes":{"orientation":{"type":"string","default":"vertical"}},"supports":{"anchor":true,"html":false,"multiple":false,"reusable":false,"spacing":{"blockGap":true,"margin":["top","bottom"],"padding":true,"__experimentalDefaultControls":{"padding":true}},"typography":{"fontSize":true,"__experimentalFontFamily":true,"__experimentalDefaultControls":{"fontSize":true,"__experimentalFontFamily":true}},"interactivity":true},"usesContext":["postType","templateSlug","previewPostType","facetsContextProvider"],"textdomain":"selected-tokens","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php"}'),{name:c}=l,p={icon:function(){return(0,t.createElement)(r.Icon,{icon:r.icons.faFilters,width:21,preserveAspectRatio:"xMidYMid meet"})},edit:function({attributes:e,setAttributes:r,context:s,clientId:i,isSelected:l}){const c=(0,o.useBlockProps)();return(0,t.createElement)(n.Fragment,null,(0,t.createElement)(a,{attributes:e,setAttributes:r,context:!1}),(0,t.createElement)("div",{...c},(0,t.createElement)("span",{class:"wp-block-prc-platform-selected-tokens__token"},"Topics: X, Y, Z"),(0,t.createElement)("span",{class:"wp-block-prc-platform-selected-tokens__token"},"Formats: X, Y, Z"),(0,t.createElement)("span",{class:"wp-block-prc-platform-selected-tokens__token"},"Year: 2021")))}};(0,e.registerBlockType)(c,{...l,...p})}},r={};function n(e){var o=r[e];if(void 0!==o)return o.exports;var s=r[e]={exports:{}};return t[e](s,s.exports,n),s.exports}n.m=t,e=[],n.O=(t,r,o,s)=>{if(!r){var i=1/0;for(p=0;p<e.length;p++){for(var[r,o,s]=e[p],a=!0,l=0;l<r.length;l++)(!1&s||i>=s)&&Object.keys(n.O).every((e=>n.O[e](r[l])))?r.splice(l--,1):(a=!1,s<i&&(i=s));if(a){e.splice(p--,1);var c=o();void 0!==c&&(t=c)}}return t}s=s||0;for(var p=e.length;p>0&&e[p-1][2]>s;p--)e[p]=e[p-1];e[p]=[r,o,s]},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={656:0,564:0};n.O.j=t=>0===e[t];var t=(t,r)=>{var o,s,[i,a,l]=r,c=0;if(i.some((t=>0!==e[t]))){for(o in a)n.o(a,o)&&(n.m[o]=a[o]);if(l)var p=l(n)}for(t&&t(r);c<i.length;c++)s=i[c],n.o(e,s)&&e[s]&&e[s][0](),e[s]=0;return n.O(p)},r=globalThis.webpackChunkselected_tokens=globalThis.webpackChunkselected_tokens||[];r.forEach(t.bind(null,0)),r.push=t.bind(null,r.push.bind(r))})();var o=n.O(void 0,[564],(()=>n(404)));o=n.O(o)})();
//# sourceMappingURL=index.js.map