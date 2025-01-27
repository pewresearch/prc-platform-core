/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
// eslint-disable-next-line no-restricted-imports
import { createInterpolateElement, Fragment } from '@wordpress/element';
import {
	ComboboxControl,
	Notice,
	__experimentalHStack as HStack, // eslint-disable-line
	__experimentalToggleGroupControl as ToggleGroupControl, // eslint-disable-line
	__experimentalToggleGroupControlOptionIcon as ToggleGroupControlOptionIcon, // eslint-disable-line
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import useKickerTemplatePart from './use-kicker-template-part';

export default function KickerTemplatePartControl({
	kickerSlug,
	onChange = () => {},
}) {
	const { siteUrl } = window.prcPlatform;
	const kickerTemplateUrl = siteUrl
		? `${siteUrl}/wp-admin/site-editor.php?path=%2Fpatterns&categoryType=wp_template_part&categoryId=kicker`
		: '';

	// Fetch all template parts.
	const { kickerOptions, hasKickers, selectedKickerAndExists } =
		useKickerTemplatePart({
			kickerSlug,
			setKickerSlug: (newVal) => onChange(newVal),
		});

	// Notice for when no kickers have been created.
	const noKickersNotice = (
		<Notice status="warning" isDismissible={false}>
			{createInterpolateElement(
				__(
					'No kicker templates could be found. Create a new one in the <a>Site Editor</a>.',
					'kicker-control'
				),
				{
					a: (
						<a // eslint-disable-line
							href={kickerTemplateUrl}
							target="_blank"
							rel="noreferrer"
						/>
					),
				}
			)}
		</Notice>
	);

	// Notice for when the selected kicker template no longer exists.
	const kickerDoesntExistNotice = (
		<Notice status="warning" isDismissible={false}>
			{__(
				'The selected kicker template no longer exists. Choose another.',
				'kicker-control'
			)}
		</Notice>
	);

	return (
		<Fragment>
			<ComboboxControl
				label={__('Kicker Template', 'kicker-control')}
				value={kickerSlug}
				options={kickerOptions}
				onChange={onChange}
				help={
					hasKickers &&
					createInterpolateElement(
						__(
							'Create and modify kicker templates in the <a>Site Editor</a>.',
							'kicker-control'
						),
						{
							a: (
							<a // eslint-disable-line
									href={kickerTemplateUrl}
									target="_blank"
									rel="noreferrer"
								/>
							),
						}
					)
				}
			/>
			{!hasKickers && noKickersNotice}
			{hasKickers && !selectedKickerAndExists && kickerDoesntExistNotice}
		</Fragment>
	);
}
