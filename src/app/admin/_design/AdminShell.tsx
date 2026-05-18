'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Mail,
  LogOut,
  Sparkles,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import './tokens.css';
import styles from './shell.module.css';

type NavItem = {
  href: string;
  label: string;
  icon: typeof LayoutDashboard;
  matchExact?: boolean;
  children?: { href: string; label: string; matchExact?: boolean }[];
};

const NAV: NavItem[] = [
  {
    href: '/admin',
    label: 'דשבורד',
    icon: LayoutDashboard,
    matchExact: true,
  },
  {
    href: '/admin/users',
    label: 'משתמשים',
    icon: Users,
  },
  {
    href: '/admin/newsletter',
    label: 'ניוזלטר',
    icon: Mail,
    children: [
      { href: '/admin/newsletter', label: 'כל הטיוטות', matchExact: true },
      { href: '/admin/newsletter/new', label: 'טיוטה חדשה' },
    ],
  },
];

function matches(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { signOut } = useAuth();

  return (
    <div className={`nlShell ${styles.shell}`}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarLogo}>
            <Sparkles size={18} strokeWidth={2.25} />
          </div>
          <div>
            <h2 className={styles.sidebarTitle}>פאנל ניהול</h2>
            <p className={styles.sidebarSubtitle}>gilhameever.com</p>
          </div>
        </div>

        <nav className={styles.navList} aria-label="ניווט ראשי">
          <div className={styles.navSection}>תפריט</div>
          {NAV.map((item) => {
            const Icon = item.icon;
            const isActive = matches(pathname, item.href, item.matchExact);
            const showChildren = item.children && pathname.startsWith(item.href);
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  className={`${styles.navItem} ${isActive ? styles.navItemActive : ''}`}
                >
                  <Icon className={styles.navItemIcon} strokeWidth={2} />
                  {item.label}
                </Link>
                {showChildren && item.children && (
                  <div className={styles.navSubList}>
                    {item.children.map((sub) => {
                      const subActive = matches(pathname, sub.href, sub.matchExact);
                      return (
                        <Link
                          key={sub.href}
                          href={sub.href}
                          className={`${styles.navSubItem} ${
                            subActive ? styles.navSubItemActive : ''
                          }`}
                        >
                          <span className={styles.subItemDot} />
                          {sub.label}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className={styles.sidebarFooter}>
          <button
            type="button"
            className={styles.logoutBtn}
            onClick={async () => {
              await signOut();
              router.push('/login');
            }}
          >
            <LogOut className={styles.navItemIcon} strokeWidth={2} />
            התנתקות
          </button>
        </div>
      </aside>

      <div className={styles.contentArea}>
        <main className={styles.main}>
          <div className={styles.mainInner}>{children}</div>
        </main>
      </div>
    </div>
  );
}
