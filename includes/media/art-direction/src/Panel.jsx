/* eslint-disable no-nested-ternary */
/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useEffect, useState, Fragment } from '@wordpress/element';
import { useDispatch, useSelect } from '@wordpress/data';
import { Button, Flex, FlexBlock } from '@wordpress/components';

/**
 * Internal dependencies
 */
import Image from './Image';

const ResetButton = () => {
	const [confirmation, setConfirmation] = useState(null);
	const [processing, setProcessing] = useState(false);
	const { resetStore } = useDispatch('prc/art');
	useEffect(() => {
		if (true === confirmation) {
			setProcessing(true);
			setTimeout(() => {
				setProcessing(false);
				resetStore();
				setConfirmation(null);
			}, 1300);
		}
	}, [confirmation]);
	return (
		<Button
			isDestructive
			isBusy={processing}
			onClick={() => {
				if (null === confirmation) {
					setConfirmation(false);
				} else if (false === confirmation) {
					setConfirmation(true);
				}
			}}
		>
			{null === confirmation
				? __(`Reset All`)
				: false === confirmation
				? __(`Confirm Reset`)
				: __(`Resetting…`)}
		</Button>
	);
};

const Slot = ({ items, size }) => {
	return (
		<Image
			imageId={
				'object' === typeof items[size] &&
				items[size].hasOwnProperty('id')
					? items[size].id
					: false
			}
			size={size}
		/>
	);
};

const Items = () => {
	const { items, hasPrimaryImage } = useSelect((select) => {
		return {
			items: select('prc/art').getArt(),
			hasPrimaryImage: select('prc/art').hasPrimaryImage(),
		};
	}, []);

	const { editPost } = useDispatch('core/editor');

	const storeData = (itemsFuture) => {
		if (false !== itemsFuture.A1) {
			const save = itemsFuture;
			console.log("storing art direction", save);
			editPost({
				meta: { artDirection: save },
			});
		}
	};

	useEffect(() => {
		storeData(items);
	}, [items]);

	return (
		<Fragment>
			<p>
				<i>
					{hasPrimaryImage
						? `The A1 image slot will set all image slots to the same
                        image. A2 will set A3 and 4 to the same image. Facebook
                        will set Twitter to the same image.`
						: `To get started drag an image file into,` +
						  `or click, the image slot.`}
				</i>
			</p>

			<Slot items={items} size="A1" />
			{hasPrimaryImage && (
				<Fragment>
					<Slot items={items} size="A2" />
					<Flex>
						<FlexBlock>
							<Slot items={items} size="A3" />
						</FlexBlock>
						<FlexBlock>
							<Slot items={items} size="A4" />
						</FlexBlock>
					</Flex>
					<Slot items={items} size="XL" />
					<Flex>
						<FlexBlock>
							<Slot items={items} size="facebook" />
						</FlexBlock>
						<FlexBlock>
							<Slot items={items} size="twitter" />
						</FlexBlock>
					</Flex>
				</Fragment>
			)}
		</Fragment>
	);
};

const ArtDirectionPanel = () => {
	console.log('HELLO ART WORLD');
	return (
		<div id="prc-block-editor-art-direction">
			<Items />
			<ResetButton />
		</div>
	);
};

export default ArtDirectionPanel;
