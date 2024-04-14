(()=>{"use strict";const e=window.React,t=window.wp.element,n=(0,t.forwardRef)((function({icon:e,size:n=24,...i},s){return(0,t.cloneElement)(e,{width:n,height:n,...i,ref:s})})),i=window.wp.primitives,s=(0,e.createElement)(i.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(i.Path,{fillRule:"evenodd",d:"M8.95 11.25H4v1.5h4.95v4.5H13V18c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2v-3c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75h-2.55v-7.5H13V9c0 1.1.9 2 2 2h3c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3c-1.1 0-2 .9-2 2v.75H8.95v4.5ZM14.5 15v3c0 .3.2.5.5.5h3c.3 0 .5-.2.5-.5v-3c0-.3-.2-.5-.5-.5h-3c-.3 0-.5.2-.5.5Zm0-6V6c0-.3.2-.5.5-.5h3c.3 0 .5.2.5.5v3c0 .3-.2.5-.5.5h-3c-.3 0-.5-.2-.5-.5Z",clipRule:"evenodd"})),o=window.wp.i18n,r=window.wp.plugins,a=window.wp.editPost,l=window.wp.editor,c=window.wp.data,d=window.wp.components,h=window.prcHooks,p=window.wp.coreData,u=(0,t.createContext)(),m=()=>(0,t.useContext)(u);function g({postId:n,postType:i,currentPostId:s,children:o}){const r=((e,n,i)=>{var s,o;const[r,a]=(0,p.useEntityProp)("postType",n,"meta",e),{canDelete:l,isResolving:c}=(0,p.useResourcePermissions)("posts",e),[d,u]=(0,t.useState)(null!==(s=r?.reportMaterials)&&void 0!==s?s:[]),[m,g]=(0,t.useState)(null!==(o=r?.multiSectionReport)&&void 0!==o?o:[]),f=(0,h.useDebounce)(d,500),v=(0,h.useDebounce)(m,500),E=(0,t.useMemo)((()=>!c&&!!l),[c,l]);(0,t.useEffect)((()=>{console.log("Materials...",d),E&&void 0!==r&&a({...r,reportMaterials:d})}),[f]),(0,t.useEffect)((()=>{console.log("Back Chapters...",m),E&&void 0!==r&&a({...r,multiSectionReport:m})}),[v]);const w=(e="materials")=>"materials"===e?[...d]:"backChapters"===e?[...m]:[];return{allowEditing:E,postId:e,currentPostId:i,postType:n,materials:d,backChapters:m,reorder:(e,t,n="materials")=>{if(!E)return;const i=w(n),s=i[e];i.splice(e,1),i.splice(t,0,s);let o=()=>console.log("reorder",e,t,n);"materials"===n?o=u:"backChapters"===n&&(o=g),o(i)},append:(e,t={},n="materials")=>{if(!E)return;const i=w(n),s={key:e};Object.assign(s,t),i.push(s);let o=()=>console.log("append",e,t,s,n);"materials"===n?o=u:"backChapters"===n&&(o=g),o(i)},remove:(e,t="materials")=>{if(!E)return;const n=w(t);n.splice(e,1);let i=()=>console.log("remove",e,t);"materials"===t?i=u:"backChapters"===t&&(i=g),i(n)},updateItem:(e,t,n,i="materials")=>{if(!E)return;console.log("updateItem",e,t,n,i,E,c,l);const s=w(i);s[e][t]=n;let o=()=>console.log("updateItem",e,t,n,i);"materials"===i?o=u:"backChapters"===i&&(o=g),o(s)}}})(n,i,s);return(0,e.createElement)(u.Provider,{value:r},o)}const f=window.ReactDOM;function v(e){const t=window.getComputedStyle(e);return Math.max(parseInt(t["margin-top"],10),parseInt(t["margin-bottom"],10))+e.getBoundingClientRect().height}function E(e,t=0,n=0){e&&(null!==t&&null!==n?e.style.transform=`translate(${n}px, ${t}px)`:e.style.removeProperty("transform"))}function w(e,t,n){e&&(e.style.transition=`transform ${t}ms${n?` ${n}`:""}`)}const b=e=>{let t=[],n=null;const i=(...i)=>{t=i,n||(n=requestAnimationFrame((()=>{n=null,e(...t)})))};return i.cancel=()=>{n&&cancelAnimationFrame(n)},i};function C(e,t){const n=["input","textarea","select","option","optgroup","video","audio","button","a"],i=["button","link","checkbox","tab"];for(;e!==t;){if(e.getAttribute("data-movable-handle"))return!1;if(n.includes(e.tagName.toLowerCase()))return!0;const t=e.getAttribute("role");if(t&&i.includes(t.toLowerCase()))return!0;if("label"===e.tagName.toLowerCase()&&e.hasAttribute("for"))return!0;e.tagName&&(e=e.parentElement)}return!1}const y=200,I=10,x=10;class O extends e.Component{constructor(t){super(t),this.listRef=e.createRef(),this.ghostRef=e.createRef(),this.topOffsets=[],this.itemTranslateOffsets=[],this.initialYOffset=0,this.lastScroll=0,this.lastYOffset=0,this.lastListYOffset=0,this.needle=-1,this.afterIndex=-2,this.state={itemDragged:-1,itemDraggedOutOfBounds:-1,selectedItem:-1,initialX:0,initialY:0,targetX:0,targetY:0,targetHeight:0,targetWidth:0,liveText:"",scrollingSpeed:0,scrollWindow:!1},this.doScrolling=()=>{const{scrollingSpeed:e,scrollWindow:t}=this.state,n=this.listRef.current;window.requestAnimationFrame((()=>{t?window.scrollTo(window.pageXOffset,window.pageYOffset+1.5*e):n.scrollTop+=e,0!==e&&this.doScrolling()}))},this.getChildren=()=>this.listRef&&this.listRef.current?Array.from(this.listRef.current.children):(console.warn("No items found in the List container. Did you forget to pass & spread the `props` param in renderList?"),[]),this.calculateOffsets=()=>{this.topOffsets=this.getChildren().map((e=>e.getBoundingClientRect().top)),this.itemTranslateOffsets=this.getChildren().map((e=>v(e)))},this.getTargetIndex=e=>this.getChildren().findIndex((t=>t===e.target||t.contains(e.target))),this.onMouseOrTouchStart=e=>{this.dropTimeout&&this.state.itemDragged>-1&&(window.clearTimeout(this.dropTimeout),this.finishDrop());const t=(n=e).touches&&n.touches.length||n.changedTouches&&n.changedTouches.length;var n;if(!t&&0!==e.button)return;const i=this.getTargetIndex(e);if(-1===i||this.props.values[i]&&this.props.values[i].disabled)return void(-1!==this.state.selectedItem&&(this.setState({selectedItem:-1}),this.finishDrop()));const s=this.getChildren()[i],o=s.querySelector("[data-movable-handle]");if((!o||o.contains(e.target))&&!C(e.target,s)){if(e.preventDefault(),this.props.beforeDrag&&this.props.beforeDrag({elements:this.getChildren(),index:i}),t){const e={passive:!1};s.style.touchAction="none",document.addEventListener("touchend",this.schdOnEnd,e),document.addEventListener("touchmove",this.schdOnTouchMove,e),document.addEventListener("touchcancel",this.schdOnEnd,e)}else{document.addEventListener("mousemove",this.schdOnMouseMove),document.addEventListener("mouseup",this.schdOnEnd);const e=this.getChildren()[this.state.itemDragged];e&&e.style&&(e.style.touchAction="")}this.onStart(s,t?e.touches[0].clientX:e.clientX,t?e.touches[0].clientY:e.clientY,i)}},this.getYOffset=()=>{const e=this.listRef.current?this.listRef.current.scrollTop:0;return window.pageYOffset+e},this.onStart=(e,t,n,i)=>{this.state.selectedItem>-1&&(this.setState({selectedItem:-1}),this.needle=-1);const s=e.getBoundingClientRect(),o=window.getComputedStyle(e);this.calculateOffsets(),this.initialYOffset=this.getYOffset(),this.lastYOffset=window.pageYOffset,this.lastListYOffset=this.listRef.current.scrollTop,this.setState({itemDragged:i,targetX:s.left-parseInt(o["margin-left"],10),targetY:s.top-parseInt(o["margin-top"],10),targetHeight:s.height,targetWidth:s.width,initialX:t,initialY:n})},this.onMouseMove=e=>{e.cancelable&&e.preventDefault(),this.onMove(e.clientX,e.clientY)},this.onTouchMove=e=>{e.cancelable&&e.preventDefault(),this.onMove(e.touches[0].clientX,e.touches[0].clientY)},this.onWheel=e=>{this.state.itemDragged<0||(this.lastScroll=this.listRef.current.scrollTop+=e.deltaY,this.moveOtherItems())},this.onMove=(e,t)=>{if(-1===this.state.itemDragged)return null;E(this.ghostRef.current,t-this.state.initialY,this.props.lockVertically?0:e-this.state.initialX),this.autoScrolling(t,t-this.state.initialY),this.moveOtherItems()},this.moveOtherItems=()=>{const e=this.ghostRef.current.getBoundingClientRect(),t=e.top+e.height/2,n=v(this.getChildren()[this.state.itemDragged]),i=this.getYOffset();this.initialYOffset!==i&&(this.topOffsets=this.topOffsets.map((e=>e-(i-this.initialYOffset))),this.initialYOffset=i),this.isDraggedItemOutOfBounds()&&this.props.removableByMove?this.afterIndex=this.topOffsets.length+1:this.afterIndex=function(e,t){let n,i=0,s=e.length-1;for(;i<=s;){if(n=Math.floor((s+i)/2),!e[n+1]||e[n]<=t&&e[n+1]>=t)return n;e[n]<t&&e[n+1]<t?i=n+1:s=n-1}return-1}(this.topOffsets,t),this.animateItems(-1===this.afterIndex?0:this.afterIndex,this.state.itemDragged,n)},this.autoScrolling=(e,t)=>{const{top:n,bottom:i,height:s}=this.listRef.current.getBoundingClientRect(),o=window.innerHeight||document.documentElement.clientHeight;if(i>o&&o-e<y&&t>x)this.setState({scrollingSpeed:Math.min(Math.round((y-(o-e))/I),Math.round((t-x)/I)),scrollWindow:!0});else if(n<0&&e<y&&t<-10)this.setState({scrollingSpeed:Math.max(Math.round((y-e)/-10),Math.round((t+x)/I)),scrollWindow:!0});else if(this.state.scrollWindow&&0!==this.state.scrollingSpeed&&this.setState({scrollingSpeed:0,scrollWindow:!1}),s+20<this.listRef.current.scrollHeight){let s=0;e-n<y&&t<-10?s=Math.max(Math.round((y-(e-n))/-10),Math.round((t+x)/I)):i-e<y&&t>x&&(s=Math.min(Math.round((y-(i-e))/I),Math.round((t-x)/I))),this.state.scrollingSpeed!==s&&this.setState({scrollingSpeed:s})}},this.animateItems=(e,t,n,i=!1)=>{this.getChildren().forEach(((s,o)=>{if(w(s,this.props.transitionDuration),t===o&&i){if(t===e)return E(s,null);E(s,t<e?this.itemTranslateOffsets.slice(t+1,e+1).reduce(((e,t)=>e+t),0):-1*this.itemTranslateOffsets.slice(e,t).reduce(((e,t)=>e+t),0))}else E(s,t<e&&o>t&&o<=e?-n:o<t&&t>e&&o>=e?n:null)}))},this.isDraggedItemOutOfBounds=()=>{const e=this.getChildren()[this.state.itemDragged].getBoundingClientRect(),t=this.ghostRef.current.getBoundingClientRect();return Math.abs(e.left-t.left)>t.width?(-1===this.state.itemDraggedOutOfBounds&&this.setState({itemDraggedOutOfBounds:this.state.itemDragged}),!0):(this.state.itemDraggedOutOfBounds>-1&&this.setState({itemDraggedOutOfBounds:-1}),!1)},this.onEnd=e=>{e.cancelable&&e.preventDefault(),document.removeEventListener("mousemove",this.schdOnMouseMove),document.removeEventListener("touchmove",this.schdOnTouchMove),document.removeEventListener("mouseup",this.schdOnEnd),document.removeEventListener("touchup",this.schdOnEnd),document.removeEventListener("touchcancel",this.schdOnEnd);const t=this.props.removableByMove&&this.isDraggedItemOutOfBounds();!t&&this.props.transitionDuration>0&&-2!==this.afterIndex&&b((()=>{w(this.ghostRef.current,this.props.transitionDuration,"cubic-bezier(.2,1,.1,1)"),this.afterIndex<1&&0===this.state.itemDragged?E(this.ghostRef.current,0,0):E(this.ghostRef.current,-(window.pageYOffset-this.lastYOffset)-(this.listRef.current.scrollTop-this.lastListYOffset)+(this.state.itemDragged<this.afterIndex?this.itemTranslateOffsets.slice(this.state.itemDragged+1,this.afterIndex+1).reduce(((e,t)=>e+t),0):-1*this.itemTranslateOffsets.slice(this.afterIndex<0?0:this.afterIndex,this.state.itemDragged).reduce(((e,t)=>e+t),0)),0)}))(),this.dropTimeout=window.setTimeout(this.finishDrop,t||-2===this.afterIndex?0:this.props.transitionDuration)},this.finishDrop=()=>{const e=this.props.removableByMove&&this.isDraggedItemOutOfBounds();(e||this.afterIndex>-2&&this.state.itemDragged!==this.afterIndex)&&this.props.onChange({oldIndex:this.state.itemDragged,newIndex:e?-1:Math.max(this.afterIndex,0),targetRect:this.ghostRef.current.getBoundingClientRect()}),this.getChildren().forEach((e=>{w(e,0),E(e,null),e.style.touchAction=""})),this.setState({itemDragged:-1,scrollingSpeed:0}),this.afterIndex=-2,this.lastScroll>0&&(this.listRef.current.scrollTop=this.lastScroll,this.lastScroll=0)},this.onKeyDown=e=>{const t=this.state.selectedItem,n=this.getTargetIndex(e);if(!C(e.target,e.currentTarget)&&-1!==n){if(" "===e.key&&(e.preventDefault(),t===n?(t!==this.needle&&(this.getChildren().forEach((e=>{w(e,0),E(e,null)})),this.props.onChange({oldIndex:t,newIndex:this.needle,targetRect:this.getChildren()[this.needle].getBoundingClientRect()}),this.getChildren()[this.needle].focus()),this.setState({selectedItem:-1,liveText:this.props.voiceover.dropped(t+1,this.needle+1)}),this.needle=-1):(this.setState({selectedItem:n,liveText:this.props.voiceover.lifted(n+1)}),this.needle=n,this.calculateOffsets())),("ArrowDown"===e.key||"j"===e.key)&&t>-1&&this.needle<this.props.values.length-1){e.preventDefault();const n=v(this.getChildren()[t]);this.needle++,this.animateItems(this.needle,t,n,!0),this.setState({liveText:this.props.voiceover.moved(this.needle+1,!1)})}if(("ArrowUp"===e.key||"k"===e.key)&&t>-1&&this.needle>0){e.preventDefault();const n=v(this.getChildren()[t]);this.needle--,this.animateItems(this.needle,t,n,!0),this.setState({liveText:this.props.voiceover.moved(this.needle+1,!0)})}"Escape"===e.key&&t>-1&&(this.getChildren().forEach((e=>{w(e,0),E(e,null)})),this.setState({selectedItem:-1,liveText:this.props.voiceover.canceled(t+1)}),this.needle=-1),("Tab"===e.key||"Enter"===e.key)&&t>-1&&e.preventDefault()}},this.schdOnMouseMove=b(this.onMouseMove),this.schdOnTouchMove=b(this.onTouchMove),this.schdOnEnd=b(this.onEnd)}componentDidMount(){this.calculateOffsets(),document.addEventListener("touchstart",this.onMouseOrTouchStart,{passive:!1,capture:!1}),document.addEventListener("mousedown",this.onMouseOrTouchStart)}componentDidUpdate(e,t){t.scrollingSpeed!==this.state.scrollingSpeed&&0===t.scrollingSpeed&&this.doScrolling()}componentWillUnmount(){document.removeEventListener("touchstart",this.onMouseOrTouchStart),document.removeEventListener("mousedown",this.onMouseOrTouchStart),this.dropTimeout&&window.clearTimeout(this.dropTimeout),this.schdOnMouseMove.cancel(),this.schdOnTouchMove.cancel(),this.schdOnEnd.cancel()}render(){const t={userSelect:"none",WebkitUserSelect:"none",MozUserSelect:"none",msUserSelect:"none",boxSizing:"border-box",position:"relative"},n={...t,top:this.state.targetY,left:this.state.targetX,width:this.state.targetWidth,height:this.state.targetHeight,position:"fixed",marginTop:0};return e.createElement(e.Fragment,null,this.props.renderList({children:this.props.values.map(((e,n)=>{const i=n===this.state.itemDragged,s=n===this.state.selectedItem,o={key:n,tabIndex:this.props.values[n]&&this.props.values[n].disabled?-1:0,"aria-roledescription":this.props.voiceover.item(n+1),onKeyDown:this.onKeyDown,style:{...t,visibility:i?"hidden":void 0,zIndex:s?5e3:0}};return this.props.renderItem({value:e,props:o,index:n,isDragged:!1,isSelected:s,isOutOfBounds:!1})})),isDragged:this.state.itemDragged>-1,props:{ref:this.listRef}}),this.state.itemDragged>-1&&f.createPortal(this.props.renderItem({value:this.props.values[this.state.itemDragged],props:{ref:this.ghostRef,style:n,onWheel:this.onWheel},index:this.state.itemDragged,isDragged:!0,isSelected:!1,isOutOfBounds:this.state.itemDraggedOutOfBounds>-1}),this.props.container||document.body),e.createElement("div",{"aria-live":"assertive",role:"log","aria-atomic":"true",style:{position:"absolute",width:"1px",height:"1px",margin:"-1px",border:"0px",padding:"0px",overflow:"hidden",clip:"rect(0px, 0px, 0px, 0px)",clipPath:"inset(100%)"}},this.state.liveText))}}O.defaultProps={transitionDuration:300,lockVertically:!1,removableByMove:!1,voiceover:{item:e=>`You are currently at a draggable item at position ${e}. Press space bar to lift.`,lifted:e=>`You have lifted item at position ${e}. Press j to move down, k to move up, space bar to drop and escape to cancel.`,moved:(e,t)=>`You have moved the lifted item ${t?"up":"down"} to position ${e}. Press j to move down, k to move up, space bar to drop and escape to cancel.`,dropped:(e,t)=>`You have dropped the item. It has moved from position ${e} to ${t}.`,canceled:e=>`You have cancelled the movement. The item has returned to its starting position of ${e}.`}};const S=O;function T(){return`_${Math.random().toString(36).substr(2,9)}`}const D=window.wp.htmlEntities,k=(0,e.createElement)(i.SVG,{width:"24",height:"24",xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(i.Path,{d:"M8 7h2V5H8v2zm0 6h2v-2H8v2zm0 6h2v-2H8v2zm6-14v2h2V5h-2zm0 8h2v-2h-2v2zm0 6h2v-2h-2v2z"}));function M({label:n,defaultLabel:i,keyValue:s,index:o,children:r,onRemove:a=!1,lastItem:l=!1,icon:c=!1}){const[h]=(0,p.useEntityProp)("postType","post","title",s),u=(0,t.useMemo)((()=>void 0===n&&void 0!==h&&""!==h?(0,D.decodeEntities)(h):void 0!==n&&""!==n?n:i),[h,n,i]);return(0,e.createElement)("div",{style:{background:"white",paddingBottom:"1em",marginBottom:"1em",borderBottom:l?"none":"1px solid #EAEAEA"}},(0,e.createElement)("div",{style:{display:"flex",flexDirection:"row",width:"100%",alignItems:"center"}},(0,e.createElement)("div",{style:{display:"flex"}},(0,e.createElement)(d.Icon,{icon:k})),(0,e.createElement)("div",{style:{display:"flex",flexGrow:"1",paddingLeft:"1em"}},!1!==c&&{icon:c},(0,e.createElement)("span",null,u)),(0,e.createElement)("div",{style:{display:"flex"}},(0,e.createElement)(d.IconButton,{icon:"no-alt",onClick:()=>{!1!==a&&"function"==typeof a&&a()}}))),r)}const R=window.wp.url;function B({toggleAddChildModal:t,parentTitle:n,childTitle:i,onDeny:s,onConfirm:r}){return(0,e.createElement)(d.Modal,{title:(0,o.__)("Confirm Linking Child Post","prc-platform-post-report-package"),onRequestClose:()=>{t(!1)}},(0,e.createElement)("p",null,"Link ",(0,e.createElement)("strong",null,(0,D.decodeEntities)(i))," post to"," ",(0,e.createElement)("strong",null,(0,D.decodeEntities)(n)),"?"),(0,e.createElement)(d.ButtonGroup,null,(0,e.createElement)(d.Button,{variant:"secondary",onClick:s},"No"),(0,e.createElement)(d.Button,{variant:"primary",onClick:r},"Yes")))}function P({parentTitle:n,parentId:i,onDeny:s,onConfirm:r}){const{saveEntityRecord:a}=(0,c.useDispatch)(p.store),[l,h]=(0,t.useState)("");return(0,e.createElement)(d.Modal,{title:(0,o.__)("Create New Draft Back Chapter","prc-platform-post-report-package"),onRequestClose:()=>{s()}},(0,e.createElement)("p",null,"Create a new draft back chapter for"," ",(0,e.createElement)("strong",null,(0,D.decodeEntities)(n)),"?"),(0,e.createElement)(d.TextControl,{label:(0,o.__)("Back Chapter Title","prc-platform-post-report-package"),value:l,onChange:h}),(0,e.createElement)(d.ButtonGroup,null,(0,e.createElement)(d.Button,{variant:"secondary",onClick:s},"Cancel"),(0,e.createElement)(d.Button,{variant:"primary",onClick:async()=>{const e=await a("postType","post",{title:l,status:"draft"});e&&(console.log("newDraftPost",e),r(e?.id))},disabled:3>l.length},"Create Draft")))}const L=({hocOnChange:n=!1})=>{const{parentTitle:i,parentId:s,getEntityRecord:r}=(0,c.useSelect)((e=>({parentTitle:e("core/editor").getEditedPostAttribute("title"),parentId:e("core/editor").getCurrentPostId(),getEntityRecord:e("core").getEntityRecord}))),[a,l]=(0,t.useState)(null),{record:u,isResolving:m}=(0,p.useEntityRecord)("postType","post",a,{enabled:null!==a}),[g,f]=(0,t.useState)(!1),[v,E]=(0,t.useState)(!1),[w,b]=(0,t.useState)(!1),[C,y]=(0,t.useState)(),[I,x]=(0,t.useState)(),[O,S]=(0,t.useState)(),T=(0,h.useDebounce)(I,1e3),[D,k]=(0,t.useState)(!1);return(0,t.useEffect)((()=>{if(void 0!==T&&3<=T.length){console.log("postUrl",T);const e=(0,R.getQueryArg)(T,"post");l(e)}}),[T]),(0,t.useEffect)((()=>{void 0!==u&&!1===m&&(y(u?.title?.rendered),k(u),f(!0))}),[u,m]),(0,e.createElement)(t.Fragment,null,(0,e.createElement)("div",{style:{display:"flex",flexDirection:"row"}},(0,e.createElement)("div",{style:{flexGrow:"1"}},(0,e.createElement)(d.SearchControl,{value:I,onChange:e=>{b(!0),x(e)},placeholder:(0,o.__)("Paste Back Chatper's edit (…/wp-admin/post.php?post=) url…","prc-platform-post-report-package"),autoComplete:"off"})),(0,e.createElement)("div",null,w&&(0,e.createElement)(d.Spinner,null))),(0,e.createElement)(d.Button,{variant:"tertiary",onClick:()=>{E(!0)}},(0,o.__)("Create New Draft","prc-platform-post-report-package")),!0===v&&(0,e.createElement)(P,{parentTitle:i,parentId:s,onConfirm:e=>{console.log("CREATE DRAFT!",e),!1!==n&&n(e)},onDeny:()=>{E(!1)}}),!0===g&&(0,e.createElement)(B,{toggleAddChildModal:f,parentTitle:i,childTitle:C,onConfirm:()=>{const{id:e}=D;f(!1),k(!1),!1!==n&&n(e)},onDeny:()=>{x(""),k(!1)}}))},Y=(0,e.createElement)(i.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(i.Path,{d:"m19 7-3-3-8.5 8.5-1 4 4-1L19 7Zm-7 11.5H5V20h7v-1.5Z"})),A=(0,e.createElement)(i.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(i.Path,{d:"M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z"}));function _({postId:t,currentPostId:n}){if(t===n)return null;const i=`/pewresearch-org/wp-admin/post.php?post=${t}&action=edit`,s=`/pewresearch-org/?p=${t}&preview=true`;return(0,e.createElement)(d.ButtonGroup,null,(0,e.createElement)(d.Button,{variant:"link",size:"compact",href:i,target:"_blank",icon:Y,label:(0,o.__)("Edit back chapter; opens in new tab"),showTooltip:!0},"Edit"),(0,e.createElement)(d.Button,{variant:"link",size:"compact",href:s,target:"_blank",icon:A,label:(0,o.__)("Preview back chapter; opens in new tab"),showTooltip:!0},"Preview"))}function V(){const t="backChapters",{backChapters:n,reorder:i,append:s,remove:o,updateItem:r,currentPostId:a}=m();return(0,e.createElement)(d.PanelBody,{title:"Back Chapters"},(0,e.createElement)(S,{lockVertically:!0,values:null!=n?n:[],onChange:({oldIndex:e,newIndex:n})=>i(e,n,t),renderList:({children:t,props:n})=>(0,e.createElement)("div",{...n},t),renderItem:({value:n,props:i,index:s})=>(0,e.createElement)("div",{...i},(0,e.createElement)(M,{key:n.key,defaultLabel:"Child Post",keyValue:n.postId,index:s,onRemove:()=>o(s,t)},null===n.postId&&(0,e.createElement)(L,{hocOnChange:e=>r(s,"postId",e,t)}),null!==n.postId&&(0,e.createElement)(_,{postId:n.postId,currentPostId:a})))}),(0,e.createElement)(d.Button,{variant:"primary",onClick:()=>s(T(),{postId:null},t)},"Add Back Chapter"))}const $=window.wp.blockEditor,U=JSON.parse('{"options":[{"label":"--","value":null},{"label":"Detailed Table","value":"detailedTable"},{"label":"Link","value":"link"},{"label":"Presentation","value":"presentation"},{"label":"Press Release","value":"pressRelease"},{"label":"Promo","value":"promo"},{"label":"Q & A","value":"qA"},{"label":"Questionnaire","value":"questionnaire"},{"label":"Report PDF","value":"report"},{"label":"Supplemental","value":"supplemental"},{"label":"Topline","value":"topline"}]}'),H=({type:t=null,onChange:n,toggleVisibility:i})=>{const{options:s}=U;return(0,e.createElement)(d.Popover,{className:"prc-report-material-popover",noArrow:!1,placement:"left-start",onFocusOutside:()=>{i(!1)}},(0,e.createElement)("div",{style:{padding:"0.6em",minWidth:"140px"}},(0,e.createElement)(d.SelectControl,{label:"Type",value:t,options:s,onChange:n})))},W=e=>{const{options:t}=U,n=t.find((t=>t.value===e));return void 0!==n?n.label:""},z=["image","application/pdf","application/vnd.openxmlformats-officedocument.presentationml.presentation","application/vnd.ms-powerpoint","application/vnd.ms-excel","application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],F=({type:n,url:i,attachmentId:s,label:r,icon:a,index:l})=>{const c="materials",{allowEditing:h,updateItem:p,remove:u}=m(),[g,f]=(0,t.useState)(!1);return(0,e.createElement)(M,{label:W(n),index:l,onRemove:()=>u(l,c)},(0,e.createElement)("div",{style:{paddingTop:"10px"}},["presentation","pressRelease"].includes(n)&&(0,e.createElement)(d.TextControl,{autoComplete:!1,label:"URL",value:i,onChange:e=>p(l,"url",e,c),disabled:!h}),["link","promo","qA","supplemental"].includes(n)&&(0,e.createElement)(t.Fragment,null,(0,e.createElement)(d.TextControl,{autoComplete:!1,label:"Label",value:r,onChange:e=>p(l,"label",e,c),disabled:!h}),(0,e.createElement)(d.TextControl,{autoComplete:!1,label:"URL",value:i,onChange:e=>p(l,"url",e,c),disabled:!h}),"link"===n&&(0,e.createElement)(d.SelectControl,{label:"Icon",value:a,options:U?.options||[],onChange:e=>{console.log(e),p(l,"icon",e,c)},disabled:!h})),(0,e.createElement)(d.ButtonGroup,null,["report","questionnaire","detailedTable","powerpoint","presentation","pressRelease","topline"].includes(n)&&(0,e.createElement)((({title:t,value:n})=>(0,e.createElement)($.MediaUploadCheck,null,(0,e.createElement)($.MediaUpload,{title:(0,o.__)(null===n?`Upload ${t}`:`Change ${t}`),allowedTypes:z,value:n,onSelect:e=>{p(l,"url",e.url,c),p(l,"attachmentId",e.id,c)},render:({open:t})=>(0,e.createElement)(d.Button,{variant:"secondary",disabled:!h,onClick:t},(0,o.__)(null===n?"Upload File":"Change File"))}))),{title:W(n),value:s}),"promo"===n&&(0,e.createElement)((({title:t,value:n})=>(0,e.createElement)($.MediaUploadCheck,null,(0,e.createElement)($.MediaUpload,{title:(0,o.__)(null===n?`Upload ${t}`:`Change ${t}`),value:n,onSelect:e=>{p(l,"icon",e.url,c),p(l,"attachmentId",e.id,c)},render:({open:t})=>(0,e.createElement)(d.Button,{variant:"secondary",disabled:!h,onClick:t},(0,o.__)(null===n?"Upload Icon":"Change Icon"))}))),{title:W(n),value:s}),(0,e.createElement)(d.Button,{variant:"secondary",onClick:()=>{f(!0)},disabled:!h},"Change Type"),g&&(0,e.createElement)(H,{type:n,onChange:e=>{p(l,"type",e,c),p(l,"attachmentId",null,c),p(l,"url","",c),p(l,"label","",c),p(l,"icon","",c),f(!1)},toggleVisibility:f}))))},X=function(){const[n,i]=(0,t.useState)(!1),s="materials",{materials:r,reorder:a,append:l,remove:c,updateItem:h,isResolving:p}=m();return(0,e.createElement)(d.PanelBody,{title:"Materials"},(0,e.createElement)(S,{lockVertically:!0,values:null!=r?r:[],onChange:({oldIndex:e,newIndex:t})=>a(e,t,s),renderList:({children:t,props:n})=>(0,e.createElement)("div",{...n},t),renderItem:({value:t,props:n,index:i})=>(0,e.createElement)("div",{...n},(0,e.createElement)(F,{key:t.key,type:t.type,url:t.url,label:t.label,icon:t.icon,attachmentId:t.attachmentId,index:i}))}),(0,e.createElement)(d.Button,{variant:"primary",onClick:()=>{i(!0)}},(0,o.__)("Add Report Material")),n&&(0,e.createElement)(H,{onChange:e=>{l(T(),{type:e,url:"",attachmentId:null,label:W(e),icon:""},s),i(!1)},toggleVisibility:i}))},G="prc-platform-post-report-package";(0,r.registerPlugin)(G,{render:function(){const{postType:i,postId:o,parentId:r,isChildPost:d}=(0,c.useSelect)((e=>{const t=e(l.store).getEditedPostAttribute("post_parent"),n=e(l.store).getCurrentPostType(),i=e(l.store).getCurrentPostId();return{postType:n,postId:i,parentId:0!==t?t:i,isChildPost:0!==t}}),[]);return(0,e.createElement)(t.Fragment,null,(0,e.createElement)(a.PluginSidebar,{name:G,title:"Report Package",icon:(0,e.createElement)(n,{icon:s,size:16})},(0,e.createElement)(g,{postType:i,postId:r,currentPostId:o},(0,e.createElement)(X,null),(0,e.createElement)(V,null))),!d&&(0,e.createElement)(a.PluginPrePublishPanel,null,(0,e.createElement)(g,{postType:i,postId:r,currentPostId:o},(0,e.createElement)("p",null,"Please review the attached report materials:"),(0,e.createElement)(X,null),(0,e.createElement)("p",null,"Please review the attached back chapter posts. These post's status will be updated to match the parent post on publish."),(0,e.createElement)(V,null))))}})})();
//# sourceMappingURL=index.js.map