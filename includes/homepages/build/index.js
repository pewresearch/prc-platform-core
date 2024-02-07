!function(){"use strict";var e=window.wp.element,t=window.wp.primitives,n=(0,e.createElement)(t.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 24 24"},(0,e.createElement)(t.Path,{d:"M12 4L4 7.9V20h16V7.9L12 4zm6.5 14.5H14V13h-4v5.5H5.5V8.8L12 5.7l6.5 3.1v9.7z"})),o=window.wp.blocks,a=window.wp.i18n,r=window.wp.components,l=window.wp.coreData,i=window.wp.blockEditor,s=window.wp.url;const c=(new Date).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"});function p({currentHomepageId:t,setPreviewedHomepageId:n,isMissing:o}){const[p,d]=(0,e.useState)(""),{record:m,hasResolved:u}=(0,l.useEntityRecord)("postType","homepage",t),{records:g,hasResolved:w}=(0,l.useEntityRecords)("postType","homepage",{per_page:5,context:"view",orderby:"date",order:"desc",status:"draft"});return(0,e.createElement)(i.InspectorControls,null,(0,e.createElement)(r.PanelBody,null,o&&(0,e.createElement)(r.PanelRow,null,(0,e.createElement)("div",null,(0,a.__)("No homepage found. Please create a homepage.","prc-platform-homepages"))),u&&!o&&(0,e.createElement)(r.PanelRow,null,(0,e.createElement)(r.BaseControl,{__nextHasNoMarginBottom:!0,label:"Active Homepage",style:{width:"100%"}},(0,e.createElement)("div",null,(0,e.createElement)("strong",null,m?.title.raw)))),w&&!o&&(0,e.createElement)(e.Fragment,null,(0,e.createElement)(r.PanelRow,null,(0,e.createElement)(r.SelectControl,{style:{width:"100%"},label:(0,a.__)("Preview draft homepages","prc-platform-homepages"),value:p,options:[{disabled:!0,label:"Select a homepage draft",value:""}].concat(g.map((e=>({label:`${new Date(e.date).toLocaleDateString("en-US",{month:"2-digit",day:"2-digit",year:"2-digit"})} – ${e.title.rendered}`,value:e.id})))),onChange:e=>{n(e),d(e)}})),p&&p!==t&&(0,e.createElement)(r.PanelRow,null,(0,e.createElement)(r.Button,{variant:"secondary",onClick:()=>{n(t),d("")},style:{width:"100%",display:"flex",justifyContent:"center"}},"Reset preview to active homepage"))),(0,e.createElement)(r.PanelRow,null,(0,e.createElement)(r.Button,{variant:"primary",href:(0,s.addQueryArgs)("post-new.php",{post_type:"homepage",post_title:(0,a.__)(`New Homepage ${c} (DRAFT)`,"prc-platform-homepages")}),style:{width:"100%",display:"flex",justifyContent:"center"}},(0,a.__)("Create a new homepage","prc-platform-homepages"))),!u&&(0,e.createElement)("p",null,"Loading homepage block controls...")))}const d="homepage",m="Homepage";var u=(0,r.withNotices)((function(){const[t,n]=(0,e.useState)(),{records:o,hasResolved:r}=(0,l.useEntityRecords)("postType",d,{per_page:1,context:"view",orderby:"date",order:"desc"}),s=o?.[0]?.id,c=!r,u=r&&!s;(0,e.useEffect)((()=>{u||n(s)}),[u,s]);const[g,w,h]=(0,l.useEntityBlockEditor)("postType",d,{id:t}),y=(0,e.useMemo)((()=>JSON.stringify(t,d)),[t]),v=(0,i.__experimentalUseHasRecursion)(y),E=(0,i.useBlockProps)(),f=(0,i.useInnerBlocksProps)(E,{value:g,onInput:w,onChange:h,renderAppender:g?.length?void 0:i.InnerBlocks.ButtonBlockAppender});return v?(0,e.createElement)("div",{...E},(0,e.createElement)(i.Warning,null,(0,a.__)(`${d} cannot be rendered inside itself.`))):u?(0,e.createElement)("div",{...E},(0,e.createElement)(p,{isMissing:u}),(0,e.createElement)(i.Warning,null,(0,a.__)(`A matching ${m.toLocaleLowerCase()} could not be found. It may be unavailable at this time, or you have not published any homepages. Please see the sidebar to create a new homepage.`))):c?(0,e.createElement)("div",{...E},(0,e.createElement)(i.Warning,null,(0,a.__)(`Loading ${m.toLocaleLowerCase()} …`))):(0,e.createElement)(i.__experimentalRecursionProvider,{uniqueId:y},(0,e.createElement)(p,{currentHomepageId:s,setPreviewedHomepageId:n,isMissing:u}),(0,e.createElement)("div",{...f}))})),g=JSON.parse('{"$schema":"https://schemas.wp.org/trunk/block.json","apiVersion":3,"name":"prc-platform/homepages","version":"0.1.0","title":"Homepage","description":"Returns the most recently published homepage.","category":"theme","keywords":["homepage","home","front page","frontpage"],"supports":{"anchor":true,"html":false},"usesContext":["queryId","query","queryContext","templateSlug","previewPostType"],"textdomain":"prc-block-area","editorScript":"file:./index.js"}');const{name:w}=g,h={icon:n,edit:u};(0,o.registerBlockType)(w,{...g,...h})}();
//# sourceMappingURL=index.js.map