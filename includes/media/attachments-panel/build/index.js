(()=>{"use strict";var e,t={801:(e,t,n)=>{const o=window.React,l=window.wp.plugins,a=window.wp.element,r=window.wp.components,s=window.wp.editPost,i=window.prcHooks,c=window.wp.apiFetch;var d=n.n(c);const m=window.wp.editor,p=window.wp.blockEditor,u=window.wp.blocks,g=window.wp.data,h=window.wp.coreData,w=window.wp.mediaUtils,f=(0,a.createContext)(),{media:b}=window.wp,k=()=>(0,a.useContext)(f);function E({children:e}){const t=function(){const{postId:e,postType:t,imageBlocks:n=[],coverBlocks:o=[],chartBlocks:l=[],videoBlocks:r=[],getBlockInsertionPoint:s,selectedBlockClientId:c,selectedBlockIsImageBlock:f,selectedBlockAttrs:k}=(0,g.useSelect)((e=>({postType:e(m.store).getCurrentPostType(),postId:e(m.store).getCurrentPostId(),imageBlocks:e(p.store).getBlocks().filter((e=>"core/image"===e.name)),coverBlocks:e(p.store).getBlocks().filter((e=>"core/cover"===e.name&&"image"===e.attributes.backgroundType)),getBlockInsertionPoint:e(p.store).getBlockInsertionPoint,selectedBlockClientId:e(p.store).getSelectedBlockClientId(),selectedBlockIsImageBlock:"core/image"===e(p.store).getSelectedBlock()?.name,selectedBlockAttrs:e(p.store).getSelectedBlock()?.attributes})),[]),{insertBlock:E,replaceBlock:v}=(0,g.useDispatch)(p.store),[_,y]=(0,a.useState)(null),[I,C]=(0,a.useState)([]),[B,S]=(0,a.useState)(""),P=(0,i.useDebounce)(B,500),[T,L]=(0,a.useState)(!1),[D,O]=(0,a.useState)(!0),[A,M]=(0,h.useEntityProp)("postType",t,"meta"),j=()=>{"number"==typeof e&&!1===T&&(L(!0),d()({path:`/prc-api/v3/attachments-panel/?postId=${e}`}).then((e=>{console.log("Objects found in attachments rest request...",e),C([...e]),L(!1)})))},F=(0,a.useMemo)((()=>b({title:"Edit Attachments",button:{text:"Update"},library:{uploadedTo:e,selected:[_]}})),[e,_]);F.on("close",(()=>{j()}));const W=(0,a.useMemo)((()=>{console.log("mergeBlocksAndReturnIdClientPairs for insertedImageIds...",o,n);const e={};0!==n.length&&n.forEach((t=>{e[t.attributes.id]={clientId:t.clientId}}));const t={};return 0!==o.length&&o.forEach((e=>{t[e.attributes.id]={clientId:e.clientId}})),{...e,...t}}),[o,n]),x=(0,a.useMemo)((()=>{if(console.log("insertedImageIds has changed"),0<I.length){const e=I.map((e=>e.id)),t=Object.keys(W);return 0<e.filter((e=>!t.includes(e.toString()))).length}return!1}),[I,W]);return(0,a.useEffect)((()=>{console.log("attachments' effect..."),j()}),[e]),(0,a.useEffect)((()=>{0<I.length?O(!1):O(!0)}),[I]),{postId:e,postType:t,insertedImageIds:W,attachments:I,loading:D,flashPrePublishWarning:x,searchTerm:B,debouncedSearchTerm:P,setSearchTerm:S,onDropImage:t=>{console.log("onDropImage",t,e),(0,w.uploadMedia)({allowedTypes:["image"],filesList:t,additionalData:{post:e},onFileChange(e){console.log("onFileChange",e),j()},onError(e){console.error(e)},wpAllowedMimeTypes:{png:"image/png","jpg|jpeg|jpe":"image/jpeg",webp:"image/webp"}})},handleImageInsertion:(e,t,n)=>{const o=s().index,l=(0,u.createBlock)("core/image",{id:e,url:t,sizeSlug:n});E(l,o)},handleImageReplacement:(e,t,n)=>{if(f){const o=k.sizeSlug||"310-wide",l=k;l.id=e,l.url=t,l.sizeSlug=o,n&&(l.href=n);const a=(0,u.createBlock)("core/image",{...l});v(c,a)}},mediaEditor:F,openMediaLibrary:(e=null)=>{y(e),F.open(),F.on("close",(()=>{y(null)}))}}}();return(0,o.createElement)(f.Provider,{value:t},e)}const v=window.wp.i18n,_=function(){const{onDropImage:e}=k();return(0,o.createElement)(p.MediaUploadCheck,{fallback:(0,v.__)("Drag and drop your files here and they will be attached to this post.")},(0,o.createElement)(r.DropZone,{onFilesDrop:t=>e(t),onHTMLDrop:e=>console.log("onHTMLDrop...",e),onDrop:e=>console.log("onDrop...",e)}))},y=window.classnames;var I=n.n(y);const C=[{label:"200 Wide",value:"200-wide"},{label:"200 Wide",value:"200-wide"},{label:"260 Wide",value:"260-wide"},{label:"310 Wide",value:"310-wide"},{label:"420 Wide",value:"420-wide"},{label:"640 Wide",value:"640-wide"},{label:"740 Wide",value:"740-wide"},{label:"1400 Wide",value:"1400-wide"}],B=function({id:e,url:t,title:n,type:l,filename:s,editLink:c,attachmentLink:d}){const{insertedImageIds:m,handleImageInsertion:u,handleImageReplacement:h}=k(),{selectBlock:w}=(0,g.useDispatch)(p.store),f=Object.keys(m).includes(e.toString()),[b,E]=(0,a.useState)(!1),_=(0,i.useKeyPress)("Shift"),y=(0,i.useKeyPress)("Alt"),B=(0,i.useKeyPress)("Meta");return(0,o.createElement)(r.BaseControl,null,(0,o.createElement)("button",{type:"button",key:e,className:I()("prc-attachments-list__image",{"prc-attachments-list__image--in-use":f}),onClick:()=>{f?w(m[e].clientId):_?u(e,t,"640-wide"):y?h(e,t,d):B?window.open(c,"_blank"):E(!0)}},(0,o.createElement)("img",{src:t,alt:"A attachment in the editor"}),(0,o.createElement)("div",null,n)),b&&(0,o.createElement)(r.Modal,{title:(0,v.__)("Insert Image Into Editor","prc-block-plugins"),onRequestClose:()=>E(!1)},(0,o.createElement)(r.SelectControl,{label:"Select Image Size",value:null,options:C,onChange:n=>u(e,t,n)})))},S=function({id:e,url:t,title:n,type:l}){const{openMediaLibrary:a}=k();return(0,o.createElement)(r.BaseControl,null,(0,o.createElement)("button",{type:"button",key:e,className:I()("prc-attachments-list__file"),onClick:()=>{a(e)}},(0,o.createElement)("div",null,n)))};function P(){const{attachments:e,loading:t,debouncedSearchTerm:n}=k(),l=e.filter((e=>e.type.startsWith("image/"))).sort(((e,t)=>e.title.toLowerCase()<t.title.toLowerCase()?-1:e.title.toLowerCase()>t.title.toLowerCase()?1:0)).filter((e=>""===n||e.title.toLowerCase().includes(n.toLowerCase())));return(0,o.createElement)("div",null,t?(0,o.createElement)(r.Spinner,null):l.map((e=>(0,o.createElement)(B,{...e}))))}function T(){const{attachments:e,loading:t,debouncedSearchTerm:n}=k(),l=e.filter((e=>e.type.startsWith("application/"))).sort(((e,t)=>e.title.toLowerCase()<t.title.toLowerCase()?-1:e.title.toLowerCase()>t.title.toLowerCase()?1:0)).filter((e=>""===n||e.title.toLowerCase().includes(n.toLowerCase())||e.name.toLowerCase().includes(n.toLowerCase())));return(0,o.createElement)("div",null,t?(0,o.createElement)(r.Spinner,null):l.map((e=>(0,o.createElement)(S,{...e}))))}const L=function(){const{attachments:e,searchTerm:t,setSearchTerm:n,mediaEditor:l}=k(),s=(0,g.useSelect)((e=>e("core/editor").getCurrentPostId()));return(0,o.createElement)(a.Fragment,null,(0,o.createElement)(r.PanelBody,{title:(0,v.__)("Attachments"),initialOpen:!0,className:"prc-attachments-list"},(0,o.createElement)(r.BaseControl,{id:"prc-media-zone",label:(0,v.__)('Drag and drop images to attach them to the post. Click on an image to select the image size to insert into the editor, or "shift + click" an image to insert at 640-wide.',"prc-block-plugins")},0<e.length&&(0,o.createElement)(a.Fragment,null,(0,o.createElement)(r.Button,{variant:"secondary",onClick:()=>l.open()},"Edit Attachments"),(0,o.createElement)(r.CardDivider,null)),(0,o.createElement)(r.TextControl,{label:(0,v.__)("Filter Attachments"),value:t,onChange:e=>n(e)}),(0,o.createElement)(_,null))),(0,o.createElement)(r.PanelBody,{title:(0,v.__)("Images"),initialOpen:e.length>0,className:"prc-attachments-list__images"},(0,o.createElement)(P,null)),(0,o.createElement)(r.PanelBody,{title:(0,v.__)("Files"),className:"prc-attachments-list__files",initialOpen:!1},(0,o.createElement)(T,null)),(0,o.createElement)(r.PanelBody,{title:(0,v.__)("Danger Zone"),className:"prc-attachments-list__danger-zone",initialOpen:!1},(0,o.createElement)(r.Button,{isDestructive:!0,onClick:()=>{((e,t="post")=>{let n=0,o=0;const l=(0,g.select)("core").getEntityRecord("postType",t,e);l&&(console.log("post...",l.meta?.dt_original_post_id),n=l.meta?.dt_original_post_id,l.meta),fetch(`https://prc-platform.vipdev.lndo.site/religion/wp-json/wp/v2/posts/${n}?_fields=content`).then((e=>e.json())).then((t=>{const n=[],o=t.content.rendered;(new DOMParser).parseFromString(o,"text/html").querySelectorAll("figure").forEach((e=>{const t=e.querySelector("img");if(t){const o=t.getAttribute("src"),l=e.getAttribute("class"),a=e.querySelector("a");let r;const s=/wp-image-(\d+)/,i=l.match(s);if(i)r=i[1];else{const e=a?a.getAttribute("rel"):null,t=/wp-att-(\d+)/,n=e?e.match(t):null;n&&(r=n[1])}r&&n.push({src:o,id:r})}})),console.log("images inside content...",n),0<n.length&&((e,t,n=(()=>{}))=>(console.log("imagesArray...",e.map((e=>e.src))),new Promise(((n,o)=>{d()({path:"/prc-api/v3/migration-tools/migrate-attachments",method:"POST",data:{urls:e.map((e=>e.src)),postId:t}}).then((e=>{n(e)})).catch((e=>{o(e)}))}))))(n,e).then((e=>console.log("success",e))).catch((e=>console.error("error",e)))})).catch((e=>console.error(e)))})(s)}},"Copy Attachments From Legacy")))},D=(0,r.withFilters)("prc-platform/attachments-panel")((()=>(0,o.createElement)(a.Fragment,null,(0,o.createElement)(s.PluginSidebar,{name:"prc-attachments-panel",title:"Attachments",icon:"admin-media"},(0,o.createElement)(E,null,(0,o.createElement)(L,null))))));(0,l.registerPlugin)("prc-platform-attachment-panel",{render:()=>(0,o.createElement)(D,null),icon:"admin-media"})}},n={};function o(e){var l=n[e];if(void 0!==l)return l.exports;var a=n[e]={exports:{}};return t[e](a,a.exports,o),a.exports}o.m=t,e=[],o.O=(t,n,l,a)=>{if(!n){var r=1/0;for(d=0;d<e.length;d++){for(var[n,l,a]=e[d],s=!0,i=0;i<n.length;i++)(!1&a||r>=a)&&Object.keys(o.O).every((e=>o.O[e](n[i])))?n.splice(i--,1):(s=!1,a<r&&(r=a));if(s){e.splice(d--,1);var c=l();void 0!==c&&(t=c)}}return t}a=a||0;for(var d=e.length;d>0&&e[d-1][2]>a;d--)e[d]=e[d-1];e[d]=[n,l,a]},o.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return o.d(t,{a:t}),t},o.d=(e,t)=>{for(var n in t)o.o(t,n)&&!o.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={57:0,350:0};o.O.j=t=>0===e[t];var t=(t,n)=>{var l,a,[r,s,i]=n,c=0;if(r.some((t=>0!==e[t]))){for(l in s)o.o(s,l)&&(o.m[l]=s[l]);if(i)var d=i(o)}for(t&&t(n);c<r.length;c++)a=r[c],o.o(e,a)&&e[a]&&e[a][0](),e[a]=0;return o.O(d)},n=globalThis.webpackChunk_pewresearch_prc_platform_attachments_panel=globalThis.webpackChunk_pewresearch_prc_platform_attachments_panel||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var l=o.O(void 0,[350],(()=>o(801)));l=o.O(l)})();
//# sourceMappingURL=index.js.map