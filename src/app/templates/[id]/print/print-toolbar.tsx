"use client";

import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export function PrintToolbar({ templateName }: { templateName: string }) {
  return (
    <div className="print-toolbar" role="toolbar" aria-label="Print actions">
      <Link href="/dashboard/templates" className="print-toolbar-back">
        <ArrowLeft className="h-4 w-4" aria-hidden /> Back to templates
      </Link>
      <div className="print-toolbar-spacer" aria-hidden />
      <button
        type="button"
        onClick={() => window.print()}
        className="print-toolbar-button"
        aria-label={`Save ${templateName} as PDF`}
      >
        <Printer className="h-4 w-4" aria-hidden /> Save as PDF
      </button>
    </div>
  );
}
