DROP TABLE IF EXISTS images;

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    image VARCHAR(300) NOT NULL,
    username VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DROP TABLE IF EXISTS comments CASCADE;

CREATE TABLE comments(
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) NOT NULL,
    comment TEXT,
    image_id SMALLINT REFERENCES images,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
