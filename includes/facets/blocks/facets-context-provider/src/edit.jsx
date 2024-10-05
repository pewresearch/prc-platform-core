/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useMemo, useState, useEffect } from '@wordpress/element';
import {
	useBlockProps,
	useInnerBlocksProps,
	BlockContextProvider,
} from '@wordpress/block-editor';

/**
 * Internal Dependencies
 */
import useFacetSettings from './use-facet-settings';

export default function Edit({ clientId, context }) {
	const { templateSlug } = context;

	const { settings, isLoading } = useFacetSettings(templateSlug);

	const newContext = useMemo(() => {
		return {
			facetsContextProvider: {
				...settings,
			},
			...context,
		};
	}, [settings, context]);

	const blockProps = useBlockProps();
	const innerBlockProps = useInnerBlocksProps(blockProps, {});

	return (
		<BlockContextProvider
			key={`facets-context-provider-${clientId}`}
			value={newContext}
		>
			<div {...innerBlockProps} />
		</BlockContextProvider>
	);
}
