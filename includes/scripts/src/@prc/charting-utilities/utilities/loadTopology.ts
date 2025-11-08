/**
 * Creates a Suspense-compatible topology loader for a given topology file path.
 * Compatible with React 18.3+. Can use React 19's use() hook in the future.
 *
 * @param importFn - A function that returns a Promise for the topology module import
 * @returns A loader function that works with React Suspense
 *
 * @example
 * ```ts
 * const loadUSATopology = createTopologyLoader(
 *   () => import('../../maps/usa/topology.json')
 * );
 *
 * function MyComponent() {
 *   const topology = loadUSATopology();
 *   // Use topology data...
 * }
 * ```
 */

interface TopologyResource {
	status: 'pending' | 'fulfilled' | 'rejected';
	data?: any;
	error?: Error;
	promise?: Promise<any>;
}

export function createTopologyLoader(importFn: () => Promise<any>) {
	const resource: TopologyResource = {
		status: 'pending',
	};

	return function loadTopology() {
		if (resource.status === 'fulfilled') {
			return resource.data;
		}

		if (resource.status === 'rejected') {
			throw resource.error;
		}

		if (!resource.promise) {
			resource.promise = importFn()
				.then((module) => {
					resource.status = 'fulfilled';
					resource.data = module;
					return module;
				})
				.catch((error) => {
					resource.status = 'rejected';
					resource.error = error;
					throw error;
				});
		}

		// Throw promise to trigger Suspense
		throw resource.promise;
	};
}
