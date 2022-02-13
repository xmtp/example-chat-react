import Link from 'next/link';
import ConversationsList from './ConversationsList';
import { SidebarProps } from './types';

const DesktopSidebar = ({ conversations, router }: SidebarProps): JSX.Element => (
	<section className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
		<div className="flex flex-col flex-grow border-r border-gray-200 pt-5 bg-white overflow-y-auto">
			<div className="flex items-center flex-shrink-0 px-4">
				<Link href="/" passHref={true}>
					<img className="h-8 w-auto" src="/xmtp-logo.png" alt="XMTP" />
				</Link>
			</div>
			<div className="mt-5 flex-grow flex flex-col">
				<nav className="flex-1 px-2 pb-4 space-y-1">
					<ConversationsList router={router} conversations={conversations} />
				</nav>
			</div>
		</div>
	</section>
);

export default DesktopSidebar;
