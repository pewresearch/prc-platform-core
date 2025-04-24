# Publication Listing

The "Publication Listing" is the default query handler for the core/query block
effectively, this is a WP_Query manager for the frontend. Ensuring
the correct post types, tax_query, and meta_query are applied.

Sometimes this blurs the lines between the block library and the platform core.
Because these query arguments impact overall platform performance and behavior,
we are managing them here. Structurally, the block library is dependent on the platform core, not the other way around.



