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
	const showRightIcon = RightIcon && !isPlaying && !isLoading;
	const handleOnPress = () => {
		onPress(title);
	};
	return (
		<PressableScale onPress={handleOnPress} activateOnHover animationType='spring'>
			<Card
				size="lg"
				variant="elevated"
				className={`m-2 active:opacity-50 ${isPlaying ? 'bg-green-200' : 'bg-white'} `}
			>
				<HStack className="justify-between items-center">
					<Heading size="md">{title}</Heading>
					<HStack className="justify-center items-center space-x-3">
						{isLoading && (
							<Spinner size="small" className="text-green-700" />
						)}
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
