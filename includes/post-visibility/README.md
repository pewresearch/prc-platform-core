## Post Visibility

Adds two new statuses to post_status, `hidden_from_search` and `hidden_from_index`. These statuses are used to hide posts from search and index respectively. This is used to hide posts that are not ready for public consumption.

The data is stored in `_postVisibility` meta and is accessible via rest api at the `postVisibility` field on supported objects.
