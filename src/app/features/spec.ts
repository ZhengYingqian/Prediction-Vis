export const specInit = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
  'width': 100,
  // 'height': 100,
  'data': { 'url': 'data/seattle-weather.csv' },
  'mark': 'tick',
  'encoding': {
    'x': { 'field': 'precipitation', 'type': 'quantitative' }
  }
};

export const specTest = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
  'description': 'A simple bar chart with embedded data.',
  'data': {
    'values': [
      { 'a': 'A', 'b': 28 }, { 'a': 'B', 'b': 55 }, { 'a': 'C', 'b': 43 },
      { 'a': 'D', 'b': 91 }, { 'a': 'E', 'b': 81 }, { 'a': 'F', 'b': 53 },
      { 'a': 'G', 'b': 19 }, { 'a': 'H', 'b': 87 }, { 'a': 'I', 'b': 52 }
    ]
  },
  'mark': 'bar',
  'encoding': {
    'x': { 'field': 'a', 'type': 'ordinal' },
    'y': { 'field': 'b', 'type': 'quantitative' }
  }
};

export const specRepeat = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
  'description': 'Summarized and per year weather information for Seatle and New York.',
  'data': { 'values': [] },
  'repeat': {
    'row': ['Horsepower', 'Acceleration', 'Miles_per_Gallon'],
    'column': ['temp_max', 'precipitation', 'wind']
  },
  'spec': {
    'width': 100,
    'height': 100,
    'layer': [
      {
        'mark': 'line',
        'encoding': {
          'y': {
            'aggregate': 'mean',
            'field': { 'repeat': 'column' },
            'type': 'quantitative'
          },
          'x': {
            'timeUnit': 'date',
            'field': 'date',
            'type': 'ordinal'
          }
        }
      }
    ]
  }
};

export const specY = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
  'description': 'Summarized and per year weather information for Seatle and New York.',
  'data': { 'values': [] },
  'repeat': { 'row': ['temp_max', 'precipitation', 'wind'] },
  'spec': {
    'width': 100,
    'height': 100,
    'layer': [
      {
        'mark': 'line',
        'encoding': {
          'y': {
            'aggregate': 'mean',
            'field': { 'repeat': 'row' },
            'type': 'quantitative'
          },
          'x': {
            'timeUnit': 'month',
            'field': 'date',
            'type': 'ordinal'
          },
          'detail': {
            'timeUnit': 'year',
            'type': 'temporal',
            'field': 'date'
          },
          'color': { 'type': 'nominal', 'field': 'location' },
          'opacity': { 'value': 0.2 }
        }
      },
      {
        'mark': 'line',
        'encoding': {
          'y': {
            'aggregate': 'mean',
            'field': { 'repeat': 'row' },
            'type': 'quantitative'
          },
          'x': {
            'timeUnit': 'month',
            'field': 'date',
            'type': 'ordinal'
          },
          'color': { 'type': 'nominal', 'field': 'location' }
        }
      }
    ]
  }
};

export const rowsSpec = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
  'data': { 'values': [] },
  'repeat': { 'row': ['distance', 'delay', 'time'] },
  'spec': {
    'layer': [{
      'mark': 'bar',
      "width": 100,
      "height": 100,
      'encoding': {
        'x': {
          'field': { 'repeat': 'row' },
          'bin': { 'maxbins': 20 },
          'type': 'quantitative'
        },
        'y': { 'aggregate': 'count', 'type': 'quantitative' },
        // 'color': { 'value': 'blue' }
      }
    }]
  },
  "config": {
    "countTitle": "Count",
    "axisX": { "titleLimit": 100 },
    "axisY": {
      "minExtent": 20
    }
  }
};
