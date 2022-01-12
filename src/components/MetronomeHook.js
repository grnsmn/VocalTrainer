import React, { useState } from 'react'
import { Text, View, Button, StyleSheet } from 'react-native'
//import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av'

const Metronome = props => {
  const [click1, setClick1] = useState(null)

  return (
    <View style={styles.container}>
      <Text style={styles.bpmTitle}> BPM</Text>
      {/* <Slider
          style={styles.slider}
          maximumValue={180}
          minimumValue={60}
          onValueChange={this.handleBpmChange}
          step={1}
          value={bpm}
        /> */}
      <Button
        style={styles.button}
        //onPress={this.startStop}
        title={'Play'}
        accessibilityLabel='Start and Stop The Metronome'
      />
    </View>
  )
}

const styles = StyleSheet.create({
  bpmTitle: {
    fontSize: 30,
    marginBottom: 50
  },
  container: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  slider: {
    height: 3,
    width: 300
  },
  button: {
    fontSize: 70
  }
})
export default Metronome
