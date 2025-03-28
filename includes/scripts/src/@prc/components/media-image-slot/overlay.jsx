/* eslint-disable max-lines-per-function */

/**
 * External Dependencies
 */
import styled from '@emotion/styled';

/**
 * WordPress Dependencies
 */
import { ResponsiveWrapper, Spinner, Icon } from '@wordpress/components';

export default function Overlay({
	onClickHandler,
	width,
	height,
	children,
	label,
	icon = false,
	isActive = false,
	spinner = false,
}) {
	const NoStyleButton = styled.button`
		appearance: none;
		padding: 0;
		border: none;
		cursor: pointer;
		display: block;
		width: 100%;
	`;

	const OverlayWrapper = styled.div`
		position: relative;
		overflow: hidden;
		width: 100%;
		height: 100%;
		max-width: ${(props) => props.aspectWidth}px;
		max-height: ${(props) => props.aspectHeight}px;
		&:hover > div {
			visibility: visible;
		}
	`;

	const OverlayChildren = styled.div`
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(255, 255, 255, 0.85);
		visibility: ${(props) => (props.isActive ? 'visible' : 'hidden')};
		text-align: center;
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		gap: 10px;
		transition: visbility 0.3s ease;
	`;

	return (
		<NoStyleButton onClick={onClickHandler} type="button">
			<ResponsiveWrapper
				naturalWidth={width}
				naturalHeight={height}
				isInline
			>
				<OverlayWrapper
					{...{
						aspectWidth: width,
						aspectHeight: height,
					}}
				>
					{children}
					<OverlayChildren
						{...{
							aspectWidth: width,
							aspectHeight: height,
							isActive,
						}}
					>
						{!spinner && icon && (
							<div>
								<Icon icon={icon} />
							</div>
						)}
						{spinner && <Spinner />}
						<span>{label}</span>
					</OverlayChildren>
				</OverlayWrapper>
			</ResponsiveWrapper>
		</NoStyleButton>
	);
}
