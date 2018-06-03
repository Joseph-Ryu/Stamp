import React from 'react'
import { View, Text, Alert, Image, AppState } from 'react-native'
import styles from './Styles/CardScreenStyles'
import BottomNavigation from '../Components/BottomNavigation'
import QRCodeScanner from '../Components/QRScanner'
import { Button, Card, ListItem, Icon } from 'react-native-material-ui'
import PopupDialog, {SlideAnimation, DialogTitle} from 'react-native-popup-dialog'
const slideAnimation = new SlideAnimation({
  slideFrom: 'bottom'
})

export default class CardScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      card: this.props.navigation.state.params
    }
    this.qrComp = React.createRef()
  }

  componentDidMount () {
    console.log('registering AppState event listener')
    AppState.addEventListener('change', this.handleAppStateChange)
  }

  handleAppStateChange = (nextAppState) => {
    if (nextAppState.match('inactive')) {
      console.log('App state is inactive, move to cardlistscreen')
      console.log('Removing listeners')
      AppState.removeEventListener('change', this.handleAppStateChange)
      this.props.navigation.navigate('CardScreen', this.state.card)
    }
  }

  displayStamps = () => {
    const {claimPoint, loyaltyPoint} = this.state.card
    let stampIcons = []
    for (let i = 0; i < claimPoint; ++i) {
      if (i < loyaltyPoint) {
        stampIcons.push(<Icon key={i} name='star' />)
      } else {
        stampIcons.push(<Icon key={i} name='star-border' />)
      }
    }
    return stampIcons
  }

  stamp = () => {
    this.stampDialog.show()
  }

  claimPrize = () => {
    // let claimedPrize = false
    // confirm User
    Alert.alert(
      'Warning',
      'Are you sure you want to claim your prize now?\nYou need to show the following screen to the staff to claim your prize!',
      [
        {
          text: 'OK',
          onPress: () => {
            // claimedPrize = true
            this.claimPrizeDialog.show()

            let {card} = this.state
            card.loyaltyPoint = 0
            card.claimCount++
            this.setState({card})
            console.log('User claimed free drink')
          }
        },
        {
          text: 'Cancel',
          onPress: () => { console.log('User cancelled getting a drink') }
        }
      ],
      { cancelable: false }
    )
  }

  changeInputPin = (inputPin) => {
    let {pin} = this.state
    const star = '*'
    pin = inputPin.length > 0 ? pin += inputPin[inputPin.length - 1] : pin
    pin = inputPin.length < pin.length ? pin.substring(0, pin.length - 2) : pin
    let maskedPin = pin.replace(pin, star.repeat(pin.length))

    this.setState({pin, maskedPin})
  }

  onQRSuccess = (e) => {
    // { "businessId": "2", "stampPin": "0101" }
    console.log('scanned data', e)
    let {businessId, stampPin} = JSON.parse(e.data)
    let title = ''
    let msg = ''
    if (businessId !== this.state.card.businessId) {
      title = 'Wrong QR code'
      msg = 'This QR code does not match the business'
    } else if (stampPin === this.state.card.stampPin) {
      console.log('Pin match')
      title = 'Nice'
      msg = 'You earned a stamp!'

      let {card} = this.state
      card.loyaltyPoint++
      this.setState({card})
      this.stampDialog.dismiss()
    } else {
      console.log('Wrong pin, scan again')
      title = 'Warning'
      msg = 'This QR code does not match the pin'
    }
    Alert.alert(
      title,
      msg,
      [
        {text: 'OK', onPress: () => console.log('New card added')}
      ],
      { cancelable: false }
    )

    setTimeout(() => {
      this.reactivateQR()
    }, 2000)
  }

  reactivateQR = () => {
    this.qrComp.current.reactivate()
  }

  render () {
    const {card} = this.state
    return (
      <View style={styles.container}>
        <Card>
          <ListItem
            leftElement={`local-drink`}
            centerElement={card.businessName}
            style={{container: {}, primaryText: {alignSelf: 'center', fontSize: 20}, leftElementContainer: {alignItems: 'flex-end'}}}
          />
          <Text style={{left: '34%', fontWeight: '100', fontSize: 12, paddingBottom: 10}}>{card.businessAddress}</Text>
        </Card>
        <Card>
          <ListItem
            centerElement={`Collect ${card.claimPoint} to get a free coffee`}
            style={{container: {}, primaryText: {alignSelf: 'center', fontSize: 18}}}
          />
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            {this.displayStamps()}
          </View>
        </Card>
        {
          card.loyaltyPoint < card.claimPoint &&
          <Button style={{container: {left: '20%', width: 100}}} raised primary text='Stamp' onPress={() => { this.stamp() }} />
        }
        {
          !(card.loyaltyPoint < card.claimPoint) &&
          <Button style={{container: {left: '20%', width: 100}}} raised primary text='Get Free' onPress={() => { this.claimPrize() }} />
        }
        <PopupDialog
          ref={(stampDialog) => { this.stampDialog = stampDialog }}
          dialogAnimation={slideAnimation}
          width={1}
          height={0.8}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <QRCodeScanner ref={this.qrComp} onSuccess={this.onQRSuccess} title={'Scan QR'} />
          </View>
        </PopupDialog>
        <PopupDialog
          ref={(claimPrizeDialog) => { this.claimPrizeDialog = claimPrizeDialog }}
          dialogAnimation={slideAnimation}
          width={0.8}
          height={0.4}
          dialogTitle={<DialogTitle title='FREE COFFEE' />}
        >
          <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{maxHeight: '100%', maxWidth: '100%'}}
              resizeMode='contain'
              source={require('../Images/free-coffee.jpg')}
            />
          </View>
        </PopupDialog>

        <BottomNavigation navigation={this.props.navigation} />
      </View>
    )
  }
}
