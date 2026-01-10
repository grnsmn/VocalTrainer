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
import { useCounter } from 'usehooks-ts';

import { View } from 'react-native';
import CardPlay from './CardPlay';
import CountDown from 'react-native-countdown-component'; // Fixed version for listener remove: https://github.com/binotby/react-native-countdown-component/blob/patch-1/index.js

import Bullet from './Bullet';
import { Heading } from '@/components/ui/heading';
import { MetronomeProvider } from '../context/MetronomeContext';

const BreathingSession = ({ exercise }) => {
	const { cycles, description, skip_metronome } = exercise || {};
	const [playing, setPlaying] = useState(false);
	const [bpm, setBpm] = useState(100);
	// Il MetronomeProvider crea i player audio UNA SOLA VOLTA
	// e li rende disponibili a tutti i componenti figli tramite Context

	const {
		count: activeCycle,
		increment: incrementCycle,
		reset: resetCycle,
	} = useCounter(0);
	const {
		count: currentBullet,
		increment: incrementBullet,
		reset: resetBullet,
	} = useCounter(0);

	const { bullets } = cycles[activeCycle] || {};
	// Play/stop functionality
	const startStop = () => {
		if (skip_metronome) {
			//TODO: integrate play audio guide for exercises without integrated metronome
			return;
		}
		if (playing) {
			resetBullet();
			setPlaying(false);
			resetCycle();
		} else {
			setPlaying(true);
		}
	};

	// BPM change handler
	const handleBpmChange = newBpm => {
		setBpm(newBpm);
	};

	useEffect(() => {
		if (currentBullet === bullets?.length) {
			resetBullet();
			incrementCycle();
		}
		if (activeCycle === cycles.length) {
			startStop();
		}
	}, [currentBullet, activeCycle, bullets, cycles.length]);

	const renderItem = ({ item, index }) => {
		const isActive = playing && index === currentBullet;
		return (
			<Bullet
				key={index}
				item={item}
				isActive={isActive}
				skipCounter={skip_metronome}
				onComplete={() => incrementBullet()}
				bpm={bpm}
				// playClick1/playClick2 rimossi: ora Bullet li prende dal Context!
			/>
		);
	};

	const ListHeaderComponent = () => {
		return (
			<View className="mb-4">
				{description ? (
					<Heading
						size="xl"
						className="p-4 text-primary-700 border-y-2 border-primary-200 mb-4"
						alignSelf="center"
					>
						{description}
					</Heading>
				) : null}
				<View className="flex-row justify-between items-center mb-2">
					<Text className="text-primary-500">
						Da ripetere per {cycles?.length} Cicli
					</Text>
					{playing && (
						<Text className="text-primary-500 self-end" bold>
							{activeCycle + 1}° Ciclo in corso
						</Text>
					)}
				</View>
			</View>
		);
	};

	return (
		<MetronomeProvider>
			<FlatList
				className="bg-primary-0 flex-1 p-4"
				data={bullets}
				scrollEnabled={false}
				ListHeaderComponent={ListHeaderComponent}
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
		</MetronomeProvider>
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
