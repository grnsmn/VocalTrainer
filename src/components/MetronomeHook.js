import React, { useState, useEffect } from 'react'
import { Text, View, Button, StyleSheet } from 'react-native'
//import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av'

const Metronome = props => {
  const [click1, setClick1] = useState({})

  async function playSound() {
    const { click } = await Audio.Sound.createAsync(
      require('../screen/sounds/click1.mp3')
      );
    setClick1(click);

    console.log('Playing Sound');
    await click1.playAsync(); 
  }

 

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
        onPress={playSound}
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
