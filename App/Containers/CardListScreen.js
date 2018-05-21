import React from 'react'
import { ScrollView, View } from 'react-native'
import styles from './Styles/CardListScreenStyles'

import { ListItem } from 'react-native-material-ui/src'
import BottomNavigation from '../Components/BottomNavigation'

import TestData from '../../Tests/Data/TestData'

// stub data
// loyaltyCard = {
//   UserId: 1,
//   BusinessId: 1,
//   BusinessName: 'Fire Roasted Coffee',
//   CreatedDate: new Date(),
//   LoyaltyPoint: 3,
//   ClaimCount: 0
// }

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
    // firebase things?
  }

  createCardList = () => {
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
          // {this.createCardList()}
        </ScrollView>

        <BottomNavigation active='CardListScreen' navigation={this.props.navigation} />
      </View>
    )
  }
}
