const headers = ['Year', 'Smartphones', 'Tablets'];
const data = [
  ['2000', '20', '30'],
  ['2010', '40', '50'],
  ['2020', '70', '30'],
];

// TODO: This returns the correct data structure. I need to update the existing
// chart builder view.js file to use this function instead of the current one.

const mapped = data.map((row) => {
  return row.reduce((acc, value, index) => {
    const key = index === 0 ? 'x' : headers[index];
    return {
      ...acc,
      [key]: value,
    };
  }, {});
});

export {};

const arr = [
  {
    y: 2,
    y1: 10,
    y2: 4,
    y3: 5,
    x: 'Guam',
    isHighlighted: true,
  },
  {
    y: 5,
    y1: 4,
    y2: 8,
    y3: 10,
    x: 'Poland',
    isHighlighted: false,
  },
  {
    y: 5,
    y1: 9,
    y2: 9,
    y3: 3,
    x: 'Madagascar',
    isHighlighted: false,
  },
  {
    y: 10,
    y1: 3,
    y2: 5,
    y3: 2,
    x: 'Netherlands',
    isHighlighted: false,
  },
  {
    y: 10,
    y1: 9,
    y2: 8,
    y3: 8,
    x: 'Aruba',
    isHighlighted: false,
  },
];

const negativeKeys = ['y1', 'y2', 'y3'];

const remap = arr.map((row: any) => {
  return Object.keys(row).reduce((acc, key) => {
    const value = row[key];
    const isNegative = negativeKeys.includes(key);
    return {
      ...acc,
      [key]: isNegative ? -value : value,
    };
  }, {});
});

const tempBod = [
  {
    cells: [
      {
        content: '2000',
        tag: 'td',
      },
      {
        content: '20',
        tag: 'td',
      },
      {
        content: '30',
        tag: 'td',
      },
    ],
  },
  {
    cells: [
      {
        content: '2010',
        tag: 'td',
      },
      {
        content: '40',
        tag: 'td',
      },
      {
        content: '50',
        tag: 'td',
      },
    ],
  },
  {
    cells: [
      {
        content: '2020',
        tag: 'td',
      },
      {
        content: '70',
        tag: 'td',
      },
      {
        content: '30',
        tag: 'td',
      },
    ],
  },
];

const Template = [
  {
    x: '2000',
    Smartphones: '20',
    Tablets: '30',
  },
  {
    x: '2010',
    Smartphones: '40',
    Tablets: '50',
  },
  {
    x: '2020',
    Smartphones: '70',
    Tablets: '30',
  },
];

// reformat tempBod as Template
const map = tempBod.map((row) => {
  return row.cells.reduce((acc, cell, index) => {
    const key = index === 0 ? 'x' : headers[index];
    return {
      ...acc,
      [key]: cell.content,
    };
  }, {});
});
