"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/lib/cn";
import { IconButton } from "./button";

type ModalSize = "sm" | "md" | "lg" | "xl";

const sizeWidths: Record<ModalSize, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-2xl",
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  size?: ModalSize;
  children: React.ReactNode;
  footer?: React.ReactNode;
  dismissOnBackdrop?: boolean;
  hideClose?: boolean;
};

export function Modal({
  open,
  onClose,
  title,
  description,
  size = "md",
  children,
  footer,
  dismissOnBackdrop = true,
  hideClose = false,
}: ModalProps) {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  React.useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-end justify-center overflow-y-auto px-3 pb-safe-bottom pt-8 sm:items-center sm:px-4 sm:py-12">
      <div
        className="fixed inset-0 bg-[var(--color-overlay)] animate-overlay-in"
        onClick={() => dismissOnBackdrop && onClose()}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full rounded-t-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-panel)] shadow-[var(--shadow-lg)] animate-dialog-in sm:rounded-[var(--radius-xl)]",
          sizeWidths[size]
        )}
      >
        {(title || !hideClose) && (
          <div className="flex items-start justify-between gap-4 px-5 pt-5">
            <div className="min-w-0 flex-1">
              {title && (
                <h2 className="text-base font-semibold leading-6 text-[var(--color-text-primary)]">{title}</h2>
              )}
              {description && (
                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{description}</p>
              )}
            </div>
            {!hideClose && (
              <IconButton
                aria-label="Close"
                size="sm"
                variant="ghost"
                onClick={onClose}
                className="-mr-1 -mt-1"
              >
                <X className="h-4 w-4" />
              </IconButton>
            )}
          </div>
        )}
        <div className={cn("px-5", title ? "pt-4" : "pt-5", footer ? "pb-4" : "pb-5")}>
          {children}
        </div>
        {footer && (
          <div className="flex flex-col-reverse gap-2 border-t border-[var(--color-border)] px-5 py-3 sm:flex-row sm:items-center sm:justify-end">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}

type ConfirmModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  description?: React.ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
};

export function ConfirmModal({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
}: ConfirmModalProps) {
  const [busy, setBusy] = React.useState(false);
  const handle = async () => {
    try {
      setBusy(true);
      await onConfirm();
    } finally {
      setBusy(false);
    }
  };
  // Lazy-import Button to avoid cycles
  const { Button } = require("./button") as typeof import("./button");
  return (
    <Modal
      open={open}
      onClose={busy ? () => {} : onClose}
      size="sm"
      title={title}
      description={description}
      footer={
        <>
          <Button variant="secondary" onClick={onClose} disabled={busy}>
            {cancelLabel}
          </Button>
          <Button variant={destructive ? "danger" : "primary"} onClick={handle} loading={busy}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      <div className="sr-only">{title}</div>
    </Modal>
  );
}
