import React from 'react'
import { View, Alert, AppState } from 'react-native'
import BottomNavigation from '../Components/BottomNavigation'
import QRCodeScanner from '../Components/QRScanner'

// import TestData from '../../Tests/Data/TestData'
import DbRoutines from '../Components/DatabaseRoutines'

// Styles
import styles from './Styles/QuickScanScreenStyles'

export default class QuickScanScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      active: 'QuickScanScreen'
    }
    this.qrComp = React.createRef()
  }

  componentDidMount = () => {
    console.log('registering AppState event listener')
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  // bug? this does not get called ever.
  componentWillUnmount = () => {
    console.log('removing AppState event listener')
    AppState.removeEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState.match('inactive')) {
      console.log('App state is inactive, move to cardlistscreen')
      console.log('Removing listeners')
      AppState.removeEventListener('change', this.handleAppStateChange)
      this.props.navigation.navigate('CardListScreen')
    }
  }

  onSuccess = (e) => {
    console.log('scanned data', e)
    // Stub data
    // { "businessId": "2", "stampPin": "0101" }
    let {businessId, stampPin} = JSON.parse(e.data)
    // let scannedId = e.data.businessId
    // let scannedPin = e.data.stampPin
    let card = DbRoutines.findCardByBusinessId(businessId)
    let title, msg
    console.log('Card found?', card)

    // if exists, navigate to cardlist with card Data
    if (card) {
      title = `Quick Stamp`
    } else {
      // TODO: create new card object
      // stub
      card = {
        UserId: 124,
        BusinessId: businessId, // new
        BusinessName: 'Some new store',
        BusinessAddress: '100 Main Street\nN6H 5W3\nLondon, Ontario',
        CreatedDate: new Date(),
        LoyaltyPoint: 0,
        ClaimPoint: 5,
        ClaimCount: 1,
        stampPin: '0101'
      }
      title = 'New Card!'
      msg = `Added ${card.BusinessName} to your list`
    }
    if (stampPin === card.stampPin) {
      msg = `Stamped ${card.BusinessName}`
      card.LoyaltyPoint++
      // TODO: add/update to DB
      // DbRoutines.addNewCard(card)

      this.props.navigation.navigate('CardScreen', card)
    } else {
      msg = `Stamp failed for ${card.BusinessName}. Contact the developer`
    }

    Alert.alert(
      title,
      msg,
      [
        {text: 'OK', onPress: () => console.log(title, msg)}
      ],
      { cancelable: false }
    )

    setTimeout(() => {
      this.qrComp.current.reactivate()
    }, 2000)
  }

  render () {
    return (
      <View style={styles.container}>
        <QRCodeScanner ref={this.qrComp} onSuccess={this.onSuccess} title={'Quick Card Scan'} />
        <BottomNavigation active='QuickScanScreen' navigation={this.props.navigation} />
      </View>
    )
  }
}
