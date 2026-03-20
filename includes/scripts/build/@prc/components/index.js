(()=>{var e={106:(e,t)=>{(()=>{var e={56:(e,t,n)=>{"use strict";e.exports=function(e){var t=n.nc;t&&e.setAttribute("nonce",t)}},72:e=>{"use strict";var t=[];function n(e){for(var n=-1,r=0;r<t.length;r++)if(t[r].identifier===e){n=r;break}return n}function r(e,r){for(var o={},s=[],a=0;a<e.length;a++){var l=e[a],c=r.base?l[0]+r.base:l[0],u=o[c]||0,d="".concat(c," ").concat(u);o[c]=u+1;var p=n(d),h={css:l[1],media:l[2],sourceMap:l[3],supports:l[4],layer:l[5]};if(-1!==p)t[p].references++,t[p].updater(h);else{var f=i(h,r);r.byIndex=a,t.splice(a,0,{identifier:d,updater:f,references:1})}s.push(d)}return s}function i(e,t){var n=t.domAPI(t);return n.update(e),function(t){if(t){if(t.css===e.css&&t.media===e.media&&t.sourceMap===e.sourceMap&&t.supports===e.supports&&t.layer===e.layer)return;n.update(e=t)}else n.remove()}}e.exports=function(e,i){var o=r(e=e||[],i=i||{});return function(e){e=e||[];for(var s=0;s<o.length;s++){var a=n(o[s]);t[a].references--}for(var l=r(e,i),c=0;c<o.length;c++){var u=n(o[c]);0===t[u].references&&(t[u].updater(),t.splice(u,1))}o=l}}},113:e=>{"use strict";e.exports=function(e,t){if(t.styleSheet)t.styleSheet.cssText=e;else{for(;t.firstChild;)t.removeChild(t.firstChild);t.appendChild(document.createTextNode(e))}}},192:(e,t,n)=>{"use strict";n.d(t,{A:()=>a});var r=n(601),i=n.n(r),o=n(314),s=n.n(o)()(i());s.push([e.id,':root{--wp-admin-theme-color: #007cba;--wp-admin-theme-color--rgb: 0, 124, 186;--wp-admin-theme-color-darker-10: rgb(0, 107, 160.5);--wp-admin-theme-color-darker-10--rgb: 0, 107, 161;--wp-admin-theme-color-darker-20: #005a87;--wp-admin-theme-color-darker-20--rgb: 0, 90, 135;--wp-admin-border-width-focus: 2px;--wp-block-synced-color: #7a00df;--wp-block-synced-color--rgb: 122, 0, 223;--wp-bound-block-color: var(--wp-block-synced-color)}@media(-webkit-min-device-pixel-ratio: 2),(min-resolution: 192dpi){:root{--wp-admin-border-width-focus: 1.5px}}.codeamp-components-multi-select-control__input-container{font-size:13px;line-height:normal}.codeamp-components-multi-select-control__input-container{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif;padding:6px 8px;box-shadow:0 0 0 rgba(0,0,0,0);border-radius:2px;border:1px solid #949494;font-size:16px;line-height:normal;width:100%;margin:0 0 8px 0;padding:0;cursor:text}@media not (prefers-reduced-motion){.codeamp-components-multi-select-control__input-container{transition:box-shadow .1s linear}}@media(min-width: 600px){.codeamp-components-multi-select-control__input-container{font-size:13px;line-height:normal}}.codeamp-components-multi-select-control__input-container:focus{border-color:var(--wp-admin-theme-color);box-shadow:0 0 0 .5px var(--wp-admin-theme-color);outline:2px solid rgba(0,0,0,0)}.codeamp-components-multi-select-control__input-container::-webkit-input-placeholder{color:rgba(30,30,30,.62)}.codeamp-components-multi-select-control__input-container::-moz-placeholder{color:rgba(30,30,30,.62)}.codeamp-components-multi-select-control__input-container:-ms-input-placeholder{color:rgba(30,30,30,.62)}.codeamp-components-multi-select-control__input-container.is-disabled{background:#ddd;border-color:#ddd}.codeamp-components-multi-select-control__input-container.is-active{border-color:var(--wp-admin-theme-color);box-shadow:0 0 0 .5px var(--wp-admin-theme-color);outline:2px solid rgba(0,0,0,0)}.codeamp-components-multi-select-control__input-container input[type=text].codeamp-components-multi-select-control__input{display:inline-block;flex:1;font-family:inherit;font-size:16px;width:100%;max-width:100%;margin-left:4px;padding:0;min-height:24px;min-width:50px;background:inherit;border:0;color:#1e1e1e;box-shadow:none;line-height:30px}@media(min-width: 600px){.codeamp-components-multi-select-control__input-container input[type=text].codeamp-components-multi-select-control__input{font-size:13px}}.codeamp-components-multi-select-control__input-container input[type=text].codeamp-components-multi-select-control__input:focus,.codeamp-components-multi-select-control.is-active .codeamp-components-multi-select-control__input-container input[type=text].codeamp-components-multi-select-control__input{outline:none;box-shadow:none}.codeamp-components-multi-select-control__input-container .codeamp-components-multi-select-control__token+input[type=text].codeamp-components-multi-select-control__input{width:auto}.codeamp-components-multi-select-control__help{font-size:12px;font-style:normal;color:#757575}.codeamp-components-multi-select-control__tokens-container{min-height:38px;padding:4px;width:100%}.codeamp-components-multi-select-control__token{font-size:13px;display:flex;color:#1e1e1e;max-width:100%;padding:0}.codeamp-components-multi-select-control__token.is-borderless{position:relative;padding:0 24px 0 0}.codeamp-components-multi-select-control__token.is-borderless .codeamp-components-multi-select-control__token-text{background:rgba(0,0,0,0);color:var(--wp-admin-theme-color)}.codeamp-components-multi-select-control__token.is-borderless .codeamp-components-multi-select-control__remove-token{background:rgba(0,0,0,0);color:#757575;position:absolute;top:1px;right:0;padding:0}.codeamp-components-multi-select-control__token.is-borderless.is-success .codeamp-components-multi-select-control__token-text{color:#4ab866}.codeamp-components-multi-select-control__token.is-borderless.is-error .codeamp-components-multi-select-control__token-text{color:#cc1818;border-radius:4px 0 0 4px;padding:0 4px 0 6px}.codeamp-components-multi-select-control__token.is-borderless.is-validating .codeamp-components-multi-select-control__token-text{color:#1e1e1e}.codeamp-components-multi-select-control__token.is-disabled .codeamp-components-multi-select-control__remove-token{cursor:default}.codeamp-components-multi-select-control__token-text,.codeamp-components-multi-select-control__remove-token.components-button{display:inline-block;line-height:30px;height:auto;background:#ddd;min-width:unset;transition:all .2s cubic-bezier(0.4, 1, 0.4, 1)}@media(prefers-reduced-motion: reduce){.codeamp-components-multi-select-control__token-text,.codeamp-components-multi-select-control__remove-token.components-button{transition-duration:0s;transition-delay:0s;animation-duration:1ms;animation-delay:0s}}.codeamp-components-multi-select-control__token-text{border-radius:2px 0 0 2px;padding:0 0 0 12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.codeamp-components-multi-select-control__remove-token.components-button{cursor:pointer;border-radius:0 2px 2px 0;padding:0 4px;color:#1e1e1e;line-height:10px;overflow:initial}.codeamp-components-multi-select-control__remove-token.components-button:hover{color:#1e1e1e}.codeamp-components-multi-select-control__suggestions-list{flex:1 0 100%;min-width:100%;overflow-y:auto;transition:all .15s ease-in-out;list-style:none;border-top:1px solid #757575;margin:0;padding:0}@media(prefers-reduced-motion: reduce){.codeamp-components-multi-select-control__suggestions-list{transition-duration:0s;transition-delay:0s}}.codeamp-components-multi-select-control__no-suggestions{color:#757575;font-size:13px;margin:0;display:block;padding:4px 8px}.codeamp-components-multi-select-control__suggestion{color:#757575;display:block;font-size:13px;padding:4px 8px;margin:0;cursor:pointer}.codeamp-components-multi-select-control__suggestion.is-selected{background:var(--wp-admin-theme-color);color:#fff}.codeamp-components-multi-select-control__suggestion-match{text-decoration:underline}',""]);const a=s},243:(e,t,n)=>{"use strict";n.d(t,{A:()=>a});var r=n(601),i=n.n(r),o=n(314),s=n.n(o)()(i());s.push([e.id,".codeamp-components-resource-select-control>.components-base-control__field{position:relative;display:flex;flex-wrap:wrap}.codeamp-components-resource-select-control>.components-base-control__field>.components-base-control__label{flex:2}.codeamp-components-resource-select-control__label{margin-bottom:8px}.codeamp-components-resource-select-control .codeamp-components-resource-select-control__menu_button.has-icon{height:40px;margin-bottom:0;min-width:26px;padding:2px 0;flex-basis:26px;width:26px}.codeamp-components-resource-select-control__select{width:auto;flex:1}.codeamp-components-resource-select-control .components-base-control{margin-bottom:0}.codeamp-components-resource-select-control .components-base-control__field{margin-bottom:0}.codeamp-components-resource-select-control .components-base-control{flex:1}",""]);const a=s},314:e=>{"use strict";e.exports=function(e){var t=[];return t.toString=function(){return this.map(function(t){var n="",r=void 0!==t[5];return t[4]&&(n+="@supports (".concat(t[4],") {")),t[2]&&(n+="@media ".concat(t[2]," {")),r&&(n+="@layer".concat(t[5].length>0?" ".concat(t[5]):""," {")),n+=e(t),r&&(n+="}"),t[2]&&(n+="}"),t[4]&&(n+="}"),n}).join("")},t.i=function(e,n,r,i,o){"string"==typeof e&&(e=[[null,e,void 0]]);var s={};if(r)for(var a=0;a<this.length;a++){var l=this[a][0];null!=l&&(s[l]=!0)}for(var c=0;c<e.length;c++){var u=[].concat(e[c]);r&&s[u[0]]||(void 0!==o&&(void 0===u[5]||(u[1]="@layer".concat(u[5].length>0?" ".concat(u[5]):""," {").concat(u[1],"}")),u[5]=o),n&&(u[2]?(u[1]="@media ".concat(u[2]," {").concat(u[1],"}"),u[2]=n):u[2]=n),i&&(u[4]?(u[1]="@supports (".concat(u[4],") {").concat(u[1],"}"),u[4]=i):u[4]="".concat(i)),t.push(u))}},t}},485:(e,t)=>{var n;!function(){"use strict";var r={}.hasOwnProperty;function i(){for(var e=[],t=0;t<arguments.length;t++){var n=arguments[t];if(n){var o=typeof n;if("string"===o||"number"===o)e.push(n);else if(Array.isArray(n)){if(n.length){var s=i.apply(null,n);s&&e.push(s)}}else if("object"===o){if(n.toString!==Object.prototype.toString&&!n.toString.toString().includes("[native code]")){e.push(n.toString());continue}for(var a in n)r.call(n,a)&&n[a]&&e.push(a)}}}return e.join(" ")}e.exports?(i.default=i,e.exports=i):void 0===(n=function(){return i}.apply(t,[]))||(e.exports=n)}()},540:e=>{"use strict";e.exports=function(e){var t=document.createElement("style");return e.setAttributes(t,e.attributes),e.insert(t,e.options),t}},601:e=>{"use strict";e.exports=function(e){return e[1]}},659:e=>{"use strict";var t={};e.exports=function(e,n){var r=function(e){if(void 0===t[e]){var n=document.querySelector(e);if(window.HTMLIFrameElement&&n instanceof window.HTMLIFrameElement)try{n=n.contentDocument.head}catch(e){n=null}t[e]=n}return t[e]}(e);if(!r)throw new Error("Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.");r.appendChild(n)}},825:e=>{"use strict";e.exports=function(e){var t=e.insertStyleElement(e);return{update:function(n){!function(e,t,n){var r="";n.supports&&(r+="@supports (".concat(n.supports,") {")),n.media&&(r+="@media ".concat(n.media," {"));var i=void 0!==n.layer;i&&(r+="@layer".concat(n.layer.length>0?" ".concat(n.layer):""," {")),r+=n.css,i&&(r+="}"),n.media&&(r+="}"),n.supports&&(r+="}");var o=n.sourceMap;o&&"undefined"!=typeof btoa&&(r+="\n/*# sourceMappingURL=data:application/json;base64,".concat(btoa(unescape(encodeURIComponent(JSON.stringify(o))))," */")),t.styleTagTransform(r,e,t.options)}(t,e,n)},remove:function(){!function(e){if(null===e.parentNode)return!1;e.parentNode.removeChild(e)}(t)}}}}},n={};function r(t){var i=n[t];if(void 0!==i)return i.exports;var o=n[t]={id:t,exports:{}};return e[t](o,o.exports,r),o.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var n in t)r.o(t,n)&&!r.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.nc=void 0;var i={};(()=>{"use strict";r.r(i),r.d(i,{MultiSelectControl:()=>Pe,ResourceSelectControl:()=>M});const e=window.wp.i18n,t=window.wp.components,n=window.wp.compose,o=window.React,s=window.wp.primitives,a=(0,o.createElement)(s.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,o.createElement)(s.Path,{d:"M13 19h-2v-2h2v2zm0-6h-2v-2h2v2zm0-6h-2V5h2v2z"}));var l=r(72),c=r.n(l),u=r(825),d=r.n(u),p=r(659),h=r.n(p),f=r(56),m=r.n(f),g=r(540),v=r.n(g),x=r(113),y=r.n(x),b=r(243),w={};w.styleTagTransform=y(),w.setAttributes=m(),w.insert=h().bind(null,"head"),w.domAPI=d(),w.insertStyleElement=v(),c()(b.A,w),b.A&&b.A.locals&&b.A.locals;var j=r(485),S=r.n(j);function k(e){return k="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},k(e)}function A(){return A=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},A.apply(null,arguments)}function T(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function C(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?T(Object(n),!0).forEach(function(t){P(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):T(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function P(e,t,n){return(t=function(e){var t=function(e){if("object"!=k(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=k(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==k(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function _(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var E=function(){},M=function(r){var i,o,s=r.onChange,l=void 0===s?E:s,c=r.label,u=void 0===c?"":c,d=r.loadingLabel,p=void 0===d?(0,e.__)("Loading","codeamp-block-components"):d,h=r.showActions,f=void 0===h||h,m=r.dropdownProps,g=r.dropdownToggleProps,v=r.disabled,x=void 0!==v&&v,y=r.defaultOption,b=r.options,w=r.value,j=r.help,k=r.id,T=r.className,P=[];p&&(P=[{value:"loading",label:p}]),b&&(P=[],y&&P.push(y),(i=P).push.apply(i,function(e){if(Array.isArray(e))return _(e)}(o=b)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(o)||function(e,t){if(e){if("string"==typeof e)return _(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_(e,t):void 0}}(o)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()));var R=(0,n.useInstanceId)(M,"codeamp-components-resource-select-control");return k&&(R=k),React.createElement(t.BaseControl,{id:R,className:S()("components-base-control codeamp-components-resource-select-control",T),help:j,label:u,__nextHasNoMarginBottom:!0},React.createElement(t.__experimentalHStack,null,React.createElement(t.SelectControl,{id:R,value:w,options:P,className:"codeamp-components-resource-select-control__select",onChange:l,disabled:x,__nextHasNoMarginBottom:!0,__next40pxDefaultSize:!0}),f&&React.createElement(t.DropdownMenu,A({icon:a,toggleProps:C(C({className:"codeamp-components-resource-select-control__menu_button",iconSize:26},g),{},{__next40pxDefaultSize:!0})},m))))};const R=window.wp.element,z=window.wp.a11y,I=window.wp.isShallowEqual;var L=r.n(I);const B=(0,o.createElement)(s.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,o.createElement)(s.Path,{d:"M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"}));var O=function(){};function V(r){var i=r.value,o=r.label,s=r.title,a=r.isBorderless,l=void 0!==a&&a,c=r.disabled,u=void 0!==c&&c,d=r.onClickRemove,p=void 0===d?O:d,h=r.onMouseEnter,f=r.onMouseLeave,m=r.messages,g=r.termPosition,v=r.termsCount,x=(0,n.useInstanceId)(V),y=S()("codeamp-components-multi-select-control__token",{"is-borderless":l,"is-disabled":u}),b=(0,e.sprintf)((0,e.__)("%1$s (%2$s of %3$s)"),o,g,v);return React.createElement("span",{className:y,onMouseEnter:h,onMouseLeave:f,title:s,style:{margin:"0"}},React.createElement("span",{className:"codeamp-components-multi-select-control__token-text",id:"codeamp-components-multi-select-control__token-text-".concat(x)},React.createElement(t.VisuallyHidden,{as:"span"},b),React.createElement("span",{"aria-hidden":"true"},o)),React.createElement(t.Button,{className:"codeamp-components-multi-select-control__remove-token",icon:B,onClick:u?O:function(){return p({value:i})},label:m.remove,"aria-describedby":"codeamp-components-multi-select-control__token-text-".concat(x)}))}var D=["value","isExpanded","instanceId","selectedSuggestionIndex","className","onChange","onFocus","onBlur"];function F(){return F=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},F.apply(null,arguments)}function N(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}const U=(0,R.forwardRef)(function(e,t){var n,r=e.value,i=e.isExpanded,o=e.instanceId,s=e.selectedSuggestionIndex,a=e.className,l=e.onChange,c=e.onFocus,u=e.onBlur,d=function(e,t){if(null==e)return{};var n,r,i=function(e,t){if(null==e)return{};var n={};for(var r in e)if({}.hasOwnProperty.call(e,r)){if(-1!==t.indexOf(r))continue;n[r]=e[r]}return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],-1===t.indexOf(n)&&{}.propertyIsEnumerable.call(e,n)&&(i[n]=e[n])}return i}(e,D),p=function(e){if(Array.isArray(e))return e}(n=(0,R.useState)(!1))||function(e){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,r,i,o,s=[],a=!0,l=!1;try{for(i=(t=t.call(e)).next;!(a=(n=i.call(t)).done)&&(s.push(n.value),2!==s.length);a=!0);}catch(e){l=!0,r=e}finally{try{if(!a&&null!=t.return&&(o=t.return(),Object(o)!==o))return}finally{if(l)throw r}}return s}}(n)||function(e){if(e){if("string"==typeof e)return N(e,2);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?N(e,2):void 0}}(n)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),h=p[0],f=p[1],m=r?r.length+1:0;return React.createElement("input",F({ref:t,id:o,type:"text"},d,{value:r||"",onChange:function(e){l&&l({value:e.target.value})},onFocus:function(e){f(!0),null==c||c(e)},onBlur:function(e){f(!1),null==u||u(e)},size:m,className:S()(a,"codeamp-components-multi-select-control__input"),autoComplete:"off",role:"combobox","aria-expanded":i,"aria-autocomplete":"list","aria-owns":i?"".concat(o,"-suggestions"):void 0,"aria-activedescendant":h&&-1!==s&&i?"".concat(o,"-suggestions-").concat(s):void 0,"aria-describedby":"".concat(o,"-howto"),"data-lpignore":"true"}))});function $(e){return $="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},$(e)}function H(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function W(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function G(e,t){var n=e["page".concat(t?"Y":"X","Offset")],r="scroll".concat(t?"Top":"Left");if("number"!=typeof n){var i=e.document;"number"!=typeof(n=i.documentElement[r])&&(n=i.body[r])}return n}function q(e){return G(e)}function K(e){return G(e,!0)}function X(e){var t=function(e){var t,n,r,i=e.ownerDocument,o=i.body,s=i&&i.documentElement;return n=(t=e.getBoundingClientRect()).left,r=t.top,{left:n-=s.clientLeft||o.clientLeft||0,top:r-=s.clientTop||o.clientTop||0}}(e),n=e.ownerDocument,r=n.defaultView||n.parentWindow;return t.left+=q(r),t.top+=K(r),t}var Y,Z=new RegExp("^(".concat(/[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source,")(?!px)[a-z%]+$"),"i"),Q=/^(top|right|bottom|left)$/,J="currentStyle",ee="runtimeStyle",te="left";function ne(e,t){for(var n=0;n<e.length;n++)t(e[n])}function re(e){return"border-box"===Y(e,"boxSizing")}"undefined"!=typeof window&&(Y=window.getComputedStyle?function(e,t,n){var r="",i=e.ownerDocument,o=n||i.defaultView.getComputedStyle(e,null);return o&&(r=o.getPropertyValue(t)||o[t]),r}:function(e,t){var n=e[J]&&e[J][t];if(Z.test(n)&&!Q.test(t)){var r=e.style,i=r[te],o=e[ee][te];e[ee][te]=e[J][te],r[te]="fontSize"===t?"1em":n||0,n=r.pixelLeft+"px",r[te]=i,e[ee][te]=o}return""===n?"auto":n});var ie=["margin","border","padding"];function oe(e,t,n){var r,i,o,s=0;for(i=0;i<t.length;i++)if(r=t[i])for(o=0;o<n.length;o++){var a;a="border"===r?"".concat(r+n[o],"Width"):r+n[o],s+=parseFloat(Y(e,a))||0}return s}function se(e){return null!=e&&e==e.window}var ae={};function le(e,t,n){if(se(e))return"width"===t?ae.viewportWidth(e):ae.viewportHeight(e);if(9===e.nodeType)return"width"===t?ae.docWidth(e):ae.docHeight(e);var r="width"===t?["Left","Right"]:["Top","Bottom"],i="width"===t?e.offsetWidth:e.offsetHeight,o=(Y(e),re(e)),s=0;(null==i||i<=0)&&(i=void 0,(null==(s=Y(e,t))||Number(s)<0)&&(s=e.style[t]||0),s=parseFloat(s)||0),void 0===n&&(n=o?1:-1);var a=void 0!==i||o,l=i||s;if(-1===n)return a?l-oe(e,["border","padding"],r):s;if(a){var c=2===n?-oe(e,["border"],r):oe(e,["margin"],r);return l+(1===n?0:c)}return s+oe(e,ie.slice(n),r)}ne(["Width","Height"],function(e){ae["doc".concat(e)]=function(t){var n=t.document;return Math.max(n.documentElement["scroll".concat(e)],n.body["scroll".concat(e)],ae["viewport".concat(e)](n))},ae["viewport".concat(e)]=function(t){var n="client".concat(e),r=t.document,i=r.body,o=r.documentElement[n];return"CSS1Compat"===r.compatMode&&o||i&&i[n]||o}});var ce={position:"absolute",visibility:"hidden",display:"block"};function ue(e){var t,n=arguments;return 0!==e.offsetWidth?t=le.apply(void 0,n):function(e,r){var i,o={},s=e.style;for(i in r)r.hasOwnProperty(i)&&(o[i]=s[i],s[i]=r[i]);for(i in function(){t=le.apply(void 0,n)}.call(e),r)r.hasOwnProperty(i)&&(s[i]=o[i])}(e,ce),t}function de(e,t,n){var r=n;if("object"!==$(t))return void 0!==r?("number"==typeof r&&(r+="px"),void(e.style[t]=r)):Y(e,t);for(var i in t)t.hasOwnProperty(i)&&de(e,i,t[i])}ne(["width","height"],function(e){var t=e.charAt(0).toUpperCase()+e.slice(1);ae["outer".concat(t)]=function(t,n){return t&&ue(t,e,n?0:1)};var n="width"===e?["Left","Right"]:["Top","Bottom"];ae[e]=function(t,r){return void 0===r?t&&ue(t,e,-1):t?(Y(t),re(t)&&(r+=oe(t,["padding","border"],n)),de(t,e,r)):void 0}});var pe=function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?W(n,!0).forEach(function(t){H(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):W(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({getWindow:function(e){var t=e.ownerDocument||e;return t.defaultView||t.parentWindow},offset:function(e,t){if(void 0===t)return X(e);!function(e,t){"static"===de(e,"position")&&(e.style.position="relative");var n,r,i=X(e),o={};for(r in t)t.hasOwnProperty(r)&&(n=parseFloat(de(e,r))||0,o[r]=n+t[r]-i[r]);de(e,o)}(e,t)},isWindow:se,each:ne,css:de,clone:function(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);if(e.overflow)for(var r in e)e.hasOwnProperty(r)&&(t.overflow[r]=e.overflow[r]);return t},scrollLeft:function(e,t){if(se(e)){if(void 0===t)return q(e);window.scrollTo(t,K(e))}else{if(void 0===t)return e.scrollLeft;e.scrollLeft=t}},scrollTop:function(e,t){if(se(e)){if(void 0===t)return K(e);window.scrollTo(q(e),t)}else{if(void 0===t)return e.scrollTop;e.scrollTop=t}},viewportWidth:0,viewportHeight:0},ae);function he(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}var fe=function(e){e.preventDefault()};const me=function(t){var r,i=t.selectedIndex,o=t.scrollIntoView,s=t.searchValue,a=t.onHover,l=t.onSelect,c=t.suggestions,u=void 0===c?[]:c,d=t.instanceId,p=t.__experimentalRenderItem,h=function(e){if(Array.isArray(e))return e}(r=(0,R.useState)(!1))||function(e){var t=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=t){var n,r,i,o,s=[],a=!0,l=!1;try{for(i=(t=t.call(e)).next;!(a=(n=i.call(t)).done)&&(s.push(n.value),2!==s.length);a=!0);}catch(e){l=!0,r=e}finally{try{if(!a&&null!=t.return&&(o=t.return(),Object(o)!==o))return}finally{if(l)throw r}}return s}}(r)||function(e){if(e){if("string"==typeof e)return he(e,2);var t={}.toString.call(e).slice(8,-1);return"Object"===t&&e.constructor&&(t=e.constructor.name),"Map"===t||"Set"===t?Array.from(e):"Arguments"===t||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t)?he(e,2):void 0}}(r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}(),f=h[0],m=h[1],g=(0,n.useRefEffect)(function(e){var t;return i>-1&&o&&e.children[i]&&(m(!0),function(e,t,n){n=n||{},9===t.nodeType&&(t=pe.getWindow(t));var r=n.allowHorizontalScroll,i=n.onlyScrollIfNeeded,o=n.alignWithTop,s=n.alignWithLeft,a=n.offsetTop||0,l=n.offsetLeft||0,c=n.offsetBottom||0,u=n.offsetRight||0;r=void 0===r||r;var d,p,h,f,m,g,v,x,y,b,w=pe.isWindow(t),j=pe.offset(e),S=pe.outerHeight(e),k=pe.outerWidth(e);w?(v=t,b=pe.height(v),y=pe.width(v),x={left:pe.scrollLeft(v),top:pe.scrollTop(v)},m={left:j.left-x.left-l,top:j.top-x.top-a},g={left:j.left+k-(x.left+y)+u,top:j.top+S-(x.top+b)+c},f=x):(d=pe.offset(t),p=t.clientHeight,h=t.clientWidth,f={left:t.scrollLeft,top:t.scrollTop},m={left:j.left-(d.left+(parseFloat(pe.css(t,"borderLeftWidth"))||0))-l,top:j.top-(d.top+(parseFloat(pe.css(t,"borderTopWidth"))||0))-a},g={left:j.left+k-(d.left+h+(parseFloat(pe.css(t,"borderRightWidth"))||0))+u,top:j.top+S-(d.top+p+(parseFloat(pe.css(t,"borderBottomWidth"))||0))+c}),m.top<0||g.top>0?!0===o?pe.scrollTop(t,f.top+m.top):!1===o?pe.scrollTop(t,f.top+g.top):m.top<0?pe.scrollTop(t,f.top+m.top):pe.scrollTop(t,f.top+g.top):i||((o=void 0===o||!!o)?pe.scrollTop(t,f.top+m.top):pe.scrollTop(t,f.top+g.top)),r&&(m.left<0||g.left>0?!0===s?pe.scrollLeft(t,f.left+m.left):!1===s?pe.scrollLeft(t,f.left+g.left):m.left<0?pe.scrollLeft(t,f.left+m.left):pe.scrollLeft(t,f.left+g.left):i||((s=void 0===s||!!s)?pe.scrollLeft(t,f.left+m.left):pe.scrollLeft(t,f.left+g.left)))}(e.children[i],e,{onlyScrollIfNeeded:!0}),t=requestAnimationFrame(function(){m(!1)})),function(){void 0!==t&&cancelAnimationFrame(t)}},[i,o]),v=function(e){return function(){f||null==a||a(e)}},x=function(e){return function(){null==l||l(e)}};return React.createElement("ul",{ref:g,className:"codeamp-components-multi-select-control__suggestions-list",id:"".concat(d,"-suggestions"),role:"listbox"},0===u.length&&React.createElement("li",{className:"codeamp-components-multi-select-control__no-suggestions",role:"option"},(0,e.__)("No results found.","codeamp-block-components")),u.map(function(e,t){var n,r=function(e){var t=e.label.toLocaleLowerCase().indexOf(s);return{suggestionBeforeMatch:e.label.substring(0,t),suggestionMatch:e.label.substring(t,t+s.length),suggestionAfterMatch:e.label.substring(t+s.length)}}(e),o=S()("codeamp-components-multi-select-control__suggestion",{"is-selected":t===i});return n="function"==typeof p?p({item:e}):r?React.createElement("span",{"aria-label":e.label},r.suggestionBeforeMatch,React.createElement("strong",{className:"codeamp-components-multi-select-control__suggestion-match"},r.suggestionMatch),r.suggestionAfterMatch):e.label,React.createElement("li",{id:"".concat(d,"-suggestions-").concat(t),role:"option",className:o,key:e.value,onMouseDown:fe,onClick:x(e),onMouseEnter:v(e),"aria-selected":t===i},n)}))};var ge=r(192),ve={};function xe(){return xe=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},xe.apply(null,arguments)}function ye(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function be(e,t,n){return(t=function(e){var t=function(e){if("object"!=we(e)||!e)return e;var t=e[Symbol.toPrimitive];if(void 0!==t){var n=t.call(e,"string");if("object"!=we(n))return n;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==we(t)?t:t+""}(t))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function we(e){return we="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},we(e)}function je(e){return function(e){if(Array.isArray(e))return Ae(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||ke(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Se(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,i,o,s,a=[],l=!0,c=!1;try{if(o=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=o.call(n)).done)&&(a.push(r.value),a.length!==t);l=!0);}catch(e){c=!0,i=e}finally{try{if(!l&&null!=n.return&&(s=n.return(),Object(s)!==s))return}finally{if(c)throw i}}return a}}(e,t)||ke(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function ke(e,t){if(e){if("string"==typeof e)return Ae(e,t);var n={}.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?Ae(e,t):void 0}}function Ae(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=Array(t);n<t;n++)r[n]=e[n];return r}function Te(e){if(""===e)return null;var t=null!=e?e:"";return(arguments.length>1&&void 0!==arguments[1]?arguments[1]:[]).find(function(e){return-1!==e.label.toLocaleLowerCase().indexOf(t.trim().toLocaleLowerCase())})}ve.styleTagTransform=y(),ve.setAttributes=m(),ve.insert=h().bind(null,"head"),ve.domAPI=d(),ve.insertStyleElement=v(),c()(ge.A,ve),ge.A&&ge.A.locals&&ge.A.locals;var Ce=function(){};function Pe(r){var i=r.autoCapitalize,o=r.autoComplete,s=r.maxLength,a=r.placeholder,l=r.label,c=void 0===l?(0,e.__)("Add item"):l,u=r.help,d=r.className,p=r.suggestions,h=void 0===p?[]:p,f=r.options,m=void 0===f?[]:f,g=r.maxSuggestions,v=void 0===g?100:g,x=r.value,y=void 0===x?[]:x,b=r.onChange,w=void 0===b?function(){}:b,j=r.onInputChange,k=void 0===j?function(){}:j,A=r.onFocus,T=void 0===A?void 0:A,C=(r.isBorderless,r.id),P=r.disabled,_=void 0!==P&&P,E=r.messages,M=void 0===E?{added:(0,e.__)("Item added."),removed:(0,e.__)("Item removed."),remove:(0,e.__)("Remove item"),__experimentalInvalid:(0,e.__)("Invalid item")}:E,I=r.__experimentalRenderItem,B=r.__experimentalAutoSelectFirstMatch,O=void 0===B||B,D=r.__experimentalValidateInput,F=void 0===D?function(){return!0}:D,N=r.__experimentalCloseSuggestionsOnSelect,$=void 0===N||N,H=(0,n.useInstanceId)(Pe,"codeamp-components-multi-select-control");C&&(H=C);var W=Se((0,R.useState)(""),2),G=W[0],q=W[1],K=Se((0,R.useState)(0),2),X=K[0],Y=K[1],Z=Se((0,R.useState)(!1),2),Q=Z[0],J=Z[1],ee=Se((0,R.useState)(!1),2),te=ee[0],ne=ee[1],re=Se((0,R.useState)(-1),2),ie=re[0],oe=re[1],se=Se((0,R.useState)(!1),2),ae=se[0],le=se[1],ce=(0,n.usePrevious)(h),ue=(0,n.usePrevious)(y),de=(0,R.useRef)(null),pe=(0,R.useRef)(null),he=(0,n.useDebounce)(z.speak,500);function fe(){var e;null===(e=de.current)||void 0===e||e.focus()}function ge(){var e;return de.current===(null===(e=de.current)||void 0===e?void 0:e.ownerDocument.activeElement)}function ve(e){ge()||e.target===pe.current?(J(!0),ne(!0)):J(!1),"function"==typeof T&&T(e)}function ke(e){e.target===pe.current&&Q&&e.preventDefault()}function Ae(e){ze(e.value),fe()}function _e(e){var t=!1;return ge()&&Ve()&&(e(),t=!0),t}function Ee(){var e=Oe()-1;e>-1&&ze(y[e])}function Me(){var e=Oe();e<y.length&&(ze(y[e]),function(e){Y(y.length-Math.max(e,-1)-1)}(e))}function Re(e){F(e.label)?(function(e){if(je(new Set(e.filter(function(e){return!function(e){return y.some(function(t){return Ie(e)===Ie(t)})}(e)}))),e.length>0){var t=je(y);t.splice.apply(t,[Oe(),0].concat(je(e))),w(t)}}([e.value]),(0,z.speak)(M.added,"assertive"),q(""),le(!1),oe(-1),$&&ne(!1),Q&&fe()):(0,z.speak)(M.__experimentalInvalid,"assertive")}function ze(e){var t=y.filter(function(t){return Ie(t)!==Ie(e)});w(t),(0,z.speak)(M.removed,"assertive")}function Ie(e){return"object"===we(e)?e.value:e}function Le(){return m.filter(function(e){return-1===y.indexOf(e.value)})}function Be(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:G,t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:Le(),n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:v;if(""!==e.trim()){var r=[],i=[];t.forEach(function(t){var n=t.label.toLocaleLowerCase().indexOf(e.trim().toLocaleLowerCase());0===n?r.push(t):n>0&&i.push(t)}),t=r.concat(i)}return t.slice(0,n)}function Oe(){return y.length-X}function Ve(){return 0===G.length}function De(){var e;return(null===(e=Te(G))||void 0===e||null===(e=e.label)||void 0===e?void 0:e.length)>0}function Fe(){var t=!(arguments.length>0&&void 0!==arguments[0])||arguments[0],n=Be(G),r=n.length>0;t&&(O&&r?(oe(0),le(!0)):(oe(-1),le(!1))),oe(0);var i=r?(0,e.sprintf)((0,e._n)("%d result found, use up and down arrow keys to navigate.","%d results found, use up and down arrow keys to navigate.",n.length),n.length):(0,e.__)("No results.");he(i,"assertive")}function Ne(e){return m.find(function(t){return t.value===e})||null}(0,R.useEffect)(function(){Q&&!ge()&&fe()},[Q]),(0,R.useEffect)(function(){var e=!L()(h,ce||[]);(e||y!==ue)&&Fe(e)},[h,ce,y,ue]),(0,R.useEffect)(function(){Fe()},[G]),_&&Q&&(J(!1),q(""));var Ue,$e,He=S()(d,"codeamp-components-multi-select-control__input-container",{"is-active":Q,"is-disabled":_}),We={className:"components-base-control codeamp-components-multi-select-control",tabIndex:-1},Ge=Be();return _||(We=Object.assign({},We,{onKeyDown:function(e){var t=!1;if(!e.defaultPrevented){switch(e.code){case"Backspace":t=_e(Ee);break;case"Enter":case"Space":t=function(){var e=!1,t=function(){if(-1!==ie)return Be()[ie]}();return t&&te?(Re(t),e=!0):De()&&""!==G.trim()&&(Re(G),e=!0),e}();break;case"ArrowLeft":t=function(){var e=!1;return Ve()&&(Y(function(e){return Math.min(e+1,y.length)}),e=!0),e}();break;case"ArrowUp":t=te?(oe(function(e){return(0===e?Be(G,Le(),y,v).length:e)-1}),le(!0),!0):(ne(!0),oe(0),le(!0),!0);break;case"ArrowRight":t=function(){var e=!1;return Ve()&&(Y(function(e){return Math.max(e-1,0)}),e=!0),e}();break;case"ArrowDown":t=te?(oe(function(e){return(e+1)%Be(G,Le(),y,v).length}),le(!0),!0):(ne(!0),oe(0),le(!0),!0);break;case"Delete":t=_e(Me);break;case"Escape":t=function(e){return e.target instanceof HTMLInputElement&&(q(e.target.value),ne(!1),oe(-1),le(!1)),!0}(e)}t&&e.preventDefault()}},onKeyPress:function(e){var t=!1;44===e.charCode&&(De()&&Re(G),t=!0),t&&e.preventDefault()},onFocus:ve})),React.createElement(t.BaseControl,{id:H,label:c,help:u},React.createElement("div",We,React.createElement("div",{ref:pe,className:He,tabIndex:-1,onMouseDown:ke,onTouchStart:ke},React.createElement(t.Flex,{className:"codeamp-components-multi-select-control__tokens-container",justify:"flex-start",align:"flex-start",gap:"4px",wrap:!0,hasTokens:!!y.length},($e=[],y.forEach(function(e,n){var r=Ne(e);Ne(e)&&$e.push(function(e,n){var r=e.value,i=e.label,o=e.onMouseEnter,s=void 0===o?Ce:o,a=e.onMouseLeave,l=void 0===a?Ce:a,c=e.isBorderless,u=void 0!==c&&c,d=r,p=n+1;return React.createElement(t.FlexItem,{key:"token-"+d},React.createElement(V,{value:d,label:i,title:"string"!=typeof token?i:void 0,onClickRemove:Ae,isBorderless:u,onMouseEnter:s,onMouseLeave:l,disabled:_,messages:M,termPosition:p,termsCount:y.length}))}(function(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?ye(Object(n),!0).forEach(function(t){be(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):ye(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}({},r),n))}),$e.splice(Oe(),0,(Ue={instanceId:H,autoCapitalize:i,autoComplete:o,placeholder:0===y.length?a:"",key:"input",disabled:_,value:G,onBlur:function(){De()?J(!1):(q(""),Y(0),J(!1),ne(!1),oe(-1),le(!1))},isExpanded:te,selectedSuggestionIndex:ie,onClick:ve},React.createElement(U,xe({},Ue,{onChange:s&&y.length>=s?void 0:function(e){var t=e.value;q(t),ne(!0),k(t)},ref:de})))),$e)),te&&React.createElement(me,{instanceId:H,match:Te(G,m),searchValue:G.trim(),suggestions:Ge,selectedIndex:ie,scrollIntoView:ae,onHover:function(e){var t=Be().indexOf(e);t>=0&&(oe(t),le(!1))},onSelect:function(e){Re(e)},__experimentalRenderItem:I}))))}})();var o=t;for(var s in i)o[s]=i[s];i.__esModule&&Object.defineProperty(o,"__esModule",{value:!0})})()},151:e=>{var t={utf8:{stringToBytes:function(e){return t.bin.stringToBytes(unescape(encodeURIComponent(e)))},bytesToString:function(e){return decodeURIComponent(escape(t.bin.bytesToString(e)))}},bin:{stringToBytes:function(e){for(var t=[],n=0;n<e.length;n++)t.push(255&e.charCodeAt(n));return t},bytesToString:function(e){for(var t=[],n=0;n<e.length;n++)t.push(String.fromCharCode(e[n]));return t.join("")}}};e.exports=t},206:e=>{function t(e){return!!e.constructor&&"function"==typeof e.constructor.isBuffer&&e.constructor.isBuffer(e)}e.exports=function(e){return null!=e&&(t(e)||function(e){return"function"==typeof e.readFloatLE&&"function"==typeof e.slice&&t(e.slice(0,0))}(e)||!!e._isBuffer)}},503:(e,t,n)=>{var r,i,o,s,a;r=n(939),i=n(151).utf8,o=n(206),s=n(151).bin,(a=function(e,t){e.constructor==String?e=t&&"binary"===t.encoding?s.stringToBytes(e):i.stringToBytes(e):o(e)?e=Array.prototype.slice.call(e,0):Array.isArray(e)||e.constructor===Uint8Array||(e=e.toString());for(var n=r.bytesToWords(e),l=8*e.length,c=1732584193,u=-271733879,d=-1732584194,p=271733878,h=0;h<n.length;h++)n[h]=16711935&(n[h]<<8|n[h]>>>24)|4278255360&(n[h]<<24|n[h]>>>8);n[l>>>5]|=128<<l%32,n[14+(l+64>>>9<<4)]=l;var f=a._ff,m=a._gg,g=a._hh,v=a._ii;for(h=0;h<n.length;h+=16){var x=c,y=u,b=d,w=p;c=f(c,u,d,p,n[h+0],7,-680876936),p=f(p,c,u,d,n[h+1],12,-389564586),d=f(d,p,c,u,n[h+2],17,606105819),u=f(u,d,p,c,n[h+3],22,-1044525330),c=f(c,u,d,p,n[h+4],7,-176418897),p=f(p,c,u,d,n[h+5],12,1200080426),d=f(d,p,c,u,n[h+6],17,-1473231341),u=f(u,d,p,c,n[h+7],22,-45705983),c=f(c,u,d,p,n[h+8],7,1770035416),p=f(p,c,u,d,n[h+9],12,-1958414417),d=f(d,p,c,u,n[h+10],17,-42063),u=f(u,d,p,c,n[h+11],22,-1990404162),c=f(c,u,d,p,n[h+12],7,1804603682),p=f(p,c,u,d,n[h+13],12,-40341101),d=f(d,p,c,u,n[h+14],17,-1502002290),c=m(c,u=f(u,d,p,c,n[h+15],22,1236535329),d,p,n[h+1],5,-165796510),p=m(p,c,u,d,n[h+6],9,-1069501632),d=m(d,p,c,u,n[h+11],14,643717713),u=m(u,d,p,c,n[h+0],20,-373897302),c=m(c,u,d,p,n[h+5],5,-701558691),p=m(p,c,u,d,n[h+10],9,38016083),d=m(d,p,c,u,n[h+15],14,-660478335),u=m(u,d,p,c,n[h+4],20,-405537848),c=m(c,u,d,p,n[h+9],5,568446438),p=m(p,c,u,d,n[h+14],9,-1019803690),d=m(d,p,c,u,n[h+3],14,-187363961),u=m(u,d,p,c,n[h+8],20,1163531501),c=m(c,u,d,p,n[h+13],5,-1444681467),p=m(p,c,u,d,n[h+2],9,-51403784),d=m(d,p,c,u,n[h+7],14,1735328473),c=g(c,u=m(u,d,p,c,n[h+12],20,-1926607734),d,p,n[h+5],4,-378558),p=g(p,c,u,d,n[h+8],11,-2022574463),d=g(d,p,c,u,n[h+11],16,1839030562),u=g(u,d,p,c,n[h+14],23,-35309556),c=g(c,u,d,p,n[h+1],4,-1530992060),p=g(p,c,u,d,n[h+4],11,1272893353),d=g(d,p,c,u,n[h+7],16,-155497632),u=g(u,d,p,c,n[h+10],23,-1094730640),c=g(c,u,d,p,n[h+13],4,681279174),p=g(p,c,u,d,n[h+0],11,-358537222),d=g(d,p,c,u,n[h+3],16,-722521979),u=g(u,d,p,c,n[h+6],23,76029189),c=g(c,u,d,p,n[h+9],4,-640364487),p=g(p,c,u,d,n[h+12],11,-421815835),d=g(d,p,c,u,n[h+15],16,530742520),c=v(c,u=g(u,d,p,c,n[h+2],23,-995338651),d,p,n[h+0],6,-198630844),p=v(p,c,u,d,n[h+7],10,1126891415),d=v(d,p,c,u,n[h+14],15,-1416354905),u=v(u,d,p,c,n[h+5],21,-57434055),c=v(c,u,d,p,n[h+12],6,1700485571),p=v(p,c,u,d,n[h+3],10,-1894986606),d=v(d,p,c,u,n[h+10],15,-1051523),u=v(u,d,p,c,n[h+1],21,-2054922799),c=v(c,u,d,p,n[h+8],6,1873313359),p=v(p,c,u,d,n[h+15],10,-30611744),d=v(d,p,c,u,n[h+6],15,-1560198380),u=v(u,d,p,c,n[h+13],21,1309151649),c=v(c,u,d,p,n[h+4],6,-145523070),p=v(p,c,u,d,n[h+11],10,-1120210379),d=v(d,p,c,u,n[h+2],15,718787259),u=v(u,d,p,c,n[h+9],21,-343485551),c=c+x>>>0,u=u+y>>>0,d=d+b>>>0,p=p+w>>>0}return r.endian([c,u,d,p])})._ff=function(e,t,n,r,i,o,s){var a=e+(t&n|~t&r)+(i>>>0)+s;return(a<<o|a>>>32-o)+t},a._gg=function(e,t,n,r,i,o,s){var a=e+(t&r|n&~r)+(i>>>0)+s;return(a<<o|a>>>32-o)+t},a._hh=function(e,t,n,r,i,o,s){var a=e+(t^n^r)+(i>>>0)+s;return(a<<o|a>>>32-o)+t},a._ii=function(e,t,n,r,i,o,s){var a=e+(n^(t|~r))+(i>>>0)+s;return(a<<o|a>>>32-o)+t},a._blocksize=16,a._digestsize=16,e.exports=function(e,t){if(null==e)throw new Error("Illegal argument "+e);var n=r.wordsToBytes(a(e,t));return t&&t.asBytes?n:t&&t.asString?s.bytesToString(n):r.bytesToHex(n)}},550:(e,t,n)=>{var r;!function(e){var t,n,r,i,o,s,a,l=navigator.userAgent;e.HTMLPictureElement&&/ecko/.test(l)&&l.match(/rv\:(\d+)/)&&RegExp.$1<45&&addEventListener("resize",(n=document.createElement("source"),r=function(e){var t,r,i=e.parentNode;"PICTURE"===i.nodeName.toUpperCase()?(t=n.cloneNode(),i.insertBefore(t,i.firstElementChild),setTimeout(function(){i.removeChild(t)})):(!e._pfLastSize||e.offsetWidth>e._pfLastSize)&&(e._pfLastSize=e.offsetWidth,r=e.sizes,e.sizes+=",100vw",setTimeout(function(){e.sizes=r}))},i=function(){var e,t=document.querySelectorAll("picture > img, img[srcset][sizes]");for(e=0;e<t.length;e++)r(t[e])},o=function(){clearTimeout(t),t=setTimeout(i,99)},s=e.matchMedia&&matchMedia("(orientation: landscape)"),a=function(){o(),s&&s.addListener&&s.addListener(o)},n.srcset="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",/^[c|i]|d$/.test(document.readyState||"")?a():document.addEventListener("DOMContentLoaded",a),o))}(window),function(i,o,s){"use strict";var a,l,c;o.createElement("picture");var u={},d=!1,p=function(){},h=o.createElement("img"),f=h.getAttribute,m=h.setAttribute,g=h.removeAttribute,v=o.documentElement,x={},y={algorithm:""},b="data-pfsrc",w=b+"set",j=navigator.userAgent,S=/rident/.test(j)||/ecko/.test(j)&&j.match(/rv\:(\d+)/)&&RegExp.$1>35,k="currentSrc",A=/\s+\+?\d+(e\d+)?w/,T=/(\([^)]+\))?\s*(.+)/,C=i.picturefillCFG,P="font-size:100%!important;",_=!0,E={},M={},R=i.devicePixelRatio,z={px:1,in:96},I=o.createElement("a"),L=!1,B=/^[ \t\n\r\u000c]+/,O=/^[, \t\n\r\u000c]+/,V=/^[^ \t\n\r\u000c]+/,D=/[,]+$/,F=/^\d+$/,N=/^-?(?:[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?$/,U=function(e,t,n,r){e.addEventListener?e.addEventListener(t,n,r||!1):e.attachEvent&&e.attachEvent("on"+t,n)},$=function(e){var t={};return function(n){return n in t||(t[n]=e(n)),t[n]}};function H(e){return" "===e||"\t"===e||"\n"===e||"\f"===e||"\r"===e}var W,G,q,K,X,Y,Z,Q,J,ee,te,ne,re,ie,oe,se=(W=/^([\d\.]+)(em|vw|px)$/,G=$(function(e){return"return "+function(){for(var e=arguments,t=0,n=e[0];++t in e;)n=n.replace(e[t],e[++t]);return n}((e||"").toLowerCase(),/\band\b/g,"&&",/,/g,"||",/min-([a-z-\s]+):/g,"e.$1>=",/max-([a-z-\s]+):/g,"e.$1<=",/calc([^)]+)/g,"($1)",/(\d+[\.]*[\d]*)([a-z]+)/g,"($1 * e.$2)",/^(?!(e.[a-z]|[0-9\.&=|><\+\-\*\(\)\/])).*/gi,"")+";"}),function(e,t){var n;if(!(e in E))if(E[e]=!1,t&&(n=e.match(W)))E[e]=n[1]*z[n[2]];else try{E[e]=new Function("e",G(e))(z)}catch(e){}return E[e]}),ae=function(e,t){return e.w?(e.cWidth=u.calcListLength(t||"100vw"),e.res=e.w/e.cWidth):e.res=e.d,e},le=function(e){if(d){var t,n,r,i=e||{};if(i.elements&&1===i.elements.nodeType&&("IMG"===i.elements.nodeName.toUpperCase()?i.elements=[i.elements]:(i.context=i.elements,i.elements=null)),r=(t=i.elements||u.qsa(i.context||o,i.reevaluate||i.reselect?u.sel:u.selShort)).length){for(u.setupRun(i),L=!0,n=0;n<r;n++)u.fillImg(t[n],i);u.teardownRun(i)}}};function ce(e,t,n,r){var i,o,s;return"saveData"===y.algorithm?e>2.7?s=n+1:(o=(t-n)*(i=Math.pow(e-.6,1.5)),r&&(o+=.1*i),s=e+o):s=n>1?Math.sqrt(e*t):e,s>n}function ue(e,t){return e.res-t.res}function de(e,t){var n,r,i;if(e&&t)for(i=u.parseSet(t),e=u.makeUrl(e),n=0;n<i.length;n++)if(e===u.makeUrl(i[n].url)){r=i[n];break}return r}i.console&&console.warn,k in h||(k="src"),x["image/jpeg"]=!0,x["image/gif"]=!0,x["image/png"]=!0,x["image/svg+xml"]=o.implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#Image","1.1"),u.ns=("pf"+(new Date).getTime()).substr(0,9),u.supSrcset="srcset"in h,u.supSizes="sizes"in h,u.supPicture=!!i.HTMLPictureElement,u.supSrcset&&u.supPicture&&!u.supSizes&&(q=o.createElement("img"),h.srcset="data:,a",q.src="data:,a",u.supSrcset=h.complete===q.complete,u.supPicture=u.supSrcset&&u.supPicture),u.supSrcset&&!u.supSizes?(K="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",Y=function(){2===X.width&&(u.supSizes=!0),l=u.supSrcset&&!u.supSizes,d=!0,setTimeout(le)},(X=o.createElement("img")).onload=Y,X.onerror=Y,X.setAttribute("sizes","9px"),X.srcset=K+" 1w,data:image/gif;base64,R0lGODlhAgABAPAAAP///wAAACH5BAAAAAAALAAAAAACAAEAAAICBAoAOw== 9w",X.src=K):d=!0,u.selShort="picture>img,img[srcset]",u.sel=u.selShort,u.cfg=y,u.DPR=R||1,u.u=z,u.types=x,u.setSize=p,u.makeUrl=$(function(e){return I.href=e,I.href}),u.qsa=function(e,t){return"querySelector"in e?e.querySelectorAll(t):[]},u.matchesMedia=function(){return i.matchMedia&&(matchMedia("(min-width: 0.1em)")||{}).matches?u.matchesMedia=function(e){return!e||matchMedia(e).matches}:u.matchesMedia=u.mMQ,u.matchesMedia.apply(this,arguments)},u.mMQ=function(e){return!e||se(e)},u.calcLength=function(e){var t=se(e,!0)||!1;return t<0&&(t=!1),t},u.supportsType=function(e){return!e||x[e]},u.parseSize=$(function(e){var t=(e||"").match(T);return{media:t&&t[1],length:t&&t[2]}}),u.parseSet=function(e){return e.cands||(e.cands=function(e,t){function n(t){var n,r=t.exec(e.substring(c));if(r)return n=r[0],c+=n.length,n}var r,i,o,s,a,l=e.length,c=0,u=[];function d(){var e,n,o,s,a,l,c,d,p,h=!1,f={};for(s=0;s<i.length;s++)l=(a=i[s])[a.length-1],c=a.substring(0,a.length-1),d=parseInt(c,10),p=parseFloat(c),F.test(c)&&"w"===l?((e||n)&&(h=!0),0===d?h=!0:e=d):N.test(c)&&"x"===l?((e||n||o)&&(h=!0),p<0?h=!0:n=p):F.test(c)&&"h"===l?((o||n)&&(h=!0),0===d?h=!0:o=d):h=!0;h||(f.url=r,e&&(f.w=e),n&&(f.d=n),o&&(f.h=o),o||n||e||(f.d=1),1===f.d&&(t.has1x=!0),f.set=t,u.push(f))}function p(){for(n(B),o="",s="in descriptor";;){if(a=e.charAt(c),"in descriptor"===s)if(H(a))o&&(i.push(o),o="",s="after descriptor");else{if(","===a)return c+=1,o&&i.push(o),void d();if("("===a)o+=a,s="in parens";else{if(""===a)return o&&i.push(o),void d();o+=a}}else if("in parens"===s)if(")"===a)o+=a,s="in descriptor";else{if(""===a)return i.push(o),void d();o+=a}else if("after descriptor"===s)if(H(a));else{if(""===a)return void d();s="in descriptor",c-=1}c+=1}}for(;;){if(n(O),c>=l)return u;r=n(V),i=[],","===r.slice(-1)?(r=r.replace(D,""),d()):p()}}(e.srcset,e)),e.cands},u.getEmValue=function(){var e;if(!a&&(e=o.body)){var t=o.createElement("div"),n=v.style.cssText,r=e.style.cssText;t.style.cssText="position:absolute;left:0;visibility:hidden;display:block;padding:0;border:none;font-size:1em;width:1em;overflow:hidden;clip:rect(0px, 0px, 0px, 0px)",v.style.cssText=P,e.style.cssText=P,e.appendChild(t),a=t.offsetWidth,e.removeChild(t),a=parseFloat(a,10),v.style.cssText=n,e.style.cssText=r}return a||16},u.calcListLength=function(e){if(!(e in M)||y.uT){var t=u.calcLength(function(e){var t,n,r,i,o,s,a=/^(?:[+-]?[0-9]+|[0-9]*\.[0-9]+)(?:[eE][+-]?[0-9]+)?(?:ch|cm|em|ex|in|mm|pc|pt|px|rem|vh|vmin|vmax|vw)$/i,l=/^calc\((?:[0-9a-z \.\+\-\*\/\(\)]+)\)$/i;function c(e){return!!(a.test(e)&&parseFloat(e)>=0)||!!l.test(e)||"0"===e||"-0"===e||"+0"===e}for(r=(n=function(e){var t,n="",r=[],i=[],o=0,s=0,a=!1;function l(){n&&(r.push(n),n="")}function c(){r[0]&&(i.push(r),r=[])}for(;;){if(""===(t=e.charAt(s)))return l(),c(),i;if(a){if("*"===t&&"/"===e[s+1]){a=!1,s+=2,l();continue}s+=1}else{if(H(t)){if(e.charAt(s-1)&&H(e.charAt(s-1))||!n){s+=1;continue}if(0===o){l(),s+=1;continue}t=" "}else if("("===t)o+=1;else if(")"===t)o-=1;else{if(","===t){l(),c(),s+=1;continue}if("/"===t&&"*"===e.charAt(s+1)){a=!0,s+=2;continue}}n+=t,s+=1}}}(e)).length,t=0;t<r;t++)if(c(o=(i=n[t])[i.length-1])){if(s=o,i.pop(),0===i.length)return s;if(i=i.join(" "),u.matchesMedia(i))return s}return"100vw"}(e));M[e]=t||z.width}return M[e]},u.setRes=function(e){var t;if(e)for(var n=0,r=(t=u.parseSet(e)).length;n<r;n++)ae(t[n],e.sizes);return t},u.setRes.res=ae,u.applySetCandidate=function(e,t){if(e.length){var n,r,i,o,s,a,l,c,d,p=t[u.ns],h=u.DPR;if(a=p.curSrc||t[k],l=p.curCan||function(e,t,n){var r;return!n&&t&&(n=(n=e[u.ns].sets)&&n[n.length-1]),(r=de(t,n))&&(t=u.makeUrl(t),e[u.ns].curSrc=t,e[u.ns].curCan=r,r.res||ae(r,r.set.sizes)),r}(t,a,e[0].set),l&&l.set===e[0].set&&((d=S&&!t.complete&&l.res-.1>h)||(l.cached=!0,l.res>=h&&(s=l))),!s)for(e.sort(ue),s=e[(o=e.length)-1],r=0;r<o;r++)if((n=e[r]).res>=h){s=e[i=r-1]&&(d||a!==u.makeUrl(n.url))&&ce(e[i].res,n.res,h,e[i].cached)?e[i]:n;break}s&&(c=u.makeUrl(s.url),p.curSrc=c,p.curCan=s,c!==a&&u.setSrc(t,s),u.setSize(t))}},u.setSrc=function(e,t){var n;e.src=t.url,"image/svg+xml"===t.set.type&&(n=e.style.width,e.style.width=e.offsetWidth+1+"px",e.offsetWidth+1&&(e.style.width=n))},u.getSet=function(e){var t,n,r,i=!1,o=e[u.ns].sets;for(t=0;t<o.length&&!i;t++)if((n=o[t]).srcset&&u.matchesMedia(n.media)&&(r=u.supportsType(n.type))){"pending"===r&&(n=r),i=n;break}return i},u.parseSets=function(e,t,n){var r,i,o,a,c=t&&"PICTURE"===t.nodeName.toUpperCase(),d=e[u.ns];(d.src===s||n.src)&&(d.src=f.call(e,"src"),d.src?m.call(e,b,d.src):g.call(e,b)),(d.srcset===s||n.srcset||!u.supSrcset||e.srcset)&&(r=f.call(e,"srcset"),d.srcset=r,a=!0),d.sets=[],c&&(d.pic=!0,function(e,t){var n,r,i,o,s=e.getElementsByTagName("source");for(n=0,r=s.length;n<r;n++)(i=s[n])[u.ns]=!0,(o=i.getAttribute("srcset"))&&t.push({srcset:o,media:i.getAttribute("media"),type:i.getAttribute("type"),sizes:i.getAttribute("sizes")})}(t,d.sets)),d.srcset?(i={srcset:d.srcset,sizes:f.call(e,"sizes")},d.sets.push(i),(o=(l||d.src)&&A.test(d.srcset||""))||!d.src||de(d.src,i)||i.has1x||(i.srcset+=", "+d.src,i.cands.push({url:d.src,d:1,set:i}))):d.src&&d.sets.push({srcset:d.src,sizes:null}),d.curCan=null,d.curSrc=s,d.supported=!(c||i&&!u.supSrcset||o&&!u.supSizes),a&&u.supSrcset&&!d.supported&&(r?(m.call(e,w,r),e.srcset=""):g.call(e,w)),d.supported&&!d.srcset&&(!d.src&&e.src||e.src!==u.makeUrl(d.src))&&(null===d.src?e.removeAttribute("src"):e.src=d.src),d.parsed=!0},u.fillImg=function(e,t){var n,r=t.reselect||t.reevaluate;e[u.ns]||(e[u.ns]={}),n=e[u.ns],(r||n.evaled!==c)&&(n.parsed&&!t.reevaluate||u.parseSets(e,e.parentNode,t),n.supported?n.evaled=c:function(e){var t,n=u.getSet(e),r=!1;"pending"!==n&&(r=c,n&&(t=u.setRes(n),u.applySetCandidate(t,e))),e[u.ns].evaled=r}(e))},u.setupRun=function(){L&&!_&&R===i.devicePixelRatio||(_=!1,R=i.devicePixelRatio,E={},M={},u.DPR=R||1,z.width=Math.max(i.innerWidth||0,v.clientWidth),z.height=Math.max(i.innerHeight||0,v.clientHeight),z.vw=z.width/100,z.vh=z.height/100,c=[z.height,z.width,R].join("-"),z.em=u.getEmValue(),z.rem=z.em)},u.supPicture?(le=p,u.fillImg=p):(ne=i.attachEvent?/d$|^c/:/d$|^c|^i/,re=function(){var e=o.readyState||"";ie=setTimeout(re,"loading"===e?200:999),o.body&&(u.fillImgs(),(Z=Z||ne.test(e))&&clearTimeout(ie))},ie=setTimeout(re,o.body?9:99),oe=v.clientHeight,U(i,"resize",(Q=function(){_=Math.max(i.innerWidth||0,v.clientWidth)!==z.width||v.clientHeight!==oe,oe=v.clientHeight,_&&u.fillImgs()},te=function(){var e=new Date-ee;e<99?J=setTimeout(te,99-e):(J=null,Q())},function(){ee=new Date,J||(J=setTimeout(te,99))})),U(o,"readystatechange",re)),u.picturefill=le,u.fillImgs=le,u.teardownRun=p,le._=u,i.picturefillCFG={pf:u,push:function(e){var t=e.shift();"function"==typeof u[t]?u[t].apply(u,e):(y[t]=e[0],L&&u.fillImgs({reselect:!0}))}};for(;C&&C.length;)i.picturefillCFG.push(C.shift());i.picturefill=le,"object"==typeof e.exports?e.exports=le:(r=function(){return le}.call(t,n,t,e))===s||(e.exports=r),u.supPicture||(x["image/webp"]=function(e){var t=new i.Image;return t.onerror=function(){x[e]=!1,le()},t.onload=function(){x[e]=1===t.width,le()},t.src="data:image/webp;base64,UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAABBxAR/Q9ERP8DAABWUDggGAAAADABAJ0BKgEAAQADADQlpAADcAD++/1QAA==","pending"}("image/webp"))}(window,document)},556:(e,t,n)=>{e.exports=n(694)()},610:e=>{var t=!("undefined"==typeof window||!window.document||!window.document.createElement);e.exports=t},694:(e,t,n)=>{"use strict";var r=n(925);function i(){}function o(){}o.resetWarningCache=i,e.exports=function(){function e(e,t,n,i,o,s){if(s!==r){var a=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw a.name="Invariant Violation",a}}function t(){return e}e.isRequired=e;var n={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:o,resetWarningCache:i};return n.PropTypes=n,n}},925:e=>{"use strict";e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED"},939:e=>{var t,n;t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",n={rotl:function(e,t){return e<<t|e>>>32-t},rotr:function(e,t){return e<<32-t|e>>>t},endian:function(e){if(e.constructor==Number)return 16711935&n.rotl(e,8)|4278255360&n.rotl(e,24);for(var t=0;t<e.length;t++)e[t]=n.endian(e[t]);return e},randomBytes:function(e){for(var t=[];e>0;e--)t.push(Math.floor(256*Math.random()));return t},bytesToWords:function(e){for(var t=[],n=0,r=0;n<e.length;n++,r+=8)t[r>>>5]|=e[n]<<24-r%32;return t},wordsToBytes:function(e){for(var t=[],n=0;n<32*e.length;n+=8)t.push(e[n>>>5]>>>24-n%32&255);return t},bytesToHex:function(e){for(var t=[],n=0;n<e.length;n++)t.push((e[n]>>>4).toString(16)),t.push((15&e[n]).toString(16));return t.join("")},hexToBytes:function(e){for(var t=[],n=0;n<e.length;n+=2)t.push(parseInt(e.substr(n,2),16));return t},bytesToBase64:function(e){for(var n=[],r=0;r<e.length;r+=3)for(var i=e[r]<<16|e[r+1]<<8|e[r+2],o=0;o<4;o++)8*r+6*o<=8*e.length?n.push(t.charAt(i>>>6*(3-o)&63)):n.push("=");return n.join("")},base64ToBytes:function(e){e=e.replace(/[^A-Z0-9+\/]/gi,"");for(var n=[],r=0,i=0;r<e.length;i=++r%4)0!=i&&n.push((t.indexOf(e.charAt(r-1))&Math.pow(2,-2*i+8)-1)<<2*i|t.indexOf(e.charAt(r))>>>6-2*i);return n}},e.exports=n}},t={};function n(r){var i=t[r];if(void 0!==i)return i.exports;var o=t[r]={exports:{}};return e[r](o,o.exports,n),o.exports}n.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return n.d(t,{a:t}),t},n.d=(e,t)=>{for(var r in t)n.o(t,r)&&!n.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})};var r={};(()=>{"use strict";n.r(r),n.d(r,{AILoadingIndicator:()=>oy,AISuggestButton:()=>ry,AISuggestModal:()=>sy,AISuggestToolbarButton:()=>iy,AISuggestionPreview:()=>ay,AISuggestionsList:()=>ly,BlueskyPreview:()=>dm,ColorPickerButton:()=>jh,DEFAULT_FONT_FAMILY_OPTIONS:()=>Sh,DEFAULT_PLATFORM_SIZES:()=>ph,DesktopSafariChrome:()=>Uy,DetachBlocksToolbarControl:()=>k,DiscordPreview:()=>Zm,EntityCreateNewModal:()=>A,EntityPatternModal:()=>rt,FacebookPreview:()=>nf,GooglePreview:()=>dg,HeadingLevelToolbar:()=>ot,InnerBlocksAsContextTemplate:()=>dt,InnerBlocksAsSyncedContent:()=>ht,InspectorPopoutPanel:()=>ft,InstagramPostPreview:()=>wx,InstagramReelPreview:()=>Xv,InstagramStoryPreview:()=>bv,LinkedInPreview:()=>Ng,ListStoreItem:()=>vt,LoadingIndicator:()=>pt,MailchimpSegmentList:()=>St,MailchimpSegmentSelect:()=>kt,MarkedRangeControl:()=>Tt,MediaDropZone:()=>bo,MediaImageSlot:()=>_o,MobileSafariChrome:()=>jy,Overlay:()=>So,PLATFORM_NAMES:()=>hh,Placeholder:()=>nh,ProvideAuth:()=>f,ResponsiveImage:()=>sh,SlackPreview:()=>Om,SocialImageGenerator:()=>Ex,SocialPreview:()=>Sx,StyledComponentContext:()=>Ix,TaxonomySelect:()=>Ox,TeamsPreview:()=>ev,TermSelect:()=>Fx,ThreadsPreview:()=>Of,Transition:()=>Nx,TwitterPreview:()=>Cf,URLSearchField:()=>Gx,URLSearchToolbar:()=>qx,WPEntitySearch:()=>ty,generateImage:()=>xh,generateImageFile:()=>yh,getInnerBlocksContextAsQuery:()=>ut,listStoreActions:()=>xt,listStoreReducer:()=>bt,registerListStore:()=>wt,renderToCanvas:()=>vh,useAISuggest:()=>ny,useAuth:()=>m});var e={};n.r(e),n.d(e,{VERSION:()=>Ct,after:()=>oi,all:()=>Ai,allKeys:()=>Nn,any:()=>Ti,assign:()=>or,before:()=>si,bind:()=>qr,bindAll:()=>Yr,chain:()=>$r,chunk:()=>lo,clone:()=>cr,collect:()=>yi,compact:()=>Zi,compose:()=>ii,constant:()=>jn,contains:()=>Ci,countBy:()=>Ni,create:()=>lr,debounce:()=>ti,default:()=>po,defaults:()=>sr,defer:()=>Jr,delay:()=>Qr,detect:()=>gi,difference:()=>Ji,drop:()=>Xi,each:()=>xi,escape:()=>Mr,every:()=>Ai,extend:()=>ir,extendOwn:()=>or,filter:()=>Si,find:()=>gi,findIndex:()=>ui,findKey:()=>li,findLastIndex:()=>di,findWhere:()=>vi,first:()=>Ki,flatten:()=>Qi,foldl:()=>wi,foldr:()=>ji,forEach:()=>xi,functions:()=>nr,get:()=>fr,groupBy:()=>Di,has:()=>mr,head:()=>Ki,identity:()=>gr,include:()=>Ci,includes:()=>Ci,indexBy:()=>Fi,indexOf:()=>fi,initial:()=>qi,inject:()=>wi,intersection:()=>ro,invert:()=>tr,invoke:()=>Pi,isArguments:()=>yn,isArray:()=>gn,isArrayBuffer:()=>an,isBoolean:()=>Zt,isDataView:()=>mn,isDate:()=>nn,isElement:()=>Qt,isEmpty:()=>zn,isEqual:()=>Fn,isError:()=>on,isFinite:()=>bn,isFunction:()=>un,isMap:()=>Xn,isMatch:()=>In,isNaN:()=>wn,isNull:()=>Xt,isNumber:()=>tn,isObject:()=>Kt,isRegExp:()=>rn,isSet:()=>Zn,isString:()=>en,isSymbol:()=>sn,isTypedArray:()=>Pn,isUndefined:()=>Yt,isWeakMap:()=>Yn,isWeakSet:()=>Qn,iteratee:()=>wr,keys:()=>Rn,last:()=>Yi,lastIndexOf:()=>mi,map:()=>yi,mapObject:()=>Sr,matcher:()=>vr,matches:()=>vr,max:()=>Mi,memoize:()=>Zr,methods:()=>nr,min:()=>Ri,mixin:()=>uo,negate:()=>ri,noop:()=>kr,now:()=>Pr,object:()=>so,omit:()=>Gi,once:()=>ai,pairs:()=>er,partial:()=>Gr,partition:()=>Ui,pick:()=>Wi,pluck:()=>_i,property:()=>xr,propertyOf:()=>Ar,random:()=>Cr,range:()=>ao,reduce:()=>wi,reduceRight:()=>ji,reject:()=>ki,rest:()=>Xi,restArguments:()=>qt,result:()=>Fr,sample:()=>Li,select:()=>Si,shuffle:()=>Bi,size:()=>$i,some:()=>Ti,sortBy:()=>Oi,sortedIndex:()=>pi,tail:()=>Xi,take:()=>Ki,tap:()=>ur,template:()=>Dr,templateSettings:()=>zr,throttle:()=>ei,times:()=>Tr,toArray:()=>Ii,toPath:()=>dr,transpose:()=>io,unescape:()=>Rr,union:()=>no,uniq:()=>to,unique:()=>to,uniqueId:()=>Ur,unzip:()=>io,values:()=>Jn,where:()=>Ei,without:()=>eo,wrap:()=>ni,zip:()=>oo});const t=window.wp.element,i=window.wp.apiFetch;var o=n.n(i);const s=()=>{const e=new Date;return`${e.getFullYear()}-${e.getMonth()+1}-${e.getDate()} ${e.getHours()}:${e.getMinutes()}:${e.getSeconds()}`},a=window.firebase,l=window.firebaseAuth,c=window.firebaseDb,u=window.ReactJSXRuntime,d=(0,t.createContext)();console.log("does firebase exist?!"),console.log(l);const{onAuthStateChanged:p}=l;console.log(p);const h=()=>{const[e,n]=(0,t.useState)(!1);return{user:e,signin:(e,t)=>new Promise((r,i)=>{l.signInWithEmailAndPassword(e,t).then(e=>{n(e.user),r(e.user)}).catch(e=>{i(e)})}),signinWithToken:e=>new Promise((t,n)=>{l.signInWithCustomToken(e).then(e=>{t(e)}).catch(e=>{n(e)})}),signup:e=>new Promise((t,n)=>{o()({path:"/prc-api/v3/accounts/register/",method:"POST",data:{...e,created:s()}}).then(e=>{l.signInWithCustomToken(e).then(e=>{t(e)}).catch(e=>{n(e)})}).catch(e=>{n(e)})}),signout:()=>new Promise(e=>{l.signOut().then(()=>{n(!1),e(!0)})}),sendPasswordResetEmail:e=>new Promise((t,n)=>{l.sendPasswordResetEmail(e).then(()=>{t(!0)}).catch(e=>{n(e)})}),confirmPasswordReset:(e,t)=>new Promise((n,r)=>{l.confirmPasswordReset(e,t).then(()=>{n(!0)}).catch(e=>{r(e)})}),verifyPasswordResetToken:e=>new Promise((t,n)=>{l.verifyPasswordResetCode(e).then(()=>{t(!0)}).catch(e=>{n(e)})}),getUserData:e=>new Promise((t,n)=>{c.ref("users").child(e).once("value").then(e=>{"object"==typeof e.val()&&null!==e.val()?t(e.val()):n()}).catch(e=>n(e))}),logDatasetDownload:(e,t)=>{const{id:n,title:r,url:i,downloadUrl:a,siteId:l}=t;return new Promise((t,u)=>{o()({path:"/prc-api/v2/datasets/log-download",method:"POST",data:{id:n,siteId:l}}).then(()=>{c.ref(`users/${e}/datasets/${n}`).update({title:r,downloaded:s(),url:i,downloadURL:a}).then(()=>{t(!0)}).catch(e=>{u(e)})}).catch(e=>{u(e)})})},atpConsent:(e,t)=>new Promise((n,r)=>{a.database().ref(`users/${e}/atpLegal/}`).update({accepted:t}).then(()=>{n(!0)}).catch(e=>{r(e)})}),deleteUser:(t,n)=>new Promise((r,i)=>{const o=l.currentUser;n===e.email&&t===e.uid?o.delete().then(()=>{r(!0)}).catch(e=>{i(e)}):i()}),updatePassword:(e,t)=>new Promise((n,r)=>{const i=l.currentUser;e===i.uid?i.updatePassword(t).then(()=>{n()}).catch(e=>{r(e)}):r()}),logGroupToUser:(t,n,r,i)=>new Promise((o,a)=>{e||a("Please login");const{uid:l}=e,u=s();c.ref(`users/${l}/groups/${t}`).update({name:n,created:u,total:0,quizId:r,quizTitle:i,groupVersion:2}).then(()=>{o(!0)}).catch(e=>{a(e)})}),createGroup:(t,n,r,i,o=!1)=>new Promise((a,l)=>{e||l("Please login");const{uid:u}=e,d=s(),p=!1===o?(()=>{let e="";for(let t=0;t<5;t++)e+="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".charAt(Math.floor(62*Math.random()));return e})():o,h={name:t,created:d,owner:u,parent:n,results:i,total_entries:0,total_score:0,quizSlug:r};c.ref(`groups/${p}`).update(h).then(()=>{DfirebaseDatabase.ref(`users/${u}/groups/${p}`).update({name:t,created:d,total:0,quizSlug:r,version:!1!==o?2:1}).then(()=>{a({groupId:p})}).catch(e=>{l(e)})}).catch(e=>{l(e)})}),getGroup:e=>new Promise((t,n)=>{null==e&&n("No groupId specified"),c.ref("groups").child(e).once("value").then(e=>{"object"==typeof e.val()&&null!==e.val()?t(e.val()):n("malformed db data error",e)}).catch(e=>{n(e)})})}};function f({children:e}){const t=h();return(0,u.jsx)(d.Provider,{value:t,children:e})}const m=()=>(0,t.useContext)(d),g=window.React,v=window.wp.primitives,x=(0,g.createElement)(v.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,g.createElement)(v.Path,{d:"M18 4h-7c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm.5 9c0 .3-.2.5-.5.5h-7c-.3 0-.5-.2-.5-.5V6c0-.3.2-.5.5-.5h7c.3 0 .5.2.5.5v7zm-5 5c0 .3-.2.5-.5.5H6c-.3 0-.5-.2-.5-.5v-7c0-.3.2-.5.5-.5h1V9H6c-1.1 0-2 .9-2 2v7c0 1.1.9 2 2 2h7c1.1 0 2-.9 2-2v-1h-1.5v1z"})),y=window.wp.i18n,b=window.wp.blockEditor,w=window.wp.components,j=window.wp.data,S=window.wp.blocks;function k({blocks:e,clientId:t,label:n="Detach %s blocks"}){const{replaceBlock:r}=(0,j.useDispatch)(b.store),{canRemove:i,innerBlockCount:o,clientBlocks:s}=(0,j.useSelect)(n=>{const{canRemoveBlock:r,getBlockCount:i,getBlocks:o}=n(b.store);return{canRemove:r(t),innerBlockCount:i(t),clientBlocks:e||o(t)}},[t]),a=(0,g.useMemo)(()=>(e||s).map(e=>(0,S.cloneBlock)(e)),[e,s]);return(0,u.jsx)(b.BlockControls,{children:i&&(0,u.jsx)(w.ToolbarGroup,{children:(0,u.jsx)(w.ToolbarButton,{onClick:()=>r(t,a),label:(0,y.sprintf)(n,o),icon:x,showTooltip:!0})})})}function A({entityType:e="entity",defaultTitle:t,defaultContent:n=null,onClose:r,onSubmit:i}){const[o,s]=(0,g.useState)(t);return(0,u.jsx)(w.Modal,{title:(0,y.sprintf)(
// Translators: %s as defaultTitle ("Header", "Footer", etc.).
// Translators: %s as defaultTitle ("Header", "Footer", etc.).
(0,y.__)("Name and create your new %s"),e),overlayClassName:"wp-block-template-part__placeholder-create-new__title-form",onRequestClose:r,children:(0,u.jsx)("form",{onSubmit:e=>{e.preventDefault(),i(o,n)},children:(0,u.jsxs)(w.__experimentalVStack,{spacing:"5",children:[(0,u.jsx)(w.TextControl,{__nextHasNoMarginBottom:!0,label:(0,y.__)("Name"),value:o,onChange:s}),(0,u.jsx)(w.__experimentalHStack,{justify:"right",children:(0,u.jsx)(w.Button,{variant:"primary",type:"submit",disabled:!o.length,"aria-disabled":!o.length,children:(0,y.__)("Create")})})]})})})}function T(){return T=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)({}).hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},T.apply(null,arguments)}var C=function(){function e(e){var t=this;this._insertTag=function(e){var n;n=0===t.tags.length?t.insertionPoint?t.insertionPoint.nextSibling:t.prepend?t.container.firstChild:t.before:t.tags[t.tags.length-1].nextSibling,t.container.insertBefore(e,n),t.tags.push(e)},this.isSpeedy=void 0===e.speedy||e.speedy,this.tags=[],this.ctr=0,this.nonce=e.nonce,this.key=e.key,this.container=e.container,this.prepend=e.prepend,this.insertionPoint=e.insertionPoint,this.before=null}var t=e.prototype;return t.hydrate=function(e){e.forEach(this._insertTag)},t.insert=function(e){this.ctr%(this.isSpeedy?65e3:1)==0&&this._insertTag(function(e){var t=document.createElement("style");return t.setAttribute("data-emotion",e.key),void 0!==e.nonce&&t.setAttribute("nonce",e.nonce),t.appendChild(document.createTextNode("")),t.setAttribute("data-s",""),t}(this));var t=this.tags[this.tags.length-1];if(this.isSpeedy){var n=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]}(t);try{n.insertRule(e,n.cssRules.length)}catch(e){}}else t.appendChild(document.createTextNode(e));this.ctr++},t.flush=function(){this.tags.forEach(function(e){var t;return null==(t=e.parentNode)?void 0:t.removeChild(e)}),this.tags=[],this.ctr=0},e}(),P=Math.abs,_=String.fromCharCode,E=Object.assign;function M(e){return e.trim()}function R(e,t,n){return e.replace(t,n)}function z(e,t){return e.indexOf(t)}function I(e,t){return 0|e.charCodeAt(t)}function L(e,t,n){return e.slice(t,n)}function B(e){return e.length}function O(e){return e.length}function V(e,t){return t.push(e),e}var D=1,F=1,N=0,U=0,$=0,H="";function W(e,t,n,r,i,o,s){return{value:e,root:t,parent:n,type:r,props:i,children:o,line:D,column:F,length:s,return:""}}function G(e,t){return E(W("",null,null,"",null,null,0),e,{length:-e.length},t)}function q(){return $=U>0?I(H,--U):0,F--,10===$&&(F=1,D--),$}function K(){return $=U<N?I(H,U++):0,F++,10===$&&(F=1,D++),$}function X(){return I(H,U)}function Y(){return U}function Z(e,t){return L(H,e,t)}function Q(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function J(e){return D=F=1,N=B(H=e),U=0,[]}function ee(e){return H="",e}function te(e){return M(Z(U-1,ie(91===e?e+2:40===e?e+1:e)))}function ne(e){for(;($=X())&&$<33;)K();return Q(e)>2||Q($)>3?"":" "}function re(e,t){for(;--t&&K()&&!($<48||$>102||$>57&&$<65||$>70&&$<97););return Z(e,Y()+(t<6&&32==X()&&32==K()))}function ie(e){for(;K();)switch($){case e:return U;case 34:case 39:34!==e&&39!==e&&ie($);break;case 40:41===e&&ie(e);break;case 92:K()}return U}function oe(e,t){for(;K()&&e+$!==57&&(e+$!==84||47!==X()););return"/*"+Z(t,U-1)+"*"+_(47===e?e:K())}function se(e){for(;!Q(X());)K();return Z(e,U)}var ae="-ms-",le="-moz-",ce="-webkit-",ue="comm",de="rule",pe="decl",he="@keyframes";function fe(e,t){for(var n="",r=O(e),i=0;i<r;i++)n+=t(e[i],i,e,t)||"";return n}function me(e,t,n,r){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case pe:return e.return=e.return||e.value;case ue:return"";case he:return e.return=e.value+"{"+fe(e.children,r)+"}";case de:e.value=e.props.join(",")}return B(n=fe(e.children,r))?e.return=e.value+"{"+n+"}":""}function ge(e){return ee(ve("",null,null,null,[""],e=J(e),0,[0],e))}function ve(e,t,n,r,i,o,s,a,l){for(var c=0,u=0,d=s,p=0,h=0,f=0,m=1,g=1,v=1,x=0,y="",b=i,w=o,j=r,S=y;g;)switch(f=x,x=K()){case 40:if(108!=f&&58==I(S,d-1)){-1!=z(S+=R(te(x),"&","&\f"),"&\f")&&(v=-1);break}case 34:case 39:case 91:S+=te(x);break;case 9:case 10:case 13:case 32:S+=ne(f);break;case 92:S+=re(Y()-1,7);continue;case 47:switch(X()){case 42:case 47:V(ye(oe(K(),Y()),t,n),l);break;default:S+="/"}break;case 123*m:a[c++]=B(S)*v;case 125*m:case 59:case 0:switch(x){case 0:case 125:g=0;case 59+u:-1==v&&(S=R(S,/\f/g,"")),h>0&&B(S)-d&&V(h>32?be(S+";",r,n,d-1):be(R(S," ","")+";",r,n,d-2),l);break;case 59:S+=";";default:if(V(j=xe(S,t,n,c,u,i,a,y,b=[],w=[],d),o),123===x)if(0===u)ve(S,t,j,j,b,o,d,a,w);else switch(99===p&&110===I(S,3)?100:p){case 100:case 108:case 109:case 115:ve(e,j,j,r&&V(xe(e,j,j,0,0,i,a,y,i,b=[],d),w),i,w,d,a,r?b:w);break;default:ve(S,j,j,j,[""],w,0,a,w)}}c=u=h=0,m=v=1,y=S="",d=s;break;case 58:d=1+B(S),h=f;default:if(m<1)if(123==x)--m;else if(125==x&&0==m++&&125==q())continue;switch(S+=_(x),x*m){case 38:v=u>0?1:(S+="\f",-1);break;case 44:a[c++]=(B(S)-1)*v,v=1;break;case 64:45===X()&&(S+=te(K())),p=X(),u=d=B(y=S+=se(Y())),x++;break;case 45:45===f&&2==B(S)&&(m=0)}}return o}function xe(e,t,n,r,i,o,s,a,l,c,u){for(var d=i-1,p=0===i?o:[""],h=O(p),f=0,m=0,g=0;f<r;++f)for(var v=0,x=L(e,d+1,d=P(m=s[f])),y=e;v<h;++v)(y=M(m>0?p[v]+" "+x:R(x,/&\f/g,p[v])))&&(l[g++]=y);return W(e,t,n,0===i?de:a,l,c,u)}function ye(e,t,n){return W(e,t,n,ue,_($),L(e,2,-2),0)}function be(e,t,n,r){return W(e,t,n,pe,L(e,0,r),L(e,r+1,-1),r)}var we=function(e,t,n){for(var r=0,i=0;r=i,i=X(),38===r&&12===i&&(t[n]=1),!Q(i);)K();return Z(e,U)},je=new WeakMap,Se=function(e){if("rule"===e.type&&e.parent&&!(e.length<1)){for(var t=e.value,n=e.parent,r=e.column===n.column&&e.line===n.line;"rule"!==n.type;)if(!(n=n.parent))return;if((1!==e.props.length||58===t.charCodeAt(0)||je.get(n))&&!r){je.set(e,!0);for(var i=[],o=function(e,t){return ee(function(e,t){var n=-1,r=44;do{switch(Q(r)){case 0:38===r&&12===X()&&(t[n]=1),e[n]+=we(U-1,t,n);break;case 2:e[n]+=te(r);break;case 4:if(44===r){e[++n]=58===X()?"&\f":"",t[n]=e[n].length;break}default:e[n]+=_(r)}}while(r=K());return e}(J(e),t))}(t,i),s=n.props,a=0,l=0;a<o.length;a++)for(var c=0;c<s.length;c++,l++)e.props[l]=i[a]?o[a].replace(/&\f/g,s[c]):s[c]+" "+o[a]}}},ke=function(e){if("decl"===e.type){var t=e.value;108===t.charCodeAt(0)&&98===t.charCodeAt(2)&&(e.return="",e.value="")}};function Ae(e,t){switch(function(e,t){return 45^I(e,0)?(((t<<2^I(e,0))<<2^I(e,1))<<2^I(e,2))<<2^I(e,3):0}(e,t)){case 5103:return ce+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return ce+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return ce+e+le+e+ae+e+e;case 6828:case 4268:return ce+e+ae+e+e;case 6165:return ce+e+ae+"flex-"+e+e;case 5187:return ce+e+R(e,/(\w+).+(:[^]+)/,ce+"box-$1$2"+ae+"flex-$1$2")+e;case 5443:return ce+e+ae+"flex-item-"+R(e,/flex-|-self/,"")+e;case 4675:return ce+e+ae+"flex-line-pack"+R(e,/align-content|flex-|-self/,"")+e;case 5548:return ce+e+ae+R(e,"shrink","negative")+e;case 5292:return ce+e+ae+R(e,"basis","preferred-size")+e;case 6060:return ce+"box-"+R(e,"-grow","")+ce+e+ae+R(e,"grow","positive")+e;case 4554:return ce+R(e,/([^-])(transform)/g,"$1"+ce+"$2")+e;case 6187:return R(R(R(e,/(zoom-|grab)/,ce+"$1"),/(image-set)/,ce+"$1"),e,"")+e;case 5495:case 3959:return R(e,/(image-set\([^]*)/,ce+"$1$`$1");case 4968:return R(R(e,/(.+:)(flex-)?(.*)/,ce+"box-pack:$3"+ae+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+ce+e+e;case 4095:case 3583:case 4068:case 2532:return R(e,/(.+)-inline(.+)/,ce+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(B(e)-1-t>6)switch(I(e,t+1)){case 109:if(45!==I(e,t+4))break;case 102:return R(e,/(.+:)(.+)-([^]+)/,"$1"+ce+"$2-$3$1"+le+(108==I(e,t+3)?"$3":"$2-$3"))+e;case 115:return~z(e,"stretch")?Ae(R(e,"stretch","fill-available"),t)+e:e}break;case 4949:if(115!==I(e,t+1))break;case 6444:switch(I(e,B(e)-3-(~z(e,"!important")&&10))){case 107:return R(e,":",":"+ce)+e;case 101:return R(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+ce+(45===I(e,14)?"inline-":"")+"box$3$1"+ce+"$2$3$1"+ae+"$2box$3")+e}break;case 5936:switch(I(e,t+11)){case 114:return ce+e+ae+R(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return ce+e+ae+R(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return ce+e+ae+R(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return ce+e+ae+e+e}return e}var Te=[function(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case pe:e.return=Ae(e.value,e.length);break;case he:return fe([G(e,{value:R(e.value,"@","@"+ce)})],r);case de:if(e.length)return function(e,t){return e.map(t).join("")}(e.props,function(t){switch(function(e){return(e=/(::plac\w+|:read-\w+)/.exec(e))?e[0]:e}(t)){case":read-only":case":read-write":return fe([G(e,{props:[R(t,/:(read-\w+)/,":-moz-$1")]})],r);case"::placeholder":return fe([G(e,{props:[R(t,/:(plac\w+)/,":"+ce+"input-$1")]}),G(e,{props:[R(t,/:(plac\w+)/,":-moz-$1")]}),G(e,{props:[R(t,/:(plac\w+)/,ae+"input-$1")]})],r)}return""})}}],Ce=function(e){var t=e.key;if("css"===t){var n=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(n,function(e){-1!==e.getAttribute("data-emotion").indexOf(" ")&&(document.head.appendChild(e),e.setAttribute("data-s",""))})}var r,i,o=e.stylisPlugins||Te,s={},a=[];r=e.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+t+' "]'),function(e){for(var t=e.getAttribute("data-emotion").split(" "),n=1;n<t.length;n++)s[t[n]]=!0;a.push(e)});var l,c,u,d,p=[me,(d=function(e){l.insert(e)},function(e){e.root||(e=e.return)&&d(e)})],h=(c=[Se,ke].concat(o,p),u=O(c),function(e,t,n,r){for(var i="",o=0;o<u;o++)i+=c[o](e,t,n,r)||"";return i});i=function(e,t,n,r){l=n,fe(ge(e?e+"{"+t.styles+"}":t.styles),h),r&&(f.inserted[t.name]=!0)};var f={key:t,sheet:new C({key:t,container:r,nonce:e.nonce,speedy:e.speedy,prepend:e.prepend,insertionPoint:e.insertionPoint}),nonce:e.nonce,inserted:s,registered:{},insert:i};return f.sheet.hydrate(a),f},Pe={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,scale:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1};function _e(e){var t=Object.create(null);return function(n){return void 0===t[n]&&(t[n]=e(n)),t[n]}}var Ee=/[A-Z]|^ms/g,Me=/_EMO_([^_]+?)_([^]*?)_EMO_/g,Re=function(e){return 45===e.charCodeAt(1)},ze=function(e){return null!=e&&"boolean"!=typeof e},Ie=_e(function(e){return Re(e)?e:e.replace(Ee,"-$&").toLowerCase()}),Le=function(e,t){switch(e){case"animation":case"animationName":if("string"==typeof t)return t.replace(Me,function(e,t,n){return Oe={name:t,styles:n,next:Oe},t})}return 1===Pe[e]||Re(e)||"number"!=typeof t||0===t?t:t+"px"};function Be(e,t,n){if(null==n)return"";var r=n;if(void 0!==r.__emotion_styles)return r;switch(typeof n){case"boolean":return"";case"object":var i=n;if(1===i.anim)return Oe={name:i.name,styles:i.styles,next:Oe},i.name;var o=n;if(void 0!==o.styles){var s=o.next;if(void 0!==s)for(;void 0!==s;)Oe={name:s.name,styles:s.styles,next:Oe},s=s.next;return o.styles+";"}return function(e,t,n){var r="";if(Array.isArray(n))for(var i=0;i<n.length;i++)r+=Be(e,t,n[i])+";";else for(var o in n){var s=n[o];if("object"!=typeof s){var a=s;null!=t&&void 0!==t[a]?r+=o+"{"+t[a]+"}":ze(a)&&(r+=Ie(o)+":"+Le(o,a)+";")}else if(!Array.isArray(s)||"string"!=typeof s[0]||null!=t&&void 0!==t[s[0]]){var l=Be(e,t,s);switch(o){case"animation":case"animationName":r+=Ie(o)+":"+l+";";break;default:r+=o+"{"+l+"}"}}else for(var c=0;c<s.length;c++)ze(s[c])&&(r+=Ie(o)+":"+Le(o,s[c])+";")}return r}(e,t,n);case"function":if(void 0!==e){var a=Oe,l=n(e);return Oe=a,Be(e,t,l)}}var c=n;if(null==t)return c;var u=t[c];return void 0!==u?u:c}var Oe,Ve=/label:\s*([^\s;{]+)\s*(;|$)/g,De=!!g.useInsertionEffect&&g.useInsertionEffect,Fe=De||function(e){return e()},Ne=(De||g.useLayoutEffect,g.createContext("undefined"!=typeof HTMLElement?Ce({key:"css"}):null)),Ue=Ne.Provider,$e=g.createContext({}),He=function(e,t,n){var r=e.key+"-"+t.name;!1===n&&void 0===e.registered[r]&&(e.registered[r]=t.styles)},We=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|disableRemotePlayback|download|draggable|encType|enterKeyHint|fetchpriority|fetchPriority|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|popover|popoverTarget|popoverTargetAction|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,Ge=_e(function(e){return We.test(e)||111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)<91}),qe=function(e){return"theme"!==e},Ke=function(e){return"string"==typeof e&&e.charCodeAt(0)>96?Ge:qe},Xe=function(e,t,n){var r;if(t){var i=t.shouldForwardProp;r=e.__emotion_forwardProp&&i?function(t){return e.__emotion_forwardProp(t)&&i(t)}:i}return"function"!=typeof r&&n&&(r=e.__emotion_forwardProp),r},Ye=function(e){var t=e.cache,n=e.serialized,r=e.isStringTag;return He(t,n,r),Fe(function(){return function(e,t,n){He(e,t,n);var r=e.key+"-"+t.name;if(void 0===e.inserted[t.name]){var i=t;do{e.insert(t===i?"."+r:"",i,e.sheet,!0),i=i.next}while(void 0!==i)}}(t,n,r)}),null},Ze=function e(t,n){var r,i,o=t.__emotion_real===t,s=o&&t.__emotion_base||t;void 0!==n&&(r=n.label,i=n.target);var a=Xe(t,n,o),l=a||Ke(s),c=!l("as");return function(){var u=arguments,d=o&&void 0!==t.__emotion_styles?t.__emotion_styles.slice(0):[];if(void 0!==r&&d.push("label:"+r+";"),null==u[0]||void 0===u[0].raw)d.push.apply(d,u);else{var p=u[0];d.push(p[0]);for(var h=u.length,f=1;f<h;f++)d.push(u[f],p[f])}var m,v=(m=function(e,t,n){var r,o,u,p,h=c&&e.as||s,f="",m=[],v=e;if(null==e.theme){for(var x in v={},e)v[x]=e[x];v.theme=g.useContext($e)}"string"==typeof e.className?(r=t.registered,o=m,u=e.className,p="",u.split(" ").forEach(function(e){void 0!==r[e]?o.push(r[e]+";"):e&&(p+=e+" ")}),f=p):null!=e.className&&(f=e.className+" ");var y=function(e,t,n){if(1===e.length&&"object"==typeof e[0]&&null!==e[0]&&void 0!==e[0].styles)return e[0];var r=!0,i="";Oe=void 0;var o=e[0];null==o||void 0===o.raw?(r=!1,i+=Be(n,t,o)):i+=o[0];for(var s=1;s<e.length;s++)i+=Be(n,t,e[s]),r&&(i+=o[s]);Ve.lastIndex=0;for(var a,l="";null!==(a=Ve.exec(i));)l+="-"+a[1];var c=function(e){for(var t,n=0,r=0,i=e.length;i>=4;++r,i-=4)t=1540483477*(65535&(t=255&e.charCodeAt(r)|(255&e.charCodeAt(++r))<<8|(255&e.charCodeAt(++r))<<16|(255&e.charCodeAt(++r))<<24))+(59797*(t>>>16)<<16),n=1540483477*(65535&(t^=t>>>24))+(59797*(t>>>16)<<16)^1540483477*(65535&n)+(59797*(n>>>16)<<16);switch(i){case 3:n^=(255&e.charCodeAt(r+2))<<16;case 2:n^=(255&e.charCodeAt(r+1))<<8;case 1:n=1540483477*(65535&(n^=255&e.charCodeAt(r)))+(59797*(n>>>16)<<16)}return(((n=1540483477*(65535&(n^=n>>>13))+(59797*(n>>>16)<<16))^n>>>15)>>>0).toString(36)}(i)+l;return{name:c,styles:i,next:Oe}}(d.concat(m),t.registered,v);f+=t.key+"-"+y.name,void 0!==i&&(f+=" "+i);var b=c&&void 0===a?Ke(h):l,w={};for(var j in e)c&&"as"===j||b(j)&&(w[j]=e[j]);return w.className=f,n&&(w.ref=n),g.createElement(g.Fragment,null,g.createElement(Ye,{cache:t,serialized:y,isStringTag:"string"==typeof h}),g.createElement(h,w))},(0,g.forwardRef)(function(e,t){var n=(0,g.useContext)(Ne);return m(e,n,t)}));return v.displayName=void 0!==r?r:"Styled("+("string"==typeof s?s:s.displayName||s.name||"Component")+")",v.defaultProps=t.defaultProps,v.__emotion_real=v,v.__emotion_base=s,v.__emotion_styles=d,v.__emotion_forwardProp=a,Object.defineProperty(v,"toString",{value:function(){return"."+i}}),v.withComponent=function(t,r){return e(t,T({},n,r,{shouldForwardProp:Xe(v,r,!0)})).apply(void 0,d)},v}}.bind(null);["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"].forEach(function(e){Ze[e]=Ze(e)});const Qe=window.prcHooks,Je=window.wp.coreData,et=window.wp.compose,tt=Ze.div`
	width: 80vw;
	.block-editor-block-patterns-list {
		column-count: 3;
		.block-editor-block-patterns-list__list-item {
			break-inside: avoid-column !important;
		}
	}
`,nt=Ze.div`
	background: white;
	position: sticky;
	top: 0;
	z-index: 100;
	input:focus {
		box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.2);
	}
`;function rt({title:e,instructions:t,entityType:n="post",entityTypeLabel:r="Post",queryArgs:i={},onSelect:o=()=>{},onClose:s=()=>{},selectedId:a=null,status:l="publish",afterSearch:c,afterResults:d}){const[p,h]=(0,g.useState)(null),f=(0,Qe.useDebounce)(p,600),{records:m}=function({entityType:e="post",enabled:t=!1,excludeId:n=null,args:r={}}){const{hasResolved:i,isResolving:o,records:s}=(0,Je.useEntityRecords)("postType",e,{context:"view",orderby:"date",order:"desc",per_page:25,...r},{enabled:t});return{records:(0,g.useMemo)(()=>s&&s.filter(e=>e.id!==n)||[],[s,n]),isResolving:o,hasResolved:i}}({entityType:n,enabled:!0,excludeId:a,args:{per_page:50,context:"edit",status:l,...i}}),v=(0,g.useMemo)(()=>m.map(e=>({id:e.id,name:e.slug,title:e.title.rendered,blocks:(0,S.parse)(e.content.raw),content:e.content.raw})).filter(e=>!f||e.title.toLowerCase().includes(f)||e.content.includes(f)),[m,f]),x=(0,et.useAsyncList)(v),j=!!v.length;return(0,u.jsx)(w.Modal,{title:e,onRequestClose:s,children:(0,u.jsx)(tt,{children:(0,u.jsxs)(w.__experimentalVStack,{spacing:"5",children:[(0,u.jsx)(nt,{children:(0,u.jsxs)(w.Flex,{children:[(0,u.jsx)(w.FlexBlock,{children:(0,u.jsx)(w.SearchControl,{__nextHasNoMarginBottom:!0,onChange:h,value:p,label:`Search for ${r}`,placeholder:(0,y.__)("Search")})}),"function"==typeof c?(0,u.jsx)(w.FlexItem,{children:c()}):c]})}),j&&(0,u.jsxs)("div",{children:[(0,u.jsx)("h2",{children:`Existing ${r}`}),t&&(0,u.jsx)("p",{children:t}),(0,u.jsx)(b.__experimentalBlockPatternsList,{blockPatterns:v,shownPatterns:x,onClickPattern:e=>{o(e),s()}})]}),!j&&(0,u.jsx)(w.__experimentalHStack,{alignment:"center",children:(0,u.jsx)("p",{children:(0,y.__)("No records found.")})}),"function"==typeof d?d():d]})})})}function it({level:e,isPressed:t=!1}){const n={1:"M9 5h2v10H9v-4H5v4H3V5h2v4h4V5zm6.6 0c-.6.9-1.5 1.7-2.6 2v1h2v7h2V5h-1.4z",2:"M7 5h2v10H7v-4H3v4H1V5h2v4h4V5zm8 8c.5-.4.6-.6 1.1-1.1.4-.4.8-.8 1.2-1.3.3-.4.6-.8.9-1.3.2-.4.3-.8.3-1.3 0-.4-.1-.9-.3-1.3-.2-.4-.4-.7-.8-1-.3-.3-.7-.5-1.2-.6-.5-.2-1-.2-1.5-.2-.4 0-.7 0-1.1.1-.3.1-.7.2-1 .3-.3.1-.6.3-.9.5-.3.2-.6.4-.8.7l1.2 1.2c.3-.3.6-.5 1-.7.4-.2.7-.3 1.2-.3s.9.1 1.3.4c.3.3.5.7.5 1.1 0 .4-.1.8-.4 1.1-.3.5-.6.9-1 1.2-.4.4-1 .9-1.6 1.4-.6.5-1.4 1.1-2.2 1.6V15h8v-2H15z",3:"M12.1 12.2c.4.3.8.5 1.2.7.4.2.9.3 1.4.3.5 0 1-.1 1.4-.3.3-.1.5-.5.5-.8 0-.2 0-.4-.1-.6-.1-.2-.3-.3-.5-.4-.3-.1-.7-.2-1-.3-.5-.1-1-.1-1.5-.1V9.1c.7.1 1.5-.1 2.2-.4.4-.2.6-.5.6-.9 0-.3-.1-.6-.4-.8-.3-.2-.7-.3-1.1-.3-.4 0-.8.1-1.1.3-.4.2-.7.4-1.1.6l-1.2-1.4c.5-.4 1.1-.7 1.6-.9.5-.2 1.2-.3 1.8-.3.5 0 1 .1 1.6.2.4.1.8.3 1.2.5.3.2.6.5.8.8.2.3.3.7.3 1.1 0 .5-.2.9-.5 1.3-.4.4-.9.7-1.5.9v.1c.6.1 1.2.4 1.6.8.4.4.7.9.7 1.5 0 .4-.1.8-.3 1.2-.2.4-.5.7-.9.9-.4.3-.9.4-1.3.5-.5.1-1 .2-1.6.2-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1l1.1-1.4zM7 9H3V5H1v10h2v-4h4v4h2V5H7v4z",4:"M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm10-2h-1v2h-2v-2h-5v-2l4-6h3v6h1v2zm-3-2V7l-2.8 4H16z",5:"M12.1 12.2c.4.3.7.5 1.1.7.4.2.9.3 1.3.3.5 0 1-.1 1.4-.4.4-.3.6-.7.6-1.1 0-.4-.2-.9-.6-1.1-.4-.3-.9-.4-1.4-.4H14c-.1 0-.3 0-.4.1l-.4.1-.5.2-1-.6.3-5h6.4v1.9h-4.3L14 8.8c.2-.1.5-.1.7-.2.2 0 .5-.1.7-.1.5 0 .9.1 1.4.2.4.1.8.3 1.1.6.3.2.6.6.8.9.2.4.3.9.3 1.4 0 .5-.1 1-.3 1.4-.2.4-.5.8-.9 1.1-.4.3-.8.5-1.3.7-.5.2-1 .3-1.5.3-.8 0-1.6-.1-2.3-.4-.6-.2-1.1-.6-1.6-1-.1-.1 1-1.5 1-1.5zM9 15H7v-4H3v4H1V5h2v4h4V5h2v10z",6:"M9 15H7v-4H3v4H1V5h2v4h4V5h2v10zm8.6-7.5c-.2-.2-.5-.4-.8-.5-.6-.2-1.3-.2-1.9 0-.3.1-.6.3-.8.5l-.6.9c-.2.5-.2.9-.2 1.4.4-.3.8-.6 1.2-.8.4-.2.8-.3 1.3-.3.4 0 .8 0 1.2.2.4.1.7.3 1 .6.3.3.5.6.7.9.2.4.3.8.3 1.3s-.1.9-.3 1.4c-.2.4-.5.7-.8 1-.4.3-.8.5-1.2.6-1 .3-2 .3-3 0-.5-.2-1-.5-1.4-.9-.4-.4-.8-.9-1-1.5-.2-.6-.3-1.3-.3-2.1s.1-1.6.4-2.3c.2-.6.6-1.2 1-1.6.4-.4.9-.7 1.4-.9.6-.3 1.1-.4 1.7-.4.7 0 1.4.1 2 .3.5.2 1 .5 1.4.8 0 .1-1.3 1.4-1.3 1.4zm-2.4 5.8c.2 0 .4 0 .6-.1.2 0 .4-.1.5-.2.1-.1.3-.3.4-.5.1-.2.1-.5.1-.7 0-.4-.1-.8-.4-1.1-.3-.2-.7-.3-1.1-.3-.3 0-.7.1-1 .2-.4.2-.7.4-1 .7 0 .3.1.7.3 1 .1.2.3.4.4.6.2.1.3.3.5.3.2.1.5.2.7.1z"};return n.hasOwnProperty(e)?(0,u.jsx)(w.SVG,{width:"24",height:"24",viewBox:"0 0 20 20",xmlns:"http://www.w3.org/2000/svg",isPressed:t,children:(0,u.jsx)(w.Path,{d:n[e]})}):null}const ot=function({selectedLevel:e,levels:n=[2,3],onChange:r,Icon:i=it}){const o=(0,t.useCallback)(()=>(0,u.jsx)(i,{level:e,isPressed:!0}),[e]);return(0,u.jsx)(w.ToolbarGroup,{children:(0,u.jsx)(w.ToolbarDropdownMenu,{icon:o,label:"Select Heading Size",controls:n.map(t=>{const n=t===e;return{title:(0,y.sprintf)(
// translators: %s: heading level e.g: "1", "2", "3"
// translators: %s: heading level e.g: "1", "2", "3"
(0,y.__)("Heading %d"),t),icon:(0,u.jsx)(i,{level:t,isPressed:n}),isActive:n,onClick:()=>r(t)}})})})};var st=n(503),at=n.n(st);function lt({allowedBlocks:e=["core/post-title","core/post-date","core/post-excerpt","core/group","core/paragraph"],template:t,wrapperProps:n={}}){const r=(0,b.useInnerBlocksProps)(n,{allowedBlocks:e,template:t});return(0,u.jsx)("div",{...r})}const ct=(0,t.memo)(function({blocks:e,blockContextId:t,isHidden:n,setActiveBlockContextId:r}){const i=(0,b.__experimentalUseBlockPreview)({blocks:e}),o=()=>{r(t)},s={display:n?"none":void 0};return(0,u.jsx)("div",{...i,tabIndex:0,role:"button",onClick:o,onKeyDown:o,style:s})});function ut(e,n=10){const{records:r,isResolving:i}=(0,Je.useEntityRecords)("postType",e,{per_page:n,post_parent:0,context:"view"});return{blockContexts:(0,t.useMemo)(()=>!r||i?[]:r?.map(e=>({queryId:0,postId:e.id,postType:e.type,props:e.props})),[r,i]),isResolving:i}}function dt({clientId:e,allowedBlocks:n,template:r,blockContexts:i,isResolving:o=!0,loadingLabel:s="Loading...",wrapperProps:a={}}){const[l,c]=(0,t.useState)(null),{blocks:d}=(0,j.useSelect)(t=>{const{getBlocks:n}=t(b.store);return{blocks:n(e)}},[e]);return(0,t.useEffect)(()=>{if(i.length>0){const e=i[0];c(at()(JSON.stringify(e)))}},[i]),o?(0,u.jsx)(b.Warning,{children:(0,u.jsxs)(w.Flex,{align:"center",gap:"10px",children:[(0,u.jsx)(w.FlexBlock,{children:`${s}`}),(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Spinner,{})})]})}):(0,u.jsx)("div",{...a,children:i&&i.map((e,t)=>{const o=at()(JSON.stringify(e)),s=o===(l||at()(JSON.stringify(i[0])));return(0,u.jsxs)(b.BlockContextProvider,{value:e,children:[null===l||s?(0,u.jsx)(lt,{allowedBlocks:n,template:r}):null,(0,u.jsx)(ct,{blocks:d,blockContextId:o,setActiveBlockContextId:c,isHidden:s})]},`context-key--${t}`)})})}function pt({enabled:e,label:t=(0,y.__)("Loading…","prc-platform-core")}){return e?(0,u.jsxs)(w.Flex,{align:"center",justify:"center",children:[(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Spinner,{})}),(0,u.jsx)(w.FlexBlock,{children:(0,u.jsx)("span",{children:t})})]}):null}function ht({postId:e,postType:t="post",postTypeLabel:n="",blockProps:r={},clientId:i,allowDetach:o=!1,isMissingChildren:s,collector:a,children:l,passedRef:c}){let d;d=c||(0,g.createRef)(),r.ref=d;const{record:p,isResolving:h,hasResolved:f}=(0,Je.useEntityRecord)("postType",t,e),m={id:e},[v,x,y]=(0,Je.useEntityBlockEditor)("postType",t,m),w=!0===f&&!1===h&&void 0===p,j=(0,g.useMemo)(()=>JSON.stringify(e,t),[e]);(0,g.useEffect)(()=>{"function"==typeof a&&a(p)},[p,a]);const S=(0,b.useHasRecursion)(j),A=(0,b.useInnerBlocksProps)(r,{value:v,onInput:x,onChange:y,renderAppender:v?.length?void 0:b.InnerBlocks.ButtonBlockAppender});return(0,g.useEffect)(()=>{console.log("InnerBlocksAsSyncedContent",{lookup:m,isResolving:h,hasResolved:f,record:p,isMissing:w,postId:e,postType:t})},[h,w,f,p]),S?(0,u.jsx)("div",{...r,children:(0,u.jsx)(b.Warning,{children:`${n} cannot be rendered inside itself.`})}):h||!f?(0,u.jsx)("div",{...r,children:(0,u.jsx)(b.Warning,{children:(0,u.jsx)(pt,{enabled:!0,label:`Loading ${n} …`})})}):w?(0,u.jsx)("div",{...r,children:(0,u.jsxs)(b.Warning,{children:[`A matching ${n.toLocaleLowerCase()} could not be found. It may be unavailable at this time.`,s&&(0,u.jsx)("div",{style:{marginTop:"1em"},children:s()})]})}):(0,u.jsxs)(b.RecursionProvider,{uniqueId:j,children:[(0,u.jsx)("div",{...A}),o&&(0,u.jsx)(k,{blocks:v,clientId:i,label:`Detach %s blocks from ${n}`}),l]})}function ft({title:e,className:n,children:r,renderToggle:i}){const[o,s]=(0,t.useState)(null),a=(0,t.useMemo)(()=>({anchor:o,placement:"left-start",offset:36,shift:!0}),[o]);return(0,u.jsx)("div",{ref:s,className:n,children:(0,u.jsx)(w.Dropdown,{popoverProps:a,focusOnMount:!0,renderToggle:i,renderContent:({onClose:t})=>(0,u.jsxs)("div",{children:[(0,u.jsx)(b.__experimentalInspectorPopoverHeader,{title:e,onClose:t}),r]})})})}const mt=window.wp.htmlEntities,gt=(0,g.createElement)(v.SVG,{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,g.createElement)(v.Path,{d:"M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"})),vt=function({label:e,defaultLabel:n,keyValue:r,index:i,children:o,onRemove:s=!1,storeName:a=null,lastItem:l=!1,icon:c=!1}){const[d,p]=(0,t.useState)(void 0!==e?e:n);return(0,t.useEffect)(()=>{console.log("getPostTitleByKey",e,n,r,i,a),void 0===e&&void 0!==r&&(e=>{const{api:t}=window.wp,r=new t.models.Post({id:e});null===e?p(n):r.fetch().then(e=>{console.log(e),p(`${(0,mt.decodeEntities)(e.title.rendered)} (${e.id})`)})})(r)},[r]),(0,u.jsxs)("div",{style:{background:"white",paddingBottom:"1em",marginBottom:"1em",borderBottom:l?"none":"1px solid #EAEAEA"},children:[(0,u.jsxs)("div",{style:{display:"flex",flexDirection:"row",width:"100%",alignItems:"center"},children:[(0,u.jsx)("div",{style:{display:"flex"},children:(0,u.jsx)(w.Icon,{icon:gt})}),(0,u.jsxs)("div",{style:{display:"flex",flexGrow:"1",paddingLeft:"1em"},children:[!1!==c&&{icon:c},(0,u.jsx)("span",{children:d})]}),(0,u.jsx)("div",{style:{display:"flex"},children:(0,u.jsx)(w.IconButton,{icon:"no-alt",onClick:()=>{if(!1!==s&&"function"==typeof s&&s(),null!==a){const{remove:e}=(0,j.dispatch)(`prc/${a}`);e(i)}}})})]}),o]})},xt={seed:e=>({type:"SEED",items:e}),append:(...e)=>({type:"APPEND",items:e}),prepend:(...e)=>({type:"PREPEND",items:e}),insert:(e,...t)=>({type:"INSERT",index:e,items:t}),apply:e=>({type:"APPLY",fn:e}),remove:(...e)=>({type:"REMOVE",indexes:e}),reorder:({from:e,to:t})=>({type:"REORDER",from:e,to:t}),setItem:(e,t)=>({type:"SET_ITEM",index:e,item:t}),setItemProp:(e,t,n)=>({type:"SET_ITEM_PROP",index:e,prop:t,value:n})},yt=[],bt=(e=yt,t)=>{const n=[...e];switch(t.type){case"SEED":return[...t.items];case"APPEND":return[...e,...t.items];case"PREPEND":return[...t.items,...e];case"INSERT":return[...e.slice(0,t.index),...t.items,...e.slice(t.index)];case"APPLY":return e.map((e,n)=>t.fn(e,n));case"REMOVE":return e.filter((e,n)=>!t.indexes.includes(n));case"REORDER":const r=e[t.from];return n.splice(t.from,1),n.splice(t.to,0,r),n;case"SET_ITEM":return n[t.index]=t.item,n;case"SET_ITEM_PROP":return n[t.index]={...n[t.index],[t.prop]:t.value},n}return e},wt=(e,t=!1,n=!1)=>{!1!==t&&!1!==n||console.warn("registerListStore requires at least one resolver and one selector","resolvers:",t,"selectors",n);const r=(0,j.createReduxStore)(e,{reducer:bt,actions:xt,selectors:n,controls:{},resolvers:t});console.log(`@prc/components/list-store: registerListStore(${e})`),(0,j.register)(r)},jt=window.wp.url;function St({interests:e=[],onAdd:n=e=>{console.log("onAdd",e)},onRemove:r=e=>{console.log("onRemove",e)},onUpdate:i=e=>{console.log("onUpdate",e)}}){const[s,a]=(0,t.useState)(e);(0,t.useEffect)(()=>{i(s)},[s]);const[l,c]=(0,t.useState)([]);(0,t.useEffect)(()=>{o()({path:(0,jt.addQueryArgs)("/prc-api/v3/mailchimp/get-segments",{api_key:"mailchimp-select"})}).then(e=>{c(e)})},[]);const d=(0,t.useMemo)(()=>l?Object.keys(l).map(e=>({label:l[e].name,value:l[e].interest_id})):[],[l]);return(0,u.jsx)("div",{children:d.map(e=>(0,u.jsx)(w.ToggleControl,{label:e.label,checked:s.includes(e.value),onChange:()=>(e=>{const t=s;if(t.includes(e.value)){const n=t.indexOf(e.value);-1!==n&&(t.splice(n,1),r(e))}else t.push(e.value),n(e);console.log("updateSelection",e,s,t),a([...t])})(e)}))})}function kt({label:e="Select a MailChimp Segment",className:n,value:r,onChange:i,apiKey:s="mailchimp-form"}){const[a,l]=(0,t.useState)(r),[c,d]=(0,t.useState)([]);(0,t.useEffect)(()=>{o()({path:(0,jt.addQueryArgs)("/prc-api/v3/mailchimp/get-segments",{api_key:s})}).then(e=>{d(e)})},[s]),(0,t.useEffect)(()=>{a&&i(a)},[a]);const p=(0,t.useMemo)(()=>c?[{label:"Loading MailChimp segments...",value:""},...Object.keys(c).map(e=>({label:c[e].name,value:c[e].interest_id}))]:[],[c]),h=!!p&&0<p.length;return(0,u.jsxs)("div",{className:n,children:[!h&&(0,u.jsx)(w.Spinner,{}),h&&(0,u.jsx)(w.SelectControl,{label:e,value:a,options:p,onChange:e=>{l(e)},__nextHasNoMarginBottom:!0})]})}const At=Ze(w.RangeControl)`
	.components-range-control__slider-wrapper {
		padding-bottom: 28px;
	}

	span.components-range-control__mark-label {
		padding-top: 4px;
		font-size: 11px;
	}
`;function Tt(e){return(0,u.jsx)(At,{...e})}var Ct="1.13.7",Pt="object"==typeof self&&self.self===self&&self||"object"==typeof global&&global.global===global&&global||Function("return this")()||{},_t=Array.prototype,Et=Object.prototype,Mt="undefined"!=typeof Symbol?Symbol.prototype:null,Rt=_t.push,zt=_t.slice,It=Et.toString,Lt=Et.hasOwnProperty,Bt="undefined"!=typeof ArrayBuffer,Ot="undefined"!=typeof DataView,Vt=Array.isArray,Dt=Object.keys,Ft=Object.create,Nt=Bt&&ArrayBuffer.isView,Ut=isNaN,$t=isFinite,Ht=!{toString:null}.propertyIsEnumerable("toString"),Wt=["valueOf","isPrototypeOf","toString","propertyIsEnumerable","hasOwnProperty","toLocaleString"],Gt=Math.pow(2,53)-1;function qt(e,t){return t=null==t?e.length-1:+t,function(){for(var n=Math.max(arguments.length-t,0),r=Array(n),i=0;i<n;i++)r[i]=arguments[i+t];switch(t){case 0:return e.call(this,r);case 1:return e.call(this,arguments[0],r);case 2:return e.call(this,arguments[0],arguments[1],r)}var o=Array(t+1);for(i=0;i<t;i++)o[i]=arguments[i];return o[t]=r,e.apply(this,o)}}function Kt(e){var t=typeof e;return"function"===t||"object"===t&&!!e}function Xt(e){return null===e}function Yt(e){return void 0===e}function Zt(e){return!0===e||!1===e||"[object Boolean]"===It.call(e)}function Qt(e){return!(!e||1!==e.nodeType)}function Jt(e){var t="[object "+e+"]";return function(e){return It.call(e)===t}}const en=Jt("String"),tn=Jt("Number"),nn=Jt("Date"),rn=Jt("RegExp"),on=Jt("Error"),sn=Jt("Symbol"),an=Jt("ArrayBuffer");var ln=Jt("Function"),cn=Pt.document&&Pt.document.childNodes;"object"!=typeof Int8Array&&"function"!=typeof cn&&(ln=function(e){return"function"==typeof e||!1});const un=ln,dn=Jt("Object");var pn=Ot&&(!/\[native code\]/.test(String(DataView))||dn(new DataView(new ArrayBuffer(8)))),hn="undefined"!=typeof Map&&dn(new Map),fn=Jt("DataView");const mn=pn?function(e){return null!=e&&un(e.getInt8)&&an(e.buffer)}:fn,gn=Vt||Jt("Array");function vn(e,t){return null!=e&&Lt.call(e,t)}var xn=Jt("Arguments");!function(){xn(arguments)||(xn=function(e){return vn(e,"callee")})}();const yn=xn;function bn(e){return!sn(e)&&$t(e)&&!isNaN(parseFloat(e))}function wn(e){return tn(e)&&Ut(e)}function jn(e){return function(){return e}}function Sn(e){return function(t){var n=e(t);return"number"==typeof n&&n>=0&&n<=Gt}}function kn(e){return function(t){return null==t?void 0:t[e]}}const An=kn("byteLength"),Tn=Sn(An);var Cn=/\[object ((I|Ui)nt(8|16|32)|Float(32|64)|Uint8Clamped|Big(I|Ui)nt64)Array\]/;const Pn=Bt?function(e){return Nt?Nt(e)&&!mn(e):Tn(e)&&Cn.test(It.call(e))}:jn(!1),En=kn("length");function Mn(e,t){t=function(e){for(var t={},n=e.length,r=0;r<n;++r)t[e[r]]=!0;return{contains:function(e){return!0===t[e]},push:function(n){return t[n]=!0,e.push(n)}}}(t);var n=Wt.length,r=e.constructor,i=un(r)&&r.prototype||Et,o="constructor";for(vn(e,o)&&!t.contains(o)&&t.push(o);n--;)(o=Wt[n])in e&&e[o]!==i[o]&&!t.contains(o)&&t.push(o)}function Rn(e){if(!Kt(e))return[];if(Dt)return Dt(e);var t=[];for(var n in e)vn(e,n)&&t.push(n);return Ht&&Mn(e,t),t}function zn(e){if(null==e)return!0;var t=En(e);return"number"==typeof t&&(gn(e)||en(e)||yn(e))?0===t:0===En(Rn(e))}function In(e,t){var n=Rn(t),r=n.length;if(null==e)return!r;for(var i=Object(e),o=0;o<r;o++){var s=n[o];if(t[s]!==i[s]||!(s in i))return!1}return!0}function Ln(e){return e instanceof Ln?e:this instanceof Ln?void(this._wrapped=e):new Ln(e)}function Bn(e){return new Uint8Array(e.buffer||e,e.byteOffset||0,An(e))}Ln.VERSION=Ct,Ln.prototype.value=function(){return this._wrapped},Ln.prototype.valueOf=Ln.prototype.toJSON=Ln.prototype.value,Ln.prototype.toString=function(){return String(this._wrapped)};var On="[object DataView]";function Vn(e,t,n,r){if(e===t)return 0!==e||1/e==1/t;if(null==e||null==t)return!1;if(e!=e)return t!=t;var i=typeof e;return("function"===i||"object"===i||"object"==typeof t)&&Dn(e,t,n,r)}function Dn(e,t,n,r){e instanceof Ln&&(e=e._wrapped),t instanceof Ln&&(t=t._wrapped);var i=It.call(e);if(i!==It.call(t))return!1;if(pn&&"[object Object]"==i&&mn(e)){if(!mn(t))return!1;i=On}switch(i){case"[object RegExp]":case"[object String]":return""+e==""+t;case"[object Number]":return+e!=+e?+t!=+t:0===+e?1/+e==1/t:+e===+t;case"[object Date]":case"[object Boolean]":return+e===+t;case"[object Symbol]":return Mt.valueOf.call(e)===Mt.valueOf.call(t);case"[object ArrayBuffer]":case On:return Dn(Bn(e),Bn(t),n,r)}var o="[object Array]"===i;if(!o&&Pn(e)){if(An(e)!==An(t))return!1;if(e.buffer===t.buffer&&e.byteOffset===t.byteOffset)return!0;o=!0}if(!o){if("object"!=typeof e||"object"!=typeof t)return!1;var s=e.constructor,a=t.constructor;if(s!==a&&!(un(s)&&s instanceof s&&un(a)&&a instanceof a)&&"constructor"in e&&"constructor"in t)return!1}r=r||[];for(var l=(n=n||[]).length;l--;)if(n[l]===e)return r[l]===t;if(n.push(e),r.push(t),o){if((l=e.length)!==t.length)return!1;for(;l--;)if(!Vn(e[l],t[l],n,r))return!1}else{var c,u=Rn(e);if(l=u.length,Rn(t).length!==l)return!1;for(;l--;)if(!vn(t,c=u[l])||!Vn(e[c],t[c],n,r))return!1}return n.pop(),r.pop(),!0}function Fn(e,t){return Vn(e,t)}function Nn(e){if(!Kt(e))return[];var t=[];for(var n in e)t.push(n);return Ht&&Mn(e,t),t}function Un(e){var t=En(e);return function(n){if(null==n)return!1;var r=Nn(n);if(En(r))return!1;for(var i=0;i<t;i++)if(!un(n[e[i]]))return!1;return e!==qn||!un(n[$n])}}var $n="forEach",Hn=["clear","delete"],Wn=["get","has","set"],Gn=Hn.concat($n,Wn),qn=Hn.concat(Wn),Kn=["add"].concat(Hn,$n,"has");const Xn=hn?Un(Gn):Jt("Map"),Yn=hn?Un(qn):Jt("WeakMap"),Zn=hn?Un(Kn):Jt("Set"),Qn=Jt("WeakSet");function Jn(e){for(var t=Rn(e),n=t.length,r=Array(n),i=0;i<n;i++)r[i]=e[t[i]];return r}function er(e){for(var t=Rn(e),n=t.length,r=Array(n),i=0;i<n;i++)r[i]=[t[i],e[t[i]]];return r}function tr(e){for(var t={},n=Rn(e),r=0,i=n.length;r<i;r++)t[e[n[r]]]=n[r];return t}function nr(e){var t=[];for(var n in e)un(e[n])&&t.push(n);return t.sort()}function rr(e,t){return function(n){var r=arguments.length;if(t&&(n=Object(n)),r<2||null==n)return n;for(var i=1;i<r;i++)for(var o=arguments[i],s=e(o),a=s.length,l=0;l<a;l++){var c=s[l];t&&void 0!==n[c]||(n[c]=o[c])}return n}}const ir=rr(Nn),or=rr(Rn),sr=rr(Nn,!0);function ar(e){if(!Kt(e))return{};if(Ft)return Ft(e);var t=function(){};t.prototype=e;var n=new t;return t.prototype=null,n}function lr(e,t){var n=ar(e);return t&&or(n,t),n}function cr(e){return Kt(e)?gn(e)?e.slice():ir({},e):e}function ur(e,t){return t(e),e}function dr(e){return gn(e)?e:[e]}function pr(e){return Ln.toPath(e)}function hr(e,t){for(var n=t.length,r=0;r<n;r++){if(null==e)return;e=e[t[r]]}return n?e:void 0}function fr(e,t,n){var r=hr(e,pr(t));return Yt(r)?n:r}function mr(e,t){for(var n=(t=pr(t)).length,r=0;r<n;r++){var i=t[r];if(!vn(e,i))return!1;e=e[i]}return!!n}function gr(e){return e}function vr(e){return e=or({},e),function(t){return In(t,e)}}function xr(e){return e=pr(e),function(t){return hr(t,e)}}function yr(e,t,n){if(void 0===t)return e;switch(null==n?3:n){case 1:return function(n){return e.call(t,n)};case 3:return function(n,r,i){return e.call(t,n,r,i)};case 4:return function(n,r,i,o){return e.call(t,n,r,i,o)}}return function(){return e.apply(t,arguments)}}function br(e,t,n){return null==e?gr:un(e)?yr(e,t,n):Kt(e)&&!gn(e)?vr(e):xr(e)}function wr(e,t){return br(e,t,1/0)}function jr(e,t,n){return Ln.iteratee!==wr?Ln.iteratee(e,t):br(e,t,n)}function Sr(e,t,n){t=jr(t,n);for(var r=Rn(e),i=r.length,o={},s=0;s<i;s++){var a=r[s];o[a]=t(e[a],a,e)}return o}function kr(){}function Ar(e){return null==e?kr:function(t){return fr(e,t)}}function Tr(e,t,n){var r=Array(Math.max(0,e));t=yr(t,n,1);for(var i=0;i<e;i++)r[i]=t(i);return r}function Cr(e,t){return null==t&&(t=e,e=0),e+Math.floor(Math.random()*(t-e+1))}Ln.toPath=dr,Ln.iteratee=wr;const Pr=Date.now||function(){return(new Date).getTime()};function _r(e){var t=function(t){return e[t]},n="(?:"+Rn(e).join("|")+")",r=RegExp(n),i=RegExp(n,"g");return function(e){return e=null==e?"":""+e,r.test(e)?e.replace(i,t):e}}const Er={"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;","`":"&#x60;"},Mr=_r(Er),Rr=_r(tr(Er)),zr=Ln.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var Ir=/(.)^/,Lr={"'":"'","\\":"\\","\r":"r","\n":"n","\u2028":"u2028","\u2029":"u2029"},Br=/\\|'|\r|\n|\u2028|\u2029/g;function Or(e){return"\\"+Lr[e]}var Vr=/^\s*(\w|\$)+\s*$/;function Dr(e,t,n){!t&&n&&(t=n),t=sr({},t,Ln.templateSettings);var r=RegExp([(t.escape||Ir).source,(t.interpolate||Ir).source,(t.evaluate||Ir).source].join("|")+"|$","g"),i=0,o="__p+='";e.replace(r,function(t,n,r,s,a){return o+=e.slice(i,a).replace(Br,Or),i=a+t.length,n?o+="'+\n((__t=("+n+"))==null?'':_.escape(__t))+\n'":r?o+="'+\n((__t=("+r+"))==null?'':__t)+\n'":s&&(o+="';\n"+s+"\n__p+='"),t}),o+="';\n";var s,a=t.variable;if(a){if(!Vr.test(a))throw new Error("variable is not a bare identifier: "+a)}else o="with(obj||{}){\n"+o+"}\n",a="obj";o="var __t,__p='',__j=Array.prototype.join,print=function(){__p+=__j.call(arguments,'');};\n"+o+"return __p;\n";try{s=new Function(a,"_",o)}catch(e){throw e.source=o,e}var l=function(e){return s.call(this,e,Ln)};return l.source="function("+a+"){\n"+o+"}",l}function Fr(e,t,n){var r=(t=pr(t)).length;if(!r)return un(n)?n.call(e):n;for(var i=0;i<r;i++){var o=null==e?void 0:e[t[i]];void 0===o&&(o=n,i=r),e=un(o)?o.call(e):o}return e}var Nr=0;function Ur(e){var t=++Nr+"";return e?e+t:t}function $r(e){var t=Ln(e);return t._chain=!0,t}function Hr(e,t,n,r,i){if(!(r instanceof t))return e.apply(n,i);var o=ar(e.prototype),s=e.apply(o,i);return Kt(s)?s:o}var Wr=qt(function(e,t){var n=Wr.placeholder,r=function(){for(var i=0,o=t.length,s=Array(o),a=0;a<o;a++)s[a]=t[a]===n?arguments[i++]:t[a];for(;i<arguments.length;)s.push(arguments[i++]);return Hr(e,r,this,this,s)};return r});Wr.placeholder=Ln;const Gr=Wr,qr=qt(function(e,t,n){if(!un(e))throw new TypeError("Bind must be called on a function");var r=qt(function(i){return Hr(e,r,t,this,n.concat(i))});return r}),Kr=Sn(En);function Xr(e,t,n,r){if(r=r||[],t||0===t){if(t<=0)return r.concat(e)}else t=1/0;for(var i=r.length,o=0,s=En(e);o<s;o++){var a=e[o];if(Kr(a)&&(gn(a)||yn(a)))if(t>1)Xr(a,t-1,n,r),i=r.length;else for(var l=0,c=a.length;l<c;)r[i++]=a[l++];else n||(r[i++]=a)}return r}const Yr=qt(function(e,t){var n=(t=Xr(t,!1,!1)).length;if(n<1)throw new Error("bindAll must be passed function names");for(;n--;){var r=t[n];e[r]=qr(e[r],e)}return e});function Zr(e,t){var n=function(r){var i=n.cache,o=""+(t?t.apply(this,arguments):r);return vn(i,o)||(i[o]=e.apply(this,arguments)),i[o]};return n.cache={},n}const Qr=qt(function(e,t,n){return setTimeout(function(){return e.apply(null,n)},t)}),Jr=Gr(Qr,Ln,1);function ei(e,t,n){var r,i,o,s,a=0;n||(n={});var l=function(){a=!1===n.leading?0:Pr(),r=null,s=e.apply(i,o),r||(i=o=null)},c=function(){var c=Pr();a||!1!==n.leading||(a=c);var u=t-(c-a);return i=this,o=arguments,u<=0||u>t?(r&&(clearTimeout(r),r=null),a=c,s=e.apply(i,o),r||(i=o=null)):r||!1===n.trailing||(r=setTimeout(l,u)),s};return c.cancel=function(){clearTimeout(r),a=0,r=i=o=null},c}function ti(e,t,n){var r,i,o,s,a,l=function(){var c=Pr()-i;t>c?r=setTimeout(l,t-c):(r=null,n||(s=e.apply(a,o)),r||(o=a=null))},c=qt(function(c){return a=this,o=c,i=Pr(),r||(r=setTimeout(l,t),n&&(s=e.apply(a,o))),s});return c.cancel=function(){clearTimeout(r),r=o=a=null},c}function ni(e,t){return Gr(t,e)}function ri(e){return function(){return!e.apply(this,arguments)}}function ii(){var e=arguments,t=e.length-1;return function(){for(var n=t,r=e[t].apply(this,arguments);n--;)r=e[n].call(this,r);return r}}function oi(e,t){return function(){if(--e<1)return t.apply(this,arguments)}}function si(e,t){var n;return function(){return--e>0&&(n=t.apply(this,arguments)),e<=1&&(t=null),n}}const ai=Gr(si,2);function li(e,t,n){t=jr(t,n);for(var r,i=Rn(e),o=0,s=i.length;o<s;o++)if(t(e[r=i[o]],r,e))return r}function ci(e){return function(t,n,r){n=jr(n,r);for(var i=En(t),o=e>0?0:i-1;o>=0&&o<i;o+=e)if(n(t[o],o,t))return o;return-1}}const ui=ci(1),di=ci(-1);function pi(e,t,n,r){for(var i=(n=jr(n,r,1))(t),o=0,s=En(e);o<s;){var a=Math.floor((o+s)/2);n(e[a])<i?o=a+1:s=a}return o}function hi(e,t,n){return function(r,i,o){var s=0,a=En(r);if("number"==typeof o)e>0?s=o>=0?o:Math.max(o+a,s):a=o>=0?Math.min(o+1,a):o+a+1;else if(n&&o&&a)return r[o=n(r,i)]===i?o:-1;if(i!=i)return(o=t(zt.call(r,s,a),wn))>=0?o+s:-1;for(o=e>0?s:a-1;o>=0&&o<a;o+=e)if(r[o]===i)return o;return-1}}const fi=hi(1,ui,pi),mi=hi(-1,di);function gi(e,t,n){var r=(Kr(e)?ui:li)(e,t,n);if(void 0!==r&&-1!==r)return e[r]}function vi(e,t){return gi(e,vr(t))}function xi(e,t,n){var r,i;if(t=yr(t,n),Kr(e))for(r=0,i=e.length;r<i;r++)t(e[r],r,e);else{var o=Rn(e);for(r=0,i=o.length;r<i;r++)t(e[o[r]],o[r],e)}return e}function yi(e,t,n){t=jr(t,n);for(var r=!Kr(e)&&Rn(e),i=(r||e).length,o=Array(i),s=0;s<i;s++){var a=r?r[s]:s;o[s]=t(e[a],a,e)}return o}function bi(e){return function(t,n,r,i){var o=arguments.length>=3;return function(t,n,r,i){var o=!Kr(t)&&Rn(t),s=(o||t).length,a=e>0?0:s-1;for(i||(r=t[o?o[a]:a],a+=e);a>=0&&a<s;a+=e){var l=o?o[a]:a;r=n(r,t[l],l,t)}return r}(t,yr(n,i,4),r,o)}}const wi=bi(1),ji=bi(-1);function Si(e,t,n){var r=[];return t=jr(t,n),xi(e,function(e,n,i){t(e,n,i)&&r.push(e)}),r}function ki(e,t,n){return Si(e,ri(jr(t)),n)}function Ai(e,t,n){t=jr(t,n);for(var r=!Kr(e)&&Rn(e),i=(r||e).length,o=0;o<i;o++){var s=r?r[o]:o;if(!t(e[s],s,e))return!1}return!0}function Ti(e,t,n){t=jr(t,n);for(var r=!Kr(e)&&Rn(e),i=(r||e).length,o=0;o<i;o++){var s=r?r[o]:o;if(t(e[s],s,e))return!0}return!1}function Ci(e,t,n,r){return Kr(e)||(e=Jn(e)),("number"!=typeof n||r)&&(n=0),fi(e,t,n)>=0}const Pi=qt(function(e,t,n){var r,i;return un(t)?i=t:(t=pr(t),r=t.slice(0,-1),t=t[t.length-1]),yi(e,function(e){var o=i;if(!o){if(r&&r.length&&(e=hr(e,r)),null==e)return;o=e[t]}return null==o?o:o.apply(e,n)})});function _i(e,t){return yi(e,xr(t))}function Ei(e,t){return Si(e,vr(t))}function Mi(e,t,n){var r,i,o=-1/0,s=-1/0;if(null==t||"number"==typeof t&&"object"!=typeof e[0]&&null!=e)for(var a=0,l=(e=Kr(e)?e:Jn(e)).length;a<l;a++)null!=(r=e[a])&&r>o&&(o=r);else t=jr(t,n),xi(e,function(e,n,r){((i=t(e,n,r))>s||i===-1/0&&o===-1/0)&&(o=e,s=i)});return o}function Ri(e,t,n){var r,i,o=1/0,s=1/0;if(null==t||"number"==typeof t&&"object"!=typeof e[0]&&null!=e)for(var a=0,l=(e=Kr(e)?e:Jn(e)).length;a<l;a++)null!=(r=e[a])&&r<o&&(o=r);else t=jr(t,n),xi(e,function(e,n,r){((i=t(e,n,r))<s||i===1/0&&o===1/0)&&(o=e,s=i)});return o}var zi=/[^\ud800-\udfff]|[\ud800-\udbff][\udc00-\udfff]|[\ud800-\udfff]/g;function Ii(e){return e?gn(e)?zt.call(e):en(e)?e.match(zi):Kr(e)?yi(e,gr):Jn(e):[]}function Li(e,t,n){if(null==t||n)return Kr(e)||(e=Jn(e)),e[Cr(e.length-1)];var r=Ii(e),i=En(r);t=Math.max(Math.min(t,i),0);for(var o=i-1,s=0;s<t;s++){var a=Cr(s,o),l=r[s];r[s]=r[a],r[a]=l}return r.slice(0,t)}function Bi(e){return Li(e,1/0)}function Oi(e,t,n){var r=0;return t=jr(t,n),_i(yi(e,function(e,n,i){return{value:e,index:r++,criteria:t(e,n,i)}}).sort(function(e,t){var n=e.criteria,r=t.criteria;if(n!==r){if(n>r||void 0===n)return 1;if(n<r||void 0===r)return-1}return e.index-t.index}),"value")}function Vi(e,t){return function(n,r,i){var o=t?[[],[]]:{};return r=jr(r,i),xi(n,function(t,i){var s=r(t,i,n);e(o,t,s)}),o}}const Di=Vi(function(e,t,n){vn(e,n)?e[n].push(t):e[n]=[t]}),Fi=Vi(function(e,t,n){e[n]=t}),Ni=Vi(function(e,t,n){vn(e,n)?e[n]++:e[n]=1}),Ui=Vi(function(e,t,n){e[n?0:1].push(t)},!0);function $i(e){return null==e?0:Kr(e)?e.length:Rn(e).length}function Hi(e,t,n){return t in n}const Wi=qt(function(e,t){var n={},r=t[0];if(null==e)return n;un(r)?(t.length>1&&(r=yr(r,t[1])),t=Nn(e)):(r=Hi,t=Xr(t,!1,!1),e=Object(e));for(var i=0,o=t.length;i<o;i++){var s=t[i],a=e[s];r(a,s,e)&&(n[s]=a)}return n}),Gi=qt(function(e,t){var n,r=t[0];return un(r)?(r=ri(r),t.length>1&&(n=t[1])):(t=yi(Xr(t,!1,!1),String),r=function(e,n){return!Ci(t,n)}),Wi(e,r,n)});function qi(e,t,n){return zt.call(e,0,Math.max(0,e.length-(null==t||n?1:t)))}function Ki(e,t,n){return null==e||e.length<1?null==t||n?void 0:[]:null==t||n?e[0]:qi(e,e.length-t)}function Xi(e,t,n){return zt.call(e,null==t||n?1:t)}function Yi(e,t,n){return null==e||e.length<1?null==t||n?void 0:[]:null==t||n?e[e.length-1]:Xi(e,Math.max(0,e.length-t))}function Zi(e){return Si(e,Boolean)}function Qi(e,t){return Xr(e,t,!1)}const Ji=qt(function(e,t){return t=Xr(t,!0,!0),Si(e,function(e){return!Ci(t,e)})}),eo=qt(function(e,t){return Ji(e,t)});function to(e,t,n,r){Zt(t)||(r=n,n=t,t=!1),null!=n&&(n=jr(n,r));for(var i=[],o=[],s=0,a=En(e);s<a;s++){var l=e[s],c=n?n(l,s,e):l;t&&!n?(s&&o===c||i.push(l),o=c):n?Ci(o,c)||(o.push(c),i.push(l)):Ci(i,l)||i.push(l)}return i}const no=qt(function(e){return to(Xr(e,!0,!0))});function ro(e){for(var t=[],n=arguments.length,r=0,i=En(e);r<i;r++){var o=e[r];if(!Ci(t,o)){var s;for(s=1;s<n&&Ci(arguments[s],o);s++);s===n&&t.push(o)}}return t}function io(e){for(var t=e&&Mi(e,En).length||0,n=Array(t),r=0;r<t;r++)n[r]=_i(e,r);return n}const oo=qt(io);function so(e,t){for(var n={},r=0,i=En(e);r<i;r++)t?n[e[r]]=t[r]:n[e[r][0]]=e[r][1];return n}function ao(e,t,n){null==t&&(t=e||0,e=0),n||(n=t<e?-1:1);for(var r=Math.max(Math.ceil((t-e)/n),0),i=Array(r),o=0;o<r;o++,e+=n)i[o]=e;return i}function lo(e,t){if(null==t||t<1)return[];for(var n=[],r=0,i=e.length;r<i;)n.push(zt.call(e,r,r+=t));return n}function co(e,t){return e._chain?Ln(t).chain():t}function uo(e){return xi(nr(e),function(t){var n=Ln[t]=e[t];Ln.prototype[t]=function(){var e=[this._wrapped];return Rt.apply(e,arguments),co(this,n.apply(Ln,e))}}),Ln}xi(["pop","push","reverse","shift","sort","splice","unshift"],function(e){var t=_t[e];Ln.prototype[e]=function(){var n=this._wrapped;return null!=n&&(t.apply(n,arguments),"shift"!==e&&"splice"!==e||0!==n.length||delete n[0]),co(this,n)}}),xi(["concat","join","slice"],function(e){var t=_t[e];Ln.prototype[e]=function(){var e=this._wrapped;return null!=e&&(e=t.apply(e,arguments)),co(this,e)}});const po=Ln;var ho=uo(e);ho._=ho;const fo=window.wp.mediaUtils,mo="full",go=Ze(w.Button)`
	margin: 0 !important;
`,vo=Ze.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
`,xo=Ze.button`
	cursor: pointer;
	background: none;
	border: none;
	margin: 0;
`,yo=Ze.div`
	cursor: pointer;
	background: none;
	border: none;
	margin: 0;
`,bo=function({attachmentId:e=!1,disabled:n=!1,onUpdate:r=e=>{console.warn("Media DropZone Attachment, use onUpdate prop when using <MediaDropZone/>: ",e)},onClear:i=!1,allowedTypes:o=["image"],mediaSize:s=mo,label:a=null,singularLabel:l=(0,y.__)("image"),editButtonLabel:c=(0,y.__)("Edit image"),className:d="",mediaType:p,children:h}){const f=(0,y.__)(`Drop a ${l} here, or click to replace.`,"prc-block-library"),m=null!==a?a:`Set ${l}`,[g,v]=(0,t.useState)(e),[x,S]=(0,t.useState)(!1),k=p||o,{media:A,src:T,width:C,height:P,type:_}=(0,j.useSelect)(e=>{const t=!!g&&e("core").getMedia(g);if(console.warn("get M media",t),void 0===t||!1===t)return{media:!1,src:!1,width:!1,height:!1,type:void 0===t&&"not-found"};let n=!1,r=!1,i=!1;if(mr(t,["media_details","sizes",s]))r=t.media_details.sizes[s].width,i=t.media_details.sizes[s].height,n=t.media_details.sizes[s].source_url;else{const e=mo;mr(t,["media_details","sizes",e])?(r=t.media_details.sizes[e].width,i=t.media_details.sizes[e].height,n=t.media_details.sizes[e].source_url):(r=t.media_details.width,i=t.media_details.height,n=t.source_url)}return{media:t,src:n,width:r,height:i,type:!1!==t&&t?.media_type}},[g]),E=e=>{e.id!==g&&(v(e.id),r(e)),S(!1)},M=e=>{(0,fo.uploadMedia)({allowedTypes:k,filesList:e,onFileChange([e]){console.log("onFileChange",e),e.id?(e.sizes=e.media_details.sizes,E(e)):S(!0)},onError(e){console.error(e)}})},R=!1!==g&&!1!==A&&!1!==T&&!1===x,z=!1!==_;return(0,u.jsx)(b.MediaUploadCheck,{fallback:f,children:(0,u.jsx)(b.MediaUpload,{title:`${l.charAt(0).toUpperCase()+l.slice(1)} Upload`,onSelect:E,allowedTypes:k,value:g,render:({open:e})=>{const r=()=>{!0!==n&&e()};return(0,u.jsxs)(vo,{className:d,children:[R&&(0,u.jsxs)(t.Fragment,{children:[!h&&"image"===_&&(0,u.jsx)(xo,{type:"button",onClick:r,children:(0,u.jsx)("img",{alt:f,src:T,width:`${C}px`,height:`${P}px`})}),!h&&"image"!==_&&(0,u.jsx)(go,{variant:"secondary",onClick:r,children:c}),h&&(0,u.jsx)(yo,{onClick:r,children:h})]}),!1!==i&&z&&(0,u.jsxs)(go,{variant:"link",isSmall:!0,onClick:()=>{"function"==typeof i&&i(),v(!1)},children:["Clear ",l]}),!R&&x&&(0,u.jsx)(go,{variant:"secondary",isBusy:!0,children:(0,y.__)("Loading…")}),!R&&!x&&(0,u.jsx)(go,{variant:"primary",onClick:r,children:m}),(0,u.jsx)(w.DropZone,{onFilesDrop:M})]})}})})},wo=window.lodash,jo=window.wp.editor;function So({onClickHandler:e,width:t,height:n,children:r,label:i,icon:o=!1,isActive:s=!1,spinner:a=!1}){const l=Ze.button`
		appearance: none;
		padding: 0;
		border: none;
		cursor: pointer;
		display: block;
		width: 100%;
	`,c=Ze.div`
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100%;
		max-width: ${e=>e.aspectWidth}px;
		max-height: ${e=>e.aspectHeight}px;
		&:hover > div {
			visibility: visible;
		}
	`,d=Ze.div`
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.85);
		visibility: ${e=>e.isActive?"visible":"hidden"};
		text-align: center;
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		transition: visbility 0.3s ease;
	`;return(0,u.jsx)(l,{onClick:e,type:"button",children:(0,u.jsx)(w.ResponsiveWrapper,{naturalWidth:t,naturalHeight:n,isInline:!0,children:(0,u.jsxs)(c,{aspectWidth:t,aspectHeight:n,children:[r,(0,u.jsxs)(d,{aspectWidth:t,aspectHeight:n,isActive:s,children:[!a&&o&&(0,u.jsx)("div",{children:(0,u.jsx)(w.Icon,{icon:o})}),a&&(0,u.jsx)(w.Spinner,{}),(0,u.jsx)("span",{children:i})]})]})})})}const ko=["image"],Ao=Ze.div`
	background: inherit;
	position: relative;
`,To=Ze.div`
	background: var(--wp--preset--color--ui-gray-very-light);
`,Co=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Po=Ze.div`
	clear: both;
	width: ${e=>e.aspectWidth}px;
	height: ${e=>e.aspectHeight}px;
	max-width: 100%;
	max-height: 100%;
`;function _o({id:e,size:n="A1",labels:r={label:"Edit A1 Image Slot",title:"Select A1 Image",update:"Update A1 Image Slot",dropzone:"Drop A1 Image Here"},onClick:i,onUpdate:o=e=>{console.log("onUpdate",e)},overlayActive:s=!1,allowedTypes:a=ko}){const[l,c]=(0,t.useState)(!1),{media:d,postId:p}=(0,j.useSelect)(t=>{const{getMedia:n}=t("core");return{media:e?n(e):null,postId:t(jo.store).getCurrentPostId()}},[e]),{hasMedia:h,width:f,height:m,src:g}=(0,t.useMemo)(()=>{const t={width:249,height:139,src:null,hasMedia:!1};return e&&d&&!l&&(0,wo.has)(d,["media_details","sizes",n])&&(t.width=d.media_details.sizes[n].width,t.height=d.media_details.sizes[n].height,t.src=d.media_details.sizes[n].source_url,t.hasMedia=!0),t},[e,d,n,l]),v=e=>{o(e)},x=e=>{(0,fo.uploadMedia)({allowedTypes:a,filesList:e,additionalData:{post:p},onFileChange([e]){e.id?(e.sizes=e.media_details.sizes,v(e),c(!1)):c(!0)},onError(e){console.error(e)}})},y=(0,t.useCallback)(e=>{void 0!==i?i():e()},[i]);return(0,u.jsx)(Ao,{children:(0,u.jsx)(b.MediaUploadCheck,{children:(0,u.jsx)(b.MediaUpload,{title:r.title,onSelect:v,allowedTypes:ko,value:e,modalClass:"prc-platform-art-direction__modal",render:({open:n})=>(0,u.jsxs)(To,{children:[(0,u.jsx)(So,{onClickHandler:()=>y(n),width:f,height:m,isActive:!e||s||!h,label:e?r.update:r.label,icon:r.icon||!1,spinner:!!e&&!h,children:(0,u.jsxs)(t.Fragment,{children:[!!e&&h&&(0,u.jsx)(Co,{src:g,alt:r.update,width:f,height:m}),(!h||!e)&&(0,u.jsx)(Po,{aspectWidth:f,aspectHeight:m})]})}),(0,u.jsx)(w.DropZone,{onFilesDrop:x,label:r?.dropzone||r?.label})]})})})})}function Eo(e){if("undefined"==typeof Proxy)return e;const t=new Map;return new Proxy((...t)=>e(...t),{get:(n,r)=>"create"===r?e:(t.has(r)||t.set(r,e(r)),t.get(r))})}function Mo(e){return null!==e&&"object"==typeof e&&"function"==typeof e.start}const Ro=e=>Array.isArray(e);function zo(e,t){if(!Array.isArray(t))return!1;const n=t.length;if(n!==e.length)return!1;for(let r=0;r<n;r++)if(t[r]!==e[r])return!1;return!0}function Io(e){return"string"==typeof e||Array.isArray(e)}function Lo(e){const t=[{},{}];return null==e||e.values.forEach((e,n)=>{t[0][n]=e.get(),t[1][n]=e.getVelocity()}),t}function Bo(e,t,n,r){if("function"==typeof t){const[i,o]=Lo(r);t=t(void 0!==n?n:e.custom,i,o)}if("string"==typeof t&&(t=e.variants&&e.variants[t]),"function"==typeof t){const[i,o]=Lo(r);t=t(void 0!==n?n:e.custom,i,o)}return t}function Oo(e,t,n){const r=e.getProps();return Bo(r,t,void 0!==n?n:r.custom,e)}const Vo=["animate","whileInView","whileFocus","whileHover","whileTap","whileDrag","exit"],Do=["initial",...Vo];function Fo(e){let t;return()=>(void 0===t&&(t=e()),t)}const No=Fo(()=>void 0!==window.ScrollTimeline);class Uo{constructor(e){this.stop=()=>this.runAll("stop"),this.animations=e.filter(Boolean)}get finished(){return Promise.all(this.animations.map(e=>"finished"in e?e.finished:e))}getAll(e){return this.animations[0][e]}setAll(e,t){for(let n=0;n<this.animations.length;n++)this.animations[n][e]=t}attachTimeline(e,t){const n=this.animations.map(n=>No()&&n.attachTimeline?n.attachTimeline(e):"function"==typeof t?t(n):void 0);return()=>{n.forEach((e,t)=>{e&&e(),this.animations[t].stop()})}}get time(){return this.getAll("time")}set time(e){this.setAll("time",e)}get speed(){return this.getAll("speed")}set speed(e){this.setAll("speed",e)}get startTime(){return this.getAll("startTime")}get duration(){let e=0;for(let t=0;t<this.animations.length;t++)e=Math.max(e,this.animations[t].duration);return e}runAll(e){this.animations.forEach(t=>t[e]())}flatten(){this.runAll("flatten")}play(){this.runAll("play")}pause(){this.runAll("pause")}cancel(){this.runAll("cancel")}complete(){this.runAll("complete")}}class $o extends Uo{then(e,t){return Promise.all(this.animations).then(e).catch(t)}}function Ho(e,t){return e?e[t]||e.default||e:void 0}const Wo=2e4;function Go(e){let t=0,n=e.next(t);for(;!n.done&&t<Wo;)t+=50,n=e.next(t);return t>=Wo?1/0:t}function qo(e){return"function"==typeof e}function Ko(e,t){e.timeline=t,e.onfinish=null}const Xo=e=>Array.isArray(e)&&"number"==typeof e[0],Yo={linearEasing:void 0};function Zo(e,t){const n=Fo(e);return()=>{var e;return null!==(e=Yo[t])&&void 0!==e?e:n()}}const Qo=Zo(()=>{try{document.createElement("div").animate({opacity:0},{easing:"linear(0, 1)"})}catch(e){return!1}return!0},"linearEasing"),Jo=(e,t,n)=>{const r=t-e;return 0===r?1:(n-e)/r},es=(e,t,n=10)=>{let r="";const i=Math.max(Math.round(t/n),2);for(let t=0;t<i;t++)r+=e(Jo(0,i-1,t))+", ";return`linear(${r.substring(0,r.length-2)})`};function ts(e){return Boolean("function"==typeof e&&Qo()||!e||"string"==typeof e&&(e in rs||Qo())||Xo(e)||Array.isArray(e)&&e.every(ts))}const ns=([e,t,n,r])=>`cubic-bezier(${e}, ${t}, ${n}, ${r})`,rs={linear:"linear",ease:"ease",easeIn:"ease-in",easeOut:"ease-out",easeInOut:"ease-in-out",circIn:ns([0,.65,.55,1]),circOut:ns([.55,0,1,.45]),backIn:ns([.31,.01,.66,-.59]),backOut:ns([.33,1.53,.69,.99])};function is(e,t){return e?"function"==typeof e&&Qo()?es(e,t):Xo(e)?ns(e):Array.isArray(e)?e.map(e=>is(e,t)||rs.easeOut):rs[e]:void 0}const os={x:!1,y:!1};function ss(){return os.x||os.y}function as(e,t){const n=function(e){if(e instanceof Element)return[e];if("string"==typeof e){let t=document;const n=t.querySelectorAll(e);return n?Array.from(n):[]}return Array.from(e)}(e),r=new AbortController;return[n,{passive:!0,...t,signal:r.signal},()=>r.abort()]}function ls(e){return t=>{"touch"===t.pointerType||ss()||e(t)}}const cs=(e,t)=>!!t&&(e===t||cs(e,t.parentElement)),us=e=>"mouse"===e.pointerType?"number"!=typeof e.button||e.button<=0:!1!==e.isPrimary,ds=new Set(["BUTTON","INPUT","SELECT","TEXTAREA","A"]),ps=new WeakSet;function hs(e){return t=>{"Enter"===t.key&&e(t)}}function fs(e,t){e.dispatchEvent(new PointerEvent("pointer"+t,{isPrimary:!0,bubbles:!0}))}function ms(e){return us(e)&&!ss()}const gs=e=>1e3*e,vs=e=>e/1e3,xs=e=>e,ys=["transformPerspective","x","y","z","translateX","translateY","translateZ","scale","scaleX","scaleY","rotate","rotateX","rotateY","rotateZ","skew","skewX","skewY"],bs=new Set(ys),ws=new Set(["width","height","top","left","right","bottom",...ys]),js=e=>Ro(e)?e[e.length-1]||0:e,Ss=["read","resolveKeyframes","update","preRender","render","postRender"];function ks(e,t){let n=!1,r=!0;const i={delta:0,timestamp:0,isProcessing:!1},o=()=>n=!0,s=Ss.reduce((e,t)=>(e[t]=function(e){let t=new Set,n=new Set,r=!1,i=!1;const o=new WeakSet;let s={delta:0,timestamp:0,isProcessing:!1};function a(t){o.has(t)&&(l.schedule(t),e()),t(s)}const l={schedule:(e,i=!1,s=!1)=>{const a=s&&r?t:n;return i&&o.add(e),a.has(e)||a.add(e),e},cancel:e=>{n.delete(e),o.delete(e)},process:e=>{s=e,r?i=!0:(r=!0,[t,n]=[n,t],t.forEach(a),t.clear(),r=!1,i&&(i=!1,l.process(e)))}};return l}(o),e),{}),{read:a,resolveKeyframes:l,update:c,preRender:u,render:d,postRender:p}=s,h=()=>{const o=performance.now();n=!1,i.delta=r?1e3/60:Math.max(Math.min(o-i.timestamp,40),1),i.timestamp=o,i.isProcessing=!0,a.process(i),l.process(i),c.process(i),u.process(i),d.process(i),p.process(i),i.isProcessing=!1,n&&t&&(r=!1,e(h))};return{schedule:Ss.reduce((t,o)=>{const a=s[o];return t[o]=(t,o=!1,s=!1)=>(n||(n=!0,r=!0,i.isProcessing||e(h)),a.schedule(t,o,s)),t},{}),cancel:e=>{for(let t=0;t<Ss.length;t++)s[Ss[t]].cancel(e)},state:i,steps:s}}const{schedule:As,cancel:Ts,state:Cs,steps:Ps}=ks("undefined"!=typeof requestAnimationFrame?requestAnimationFrame:xs,!0);let _s;function Es(){_s=void 0}const Ms={now:()=>(void 0===_s&&Ms.set(Cs.isProcessing?Cs.timestamp:performance.now()),_s),set:e=>{_s=e,queueMicrotask(Es)}};function Rs(e,t){-1===e.indexOf(t)&&e.push(t)}function zs(e,t){const n=e.indexOf(t);n>-1&&e.splice(n,1)}class Is{constructor(){this.subscriptions=[]}add(e){return Rs(this.subscriptions,e),()=>zs(this.subscriptions,e)}notify(e,t,n){const r=this.subscriptions.length;if(r)if(1===r)this.subscriptions[0](e,t,n);else for(let i=0;i<r;i++){const r=this.subscriptions[i];r&&r(e,t,n)}}getSize(){return this.subscriptions.length}clear(){this.subscriptions.length=0}}function Ls(e,t){return t?e*(1e3/t):0}const Bs={current:void 0};class Os{constructor(e,t={}){this.version="11.18.2",this.canTrackVelocity=null,this.events={},this.updateAndNotify=(e,t=!0)=>{const n=Ms.now();this.updatedAt!==n&&this.setPrevFrameValue(),this.prev=this.current,this.setCurrent(e),this.current!==this.prev&&this.events.change&&this.events.change.notify(this.current),t&&this.events.renderRequest&&this.events.renderRequest.notify(this.current)},this.hasAnimated=!1,this.setCurrent(e),this.owner=t.owner}setCurrent(e){var t;this.current=e,this.updatedAt=Ms.now(),null===this.canTrackVelocity&&void 0!==e&&(this.canTrackVelocity=(t=this.current,!isNaN(parseFloat(t))))}setPrevFrameValue(e=this.current){this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt}onChange(e){return this.on("change",e)}on(e,t){this.events[e]||(this.events[e]=new Is);const n=this.events[e].add(t);return"change"===e?()=>{n(),As.read(()=>{this.events.change.getSize()||this.stop()})}:n}clearListeners(){for(const e in this.events)this.events[e].clear()}attach(e,t){this.passiveEffect=e,this.stopPassiveEffect=t}set(e,t=!0){t&&this.passiveEffect?this.passiveEffect(e,this.updateAndNotify):this.updateAndNotify(e,t)}setWithVelocity(e,t,n){this.set(t),this.prev=void 0,this.prevFrameValue=e,this.prevUpdatedAt=this.updatedAt-n}jump(e,t=!0){this.updateAndNotify(e),this.prev=e,this.prevUpdatedAt=this.prevFrameValue=void 0,t&&this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}get(){return Bs.current&&Bs.current.push(this),this.current}getPrevious(){return this.prev}getVelocity(){const e=Ms.now();if(!this.canTrackVelocity||void 0===this.prevFrameValue||e-this.updatedAt>30)return 0;const t=Math.min(this.updatedAt-this.prevUpdatedAt,30);return Ls(parseFloat(this.current)-parseFloat(this.prevFrameValue),t)}start(e){return this.stop(),new Promise(t=>{this.hasAnimated=!0,this.animation=e(t),this.events.animationStart&&this.events.animationStart.notify()}).then(()=>{this.events.animationComplete&&this.events.animationComplete.notify(),this.clearAnimation()})}stop(){this.animation&&(this.animation.stop(),this.events.animationCancel&&this.events.animationCancel.notify()),this.clearAnimation()}isAnimating(){return!!this.animation}clearAnimation(){delete this.animation}destroy(){this.clearListeners(),this.stop(),this.stopPassiveEffect&&this.stopPassiveEffect()}}function Vs(e,t){return new Os(e,t)}function Ds(e,t,n){e.hasValue(t)?e.getValue(t).set(n):e.addValue(t,Vs(n))}const Fs=e=>Boolean(e&&e.getVelocity);function Ns(e,t){const n=e.getValue("willChange");if(r=n,Boolean(Fs(r)&&r.add))return n.add(t);var r}const Us=e=>e.replace(/([a-z])([A-Z])/gu,"$1-$2").toLowerCase(),$s="data-"+Us("framerAppearId");function Hs(e){return e.props[$s]}const Ws=(e,t,n)=>(((1-3*n+3*t)*e+(3*n-6*t))*e+3*t)*e;function Gs(e,t,n,r){if(e===t&&n===r)return xs;return i=>0===i||1===i?i:Ws(function(e,t,n,r,i){let o,s,a=0;do{s=t+(n-t)/2,o=Ws(s,r,i)-e,o>0?n=s:t=s}while(Math.abs(o)>1e-7&&++a<12);return s}(i,0,1,e,n),t,r)}const qs=e=>t=>t<=.5?e(2*t)/2:(2-e(2*(1-t)))/2,Ks=e=>t=>1-e(1-t),Xs=Gs(.33,1.53,.69,.99),Ys=Ks(Xs),Zs=qs(Ys),Qs=e=>(e*=2)<1?.5*Ys(e):.5*(2-Math.pow(2,-10*(e-1))),Js=e=>1-Math.sin(Math.acos(e)),ea=Ks(Js),ta=qs(Js),na=e=>/^0[^.\s]+$/u.test(e);function ra(e){return"number"==typeof e?0===e:null===e||"none"===e||"0"===e||na(e)}const ia=(e,t,n)=>n>t?t:n<e?e:n,oa={test:e=>"number"==typeof e,parse:parseFloat,transform:e=>e},sa={...oa,transform:e=>ia(0,1,e)},aa={...oa,default:1},la=e=>Math.round(1e5*e)/1e5,ca=/-?(?:\d+(?:\.\d+)?|\.\d+)/gu,ua=/^(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))$/iu,da=(e,t)=>n=>Boolean("string"==typeof n&&ua.test(n)&&n.startsWith(e)||t&&!function(e){return null==e}(n)&&Object.prototype.hasOwnProperty.call(n,t)),pa=(e,t,n)=>r=>{if("string"!=typeof r)return r;const[i,o,s,a]=r.match(ca);return{[e]:parseFloat(i),[t]:parseFloat(o),[n]:parseFloat(s),alpha:void 0!==a?parseFloat(a):1}},ha={...oa,transform:e=>Math.round((e=>ia(0,255,e))(e))},fa={test:da("rgb","red"),parse:pa("red","green","blue"),transform:({red:e,green:t,blue:n,alpha:r=1})=>"rgba("+ha.transform(e)+", "+ha.transform(t)+", "+ha.transform(n)+", "+la(sa.transform(r))+")"},ma={test:da("#"),parse:function(e){let t="",n="",r="",i="";return e.length>5?(t=e.substring(1,3),n=e.substring(3,5),r=e.substring(5,7),i=e.substring(7,9)):(t=e.substring(1,2),n=e.substring(2,3),r=e.substring(3,4),i=e.substring(4,5),t+=t,n+=n,r+=r,i+=i),{red:parseInt(t,16),green:parseInt(n,16),blue:parseInt(r,16),alpha:i?parseInt(i,16)/255:1}},transform:fa.transform},ga=e=>({test:t=>"string"==typeof t&&t.endsWith(e)&&1===t.split(" ").length,parse:parseFloat,transform:t=>`${t}${e}`}),va=ga("deg"),xa=ga("%"),ya=ga("px"),ba=ga("vh"),wa=ga("vw"),ja={...xa,parse:e=>xa.parse(e)/100,transform:e=>xa.transform(100*e)},Sa={test:da("hsl","hue"),parse:pa("hue","saturation","lightness"),transform:({hue:e,saturation:t,lightness:n,alpha:r=1})=>"hsla("+Math.round(e)+", "+xa.transform(la(t))+", "+xa.transform(la(n))+", "+la(sa.transform(r))+")"},ka={test:e=>fa.test(e)||ma.test(e)||Sa.test(e),parse:e=>fa.test(e)?fa.parse(e):Sa.test(e)?Sa.parse(e):ma.parse(e),transform:e=>"string"==typeof e?e:e.hasOwnProperty("red")?fa.transform(e):Sa.transform(e)},Aa=/(?:#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\))/giu,Ta="number",Ca="color",Pa=/var\s*\(\s*--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)|#[\da-f]{3,8}|(?:rgb|hsl)a?\((?:-?[\d.]+%?[,\s]+){2}-?[\d.]+%?\s*(?:[,/]\s*)?(?:\b\d+(?:\.\d+)?|\.\d+)?%?\)|-?(?:\d+(?:\.\d+)?|\.\d+)/giu;function _a(e){const t=e.toString(),n=[],r={color:[],number:[],var:[]},i=[];let o=0;const s=t.replace(Pa,e=>(ka.test(e)?(r.color.push(o),i.push(Ca),n.push(ka.parse(e))):e.startsWith("var(")?(r.var.push(o),i.push("var"),n.push(e)):(r.number.push(o),i.push(Ta),n.push(parseFloat(e))),++o,"${}")).split("${}");return{values:n,split:s,indexes:r,types:i}}function Ea(e){return _a(e).values}function Ma(e){const{split:t,types:n}=_a(e),r=t.length;return e=>{let i="";for(let o=0;o<r;o++)if(i+=t[o],void 0!==e[o]){const t=n[o];i+=t===Ta?la(e[o]):t===Ca?ka.transform(e[o]):e[o]}return i}}const Ra=e=>"number"==typeof e?0:e,za={test:function(e){var t,n;return isNaN(e)&&"string"==typeof e&&((null===(t=e.match(ca))||void 0===t?void 0:t.length)||0)+((null===(n=e.match(Aa))||void 0===n?void 0:n.length)||0)>0},parse:Ea,createTransformer:Ma,getAnimatableNone:function(e){const t=Ea(e);return Ma(e)(t.map(Ra))}},Ia=new Set(["brightness","contrast","saturate","opacity"]);function La(e){const[t,n]=e.slice(0,-1).split("(");if("drop-shadow"===t)return e;const[r]=n.match(ca)||[];if(!r)return e;const i=n.replace(r,"");let o=Ia.has(t)?1:0;return r!==n&&(o*=100),t+"("+o+i+")"}const Ba=/\b([a-z-]*)\(.*?\)/gu,Oa={...za,getAnimatableNone:e=>{const t=e.match(Ba);return t?t.map(La).join(" "):e}},Va={borderWidth:ya,borderTopWidth:ya,borderRightWidth:ya,borderBottomWidth:ya,borderLeftWidth:ya,borderRadius:ya,radius:ya,borderTopLeftRadius:ya,borderTopRightRadius:ya,borderBottomRightRadius:ya,borderBottomLeftRadius:ya,width:ya,maxWidth:ya,height:ya,maxHeight:ya,top:ya,right:ya,bottom:ya,left:ya,padding:ya,paddingTop:ya,paddingRight:ya,paddingBottom:ya,paddingLeft:ya,margin:ya,marginTop:ya,marginRight:ya,marginBottom:ya,marginLeft:ya,backgroundPositionX:ya,backgroundPositionY:ya},Da={rotate:va,rotateX:va,rotateY:va,rotateZ:va,scale:aa,scaleX:aa,scaleY:aa,scaleZ:aa,skew:va,skewX:va,skewY:va,distance:ya,translateX:ya,translateY:ya,translateZ:ya,x:ya,y:ya,z:ya,perspective:ya,transformPerspective:ya,opacity:sa,originX:ja,originY:ja,originZ:ya},Fa={...oa,transform:Math.round},Na={...Va,...Da,zIndex:Fa,size:ya,fillOpacity:sa,strokeOpacity:sa,numOctaves:Fa},Ua={...Na,color:ka,backgroundColor:ka,outlineColor:ka,fill:ka,stroke:ka,borderColor:ka,borderTopColor:ka,borderRightColor:ka,borderBottomColor:ka,borderLeftColor:ka,filter:Oa,WebkitFilter:Oa},$a=e=>Ua[e];function Ha(e,t){let n=$a(e);return n!==Oa&&(n=za),n.getAnimatableNone?n.getAnimatableNone(t):void 0}const Wa=new Set(["auto","none","0"]),Ga=e=>e===oa||e===ya,qa=(e,t)=>parseFloat(e.split(", ")[t]),Ka=(e,t)=>(n,{transform:r})=>{if("none"===r||!r)return 0;const i=r.match(/^matrix3d\((.+)\)$/u);if(i)return qa(i[1],t);{const t=r.match(/^matrix\((.+)\)$/u);return t?qa(t[1],e):0}},Xa=new Set(["x","y","z"]),Ya=ys.filter(e=>!Xa.has(e)),Za={width:({x:e},{paddingLeft:t="0",paddingRight:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),height:({y:e},{paddingTop:t="0",paddingBottom:n="0"})=>e.max-e.min-parseFloat(t)-parseFloat(n),top:(e,{top:t})=>parseFloat(t),left:(e,{left:t})=>parseFloat(t),bottom:({y:e},{top:t})=>parseFloat(t)+(e.max-e.min),right:({x:e},{left:t})=>parseFloat(t)+(e.max-e.min),x:Ka(4,13),y:Ka(5,14)};Za.translateX=Za.x,Za.translateY=Za.y;const Qa=new Set;let Ja=!1,el=!1;function tl(){if(el){const e=Array.from(Qa).filter(e=>e.needsMeasurement),t=new Set(e.map(e=>e.element)),n=new Map;t.forEach(e=>{const t=function(e){const t=[];return Ya.forEach(n=>{const r=e.getValue(n);void 0!==r&&(t.push([n,r.get()]),r.set(n.startsWith("scale")?1:0))}),t}(e);t.length&&(n.set(e,t),e.render())}),e.forEach(e=>e.measureInitialState()),t.forEach(e=>{e.render();const t=n.get(e);t&&t.forEach(([t,n])=>{var r;null===(r=e.getValue(t))||void 0===r||r.set(n)})}),e.forEach(e=>e.measureEndState()),e.forEach(e=>{void 0!==e.suspendedScrollY&&window.scrollTo(0,e.suspendedScrollY)})}el=!1,Ja=!1,Qa.forEach(e=>e.complete()),Qa.clear()}function nl(){Qa.forEach(e=>{e.readKeyframes(),e.needsMeasurement&&(el=!0)})}class rl{constructor(e,t,n,r,i,o=!1){this.isComplete=!1,this.isAsync=!1,this.needsMeasurement=!1,this.isScheduled=!1,this.unresolvedKeyframes=[...e],this.onComplete=t,this.name=n,this.motionValue=r,this.element=i,this.isAsync=o}scheduleResolve(){this.isScheduled=!0,this.isAsync?(Qa.add(this),Ja||(Ja=!0,As.read(nl),As.resolveKeyframes(tl))):(this.readKeyframes(),this.complete())}readKeyframes(){const{unresolvedKeyframes:e,name:t,element:n,motionValue:r}=this;for(let i=0;i<e.length;i++)if(null===e[i])if(0===i){const i=null==r?void 0:r.get(),o=e[e.length-1];if(void 0!==i)e[0]=i;else if(n&&t){const r=n.readValue(t,o);null!=r&&(e[0]=r)}void 0===e[0]&&(e[0]=o),r&&void 0===i&&r.set(e[0])}else e[i]=e[i-1]}setFinalKeyframe(){}measureInitialState(){}renderEndStyles(){}measureEndState(){}complete(){this.isComplete=!0,this.onComplete(this.unresolvedKeyframes,this.finalKeyframe),Qa.delete(this)}cancel(){this.isComplete||(this.isScheduled=!1,Qa.delete(this))}resume(){this.isComplete||this.scheduleResolve()}}let il=xs,ol=xs;const sl=e=>/^-?(?:\d+(?:\.\d+)?|\.\d+)$/u.test(e),al=e=>t=>"string"==typeof t&&t.startsWith(e),ll=al("--"),cl=al("var(--"),ul=e=>!!cl(e)&&dl.test(e.split("/*")[0].trim()),dl=/var\(--(?:[\w-]+\s*|[\w-]+\s*,(?:\s*[^)(\s]|\s*\((?:[^)(]|\([^)(]*\))*\))+\s*)\)$/iu,pl=/^var\(--(?:([\w-]+)|([\w-]+), ?([a-zA-Z\d ()%#.,-]+))\)/u;function hl(e,t,n=1){ol(n<=4,`Max CSS variable fallback depth detected in property "${e}". This may indicate a circular fallback dependency.`);const[r,i]=function(e){const t=pl.exec(e);if(!t)return[,];const[,n,r,i]=t;return[`--${null!=n?n:r}`,i]}(e);if(!r)return;const o=window.getComputedStyle(t).getPropertyValue(r);if(o){const e=o.trim();return sl(e)?parseFloat(e):e}return ul(i)?hl(i,t,n+1):i}const fl=e=>t=>t.test(e),ml=[oa,ya,xa,va,wa,ba,{test:e=>"auto"===e,parse:e=>e}],gl=e=>ml.find(fl(e));class vl extends rl{constructor(e,t,n,r,i){super(e,t,n,r,i,!0)}readKeyframes(){const{unresolvedKeyframes:e,element:t,name:n}=this;if(!t||!t.current)return;super.readKeyframes();for(let n=0;n<e.length;n++){let r=e[n];if("string"==typeof r&&(r=r.trim(),ul(r))){const i=hl(r,t.current);void 0!==i&&(e[n]=i),n===e.length-1&&(this.finalKeyframe=r)}}if(this.resolveNoneKeyframes(),!ws.has(n)||2!==e.length)return;const[r,i]=e,o=gl(r),s=gl(i);if(o!==s)if(Ga(o)&&Ga(s))for(let t=0;t<e.length;t++){const n=e[t];"string"==typeof n&&(e[t]=parseFloat(n))}else this.needsMeasurement=!0}resolveNoneKeyframes(){const{unresolvedKeyframes:e,name:t}=this,n=[];for(let t=0;t<e.length;t++)ra(e[t])&&n.push(t);n.length&&function(e,t,n){let r,i=0;for(;i<e.length&&!r;){const t=e[i];"string"==typeof t&&!Wa.has(t)&&_a(t).values.length&&(r=e[i]),i++}if(r&&n)for(const i of t)e[i]=Ha(n,r)}(e,n,t)}measureInitialState(){const{element:e,unresolvedKeyframes:t,name:n}=this;if(!e||!e.current)return;"height"===n&&(this.suspendedScrollY=window.pageYOffset),this.measuredOrigin=Za[n](e.measureViewportBox(),window.getComputedStyle(e.current)),t[0]=this.measuredOrigin;const r=t[t.length-1];void 0!==r&&e.getValue(n,r).jump(r,!1)}measureEndState(){var e;const{element:t,name:n,unresolvedKeyframes:r}=this;if(!t||!t.current)return;const i=t.getValue(n);i&&i.jump(this.measuredOrigin,!1);const o=r.length-1,s=r[o];r[o]=Za[n](t.measureViewportBox(),window.getComputedStyle(t.current)),null!==s&&void 0===this.finalKeyframe&&(this.finalKeyframe=s),(null===(e=this.removedTransforms)||void 0===e?void 0:e.length)&&this.removedTransforms.forEach(([e,n])=>{t.getValue(e).set(n)}),this.resolveNoneKeyframes()}}const xl=(e,t)=>!("zIndex"===t||"number"!=typeof e&&!Array.isArray(e)&&("string"!=typeof e||!za.test(e)&&"0"!==e||e.startsWith("url(")));function yl(e,t,n,r){const i=e[0];if(null===i)return!1;if("display"===t||"visibility"===t)return!0;const o=e[e.length-1],s=xl(i,t),a=xl(o,t);return il(s===a,`You are trying to animate ${t} from "${i}" to "${o}". ${i} is not an animatable value - to enable this animation set ${i} to a value animatable to ${o} via the \`style\` property.`),!(!s||!a)&&(function(e){const t=e[0];if(1===e.length)return!0;for(let n=0;n<e.length;n++)if(e[n]!==t)return!0}(e)||("spring"===n||qo(n))&&r)}const bl=e=>null!==e;function wl(e,{repeat:t,repeatType:n="loop"},r){const i=e.filter(bl),o=t&&"loop"!==n&&t%2==1?0:i.length-1;return o&&void 0!==r?r:i[o]}class jl{constructor({autoplay:e=!0,delay:t=0,type:n="keyframes",repeat:r=0,repeatDelay:i=0,repeatType:o="loop",...s}){this.isStopped=!1,this.hasAttemptedResolve=!1,this.createdAt=Ms.now(),this.options={autoplay:e,delay:t,type:n,repeat:r,repeatDelay:i,repeatType:o,...s},this.updateFinishedPromise()}calcStartTime(){return this.resolvedAt&&this.resolvedAt-this.createdAt>40?this.resolvedAt:this.createdAt}get resolved(){return this._resolved||this.hasAttemptedResolve||(nl(),tl()),this._resolved}onKeyframesResolved(e,t){this.resolvedAt=Ms.now(),this.hasAttemptedResolve=!0;const{name:n,type:r,velocity:i,delay:o,onComplete:s,onUpdate:a,isGenerator:l}=this.options;if(!l&&!yl(e,n,r,i)){if(!o)return a&&a(wl(e,this.options,t)),s&&s(),void this.resolveFinishedPromise();this.options.duration=0}const c=this.initPlayback(e,t);!1!==c&&(this._resolved={keyframes:e,finalKeyframe:t,...c},this.onPostResolved())}onPostResolved(){}then(e,t){return this.currentFinishedPromise.then(e,t)}flatten(){this.options.type="keyframes",this.options.ease="linear"}updateFinishedPromise(){this.currentFinishedPromise=new Promise(e=>{this.resolveFinishedPromise=e})}}const Sl=(e,t,n)=>e+(t-e)*n;function kl(e,t,n){return n<0&&(n+=1),n>1&&(n-=1),n<1/6?e+6*(t-e)*n:n<.5?t:n<2/3?e+(t-e)*(2/3-n)*6:e}function Al(e,t){return n=>n>0?t:e}const Tl=(e,t,n)=>{const r=e*e,i=n*(t*t-r)+r;return i<0?0:Math.sqrt(i)},Cl=[ma,fa,Sa];function Pl(e){const t=(n=e,Cl.find(e=>e.test(n)));var n;if(il(Boolean(t),`'${e}' is not an animatable color. Use the equivalent color code instead.`),!Boolean(t))return!1;let r=t.parse(e);return t===Sa&&(r=function({hue:e,saturation:t,lightness:n,alpha:r}){e/=360,n/=100;let i=0,o=0,s=0;if(t/=100){const r=n<.5?n*(1+t):n+t-n*t,a=2*n-r;i=kl(a,r,e+1/3),o=kl(a,r,e),s=kl(a,r,e-1/3)}else i=o=s=n;return{red:Math.round(255*i),green:Math.round(255*o),blue:Math.round(255*s),alpha:r}}(r)),r}const _l=(e,t)=>{const n=Pl(e),r=Pl(t);if(!n||!r)return Al(e,t);const i={...n};return e=>(i.red=Tl(n.red,r.red,e),i.green=Tl(n.green,r.green,e),i.blue=Tl(n.blue,r.blue,e),i.alpha=Sl(n.alpha,r.alpha,e),fa.transform(i))},El=(e,t)=>n=>t(e(n)),Ml=(...e)=>e.reduce(El),Rl=new Set(["none","hidden"]);function zl(e,t){return n=>Sl(e,t,n)}function Il(e){return"number"==typeof e?zl:"string"==typeof e?ul(e)?Al:ka.test(e)?_l:Ol:Array.isArray(e)?Ll:"object"==typeof e?ka.test(e)?_l:Bl:Al}function Ll(e,t){const n=[...e],r=n.length,i=e.map((e,n)=>Il(e)(e,t[n]));return e=>{for(let t=0;t<r;t++)n[t]=i[t](e);return n}}function Bl(e,t){const n={...e,...t},r={};for(const i in n)void 0!==e[i]&&void 0!==t[i]&&(r[i]=Il(e[i])(e[i],t[i]));return e=>{for(const t in r)n[t]=r[t](e);return n}}const Ol=(e,t)=>{const n=za.createTransformer(t),r=_a(e),i=_a(t);return r.indexes.var.length===i.indexes.var.length&&r.indexes.color.length===i.indexes.color.length&&r.indexes.number.length>=i.indexes.number.length?Rl.has(e)&&!i.values.length||Rl.has(t)&&!r.values.length?function(e,t){return Rl.has(e)?n=>n<=0?e:t:n=>n>=1?t:e}(e,t):Ml(Ll(function(e,t){var n;const r=[],i={color:0,var:0,number:0};for(let o=0;o<t.values.length;o++){const s=t.types[o],a=e.indexes[s][i[s]],l=null!==(n=e.values[a])&&void 0!==n?n:0;r[o]=l,i[s]++}return r}(r,i),i.values),n):(il(!0,`Complex values '${e}' and '${t}' too different to mix. Ensure all colors are of the same type, and that each contains the same quantity of number and color values. Falling back to instant transition.`),Al(e,t))};function Vl(e,t,n){return"number"==typeof e&&"number"==typeof t&&"number"==typeof n?Sl(e,t,n):Il(e)(e,t)}function Dl(e,t,n){const r=Math.max(t-5,0);return Ls(n-e(r),t-r)}const Fl=.01,Nl=2,Ul=.005,$l=.5;const Hl=12;function Wl(e,t){return e*Math.sqrt(1-t*t)}const Gl=["duration","bounce"],ql=["stiffness","damping","mass"];function Kl(e,t){return t.some(t=>void 0!==e[t])}function Xl(e=.3,t=.3){const n="object"!=typeof e?{visualDuration:e,keyframes:[0,1],bounce:t}:e;let{restSpeed:r,restDelta:i}=n;const o=n.keyframes[0],s=n.keyframes[n.keyframes.length-1],a={done:!1,value:o},{stiffness:l,damping:c,mass:u,duration:d,velocity:p,isResolvedFromDuration:h}=function(e){let t={velocity:0,stiffness:100,damping:10,mass:1,isResolvedFromDuration:!1,...e};if(!Kl(e,ql)&&Kl(e,Gl))if(e.visualDuration){const n=e.visualDuration,r=2*Math.PI/(1.2*n),i=r*r,o=2*ia(.05,1,1-(e.bounce||0))*Math.sqrt(i);t={...t,mass:1,stiffness:i,damping:o}}else{const n=function({duration:e=800,bounce:t=.3,velocity:n=0,mass:r=1}){let i,o;il(e<=gs(10),"Spring duration must be 10 seconds or less");let s=1-t;s=ia(.05,1,s),e=ia(.01,10,vs(e)),s<1?(i=t=>{const r=t*s,i=r*e;return.001-(r-n)/Wl(t,s)*Math.exp(-i)},o=t=>{const r=t*s*e,o=r*n+n,a=Math.pow(s,2)*Math.pow(t,2)*e,l=Math.exp(-r),c=Wl(Math.pow(t,2),s);return(.001-i(t)>0?-1:1)*((o-a)*l)/c}):(i=t=>Math.exp(-t*e)*((t-n)*e+1)-.001,o=t=>Math.exp(-t*e)*(e*e*(n-t)));const a=function(e,t,n){let r=n;for(let n=1;n<Hl;n++)r-=e(r)/t(r);return r}(i,o,5/e);if(e=gs(e),isNaN(a))return{stiffness:100,damping:10,duration:e};{const t=Math.pow(a,2)*r;return{stiffness:t,damping:2*s*Math.sqrt(r*t),duration:e}}}(e);t={...t,...n,mass:1},t.isResolvedFromDuration=!0}return t}({...n,velocity:-vs(n.velocity||0)}),f=p||0,m=c/(2*Math.sqrt(l*u)),g=s-o,v=vs(Math.sqrt(l/u)),x=Math.abs(g)<5;let y;if(r||(r=x?Fl:Nl),i||(i=x?Ul:$l),m<1){const e=Wl(v,m);y=t=>{const n=Math.exp(-m*v*t);return s-n*((f+m*v*g)/e*Math.sin(e*t)+g*Math.cos(e*t))}}else if(1===m)y=e=>s-Math.exp(-v*e)*(g+(f+v*g)*e);else{const e=v*Math.sqrt(m*m-1);y=t=>{const n=Math.exp(-m*v*t),r=Math.min(e*t,300);return s-n*((f+m*v*g)*Math.sinh(r)+e*g*Math.cosh(r))/e}}const b={calculatedDuration:h&&d||null,next:e=>{const t=y(e);if(h)a.done=e>=d;else{let n=0;m<1&&(n=0===e?gs(f):Dl(y,e,t));const o=Math.abs(n)<=r,l=Math.abs(s-t)<=i;a.done=o&&l}return a.value=a.done?s:t,a},toString:()=>{const e=Math.min(Go(b),Wo),t=es(t=>b.next(e*t).value,e,30);return e+"ms "+t}};return b}function Yl({keyframes:e,velocity:t=0,power:n=.8,timeConstant:r=325,bounceDamping:i=10,bounceStiffness:o=500,modifyTarget:s,min:a,max:l,restDelta:c=.5,restSpeed:u}){const d=e[0],p={done:!1,value:d},h=e=>void 0===a?l:void 0===l||Math.abs(a-e)<Math.abs(l-e)?a:l;let f=n*t;const m=d+f,g=void 0===s?m:s(m);g!==m&&(f=g-d);const v=e=>-f*Math.exp(-e/r),x=e=>g+v(e),y=e=>{const t=v(e),n=x(e);p.done=Math.abs(t)<=c,p.value=p.done?g:n};let b,w;const j=e=>{var t;t=p.value,(void 0!==a&&t<a||void 0!==l&&t>l)&&(b=e,w=Xl({keyframes:[p.value,h(p.value)],velocity:Dl(x,e,p.value),damping:i,stiffness:o,restDelta:c,restSpeed:u}))};return j(0),{calculatedDuration:null,next:e=>{let t=!1;return w||void 0!==b||(t=!0,y(e),j(e)),void 0!==b&&e>=b?w.next(e-b):(!t&&y(e),p)}}}const Zl=Gs(.42,0,1,1),Ql=Gs(0,0,.58,1),Jl=Gs(.42,0,.58,1),ec={linear:xs,easeIn:Zl,easeInOut:Jl,easeOut:Ql,circIn:Js,circInOut:ta,circOut:ea,backIn:Ys,backInOut:Zs,backOut:Xs,anticipate:Qs},tc=e=>{if(Xo(e)){ol(4===e.length,"Cubic bezier arrays must contain four numerical values.");const[t,n,r,i]=e;return Gs(t,n,r,i)}return"string"==typeof e?(ol(void 0!==ec[e],`Invalid easing type '${e}'`),ec[e]):e};function nc(e,t){return e.map(()=>t||Jl).splice(0,e.length-1)}function rc({duration:e=300,keyframes:t,times:n,ease:r="easeInOut"}){const i=(e=>Array.isArray(e)&&"number"!=typeof e[0])(r)?r.map(tc):tc(r),o={done:!1,value:t[0]},s=function(e,t){return e.map(e=>e*t)}(n&&n.length===t.length?n:function(e){const t=[0];return function(e,t){const n=e[e.length-1];for(let r=1;r<=t;r++){const i=Jo(0,t,r);e.push(Sl(n,1,i))}}(t,e.length-1),t}(t),e),a=function(e,t,{clamp:n=!0,ease:r,mixer:i}={}){const o=e.length;if(ol(o===t.length,"Both input and output ranges must be the same length"),1===o)return()=>t[0];if(2===o&&t[0]===t[1])return()=>t[1];const s=e[0]===e[1];e[0]>e[o-1]&&(e=[...e].reverse(),t=[...t].reverse());const a=function(e,t,n){const r=[],i=n||Vl,o=e.length-1;for(let n=0;n<o;n++){let o=i(e[n],e[n+1]);if(t){const e=Array.isArray(t)?t[n]||xs:t;o=Ml(e,o)}r.push(o)}return r}(t,r,i),l=a.length,c=n=>{if(s&&n<e[0])return t[0];let r=0;if(l>1)for(;r<e.length-2&&!(n<e[r+1]);r++);const i=Jo(e[r],e[r+1],n);return a[r](i)};return n?t=>c(ia(e[0],e[o-1],t)):c}(s,t,{ease:Array.isArray(i)?i:nc(t,i)});return{calculatedDuration:e,next:t=>(o.value=a(t),o.done=t>=e,o)}}const ic=e=>{const t=({timestamp:t})=>e(t);return{start:()=>As.update(t,!0),stop:()=>Ts(t),now:()=>Cs.isProcessing?Cs.timestamp:Ms.now()}},oc={decay:Yl,inertia:Yl,tween:rc,keyframes:rc,spring:Xl},sc=e=>e/100;class ac extends jl{constructor(e){super(e),this.holdTime=null,this.cancelTime=null,this.currentTime=0,this.playbackSpeed=1,this.pendingPlayState="running",this.startTime=null,this.state="idle",this.stop=()=>{if(this.resolver.cancel(),this.isStopped=!0,"idle"===this.state)return;this.teardown();const{onStop:e}=this.options;e&&e()};const{name:t,motionValue:n,element:r,keyframes:i}=this.options,o=(null==r?void 0:r.KeyframeResolver)||rl;this.resolver=new o(i,(e,t)=>this.onKeyframesResolved(e,t),t,n,r),this.resolver.scheduleResolve()}flatten(){super.flatten(),this._resolved&&Object.assign(this._resolved,this.initPlayback(this._resolved.keyframes))}initPlayback(e){const{type:t="keyframes",repeat:n=0,repeatDelay:r=0,repeatType:i,velocity:o=0}=this.options,s=qo(t)?t:oc[t]||rc;let a,l;s!==rc&&"number"!=typeof e[0]&&(a=Ml(sc,Vl(e[0],e[1])),e=[0,100]);const c=s({...this.options,keyframes:e});"mirror"===i&&(l=s({...this.options,keyframes:[...e].reverse(),velocity:-o})),null===c.calculatedDuration&&(c.calculatedDuration=Go(c));const{calculatedDuration:u}=c,d=u+r;return{generator:c,mirroredGenerator:l,mapPercentToKeyframes:a,calculatedDuration:u,resolvedDuration:d,totalDuration:d*(n+1)-r}}onPostResolved(){const{autoplay:e=!0}=this.options;this.play(),"paused"!==this.pendingPlayState&&e?this.state=this.pendingPlayState:this.pause()}tick(e,t=!1){const{resolved:n}=this;if(!n){const{keyframes:e}=this.options;return{done:!0,value:e[e.length-1]}}const{finalKeyframe:r,generator:i,mirroredGenerator:o,mapPercentToKeyframes:s,keyframes:a,calculatedDuration:l,totalDuration:c,resolvedDuration:u}=n;if(null===this.startTime)return i.next(0);const{delay:d,repeat:p,repeatType:h,repeatDelay:f,onUpdate:m}=this.options;this.speed>0?this.startTime=Math.min(this.startTime,e):this.speed<0&&(this.startTime=Math.min(e-c/this.speed,this.startTime)),t?this.currentTime=e:null!==this.holdTime?this.currentTime=this.holdTime:this.currentTime=Math.round(e-this.startTime)*this.speed;const g=this.currentTime-d*(this.speed>=0?1:-1),v=this.speed>=0?g<0:g>c;this.currentTime=Math.max(g,0),"finished"===this.state&&null===this.holdTime&&(this.currentTime=c);let x=this.currentTime,y=i;if(p){const e=Math.min(this.currentTime,c)/u;let t=Math.floor(e),n=e%1;!n&&e>=1&&(n=1),1===n&&t--,t=Math.min(t,p+1),Boolean(t%2)&&("reverse"===h?(n=1-n,f&&(n-=f/u)):"mirror"===h&&(y=o)),x=ia(0,1,n)*u}const b=v?{done:!1,value:a[0]}:y.next(x);s&&(b.value=s(b.value));let{done:w}=b;v||null===l||(w=this.speed>=0?this.currentTime>=c:this.currentTime<=0);const j=null===this.holdTime&&("finished"===this.state||"running"===this.state&&w);return j&&void 0!==r&&(b.value=wl(a,this.options,r)),m&&m(b.value),j&&this.finish(),b}get duration(){const{resolved:e}=this;return e?vs(e.calculatedDuration):0}get time(){return vs(this.currentTime)}set time(e){e=gs(e),this.currentTime=e,null!==this.holdTime||0===this.speed?this.holdTime=e:this.driver&&(this.startTime=this.driver.now()-e/this.speed)}get speed(){return this.playbackSpeed}set speed(e){const t=this.playbackSpeed!==e;this.playbackSpeed=e,t&&(this.time=vs(this.currentTime))}play(){if(this.resolver.isScheduled||this.resolver.resume(),!this._resolved)return void(this.pendingPlayState="running");if(this.isStopped)return;const{driver:e=ic,onPlay:t,startTime:n}=this.options;this.driver||(this.driver=e(e=>this.tick(e))),t&&t();const r=this.driver.now();null!==this.holdTime?this.startTime=r-this.holdTime:this.startTime?"finished"===this.state&&(this.startTime=r):this.startTime=null!=n?n:this.calcStartTime(),"finished"===this.state&&this.updateFinishedPromise(),this.cancelTime=this.startTime,this.holdTime=null,this.state="running",this.driver.start()}pause(){var e;this._resolved?(this.state="paused",this.holdTime=null!==(e=this.currentTime)&&void 0!==e?e:0):this.pendingPlayState="paused"}complete(){"running"!==this.state&&this.play(),this.pendingPlayState=this.state="finished",this.holdTime=null}finish(){this.teardown(),this.state="finished";const{onComplete:e}=this.options;e&&e()}cancel(){null!==this.cancelTime&&this.tick(this.cancelTime),this.teardown(),this.updateFinishedPromise()}teardown(){this.state="idle",this.stopDriver(),this.resolveFinishedPromise(),this.updateFinishedPromise(),this.startTime=this.cancelTime=null,this.resolver.cancel()}stopDriver(){this.driver&&(this.driver.stop(),this.driver=void 0)}sample(e){return this.startTime=0,this.tick(e,!0)}}const lc=new Set(["opacity","clipPath","filter","transform"]),cc=Fo(()=>Object.hasOwnProperty.call(Element.prototype,"animate")),uc={anticipate:Qs,backInOut:Zs,circInOut:ta};class dc extends jl{constructor(e){super(e);const{name:t,motionValue:n,element:r,keyframes:i}=this.options;this.resolver=new vl(i,(e,t)=>this.onKeyframesResolved(e,t),t,n,r),this.resolver.scheduleResolve()}initPlayback(e,t){let{duration:n=300,times:r,ease:i,type:o,motionValue:s,name:a,startTime:l}=this.options;if(!s.owner||!s.owner.current)return!1;var c;if("string"==typeof i&&Qo()&&i in uc&&(i=uc[i]),qo((c=this.options).type)||"spring"===c.type||!ts(c.ease)){const{onComplete:t,onUpdate:s,motionValue:a,element:l,...c}=this.options,u=function(e,t){const n=new ac({...t,keyframes:e,repeat:0,delay:0,isGenerator:!0});let r={done:!1,value:e[0]};const i=[];let o=0;for(;!r.done&&o<2e4;)r=n.sample(o),i.push(r.value),o+=10;return{times:void 0,keyframes:i,duration:o-10,ease:"linear"}}(e,c);1===(e=u.keyframes).length&&(e[1]=e[0]),n=u.duration,r=u.times,i=u.ease,o="keyframes"}const u=function(e,t,n,{delay:r=0,duration:i=300,repeat:o=0,repeatType:s="loop",ease:a="easeInOut",times:l}={}){const c={[t]:n};l&&(c.offset=l);const u=is(a,i);return Array.isArray(u)&&(c.easing=u),e.animate(c,{delay:r,duration:i,easing:Array.isArray(u)?"linear":u,fill:"both",iterations:o+1,direction:"reverse"===s?"alternate":"normal"})}(s.owner.current,a,e,{...this.options,duration:n,times:r,ease:i});return u.startTime=null!=l?l:this.calcStartTime(),this.pendingTimeline?(Ko(u,this.pendingTimeline),this.pendingTimeline=void 0):u.onfinish=()=>{const{onComplete:n}=this.options;s.set(wl(e,this.options,t)),n&&n(),this.cancel(),this.resolveFinishedPromise()},{animation:u,duration:n,times:r,type:o,ease:i,keyframes:e}}get duration(){const{resolved:e}=this;if(!e)return 0;const{duration:t}=e;return vs(t)}get time(){const{resolved:e}=this;if(!e)return 0;const{animation:t}=e;return vs(t.currentTime||0)}set time(e){const{resolved:t}=this;if(!t)return;const{animation:n}=t;n.currentTime=gs(e)}get speed(){const{resolved:e}=this;if(!e)return 1;const{animation:t}=e;return t.playbackRate}set speed(e){const{resolved:t}=this;if(!t)return;const{animation:n}=t;n.playbackRate=e}get state(){const{resolved:e}=this;if(!e)return"idle";const{animation:t}=e;return t.playState}get startTime(){const{resolved:e}=this;if(!e)return null;const{animation:t}=e;return t.startTime}attachTimeline(e){if(this._resolved){const{resolved:t}=this;if(!t)return xs;const{animation:n}=t;Ko(n,e)}else this.pendingTimeline=e;return xs}play(){if(this.isStopped)return;const{resolved:e}=this;if(!e)return;const{animation:t}=e;"finished"===t.playState&&this.updateFinishedPromise(),t.play()}pause(){const{resolved:e}=this;if(!e)return;const{animation:t}=e;t.pause()}stop(){if(this.resolver.cancel(),this.isStopped=!0,"idle"===this.state)return;this.resolveFinishedPromise(),this.updateFinishedPromise();const{resolved:e}=this;if(!e)return;const{animation:t,keyframes:n,duration:r,type:i,ease:o,times:s}=e;if("idle"===t.playState||"finished"===t.playState)return;if(this.time){const{motionValue:e,onUpdate:t,onComplete:a,element:l,...c}=this.options,u=new ac({...c,keyframes:n,duration:r,type:i,ease:o,times:s,isGenerator:!0}),d=gs(this.time);e.setWithVelocity(u.sample(d-10).value,u.sample(d).value,10)}const{onStop:a}=this.options;a&&a(),this.cancel()}complete(){const{resolved:e}=this;e&&e.animation.finish()}cancel(){const{resolved:e}=this;e&&e.animation.cancel()}static supports(e){const{motionValue:t,name:n,repeatDelay:r,repeatType:i,damping:o,type:s}=e;if(!(t&&t.owner&&t.owner.current instanceof HTMLElement))return!1;const{onUpdate:a,transformTemplate:l}=t.owner.getProps();return cc()&&n&&lc.has(n)&&!a&&!l&&!r&&"mirror"!==i&&0!==o&&"inertia"!==s}}const pc={type:"spring",stiffness:500,damping:25,restSpeed:10},hc={type:"keyframes",duration:.8},fc={type:"keyframes",ease:[.25,.1,.35,1],duration:.3},mc=(e,{keyframes:t})=>t.length>2?hc:bs.has(e)?e.startsWith("scale")?{type:"spring",stiffness:550,damping:0===t[1]?2*Math.sqrt(550):30,restSpeed:10}:pc:fc,gc=(e,t,n,r={},i,o)=>s=>{const a=Ho(r,e)||{},l=a.delay||r.delay||0;let{elapsed:c=0}=r;c-=gs(l);let u={keyframes:Array.isArray(n)?n:[null,n],ease:"easeOut",velocity:t.getVelocity(),...a,delay:-c,onUpdate:e=>{t.set(e),a.onUpdate&&a.onUpdate(e)},onComplete:()=>{s(),a.onComplete&&a.onComplete()},name:e,motionValue:t,element:o?void 0:i};(function({when:e,delay:t,delayChildren:n,staggerChildren:r,staggerDirection:i,repeat:o,repeatType:s,repeatDelay:a,from:l,elapsed:c,...u}){return!!Object.keys(u).length})(a)||(u={...u,...mc(e,u)}),u.duration&&(u.duration=gs(u.duration)),u.repeatDelay&&(u.repeatDelay=gs(u.repeatDelay)),void 0!==u.from&&(u.keyframes[0]=u.from);let d=!1;if((!1===u.type||0===u.duration&&!u.repeatDelay)&&(u.duration=0,0===u.delay&&(d=!0)),d&&!o&&void 0!==t.get()){const e=wl(u.keyframes,a);if(void 0!==e)return As.update(()=>{u.onUpdate(e),u.onComplete()}),new $o([])}return!o&&dc.supports(u)?new dc(u):new ac(u)};function vc({protectedKeys:e,needsAnimating:t},n){const r=e.hasOwnProperty(n)&&!0!==t[n];return t[n]=!1,r}function xc(e,t,{delay:n=0,transitionOverride:r,type:i}={}){var o;let{transition:s=e.getDefaultTransition(),transitionEnd:a,...l}=t;r&&(s=r);const c=[],u=i&&e.animationState&&e.animationState.getState()[i];for(const t in l){const r=e.getValue(t,null!==(o=e.latestValues[t])&&void 0!==o?o:null),i=l[t];if(void 0===i||u&&vc(u,t))continue;const a={delay:n,...Ho(s||{},t)};let d=!1;if(window.MotionHandoffAnimation){const n=Hs(e);if(n){const e=window.MotionHandoffAnimation(n,t,As);null!==e&&(a.startTime=e,d=!0)}}Ns(e,t),r.start(gc(t,r,i,e.shouldReduceMotion&&ws.has(t)?{type:!1}:a,e,d));const p=r.animation;p&&c.push(p)}return a&&Promise.all(c).then(()=>{As.update(()=>{a&&function(e,t){const n=Oo(e,t);let{transitionEnd:r={},transition:i={},...o}=n||{};o={...o,...r};for(const t in o)Ds(e,t,js(o[t]))}(e,a)})}),c}function yc(e,t,n={}){var r;const i=Oo(e,t,"exit"===n.type?null===(r=e.presenceContext)||void 0===r?void 0:r.custom:void 0);let{transition:o=e.getDefaultTransition()||{}}=i||{};n.transitionOverride&&(o=n.transitionOverride);const s=i?()=>Promise.all(xc(e,i,n)):()=>Promise.resolve(),a=e.variantChildren&&e.variantChildren.size?(r=0)=>{const{delayChildren:i=0,staggerChildren:s,staggerDirection:a}=o;return function(e,t,n=0,r=0,i=1,o){const s=[],a=(e.variantChildren.size-1)*r,l=1===i?(e=0)=>e*r:(e=0)=>a-e*r;return Array.from(e.variantChildren).sort(bc).forEach((e,r)=>{e.notify("AnimationStart",t),s.push(yc(e,t,{...o,delay:n+l(r)}).then(()=>e.notify("AnimationComplete",t)))}),Promise.all(s)}(e,t,i+r,s,a,n)}:()=>Promise.resolve(),{when:l}=o;if(l){const[e,t]="beforeChildren"===l?[s,a]:[a,s];return e().then(()=>t())}return Promise.all([s(),a(n.delay)])}function bc(e,t){return e.sortNodePosition(t)}const wc=Do.length;function jc(e){if(!e)return;if(!e.isControllingVariants){const t=e.parent&&jc(e.parent)||{};return void 0!==e.props.initial&&(t.initial=e.props.initial),t}const t={};for(let n=0;n<wc;n++){const r=Do[n],i=e.props[r];(Io(i)||!1===i)&&(t[r]=i)}return t}const Sc=[...Vo].reverse(),kc=Vo.length;function Ac(e){let t=function(e){return t=>Promise.all(t.map(({animation:t,options:n})=>function(e,t,n={}){let r;if(e.notify("AnimationStart",t),Array.isArray(t)){const i=t.map(t=>yc(e,t,n));r=Promise.all(i)}else if("string"==typeof t)r=yc(e,t,n);else{const i="function"==typeof t?Oo(e,t,n.custom):t;r=Promise.all(xc(e,i,n))}return r.then(()=>{e.notify("AnimationComplete",t)})}(e,t,n)))}(e),n=Pc(),r=!0;const i=t=>(n,r)=>{var i;const o=Oo(e,r,"exit"===t?null===(i=e.presenceContext)||void 0===i?void 0:i.custom:void 0);if(o){const{transition:e,transitionEnd:t,...r}=o;n={...n,...r,...t}}return n};function o(o){const{props:s}=e,a=jc(e.parent)||{},l=[],c=new Set;let u={},d=1/0;for(let t=0;t<kc;t++){const p=Sc[t],h=n[p],f=void 0!==s[p]?s[p]:a[p],m=Io(f),g=p===o?h.isActive:null;!1===g&&(d=t);let v=f===a[p]&&f!==s[p]&&m;if(v&&r&&e.manuallyAnimateOnMount&&(v=!1),h.protectedKeys={...u},!h.isActive&&null===g||!f&&!h.prevProp||Mo(f)||"boolean"==typeof f)continue;const x=Tc(h.prevProp,f);let y=x||p===o&&h.isActive&&!v&&m||t>d&&m,b=!1;const w=Array.isArray(f)?f:[f];let j=w.reduce(i(p),{});!1===g&&(j={});const{prevResolvedValues:S={}}=h,k={...S,...j},A=t=>{y=!0,c.has(t)&&(b=!0,c.delete(t)),h.needsAnimating[t]=!0;const n=e.getValue(t);n&&(n.liveStyle=!1)};for(const e in k){const t=j[e],n=S[e];if(u.hasOwnProperty(e))continue;let r=!1;r=Ro(t)&&Ro(n)?!zo(t,n):t!==n,r?null!=t?A(e):c.add(e):void 0!==t&&c.has(e)?A(e):h.protectedKeys[e]=!0}h.prevProp=f,h.prevResolvedValues=j,h.isActive&&(u={...u,...j}),r&&e.blockInitialAnimation&&(y=!1),y&&(!v||!x||b)&&l.push(...w.map(e=>({animation:e,options:{type:p}})))}if(c.size){const t={};c.forEach(n=>{const r=e.getBaseTarget(n),i=e.getValue(n);i&&(i.liveStyle=!0),t[n]=null!=r?r:null}),l.push({animation:t})}let p=Boolean(l.length);return!r||!1!==s.initial&&s.initial!==s.animate||e.manuallyAnimateOnMount||(p=!1),r=!1,p?t(l):Promise.resolve()}return{animateChanges:o,setActive:function(t,r){var i;if(n[t].isActive===r)return Promise.resolve();null===(i=e.variantChildren)||void 0===i||i.forEach(e=>{var n;return null===(n=e.animationState)||void 0===n?void 0:n.setActive(t,r)}),n[t].isActive=r;const s=o(t);for(const e in n)n[e].protectedKeys={};return s},setAnimateFunction:function(n){t=n(e)},getState:()=>n,reset:()=>{n=Pc(),r=!0}}}function Tc(e,t){return"string"==typeof t?t!==e:!!Array.isArray(t)&&!zo(t,e)}function Cc(e=!1){return{isActive:e,protectedKeys:{},needsAnimating:{},prevResolvedValues:{}}}function Pc(){return{animate:Cc(!0),whileInView:Cc(),whileHover:Cc(),whileTap:Cc(),whileDrag:Cc(),whileFocus:Cc(),exit:Cc()}}class _c{constructor(e){this.isMounted=!1,this.node=e}update(){}}let Ec=0;const Mc={animation:{Feature:class extends _c{constructor(e){super(e),e.animationState||(e.animationState=Ac(e))}updateAnimationControlsSubscription(){const{animate:e}=this.node.getProps();Mo(e)&&(this.unmountControls=e.subscribe(this.node))}mount(){this.updateAnimationControlsSubscription()}update(){const{animate:e}=this.node.getProps(),{animate:t}=this.node.prevProps||{};e!==t&&this.updateAnimationControlsSubscription()}unmount(){var e;this.node.animationState.reset(),null===(e=this.unmountControls)||void 0===e||e.call(this)}}},exit:{Feature:class extends _c{constructor(){super(...arguments),this.id=Ec++}update(){if(!this.node.presenceContext)return;const{isPresent:e,onExitComplete:t}=this.node.presenceContext,{isPresent:n}=this.node.prevPresenceContext||{};if(!this.node.animationState||e===n)return;const r=this.node.animationState.setActive("exit",!e);t&&!e&&r.then(()=>t(this.id))}mount(){const{register:e}=this.node.presenceContext||{};e&&(this.unmount=e(this.id))}unmount(){}}}};function Rc(e,t,n,r={passive:!0}){return e.addEventListener(t,n,r),()=>e.removeEventListener(t,n)}function zc(e){return{point:{x:e.pageX,y:e.pageY}}}function Ic(e,t,n,r){return Rc(e,t,(e=>t=>us(t)&&e(t,zc(t)))(n),r)}const Lc=(e,t)=>Math.abs(e-t);class Bc{constructor(e,t,{transformPagePoint:n,contextWindow:r,dragSnapToOrigin:i=!1}={}){if(this.startEvent=null,this.lastMoveEvent=null,this.lastMoveEventInfo=null,this.handlers={},this.contextWindow=window,this.updatePoint=()=>{if(!this.lastMoveEvent||!this.lastMoveEventInfo)return;const e=Dc(this.lastMoveEventInfo,this.history),t=null!==this.startEvent,n=function(e,t){const n=Lc(e.x,t.x),r=Lc(e.y,t.y);return Math.sqrt(n**2+r**2)}(e.offset,{x:0,y:0})>=3;if(!t&&!n)return;const{point:r}=e,{timestamp:i}=Cs;this.history.push({...r,timestamp:i});const{onStart:o,onMove:s}=this.handlers;t||(o&&o(this.lastMoveEvent,e),this.startEvent=this.lastMoveEvent),s&&s(this.lastMoveEvent,e)},this.handlePointerMove=(e,t)=>{this.lastMoveEvent=e,this.lastMoveEventInfo=Oc(t,this.transformPagePoint),As.update(this.updatePoint,!0)},this.handlePointerUp=(e,t)=>{this.end();const{onEnd:n,onSessionEnd:r,resumeAnimation:i}=this.handlers;if(this.dragSnapToOrigin&&i&&i(),!this.lastMoveEvent||!this.lastMoveEventInfo)return;const o=Dc("pointercancel"===e.type?this.lastMoveEventInfo:Oc(t,this.transformPagePoint),this.history);this.startEvent&&n&&n(e,o),r&&r(e,o)},!us(e))return;this.dragSnapToOrigin=i,this.handlers=t,this.transformPagePoint=n,this.contextWindow=r||window;const o=Oc(zc(e),this.transformPagePoint),{point:s}=o,{timestamp:a}=Cs;this.history=[{...s,timestamp:a}];const{onSessionStart:l}=t;l&&l(e,Dc(o,this.history)),this.removeListeners=Ml(Ic(this.contextWindow,"pointermove",this.handlePointerMove),Ic(this.contextWindow,"pointerup",this.handlePointerUp),Ic(this.contextWindow,"pointercancel",this.handlePointerUp))}updateHandlers(e){this.handlers=e}end(){this.removeListeners&&this.removeListeners(),Ts(this.updatePoint)}}function Oc(e,t){return t?{point:t(e.point)}:e}function Vc(e,t){return{x:e.x-t.x,y:e.y-t.y}}function Dc({point:e},t){return{point:e,delta:Vc(e,Nc(t)),offset:Vc(e,Fc(t)),velocity:Uc(t,.1)}}function Fc(e){return e[0]}function Nc(e){return e[e.length-1]}function Uc(e,t){if(e.length<2)return{x:0,y:0};let n=e.length-1,r=null;const i=Nc(e);for(;n>=0&&(r=e[n],!(i.timestamp-r.timestamp>gs(t)));)n--;if(!r)return{x:0,y:0};const o=vs(i.timestamp-r.timestamp);if(0===o)return{x:0,y:0};const s={x:(i.x-r.x)/o,y:(i.y-r.y)/o};return s.x===1/0&&(s.x=0),s.y===1/0&&(s.y=0),s}function $c(e){return e&&"object"==typeof e&&Object.prototype.hasOwnProperty.call(e,"current")}function Hc(e){return e.max-e.min}function Wc(e,t,n,r=.5){e.origin=r,e.originPoint=Sl(t.min,t.max,e.origin),e.scale=Hc(n)/Hc(t),e.translate=Sl(n.min,n.max,e.origin)-e.originPoint,(e.scale>=.9999&&e.scale<=1.0001||isNaN(e.scale))&&(e.scale=1),(e.translate>=-.01&&e.translate<=.01||isNaN(e.translate))&&(e.translate=0)}function Gc(e,t,n,r){Wc(e.x,t.x,n.x,r?r.originX:void 0),Wc(e.y,t.y,n.y,r?r.originY:void 0)}function qc(e,t,n){e.min=n.min+t.min,e.max=e.min+Hc(t)}function Kc(e,t,n){e.min=t.min-n.min,e.max=e.min+Hc(t)}function Xc(e,t,n){Kc(e.x,t.x,n.x),Kc(e.y,t.y,n.y)}function Yc(e,t,n){return{min:void 0!==t?e.min+t:void 0,max:void 0!==n?e.max+n-(e.max-e.min):void 0}}function Zc(e,t){let n=t.min-e.min,r=t.max-e.max;return t.max-t.min<e.max-e.min&&([n,r]=[r,n]),{min:n,max:r}}const Qc=.35;function Jc(e,t,n){return{min:eu(e,t),max:eu(e,n)}}function eu(e,t){return"number"==typeof e?e:e[t]||0}const tu=()=>({x:{min:0,max:0},y:{min:0,max:0}});function nu(e){return[e("x"),e("y")]}function ru({top:e,left:t,right:n,bottom:r}){return{x:{min:t,max:n},y:{min:e,max:r}}}function iu(e){return void 0===e||1===e}function ou({scale:e,scaleX:t,scaleY:n}){return!iu(e)||!iu(t)||!iu(n)}function su(e){return ou(e)||au(e)||e.z||e.rotate||e.rotateX||e.rotateY||e.skewX||e.skewY}function au(e){return lu(e.x)||lu(e.y)}function lu(e){return e&&"0%"!==e}function cu(e,t,n){return n+t*(e-n)}function uu(e,t,n,r,i){return void 0!==i&&(e=cu(e,i,r)),cu(e,n,r)+t}function du(e,t=0,n=1,r,i){e.min=uu(e.min,t,n,r,i),e.max=uu(e.max,t,n,r,i)}function pu(e,{x:t,y:n}){du(e.x,t.translate,t.scale,t.originPoint),du(e.y,n.translate,n.scale,n.originPoint)}const hu=.999999999999,fu=1.0000000000001;function mu(e,t){e.min=e.min+t,e.max=e.max+t}function gu(e,t,n,r,i=.5){du(e,t,n,Sl(e.min,e.max,i),r)}function vu(e,t){gu(e.x,t.x,t.scaleX,t.scale,t.originX),gu(e.y,t.y,t.scaleY,t.scale,t.originY)}function xu(e,t){return ru(function(e,t){if(!t)return e;const n=t({x:e.left,y:e.top}),r=t({x:e.right,y:e.bottom});return{top:n.y,left:n.x,bottom:r.y,right:r.x}}(e.getBoundingClientRect(),t))}const yu=({current:e})=>e?e.ownerDocument.defaultView:null,bu=new WeakMap;class wu{constructor(e){this.openDragLock=null,this.isDragging=!1,this.currentDirection=null,this.originPoint={x:0,y:0},this.constraints=!1,this.hasMutatedConstraints=!1,this.elastic={x:{min:0,max:0},y:{min:0,max:0}},this.visualElement=e}start(e,{snapToCursor:t=!1}={}){const{presenceContext:n}=this.visualElement;if(n&&!1===n.isPresent)return;const{dragSnapToOrigin:r}=this.getProps();this.panSession=new Bc(e,{onSessionStart:e=>{const{dragSnapToOrigin:n}=this.getProps();n?this.pauseAnimation():this.stopAnimation(),t&&this.snapToCursor(zc(e).point)},onStart:(e,t)=>{const{drag:n,dragPropagation:r,onDragStart:i}=this.getProps();if(n&&!r&&(this.openDragLock&&this.openDragLock(),this.openDragLock="x"===(o=n)||"y"===o?os[o]?null:(os[o]=!0,()=>{os[o]=!1}):os.x||os.y?null:(os.x=os.y=!0,()=>{os.x=os.y=!1}),!this.openDragLock))return;var o;this.isDragging=!0,this.currentDirection=null,this.resolveConstraints(),this.visualElement.projection&&(this.visualElement.projection.isAnimationBlocked=!0,this.visualElement.projection.target=void 0),nu(e=>{let t=this.getAxisMotionValue(e).get()||0;if(xa.test(t)){const{projection:n}=this.visualElement;if(n&&n.layout){const r=n.layout.layoutBox[e];r&&(t=Hc(r)*(parseFloat(t)/100))}}this.originPoint[e]=t}),i&&As.postRender(()=>i(e,t)),Ns(this.visualElement,"transform");const{animationState:s}=this.visualElement;s&&s.setActive("whileDrag",!0)},onMove:(e,t)=>{const{dragPropagation:n,dragDirectionLock:r,onDirectionLock:i,onDrag:o}=this.getProps();if(!n&&!this.openDragLock)return;const{offset:s}=t;if(r&&null===this.currentDirection)return this.currentDirection=function(e,t=10){let n=null;return Math.abs(e.y)>t?n="y":Math.abs(e.x)>t&&(n="x"),n}(s),void(null!==this.currentDirection&&i&&i(this.currentDirection));this.updateAxis("x",t.point,s),this.updateAxis("y",t.point,s),this.visualElement.render(),o&&o(e,t)},onSessionEnd:(e,t)=>this.stop(e,t),resumeAnimation:()=>nu(e=>{var t;return"paused"===this.getAnimationState(e)&&(null===(t=this.getAxisMotionValue(e).animation)||void 0===t?void 0:t.play())})},{transformPagePoint:this.visualElement.getTransformPagePoint(),dragSnapToOrigin:r,contextWindow:yu(this.visualElement)})}stop(e,t){const n=this.isDragging;if(this.cancel(),!n)return;const{velocity:r}=t;this.startAnimation(r);const{onDragEnd:i}=this.getProps();i&&As.postRender(()=>i(e,t))}cancel(){this.isDragging=!1;const{projection:e,animationState:t}=this.visualElement;e&&(e.isAnimationBlocked=!1),this.panSession&&this.panSession.end(),this.panSession=void 0;const{dragPropagation:n}=this.getProps();!n&&this.openDragLock&&(this.openDragLock(),this.openDragLock=null),t&&t.setActive("whileDrag",!1)}updateAxis(e,t,n){const{drag:r}=this.getProps();if(!n||!ju(e,r,this.currentDirection))return;const i=this.getAxisMotionValue(e);let o=this.originPoint[e]+n[e];this.constraints&&this.constraints[e]&&(o=function(e,{min:t,max:n},r){return void 0!==t&&e<t?e=r?Sl(t,e,r.min):Math.max(e,t):void 0!==n&&e>n&&(e=r?Sl(n,e,r.max):Math.min(e,n)),e}(o,this.constraints[e],this.elastic[e])),i.set(o)}resolveConstraints(){var e;const{dragConstraints:t,dragElastic:n}=this.getProps(),r=this.visualElement.projection&&!this.visualElement.projection.layout?this.visualElement.projection.measure(!1):null===(e=this.visualElement.projection)||void 0===e?void 0:e.layout,i=this.constraints;t&&$c(t)?this.constraints||(this.constraints=this.resolveRefConstraints()):this.constraints=!(!t||!r)&&function(e,{top:t,left:n,bottom:r,right:i}){return{x:Yc(e.x,n,i),y:Yc(e.y,t,r)}}(r.layoutBox,t),this.elastic=function(e=Qc){return!1===e?e=0:!0===e&&(e=Qc),{x:Jc(e,"left","right"),y:Jc(e,"top","bottom")}}(n),i!==this.constraints&&r&&this.constraints&&!this.hasMutatedConstraints&&nu(e=>{!1!==this.constraints&&this.getAxisMotionValue(e)&&(this.constraints[e]=function(e,t){const n={};return void 0!==t.min&&(n.min=t.min-e.min),void 0!==t.max&&(n.max=t.max-e.min),n}(r.layoutBox[e],this.constraints[e]))})}resolveRefConstraints(){const{dragConstraints:e,onMeasureDragConstraints:t}=this.getProps();if(!e||!$c(e))return!1;const n=e.current;ol(null!==n,"If `dragConstraints` is set as a React ref, that ref must be passed to another component's `ref` prop.");const{projection:r}=this.visualElement;if(!r||!r.layout)return!1;const i=function(e,t,n){const r=xu(e,n),{scroll:i}=t;return i&&(mu(r.x,i.offset.x),mu(r.y,i.offset.y)),r}(n,r.root,this.visualElement.getTransformPagePoint());let o=function(e,t){return{x:Zc(e.x,t.x),y:Zc(e.y,t.y)}}(r.layout.layoutBox,i);if(t){const e=t(function({x:e,y:t}){return{top:t.min,right:e.max,bottom:t.max,left:e.min}}(o));this.hasMutatedConstraints=!!e,e&&(o=ru(e))}return o}startAnimation(e){const{drag:t,dragMomentum:n,dragElastic:r,dragTransition:i,dragSnapToOrigin:o,onDragTransitionEnd:s}=this.getProps(),a=this.constraints||{},l=nu(s=>{if(!ju(s,t,this.currentDirection))return;let l=a&&a[s]||{};o&&(l={min:0,max:0});const c=r?200:1e6,u=r?40:1e7,d={type:"inertia",velocity:n?e[s]:0,bounceStiffness:c,bounceDamping:u,timeConstant:750,restDelta:1,restSpeed:10,...i,...l};return this.startAxisValueAnimation(s,d)});return Promise.all(l).then(s)}startAxisValueAnimation(e,t){const n=this.getAxisMotionValue(e);return Ns(this.visualElement,e),n.start(gc(e,n,0,t,this.visualElement,!1))}stopAnimation(){nu(e=>this.getAxisMotionValue(e).stop())}pauseAnimation(){nu(e=>{var t;return null===(t=this.getAxisMotionValue(e).animation)||void 0===t?void 0:t.pause()})}getAnimationState(e){var t;return null===(t=this.getAxisMotionValue(e).animation)||void 0===t?void 0:t.state}getAxisMotionValue(e){const t=`_drag${e.toUpperCase()}`,n=this.visualElement.getProps();return n[t]||this.visualElement.getValue(e,(n.initial?n.initial[e]:void 0)||0)}snapToCursor(e){nu(t=>{const{drag:n}=this.getProps();if(!ju(t,n,this.currentDirection))return;const{projection:r}=this.visualElement,i=this.getAxisMotionValue(t);if(r&&r.layout){const{min:n,max:o}=r.layout.layoutBox[t];i.set(e[t]-Sl(n,o,.5))}})}scalePositionWithinConstraints(){if(!this.visualElement.current)return;const{drag:e,dragConstraints:t}=this.getProps(),{projection:n}=this.visualElement;if(!$c(t)||!n||!this.constraints)return;this.stopAnimation();const r={x:0,y:0};nu(e=>{const t=this.getAxisMotionValue(e);if(t&&!1!==this.constraints){const n=t.get();r[e]=function(e,t){let n=.5;const r=Hc(e),i=Hc(t);return i>r?n=Jo(t.min,t.max-r,e.min):r>i&&(n=Jo(e.min,e.max-i,t.min)),ia(0,1,n)}({min:n,max:n},this.constraints[e])}});const{transformTemplate:i}=this.visualElement.getProps();this.visualElement.current.style.transform=i?i({},""):"none",n.root&&n.root.updateScroll(),n.updateLayout(),this.resolveConstraints(),nu(t=>{if(!ju(t,e,null))return;const n=this.getAxisMotionValue(t),{min:i,max:o}=this.constraints[t];n.set(Sl(i,o,r[t]))})}addListeners(){if(!this.visualElement.current)return;bu.set(this.visualElement,this);const e=Ic(this.visualElement.current,"pointerdown",e=>{const{drag:t,dragListener:n=!0}=this.getProps();t&&n&&this.start(e)}),t=()=>{const{dragConstraints:e}=this.getProps();$c(e)&&e.current&&(this.constraints=this.resolveRefConstraints())},{projection:n}=this.visualElement,r=n.addEventListener("measure",t);n&&!n.layout&&(n.root&&n.root.updateScroll(),n.updateLayout()),As.read(t);const i=Rc(window,"resize",()=>this.scalePositionWithinConstraints()),o=n.addEventListener("didUpdate",({delta:e,hasLayoutChanged:t})=>{this.isDragging&&t&&(nu(t=>{const n=this.getAxisMotionValue(t);n&&(this.originPoint[t]+=e[t].translate,n.set(n.get()+e[t].translate))}),this.visualElement.render())});return()=>{i(),e(),r(),o&&o()}}getProps(){const e=this.visualElement.getProps(),{drag:t=!1,dragDirectionLock:n=!1,dragPropagation:r=!1,dragConstraints:i=!1,dragElastic:o=Qc,dragMomentum:s=!0}=e;return{...e,drag:t,dragDirectionLock:n,dragPropagation:r,dragConstraints:i,dragElastic:o,dragMomentum:s}}}function ju(e,t,n){return!(!0!==t&&t!==e||null!==n&&n!==e)}const Su=e=>(t,n)=>{e&&As.postRender(()=>e(t,n))},ku=(0,g.createContext)(null),Au=(0,g.createContext)({}),Tu=(0,g.createContext)({}),Cu={hasAnimatedSinceResize:!0,hasEverUpdated:!1};function Pu(e,t){return t.max===t.min?0:e/(t.max-t.min)*100}const _u={correct:(e,t)=>{if(!t.target)return e;if("string"==typeof e){if(!ya.test(e))return e;e=parseFloat(e)}return`${Pu(e,t.target.x)}% ${Pu(e,t.target.y)}%`}},Eu={correct:(e,{treeScale:t,projectionDelta:n})=>{const r=e,i=za.parse(e);if(i.length>5)return r;const o=za.createTransformer(e),s="number"!=typeof i[0]?1:0,a=n.x.scale*t.x,l=n.y.scale*t.y;i[0+s]/=a,i[1+s]/=l;const c=Sl(a,l,.5);return"number"==typeof i[2+s]&&(i[2+s]/=c),"number"==typeof i[3+s]&&(i[3+s]/=c),o(i)}},Mu={},{schedule:Ru,cancel:zu}=ks(queueMicrotask,!1);class Iu extends g.Component{componentDidMount(){const{visualElement:e,layoutGroup:t,switchLayoutGroup:n,layoutId:r}=this.props,{projection:i}=e;var o;o=Bu,Object.assign(Mu,o),i&&(t.group&&t.group.add(i),n&&n.register&&r&&n.register(i),i.root.didUpdate(),i.addEventListener("animationComplete",()=>{this.safeToRemove()}),i.setOptions({...i.options,onExitComplete:()=>this.safeToRemove()})),Cu.hasEverUpdated=!0}getSnapshotBeforeUpdate(e){const{layoutDependency:t,visualElement:n,drag:r,isPresent:i}=this.props,o=n.projection;return o?(o.isPresent=i,r||e.layoutDependency!==t||void 0===t?o.willUpdate():this.safeToRemove(),e.isPresent!==i&&(i?o.promote():o.relegate()||As.postRender(()=>{const e=o.getStack();e&&e.members.length||this.safeToRemove()})),null):null}componentDidUpdate(){const{projection:e}=this.props.visualElement;e&&(e.root.didUpdate(),Ru.postRender(()=>{!e.currentAnimation&&e.isLead()&&this.safeToRemove()}))}componentWillUnmount(){const{visualElement:e,layoutGroup:t,switchLayoutGroup:n}=this.props,{projection:r}=e;r&&(r.scheduleCheckAfterUnmount(),t&&t.group&&t.group.remove(r),n&&n.deregister&&n.deregister(r))}safeToRemove(){const{safeToRemove:e}=this.props;e&&e()}render(){return null}}function Lu(e){const[t,n]=function(e=!0){const t=(0,g.useContext)(ku);if(null===t)return[!0,null];const{isPresent:n,onExitComplete:r,register:i}=t,o=(0,g.useId)();(0,g.useEffect)(()=>{e&&i(o)},[e]);const s=(0,g.useCallback)(()=>e&&r&&r(o),[o,r,e]);return!n&&r?[!1,s]:[!0]}(),r=(0,g.useContext)(Au);return(0,u.jsx)(Iu,{...e,layoutGroup:r,switchLayoutGroup:(0,g.useContext)(Tu),isPresent:t,safeToRemove:n})}const Bu={borderRadius:{..._u,applyTo:["borderTopLeftRadius","borderTopRightRadius","borderBottomLeftRadius","borderBottomRightRadius"]},borderTopLeftRadius:_u,borderTopRightRadius:_u,borderBottomLeftRadius:_u,borderBottomRightRadius:_u,boxShadow:Eu},Ou=(e,t)=>e.depth-t.depth;class Vu{constructor(){this.children=[],this.isDirty=!1}add(e){Rs(this.children,e),this.isDirty=!0}remove(e){zs(this.children,e),this.isDirty=!0}forEach(e){this.isDirty&&this.children.sort(Ou),this.isDirty=!1,this.children.forEach(e)}}function Du(e){const t=Fs(e)?e.get():e;return n=t,Boolean(n&&"object"==typeof n&&n.mix&&n.toValue)?t.toValue():t;var n}const Fu=["TopLeft","TopRight","BottomLeft","BottomRight"],Nu=Fu.length,Uu=e=>"string"==typeof e?parseFloat(e):e,$u=e=>"number"==typeof e||ya.test(e);function Hu(e,t){return void 0!==e[t]?e[t]:e.borderRadius}const Wu=qu(0,.5,ea),Gu=qu(.5,.95,xs);function qu(e,t,n){return r=>r<e?0:r>t?1:n(Jo(e,t,r))}function Ku(e,t){e.min=t.min,e.max=t.max}function Xu(e,t){Ku(e.x,t.x),Ku(e.y,t.y)}function Yu(e,t){e.translate=t.translate,e.scale=t.scale,e.originPoint=t.originPoint,e.origin=t.origin}function Zu(e,t,n,r,i){return e=cu(e-=t,1/n,r),void 0!==i&&(e=cu(e,1/i,r)),e}function Qu(e,t,[n,r,i],o,s){!function(e,t=0,n=1,r=.5,i,o=e,s=e){if(xa.test(t)&&(t=parseFloat(t),t=Sl(s.min,s.max,t/100)-s.min),"number"!=typeof t)return;let a=Sl(o.min,o.max,r);e===o&&(a-=t),e.min=Zu(e.min,t,n,a,i),e.max=Zu(e.max,t,n,a,i)}(e,t[n],t[r],t[i],t.scale,o,s)}const Ju=["x","scaleX","originX"],ed=["y","scaleY","originY"];function td(e,t,n,r){Qu(e.x,t,Ju,n?n.x:void 0,r?r.x:void 0),Qu(e.y,t,ed,n?n.y:void 0,r?r.y:void 0)}function nd(e){return 0===e.translate&&1===e.scale}function rd(e){return nd(e.x)&&nd(e.y)}function id(e,t){return e.min===t.min&&e.max===t.max}function od(e,t){return Math.round(e.min)===Math.round(t.min)&&Math.round(e.max)===Math.round(t.max)}function sd(e,t){return od(e.x,t.x)&&od(e.y,t.y)}function ad(e){return Hc(e.x)/Hc(e.y)}function ld(e,t){return e.translate===t.translate&&e.scale===t.scale&&e.originPoint===t.originPoint}class cd{constructor(){this.members=[]}add(e){Rs(this.members,e),e.scheduleRender()}remove(e){if(zs(this.members,e),e===this.prevLead&&(this.prevLead=void 0),e===this.lead){const e=this.members[this.members.length-1];e&&this.promote(e)}}relegate(e){const t=this.members.findIndex(t=>e===t);if(0===t)return!1;let n;for(let e=t;e>=0;e--){const t=this.members[e];if(!1!==t.isPresent){n=t;break}}return!!n&&(this.promote(n),!0)}promote(e,t){const n=this.lead;if(e!==n&&(this.prevLead=n,this.lead=e,e.show(),n)){n.instance&&n.scheduleRender(),e.scheduleRender(),e.resumeFrom=n,t&&(e.resumeFrom.preserveOpacity=!0),n.snapshot&&(e.snapshot=n.snapshot,e.snapshot.latestValues=n.animationValues||n.latestValues),e.root&&e.root.isUpdating&&(e.isLayoutDirty=!0);const{crossfade:r}=e.options;!1===r&&n.hide()}}exitAnimationComplete(){this.members.forEach(e=>{const{options:t,resumingFrom:n}=e;t.onExitComplete&&t.onExitComplete(),n&&n.options.onExitComplete&&n.options.onExitComplete()})}scheduleRender(){this.members.forEach(e=>{e.instance&&e.scheduleRender(!1)})}removeLeadSnapshot(){this.lead&&this.lead.snapshot&&(this.lead.snapshot=void 0)}}const ud={type:"projectionFrame",totalNodes:0,resolvedTargetDeltas:0,recalculatedProjection:0},dd="undefined"!=typeof window&&void 0!==window.MotionDebug,pd=["","X","Y","Z"],hd={visibility:"hidden"};let fd=0;function md(e,t,n,r){const{latestValues:i}=t;i[e]&&(n[e]=i[e],t.setStaticValue(e,0),r&&(r[e]=0))}function gd(e){if(e.hasCheckedOptimisedAppear=!0,e.root===e)return;const{visualElement:t}=e.options;if(!t)return;const n=Hs(t);if(window.MotionHasOptimisedAnimation(n,"transform")){const{layout:t,layoutId:r}=e.options;window.MotionCancelOptimisedAnimation(n,"transform",As,!(t||r))}const{parent:r}=e;r&&!r.hasCheckedOptimisedAppear&&gd(r)}function vd({attachResizeListener:e,defaultParent:t,measureScroll:n,checkIsScrollRoot:r,resetTransform:i}){return class{constructor(e={},n=(null==t?void 0:t())){this.id=fd++,this.animationId=0,this.children=new Set,this.options={},this.isTreeAnimating=!1,this.isAnimationBlocked=!1,this.isLayoutDirty=!1,this.isProjectionDirty=!1,this.isSharedProjectionDirty=!1,this.isTransformDirty=!1,this.updateManuallyBlocked=!1,this.updateBlockedByResize=!1,this.isUpdating=!1,this.isSVG=!1,this.needsReset=!1,this.shouldResetTransform=!1,this.hasCheckedOptimisedAppear=!1,this.treeScale={x:1,y:1},this.eventHandlers=new Map,this.hasTreeAnimated=!1,this.updateScheduled=!1,this.scheduleUpdate=()=>this.update(),this.projectionUpdateScheduled=!1,this.checkUpdateFailed=()=>{this.isUpdating&&(this.isUpdating=!1,this.clearAllSnapshots())},this.updateProjection=()=>{this.projectionUpdateScheduled=!1,dd&&(ud.totalNodes=ud.resolvedTargetDeltas=ud.recalculatedProjection=0),this.nodes.forEach(bd),this.nodes.forEach(Cd),this.nodes.forEach(Pd),this.nodes.forEach(wd),dd&&window.MotionDebug.record(ud)},this.resolvedRelativeTargetAt=0,this.hasProjected=!1,this.isVisible=!0,this.animationProgress=0,this.sharedNodes=new Map,this.latestValues=e,this.root=n?n.root||n:this,this.path=n?[...n.path,n]:[],this.parent=n,this.depth=n?n.depth+1:0;for(let e=0;e<this.path.length;e++)this.path[e].shouldResetTransform=!0;this.root===this&&(this.nodes=new Vu)}addEventListener(e,t){return this.eventHandlers.has(e)||this.eventHandlers.set(e,new Is),this.eventHandlers.get(e).add(t)}notifyListeners(e,...t){const n=this.eventHandlers.get(e);n&&n.notify(...t)}hasListeners(e){return this.eventHandlers.has(e)}mount(t,n=this.root.hasTreeAnimated){if(this.instance)return;var r;this.isSVG=(r=t)instanceof SVGElement&&"svg"!==r.tagName,this.instance=t;const{layoutId:i,layout:o,visualElement:s}=this.options;if(s&&!s.current&&s.mount(t),this.root.nodes.add(this),this.parent&&this.parent.children.add(this),n&&(o||i)&&(this.isLayoutDirty=!0),e){let n;const r=()=>this.root.updateBlockedByResize=!1;e(t,()=>{this.root.updateBlockedByResize=!0,n&&n(),n=function(e,t){const n=Ms.now(),r=({timestamp:i})=>{const o=i-n;o>=t&&(Ts(r),e(o-t))};return As.read(r,!0),()=>Ts(r)}(r,250),Cu.hasAnimatedSinceResize&&(Cu.hasAnimatedSinceResize=!1,this.nodes.forEach(Td))})}i&&this.root.registerSharedNode(i,this),!1!==this.options.animate&&s&&(i||o)&&this.addEventListener("didUpdate",({delta:e,hasLayoutChanged:t,hasRelativeTargetChanged:n,layout:r})=>{if(this.isTreeAnimationBlocked())return this.target=void 0,void(this.relativeTarget=void 0);const i=this.options.transition||s.getDefaultTransition()||Id,{onLayoutAnimationStart:o,onLayoutAnimationComplete:a}=s.getProps(),l=!this.targetLayout||!sd(this.targetLayout,r)||n,c=!t&&n;if(this.options.layoutRoot||this.resumeFrom&&this.resumeFrom.instance||c||t&&(l||!this.currentAnimation)){this.resumeFrom&&(this.resumingFrom=this.resumeFrom,this.resumingFrom.resumingFrom=void 0),this.setAnimationOrigin(e,c);const t={...Ho(i,"layout"),onPlay:o,onComplete:a};(s.shouldReduceMotion||this.options.layoutRoot)&&(t.delay=0,t.type=!1),this.startAnimation(t)}else t||Td(this),this.isLead()&&this.options.onExitComplete&&this.options.onExitComplete();this.targetLayout=r})}unmount(){this.options.layoutId&&this.willUpdate(),this.root.nodes.remove(this);const e=this.getStack();e&&e.remove(this),this.parent&&this.parent.children.delete(this),this.instance=void 0,Ts(this.updateProjection)}blockUpdate(){this.updateManuallyBlocked=!0}unblockUpdate(){this.updateManuallyBlocked=!1}isUpdateBlocked(){return this.updateManuallyBlocked||this.updateBlockedByResize}isTreeAnimationBlocked(){return this.isAnimationBlocked||this.parent&&this.parent.isTreeAnimationBlocked()||!1}startUpdate(){this.isUpdateBlocked()||(this.isUpdating=!0,this.nodes&&this.nodes.forEach(_d),this.animationId++)}getTransformTemplate(){const{visualElement:e}=this.options;return e&&e.getProps().transformTemplate}willUpdate(e=!0){if(this.root.hasTreeAnimated=!0,this.root.isUpdateBlocked())return void(this.options.onExitComplete&&this.options.onExitComplete());if(window.MotionCancelOptimisedAnimation&&!this.hasCheckedOptimisedAppear&&gd(this),!this.root.isUpdating&&this.root.startUpdate(),this.isLayoutDirty)return;this.isLayoutDirty=!0;for(let e=0;e<this.path.length;e++){const t=this.path[e];t.shouldResetTransform=!0,t.updateScroll("snapshot"),t.options.layoutRoot&&t.willUpdate(!1)}const{layoutId:t,layout:n}=this.options;if(void 0===t&&!n)return;const r=this.getTransformTemplate();this.prevTransformTemplateValue=r?r(this.latestValues,""):void 0,this.updateSnapshot(),e&&this.notifyListeners("willUpdate")}update(){if(this.updateScheduled=!1,this.isUpdateBlocked())return this.unblockUpdate(),this.clearAllSnapshots(),void this.nodes.forEach(Sd);this.isUpdating||this.nodes.forEach(kd),this.isUpdating=!1,this.nodes.forEach(Ad),this.nodes.forEach(xd),this.nodes.forEach(yd),this.clearAllSnapshots();const e=Ms.now();Cs.delta=ia(0,1e3/60,e-Cs.timestamp),Cs.timestamp=e,Cs.isProcessing=!0,Ps.update.process(Cs),Ps.preRender.process(Cs),Ps.render.process(Cs),Cs.isProcessing=!1}didUpdate(){this.updateScheduled||(this.updateScheduled=!0,Ru.read(this.scheduleUpdate))}clearAllSnapshots(){this.nodes.forEach(jd),this.sharedNodes.forEach(Ed)}scheduleUpdateProjection(){this.projectionUpdateScheduled||(this.projectionUpdateScheduled=!0,As.preRender(this.updateProjection,!1,!0))}scheduleCheckAfterUnmount(){As.postRender(()=>{this.isLayoutDirty?this.root.didUpdate():this.root.checkUpdateFailed()})}updateSnapshot(){!this.snapshot&&this.instance&&(this.snapshot=this.measure())}updateLayout(){if(!this.instance)return;if(this.updateScroll(),!(this.options.alwaysMeasureLayout&&this.isLead()||this.isLayoutDirty))return;if(this.resumeFrom&&!this.resumeFrom.instance)for(let e=0;e<this.path.length;e++)this.path[e].updateScroll();const e=this.layout;this.layout=this.measure(!1),this.layoutCorrected={x:{min:0,max:0},y:{min:0,max:0}},this.isLayoutDirty=!1,this.projectionDelta=void 0,this.notifyListeners("measure",this.layout.layoutBox);const{visualElement:t}=this.options;t&&t.notify("LayoutMeasure",this.layout.layoutBox,e?e.layoutBox:void 0)}updateScroll(e="measure"){let t=Boolean(this.options.layoutScroll&&this.instance);if(this.scroll&&this.scroll.animationId===this.root.animationId&&this.scroll.phase===e&&(t=!1),t){const t=r(this.instance);this.scroll={animationId:this.root.animationId,phase:e,isRoot:t,offset:n(this.instance),wasRoot:this.scroll?this.scroll.isRoot:t}}}resetTransform(){if(!i)return;const e=this.isLayoutDirty||this.shouldResetTransform||this.options.alwaysMeasureLayout,t=this.projectionDelta&&!rd(this.projectionDelta),n=this.getTransformTemplate(),r=n?n(this.latestValues,""):void 0,o=r!==this.prevTransformTemplateValue;e&&(t||su(this.latestValues)||o)&&(i(this.instance,r),this.shouldResetTransform=!1,this.scheduleRender())}measure(e=!0){const t=this.measurePageBox();let n=this.removeElementScroll(t);var r;return e&&(n=this.removeTransform(n)),Od((r=n).x),Od(r.y),{animationId:this.root.animationId,measuredBox:t,layoutBox:n,latestValues:{},source:this.id}}measurePageBox(){var e;const{visualElement:t}=this.options;if(!t)return{x:{min:0,max:0},y:{min:0,max:0}};const n=t.measureViewportBox();if(!(null===(e=this.scroll)||void 0===e?void 0:e.wasRoot)&&!this.path.some(Dd)){const{scroll:e}=this.root;e&&(mu(n.x,e.offset.x),mu(n.y,e.offset.y))}return n}removeElementScroll(e){var t;const n={x:{min:0,max:0},y:{min:0,max:0}};if(Xu(n,e),null===(t=this.scroll)||void 0===t?void 0:t.wasRoot)return n;for(let t=0;t<this.path.length;t++){const r=this.path[t],{scroll:i,options:o}=r;r!==this.root&&i&&o.layoutScroll&&(i.wasRoot&&Xu(n,e),mu(n.x,i.offset.x),mu(n.y,i.offset.y))}return n}applyTransform(e,t=!1){const n={x:{min:0,max:0},y:{min:0,max:0}};Xu(n,e);for(let e=0;e<this.path.length;e++){const r=this.path[e];!t&&r.options.layoutScroll&&r.scroll&&r!==r.root&&vu(n,{x:-r.scroll.offset.x,y:-r.scroll.offset.y}),su(r.latestValues)&&vu(n,r.latestValues)}return su(this.latestValues)&&vu(n,this.latestValues),n}removeTransform(e){const t={x:{min:0,max:0},y:{min:0,max:0}};Xu(t,e);for(let e=0;e<this.path.length;e++){const n=this.path[e];if(!n.instance)continue;if(!su(n.latestValues))continue;ou(n.latestValues)&&n.updateSnapshot();const r=tu();Xu(r,n.measurePageBox()),td(t,n.latestValues,n.snapshot?n.snapshot.layoutBox:void 0,r)}return su(this.latestValues)&&td(t,this.latestValues),t}setTargetDelta(e){this.targetDelta=e,this.root.scheduleUpdateProjection(),this.isProjectionDirty=!0}setOptions(e){this.options={...this.options,...e,crossfade:void 0===e.crossfade||e.crossfade}}clearMeasurements(){this.scroll=void 0,this.layout=void 0,this.snapshot=void 0,this.prevTransformTemplateValue=void 0,this.targetDelta=void 0,this.target=void 0,this.isLayoutDirty=!1}forceRelativeParentToResolveTarget(){this.relativeParent&&this.relativeParent.resolvedRelativeTargetAt!==Cs.timestamp&&this.relativeParent.resolveTargetDelta(!0)}resolveTargetDelta(e=!1){var t;const n=this.getLead();this.isProjectionDirty||(this.isProjectionDirty=n.isProjectionDirty),this.isTransformDirty||(this.isTransformDirty=n.isTransformDirty),this.isSharedProjectionDirty||(this.isSharedProjectionDirty=n.isSharedProjectionDirty);const r=Boolean(this.resumingFrom)||this!==n;if(!(e||r&&this.isSharedProjectionDirty||this.isProjectionDirty||(null===(t=this.parent)||void 0===t?void 0:t.isProjectionDirty)||this.attemptToResolveRelativeTarget||this.root.updateBlockedByResize))return;const{layout:i,layoutId:o}=this.options;if(this.layout&&(i||o)){if(this.resolvedRelativeTargetAt=Cs.timestamp,!this.targetDelta&&!this.relativeTarget){const e=this.getClosestProjectingParent();e&&e.layout&&1!==this.animationProgress?(this.relativeParent=e,this.forceRelativeParentToResolveTarget(),this.relativeTarget={x:{min:0,max:0},y:{min:0,max:0}},this.relativeTargetOrigin={x:{min:0,max:0},y:{min:0,max:0}},Xc(this.relativeTargetOrigin,this.layout.layoutBox,e.layout.layoutBox),Xu(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}if(this.relativeTarget||this.targetDelta){var s,a,l;if(this.target||(this.target={x:{min:0,max:0},y:{min:0,max:0}},this.targetWithTransforms={x:{min:0,max:0},y:{min:0,max:0}}),this.relativeTarget&&this.relativeTargetOrigin&&this.relativeParent&&this.relativeParent.target?(this.forceRelativeParentToResolveTarget(),s=this.target,a=this.relativeTarget,l=this.relativeParent.target,qc(s.x,a.x,l.x),qc(s.y,a.y,l.y)):this.targetDelta?(Boolean(this.resumingFrom)?this.target=this.applyTransform(this.layout.layoutBox):Xu(this.target,this.layout.layoutBox),pu(this.target,this.targetDelta)):Xu(this.target,this.layout.layoutBox),this.attemptToResolveRelativeTarget){this.attemptToResolveRelativeTarget=!1;const e=this.getClosestProjectingParent();e&&Boolean(e.resumingFrom)===Boolean(this.resumingFrom)&&!e.options.layoutScroll&&e.target&&1!==this.animationProgress?(this.relativeParent=e,this.forceRelativeParentToResolveTarget(),this.relativeTarget={x:{min:0,max:0},y:{min:0,max:0}},this.relativeTargetOrigin={x:{min:0,max:0},y:{min:0,max:0}},Xc(this.relativeTargetOrigin,this.target,e.target),Xu(this.relativeTarget,this.relativeTargetOrigin)):this.relativeParent=this.relativeTarget=void 0}dd&&ud.resolvedTargetDeltas++}}}getClosestProjectingParent(){if(this.parent&&!ou(this.parent.latestValues)&&!au(this.parent.latestValues))return this.parent.isProjecting()?this.parent:this.parent.getClosestProjectingParent()}isProjecting(){return Boolean((this.relativeTarget||this.targetDelta||this.options.layoutRoot)&&this.layout)}calcProjection(){var e;const t=this.getLead(),n=Boolean(this.resumingFrom)||this!==t;let r=!0;if((this.isProjectionDirty||(null===(e=this.parent)||void 0===e?void 0:e.isProjectionDirty))&&(r=!1),n&&(this.isSharedProjectionDirty||this.isTransformDirty)&&(r=!1),this.resolvedRelativeTargetAt===Cs.timestamp&&(r=!1),r)return;const{layout:i,layoutId:o}=this.options;if(this.isTreeAnimating=Boolean(this.parent&&this.parent.isTreeAnimating||this.currentAnimation||this.pendingAnimation),this.isTreeAnimating||(this.targetDelta=this.relativeTarget=void 0),!this.layout||!i&&!o)return;Xu(this.layoutCorrected,this.layout.layoutBox);const s=this.treeScale.x,a=this.treeScale.y;!function(e,t,n,r=!1){const i=n.length;if(!i)return;let o,s;t.x=t.y=1;for(let a=0;a<i;a++){o=n[a],s=o.projectionDelta;const{visualElement:i}=o.options;i&&i.props.style&&"contents"===i.props.style.display||(r&&o.options.layoutScroll&&o.scroll&&o!==o.root&&vu(e,{x:-o.scroll.offset.x,y:-o.scroll.offset.y}),s&&(t.x*=s.x.scale,t.y*=s.y.scale,pu(e,s)),r&&su(o.latestValues)&&vu(e,o.latestValues))}t.x<fu&&t.x>hu&&(t.x=1),t.y<fu&&t.y>hu&&(t.y=1)}(this.layoutCorrected,this.treeScale,this.path,n),!t.layout||t.target||1===this.treeScale.x&&1===this.treeScale.y||(t.target=t.layout.layoutBox,t.targetWithTransforms={x:{min:0,max:0},y:{min:0,max:0}});const{target:l}=t;l?(this.projectionDelta&&this.prevProjectionDelta?(Yu(this.prevProjectionDelta.x,this.projectionDelta.x),Yu(this.prevProjectionDelta.y,this.projectionDelta.y)):this.createProjectionDeltas(),Gc(this.projectionDelta,this.layoutCorrected,l,this.latestValues),this.treeScale.x===s&&this.treeScale.y===a&&ld(this.projectionDelta.x,this.prevProjectionDelta.x)&&ld(this.projectionDelta.y,this.prevProjectionDelta.y)||(this.hasProjected=!0,this.scheduleRender(),this.notifyListeners("projectionUpdate",l)),dd&&ud.recalculatedProjection++):this.prevProjectionDelta&&(this.createProjectionDeltas(),this.scheduleRender())}hide(){this.isVisible=!1}show(){this.isVisible=!0}scheduleRender(e=!0){var t;if(null===(t=this.options.visualElement)||void 0===t||t.scheduleRender(),e){const e=this.getStack();e&&e.scheduleRender()}this.resumingFrom&&!this.resumingFrom.instance&&(this.resumingFrom=void 0)}createProjectionDeltas(){this.prevProjectionDelta={x:{translate:0,scale:1,origin:0,originPoint:0},y:{translate:0,scale:1,origin:0,originPoint:0}},this.projectionDelta={x:{translate:0,scale:1,origin:0,originPoint:0},y:{translate:0,scale:1,origin:0,originPoint:0}},this.projectionDeltaWithTransform={x:{translate:0,scale:1,origin:0,originPoint:0},y:{translate:0,scale:1,origin:0,originPoint:0}}}setAnimationOrigin(e,t=!1){const n=this.snapshot,r=n?n.latestValues:{},i={...this.latestValues},o={x:{translate:0,scale:1,origin:0,originPoint:0},y:{translate:0,scale:1,origin:0,originPoint:0}};this.relativeParent&&this.relativeParent.options.layoutRoot||(this.relativeTarget=this.relativeTargetOrigin=void 0),this.attemptToResolveRelativeTarget=!t;const s={x:{min:0,max:0},y:{min:0,max:0}},a=(n?n.source:void 0)!==(this.layout?this.layout.source:void 0),l=this.getStack(),c=!l||l.members.length<=1,u=Boolean(a&&!c&&!0===this.options.crossfade&&!this.path.some(zd));let d;this.animationProgress=0,this.mixTargetDelta=t=>{const n=t/1e3;var l,p,h,f,m,g;Md(o.x,e.x,n),Md(o.y,e.y,n),this.setTargetDelta(o),this.relativeTarget&&this.relativeTargetOrigin&&this.layout&&this.relativeParent&&this.relativeParent.layout&&(Xc(s,this.layout.layoutBox,this.relativeParent.layout.layoutBox),h=this.relativeTarget,f=this.relativeTargetOrigin,m=s,g=n,Rd(h.x,f.x,m.x,g),Rd(h.y,f.y,m.y,g),d&&(l=this.relativeTarget,p=d,id(l.x,p.x)&&id(l.y,p.y))&&(this.isProjectionDirty=!1),d||(d={x:{min:0,max:0},y:{min:0,max:0}}),Xu(d,this.relativeTarget)),a&&(this.animationValues=i,function(e,t,n,r,i,o){i?(e.opacity=Sl(0,void 0!==n.opacity?n.opacity:1,Wu(r)),e.opacityExit=Sl(void 0!==t.opacity?t.opacity:1,0,Gu(r))):o&&(e.opacity=Sl(void 0!==t.opacity?t.opacity:1,void 0!==n.opacity?n.opacity:1,r));for(let i=0;i<Nu;i++){const o=`border${Fu[i]}Radius`;let s=Hu(t,o),a=Hu(n,o);void 0===s&&void 0===a||(s||(s=0),a||(a=0),0===s||0===a||$u(s)===$u(a)?(e[o]=Math.max(Sl(Uu(s),Uu(a),r),0),(xa.test(a)||xa.test(s))&&(e[o]+="%")):e[o]=a)}(t.rotate||n.rotate)&&(e.rotate=Sl(t.rotate||0,n.rotate||0,r))}(i,r,this.latestValues,n,u,c)),this.root.scheduleUpdateProjection(),this.scheduleRender(),this.animationProgress=n},this.mixTargetDelta(this.options.layoutRoot?1e3:0)}startAnimation(e){this.notifyListeners("animationStart"),this.currentAnimation&&this.currentAnimation.stop(),this.resumingFrom&&this.resumingFrom.currentAnimation&&this.resumingFrom.currentAnimation.stop(),this.pendingAnimation&&(Ts(this.pendingAnimation),this.pendingAnimation=void 0),this.pendingAnimation=As.update(()=>{Cu.hasAnimatedSinceResize=!0,this.currentAnimation=function(e,t,n){const r=Fs(0)?0:Vs(0);return r.start(gc("",r,1e3,n)),r.animation}(0,0,{...e,onUpdate:t=>{this.mixTargetDelta(t),e.onUpdate&&e.onUpdate(t)},onComplete:()=>{e.onComplete&&e.onComplete(),this.completeAnimation()}}),this.resumingFrom&&(this.resumingFrom.currentAnimation=this.currentAnimation),this.pendingAnimation=void 0})}completeAnimation(){this.resumingFrom&&(this.resumingFrom.currentAnimation=void 0,this.resumingFrom.preserveOpacity=void 0);const e=this.getStack();e&&e.exitAnimationComplete(),this.resumingFrom=this.currentAnimation=this.animationValues=void 0,this.notifyListeners("animationComplete")}finishAnimation(){this.currentAnimation&&(this.mixTargetDelta&&this.mixTargetDelta(1e3),this.currentAnimation.stop()),this.completeAnimation()}applyTransformsToTarget(){const e=this.getLead();let{targetWithTransforms:t,target:n,layout:r,latestValues:i}=e;if(t&&n&&r){if(this!==e&&this.layout&&r&&Vd(this.options.animationType,this.layout.layoutBox,r.layoutBox)){n=this.target||{x:{min:0,max:0},y:{min:0,max:0}};const t=Hc(this.layout.layoutBox.x);n.x.min=e.target.x.min,n.x.max=n.x.min+t;const r=Hc(this.layout.layoutBox.y);n.y.min=e.target.y.min,n.y.max=n.y.min+r}Xu(t,n),vu(t,i),Gc(this.projectionDeltaWithTransform,this.layoutCorrected,t,i)}}registerSharedNode(e,t){this.sharedNodes.has(e)||this.sharedNodes.set(e,new cd),this.sharedNodes.get(e).add(t);const n=t.options.initialPromotionConfig;t.promote({transition:n?n.transition:void 0,preserveFollowOpacity:n&&n.shouldPreserveFollowOpacity?n.shouldPreserveFollowOpacity(t):void 0})}isLead(){const e=this.getStack();return!e||e.lead===this}getLead(){var e;const{layoutId:t}=this.options;return t&&(null===(e=this.getStack())||void 0===e?void 0:e.lead)||this}getPrevLead(){var e;const{layoutId:t}=this.options;return t?null===(e=this.getStack())||void 0===e?void 0:e.prevLead:void 0}getStack(){const{layoutId:e}=this.options;if(e)return this.root.sharedNodes.get(e)}promote({needsReset:e,transition:t,preserveFollowOpacity:n}={}){const r=this.getStack();r&&r.promote(this,n),e&&(this.projectionDelta=void 0,this.needsReset=!0),t&&this.setOptions({transition:t})}relegate(){const e=this.getStack();return!!e&&e.relegate(this)}resetSkewAndRotation(){const{visualElement:e}=this.options;if(!e)return;let t=!1;const{latestValues:n}=e;if((n.z||n.rotate||n.rotateX||n.rotateY||n.rotateZ||n.skewX||n.skewY)&&(t=!0),!t)return;const r={};n.z&&md("z",e,r,this.animationValues);for(let t=0;t<pd.length;t++)md(`rotate${pd[t]}`,e,r,this.animationValues),md(`skew${pd[t]}`,e,r,this.animationValues);e.render();for(const t in r)e.setStaticValue(t,r[t]),this.animationValues&&(this.animationValues[t]=r[t]);e.scheduleRender()}getProjectionStyles(e){var t,n;if(!this.instance||this.isSVG)return;if(!this.isVisible)return hd;const r={visibility:""},i=this.getTransformTemplate();if(this.needsReset)return this.needsReset=!1,r.opacity="",r.pointerEvents=Du(null==e?void 0:e.pointerEvents)||"",r.transform=i?i(this.latestValues,""):"none",r;const o=this.getLead();if(!this.projectionDelta||!this.layout||!o.target){const t={};return this.options.layoutId&&(t.opacity=void 0!==this.latestValues.opacity?this.latestValues.opacity:1,t.pointerEvents=Du(null==e?void 0:e.pointerEvents)||""),this.hasProjected&&!su(this.latestValues)&&(t.transform=i?i({},""):"none",this.hasProjected=!1),t}const s=o.animationValues||o.latestValues;this.applyTransformsToTarget(),r.transform=function(e,t,n){let r="";const i=e.x.translate/t.x,o=e.y.translate/t.y,s=(null==n?void 0:n.z)||0;if((i||o||s)&&(r=`translate3d(${i}px, ${o}px, ${s}px) `),1===t.x&&1===t.y||(r+=`scale(${1/t.x}, ${1/t.y}) `),n){const{transformPerspective:e,rotate:t,rotateX:i,rotateY:o,skewX:s,skewY:a}=n;e&&(r=`perspective(${e}px) ${r}`),t&&(r+=`rotate(${t}deg) `),i&&(r+=`rotateX(${i}deg) `),o&&(r+=`rotateY(${o}deg) `),s&&(r+=`skewX(${s}deg) `),a&&(r+=`skewY(${a}deg) `)}const a=e.x.scale*t.x,l=e.y.scale*t.y;return 1===a&&1===l||(r+=`scale(${a}, ${l})`),r||"none"}(this.projectionDeltaWithTransform,this.treeScale,s),i&&(r.transform=i(s,r.transform));const{x:a,y:l}=this.projectionDelta;r.transformOrigin=`${100*a.origin}% ${100*l.origin}% 0`,o.animationValues?r.opacity=o===this?null!==(n=null!==(t=s.opacity)&&void 0!==t?t:this.latestValues.opacity)&&void 0!==n?n:1:this.preserveOpacity?this.latestValues.opacity:s.opacityExit:r.opacity=o===this?void 0!==s.opacity?s.opacity:"":void 0!==s.opacityExit?s.opacityExit:0;for(const e in Mu){if(void 0===s[e])continue;const{correct:t,applyTo:n}=Mu[e],i="none"===r.transform?s[e]:t(s[e],o);if(n){const e=n.length;for(let t=0;t<e;t++)r[n[t]]=i}else r[e]=i}return this.options.layoutId&&(r.pointerEvents=o===this?Du(null==e?void 0:e.pointerEvents)||"":"none"),r}clearSnapshot(){this.resumeFrom=this.snapshot=void 0}resetTree(){this.root.nodes.forEach(e=>{var t;return null===(t=e.currentAnimation)||void 0===t?void 0:t.stop()}),this.root.nodes.forEach(Sd),this.root.sharedNodes.clear()}}}function xd(e){e.updateLayout()}function yd(e){var t;const n=(null===(t=e.resumeFrom)||void 0===t?void 0:t.snapshot)||e.snapshot;if(e.isLead()&&e.layout&&n&&e.hasListeners("didUpdate")){const{layoutBox:t,measuredBox:r}=e.layout,{animationType:i}=e.options,o=n.source!==e.layout.source;"size"===i?nu(e=>{const r=o?n.measuredBox[e]:n.layoutBox[e],i=Hc(r);r.min=t[e].min,r.max=r.min+i}):Vd(i,n.layoutBox,t)&&nu(r=>{const i=o?n.measuredBox[r]:n.layoutBox[r],s=Hc(t[r]);i.max=i.min+s,e.relativeTarget&&!e.currentAnimation&&(e.isProjectionDirty=!0,e.relativeTarget[r].max=e.relativeTarget[r].min+s)});const s={x:{translate:0,scale:1,origin:0,originPoint:0},y:{translate:0,scale:1,origin:0,originPoint:0}};Gc(s,t,n.layoutBox);const a={x:{translate:0,scale:1,origin:0,originPoint:0},y:{translate:0,scale:1,origin:0,originPoint:0}};o?Gc(a,e.applyTransform(r,!0),n.measuredBox):Gc(a,t,n.layoutBox);const l=!rd(s);let c=!1;if(!e.resumeFrom){const r=e.getClosestProjectingParent();if(r&&!r.resumeFrom){const{snapshot:i,layout:o}=r;if(i&&o){const s={x:{min:0,max:0},y:{min:0,max:0}};Xc(s,n.layoutBox,i.layoutBox);const a={x:{min:0,max:0},y:{min:0,max:0}};Xc(a,t,o.layoutBox),sd(s,a)||(c=!0),r.options.layoutRoot&&(e.relativeTarget=a,e.relativeTargetOrigin=s,e.relativeParent=r)}}}e.notifyListeners("didUpdate",{layout:t,snapshot:n,delta:a,layoutDelta:s,hasLayoutChanged:l,hasRelativeTargetChanged:c})}else if(e.isLead()){const{onExitComplete:t}=e.options;t&&t()}e.options.transition=void 0}function bd(e){dd&&ud.totalNodes++,e.parent&&(e.isProjecting()||(e.isProjectionDirty=e.parent.isProjectionDirty),e.isSharedProjectionDirty||(e.isSharedProjectionDirty=Boolean(e.isProjectionDirty||e.parent.isProjectionDirty||e.parent.isSharedProjectionDirty)),e.isTransformDirty||(e.isTransformDirty=e.parent.isTransformDirty))}function wd(e){e.isProjectionDirty=e.isSharedProjectionDirty=e.isTransformDirty=!1}function jd(e){e.clearSnapshot()}function Sd(e){e.clearMeasurements()}function kd(e){e.isLayoutDirty=!1}function Ad(e){const{visualElement:t}=e.options;t&&t.getProps().onBeforeLayoutMeasure&&t.notify("BeforeLayoutMeasure"),e.resetTransform()}function Td(e){e.finishAnimation(),e.targetDelta=e.relativeTarget=e.target=void 0,e.isProjectionDirty=!0}function Cd(e){e.resolveTargetDelta()}function Pd(e){e.calcProjection()}function _d(e){e.resetSkewAndRotation()}function Ed(e){e.removeLeadSnapshot()}function Md(e,t,n){e.translate=Sl(t.translate,0,n),e.scale=Sl(t.scale,1,n),e.origin=t.origin,e.originPoint=t.originPoint}function Rd(e,t,n,r){e.min=Sl(t.min,n.min,r),e.max=Sl(t.max,n.max,r)}function zd(e){return e.animationValues&&void 0!==e.animationValues.opacityExit}const Id={duration:.45,ease:[.4,0,.1,1]},Ld=e=>"undefined"!=typeof navigator&&navigator.userAgent&&navigator.userAgent.toLowerCase().includes(e),Bd=Ld("applewebkit/")&&!Ld("chrome/")?Math.round:xs;function Od(e){e.min=Bd(e.min),e.max=Bd(e.max)}function Vd(e,t,n){return"position"===e||"preserve-aspect"===e&&(r=ad(t),i=ad(n),!(Math.abs(r-i)<=.2));var r,i}function Dd(e){var t;return e!==e.root&&(null===(t=e.scroll)||void 0===t?void 0:t.wasRoot)}const Fd=vd({attachResizeListener:(e,t)=>Rc(e,"resize",t),measureScroll:()=>({x:document.documentElement.scrollLeft||document.body.scrollLeft,y:document.documentElement.scrollTop||document.body.scrollTop}),checkIsScrollRoot:()=>!0}),Nd={current:void 0},Ud=vd({measureScroll:e=>({x:e.scrollLeft,y:e.scrollTop}),defaultParent:()=>{if(!Nd.current){const e=new Fd({});e.mount(window),e.setOptions({layoutScroll:!0}),Nd.current=e}return Nd.current},resetTransform:(e,t)=>{e.style.transform=void 0!==t?t:"none"},checkIsScrollRoot:e=>Boolean("fixed"===window.getComputedStyle(e).position)}),$d={pan:{Feature:class extends _c{constructor(){super(...arguments),this.removePointerDownListener=xs}onPointerDown(e){this.session=new Bc(e,this.createPanHandlers(),{transformPagePoint:this.node.getTransformPagePoint(),contextWindow:yu(this.node)})}createPanHandlers(){const{onPanSessionStart:e,onPanStart:t,onPan:n,onPanEnd:r}=this.node.getProps();return{onSessionStart:Su(e),onStart:Su(t),onMove:n,onEnd:(e,t)=>{delete this.session,r&&As.postRender(()=>r(e,t))}}}mount(){this.removePointerDownListener=Ic(this.node.current,"pointerdown",e=>this.onPointerDown(e))}update(){this.session&&this.session.updateHandlers(this.createPanHandlers())}unmount(){this.removePointerDownListener(),this.session&&this.session.end()}}},drag:{Feature:class extends _c{constructor(e){super(e),this.removeGroupControls=xs,this.removeListeners=xs,this.controls=new wu(e)}mount(){const{dragControls:e}=this.node.getProps();e&&(this.removeGroupControls=e.subscribe(this.controls)),this.removeListeners=this.controls.addListeners()||xs}unmount(){this.removeGroupControls(),this.removeListeners()}},ProjectionNode:Ud,MeasureLayout:Lu}};function Hd(e,t,n){const{props:r}=e;e.animationState&&r.whileHover&&e.animationState.setActive("whileHover","Start"===n);const i=r["onHover"+n];i&&As.postRender(()=>i(t,zc(t)))}function Wd(e,t,n){const{props:r}=e;e.animationState&&r.whileTap&&e.animationState.setActive("whileTap","Start"===n);const i=r["onTap"+("End"===n?"":n)];i&&As.postRender(()=>i(t,zc(t)))}const Gd=new WeakMap,qd=new WeakMap,Kd=e=>{const t=Gd.get(e.target);t&&t(e)},Xd=e=>{e.forEach(Kd)};const Yd={some:0,all:1},Zd={inView:{Feature:class extends _c{constructor(){super(...arguments),this.hasEnteredView=!1,this.isInView=!1}startObserver(){this.unmount();const{viewport:e={}}=this.node.getProps(),{root:t,margin:n,amount:r="some",once:i}=e,o={root:t?t.current:void 0,rootMargin:n,threshold:"number"==typeof r?r:Yd[r]};return function(e,t,n){const r=function({root:e,...t}){const n=e||document;qd.has(n)||qd.set(n,{});const r=qd.get(n),i=JSON.stringify(t);return r[i]||(r[i]=new IntersectionObserver(Xd,{root:e,...t})),r[i]}(t);return Gd.set(e,n),r.observe(e),()=>{Gd.delete(e),r.unobserve(e)}}(this.node.current,o,e=>{const{isIntersecting:t}=e;if(this.isInView===t)return;if(this.isInView=t,i&&!t&&this.hasEnteredView)return;t&&(this.hasEnteredView=!0),this.node.animationState&&this.node.animationState.setActive("whileInView",t);const{onViewportEnter:n,onViewportLeave:r}=this.node.getProps(),o=t?n:r;o&&o(e)})}mount(){this.startObserver()}update(){if("undefined"==typeof IntersectionObserver)return;const{props:e,prevProps:t}=this.node;["amount","margin","root"].some(function({viewport:e={}},{viewport:t={}}={}){return n=>e[n]!==t[n]}(e,t))&&this.startObserver()}unmount(){}}},tap:{Feature:class extends _c{mount(){const{current:e}=this.node;e&&(this.unmount=function(e,t,n={}){const[r,i,o]=as(e,n),s=e=>{const r=e.currentTarget;if(!ms(e)||ps.has(r))return;ps.add(r);const o=t(e),s=(e,t)=>{window.removeEventListener("pointerup",a),window.removeEventListener("pointercancel",l),ms(e)&&ps.has(r)&&(ps.delete(r),"function"==typeof o&&o(e,{success:t}))},a=e=>{s(e,n.useGlobalTarget||cs(r,e.target))},l=e=>{s(e,!1)};window.addEventListener("pointerup",a,i),window.addEventListener("pointercancel",l,i)};return r.forEach(e=>{(function(e){return ds.has(e.tagName)||-1!==e.tabIndex})(e)||null!==e.getAttribute("tabindex")||(e.tabIndex=0),(n.useGlobalTarget?window:e).addEventListener("pointerdown",s,i),e.addEventListener("focus",e=>((e,t)=>{const n=e.currentTarget;if(!n)return;const r=hs(()=>{if(ps.has(n))return;fs(n,"down");const e=hs(()=>{fs(n,"up")});n.addEventListener("keyup",e,t),n.addEventListener("blur",()=>fs(n,"cancel"),t)});n.addEventListener("keydown",r,t),n.addEventListener("blur",()=>n.removeEventListener("keydown",r),t)})(e,i),i)}),o}(e,e=>(Wd(this.node,e,"Start"),(e,{success:t})=>Wd(this.node,e,t?"End":"Cancel")),{useGlobalTarget:this.node.props.globalTapTarget}))}unmount(){}}},focus:{Feature:class extends _c{constructor(){super(...arguments),this.isActive=!1}onFocus(){let e=!1;try{e=this.node.current.matches(":focus-visible")}catch(t){e=!0}e&&this.node.animationState&&(this.node.animationState.setActive("whileFocus",!0),this.isActive=!0)}onBlur(){this.isActive&&this.node.animationState&&(this.node.animationState.setActive("whileFocus",!1),this.isActive=!1)}mount(){this.unmount=Ml(Rc(this.node.current,"focus",()=>this.onFocus()),Rc(this.node.current,"blur",()=>this.onBlur()))}unmount(){}}},hover:{Feature:class extends _c{mount(){const{current:e}=this.node;e&&(this.unmount=function(e,t,n={}){const[r,i,o]=as(e,n),s=ls(e=>{const{target:n}=e,r=t(e);if("function"!=typeof r||!n)return;const o=ls(e=>{r(e),n.removeEventListener("pointerleave",o)});n.addEventListener("pointerleave",o,i)});return r.forEach(e=>{e.addEventListener("pointerenter",s,i)}),o}(e,e=>(Hd(this.node,e,"Start"),e=>Hd(this.node,e,"End"))))}unmount(){}}}},Qd={layout:{ProjectionNode:Ud,MeasureLayout:Lu}},Jd=(0,g.createContext)({strict:!1}),ep=(0,g.createContext)({transformPagePoint:e=>e,isStatic:!1,reducedMotion:"never"}),tp=(0,g.createContext)({});function np(e){return Mo(e.animate)||Do.some(t=>Io(e[t]))}function rp(e){return Boolean(np(e)||e.variants)}function ip(e){return Array.isArray(e)?e.join(" "):e}const op="undefined"!=typeof window,sp={animation:["animate","variants","whileHover","whileTap","exit","whileInView","whileFocus","whileDrag"],exit:["exit"],drag:["drag","dragControls"],focus:["whileFocus"],hover:["whileHover","onHoverStart","onHoverEnd"],tap:["whileTap","onTap","onTapStart","onTapCancel"],pan:["onPan","onPanStart","onPanSessionStart","onPanEnd"],inView:["whileInView","onViewportEnter","onViewportLeave"],layout:["layout","layoutId"]},ap={};for(const e in sp)ap[e]={isEnabled:t=>sp[e].some(e=>!!t[e])};const lp=Symbol.for("motionComponentSymbol");function cp(e,t,n){return(0,g.useCallback)(r=>{r&&e.onMount&&e.onMount(r),t&&(r?t.mount(r):t.unmount()),n&&("function"==typeof n?n(r):$c(n)&&(n.current=r))},[t])}const up=op?g.useLayoutEffect:g.useEffect;function dp(e,t,n,r,i){var o,s;const{visualElement:a}=(0,g.useContext)(tp),l=(0,g.useContext)(Jd),c=(0,g.useContext)(ku),u=(0,g.useContext)(ep).reducedMotion,d=(0,g.useRef)(null);r=r||l.renderer,!d.current&&r&&(d.current=r(e,{visualState:t,parent:a,props:n,presenceContext:c,blockInitialAnimation:!!c&&!1===c.initial,reducedMotionConfig:u}));const p=d.current,h=(0,g.useContext)(Tu);!p||p.projection||!i||"html"!==p.type&&"svg"!==p.type||function(e,t,n,r){const{layoutId:i,layout:o,drag:s,dragConstraints:a,layoutScroll:l,layoutRoot:c}=t;e.projection=new n(e.latestValues,t["data-framer-portal-id"]?void 0:pp(e.parent)),e.projection.setOptions({layoutId:i,layout:o,alwaysMeasureLayout:Boolean(s)||a&&$c(a),visualElement:e,animationType:"string"==typeof o?o:"both",initialPromotionConfig:r,layoutScroll:l,layoutRoot:c})}(d.current,n,i,h);const f=(0,g.useRef)(!1);(0,g.useInsertionEffect)(()=>{p&&f.current&&p.update(n,c)});const m=n[$s],v=(0,g.useRef)(Boolean(m)&&!(null===(o=window.MotionHandoffIsComplete)||void 0===o?void 0:o.call(window,m))&&(null===(s=window.MotionHasOptimisedAnimation)||void 0===s?void 0:s.call(window,m)));return up(()=>{p&&(f.current=!0,window.MotionIsMounted=!0,p.updateFeatures(),Ru.render(p.render),v.current&&p.animationState&&p.animationState.animateChanges())}),(0,g.useEffect)(()=>{p&&(!v.current&&p.animationState&&p.animationState.animateChanges(),v.current&&(queueMicrotask(()=>{var e;null===(e=window.MotionHandoffMarkAsComplete)||void 0===e||e.call(window,m)}),v.current=!1))}),p}function pp(e){if(e)return!1!==e.options.allowProjection?e.projection:pp(e.parent)}function hp({preloadedFeatures:e,createVisualElement:t,useRender:n,useVisualState:r,Component:i}){var o,s;function a(e,o){let s;const a={...(0,g.useContext)(ep),...e,layoutId:fp(e)},{isStatic:l}=a,c=function(e){const{initial:t,animate:n}=function(e,t){if(np(e)){const{initial:t,animate:n}=e;return{initial:!1===t||Io(t)?t:void 0,animate:Io(n)?n:void 0}}return!1!==e.inherit?t:{}}(e,(0,g.useContext)(tp));return(0,g.useMemo)(()=>({initial:t,animate:n}),[ip(t),ip(n)])}(e),d=r(e,l);if(!l&&op){(0,g.useContext)(Jd).strict;const e=function(e){const{drag:t,layout:n}=ap;if(!t&&!n)return{};const r={...t,...n};return{MeasureLayout:(null==t?void 0:t.isEnabled(e))||(null==n?void 0:n.isEnabled(e))?r.MeasureLayout:void 0,ProjectionNode:r.ProjectionNode}}(a);s=e.MeasureLayout,c.visualElement=dp(i,d,a,t,e.ProjectionNode)}return(0,u.jsxs)(tp.Provider,{value:c,children:[s&&c.visualElement?(0,u.jsx)(s,{visualElement:c.visualElement,...a}):null,n(i,e,cp(d,c.visualElement,o),d,l,c.visualElement)]})}e&&function(e){for(const t in e)ap[t]={...ap[t],...e[t]}}(e),a.displayName=`motion.${"string"==typeof i?i:`create(${null!==(s=null!==(o=i.displayName)&&void 0!==o?o:i.name)&&void 0!==s?s:""})`}`;const l=(0,g.forwardRef)(a);return l[lp]=i,l}function fp({layoutId:e}){const t=(0,g.useContext)(Au).id;return t&&void 0!==e?t+"-"+e:e}const mp=["animate","circle","defs","desc","ellipse","g","image","line","filter","marker","mask","metadata","path","pattern","polygon","polyline","rect","stop","switch","symbol","svg","text","tspan","use","view"];function gp(e){return"string"==typeof e&&!e.includes("-")&&!!(mp.indexOf(e)>-1||/[A-Z]/u.test(e))}const vp=e=>(t,n)=>{const r=(0,g.useContext)(tp),i=(0,g.useContext)(ku),o=()=>function({scrapeMotionValuesFromProps:e,createRenderState:t,onUpdate:n},r,i,o){const s={latestValues:xp(r,i,o,e),renderState:t()};return n&&(s.onMount=e=>n({props:r,current:e,...s}),s.onUpdate=e=>n(e)),s}(e,t,r,i);return n?o():function(e){const t=(0,g.useRef)(null);return null===t.current&&(t.current=e()),t.current}(o)};function xp(e,t,n,r){const i={},o=r(e,{});for(const e in o)i[e]=Du(o[e]);let{initial:s,animate:a}=e;const l=np(e),c=rp(e);t&&c&&!l&&!1!==e.inherit&&(void 0===s&&(s=t.initial),void 0===a&&(a=t.animate));let u=!!n&&!1===n.initial;u=u||!1===s;const d=u?a:s;if(d&&"boolean"!=typeof d&&!Mo(d)){const t=Array.isArray(d)?d:[d];for(let n=0;n<t.length;n++){const r=Bo(e,t[n]);if(r){const{transitionEnd:e,transition:t,...n}=r;for(const e in n){let t=n[e];Array.isArray(t)&&(t=t[u?t.length-1:0]),null!==t&&(i[e]=t)}for(const t in e)i[t]=e[t]}}}return i}const yp=(e,t)=>t&&"number"==typeof e?t.transform(e):e,bp={x:"translateX",y:"translateY",z:"translateZ",transformPerspective:"perspective"},wp=ys.length;function jp(e,t,n){const{style:r,vars:i,transformOrigin:o}=e;let s=!1,a=!1;for(const e in t){const n=t[e];if(bs.has(e))s=!0;else if(ll(e))i[e]=n;else{const t=yp(n,Na[e]);e.startsWith("origin")?(a=!0,o[e]=t):r[e]=t}}if(t.transform||(s||n?r.transform=function(e,t,n){let r="",i=!0;for(let o=0;o<wp;o++){const s=ys[o],a=e[s];if(void 0===a)continue;let l=!0;if(l="number"==typeof a?a===(s.startsWith("scale")?1:0):0===parseFloat(a),!l||n){const e=yp(a,Na[s]);l||(i=!1,r+=`${bp[s]||s}(${e}) `),n&&(t[s]=e)}}return r=r.trim(),n?r=n(t,i?"":r):i&&(r="none"),r}(t,e.transform,n):r.transform&&(r.transform="none")),a){const{originX:e="50%",originY:t="50%",originZ:n=0}=o;r.transformOrigin=`${e} ${t} ${n}`}}const Sp={offset:"stroke-dashoffset",array:"stroke-dasharray"},kp={offset:"strokeDashoffset",array:"strokeDasharray"};function Ap(e,t,n){return"string"==typeof e?e:ya.transform(t+n*e)}function Tp(e,{attrX:t,attrY:n,attrScale:r,originX:i,originY:o,pathLength:s,pathSpacing:a=1,pathOffset:l=0,...c},u,d){if(jp(e,c,d),u)return void(e.style.viewBox&&(e.attrs.viewBox=e.style.viewBox));e.attrs=e.style,e.style={};const{attrs:p,style:h,dimensions:f}=e;p.transform&&(f&&(h.transform=p.transform),delete p.transform),f&&(void 0!==i||void 0!==o||h.transform)&&(h.transformOrigin=function(e,t,n){return`${Ap(t,e.x,e.width)} ${Ap(n,e.y,e.height)}`}(f,void 0!==i?i:.5,void 0!==o?o:.5)),void 0!==t&&(p.x=t),void 0!==n&&(p.y=n),void 0!==r&&(p.scale=r),void 0!==s&&function(e,t,n=1,r=0,i=!0){e.pathLength=1;const o=i?Sp:kp;e[o.offset]=ya.transform(-r);const s=ya.transform(t),a=ya.transform(n);e[o.array]=`${s} ${a}`}(p,s,a,l,!1)}const Cp=e=>"string"==typeof e&&"svg"===e.toLowerCase();function Pp(e,{style:t,vars:n},r,i){Object.assign(e.style,t,i&&i.getProjectionStyles(r));for(const t in n)e.style.setProperty(t,n[t])}const _p=new Set(["baseFrequency","diffuseConstant","kernelMatrix","kernelUnitLength","keySplines","keyTimes","limitingConeAngle","markerHeight","markerWidth","numOctaves","targetX","targetY","surfaceScale","specularConstant","specularExponent","stdDeviation","tableValues","viewBox","gradientTransform","pathLength","startOffset","textLength","lengthAdjust"]);function Ep(e,t,n,r){Pp(e,t,void 0,r);for(const n in t.attrs)e.setAttribute(_p.has(n)?n:Us(n),t.attrs[n])}function Mp(e,{layout:t,layoutId:n}){return bs.has(e)||e.startsWith("origin")||(t||void 0!==n)&&(!!Mu[e]||"opacity"===e)}function Rp(e,t,n){var r;const{style:i}=e,o={};for(const s in i)(Fs(i[s])||t.style&&Fs(t.style[s])||Mp(s,e)||void 0!==(null===(r=null==n?void 0:n.getValue(s))||void 0===r?void 0:r.liveStyle))&&(o[s]=i[s]);return o}function zp(e,t,n){const r=Rp(e,t,n);for(const n in e)(Fs(e[n])||Fs(t[n]))&&(r[-1!==ys.indexOf(n)?"attr"+n.charAt(0).toUpperCase()+n.substring(1):n]=e[n]);return r}const Ip=["x","y","width","height","cx","cy","r"],Lp={useVisualState:vp({scrapeMotionValuesFromProps:zp,createRenderState:()=>({style:{},transform:{},transformOrigin:{},vars:{},attrs:{}}),onUpdate:({props:e,prevProps:t,current:n,renderState:r,latestValues:i})=>{if(!n)return;let o=!!e.drag;if(!o)for(const e in i)if(bs.has(e)){o=!0;break}if(!o)return;let s=!t;if(t)for(let n=0;n<Ip.length;n++){const r=Ip[n];e[r]!==t[r]&&(s=!0)}s&&As.read(()=>{!function(e,t){try{t.dimensions="function"==typeof e.getBBox?e.getBBox():e.getBoundingClientRect()}catch(e){t.dimensions={x:0,y:0,width:0,height:0}}}(n,r),As.render(()=>{Tp(r,i,Cp(n.tagName),e.transformTemplate),Ep(n,r)})})}})},Bp={useVisualState:vp({scrapeMotionValuesFromProps:Rp,createRenderState:()=>({style:{},transform:{},transformOrigin:{},vars:{}})})};function Op(e,t,n){for(const r in t)Fs(t[r])||Mp(r,n)||(e[r]=t[r])}function Vp(e,t){const n={},r=function(e,t){const n={};return Op(n,e.style||{},e),Object.assign(n,function({transformTemplate:e},t){return(0,g.useMemo)(()=>{const n={style:{},transform:{},transformOrigin:{},vars:{}};return jp(n,t,e),Object.assign({},n.vars,n.style)},[t])}(e,t)),n}(e,t);return e.drag&&!1!==e.dragListener&&(n.draggable=!1,r.userSelect=r.WebkitUserSelect=r.WebkitTouchCallout="none",r.touchAction=!0===e.drag?"none":"pan-"+("x"===e.drag?"y":"x")),void 0===e.tabIndex&&(e.onTap||e.onTapStart||e.whileTap)&&(n.tabIndex=0),n.style=r,n}const Dp=new Set(["animate","exit","variants","initial","style","values","variants","transition","transformTemplate","custom","inherit","onBeforeLayoutMeasure","onAnimationStart","onAnimationComplete","onUpdate","onDragStart","onDrag","onDragEnd","onMeasureDragConstraints","onDirectionLock","onDragTransitionEnd","_dragX","_dragY","onHoverStart","onHoverEnd","onViewportEnter","onViewportLeave","globalTapTarget","ignoreStrict","viewport"]);function Fp(e){return e.startsWith("while")||e.startsWith("drag")&&"draggable"!==e||e.startsWith("layout")||e.startsWith("onTap")||e.startsWith("onPan")||e.startsWith("onLayout")||Dp.has(e)}let Np=e=>!Fp(e);try{(Up=require("@emotion/is-prop-valid").default)&&(Np=e=>e.startsWith("on")?!Fp(e):Up(e))}catch(e){}var Up;function $p(e,t,n,r){const i=(0,g.useMemo)(()=>{const n={style:{},transform:{},transformOrigin:{},vars:{},attrs:{}};return Tp(n,t,Cp(r),e.transformTemplate),{...n.attrs,style:{...n.style}}},[t]);if(e.style){const t={};Op(t,e.style,e),i.style={...t,...i.style}}return i}function Hp(e=!1){return(t,n,r,{latestValues:i},o)=>{const s=(gp(t)?$p:Vp)(n,i,o,t),a=function(e,t,n){const r={};for(const i in e)"values"===i&&"object"==typeof e.values||(Np(i)||!0===n&&Fp(i)||!t&&!Fp(i)||e.draggable&&i.startsWith("onDrag"))&&(r[i]=e[i]);return r}(n,"string"==typeof t,e),l=t!==g.Fragment?{...a,...s,ref:r}:{},{children:c}=n,u=(0,g.useMemo)(()=>Fs(c)?c.get():c,[c]);return(0,g.createElement)(t,{...l,children:u})}}function Wp(e,t){return function(n,{forwardMotionProps:r}={forwardMotionProps:!1}){return hp({...gp(n)?Lp:Bp,preloadedFeatures:e,useRender:Hp(r),createVisualElement:t,Component:n})}}const Gp={current:null},qp={current:!1},Kp=[...ml,ka,za],Xp=new WeakMap,Yp=["AnimationStart","AnimationComplete","Update","BeforeLayoutMeasure","LayoutMeasure","LayoutAnimationStart","LayoutAnimationComplete"];class Zp{scrapeMotionValuesFromProps(e,t,n){return{}}constructor({parent:e,props:t,presenceContext:n,reducedMotionConfig:r,blockInitialAnimation:i,visualState:o},s={}){this.current=null,this.children=new Set,this.isVariantNode=!1,this.isControllingVariants=!1,this.shouldReduceMotion=null,this.values=new Map,this.KeyframeResolver=rl,this.features={},this.valueSubscriptions=new Map,this.prevMotionValues={},this.events={},this.propEventSubscriptions={},this.notifyUpdate=()=>this.notify("Update",this.latestValues),this.render=()=>{this.current&&(this.triggerBuild(),this.renderInstance(this.current,this.renderState,this.props.style,this.projection))},this.renderScheduledAt=0,this.scheduleRender=()=>{const e=Ms.now();this.renderScheduledAt<e&&(this.renderScheduledAt=e,As.render(this.render,!1,!0))};const{latestValues:a,renderState:l,onUpdate:c}=o;this.onUpdate=c,this.latestValues=a,this.baseTarget={...a},this.initialValues=t.initial?{...a}:{},this.renderState=l,this.parent=e,this.props=t,this.presenceContext=n,this.depth=e?e.depth+1:0,this.reducedMotionConfig=r,this.options=s,this.blockInitialAnimation=Boolean(i),this.isControllingVariants=np(t),this.isVariantNode=rp(t),this.isVariantNode&&(this.variantChildren=new Set),this.manuallyAnimateOnMount=Boolean(e&&e.current);const{willChange:u,...d}=this.scrapeMotionValuesFromProps(t,{},this);for(const e in d){const t=d[e];void 0!==a[e]&&Fs(t)&&t.set(a[e],!1)}}mount(e){this.current=e,Xp.set(e,this),this.projection&&!this.projection.instance&&this.projection.mount(e),this.parent&&this.isVariantNode&&!this.isControllingVariants&&(this.removeFromVariantTree=this.parent.addVariantChild(this)),this.values.forEach((e,t)=>this.bindToMotionValue(t,e)),qp.current||function(){if(qp.current=!0,op)if(window.matchMedia){const e=window.matchMedia("(prefers-reduced-motion)"),t=()=>Gp.current=e.matches;e.addListener(t),t()}else Gp.current=!1}(),this.shouldReduceMotion="never"!==this.reducedMotionConfig&&("always"===this.reducedMotionConfig||Gp.current),this.parent&&this.parent.children.add(this),this.update(this.props,this.presenceContext)}unmount(){Xp.delete(this.current),this.projection&&this.projection.unmount(),Ts(this.notifyUpdate),Ts(this.render),this.valueSubscriptions.forEach(e=>e()),this.valueSubscriptions.clear(),this.removeFromVariantTree&&this.removeFromVariantTree(),this.parent&&this.parent.children.delete(this);for(const e in this.events)this.events[e].clear();for(const e in this.features){const t=this.features[e];t&&(t.unmount(),t.isMounted=!1)}this.current=null}bindToMotionValue(e,t){this.valueSubscriptions.has(e)&&this.valueSubscriptions.get(e)();const n=bs.has(e),r=t.on("change",t=>{this.latestValues[e]=t,this.props.onUpdate&&As.preRender(this.notifyUpdate),n&&this.projection&&(this.projection.isTransformDirty=!0)}),i=t.on("renderRequest",this.scheduleRender);let o;window.MotionCheckAppearSync&&(o=window.MotionCheckAppearSync(this,e,t)),this.valueSubscriptions.set(e,()=>{r(),i(),o&&o(),t.owner&&t.stop()})}sortNodePosition(e){return this.current&&this.sortInstanceNodePosition&&this.type===e.type?this.sortInstanceNodePosition(this.current,e.current):0}updateFeatures(){let e="animation";for(e in ap){const t=ap[e];if(!t)continue;const{isEnabled:n,Feature:r}=t;if(!this.features[e]&&r&&n(this.props)&&(this.features[e]=new r(this)),this.features[e]){const t=this.features[e];t.isMounted?t.update():(t.mount(),t.isMounted=!0)}}}triggerBuild(){this.build(this.renderState,this.latestValues,this.props)}measureViewportBox(){return this.current?this.measureInstanceViewportBox(this.current,this.props):{x:{min:0,max:0},y:{min:0,max:0}}}getStaticValue(e){return this.latestValues[e]}setStaticValue(e,t){this.latestValues[e]=t}update(e,t){(e.transformTemplate||this.props.transformTemplate)&&this.scheduleRender(),this.prevProps=this.props,this.props=e,this.prevPresenceContext=this.presenceContext,this.presenceContext=t;for(let t=0;t<Yp.length;t++){const n=Yp[t];this.propEventSubscriptions[n]&&(this.propEventSubscriptions[n](),delete this.propEventSubscriptions[n]);const r=e["on"+n];r&&(this.propEventSubscriptions[n]=this.on(n,r))}this.prevMotionValues=function(e,t,n){for(const r in t){const i=t[r],o=n[r];if(Fs(i))e.addValue(r,i);else if(Fs(o))e.addValue(r,Vs(i,{owner:e}));else if(o!==i)if(e.hasValue(r)){const t=e.getValue(r);!0===t.liveStyle?t.jump(i):t.hasAnimated||t.set(i)}else{const t=e.getStaticValue(r);e.addValue(r,Vs(void 0!==t?t:i,{owner:e}))}}for(const r in n)void 0===t[r]&&e.removeValue(r);return t}(this,this.scrapeMotionValuesFromProps(e,this.prevProps,this),this.prevMotionValues),this.handleChildMotionValue&&this.handleChildMotionValue(),this.onUpdate&&this.onUpdate(this)}getProps(){return this.props}getVariant(e){return this.props.variants?this.props.variants[e]:void 0}getDefaultTransition(){return this.props.transition}getTransformPagePoint(){return this.props.transformPagePoint}getClosestVariantNode(){return this.isVariantNode?this:this.parent?this.parent.getClosestVariantNode():void 0}addVariantChild(e){const t=this.getClosestVariantNode();if(t)return t.variantChildren&&t.variantChildren.add(e),()=>t.variantChildren.delete(e)}addValue(e,t){const n=this.values.get(e);t!==n&&(n&&this.removeValue(e),this.bindToMotionValue(e,t),this.values.set(e,t),this.latestValues[e]=t.get())}removeValue(e){this.values.delete(e);const t=this.valueSubscriptions.get(e);t&&(t(),this.valueSubscriptions.delete(e)),delete this.latestValues[e],this.removeValueFromRenderState(e,this.renderState)}hasValue(e){return this.values.has(e)}getValue(e,t){if(this.props.values&&this.props.values[e])return this.props.values[e];let n=this.values.get(e);return void 0===n&&void 0!==t&&(n=Vs(null===t?void 0:t,{owner:this}),this.addValue(e,n)),n}readValue(e,t){var n;let r=void 0===this.latestValues[e]&&this.current?null!==(n=this.getBaseTargetFromProps(this.props,e))&&void 0!==n?n:this.readValueFromInstance(this.current,e,this.options):this.latestValues[e];var i;return null!=r&&("string"==typeof r&&(sl(r)||na(r))?r=parseFloat(r):(i=r,!Kp.find(fl(i))&&za.test(t)&&(r=Ha(e,t))),this.setBaseTarget(e,Fs(r)?r.get():r)),Fs(r)?r.get():r}setBaseTarget(e,t){this.baseTarget[e]=t}getBaseTarget(e){var t;const{initial:n}=this.props;let r;if("string"==typeof n||"object"==typeof n){const i=Bo(this.props,n,null===(t=this.presenceContext)||void 0===t?void 0:t.custom);i&&(r=i[e])}if(n&&void 0!==r)return r;const i=this.getBaseTargetFromProps(this.props,e);return void 0===i||Fs(i)?void 0!==this.initialValues[e]&&void 0===r?void 0:this.baseTarget[e]:i}on(e,t){return this.events[e]||(this.events[e]=new Is),this.events[e].add(t)}notify(e,...t){this.events[e]&&this.events[e].notify(...t)}}class Qp extends Zp{constructor(){super(...arguments),this.KeyframeResolver=vl}sortInstanceNodePosition(e,t){return 2&e.compareDocumentPosition(t)?1:-1}getBaseTargetFromProps(e,t){return e.style?e.style[t]:void 0}removeValueFromRenderState(e,{vars:t,style:n}){delete t[e],delete n[e]}handleChildMotionValue(){this.childSubscription&&(this.childSubscription(),delete this.childSubscription);const{children:e}=this.props;Fs(e)&&(this.childSubscription=e.on("change",e=>{this.current&&(this.current.textContent=`${e}`)}))}}class Jp extends Qp{constructor(){super(...arguments),this.type="html",this.renderInstance=Pp}readValueFromInstance(e,t){if(bs.has(t)){const e=$a(t);return e&&e.default||0}{const r=(n=e,window.getComputedStyle(n)),i=(ll(t)?r.getPropertyValue(t):r[t])||0;return"string"==typeof i?i.trim():i}var n}measureInstanceViewportBox(e,{transformPagePoint:t}){return xu(e,t)}build(e,t,n){jp(e,t,n.transformTemplate)}scrapeMotionValuesFromProps(e,t,n){return Rp(e,t,n)}}class eh extends Qp{constructor(){super(...arguments),this.type="svg",this.isSVGTag=!1,this.measureInstanceViewportBox=tu}getBaseTargetFromProps(e,t){return e[t]}readValueFromInstance(e,t){if(bs.has(t)){const e=$a(t);return e&&e.default||0}return t=_p.has(t)?t:Us(t),e.getAttribute(t)}scrapeMotionValuesFromProps(e,t,n){return zp(e,t,n)}build(e,t,n){Tp(e,t,this.isSVGTag,n.transformTemplate)}renderInstance(e,t,n,r){Ep(e,t,0,r)}mount(e){this.isSVGTag=Cp(e.tagName),super.mount(e)}}const th=Eo(Wp({...Mc,...Zd,...$d,...Qd},(e,t)=>gp(e)?new eh(t):new Jp(t,{allowProjection:e!==g.Fragment})));console.log("placeholder");const nh=({type:e})=>(0,u.jsxs)(th.div,{className:"placeholder",initial:{opacity:0},animate:{opacity:1},exit:{opacity:0},children:["paragraph"===e&&(0,u.jsxs)("div",{className:"placeholder__paragraph",children:[(0,u.jsx)("div",{className:"placeholder__paragraph__line"}),(0,u.jsx)("div",{className:"placeholder__paragraph__line"}),(0,u.jsx)("div",{className:"placeholder__paragraph__line"}),(0,u.jsx)("div",{className:"placeholder__paragraph__line"}),(0,u.jsx)("div",{className:"placeholder__paragraph__line"})]}),"image"===e&&(0,u.jsx)("div",{className:"placeholder__image",children:(0,u.jsx)("div",{className:"placeholder__image__line"})}),"header"===e&&(0,u.jsxs)("div",{className:"placeholder__header",children:[(0,u.jsx)("div",{className:"placeholder__header__line"}),(0,u.jsx)("div",{className:"placeholder__header__line"})]})]});var rh=n(610),ih=n.n(rh);class oh extends g.PureComponent{componentDidMount(){let e;try{e=n(550)}catch(e){return}e&&e()}renderSources(){const e=ih()&&document.documentMode?document.documentMode:-1,{sources:t}=this.props;if(null==t)return null;const n=t.map((e,t)=>null==e.srcSet?null:(0,u.jsx)("source",{srcSet:e.srcSet,media:e.media,type:e.type},`sources-${t}`));return 9===e?(0,u.jsx)("video",{style:{display:"none"},children:n}):n}renderImage(e,t=!1){const{alt:n="",src:r="data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==",sizes:i,...o}=e,s=t?null:{sizes:i};return(0,u.jsx)("img",{alt:n,srcSet:r,...s,...o})}render(){const{sources:e,...t}=this.props;return null!=e?(0,u.jsxs)("picture",{children:[this.renderSources(),this.renderImage(t,!0)]}):this.renderImage(t)}}const sh=oh,ah=(0,g.createElement)(v.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,g.createElement)(v.Path,{d:"M15.1 4.8l-3-2.5V4c-4.4 0-8 3.6-8 8 0 3.7 2.5 6.9 6 7.7.3.1.6.1 1 .2l.2-1.5c-.4 0-.7-.1-1.1-.2l-.1.2v-.2c-2.6-.8-4.5-3.3-4.5-6.2 0-3.6 2.9-6.5 6.5-6.5v1.8l3-2.5zM20 11c-.2-1.4-.7-2.7-1.6-3.8l-1.2.8c.7.9 1.1 2 1.3 3.1L20 11zm-1.5 1.8c-.1.5-.2 1.1-.4 1.6s-.5 1-.8 1.5l1.2.9c.4-.5.8-1.1 1-1.8s.5-1.3.5-2l-1.5-.2zm-5.6 5.6l.2 1.5c1.4-.2 2.7-.7 3.8-1.6l-.9-1.1c-.9.7-2 1.1-3.1 1.2z"})),lh=(0,g.createElement)(v.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,g.createElement)(v.Path,{d:"M16 11.2h-3.2V8h-1.6v3.2H8v1.6h3.2V16h1.6v-3.2H16z"})),ch=(0,g.createElement)(v.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,g.createElement)(v.Path,{d:"M18 11.3l-1-1.1-4 4V3h-1.5v11.3L7 10.2l-1 1.1 6.2 5.8 5.8-5.8zm.5 3.7v3.5h-13V15H4v5h16v-5h-1.5z"})),uh=window.prcIcons,dh='Georgia, "Times New Roman", Times, serif',ph={instagram:{name:"Instagram",icon:(0,u.jsx)(uh.Icon,{icon:"instagram",library:"brands",size:"12px"}),width:1121,height:1920,layout:{backgroundColor:"#000000",image:{top:50,maxHeight:850},title:{fontFamily:dh,fontSize:72,lineHeight:1.2,color:"#ffffff",marginTop:80,marginX:80,maxLines:4},logo:{height:80,marginBottom:80}}},threads:{name:"Threads",icon:(0,u.jsx)(uh.Icon,{icon:"threads",library:"brands",size:"12px"}),width:1080,height:1920,layout:{backgroundColor:"#000000",image:{top:50,maxHeight:850},title:{fontFamily:dh,fontSize:68,lineHeight:1.2,color:"#ffffff",marginTop:80,marginX:70,maxLines:4},logo:{height:75,marginBottom:80}}},twitter:{name:"Twitter",icon:(0,u.jsx)(uh.Icon,{icon:"twitter",library:"brands",size:"12px"}),width:1200,height:675,layout:{backgroundColor:"#000000",image:{top:0,maxHeight:400},title:{fontFamily:dh,fontSize:48,lineHeight:1.2,color:"#ffffff",marginTop:30,marginX:60,maxLines:3},logo:{height:50,marginBottom:30}}},bluesky:{name:"Bluesky",icon:(0,u.jsx)(uh.Icon,{icon:"bluesky",library:"brands",size:"12px"}),width:1200,height:630,layout:{backgroundColor:"#000000",image:{top:0,maxHeight:380},title:{fontFamily:dh,fontSize:44,lineHeight:1.2,color:"#ffffff",marginTop:25,marginX:60,maxLines:3},logo:{height:45,marginBottom:25}}},facebook:{name:"Facebook",icon:(0,u.jsx)(uh.Icon,{icon:"facebook",library:"brands",size:"12px"}),width:1200,height:630,layout:{backgroundColor:"#000000",image:{top:0,maxHeight:380},title:{fontFamily:dh,fontSize:44,lineHeight:1.2,color:"#ffffff",marginTop:25,marginX:60,maxLines:3},logo:{height:45,marginBottom:25}}},linkedin:{name:"LinkedIn",icon:(0,u.jsx)(uh.Icon,{icon:"linkedin",library:"brands",size:"12px"}),width:1200,height:627,layout:{backgroundColor:"#000000",image:{top:0,maxHeight:375},title:{fontFamily:dh,fontSize:44,lineHeight:1.2,color:"#ffffff",marginTop:25,marginX:60,maxLines:3},logo:{height:45,marginBottom:25}}}},hh=Object.keys(ph),fh=e=>new Promise((t,n)=>{const r=new window.Image;r.crossOrigin="anonymous",r.onload=()=>t(r),r.onerror=()=>n(new Error(`Failed to load image: ${e}`)),r.src=e}),mh=(e,t)=>{const n={...e};for(const r of Object.keys(t))t[r]&&"object"==typeof t[r]&&!Array.isArray(t[r])?n[r]=mh(e[r]||{},t[r]):n[r]=t[r];return n};function gh(e,t){const n=(t||ph)[e];if(!n)throw new Error(`Unknown platform type: ${e}`);return n}const vh=async e=>{const{canvas:t,sourceImageUrl:n,title:r,platformType:i="instagram",layoutOverrides:o=null,logoSrc:s=null,platformSizes:a=null}=e||{},l=gh(i,a),{width:c,height:u}=l,d=o?mh(l.layout,o):l.layout;t.width=c,t.height=u;const p=t.getContext("2d");await document.fonts.ready,p.fillStyle=d.backgroundColor,p.fillRect(0,0,c,u);try{const e=await fh(n),t=e.width/e.height,i=c,o=Math.min(i/t,d.image.maxHeight),a=0,l=d.image.top;p.drawImage(e,a,l,i,o);const h=d.title;p.font=`bold ${h.fontSize}px ${h.fontFamily}`,p.fillStyle=h.color,p.textAlign="center",p.textBaseline="top";const f=c-2*h.marginX,m=c/2,g=l+o+h.marginTop,v=((e,t,n,r=4)=>{const i=t.split(" "),o=[];let s="";for(const t of i){const i=s?`${s} ${t}`:t;if(e.measureText(i).width>n&&s){if(o.push(s),s=t,o.length>=r){let t=o[o.length-1];for(;e.measureText(t+"...").width>n&&t.length>0;)t=t.slice(0,-1);return o[o.length-1]=t+"...",o}}else s=i}return s&&o.length<r&&o.push(s),o})(p,r,f,h.maxLines),x=h.fontSize*h.lineHeight;if(v.forEach((e,t)=>{p.fillText(e,m,g+t*x)}),s&&d.logo){const e=await fh(s),t=d.logo,n=e.width/e.height,r=t.height,i=r*n,o=(c-i)/2,a=u-t.marginBottom-r;p.drawImage(e,o,a,i,r)}}catch(e){p.fillStyle="#666",p.font="24px sans-serif",p.textAlign="center",p.textBaseline="middle",p.fillText("Image not available",c/2,u/2)}},xh=async e=>{const{sourceImageUrl:t,title:n,platformType:r="instagram",layoutOverrides:i=null,logoSrc:o=null,platformSizes:s=null}=e||{};gh(r,s);const a=document.createElement("canvas");return await vh({canvas:a,sourceImageUrl:t,title:n,platformType:r,layoutOverrides:i,logoSrc:o,platformSizes:s}),new Promise((e,t)=>{a.toBlob(n=>{n?e(n):t(new Error("Failed to generate image blob"))},"image/png",1)})},yh=async e=>{const{sourceImageUrl:t,title:n,platformType:r,filename:i,layoutOverrides:o=null,logoSrc:s=null,platformSizes:a=null}=e||{},l=await xh({sourceImageUrl:t,title:n,platformType:r,layoutOverrides:o,logoSrc:s,platformSizes:a});return new File([l],i,{type:"image/png"})},bh=(0,g.createElement)(v.SVG,{viewBox:"0 0 24 24",xmlns:"http://www.w3.org/2000/svg"},(0,g.createElement)(v.Path,{d:"M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z"})),wh=(0,g.createElement)(v.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,g.createElement)(v.Path,{d:"m11.3 17.2-5-5c-.1-.1-.1-.3 0-.4l2.3-2.3-1.1-1-2.3 2.3c-.7.7-.7 1.8 0 2.5l5 5H7.5v1.5h5.3v-5.2h-1.5v2.6zm7.5-6.4-5-5h2.7V4.2h-5.2v5.2h1.5V6.8l5 5c.1.1.1.3 0 .4l-2.3 2.3 1.1 1.1 2.3-2.3c.6-.7.6-1.9-.1-2.5z"}));function jh({color:e,onChange:n,label:r}){const[i,o]=(0,t.useState)(!1);return(0,u.jsxs)("div",{className:"prc-social-image-generator__color-picker",children:[(0,u.jsx)("span",{style:{fontSize:"11px",fontWeight:500,textTransform:"uppercase",display:"block",marginBottom:"8px"},children:r}),(0,u.jsxs)(w.Flex,{gap:2,children:[(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Button,{onClick:()=>o(!i),style:{padding:"4px",border:"1px solid #ccc",borderRadius:"4px",background:"#fff"},children:(0,u.jsx)(w.ColorIndicator,{colorValue:e})})}),(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)("span",{style:{fontSize:"12px",fontFamily:"monospace"},children:e})})]}),i&&(0,u.jsx)(w.Popover,{placement:"left-start",onClose:()=>o(!1),children:(0,u.jsx)("div",{style:{padding:"16px"},children:(0,u.jsx)(w.ColorPicker,{color:e,onChange:n,enableAlpha:!1})})})]})}const Sh=[{label:"Georgia (Default)",value:"Georgia, 'Times New Roman', Times, serif"},{label:"Franklin Gothic URW",value:"'franklin-gothic-urw', Verdana, Geneva, sans-serif"},{label:"Abril Text",value:"'abril-text', Georgia, 'Times New Roman', Times, serif"}];function kh({layout:e,updateLayout:t}){return(0,u.jsx)(w.Panel,{children:(0,u.jsxs)(w.PanelBody,{title:(0,y.__)("Colors","prc-platform-core"),initialOpen:!0,children:[(0,u.jsx)(w.PanelRow,{children:(0,u.jsx)(jh,{label:(0,y.__)("Background Color","prc-platform-core"),color:e.backgroundColor,onChange:e=>t("root","backgroundColor",e)})}),(0,u.jsx)(w.PanelRow,{children:(0,u.jsx)(jh,{label:(0,y.__)("Text Color","prc-platform-core"),color:e.title.color,onChange:e=>t("title","color",e)})})]})})}function Ah({layout:e,updateLayout:t}){return(0,u.jsx)(w.Panel,{children:(0,u.jsx)(w.PanelBody,{title:(0,y.__)("Image Position","prc-platform-core"),initialOpen:!0,children:(0,u.jsxs)(w.__experimentalVStack,{spacing:3,children:[(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Top Offset","prc-platform-core"),value:e.image.top,onChange:e=>{t("image","top",parseInt(e,10)||0)},min:0,max:500}),(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Max Height","prc-platform-core"),value:e.image.maxHeight,onChange:e=>t("image","maxHeight",parseInt(e,10)||100),min:100,max:1200})]})})})}function Th({layout:e,updateLayout:t,fontFamilyOptions:n=Sh}){return(0,u.jsx)(w.Panel,{children:(0,u.jsx)(w.PanelBody,{title:(0,y.__)("Title Text","prc-platform-core"),initialOpen:!0,children:(0,u.jsxs)(w.__experimentalVStack,{spacing:3,children:[(0,u.jsx)(w.SelectControl,{label:(0,y.__)("Font Family","prc-platform-core"),value:e.title.fontFamily,options:n,onChange:e=>t("title","fontFamily",e)}),(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Font Size","prc-platform-core"),value:e.title.fontSize,onChange:e=>t("title","fontSize",parseInt(e,10)||48),min:24,max:120}),(0,u.jsx)(w.RangeControl,{label:(0,y.__)("Line Height","prc-platform-core"),value:e.title.lineHeight,onChange:e=>t("title","lineHeight",e),min:.8,max:2,step:.05}),(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Margin Top","prc-platform-core"),value:e.title.marginTop,onChange:e=>t("title","marginTop",parseInt(e,10)||0),min:0,max:200}),(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Horizontal Margin","prc-platform-core"),value:e.title.marginX,onChange:e=>t("title","marginX",parseInt(e,10)||0),min:0,max:200}),(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Max Lines","prc-platform-core"),value:e.title.maxLines,onChange:e=>t("title","maxLines",parseInt(e,10)||1),min:1,max:8})]})})})}function Ch({layout:e,updateLayout:t}){return(0,u.jsx)(w.Panel,{children:(0,u.jsx)(w.PanelBody,{title:(0,y.__)("Logo","prc-platform-core"),initialOpen:!1,children:(0,u.jsxs)(w.__experimentalVStack,{spacing:3,children:[(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Logo Height","prc-platform-core"),value:e.logo.height,onChange:e=>t("logo","height",parseInt(e,10)||30),min:20,max:150}),(0,u.jsx)(w.__experimentalNumberControl,{label:(0,y.__)("Bottom Margin","prc-platform-core"),value:e.logo.marginBottom,onChange:e=>t("logo","marginBottom",parseInt(e,10)||0),min:0,max:200})]})})})}function Ph({sourceImageUrl:e,hasOverride:t=!1,onSelectOverride:n,onClearOverride:r}){const i="function"==typeof n;return(0,u.jsx)(w.Panel,{children:(0,u.jsx)(w.PanelBody,{title:(0,y.__)("Source Image","prc-platform-core"),initialOpen:!0,children:(0,u.jsxs)(w.__experimentalVStack,{spacing:3,children:[i&&(0,u.jsx)(w.__experimentalText,{style:{fontSize:"12px",color:t?"#1e1e1e":"#757575"},children:t?(0,y.__)("Using: Custom Image","prc-platform-core"):(0,y.__)("Using: Featured Image","prc-platform-core")}),e&&(0,u.jsx)("div",{style:{width:"100%",maxWidth:"200px",borderRadius:"4px",overflow:"hidden",border:"1px solid #ddd"},children:(0,u.jsx)("img",{src:e,alt:(0,y.__)("Source image","prc-platform-core"),style:{width:"100%",height:"auto",display:"block"}})}),i&&(0,u.jsxs)(w.Flex,{gap:2,wrap:!0,children:[(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(b.MediaUploadCheck,{children:(0,u.jsx)(b.MediaUpload,{onSelect:e=>{e?.id&&e?.url&&n&&n({id:e.id,url:e.sizes?.full?.url||e.url||e.source_url})},allowedTypes:["image"],render:({open:e})=>(0,u.jsx)(w.Button,{variant:"secondary",onClick:e,icon:bh,size:"compact",children:t?(0,y.__)("Change Image","prc-platform-core"):(0,y.__)("Use Different Image","prc-platform-core")})})})}),t&&r&&(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Button,{variant:"tertiary",onClick:r,icon:wh,size:"compact",children:(0,y.__)("Revert to Featured","prc-platform-core")})})]})]})})})}const _h=Ze.div`
	font-family: Helvetica, Arial, sans-serif;
	margin-bottom: 1rem;
`,Eh=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #65676b;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Mh=Ze.div`
	background: #ffffff;
	max-width: 500px;
	border: 1px solid #dadde1;
	border-radius: 8px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	overflow: hidden;
`,Rh=Ze.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 12px 16px 0;
`,zh=Ze.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #e4e6eb;
`,Ih=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Lh=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #0866ff;
	color: white;
	font-size: 16px;
	font-weight: 700;
`,Bh=Ze.div`
	flex: 1;
	min-width: 0;
`,Oh=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
`,Vh=Ze.span`
	font-size: 15px;
	font-weight: 600;
	color: #050505;
	line-height: 1.33;
`,Dh=Ze.svg`
	width: 15px;
	height: 15px;
	flex-shrink: 0;
`,Fh=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 13px;
	color: #65676b;
	line-height: 1.23;
`,Nh=Ze.svg`
	width: 12px;
	height: 12px;
`,Uh=Ze.button`
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	color: #65676b;
	font-size: 20px;
	line-height: 1;
	margin-left: auto;
	border-radius: 50%;
	&:hover {
		background-color: #f0f2f5;
	}
`,$h=Ze.div`
	padding: 4px 16px 12px;
	font-size: 15px;
	color: #050505;
	line-height: 1.33;
	word-wrap: break-word;
`,Hh=Ze.span`
	white-space: pre-wrap;
`,Wh=Ze.span`
	font-weight: 600;
	color: #050505;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`,Gh=Ze.div`
	width: 100%;
	background: #f0f2f5;
`,qh=Ze.img`
	width: 100%;
	height: auto;
	display: block;
`,Kh=Ze.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 10px 16px;
`,Xh=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
`,Yh=Ze.div`
	display: flex;
	align-items: center;
`,Zh=Ze.div`
	width: 18px;
	height: 18px;
	border-radius: 50%;
	background: ${e=>e.bg};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 11px;
	margin-left: -4px;
	border: 2px solid #ffffff;
	z-index: ${e=>e.zIndex};
	&:first-of-type {
		margin-left: 0;
	}
`,Qh=Ze.span`
	font-size: 15px;
	color: #65676b;
	margin-left: 4px;
`,Jh=Ze.div`
	font-size: 15px;
	color: #65676b;
`,ef=Ze.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 4px 8px;
	border-top: 1px solid #dadde1;
`,tf=Ze.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 6px;
	background: none;
	border: none;
	padding: 12px 4px;
	cursor: pointer;
	color: #65676b;
	font-size: 15px;
	font-weight: 600;
	border-radius: 4px;
	transition: background-color 0.2s;
	flex: 1;

	&:hover {
		background-color: #f0f2f5;
	}

	svg {
		width: 20px;
		height: 20px;
	}
`;function nf({description:e,image:t,children:n,displayName:r="Pew Research Center",profilePicture:i,postText:o,timestamp:s="5h",verified:a=!0,reactions:l=0,comments:c=0,shares:d=0}){const p=o||e,h=p.length>200,f=h?p.slice(0,200):p,m=[];c>0&&m.push(`${c} comment${1!==c?"s":""}`),d>0&&m.push(`${d} share${1!==d?"s":""}`);const g=m.join("   "),v=l>0||g;return(0,u.jsxs)(_h,{children:[(0,u.jsx)(Eh,{children:"Facebook"}),(0,u.jsxs)(Mh,{children:[(0,u.jsxs)(Rh,{children:[(0,u.jsx)(zh,{children:i?(0,u.jsx)(Ih,{src:i,alt:""}):(0,u.jsx)(Lh,{children:r.charAt(0).toUpperCase()})}),(0,u.jsxs)(Bh,{children:[(0,u.jsxs)(Oh,{children:[(0,u.jsx)(Vh,{children:r}),a&&(0,u.jsxs)(Dh,{viewBox:"0 0 16 16","aria-label":"Verified",children:[(0,u.jsx)("circle",{cx:"8",cy:"8",r:"8",fill:"#0866ff"}),(0,u.jsx)("path",{d:"M6.53 9.97L4.5 7.94l-.88.89 2.91 2.91 6.24-6.24-.88-.89z",fill:"#ffffff"})]})]}),(0,u.jsxs)(Fh,{children:[(0,u.jsx)("span",{children:s}),(0,u.jsx)("span",{children:"·"}),(0,u.jsx)(Nh,{viewBox:"0 0 16 16",fill:"currentColor",children:(0,u.jsx)("path",{d:"M8 0a8 8 0 1 0 8 8 8 8 0 0 0-8-8zm5.91 7H11.3a14.2 14.2 0 0 0-.93-4.38A6 6 0 0 1 13.91 7zM8 14c-.58 0-1.57-1.85-1.74-5h3.48c-.17 3.15-1.16 5-1.74 5zm-1.74-7c.17-3.15 1.16-5 1.74-5s1.57 1.85 1.74 5zm-.63-4.38A14.2 14.2 0 0 0 4.7 7H2.09a6 6 0 0 1 3.54-4.38zM2.09 9H4.7a14.2 14.2 0 0 0 .93 4.38A6 6 0 0 1 2.09 9zm8.28 4.38a14.2 14.2 0 0 0 .93-4.38h2.61a6 6 0 0 1-3.54 4.38z"})})]})]}),(0,u.jsx)(Uh,{"aria-label":"More options",children:"···"})]}),(0,u.jsxs)($h,{children:[(0,u.jsx)(Hh,{children:f}),h&&(0,u.jsx)(Wh,{children:"... See more"})]}),(t||n)&&(0,u.jsx)(Gh,{children:n||(0,u.jsx)(qh,{src:t,alt:""})}),v&&(0,u.jsxs)(Kh,{children:[(0,u.jsx)(Xh,{children:l>0&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(Yh,{children:[(0,u.jsx)(Zh,{bg:"#0866ff",zIndex:3,children:"👍"}),(0,u.jsx)(Zh,{bg:"#f7b928",zIndex:2,children:"😢"}),(0,u.jsx)(Zh,{bg:"#f7b928",zIndex:1,children:"🤗"})]}),(0,u.jsx)(Qh,{children:l})]})}),g&&(0,u.jsx)(Jh,{children:g})]}),(0,u.jsxs)(ef,{children:[(0,u.jsxs)(tf,{"aria-label":"Like",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M18.8 5.1c-1.7-1.7-4.5-1.7-6.2 0l-.6.6-.6-.6c-1.7-1.7-4.5-1.7-6.2 0-1.8 1.8-1.8 4.7 0 6.5l6.8 6.8 6.8-6.8c1.8-1.8 1.8-4.7 0-6.5z"})}),(0,u.jsx)("span",{children:"Like"})]}),(0,u.jsxs)(tf,{"aria-label":"Comment",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M12 2C6.48 2 2 6.04 2 11c0 2.13.73 4.08 2 5.68V22l4.5-2.54c1.1.35 2.27.54 3.5.54 5.52 0 10-4.04 10-9s-4.48-9-10-9zm0 16c-1.13 0-2.21-.2-3.21-.57l-.53-.2-2.26 1.28v-2.46l-.5-.44C4.54 14.46 4 12.78 4 11c0-3.86 3.59-7 8-7s8 3.14 8 7-3.59 7-8 7z"})}),(0,u.jsx)("span",{children:"Comment"})]}),(0,u.jsxs)(tf,{"aria-label":"Share",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M12 2l-8 8h5v6h6v-6h5l-8-8zm-7 16v2h14v-2H5z"})}),(0,u.jsx)("span",{children:"Share"})]})]})]})]})}const rf=Ze.div`
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
		sans-serif;
	margin-bottom: 1rem;
`,of=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #536471;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,sf=Ze.div`
	background: #ffffff;
	max-width: 500px;
	padding: 12px 16px;
	border: 1px solid #cfd9de;
	border-radius: 16px;
`,af=Ze.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 4px;
`,lf=Ze.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #cfd9de;
`,cf=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,uf=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #1d9bf0;
	color: white;
	font-size: 18px;
	font-weight: 700;
`,df=Ze.div`
	flex: 1;
	min-width: 0;
`,pf=Ze.div`
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 4px;
	line-height: 1.25;
`,hf=Ze.span`
	font-size: 15px;
	font-weight: 700;
	color: #0f1419;
`,ff=Ze.svg`
	width: 18px;
	height: 18px;
	flex-shrink: 0;
`,mf=Ze.span`
	font-size: 15px;
	color: #536471;
`,gf=Ze.button`
	background: none;
	border: none;
	padding: 0;
	color: #536471;
	cursor: pointer;
	margin-left: auto;
	font-size: 18px;
	line-height: 1;
`,vf=Ze.div`
	font-size: 15px;
	color: #0f1419;
	line-height: 1.4;
	margin-bottom: 12px;
	word-wrap: break-word;
	white-space: pre-wrap;
`,xf=Ze.div`
	border: 1px solid #cfd9de;
	border-radius: 16px;
	overflow: hidden;
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: rgba(0, 0, 0, 0.03);
	}
`,yf=Ze.div`
	width: 100%;
	height: 0;
	padding-bottom: 52.25%; /* Twitter card aspect ratio */
	position: relative;
	overflow: hidden;
	background: #f7f9f9;
`,bf=Ze.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`,wf=Ze.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background: rgba(0, 0, 0, 0.77);
	padding: 8px 12px;
`,jf=Ze.div`
	font-size: 15px;
	font-weight: 400;
	color: #ffffff;
	line-height: 1.3;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
`,Sf=Ze.div`
	padding: 12px;
	font-size: 13px;
	color: #536471;
`,kf=Ze.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	margin-top: 12px;
	max-width: 425px;
`,Af=Ze.button`
	display: flex;
	align-items: center;
	gap: 4px;
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	color: #536471;
	font-size: 13px;
	transition: color 0.2s;

	&:hover {
		color: #1d9bf0;
	}

	svg {
		width: 18.75px;
		height: 18.75px;
	}
`,Tf=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
`;function Cf({title:e,description:t,url:n,image:r,children:i,displayName:o="Pew Research Center",username:s="pewresearch",profilePicture:a,tweetText:l,verified:c=!0,timestamp:d="1m",likes:p=0,replies:h=0}){const f=g.useMemo(()=>{try{return new URL(n).hostname.replace("www.","")}catch{return n}},[n]),m=e.length>70?`${e.slice(0,67)}...`:e,v=l||t,x=s.startsWith("@")?s:`@${s}`;return(0,u.jsxs)(rf,{children:[(0,u.jsx)(of,{children:"Twitter / X"}),(0,u.jsxs)(sf,{children:[(0,u.jsxs)(af,{children:[(0,u.jsx)(lf,{children:a?(0,u.jsx)(cf,{src:a,alt:""}):(0,u.jsx)(uf,{children:o.charAt(0).toUpperCase()})}),(0,u.jsx)(df,{children:(0,u.jsxs)(pf,{children:[(0,u.jsx)(hf,{children:o}),c&&(0,u.jsx)(ff,{viewBox:"0 0 22 22","aria-label":"Verified account",children:(0,u.jsx)("path",{fill:"#1d9bf0",d:"M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"})}),(0,u.jsxs)(mf,{children:[x," · ",d]})]})}),(0,u.jsx)(gf,{"aria-label":"More",children:"···"})]}),(0,u.jsx)(vf,{children:v}),(0,u.jsxs)(xf,{children:[(r||i)&&(0,u.jsxs)(yf,{children:[i||(0,u.jsx)(bf,{src:r,alt:""}),(0,u.jsx)(wf,{children:(0,u.jsx)(jf,{children:m})})]}),(0,u.jsxs)(Sf,{children:["From ",f]})]}),(0,u.jsxs)(kf,{children:[(0,u.jsxs)(Af,{"aria-label":"Reply",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z",fill:"currentColor"})}),h>0&&(0,u.jsx)("span",{children:h})]}),(0,u.jsx)(Af,{"aria-label":"Repost",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z",fill:"currentColor"})})}),(0,u.jsxs)(Af,{"aria-label":"Like",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z",fill:"currentColor"})}),p>0&&(0,u.jsx)("span",{children:p})]}),(0,u.jsx)(Af,{"aria-label":"View analytics",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M8.75 21V3h2v18h-2zM18 21V8.5h2V21h-2zM4 21l.004-10h2L6 21H4zm9.248 0v-7h2v7h-2z",fill:"currentColor"})})}),(0,u.jsxs)(Tf,{children:[(0,u.jsx)(Af,{"aria-label":"Bookmark",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z",fill:"currentColor"})})}),(0,u.jsx)(Af,{"aria-label":"Share",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z",fill:"currentColor"})})})]})]})]})]})}const Pf=Ze.div`
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
		sans-serif;
	margin-bottom: 1rem;
`,_f=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #737373;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Ef=Ze.div`
	border: 1px solid #dbdbdb;
	border-radius: 12px;
	overflow: hidden;
	background: #ffffff;
	max-width: 400px;
`,Mf=Ze.div`
	width: 100%;
	height: 0;
	padding-bottom: 100%; /* Square aspect ratio for Threads */
	position: relative;
	overflow: hidden;
	background: #fafafa;
`,Rf=Ze.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`,zf=Ze.div`
	padding: 12px;
`,If=Ze.div`
	font-size: 14px;
	font-weight: 600;
	color: #262626;
	line-height: 1.4;
	margin-bottom: 4px;
	word-wrap: break-word;
`,Lf=Ze.div`
	font-size: 14px;
	color: #737373;
	line-height: 1.4;
	margin-bottom: 8px;
	word-wrap: break-word;
`,Bf=Ze.div`
	font-size: 12px;
	color: #737373;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`;function Of({title:e,description:t,url:n,image:r,children:i}){const o=g.useMemo(()=>{try{return new URL(n).hostname.replace("www.","")}catch{return n}},[n]),s=e.length>60?`${e.slice(0,57)}...`:e,a=t.length>100?`${t.slice(0,97)}...`:t;return(0,u.jsxs)(Pf,{children:[(0,u.jsx)(_f,{children:"Threads"}),(0,u.jsxs)(Ef,{children:[(r||i)&&(0,u.jsx)(Mf,{children:i||(0,u.jsx)(Rf,{src:r,alt:""})}),(0,u.jsxs)(zf,{children:[(0,u.jsx)(If,{children:s}),(0,u.jsx)(Lf,{children:a}),(0,u.jsx)(Bf,{children:o})]})]})]})}const Vf=Ze.div`
	font-family:
		-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial,
		sans-serif;
	margin-bottom: 1rem;
`,Df=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #0085ff;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Ff=Ze.div`
	background: #ffffff;
	max-width: 500px;
	padding: 16px;
	border: 1px solid #e0e0e0;
	border-radius: 12px;
`,Nf=Ze.div`
	display: flex;
	align-items: flex-start;
	gap: 10px;
	margin-bottom: 8px;
`,Uf=Ze.div`
	width: 42px;
	height: 42px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #e0e0e0;
`,$f=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Hf=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #0085ff;
	color: white;
	font-size: 18px;
	font-weight: 700;
`,Wf=Ze.div`
	flex: 1;
	min-width: 0;
`,Gf=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
	line-height: 1.25;
`,qf=Ze.span`
	font-size: 15px;
	font-weight: 700;
	color: #000000;
`,Kf=Ze.svg`
	width: 16px;
	height: 16px;
	flex-shrink: 0;
`,Xf=Ze.div`
	font-size: 14px;
	color: #666666;
	margin-top: 1px;
`,Yf=Ze.div`
	font-size: 15px;
	color: #000000;
	line-height: 1.5;
	margin-bottom: 12px;
	word-wrap: break-word;
	white-space: pre-wrap;
`,Zf=Ze.div`
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	cursor: pointer;
	transition: background-color 0.2s;
	&:hover {
		background-color: rgba(0, 0, 0, 0.02);
	}
`,Qf=Ze.div`
	width: 100%;
	height: 0;
	padding-bottom: 52.5%;
	position: relative;
	overflow: hidden;
	background: #f5f5f5;
`,Jf=Ze.img`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	object-fit: cover;
`,em=Ze.div`
	padding: 12px;
`,tm=Ze.div`
	font-size: 15px;
	font-weight: 700;
	color: #000000;
	line-height: 1.3;
	margin-bottom: 4px;
	word-wrap: break-word;
`,nm=Ze.div`
	font-size: 14px;
	color: #666666;
	line-height: 1.4;
	margin-bottom: 8px;
	word-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`,rm=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 13px;
	color: #666666;
`,im=Ze.svg`
	width: 14px;
	height: 14px;
	flex-shrink: 0;
`,om=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
	padding: 12px 0;
	margin-top: 12px;
	border-top: 1px solid #e0e0e0;
	font-size: 14px;
	color: #666666;
`,sm=Ze.span`
	color: #666666;
`,am=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
`,lm=(Ze.div`
	display: flex;
	align-items: center;
	gap: 16px;
	padding: 12px 0;
	border-top: 1px solid #e0e0e0;
	font-size: 14px;
	color: #666666;
`,Ze.span`
	& strong {
		font-weight: 700;
		color: #000000;
	}
`,Ze.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding-top: 12px;
	border-top: 1px solid #e0e0e0;
`),cm=Ze.button`
	display: flex;
	align-items: center;
	gap: 6px;
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	color: #666666;
	font-size: 13px;
	border-radius: 25%;
	transition: all 0.2s;

	&:hover {
		background-color: rgba(0, 133, 255, 0.1);
		color: #0085ff;
	}

	svg {
		width: 20px;
		height: 20px;
	}
`,um=Ze.span`
	font-size: 13px;
	min-width: 16px;
`;function dm({title:e,description:t,url:n,image:r,children:i,displayName:o="Pew Research Center",handle:s="pewresearch.org",profilePicture:a,postText:l,verified:c=!0,timestamp:d="10:51 AM · Dec 9, 2025",likes:p=0,reposts:h=0,quotes:f=0,replies:m=0,saves:v=0}){const x=g.useMemo(()=>{try{const e=new URL(n).hostname;return e.startsWith("www.")?e:`www.${e}`}catch{return n}},[n]),y=e.length>70?`${e.slice(0,67)}...`:e,b=t.length>150?`${t.slice(0,147)}...`:t,w=l||t,j=s.startsWith("@")?s:`@${s}`;return(0,u.jsxs)(Vf,{children:[(0,u.jsx)(Df,{children:"Bluesky"}),(0,u.jsxs)(Ff,{children:[(0,u.jsxs)(Nf,{children:[(0,u.jsx)(Uf,{children:a?(0,u.jsx)($f,{src:a,alt:""}):(0,u.jsx)(Hf,{children:o.charAt(0).toUpperCase()})}),(0,u.jsxs)(Wf,{children:[(0,u.jsxs)(Gf,{children:[(0,u.jsx)(qf,{children:o}),c&&(0,u.jsx)(Kf,{viewBox:"0 0 24 24","aria-label":"Verified account",children:(0,u.jsx)("path",{fill:"#0085ff",d:"M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z"})})]}),(0,u.jsx)(Xf,{children:j})]})]}),(0,u.jsx)(Yf,{children:w}),(0,u.jsxs)(Zf,{children:[(r||i)&&(0,u.jsx)(Qf,{children:i||(0,u.jsx)(Jf,{src:r,alt:""})}),(0,u.jsxs)(em,{children:[(0,u.jsx)(tm,{children:y}),(0,u.jsx)(nm,{children:b}),(0,u.jsxs)(rm,{children:[(0,u.jsx)(im,{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"})}),(0,u.jsx)("span",{children:x})]})]})]}),(0,u.jsxs)(om,{children:[(0,u.jsx)("span",{children:d}),(0,u.jsx)(sm,{children:"·"}),(0,u.jsxs)(am,{children:[(0,u.jsx)(im,{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"})}),(0,u.jsx)("span",{children:"Everybody can reply"})]})]}),(0,u.jsxs)(lm,{children:[(0,u.jsxs)(cm,{"aria-label":"Reply",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M1.751 10c0-4.42 3.584-8 8.005-8h4.366c4.49 0 8.129 3.64 8.129 8.13 0 2.96-1.607 5.68-4.196 7.11l-8.054 4.46v-3.69h-.067c-4.49.1-8.183-3.51-8.183-8.01zm8.005-6c-3.317 0-6.005 2.69-6.005 6 0 3.37 2.77 6.08 6.138 6.01l.351-.01h1.761v2.3l5.087-2.81c1.951-1.08 3.163-3.13 3.163-5.36 0-3.39-2.744-6.13-6.129-6.13H9.756z",fill:"currentColor"})}),m>0&&(0,u.jsx)(um,{children:m})]}),(0,u.jsxs)(cm,{"aria-label":"Repost",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M4.5 3.88l4.432 4.14-1.364 1.46L5.5 7.55V16c0 1.1.896 2 2 2H13v2H7.5c-2.209 0-4-1.79-4-4V7.55L1.432 9.48.068 8.02 4.5 3.88zM16.5 6H11V4h5.5c2.209 0 4 1.79 4 4v8.45l2.068-1.93 1.364 1.46-4.432 4.14-4.432-4.14 1.364-1.46 2.068 1.93V8c0-1.1-.896-2-2-2z",fill:"currentColor"})}),h>0&&(0,u.jsx)(um,{children:h})]}),(0,u.jsxs)(cm,{"aria-label":"Like",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M16.697 5.5c-1.222-.06-2.679.51-3.89 2.16l-.805 1.09-.806-1.09C9.984 6.01 8.526 5.44 7.304 5.5c-1.243.07-2.349.78-2.91 1.91-.552 1.12-.633 2.78.479 4.82 1.074 1.97 3.257 4.27 7.129 6.61 3.87-2.34 6.052-4.64 7.126-6.61 1.111-2.04 1.03-3.7.477-4.82-.561-1.13-1.666-1.84-2.908-1.91zm4.187 7.69c-1.351 2.48-4.001 5.12-8.379 7.67l-.503.3-.504-.3c-4.379-2.55-7.029-5.19-8.382-7.67-1.36-2.5-1.41-4.86-.514-6.67.887-1.79 2.647-2.91 4.601-3.01 1.651-.09 3.368.56 4.798 2.01 1.429-1.45 3.146-2.1 4.796-2.01 1.954.1 3.714 1.22 4.601 3.01.896 1.81.846 4.17-.514 6.67z",fill:"currentColor"})}),p>0&&(0,u.jsx)(um,{children:p})]}),(0,u.jsx)(cm,{"aria-label":"Save",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M4 4.5C4 3.12 5.119 2 6.5 2h11C18.881 2 20 3.12 20 4.5v18.44l-8-5.71-8 5.71V4.5zM6.5 4c-.276 0-.5.22-.5.5v14.56l6-4.29 6 4.29V4.5c0-.28-.224-.5-.5-.5h-11z",fill:"currentColor"})})}),(0,u.jsx)(cm,{"aria-label":"Share",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M12 2.59l5.7 5.7-1.41 1.42L13 6.41V16h-2V6.41l-3.3 3.3-1.41-1.42L12 2.59zM21 15l-.02 3.51c0 1.38-1.12 2.49-2.5 2.49H5.5C4.11 21 3 19.88 3 18.5V15h2v3.5c0 .28.22.5.5.5h12.98c.28 0 .5-.22.5-.5L19 15h2z",fill:"currentColor"})})}),(0,u.jsx)(cm,{"aria-label":"More options",children:(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"none",children:(0,u.jsx)("path",{d:"M3 12c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm9 2c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm7 0c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2z",fill:"currentColor"})})})]})]})]})}const pm=Ze.div`
	font-family: Slack-Lato, Lato, appleLogo, sans-serif;
	margin-bottom: 1rem;
`,hm=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #616061;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,fm=Ze.div`
	background: #ffffff;
	max-width: 500px;
	padding: 8px 16px;
`,mm=Ze.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-bottom: 4px;
`,gm=Ze.div`
	width: 36px;
	height: 36px;
	border-radius: 4px;
	overflow: hidden;
	flex-shrink: 0;
	background: #e8e8e8;
`,vm=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,xm=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #4a154b;
	color: white;
	font-size: 14px;
	font-weight: 700;
`,ym=Ze.div`
	display: flex;
	align-items: baseline;
	gap: 6px;
`,bm=Ze.span`
	font-size: 15px;
	font-weight: 900;
	color: #1d1c1d;
`,wm=Ze.span`
	font-size: 12px;
	color: #616061;
`,jm=Ze.div`
	font-size: 15px;
	color: #1d1c1d;
	line-height: 1.46668;
	margin-bottom: 4px;
	margin-left: 44px;
	word-wrap: break-word;
`,Sm=Ze.a`
	color: #1264a3;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`,km=Ze.div`
	margin-left: 44px;
	margin-top: 4px;
	border-left: 4px solid #e0e0e0;
	padding-left: 12px;
	max-width: 400px;
`,Am=Ze.div`
	display: flex;
	align-items: center;
	gap: 6px;
	margin-bottom: 4px;
`,Tm=Ze.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`,Cm=Ze.div`
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: #e8e8e8;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	font-weight: 700;
	color: #616061;
`,Pm=Ze.span`
	font-size: 13px;
	font-weight: 700;
	color: #1d1c1d;
`,_m=Ze.a`
	display: block;
	font-size: 15px;
	font-weight: 700;
	color: #1264a3;
	line-height: 1.375;
	margin-bottom: 4px;
	text-decoration: none;
	word-wrap: break-word;
	&:hover {
		text-decoration: underline;
	}
`,Em=Ze.div`
	font-size: 15px;
	color: #1d1c1d;
	line-height: 1.46668;
	margin-bottom: 8px;
	word-wrap: break-word;
`,Mm=Ze.div`
	display: flex;
	gap: 40px;
	margin-bottom: 8px;
`,Rm=Ze.div`
	display: flex;
	flex-direction: column;
	gap: 0;
`,zm=Ze.span`
	font-size: 13px;
	font-weight: 700;
	color: #1d1c1d;
`,Im=Ze.span`
	font-size: 13px;
	color: #1d1c1d;
`,Lm=Ze.div`
	width: 100%;
	max-width: 360px;
	border-radius: 8px;
	overflow: hidden;
	background: #f8f8f8;
`,Bm=Ze.img`
	width: 100%;
	height: auto;
	display: block;
`;function Om({title:e,description:t,url:n,image:r,favicon:i,siteName:o,children:s,displayName:a="Slack User",profilePicture:l,messageText:c,timestamp:d="1:36 PM",readingTime:p,author:h}){const f=g.useMemo(()=>{if(o)return o;try{return new URL(n).hostname.replace("www.","")}catch{return"Pew Research Center"}},[o,n]),m=c?`${c} `:"",v=p||h;return(0,u.jsxs)(pm,{children:[(0,u.jsx)(hm,{children:"Slack"}),(0,u.jsxs)(fm,{children:[(0,u.jsxs)(mm,{children:[(0,u.jsx)(gm,{children:l?(0,u.jsx)(vm,{src:l,alt:""}):(0,u.jsx)(xm,{children:a.charAt(0).toUpperCase()})}),(0,u.jsxs)(ym,{children:[(0,u.jsx)(bm,{children:a}),(0,u.jsx)(wm,{children:d})]})]}),(0,u.jsxs)(jm,{children:[m,(0,u.jsx)(Sm,{href:n,children:n})]}),(0,u.jsxs)(km,{children:[(0,u.jsxs)(Am,{children:[i?(0,u.jsx)(Tm,{src:i,alt:""}):(0,u.jsx)(Cm,{children:f.charAt(0).toUpperCase()}),(0,u.jsx)(Pm,{children:f})]}),(0,u.jsx)(_m,{href:n,children:e}),(0,u.jsx)(Em,{children:t}),v&&(0,u.jsxs)(Mm,{children:[p&&(0,u.jsxs)(Rm,{children:[(0,u.jsx)(zm,{children:"Est. reading time"}),(0,u.jsx)(Im,{children:p})]}),h&&(0,u.jsxs)(Rm,{children:[(0,u.jsx)(zm,{children:"Written by"}),(0,u.jsx)(Im,{children:h})]})]}),(r||s)&&(0,u.jsx)(Lm,{children:s||(0,u.jsx)(Bm,{src:r,alt:""})})]})]})]})}const Vm=Ze.div`
	font-family: Whitney, 'Helvetica Neue', Helvetica, Arial, sans-serif;
	margin-bottom: 1rem;
`,Dm=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #72767d;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Fm=Ze.div`
	border-left: 4px solid #5865f2;
	border-radius: 4px;
	background: #2f3136;
	max-width: 520px;
	overflow: hidden;
`,Nm=Ze.div`
	display: flex;
	gap: 16px;
	padding: 12px 8px 12px 12px;
`,Um=Ze.div`
	flex-shrink: 0;
	width: 80px;
	height: 80px;
	border-radius: 4px;
	overflow: hidden;
	background: #202225;
`,$m=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Hm=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #202225;
	color: #72767d;
	font-size: 24px;
	font-weight: 600;
`,Wm=Ze.div`
	flex: 1;
	min-width: 0;
`,Gm=Ze.div`
	font-size: 16px;
	font-weight: 600;
	color: #ffffff;
	line-height: 1.375;
	margin-bottom: 4px;
	word-wrap: break-word;
`,qm=Ze.div`
	font-size: 14px;
	color: #dcddde;
	line-height: 1.375;
	margin-bottom: 8px;
	word-wrap: break-word;
`,Km=Ze.div`
	display: flex;
	align-items: center;
	gap: 8px;
	margin-top: 8px;
`,Xm=Ze.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`,Ym=Ze.div`
	font-size: 12px;
	color: #72767d;
	font-weight: 500;
`;function Zm({title:e,description:t,url:n,image:r,favicon:i,siteName:o,children:s}){const a=g.useMemo(()=>{try{return new URL(n).hostname.replace("www.","")}catch{return n}},[n]),l=e.length>256?`${e.slice(0,253)}...`:e,c=t.length>2048?`${t.slice(0,2045)}...`:t,d=o||a;return(0,u.jsxs)(Vm,{children:[(0,u.jsx)(Dm,{children:"Discord"}),(0,u.jsx)(Fm,{children:(0,u.jsxs)(Nm,{children:[(0,u.jsx)(Um,{children:s||(r?(0,u.jsx)($m,{src:r,alt:""}):(0,u.jsx)(Hm,{children:d.charAt(0).toUpperCase()}))}),(0,u.jsxs)(Wm,{children:[(0,u.jsx)(Gm,{children:l}),(0,u.jsx)(qm,{children:c}),(0,u.jsxs)(Km,{children:[i&&(0,u.jsx)(Xm,{src:i,alt:""}),(0,u.jsx)(Ym,{children:d})]})]})]})})]})}const Qm=Ze.div`
	font-family: arial, sans-serif;
	margin-bottom: 1rem;
`,Jm=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #70757a;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,eg=Ze.div`
	max-width: 600px;
`,tg=Ze.div`
	display: flex;
	align-items: flex-start;
	gap: 12px;
	margin-bottom: 3px;
`,ng=Ze.div`
	flex-shrink: 0;
	width: 16px;
	height: 16px;
	margin-top: 2px;
`,rg=Ze.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`,ig=Ze.div`
	width: 16px;
	height: 16px;
	border-radius: 2px;
	background: #f1f3f4;
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	font-weight: 600;
	color: #70757a;
`,og=Ze.div`
	flex: 1;
	min-width: 0;
`,sg=Ze.div`
	font-size: 14px;
	color: #202124;
	line-height: 1.3;
	margin-bottom: 1px;
`,ag=Ze.div`
	font-size: 14px;
	color: #202124;
	line-height: 1.3;
	word-break: break-all;
`,lg=Ze.h3`
	font-size: 20px;
	font-weight: 400;
	color: #1a0dab;
	line-height: 1.3;
	margin: 3px 0 0 0;
	padding: 0;
	cursor: pointer;
	&:hover {
		text-decoration: underline;
	}
`,cg=Ze.div`
	font-size: 14px;
	color: #70757a;
	margin: 3px 0;
`,ug=Ze.p`
	font-size: 14px;
	color: #4d5156;
	line-height: 1.58;
	margin: 3px 0 0 0;
	word-wrap: break-word;
`;function dg({title:e,description:t,url:n,favicon:r,siteName:i}){const o=g.useMemo(()=>{try{return new URL(n).hostname.replace("www.","")}catch{return n}},[n]),s=e.length>60?`${e.slice(0,57)}...`:e,a=t.length>160?`${t.slice(0,157)}...`:t,l=i||o;return(0,u.jsxs)(Qm,{children:[(0,u.jsx)(Jm,{children:"Google"}),(0,u.jsxs)(eg,{children:[(0,u.jsxs)(tg,{children:[(0,u.jsx)(ng,{children:r?(0,u.jsx)(rg,{src:r,alt:""}):(0,u.jsx)(ig,{children:l.charAt(0).toUpperCase()})}),(0,u.jsxs)(og,{children:[(0,u.jsx)(sg,{children:l}),(0,u.jsx)(ag,{children:n})]})]}),(0,u.jsx)(lg,{children:s}),(0,u.jsxs)(cg,{children:[(0,u.jsx)("span",{children:"12 Sep 2025"}),(0,u.jsx)("span",{children:" · "})]}),(0,u.jsx)(ug,{children:a})]})]})}const pg=Ze.div`
	font-family:
		-apple-system, system-ui, BlinkMacSystemFont, 'Segoe UI', Roboto,
		'Helvetica Neue', 'Fira Sans', Ubuntu, Oxygen, 'Oxygen Sans', Cantarell,
		'Droid Sans', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol',
		'Lucida Grande', Helvetica, Arial, sans-serif;
	margin-bottom: 1rem;
`,hg=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #666666;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,fg=Ze.div`
	background: #ffffff;
	max-width: 552px;
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	box-shadow:
		0 0 0 1px rgba(0, 0, 0, 0.08),
		0 2px 4px rgba(0, 0, 0, 0.08);
	overflow: hidden;
`,mg=Ze.div`
	display: flex;
	align-items: flex-start;
	gap: 8px;
	padding: 12px 16px 0;
`,gg=Ze.div`
	width: 48px;
	height: 48px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #e0e0e0;
`,vg=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,xg=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #0a66c2;
	color: white;
	font-size: 18px;
	font-weight: 700;
`,yg=Ze.div`
	flex: 1;
	min-width: 0;
`,bg=Ze.div`
	font-size: 14px;
	font-weight: 600;
	color: #000000;
	line-height: 1.33;
`,wg=Ze.div`
	font-size: 12px;
	color: #666666;
	line-height: 1.33;
`,jg=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
	font-size: 12px;
	color: #666666;
	line-height: 1.33;
`,Sg=Ze.svg`
	width: 12px;
	height: 12px;
`,kg=Ze.button`
	background: none;
	border: none;
	padding: 4px;
	cursor: pointer;
	color: #666666;
	font-size: 20px;
	line-height: 1;
	margin-left: auto;
`,Ag=Ze.div`
	padding: 12px 16px;
	font-size: 14px;
	color: #000000;
	line-height: 1.43;
	white-space: pre-wrap;
	word-wrap: break-word;
`,Tg=Ze.a`
	color: #0a66c2;
	text-decoration: none;
	&:hover {
		text-decoration: underline;
	}
`,Cg=Ze.div`
	display: flex;
	background: #f3f2ef;
	border-top: 1px solid #e0e0e0;
	border-bottom: 1px solid #e0e0e0;
	cursor: pointer;
	&:hover {
		background: #e9e8e4;
	}
`,Pg=Ze.div`
	width: 128px;
	height: 128px;
	flex-shrink: 0;
	background: #e0e0e0;
	overflow: hidden;
`,_g=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Eg=Ze.div`
	flex: 1;
	padding: 12px;
	min-width: 0;
	display: flex;
	flex-direction: column;
	justify-content: center;
`,Mg=Ze.div`
	font-size: 14px;
	font-weight: 600;
	color: #000000;
	line-height: 1.43;
	margin-bottom: 4px;
	word-wrap: break-word;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
	overflow: hidden;
`,Rg=Ze.div`
	font-size: 12px;
	color: #666666;
`,zg=Ze.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	padding: 8px 16px;
	border-bottom: 1px solid #e0e0e0;
`,Ig=Ze.div`
	display: flex;
	align-items: center;
	gap: 4px;
`,Lg=Ze.div`
	display: flex;
	align-items: center;
`,Bg=Ze.div`
	width: 16px;
	height: 16px;
	border-radius: 50%;
	background: ${e=>e.color};
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 10px;
	margin-left: -4px;
	border: 1px solid #ffffff;
	z-index: ${e=>e.zIndex};
	&:first-of-type {
		margin-left: 0;
	}
`,Og=Ze.span`
	font-size: 12px;
	color: #666666;
	margin-left: 4px;
`,Vg=Ze.div`
	font-size: 12px;
	color: #666666;
`,Dg=Ze.div`
	display: flex;
	align-items: center;
	justify-content: space-around;
	padding: 4px 8px;
`,Fg=Ze.button`
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 4px;
	background: none;
	border: none;
	padding: 12px 8px;
	cursor: pointer;
	color: #666666;
	font-size: 14px;
	font-weight: 600;
	border-radius: 4px;
	transition: background-color 0.2s;
	flex: 1;

	&:hover {
		background-color: rgba(0, 0, 0, 0.08);
		color: #000000;
	}

	svg {
		width: 24px;
		height: 24px;
	}
`;function Ng({title:e,url:t,image:n,children:r,displayName:i="Pew Research Center",profilePicture:o,followers:s="166,244 followers",postText:a,timestamp:l="6h",shortUrl:c,reactions:d=0,comments:p=0,reposts:h=0}){const f=g.useMemo(()=>{try{return new URL(t).hostname.replace("www.","")}catch{return t}},[t]),m=[];p>0&&m.push(`${p} comment${1!==p?"s":""}`),h>0&&m.push(`${h} repost${1!==h?"s":""}`);const v=m.join(" · "),x=c||t;return(0,u.jsxs)(pg,{children:[(0,u.jsx)(hg,{children:"LinkedIn"}),(0,u.jsxs)(fg,{children:[(0,u.jsxs)(mg,{children:[(0,u.jsx)(gg,{children:o?(0,u.jsx)(vg,{src:o,alt:""}):(0,u.jsx)(xg,{children:i.charAt(0).toUpperCase()})}),(0,u.jsxs)(yg,{children:[(0,u.jsx)(bg,{children:i}),(0,u.jsx)(wg,{children:s}),(0,u.jsxs)(jg,{children:[(0,u.jsx)("span",{children:l}),(0,u.jsx)("span",{children:"·"}),(0,u.jsx)(Sg,{viewBox:"0 0 16 16",fill:"currentColor",children:(0,u.jsx)("path",{d:"M8 1a7 7 0 107 7 7 7 0 00-7-7zM3 8a5 5 0 011-3l.55.55A1.5 1.5 0 015 6.62v1.07a.75.75 0 00.22.53l.56.56a.75.75 0 00.53.22H7v.69a.75.75 0 00.22.53l.56.56a.75.75 0 01.22.53V13a5 5 0 01-5-5zm6.24 4.83l2-2.46a.75.75 0 00.09-.8l-.58-1.16A.76.76 0 0010 8H7v-.19a.51.51 0 01.28-.45l.38-.19a.74.74 0 01.68 0L9 7.5l.38-.7a1 1 0 00.12-.48v-.85a.78.78 0 01.21-.53l1.07-1.09a5 5 0 01-1.54 9z"})})]})]}),(0,u.jsx)(kg,{"aria-label":"More options",children:"···"})]}),(0,u.jsxs)(Ag,{children:[a,a&&"\n\n","Full analysis: ",(0,u.jsx)(Tg,{href:t,children:x})]}),(0,u.jsxs)(Cg,{children:[(n||r)&&(0,u.jsx)(Pg,{children:r||(0,u.jsx)(_g,{src:n,alt:""})}),(0,u.jsxs)(Eg,{children:[(0,u.jsx)(Mg,{children:e}),(0,u.jsx)(Rg,{children:f})]})]}),(d>0||v)&&(0,u.jsxs)(zg,{children:[(0,u.jsx)(Ig,{children:d>0&&(0,u.jsxs)(u.Fragment,{children:[(0,u.jsxs)(Lg,{children:[(0,u.jsx)(Bg,{color:"#0a66c2",zIndex:2,children:"👍"}),(0,u.jsx)(Bg,{color:"#dfb71c",zIndex:1,children:"👏"})]}),(0,u.jsx)(Og,{children:d})]})}),v&&(0,u.jsx)(Vg,{children:v})]}),(0,u.jsxs)(Dg,{children:[(0,u.jsxs)(Fg,{"aria-label":"Like",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M19.46 11l-3.91-3.91a7 7 0 01-1.69-2.74l-.49-1.47A2.76 2.76 0 0010.76 1 2.75 2.75 0 008 3.74v1.12a9.19 9.19 0 00.46 2.85L8.89 9H4.12A2.12 2.12 0 002 11.12a2.16 2.16 0 00.92 1.76A2.11 2.11 0 002 14.62a2.14 2.14 0 001.28 2 2 2 0 00-.28 1 2.12 2.12 0 002 2.12v.14A2.12 2.12 0 007.12 22h7.49a8.08 8.08 0 003.58-.84l.31-.16H21V11zM19 19h-1l-.73.37a6.14 6.14 0 01-2.69.63H7.72a1 1 0 01-1-.72l-.25-.87-.85-.41A1 1 0 015 17l.17-1-.76-.74A1 1 0 014.27 14l.66-1.09-.73-1.1a.49.49 0 01.08-.7.48.48 0 01.34-.11h7.05l-1.31-3.92A7 7 0 0110 4.87V3.75a.77.77 0 01.75-.75.75.75 0 01.71.51L12 5a9 9 0 002.13 3.5l4.5 4.5H19z"})}),(0,u.jsx)("span",{children:"Like"})]}),(0,u.jsxs)(Fg,{"aria-label":"Comment",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M7 9h10v1H7zm0 4h7v-1H7zm16-2a6.78 6.78 0 01-2.84 5.61L12 22v-4H8A7 7 0 018 4h8a7 7 0 017 7zm-2 0a5 5 0 00-5-5H8a5 5 0 000 10h6v2.28L18 16a4.79 4.79 0 003-4.42z"})}),(0,u.jsx)("span",{children:"Comment"})]}),(0,u.jsxs)(Fg,{"aria-label":"Repost",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M13.96 5H6c-1.1 0-2 .9-2 2v5h2V7h7.96l-2.46 2.46 1.41 1.42L17.79 6l-4.88-4.88-1.41 1.42L13.96 5zM10.04 19H18c1.1 0 2-.9 2-2v-5h-2v5h-7.96l2.46-2.46-1.41-1.42L6.21 18l4.88 4.88 1.41-1.42L10.04 19z"})}),(0,u.jsx)("span",{children:"Repost"})]}),(0,u.jsxs)(Fg,{"aria-label":"Send",children:[(0,u.jsx)("svg",{viewBox:"0 0 24 24",fill:"currentColor",children:(0,u.jsx)("path",{d:"M21 3L0 10l7.66 4.26L16 8l-6.26 8.34L14 24l7-21z"})}),(0,u.jsx)("span",{children:"Send"})]})]})]})]})}const Ug=Ze.div`
	font-family:
		'Segoe UI',
		-apple-system,
		BlinkMacSystemFont,
		Roboto,
		'Helvetica Neue',
		sans-serif;
	margin-bottom: 1rem;
`,$g=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #605e5c;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Hg=Ze.div`
	border: 1px solid #e0e0e0;
	border-radius: 8px;
	overflow: hidden;
	background: #ffffff;
	max-width: 500px;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
	position: relative;
`,Wg=Ze.div`
	display: flex;
	gap: 16px;
	padding: 12px;
`,Gg=Ze.div`
	flex-shrink: 0;
	width: 160px;
	height: 100px;
	border-radius: 4px;
	overflow: hidden;
	background: #f3f2f1;
`,qg=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Kg=Ze.div`
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	background: #f3f2f1;
	color: #605e5c;
	font-size: 32px;
	font-weight: 600;
`,Xg=(Ze.div`
	position: absolute;
	top: 8px;
	right: 8px;
	width: 24px;
	height: 24px;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #605e5c;
	font-size: 16px;
	cursor: pointer;
	border-radius: 4px;

	&:hover {
		background: #f3f2f1;
	}
`,Ze.div`
	flex: 1;
	min-width: 0;
`),Yg=Ze.div`
	font-size: 15px;
	font-weight: 600;
	color: #323130;
	line-height: 1.4;
	margin-bottom: 4px;
	word-wrap: break-word;
`,Zg=Ze.div`
	font-size: 14px;
	color: #605e5c;
	line-height: 1.4;
	margin-bottom: 8px;
	word-wrap: break-word;
`,Qg=Ze.div`
	font-size: 12px;
	color: #605e5c;
	display: flex;
	align-items: center;
	gap: 6px;
`,Jg=Ze.img`
	width: 16px;
	height: 16px;
	border-radius: 2px;
`;function ev({title:e,description:t,url:n,image:r,favicon:i,siteName:o,children:s}){const a=g.useMemo(()=>{try{return new URL(n).hostname}catch{return n}},[n]),l=e.length>60?`${e.slice(0,57)}...`:e,c=t.length>200?`${t.slice(0,197)}...`:t,d=o||a;return(0,u.jsxs)(Ug,{children:[(0,u.jsx)($g,{children:"Microsoft Teams"}),(0,u.jsx)(Hg,{children:(0,u.jsxs)(Wg,{children:[(0,u.jsx)(Gg,{children:s||(r?(0,u.jsx)(qg,{src:r,alt:""}):(0,u.jsx)(Kg,{children:d.charAt(0).toUpperCase()}))}),(0,u.jsxs)(Xg,{children:[(0,u.jsx)(Yg,{children:l}),(0,u.jsx)(Zg,{children:c}),(0,u.jsxs)(Qg,{children:[i&&(0,u.jsx)(Jg,{src:i,alt:""}),(0,u.jsx)("span",{children:d})]})]})]})})]})}const tv=Ze.div`
	font-family:
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Helvetica,
		Arial,
		sans-serif;
	margin-bottom: 1rem;
`,nv=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #737373;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,rv=Ze.div`
	width: 270px;
	height: 480px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
	background: #000000;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`,iv=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,ov=Ze.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 50%, #fcb045 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 48px;
`,sv=Ze.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 100px;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.6) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`,av=Ze.div`
	position: absolute;
	top: 8px;
	left: 8px;
	right: 8px;
	height: 2px;
	background: rgba(255, 255, 255, 0.3);
	border-radius: 1px;
`,lv=Ze.div`
	width: 30%;
	height: 100%;
	background: #ffffff;
	border-radius: 1px;
`,cv=Ze.div`
	position: absolute;
	top: 16px;
	left: 12px;
	right: 12px;
	display: flex;
	align-items: center;
	gap: 10px;
`,uv=Ze.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	overflow: hidden;
	border: 2px solid #ffffff;
	flex-shrink: 0;
	background: #ffffff;
`,dv=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,pv=Ze.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 14px;
	font-weight: 600;
`,hv=Ze.div`
	font-size: 13px;
	font-weight: 600;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`,fv=Ze.span`
	font-weight: 400;
	color: rgba(255, 255, 255, 0.7);
	margin-left: 6px;
`,mv=Ze.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 120px;
	background: linear-gradient(
		to top,
		rgba(0, 0, 0, 0.6) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`,gv=Ze.div`
	position: absolute;
	bottom: 16px;
	left: 12px;
	right: 60px;
`,vv=Ze.div`
	font-size: 14px;
	color: #ffffff;
	line-height: 1.4;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	word-wrap: break-word;
`,xv=Ze.div`
	position: absolute;
	bottom: 16px;
	right: 12px;
	display: flex;
	flex-direction: column;
	gap: 16px;
	align-items: center;
`,yv=Ze.div`
	color: #ffffff;
	font-size: 24px;
	cursor: pointer;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;function bv({title:e="",description:t="",image:n,username:r="",profilePicture:i}){const o=t||"",s=r||"username",a=o.length>100?`${o.slice(0,97)}...`:o;return(0,u.jsxs)(tv,{children:[(0,u.jsx)(nv,{children:"Instagram Story"}),(0,u.jsxs)(rv,{children:[n?(0,u.jsx)(iv,{src:n,alt:""}):(0,u.jsx)(ov,{children:"📷"}),(0,u.jsx)(sv,{}),(0,u.jsx)(av,{children:(0,u.jsx)(lv,{})}),(0,u.jsxs)(cv,{children:[(0,u.jsx)(uv,{children:i?(0,u.jsx)(dv,{src:i,alt:""}):(0,u.jsx)(pv,{children:s.charAt(0).toUpperCase()})}),(0,u.jsxs)(hv,{children:[s,(0,u.jsx)(fv,{children:"12h"})]})]}),(0,u.jsx)(mv,{}),(0,u.jsx)(gv,{children:(0,u.jsx)(vv,{children:a})}),(0,u.jsxs)(xv,{children:[(0,u.jsx)(yv,{children:"❤️"}),(0,u.jsx)(yv,{children:"💬"})]})]})]})}const wv=Ze.div`
	font-family:
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Helvetica,
		Arial,
		sans-serif;
	margin-bottom: 1rem;
`,jv=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #737373;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Sv=Ze.div`
	width: 270px;
	height: 480px;
	border-radius: 12px;
	overflow: hidden;
	position: relative;
	background: #000000;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
`,kv=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Av=Ze.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #405de6 0%, #833ab4 50%, #fd1d1d 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 48px;
`,Tv=Ze.div`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	width: 60px;
	height: 60px;
	background: rgba(0, 0, 0, 0.5);
	border-radius: 50%;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
	transition: background 0.2s;

	&:hover {
		background: rgba(0, 0, 0, 0.7);
	}
`,Cv=Ze.div`
	width: 0;
	height: 0;
	border-left: 20px solid #ffffff;
	border-top: 12px solid transparent;
	border-bottom: 12px solid transparent;
	margin-left: 4px;
`,Pv=Ze.div`
	position: absolute;
	top: 0;
	left: 0;
	right: 0;
	height: 80px;
	background: linear-gradient(
		to bottom,
		rgba(0, 0, 0, 0.5) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`,_v=Ze.div`
	position: absolute;
	top: 12px;
	left: 12px;
	display: flex;
	align-items: center;
	gap: 8px;
`,Ev=Ze.div`
	background: rgba(0, 0, 0, 0.5);
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 11px;
	font-weight: 600;
	color: #ffffff;
	display: flex;
	align-items: center;
	gap: 4px;
`,Mv=Ze.span`
	font-size: 12px;
`,Rv=Ze.div`
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	height: 180px;
	background: linear-gradient(
		to top,
		rgba(0, 0, 0, 0.7) 0%,
		rgba(0, 0, 0, 0) 100%
	);
	pointer-events: none;
`,zv=Ze.div`
	position: absolute;
	bottom: 16px;
	left: 12px;
	right: 50px;
`,Iv=Ze.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 10px;
`,Lv=Ze.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	overflow: hidden;
	border: 2px solid #ffffff;
	flex-shrink: 0;
	background: #ffffff;
`,Bv=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,Ov=Ze.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 12px;
	font-weight: 600;
`,Vv=Ze.div`
	font-size: 13px;
	font-weight: 600;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`,Dv=Ze.button`
	background: transparent;
	border: 1px solid #ffffff;
	border-radius: 8px;
	padding: 4px 12px;
	font-size: 12px;
	font-weight: 600;
	color: #ffffff;
	cursor: pointer;
	margin-left: auto;
`,Fv=Ze.div`
	font-size: 13px;
	color: #ffffff;
	line-height: 1.4;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
	word-wrap: break-word;
	margin-bottom: 8px;
`,Nv=Ze.div`
	display: flex;
	align-items: center;
	gap: 8px;
`,Uv=Ze.span`
	font-size: 12px;
`,$v=Ze.div`
	font-size: 12px;
	color: #ffffff;
	opacity: 0.9;
`,Hv=Ze.div`
	position: absolute;
	bottom: 100px;
	right: 12px;
	display: flex;
	flex-direction: column;
	gap: 20px;
	align-items: center;
`,Wv=Ze.div`
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 4px;
`,Gv=Ze.div`
	font-size: 24px;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`,qv=Ze.div`
	font-size: 11px;
	color: #ffffff;
	font-weight: 500;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;function Kv(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1)}K`:e.toString()}function Xv({title:e="",description:t="",image:n,username:r="",profilePicture:i,likes:o=0,comments:s=0}){const a=t||"",l=r||"username",c=a.length>150?`${a.slice(0,147)}...`:a;return(0,u.jsxs)(wv,{children:[(0,u.jsx)(jv,{children:"Instagram Reel"}),(0,u.jsxs)(Sv,{children:[n?(0,u.jsx)(kv,{src:n,alt:""}):(0,u.jsx)(Av,{children:"🎬"}),(0,u.jsx)(Pv,{}),(0,u.jsx)(_v,{children:(0,u.jsxs)(Ev,{children:[(0,u.jsx)(Mv,{children:"🎞️"}),"Reels"]})}),(0,u.jsx)(Tv,{children:(0,u.jsx)(Cv,{})}),(0,u.jsx)(Rv,{}),(0,u.jsxs)(zv,{children:[(0,u.jsxs)(Iv,{children:[(0,u.jsx)(Lv,{children:i?(0,u.jsx)(Bv,{src:i,alt:""}):(0,u.jsx)(Ov,{children:l.charAt(0).toUpperCase()})}),(0,u.jsx)(Vv,{children:l}),(0,u.jsx)(Dv,{children:"Follow"})]}),(0,u.jsx)(Fv,{children:c}),(0,u.jsxs)(Nv,{children:[(0,u.jsx)(Uv,{children:"🎵"}),(0,u.jsx)($v,{children:"Original audio"})]})]}),(0,u.jsxs)(Hv,{children:[(0,u.jsxs)(Wv,{children:[(0,u.jsx)(Gv,{children:"🤍"}),(0,u.jsx)(qv,{children:Kv(o)})]}),(0,u.jsxs)(Wv,{children:[(0,u.jsx)(Gv,{children:"💬"}),(0,u.jsx)(qv,{children:Kv(s)})]}),(0,u.jsx)(Wv,{children:(0,u.jsx)(Gv,{children:"📤"})}),(0,u.jsx)(Wv,{children:(0,u.jsx)(Gv,{children:"⋯"})})]})]})]})}const Yv=Ze.div`
	font-family:
		-apple-system,
		BlinkMacSystemFont,
		'Segoe UI',
		Roboto,
		Helvetica,
		Arial,
		sans-serif;
	margin-bottom: 1rem;
`,Zv=Ze.div`
	font-size: 12px;
	font-weight: 600;
	color: #737373;
	margin-bottom: 8px;
	text-transform: uppercase;
	letter-spacing: 0.5px;
`,Qv=Ze.div`
	width: 400px;
	background: #ffffff;
	border: 1px solid #dbdbdb;
	border-radius: 8px;
	overflow: hidden;
`,Jv=Ze.div`
	display: flex;
	align-items: center;
	padding: 12px;
	gap: 10px;
`,ex=Ze.div`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	overflow: hidden;
	flex-shrink: 0;
	background: #fafafa;
`,tx=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,nx=Ze.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #833ab4 0%, #fd1d1d 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 14px;
	font-weight: 600;
`,rx=Ze.div`
	flex: 1;
	min-width: 0;
`,ix=Ze.div`
	font-size: 14px;
	font-weight: 600;
	color: #262626;
`,ox=Ze.div`
	font-size: 12px;
	color: #262626;
`,sx=Ze.button`
	background: none;
	border: none;
	padding: 8px;
	cursor: pointer;
	font-size: 16px;
	color: #262626;
`,ax=Ze.div`
	width: 100%;
	aspect-ratio: 1 / 1;
	background: #fafafa;
	overflow: hidden;
`,lx=Ze.img`
	width: 100%;
	height: 100%;
	object-fit: cover;
`,cx=Ze.div`
	width: 100%;
	height: 100%;
	background: linear-gradient(135deg, #fafafa 0%, #efefef 100%);
	display: flex;
	align-items: center;
	justify-content: center;
	font-size: 64px;
	color: #dbdbdb;
`,ux=Ze.div`
	display: flex;
	align-items: center;
	padding: 12px;
	gap: 16px;
`,dx=Ze.button`
	background: none;
	border: none;
	padding: 0;
	cursor: pointer;
	font-size: 24px;
	line-height: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`,px=Ze(dx)`
	margin-left: auto;
`,hx=Ze.div`
	padding: 0 12px;
	font-size: 14px;
	font-weight: 600;
	color: #262626;
`,fx=Ze.div`
	padding: 0 12px 12px;
`,mx=Ze.div`
	font-size: 14px;
	color: #262626;
	line-height: 1.5;
	word-wrap: break-word;
`,gx=Ze.span`
	font-weight: 600;
	margin-right: 6px;
`,vx=Ze.span`
	color: #8e8e8e;
	cursor: pointer;
`,xx=Ze.div`
	padding: 0 12px 8px;
	font-size: 14px;
	color: #8e8e8e;
	cursor: pointer;
`,yx=Ze.div`
	padding: 0 12px 12px;
	font-size: 10px;
	color: #8e8e8e;
	text-transform: uppercase;
	letter-spacing: 0.2px;
`;function bx(e){return e>=1e6?`${(e/1e6).toFixed(1)}M`:e>=1e3?`${(e/1e3).toFixed(1).replace(/\.0$/,"")}K`:e.toLocaleString()}function wx({title:e="",description:t="",image:n,username:r="",profilePicture:i,likes:o=0,comments:s=0,siteName:a}){const l=t||"",c=r||"username",d=l.length>125,p=d?`${l.slice(0,125)}...`:l;return(0,u.jsxs)(Yv,{children:[(0,u.jsx)(Zv,{children:"Instagram Post"}),(0,u.jsxs)(Qv,{children:[(0,u.jsxs)(Jv,{children:[(0,u.jsx)(ex,{children:i?(0,u.jsx)(tx,{src:i,alt:""}):(0,u.jsx)(nx,{children:c.charAt(0).toUpperCase()})}),(0,u.jsxs)(rx,{children:[(0,u.jsx)(ix,{children:c}),a&&(0,u.jsx)(ox,{children:a})]}),(0,u.jsx)(sx,{children:"⋯"})]}),(0,u.jsx)(ax,{children:n?(0,u.jsx)(lx,{src:n,alt:""}):(0,u.jsx)(cx,{children:"📷"})}),(0,u.jsxs)(ux,{children:[(0,u.jsx)(dx,{"aria-label":"Like",children:"🤍"}),(0,u.jsx)(dx,{"aria-label":"Comment",children:"💬"}),(0,u.jsx)(dx,{"aria-label":"Share",children:"📤"}),(0,u.jsx)(px,{"aria-label":"Save",children:"🔖"})]}),(0,u.jsxs)(hx,{children:[bx(o)," likes"]}),(0,u.jsx)(fx,{children:(0,u.jsxs)(mx,{children:[(0,u.jsx)(gx,{children:c}),p,d&&(0,u.jsx)(vx,{children:" more"})]})}),s>0&&(0,u.jsxs)(xx,{children:["View all ",bx(s)," comments"]}),(0,u.jsx)(yx,{children:"2 hours ago"})]})]})}const jx={facebook:nf,twitter:Cf,threads:Of,bluesky:dm,slack:Om,discord:Zm,google:dg,linkedin:Ng,teams:ev,"instagram-story":bv,"instagram-reel":Xv,"instagram-post":wx};function Sx({networks:e=["facebook","twitter","google"],...t}){return(0,u.jsx)(u.Fragment,{children:e.map(e=>{const n=jx[e];return n?(0,u.jsx)(n,{...t},e):null})})}const kx=e=>JSON.parse(JSON.stringify(e));function Ax({canvasRef:e,platformConfig:t,imageDataUrl:n}){const r="Title!",i="Description!",o="https://example.com/",s="Site Name";return(0,u.jsxs)("div",{className:"prc-social-image-generator__preview",children:[(0,u.jsx)("span",{style:{fontSize:"11px",fontWeight:500,textTransform:"uppercase",display:"block",marginBottom:"8px",color:"#757575"},children:(0,y.__)("Live Preview","prc-platform-core")}),(0,u.jsx)("canvas",{ref:e,width:t.width,height:t.height,style:{width:"100%",height:"100%",objectFit:"contain",display:"none"}}),(0,u.jsxs)("div",{style:{width:"300px"},children:["LinkedIn"===t.name&&(0,u.jsx)(Ng,{title:r,description:i,url:o,image:n,siteName:s}),"Facebook"===t.name&&(0,u.jsx)(nf,{title:r,description:i,url:o,siteName:s,image:n,displayName:"Site Name",postText:"Test Post Text",timestamp:"10m",verified:!0,reactions:100,comments:10,shares:10}),"Twitter"===t.name&&(0,u.jsx)(Cf,{title:r,description:i,url:o,image:n,siteName:s,displayName:"Site Name",username:"username",tweetText:"Test Tweet Text",verified:!0,timestamp:"10m",likes:100,replies:10}),"Threads"===t.name&&(0,u.jsx)(Of,{title:r,description:i,url:o,image:n,siteName:s}),"Bluesky"===t.name&&(0,u.jsx)(dm,{title:r,description:i,url:o,image:n,siteName:s,displayName:"Site Name",handle:"example.org",postText:"Test Post Text",verified:!0,timestamp:"10m",likes:100,reposts:10,quotes:10,replies:10,saves:10}),"Slack"===t.name&&(0,u.jsx)(Om,{title:r,description:i,url:o,image:n,siteName:s,displayName:"Site Name",messageText:"Test Message Text",timestamp:"10m",readingTime:"5 minutes",author:"Author"}),"Discord"===t.name&&(0,u.jsx)(Zm,{title:r,description:i,url:o,image:n,siteName:s}),"Teams"===t.name&&(0,u.jsx)(ev,{title:r,description:i,url:o,image:n,siteName:s})]}),"Instagram"===t.name&&(0,u.jsx)(bv,{title:r,description:i,url:o,image:n,username:"username"}),(0,u.jsxs)("div",{style:{fontSize:"11px",color:"#757575",marginTop:"8px"},children:[t.width," × ",t.height,"px"]})]})}function Tx({layout:e,updateLayout:t,sourceImageUrl:n,hasOverride:r,onSelectOverride:i,onClearOverride:o,fontFamilyOptions:s}){return(0,u.jsx)("div",{style:{maxHeight:"480px",overflowY:"auto",paddingRight:"8px"},children:(0,u.jsxs)(w.__experimentalVStack,{spacing:2,children:[(0,u.jsx)(Ph,{sourceImageUrl:n,hasOverride:r,onSelectOverride:i,onClearOverride:o}),(0,u.jsx)(kh,{layout:e,updateLayout:t}),(0,u.jsx)(Ah,{layout:e,updateLayout:t}),(0,u.jsx)(Th,{layout:e,updateLayout:t,fontFamilyOptions:s}),(0,u.jsx)(Ch,{layout:e,updateLayout:t})]})})}function Cx(){return(0,u.jsx)("div",{className:"prc-social-image-generator__empty",children:(0,u.jsx)("div",{style:{padding:"24px",textAlign:"center",color:"#757575"},children:(0,u.jsx)(w.__experimentalText,{children:(0,y.__)("Provide a source image to generate social media images.","prc-platform-core")})})})}function Px({error:e,generateLabel:t,hasGenerated:n,onReset:r,onGenerate:i,onDownload:o,isGenerating:s}){return(0,u.jsxs)(u.Fragment,{children:[e&&(0,u.jsx)("div",{style:{color:"#cc1818",fontSize:"12px",marginTop:"16px",padding:"8px 12px",backgroundColor:"#fcebea",borderRadius:"4px"},children:e}),(0,u.jsxs)(w.Flex,{justify:"space-between",style:{marginTop:"24px",paddingTop:"16px",borderTop:"1px solid #e0e0e0"},children:[(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Button,{variant:"tertiary",onClick:r,icon:ah,children:(0,y.__)("Reset","prc-platform-core")})}),(0,u.jsx)(w.FlexItem,{children:(0,u.jsxs)(w.Flex,{gap:2,children:[(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Button,{variant:"primary",onClick:i,disabled:s,isBusy:s,icon:lh,children:t})}),(0,u.jsx)(w.FlexItem,{children:(0,u.jsx)(w.Button,{variant:"secondary",icon:ch,onClick:o,disabled:!n,children:(0,y.__)("Download","prc-platform-core")})})]})})]}),s&&(0,u.jsxs)("div",{style:{marginTop:"12px",display:"flex",alignItems:"center",gap:"8px",color:"#757575",fontSize:"13px"},children:[(0,u.jsx)(w.Spinner,{}),(0,y.__)("Generating…","prc-platform-core")]})]})}function Ex({platformType:e="instagram",sourceImageUrl:n=null,title:r="",logoSrc:i=null,platformSizes:o=null,fontFamilyOptions:s=Sh,onGenerate:a,onDownload:l=null,renderPreview:c=null,onSourceImageSelect:d=null,onSourceImageClear:p=null,hasSourceOverride:h=!1,className:f="",generatedImageUrl:m=null}){const g=(0,t.useRef)(null),[v,x]=(0,t.useState)(!1),[b,j]=(0,t.useState)(!1),[S,k]=(0,t.useState)(null),[A,T]=(0,t.useState)(null),C=(0,t.useMemo)(()=>o||ph,[o]),P=C[e],_=P?.layout,[E,M]=(0,t.useState)(()=>_?kx(_):{});(0,t.useEffect)(()=>{P?.layout&&M(kx(P.layout))},[e,P?.layout]);const R=(0,t.useCallback)((e,t,n)=>{M(r=>"root"===e?{...r,[t]:n}:{...r,[e]:{...r[e],[t]:n}})},[]),z=(0,t.useCallback)(()=>{_&&M(kx(_))},[_]);(0,t.useEffect)(()=>{if(!g.current||!n||!P)return;const t=setTimeout(async()=>{x(!0);try{await vh({canvas:g.current,sourceImageUrl:n,title:r||"Sample Title",platformType:e,layoutOverrides:E,logoSrc:i,platformSizes:C})}catch(e){}x(!1)},150);return()=>clearTimeout(t)},[n,r,e,E,P,i,C]);const I=g.current?.toDataURL?.()??null,L=(0,t.useCallback)(async()=>{if(n)if(r){j(!0),k(null);try{const t=`social-image-${e}.png`,o=await yh({sourceImageUrl:n,title:r,platformType:e,filename:t,layoutOverrides:E,logoSrc:i,platformSizes:C});A&&URL.revokeObjectURL(A);const s=URL.createObjectURL(o);T(s),a({file:o,blob:o,platformType:e,layout:E})}catch(e){k(e?.message||"Generation failed")}finally{j(!1)}}else k("Title is required");else k("No source image available")},[n,r,e,E,i,C,a,A]),B=m||A,O=!!B,V=(0,t.useCallback)(()=>{if(!B)return;if("function"==typeof l)return void l();const t=document.createElement("a");t.href=B,t.download=`social-image-${e}.png`,document.body.appendChild(t),t.click(),document.body.removeChild(t)},[B,l,e]);if(!P)return null;if(!n&&!h)return(0,u.jsx)(Cx,{});const D=function(e,t){return e?(0,y.__)("Generating…","prc-platform-core"):t?(0,y.__)("Regenerate","prc-platform-core"):(0,y.__)("Generate","prc-platform-core")}(b,O),F="function"==typeof c?c({canvasRef:g,platformConfig:P,imageDataUrl:I,isRendering:v}):(0,u.jsx)(Ax,{canvasRef:g,platformConfig:P,imageDataUrl:I});return(0,u.jsxs)("div",{className:`prc-social-image-generator ${f}`.trim(),children:[(0,u.jsxs)(w.Flex,{align:"flex-start",justify:"flex-start",gap:6,children:[(0,u.jsx)(w.FlexBlock,{style:{maxWidth:"320px"},children:(0,u.jsx)(Tx,{layout:E,updateLayout:R,sourceImageUrl:n,hasOverride:h,onSelectOverride:d,onClearOverride:p,fontFamilyOptions:s})}),(0,u.jsx)(w.FlexItem,{children:F})]}),(0,u.jsx)(Px,{error:S,generateLabel:D,hasGenerated:O,onReset:z,onGenerate:L,onDownload:V,isGenerating:b})]})}var Mx=n(556),Rx=n.n(Mx);const zx=e=>{const{children:t,cacheKey:n}=e,r=(0,et.useInstanceId)(zx),i=Ce({key:n||r}),[o,s]=(0,g.useState)(i),a=(0,et.useRefEffect)(e=>(e&&s(Ce({key:n||r,container:e})),()=>{s(i)}),[n,r]);return(0,u.jsxs)(g.Fragment,{children:[(0,u.jsx)("span",{ref:a,style:{display:"none"}}),(0,u.jsx)(Ue,{value:o,children:t})]})};zx.propTypes={children:Rx().node.isRequired,cacheKey:Rx().string.isRequired};const Ix=zx;var Lx=n(106);const Bx=Ze("div")`
	& .components-button.has-icon {
		padding: 0px !important;
	}
`;function Ox({className:e,value:n,onChange:r,allowMultiple:i=!1,restrictToTaxonomies:o=["category","formats","regions-countries","research-teams","collection"]}){const[s,a]=(0,t.useState)(n),{records:l}=(0,j.useSelect)(e=>{const{getEntitiesConfig:t}=e("core");return{records:t("taxonomy").filter((e,t,n)=>t===n.findIndex(t=>t.name===e.name))}},[]),[c,d]=(0,t.useState)([]);(0,t.useEffect)(()=>{if(0<l.length&&0===c.length){const e=l.map(e=>({label:e.label,value:e.name,baseUrl:e.baseURL}));if(0<o.length){const t=e.filter(e=>o.includes(e.value));d(t)}else d(e)}},[l]),(0,t.useEffect)(()=>{s&&r(s)},[s]);const p=(0,t.useMemo)(()=>!!c&&0<=c.length,[c]),h=(0,y.__)("Select a taxonomy","prc-components");return(0,u.jsxs)("div",{className:e,children:[!p&&(0,u.jsx)(w.Spinner,{}),p&&!i&&(0,u.jsx)(w.SelectControl,{label:h,value:s,options:c,onChange:e=>{a(e)},__nextHasNoMarginBottom:!0}),p&&i&&(0,u.jsx)(Bx,{children:(0,u.jsx)(Lx.MultiSelectControl,{label:h,value:s,options:c,onChange:e=>{a(e)}})})]})}const Vx=Ze("div")`
	& .components-spinner {
		position: absolute;
		margin-top: -32px;
		right: 12px;
	}
`;function Dx({className:e,onChange:n,taxonomy:r,value:i,maxTerms:o,label:s}){const a=void 0!==s?s:`Select a ${r} term`,[l,c]=(0,t.useState)(""),d=(0,et.useDebounce)(c,500),{records:p,isResolving:h,hasResolved:f}=(0,Je.useEntityRecords)("taxonomy",r,{per_page:10,context:"view",search:l}),m=(0,t.useMemo)(()=>f&&p?(console.log("Processing records...",p),p.map(e=>e.name)):[],[p,f]);return(0,u.jsxs)(Vx,{className:e,children:[(0,u.jsx)(w.FormTokenField,{value:i,suggestions:m,onInputChange:d,displayTransform:e=>(0,mt.decodeEntities)(e),onChange:e=>{if((0,wo.isEmpty)(e))return void n({});const t=e[e.length-1],r=p.find(e=>e.name===t);if(r){const e=Object.keys(r).filter(e=>["id","name","slug","taxonomy","parent","link"].includes(e)).reduce((e,t)=>({...e,[t]:r[t]}),{});n(e)}},label:a,maxLength:o,__experimentalShowHowTo:!1}),h&&(0,u.jsx)(w.Spinner,{})]})}Dx.defaultProps={className:"",maxTerms:1,onChange:e=>{console.log("Selected Term: ",e)},taxonomy:"topic",value:[]},Dx.propTypes={className:Rx().string,maxTerms:Rx().number,onChange:Rx().func,taxonomy:Rx().string,value:Rx().array};const Fx=Dx,Nx=({children:e})=>(0,u.jsx)(th.div,{className:"transition",initial:{opacity:0},animate:{opacity:1},children:e}),Ux=window.wp.date;function $x({searchRecords:e,onSelect:t,imageSize:n="A3",disableImage:r=!1}){return e.map(e=>(0,u.jsx)(Wx,{item:e,onSelect:t,imageSize:n,disableImage:r}))}function Hx({item:e,imageSize:t}){const{art:n}=e;if(n&&n[t]){const{rawUrl:e,height:r,width:i,caption:o}=n[t];return(0,u.jsx)(w.CardMedia,{children:(0,u.jsx)("img",{src:e,height:r,width:i,alt:o})})}return null}function Wx({item:e,onSelect:t,imageSize:n="A3",disableImage:r=!1}){if(!e)return null;const i=e.post_title?e.post_title:e.title.rendered,o=e.post_date?e.post_date:e.date,{label:s}=e,a=e.canonical_url;return(0,u.jsx)(w.Card,{onClick:()=>{t(e)},size:"small",style:{cursor:"pointer",":hover":{"background-color":"#f3f4f5"}},children:(0,u.jsxs)(w.CardBody,{style:{display:"flex"},children:[!r&&(0,u.jsx)("div",{style:{width:"35%",maxWidth:"200px",paddingRight:"1em",paddingTop:"0.5em"},children:(0,u.jsx)(Hx,{item:e,imageSize:n})}),(0,u.jsxs)("div",{children:[(0,u.jsx)("div",{style:{fontSize:"0.8em",color:"#666"},children:`${s} | ${(0,Ux.date)("M j, Y",o)}`}),(0,u.jsx)("strong",{children:i}),(0,u.jsx)("div",{style:{fontSize:"0.8em",fontStyle:"italic",color:"#666",lineHeight:"1.5em"},children:a})]})]})})}function Gx({postId:e,postType:n="post",url:r,disableImage:i=!1,onSelect:s=()=>{},onKeyESC:a=()=>{},onUpdateURL:l=()=>{}}){const[c,d]=(0,t.useState)(!!r),[p,h]=(0,t.useState)(r??""),f=(0,Qe.useDebounce)(p,500),m=(0,t.useMemo)(()=>!(void 0===f||!f.match(/^(http|https):\/\//)),[f]),[g,v]=(0,t.useState)(null),x=!!f.length,{records:b,isResolving:j}=(0,Je.useEntityRecords)("postType",n,{per_page:10,post_parent:0,search:x&&!m?f:"",context:"view"}),S=!(c||m||!b)&&0<b.length,k=!c&&m&&null!==g,A=!c&&!S&&!k;return(0,t.useEffect)(()=>{var e;m&&(d(!0),(e=f,new Promise((t,n)=>{o()({path:(0,jt.addQueryArgs)("/prc-api/v3/utils/postid-by-url",{url:e}),method:"GET"}).then(e=>{const r="post"===e?.postType?"posts":e?.postType,i=(0,jt.addQueryArgs)(`/wp/v2/${r}/${e?.postId}`,{context:"view"});o()({path:i,method:"GET"}).then(e=>{t(e)}).catch(e=>n(e))}).catch(e=>n(e))})).then(e=>{v(e),d(!1)}).catch(()=>{v(null),d(!1)}))},[f,m]),(0,t.useEffect)(()=>{d(j)},[j]),(0,u.jsxs)(w.TabbableContainer,{children:[(0,u.jsx)(w.KeyboardShortcuts,{shortcuts:{esc:()=>{"function"==typeof a&&a()}},children:(0,u.jsx)(w.SearchControl,{tabIndex:"0",value:p,onChange:e=>h(e),placeholder:(0,y.sprintf)(/* translators: %s: post type */ /* translators: %s: post type */
(0,y.__)("Search for a %s or paste url here","prc-block-library"),n,"prc-block-library"),autoComplete:"off"})}),x&&(0,u.jsxs)(t.Fragment,{children:[c&&(0,u.jsxs)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",color:"#666"},children:[(0,u.jsx)("span",{children:"Loading... "}),(0,u.jsx)(w.Spinner,{})]}),A&&(0,u.jsxs)("div",{style:{textAlign:"center",color:"#666",paddingTop:"1em"},children:[(0,u.jsx)("div",{style:{padding:"1em 0"},children:(0,u.jsx)("span",{children:(0,y.__)("Nothing found.","prc-block-library")})}),m&&(0,u.jsx)("span",{children:(0,u.jsx)(w.Button,{variant:"secondary",onClick:()=>{l(f)},children:(0,y.__)("Change the URL","prc-block-library")})})]}),k&&(0,u.jsxs)("div",{children:[(0,u.jsx)(Wx,{item:g,onSelect:s,disableImage:i}),(0,u.jsxs)("div",{style:{display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",textAlign:"center",color:"#666",paddingTop:"1em"},children:[(0,u.jsx)("span",{children:(0,y.__)("Click the item to replace this block's content","prc-block-library")}),void 0!==e&&(0,u.jsxs)(t.Fragment,{children:[(0,u.jsx)("div",{style:{padding:"1em 0"},children:(0,u.jsx)("span",{children:(0,y.__)("~ or ~","prc-block-library")})}),m&&(0,u.jsx)("span",{children:(0,u.jsx)(w.Button,{variant:"secondary",onClick:()=>{l(f)},children:(0,y.__)("Change the URL","prc-block-library")})})]})]})]}),S&&!m&&(0,u.jsx)($x,{searchRecords:b,onSelect:s,disableImage:i})]})]})}function qx({postId:e,postType:n="post",url:r,disableImage:i=!1,onSelect:o=()=>{},onUpdateURL:s=()=>{}}){const[a,l]=(0,t.useState)(!1);return(0,u.jsxs)(w.ToolbarGroup,{children:[(0,u.jsx)(w.ToolbarButton,{"aria-expanded":a,"aria-haspopup":"true",label:(0,y.sprintf)(/* translators: %s: post type */ /* translators: %s: post type */
(0,y.__)("Search for a %s or paste url here","prc-block-library"),n,"prc-block-library"),icon:"admin-links",onClick:()=>l(!0),showTooltip:!0}),!0===a&&(0,u.jsx)(w.Modal,{title:(0,y.sprintf)(/* translators: %s: post type */ /* translators: %s: post type */
(0,y.__)("Search for a %s or paste url here","prc-block-library"),n,"prc-block-library"),onRequestClose:()=>l(!1),shouldCloseOnClickOutside:!1,shouldCloseOnEsc:!1,children:(0,u.jsx)("div",{style:{width:"100%",minWidth:"340px",maxWidth:"640px",margin:"0 auto"},children:(0,u.jsx)(Gx,{postId:e,postType:n,url:r,disableImage:i,onSelect:e=>{o(e),l(!1)},onKeyEnter:()=>l(!1),onKeyESC:()=>l(!1),onUpdateURL:e=>{s(e),l(!1)}})})})]})}function Kx({createNew:e}){return(0,u.jsx)("div",{style:{textAlign:"center",color:"#666",paddingTop:"1em"},children:(0,u.jsxs)("div",{style:{padding:"1em 0"},children:["function"!=typeof e&&(0,u.jsx)("div",{children:(0,u.jsx)("span",{children:(0,y.__)("No results found.")})}),"function"==typeof e&&(0,u.jsx)("div",{children:e()})]})})}const Xx=(0,t.createContext)(),Yx=({entityId:e,entityType:n,entitySubType:r,entityStatus:i=["publish"],perPage:s,hideChildren:a,searchInput:l,setSearchInput:c,onUpdateURL:u,onSelect:d,clearOnSelect:p,createNew:h,showExcerpt:f,showType:m})=>{const g=(0,Qe.useDebounce)(l,750),[v,x]=(0,t.useState)(!!l),[y,b]=(0,t.useState)(e),[w,j]=(0,t.useState)([]),S=(0,t.useCallback)(()=>{c(""),b(null),j([])},[c]);(0,t.useEffect)(()=>{g?g&&n&&r&&(x(!0),o()({path:(0,jt.addQueryArgs)("/prc-api/v3/components/wp-entity-search/",{entity_type:n,entity_sub_type:r,search:g,entity_status:i}),method:"GET"}).then(e=>{j(e),x(!1)}).catch(()=>{x(!1)})):x(!1)},[g,n,r,i]),(0,t.useEffect)(()=>{if(y&&w){const e=w.find(e=>e.entityId===y);e&&d(e),p&&S()}},[y,w,d,p,S]);const k=(0,t.useMemo)(()=>!v&&w&&w.length>0&&""!==g,[v,w,g]),A=(0,t.useMemo)(()=>!v&&!k,[v,k]);return{entityConfig:{entityType:n,entitySubType:r},perPage:s,hideChildren:a,searchString:g,setSearchInput:c,onSelect:d,onClear:S,clearOnSelect:p,onUpdateURL:"function"==typeof u&&(()=>{"function"==typeof u&&u(g)}),createNew:h,showExcerpt:f,showType:m,selectedId:y,setSelectedId:b,records:w,isLoading:v,hasSearchRecords:k,hasNothingFound:A}},Zx=()=>(0,t.useContext)(Xx);function Qx({entityId:e,entityType:t,entitySubType:n,entityStatus:r,perPage:i,hideChildren:o,searchInput:s,setSearchInput:a,onUpdateURL:l,onSelect:c,clearOnSelect:d,createNew:p,showExcerpt:h,showType:f,children:m}){const g=Yx({entityId:e,entityType:t,entitySubType:n,entityStatus:r,perPage:i,hideChildren:o,searchInput:s,setSearchInput:a,onUpdateURL:l,onSelect:c,clearOnSelect:d,createNew:p,showExcerpt:h,showType:f});return(0,u.jsx)(Xx.Provider,{value:g,children:m})}function Jx({item:e}){const{selectedId:n,setSelectedId:r,entityConfig:i,showExcerpt:o,showType:s}=Zx(),{entityId:a,entityName:l,entityDate:c,entityDescription:d,entityType:p,entitySubType:h,entityUrl:f}=e,m=(0,t.useMemo)(()=>n===a,[n,a]);return(0,u.jsx)(w.Card,{onClick:()=>{console.log("<SearchItem/> onClick::",e,a),r(a)},size:"small",style:{cursor:"pointer",boxShadow:"none",border:"1px solid #eee",":hover":{backgroundColor:"#f0f0f0"},backgroundColor:m?"#f0f0f0":"transparent"},tabIndex:"0",children:(0,u.jsx)(w.CardBody,{style:{display:"flex"},children:(0,u.jsxs)("div",{children:[null!==c&&(0,u.jsx)("div",{style:{fontSize:"0.8em",color:"#666"},children:`${(0,Ux.date)("M j, Y",c)}`}),(0,u.jsx)("strong",{children:(0,mt.decodeEntities)(l)}),!0===s&&(0,u.jsxs)("div",{style:{fontSize:"0.8em",color:"#666"},children:["Type: ",h]}),!0===o&&d&&(0,u.jsx)("div",{style:{fontSize:"0.8em",color:"#666",lineHeight:"1.5em"},children:(0,mt.decodeEntities)(d)}),(0,u.jsx)("div",{style:{fontSize:"0.8em",fontStyle:"italic",color:"#666",lineHeight:"1.5em"},children:f})]})},`${a}-cardBody`)},`${a}-card`)}function ey({}){const{records:e,isLoading:n,searchString:r,hasNothingFound:i,hasSearchRecords:o,createNew:s,onUpdateURL:a}=Zx(),l=(0,t.useMemo)(()=>`Searching for "${r}"...`,[r]);return(0,u.jsxs)("div",{children:[(0,u.jsx)(pt,{enabled:n,label:l}),i&&!!r&&(0,u.jsx)(Kx,{createNew:s}),o&&(0,u.jsx)("div",{style:{maxHeight:"50vh",minWidth:"240px",overflowY:"auto",paddingBottom:"0.5em",paddingTop:"0.5em"},children:e.map(e=>(0,u.jsx)(Jx,{item:e},e?.entityId))}),!1!==a&&(0,u.jsxs)("div",{style:{display:"flex",justifyContent:"center",alignItems:"center",marginTop:"20px",flexDirection:"column",gap:"1em"},children:[(0,u.jsx)("div",{children:" ~ or ~ "}),(0,u.jsx)(w.Button,{variant:"secondary",onClick:()=>{a()},children:"Update URL"})]})]})}function ty({placeholder:e="Climate Change",searchValue:n="",onSelect:r=()=>{},onKeyEnter:i=()=>{},onKeyESC:o=()=>{},entityId:s,entityType:a="postType",entitySubType:l="post",entityStatus:c=["publish"],perPage:d=10,hideChildren:p=!0,onUpdateURL:h=!1,clearOnSelect:f=!1,createNew:m=!1,showExcerpt:g=!1,showType:v=!0,searchSize:x="default",children:y}){const[b,j]=(0,t.useState)(n),S=(0,t.useMemo)(()=>"large"===x?"default":"compact",[x]);return(0,u.jsxs)(w.TabbableContainer,{onNavigate:(e,t)=>console.log("onNavigate:",t),children:[(0,u.jsxs)(w.KeyboardShortcuts,{shortcuts:{esc:()=>{"function"==typeof o&&(o(),j(""))},enter:()=>{"function"==typeof i&&i()}},children:[(0,u.jsx)(w.SearchControl,{value:b,onChange:e=>j(e),placeholder:e,autoComplete:"off",size:S}),(0,u.jsx)(Qx,{entityId:s,entityType:a,entitySubType:l,entityStatus:c,perPage:d,hideChildren:p,searchInput:b,setSearchInput:j,onUpdateURL:h,onSelect:r,clearOnSelect:f,createNew:m,showExcerpt:g,showType:v,children:(0,u.jsx)(ey,{})})]}),(0,u.jsx)("div",{className:"wp-entity-search__children",style:{paddingTop:"0.5em"},children:y})]})}function ny(e){const{abilityName:n,transformResult:r}=e,[i,o]=(0,t.useState)(!1),[s,a]=(0,t.useState)(null),[l,c]=(0,t.useState)(null),u=(0,t.useRef)(!1);return{isLoading:i,error:s,result:l,fetch:(0,t.useCallback)(async e=>{if(!u.current){u.current=!0,o(!0),a(null),c(null);try{const{executeAbility:t}=await import("@wordpress/abilities"),i=await t(n,e);if(i?.error&&"string"==typeof i.error&&i.error.length>0)return void a(i.error);const o=r?r(i):i;c(o)}catch(e){const t=e instanceof Error?e.message:"An unexpected error occurred.";a(t)}finally{o(!1),u.current=!1}}},[n,r]),reset:(0,t.useCallback)(()=>{c(null),a(null)},[]),dismissError:(0,t.useCallback)(()=>{a(null)},[])}}function ry({label:e=(0,y.__)("Suggest with AI","prc-platform-core"),text:t=(0,y.__)("Suggest with AI","prc-platform-core"),onClick:n,isLoading:r=!1,disabled:i=!1,variant:o="secondary",size:s="compact",fullWidth:a=!0}){return(0,u.jsx)(w.Button,{className:"prc-ai-suggest-button",variant:o,size:s,isBusy:r,icon:(0,u.jsx)("span",{className:"prc-ai-suggest-button__icon",children:(0,u.jsx)(uh.Icon,{icon:"sparkles"})}),onClick:n,disabled:r||i,style:a?{width:"100%",justifyContent:"center"}:void 0,label:e,children:t})}function iy({label:e,onClick:t,group:n="other"}){return(0,u.jsx)(b.BlockControls,{group:n,children:(0,u.jsx)(w.ToolbarButton,{icon:(0,u.jsx)("span",{className:"prc-ai-suggest-button__icon",children:(0,u.jsx)(uh.Icon,{icon:"sparkles"})}),label:e||(0,y.__)("Suggest with AI","prc-platform-core"),onClick:t})})}function oy({message:e}){return(0,u.jsxs)("div",{className:"prc-ai-loading",children:[(0,u.jsx)(w.Spinner,{}),(0,u.jsx)("span",{className:"prc-ai-loading__message",children:e||(0,y.__)("Generating…","prc-platform-core")})]})}function sy({title:e,isOpen:t,onClose:n,isLoading:r=!1,loadingMessage:i,error:o,onDismissError:s,children:a,footer:l,maxWidth:c="560px"}){return t?(0,u.jsxs)(w.Modal,{title:e,onRequestClose:n,className:"prc-ai-modal",style:{maxWidth:c,width:"100%"},children:[r&&(0,u.jsx)("div",{className:"prc-ai-modal__loading",children:(0,u.jsx)(oy,{message:i})}),o&&(0,u.jsx)(w.Notice,{status:"warning",isDismissible:!!s,onDismiss:s,children:o}),!r&&(0,u.jsx)(u.Fragment,{children:a}),!r&&l&&(0,u.jsx)("div",{className:"prc-ai-modal__footer",children:l})]}):null}function ay({children:e,onApply:t,onDismiss:n,onRegenerate:r,applyLabel:i,dismissLabel:o,regenerateLabel:s,headerLabel:a}){return(0,u.jsxs)("div",{className:"prc-ai-preview",children:[(0,u.jsx)("p",{className:"prc-ai-preview__header",children:a||(0,y.__)("AI Suggestions","prc-platform-core")}),(0,u.jsx)("div",{className:"prc-ai-preview__content",children:e}),(0,u.jsxs)("div",{className:"prc-ai-preview__actions",children:[(0,u.jsx)(w.Button,{variant:"primary",onClick:t,size:"compact",children:i||(0,y.__)("Apply","prc-platform-core")}),(0,u.jsx)(w.Button,{variant:"tertiary",onClick:n,size:"compact",children:o||(0,y.__)("Dismiss","prc-platform-core")}),r&&(0,u.jsx)(w.Button,{variant:"tertiary",onClick:r,size:"compact",children:s||(0,y.__)("Regenerate","prc-platform-core")})]})]})}function ly({suggestions:e,selectedIds:t,onToggle:n,getId:r,renderItem:i,emptyMessage:o}){return 0===e.length?(0,u.jsx)("p",{className:"prc-ai-suggestions-list__empty",children:o||(0,y.__)("No suggestions available.","prc-platform-core")}):(0,u.jsx)("div",{className:"prc-ai-suggestions-list",children:e.map(e=>{const o=r(e),s=t.has(o);return(0,u.jsx)("div",{className:"prc-ai-suggestions-list__item"+(s?" prc-ai-suggestions-list__item--selected":""),children:(0,u.jsx)(w.CheckboxControl,{__nextHasNoMarginBottom:!0,label:i(e),checked:s,onChange:()=>n(o)})},String(o))})})}const cy=Ze.div`
	display: flex;
	flex-direction: column;
	background-color: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 40px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	width: 100%;
	max-width: 430px;
	margin: 0 auto;
	height: 100%;
	min-height: 800px;
`,uy=Ze.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 14px 24px 0;
	font-size: 14px;
	font-weight: 600;
	color: #000;
	height: 44px;
	box-sizing: border-box;
`,dy=Ze.div`
	display: flex;
	gap: 6px;
	align-items: center;
`,py=Ze.div`
	background-color: #000;
	opacity: 0.8;
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
`,hy=Ze(py)`
	width: 16px;
	height: 10px;
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 10"><rect y="6" width="3" height="4" rx="1"/><rect x="4" y="4" width="3" height="6" rx="1"/><rect x="8" y="2" width="3" height="8" rx="1"/><rect x="12" width="3" height="10" rx="1"/></svg>');
`,fy=Ze(py)`
	width: 16px;
	height: 12px;
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 12"><path d="M8 12a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-4.5c-1.8 0-3.5.6-4.8 1.6l-1.3-1.6C3.6 6.1 5.7 5.5 8 5.5s4.4.6 6.1 2l-1.3 1.6c-1.3-1-3-1.6-4.8-1.6zm0-4.5C5.1 3 2.5 4 .5 5.8L0 4.5C2.2 2.5 5 1.5 8 1.5s5.8 1 8 3l-.5 1.3C13.5 4 10.9 3 8 3z"/></svg>');
`,my=Ze(py)`
	width: 24px;
	height: 12px;
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 12"><rect x="1" y="1" width="20" height="10" rx="3" fill="none" stroke="black" stroke-width="1"/><rect x="3" y="3" width="16" height="6" rx="1"/><path d="M22 4v4a1 1 0 0 0 1-1V5a1 1 0 0 0-1-1z"/></svg>');
`,gy=Ze.div`
	padding: 8px 16px;
	background-color: #f8f8f8;
	border-bottom: 1px solid #e0e0e0;
`,vy=Ze.div`
	background-color: #e8e8ed;
	border-radius: 12px;
	padding: 10px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
`,xy=Ze.span`
	font-size: 14px;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`,yy=Ze.div`
	flex: 1;
	overflow-y: auto;
	position: relative;
	display: flex;
	flex-direction: column;
`,by=Ze.div`
	height: 34px;
	background-color: #f8f8f8;
	border-top: 1px solid #e0e0e0;
	display: flex;
	justify-content: center;
	align-items: center;
	padding-bottom: env(safe-area-inset-bottom);
`,wy=Ze.div`
	width: 134px;
	height: 5px;
	background-color: #000;
	border-radius: 100px;
	opacity: 0.8;
`;function jy({children:e,url:n}){const r=(0,t.useMemo)(()=>n||("undefined"!=typeof window?window.location.hostname:""),[n]);return(0,u.jsxs)(cy,{children:[(0,u.jsxs)(uy,{children:[(0,u.jsx)("div",{children:"9:41"}),(0,u.jsxs)(dy,{children:[(0,u.jsx)(hy,{}),(0,u.jsx)(fy,{}),(0,u.jsx)(my,{})]})]}),(0,u.jsx)(gy,{children:(0,u.jsx)(vy,{children:(0,u.jsx)(xy,{children:r})})}),(0,u.jsx)(yy,{children:e}),(0,u.jsx)(by,{children:(0,u.jsx)(wy,{})})]})}const Sy=Ze.div`
	display: flex;
	flex-direction: column;
	background-color: #fff;
	border: 1px solid #e0e0e0;
	border-radius: 10px;
	overflow: hidden;
	box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
	width: 100%;
	min-height: 600px;
`,ky=Ze.div`
	background-color: #f6f6f6;
	border-bottom: 1px solid #d1d1d1;
	display: flex;
	flex-direction: column;
`,Ay=Ze.div`
	display: flex;
	gap: 8px;
	padding: 12px 16px 0;
`,Ty=Ze.div`
	width: 12px;
	height: 12px;
	border-radius: 50%;
`,Cy=Ze(Ty)`
	background-color: #ff5f56;
	border: 1px solid #e0443e;
`,Py=Ze(Ty)`
	background-color: #ffbd2e;
	border: 1px solid #dea123;
`,_y=Ze(Ty)`
	background-color: #27c93f;
	border: 1px solid #1aab29;
`,Ey=Ze.div`
	display: flex;
	align-items: center;
	padding: 8px 16px 12px;
	gap: 16px;
`,My=Ze.div`
	display: flex;
	gap: 12px;
`,Ry=Ze.div`
	width: 12px;
	height: 12px;
	border-top: 2px solid #888;
	border-right: 2px solid #888;
	opacity: 0.5;
`,zy=Ze(Ry)`
	transform: rotate(-135deg);
`,Iy=Ze(Ry)`
	transform: rotate(45deg);
`,Ly=Ze.div`
	flex: 1;
	background-color: #fff;
	border: 1px solid #d1d1d1;
	border-radius: 6px;
	padding: 6px 12px;
	text-align: center;
	display: flex;
	justify-content: center;
	align-items: center;
	box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
`,By=Ze.span`
	font-size: 13px;
	color: #333;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
`,Oy=Ze.div`
	display: flex;
	gap: 16px;
`,Vy=Ze.div`
	width: 16px;
	height: 16px;
	background-color: #888;
	opacity: 0.5;
	mask-size: contain;
	mask-repeat: no-repeat;
	mask-position: center;
`,Dy=Ze(Vy)`
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>');
`,Fy=Ze(Vy)`
	mask-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>');
`,Ny=Ze.div`
	flex: 1;
	overflow-y: auto;
	position: relative;
	display: flex;
	flex-direction: column;
`;function Uy({children:e,url:n}){const r=(0,t.useMemo)(()=>n||("undefined"!=typeof window?window.location.hostname:""),[n]);return(0,u.jsxs)(Sy,{children:[(0,u.jsxs)(ky,{children:[(0,u.jsxs)(Ay,{children:[(0,u.jsx)(Cy,{}),(0,u.jsx)(Py,{}),(0,u.jsx)(_y,{})]}),(0,u.jsxs)(Ey,{children:[(0,u.jsxs)(My,{children:[(0,u.jsx)(zy,{}),(0,u.jsx)(Iy,{})]}),(0,u.jsx)(Ly,{children:(0,u.jsx)(By,{children:r})}),(0,u.jsxs)(Oy,{children:[(0,u.jsx)(Dy,{}),(0,u.jsx)(Fy,{})]})]})]}),(0,u.jsx)(Ny,{children:e})]})}})(),window.prcComponents=r})();