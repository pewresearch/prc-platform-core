import { uploadMedia } from '@wordpress/media-utils';
import html2canvas from 'html2canvas';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { select } from '@wordpress/data';

const generateChartImages = () => {
	const upload = (blob, name, type) => {
		uploadMedia({
			filesList: [
				new File([blob], name, {
					type,
				}),
			],
			onFileChange: ([fileObj]) => {
				setAttributes({
					pngUrl: fileObj.url,
					pngId: fileObj.id,
				});
				// TODO: Set this as the featured image on chart post type, but not elsewhere.
				// editPost({ featured_media: fileObj.id });
				// setImageLoading(false);
			},
			onError: console.error,
		});
	};
	const createSvg = (clientId) => {
		// setSVGLoading(true);
		const blockEl = document.querySelector(`[data-block="${clientId}"]`);
		const svg = blockEl.querySelector('svg');
		svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
		svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
		const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
		const url = URL.createObjectURL(blob);
		const downloadLink = document.createElement('a');
		downloadLink.href = url;
		downloadLink.download = `chart-${clientId}.svg`;
		document.body.appendChild(downloadLink);
		downloadLink.click();
		document.body.removeChild(downloadLink);
		// setSVGLoading(false);
	};
	const createCanvas = (clientId) => {
		// setImageLoading(true);
		const blockEl = document.querySelector(`[data-block="${clientId}"]`);
		const resizerEl = blockEl.querySelector(
			'.components-resizable-box__container'
		);
		const textWrapper = blockEl.querySelector('.cb__text-wrapper');
		const chartWrapper = blockEl.querySelector('.cb__chart');
		const tag = blockEl.querySelector('.cb__tag');
		const tagText = tag.innerHTML;
		tag.innerHTML = `© ${tagText}`;
		const convertableEl = textWrapper || chartWrapper;
		if (textWrapper) {
			convertableEl.style.padding = `5px`;
		}
		resizerEl.classList.remove('has-show-handle');

		html2canvas(convertableEl).then((canvas) => {
			canvas.toBlob(
				(blob) => {
					upload(
						blob,
						`chart-${clientId}-${Date.now()}.png`,
						'image/png'
					);
				},
				'image/png',
				1
			);
			resizerEl.classList.add('has-show-handle');
			convertableEl.style.padding = '';
			tag.innerHTML = tagText;
		});
	};
	const blockEditor = select(blockEditorStore);
	// get all blocks
	const blocks = blockEditor.getBlocks();
	// check first if is a synced chart block
	// get chart blocks
	const chartControllerBlocks = blocks.filter(
		(block) => block.name === 'prc-block/chart-builder-controller'
	);
	const chartBlocks = chartControllerBlocks.map((block) => {
		const { innerBlocks } = block;
		return innerBlocks.find(
			// eslint-disable-next-line no-shadow
			(block) => block.name === 'prc-block/chart-builder'
		);
	});
	// get chart block clientIds
	const chartBlockClientIds = chartBlocks.map((block) => block.clientId);
	// create canvas for each chart block
	chartBlockClientIds.forEach((clientId) => createCanvas(clientId));
};

export default generateChartImages;
