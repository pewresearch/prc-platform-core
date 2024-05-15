## Staff Bylines System

"Staff Bylines" provides a novel system for handling staff listing pages, staff/author pages, and byline and or acknowledgement attribution on posts; with hooks into Yoast and Parse.ly. Bylines are stored as a custom taxonomy, and staff are stored as a custom post type. This allows for a great deal of flexibility in how the data is used and displayed.

See PRC-Block-Library for Gutenberg blocks that can be used to display staff bylines and provide staff listing pages via the `prc-block/staff-query` block.

To access the data provided by the interfaces here in your theme, you can use the following functions:

```php
// Get the staff byline for a post
$bylines = new Bylines($post_id);
$bylines->format('string'); // Returns a simple string: "By Jane Doe, John Smith, and Jill Doe"
$bylines->format('html'); // Returns a string of HTML: "By <a href="/staff/jane-doe/">Jane Doe</a>, <a href="/staff/john-smith/">John Smith</a>, and <a href="/staff/jill-doe/">Jill Doe</a>"
$bylines->format('array'); // Returns an array of staff objects: [ { key: "jane-doe", termId: 123 }, { key: "john-smith", termId: 456 }, { key: "jill-doe", termId: 789 } ]
```

