import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store';
import { useInterval } from 'usehooks-ts'; // <--- Importa useInterval

const Bullet = ({ item, isActive, onComplete, bpm }) => {
	const [playCount, setPlayCount] = useState(0);
	const {
		sounds: { click1, click2 },
	} = useStore();

	// Funzione che gestisce la riproduzione dei click
	const handleClick = () => {
		setPlayCount(prev => {
			const newCount = prev + 1;
			if (newCount === item.duration) {
				click2?.replayAsync();
			} else {
				click1?.replayAsync();
			}
			return newCount;
		});
	};

	useInterval(
		handleClick,
		isActive ? (60 / bpm) * 1000 : null, // Se isActive è false, disattiva l'intervallo
	);

	useEffect(() => {
		if (playCount === item.duration) {
			setPlayCount(0);
			onComplete();
		}
	}, [playCount]);

	const renderDots = () => {
		if (!isActive)
			return (
				<Text
					bold
					className="text-primary-700"
					size={'xl'}
				>{`[${item.duration}BPM]`}</Text>
			);

		const dots = Array.from({ length: item.duration });

		return dots?.map((_, index) =>
			index < playCount ? (
				<Box
					key={index}
					className="w-4 h-4 rounded-full border-2 border-black mx-0.5 bg-primary-500"
				/>
			) : null,
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
