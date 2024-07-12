import React, { memo } from 'react';
import {
	Card,
	ChevronsRightIcon,
	HStack,
	Heading,
	Icon,
	Pressable,
} from '@gluestack-ui/themed';

const CardSelect = ({ onPress, title }) => {
	const handleOnPress = () => {
		if (!!onPress) {
			onPress(title);
		}
	};

	return (
		<Pressable onPress={handleOnPress} m="$2">
			<Card size="lg" variant="elevated">
				<HStack justifyContent="space-between" alignItems="center">
					<Heading size="md">{title}</Heading>

					<Icon as={ChevronsRightIcon} />
				</HStack>
			</Card>
		</Pressable>
	);
};

export default memo(CardSelect);
