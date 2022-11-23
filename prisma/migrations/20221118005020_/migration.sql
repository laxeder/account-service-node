-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uid` BIGINT NOT NULL,
    `uuid` VARCHAR(36) NOT NULL,
    `first_name` VARCHAR(50) NOT NULL,
    `last_name` VARCHAR(50) NOT NULL,
    `full_name` VARCHAR(100) NOT NULL,
    `email` VARCHAR(50) NOT NULL,
    `phone` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `salt` VARCHAR(16) NOT NULL,
    `enabled` BOOLEAN NOT NULL DEFAULT true,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_uid_key`(`uid`),
    UNIQUE INDEX `Users_uuid_key`(`uuid`),
    UNIQUE INDEX `Users_email_key`(`email`),
    INDEX `Users_uid_uuid_email_phone_first_name_full_name_password_idx`(`uid`, `uuid`, `email`, `phone`, `first_name`, `full_name`, `password`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Accounts` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `birthdate` DATETIME(3) NOT NULL,
    `cpf` VARCHAR(14) NOT NULL,
    `rg` VARCHAR(32) NOT NULL,
    `nickname` VARCHAR(32) NOT NULL,
    `picture` BLOB NOT NULL,
    `profession` VARCHAR(50) NOT NULL,
    `company` VARCHAR(50) NOT NULL,
    `description` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `Accounts_uuid_key`(`uuid`),
    UNIQUE INDEX `Accounts_cpf_key`(`cpf`),
    UNIQUE INDEX `Accounts_rg_key`(`rg`),
    UNIQUE INDEX `Accounts_nickname_key`(`nickname`),
    INDEX `Accounts_uuid_cpf_rg_nickname_idx`(`uuid`, `cpf`, `rg`, `nickname`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Addresses` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `uuid` VARCHAR(36) NOT NULL,
    `street` VARCHAR(50) NOT NULL,
    `number` VARCHAR(50) NOT NULL,
    `complement` VARCHAR(100) NOT NULL,
    `neighborhood` VARCHAR(100) NOT NULL,
    `city` VARCHAR(100) NOT NULL,
    `state` VARCHAR(50) NOT NULL,
    `zipcode` VARCHAR(11) NOT NULL,

    UNIQUE INDEX `Addresses_uuid_key`(`uuid`),
    INDEX `Addresses_uuid_zipcode_city_state_idx`(`uuid`, `zipcode`, `city`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Accounts` ADD CONSTRAINT `Accounts_uuid_fkey` FOREIGN KEY (`uuid`) REFERENCES `Users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Addresses` ADD CONSTRAINT `Addresses_uuid_fkey` FOREIGN KEY (`uuid`) REFERENCES `Users`(`uuid`) ON DELETE RESTRICT ON UPDATE CASCADE;
