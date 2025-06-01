import { Center } from '@/components/ui/center';
import { FlatList } from '@/components/ui/flat-list';
import {
	Slider,
	SliderFilledTrack,
	SliderTrack,
	SliderThumb,
} from '@/components/ui/slider';
import { Text } from '@/components/ui/text';
import React, { Component } from 'react';
import { Volume, Volume2Icon } from 'lucide-react-native';

import { View } from 'react-native';
import { Audio } from 'expo-av';
import CardPlay from './CardPlay';
import CountDown from 'react-native-countdown-component'; // Fixed version for listener remove: https://github.com/binotby/react-native-countdown-component/blob/patch-1/index.js

export default class Esercizio extends Component {
	constructor(props) {
		super(props);
		this.click1 = this.fetchClick1();
		this.click2 = this.fetchClick2();
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
		currentCicle: 0,
		startCountDown: true,
	};
	async fetchClick1() {
		return (this.click1 = await Audio.Sound.createAsync(
			require('../../assets/sounds/click1.mp3'),
		));
	}
	async fetchClick2() {
		return (this.click2 = await Audio.Sound.createAsync(
			require('../../assets/sounds/click2.mp3'),
		));
	}
	durataEsercizioCompleta() {
		var x = 0;
		var index = 0;
		var c = new Array();
		var num_pallini = this.props?.pallini?.length;
		//console.log(this.props.cicli + '\n')
		while (index < this.props.cicli) {
			//console.log('ciclo ' + index)
			var tmp = [];
			this.props?.pallini?.forEach(element => {
				tmp.push(element.durata[index]);
				if (element.key == num_pallini) index++;
			});
			c.push(tmp);
		}
		this.props?.pallini?.forEach(element => {
			element.durata.forEach(item => {
				x += parseInt(item);
			});
		});
		//console.log(x)
		this.setState({
			durataEsercizio: x,
			cicli: c,
		});
		var durCicl = [];
		const reducer = (previousValue, currentValue) =>
			previousValue + currentValue;
		c.forEach(el => {
			durCicl.push(el.reduce(reducer));
		});
		this.setState({
			durataCiclo: durCicl,
		});
	}
	componentDidMount() {
		this.durataEsercizioCompleta();
	}
	componentWillUnmount() {
		clearInterval(this.timer);
	}
	startStop = () => {
		if (this.state.playing) {
			// Stop the timer
			clearInterval(this.timer);
			this.setState({
				playing: false,
				count: 1,
				counterTot: 0,
				key: 0,
				currentCicle: 0,
				counterDurataCiclo: 0,
			});
		} else {
			// Start a timer with the current BPM
			this.timer = setInterval(
				this.playClick,
				(60 / this.state.bpm) * 1000,
			);
			// console.log('inziio ciclo')
			this.setState(
				{
					playing: true,
					counterTot: 0,
					count: 1,
					currentCicle: 0,
					counterDurataCiclo: 0,
					key: 0,
					startCountDown: true,
					// Play a click "immediately" (after setState finishes)
				},
				this.playClick,
			);
		}
	};
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
		} = this.state;

		// The first beat will have a different sound than the others
		if (counterTot === durataEsercizio) {
			this.startStop();
		}
		if (counterDurataCiclo === durataCiclo[currentCicle]) {
			// console.log(durataCiclo[currentCicle], counterDurataCiclo)
			//console.log('cambio ciclo')
			this.setState(state => ({
				currentCicle: state.currentCicle + 1,
				counterDurataCiclo: 0,
				key: 0,
			}));
		}
		if (count % beatPerMeasure === 1) {
			//console.log('resto ' + count % beatPerMeasure)
			this.click2?.sound?.replayAsync();
			this.setState(state => ({
				beatPerMeasure: cicli[currentCicle][key - 1],
				count: 1,
				key:
					count == 1 ||
					count == cicli[currentCicle][key - 1] ||
					key === this.props.pallini.length
						? 1
						: state.key + 1,
			}));
		} else {
			this.click1.sound?.replayAsync();
			//console.log(currentCicle, key)
			//console.log(currentCicle, cicli[currentCicle][key-1], key)
		}
		// Keep track of which beat we're on
		this.setState(state => ({
			beatPerMeasure: cicli[currentCicle][key - 1],
			count: state.count + 1,
			counterTot: state.counterTot + 1,
			counterDurataCiclo: state.counterDurataCiclo + 1,
		}));
	};
	handleCountDown() {
		var x = this.startCountDown;
		this.setState({
			startCountDown: !x,
		});
	}
	handleBpmChange = bpm => {
		if (this.state.playing) {
			// Stop the old timer and start a new one
			clearInterval(this.timer);
			this.timer = setInterval(this.playClick, (60 / bpm) * 1000);

			// Set the new BPM, and reset the beat counter
			this.setState({
				count: 1,
				counterTot: 0,
				currentCicle: 0,
				counterDurataCiclo: 0,
				key: 0,
				bpm,
			});
		} else {
			// Otherwise just update the BPM
			this.setState({
				bpm,
			});
		}
	};
	render() {
		const { bpm, playing, count, key, startCountDown } = this.state;
		return (
			<>
				<FlatList
					data={this.props.pallini}
					scrollEnabled={false}
					contentContainerStyle={{ padding: 16, width: '100%' }}
					ListFooterComponent={() => (
						<CardPlay
							flex={1}
							onPress={this.startStop}
							title={playing ? 'Stop  ' : 'Play '}
							RightIcon={playing ? Volume : Volume2Icon}
						/>
					)}
					renderItem={({ item, index }) => (
						<Text
							style={
								item.key == key && playing
									? styles.PallinoPlay
									: styles.Pallino
							}
							className="py-0.5"
						>
							{item.key == key && playing ? '' : `o  `}
							{`${item.definizione}`}
							<Text
								style={styles.durataPallino}
								className="text-right text-primary-600"
							>
								{`    [${item.durata} BPM]; `}
							</Text>
						</Text>
					)}
				/>
				<View style={styles.infoTrainer}>
					<View style={styles.controlContainer}>
						<CountDown
							size={30}
							until={10}
							onFinish={playing === true ? null : this.startStop}
							digitStyle={{
								backgroundColor: '#FFF',
								borderWidth: 2,
								borderColor: '#c6e9ff',
							}}
							digitTxtStyle={{ color: '#005DB4' }}
							timeLabelStyle={{
								color: 'red',
								fontWeight: 'bold',
							}}
							separatorStyle={{ color: '#c6e9ff' }}
							timeToShow={['S']}
							running={startCountDown}
							timeLabels={{ s: null }}
							showSeparator
						/>

						<Text className="text-primary-600">{bpm} BPM</Text>
						<Text
							style={styles.countTitle}
							className={` ${
								playing ? 'text-orange-400' : 'text-primary-600'
							} `}
						>
							Count: {count - 1}{' '}
						</Text>

						<Center
							style={{
								width: '100%',
								maxWidth: 320,
								alignSelf: 'center',
								height: 40,
							}}
						>
							<Slider
								defaultValue={80}
								size="sm"
								minValue={40}
								maxValue={180}
								orientation="horizontal"
								isDisabled={false}
								isReversed={false}
								onChange={this.handleBpmChange}
								style={{
									width: '100%',
									maxWidth: 320,
									alignSelf: 'center',
								}}
							>
								<SliderTrack>
									<SliderFilledTrack />
								</SliderTrack>
								<SliderThumb />
							</Slider>
						</Center>
					</View>
				</View>
			</>
		);
	}
}
const styles = {
	bpmTitle: {
		fontSize: 16,
		textAlign: 'center',
		paddingVertical: 4,
	},
	countTitle: {
		fontSize: 24,
		fontWeight: 'bold',
		alignSelf: 'center',
	},
	container: {
		flex: 1,
		justifyContent: 'space-between',
	},
	Pallino: {
		textAlign: 'left',
		fontSize: 24,
		fontWeight: 'bold',
		color: 'black',
	},
	PallinoPlay: {
		fontSize: 34,
		textAlign: 'center',
		fontWeight: 'bold',
		paddingVertical: 20,
		color: 'orange',
	},
	durataPallino: {
		fontSize: 26,
	},
	infoTrainer: {
		justifyContent: 'flex-end',
		borderWidth: 2,
		borderRadius: 16,
		borderColor: '#c6e9ff',
		padding: 16,
	},
	pallinoContainer: {
		height: '60%',
	},
	controlContainer: {
		alignItems: 'center',
		gap: 12,
	},
};
