import firebase from 'react-native-firebase'

let getUserLoyaltyCardsAsync = async (userId) => {
  let query = await firebase.firestore().collection('cards').where('userId', '==', userId).get()
  let cards = []
  query.forEach((doc) => cards.push(doc.data()))
  console.log('fetched data', cards)
  return cards
}

let getBusinessByIdAsync = async (businessId) => {
  console.log('looking for', businessId)
  // let doc = await firebase.firestore().collection('business').doc(businessId)
  // return doc.data

  let query = await firebase.firestore().collection('business').where('businessId', '==', businessId).get()
  let business = []
  query.forEach((doc) => business.push(doc.data()))
  console.log('fetched data', business)
  return business[0]
}

let insertDataAsync = async (collection, document) => {
  console.log('Adding to db', collection, document)
  await firebase.firestore().collection(collection).doc(`${document.userId}${document.businessId}`).set(document)
}

// //For Testing
// import TestData from '../../Tests/Data/TestData'
// const {cards} = TestData
//
// let findCardByBusinessId = (id) => {
//   let card = cards.find(card => card.BusinessId === id)
//   console.log('found card', card)
//
//   return card
// }

export default {
  getUserLoyaltyCardsAsync,
  getBusinessByIdAsync,
  insertDataAsync
}
