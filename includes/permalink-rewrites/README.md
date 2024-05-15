## Permalink Rewrites

### URL Helper
URL Helper is a class that makes it easy to get the post id for a url. Whether its a preview link, an edit link, or a post link, URL Helper can get the post id for you.

```php
$found_post_id = new URL_Helper('www.pewresearch.org/xyz...')->post_id;
```
