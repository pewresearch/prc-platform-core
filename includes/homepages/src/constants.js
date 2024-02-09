const POST_TYPE = 'homepage';
const POST_TYPE_LABEL = 'Homepage';
const DEFAULT_CONTENT = `
<!-- wp:group {"layout":{"type":"constrained","contentSize":"1200px"}} -->
<div class="wp-block-group"><!-- wp:prc-block/grid-controller {"dividerColor":"gray","className":"is-pattern__featured-layout"} -->
<!-- wp:prc-block/grid-column {"gridLayout":{"index":1,"desktopSpan":"3","tabletSpan":"6","mobileSpan":"4"}} -->
<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->

<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->
<!-- /wp:prc-block/grid-column -->

<!-- wp:prc-block/grid-column {"gridLayout":{"index":2,"desktopSpan":"6","tabletSpan":"12","mobileSpan":"4"}} -->
<!-- wp:prc-block/story-item {"postId":0,"metaTaxonomy":"category"} /-->
<!-- /wp:prc-block/grid-column -->

<!-- wp:prc-block/grid-column {"gridLayout":{"index":3,"desktopSpan":"3","tabletSpan":"6","mobileSpan":"4"}} -->
<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->

<!-- wp:prc-block/story-item {"imageSize":"A2","postId":0,"metaTaxonomy":"category"} /-->
<!-- /wp:prc-block/grid-column -->
<!-- /wp:prc-block/grid-controller --></div>
<!-- /wp:group -->
`;

export { POST_TYPE, POST_TYPE_LABEL, DEFAULT_CONTENT };
