!function(){"use strict";var e=window.wp.element,t=window.wp.hooks,l=window.wp.compose,n=window.wp.plugins,r=window.wp.editPost,c=window.wp.data,o=window.wp.i18n,i=window.wp.blockEditor,d=window.wp.components;function s(t){let{attributes:l,setAttributes:n}=t;const{prcEmbed:r}=l,{enabled:s,id:a}=r,b=(0,c.useSelect)((e=>{const{getPermalink:t}=e("core/editor");return`${t()}iframe/${a}`}),[a]);return(0,e.createElement)(i.InspectorAdvancedControls,null,(0,e.createElement)(d.BaseControl,{id:"prc-platform-embeds",label:(0,o.__)("Iframe Settings","prc-platform"),help:s?`This block will be visible via iframe at: ${b}`:null},(0,e.createElement)(d.ToggleControl,{label:s?(0,o.__)("Enabled"):(0,o.__)("Disabled"),checked:s,onChange:()=>{n(null===a?{prcEmbed:{enabled:!s,id:Math.random().toString(36).substr(2,4)}}:{prcEmbed:{enabled:!s,id:a}})}}),null!==a&&s&&(0,e.createElement)(d.ExternalLink,{href:b},"Preview embed")))}function a(){return(0,e.createElement)(d.SVG,{xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 448 512",height:21,preserveAspectRatio:"xMidYMid meet"},(0,e.createElement)(d.Path,{d:"M384 64c17.7 0 32 14.3 32 32V416c0 17.7-14.3 32-32 32H64c-17.7 0-32-14.3-32-32V96c0-17.7 14.3-32 32-32H384zM64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM261.4 172c-6.6 5.9-7.2 16-1.3 22.6L314.6 256 260 317.4c-5.9 6.6-5.3 16.7 1.3 22.6s16.7 5.3 22.6-1.3l64-72c5.4-6.1 5.4-15.2 0-21.3l-64-72c-5.9-6.6-16-7.2-22.6-1.3zM188 194.6c5.9-6.6 5.3-16.7-1.3-22.6s-16.7-5.3-22.6 1.3l-64 72c-5.4 6.1-5.4 15.2 0 21.3l64 72c5.9 6.6 16 7.2 22.6 1.3s7.2-16 1.3-22.6L133.4 256 188 194.6z"}))}const{prcEmbeds:b}=window,{allowedBlocks:m=[]}=b;(0,t.addFilter)("blocks.registerBlockType","prc-allow-embed-supports",(e=>m.includes(e.name)?(e.attributes={...e.attributes,prcEmbed:{type:"object",default:{enabled:!1,id:null}}},e):e)),(0,t.addFilter)("editor.BlockEdit","prc-allow-embed-controls",(0,l.createHigherOrderComponent)((t=>function(l){const{name:n,attributes:r,setAttributes:c,clientId:o}=l;return m.includes(n)?(0,e.createElement)(e.Fragment,null,(0,e.createElement)(s,{attributes:r,setAttributes:c,clientId:o}),(0,e.createElement)(t,l)):(0,e.createElement)(t,l)}),"withEmbedControls"),21),(0,n.registerPlugin)("block-settings-menu-group-test",{render:function(){const{updateBlockAttributes:t}=(0,c.useDispatch)("core/block-editor"),{selectedBlock:l}=(0,c.useSelect)((e=>{const{getSelectedBlock:t}=e("core/block-editor");return{selectedBlock:t()}}),[]),n=l?.attributes?.prcEmbed?.enabled,o=l?.attributes?.prcEmbed?.id;return(0,e.createElement)(r.PluginBlockSettingsMenuItem,{allowedBlocks:m,icon:(0,e.createElement)(a,null),label:n?"Disable embed":"Enable embed",onClick:()=>{(()=>{const e=l?.clientId;e&&t(e,null===o?{prcEmbed:{enabled:!n,id:Math.random().toString(36).substr(2,4)}}:{prcEmbed:{enabled:!n,id:o}})})()}})}})}();