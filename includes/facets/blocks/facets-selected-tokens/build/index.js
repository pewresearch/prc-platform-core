(()=>{"use strict";var e,t={792:(e,t,o)=>{const r=window.wp.i18n,n=window.wp.blocks,l=window.React,s=window.prcIcons,a=window.classnames;var c=o.n(a);const i=window.wp.blockEditor,u=window.wp.element,d=window.wp.components;function p({colors:e,clientId:t}){const o=(0,i.__experimentalUseMultipleOriginColorsAndGradients)(),n=(0,u.useMemo)((()=>{const{tokenBorderColor:t,setTokenBorderColor:o,tokenBackgroundColor:n,setTokenBackgroundColor:l}=e;return[{colorValue:t?.color,onColorChange:o,label:(0,r.__)("Token Border Color")},{colorValue:n?.color,onColorChange:l,label:(0,r.__)("Token Background Color")}]}),[e]);return(0,l.createElement)(i.InspectorControls,{group:"color"},(0,l.createElement)(i.__experimentalColorGradientSettingsDropdown,{settings:n,panelId:t,hasColorsOrGradients:!1,disableCustomColors:!1,__experimentalIsRenderedInSidebar:!0,...o}))}function m({colors:e,clientId:t}){return(0,l.createElement)(u.Fragment,null,(0,l.createElement)(i.InspectorControls,null,(0,l.createElement)(d.PanelBody,{title:"Block Controls"},(0,l.createElement)(d.BaseControl,{label:"Do Something"},(0,l.createElement)(d.Button,{variant:"primary"},"Do Something")))),(0,l.createElement)(p,{colors:e,clientId:t}))}function k({attributes:e,setAttributes:t,context:o,colors:r,clientId:n}){return(0,l.createElement)(m,{attributes:e,setAttributes:t,context:o,colors:r,clientId:n})}window.wp.coreData;const g=(0,i.withColors)({tokenBorderColor:"color",tokenBackgroundColor:"color"})((function({attributes:e,setAttributes:t,context:o,clientId:r,isSelected:n,tokenBorderColor:a,tokenBackgroundColor:u,setTokenBorderColor:d,setTokenBackgroundColor:p}){const m=(0,i.useBlockProps)(),g=(0,l.useMemo)((()=>(0,l.createElement)(s.Icon,{icon:"circle-xmark"})),[]),f=c()("wp-block-prc-platform-facets-selected-tokens__token",`has-border-${a.slug}-color`,`has-${u.slug}-background-color`,{"has-border-color":a.slug,"has-background-color":u.slug});return(0,l.createElement)(l.Fragment,null,(0,l.createElement)(k,{attributes:e,setAttributes:t,context:!1,clientId:r,colors:{tokenBorderColor:a,tokenBackgroundColor:u,setTokenBorderColor:d,setTokenBackgroundColor:p}}),(0,l.createElement)("ul",{...m},(0,l.createElement)("li",{className:"wp-block-prc-platform-facets-selected-tokens__pager"},"Displaying 1-10 of 20 results!!!!"),(0,l.createElement)("li",null,"Filtering by:"),(0,l.createElement)("li",{className:f},(0,l.createElement)("span",null,"Topics: X, Y, Z"),g),(0,l.createElement)("li",{className:f},(0,l.createElement)("span",null,"Formats: X, Y, Z"),g),(0,l.createElement)("li",{className:f},(0,l.createElement)("span",null,"Year: 2021"),g),(0,l.createElement)("li",null,(0,l.createElement)("span",null,"Reset"),g)))})),f=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/facets-selected-tokens","version":"0.1.0","title":"Facets Selected Tokens","category":"theme","description":"Display a list of selected facets styled as tokens.","attributes":{"orientation":{"type":"string","default":"vertical"},"tokenBorderColor":{"type":"string"},"tokenBackgroundColor":{"type":"string"}},"supports":{"anchor":true,"html":false,"multiple":false,"reusable":false,"color":{"text":true,"link":true},"spacing":{"blockGap":true,"margin":["top","bottom"],"padding":true,"__experimentalDefaultControls":{"padding":true}},"typography":{"fontSize":true,"__experimentalFontFamily":true,"__experimentalDefaultControls":{"fontSize":true,"__experimentalFontFamily":true}},"interactivity":{"clientNavigation":true}},"usesContext":["postType","templateSlug","previewPostType","facetsContextProvider"],"textdomain":"selected-tokens","editorScript":"file:./index.js","editorStyle":"file:./index.css","style":"file:./style-index.css","render":"file:./render.php","viewScriptModule":"file:./view.js"}'),{name:b}=f,C={icon:function(){return(0,l.createElement)(s.Icon,{icon:"filters"})},edit:g};(0,n.registerBlockType)(b,{...f,...C})}},o={};function r(e){var n=o[e];if(void 0!==n)return n.exports;var l=o[e]={exports:{}};return t[e](l,l.exports,r),l.exports}r.m=t,e=[],r.O=(t,o,n,l)=>{if(!o){var s=1/0;for(u=0;u<e.length;u++){for(var[o,n,l]=e[u],a=!0,c=0;c<o.length;c++)(!1&l||s>=l)&&Object.keys(r.O).every((e=>r.O[e](o[c])))?o.splice(c--,1):(a=!1,l<s&&(s=l));if(a){e.splice(u--,1);var i=n();void 0!==i&&(t=i)}}return t}l=l||0;for(var u=e.length;u>0&&e[u-1][2]>l;u--)e[u]=e[u-1];e[u]=[o,n,l]},r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={656:0,564:0};r.O.j=t=>0===e[t];var t=(t,o)=>{var n,l,[s,a,c]=o,i=0;if(s.some((t=>0!==e[t]))){for(n in a)r.o(a,n)&&(r.m[n]=a[n]);if(c)var u=c(r)}for(t&&t(o);i<s.length;i++)l=s[i],r.o(e,l)&&e[l]&&e[l][0](),e[l]=0;return r.O(u)},o=globalThis.webpackChunkfacets_selected_tokens=globalThis.webpackChunkfacets_selected_tokens||[];o.forEach(t.bind(null,0)),o.push=t.bind(null,o.push.bind(o))})();var n=r.O(void 0,[564],(()=>r(792)));n=r.O(n)})();
//# sourceMappingURL=index.js.map