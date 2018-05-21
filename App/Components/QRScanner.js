import React from 'react'
import { Text } from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'

// Styles
import styles from './Styles/QRScannerStyles'

export default class QRScanner extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      title: props.title || 'Scan QR code'
    }
  }

  reactivate = () => {
    this.scanner.reactivate()
  }

  render () {
    return (
      <QRCodeScanner
        ref={(node) => { this.scanner = node }}
        onRead={this.props.onSuccess.bind(this)}
        topContent={
          <Text style={styles.centerText}>
            {this.state.title}
          </Text>
        }
      />
    )
  }
}
