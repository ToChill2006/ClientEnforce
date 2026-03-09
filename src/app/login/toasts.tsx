"use client";

import * as React from "react";
import { useToast } from "@/components/ui/toast";

export default function LoginToasts({ verified, reset }: { verified: boolean; reset: boolean }) {
  const { toast } = useToast();

  React.useEffect(() => {
    if (!verified) return;
    toast({
      title: "Email verified",
      description: "Your account is ready. Please log in.",
      variant: "success",
    });
  }, [verified, toast]);

  React.useEffect(() => {
    if (!reset) return;
    toast({
      title: "Password updated",
      description: "Use your new password to log in.",
      variant: "success",
    });
  }, [reset, toast]);

  return null;
}
