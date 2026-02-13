# Wedding Invitation SaaS — MVP TODO

## Goal
End-to-end flow minimal: customer daftar → draft undangan → publish → domain aktif → undangan bisa diakses publik.

## Current State
- Backend Go + Gin + pgx sudah ada.
- Admin auth + CRUD invitations sudah ada.
- Public GET invitation pakai domain di `customers.domain`.
- Schema sudah: `customers(domain UNIQUE)` + `invitations(customer_id, slug)`.

## Missing MVP Items

### 1) Auto-set domain when publish
**Where:** admin invitation update flow

**Logic:**
- Saat `PATCH /api/v1/admin/invitations/:id` dengan `is_published=true`
- Jika `customers.domain` kosong:
  - set `domain = slug + "." + BASE_DOMAIN` (if BASE_DOMAIN is empty → set `domain = slug`)
- Jangan overwrite jika sudah ada.

**Notes:**
Perlu query update customer by `customer_id` di invitation.

---

### 2) Customer register + create draft invitation
**Endpoint:** `POST /api/v1/public/register`

**Input:**
```json
{
  "full_name": "string",
  "email": "string",
  "password": "string",
  "slug": "string",
  "title": "string"
}
```

**Flow:**
- Create customer (hash password)
- Create invitation draft:
  - `customer_id`
  - `slug`
  - `title` (optional)
  - `search_name` = title or full_name
  - `is_published = false`
  - `content = {}`
- Return `customer_id` + `invitation_id`

---

### 3) Optional: Customer login
Jika perlu akses editor sendiri.
- `POST /api/v1/public/login`
- JWT access + refresh (mirip admin).

---

## Minimal publish flow
1) Admin edit JSON draft
2) Admin set `is_published=true`
3) Backend auto-sets `customers.domain` if empty
4) Public URL:
   - `https://<slug>.<BASE_DOMAIN>/...`
   - Public GET: `/api/v1/public/invitations/:slug`

---

## Prompt (use next time)
"Continue MVP: implement auto-set domain on publish in admin invitation update. Implement public register endpoint that creates customer + invitation draft. Use existing Go structure (handlers/admin, handlers/public, service/admin, service/global, repository). Do NOT add tenant or customer_domains. Keep models per entity. Use pgx. Provide `POST /api/v1/public/register` and update admin patch flow to set customer.domain when publish."

## Guest Links (Public Page)
- Public URL should be `/{{owner}}/invitations/{{invitation_slug}}/{{guest_slug}}` (current implementation assumes owner == invitation slug; fix needed).
- `invitation_slug` must represent pasangan (invitation.slug) and be distinct from customer slug/domain.
- Update public handler to fetch by customer slug + invitation slug, not by owner alone.
- Front-end route should include invitation slug segment; map guest slug to display name (hyphen -> space).
- Remove any preview usage for guests; guests only on public page.

## Data Model Cleanup
- Clarify/rename fields: `customers.domain`/customer slug vs `invitations.slug` (wedding slug).
- Ensure API responses clearly expose both values so URL building is unambiguous.

## Guest List Storage
- Store only `content.guest.names: string[]` (no notes).
- Add UI list with `Tambah`/`Hapus` in customer/admin editor (decide scope).
- Generate shareable guest links using `guest_slug` derived from name.

