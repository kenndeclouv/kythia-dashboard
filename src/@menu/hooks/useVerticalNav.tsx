// React Imports
import { useContext } from 'react';

// Context Imports
import VerticalNavContext from '../contexts/verticalNavContext';

const useVerticalNav = () => {
	// Hooks
	const context = useContext(VerticalNavContext);

	if (context === undefined) {
		throw new Error('VerticalNav Component is required!');
	}

	return context;
};

export default useVerticalNav;
