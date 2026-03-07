"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

function isActive(currentPath: string, href: string) {
  if (href === "/dashboard") return currentPath === "/dashboard";
  return currentPath === href || currentPath.startsWith(href + "/");
}

type IconProps = { className?: string };

type BaseIconProps = IconProps & {
  viewBox?: string;
};

function BaseIcon({ className, viewBox = "0 0 24 24", children }: React.PropsWithChildren<BaseIconProps>) {
  return (
    <svg
      viewBox={viewBox}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      {children}
    </svg>
  );
}

function IconGrid({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <rect x="4" y="4" width="7" height="7" rx="1.5" />
      <rect x="13" y="4" width="7" height="7" rx="1.5" />
      <rect x="4" y="13" width="7" height="7" rx="1.5" />
      <rect x="13" y="13" width="7" height="7" rx="1.5" />
    </BaseIcon>
  );
}

function IconClipboard({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M9 5h6" />
      <path d="M10 3h4a2 2 0 0 1 2 2v2H8V5a2 2 0 0 1 2-2Z" />
      <path d="M8 7h8v14H8z" />
    </BaseIcon>
  );
}

function IconLayers({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M12 3 3 8l9 5 9-5-9-5Z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </BaseIcon>
  );
}

function IconBell({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" />
      <path d="M10 21a2 2 0 0 0 4 0" />
    </BaseIcon>
  );
}

function IconClock({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </BaseIcon>
  );
}

function IconFolder({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <path d="M3 7a2 2 0 0 1 2-2h5l2 2h9a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
    </BaseIcon>
  );
}

function IconUsers({ className }: IconProps) {
  // Cleaner, readable "team" icon at small sizes
  return (
    <BaseIcon className={className}>
      <circle cx="8" cy="9" r="3" />
      <circle cx="16" cy="9" r="3" />
      <path d="M2.5 20c.7-3.5 3.3-5.5 6-5.5" />
      <path d="M21.5 20c-.7-3.5-3.3-5.5-6-5.5" />
      <path d="M9.5 14.5h5" />
    </BaseIcon>
  );
}

function IconUser({ className }: IconProps) {
  return (
    <BaseIcon className={className}>
      <circle cx="12" cy="8" r="3.5" />
      <path d="M20 21c0-4-4-7-8-7s-8 3-8 7" />
    </BaseIcon>
  );
}

function IconSettings({ className }: IconProps) {
  // Lucide-style "settings" gear (crisper at small sizes)
  return (
    <BaseIcon className={className}>
      <path d="M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7Z" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 8.92 4.6 1.65 1.65 0 0 0 10 3.09V3a2 2 0 1 1 4 0v.09c0 .66.39 1.27 1 1.51.57.24 1.22.14 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06c-.47.6-.57 1.25-.33 1.82.24.61.85 1 1.51 1H21a2 2 0 1 1 0 4h-.09c-.66 0-1.27.39-1.51 1Z" />
    </BaseIcon>
  );
}

type NavItemProps = {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
};

function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const pathname = usePathname() || "/dashboard";
  const active = isActive(pathname, href);

  return (
    <Link
      href={href}
      className={
        "group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-normal transition-colors " +
        (active
          ? "bg-zinc-100 text-zinc-900"
          : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900")
      }
      aria-current={active ? "page" : undefined}
    >
      <Icon
        className={
          "h-5 w-5 shrink-0 " +
          (active ? "text-zinc-900" : "text-zinc-400 group-hover:text-zinc-700")
        }
      />
      <span className="truncate">{label}</span>
    </Link>
  );
}

export default function SidebarNav() {
  return (
    <aside className="flex h-screen w-[240px] shrink-0 flex-col border-r border-zinc-100 bg-white">
      <div className="px-3 pt-3 sm:px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 text-zinc-900 hover:bg-zinc-50"
          aria-label="ClientEnforce"
        >
          <span className="relative inline-flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-zinc-200 bg-white">
            <Image
              src="/C.png"
              alt="ClientEnforce"
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
          </span>
          <span className="text-sm font-semibold tracking-tight">ClientEnforce</span>
        </Link>
        <div className="mt-3 h-px w-full bg-zinc-100" />
      </div>

      <nav className="flex-1 px-2 pt-3 sm:px-3">
        <div className="flex flex-col gap-1">
          <NavItem href="/dashboard" label="Dashboard" icon={IconGrid} />
          <NavItem href="/dashboard/onboardings" label="Onboardings" icon={IconClipboard} />
          <NavItem href="/dashboard/templates" label="Templates" icon={IconLayers} />
          <NavItem href="/dashboard/followups" label="Follow-ups" icon={IconBell} />
          <NavItem href="/dashboard/audit" label="Activity & Timeline" icon={IconClock} />
          <NavItem href="/dashboard/storage" label="Files & Signatures" icon={IconFolder} />
          <NavItem href="/dashboard/clients" label="Clients" icon={IconUser} />
          <NavItem href="/dashboard/team" label="Team" icon={IconUsers} />
          <NavItem href="/dashboard/settings" label="Settings" icon={IconSettings} />
        </div>
      </nav>
    </aside>
  );
}