CREATE DATABASE sponsornet;

CREATE TABLE users (
    user_id VARCHAR(255) PRIMARY KEY,
    user_email VARCHAR(255),
    user_hashed_password VARCHAR(255)
);

INSERT INTO users(user_id, user_email, user_hashed_password) VALUES
	('user1', 'email1', 'pass1'),
	('user2', 'email2', 'pass2'),
	('user3', 'email3', 'pass3'),
	('user4', 'email4', 'pass4'),
	('user5', 'email5', 'pass5');
    
SELECT * FROM users;

CREATE TABLE events (
    event_id VARCHAR(255) PRIMARY KEY,
    user_id VARCHAR(255),
    event_name VARCHAR(255),
    event_type VARCHAR(255),
    event_date VARCHAR(255),
    event_footfall INT,
    sponsorship_amount INT, 
    deliverables VARCHAR(255),
    CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

INSERT INTO events VALUES
	('event1', 'user1', 'name1', 'type1', '2023-01-01', 1000, 10000, 'del1'),
	('event2', 'user1', 'name2', 'type2', '2023-02-02', 2000, 20000, 'del2'),
	('event3', 'user2', 'name3', 'type3', '2023-03-03', 3000, 30000, 'del3'),
	('event4', 'user4', 'name4', 'type4', '2023-04-04', 4000, 40000, 'del4'),
	('event5', 'user5', 'name5', 'type5', '2023-05-05', 5000, 50000, 'del5');
	
SELECT * FROM events;

CREATE TABLE applications (
    application_id VARCHAR(255) PRIMARY KEY,
    sponsor_id VARCHAR(255),
    event_id VARCHAR(255),
    sponsor_name VARCHAR(255),
    sponsor_phone VARCHAR(255),
    application_status VARCHAR(255),
    CONSTRAINT fk_sponsor_id FOREIGN KEY (sponsor_id) REFERENCES users(user_id) ON DELETE CASCADE,
    CONSTRAINT fk_event_id FOREIGN KEY (event_id) REFERENCES events(event_id) ON DELETE CASCADE
);

INSERT INTO applications VALUES
	('app1', 'user2', 'event1', 'sponsorname1', 'sponsorno1', 'pending'),
	('app2', 'user1', 'event1', 'sponsorname2', 'sponsorno2', 'pending'),
	('app3', 'user3', 'event1', 'sponsorname3', 'sponsorno3', 'pending'),
	('app4', 'user3', 'event2', 'sponsorname4', 'sponsorno4', 'pending'),
	('app5', 'user5', 'event5', 'sponsorname5', 'sponsorno5', 'pending');

SELECT * FROM applications;