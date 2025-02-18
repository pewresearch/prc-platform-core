import { Icon } from '@prc/icons';

const Header = ({
	minimized,
	minimize,
	close,
	hasSelectedArticle,
	onClick,
}) => {
	return (
		<div className="help-center__header">
			{hasSelectedArticle && (
				<button
					type="button"
					className="help-center__button help-center__button--unstyled"
					onClick={onClick}
				>
					<span>
						<Icon icon="arrow-left" />
					</span>
				</button>
			)}
			<h2>Help Center</h2>
			<div className="help-center__vis-buttons">
				<div className="minimize">
					<button
						type="button"
						onClick={() => {
							console.log('trying to click ehre');
							minimize(!minimized);
						}}
					>
						<span>
							{minimized ? (
								<Icon icon="plus" />
							) : (
								<Icon icon="minus" />
							)}
						</span>
					</button>
				</div>
				<div className="close">
					<button type="button" onClick={close}>
						<span>
							<Icon icon="x" />
						</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default Header;
