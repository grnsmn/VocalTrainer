import React, { Component } from 'react'
import { Text, View, Button, FlatList } from 'react-native'
import Slider from '@react-native-community/slider'
import { Audio } from 'expo-av'
import CountDown from 'react-native-countdown-component'

export default class Esercizio extends Component {
  constructor (props) {
    super(props)
    this.click1 = this.fetchClick1()
    this.click2 = this.fetchClick2()
  }

  state = {
    bpm: 100,
    playing: false,
    count: 1,
    counterDurataCiclo: 0,
    beatPerMeasure: 4,
    key: 0,
    counterTot: 1,
    durataEsercizio: 0,
    cicli: [],
    durataCiclo: [],
    currentCicle: 0
  }

  async fetchClick1 () {
    return (this.click1 = await Audio.Sound.createAsync(
      require('../screen/sounds/click1.wav')
    ))
  }
  async fetchClick2 () {
    return (this.click2 = await Audio.Sound.createAsync(
      require('../screen/sounds/click2.wav')
    ))
  }

  // async componentWillMount() {
  //   this.click1 = await Audio.Sound.createAsync(require('../screen/sounds/click1.wav'));
  //   this.click2 = await Audio.Sound.createAsync(require('../screen/sounds/click2.wav'));
  //   }

  durataEsercizioCompleta () {
     this.click1 = this.fetchClick1()
     this.click2 = this.fetchClick2()
    var x = 0
    var index = 0
    var c = new Array()
    var num_pallini = this.props.pallini.length
    //console.log(this.props.cicli + '\n')
    while (index < this.props.cicli) {
      //console.log('ciclo ' + index)
      var tmp = []
      this.props.pallini.forEach(element => {
        tmp.push(element.durata[index])
        if (element.key == num_pallini) index++
      })
      c.push(tmp)
    }

    this.props.pallini.forEach(element => {
      element.durata.forEach(item => {
        x += parseInt(item)
      })
    })
    //console.log(x)
    this.setState({
      durataEsercizio: x,
      cicli: c
    })
    var durCicl = []
    const reducer = (previousValue, currentValue) =>
      previousValue + currentValue
      
    c.forEach(el => {
      durCicl.push(el.reduce(reducer))
    })
    
    this.setState({
      durataCiclo: durCicl
    })
  }

  componentDidMount () {
    this.durataEsercizioCompleta()
  }
    
  startStop = () => {
    if (this.state.playing) {
      // Stop the timer
      clearInterval(this.timer)
      this.setState({
        playing: false,
        count: 1,
        counterTot: 0,
        key: 0,
        currentCicle: 0,
        counterDurataCiclo: 0,
      })
    } else {
      // Start a timer with the current BPM
      this.timer = setInterval(this.playClick, (60 / this.state.bpm) * 1000)
      // console.log('inziio ciclo')
      this.setState(
        {
          playing: true,
          counterTot: 0,
          count: 1,
          currentCicle: 0,
          counterDurataCiclo: 0,
          key: 0,
          // Play a click "immediately" (after setState finishes)
        },
        this.playClick
      )
    }
  }

  playClick = () => {
    const {
      count,
      counterTot,
      beatPerMeasure,
      key,
      durataEsercizio,
      durataCiclo,
      counterDurataCiclo,
      currentCicle,
      cicli, 
    } = this.state
    
    // The first beat will have a different sound than the others
    if (counterTot == durataEsercizio) {
      this.startStop()
    }
    if (counterDurataCiclo == durataCiclo[currentCicle]) {
      // console.log(durataCiclo[currentCicle], counterDurataCiclo)
      //console.log('cambio ciclo')
      this.setState(state => ({
        currentCicle: state.currentCicle + 1,
        counterDurataCiclo: 0,
        key: 0
      }))
    }
    if (count % beatPerMeasure == 1) {
      //console.log('resto ' + count % beatPerMeasure)
      this.click2.sound.replayAsync()
      this.setState(state => ({
        beatPerMeasure: cicli[currentCicle][key - 1],
        count: 1,
        key:
          count == 1 || count == cicli[currentCicle][key-1] || key === this.props.pallini.length
            ? 1
            : state.key + 1
      }))
    } else {
      this.click1.sound.replayAsync()
      //console.log(currentCicle, key)
      //console.log(currentCicle, cicli[currentCicle][key-1], key)
    }
    // Keep track of which beat we're on
    this.setState(state => ({
      beatPerMeasure: cicli[currentCicle][key - 1],
      count: state.count + 1,
      counterTot: state.counterTot + 1,
      counterDurataCiclo: state.counterDurataCiclo + 1
    }))
  }

  handleBpmChange = bpm => {
    if (this.state.playing) {
      // Stop the old timer and start a new one
      clearInterval(this.timer)
      this.timer = setInterval(this.playClick, (60 / bpm) * 1000)

      // Set the new BPM, and reset the beat counter
      this.setState({
        count: 1,
        counterTot: 0,
        currentCicle: 0,
        counterDurataCiclo: 0,
        key: 0,
        bpm
      })
    } else {
      // Otherwise just update the BPM
      this.setState({ bpm })
    }
  }

  render () {
    const { bpm, playing, count, key } = this.state

    return (
      <View style={styles.container}>
        <FlatList
          data={this.props.pallini}
          renderItem={({ item }) => (
            <View>
              <Text
                style={item.key == key && playing==true  ? styles.PallinoPlay : styles.Pallino}
              >
                o-{item.definizione}
                <Text style={styles.durataPallino}> {item.durata+', '}</Text>
              </Text>
            </View>
          )}
        ></FlatList>
        <View style={styles.infoTrainer}>
          <Text style={styles.countTitle}>Count: {count - 1} </Text>
          {/* <Text style={styles.countTitle}>CONTATORE: {counterTot - 1} </Text> */}
          <Text style={styles.bpmTitle}>{bpm} BPM</Text>
        </View>
        <CountDown
          size={45}
          until={8}
          onFinish={this.startStop}
          digitStyle={{
            backgroundColor: '#FFF',
            borderWidth: 2,
            borderColor: '#1CC625'
          }}
          digitTxtStyle={{ color: '#1CC625' }}
          timeLabelStyle={{ color: 'red', fontWeight: 'bold' }}
          separatorStyle={{ color: '#1CC625' }}
          timeToShow={['S']}
          running={true}
          timeLabels={{ s: null }}
          showSeparator
        ></CountDown>
        <Slider
          style={styles.slider}
          maximumValue={180}
          minimumValue={60}
          onValueChange={this.handleBpmChange}
          step={1}
          value={bpm}
        />
        <Button
          style={styles.button}
          onPress={this.startStop}
          title={playing ? 'Stop' : 'Play'}
          accessibilityLabel='Start and Stop The Metronome'
        />
      </View>
    )
  }
}

const styles = {
  bpmTitle: {
    fontSize: 20
    //marginBottom: 20
  },
  countTitle: {
    fontSize: 20,
    //marginBottom: 20,
    color: 'blue',
    fontWeight: 'bold'
  },
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center'
  },
  slider: {
    height: '10%',
    justifyContent: 'space-around',
    width: 300
  },
  button: {
    fontSize: 90,
    height: 100,
    marginBottom: 20
  },
  Pallino: {
    flexDirection: 'row',
    textAlign: 'left',
    fontSize: 25,
    fontWeight: 'bold',
    color: 'black'
  },
  PallinoPlay: {
    fontSize: 35,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'orange'
  },
  durataPallino: {},
  infoTrainer: {
    flexDirection: 'row',
    alignItems: 'center'
  }
}
