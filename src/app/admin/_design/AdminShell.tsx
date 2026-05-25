'use client';

import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useMemo } from 'react';
import {
  LayoutDashboard,
  Users,
  Mail,
  LogOut,
  Sparkles,
  Bell,
  Bot,
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
  {
    href: '/admin/bots',
    label: 'בוטים',
    icon: Bot,
    children: [
      { href: '/admin/bots', label: 'כל הבריפים', matchExact: true },
      { href: '/admin/bots/new', label: 'בריף חדש' },
    ],
  },
];

function matches(pathname: string, href: string, exact?: boolean): boolean {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function firstName(fullName: string | null | undefined, email: string | null | undefined): string {
  if (fullName && fullName.trim()) return fullName.trim().split(/\s+/)[0];
  if (email) return email.split('@')[0];
  return '';
}

function todayInHebrew(): string {
  // Mon-Sun in Hebrew, then "DD בחודש YYYY"
  return new Date().toLocaleDateString('he-IL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0])
    .join('')
    .toUpperCase();
}

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const { signOut, profile, user } = useAuth();
  const displayName = useMemo(
    () => firstName(profile?.full_name, user?.email ?? null),
    [profile?.full_name, user?.email],
  );
  const dateLabel = useMemo(() => todayInHebrew(), []);

  return (
    <div className={`nlShell ${styles.shell}`}>
      <header className={styles.topBar} aria-label="סרגל עליון">
        <div className={styles.topBarBrand}>
          <div className={styles.topBarMark}>
            <Sparkles size={16} strokeWidth={2.25} />
          </div>
          <div className={styles.topBarBrandText}>
            <span className={styles.topBarTitle}>מנופאוזית וטוב לה</span>
            <span className={styles.topBarSubtitle}>פאנל ניהול · gilhameever.com</span>
          </div>
        </div>

        <div className={styles.topBarDate}>{dateLabel}</div>

        <div className={styles.topBarUser}>
          <button
            type="button"
            className={styles.topBarIconBtn}
            aria-label="התראות"
            title="התראות"
          >
            <Bell size={16} strokeWidth={2} />
          </button>
          <div className={styles.topBarGreeting}>
            <span className={styles.topBarHello}>שלום</span>
            <span className={styles.topBarName}>{displayName || 'משתמשת'}</span>
          </div>
          <div className={styles.topBarAvatar} aria-hidden="true">
            {initials(displayName) || '·'}
          </div>
        </div>
      </header>

      <aside className={styles.sidebar}>
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
