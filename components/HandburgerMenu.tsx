import { MenuAlt2Icon } from '@heroicons/react/outline';

type HamburgerMenuProps = {
	setSidebarOpen: (isOpen: boolean) => void;
};

const HamburgerMenu = ({ setSidebarOpen }: HamburgerMenuProps): JSX.Element => (
	<button
		type="button"
		className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden"
		onClick={() => setSidebarOpen(true)}
	>
		<span className="sr-only">Open sidebar</span>
		<MenuAlt2Icon className="h-6 w-6" aria-hidden="true" />
	</button>
);

export default HamburgerMenu;
