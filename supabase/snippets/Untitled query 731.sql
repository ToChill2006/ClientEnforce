update public.organizations
set
  stripe_customer_id = null,
  stripe_subscription_id = null,
  stripe_subscription_status = 'canceled'
where id = '5ed0a5b8-7d7a-4667-bbc9-2d9dfe0789ed';