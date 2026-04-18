CREATE OR REPLACE FUNCTION auth_is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM "bd-users" WHERE id = auth.uid() AND role = 'admin'
  )
$$;

DROP POLICY IF EXISTS "auth delete bd-businesses" ON "bd-businesses";
DROP POLICY IF EXISTS "auth insert bd-businesses" ON "bd-businesses";
DROP POLICY IF EXISTS "auth select bd-businesses" ON "bd-businesses";
DROP POLICY IF EXISTS "auth update bd-businesses" ON "bd-businesses";
DROP POLICY IF EXISTS "admin or owner select" ON "bd-businesses";
DROP POLICY IF EXISTS "admin or owner write" ON "bd-businesses";

CREATE POLICY "admin or owner select" ON "bd-businesses"
  FOR SELECT TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR owner_id = auth.uid()
  );

CREATE POLICY "owner insert bd-businesses" ON "bd-businesses"
  FOR INSERT TO authenticated
  WITH CHECK (
    owner_id = auth.uid()
    AND status = 'pending'
  );

CREATE POLICY "owner update bd-businesses" ON "bd-businesses"
  FOR UPDATE TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR owner_id = auth.uid()
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR (
      owner_id = auth.uid()
      AND status = (SELECT status FROM "bd-businesses" WHERE id = "bd-businesses".id)
    )
  );

CREATE POLICY "admin all bd-businesses" ON "bd-businesses"
  FOR ALL TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

