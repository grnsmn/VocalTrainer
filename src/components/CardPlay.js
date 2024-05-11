import React, { memo } from 'react';
import {
	Card,
	HStack,
	Heading,
	Icon,
	Pressable,
	Spinner,
} from '@gluestack-ui/themed';

const CardPLay = ({
	onPress,
	title,
	RightIcon,
	isPlaying = false,
	isLoading = false,
}) => {
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
					{RightIcon && (
						<Icon
							as={RightIcon}
							color={isPlaying ? '$green700' : undefined}
						/>
					)}
				</HStack>
			</Card>
		</Pressable>
	);
};
export default memo(CardPLay);
