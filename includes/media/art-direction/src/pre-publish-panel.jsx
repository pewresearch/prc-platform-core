/**
 * WordPress Dependencies
 */
import { PluginPrePublishPanel } from '@wordpress/edit-post';

/**
 * Internal Dependencies
 */
import { ProvideArtDirection } from './context';
import ArtDirectionList from './art-direction-list';

export default function PrePublishPanel() {
	return (
		<PluginPrePublishPanel title="Review Art Direction" initialOpen>
			<ProvideArtDirection>
				<ArtDirectionList />
			</ProvideArtDirection>
		</PluginPrePublishPanel>
	);
}
