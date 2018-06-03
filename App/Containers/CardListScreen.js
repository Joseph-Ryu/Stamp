import React from 'react'
import { ScrollView, View } from 'react-native'
import styles from './Styles/CardListScreenStyles'

import { ListItem } from 'react-native-material-ui/src'
import BottomNavigation from '../Components/BottomNavigation'
import DbRoutines from '../Components/DatabaseRoutines'
// import TestData from '../../Tests/Data/TestData'
// import firebase from 'react-native-firebase'
import uniqueId from 'react-native-unique-id'

export default class CardListScreen extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      cards: [],
      active: 'CardListScreen',
      userId: ''
    }
  }
  componentDidMount = async () => {
    uniqueId(async (error, id) => {
      if (error) return console.error(error)
      console.log('phone-id', id)
      let cards = await DbRoutines.getUserLoyaltyCardsAsync(id)
      console.log('cards from cardlistscreen', cards)
      this.setState({userId: id, cards})
    })
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
          centerElement={card.businessName}
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
