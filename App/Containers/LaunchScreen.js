import React from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-material-ui'

// Styles
import styles from './Styles/LaunchScreenStyles'

export default class LaunchScreen extends React.Component {
  render () {
    return (
      <View style={styles.container}>
        <Button raised primary text='Quick Scan' />
        <Button raised primary text='My cards' onPress={() => { this.props.navigation.navigate('CardListScreen') }} />
      </View>
    )
  }
}
