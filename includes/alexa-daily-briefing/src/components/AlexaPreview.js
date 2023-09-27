import { __ } from '@wordpress/i18n';
import { Fragment } from '@wordpress/element';
import { select } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/edit-post';
import { uploadMedia } from '@wordpress/media-utils';
import { PanelBody, PanelRow, Button } from '@wordpress/components';

const SECURITY_TOKEN =
    'xyz';

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
    // let headers = new Headers();

    // headers.append('Content-Type', 'application/json');
    // headers.append('Accept', 'application/json');
    // headers.append('Authorization', 'Basic ' + btoa('prc:research'));
    // headers.append('Origin','http://pewresearch.local');

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
        <Fragment>
            <PluginSidebarMoreMenuItem target="alexa-preview">
                {__('Alexa Preview Audio', 'alexa-preview')}
            </PluginSidebarMoreMenuItem>
            <PluginSidebar
                name="alexa-preview"
                title={__('Alexa Preview Audio', 'alexa-preview')}
            >
                <PanelBody>
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
            </PluginSidebar>
        </Fragment>
    );
};

export default AlexaPreview;
