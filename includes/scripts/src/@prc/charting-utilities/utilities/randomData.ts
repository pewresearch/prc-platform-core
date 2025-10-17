export const randomDataPointsCountries = (
  num: number,
  step: number,
  max: number,
) => {
  var country_list = [
    'Afghanistan',
    'Albania',
    'Algeria',
    'Andorra',
    'Angola',
    'Anguilla',
    'Antigua &amp; Barbuda',
    'Argentina',
    'Armenia',
    'Aruba',
    'Australia',
    'Austria',
    'Azerbaijan',
    'Bahamas',
    'Bahrain',
    'Bangladesh',
    'Barbados',
    'Belarus',
    'Belgium',
    'Belize',
    'Benin',
    'Bermuda',
    'Bhutan',
    'Bolivia',
    'Bosnia &amp; Herzegovina',
    'Botswana',
    'Brazil',
    'British Virgin Islands',
    'Brunei',
    'Bulgaria',
    'Burkina Faso',
    'Burundi',
    'Cambodia',
    'Cameroon',
    'Cape Verde',
    'Cayman Islands',
    'Chad',
    'Chile',
    'China',
    'Colombia',
    'Congo',
    'Cook Islands',
    'Costa Rica',
    'Cote D Ivoire',
    'Croatia',
    'Cruise Ship',
    'Cuba',
    'Cyprus',
    'Czech Republic',
    'Denmark',
    'Djibouti',
    'Dominica',
    'Dominican Republic',
    'Ecuador',
    'Egypt',
    'El Salvador',
    'Equatorial Guinea',
    'Estonia',
    'Ethiopia',
    'Falkland Islands',
    'Faroe Islands',
    'Fiji',
    'Finland',
    'France',
    'French Polynesia',
    'French West Indies',
    'Gabon',
    'Gambia',
    'Georgia',
    'Germany',
    'Ghana',
    'Gibraltar',
    'Greece',
    'Greenland',
    'Grenada',
    'Guam',
    'Guatemala',
    'Guernsey',
    'Guinea',
    'Guinea Bissau',
    'Guyana',
    'Haiti',
    'Honduras',
    'Hong Kong',
    'Hungary',
    'Iceland',
    'India',
    'Indonesia',
    'Iran',
    'Iraq',
    'Ireland',
    'Isle of Man',
    'Israel',
    'Italy',
    'Jamaica',
    'Japan',
    'Jersey',
    'Jordan',
    'Kazakhstan',
    'Kenya',
    'Kuwait',
    'Kyrgyz Republic',
    'Laos',
    'Latvia',
    'Lebanon',
    'Lesotho',
    'Liberia',
    'Libya',
    'Liechtenstein',
    'Lithuania',
    'Luxembourg',
    'Macau',
    'Macedonia',
    'Madagascar',
    'Malawi',
    'Malaysia',
    'Maldives',
    'Mali',
    'Malta',
    'Mauritania',
    'Mauritius',
    'Mexico',
    'Moldova',
    'Monaco',
    'Mongolia',
    'Montenegro',
    'Montserrat',
    'Morocco',
    'Mozambique',
    'Namibia',
    'Nepal',
    'Netherlands',
    'Netherlands Antilles',
    'New Caledonia',
    'New Zealand',
    'Nicaragua',
    'Niger',
    'Nigeria',
    'Norway',
    'Oman',
    'Pakistan',
    'Palestine',
    'Panama',
    'Papua New Guinea',
    'Paraguay',
    'Peru',
    'Philippines',
    'Poland',
    'Portugal',
    'Puerto Rico',
    'Qatar',
    'Reunion',
    'Romania',
    'Russia',
    'Rwanda',
    'Saint Pierre &amp; Miquelon',
    'Samoa',
    'San Marino',
    'Satellite',
    'Saudi Arabia',
    'Senegal',
    'Serbia',
    'Seychelles',
    'Sierra Leone',
    'Singapore',
    'Slovakia',
    'Slovenia',
    'South Africa',
    'South Korea',
    'Spain',
    'Sri Lanka',
    'St Kitts &amp; Nevis',
    'St Lucia',
    'St Vincent',
    'St. Lucia',
    'Sudan',
    'Suriname',
    'Swaziland',
    'Sweden',
    'Switzerland',
    'Syria',
    'Taiwan',
    'Tajikistan',
    'Tanzania',
    'Thailand',
    "Timor L'Este",
    'Togo',
    'Tonga',
    'Trinidad &amp; Tobago',
    'Tunisia',
    'Turkey',
    'Turkmenistan',
    'Turks &amp; Caicos',
    'Uganda',
    'Ukraine',
    'United Arab Emirates',
    'United Kingdom',
    'Uruguay',
    'Uzbekistan',
    'Venezuela',
    'Vietnam',
    'Virgin Islands (US)',
    'Yemen',
    'Zambia',
    'Zimbabwe',
  ];
  let arr = [];
  for (let index = 0; index < num; index++) {
    // select a random country from the list and then remove it from the list
    const country =
      country_list[Math.floor(Math.random() * country_list.length)];
    country_list = country_list.filter((c) => c !== country);
    arr.push({
      y: Math.floor(Math.random() * max) + 1,
      y1: Math.floor(Math.random() * max) + 1,
      y2: Math.floor(Math.random() * max) + 1,
      y3: Math.floor(Math.random() * max) + 1,
      x: country,
    });
  }
  return arr;
};

