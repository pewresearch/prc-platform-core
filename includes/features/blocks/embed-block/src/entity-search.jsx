/**
 * External Dependencies
 */
import { WPEntitySearch } from '@prc/components';

export default function FeatureSearch({ setAttributes }) {
	return (
		<WPEntitySearch
			placeholder="Search for features"
			entityType="postType"
			entitySubType="feature"
			onSelect={(item) => {
				console.log('Item? ', item);
				setAttributes({
					ref: parseInt(item.entityId),
				});
			}}
			onKeyEnter={() => {
				console.log('Enter Key Pressed');
			}}
			onKeyESC={() => {
				console.log('ESC Key Pressed');
			}}
			perPage={10}
		/>
	);
}
