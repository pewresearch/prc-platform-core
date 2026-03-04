/**
 * Block-grouped lint results with click-to-select.
 *
 * Groups issues by block, shows truncated preview, and allows
 * clicking an issue to select the block in the editor.
 *
 * @package PRC\Platform
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useDispatch } from '@wordpress/data';
import { PanelBody } from '@wordpress/components';
import { store as blockEditorStore } from '@wordpress/block-editor';

/**
 * Get block label from block name.
 *
 * @param {string} name Block name.
 * @return {string} Human-readable label.
 */
function getBlockLabel(name) {
	if (!name) return __('Block', 'prc-platform-core');
	const parts = name.split('/');
	return parts[parts.length - 1] || name;
}

/**
 * Truncate text for preview.
 *
 * @param {string} text Text to truncate.
 * @param {number} maxLen Max length.
 * @return {string} Truncated text.
 */
function truncate(text, maxLen = 60) {
	if (!text || typeof text !== 'string') return '';
	const stripped = text.replace(/<[^>]+>/g, '').trim();
	if (stripped.length <= maxLen) return stripped;
	return stripped.slice(0, maxLen).trim() + '…';
}

/**
 * Get block content preview from block.
 *
 * @param {Object} block Block object.
 * @return {string} Plain text preview.
 */
function getBlockPreview(block) {
	if (!block?.attributes?.content) return '';
	const content = block.attributes.content;
	if (typeof content !== 'string') return '';
	return truncate(content, 60);
}

/**
 * Recursively find block by clientId.
 *
 * @param {Object[]} blocks Blocks array.
 * @param {string}   clientId Block client ID.
 * @return {Object|null} Block or null.
 */
function findBlockById(blocks, clientId) {
	if (!Array.isArray(blocks)) return null;
	for (const block of blocks) {
		if (block.clientId === clientId) return block;
		if (block.innerBlocks?.length) {
			const found = findBlockById(block.innerBlocks, clientId);
			if (found) return found;
		}
	}
	return null;
}

/**
 * Lint results component with block grouping.
 *
 * @param {Object}   props           Component props.
 * @param {Object}   props.results   Lint results from lintBlocks.
 * @param {Object[]} props.blocks    Blocks array (for block lookup).
 * @param {Object}   props.onSelectBlock Optional callback when issue clicked.
 * @return {JSX.Element} Lint results panel.
 */
export default function LintResults({ results, blocks = [], onSelectBlock }) {
	const { selectBlock } = useDispatch(blockEditorStore);

	const handleIssueClick = (blockClientId) => {
		if (onSelectBlock) {
			onSelectBlock(blockClientId);
		} else {
			selectBlock(blockClientId);
		}
	};

	if (!results) return null;

	const { issues = [], suggestions = [], stats = {} } = results;
	const hasIssues = issues.length > 0;
	const hasSuggestions = suggestions.length > 0;

	// Group issues by blockClientId
	const issuesByBlock = {};
	for (const issue of issues) {
		const id = issue.blockClientId || 'unknown';
		if (!issuesByBlock[id]) issuesByBlock[id] = [];
		issuesByBlock[id].push(issue);
	}

	const title = hasIssues
		? __('Lint Checks', 'prc-platform-core') +
			` (${issues.length} ${issues.length === 1 ? 'issue' : 'issues'})`
		: __('Lint Checks', 'prc-platform-core');

	return (
		<PanelBody title={title} initialOpen={true}>
			{!hasIssues && !hasSuggestions && (
				<p className="prc-ai-lint__success">
					{__('No issues found.', 'prc-platform-core')}
				</p>
			)}

			{hasIssues && (
				<div className="prc-ai-lint__issues">
					<h4 className="prc-ai-lint__section-title">
						{__('Issues', 'prc-platform-core')}
					</h4>
					{Object.entries(issuesByBlock).map(
						([blockClientId, blockIssues]) => {
							const block = findBlockById(blocks, blockClientId);
							const blockName = block?.name ?? 'core/paragraph';
							const preview = block ? getBlockPreview(block) : '';

							return (
								<div
									key={blockClientId}
									className="prc-ai-lint__block-group"
								>
									<button
										type="button"
										className="prc-ai-lint__block-header"
										onClick={() =>
											handleIssueClick(blockClientId)
										}
									>
										<span className="prc-ai-lint__block-type">
											{getBlockLabel(blockName)}
										</span>
										{preview && (
											<span className="prc-ai-lint__block-preview">
												{preview}
											</span>
										)}
									</button>
									<ul className="prc-ai-lint__list">
										{blockIssues.map((issue, idx) => (
											<li
												key={`${blockClientId}-${idx}`}
												className="prc-ai-lint__item prc-ai-lint__item--issue prc-ai-lint__item--clickable"
												onClick={() =>
													handleIssueClick(
														blockClientId
													)
												}
												onKeyDown={(e) => {
													if (
														e.key === 'Enter' ||
														e.key === ' '
													) {
														e.preventDefault();
														handleIssueClick(
															blockClientId
														);
													}
												}}
												role="button"
												tabIndex={0}
											>
												<span className="prc-ai-lint__icon">
													⚠️
												</span>
												<div className="prc-ai-lint__content">
													<span className="prc-ai-lint__message">
														{issue.message}
													</span>
													{issue.note && (
														<span className="prc-ai-lint__note">
															{issue.note}
														</span>
													)}
												</div>
											</li>
										))}
									</ul>
								</div>
							);
						}
					)}
				</div>
			)}

			{hasSuggestions && (
				<div className="prc-ai-lint__suggestions">
					<h4 className="prc-ai-lint__section-title">
						{__('Suggestions', 'prc-platform-core')}
					</h4>
					<ul className="prc-ai-lint__list">
						{suggestions.map((suggestion, index) => (
							<li
								key={index}
								className="prc-ai-lint__item prc-ai-lint__item--suggestion"
							>
								<span className="prc-ai-lint__icon">💡</span>
								<div className="prc-ai-lint__content">
									<span className="prc-ai-lint__message">
										{suggestion.message}
									</span>
									{suggestion.note && (
										<span className="prc-ai-lint__note">
											{suggestion.note}
										</span>
									)}
								</div>
							</li>
						))}
					</ul>
				</div>
			)}

			{stats && Object.keys(stats).length > 0 && (
				<div className="prc-ai-lint__stats">
					<h4 className="prc-ai-lint__section-title">
						{__('Stats', 'prc-platform-core')}
					</h4>
					<dl className="prc-ai-lint__stats-list">
						{stats.word_count !== undefined && (
							<>
								<dt>{__('Words', 'prc-platform-core')}</dt>
								<dd>{stats.word_count}</dd>
							</>
						)}
						{stats.sentence_count !== undefined && (
							<>
								<dt>{__('Sentences', 'prc-platform-core')}</dt>
								<dd>{stats.sentence_count}</dd>
							</>
						)}
						{stats.avg_words_per_sentence !== undefined && (
							<>
								<dt>
									{__(
										'Avg. words/sentence',
										'prc-platform-core'
									)}
								</dt>
								<dd>{stats.avg_words_per_sentence}</dd>
							</>
						)}
					</dl>
				</div>
			)}
		</PanelBody>
	);
}
