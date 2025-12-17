import Image from 'next/image';

const logo =
	process.env.NEXT_PUBLIC_LOGO_URL ||
	'https://placehold.co/500x500.png?text=kythia+logo';

const Logo = () => {
	return <Image src={logo} alt="logo" width={40} height={40} />;
};

export default Logo;
