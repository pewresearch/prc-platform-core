export default function shapeImg(img, size) {
	console.log('shapeImg', img);
	if (img.sizes[size]) {
		return {
			id: img.id,
			rawUrl: img.url,
			url: img.sizes[size].url,
			width: img.sizes[size].width,
			height: img.sizes[size].height,
			caption: img.caption,
			chartArt: false,
		};
	}
	// eslint-disable-next-line no-console
	console.error(`No image size found for ${size}`, img);
	return false;
}
