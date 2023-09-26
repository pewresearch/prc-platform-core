/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';
import { useTaxonomy } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Placeholder } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import { TAXONOMY, TAXONOMY_LABEL } from './constants';

export default function BlockAreaSearch({ blockAreaSlug, setBlockAreaSlug }) {
	const [blockAreaId, blockAreaName] = useTaxonomy(TAXONOMY, blockAreaSlug);

	return (
		<Placeholder
			label={__('Block Area Search', 'prc-platform-core')}
			instructions={__(`"Block Areas" are used to create areas where Block Modules can render content based on criteria like Topic.`)}
			isColumnLayout={true}
		>
			<WPEntitySearch
				placeholder={__('Topic Category Lede...')}
				searchLabel={__(`Search for ${TAXONOMY_LABEL}`)}
				entityType="taxonomy"
				entitySubType={TAXONOMY}
				entityId={blockAreaId || false}
				searchValue={blockAreaName || ''}
				onSelect={(entity) => {
					console.log('Block Area Entity: ', entity);
					setBlockAreaSlug(entity.slug);
				}}
				onKeyEnter={() => {
					console.log("Enter Key Pressed");
				}}
				onKeyESC={() => {
					console.log("ESC Key Pressed");
				}}
				perPage={10}
				showExcerpt={true}
			/>
		</Placeholder>
	);
}
