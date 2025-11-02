import { Center } from '@/components/ui/center';
import { FlatList } from '@/components/ui/flat-list';
import {
	Slider,
	SliderFilledTrack,
	SliderTrack,
	SliderThumb,
} from '@/components/ui/slider';
import { Text } from '@/components/ui/text';
import React, { Component, useEffect, useState } from 'react';
import { Volume, Volume2Icon } from 'lucide-react-native';

import { View } from 'react-native';
import CardPlay from './CardPlay';
import CountDown from 'react-native-countdown-component'; // Fixed version for listener remove: https://github.com/binotby/react-native-countdown-component/blob/patch-1/index.js

import Bullet from './Bullet';
import { Heading } from '@/components/ui/heading';

const BreathingSession = ({ exercise }) => {
	const { cycles, description } = exercise;

	const [bpm, setBpm] = useState(100);
	const [playing, setPlaying] = useState(false);
	const [activeCycle, setActiveCycle] = useState(0);
	const [currentBullet, setCurrentBullet] = useState(0);

	const { bullets } = cycles[activeCycle] || {};
	// Play/stop functionality
	const startStop = () => {
		if (playing) {
			// clearInterval(timer.current);
			setCurrentBullet(0);
			setPlaying(false);
			setActiveCycle(0);
		} else {
			// timer.current = setInterval(() => playClick(), (60 / bpm) * 1000);
			setPlaying(true);
		}
	};

	// Countdown toggle
	const handleCountDown = () => {
		setStartCountDown(prev => !prev);
	};

	// BPM change handler
	const handleBpmChange = newBpm => {
		setBpm(newBpm);
	};

	useEffect(() => {
		if (currentBullet === bullets?.length) {
			setCurrentBullet(0);
			setActiveCycle(prev => prev + 1);
		}
		if (activeCycle === cycles.length) {
			startStop();
		}
	}, [currentBullet, activeCycle]);

	const renderItem = ({ item, index }) => {
		const isActive = playing && index === currentBullet;
		return (
			<Bullet
				key={index}
				item={item}
				isActive={isActive}
				onComplete={() => setCurrentBullet(prev => prev + 1)}
				bpm={bpm}
			/>
		);
	};

	return (
		<>
			<FlatList
				className="bg-primary-0 flex-1 p-4"
				data={bullets}
				scrollEnabled={false}
				ListHeaderComponent={
					<Heading
						size="xl"
						className="p-4 self-center"
						alignSelf="center"
					>
						{description}
					</Heading>
				}
				ListFooterComponent={() => (
					<CardPlay
						onPress={startStop}
						title={playing ? 'Stop  ' : 'Play '}
						RightIcon={playing ? Volume : Volume2Icon}
					/>
				)}
				ListFooterComponentStyle={{ marginTop: 24 }}
				renderItem={renderItem}
			/>
			<View style={styles.infoTrainer}>
				<View style={styles.controlContainer}>
					<CountDown
						size={30}
						until={8}
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

					<Text className="text-primary-600">{bpm} BPM</Text>

					<Center className="w-full max-w-[320px] mx-auto h-10">
						<Slider
							defaultValue={80}
							size="sm"
							minValue={40}
							maxValue={180}
							orientation="horizontal"
							isDisabled={false}
							isReversed={false}
							onChange={handleBpmChange}
							className="w-full max-w-[320px] mx-auto"
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
