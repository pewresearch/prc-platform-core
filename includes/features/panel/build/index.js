(()=>{"use strict";const e=window.React,t=window.wp.i18n,n=window.wp.plugins,r=window.wp.components,i=window.wp.editPost,s=window.wp.editor,o=window.wp.data,a=window.wp.coreData;function l({postType:n="feature",postId:i,postSlug:s}){const[o,l]=(0,a.useEntityProp)("postType",n,"meta");return(0,e.createElement)(r.BaseControl,{help:(0,t.sprintf)("Last edited by: %s","Seth Rubenstein")},(0,e.createElement)(r.TextareaControl,{label:"Developer Notes",value:o?._feature_dev_notes||"",onChange:e=>l({...o,_feature_dev_notes:e})}))}const c=window.ReactDOM;function u(e){const t=window.getComputedStyle(e);return Math.max(parseInt(t["margin-top"],10),parseInt(t["margin-bottom"],10))+e.getBoundingClientRect().height}function d(e,t=0,n=0){e&&(null!==t&&null!==n?e.style.transform=`translate(${n}px, ${t}px)`:e.style.removeProperty("transform"))}function h(e,t,n){e&&(e.style.transition=`transform ${t}ms${n?` ${n}`:""}`)}const p=e=>{let t=[],n=null;const r=(...r)=>{t=r,n||(n=requestAnimationFrame((()=>{n=null,e(...t)})))};return r.cancel=()=>{n&&cancelAnimationFrame(n)},r};function f(e,t){const n=["input","textarea","select","option","optgroup","video","audio","button","a"],r=["button","link","checkbox","tab"];for(;e!==t;){if(e.getAttribute("data-movable-handle"))return!1;if(n.includes(e.tagName.toLowerCase()))return!0;const t=e.getAttribute("role");if(t&&r.includes(t.toLowerCase()))return!0;if("label"===e.tagName.toLowerCase()&&e.hasAttribute("for"))return!0;e.tagName&&(e=e.parentElement)}return!1}const m=200;class g extends e.Component{constructor(t){super(t),this.listRef=e.createRef(),this.ghostRef=e.createRef(),this.topOffsets=[],this.itemTranslateOffsets=[],this.initialYOffset=0,this.lastScroll=0,this.lastYOffset=0,this.lastListYOffset=0,this.needle=-1,this.afterIndex=-2,this.state={itemDragged:-1,itemDraggedOutOfBounds:-1,selectedItem:-1,initialX:0,initialY:0,targetX:0,targetY:0,targetHeight:0,targetWidth:0,liveText:"",scrollingSpeed:0,scrollWindow:!1},this.doScrolling=()=>{const{scrollingSpeed:e,scrollWindow:t}=this.state,n=this.listRef.current;window.requestAnimationFrame((()=>{t?window.scrollTo(window.pageXOffset,window.pageYOffset+1.5*e):n.scrollTop+=e,0!==e&&this.doScrolling()}))},this.getChildren=()=>this.listRef&&this.listRef.current?Array.from(this.listRef.current.children):(console.warn("No items found in the List container. Did you forget to pass & spread the `props` param in renderList?"),[]),this.calculateOffsets=()=>{this.topOffsets=this.getChildren().map((e=>e.getBoundingClientRect().top)),this.itemTranslateOffsets=this.getChildren().map((e=>u(e)))},this.getTargetIndex=e=>this.getChildren().findIndex((t=>t===e.target||t.contains(e.target))),this.onMouseOrTouchStart=e=>{this.dropTimeout&&this.state.itemDragged>-1&&(window.clearTimeout(this.dropTimeout),this.finishDrop());const t=(n=e).touches&&n.touches.length||n.changedTouches&&n.changedTouches.length;var n;if(!t&&0!==e.button)return;const r=this.getTargetIndex(e);if(-1===r||this.props.values[r]&&this.props.values[r].disabled)return void(-1!==this.state.selectedItem&&(this.setState({selectedItem:-1}),this.finishDrop()));const i=this.getChildren()[r],s=i.querySelector("[data-movable-handle]");if((!s||s.contains(e.target))&&!f(e.target,i)){if(e.preventDefault(),this.props.beforeDrag&&this.props.beforeDrag({elements:this.getChildren(),index:r}),t){const e={passive:!1};i.style.touchAction="none",document.addEventListener("touchend",this.schdOnEnd,e),document.addEventListener("touchmove",this.schdOnTouchMove,e),document.addEventListener("touchcancel",this.schdOnEnd,e)}else{document.addEventListener("mousemove",this.schdOnMouseMove),document.addEventListener("mouseup",this.schdOnEnd);const e=this.getChildren()[this.state.itemDragged];e&&e.style&&(e.style.touchAction="")}this.onStart(i,t?e.touches[0].clientX:e.clientX,t?e.touches[0].clientY:e.clientY,r)}},this.getYOffset=()=>{const e=this.listRef.current?this.listRef.current.scrollTop:0;return window.pageYOffset+e},this.onStart=(e,t,n,r)=>{this.state.selectedItem>-1&&(this.setState({selectedItem:-1}),this.needle=-1);const i=e.getBoundingClientRect(),s=window.getComputedStyle(e);this.calculateOffsets(),this.initialYOffset=this.getYOffset(),this.lastYOffset=window.pageYOffset,this.lastListYOffset=this.listRef.current.scrollTop,this.setState({itemDragged:r,targetX:i.left-parseInt(s["margin-left"],10),targetY:i.top-parseInt(s["margin-top"],10),targetHeight:i.height,targetWidth:i.width,initialX:t,initialY:n})},this.onMouseMove=e=>{e.cancelable&&e.preventDefault(),this.onMove(e.clientX,e.clientY)},this.onTouchMove=e=>{e.cancelable&&e.preventDefault(),this.onMove(e.touches[0].clientX,e.touches[0].clientY)},this.onWheel=e=>{this.state.itemDragged<0||(this.lastScroll=this.listRef.current.scrollTop+=e.deltaY,this.moveOtherItems())},this.onMove=(e,t)=>{if(-1===this.state.itemDragged)return null;d(this.ghostRef.current,t-this.state.initialY,this.props.lockVertically?0:e-this.state.initialX),this.autoScrolling(t),this.moveOtherItems()},this.moveOtherItems=()=>{const e=this.ghostRef.current.getBoundingClientRect(),t=e.top+e.height/2,n=u(this.getChildren()[this.state.itemDragged]),r=this.getYOffset();this.initialYOffset!==r&&(this.topOffsets=this.topOffsets.map((e=>e-(r-this.initialYOffset))),this.initialYOffset=r),this.isDraggedItemOutOfBounds()&&this.props.removableByMove?this.afterIndex=this.topOffsets.length+1:this.afterIndex=function(e,t){let n,r=0,i=e.length-1;for(;r<=i;){if(n=Math.floor((i+r)/2),!e[n+1]||e[n]<=t&&e[n+1]>=t)return n;e[n]<t&&e[n+1]<t?r=n+1:i=n-1}return-1}(this.topOffsets,t),this.animateItems(-1===this.afterIndex?0:this.afterIndex,this.state.itemDragged,n)},this.autoScrolling=e=>{const{top:t,bottom:n,height:r}=this.listRef.current.getBoundingClientRect(),i=window.innerHeight||document.documentElement.clientHeight;if(n>i&&i-e<m)this.setState({scrollingSpeed:Math.round((m-(i-e))/10),scrollWindow:!0});else if(t<0&&e<m)this.setState({scrollingSpeed:Math.round((m-e)/-10),scrollWindow:!0});else if(this.state.scrollWindow&&0!==this.state.scrollingSpeed&&this.setState({scrollingSpeed:0,scrollWindow:!1}),r+20<this.listRef.current.scrollHeight){let r=0;e-t<m?r=Math.round((m-(e-t))/-10):n-e<m&&(r=Math.round((m-(n-e))/10)),this.state.scrollingSpeed!==r&&this.setState({scrollingSpeed:r})}},this.animateItems=(e,t,n,r=!1)=>{this.getChildren().forEach(((i,s)=>{if(h(i,this.props.transitionDuration),t===s&&r){if(t===e)return d(i,null);d(i,t<e?this.itemTranslateOffsets.slice(t+1,e+1).reduce(((e,t)=>e+t),0):-1*this.itemTranslateOffsets.slice(e,t).reduce(((e,t)=>e+t),0))}else d(i,t<e&&s>t&&s<=e?-n:s<t&&t>e&&s>=e?n:null)}))},this.isDraggedItemOutOfBounds=()=>{const e=this.getChildren()[this.state.itemDragged].getBoundingClientRect(),t=this.ghostRef.current.getBoundingClientRect();return Math.abs(e.left-t.left)>t.width?(-1===this.state.itemDraggedOutOfBounds&&this.setState({itemDraggedOutOfBounds:this.state.itemDragged}),!0):(this.state.itemDraggedOutOfBounds>-1&&this.setState({itemDraggedOutOfBounds:-1}),!1)},this.onEnd=e=>{e.cancelable&&e.preventDefault(),document.removeEventListener("mousemove",this.schdOnMouseMove),document.removeEventListener("touchmove",this.schdOnTouchMove),document.removeEventListener("mouseup",this.schdOnEnd),document.removeEventListener("touchup",this.schdOnEnd),document.removeEventListener("touchcancel",this.schdOnEnd);const t=this.props.removableByMove&&this.isDraggedItemOutOfBounds();!t&&this.props.transitionDuration>0&&-2!==this.afterIndex&&p((()=>{h(this.ghostRef.current,this.props.transitionDuration,"cubic-bezier(.2,1,.1,1)"),this.afterIndex<1&&0===this.state.itemDragged?d(this.ghostRef.current,0,0):d(this.ghostRef.current,-(window.pageYOffset-this.lastYOffset)-(this.listRef.current.scrollTop-this.lastListYOffset)+(this.state.itemDragged<this.afterIndex?this.itemTranslateOffsets.slice(this.state.itemDragged+1,this.afterIndex+1).reduce(((e,t)=>e+t),0):-1*this.itemTranslateOffsets.slice(this.afterIndex<0?0:this.afterIndex,this.state.itemDragged).reduce(((e,t)=>e+t),0)),0)}))(),this.dropTimeout=window.setTimeout(this.finishDrop,t||-2===this.afterIndex?0:this.props.transitionDuration)},this.finishDrop=()=>{const e=this.props.removableByMove&&this.isDraggedItemOutOfBounds();(e||this.afterIndex>-2&&this.state.itemDragged!==this.afterIndex)&&this.props.onChange({oldIndex:this.state.itemDragged,newIndex:e?-1:Math.max(this.afterIndex,0),targetRect:this.ghostRef.current.getBoundingClientRect()}),this.getChildren().forEach((e=>{h(e,0),d(e,null),e.style.touchAction=""})),this.setState({itemDragged:-1,scrollingSpeed:0}),this.afterIndex=-2,this.lastScroll>0&&(this.listRef.current.scrollTop=this.lastScroll,this.lastScroll=0)},this.onKeyDown=e=>{const t=this.state.selectedItem,n=this.getTargetIndex(e);if(!f(e.target,e.currentTarget)&&-1!==n){if(" "===e.key&&(e.preventDefault(),t===n?(t!==this.needle&&(this.getChildren().forEach((e=>{h(e,0),d(e,null)})),this.props.onChange({oldIndex:t,newIndex:this.needle,targetRect:this.getChildren()[this.needle].getBoundingClientRect()}),this.getChildren()[this.needle].focus()),this.setState({selectedItem:-1,liveText:this.props.voiceover.dropped(t+1,this.needle+1)}),this.needle=-1):(this.setState({selectedItem:n,liveText:this.props.voiceover.lifted(n+1)}),this.needle=n,this.calculateOffsets())),("ArrowDown"===e.key||"j"===e.key)&&t>-1&&this.needle<this.props.values.length-1){e.preventDefault();const n=u(this.getChildren()[t]);this.needle++,this.animateItems(this.needle,t,n,!0),this.setState({liveText:this.props.voiceover.moved(this.needle+1,!1)})}if(("ArrowUp"===e.key||"k"===e.key)&&t>-1&&this.needle>0){e.preventDefault();const n=u(this.getChildren()[t]);this.needle--,this.animateItems(this.needle,t,n,!0),this.setState({liveText:this.props.voiceover.moved(this.needle+1,!0)})}"Escape"===e.key&&t>-1&&(this.getChildren().forEach((e=>{h(e,0),d(e,null)})),this.setState({selectedItem:-1,liveText:this.props.voiceover.canceled(t+1)}),this.needle=-1),("Tab"===e.key||"Enter"===e.key)&&t>-1&&e.preventDefault()}},this.schdOnMouseMove=p(this.onMouseMove),this.schdOnTouchMove=p(this.onTouchMove),this.schdOnEnd=p(this.onEnd)}componentDidMount(){this.calculateOffsets(),document.addEventListener("touchstart",this.onMouseOrTouchStart,{passive:!1,capture:!1}),document.addEventListener("mousedown",this.onMouseOrTouchStart)}componentDidUpdate(e,t){t.scrollingSpeed!==this.state.scrollingSpeed&&0===t.scrollingSpeed&&this.doScrolling()}componentWillUnmount(){document.removeEventListener("touchstart",this.onMouseOrTouchStart),document.removeEventListener("mousedown",this.onMouseOrTouchStart),this.dropTimeout&&window.clearTimeout(this.dropTimeout),this.schdOnMouseMove.cancel(),this.schdOnTouchMove.cancel(),this.schdOnEnd.cancel()}render(){const t={userSelect:"none",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",boxSizing:"border-box",position:"relative"},n={...t,top:this.state.targetY,left:this.state.targetX,width:this.state.targetWidth,height:this.state.targetHeight,position:"fixed",marginTop:0};return e.createElement(e.Fragment,null,this.props.renderList({children:this.props.values.map(((e,n)=>{const r=n===this.state.itemDragged,i=n===this.state.selectedItem,s={key:n,tabIndex:this.props.values[n]&&this.props.values[n].disabled?-1:0,"aria-roledescription":this.props.voiceover.item(n+1),onKeyDown:this.onKeyDown,style:{...t,visibility:r?"hidden":void 0,zIndex:i?5e3:0}};return this.props.renderItem({value:e,props:s,index:n,isDragged:!1,isSelected:i,isOutOfBounds:!1})})),isDragged:this.state.itemDragged>-1,props:{ref:this.listRef}}),this.state.itemDragged>-1&&c.createPortal(this.props.renderItem({value:this.props.values[this.state.itemDragged],props:{ref:this.ghostRef,style:n,onWheel:this.onWheel},index:this.state.itemDragged,isDragged:!0,isSelected:!1,isOutOfBounds:this.state.itemDraggedOutOfBounds>-1}),this.props.container||document.body),e.createElement("div",{"aria-live":"assertive",role:"log","aria-atomic":"true",style:{position:"absolute",width:"1px",height:"1px",margin:"-1px",border:"0px",padding:"0px",overflow:"hidden",clip:"rect(0px, 0px, 0px, 0px)",clipPath:"inset(100%)"}},this.state.liveText))}}g.defaultProps={transitionDuration:300,lockVertically:!1,removableByMove:!1,voiceover:{item:e=>`You are currently at a draggable item at position ${e}. Press space bar to lift.`,lifted:e=>`You have lifted item at position ${e}. Press j to move down, k to move up, space bar to drop and escape to cancel.`,moved:(e,t)=>`You have moved the lifted item ${t?"up":"down"} to position ${e}. Press j to move down, k to move up, space bar to drop and escape to cancel.`,dropped:(e,t)=>`You have dropped the item. It has moved from position ${e} to ${t}.`,canceled:e=>`You have cancelled the movement. The item has returned to its starting position of ${e}.`}};const v=g,y=window.prcComponents,w={*getItems(){const{_feature_rewrites:e}=(0,o.select)("core/editor").getEditedPostAttribute("meta");console.log("_feature_rewrites?",e),0===e.length&&(yield y.listStoreActions.seed([])),yield y.listStoreActions.seed(e)}},b="prc-platform/features";function x(){return x=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var n=arguments[t];for(var r in n)Object.prototype.hasOwnProperty.call(n,r)&&(e[r]=n[r])}return e},x.apply(this,arguments)}function k(e){var t=Object.create(null);return function(n){return void 0===t[n]&&(t[n]=e(n)),t[n]}}var S=/^((children|dangerouslySetInnerHTML|key|ref|autoFocus|defaultValue|defaultChecked|innerHTML|suppressContentEditableWarning|suppressHydrationWarning|valueLink|abbr|accept|acceptCharset|accessKey|action|allow|allowUserMedia|allowPaymentRequest|allowFullScreen|allowTransparency|alt|async|autoComplete|autoPlay|capture|cellPadding|cellSpacing|challenge|charSet|checked|cite|classID|className|cols|colSpan|content|contentEditable|contextMenu|controls|controlsList|coords|crossOrigin|data|dateTime|decoding|default|defer|dir|disabled|disablePictureInPicture|download|draggable|encType|enterKeyHint|form|formAction|formEncType|formMethod|formNoValidate|formTarget|frameBorder|headers|height|hidden|high|href|hrefLang|htmlFor|httpEquiv|id|inputMode|integrity|is|keyParams|keyType|kind|label|lang|list|loading|loop|low|marginHeight|marginWidth|max|maxLength|media|mediaGroup|method|min|minLength|multiple|muted|name|nonce|noValidate|open|optimum|pattern|placeholder|playsInline|poster|preload|profile|radioGroup|readOnly|referrerPolicy|rel|required|reversed|role|rows|rowSpan|sandbox|scope|scoped|scrolling|seamless|selected|shape|size|sizes|slot|span|spellCheck|src|srcDoc|srcLang|srcSet|start|step|style|summary|tabIndex|target|title|translate|type|useMap|value|width|wmode|wrap|about|datatype|inlist|prefix|property|resource|typeof|vocab|autoCapitalize|autoCorrect|autoSave|color|incremental|fallback|inert|itemProp|itemScope|itemType|itemID|itemRef|on|option|results|security|unselectable|accentHeight|accumulate|additive|alignmentBaseline|allowReorder|alphabetic|amplitude|arabicForm|ascent|attributeName|attributeType|autoReverse|azimuth|baseFrequency|baselineShift|baseProfile|bbox|begin|bias|by|calcMode|capHeight|clip|clipPathUnits|clipPath|clipRule|colorInterpolation|colorInterpolationFilters|colorProfile|colorRendering|contentScriptType|contentStyleType|cursor|cx|cy|d|decelerate|descent|diffuseConstant|direction|display|divisor|dominantBaseline|dur|dx|dy|edgeMode|elevation|enableBackground|end|exponent|externalResourcesRequired|fill|fillOpacity|fillRule|filter|filterRes|filterUnits|floodColor|floodOpacity|focusable|fontFamily|fontSize|fontSizeAdjust|fontStretch|fontStyle|fontVariant|fontWeight|format|from|fr|fx|fy|g1|g2|glyphName|glyphOrientationHorizontal|glyphOrientationVertical|glyphRef|gradientTransform|gradientUnits|hanging|horizAdvX|horizOriginX|ideographic|imageRendering|in|in2|intercept|k|k1|k2|k3|k4|kernelMatrix|kernelUnitLength|kerning|keyPoints|keySplines|keyTimes|lengthAdjust|letterSpacing|lightingColor|limitingConeAngle|local|markerEnd|markerMid|markerStart|markerHeight|markerUnits|markerWidth|mask|maskContentUnits|maskUnits|mathematical|mode|numOctaves|offset|opacity|operator|order|orient|orientation|origin|overflow|overlinePosition|overlineThickness|panose1|paintOrder|pathLength|patternContentUnits|patternTransform|patternUnits|pointerEvents|points|pointsAtX|pointsAtY|pointsAtZ|preserveAlpha|preserveAspectRatio|primitiveUnits|r|radius|refX|refY|renderingIntent|repeatCount|repeatDur|requiredExtensions|requiredFeatures|restart|result|rotate|rx|ry|scale|seed|shapeRendering|slope|spacing|specularConstant|specularExponent|speed|spreadMethod|startOffset|stdDeviation|stemh|stemv|stitchTiles|stopColor|stopOpacity|strikethroughPosition|strikethroughThickness|string|stroke|strokeDasharray|strokeDashoffset|strokeLinecap|strokeLinejoin|strokeMiterlimit|strokeOpacity|strokeWidth|surfaceScale|systemLanguage|tableValues|targetX|targetY|textAnchor|textDecoration|textRendering|textLength|to|transform|u1|u2|underlinePosition|underlineThickness|unicode|unicodeBidi|unicodeRange|unitsPerEm|vAlphabetic|vHanging|vIdeographic|vMathematical|values|vectorEffect|version|vertAdvY|vertOriginX|vertOriginY|viewBox|viewTarget|visibility|widths|wordSpacing|writingMode|x|xHeight|x1|x2|xChannelSelector|xlinkActuate|xlinkArcrole|xlinkHref|xlinkRole|xlinkShow|xlinkTitle|xlinkType|xmlBase|xmlns|xmlnsXlink|xmlLang|xmlSpace|y|y1|y2|yChannelSelector|z|zoomAndPan|for|class|autofocus)|(([Dd][Aa][Tt][Aa]|[Aa][Rr][Ii][Aa]|x)-.*))$/,O=k((function(e){return S.test(e)||111===e.charCodeAt(0)&&110===e.charCodeAt(1)&&e.charCodeAt(2)<91})),C=function(){function e(e){var t=this;this._insertTag=function(e){var n;n=0===t.tags.length?t.insertionPoint?t.insertionPoint.nextSibling:t.prepend?t.container.firstChild:t.before:t.tags[t.tags.length-1].nextSibling,t.container.insertBefore(e,n),t.tags.push(e)},this.isSpeedy=void 0===e.speedy||e.speedy,this.tags=[],this.ctr=0,this.nonce=e.nonce,this.key=e.key,this.container=e.container,this.prepend=e.prepend,this.insertionPoint=e.insertionPoint,this.before=null}var t=e.prototype;return t.hydrate=function(e){e.forEach(this._insertTag)},t.insert=function(e){this.ctr%(this.isSpeedy?65e3:1)==0&&this._insertTag(function(e){var t=document.createElement("style");return t.setAttribute("data-emotion",e.key),void 0!==e.nonce&&t.setAttribute("nonce",e.nonce),t.appendChild(document.createTextNode("")),t.setAttribute("data-s",""),t}(this));var t=this.tags[this.tags.length-1];if(this.isSpeedy){var n=function(e){if(e.sheet)return e.sheet;for(var t=0;t<document.styleSheets.length;t++)if(document.styleSheets[t].ownerNode===e)return document.styleSheets[t]}(t);try{n.insertRule(e,n.cssRules.length)}catch(e){}}else t.appendChild(document.createTextNode(e));this.ctr++},t.flush=function(){this.tags.forEach((function(e){return e.parentNode&&e.parentNode.removeChild(e)})),this.tags=[],this.ctr=0},e}(),E=Math.abs,I=String.fromCharCode,T=Object.assign;function D(e){return e.trim()}function R(e,t,n){return e.replace(t,n)}function A(e,t){return e.indexOf(t)}function M(e,t){return 0|e.charCodeAt(t)}function P(e,t,n){return e.slice(t,n)}function _(e){return e.length}function $(e){return e.length}function L(e,t){return t.push(e),e}var B=1,Y=1,z=0,N=0,W=0,H="";function j(e,t,n,r,i,s,o){return{value:e,root:t,parent:n,type:r,props:i,children:s,line:B,column:Y,length:o,return:""}}function F(e,t){return T(j("",null,null,"",null,null,0),e,{length:-e.length},t)}function U(){return W=N>0?M(H,--N):0,Y--,10===W&&(Y=1,B--),W}function X(){return W=N<z?M(H,N++):0,Y++,10===W&&(Y=1,B++),W}function q(){return M(H,N)}function V(){return N}function G(e,t){return P(H,e,t)}function K(e){switch(e){case 0:case 9:case 10:case 13:case 32:return 5;case 33:case 43:case 44:case 47:case 62:case 64:case 126:case 59:case 123:case 125:return 4;case 58:return 3;case 34:case 39:case 40:case 91:return 2;case 41:case 93:return 1}return 0}function Z(e){return B=Y=1,z=_(H=e),N=0,[]}function J(e){return H="",e}function Q(e){return D(G(N-1,ne(91===e?e+2:40===e?e+1:e)))}function ee(e){for(;(W=q())&&W<33;)X();return K(e)>2||K(W)>3?"":" "}function te(e,t){for(;--t&&X()&&!(W<48||W>102||W>57&&W<65||W>70&&W<97););return G(e,V()+(t<6&&32==q()&&32==X()))}function ne(e){for(;X();)switch(W){case e:return N;case 34:case 39:34!==e&&39!==e&&ne(W);break;case 40:41===e&&ne(e);break;case 92:X()}return N}function re(e,t){for(;X()&&e+W!==57&&(e+W!==84||47!==q()););return"/*"+G(t,N-1)+"*"+I(47===e?e:X())}function ie(e){for(;!K(q());)X();return G(e,N)}var se="-ms-",oe="-moz-",ae="-webkit-",le="comm",ce="rule",ue="decl",de="@keyframes";function he(e,t){for(var n="",r=$(e),i=0;i<r;i++)n+=t(e[i],i,e,t)||"";return n}function pe(e,t,n,r){switch(e.type){case"@layer":if(e.children.length)break;case"@import":case ue:return e.return=e.return||e.value;case le:return"";case de:return e.return=e.value+"{"+he(e.children,r)+"}";case ce:e.value=e.props.join(",")}return _(n=he(e.children,r))?e.return=e.value+"{"+n+"}":""}function fe(e){return J(me("",null,null,null,[""],e=Z(e),0,[0],e))}function me(e,t,n,r,i,s,o,a,l){for(var c=0,u=0,d=o,h=0,p=0,f=0,m=1,g=1,v=1,y=0,w="",b=i,x=s,k=r,S=w;g;)switch(f=y,y=X()){case 40:if(108!=f&&58==M(S,d-1)){-1!=A(S+=R(Q(y),"&","&\f"),"&\f")&&(v=-1);break}case 34:case 39:case 91:S+=Q(y);break;case 9:case 10:case 13:case 32:S+=ee(f);break;case 92:S+=te(V()-1,7);continue;case 47:switch(q()){case 42:case 47:L(ve(re(X(),V()),t,n),l);break;default:S+="/"}break;case 123*m:a[c++]=_(S)*v;case 125*m:case 59:case 0:switch(y){case 0:case 125:g=0;case 59+u:-1==v&&(S=R(S,/\f/g,"")),p>0&&_(S)-d&&L(p>32?ye(S+";",r,n,d-1):ye(R(S," ","")+";",r,n,d-2),l);break;case 59:S+=";";default:if(L(k=ge(S,t,n,c,u,i,a,w,b=[],x=[],d),s),123===y)if(0===u)me(S,t,k,k,b,s,d,a,x);else switch(99===h&&110===M(S,3)?100:h){case 100:case 108:case 109:case 115:me(e,k,k,r&&L(ge(e,k,k,0,0,i,a,w,i,b=[],d),x),i,x,d,a,r?b:x);break;default:me(S,k,k,k,[""],x,0,a,x)}}c=u=p=0,m=v=1,w=S="",d=o;break;case 58:d=1+_(S),p=f;default:if(m<1)if(123==y)--m;else if(125==y&&0==m++&&125==U())continue;switch(S+=I(y),y*m){case 38:v=u>0?1:(S+="\f",-1);break;case 44:a[c++]=(_(S)-1)*v,v=1;break;case 64:45===q()&&(S+=Q(X())),h=q(),u=d=_(w=S+=ie(V())),y++;break;case 45:45===f&&2==_(S)&&(m=0)}}return s}function ge(e,t,n,r,i,s,o,a,l,c,u){for(var d=i-1,h=0===i?s:[""],p=$(h),f=0,m=0,g=0;f<r;++f)for(var v=0,y=P(e,d+1,d=E(m=o[f])),w=e;v<p;++v)(w=D(m>0?h[v]+" "+y:R(y,/&\f/g,h[v])))&&(l[g++]=w);return j(e,t,n,0===i?ce:a,l,c,u)}function ve(e,t,n){return j(e,t,n,le,I(W),P(e,2,-2),0)}function ye(e,t,n,r){return j(e,t,n,ue,P(e,0,r),P(e,r+1,-1),r)}var we=function(e,t,n){for(var r=0,i=0;r=i,i=q(),38===r&&12===i&&(t[n]=1),!K(i);)X();return G(e,N)},be=new WeakMap,xe=function(e){if("rule"===e.type&&e.parent&&!(e.length<1)){for(var t=e.value,n=e.parent,r=e.column===n.column&&e.line===n.line;"rule"!==n.type;)if(!(n=n.parent))return;if((1!==e.props.length||58===t.charCodeAt(0)||be.get(n))&&!r){be.set(e,!0);for(var i=[],s=function(e,t){return J(function(e,t){var n=-1,r=44;do{switch(K(r)){case 0:38===r&&12===q()&&(t[n]=1),e[n]+=we(N-1,t,n);break;case 2:e[n]+=Q(r);break;case 4:if(44===r){e[++n]=58===q()?"&\f":"",t[n]=e[n].length;break}default:e[n]+=I(r)}}while(r=X());return e}(Z(e),t))}(t,i),o=n.props,a=0,l=0;a<s.length;a++)for(var c=0;c<o.length;c++,l++)e.props[l]=i[a]?s[a].replace(/&\f/g,o[c]):o[c]+" "+s[a]}}},ke=function(e){if("decl"===e.type){var t=e.value;108===t.charCodeAt(0)&&98===t.charCodeAt(2)&&(e.return="",e.value="")}};function Se(e,t){switch(function(e,t){return 45^M(e,0)?(((t<<2^M(e,0))<<2^M(e,1))<<2^M(e,2))<<2^M(e,3):0}(e,t)){case 5103:return ae+"print-"+e+e;case 5737:case 4201:case 3177:case 3433:case 1641:case 4457:case 2921:case 5572:case 6356:case 5844:case 3191:case 6645:case 3005:case 6391:case 5879:case 5623:case 6135:case 4599:case 4855:case 4215:case 6389:case 5109:case 5365:case 5621:case 3829:return ae+e+e;case 5349:case 4246:case 4810:case 6968:case 2756:return ae+e+oe+e+se+e+e;case 6828:case 4268:return ae+e+se+e+e;case 6165:return ae+e+se+"flex-"+e+e;case 5187:return ae+e+R(e,/(\w+).+(:[^]+)/,ae+"box-$1$2"+se+"flex-$1$2")+e;case 5443:return ae+e+se+"flex-item-"+R(e,/flex-|-self/,"")+e;case 4675:return ae+e+se+"flex-line-pack"+R(e,/align-content|flex-|-self/,"")+e;case 5548:return ae+e+se+R(e,"shrink","negative")+e;case 5292:return ae+e+se+R(e,"basis","preferred-size")+e;case 6060:return ae+"box-"+R(e,"-grow","")+ae+e+se+R(e,"grow","positive")+e;case 4554:return ae+R(e,/([^-])(transform)/g,"$1"+ae+"$2")+e;case 6187:return R(R(R(e,/(zoom-|grab)/,ae+"$1"),/(image-set)/,ae+"$1"),e,"")+e;case 5495:case 3959:return R(e,/(image-set\([^]*)/,ae+"$1$`$1");case 4968:return R(R(e,/(.+:)(flex-)?(.*)/,ae+"box-pack:$3"+se+"flex-pack:$3"),/s.+-b[^;]+/,"justify")+ae+e+e;case 4095:case 3583:case 4068:case 2532:return R(e,/(.+)-inline(.+)/,ae+"$1$2")+e;case 8116:case 7059:case 5753:case 5535:case 5445:case 5701:case 4933:case 4677:case 5533:case 5789:case 5021:case 4765:if(_(e)-1-t>6)switch(M(e,t+1)){case 109:if(45!==M(e,t+4))break;case 102:return R(e,/(.+:)(.+)-([^]+)/,"$1"+ae+"$2-$3$1"+oe+(108==M(e,t+3)?"$3":"$2-$3"))+e;case 115:return~A(e,"stretch")?Se(R(e,"stretch","fill-available"),t)+e:e}break;case 4949:if(115!==M(e,t+1))break;case 6444:switch(M(e,_(e)-3-(~A(e,"!important")&&10))){case 107:return R(e,":",":"+ae)+e;case 101:return R(e,/(.+:)([^;!]+)(;|!.+)?/,"$1"+ae+(45===M(e,14)?"inline-":"")+"box$3$1"+ae+"$2$3$1"+se+"$2box$3")+e}break;case 5936:switch(M(e,t+11)){case 114:return ae+e+se+R(e,/[svh]\w+-[tblr]{2}/,"tb")+e;case 108:return ae+e+se+R(e,/[svh]\w+-[tblr]{2}/,"tb-rl")+e;case 45:return ae+e+se+R(e,/[svh]\w+-[tblr]{2}/,"lr")+e}return ae+e+se+e+e}return e}var Oe=[function(e,t,n,r){if(e.length>-1&&!e.return)switch(e.type){case ue:e.return=Se(e.value,e.length);break;case de:return he([F(e,{value:R(e.value,"@","@"+ae)})],r);case ce:if(e.length)return function(e,t){return e.map(t).join("")}(e.props,(function(t){switch(function(e,t){return(e=/(::plac\w+|:read-\w+)/.exec(e))?e[0]:e}(t)){case":read-only":case":read-write":return he([F(e,{props:[R(t,/:(read-\w+)/,":-moz-$1")]})],r);case"::placeholder":return he([F(e,{props:[R(t,/:(plac\w+)/,":"+ae+"input-$1")]}),F(e,{props:[R(t,/:(plac\w+)/,":-moz-$1")]}),F(e,{props:[R(t,/:(plac\w+)/,se+"input-$1")]})],r)}return""}))}}],Ce=function(e){var t=e.key;if("css"===t){var n=document.querySelectorAll("style[data-emotion]:not([data-s])");Array.prototype.forEach.call(n,(function(e){-1!==e.getAttribute("data-emotion").indexOf(" ")&&(document.head.appendChild(e),e.setAttribute("data-s",""))}))}var r,i,s=e.stylisPlugins||Oe,o={},a=[];r=e.container||document.head,Array.prototype.forEach.call(document.querySelectorAll('style[data-emotion^="'+t+' "]'),(function(e){for(var t=e.getAttribute("data-emotion").split(" "),n=1;n<t.length;n++)o[t[n]]=!0;a.push(e)}));var l,c,u,d,h=[pe,(d=function(e){l.insert(e)},function(e){e.root||(e=e.return)&&d(e)})],p=(c=[xe,ke].concat(s,h),u=$(c),function(e,t,n,r){for(var i="",s=0;s<u;s++)i+=c[s](e,t,n,r)||"";return i});i=function(e,t,n,r){l=n,he(fe(e?e+"{"+t.styles+"}":t.styles),p),r&&(f.inserted[t.name]=!0)};var f={key:t,sheet:new C({key:t,container:r,nonce:e.nonce,speedy:e.speedy,prepend:e.prepend,insertionPoint:e.insertionPoint}),nonce:e.nonce,inserted:o,registered:{},insert:i};return f.sheet.hydrate(a),f},Ee={animationIterationCount:1,aspectRatio:1,borderImageOutset:1,borderImageSlice:1,borderImageWidth:1,boxFlex:1,boxFlexGroup:1,boxOrdinalGroup:1,columnCount:1,columns:1,flex:1,flexGrow:1,flexPositive:1,flexShrink:1,flexNegative:1,flexOrder:1,gridRow:1,gridRowEnd:1,gridRowSpan:1,gridRowStart:1,gridColumn:1,gridColumnEnd:1,gridColumnSpan:1,gridColumnStart:1,msGridRow:1,msGridRowSpan:1,msGridColumn:1,msGridColumnSpan:1,fontWeight:1,lineHeight:1,opacity:1,order:1,orphans:1,tabSize:1,widows:1,zIndex:1,zoom:1,WebkitLineClamp:1,fillOpacity:1,floodOpacity:1,stopOpacity:1,strokeDasharray:1,strokeDashoffset:1,strokeMiterlimit:1,strokeOpacity:1,strokeWidth:1},Ie=/[A-Z]|^ms/g,Te=/_EMO_([^_]+?)_([^]*?)_EMO_/g,De=function(e){return 45===e.charCodeAt(1)},Re=function(e){return null!=e&&"boolean"!=typeof e},Ae=k((function(e){return De(e)?e:e.replace(Ie,"-$&").toLowerCase()})),Me=function(e,t){switch(e){case"animation":case"animationName":if("string"==typeof t)return t.replace(Te,(function(e,t,n){return _e={name:t,styles:n,next:_e},t}))}return 1===Ee[e]||De(e)||"number"!=typeof t||0===t?t:t+"px"};function Pe(e,t,n){if(null==n)return"";if(void 0!==n.__emotion_styles)return n;switch(typeof n){case"boolean":return"";case"object":if(1===n.anim)return _e={name:n.name,styles:n.styles,next:_e},n.name;if(void 0!==n.styles){var r=n.next;if(void 0!==r)for(;void 0!==r;)_e={name:r.name,styles:r.styles,next:_e},r=r.next;return n.styles+";"}return function(e,t,n){var r="";if(Array.isArray(n))for(var i=0;i<n.length;i++)r+=Pe(e,t,n[i])+";";else for(var s in n){var o=n[s];if("object"!=typeof o)null!=t&&void 0!==t[o]?r+=s+"{"+t[o]+"}":Re(o)&&(r+=Ae(s)+":"+Me(s,o)+";");else if(!Array.isArray(o)||"string"!=typeof o[0]||null!=t&&void 0!==t[o[0]]){var a=Pe(e,t,o);switch(s){case"animation":case"animationName":r+=Ae(s)+":"+a+";";break;default:r+=s+"{"+a+"}"}}else for(var l=0;l<o.length;l++)Re(o[l])&&(r+=Ae(s)+":"+Me(s,o[l])+";")}return r}(e,t,n);case"function":if(void 0!==e){var i=_e,s=n(e);return _e=i,Pe(e,t,s)}}if(null==t)return n;var o=t[n];return void 0!==o?o:n}var _e,$e=/label:\s*([^\s;\n{]+)\s*(;|$)/g,Le=!!e.useInsertionEffect&&e.useInsertionEffect,Be=Le||function(e){return e()},Ye=(Le||e.useLayoutEffect,e.createContext("undefined"!=typeof HTMLElement?Ce({key:"css"}):null));Ye.Provider;var ze=e.createContext({}),Ne=function(e,t,n){var r=e.key+"-"+t.name;!1===n&&void 0===e.registered[r]&&(e.registered[r]=t.styles)},We=O,He=function(e){return"theme"!==e},je=function(e){return"string"==typeof e&&e.charCodeAt(0)>96?We:He},Fe=function(e,t,n){var r;if(t){var i=t.shouldForwardProp;r=e.__emotion_forwardProp&&i?function(t){return e.__emotion_forwardProp(t)&&i(t)}:i}return"function"!=typeof r&&n&&(r=e.__emotion_forwardProp),r},Ue=function(e){var t=e.cache,n=e.serialized,r=e.isStringTag;return Ne(t,n,r),Be((function(){return function(e,t,n){Ne(e,t,n);var r=e.key+"-"+t.name;if(void 0===e.inserted[t.name]){var i=t;do{e.insert(t===i?"."+r:"",i,e.sheet,!0),i=i.next}while(void 0!==i)}}(t,n,r)})),null},Xe=function t(n,r){var i,s,o=n.__emotion_real===n,a=o&&n.__emotion_base||n;void 0!==r&&(i=r.label,s=r.target);var l=Fe(n,r,o),c=l||je(a),u=!c("as");return function(){var d=arguments,h=o&&void 0!==n.__emotion_styles?n.__emotion_styles.slice(0):[];if(void 0!==i&&h.push("label:"+i+";"),null==d[0]||void 0===d[0].raw)h.push.apply(h,d);else{h.push(d[0][0]);for(var p=d.length,f=1;f<p;f++)h.push(d[f],d[0][f])}var m,g=(m=function(t,n,r){var i,o,d,p,f=u&&t.as||a,m="",g=[],v=t;if(null==t.theme){for(var y in v={},t)v[y]=t[y];v.theme=e.useContext(ze)}"string"==typeof t.className?(i=n.registered,o=g,d=t.className,p="",d.split(" ").forEach((function(e){void 0!==i[e]?o.push(i[e]+";"):p+=e+" "})),m=p):null!=t.className&&(m=t.className+" ");var w=function(e,t,n){if(1===e.length&&"object"==typeof e[0]&&null!==e[0]&&void 0!==e[0].styles)return e[0];var r=!0,i="";_e=void 0;var s=e[0];null==s||void 0===s.raw?(r=!1,i+=Pe(n,t,s)):i+=s[0];for(var o=1;o<e.length;o++)i+=Pe(n,t,e[o]),r&&(i+=s[o]);$e.lastIndex=0;for(var a,l="";null!==(a=$e.exec(i));)l+="-"+a[1];var c=function(e){for(var t,n=0,r=0,i=e.length;i>=4;++r,i-=4)t=1540483477*(65535&(t=255&e.charCodeAt(r)|(255&e.charCodeAt(++r))<<8|(255&e.charCodeAt(++r))<<16|(255&e.charCodeAt(++r))<<24))+(59797*(t>>>16)<<16),n=1540483477*(65535&(t^=t>>>24))+(59797*(t>>>16)<<16)^1540483477*(65535&n)+(59797*(n>>>16)<<16);switch(i){case 3:n^=(255&e.charCodeAt(r+2))<<16;case 2:n^=(255&e.charCodeAt(r+1))<<8;case 1:n=1540483477*(65535&(n^=255&e.charCodeAt(r)))+(59797*(n>>>16)<<16)}return(((n=1540483477*(65535&(n^=n>>>13))+(59797*(n>>>16)<<16))^n>>>15)>>>0).toString(36)}(i)+l;return{name:c,styles:i,next:_e}}(h.concat(g),n.registered,v);m+=n.key+"-"+w.name,void 0!==s&&(m+=" "+s);var b=u&&void 0===l?je(f):c,x={};for(var k in t)u&&"as"===k||b(k)&&(x[k]=t[k]);return x.className=m,x.ref=r,e.createElement(e.Fragment,null,e.createElement(Ue,{cache:n,serialized:w,isStringTag:"string"==typeof f}),e.createElement(f,x))},(0,e.forwardRef)((function(t,n){var r=(0,e.useContext)(Ye);return m(t,r,n)})));return g.displayName=void 0!==i?i:"Styled("+("string"==typeof a?a:a.displayName||a.name||"Component")+")",g.defaultProps=n.defaultProps,g.__emotion_real=g,g.__emotion_base=a,g.__emotion_styles=h,g.__emotion_forwardProp=l,Object.defineProperty(g,"toString",{value:function(){return"."+s}}),g.withComponent=function(e,n){return t(e,x({},r,n,{shouldForwardProp:Fe(g,n,!0)})).apply(void 0,h)},g}}.bind();["a","abbr","address","area","article","aside","audio","b","base","bdi","bdo","big","blockquote","body","br","button","canvas","caption","cite","code","col","colgroup","data","datalist","dd","del","details","dfn","dialog","div","dl","dt","em","embed","fieldset","figcaption","figure","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","iframe","img","input","ins","kbd","keygen","label","legend","li","link","main","map","mark","marquee","menu","menuitem","meta","meter","nav","noscript","object","ol","optgroup","option","output","p","param","picture","pre","progress","q","rp","rt","ruby","s","samp","script","section","select","small","source","span","strong","style","sub","summary","sup","table","tbody","td","textarea","tfoot","th","thead","time","title","tr","track","u","ul","var","video","wbr","circle","clipPath","defs","ellipse","foreignObject","g","image","line","linearGradient","mask","path","pattern","polygon","polyline","radialGradient","rect","stop","svg","text","tspan"].forEach((function(e){Xe[e]=Xe(e)}));const qe=window.prcHooks,Ve=window.wp.element,Ge=window.wp.primitives,Ke=(0,e.createElement)(Ge.SVG,{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(Ge.Path,{d:"M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"})),Ze=Xe("div")`
	background: white;
	padding-bottom: 1em;
	margin-bottom: 1em;
	border-bottom: 1px solid #eaeaea;

	&.is-last {
		border-bottom: none;
		margin-bottom: 0;
	}
`,Je=Xe("div")`
	display: flex;
	align-items: center;
	flex-direction: row;
	width: 100%;
`,Qe=Xe("div")`
	display: flex;
`,et=Xe("div")`
	display: flex;
	flex-direction: column;
	flex-grow: 1;
	padding-left: 1em;

	& .components-base-control__field {
		margin-bottom: 0;
	}
`,tt=function({key:t,index:n,label:i,pattern:s="",onRemove:a=!1,lastItem:l=!1}){const{remove:c,setItemProp:u}=(0,o.useDispatch)(b),[d,h]=(0,Ve.useState)(s),p=(0,qe.useDebounce)(d,500);return(0,Ve.useEffect)((()=>{u(n,"pattern",p)}),[p]),(0,e.createElement)(Ze,{className:`${l?"is-last":null}`},(0,e.createElement)(Je,null,(0,e.createElement)(Qe,null,(0,e.createElement)(r.Icon,{icon:Ke})),(0,e.createElement)(et,null,(0,e.createElement)(r.TextControl,{value:d,onChange:e=>h(e)})),(0,e.createElement)("div",{style:{display:"flex",flexDirection:"column"}},(0,e.createElement)(r.IconButton,{icon:"no-alt",onClick:()=>{!1!==a&&"function"==typeof a&&a(),c(n)}}))))};function nt({postType:n,postId:i,postSlug:s}){const{append:l,reorder:c}=(0,o.useDispatch)(b),u=(0,o.useSelect)((e=>e(b).getItems())),[d,h]=(0,a.useEntityProp)("postType",n,"meta");return(0,e.useEffect)((()=>{0!==u.length&&(console.log("<RewritesPanel> Meta Save...",u),h({...d,_feature_rewrites:u}))}),[u]),(0,e.createElement)(r.BaseControl,{help:(0,t.__)("You can add rewrites to your feature by using the `{myVar}` syntax to indicate URL parameters that you want to be accessible in the `prcURLVars` window namespace.")},(0,e.createElement)(v,{lockVertically:!0,values:u,onChange:({oldIndex:e,newIndex:t})=>c({from:e,to:t}),renderList:({children:t,props:n})=>(0,e.createElement)("div",{...n},t),renderItem:({value:t,props:n,index:r})=>(0,e.createElement)("div",{...n},(0,e.createElement)(tt,{key:t.key,pattern:t?.pattern||"",label:"Rewrite Schema",index:r,lastItem:r===u.length-1}))}),(0,e.createElement)(r.Button,{variant:"primary",onClick:()=>{l({key:`_${Math.random().toString(36).substr(2,9)}`,pattern:"{myNewParam}/{myOtherNewParam}"})}},"Add New Rewrite"))}(0,y.registerListStore)("prc-platform/features",w,{getItems:e=>e});const rt="prc-platform-feature-options";(0,n.registerPlugin)(rt,{render:function(){const{postType:t,postId:n,postSlug:a}=(0,o.useSelect)((e=>({postType:e(s.store).getCurrentPostType(),postId:e(s.store).getCurrentPostId(),postSlug:e(s.store).getEditedPostAttribute("slug")})),[]);return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(i.PluginSidebar,{name:rt,title:"Feature Options",icon:"analytics"},(0,e.createElement)(r.PanelBody,{title:"Rewrites"},(0,e.createElement)(nt,{postType:t,postId:n,postSlug:a})),(0,e.createElement)(r.PanelBody,{title:"Developer Notes"},(0,e.createElement)(l,{postType:t,postId:n,postSlug:a}))),(0,e.createElement)(i.PluginPrePublishPanel,null,(0,e.createElement)("p",null,"Dont forget to double check your feature rewrites...")))}})})();
//# sourceMappingURL=index.js.map