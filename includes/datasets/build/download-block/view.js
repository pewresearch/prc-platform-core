import*as t from"@wordpress/interactivity";var o={d:(t,e)=>{for(var n in e)o.o(e,n)&&!o.o(t,n)&&Object.defineProperty(t,n,{enumerable:!0,get:e[n]})},o:(t,o)=>Object.prototype.hasOwnProperty.call(t,o)};const e=(a={getContext:()=>t.getContext,store:()=>t.store},r={},o.d(r,a),r),{actions:n}=(0,e.store)("prc-platform/dataset-download",{actions:{downloadDataset:(t,o,e)=>{window?.wp?.apiFetch({path:`/prc-api/v3/datasets/get-download/?datasetId=${t}`,method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:o,userToken:e})}).then((t=>{console.log("DATASET DOWNLOAD",t),t?.file_url&&window.open(t.file_url,"_blank")})).catch((t=>{console.error("Error fetching dataset download",t)}))},onButtonClick:t=>{t.preventDefault();const o=(0,e.getContext)(),{datasetId:a,isATP:r}=o,s=(0,e.getContext)("prc-user-accounts/content-gate"),{userToken:i,userId:c}=s;if(console.log('onButtonClick: "Hit the api with this information..." ->',s,i,c,a),r){const{actions:t}=(0,e.store)("prc-block/popup-controller");window?.wp?.apiFetch({path:"/prc-api/v3/datasets/check-atp/",method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({uid:c,userToken:i})}).then((o=>{console.log("ATP CHECK",o),t.open()}))}else n.downloadDataset(a,c,i)}}});var a,r;
//# sourceMappingURL=view.js.map