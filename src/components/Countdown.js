import react from 'react'
import CountDown from 'react-native-countdown-component'
import { View } from 'react-native'

const Countdown = () => {
  return
<View>
(  <CountDown
    until={10}
    onFinish={() => alert('finished')}
    onPress={() => alert('hello')}
    size={20}
  ></CountDown>)
</View>
}

export default Countdown
