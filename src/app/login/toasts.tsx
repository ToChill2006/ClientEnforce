"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";

export default function LoginToasts({ verified }: { verified: boolean }) {
  const { toast } = useToast();

  React.useEffect(() => {
    if (!verified) return;
    toast({
      title: "Email verified",
      description: "Your account is ready. Please log in.",
      variant: "success",
    });
  }, [verified, toast]);

  return null;
}
