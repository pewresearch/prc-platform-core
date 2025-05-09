// for each svg file in the build directory, create a json file with the same name
// and the following content:
// {
// 	"library": {filename},
// 	"icons": [ ... ]
// }
// where the icons array contains ids of each symbol in the svg file
//

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

// const buildDir = path.join(__dirname, 'build/icons/sprites');
// build directory is located at '../../../prc-icon-library/build/icons/sprites'
const buildDir = path.join(
	__dirname,
	'../../../../prc-icon-library/build/icons/sprites'
);
// if the build directory does not exist, log an error and exit
if (!fs.existsSync(buildDir)) {
	console.error(
		'Build directory does not exist. Run `npm run build` in `plugins/prc-icon-library` first.'
	);
	process.exit(1);
}
const files = fs.readdirSync(buildDir);

const outputDir = path.join(__dirname, '../src');
const outputFile = path.join(outputDir, 'icon-library-index.json');

// Ensure output directory exists
if (!fs.existsSync(outputDir)) {
	fs.mkdirSync(outputDir, { recursive: true });
}

// Read existing icons if file exists, otherwise start fresh
let icons = {};
if (fs.existsSync(outputFile)) {
	try {
		icons = JSON.parse(fs.readFileSync(outputFile, 'utf8'));
	} catch (e) {
		console.warn(
			'Could not parse existing icon-library-index.json, starting fresh.'
		);
		icons = {};
	}
}

files.forEach((file) => {
	const filePath = path.join(buildDir, file);
	const dom = new JSDOM(fs.readFileSync(filePath, 'utf8'));
	const symbols = dom.window.document.querySelectorAll('symbol');
	const iconNames = Array.from(symbols).map((symbol) => symbol.id);
	const library = file.replace('.svg', '');
	icons[library] = iconNames.sort();
});

fs.writeFileSync(outputFile, JSON.stringify(icons, null, 2));
