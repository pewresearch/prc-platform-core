import*as t from"@wordpress/interactivity";var e={d:(t,o)=>{for(var s in o)e.o(o,s)&&!e.o(t,s)&&Object.defineProperty(t,s,{enumerable:!0,get:o[s]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};const o=(r={getElement:()=>t.getElement,store:()=>t.store},a={},e.d(a,r),a),s="prc-platform/facets-context-provider",{state:n}=(0,o.store)("prc-platform/facets-selected-tokens",{state:{tokens:[]},actions:{onTokenClick:()=>{const{ref:t,props:e}=(0,o.getElement)();console.log("onTokenClick",t,e);const n=(0,o.store)(s);if(!n.actions||!n.actions.onClear)return;const r=t.getAttribute("data-facet-slug");n.actions.onClear(r)},onReset:()=>{const t=(0,o.store)(s);t.actions&&t.actions.onClear&&t.actions.onClear()}},callbacks:{hasTokens:()=>!!n.tokens.length,updateTokens:()=>{const t=(0,o.store)(s);if(!t.state)return;const e=t.state.getSelected,r=Object.keys(e).map((t=>({slug:t,label:e[t].join(", ")})));n.tokens=r}}});var r,a;
//# sourceMappingURL=view.js.map