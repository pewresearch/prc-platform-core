/**
 * External Dependencies
 */
import { Button, Divider } from 'semantic-ui-react';
import styled from 'styled-components';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { useFacets } from '../context';
import ClearAllButton from './ClearAllButton';
import ExpandButton from './ExpandButton';

function UpdateButton({ last = false, isOpen = false, expandOnClick = null }) {
	const { nextUrl, hasSelections, processing, processUrlChange, isMobile } =
		useFacets();

	const UpdateActions = styled.div`
		display: flex;
		align-items: center;
		flex-direction: row;
		> button:first-child {
			flex-grow: 1;
			&:not(.ui.button) {
				text-align: left;
			}
		}
		${!last ? 'margin-bottom: 1em' : ''}
	`;

	const StyledClearAllButton = styled(ClearAllButton)`
		 {
			${isMobile ? 'order: 1' : ''}
		}
	`;

	const StlyedButton = styled(Button)`
		 {
			${isMobile ? 'order: 2' : ''}
		}
	`;

	return (
		<Fragment>
			{last && <Divider />}
			<UpdateActions>
				{!last && isMobile && (
					<ExpandButton
						label="Filter"
						isOpen={isOpen}
						onClick={expandOnClick}
					/>
				)}
				<StlyedButton
					primary={hasSelections}
					disabled={!hasSelections || processing || '' === nextUrl}
					loading={processing}
					onClick={() => processUrlChange()}
				>
					Update
				</StlyedButton>
				{!last && hasSelections && (
					<StyledClearAllButton updateContextOnClick />
				)}
			</UpdateActions>
			{!last && isMobile && <Divider />}
		</Fragment>
	);
}

export default UpdateButton;
