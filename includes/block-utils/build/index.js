!function(){"use strict";function e(e,t){window.prcBlockUtils[e]||(window.prcBlockUtils[e]=t)}window.prcBlockUtils={},e("getBlockGapSupportValue",(function(e,t=!1){let n=e?.style?.spacing?.blockGap;return"object"==typeof n&&!1!==t&&(n=n["horizontal"===t?"left":"top"]),"string"!=typeof n?"":n?.startsWith("var:preset|spacing|")?`var(--wp--preset--${n.replace("var:preset|","").replace("|","--")})`:n})),e("findBlock",(function e(t,n,l=0){if(l>5)return null;for(let r of t){if(r.blockName&&new RegExp(n.replace("*",".*")).test(r.blockName))return r;if(r.innerBlocks&&r.innerBlocks.length>0){let t=e(r.innerBlocks,n,l+1);if(null!==t)return t}}return null}))}();