import { StackNavigator } from 'react-navigation'
import LaunchScreen from '../Containers/LaunchScreen'
import CardListScreen from '../Containers/CardListScreen'
import CardScreen from '../Containers/CardScreen'
import QuickScanScreen from '../Containers/QuickScanScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
const PrimaryNav = StackNavigator({
  LaunchScreen: { screen: LaunchScreen },
  CardListScreen: { screen: CardListScreen },
  CardScreen: { screen: CardScreen },
  QuickScanScreen: { screen: QuickScanScreen }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'CardListScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})

export default PrimaryNav
