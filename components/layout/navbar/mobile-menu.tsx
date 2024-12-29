import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { IconBars, IconX } from '@/components/ui/icons';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const links = [
  {
    text: 'Blog',
    url: '/blog',
  },
  {
    text: 'Projects',
    url: '/projects',
  },
  {
    text: 'About',
    url: '/about',
  },
  {
    text: 'Curriculum Vitae 🔗',
    url: 'https://drive.google.com/file/d/1WUegCPQlh3esqIrfmkF8H8Q3rpll_pv8/view?usp=sharing',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
];

export default function MobileMenu() {
  const pathname = usePathname();
  const [menu, setMenu] = useState<boolean>(false);

  return (
    <DropdownMenu modal={false} open={menu} onOpenChange={setMenu}>
      <DropdownMenuTrigger className="md:hidden">
        {menu ? <IconX className="size-7" /> : <IconBars className="size-7" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" alignOffset={-10} sideOffset={30}>
        {links.map((link, i) => (
          <DropdownMenuItem
            key={i}
            className={pathname.startsWith(link.url) ? 'bg-border' : ''}
            asChild
          >
            <Link href={link.url} target={link.target} rel={link.rel}>
              {link.text}
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
