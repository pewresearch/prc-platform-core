/* eslint-disable max-lines-per-function */
/**
 * External Dependencies
 */
import { useDebounce } from '@prc/hooks';

/**
 * WordPress Dependencies
 */
import { __ } from '@wordpress/i18n';
import { Fragment, useState, useMemo, useEffect } from '@wordpress/element';
import {
	Button,
	Card,
	CardBody,
	CardMedia,
	SearchControl,
	Spinner,
	TabbableContainer,
	KeyboardShortcuts,
	Modal,
	ToolbarButton,
	ToolbarGroup,
} from '@wordpress/components';
import { date as formatDate } from '@wordpress/date';
import { useEntityRecords, useEntityProp } from '@wordpress/core-data';
import apiFetch from '@wordpress/api-fetch';
import { addQueryArgs } from '@wordpress/url';

function SearchRecords({
	searchRecords,
	onSelect,
	imageSize = 'A3',
	disableImage = false,
}) {
	return searchRecords.map((item) => (
		<SearchItem {...{ item, onSelect, imageSize, disableImage }} />
	));
}

function Image({ item, imageSize }) {
	const { art } = item;
	// Check if art has imageSize as a valid key. If so get the rawUrl, height and width. Then return an img tag accordingly.
	if (art && art[imageSize]) {
		const { rawUrl, height, width, caption } = art[imageSize];
		return (
			<CardMedia>
				<img src={rawUrl} height={height} width={width} alt={caption} />
			</CardMedia>
		);
	}
	return null;
}

function SearchItem({
	item,
	onSelect,
	imageSize = 'A3',
	disableImage = false,
}) {
	if (!item) {
		return null;
	}
	// if item has post_title then use that otherwise use title.rendered
	const title = item.post_title ? item.post_title : item.title.rendered;
	// if item has post_date then use that otherwise use date
	const date = item.post_date ? item.post_date : item.date;

	const { label } = item;
	const canonicalUrl = item.canonical_url;

	return (
		// eslint-disable-next-line jsx-a11y/click-events-have-key-events
		<Card
			onClick={() => {
				onSelect(item);
			}}
			size="small"
			style={{
				cursor: 'pointer',
				':hover': {
					'background-color': '#f3f4f5',
				},
			}}
		>
			<CardBody
				style={{
					display: 'flex',
				}}
			>
				{!disableImage && (
					<div
						style={{
							width: '35%',
							maxWidth: '200px',
							paddingRight: '1em',
							paddingTop: '0.5em',
						}}
					>
						<Image {...{ item, imageSize }} />
					</div>
				)}
				<div>
					<div
						style={{
							fontSize: '0.8em',
							color: '#666',
						}}
					>
						{`${label} | ${formatDate('M j, Y', date)}`}
					</div>
					<strong>{title}</strong>
					<div
						style={{
							fontSize: '0.8em',
							fontStyle: 'italic',
							color: '#666',
							lineHeight: '1.5em',
						}}
					>
						{canonicalUrl}
					</div>
				</div>
			</CardBody>
		</Card>
	);
}

