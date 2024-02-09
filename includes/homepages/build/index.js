(()=>{"use strict";const e=window.React,t=window.wp.primitives,o=(0,e.createElement)(t.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(t.Path,{d:"M12 4L4 7.9V20h16V7.9L12 4zm6.5 14.5H14V13h-4v5.5H5.5V8.8L12 5.7l6.5 3.1v9.7z"})),n=window.wp.blocks,r=window.prcComponents,a=window.wp.coreData,c=window.wp.blockEditor,p=window.wp.components,i=window.wp.data,l="homepage",d='\n\x3c!-- wp:group {"layout":{"type":"constrained","contentSize":"1200px"}} --\x3e\n<div class="wp-block-group">\x3c!-- wp:prc-block/grid-controller {"dividerColor":"gray","className":"is-pattern__featured-layout"} --\x3e\n\x3c!-- wp:prc-block/grid-column {"gridLayout":{"index":1,"desktopSpan":"3","tabletSpan":"6","mobileSpan":"4"}} --\x3e\n\x3c!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /--\x3e\n\n\x3c!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /--\x3e\n\x3c!-- /wp:prc-block/grid-column --\x3e\n\n\x3c!-- wp:prc-block/grid-column {"gridLayout":{"index":2,"desktopSpan":"6","tabletSpan":"12","mobileSpan":"4"}} --\x3e\n\x3c!-- wp:prc-block/story-item {"postId":0,"metaTaxonomy":"category"} /--\x3e\n\x3c!-- /wp:prc-block/grid-column --\x3e\n\n\x3c!-- wp:prc-block/grid-column {"gridLayout":{"index":3,"desktopSpan":"3","tabletSpan":"6","mobileSpan":"4"}} --\x3e\n\x3c!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /--\x3e\n\n\x3c!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /--\x3e\n\x3c!-- /wp:prc-block/grid-column --\x3e\n\x3c!-- /wp:prc-block/grid-controller --\x3e</div>\n\x3c!-- /wp:group --\x3e\n',s=(new Date).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"});function m({previewedHomepageId:t,setPreviewedHomepageId:o,clientId:n}){const[c,m]=(0,e.useState)(!1),g=()=>m(!c);return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(p.Button,{variant:"secondary",onClick:g},"Create New Draft"),c&&(0,e.createElement)(r.EntityCreateNewModal,{entityType:"homepage",defaultTitle:`Homepage ${s}`,defaultContent:d,onClose:()=>{g()},onSubmit:(e,t)=>{(async function(e,t,o="draft"){const n={title:e,content:t,status:o},{saveEntityRecord:r}=(0,i.dispatch)(a.store),c=await r("postType",l,n);return!!c&&(console.log("onCreateHomepage",c),c)})(e,t,"draft").then((e=>{console.log("then...",e),o(e.id),g()}))}}))}const g=window.wp.i18n;function w({previewedHomepageId:t,setPreviewedHomepageId:o,clientId:n}){const[a,c]=(0,e.useState)(!1),i=()=>c(!a);return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(p.Button,{variant:"secondary",onClick:i},"Preview Different Homepage"),a&&(0,e.createElement)(r.EntityPatternModal,{title:(0,g.__)("Preview an existing homepage","prc-platform-homepages"),instructions:(0,g.__)("Select a homepage to preview","prc-platform-homepages"),entityType:"homepage",entityTypeLabel:(0,g.__)("Homepage","prc-platform-homepages"),onSelect:e=>{console.log("On select",e),o(e?.id)},onClose:()=>{i()},status:"draft",selectedId:t,clientId:n}))}function u({previewedHomepageId:t,setPreviewedHomepageId:o,clientId:n}){return(0,e.createElement)(c.InspectorControls,null,(0,e.createElement)(p.PanelBody,{title:"Homepage Options"},(0,e.createElement)(p.PanelRow,null,(0,e.createElement)(w,{previewedHomepageId:t,setPreviewedHomepageId:o,clientId:n})),(0,e.createElement)(p.PanelRow,null,(0,e.createElement)(m,{previewedHomepageId:t,setPreviewedHomepageId:o,clientId:n}))))}const y=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/homepages","version":"0.1.0","title":"Homepage","description":"Returns the most recently published homepage.","category":"theme","keywords":["homepage","home","front page","frontpage"],"supports":{"anchor":true,"html":false},"usesContext":["queryId","query","queryContext","templateSlug","previewPostType"],"textdomain":"prc-block-area","editorScript":"file:./index.js"}'),{name:x}=y,I={icon:o,edit:function({clientId:t,context:o}){const[n,p]=(0,e.useState)(),{records:i,hasResolved:d}=(0,a.useEntityRecords)("postType",l,{per_page:1,context:"view",orderby:"date",order:"desc"});(0,e.useEffect)((()=>{0!==i?.length&&d&&(n||p(i[0].id))}),[d,i,n]);const s=(0,c.useBlockProps)();return(0,e.createElement)(e.Fragment,null,(0,e.createElement)(u,{previewedHomepageId:n,setPreviewedHomepageId:p,clientId:t}),(0,e.createElement)(r.InnerBlocksAsSyncedContent,{postId:n,postType:l,postTypeLabel:"Homepage",blockProps:s,clientId:t}))}};(0,n.registerBlockType)(x,{...y,...I})})();
//# sourceMappingURL=index.js.map