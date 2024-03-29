import React from 'react'
import { Platform } from 'react-native'
import { extendTheme } from 'native-base'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

export default theme = extendTheme({
  dependencies: {
    'linear-gradient': require('expo-linear-gradient').LinearGradient
  },
  components: {
    Button: {
      defaultProps: {
        py: Platform.OS === 'ios' ? wp(2) : wp(3),
        px: Platform.OS === 'ios' ? wp(3) : wp(4.5),
        borderRadius: '40',
        backgroundColor: 'darkgreen',
        // borderColor: 'primary.1',
        _text: {
          color: 'white',
          fontSize: Platform.OS === 'ios' ? wp(5.5) : wp(4),
          textAlign: 'center',
          fontFamily: 'Karla'
        },
      },
    },
    Input: {
      defaultProps: {
        py: Platform.OS === 'ios' ? wp(1.4) : wp(.2),
        px: wp(1),
        borderColor: 'darkgreen',
        _text: {
          // color: 'red',
          fontSize: Platform.OS === 'ios' ? wp(6) : wp(4.5)
        },
      },
    },
    Text: {
      defaultProps: {
        fontSize: Platform.OS === 'ios' ? wp(6) : wp(4.5),
        // lineHeight: wp(5.5),
        fontFamily: 'Mukta',
        // fontFamily: 'Karla',
        // fontFamily: 'SourceSansPro',
        // fontFamily: 'NotoSans',
        // fontFamily: 'Lato',
      }
    },
    ModalHeader: {
      baseStyle: {
        py: wp(3),
        px: wp(2.5)
      }
    },
    ModalCloseButton: {
      baseStyle: {
        py: wp(3),
        px: wp(2.5)
      }
    },
    ModalBody: {
      baseStyle: {
        pt: wp(2.5),
        p: wp(3)
      }
    },
    ModalFooter: {
      baseStyle: {
        p: wp(2),
        borderTopWidth: '1'
      }
    },
  },
  space: {
    '1': 1,
    '1.5': 1.5,
    '2': 2,
    '2.5': 2.5,
    '3': 3,
    '3.5': 3.5,
    '4': 4,
    '4.5': 4.5,
    '5': 5,
    '5.5': 5.5,
    '6': 6,
    '6.5': 6.5,
    '7': 7,
    '7.5': 7.5,
    '8': 8,
    '8.5': 8.5,
    '9': 9,
    '9.5': 9.5,
    '10': 10,
    // '11': 11,
    '12': 12,
    // '13': 13,
    // '14': 14,
    // '15': 15,
    '16': 16,
    // '17': 17,
    // '18': 18,
    // '19': 19,
    '20': 20,
    // '21': 21,
    // '22': 22,
    // '23': 23,
    '24': 24,
    // '25': 25,
    // '26': 26,
    // '27': 27,
    // '28': 28,
    // '29': 29,
    // '30': 30,
    // '31': 31,
    '32': 32,
    // '33': 33,
    // '34': 34,
    // '35': 35,
    // '36': 36,
    // '37': 37,
    // '38': 38,
    // '39': 39,
    '40': 40,
    // '41': 41,
    // '42': 42,
    // '43': 43,
    // '44': 44,
    // '45': 45,
    // '46': 46,
    // '47': 47,
    '48': 48,
    // '49': 49,
    // '50': 50,
    '56': 56,
    '64': 64,
    '72': 72,
    '80': 80,
    '96': 96
  },
  sizes: {
    '1': 1,
    '1.5': 1.5,
    '2': 2,
    '2.5': 2.5,
    '3': 3,
    '3.5': 3.5,
    '4': 4,
    '4.5': 4.5,
    '5': 5,
    '5.5': 5.5,
    '6': 6,
    '6.5': 6.5,
    '7': 7,
    '7.5': 7.5,
    '8': 8,
    '8.5': 8.5,
    '9': 9,
    '9.5': 9.5,
    '10': 10,
    // '11': 11,
    '12': 12,
    // '13': 13,
    // '14': 14,
    // '15': 15,
    '16': 16,
    // '17': 17,
    // '18': 18,
    // '19': 19,
    '20': 20,
    // '21': 21,
    // '22': 22,
    // '23': 23,
    '24': 24,
    // '25': 25,
    // '26': 26,
    // '27': 27,
    // '28': 28,
    // '29': 29,
    // '30': 30,
    // '31': 31,
    '32': 32,
    // '33': 33,
    // '34': 34,
    // '35': 35,
    // '36': 36,
    // '37': 37,
    // '38': 38,
    // '39': 39,
    '40': 40,
    // '41': 41,
    // '42': 42,
    // '43': 43,
    // '44': 44,
    // '45': 45,
    // '46': 46,
    // '47': 47,
    '48': 48,
    // '49': 49,
    // '50': 50,
    '56': 56,
    '64': 64,
    '72': 72,
    '80': 80,
    '96': 96
  },
  colors: {
    primary: {
      1: '#289d15',
      2: '#24b40e',
      3: '#1dbd05',
      4: '#1fdf01',
      5: '#16a800',
      6: '#1f850f',
      7: '#22c55e',

      100: '#723cc8',
      101: '#641cd9',
      102: '#8c59de',

      200: '#bbf7d0',
      300: '#86efac',
      400: '#4ade80',
      500: '#289d15',
      600: '#16a34a',
      700: '#15803d',
      800: '#166534',
      900: '#14532d'
    }
  },
})

// 50: '#16a800',
// 60: '#8c59de',
// 100: '#1dbd05',
// 200: '#1fdf01',
// 300: '#86efac',
// 400: '#4ade80',
// 500: '#22c55e',
// 600: '#16a34a',
// 700: '#289d15',
// 800: '#1f850f',
// 900: '#24b40e'