(()=>{"use strict";var e,t={801:(e,t,n)=>{const l=window.React,a=window.wp.plugins,o=window.wp.element,r=window.wp.components,i=window.wp.editPost,s=window.prcHooks,c=window.wp.apiFetch;var d=n.n(c);const m=window.wp.editor,p=window.wp.blockEditor,u=window.wp.blocks,g=window.wp.data,h=window.wp.coreData,w=window.wp.mediaUtils,f=(0,o.createContext)(),{media:b}=window.wp,k=()=>(0,o.useContext)(f);function E({children:e}){const t=function(){const{postId:e,postType:t,imageBlocks:n=[],coverBlocks:l=[],chartBlocks:a=[],videoBlocks:r=[],getBlockInsertionPoint:i,selectedBlockClientId:c,selectedBlockIsImageBlock:f,selectedBlockAttrs:k}=(0,g.useSelect)((e=>({postType:e(m.store).getCurrentPostType(),postId:e(m.store).getCurrentPostId(),imageBlocks:e(p.store).getBlocks().filter((e=>"core/image"===e.name)),coverBlocks:e(p.store).getBlocks().filter((e=>"core/cover"===e.name&&"image"===e.attributes.backgroundType)),getBlockInsertionPoint:e(p.store).getBlockInsertionPoint,selectedBlockClientId:e(p.store).getSelectedBlockClientId(),selectedBlockIsImageBlock:"core/image"===e(p.store).getSelectedBlock()?.name,selectedBlockAttrs:e(p.store).getSelectedBlock()?.attributes})),[]),{insertBlock:E,replaceBlock:v}=(0,g.useDispatch)(p.store),[C,I]=(0,o.useState)(null),[y,_]=(0,o.useState)([]),[B,S]=(0,o.useState)(""),P=(0,s.useDebounce)(B,500),[T,L]=(0,o.useState)(!1),[O,D]=(0,o.useState)(!0),[A,M]=(0,h.useEntityProp)("postType",t,"meta"),j=()=>{"number"==typeof e&&!1===T&&(L(!0),d()({path:`/prc-api/v3/attachments-panel/get/${e}`}).then((e=>{console.log("Objects found in attachments rest request...",e),_([...e]),L(!1)})))},W=(0,o.useMemo)((()=>b({title:"Edit Attachments",button:{text:"Update"},library:{uploadedTo:e,selected:[C]}})),[e,C]);W.on("close",(()=>{j()}));const x=(0,o.useMemo)((()=>{console.log("mergeBlocksAndReturnIdClientPairs for insertedImageIds...",l,n);const e={};0!==n.length&&n.forEach((t=>{e[t.attributes.id]={clientId:t.clientId}}));const t={};return 0!==l.length&&l.forEach((e=>{t[e.attributes.id]={clientId:e.clientId}})),{...e,...t}}),[l,n]),F=(0,o.useMemo)((()=>{if(console.log("insertedImageIds has changed"),0<y.length){const e=y.map((e=>e.id)),t=Object.keys(x);return 0<e.filter((e=>!t.includes(e.toString()))).length}return!1}),[y,x]);return(0,o.useEffect)((()=>{console.log("attachments' effect..."),j()}),[e]),(0,o.useEffect)((()=>{0<y.length?D(!1):D(!0)}),[y]),{postId:e,postType:t,insertedImageIds:x,attachments:y,loading:O,flashPrePublishWarning:F,searchTerm:B,debouncedSearchTerm:P,setSearchTerm:S,onDropImage:t=>{console.log("onDropImage",t,e),(0,w.uploadMedia)({allowedTypes:["image"],filesList:t,additionalData:{post:e},onFileChange(e){console.log("onFileChange",e),j()},onError(e){console.error(e)},wpAllowedMimeTypes:{png:"image/png","jpg|jpeg|jpe":"image/jpeg",webp:"image/webp"}})},handleImageInsertion:(e,t,n,l,a)=>{const o=i().index,r=(0,u.createBlock)("core/image",{id:e,url:t,sizeSlug:n,alt:l,caption:a});E(r,o)},handleImageReplacement:(e,t,n,l,a)=>{if(f){const o=k.sizeSlug||"310-wide",r=k;r.id=e,r.url=t,r.sizeSlug=o,r.alt=l,r.caption=a,n&&(r.href=n);const i=(0,u.createBlock)("core/image",{...r});v(c,i)}},mediaEditor:W,openMediaLibrary:(e=null)=>{I(e),W.open(),W.on("close",(()=>{I(null)}))}}}();return(0,l.createElement)(f.Provider,{value:t},e)}const v=window.wp.i18n,C=function(){const{onDropImage:e}=k();return(0,l.createElement)(p.MediaUploadCheck,{fallback:(0,v.__)("Drag and drop your files here and they will be attached to this post.")},(0,l.createElement)(r.DropZone,{onFilesDrop:t=>e(t),onHTMLDrop:e=>console.log("onHTMLDrop...",e),onDrop:e=>console.log("onDrop...",e)}))},I=window.classnames;var y=n.n(I);const _=[{label:"200 Wide",value:"200-wide"},{label:"200 Wide",value:"200-wide"},{label:"260 Wide",value:"260-wide"},{label:"310 Wide",value:"310-wide"},{label:"420 Wide",value:"420-wide"},{label:"640 Wide",value:"640-wide"},{label:"740 Wide",value:"740-wide"},{label:"1400 Wide",value:"1400-wide"}],B=function({id:e,url:t,title:n,type:a,filename:i,alt:c,caption:d,editLink:m,attachmentLink:u}){const{insertedImageIds:h,handleImageInsertion:w,handleImageReplacement:f}=k(),{selectBlock:b}=(0,g.useDispatch)(p.store),E=Object.keys(h).includes(e.toString()),[C,I]=(0,o.useState)(!1),B=(0,s.useKeyPress)("Shift"),S=(0,s.useKeyPress)("Alt"),P=(0,s.useKeyPress)("metaKey");return(0,l.createElement)(r.BaseControl,null,(0,l.createElement)("button",{type:"button",key:e,className:y()("prc-attachments-list__image",{"prc-attachments-list__image--in-use":E}),onClick:()=>{E?b(h[e].clientId):B?w(e,t,"640-wide",c,d):S?f(e,t,u):P?window.open(m,"_blank"):I(!0)}},(0,l.createElement)("img",{src:t,alt:"A attachment in the editor"}),(0,l.createElement)("div",null,n)),C&&(0,l.createElement)(r.Modal,{title:(0,v.__)("Insert Image Into Editor","prc-block-plugins"),onRequestClose:()=>I(!1)},(0,l.createElement)(r.SelectControl,{label:"Select Image Size",value:null,options:_,onChange:n=>{w(e,t,n,c,d),I(!1)}})))},S=function({id:e,url:t,title:n,type:a}){const{openMediaLibrary:o}=k();return(0,l.createElement)(r.BaseControl,null,(0,l.createElement)("button",{type:"button",key:e,className:y()("prc-attachments-list__file"),onClick:()=>{o(e)}},(0,l.createElement)("div",null,n)))};function P(){const{attachments:e,loading:t,debouncedSearchTerm:n}=k(),a=e.filter((e=>e.type.startsWith("image/"))).sort(((e,t)=>e.title.toLowerCase()<t.title.toLowerCase()?-1:e.title.toLowerCase()>t.title.toLowerCase()?1:0)).filter((e=>""===n||e.title.toLowerCase().includes(n.toLowerCase())));return console.log({filteredAttachments:a}),(0,l.createElement)("div",null,t?(0,l.createElement)(r.Spinner,null):a.map((e=>(0,l.createElement)(B,{...e}))))}function T(){const{attachments:e,loading:t,debouncedSearchTerm:n}=k(),a=e.filter((e=>e.type.startsWith("application/"))).sort(((e,t)=>e.title.toLowerCase()<t.title.toLowerCase()?-1:e.title.toLowerCase()>t.title.toLowerCase()?1:0)).filter((e=>""===n||e.title.toLowerCase().includes(n.toLowerCase())||e.name.toLowerCase().includes(n.toLowerCase())));return(0,l.createElement)("div",null,t?(0,l.createElement)(r.Spinner,null):a.map((e=>(0,l.createElement)(S,{...e}))))}const L=function(){const{attachments:e,searchTerm:t,setSearchTerm:n,mediaEditor:a}=k();return(0,g.useSelect)((e=>e("core/editor").getCurrentPostId())),(0,l.createElement)(o.Fragment,null,(0,l.createElement)(r.PanelBody,{title:(0,v.__)("Attachments"),initialOpen:!0,className:"prc-attachments-list"},(0,l.createElement)(r.BaseControl,{id:"prc-media-zone",label:(0,v.__)('Drag and drop images to attach them to the post. Click on an image to select the desired size to insert into the editor. Alternatively, press "Shift + Click" an image to insert it at 640 pixels wide. To replace your selected image block, press "Opt + Click" on the desired image.',"prc-block-plugins")},0<e.length&&(0,l.createElement)(o.Fragment,null,(0,l.createElement)(r.Button,{variant:"secondary",onClick:()=>a.open()},"Edit Attachments"),(0,l.createElement)(r.CardDivider,null)),(0,l.createElement)(r.TextControl,{label:(0,v.__)("Filter Attachments"),value:t,onChange:e=>n(e)}),(0,l.createElement)(C,null))),(0,l.createElement)(r.PanelBody,{title:(0,v.__)("Images"),initialOpen:e.length>0,className:"prc-attachments-list__images"},(0,l.createElement)(P,null)),(0,l.createElement)(r.PanelBody,{title:(0,v.__)("Files"),className:"prc-attachments-list__files",initialOpen:!1},(0,l.createElement)(T,null)))},O=(0,r.withFilters)("prc-platform/attachments-panel")((()=>(0,l.createElement)(o.Fragment,null,(0,l.createElement)(i.PluginSidebar,{name:"prc-attachments-panel",title:"Attachments",icon:"admin-media"},(0,l.createElement)(E,null,(0,l.createElement)(L,null))))));(0,a.registerPlugin)("prc-platform-attachment-panel",{render:()=>(0,l.createElement)(O,null),icon:"admin-media"})}},n={};function l(e){var a=n[e];if(void 0!==a)return a.exports;var o=n[e]={exports:{}};return t[e](o,o.exports,l),o.exports}l.m=t,e=[],l.O=(t,n,a,o)=>{if(!n){var r=1/0;for(d=0;d<e.length;d++){for(var[n,a,o]=e[d],i=!0,s=0;s<n.length;s++)(!1&o||r>=o)&&Object.keys(l.O).every((e=>l.O[e](n[s])))?n.splice(s--,1):(i=!1,o<r&&(r=o));if(i){e.splice(d--,1);var c=a();void 0!==c&&(t=c)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[n,a,o]},l.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return l.d(t,{a:t}),t},l.d=(e,t)=>{for(var n in t)l.o(t,n)&&!l.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},l.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={57:0,350:0};l.O.j=t=>0===e[t];var t=(t,n)=>{var a,o,[r,i,s]=n,c=0;if(r.some((t=>0!==e[t]))){for(a in i)l.o(i,a)&&(l.m[a]=i[a]);if(s)var d=s(l)}for(t&&t(n);c<r.length;c++)o=r[c],l.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return l.O(d)},n=globalThis.webpackChunk_pewresearch_prc_platform_attachments_panel=globalThis.webpackChunk_pewresearch_prc_platform_attachments_panel||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var a=l.O(void 0,[350],(()=>l(801)));a=l.O(a)})();
//# sourceMappingURL=index.js.map