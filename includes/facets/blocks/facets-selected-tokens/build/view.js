import*as e from"@wordpress/interactivity";var t={d:(e,o)=>{for(var n in o)t.o(o,n)&&!t.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:o[n]})},o:(e,t)=>Object.prototype.hasOwnProperty.call(e,t)};const o=(s={getContext:()=>e.getContext,store:()=>e.store},a={},t.d(a,s),a),{state:n,actions:r}=(0,o.store)("prc-platform/facets-context-provider",{state:{get tokens(){const{getSelected:e,facets:t}=n;return e?[...Object.keys(e).map(((o,n)=>t[o].choices.filter((t=>!!e[o]&&e[o].includes(t.value)))))].flat():[]}},actions:{onTokenClick:()=>{const e=(0,o.getContext)();console.log("onTokenClick",e);const{facetSlug:t,value:n}=e.token;r.onClear(t,n)},resetAllTokens:()=>{window.location=window.location.href.split("?")[0].replace(/\/page\/\d+\//,"/")}},callbacks:{hasTokens:()=>!!n.tokens.length}});var s,a;
//# sourceMappingURL=view.js.map