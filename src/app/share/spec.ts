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
    'values': [
      {
          'date': '2001/01/14 21:55',
          'delay': 0,
          'distance': 480,
          'origin': 'SAN',
          'destination': 'SMF'
      },
      {
          'date': '2001/03/26 20:15',
          'delay': -11,
          'distance': 507,
          'origin': 'PHX',
          'destination': 'SLC'
      },
      {
          'date': '2001/03/05 14:55',
          'delay': -3,
          'distance': 714,
          'origin': 'ELP',
          'destination': 'LAX'
      },
      {
          'date': '2001/01/07 12:30',
          'delay': 12,
          'distance': 342,
          'origin': 'SJC',
          'destination': 'SNA'
      },
      {
          'date': '2001/01/18 12:00',
          'delay': 2,
          'distance': 373,
          'origin': 'SMF',
          'destination': 'LAX'
      },
      {
          'date': '2001/01/19 20:14',
          'delay': 47,
          'distance': 189,
          'origin': 'DAL',
          'destination': 'AUS'
      },
      {
          'date': '2001/03/29 14:05',
          'delay': 3,
          'distance': 872,
          'origin': 'AUS',
          'destination': 'PHX'
      },
      {
          'date': '2001/03/08 09:53',
          'delay': -4,
          'distance': 723,
          'origin': 'GEG',
          'destination': 'OAK'
      },
      {
          'date': '2001/01/04 07:20',
          'delay': 4,
          'distance': 318,
          'origin': 'FLL',
          'destination': 'JAX'
      },
      {
          'date': '2001/02/25 11:30',
          'delay': 0,
          'distance': 487,
          'origin': 'ABQ',
          'destination': 'LAS'
      },
      {
          'date': '2001/02/04 20:25',
          'delay': 18,
          'distance': 239,
          'origin': 'HOU',
          'destination': 'DAL'
      },
      {
          'date': '2001/02/05 20:10',
          'delay': -7,
          'distance': 453,
          'origin': 'TUL',
          'destination': 'HOU'
      },
      {
          'date': '2001/03/13 06:45',
          'delay': -10,
          'distance': 605,
          'origin': 'SEA',
          'destination': 'SMF'
      },
      {
          'date': '2001/02/02 15:52',
          'delay': 23,
          'distance': 417,
          'origin': 'SJC',
          'destination': 'SAN'
      },
      {
          'date': '2001/01/22 15:33',
          'delay': 7,
          'distance': 368,
          'origin': 'SLC',
          'destination': 'LAS'
      }],
    'format': {'parse': {'date': 'date'}}
  },
  'transform': [{'calculate': 'hours(datum.date)', 'as': 'time'}],
  'repeat': {'column': ['distance', 'delay']},
  'spec': {
    'layer': [{
      'selection': {
        'brush': {'type': 'interval', 'encodings': ['x']}
      },
      'mark': 'bar',
      'encoding': {
        'x': {
          'field': {'repeat': 'column'},
          'bin': {'maxbins': 20},
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
          'bin': {'maxbins': 20},
          'type': 'quantitative'
        },
        'y': {'aggregate': 'count', 'type': 'quantitative'}
      }
    }]
  }
};
