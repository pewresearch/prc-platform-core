/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';

export default function NoResults({ createNew }) {
	return (
		<div
			style={{
				textAlign: 'center',
				color: '#666',
				paddingTop: '1em',
			}}
		>
			<div
				style={{
					padding: '1em 0',
				}}
			>
				{'function' !== typeof createNew && (
					<div>
						<span>{__('No results found.')}</span>
					</div>
				)}
				{typeof createNew === 'function' && <div>{createNew()}</div>}
			</div>
		</div>
	);
}
