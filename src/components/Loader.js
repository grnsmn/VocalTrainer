import { VStack } from "@/components/ui/vstack";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import React from 'react';

const Loader = () => {
	return (
        <VStack space="sm" className="flex-1 justify-center items-center">
            <Spinner size="small" />
            <Text size="md">Please Wait</Text>
        </VStack>
    );
};

export default Loader;
