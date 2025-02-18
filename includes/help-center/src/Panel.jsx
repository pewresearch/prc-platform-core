/* eslint-disable @wordpress/no-unused-vars-before-return */
// WordPress dependencies
import { useState, useRef, useEffect } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';
import { Button, SearchControl } from '@wordpress/components';
import { parse } from '@wordpress/block-serialization-spec-parser';
import { useFocusReturn, useMergeRefs } from '@wordpress/compose';

// External dependencies
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import classNames from 'classnames';
// emotion styled
import styled from '@emotion/styled';
// Internal dependencies
import { Header, Article } from './components';
import { useOpeningCoordinates } from './hooks/use-opening-coordinates';
import './style.scss';

const Placeholder = styled.div`
	animation: placeholderShimmer 2s linear infinite;
	background-color: white;
	background-image: linear-gradient(
		to right,
		rgba(0, 0, 0, 0.08) 0%,
		rgba(0, 0, 0, 0.15) 15%,
		rgba(0, 0, 0, 0.08) 30%
	);
	background-size: 1200px 100%;
	height: ${(props) => props.height || '20px'};
	width: ${(props) => props.width || '100%'};

	@keyframes placeholderShimmer {
		0% {
			background-position: -1200px 0;
		}

		100% {
			background-position: 1200px 0;
		}
	}
`;

const Panel = ({ isOpen, close }) => {
	const isMobile = false;
	const [searchQuery, setSearchQuery] = useState('');
	const [minimized, setMinimized] = useState(false);
	const [articles, setArticles] = useState([]);
	const [searchResults, setSearchResults] = useState([]);
	const [selectedArticle, setSelectedArticle] = useState(null);
	const [selectedArticleBlocks, setSelectedArticleBlocks] = useState([]);
	const [articlesLoading, setArticlesLoading] = useState(true);
	const [searchResultsLoading, setSearchResultsLoading] = useState(false);
	const openingCoordinates = useOpeningCoordinates(minimized);

	const nodeRef = useRef(null);
	const focusReturnRef = useFocusReturn();
	const containerMergeRefs = useMergeRefs([nodeRef, focusReturnRef]);

	const getArticles = () => {
		setArticlesLoading(true);
		apiFetch({
			path: `prc-api/v3/help-center/get-recent-wiki-articles`,
			method: 'GET',
		})
			.then((data) => {
				console.log(data);
				setArticles(data);
				setArticlesLoading(false);
				// getArticleBlocks(data[0].content);
			})
			.catch((error) => console.log('ERROR:', error));
	};

	const getSearchResults = (query) => {
		setSearchResultsLoading(true);
		apiFetch({
			path: `prc-api/v3/help-center/search-wiki-articles?search=${query}`,
			method: 'GET',
		})
			.then((data) => {
				console.log(data);
				setSearchResults(data);
				setSearchResultsLoading(false);
			})
			.catch((error) => console.log('ERROR:', error));
	};

	const handleHomeClick = () => {
		setSelectedArticle(null);
		setSelectedArticleBlocks([]);
	};

	useEffect(() => {
		if (isOpen && articles.length === 0) {
			getArticles();
		}
	}, [isOpen, articles]);

	// set a timeout for the search query
	useEffect(() => {
		if (searchQuery.length > 0) {
			const timeout = setTimeout(() => {
				getSearchResults(searchQuery);
			}, 500);
			return () => clearTimeout(timeout);
		}
	}, [searchQuery]);

	if (false === isOpen) {
		return false;
	}

	const containerClasses = classNames(
		'help-center__container',
		isMobile ? 'is-mobile' : 'is-desktop',
		{
			'is-minimized': minimized,
		}
	);

	// const getArticleBlocks = (blockString) => {
	// 	const parsedBlocks = parse(blockString);
	// 	setSelectedArticleBlocks(parsedBlocks);
	// };

	return (
		<Draggable
			bounds="parent"
			nodeRef={nodeRef}
			handle=".help-center__header"
		>
			<div
				style={{ ...openingCoordinates }}
				className={containerClasses}
				ref={containerMergeRefs}
			>
				<Header
					minimized={minimized}
					minimize={setMinimized}
					close={close}
					hasSelectedArticle={selectedArticle}
					onClick={handleHomeClick}
				/>
				<div className="help-center__container-content">
					<div className="help-center__search-bar">
						<SearchControl
							__nextHasNoMarginBottom
							hideLabelFromVision={false}
							label="Search the PRC Wiki"
							value={searchQuery}
							onChange={(val) => setSearchQuery(val)}
							placeholder="Search ..."
						/>
					</div>
					{!selectedArticle && searchQuery.length === 0 && (
						<div className="help-center__recent-articles">
							<h3>Recent Articles</h3>
							{articlesLoading && (
								<Placeholder height="212px" width="100%" />
							)}
							{!articlesLoading && articles.length > 0 && (
								<ul>
									{articles.map((article) => {
										return (
											<li key={article.postId}>
												<button
													type="button"
													onClick={() => {
														setSelectedArticle(
															article
														);
													}}
												>
													{article.title}
												</button>
											</li>
										);
									})}
								</ul>
							)}
						</div>
					)}
					{selectedArticle && (
						<>
							<Article article={selectedArticle} />
							<Button
								className="help-center__button help-center__button--secondary"
								onClick={handleHomeClick}
							>
								Home
							</Button>
						</>
					)}
					{/* search results */}
					{searchQuery.length > 0 && (
						<div className="help-center__search-results">
							<h3>Search Results</h3>
							{searchResultsLoading && (
								<Placeholder height="100px" width="100%" />
							)}
							{!searchResultsLoading &&
								searchResults.length > 0 && (
									<ul>
										{searchResults.map((article) => {
											return (
												<li key={article.postId}>
													<button
														type="button"
														onClick={() => {
															setSelectedArticle(
																article
															);
														}}
													>
														{article.title}
													</button>
												</li>
											);
										})}
									</ul>
								)}
							{!searchResultsLoading &&
								searchResults.length === 0 && (
									<p>No results found</p>
								)}
						</div>
					)}
				</div>
			</div>
		</Draggable>
	);
};

export default Panel;
