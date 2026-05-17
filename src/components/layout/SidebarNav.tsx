"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ClipboardList,
  LayoutTemplate,
  Mail,
  Bell,
  Clock,
  FolderOpen,
  User,
  Users,
  Settings,
  BarChart2,
  LifeBuoy,
  CalendarDays,
  ShieldCheck,
  ChevronRight,
  X,
  MessageSquare,
} from "lucide-react";

type NotificationItem = {
  onboarding_id: string;
  title: string;
  client_name: string;
  event_name: string | null;
  phase_number: number | null;
  phase_name: string | null;
  token: string | null;
  updated_at: string | null;
};

function isActive(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === "/dashboard";
  return currentPath === href || currentPath.startsWith(href + "/");
}

function Badge({ count }: { count: number }) {
  if (count === 0) return null;
  return (
    <span className="ml-auto flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  onClose?: () => void;
  badge?: number;
  onBadgeClick?: (e: React.MouseEvent) => void;
};

function NavItem({ href, label, icon: Icon, onClose, badge = 0, onBadgeClick }: NavItemProps) {
  const pathname = usePathname() || "/dashboard";
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      prefetch
      onClick={onClose}
      className={
        "group flex min-h-[40px] w-full items-center gap-2.5 rounded-[var(--radius-md)] px-3 py-2 text-sm font-medium transition-colors " +
        (active
          ? "bg-[var(--color-accent-subtle)] text-[var(--color-accent)]"
          : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-subtle)] hover:text-[var(--color-text-primary)]")
      }
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={
          "h-4 w-4 shrink-0 " +
          (active ? "text-[var(--color-accent)]" : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]")
        }
      />
      <span className="truncate">{label}</span>
      {badge > 0 && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onBadgeClick?.(e);
          }}
          className="ml-auto flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold leading-none text-white hover:bg-red-600 transition-colors"
          aria-label={`${badge} items need attention`}
        >
          {badge > 99 ? "99+" : badge}
        </button>
      )}
    </Link>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-0.5 mt-5 px-3 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)] first:mt-0">
      {children}
    </p>
  );
}

function NotificationPanel({
  items,
  anchorRef,
  onClose,
}: {
  items: NotificationItem[];
  anchorRef: React.RefObject<HTMLElement | null>;
  onClose: () => void;
}) {
  const router = useRouter();
  const panelRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        panelRef.current && !panelRef.current.contains(e.target as Node) &&
        anchorRef.current && !anchorRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [onClose, anchorRef]);

  // Group by event_name
  const grouped: Record<string, NotificationItem[]> = {};
  for (const item of items) {
    const key = item.event_name ?? "__no_event__";
    if (!grouped[key]) grouped[key] = [];
    grouped[key].push(item);
  }

  function timeAgo(iso: string | null) {
    if (!iso) return "";
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  }

  return (
    <div
      ref={panelRef}
      className="absolute left-0 top-0 z-50 w-[min(18rem,90vw)] rounded-xl border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[var(--shadow-xl)] overflow-hidden lg:left-[228px]"
    >
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-2.5">
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-primary)]">Needs review</p>
          <p className="text-[10px] text-[var(--color-text-muted)]">{items.length} awaiting your attention</p>
        </div>
        <button
          onClick={onClose}
          className="flex h-6 w-6 items-center justify-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-bg-hover)] transition-colors"
          aria-label="Close"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>

      {/* Items */}
      <div className="max-h-80 overflow-y-auto">
        {Object.entries(grouped).map(([eventKey, groupItems]) => (
          <div key={eventKey}>
            {/* Event header */}
            <div className="flex items-center gap-1.5 bg-[var(--color-bg-subtle)] px-4 py-1.5">
              <CalendarDays className="h-3 w-3 shrink-0 text-[var(--color-text-muted)]" />
              <span className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] truncate">
                {eventKey === "__no_event__" ? "No event" : eventKey}
              </span>
            </div>
            {/* People in this event */}
            {groupItems.map((item) => (
              <button
                key={item.onboarding_id}
                type="button"
                onClick={() => {
                  router.push(`/dashboard/onboardings/${item.onboarding_id}`);
                  onClose();
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-[var(--color-bg-hover)] transition-colors group border-b border-[var(--color-border)] last:border-b-0"
              >
                {/* Avatar initial */}
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--color-accent-subtle)] text-[10px] font-bold text-[var(--color-accent)]">
                  {(item.client_name ?? "?").charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-[var(--color-text-primary)]">{item.client_name}</p>
                  <p className="truncate text-[10px] text-[var(--color-text-muted)]">
                    {item.phase_name
                      ? `${item.phase_name} · submitted`
                      : "submitted for review"}
                    {item.updated_at ? ` · ${timeAgo(item.updated_at)}` : ""}
                  </p>
                </div>
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]" />
              </button>
            ))}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="border-t border-[var(--color-border)] px-4 py-2">
        <button
          onClick={() => {
            router.push("/dashboard/onboardings?filter=awaiting_review");
            onClose();
          }}
          className="text-xs font-medium text-[var(--color-accent)] hover:underline"
        >
          View all pending →
        </button>
      </div>
    </div>
  );
}

