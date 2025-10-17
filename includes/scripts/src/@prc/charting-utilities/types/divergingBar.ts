export type DivergingBar = {
  positiveCategories: string[];
  negativeCategories: string[];
  netPositiveCategory: string;
  netNegativeCategory: string;
  percentOfInnerWidth: number;
  neutralBar: {
    active: boolean;
    offsetX: number;
    separator: boolean;
    separatorOffsetX: number;
    category: string;
  };
};
