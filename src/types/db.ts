export type SubscriptionTier = "starter" | "pro" | "business";
export type MemberRole = "owner" | "admin" | "member";

export type Profile = {
  user_id: string;
  org_id: string;
  email: string;
  full_name: string | null;
};

export type Organization = {
  id: string;
  owner_user_id: string;
  name: string;
  subscription_tier: SubscriptionTier;
  seats_limit: number;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
};