export default function SidebarNav({
  onClose,
  hasEnterpriseOnboarding,
  currentUserRole,
  notifications = [],
  messageUnread = 0,
}: {
  onClose?: () => void;
  hasEnterpriseOnboarding?: boolean;
  currentUserRole?: string | null;
  notifications?: NotificationItem[];
  messageUnread?: number;
}) {
  const isExternalViewer = currentUserRole === "external_viewer";
  const [panelOpen, setPanelOpen] = React.useState(false);
  const badgeAnchorRef = React.useRef<HTMLElement | null>(null);
  const navRef = React.useRef<HTMLElement | null>(null);

  const pendingCount = notifications.length;

  if (isExternalViewer) {
    return (
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <SectionLabel>Main</SectionLabel>
        <div className="flex flex-col gap-0.5">
          <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} onClose={onClose} />
          {hasEnterpriseOnboarding && (
            <NavItem href="/dashboard/events" label="Events" icon={CalendarDays} onClose={onClose} />
          )}
        </div>
        <SectionLabel>More</SectionLabel>
        <div className="flex flex-col gap-0.5">
          <NavItem href="/dashboard/support" label="Help & Support" icon={LifeBuoy} onClose={onClose} />
        </div>
      </nav>
    );
  }

  return (
    <nav ref={navRef as any} className="relative flex-1 overflow-y-auto px-3 py-4">
      {panelOpen && pendingCount > 0 && (
        <NotificationPanel
          items={notifications}
          anchorRef={badgeAnchorRef}
          onClose={() => setPanelOpen(false)}
        />
      )}

      <SectionLabel>Main</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard" label="Dashboard" icon={LayoutDashboard} onClose={onClose} />
        {hasEnterpriseOnboarding && (
          <NavItem href="/dashboard/events" label="Events" icon={CalendarDays} onClose={onClose} />
        )}
        <NavItem href="/dashboard/onboardings" label="Onboardings" icon={ClipboardList} onClose={onClose} />
        {hasEnterpriseOnboarding && (
          <NavItem
            href="/dashboard/messages"
            label="Messages"
            icon={MessageSquare}
            onClose={onClose}
            badge={messageUnread}
          />
        )}
        <NavItem href="/dashboard/clients" label="Clients" icon={User} onClose={onClose} />
        <NavItem href="/dashboard/followups" label="Follow-ups" icon={Bell} onClose={onClose} />
      </div>

      {hasEnterpriseOnboarding && (
        <>
          <SectionLabel>Review</SectionLabel>
          <div className="flex flex-col gap-0.5">
            <NavItem
              href="/dashboard/review-queue"
              label="Review Queue"
              icon={ShieldCheck}
              onClose={onClose}
              badge={pendingCount}
              onBadgeClick={() => setPanelOpen((o) => !o)}
            />
          </div>
        </>
      )}

      <SectionLabel>Manage</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard/templates" label="Templates" icon={LayoutTemplate} onClose={onClose} />
        <NavItem href="/dashboard/email" label="Email" icon={Mail} onClose={onClose} />
      </div>

      <SectionLabel>Team</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard/team" label="Team" icon={Users} onClose={onClose} />
        <NavItem href="/dashboard/settings" label="Settings" icon={Settings} onClose={onClose} />
      </div>

      <SectionLabel>More</SectionLabel>
      <div className="flex flex-col gap-0.5">
        <NavItem href="/dashboard/reports" label="Reports" icon={BarChart2} onClose={onClose} />
        <NavItem href="/dashboard/storage" label="Files & Signatures" icon={FolderOpen} onClose={onClose} />
        <NavItem href="/dashboard/audit" label="Activity & Timeline" icon={Clock} onClose={onClose} />
        <NavItem href="/dashboard/support" label="Help & Support" icon={LifeBuoy} onClose={onClose} />
      </div>
    </nav>
  );
}
