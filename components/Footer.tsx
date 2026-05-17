import Link from 'next/link'

const footerColumns = [
  {
    title: 'Get Help',
    links: [
      { label: 'Track Order', href: '/account/orders' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Help Center', href: '/help' },
      { label: 'Shipping Info', href: '/shipping' },
      { label: 'Return Policy', href: '/returns' },
    ],
  },
  {
    title: 'Shop',
    links: [
      { label: 'All Products', href: '/products' },
      { label: 'Protein', href: '/products?category=protein' },
      { label: 'Pre-Workout', href: '/products?category=pre-workout' },
      { label: 'Keto', href: '/products?category=keto' },
      { label: 'New Arrivals', href: '/products?new=true' },
      { label: 'Deals', href: '/products?badge=sale' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About Us', href: '/about' },
      { label: 'Blog', href: '/blog' },
      { label: 'Careers', href: '/careers' },
      { label: 'Affiliate Program', href: '/affiliate' },
      { label: 'Science & Innovation', href: '/science' },
    ],
  },
]

const socials = [
  { label: 'f', name: 'Facebook', href: '#' },
  { label: 'ig', name: 'Instagram', href: '#' },
  { label: '▶', name: 'YouTube', href: '#' },
  { label: '♫', name: 'TikTok', href: '#' },
  { label: 'X', name: 'Twitter/X', href: '#' },
]

export function Footer() {
  return (
    <footer className="bg-white border-t-2 border-gray-border mt-12">
      {/* Trust bar */}
      <div className="bg-gray-light border-b border-gray-border py-6 px-4">
        <div className="max-w-[1400px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
          {[
            { icon: '🚚', title: 'Free Shipping', sub: 'Orders over CHF 79' },
            { icon: '↩', title: '30-Day Returns', sub: 'No questions asked' },
            { icon: '🛡', title: 'Swiss Quality', sub: 'Lab tested & certified' },
            { icon: '💬', title: 'Expert Support', sub: 'Mon–Sat, 9am–6pm' },
          ].map(({ icon, title, sub }) => (
            <div key={title}>
              <div className="text-3xl mb-2">{icon}</div>
              <div className="font-bold text-sm text-dark">{title}</div>
              <div className="text-xs text-gray-500 mt-1">{sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-[1400px] mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
        {footerColumns.map((col) => (
          <div key={col.title}>
            <h3 className="font-bold text-sm mb-4 tracking-wide text-dark">{col.title}</h3>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-500 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div>
          <h3 className="font-bold text-sm mb-2 tracking-wide text-dark">STAY CONNECTED</h3>
          <p className="text-xs text-gray-500 mb-4">Get the latest deals and news when you sign up</p>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex mb-6"
          >
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 border border-r-0 border-gray-border px-3 py-2.5 text-sm focus:outline-none focus:border-primary"
            />
            <button
              type="submit"
              className="bg-dark text-white px-4 py-2.5 text-xs font-bold tracking-wider hover:bg-dark-2 transition-colors"
            >
              JOIN
            </button>
          </form>

          {/* Logo */}
          <div className="flex items-center gap-2 mb-6">
            <div className="bg-primary text-white px-2 py-1 font-display text-xl leading-none">NF</div>
            <div className="font-display text-lg text-dark leading-none">
              NUTRI<span className="text-primary">FITNESS</span>
            </div>
          </div>

          <p className="text-xs text-gray-400">
            Premium Swiss nutrition supplements since 2018.
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gray-border py-6 px-4">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Socials */}
          <div className="flex gap-2">
            {socials.map((s) => (
              <a
                key={s.name}
                href={s.href}
                title={s.name}
                className="w-9 h-9 rounded-full bg-dark text-white flex items-center justify-center text-xs font-bold hover:bg-primary transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>

          {/* Legal */}
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
            {['Privacy Policy', 'Terms & Conditions', 'Cookie Policy', 'Accessibility'].map((item) => (
              <Link
                key={item}
                href="#"
                className="text-xs text-gray-400 hover:text-primary transition-colors"
              >
                {item}
              </Link>
            ))}
          </div>

          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} NutriFitness Holdings
          </p>
        </div>
      </div>
    </footer>
  )
}
