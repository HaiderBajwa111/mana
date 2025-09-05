-- CreateTable
CREATE TABLE "certifications" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "issuingBody" TEXT,

    CONSTRAINT "certifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "conversations" (
    "id" SERIAL NOT NULL,
    "projectId" INTEGER NOT NULL,
    "title" VARCHAR NOT NULL,

    CONSTRAINT "conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_preferred_materials" (
    "creatorProfileId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,

    CONSTRAINT "creator_preferred_materials_pkey" PRIMARY KEY ("creatorProfileId","materialId")
);

-- CreateTable
CREATE TABLE "creator_profiles" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "bio" TEXT,
    "location" VARCHAR,
    "designPreferences" TEXT,
    "canPickupLocally" BOOLEAN DEFAULT false,
    "creatorType" TEXT DEFAULT 'hobbyist',
    "accountType" TEXT DEFAULT 'individual',
    "businessName" VARCHAR,

    CONSTRAINT "creator_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "creator_stripe_accounts" (
    "id" SERIAL NOT NULL,
    "creatorProfileId" UUID NOT NULL,
    "stripeAccountId" TEXT NOT NULL,
    "stripeAccountEnabled" BOOLEAN DEFAULT false,
    "stripeAccountOnboardingComplete" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "creator_stripe_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "file_attachments" (
    "id" SERIAL NOT NULL,
    "messageId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "fileName" VARCHAR NOT NULL,
    "fileType" VARCHAR NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "file_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturer_certifications" (
    "manufacturerProfileId" UUID NOT NULL,
    "certificationId" INTEGER NOT NULL,

    CONSTRAINT "manufacturer_certifications_pkey" PRIMARY KEY ("manufacturerProfileId","certificationId")
);

