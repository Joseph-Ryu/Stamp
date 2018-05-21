// For Testing
import TestData from '../../Tests/Data/TestData'
const {cards} = TestData

let findCardByBusinessId = (id) => {
  let card = cards.find(card => card.BusinessId === id)
  console.log('found card', card)

  return card
}

export default {
  findCardByBusinessId
}
