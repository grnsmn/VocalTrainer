import { Pressable } from "@/components/ui/pressable";
import { Heading } from "@/components/ui/heading";
import { HStack } from "@/components/ui/hstack";
import { ChevronsRightIcon, Icon } from "@/components/ui/icon";
import { Card } from "@/components/ui/card";
import React, { memo } from 'react';

const CardSelect = ({ onPress, title }) => {
	const handleOnPress = () => {
		if (!!onPress) {
			onPress(title);
		}
	};

	return (
        <Pressable onPress={handleOnPress} className="m-2">
            <Card size="lg" variant="elevated">
				<HStack className="justify-between items-center">
					<Heading size="md">{title}</Heading>

					<Icon as={ChevronsRightIcon} />
				</HStack>
			</Card>
        </Pressable>
    );
};

export default memo(CardSelect);
