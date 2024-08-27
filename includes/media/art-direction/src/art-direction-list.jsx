/* eslint-disable no-nested-ternary */
/**
 * WordPress Dependencies
 */
import { Fragment } from '@wordpress/element';
import { Flex, FlexBlock, ExternalLink } from '@wordpress/components';

/**
 * Internal Dependencies
 */
import Slot from './slot';
import { useArtDirection } from './context';

export default function ArtDirectionList() {
	const { hasA1Image } = useArtDirection();

	return (
		<div className="prc-platform-art-direction__list">
			<p>
				<ExternalLink href="https://platform.pewresearch.org/wiki/art-direction">
					Art Direction Documentation
				</ExternalLink>
			</p>
			<p
				style={{
					background:
						'var(--wp--custom--color-grey-spectrum-light-one)',
					padding: '0.5em 1em',
					marginLeft: '-1em',
					marginRight: '-1em',
					marginTop: '1em',
					marginBottom: '-1px',
				}}
			>
				<strong>Story Item</strong>
			</p>
			<Slot size="A1" />
			{hasA1Image && (
				<Fragment>
					<Slot size="A2" />
					<Flex>
						<FlexBlock>
							<Slot size="A3" />
						</FlexBlock>
						<FlexBlock>
							<Slot size="A4" />
						</FlexBlock>
					</Flex>
					<p
						style={{
							background:
								'var(--wp--custom--color-grey-spectrum-light-one)',
							padding: '0.5em 1em',
							marginLeft: '-1em',
							marginRight: '-1em',
							marginTop: '1em',
							marginBottom: '-1px',
						}}
					>
						<strong>Social</strong>
					</p>
					<Flex>
						<FlexBlock>
							<Slot size="facebook" />
						</FlexBlock>
						<FlexBlock>
							<Slot size="twitter" />
						</FlexBlock>
					</Flex>
				</Fragment>
			)}
		</div>
	);
}
