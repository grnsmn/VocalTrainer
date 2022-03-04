import React, { useState, useEffect } from 'react'
import { Text, View, Button, StyleSheet, FlatList, SafeAreaView } from 'react-native'
//import Slider from '@react-native-community/slider';
import { Audio } from 'expo-av'



// const Metronome = props => {
//   const [sound, setSound] = useState()
//   const [playng, setPlayng] = useState(false)
//   const [timer, setTimer] = useState()
//   const [count, setCount] = useState(1)

//   async function playSound2 () {
//     const { sound } = await Audio.Sound.createAsync(
//       require('../screen/sounds/click2.mp3')
//     )
//     setSound(sound)
//     console.log('Playing Sound2')

//     await sound.replayAsync()
//   }

//   async function playSound () {
//     //console.log('Loading Sound')
//     const { sound } = await Audio.Sound.createAsync(
//       require('../screen/sounds/click1.mp3')
//     )
//     setSound(sound)
//     console.log('Playing Sound')
//     await sound.replayAsync()
//   }

//   const run = () => {
//     if (counterTot == durataEsercizio) {
//       setPlayng(false)
//     }
//     if (count % beatPerMeasure == 1) {
//       playSound2()
//      // console.log('click2')
//     }
//     else{
//       playSound()
//       //console.log('click1')
//     }
//   }

//   useEffect(() => {
//     if (count % beatPerMeasure == 1) {
//       setCount(1)
//     }
//     console.log(count)

//   }, [count])

//   useEffect(() => {
//     return sound
//       ? () => {
//         //console.log('Unloading Sound')
//           sound.unloadAsync()
//         }
//       : undefined
//   }, [sound])

//     //console.log(durataEsercizio, durataEsercizio, durataCiclo)

//   useEffect(() => {
//     if (playng === true) {
//       setTimer(
//         setTimeout(function play () {
//           try {
//             setCount(previousValue => previousValue+1)
//             run()
//             setSound(
//               sound
//                 ? () => {
//                     //console.log('Unloading Sound')
//                     sound.unloadAsync()
//                   }
//                 : undefined
//             )
//             setTimer(setTimeout(play, (60 / 100) * 1000))
//           } catch (error) {
//             console.log(error)
//           }
//         }, (60 / 100) * 1000)
//       )
//     } else {
//       clearInterval(timer)
//     }
//     //console.log('stop')
//   }, [playng])

