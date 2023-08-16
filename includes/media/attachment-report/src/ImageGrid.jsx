/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import {
	Card,
	CardBody,
	CardDivider,
	CardMedia,
	CardHeader,
} from '@wordpress/components';

/**
 * Internal Dependencies
 */
import ImagePopover from './ImagePopover';

const GridContainer = styled.div`
	display: flex;
	flex-wrap: wrap;
`;

const GridItem = styled.div`
	width: 16.66667%; /* 6 items across */
	padding: 10px;
	box-sizing: border-box;
`;

export default function ImageGrid({ data }) {
	return (
		<GridContainer>
			{data.map((image) => (
				<GridItem key={image.id}>
					<Card>
						<CardMedia>
							<ImagePopover
								image={image}
								placement="right"
								displayDetails={true}
							/>
						</CardMedia>
					</Card>
				</GridItem>
			))}
		</GridContainer>
	);
}
