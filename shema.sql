CREATE TABLE IF NOT EXISTS users (
    user_id SERIAL,
    user_name VARCHAR(255) NOT NULL DEFAULT "",
    user_email VARCHAR(255) NOT NULL DEFAULT "",
    user_uploaded_photo VARCHAR(255) NOT NULL DEFAULT "",
    user_album_cover VARCHAR(255) NOT NULL DEFAULT "",
    user_date_added DATETIME NOT NULL DEFAULT 0,
    PRIMARY KEY(user_id)
) ENGINE=InnoDB;