/**
 * External Dependencies
 */
import styled from '@emotion/styled';
import { LoadingIndicator } from '@prc/components';

/**
 * WordPress Dependencies
 */
import { PanelBody, ToggleControl, Button } from '@wordpress/components';
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { usePostReportPackage } from '../context';
import Chapters from './chapters';
import Parts from './parts';

const StyledToggleControl = styled(ToggleControl)`
	margin-top: 1em;
`;

export default function ChaptersPanel() {
	const { toggleParts, enableParts, hasChapters, isResolving } =
		usePostReportPackage();

	return (
		<Fragment>
			<PanelBody title="Chapters" initialOpen={true}>
				<LoadingIndicator
					enabled={isResolving}
					label="Resolving Chapters..."
				/>
				{!isResolving && (
					<Fragment>
						<Chapters />
						{hasChapters && (
							<StyledToggleControl
								label="Enable Parts"
								help={`Parts are a method for grouping chapters together in a logical hierarchy.`}
								checked={enableParts}
								onChange={toggleParts}
							/>
						)}
					</Fragment>
				)}
			</PanelBody>
			{enableParts && (
				<PanelBody title="Parts" initialOpen={true}>
					<LoadingIndicator
						enabled={isResolving}
						label="Resolving Package Parts..."
					/>
					{!isResolving && <Parts />}
				</PanelBody>
			)}
		</Fragment>
	);
}
