import React from 'react'
import { View, StyleSheet, Text, Button } from 'react-native'
import Esercizio from '../components/Esercizio'
import Metronome from '../components/MetronomeHook'


const TrainingScreen = ({route}) => {

  const {esercizio} = route.params
  //console.log((esercizio.cicli))
  
  return (
    <View style={styles.container}>
      <View style={styles.Esercizio}>
        <Text style={styles.Title}>{esercizio.titolo}</Text>
        <Text style={styles.Descript}>{esercizio.descrizione}</Text>
        <Esercizio pallini={esercizio.lista_pallini}  cicli= {[esercizio.cicli]}></Esercizio>
        {/* <Metronome pallini={esercizio.lista_pallini}  cicli= {[esercizio.cicli]}/> */}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    // alignItems: 'center',
    
  },
  Esercizio: {
    flex: 1
  },
  Title: {
    fontSize: 35,
    textAlign: 'center',
    color: 'red',
    fontWeight:'bold',
    height:'10%'
  },
  Descript: {
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 10,
    fontStyle: 'italic'
  }
})
export default TrainingScreen
