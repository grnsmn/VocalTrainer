import React from 'react';
import {
	AddIcon,
	Card,
	ChevronsRightIcon,
	Fab,
	FabIcon,
	FabLabel,
	HStack,
	Heading,
	Icon,
	Pressable,
} from '@gluestack-ui/themed';

export const Home = () => {
	const handlePress = async () => {
		console.log('🚀 ~ testing');
	};
	return (
		<>
			<Pressable onPress={handlePress} bg="primary.400" p="20">
				<Card size="md" variant="elevated" m="$3">
					<HStack justifyContent="space-between" alignItems="center">
						<Heading mb="$1" size="md">
							Quick Start
						</Heading>

						<Icon as={ChevronsRightIcon} size="lg" />
					</HStack>
				</Card>
			</Pressable>

			<Fab
				size="md"
				placement="bottom right"
				isHovered={false}
				isDisabled={false}
				isPressed={false}
			>
				<FabIcon as={AddIcon} mr="$1" />
				<FabLabel>Quick start</FabLabel>
			</Fab>
		</>
	);
};
