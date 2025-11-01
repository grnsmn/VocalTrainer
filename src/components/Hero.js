import { Image } from "@/components/ui/image";
import React from 'react';
import icon from '../../assets/splash.png';

const Hero = () => {
	return (
        <Image
            size="2xl"
            source={icon}
            alt="ed_microphone"
            className="m-4 self-center rounded-full" />
    );
};

export default Hero;
