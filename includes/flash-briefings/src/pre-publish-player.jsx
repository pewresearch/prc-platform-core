import { __ } from '@wordpress/i18n';
import { PluginPrePublishPanel } from '@wordpress/edit-post';
import { PanelRow } from '@wordpress/components';

const PrePublishPlayer = ({ media }) => {
	console.log(media);
	return (
		<PluginPrePublishPanel
			name="pre-publish-alexa-player"
			title="Audio Preview"
			initialOpen={true}
		>
			<PanelRow>
				{__(
					'Would you like to preview your Flash Briefing audio before you publish?',
					'alexa-preview'
				)}
				<audio id="prepublish-player" controls>
					<source
						id="prepublish-player-source"
						src=""
						type="audio/mpeg"
					/>
					Your browser does not support the audio element.
				</audio>
			</PanelRow>
		</PluginPrePublishPanel>
	);
};

export default PrePublishPlayer;
