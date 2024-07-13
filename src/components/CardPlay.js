import React, { memo } from 'react';
import {
	Card,
	HStack,
	Heading,
	Icon,
	Pressable,
	Spinner,
} from '@gluestack-ui/themed';
//FIXME: Lottie on web
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
		<Pressable onPress={handleOnPress} m="$2">
			<Card
				size="lg"
				variant="elevated"
				backgroundColor={isPlaying ? '$green200' : '$white'}
			>
				<HStack justifyContent="space-between" alignItems="center">
					<Heading size="md">{title}</Heading>
					{isLoading && <Spinner size="small" color={'$green700'} />}
					{showRightIcon && (
						<Icon
							as={RightIcon}
							color={isPlaying ? '$green700' : undefined}
						/>
					)}
					{!showRightIcon && (
						<LottieView
							webStyle={{ width: 40, height: 40 }}
							source={AnimatedPlayIcon}
							autoPlay
							style={{ width: 28, height: 28 }}
						/>
					)}
				</HStack>
			</Card>
		</Pressable>
	);
};
export default memo(CardPLay);
