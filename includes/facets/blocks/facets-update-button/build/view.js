import*as t from"@wordpress/interactivity";var e={d:(t,o)=>{for(var a in o)e.o(o,a)&&!e.o(t,a)&&Object.defineProperty(t,a,{enumerable:!0,get:o[a]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)};const o=(i={store:()=>t.store},n={},e.d(n,i),n),a="prc-platform/facets-context-provider",{actions:s,state:r}=(0,o.store)("prc-platform/facets-update-button",{state:{"update-results":{isDisabled:!0}},actions:{onClear:()=>{const t=(0,o.store)(a);t.actions&&t.actions.onClear&&t.actions.onClear()},onButtonClick(){window.location.href=window.location.href}},callbacks:{watchDisabledState(){const t=(0,o.store)(a);t.state&&(r["update-results"].isDisabled=t.state?.isDisabled)}}});var i,n;
//# sourceMappingURL=view.js.map