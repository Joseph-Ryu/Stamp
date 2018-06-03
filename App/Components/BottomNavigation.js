import React from 'react'
import { BottomNavigation } from 'react-native-material-ui/src'

export default class BotNavigation extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      active: props.active || ''
    }
  }

  handlePress = (screen, data) => {
    if (screen === this.state.active) {
      return
    }
    this.setState({active: screen})
    this.props.navigation.navigate(screen, data)
  }

  render () {
    return (
      <BottomNavigation active={this.state.active} hidden={false} style={{ container: { position: 'absolute', bottom: 0, left: 0, right: 0 } }}>
        <BottomNavigation.Action
          key='QuickScanScreen'
          icon='camera'
          label='Quick Scan'
          onPress={() => this.handlePress('QuickScanScreen')}
        />
        <BottomNavigation.Action
          key='CardListScreen'
          icon='card-membership'
          label='My Cards'
          onPress={() => this.handlePress('CardListScreen')}
        />
        <BottomNavigation.Action
          key='settings'
          icon='settings'
          label='Settings'
          onPress={() => this.setState({ active: 'settings' })}
        />
      </BottomNavigation>
    )
  }
}
