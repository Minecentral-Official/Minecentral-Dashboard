import { Button } from '@/components/ui/button';

type Item = {
  name: string;
  href: string;
};

const items: Item[] = [
  {
    name: 'Home',
    href: '/',
  },
  {
    name: 'Features',
    href: '/features',
  },
  {
    name: 'Pricing',
    href: '/pricing',
  },
];

export default function NavMenu() {
  return (
    <nav className='absolute left-1/2 -translate-x-1/2'>
      <li className='flex gap-2'>
        {items.map(({ name, href }) => (
          <ul key={href}>
            <Button variant='linkHover2'>{name}</Button>
          </ul>
        ))}
      </li>
    </nav>
  );
}
