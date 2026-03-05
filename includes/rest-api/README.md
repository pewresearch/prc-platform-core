# REST API

Centralized REST API endpoint registration for the PRC Platform. All platform REST endpoints are registered through a single `prc_api_endpoints` filter, mounted under the `prc-api/v3` namespace.

## What it does

- Registers a `rest_api_init` hook that collects all endpoints via `apply_filters( 'prc_api_endpoints', [] )`
- Validates each endpoint definition against a standard schema (route, methods, callback, args, permission_callback)
- Calls `register_rest_route()` for each validated endpoint

## Registering an endpoint

Any plugin or module can add endpoints by filtering `prc_api_endpoints`:

```php
add_filter( 'prc_api_endpoints', function( $endpoints ) {
    $endpoints[] = [
        'route'               => '/my-resource',
        'methods'             => 'GET',
        'callback'            => [ $this, 'my_callback' ],
        'args'                => [],
        'permission_callback' => '__return_true',
    ];
    return $endpoints;
} );
```

The resulting endpoint is available at `/wp-json/prc-api/v3/my-resource`.

## Endpoint schema defaults

| Field | Default | Required |
|-------|---------|----------|
| `route` | `''` | Yes |
| `methods` | `'GET'` | No |
| `callback` | `''` | Yes |
| `args` | `[]` | No |
| `permission_callback` | `fn() => true` | No |

## Key files

| File | Purpose |
|------|---------|
| `class-rest-api.php` | Endpoint collection and registration |

## Namespace

`prc-api/v3` — accessible at `/wp-json/prc-api/v3/`.
