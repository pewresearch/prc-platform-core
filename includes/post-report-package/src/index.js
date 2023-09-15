/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
import { pages as icon } from '@wordpress/icons';

/**
 * Internal Dependencies
 */
import BackChapters from './back-chapters';
// import ReportMaterials from './materials';

const PLUGIN_NAME = 'prc-platform-post-report-package';

function Panels() {
	//@TODO: convert this to use entity props
	const { backChapters, materials } = useSelect(
		(select) => ({
			backChapters: select('prc/multi-section-report').getItems(),
			// materials: select('prc/report').getItems(),
		}),
		[],
	);

	const { editPost } = useDispatch('core/editor');

	useEffect(() => {
		console.log('<ReportPanel> Meta', backChapters);
		const toSave = {};
		if (0 !== Object.keys(backChapters).length) {
			toSave.multiSectionReport = backChapters;
		}
		if (0 !== Object.keys(toSave).length) {
			console.log('toSave!', toSave);
			editPost({
				meta: { ...toSave },
			});
		}
	}, [backChapters]);

	return (
		<div>
			{/* <ReportMaterials /> */}
			<BackChapters />
		</div>
	);
}

function ReportPackagePanel() {
	return (
		<PluginSidebar name={PLUGIN_NAME} title="Report Package" icon={icon}>
			<Panels />
		</PluginSidebar>
	);
}

// Pre publish to confirm your chapters.

registerPlugin(PLUGIN_NAME, {
	render: ReportPackagePanel,
	// icon,
});
