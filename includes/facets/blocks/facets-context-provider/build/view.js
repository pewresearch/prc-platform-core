import*as e from"@wordpress/interactivity";var t={760:e=>{e.exports=import("@wordpress/interactivity-router")}},o={};function n(e){var r=o[e];if(void 0!==r)return r.exports;var c=o[e]={exports:{}};return t[e](c,c.exports,n),c.exports}n.d=(e,t)=>{for(var o in t)n.o(t,o)&&!n.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:t[o]})},n.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{const t=(l={getContext:()=>e.getContext,getElement:()=>e.getElement,store:()=>e.store},i={},n.d(i,l),i),{addQueryArgs:o}=window.wp.url,{context:r,state:c,actions:s}=(0,t.store)("prc-platform/facets-context-provider",{state:{inputIds:{},mouseEnterPreFetchTimer:500,navigateTimer:1e3,get getSelected(){return c.selected},get getUpdatedUrl(){const e={};if(void 0===c.selected)return;Object.keys(c.selected).forEach((t=>{Array.isArray(c.selected[t])?e[t]=c.selected[t].join(","):e[t]=c.selected[t]})),Object.keys(e).forEach((t=>{console.log(e[t]),""===e[t]&&delete e[t]}));const t=window.location.href.split("?")[0].replace(/\/page\/\d+\//,"/"),n=o(t,e);return console.log("getUpdatedUrl",t,e,n),n}},actions:{onCheckboxClick:e=>{"LABEL"===e.target.tagName&&e.preventDefault();const o=(0,t.getContext)(),{ref:n}=(0,t.getElement)(),r=n.querySelector("input"),{id:s}=r,{checked:l,value:i,type:d}=c[s];c[s].checked=!l;const a=n.parentElement.parentElement.dataset.wpKey;c.selected[a]||(c.selected[a]=[]),c.selected[a].includes(i)?c.selected[a]=c.selected[a].filter((e=>e!==i)):c.selected[a]="radio"===d?[i]:[...c.selected[a],i],console.log("onCheckboxClick",n,c,s,o)},onSelectChange:(e,t)=>{console.log("onSelectChange",e,t);const o=t.getAttribute("aria-controls"),n=document.getElementById(o).dataset.wpKey;c.selected[n]||(c.selected[n]=[]),c.selected[n].includes(e)?c.selected[n]=c.selected[n].filter((t=>t!==e)):c.selected[n]=[e]},*onCheckboxMouseEnter(){console.log("prc-platform/facets-context-provider","onCheckboxMouseEnter");const e=yield Promise.resolve().then(n.bind(n,760));yield e.actions.prefetch("")},*onButtonMouseEnter(){console.log("prc-platform/facets-context-provider","onButtonMouseEnter");const e=yield Promise.resolve().then(n.bind(n,760));yield e.actions.prefetch("")},onClear:e=>{console.log("onClear",e,c);const t=c.selected;Object.keys(c).find((o=>{"object"==typeof c[o]&&t[e].includes(c[o]?.value)&&(c[o].checked=!1)})),delete t[e],c.selected={...t}},onFacetTokenClick:()=>{const{ref:e,props:o}=(0,t.getElement)(),n=`_${o["data-wp-key"]}`;s.onClear(n)}},callbacks:{*onSelection(){const e=c.getSelected;if(console.log("onSelection",e),void 0===e)return;const t=yield Promise.resolve().then(n.bind(n,760));if(Object.keys(e).length>0){const e=c.getUpdatedUrl,o=setTimeout((()=>{c.isProcessing=!0,console.log("rendering diff results...",r,c,e)}),c.navigateTimer);yield t.actions.navigate(e),clearTimeout(o),c.isProcessing=!1}else{const e=window.location.href.split("?")[0];yield t.actions.navigate(e)}}}});var l,i})();
//# sourceMappingURL=view.js.map