-- CreateTable
CREATE TABLE "manufacturer_profiles" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "businessName" VARCHAR NOT NULL,
    "description" TEXT,
    "streetAddress" TEXT,
    "city" TEXT,
    "state" TEXT,
    "country" TEXT DEFAULT 'Unknown',
    "capabilities" TEXT,
    "shippingCapabilities" JSONB DEFAULT '{}',
    "printers" JSONB DEFAULT '[]',

    CONSTRAINT "manufacturer_profiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "manufacturer_stripe_accounts" (
    "id" SERIAL NOT NULL,
    "manufacturerProfileId" UUID NOT NULL,
    "stripeAccountId" TEXT NOT NULL,
    "stripeAccountEnabled" BOOLEAN DEFAULT false,
    "stripeAccountOnboardingComplete" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "manufacturer_stripe_accounts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "materials" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "materials_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "messages" (
    "id" SERIAL NOT NULL,
    "conversationId" INTEGER NOT NULL,
    "senderId" UUID NOT NULL,
    "content" TEXT NOT NULL,
    "isRead" BOOLEAN DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_statuses" (
    "id" SMALLSERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "payment_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "project_statuses" (
    "id" SMALLSERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "project_statuses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "projects" (
    "id" SERIAL NOT NULL,
    "creatorId" UUID NOT NULL,
    "manufacturerId" UUID,
    "statusId" SMALLINT NOT NULL DEFAULT 1,
    "paymentStatusId" SMALLINT NOT NULL DEFAULT 1,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6),

    CONSTRAINT "projects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMPTZ(6) NOT NULL,
    "userId" UUID,

    CONSTRAINT "session_pkey" PRIMARY KEY ("sid")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "username" VARCHAR,
    "email" VARCHAR NOT NULL,
    "externalAuthId" TEXT,
    "profilePictureUrl" TEXT,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,
    "firstName" VARCHAR,
    "lastName" VARCHAR,
    "onboardingCompleted" BOOLEAN DEFAULT false,
    "default_role" VARCHAR,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_photos" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "photoType" VARCHAR NOT NULL,
    "fileName" VARCHAR NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_photos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sample_work_photos" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "projectId" VARCHAR,
    "fileName" VARCHAR NOT NULL,
    "fileUrl" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" VARCHAR NOT NULL,
    "createdAt" TIMESTAMPTZ(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sample_work_photos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certifications_name_key" ON "certifications"("name");

-- CreateIndex
CREATE INDEX "conversations_projectId_idx" ON "conversations"("projectId");

-- CreateIndex
CREATE INDEX "creator_preferred_materials_materialId_idx" ON "creator_preferred_materials"("materialId");

-- CreateIndex
CREATE UNIQUE INDEX "creator_profiles_userId_key" ON "creator_profiles"("userId");

-- CreateIndex
CREATE INDEX "creator_profiles_userId_idx" ON "creator_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "creator_stripe_accounts_creatorProfileId_key" ON "creator_stripe_accounts"("creatorProfileId");

-- CreateIndex
CREATE INDEX "creator_stripe_accounts_creatorProfileId_idx" ON "creator_stripe_accounts"("creatorProfileId");

-- CreateIndex
CREATE INDEX "file_attachments_messageId_idx" ON "file_attachments"("messageId");

-- CreateIndex
CREATE INDEX "file_attachments_userId_idx" ON "file_attachments"("userId");

-- CreateIndex
CREATE INDEX "manufacturer_certifications_certificationId_idx" ON "manufacturer_certifications"("certificationId");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_profiles_userId_key" ON "manufacturer_profiles"("userId");

-- CreateIndex
CREATE INDEX "manufacturer_profiles_userId_idx" ON "manufacturer_profiles"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "manufacturer_stripe_accounts_manufacturerProfileId_key" ON "manufacturer_stripe_accounts"("manufacturerProfileId");

-- CreateIndex
CREATE INDEX "manufacturer_stripe_accounts_manufacturerProfileId_idx" ON "manufacturer_stripe_accounts"("manufacturerProfileId");

-- CreateIndex
CREATE UNIQUE INDEX "materials_name_key" ON "materials"("name");

-- CreateIndex
CREATE INDEX "messages_conversationId_idx" ON "messages"("conversationId");

-- CreateIndex
CREATE INDEX "messages_senderId_idx" ON "messages"("senderId");

-- CreateIndex
CREATE UNIQUE INDEX "payment_statuses_name_key" ON "payment_statuses"("name");

-- CreateIndex
CREATE UNIQUE INDEX "project_statuses_name_key" ON "project_statuses"("name");

-- CreateIndex
CREATE INDEX "projects_creatorId_idx" ON "projects"("creatorId");

-- CreateIndex
CREATE INDEX "projects_manufacturerId_idx" ON "projects"("manufacturerId");

-- CreateIndex
CREATE INDEX "projects_paymentStatusId_idx" ON "projects"("paymentStatusId");

-- CreateIndex
CREATE INDEX "projects_statusId_idx" ON "projects"("statusId");

-- CreateIndex
CREATE INDEX "session_userId_idx" ON "session"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_externalAuthId_key" ON "users"("externalAuthId");

-- CreateIndex
CREATE INDEX "user_photos_userId_idx" ON "user_photos"("userId");

-- CreateIndex
CREATE INDEX "user_photos_photoType_idx" ON "user_photos"("photoType");

-- CreateIndex
CREATE INDEX "sample_work_photos_userId_idx" ON "sample_work_photos"("userId");

-- CreateIndex
CREATE INDEX "sample_work_photos_projectId_idx" ON "sample_work_photos"("projectId");

-- AddForeignKey
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "projects"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creator_preferred_materials" ADD CONSTRAINT "creator_preferred_materials_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "creator_profiles"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creator_preferred_materials" ADD CONSTRAINT "creator_preferred_materials_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "materials"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creator_profiles" ADD CONSTRAINT "creator_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "creator_stripe_accounts" ADD CONSTRAINT "creator_stripe_accounts_creatorProfileId_fkey" FOREIGN KEY ("creatorProfileId") REFERENCES "creator_profiles"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "messages"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "file_attachments" ADD CONSTRAINT "file_attachments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacturer_certifications" ADD CONSTRAINT "manufacturer_certifications_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "certifications"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacturer_certifications" ADD CONSTRAINT "manufacturer_certifications_manufacturerProfileId_fkey" FOREIGN KEY ("manufacturerProfileId") REFERENCES "manufacturer_profiles"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacturer_profiles" ADD CONSTRAINT "manufacturer_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "manufacturer_stripe_accounts" ADD CONSTRAINT "manufacturer_stripe_accounts_manufacturerProfileId_fkey" FOREIGN KEY ("manufacturerProfileId") REFERENCES "manufacturer_profiles"("userId") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "messages" ADD CONSTRAINT "messages_senderId_fkey" FOREIGN KEY ("senderId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_manufacturerId_fkey" FOREIGN KEY ("manufacturerId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_paymentStatusId_fkey" FOREIGN KEY ("paymentStatusId") REFERENCES "payment_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "projects" ADD CONSTRAINT "projects_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "project_statuses"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "user_photos" ADD CONSTRAINT "user_photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "sample_work_photos" ADD CONSTRAINT "sample_work_photos_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
