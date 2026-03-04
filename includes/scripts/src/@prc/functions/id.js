/**
 * Generates a short random id (e.g. for DOM or keys).
 * Uses Math.random base-36 for a compact string.
 *
 * @return {string} Id prefixed with underscore.
 */
function randomId() {
	return `_${Math.random().toString(36).substr(2, 9)}`;
}

export { randomId };
