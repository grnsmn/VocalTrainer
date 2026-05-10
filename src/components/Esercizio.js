import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { FlatList } from '@/components/ui/flat-list';
import {
	Slider,
	SliderFilledTrack,
	SliderTrack,
	SliderThumb,
} from '@/components/ui/slider';
import { Text } from '@/components/ui/text';
import { Center } from '@/components/ui/center';
import { Volume, Volume2Icon } from 'lucide-react-native';
import { View } from 'react-native';
import { Audio } from 'expo-av';
import CardPlay from './CardPlay';
import CountDown from 'react-native-countdown-component'; // Fixed version for listener remove: https://github.com/binotby/react-native-countdown-component/blob/patch-1/index.js

const Esercizio = ({ pallini, cicli: numCicli }) => {
	const [bpm, setBpm] = useState(100);
	const [playing, setPlaying] = useState(false);
	const [count, setCount] = useState(1);
	const [counterTot, setCounterTot] = useState(1);
	const [currentCycle, setCurrentCycle] = useState(0);
	const [counterDurataCiclo, setCounterDurataCiclo] = useState(0);
	const [activeKey, setActiveKey] = useState(0);
	const [startCountDown, setStartCountDown] = useState(true);

	const click1 = useRef(null);
	const click2 = useRef(null);
	const timer = useRef(null);

	// Precompute durations
	const exerciseData = useMemo(() => {
		const cyclesMatrix = [];
		const totalCycles = pallini?.[0]?.durata?.length || 0;
		for (let i = 0; i < totalCycles; i++) {
			cyclesMatrix.push(pallini.map(p => p.durata[i]));
		}
		const cycleDurations = cyclesMatrix.map(c => c.reduce((a, b) => a + b, 0));
		const totalDuration = cycleDurations.reduce((a, b) => a + b, 0);
		return { totalDuration, cyclesMatrix, cycleDurations };
	}, [pallini]);

	useEffect(() => {
		const loadSounds = async () => {
			const { sound: s1 } = await Audio.Sound.createAsync(require('../../assets/sounds/click1.mp3'));
			const { sound: s2 } = await Audio.Sound.createAsync(require('../../assets/sounds/click2.mp3'));
			click1.current = s1;
			click2.current = s2;
		};
		loadSounds();
		return () => {
			click1.current?.unloadAsync();
			click2.current?.unloadAsync();
			if (timer.current) clearInterval(timer.current);
		};
	}, []);

	const playClick = useCallback(() => {
		setCounterTot(prevTot => {
			if (prevTot >= exerciseData.totalDuration) {
				stopExercise();
				return prevTot;
			}
			return prevTot + 1;
		});

		setCounterDurataCiclo(prevCycleCounter => {
			const isCycleEnd = prevCycleCounter + 1 === exerciseData.cycleDurations[currentCycle];
			if (isCycleEnd) {
				setCurrentCycle(c => c + 1);
				setActiveKey(0);
				return 0;
			}
			return prevCycleCounter + 1;
		});

		setCount(prevCount => {
			const currentBeatLimit = exerciseData.cyclesMatrix[currentCycle][activeKey] || 4;
			if (prevCount % currentBeatLimit === 1) {
				click2.current?.replayAsync();
				setActiveKey(k => (k + 1) % pallini.length);
				return 1;
			} else {
				click1.current?.replayAsync();
				return prevCount + 1;
			}
		});
	}, [currentCycle, activeKey, exerciseData, pallini.length]);

	const stopExercise = () => {
		if (timer.current) clearInterval(timer.current);
		setPlaying(false);
		setCount(1);
		setCounterTot(1);
		setActiveKey(0);
		setCurrentCycle(0);
		setCounterDurataCiclo(0);
	};

	const startStop = () => {
		if (playing) {
			stopExercise();
		} else {
			setPlaying(true);
			setStartCountDown(true);
			timer.current = setInterval(playClick, (60 / bpm) * 1000);
		}
	};

	const handleBpmChange = (newBpm) => {
		setBpm(newBpm);
		if (playing) {
			clearInterval(timer.current);
			timer.current = setInterval(playClick, (60 / newBpm) * 1000);
		}
	};

	return (
		<>
			<FlatList
				data={pallini}
				scrollEnabled={false}
				contentContainerStyle={{ padding: 16, width: '100%' }}
				ItemSeparatorComponent={() => <View className="h-3" />}
				ListFooterComponent={() => (
					<CardPlay
						onPress={startStop}
						title={playing ? 'Stop' : 'Play'}
						RightIcon={playing ? Volume : Volume2Icon}
					/>
				)}
				renderItem={({ item }) => (
					<Text
						className={`py-0.5 font-bold ${
							item.key === activeKey + 1 && playing
								? 'text-orange-500 text-4xl leading-[34px] text-center py-5'
								: 'text-black text-2xl leading-[25px] text-left'
						}`}
					>
						{item.key === activeKey + 1 && playing ? '' : `o  `}
						{`${item.definizione}`}
						<Text className="text-2xl text-right text-primary-600">
							{`    [${item.durata} BPM]; `}
						</Text>
					</Text>
				)}
			/>
			<View className="justify-end border-2 rounded-2xl border-primary-200 p-4">
				<View className="items-center gap-3">
					<CountDown
						size={30}
						until={10}
						onFinish={playing ? null : startStop}
						digitStyle={{ backgroundColor: '#FFF', borderWidth: 2, borderColor: '#c6e9ff' }}
						digitTxtStyle={{ color: '#005DB4' }}
						timeToShow={['S']}
						running={startCountDown}
						timeLabels={{ s: null }}
						showSeparator
					/>
					<Text className="text-primary-600 font-bold">{bpm} BPM</Text>
					<Text className={`font-bold self-center text-xl ${playing ? 'text-orange-400' : 'text-primary-600'}`}>
						Count: {count - 1}
					</Text>
					<Center className="w-full max-w-[320px] mx-auto h-10">
						<Slider
							defaultValue={bpm}
							minValue={40}
							maxValue={180}
							onChange={handleBpmChange}
							className="w-full"
						>
							<SliderTrack><SliderFilledTrack /></SliderTrack>
							<SliderThumb />
						</Slider>
					</Center>
				</View>
			</View>
		</>
	);
};

export default Esercizio;