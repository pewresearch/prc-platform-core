/**
 * Annotation bridge for content guidelines lint issues.
 *
 * Applies and clears annotations in the core/annotations store
 * to highlight issues in the block editor.
 *
 * @package PRC\Platform
 */

import { dispatch } from '@wordpress/data';

const ANNOTATIONS_STORE = 'core/annotations';
const SOURCE = 'content-guidelines';

/**
 * Clear all content-guidelines annotations.
 */
export function clearAnnotations() {
	const store = dispatch(ANNOTATIONS_STORE);
	if (store?.__experimentalRemoveAnnotationsBySource) {
		store.__experimentalRemoveAnnotationsBySource(SOURCE);
	}
}

/**
 * Apply annotations for lint issues.
 *
 * @param {Object[]} issues Issues from lintBlocks (each may have blockClientId, start, end, or blockLevel).
 * @param {Function} dispatchFn Optional dispatch function (defaults to wp.data.dispatch).
 */
export function applyAnnotations(issues, dispatchFn = null) {
	const storeDispatch = dispatchFn ?? dispatch(ANNOTATIONS_STORE);
	if (!storeDispatch) return;

	// Clear previous annotations first
	if (storeDispatch.__experimentalRemoveAnnotationsBySource) {
		storeDispatch.__experimentalRemoveAnnotationsBySource(SOURCE);
	}

	const addAnnotation = storeDispatch.__experimentalAddAnnotation;
	if (!addAnnotation) return;

	for (const issue of issues) {
		if (!issue?.blockClientId) continue;

		if (issue.blockLevel) {
			// Block-level annotation (e.g. readability)
			addAnnotation({
				blockClientId: issue.blockClientId,
				selector: 'block',
				source: SOURCE,
			});
		} else if (
			typeof issue.start === 'number' &&
			typeof issue.end === 'number' &&
			issue.start <= issue.end
		) {
			// Range annotation (vocabulary, copy rules)
			addAnnotation({
				blockClientId: issue.blockClientId,
				richTextIdentifier: issue.richTextIdentifier ?? 'content',
				range: { start: issue.start, end: issue.end },
				selector: 'range',
				source: SOURCE,
			});
		}
	}
}
