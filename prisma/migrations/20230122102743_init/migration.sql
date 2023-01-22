-- CreateTable
CREATE TABLE `Map` (
    `id` INTEGER NOT NULL,
    `mapset_id` INTEGER NULL,
    `md5` TEXT NULL,
    `alternative_md5` TEXT NULL,
    `creator_id` INTEGER NULL,
    `creator_username` TEXT NULL,
    `game_mode` INTEGER NULL,
    `ranked_status` INTEGER NULL,
    `artist` TEXT NULL,
    `title` TEXT NULL,
    `source` TEXT NULL,
    `tags` TEXT NULL,
    `description` TEXT NULL,
    `difficulty_name` TEXT NULL,
    `length` INTEGER NULL,
    `bpm` INTEGER NULL,
    `difficulty_rating` DOUBLE NULL,
    `count_hitobject_normal` INTEGER NULL,
    `count_hitobject_long` INTEGER NULL,
    `play_count` INTEGER NULL,
    `fail_count` INTEGER NULL,
    `mods_pending` INTEGER NULL,
    `mods_accepted` INTEGER NULL,
    `mods_denied` INTEGER NULL,
    `mods_ignored` INTEGER NULL,
    `online_offset` INTEGER NULL,
    `clan_ranked` INTEGER NULL,

    INDEX `mapset_id`(`mapset_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Mapset` (
    `id` INTEGER NOT NULL,
    `creator_id` INTEGER NOT NULL,
    `creator_username` TEXT NOT NULL,
    `creator_avatar_url` TEXT NULL,
    `artist` TEXT NOT NULL,
    `title` TEXT NOT NULL,
    `source` TEXT NULL,
    `tags` TEXT NULL,
    `description` TEXT NULL,
    `date_submitted` DATE NULL,
    `date_last_updated` DATE NULL,
    `ranking_queue_status` INTEGER NULL,
    `ranking_queue_last_updated` DATE NULL,
    `ranking_queue_vote_count` INTEGER NULL,
    `mapset_ranking_queue_id` INTEGER NOT NULL,

    FULLTEXT INDEX `Mapset_title_artist_creator_username_idx`(`title`, `artist`, `creator_username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Map` ADD CONSTRAINT `Map_ibfk_1` FOREIGN KEY (`mapset_id`) REFERENCES `Mapset`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
