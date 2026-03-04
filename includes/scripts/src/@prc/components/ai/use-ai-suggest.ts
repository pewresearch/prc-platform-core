/**
 * WordPress Dependencies
 */
import { useState, useCallback, useRef } from '@wordpress/element';

/**
 * Input parameters for ability execution.
 */
type AbilityInput = Record<string, unknown> | undefined;

/**
 * Output from ability execution.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AbilityOutput = Record<string, any>;

/**
 * Options for the useAISuggest hook.
 */
interface UseAISuggestOptions<T = AbilityOutput> {
	/**
	 * The registered ability name (e.g. 'prc-schema-seo/suggest').
	 */
	abilityName: string;

	/**
	 * Optional transform applied to the raw ability output before
	 * storing it in `result`. Use this to extract or reshape data.
	 */
	transformResult?: (raw: AbilityOutput) => T;
}

/**
 * Return value from the useAISuggest hook.
 */
interface UseAISuggestReturn<T = AbilityOutput> {
	/** Whether an ability call is currently in flight. */
	isLoading: boolean;

	/** The most recent error message, or null. */
	error: string | null;

	/** The (optionally transformed) result, or null. */
	result: T | null;

	/** Trigger the ability. Accepts optional input parameters. */
	fetch: (input?: AbilityInput) => Promise<void>;

	/** Reset result and error back to idle state. */
	reset: () => void;

	/** Clear only the error, keeping the result intact. */
	dismissError: () => void;
}

/**
 * Hook that wraps the WordPress Abilities API with a standard
 * loading / error / result state machine.
 *
 * Prevents duplicate in-flight requests and extracts error messages
 * from both thrown exceptions and `result.error` strings returned
 * by server-side abilities.
 *
 * @example
 * ```tsx
 * const { isLoading, error, result, fetch, reset } = useAISuggest({
 *   abilityName: 'prc-schema-seo/suggest',
 *   transformResult: (raw) => raw.suggestions,
 * });
 * ```
 *
 * @param options Configuration for the hook.
 * @return State and actions for the AI suggestion lifecycle.
 */
export default function useAISuggest<T = AbilityOutput>(
	options: UseAISuggestOptions<T>
): UseAISuggestReturn<T> {
	const { abilityName, transformResult } = options;

	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [result, setResult] = useState<T | null>(null);

	// Guard against concurrent fetches.
	const isFetchingRef = useRef(false);

	const fetch = useCallback(
		async (input?: AbilityInput) => {
			if (isFetchingRef.current) {
				return;
			}

			isFetchingRef.current = true;
			setIsLoading(true);
			setError(null);
			setResult(null);

			try {
				// We import the @wordpress/abilities script module dynamically
				// use webpackIgnore to avoid bundling the script module or adding it to the dependency list
				const { executeAbility } = await import(
					/* webpackIgnore: true */ '@wordpress/abilities'
				);
				const raw = await executeAbility(abilityName, input);

				// Handle error strings returned inside the result object.
				if (
					raw?.error &&
					typeof raw.error === 'string' &&
					raw.error.length > 0
				) {
					setError(raw.error);
					return;
				}

				const transformed = transformResult
					? transformResult(raw)
					: (raw as unknown as T);
				setResult(transformed);
			} catch (err) {
				const message =
					err instanceof Error
						? err.message
						: 'An unexpected error occurred.';
				setError(message);
			} finally {
				setIsLoading(false);
				isFetchingRef.current = false;
			}
		},
		[abilityName, transformResult]
	);

	const reset = useCallback(() => {
		setResult(null);
		setError(null);
	}, []);

	const dismissError = useCallback(() => {
		setError(null);
	}, []);

	return {
		isLoading,
		error,
		result,
		fetch,
		reset,
		dismissError,
	};
}
