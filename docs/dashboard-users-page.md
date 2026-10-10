# صفحه‌ی کاربران داشبورد (افراد و مهمانان)

مسیر: `/dashboard/users` — فهرست **کاربران مهمان** با فیلتر، صفحه‌بندی و
عملیات مدیریتی، روی همان کامپوننت `Table` مشترک داشبورد.

## دامنه

- فقط کاربرانی که نقششان `guest` است نمایش داده می‌شوند؛ مدیران/مالکان در این
  لیست نمی‌آیند (صفحه‌ی «مدیران» جداست).
- فیلترها: **وضعیت حساب** (فعال/غیرفعال) و **جستجو** روی ایمیل / نام / تلفن.
- صفحه‌بندی **URL-محور** (سرور-ساید) با کامپوننت `Pagination` موجود.

## API

روتر کاربران در `routes/index.ts` روی مسیر مفرد `/user` مانت شده است.

| متد | مسیر | دسترسی | توضیح |
| --- | --- | --- | --- |
| `GET` | `/api/v1/user` | admin, owner | لیست کاربران مهمان (صفحه‌بندی‌شده) |
| `PATCH` | `/api/v1/user/:id/status` | admin, owner | فعال/غیرفعال‌کردن حساب |
| `PATCH` | `/api/v1/user/:id/role` | owner | تغییر نقش |

**کوئری لیست:** `page`, `limit` (≤۱۰۰), `q` (حداقل ۲ کاراکتر), `active`
(`true`/`false`).

**پاسخ:**
```jsonc
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": 5,
        "email": "guest@example.com",
        "role": "guest",
        "active": true,
        "lastLoginAttempt": null,
        "lockedUntil": null,
        "createdAt": "2026-10-10T09:05:08.326Z",
        "guest": {
          "id": 6, "fullName": "Sara Ahmadi", "phoneNumber": "0912...",
          "nationalId": null, "dateOfBirth": null, "gender": null
        }
      }
    ],
    "meta": { "totalItems": 1, "totalPages": 1, "currentPage": 1, "limit": 10,
              "hasNextPage": false, "hasPrevPage": false }
  }
}
```

**نکات امنیتی:**
- `password` هرگز در پاسخ نمی‌آید (select مشترک `adminUserSelect`).
- هدف عملیات‌ها همیشه یک کاربرِ **مهمان** است (`findGuestById` با شرط
  `role: "guest"`)؛ در نتیجه admin نمی‌تواند حساب مدیران/مالکان را تغییر دهد.
- تغییر نقش فقط برای `owner` مجاز است (`restrictTo("owner")`).

> ⚠️ ارتقای نقش یک مهمان (مثلاً به `admin`) او را از این لیست خارج می‌کند
> (چون دامنه‌ی لیست `role = guest` است). این رفتار عمدی است: کاربر به سمت
> «مدیران» منتقل می‌شود.

## معماری فرانت

```
Server page (app/(dashboard)/dashboard/users/page.tsx)
  ├─ fetchUsers(toUsersApiQuery(filters))   → authFetch("user?…")
  └─ getCurrentRole()                       → تعیین canManageRoles (owner)
        ↓ props
  UsersTable (client) ── Table مشترک
        ├─ UserRoleBadge / UserStatusBadge
        ├─ UserRowMenu → UserDetailsModal · ConfirmModal · UserRoleModal
        └─ FeedbackBanner (نتیجه‌ی Server Action)
```

**فایل‌های فیچر:** `src/features/dashboard/users/`
- `lib/user-filters.ts` — پارس URL + ساخت کوئری API (منبع حقیقت: URL).
- `services/users.api.server.ts` — لایه‌ی داده‌ی سرور-ساید (`authFetch`).
- `actions/user.actions.ts` — Server Actionهای `setUserStatusAction` و
  `setUserRoleAction` (به‌همراه `revalidatePath`).
- `types/user.types.ts` — تایپ `AdminUser` + برچسب‌های فارسی.
- `components/` — `UsersTable`, `UsersFilters`, `UserRowMenu`,
  `UserDetailsModal`, `UserRoleModal`, `UserRoleBadge`, `UserStatusBadge`.

## منوی ردیف

| آیتم | رفتار |
| --- | --- |
| جزییات کاربر | مودال فقط‌خواندنی (حساب + پروفایل مهمان + امنیت حساب) |
| فعال/غیرفعال کردن حساب | `ConfirmModal` → `PATCH /user/:id/status` |
| تغییر نقش | `UserRoleModal` (رادیویی) → `PATCH /user/:id/role` — **فقط مالک** |

## تأیید

| بررسی | نتیجه |
| --- | --- |
| `tsc --noEmit` (Next) | ۰ خطا |
| `eslint` (Next) | ۰ خطا |
| `next build` | موفق (روت `/dashboard/users` ثبت شد) |
| API `test:unit` | ۳۶۴/۳۶۴ |
| API `test:integration` | ۲۳۵/۲۳۵ (۹ تست جدید کاربران) |
| smoke test زنده | لیست/فیلترها/عملیات + رندر صفحه ✅ |
