(()=>{"use strict";var e,t={801:(e,t,n)=>{const a=window.React,l=window.wp.plugins,o=window.wp.element,r=window.wp.components,i=window.wp.editPost,s=window.prcHooks,c=window.wp.apiFetch;var d=n.n(c);const m=window.wp.editor,p=window.wp.blockEditor,u=window.wp.blocks,g=window.wp.data,h=window.wp.coreData,w=window.wp.mediaUtils,f=(0,o.createContext)(),{media:b}=window.wp,k=()=>(0,o.useContext)(f);function E({children:e}){const t=function(){const{postId:e,postType:t,imageBlocks:n=[],coverBlocks:a=[],chartBlocks:l=[],videoBlocks:r=[],getBlockInsertionPoint:i,selectedBlockClientId:c,selectedBlockIsImageBlock:f,selectedBlockAttrs:k}=(0,g.useSelect)((e=>({postType:e(m.store).getCurrentPostType(),postId:e(m.store).getCurrentPostId(),imageBlocks:e(p.store).getBlocks().filter((e=>"core/image"===e.name)),coverBlocks:e(p.store).getBlocks().filter((e=>"core/cover"===e.name&&"image"===e.attributes.backgroundType)),getBlockInsertionPoint:e(p.store).getBlockInsertionPoint,selectedBlockClientId:e(p.store).getSelectedBlockClientId(),selectedBlockIsImageBlock:"core/image"===e(p.store).getSelectedBlock()?.name,selectedBlockAttrs:e(p.store).getSelectedBlock()?.attributes})),[]),{insertBlock:E,replaceBlock:I}=(0,g.useDispatch)(p.store),[v,C]=(0,o.useState)(null),[y,_]=(0,o.useState)([]),[B,S]=(0,o.useState)(""),P=(0,s.useDebounce)(B,500),[L,T]=(0,o.useState)(!1),[O,D]=(0,o.useState)(!0),[A,M]=(0,h.useEntityProp)("postType",t,"meta"),j=()=>{"number"==typeof e&&!1===L&&(T(!0),d()({path:`/prc-api/v3/attachments-panel/?postId=${e}`}).then((e=>{console.log("Objects found in attachments rest request...",e),_([...e]),T(!1)})))},F=(0,o.useMemo)((()=>b({title:"Edit Attachments",button:{text:"Update"},library:{uploadedTo:e,selected:[v]}})),[e,v]);F.on("close",(()=>{j()}));const W=(0,o.useMemo)((()=>{console.log("mergeBlocksAndReturnIdClientPairs for insertedImageIds...",a,n);const e={};0!==n.length&&n.forEach((t=>{e[t.attributes.id]={clientId:t.clientId}}));const t={};return 0!==a.length&&a.forEach((e=>{t[e.attributes.id]={clientId:e.clientId}})),{...e,...t}}),[a,n]),x=(0,o.useMemo)((()=>{if(console.log("insertedImageIds has changed"),0<y.length){const e=y.map((e=>e.id)),t=Object.keys(W);return 0<e.filter((e=>!t.includes(e.toString()))).length}return!1}),[y,W]);return(0,o.useEffect)((()=>{console.log("attachments' effect..."),j()}),[e]),(0,o.useEffect)((()=>{0<y.length?D(!1):D(!0)}),[y]),{postId:e,postType:t,insertedImageIds:W,attachments:y,loading:O,flashPrePublishWarning:x,searchTerm:B,debouncedSearchTerm:P,setSearchTerm:S,onDropImage:t=>{console.log("onDropImage",t,e),(0,w.uploadMedia)({allowedTypes:["image"],filesList:t,additionalData:{post:e},onFileChange(e){console.log("onFileChange",e),j()},onError(e){console.error(e)},wpAllowedMimeTypes:{png:"image/png","jpg|jpeg|jpe":"image/jpeg",webp:"image/webp"}})},handleImageInsertion:(e,t,n)=>{const a=i().index,l=(0,u.createBlock)("core/image",{id:e,url:t,sizeSlug:n});E(l,a)},handleImageReplacement:(e,t,n)=>{if(f){const a=k.sizeSlug||"310-wide",l=k;l.id=e,l.url=t,l.sizeSlug=a,n&&(l.href=n);const o=(0,u.createBlock)("core/image",{...l});I(c,o)}},mediaEditor:F,openMediaLibrary:(e=null)=>{C(e),F.open(),F.on("close",(()=>{C(null)}))}}}();return(0,a.createElement)(f.Provider,{value:t},e)}const I=window.wp.i18n,v=function(){const{onDropImage:e}=k();return(0,a.createElement)(p.MediaUploadCheck,{fallback:(0,I.__)("Drag and drop your files here and they will be attached to this post.")},(0,a.createElement)(r.DropZone,{onFilesDrop:t=>e(t),onHTMLDrop:e=>console.log("onHTMLDrop...",e),onDrop:e=>console.log("onDrop...",e)}))},C=window.classnames;var y=n.n(C);const _=[{label:"200 Wide",value:"200-wide"},{label:"200 Wide",value:"200-wide"},{label:"260 Wide",value:"260-wide"},{label:"310 Wide",value:"310-wide"},{label:"420 Wide",value:"420-wide"},{label:"640 Wide",value:"640-wide"},{label:"740 Wide",value:"740-wide"},{label:"1400 Wide",value:"1400-wide"}],B=function({id:e,url:t,title:n,type:l,filename:i,editLink:c,attachmentLink:d}){const{insertedImageIds:m,handleImageInsertion:u,handleImageReplacement:h}=k(),{selectBlock:w}=(0,g.useDispatch)(p.store),f=Object.keys(m).includes(e.toString()),[b,E]=(0,o.useState)(!1),v=(0,s.useKeyPress)("Shift"),C=(0,s.useKeyPress)("Alt"),B=(0,s.useKeyPress)("metaKey");return(0,a.createElement)(r.BaseControl,null,(0,a.createElement)("button",{type:"button",key:e,className:y()("prc-attachments-list__image",{"prc-attachments-list__image--in-use":f}),onClick:()=>{f?w(m[e].clientId):v?u(e,t,"640-wide"):C?h(e,t,d):B?window.open(c,"_blank"):E(!0)}},(0,a.createElement)("img",{src:t,alt:"A attachment in the editor"}),(0,a.createElement)("div",null,n)),b&&(0,a.createElement)(r.Modal,{title:(0,I.__)("Insert Image Into Editor","prc-block-plugins"),onRequestClose:()=>E(!1)},(0,a.createElement)(r.SelectControl,{label:"Select Image Size",value:null,options:_,onChange:n=>u(e,t,n)})))},S=function({id:e,url:t,title:n,type:l}){const{openMediaLibrary:o}=k();return(0,a.createElement)(r.BaseControl,null,(0,a.createElement)("button",{type:"button",key:e,className:y()("prc-attachments-list__file"),onClick:()=>{o(e)}},(0,a.createElement)("div",null,n)))};function P(){const{attachments:e,loading:t,debouncedSearchTerm:n}=k(),l=e.filter((e=>e.type.startsWith("image/"))).sort(((e,t)=>e.title.toLowerCase()<t.title.toLowerCase()?-1:e.title.toLowerCase()>t.title.toLowerCase()?1:0)).filter((e=>""===n||e.title.toLowerCase().includes(n.toLowerCase())));return(0,a.createElement)("div",null,t?(0,a.createElement)(r.Spinner,null):l.map((e=>(0,a.createElement)(B,{...e}))))}function L(){const{attachments:e,loading:t,debouncedSearchTerm:n}=k(),l=e.filter((e=>e.type.startsWith("application/"))).sort(((e,t)=>e.title.toLowerCase()<t.title.toLowerCase()?-1:e.title.toLowerCase()>t.title.toLowerCase()?1:0)).filter((e=>""===n||e.title.toLowerCase().includes(n.toLowerCase())||e.name.toLowerCase().includes(n.toLowerCase())));return(0,a.createElement)("div",null,t?(0,a.createElement)(r.Spinner,null):l.map((e=>(0,a.createElement)(S,{...e}))))}const T=function(){const{attachments:e,searchTerm:t,setSearchTerm:n,mediaEditor:l}=k(),i=(0,g.useSelect)((e=>e("core/editor").getCurrentPostId()));return(0,a.createElement)(o.Fragment,null,(0,a.createElement)(r.PanelBody,{title:(0,I.__)("Attachments"),initialOpen:!0,className:"prc-attachments-list"},(0,a.createElement)(r.BaseControl,{id:"prc-media-zone",label:(0,I.__)('Drag and drop images to attach them to the post. Click on an image to select the image size to insert into the editor, or "shift + click" an image to insert at 640-wide.',"prc-block-plugins")},0<e.length&&(0,a.createElement)(o.Fragment,null,(0,a.createElement)(r.Button,{variant:"secondary",onClick:()=>l.open()},"Edit Attachments"),(0,a.createElement)(r.CardDivider,null)),(0,a.createElement)(r.TextControl,{label:(0,I.__)("Filter Attachments"),value:t,onChange:e=>n(e)}),(0,a.createElement)(v,null))),(0,a.createElement)(r.PanelBody,{title:(0,I.__)("Images"),initialOpen:e.length>0,className:"prc-attachments-list__images"},(0,a.createElement)(P,null)),(0,a.createElement)(r.PanelBody,{title:(0,I.__)("Files"),className:"prc-attachments-list__files",initialOpen:!1},(0,a.createElement)(L,null)),(0,a.createElement)(r.PanelBody,{title:(0,I.__)("Danger Zone"),className:"prc-attachments-list__danger-zone",initialOpen:!1},(0,a.createElement)(r.BaseControl,{label:"Reset Attachments",help:"If there are attachments present on this post we will only add new attachments. Otherwise, all attachments from the legacy post will be copied to this post.",id:"prc-reset-attachments"},(0,a.createElement)(r.Button,{isDestructive:!0,onClick:()=>{!function(e){console.log(`resetAttachmentsMigration(${e}):`),d()({path:"/prc-api/v3/migration-tools/migrate-attachments/",method:"POST",data:{postId:e}}).then((e=>{console.log(e),e.success&&window.location.reload()})).catch((e=>{console.error(e)}))}(i)}},"Copy Attachments From Legacy"))))},O=(0,r.withFilters)("prc-platform/attachments-panel")((()=>(0,a.createElement)(o.Fragment,null,(0,a.createElement)(i.PluginSidebar,{name:"prc-attachments-panel",title:"Attachments",icon:"admin-media"},(0,a.createElement)(E,null,(0,a.createElement)(T,null))))));(0,l.registerPlugin)("prc-platform-attachment-panel",{render:()=>(0,a.createElement)(O,null),icon:"admin-media"})}},n={};function a(e){var l=n[e];if(void 0!==l)return l.exports;var o=n[e]={exports:{}};return t[e](o,o.exports,a),o.exports}a.m=t,e=[],a.O=(t,n,l,o)=>{if(!n){var r=1/0;for(d=0;d<e.length;d++){for(var[n,l,o]=e[d],i=!0,s=0;s<n.length;s++)(!1&o||r>=o)&&Object.keys(a.O).every((e=>a.O[e](n[s])))?n.splice(s--,1):(i=!1,o<r&&(r=o));if(i){e.splice(d--,1);var c=l();void 0!==c&&(t=c)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[n,l,o]},a.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return a.d(t,{a:t}),t},a.d=(e,t)=>{for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})},a.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{var e={57:0,350:0};a.O.j=t=>0===e[t];var t=(t,n)=>{var l,o,[r,i,s]=n,c=0;if(r.some((t=>0!==e[t]))){for(l in i)a.o(i,l)&&(a.m[l]=i[l]);if(s)var d=s(a)}for(t&&t(n);c<r.length;c++)o=r[c],a.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return a.O(d)},n=globalThis.webpackChunk_pewresearch_prc_platform_attachments_panel=globalThis.webpackChunk_pewresearch_prc_platform_attachments_panel||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))})();var l=a.O(void 0,[350],(()=>a(801)));l=a.O(l)})();
//# sourceMappingURL=index.js.map