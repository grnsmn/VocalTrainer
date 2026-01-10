import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import React, { useEffect } from 'react';
import { useInterval, useCounter } from 'usehooks-ts';
import { useMetronomeContext } from '../context/MetronomeContext';

// Ora usiamo il Context invece delle props!
// Bullet non ha più bisogno di ricevere playClick1/playClick2 dal parent
const Bullet = ({ item, isActive, onComplete, bpm, skipCounter }) => {
	const { count: playCounter, increment, reset } = useCounter(0);
	// Accediamo al metronomo tramite Context - niente props drilling!
	const { playClick1, playClick2 } = useMetronomeContext();

	const handleClick = () => {
		// Ultimo beat del ciclo → suono diverso (click2)
		if (playCounter + 1 === item.duration) {
			playClick2();
		} else {
			// Beat normale → click1
			playClick1();
		}
		increment();
	};

	useInterval(handleClick, isActive ? (60 / bpm) * 1000 : null);

	useEffect(() => {
		if (playCounter === item.duration && !skipCounter) {
			reset();
			onComplete();
		}
	}, [playCounter, item.duration, reset, onComplete]);

	const renderDots = () => {
		if (!isActive) {
			return (
				<Text bold className="text-primary-700" size="xl">
					{`[${item.duration}BPM]`}
				</Text>
			);
		}

		return (
			<>
				{Array.from({ length: item.duration }).map((_, index) =>
					index < playCounter ? (
						<Box
							key={index}
							className="w-4 h-4 rounded-full border-2 border-black mx-0.5 bg-primary-500"
						/>
					) : null,
				)}
			</>
		);
	};

	return (
		<Box
			className="flex-row items-center flex-wrap gap-2 rounded-2xl justify-eavenly"
			style={{
				borderWidth: isActive ? 2 : 0,
				padding: isActive ? 12 : 0,
				backgroundColor: isActive ? '#d0f0ff' : 'transparent',
			}}
		>
			<Text className="text-2xl text-black" bold={isActive}>
				{`\u29BF ${item.definition}`}
			</Text>
			<Box className="flex-row gap-1 flex-wrap items-center justify-center">
				{renderDots()}
			</Box>
		</Box>
	);
};

export default Bullet;
