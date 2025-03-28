/**
 * Forked from 10up fix
 * https://github.com/10up/block-components/pull/262
 */

/**
 * External Dependencies
 */
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import propTypes from 'prop-types';

/**
 * WordPress Dependencies
 */
import { useRefEffect, useInstanceId } from '@wordpress/compose';
import { Fragment, useState } from 'react';

const StyledComponentContext = (props) => {
	const { children, cacheKey } = props;
	const fallbackKey = useInstanceId(StyledComponentContext);

	const defaultCache = createCache({
		key: cacheKey || fallbackKey,
	});

	const [cache, setCache] = useState(defaultCache);
	const nodeRef = useRefEffect(
		(node) => {
			if (node) {
				setCache(
					createCache({
						key: cacheKey || fallbackKey,
						container: node,
					}),
				);
			}
			return () => {
				setCache(defaultCache);
			};
		},
		[cacheKey, fallbackKey],
	);

	return (
		<Fragment>
			<span ref={nodeRef} style={{ display: 'none' }} />
			<CacheProvider value={cache}>{children}</CacheProvider>
		</Fragment>
	);
};

StyledComponentContext.propTypes = {
	children: propTypes.node.isRequired,
	cacheKey: propTypes.string.isRequired,
};


export default StyledComponentContext;
