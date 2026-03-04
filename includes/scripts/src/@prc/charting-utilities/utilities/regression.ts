import {
	regressionLinear,
	regressionExp,
	regressionPoly,
	regressionLog,
	regressionPow,
	regressionQuad,
	regressionLoess,
} from 'd3-regression';
import type { RegressionLine } from '../types/regressionLine';

export type RegressionPoint = { x: number; y: number };

export type RegressionStats = {
	rSquared: number | null;
	equation: string | null;
};

export const REGRESSION_FNS: Record<
	RegressionLine['type'],
	() => ReturnType<typeof regressionLinear>
> = {
	linear: regressionLinear,
	exponential: regressionExp,
	polynomial: regressionPoly,
	logarithmic: regressionLog,
	power: regressionPow,
	quadratic: regressionQuad,
	loess: regressionLoess,
};

/**
 * Builds a configured d3-regression function for the given type, with x/y
 * accessors preset for RegressionPoint objects.
 * @param type
 */
export function getRegressionFn(type: RegressionLine['type']) {
	return (REGRESSION_FNS[type] ?? regressionLinear)()
		.x((d: RegressionPoint) => d.x)
		.y((d: RegressionPoint) => d.y);
}

const fmt = (n: number) => Number(n).toPrecision(4);

/**
 * Runs a regression over the given points and returns the R² value and a
 * human-readable equation string. Returns null for LOESS (no meaningful R²
 * or closed-form equation) or when there are fewer than 2 valid points.
 * @param points
 * @param type
 */
export function computeRegressionStats(
	points: RegressionPoint[],
	type: RegressionLine['type']
): RegressionStats | null {
	if (type === 'loess' || points.length < 2) return null;

	try {
		const result = getRegressionFn(type)(points) as any;
		const { a, b, c, coefficients, rSquared } = result;

		let equation: string | null = null;
		switch (type) {
			case 'linear':
				equation = `y = ${fmt(a)}x + ${fmt(b)}`;
				break;
			case 'exponential':
				equation = `y = ${fmt(a)}e^(${fmt(b)}x)`;
				break;
			case 'logarithmic':
				equation = `y = ${fmt(a)}·ln(x) + ${fmt(b)}`;
				break;
			case 'power':
				equation = `y = ${fmt(a)}x^${fmt(b)}`;
				break;
			case 'quadratic':
				equation = `y = ${fmt(a)}x² + ${fmt(b)}x + ${fmt(c)}`;
				break;
			case 'polynomial':
				if (Array.isArray(coefficients)) {
					const terms = [...coefficients]
						.reverse()
						.map((coef: number, i: number) => {
							const degree = coefficients.length - 1 - i;
							if (degree === 0) return fmt(coef);
							if (degree === 1) return `${fmt(coef)}x`;
							return `${fmt(coef)}x^${degree}`;
						});
					equation = `y = ${terms.join(' + ')}`;
				}
				break;
			default:
				equation = null;
		}

		return { rSquared: rSquared ?? null, equation };
	} catch {
		return null;
	}
}