//   return (
//     <View style={styles.container}>
//       <FlatList
//         data={props.pallini}
//         renderItem={({ item }) => (
//           <View>
//             <Text
//             // style={item.key == key ? styles.PallinoPlay : styles.Pallino}
//             >
//               o-{item.definizione}
//               <Text style={styles.durataPallino}> {item.durata + ', '}</Text>
//             </Text>
//           </View>
//         )}
//       ></FlatList>
//       <Button title='Play Sound' onPress={() => setPlayng(!playng)} />
//     </View>
//   )
// }
const Metronome = props => {
  const [playng, setPlayng] = useState(false)
  const [sound, setSound] = useState()
  const [counter, setCounter] = useState(0)
  const [beatPerMeasure, setBeatPerMeasure] = useState(4)
  const [timer, setTimer] = useState()
  const [durataEsercizio, setDurataEsercizio] = useState()
  const [durataCiclo, setDurataCiclo] = useState([])
  const [cicli, setCicli] = useState([[]])
  const [currentCicle, setCurrentCicle] = useState(0)
  const [counterDurataCiclo, setCounterDurataCiclo] = useState(0)
  const [counterTot, setCounterTot] = useState(0)
  const [key, setKey] = useState(0)

  ///////////////////////////////FirstMountedSection/////////////////////////////////
  useEffect(async () => {
    var x = 0
    var index = 0
    var c = new Array()
    var num_pallini = props.pallini.length
    //console.log(props.cicli + '\n')
    while (index < props.cicli) {
      //console.log('ciclo ' + index)
      var tmp = []
      props.pallini.forEach(element => {
        tmp.push(element.durata[index])
        if (element.key == num_pallini) index++
      })
      c.push(tmp)
    }
    setBeatPerMeasure(c[0][0])
    props.pallini.forEach(element => {
      element.durata.forEach(item => {
        x += parseInt(item)
      })
    })
    //console.log(x)
    setDurataEsercizio(x)
    setCicli(c)

    var durCicl = []
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue

    c.forEach(el => {
      durCicl.push(el.reduce(reducer))
    })

    setDurataCiclo(durCicl)
  }, [])

  ///////////////////////////////////HandleAudioSection/////////////////////////
  async function playSound () {
    // console.log('Loading Sound')
    const { sound } = await Audio.Sound.createAsync(
      require('../screen/sounds/click2.mp3')
    )
    setSound(sound)

    // console.log('Playing Sound')
    await sound.playAsync()
  }

  async function playSound2 () {
    // console.log('Loading Sound')
    const { sound } = await Audio.Sound.createAsync(
      require('../screen/sounds/click1.mp3')
    )
    setSound(sound)

    // console.log('Playing Sound')
    await sound.playAsync()
  }

  useEffect(() => {
    return sound
      ? () => {
          // console.log('Unloading Sound')
          sound.unloadAsync()
        }
      : undefined
  }, [sound])

  ////////////////////////////////////LogicPlaySection////////////////////
  useEffect(() => {
    //console.log(cicli[currentCicle][0])
  }, [cicli])

  useEffect(() => {
    console.log('cambio bpm ')
  }, [beatPerMeasure])

  useEffect(() => {
    console.log('\n', 'currentCicle ', currentCicle, 'key ', key, 'bpm ',cicli[currentCicle][key])
    setBeatPerMeasure(cicli[currentCicle][key])

  }, [currentCicle, key])

  const startStop = () => {
    setPlayng(!playng)
  }
  const increaseCounter = () => {
    setCounterTot(currentCount => currentCount + 1)
    setCounter(currentCount => currentCount + 1)
    setCounterDurataCiclo(currentCount => currentCount + 1)
  }

  useEffect(() => {
    //console.log('bpm ', beatPerMeasure)
    //console.log(counter, counterTot, beatPerMeasure)
    if (counter % beatPerMeasure == 0) {
    }
    if (counterDurataCiclo == durataCiclo[currentCicle]) {
      setCurrentCicle(currentCount => currentCount + 1)
      setCounterDurataCiclo(0)
      setKey(0)
    }
    if (counter == 0) {
      //console.log('Pronto')
    } else if (counter % beatPerMeasure == 1) {

  
      if (
        counter == 1 ||
        counter == cicli[currentCicle][key] ||
        key === props.pallini.length
      ) {
        if (counterTot == 1) {
          console.log('primo pallino')
          setKey(currentValue=> currentValue)
        }
      }
       else {
          console.log('incremento chiave')
          setKey(currentCount => currentCount + 1)
      } 
      // console.log(counter, counterTot, durataEsercizio + ' sound1')
      playSound()
    } else {
      //console.log(counter, counterTot, durataEsercizio + ' sound2')
      playSound2()
    }
  }, [counter, beatPerMeasure])

  useEffect(() => {
    if (counterTot == durataEsercizio) {
      setPlayng(false)
    }
  }, [counterTot])

  ///////////////////////////////////////OnStart&StopSection//////////////////////////
  const stop = () => {
    clearInterval(timer)
    setCounter(0)
    setCounterTot(0)
    setCurrentCicle(0)
    setKey(0)
    setCounterDurataCiclo(0)
  }
  const start = () => {
    setTimer(
      setTimeout(function play () {
        try {
          increaseCounter()
          setTimer(setTimeout(play, (60 / 100) * 1000))
        } catch (error) {
          console.log(error)
        }
      }, (60 / 100) * 1000)
    )
  }

  useEffect(() => {
    if (playng === false) {
      stop()
    } else {
      setBeatPerMeasure(cicli[currentCicle][key])
      setCounter(0)
      setKey(0)
      start()
    }
  }, [playng])

  return (
    <View style={styles.container}>
      <Button title='Play Sound' onPress={startStop} />

      
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
