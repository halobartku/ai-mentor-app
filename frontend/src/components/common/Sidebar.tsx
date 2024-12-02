import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChatBubbleLeftIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  RocketLaunchIcon,
} from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Chat', href: '/dashboard/chat', icon: ChatBubbleLeftIcon },
  { name: 'Goals', href: '/dashboard/goals', icon: RocketLaunchIcon },
  { name: 'Analytics', href: '/dashboard/analytics', icon: ChartBarIcon },
  { name: 'Profile', href: '/dashboard/profile', icon: UserCircleIcon },
  { name: 'Settings', href: '/dashboard/settings', icon: Cog6ToothIcon },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="flex h-full w-64 flex-col bg-white border-r border-gray-200">
      <div className="flex h-14 items-center px-4 border-b border-gray-200">
        <span className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
          AI Mentor
        </span>
      </div>

      <nav className="flex-1 space-y-1 px-2 py-4">
        {navigation.map((item) => {
          const isActive = pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${isActive
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
            >
              <item.icon
                className={`mr-3 h-5 w-5 flex-shrink-0 ${isActive ? 'text-blue-600' : 'text-gray-400'}`}
                aria-hidden="true"
              />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}