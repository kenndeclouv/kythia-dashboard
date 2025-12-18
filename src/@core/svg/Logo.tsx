import Image from 'next/image';
import { kythiaConfig } from '@config';

const logo = kythiaConfig.assets.logo;

const Logo = () => {
	return <Image src={logo} alt="logo" width={40} height={40} />;
};

export default Logo;
