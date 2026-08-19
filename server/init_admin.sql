-- ======================================================================
-- Admin Credentials Initialization Script for Portfolio Database
-- Email: naveenkumarrnk6677@gmail.com
-- Password: Admin@123
-- Role: ROLE_ADMIN
-- ======================================================================

-- For MySQL:
INSERT INTO USERS (username, email, password, role, created_at)
VALUES (
    'naveenkumar',
    'naveenkumarrnk6677@gmail.com',
    '$2a$10$w81s7qQ64E.n8aK7B77M8.hO3pD7O6b6k8L7H2ZkQ3J6k4P3s1e8.', 
    'ROLE_ADMIN',
    NOW()
)
ON DUPLICATE KEY UPDATE
    email = VALUES(email),
    password = VALUES(password),
    role = VALUES(role);

-- For PostgreSQL / Supabase (if using Postgres):
-- INSERT INTO "users" (username, email, password, role, created_at)
-- VALUES (
--     'naveenkumar',
--     'naveenkumarrnk6677@gmail.com',
--     '$2a$10$w81s7qQ64E.n8aK7B77M8.hO3pD7O6b6k8L7H2ZkQ3J6k4P3s1e8.',
--     'ROLE_ADMIN',
--     NOW()
-- )
-- ON CONFLICT (email) DO UPDATE 
-- SET password = EXCLUDED.password, role = EXCLUDED.role;
