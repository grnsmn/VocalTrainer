import React, { useEffect, useState, useRef } from 'react';
import {
	Text,
	Slider,
	FlatList,
	Center,
	SliderFilledTrack,
	SliderTrack,
	SliderThumb,
} from '@gluestack-ui/themed';
import { Volume, Volume2Icon } from 'lucide-react-native';
import { View } from 'react-native';
import { Audio } from 'expo-av';
import CardPlay from './CardPlay';
import CountDown from 'react-native-countdown-component'; // Fixed version for listener remove

const BreathingSession = ({ pallini, cicli }) => {
	const [bpm, setBpm] = useState(100);
	const [playing, setPlaying] = useState(false);
	const [count, setCount] = useState(1);
	const [counterTot, setCounterTot] = useState(1);
	const [keyIndex, setKeyIndex] = useState(0);
	const [currentCiclo, setCurrentCiclo] = useState(0);
	const [counterDurataCiclo, setCounterDurataCiclo] = useState(0);
	const [durataEsercizio, setDurataEsercizio] = useState(0);
	const [durataCiclo, setDurataCiclo] = useState([]);
	const [cicliState, setCicliState] = useState([]);
	const [startCountDown, setStartCountDown] = useState(true);

	// References for audio clicks
	const click1 = useRef(null);
	const click2 = useRef(null);

	// Timer reference
	const timer = useRef(null);

	// Fetch audio clicks
	const fetchClick1 = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require('../../assets/sounds/click1.mp3'),
		);
		click1.current = sound;
	};

	const fetchClick2 = async () => {
		const { sound } = await Audio.Sound.createAsync(
			require('../../assets/sounds/click2.mp3'),
		);
		click2.current = sound;
	};

	// Calculate esercizio and ciclo durations
	const durataEsercizioCompleta = () => {
		let totalDurata = 0;
		const calculatedCicli = [];
		const numPallini = pallini?.length;

		let index = 0;
		while (index < cicli) {
			const tmp = [];
			pallini?.forEach(element => {
				tmp.push(element.durata[index]);
				if (element.key === numPallini) index++;
			});
			calculatedCicli.push(tmp);
		}

		pallini?.forEach(element => {
			element.durata.forEach(item => {
				totalDurata += parseInt(item.toString(), 10);
			});
		});

		setDurataEsercizio(totalDurata);
		setCicliState(calculatedCicli);

		const cicloDurations = calculatedCicli.map(c =>
			c.reduce((prev, curr) => prev + curr, 0),
		);
		setDurataCiclo(cicloDurations);
	};

	// Effect for mounting/unmounting
	useEffect(() => {
		fetchClick1();
		fetchClick2();
		durataEsercizioCompleta();

		return () => {
			// Cleanup on unmount
			if (timer.current) clearInterval(timer.current);
			click1.current?.unloadAsync();
			click2.current?.unloadAsync();
		};
	}, []);

	// Play/stop functionality
	const startStop = () => {
		if (playing) {
			clearInterval(timer.current);
			setPlaying(false);
			resetCounters();
		} else {
			timer.current = setInterval(() => playClick(), (60 / bpm) * 1000);
			setPlaying(true);
			resetCounters();
			playClick(); // Play the first click immediately
		}
	};

	// Reset state counters
	const resetCounters = () => {
		setCount(1);
		setCounterTot(0);
		setCurrentCiclo(0);
		setCounterDurataCiclo(0);
		setKeyIndex(0);
	};

	// Play click sound
	const playClick = () => {
		if (counterTot === durataEsercizio) {
			startStop();
			return;
		}

		if (counterDurataCiclo === durataCiclo[currentCiclo]) {
			setCurrentCiclo(prev => prev + 1);
			setCounterDurataCiclo(0);
			setKeyIndex(0);
		}

		if (count % cicliState[currentCiclo][keyIndex] === 1) {
			click2.current?.replayAsync();
			setKeyIndex(prev => (prev === pallini.length - 1 ? 0 : prev + 1));
			setCount(1);
		} else {
			click1.current?.replayAsync();
		}

		// Update counters
		setCount(prev => prev + 1);
		setCounterTot(prev => prev + 1);
		setCounterDurataCiclo(prev => prev + 1);
	};

	// Countdown toggle
	const handleCountDown = () => {
		setStartCountDown(prev => !prev);
	};

	// BPM change handler
	const handleBpmChange = newBpm => {
		if (playing) {
			clearInterval(timer.current);
			timer.current = setInterval(
				() => playClick(),
				(60 / newBpm) * 1000,
			);
			resetCounters();
		}
		setBpm(newBpm);
	};

	return (
		<>
			<FlatList
				data={pallini}
				scrollEnabled={false}
				contentContainerStyle={{ padding: 16 }}
				ListFooterComponent={() => (
					<CardPlay
						flex={1}
						onPress={startStop}
						title={playing ? 'Stop  ' : 'Play '}
						RightIcon={playing ? Volume : Volume2Icon}
					/>
				)}
				// renderItem={({ item }) => (
				// 	<Text
				// 		py={'$0.5'}
				// 		style={
				// 			item.key === keyIndex && playing
				// 				? styles.PallinoPlay
				// 				: styles.Pallino
				// 		}
				// 	>
				// 		{item.key === keyIndex && playing ? '' : `o  `}
				// 		{`${item.definizione}`}
				// 		<Text
				// 			textAlign={'right'}
				// 			style={styles.durataPallino}
				// 			color={'$primary600'}
				// 		>
				// 			{`    [${item.durata} BPM]; `}
				// 		</Text>
				// 	</Text>
				// )}
			/>
			<View style={styles.infoTrainer}>
				<View style={styles.controlContainer}>
					<CountDown
						size={30}
						until={10}
						onFinish={playing ? null : startStop}
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
						running={handleCountDown}
						timeLabels={{ s: null }}
						showSeparator
					/>

					<Text color={'$primary600'}>{bpm} BPM</Text>
					<Text
						style={styles.countTitle}
						color={playing ? '$orange400' : '$primary600'}
					>
						Count: {count - 1}{' '}
					</Text>

					<Center flex={1} w={'$80%'} h={40}>
						<Slider
							defaultValue={80}
							size="sm"
							minValue={40}
							maxValue={180}
							orientation="horizontal"
							isDisabled={false}
							isReversed={false}
							onChange={handleBpmChange}
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
};

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
		fontSize: 22,
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

export default BreathingSession;
