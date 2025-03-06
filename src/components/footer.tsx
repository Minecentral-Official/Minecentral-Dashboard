import Link from 'next/link';

export const Footer = () => {
  const navigationItems = [
    {
      title: 'Home',
      href: '/',
      description: '',
    },
    {
      title: 'Discover',
      items: [
        {
          title: 'Plugins',
          href: '/plugins',
        },
        {
          title: 'Mods',
          href: '/mods',
        },
        {
          title: 'Mod Packs',
          href: '/modpacks',
        },
        {
          title: 'Data Packs',
          href: '/datapacks',
        },
        {
          title: 'Resource Packs',
          href: '/resourcepacks',
        },
        {
          title: 'Shaders',
          href: '/shaders',
        },
      ],
    },
    {
      title: 'Company',
      items: [
        {
          title: 'About us',
          href: '/about',
        },
      ],
    },
  ];

  return (
    <div className='w-full bg-foreground py-20 text-background lg:py-40'>
      <div className='container mx-auto'>
        <div className='grid items-center gap-10 lg:grid-cols-2'>
          <div className='flex flex-col items-start gap-8'>
            <div className='flex flex-col gap-2'>
              <h2 className='font-regular max-w-xl text-left text-3xl tracking-tighter md:text-5xl'>
                Minecentral™
              </h2>
              <p className='max-w-lg text-left text-lg leading-relaxed tracking-tight text-background/75'>
                All things Minecraft in one place, search, download and host.
              </p>
            </div>
            <div className='flex flex-row gap-20'>
              <div className='flex max-w-lg flex-col text-left text-sm leading-relaxed tracking-tight text-background/75'>
                <p>Miami, Florida</p>
              </div>
              <div className='flex max-w-lg flex-col text-left text-sm leading-relaxed tracking-tight text-background/75'>
                <Link href='/terms'>Terms of service</Link>
                <Link href='/privacy'>Privacy Policy</Link>
              </div>
            </div>
          </div>
          <div className='grid items-start gap-10 lg:grid-cols-3'>
            {navigationItems.map((item) => (
              <div
                key={item.title}
                className='flex flex-col items-start gap-1 text-base'
              >
                <div className='flex flex-col gap-2'>
                  {item.href ?
                    <Link
                      href={item.href}
                      className='flex items-center justify-between'
                    >
                      <span className='text-xl'>{item.title}</span>
                    </Link>
                  : <p className='text-xl'>{item.title}</p>}
                  {item.items &&
                    item.items.map((subItem) => (
                      <Link
                        key={subItem.title}
                        href={subItem.href}
                        className='flex items-center justify-between'
                      >
                        <span className='text-background/75'>
                          {subItem.title}
                        </span>
                      </Link>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
