# Image storage setup (S3)

Blog cover images and in-article images are uploaded straight from the admin
browser to an S3 bucket using a short-lived presigned URL. The image file never
passes through the website server.

You have two options. **Option A (MinIO on Dokploy)** keeps everything on your
own server and costs nothing extra. **Option B (AWS S3)** if you'd rather use
Amazon.

---

## Option A — MinIO on Dokploy (recommended for you)

### 1. Create the Compose service

In Dokploy: **Create Compose**

| Field | Value |
|---|---|
| Name | `spv-s3` |
| App Name | `spv-spvs3` (leave as generated) |
| Compose Type | **Docker Compose** |

> Choose **Docker Compose**, not **Stack**. Stack deploys through Docker Swarm,
> which makes named volumes and domain routing harder to set up than they need
> to be here.

Paste the contents of [`deploy/minio-compose.yml`](../deploy/minio-compose.yml)
into the compose editor.

### 2. Set the environment variables

In the service's **Environment** tab:

```
MINIO_ROOT_USER=spvadmin
MINIO_ROOT_PASSWORD=<a long random password you generate>
MINIO_CORS_ORIGINS=https://yourdomain.com
MINIO_CONSOLE_URL=https://console-s3.yourdomain.com
```

Generate the password with:

```bash
openssl rand -base64 24
```

`MINIO_CORS_ORIGINS` must be the exact origin the admin panel is served from —
this is what allows the browser to `PUT` the image into the bucket. Use a comma
to list more than one (for example to add `http://localhost:3000` while you are
developing).

### 3. Add the two domains

In the service's **Domains** tab, add:

| Domain | Container Port | Purpose |
|---|---|---|
| `s3.yourdomain.com` | `9000` | The S3 API — the site talks to this |
| `console-s3.yourdomain.com` | `9001` | The MinIO web admin UI |

Enable HTTPS on both. Then **Deploy**.

### 4. Create the bucket

Open `https://console-s3.yourdomain.com` and sign in with `MINIO_ROOT_USER` /
`MINIO_ROOT_PASSWORD`.

1. **Buckets → Create Bucket**
2. Name it `spv-blog`
3. Create

### 5. Make the images publicly readable

Blog images must be viewable by anyone visiting the website.

**Buckets → spv-blog → Anonymous → Add Access Rule**

| Field | Value |
|---|---|
| Prefix | `blog/` |
| Access | **readonly** |

This makes anything under `blog/` world-readable — which is what the website
needs — while the rest of the bucket stays private. Uploads still require the
signed credentials, so no one else can put files in.

### 6. Create an access key for the website

**Access Keys → Create access key**

Copy the **Access Key** and **Secret Key** immediately — the secret is shown
only once.

### 7. Point the website at the bucket

Add these to the website's environment (Dokploy **Environment** tab for the
site service, and your local `.env` for development):

```
S3_REGION=us-east-1
S3_BUCKET=spv-blog
S3_ACCESS_KEY_ID=<the access key from step 6>
S3_SECRET_ACCESS_KEY=<the secret key from step 6>
S3_ENDPOINT=https://s3.yourdomain.com
S3_PUBLIC_BASE_URL=https://s3.yourdomain.com/spv-blog
```

MinIO does not have real regions, but the S3 signing algorithm requires one —
`us-east-1` is the conventional value and is what MinIO expects.

Redeploy the website. The **Upload image** button in the admin panel will now
work, and the "storage is not connected" hint disappears.

---

## Option B — AWS S3

### 1. Create the bucket

AWS Console → S3 → **Create bucket**

- Name: `spv-blog` (bucket names are globally unique, so add a suffix if taken)
- Region: `ap-south-1` (Mumbai — closest to Tamil Nadu)
- **Uncheck** "Block all public access" and confirm. The images have to be
  publicly readable.

### 2. Bucket policy — public read for blog images only

Bucket → **Permissions → Bucket policy**:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadBlogImages",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::spv-blog/blog/*"
    }
  ]
}
```

### 3. CORS — allow the browser to upload

Bucket → **Permissions → Cross-origin resource sharing (CORS)**:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["PUT", "GET"],
    "AllowedOrigins": ["https://yourdomain.com"],
    "ExposeHeaders": ["ETag"],
    "MaxAgeSeconds": 3000
  }
]
```

Add `http://localhost:3000` to `AllowedOrigins` while developing.

### 4. Create an IAM user for the website

IAM → **Users → Create user** → no console access → attach this inline policy:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::spv-blog/blog/*"
    }
  ]
}
```

Then **Security credentials → Create access key → Application running outside AWS**.

### 5. Point the website at the bucket

```
S3_REGION=ap-south-1
S3_BUCKET=spv-blog
S3_ACCESS_KEY_ID=<access key>
S3_SECRET_ACCESS_KEY=<secret key>
S3_ENDPOINT=
S3_PUBLIC_BASE_URL=https://spv-blog.s3.ap-south-1.amazonaws.com
```

Leave `S3_ENDPOINT` empty for real AWS — it is only for MinIO and other
S3-compatible services.

---

## How the upload works

1. Admin picks an image in the post editor.
2. The browser asks `POST /api/admin/upload-url` for a presigned `PUT`.
   The server checks the admin session, validates the file type, and signs a
   URL that is valid for 10 minutes.
3. The browser `PUT`s the file straight to the bucket. This is the step that
   needs the CORS rule.
4. The public URL is saved on the post.

Keys look like `blog/2026/a1b2c3d4-photo.jpg` — the random prefix means two
uploads with the same filename never overwrite each other.

Limits enforced by the app: JPEG, PNG, WebP, AVIF or GIF, max 10 MB.

## If an upload fails

| Symptom | Cause |
|---|---|
| "Image storage is not configured" | The `S3_*` variables are missing or the app was not restarted after adding them |
| Upload fails with status `0` or a CORS error in the console | The bucket's CORS rule does not list the site's exact origin (scheme + host + port) |
| Upload succeeds but the image is a broken icon | The public-read rule from step 5 / step 2 is missing, or `S3_PUBLIC_BASE_URL` is wrong |
| `403 SignatureDoesNotMatch` | `S3_REGION` does not match the bucket, or the access key is wrong |
