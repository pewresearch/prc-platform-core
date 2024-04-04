import { __ } from '@wordpress/i18n';
import { uploadMedia } from '@wordpress/media-utils';
import { PanelBody, PanelRow, Button } from '@wordpress/components';

const SECURITY_TOKEN = ''; // @TODO need to add this to env vars @benwormald

const addMedia = (content, postId) => {
    const mediaCollection = new wp.api.collections.Media();
    const fetched = mediaCollection
        .fetch({ data: { parent: postId } })
        .then((res) => {
            if (res.length > 0) {
                //delete results as model
                res.forEach((mediaObj) => {
                    let mediaModel = new wp.api.models.Media({
                        id: mediaObj.id,
                    });
                    mediaModel.fetch();
                    mediaModel.destroy();
                });
            }
            uploadMedia({
                filesList: [
                    new File([content], `$brief-${postId}-${Date.now()}.mp3`, {
                        type: 'audio/mpeg',
                    }),
                ],
                additionalData: {
                    post: postId,
                    foo: 'bar',
                },
                onFileChange: ([fileObj]) => {
                    document.getElementById('audio-source').src = fileObj.url;
                    document.getElementById('audio-el').load();
                },
                onError: console.error,
            });
        });
};

async function postData(url, data) {
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    const content = await res.blob();
    return content;
}

const AlexaPreview = ({ blockContent }) => {
    return (
		<PanelBody title={__('Alexa Preview', 'alexa-preview')}>
			<PanelRow>
				{__(
					'A preview of the audio generated for the Amazon Alexa "Daily Briefing" skill.',
					'alexa-preview',
				)}
			</PanelRow>
			<PanelRow>
				<audio id="audio-el" controls>
					<source
						id="audio-source"
						src=""
						type="audio/mpeg"
					/>
					Your browser does not support the audio element.
				</audio>
			</PanelRow>
			<PanelRow>
				<Button
					onClick={() => {
						const postId = wp.data
							.select('core/editor')
							.getCurrentPostId();

						postData(
							'https://polly.pewresearch.io/speak?voice=Joanna',
							{
								TEXT:
									blockContent +
									' For more, visit pew research dot org.',
								SECURITY_TOKEN,
							},
						).then((data) => {
							addMedia(data, postId);
						});
					}}
					className="components-button is-button is-default is-large"
				>
					{__('Retrieve preview audio', 'alexa-preview')}
				</Button>
			</PanelRow>
		</PanelBody>
    );
};

export default AlexaPreview;
