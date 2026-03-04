/**
 * WordPress Dependencies
 */
import { registerPlugin } from '@wordpress/plugins';
import { PluginPreviewMenuItem } from '@wordpress/editor';
import { useState, useCallback, useEffect, useRef } from '@wordpress/element';
import { useDispatch } from '@wordpress/data';
import {
	useShortcut,
	store as keyboardShortcutsStore,
} from '@wordpress/keyboard-shortcuts';
import { Icon, shadow } from '@wordpress/icons';

/**
 * Toggles the editor canvas iframe between light and dark color schemes
 * by setting the `color-scheme` CSS property on the iframe's root element.
 * This forces all `light-dark()` values and `prefers-color-scheme` media
 * queries to resolve to their dark-mode variants.
 *
 * @param {boolean} enable - Whether to enable dark mode preview.
 */
const STYLE_ID = 'prc-dark-mode-preview-style';
const SHORTCUT_NAME = 'prc/dark-mode-preview';

function setEditorDarkMode(enable) {
	const scheme = enable ? 'only dark' : 'light dark';

	// Toggle the editor canvas iframe.
	const iframe = document.querySelector('iframe[name="editor-canvas"]');
	if (iframe?.contentDocument?.documentElement) {
		iframe.contentDocument.documentElement.style.colorScheme = scheme;
	}

	// Inject/remove a dynamic <style> for the sidebar color swatch indicators.
	let styleEl = document.getElementById(STYLE_ID);
	if (enable) {
		if (!styleEl) {
			styleEl = document.createElement('style');
			styleEl.id = STYLE_ID;
			document.head.appendChild(styleEl);
		}
		styleEl.textContent =
			'.components-circular-option-picker__option { color-scheme: only dark; }';
	} else if (styleEl) {
		styleEl.remove();
	}
}

function DarkModePreviewToggle() {
	const [isDark, setIsDark] = useState(false);
	const isDarkRef = useRef(isDark);

	// Keep the ref in sync so the shortcut callback always sees current state.
	useEffect(() => {
		isDarkRef.current = isDark;
	}, [isDark]);

	const toggle = useCallback(() => {
		const next = !isDarkRef.current;
		setIsDark(next);
		setEditorDarkMode(next);
	}, []);

	// Register the keyboard shortcut on mount.
	const { registerShortcut } = useDispatch(keyboardShortcutsStore);
	useEffect(() => {
		registerShortcut({
			name: SHORTCUT_NAME,
			category: 'global',
			description: 'Toggle dark mode preview in the editor.',
			keyCombination: {
				modifier: 'ctrlShift',
				character: 'd',
			},
		});
	}, [registerShortcut]);

	// Bind the keyboard shortcut to the toggle action.
	useShortcut(SHORTCUT_NAME, toggle);

	// Guard: PluginPreviewMenuItem may not be available in older WP versions.
	if ('function' !== typeof PluginPreviewMenuItem) {
		return null;
	}

	return (
		<PluginPreviewMenuItem icon={<Icon icon={shadow} />} onClick={toggle}>
			{isDark ? '✓ Dark Mode Preview' : 'Dark Mode Preview'}
		</PluginPreviewMenuItem>
	);
}

registerPlugin('prc-dark-mode-preview', {
	render: DarkModePreviewToggle,
});
