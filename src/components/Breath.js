import React, { useEffect, useState, useRef, use } from 'react';
import {
	Text,
	Slider,
	FlatList,
	Center,
	SliderFilledTrack,
	SliderTrack,
	SliderThumb,
	Heading,
} from '@gluestack-ui/themed';
import { Volume, Volume2Icon } from 'lucide-react-native';
import { View } from 'react-native';
import CardPlay from './CardPlay';
import CountDown from 'react-native-countdown-component'; // Fixed version for listener remove
import useStore from '../store';

const BreathingSession = ({ exercise }) => {
	const { total_duration, cycles, description } = exercise;

	const [bpm, setBpm] = useState(100);
	const [playing, setPlaying] = useState(false);
	const [count, setCount] = useState(0);
	const [activeCycle, setActiveCycle] = useState(0);
	const [currentBullet, setCurrentBullet] = useState(0);

	const { bullets } = cycles[activeCycle];

	useEffect(() => {}, [activeCycle]);

	const {
		sounds: { click1, click2 },
	} = useStore();

	// Timer reference
	const timer = useRef(null);

	// Effect for mounting/unmounting
	useEffect(() => {
		return () => {
			// Cleanup on unmount
			if (timer.current) clearInterval(timer.current);
		};
	}, []);

	const playClick = () => {
		setCount(prev => {
			const newCount = prev + 1;
			setCurrentBullet(currentBullet => {
				const bullet = bullets[currentBullet];
				console.log('🚀 ~ bullet:', bullet);
				if (newCount % bullet.duration === 0) {
					click1?.replayAsync();
					return currentBullet + 1;
				} else {
					click2?.replayAsync();
				}
				return currentBullet;
			});
			return newCount;
		});
	};

	// Play/stop functionality
	const startStop = () => {
		if (playing) {
			clearInterval(timer.current);
			setPlaying(false);
			setCount(0);
			setActiveCycle(0);
			setCurrentBullet(0);
		} else {
			timer.current = setInterval(() => playClick(), (60 / bpm) * 1000);
			setPlaying(true);
		}
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

	useEffect(() => {
		if (currentBullet === bullets.length) {
			setCurrentBullet(0);
			setActiveCycle(prev => prev + 1);
		}
		if (activeCycle === cycles.length) {
			startStop();
		}
	}, [currentBullet, activeCycle]);

	const renderItem = ({ item, index }) => {
		const isCurrent = index === currentBullet;
		return (
			<Text
				bold={isCurrent}
				size="xl"
			>{`\u29BF ${item.definition}`}</Text>
		);
	};

	return (
		<>
			<FlatList
				data={bullets}
				scrollEnabled={false}
				ListHeaderComponent={
					<Heading alignSelf="center">{description}</Heading>
				}
				contentContainerStyle={{ padding: 16 }}
				ListFooterComponent={() => (
					<CardPlay
						flex={1}
						onPress={startStop}
						title={playing ? 'Stop  ' : 'Play '}
						RightIcon={playing ? Volume : Volume2Icon}
					/>
				)}
				renderItem={renderItem}
			/>
			<View style={styles.infoTrainer}>
				<View style={styles.controlContainer}>
					<CountDown
						size={30}
						until={2}
						// onFinish={playing ? null : startStop}
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
						Count: {count}{' '}
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
