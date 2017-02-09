import { AppRegistry, Text} from 'react-native';

import MilkcrateNavigator from './MilkcrateNavigator';

Text.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent('Milkcrate', () => MilkcrateNavigator);