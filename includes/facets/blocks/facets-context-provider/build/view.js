import*as e from"@wordpress/interactivity";var t={438:e=>{e.exports=import("@wordpress/interactivity-router")}},r={};function o(e){var s=r[e];if(void 0!==s)return s.exports;var l=r[e]={exports:{}};return t[e](l,l.exports,o),l.exports}o.d=(e,t)=>{for(var r in t)o.o(t,r)&&!o.o(e,r)&&Object.defineProperty(e,r,{enumerable:!0,get:t[r]})},o.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),(()=>{const t=(c={getElement:()=>e.getElement,getServerState:()=>e.getServerState,store:()=>e.store},n={},o.d(n,c),n),{addQueryArgs:r}=window.wp.url,{state:s,actions:l}=(0,t.store)("prc-platform/facets-context-provider",{state:{mouseEnterPreFetchTimer:500,navigateTimer:1e3,epSortByDate:!1,get getSelected(){return s.selected},get getServerSelected(){return(0,t.getServerState)().selected},get getUpdatedUrl(){if(void 0!==s.selected)return l.constructNewUrl(s.selected)}},actions:{constructNewUrl(e=!1){const t={};if(!1===e)return;Object.keys(e).forEach((r=>{r.startsWith(s.urlKey)?t[r]=e[r]:Array.isArray(e[r])?t[`${s.urlKey}${r}`]=e[r].join(","):t[`${s.urlKey}${r}`]=e[r]})),Object.keys(t).forEach((e=>{""!==t[e]&&"object"!=typeof t[e]||delete t[e]}));const o=window.location.href.split("?")[0].replace(/\/page\/\d+\//,"/");return r(o,t)},*updateResults(){const e=window.location.href,r=s.getUpdatedUrl;if(r===e)return void console.log("Facets_Context_Provider -> updateResults::","no change in url");console.log("Facets_Context_Provider -> updateResults::",s,e,r),s.isProcessing=!0;const l=yield Promise.resolve().then(o.bind(o,438));yield l.actions.navigate(r),console.log("YIELD: Facets_Context_Provider <- updateResults::",(0,t.getServerState)(),e,r);const{ref:c}=(0,t.getElement)();c?c.scrollIntoView({behavior:"smooth",block:"start"}):window.scrollTo({top:0,behavior:"smooth"}),s.isProcessing=!1},*prefetch(e){const t=yield Promise.resolve().then(o.bind(o,438));s.prefetched.includes(e)||(s.prefetched.push(e),yield t.actions.prefetch(e))},onClear:(e,t=null)=>{const r=s.selected;return console.log("parent onClear",{facetSlug:e,facetValue:t,currentlySelected:r}),e?t?(r[e]=r[e].filter((e=>e!==t)),void(s.selected={...r})):(console.log("pre check:",{currentlySelected:r,facetSlug:e}),r[e]=[],s.selected={...r},s.selected):(s.selected={},void l.updateResults())}},callbacks:{onSelection(){const e=s.getSelected;Object.keys(e).length<=0?(console.log("Facets_Context_Provider -> onSelection:: FALSE NO SELECTIONS"),s.isDisabled=!0):(console.log("Facets_Context_Provider -> onSelection::",s),l.updateResults(),s.isDisabled=!1)},onEpSortByUpdate(){s.epSortByDate?s.selected.ep_sort__by_date=!0:delete s.selected.ep_sort__by_date}}});var c,n})();
//# sourceMappingURL=view.js.map