// Component Imports
import LayoutNavbar from '@layouts/components/vertical/Navbar';
import NavbarContent from './NavbarContent';

const Navbar = ({ guilds, userId }: { guilds: any[]; userId?: string }) => {
	return (
		<LayoutNavbar>
			<NavbarContent guilds={guilds} userId={userId || null} />
		</LayoutNavbar>
	);
};

export default Navbar;
