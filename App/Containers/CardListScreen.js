import React from 'react'
import { ScrollView, View } from 'react-native'
import styles from './Styles/CardListScreenStyles'

import { ListItem } from 'react-native-material-ui/src'
import BottomNavigation from '../Components/BottomNavigation'

import TestData from '../../Tests/Data/TestData'
import firebase from 'react-native-firebase'
import uniqueId from 'react-native-unique-id'

export default class CardListScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      // stub list for now
      cards: TestData.cards,
      active: 'CardListScreen'
    }
  }
  componentDidMount () {
    uniqueId((error, id) => {
      if (error) return console.error(error)
      console.log('phone-id', id)
    })

    firebase.firestore().collection('business').doc('2').set({
      joinedDate: new Date(),
      businessName: 'Burrito Boyz',
      businessType: 'Food',
      loyaltyType: 'Stamp',
      claimPoint: 10,
      claimPrice: 6.99
    })

    // {
    //   UserId: 1,
    //   BusinessId: '1',
    //   BusinessName: 'Fire Roasted Coffee',
    //   BusinessAddress: '600 Proudfoot Lane\nN6H 5W3\nLondon, Ontario',
    //   CreatedDate: new Date(),
    //   LoyaltyPoint: 3,
    //   ClaimPoint: 5,
    //   ClaimCount: 4,
    //   stampPin: '0101'
    // },
  }

  createCardList = () => {
    if (this.state.cards.length === 0) {
      return <ListItem centerElement={'You have no cards'} />
    }

    let cardList = this.state.cards.map((card, index) => {
      return (
        <ListItem
          key={index}
          leftElement={`card-membership`}
          divider
          centerElement={card.BusinessName}
          onPress={() => this.navigateToScreen('CardScreen', card)}
        />
      )
    })
    return cardList
  }

  navigateToScreen = (screen, data) => {
    this.props.navigation.navigate(screen, data)
  }

  render () {
    return (
      <View style={styles.container}>
        // Lists
        <ScrollView style={{padding: 20}}>
          {this.createCardList()}
        </ScrollView>

        <BottomNavigation active='CardListScreen' navigation={this.props.navigation} />
      </View>
    )
  }
}
