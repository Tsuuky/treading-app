import type { AppProps } from 'next/app';
import Link from 'next/link';
import { useRouter } from 'next/router';
import '../styles/globals.css';

const links = [
  { href: '/', label: 'Accueil' },
  { href: '/portfolio', label: 'Portfolio' },
  { href: '/trades', label: 'Trades' },
  { href: '/backtest', label: 'Backtests' },
  { href: '/settings', label: 'Paramètres' },
];

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();

  return (
    <>
      <header className="topbar">
        <div className="topbar-inner">
          <Link href="/" className="brand">Paper Trading</Link>
          <nav className="topnav" aria-label="Navigation principale">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`navlink ${router.pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <Component {...pageProps} />
    </>
  );
}