export function URLSearchField({
	postId,
	postType = 'post',
	url,
	disableImage = false,
	onSelect = () => {},
	onKeyEnter = () => {},
	onKeyESC = () => {},
	onUpdateURL = () => {},
}) {
	const [isLoading, toggleLoading] = useState(!!url);
	const [searchInput, setSearchInput] = useState(url ?? ''); // If we have a url lets use it
	const searchString = useDebounce(searchInput, 500);
	const searchStringIsUrl = useMemo(() => {
		if (
			undefined !== searchString &&
			searchString.match(/^(http|https):\/\//)
		) {
			return true;
		}
		return false;
	}, [searchString]);
	const [foundObject, setFoundObject] = useState(null);

	const hasSearchString = !!searchString.length;

	const { records: searchRecords, isResolving } = useEntityRecords(
		'postType',
		postType,
		{
			per_page: 10,
			post_parent: 0, // exclude child posts
			search: hasSearchString && !searchStringIsUrl ? searchString : '',
			context: 'view',
		}
	);
	const hasSearchRecords =
		!isLoading && !searchStringIsUrl && searchRecords
			? 0 < searchRecords.length
			: false;
	const hasFoundObject =
		!isLoading && searchStringIsUrl && null !== foundObject;
	const hasNothingFound = !isLoading && !hasSearchRecords && !hasFoundObject;

	// First we get the post id by url then we get the post by id.
	const getPostByUrl = (newUrl) =>
		new Promise((resolve, reject) => {
			apiFetch({
				path: addQueryArgs('/prc-api/v3/utils/postid-by-url', {
					url: newUrl,
				}),
				method: 'GET',
			})
				.then((resp) => {
					const type =
						'post' === resp?.postType ? 'posts' : resp?.postType;
					const postSearchPath = addQueryArgs(
						`/wp/v2/${type}/${resp?.postId}`,
						{
							context: 'view',
						}
					);
					console.log('postSearchPath', postSearchPath);
					apiFetch({
						path: postSearchPath,
						method: 'GET',
					})
						.then((post) => {
							console.log('GOT THE POST', post);
							resolve(post);
						})
						.catch((err) => reject(err));
				})
				.catch((err) => reject(err));
		});

	useEffect(() => {
		if (searchStringIsUrl) {
			toggleLoading(true);
			getPostByUrl(searchString)
				.then((post) => {
					setFoundObject(post);
					toggleLoading(false);
				})
				.catch((err) => {
					console.error('getPostByUrl error', err);
					setFoundObject(null);
					toggleLoading(false);
				});
		}
	}, [searchString, searchStringIsUrl]);

	useEffect(() => {
		toggleLoading(isResolving);
	}, [isResolving]);

	return (
		<TabbableContainer
			onNavigate={(index, elm) => console.log('onNavigate:', elm)}
		>
			<KeyboardShortcuts
				shortcuts={{
					esc: () => {
						if ('function' === typeof onKeyESC) {
							onKeyESC();
						}
					},
					// enter: () => {
					// 	if (searchStringIsUrl && hasNothingFound) {
					// 		onSelect({
					// 			url: searchString,
					// 		});
					// 	}
					// 	if (searchStringIsUrl && hasFoundObject) {
					// 		const postAttrs = getAttributesFromPost({
					// 			post: foundObject,
					// 			imageSize,
					// 			isRefresh: false,
					// 		});
					// 		onSelect(postAttrs);
					// 	}
					// 	if ('function' === typeof onKeyEnter) {
					// 		onKeyEnter();
					// 	}
					// },
				}}
			>
				<SearchControl
					tabIndex="0"
					value={searchInput}
					onChange={(keyword) => setSearchInput(keyword)}
					placeholder="Climate Change..."
					autoComplete="off"
				/>
			</KeyboardShortcuts>
			{hasSearchString && (
				<Fragment>
					{isLoading && (
						<div
							style={{
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
								color: '#666',
							}}
						>
							<span>Loading... </span>
							<Spinner />
						</div>
					)}

					{hasNothingFound && (
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
								<span>
									{__('Nothing found.', 'prc-block-library')}
								</span>
							</div>
							{searchStringIsUrl && (
								<span>
									<Button
										variant="secondary"
										onClick={() => {
											onUpdateURL(searchString);
										}}
									>
										{__(
											'Change the URL',
											'prc-block-library'
										)}
									</Button>
								</span>
							)}
						</div>
					)}

					{hasFoundObject && (
						<div>
							<SearchItem
								{...{
									item: foundObject,
									onSelect,
									disableImage,
								}}
							/>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									alignItems: 'center',
									textAlign: 'center',
									color: '#666',
									paddingTop: '1em',
								}}
							>
								<span>
									{__(
										`Click the item to replace this block's content`,
										'prc-block-library'
									)}
								</span>
								{undefined !== postId && (
									<Fragment>
										<div
											style={{
												padding: '1em 0',
											}}
										>
											<span>
												{__(
													'~ or ~',
													'prc-block-library'
												)}
											</span>
										</div>
										{searchStringIsUrl && (
											<span>
												<Button
													variant="secondary"
													onClick={() => {
														onUpdateURL(
															searchString
														);
													}}
												>
													{__(
														'Change the URL',
														'prc-block-library'
													)}
												</Button>
											</span>
										)}
									</Fragment>
								)}
							</div>
						</div>
					)}

					{hasSearchRecords && !searchStringIsUrl && (
						<SearchRecords
							{...{ searchRecords, onSelect, disableImage }}
						/>
					)}
				</Fragment>
			)}
		</TabbableContainer>
	);
}

export function URLSearchToolbar({
	postId,
	postType = 'post',
	url,
	disableImage = false,
	onSelect = () => {},
	onUpdateURL = () => {},
}) {
	const [isModalOpen, setIsModalOpen] = useState(false);

	return (
		<ToolbarGroup>
			<ToolbarButton
				aria-expanded={isModalOpen}
				aria-haspopup="true"
				label={__(
					`Search for a ${postType} or paste url here`,
					'prc-block-library'
				)}
				icon="admin-links"
				onClick={() => setIsModalOpen(true)}
				showTooltip
			/>
			{true === isModalOpen && (
				<Modal
					title={__(
						`Search for a ${postType} or paste url here`,
						'prc-block-library'
					)}
					onRequestClose={() => setIsModalOpen(false)}
					shouldCloseOnClickOutside={false}
					shouldCloseOnEsc={false}
				>
					<div
						style={{
							width: '100%',
							minWidth: '340px',
							maxWidth: '640px',
							margin: '0 auto',
						}}
					>
						<URLSearchField
							{...{
								postId,
								postType,
								url,
								disableImage,
								onSelect: (itemAttrs) => {
									onSelect(itemAttrs);
									setIsModalOpen(false);
								},
								onKeyEnter: () => setIsModalOpen(false),
								onKeyESC: () => setIsModalOpen(false),
								onUpdateURL: (newUrl) => {
									onUpdateURL(newUrl);
									setIsModalOpen(false);
								},
							}}
						/>
					</div>
				</Modal>
			)}
		</ToolbarGroup>
	);
}
