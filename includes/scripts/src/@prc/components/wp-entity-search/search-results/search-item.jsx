/**
 * External Dependencies
 */

/**
 * WordPress Dependencies
 */
import { useMemo } from '@wordpress/element';
import { Card, CardBody } from '@wordpress/components';
import { date as formatDate } from '@wordpress/date';
import { decodeEntities } from '@wordpress/html-entities';

/**
 * Internal Dependencies
 */
import { useWPEntitySearch } from '../context';

export default function SearchItem({ item }) {
	const { selectedId, setSelectedId, entityConfig, showExcerpt, showType } =
		useWPEntitySearch();

	const {
		entityId,
		entityName,
		entityDate,
		entityDescription,
		entityType,
		entitySubType,
		entityUrl,
	} = item;

	const isActive = useMemo(() => {
		return selectedId === entityId;
	}, [selectedId, entityId]);

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<Card
			onClick={() => {
				console.log('<SearchItem/> onClick::', item, entityId);
				setSelectedId(entityId);
			}}
			size="small"
			style={{
				cursor: 'pointer',
				boxShadow: 'none',
				border: '1px solid #eee',
				':hover': {
					backgroundColor: '#f0f0f0',
				},
				backgroundColor: isActive ? '#f0f0f0' : 'transparent',
			}}
			tabIndex="0"
			key={`${entityId}-card`}
		>
			<CardBody
				key={`${entityId}-cardBody`}
				style={{
					display: 'flex',
				}}
			>
				<div>
					{null !== entityDate && (
						<div
							style={{
								fontSize: '0.8em',
								color: '#666',
							}}
						>
							{`${formatDate('M j, Y', entityDate)}`}
						</div>
					)}
					<strong>{decodeEntities(entityName)}</strong>
					{true === showType && (
						<div
							style={{
								fontSize: '0.8em',
								color: '#666',
							}}
						>
							Type: {entitySubType}
						</div>
					)}
					{true === showExcerpt && entityDescription && (
						<div
							style={{
								fontSize: '0.8em',
								color: '#666',
								lineHeight: '1.5em',
							}}
						>
							{decodeEntities(entityDescription)}
						</div>
					)}
					<div
						style={{
							fontSize: '0.8em',
							fontStyle: 'italic',
							color: '#666',
							lineHeight: '1.5em',
						}}
					>
						{entityUrl}
					</div>
				</div>
			</CardBody>
		</Card>
	);
}