export const randomDataPoints = (
  num: number,
  step: number,
  max: number,
) => {
  let arr = [];
  for (let index = 0; index < num; index++) {
    const y = Math.floor(Math.random() * max);
    step = step * 2;
    arr.push({
      x: Math.floor(Math.random() * max),
      x2: Math.floor(Math.random() * max),
      y,
      y1: Math.floor(Math.random() * max) + 1,
      xLabel: `${y}`,
    });
  }
  return arr;
};

export const randomPosNegPoints = (num: number, max: number) => {
  let arr = [];
  for (let index = 0; index < num; index++) {
    // generate random letter for label
    let r = (Math.random() + 1).toString(36).substring(7);

    const y = Math.floor(Math.random() * max);
    arr.push({
      // if index is even, make x negative
      x: r,
      y: index % 2 === 0 ? -y : y,
      xLabel: `${y}`,
      category: 'A',
    });
  }
  return arr;
};

export const randomDate = (start: Date, end: Date) =>
  new Date(
    start.getTime() +
      Math.random() * (end.getTime() - start.getTime()),
  ).getTime();

export const randomDataTime = (
  num: number,
  step: number,
  max: number,
) => {
  let arr = [];
  for (let index = 0; index < num; index++) {
    arr.push({
      x: randomDate(new Date(2000, 0, 1), new Date(2020, 0, 1)),
      y: Math.floor(Math.random() * max) + 1,
      y1: Math.floor(Math.random() * max) + 1,
      // yLabel: `${y}`,
    });
  }
  return arr;
};

export const randomStacked = (max: number) => {
  return {
    dataA: [
      { x: 'Personal Drones', y: Math.floor(Math.random() * max) },
      { x: 'Smart Thermostat', y: Math.floor(Math.random() * max) },
      { x: 'Television', y: Math.floor(Math.random() * max) },
      { x: 'Smartwatch', y: Math.floor(Math.random() * max) },
      { x: 'Fitness Monitor', y: Math.floor(Math.random() * max) },
      { x: 'Tablet', y: Math.floor(Math.random() * max) },
      { x: 'Camera', y: Math.floor(Math.random() * max) },
      { x: 'Laptop', y: Math.floor(Math.random() * max) },
      { x: 'Phone', y: Math.floor(Math.random() * max) },
    ],
    dataB: [
      { x: 'Personal Drones', y: Math.floor(Math.random() * max) },
      { x: 'Smart Thermostat', y: Math.floor(Math.random() * max) },
      { x: 'Television', y: Math.floor(Math.random() * max) },
      { x: 'Smartwatch', y: Math.floor(Math.random() * max) },
      { x: 'Fitness Monitor', y: Math.floor(Math.random() * max) },
      { x: 'Tablet', y: Math.floor(Math.random() * max) },
      { x: 'Camera', y: Math.floor(Math.random() * max) },
      { x: 'Laptop', y: Math.floor(Math.random() * max) },
      { x: 'Phone', y: Math.floor(Math.random() * max) },
    ],
  };
};
