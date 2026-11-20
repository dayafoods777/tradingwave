# Multi-Tenant Data Isolation
**Classification:** `PROPOSED`

---

Every database table includes `tenant_id`. PostgreSQL Row-Level Security (RLS) ensures queries automatically scope to the authenticated user's tenant:

```sql
ALTER TABLE strategies ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation_policy ON strategies
    USING (tenant_id = current_setting('app.current_tenant_id')::uuid);
```
