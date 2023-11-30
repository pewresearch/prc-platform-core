/**
 * External Dependencies
 */
import classnames from 'classnames';

/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';

/**
 * Internal Dependencies
 */
import { LabelButton } from '../labels';

function ExpandButton({ label = 'Expand', isOpen, onClick, children }) {
	return (
		<Fragment>
			<LabelButton onClick={onClick}>
				{`${label} `}
				<i
					aria-hidden="true"
					className={classnames('outline circle icon', {
						plus: !isOpen,
						minus: isOpen,
					})}
				/>
			</LabelButton>
			{isOpen && children}
		</Fragment>
	);
}

export default ExpandButton;
