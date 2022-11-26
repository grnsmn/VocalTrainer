import { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import HomeScreen from './src/screen/HomeScreen'
import EserciziList from './src/Respirazione/Famiglia/EserciziList'
import FamiglieList from './src/Respirazione/FamiglieList'
import TrainingScreen from './src/screen/TrainingScreen'
import VocalizziScreen from './src/screen/VocalizziScreen'
//import Metronome from './src/MetronomeHook'
import * as Font from 'expo-font'


const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
  })
}

const Stack = createNativeStackNavigator()

export default function App () {
  useEffect(() => {
    fetchFonts()
  }, [])
  

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name='Home' component={HomeScreen} />
        <Stack.Screen name='Lista Famiglie' component={FamiglieList} />
        <Stack.Screen name='Lista esercizi' component={EserciziList} />
        <Stack.Screen name='Training' component={TrainingScreen} options={({ route }) => ({ title: route.params.name })} />
        <Stack.Screen name='Vocalizzi' component={VocalizziScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})
