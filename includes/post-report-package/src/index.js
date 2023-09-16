/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useEffect, useState } from '@wordpress/element';
import { registerPlugin } from '@wordpress/plugins';
import { PluginSidebar } from '@wordpress/edit-post';
import { useSelect, useDispatch } from '@wordpress/data';
import { pages as icon } from '@wordpress/icons';
import { useEntityProp } from '@wordpress/core-data';

/**
 * Internal Dependencies
 */
import BackChapters from './back-chapters';
// import ReportMaterials from './materials';

const PLUGIN_NAME = 'prc-platform-post-report-package';

function ReportPackagePanel() {
	return (
		<PluginSidebar name={PLUGIN_NAME} title="Report Package" icon={icon}>
			<BackChapters />
		</PluginSidebar>
	);
}

// Pre publish to confirm your chapters.

registerPlugin(PLUGIN_NAME, {
	render: ReportPackagePanel,
	// icon,
});
