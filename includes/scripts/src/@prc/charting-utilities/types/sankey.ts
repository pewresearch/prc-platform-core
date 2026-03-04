export type SankeyNodeAlign = 'center' | 'justify' | 'left' | 'right';

export type Sankey = {
	/** Node alignment method */
	nodeAlign: SankeyNodeAlign;
	/** Width of each node rectangle in pixels */
	nodeWidth: number;
	/** Vertical padding between nodes in pixels */
	nodePadding: number;
	/** Opacity for link paths (0-1) */
	linkOpacity: number;
	/** Corner radius for node rectangles */
	nodeRadius: number;
	/** Which FlatData key maps to the source node name (default: 'x') */
	sourceKey: string;
	/** Which FlatData key maps to the target node name (default: 'target') */
	targetKey: string;
	/** Which FlatData key maps to the link value (default: 'value') */
	valueKey: string;
};
