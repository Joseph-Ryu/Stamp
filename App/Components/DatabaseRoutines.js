import firebase from 'react-native-firebase'

let getUserLoyaltyCardsAsync = async () => {
  console.log('inside getUserLoyaltyCards')
  let query = await firebase.firestore().collection('business').get()
  let cards = []
  query.forEach((doc) => cards.push(doc.data()))
  return cards
}

// For Testing
import TestData from '../../Tests/Data/TestData'
const {cards} = TestData

let findCardByBusinessId = (id) => {
  let card = cards.find(card => card.BusinessId === id)
  console.log('found card', card)

  return card
}

export default {
  getUserLoyaltyCardsAsync,
  findCardByBusinessId
}
