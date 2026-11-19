import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface NavItemProps {
  to: string;
  icon: LucideIcon;
  isActive: boolean;
}
interface NavIconProps {
  icon: LucideIcon;
  isActive: boolean;
}

const NavIcon = ({ icon: Icon, isActive }: NavIconProps) => (
  <Icon
    className={`w-8 h-8 transition-colors ${
      isActive ? 'text-portfolio-ink' : 'text-portfolio-body group-hover:text-portfolio-ink'
    }`}
  />
);

const NavItem = ({ to, icon, isActive }: NavItemProps) => (
  <Link  href ={to}>
    <div
      className={`w-16 h-16 flex items-center justify-center rounded-lg transition-colors cursor-pointer group ${
        isActive ? 'bg-portfolio-surface' : 'hover:bg-portfolio-surface'
      }`}
    >
      <NavIcon icon={icon} isActive={isActive} />
    </div>
  </Link>
);

export default NavItem;