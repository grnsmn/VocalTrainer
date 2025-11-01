import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import React, { useEffect, useRef, useState } from 'react';
import useStore from '../store';

const Bullet = ({ item, isActive, onComplete, bpm }) => {
	const {
		sounds: { click1, click2 },
	} = useStore();
	const timer = useRef(null);
	const [playCount, setPlayCount] = useState(0);

	useEffect(() => {
		if (isActive) {
			timer.current = setInterval(() => {
				setPlayCount(prev => {
					const newCount = prev + 1;
					if (newCount === item.duration) {
						click2?.replayAsync();
					} else {
						click1?.replayAsync();
					}
					return newCount;
				});
			}, (60 / bpm) * 1000); // Imposta l'intervallo di tempo desiderato

			return () => {
				clearInterval(timer.current);
			};
		} else {
			setPlayCount(0);
			clearInterval(timer.current);
		}
	}, [isActive]);

	useEffect(() => {
		if (playCount >= item.duration) {
			setPlayCount(0);
			clearInterval(timer.current);
			onComplete();
		}
	}, [playCount]);

	const renderDots = () => {
		return Array.from({ length: item.duration }).map((_, index) => (
			<Box
				key={index}
				className="w-4 h-4 rounded-full border-2 border-black mx-0.5"
				style={{
					backgroundColor: index < playCount ? '#000' : 'transparent',
				}}
			/>
		));
	};

	return (
		<Box className="flex-row items-center flex-wrap gap-2">
			<Text
				className="text-2xl font-bold text-black"
				style={{
					fontWeight: isActive ? 'bold' : 'normal',
				}}
			>
				{`\u29BF ${item.definition}`}
			</Text>
			<Box className="flex-row gap-1 flex-wrap items-center justify-center">
				{renderDots()}
			</Box>
		</Box>
	);
};

export default Bullet;
