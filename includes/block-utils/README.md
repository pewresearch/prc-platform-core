## Block Utils

> For every PHP util *except for interactivity-api specific utils* you MUST create an analogous JS util. For every JS util you > you MUST create an analogous PHP util.

These should be primitive low level utilities, pass in some data get something different out the other end, quickly and effeciently.

`findBlock` - `find_block`

`getBlockGapSupportValue` - `get_block_gap_support_value`

`classNames` - `classNames`

---

### Interactivity PHP API:

These functions are use to deep fetch the interactivity API data from the block attributes of innerblocks. Useful for hoisting interactivity data from innerblocks to the parent block.

`get_wp_interactive_context`

`get_wp_interactive_classname`

`get_wp_interactive_on_mouseenter_action`

`get_wp_interactive_on_click_action`
