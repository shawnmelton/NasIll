CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL,
    user_first_name VARCHAR(255) NOT NULL DEFAULT "",
    user_last_name VARCHAR(255) NOT NULL DEFAULT "",
    user_email VARCHAR(255) NOT NULL DEFAULT "",
    user_date_added DATETIME NOT NULL DEFAULT 0,
    PRIMARY KEY(user_id)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS album_covers (
    cover_id SERIAL,
    user_id BIGINT UNSIGNED NOT NULL,
    cover_uploaded_photo VARCHAR(255) NOT NULL DEFAULT "",
    cover_art_photo VARCHAR(255) NOT NULL DEFAULT "",
    cover_date_added DATETIME NOT NULL DEFAULT 0,
    PRIMARY KEY(cover_id),
    FOREIGN KEY(user_id) REFERENCES users(user_id)
) ENGINE=InnoDB;