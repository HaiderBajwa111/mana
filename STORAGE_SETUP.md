# Supabase Storage Setup for MANA

This document outlines the storage functionality implemented for handling user photos and sample work uploads during onboarding.

## Overview

The storage system supports two types of photo uploads:

- **Profile Pictures**: Single image per user
- **Sample Work Photos**: Multiple images per user (up to 10)

## Storage Structure

### Bucket: `user-uploads`

The storage is organized in the following folder structure:

```
user-uploads/
├── {USER_ID}/
│   ├── profile_picture/
│   │   └── profile_{UUID}.{EXTENSION}
│   ├── sample_photos/
│   │    ├── sample_{UUID}.{EXTENSION}
│   │    └── {PROJECT_ID}/
│   |        └── sample_{UUID}.{EXTENSION}

```

### File Naming Convention

- **Profile Pictures**: `profile_{UUID}.{extension}`
- **Sample Work**: `sample_{UUID}.{extension}`
- **Project-specific**: `{PROJECT_ID}/sample_{UUID}.{extension}`

## Database Schema

### UserPhoto Model

```sql
model UserPhoto {
  id        Int       @id @default(autoincrement())
  userId    Int
  photoType String    // "profile_picture" or "sample_work"
  fileName  String
  fileUrl   String
  fileSize  Int
  mimeType  String
  createdAt DateTime? @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### SampleWorkPhoto Model

```sql
model SampleWorkPhoto {
  id        Int       @id @default(autoincrement())
  userId    Int
  projectId String?   // Optional project identifier
  fileName  String
  fileUrl   String
  fileSize  Int
  mimeType  String
  createdAt DateTime? @default(now())
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## File Validation

### Supported Formats

- JPEG/JPG
- PNG
- WebP
- GIF

### Size Limits

- **Maximum file size**: 10MB per file
- **Maximum sample photos**: 10 per user
- **Profile picture**: 1 per user

### Validation Rules

- File type must be in allowed list
- File size must be under 10MB
- File name must be valid and under 255 characters
- Maximum 10 sample work photos per user

## Implementation Files

### Server-side Storage (`src/lib/storage.ts`)

- `uploadProfilePicture()`: Uploads profile pictures
- `uploadSampleWorkPhoto()`: Uploads sample work photos
- `deleteFile()`: Deletes files from storage
- `validateImageFile()`: Validates file before upload

### Client-side Utilities (`src/lib/storage-client.ts`)

- File validation functions
- File preview creation
- Error handling utilities
- File size formatting

### Database Integration (`src/app/actions/onboarding/save-onboarding.ts`)

- Handles photo uploads during onboarding
- Saves file metadata to database
- Updates user profile with photo URLs

## Usage Examples

### Profile Picture Upload

```typescript
const result = await uploadProfilePicture(userId, file);
if (result.success) {
  const fileUrl = result.data?.fileUrl;
  // Save to database and update user profile
}
```

### Sample Work Upload

```typescript
const result = await uploadSampleWorkPhoto(userId, file, projectId);
if (result.success) {
  const fileUrl = result.data?.fileUrl;
  // Save to database
}
```

### Client-side Validation

```typescript
import { validateImageFile } from "@/lib/storage-client";

const validation = validateImageFile(file);
if (!validation.isValid) {
  console.error(validation.error);
  return;
}
```

## Security Considerations

1. **File Type Validation**: Only allows specific image formats
2. **Size Limits**: Prevents large file uploads
3. **User Isolation**: Files are stored in user-specific folders
4. **Unique Naming**: Uses UUIDs to prevent filename conflicts
5. **Database Tracking**: All uploads are tracked in the database

## Error Handling

The system includes comprehensive error handling:

- File validation errors
- Storage upload failures
- Database save errors
- Network connectivity issues

All errors are logged and user-friendly messages are displayed.

## Migration

To set up the storage system:

1. **Create Supabase bucket**:

   ```sql
   -- In Supabase dashboard or via API
   -- Create bucket named 'user-uploads'
   -- Set public access policies
   ```

2. **Run database migration**:

   ```bash
   npx prisma migrate dev --name add_user_photos_and_sample_work
   ```

3. **Set up storage policies**:
   ```sql
   -- Allow authenticated users to upload
   -- Allow public read access for profile pictures
   -- Restrict sample work access as needed
   ```

## Environment Variables

Ensure these are set in your `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Testing

To test the storage functionality:

1. Complete maker onboarding with profile picture
2. Upload sample work photos
3. Verify files appear in Supabase storage
4. Check database records are created
5. Verify public URLs work correctly