ALTER TABLE "bd-business-media" ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Authenticated full access" ON "bd-business-media";
CREATE POLICY "admin or owner bd-business-media" ON "bd-business-media"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "auth delete bd-business-facilities" ON "bd-business-facilities";
DROP POLICY IF EXISTS "auth insert bd-business-facilities" ON "bd-business-facilities";
DROP POLICY IF EXISTS "auth select bd-business-facilities" ON "bd-business-facilities";
DROP POLICY IF EXISTS "auth update bd-business-facilities" ON "bd-business-facilities";
CREATE POLICY "admin or owner bd-business-facilities" ON "bd-business-facilities"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "auth delete bd-business-features" ON "bd-business-features";
DROP POLICY IF EXISTS "auth insert bd-business-features" ON "bd-business-features";
DROP POLICY IF EXISTS "auth select bd-business-features" ON "bd-business-features";
DROP POLICY IF EXISTS "auth update bd-business-features" ON "bd-business-features";
CREATE POLICY "admin or owner bd-business-features" ON "bd-business-features"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "auth delete bd-business-hours" ON "bd-business-hours";
DROP POLICY IF EXISTS "auth insert bd-business-hours" ON "bd-business-hours";
DROP POLICY IF EXISTS "auth select bd-business-hours" ON "bd-business-hours";
DROP POLICY IF EXISTS "auth update bd-business-hours" ON "bd-business-hours";
CREATE POLICY "admin or owner bd-business-hours" ON "bd-business-hours"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "auth delete bd-business-payment-methods" ON "bd-business-payment-methods";
DROP POLICY IF EXISTS "auth insert bd-business-payment-methods" ON "bd-business-payment-methods";
DROP POLICY IF EXISTS "auth select bd-business-payment-methods" ON "bd-business-payment-methods";
DROP POLICY IF EXISTS "auth update bd-business-payment-methods" ON "bd-business-payment-methods";
CREATE POLICY "admin or owner bd-business-payment-methods" ON "bd-business-payment-methods"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "auth delete bd-business-services" ON "bd-business-services";
DROP POLICY IF EXISTS "auth insert bd-business-services" ON "bd-business-services";
DROP POLICY IF EXISTS "auth select bd-business-services" ON "bd-business-services";
DROP POLICY IF EXISTS "auth update bd-business-services" ON "bd-business-services";
CREATE POLICY "admin or owner bd-business-services" ON "bd-business-services"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "auth delete bd-business-tags" ON "bd-business-tags";
DROP POLICY IF EXISTS "auth insert bd-business-tags" ON "bd-business-tags";
DROP POLICY IF EXISTS "auth select bd-business-tags" ON "bd-business-tags";
DROP POLICY IF EXISTS "auth update bd-business-tags" ON "bd-business-tags";
CREATE POLICY "admin or owner bd-business-tags" ON "bd-business-tags"
  FOR ALL TO authenticated
  USING (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  )
  WITH CHECK (
    (SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin'
    OR EXISTS (SELECT 1 FROM "bd-businesses" WHERE id = business_id AND owner_id = auth.uid())
  );

DROP POLICY IF EXISTS "Authenticated users can delete business-categories" ON "bd-business-categories";
DROP POLICY IF EXISTS "Authenticated users can insert business-categories" ON "bd-business-categories";
DROP POLICY IF EXISTS "Authenticated users can update business-categories" ON "bd-business-categories";
CREATE POLICY "admin insert bd-business-categories" ON "bd-business-categories"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-business-categories" ON "bd-business-categories"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-business-categories" ON "bd-business-categories"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Authenticated users can delete business-subcategories" ON "bd-business-subcategories";
DROP POLICY IF EXISTS "Authenticated users can insert business-subcategories" ON "bd-business-subcategories";
DROP POLICY IF EXISTS "Authenticated users can update business-subcategories" ON "bd-business-subcategories";
CREATE POLICY "admin insert bd-business-subcategories" ON "bd-business-subcategories"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-business-subcategories" ON "bd-business-subcategories"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-business-subcategories" ON "bd-business-subcategories"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Authenticated users can delete countries" ON "bd-countries";
DROP POLICY IF EXISTS "Authenticated users can insert countries" ON "bd-countries";
DROP POLICY IF EXISTS "Authenticated users can update countries" ON "bd-countries";
CREATE POLICY "admin insert bd-countries" ON "bd-countries"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-countries" ON "bd-countries"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-countries" ON "bd-countries"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Authenticated users can delete divisions" ON "bd-divisions";
DROP POLICY IF EXISTS "Authenticated users can insert divisions" ON "bd-divisions";
DROP POLICY IF EXISTS "Authenticated users can update divisions" ON "bd-divisions";
CREATE POLICY "admin insert bd-divisions" ON "bd-divisions"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-divisions" ON "bd-divisions"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-divisions" ON "bd-divisions"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Authenticated users can delete districts" ON "bd-districts";
DROP POLICY IF EXISTS "Authenticated users can insert districts" ON "bd-districts";
DROP POLICY IF EXISTS "Authenticated users can update districts" ON "bd-districts";
CREATE POLICY "admin insert bd-districts" ON "bd-districts"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-districts" ON "bd-districts"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-districts" ON "bd-districts"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Authenticated users can delete upazilas" ON "bd-upazilas";
DROP POLICY IF EXISTS "Authenticated users can insert upazilas" ON "bd-upazilas";
DROP POLICY IF EXISTS "Authenticated users can update upazilas" ON "bd-upazilas";
CREATE POLICY "admin insert bd-upazilas" ON "bd-upazilas"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-upazilas" ON "bd-upazilas"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-upazilas" ON "bd-upazilas"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "bd-facilities_authenticated_all_ops" ON "bd-facilities";
CREATE POLICY "all read bd-facilities" ON "bd-facilities"
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert bd-facilities" ON "bd-facilities"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-facilities" ON "bd-facilities"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-facilities" ON "bd-facilities"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Authenticated full access" ON "bd-features";
CREATE POLICY "all read bd-features" ON "bd-features"
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert bd-features" ON "bd-features"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-features" ON "bd-features"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-features" ON "bd-features"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "Payment methods full access (authenticated)" ON "bd-payment-methods";
CREATE POLICY "all read bd-payment-methods" ON "bd-payment-methods"
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert bd-payment-methods" ON "bd-payment-methods"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-payment-methods" ON "bd-payment-methods"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-payment-methods" ON "bd-payment-methods"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "bd-services auth all crud" ON "bd-services";
CREATE POLICY "all read bd-services" ON "bd-services"
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert bd-services" ON "bd-services"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-services" ON "bd-services"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-services" ON "bd-services"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "bd-tags_auth_all_ops" ON "bd-tags";
CREATE POLICY "all read bd-tags" ON "bd-tags"
  FOR SELECT TO authenticated USING (true);
CREATE POLICY "admin insert bd-tags" ON "bd-tags"
  FOR INSERT TO authenticated
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin update bd-tags" ON "bd-tags"
  FOR UPDATE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');
CREATE POLICY "admin delete bd-tags" ON "bd-tags"
  FOR DELETE TO authenticated
  USING ((SELECT role FROM "bd-users" WHERE id = auth.uid()) = 'admin');

DROP POLICY IF EXISTS "own profile read" ON "bd-users";
DROP POLICY IF EXISTS "own profile update" ON "bd-users";
CREATE POLICY "own profile read" ON "bd-users"
  FOR SELECT TO authenticated
  USING (auth.uid() = id OR auth_is_admin());
CREATE POLICY "own profile update" ON "bd-users"
  FOR UPDATE TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);
