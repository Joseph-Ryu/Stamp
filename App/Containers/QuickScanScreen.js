import React from 'react'
import { View, Alert, AppState } from 'react-native'
import BottomNavigation from '../Components/BottomNavigation'
import QRCodeScanner from '../Components/QRScanner'

// import TestData from '../../Tests/Data/TestData'
import DbRoutines from '../Components/DatabaseRoutines'

// Styles
import styles from './Styles/QuickScanScreenStyles'
import uniqueId from 'react-native-unique-id'

export default class QuickScanScreen extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      active: 'QuickScanScreen',
      userId: ''
    }
    this.qrComp = React.createRef()
  }

  componentDidMount = async () => {
    uniqueId(async (error, id) => {
      if (error) return console.error(error)
      this.setState({userId: id})
    })
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

  onSuccess = async (e) => {
    // get list of users loyaltycards
    let userCards = await DbRoutines.getUserLoyaltyCardsAsync(this.state.userId)
    console.log('user cards', userCards)
    console.log('scanned data', e)
    // { "businessId": "2", "stampPin": "0101" }
    let {businessId, stampPin} = JSON.parse(e.data)
    let card = userCards.find(c => c.businessId === businessId)
    let title, msg
    console.log('Card found?', card)

    // if exists, navigate to cardlist with card Data
    if (card) {
      title = `Quick Stamp`
    } else {
      let business = await DbRoutines.getBusinessByIdAsync(businessId)
      console.log('Business matched', business)
      card = {
        userId: this.state.userId,
        businessId: business.businessId,
        businessName: business.businessName,
        businessAddress: business.businessAddress,
        createdDate: new Date(),
        loyaltyPoint: 0,
        claimPoint: business.claimPoint,
        claimCount: 0,
        stampPin: business.stampPin
      }
      title = 'New Card!'
      msg = `Added ${card.businessName} to your list`
    }
    if (stampPin === card.stampPin) {
      msg = `Stamped ${card.businessName}`
      card.loyaltyPoint++
      await DbRoutines.insertDataAsync('cards', card)
      this.props.navigation.navigate('CardScreen', card)
    } else {
      title = 'Wrong pin'
      msg = `Stamp failed for ${card.businessName}. Contact the developer`
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
    console.log('id from quickScanScreen', this.state.userId)
    return (
      <View style={styles.container}>
        <QRCodeScanner ref={this.qrComp} onSuccess={this.onSuccess} title={'Quick Card Scan'} />
        <BottomNavigation active='QuickScanScreen' navigation={this.props.navigation} />
      </View>
    )
  }
}
