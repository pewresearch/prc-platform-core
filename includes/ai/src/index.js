/**
 * Content Guidelines block editor sidebar.
 *
 * Lets users check their post against guidelines and view issues inline.
 * Uses AI-powered document analysis via the analyze-document ability.
 *
 * @package PRC\Platform
 */

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { PluginSidebar, PluginSidebarMoreMenuItem } from '@wordpress/editor';
import { store as blockEditorStore } from '@wordpress/block-editor';
import { registerPlugin } from '@wordpress/plugins';
import { Button, PanelBody, Notice } from '@wordpress/components';
import { check as checkIcon } from '@wordpress/icons';

/**
 * Internal dependencies
 */
import { stripBlocks } from './lint';
import { applyAnnotations, clearAnnotations } from './lint/annotations';
import LintResults from './components/lint-results';
import './style.scss';

const PLUGIN_NAME = 'content-guidelines';

function ContentGuidelinesSidebar() {
	const blocks = useSelect(
		(select) => select(blockEditorStore)?.getBlocks?.() ?? [],
		[]
	);

	const [results, setResults] = useState(null);
	const [isChecking, setIsChecking] = useState(false);
	const [error, setError] = useState(null);

	// Clear annotations when sidebar unmounts.
	useEffect(() => {
		return () => clearAnnotations();
	}, []);

	const runCheck = async () => {
		setIsChecking(true);
		setError(null);
		setResults(null);
		clearAnnotations();

		try {
			const { executeAbility } = await import(
				/* webpackIgnore: true */ '@wordpress/abilities'
			);
			const strippedBlocks = stripBlocks(blocks);
			const result = await executeAbility(
				'content-guidelines/analyze-document',
				{ blocks: strippedBlocks }
			);

			if (result?.error && typeof result.error === 'string') {
				setError(result.error);
				return;
			}

			setResults(result);
			applyAnnotations(result?.issues ?? []);
		} catch (err) {
			const message =
				err instanceof Error
					? err.message
					: __('Failed to check guidelines.', 'prc-platform-core');
			setError(message);
		} finally {
			setIsChecking(false);
		}
	};

	const issueCount = results?.issue_count ?? 0;
	const hasIssues = issueCount > 0;

	return (
		<>
			<PluginSidebarMoreMenuItem target={PLUGIN_NAME} icon={checkIcon}>
				{__('Content Guidelines', 'prc-platform-core')}
			</PluginSidebarMoreMenuItem>
			<PluginSidebar
				name={PLUGIN_NAME}
				title={__('Content Guidelines', 'prc-platform-core')}
				icon={checkIcon}
			>
				<PanelBody
					title={__('Check Against Guidelines', 'prc-platform-core')}
					initialOpen={true}
				>
					<p className="prc-ai-sidebar__description">
						{__(
							'AI-powered analysis of your post against site guidelines for vocabulary, tone, readability, and copy rules.',
							'prc-platform-core'
						)}
					</p>

					<Button
						variant="primary"
						onClick={runCheck}
						disabled={!blocks?.length || isChecking}
						isBusy={isChecking}
						style={{ marginBottom: 12 }}
					>
						{isChecking
							? __('Checking…', 'prc-platform-core')
							: __('Check Post', 'prc-platform-core')}
					</Button>

					{error && (
						<Notice status="error" isDismissible={false}>
							{error}
						</Notice>
					)}

					{results && !isChecking && (
						<div className="prc-ai-sidebar__results">
							<p className="prc-ai-sidebar__summary">
								{issueCount === 0
									? __(
											'No issues found.',
											'prc-platform-core'
										)
									: `Found ${issueCount} ${
											issueCount === 1
												? 'issue'
												: 'issues'
										}.`}
							</p>
							<LintResults results={results} blocks={blocks} />

							{hasIssues && (
								<div
									className="prc-ai-sidebar__fix"
									style={{ marginTop: 12 }}
								>
									<Button
										variant="secondary"
										disabled
										title={__(
											'Coming soon. AI-powered fixes will be available in a future update.',
											'prc-platform-core'
										)}
									>
										{__('Fix Issues', 'prc-platform-core')}
									</Button>
								</div>
							)}
						</div>
					)}
				</PanelBody>
			</PluginSidebar>
		</>
	);
}

registerPlugin(PLUGIN_NAME, {
	render: ContentGuidelinesSidebar,
});
