export const specInit = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
  'repeat': {
    'row': ['Horsepower', 'Acceleration', 'Miles_per_Gallon'],
    'column': ['Miles_per_Gallon', 'Acceleration', 'Horsepower']
  },
  'spec': {
    'data': {'url': 'data/cars.json'},
    'mark': 'point',
    'selection': {
      'brush': {
        'type': 'interval',
        'resolve': 'union',
        'on': '[mousedown[event.shiftKey], window:mouseup] > window:mousemove!',
        'translate': '[mousedown[event.shiftKey], window:mouseup] > window:mousemove!',
        'zoom': 'wheel![event.shiftKey]'
      },
      'grid': {
        'type': 'interval',
        'resolve': 'global',
        'bind': 'scales',
        'translate': '[mousedown[!event.shiftKey], window:mouseup] > window:mousemove!',
        'zoom': 'wheel![!event.shiftKey]'
      }
    },
    'encoding': {
      'x': {'field': {'repeat': 'column'}, 'type': 'quantitative'},
      'y': {
        'field': {'repeat': 'row'},
        'type': 'quantitative',
        'axis': {'minExtent': 30}
      },
      'color': {
        'condition': {
          'selection': 'brush',
          'field': 'Origin',
          'type': 'nominal'
        },
        'value': 'grey'
      }
    }
  }
};

export const specOverview = {
  '$schema': 'https://vega.github.io/schema/vega-lite/v4.json',
  'data': {
    'values': [],
    'format': {'parse': {'date': 'date'}}
  },
  'transform': [{'calculate': 'datum.date', 'as': 'time'}],
  'repeat': {'column': ['age', 'gender']},
  'spec': {
    'layer': [{
      'selection': {
        'brush': {'type': 'interval', 'encodings': ['x']}
      },
      'mark': 'bar',
      'encoding': {
        'x': {
          'field': {'repeat': 'column'},
          'bin': {'maxbins': 10},
          'type': 'quantitative'
        },
        'y': {'aggregate': 'count', 'type': 'quantitative'},
        'color': {'value': '#ddd'}
      }
    }, {
      'transform': [{'filter': {'selection': 'brush'}}],
      'mark': 'bar',
      'encoding': {
        'x': {
          'field': {'repeat': 'column'},
          'bin': {'maxbins': 10},
          'type': 'quantitative'
        },
        'y': {'aggregate': 'count', 'type': 'quantitative'}
      }
    }]
  }
};
