import type { Layout } from '../types/layout';
import type { AnnotationsConfig } from '../types/text';

export const getTextVisible = (
  layout: Layout,
  chartWidth: number,
  annotation: AnnotationsConfig,
) => {
  return annotation.active;
};
