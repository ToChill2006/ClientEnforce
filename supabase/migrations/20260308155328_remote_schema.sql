drop extension if exists "pg_net";

drop policy "memberships_select" on "public"."memberships";

drop policy "memberships_delete_admin" on "public"."memberships";

drop policy "memberships_insert_admin" on "public"."memberships";

drop policy "memberships_update_admin" on "public"."memberships";


  create policy "memberships_select_own"
  on "public"."memberships"
  as permissive
  for select
  to public
using ((user_id = auth.uid()));



  create policy "onboardings_insert_members"
  on "public"."onboardings"
  as permissive
  for insert
  to public
with check ((EXISTS ( SELECT 1
   FROM public.memberships m
  WHERE ((m.org_id = onboardings.org_id) AND (m.user_id = auth.uid())))));



  create policy "memberships_delete_admin"
  on "public"."memberships"
  as permissive
  for delete
  to public
using ((auth.uid() IS NOT NULL));



  create policy "memberships_insert_admin"
  on "public"."memberships"
  as permissive
  for insert
  to public
with check ((auth.uid() IS NOT NULL));



  create policy "memberships_update_admin"
  on "public"."memberships"
  as permissive
  for update
  to public
using ((auth.uid() IS NOT NULL))
with check ((auth.uid() IS NOT NULL));



