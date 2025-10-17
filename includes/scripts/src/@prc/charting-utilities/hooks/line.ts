type LineProps = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  stroke: string;
  strokeWidth: number;
  strokeOpacity: number;
  strokeDasharray: string;
};

export const getLineProps = (props: LineProps) => {
  return {
    ...props,
    x1: props.x1 || 0,
    y1: props.y1 || 0,
    x2: props.x2 || 0,
    y2: props.y2 || 0,
  };
};
