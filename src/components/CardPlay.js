import { Spinner } from '@/components/ui/spinner';
import { PressableScale } from 'pressto';
import { Icon } from '@/components/ui/icon';
import { Heading } from '@/components/ui/heading';
import { HStack } from '@/components/ui/hstack';
import { Card } from '@/components/ui/card';
import React, { memo } from 'react';

import AnimatedPlayIcon from '../../assets/lotties/sing.json';
import LottieView from 'lottie-react-native';

const CardPLay = ({
	onPress,
	title,
	RightIcon,
	isPlaying = false,
	isLoading = false,
}) => {
	const showRightIcon = RightIcon && !isPlaying;
	const handleOnPress = () => {
		onPress(title);
	};
	return (
		<PressableScale onPress={handleOnPress} android_ripple={null} animationType='spring' style={{ borderRadius: 12 }}>
			<Card
				size="lg"
				variant="elevated"
				className={`m-2 ${isPlaying ? 'bg-green-200' : 'bg-white'}`}
			>
				<HStack className="justify-between items-center">
					<HStack className="items-center space-x-4">
						<Heading size="md">{title}</Heading>
						{isLoading && (
							<Spinner size="small" className="text-green-700" />
						)}
					</HStack>
					<HStack className="justify-center items-center space-x-3">
						{showRightIcon && (
							<Icon
								as={RightIcon}
								className={` ${isPlaying ? 'text-green-700' : undefined
									} `}
							/>
						)}
						{!showRightIcon && (
							<LottieView
								webStyle={{ width: 36, height: 36 }}
								source={AnimatedPlayIcon}
								autoPlay
								loop={true}
								style={{ width: 32, height: 32 }}
							/>
						)}
					</HStack>
				</HStack>
			</Card>
		</PressableScale>
	);
};
export default memo(CardPLay);
