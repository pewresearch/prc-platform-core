(()=>{"use strict";var e,t={894:(e,t,a)=>{const l=window.React,r=window.wp.primitives,n=(0,l.createElement)(r.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,l.createElement)(r.Path,{d:"M14.103 7.128l2.26-2.26a4 4 0 00-5.207 4.804L5.828 15a2 2 0 102.828 2.828l5.329-5.328a4 4 0 004.804-5.208l-2.261 2.26-1.912-.512-.513-1.912zm-7.214 9.64a.5.5 0 11.707-.707.5.5 0 01-.707.707z"})),s=window.wp.blocks,o=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/feature-loader","version":"0.1.0","title":"Feature Loader","description":"Load a feature\'s JS and CSS files.","category":"media","keywords":["feature","loader"],"attributes":{"slug":{"type":"string"},"researchArea":{"type":"string"},"year":{"type":"string"},"dataAttachmentId":{"type":"integer"},"featurePropType":{"type":"string"},"legacyWpackIo":{"type":"object","properties":{"appName":{"type":"string"},"path":{"type":"string"},"deps":{"type":"string"}}},"legacyS3":{"type":"object","properties":{"libraries":{"type":"string"},"path":{"type":"string"},"styles":{"type":"string"},"react":{"type":"boolean"}}}},"supports":{"anchor":true,"html":false},"usesContext":["queryId","query","queryContext","templateSlug","previewPostType","postId","postType"],"textdomain":"prc-platform-feature-loader","editorScript":"file:./index.js","style":"file:./style-index.css"}'),c=window.wp.i18n,i=window.wp.components,p=window.wp.element,u=window.wp.blockEditor,d=window.wp.apiFetch;var m=a.n(d);const h=window.prcComponents;function f({id:e,setNewId:t,disabled:a=!1,children:r}){return(0,l.createElement)(p.Fragment,null,(0,l.createElement)(h.MediaDropZone,{attachmentId:e,disabled:a,onUpdate:e=>{"function"==typeof t&&t(e.id)},onClear:()=>{"function"==typeof t&&t(null)},mediaType:["text/csv","application/json"],label:(0,c.__)("Drop or Select a Data File (CSV or JSON)"),singularLabel:(0,c.__)("Data File")},(0,l.createElement)(i.Button,{variant:"primary"},"Modify Data File")),e&&r)}function g(e,t){for(const a in e)if("object"==typeof e[a]){const l=g(e[a],t);if(l)return l}else if(e.hasOwnProperty("slug")&&e.slug===t)return e;return null}const y="prc-platform/feature-loader";function v({id:e,appName:t,path:a,deps:l,version:r}){return(0,s.createBlock)(y,{slug:e,legacyWpackIo:{appName:t,path:a,deps:l}})}function b({id:e,path:t,react:a,libraries:l,styles:r}){return(0,s.createBlock)(y,{slug:e,legacyAssetsS3:{path:t,react:a,libraries:l,styles:r}})}function w(e){if(!e)return;console.log("convertTextRaw()",e);const t=null!==e.match(/\[load_interactive/),a=null!==e.match(/\[js_interactive/),l=e.match(/id="([^"]+)"/),r=e.match(/appName="([^"]+)"/),n=e.match(/path="([^"]+)"/),s=e.match(/deps="([^"]+)"/),o=e.match(/version="([^"]+)"/),c=e.match(/react="([^"]+)"/),i=e.match(/libraries="([^"]+)"/),p=e.match(/styles="([^"]+)"/);return console.log("isLoadInteractive",t),console.log("isJsInteractive",a),console.log(e),t?v({id:null!==l?l[1]:null,appName:null!==r?r[1]:null,path:null!==n?n[1]:null,deps:null!==s?s[1]:"",version:null!==o?o[1]:null}):a?b({id:null!==l?l[1]:null,path:null!==n?n[1]:null,react:null!==c?c[1]:null,libraries:null!==i?i[1]:null,styles:null!==p?p[1]:null}):void 0}const E={from:[{type:"shortcode",tag:"load_interactive",transform:({named:{id:e,appName:t,path:a,deps:l,version:r}})=>(console.log("name",named),v({id:e,appName:t,path:a,deps:l,version:r})),isMatch:({named:{id:e,appName:t,path:a}})=>!!e&&!!t&&!!a},{type:"shortcode",tag:"js_interactive",transform:({named:{id:e,path:t,libraries:a,styles:l,react:r}})=>(console.log("name",named),b({id:e,path:t,react:r,libraries:a,styles:l})),isMatch:({named:{path:e,react:t}})=>t},{type:"block",blocks:["core/shortcode"],transform:({text:e})=>w(e)},{type:"block",blocks:["core/html"],transform:({content:e})=>w(e)}]},{name:k}=o,S={icon:n,edit:function({attributes:e,setAttributes:t,clientId:a,context:r}){const{postId:s}=r,o=(0,u.useBlockProps)(),[d,h]=(0,p.useState)(!1),{slug:y,year:v,researchArea:b,dataAttachmentId:w,legacyWpackIo:E,legacyAssetsS3:k}=e,S=(0,p.useMemo)((()=>E||k),[E,k]),{features:_}=function(){const[e,t]=(0,p.useState)([]);return(0,p.useEffect)((()=>{m()({path:"/prc-api/v3/feature/get-assets"}).then((e=>{console.log("features->get_assets->",{data:e}),t(e)}))}),[]),{features:e}}(),x=(0,p.useMemo)((()=>_&&y?g(_,y):null),[_,y]),I=(0,p.useMemo)((()=>x?.title||(0,c.__)("Select Feature")),[x]),O=(0,p.useMemo)((()=>{const e=[{label:"Select Research Area",value:null}];return null!==_&&Object.keys(_).length>0&&Object.keys(_).forEach((t=>{const a=t.charAt(0).toUpperCase()+t.slice(1);e.push({label:a,value:t})})),e}),[_]),j=(0,p.useMemo)((()=>{const e=[{label:"Select Year",value:null}];return null!==_&&Object.keys(_).length>0&&b&&Object.keys(_[b]).forEach((t=>{e.push({label:t,value:t})})),e}),[_,b]),C=(0,p.useMemo)((()=>{const e={label:"Select Feature",value:null};if(null===b||null===v)return[e];const t=_?.[b]?.[v];if(!t)return[e];const a=t.map((e=>({label:e.title,value:e.slug})));return a.unshift(e),a}),[_,b,v]);return(0,l.createElement)("div",{...o},S&&(0,l.createElement)(u.Warning,null,(0,l.createElement)("p",null,"This feature is being loaded via legacy means:"," ",(0,l.createElement)("strong",null,void 0!==E?"WPackIo":"Assets S3"),"."),(0,l.createElement)("p",null,"Please update this feature's code and bring it into"," ",(0,l.createElement)("i",null,"/features")," and up to ",(0,l.createElement)("i",null,"@wordpress/scripts")," ","compliance at earliest convenience"),(0,l.createElement)(i.Button,{isDestructive:!0,variant:"primary",onClick:()=>t({slug:null,legacyAssetsS3:null,legacyWpackIo:null}),text:"Reset Feature Selection"})),!S&&(0,l.createElement)(i.Placeholder,{label:I,icon:n},null===x&&(0,l.createElement)(i.Flex,{gap:"5px"},(0,l.createElement)(i.FlexItem,null,(0,l.createElement)(i.SelectControl,{label:"Select Research Area",value:b,options:O,onChange:e=>{t({researchArea:e})}})),(0,l.createElement)(i.FlexItem,null,(0,l.createElement)(i.SelectControl,{label:"Select Year",value:v,options:j,onChange:e=>{t({year:e})}})),(0,l.createElement)(i.FlexBlock,null,(0,l.createElement)(i.SelectControl,{label:"Select Feature",value:y,disabled:0===C.length,options:C,onChange:e=>{t({slug:e})}}))),x&&(0,l.createElement)("div",null,(0,l.createElement)(i.Button,{variant:"secondary",onClick:()=>t({slug:null}),text:"Reset Feature Selection"}),(0,l.createElement)(f,{id:w,setNewId:e=>{t({dataAttachmentId:e})}},(0,l.createElement)("p",null,"Data accessible via Rest API:"),(0,l.createElement)("p",null,(0,l.createElement)("pre",null,"/wp-json/prc-api/v3/feature/get-data/",`${w}`))))))},transforms:E};(0,s.registerBlockType)(k,{...o,...S})}},a={};function l(e){var r=a[e];if(void 0!==r)return r.exports;var n=a[e]={exports:{}};return t[e](n,n.exports,l),n.exports}l.m=t,e=[],l.O=(t,a,r,n)=>{if(!a){var s=1/0;for(p=0;p<e.length;p++){for(var[a,r,n]=e[p],o=!0,c=0;c<a.length;c++)(!1&n||s>=n)&&Object.keys(l.O).every((e=>l.O[e](a[c])))?a.splice(c--,1):(o=!1,n<s&&(s=n));if(o){e.splice(p--,1);var i=r();void 0!==i&&(t=i)}}return t}n=n||0;for(var p=e.length;p>0&&e[p-1][2]>n;p--)e[p]=e[p-1];e[p]=[a,r,n]},l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var a in t)l.o(t,a)&&!l.o(e,a)&&Object.defineProperty(e,a,{enumerable:!0,get:t[a]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={57:0,350:0};l.O.j=t=>0===e[t];var t=(t,a)=>{var r,n,[s,o,c]=a,i=0;if(s.some((t=>0!==e[t]))){for(r in o)l.o(o,r)&&(l.m[r]=o[r]);if(c)var p=c(l)}for(t&&t(a);i<s.length;i++)n=s[i],l.o(e,n)&&e[n]&&e[n][0](),e[n]=0;return l.O(p)},a=globalThis.webpackChunk_pewresearch_prc_platform_interactives_loader=globalThis.webpackChunk_pewresearch_prc_platform_interactives_loader||[];a.forEach(t.bind(null,0)),a.push=t.bind(null,a.push.bind(a))})();var r=l.O(void 0,[350],(()=>l(894)));r=l.O(r)})();
//# sourceMappingURL=index.js.map