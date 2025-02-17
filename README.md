# Advanced Containers Assignment

## Overview
This project demonstrates a containerized web application using Docker and Docker Compose. It includes a Node.js API server, a MySQL database, and an Nginx reverse proxy for load balancing. The setup ensures scalability, security, and persistent data storage.

## Project Structure
```
📂 USER-API
 ├── 📜 server.js          # Node.js application
 ├── 📜 docker-compose.yml # Docker Compose configuration
 ├── 📜 Dockerfile         # Dockerfile for the web application
 ├── 📜 nginx.conf         # Nginx configuration for load balancing
 ├── 📜 .env.sample        # Example environment variables file
 ├── 📜 README.md          # Project documentation
```

## Prerequisites
- Docker & Docker Compose installed
- Node.js & MySQL installed

## Setup Instructions

### Step 1: Clone the Repository
```sh
git clone git@github.com:farzanapasha/user-api.git
cd user-api
```

### Step 2: Create an `.env` file. Or create one from .env.sample
Create a `.env` file in the project root and configure environment variables:
```ini
MYSQL_ROOT_PASSWORD=your_root_password
MYSQL_DATABASE=your_database_name
MYSQL_USER=your_db_user
MYSQL_PASSWORD=your_db_password
NODE_ENV=production
NODE_USER=node
```

### Step 3: Build and Start the Containers
```sh
docker-compose -p 'user' up --build -d
```

### Step 4: Verify Running Containers
```sh
docker ps
```

## API Endpoints
| Method | Endpoint       | Description                      | Request Body                             | Response |
|--------|--------------|--------------------------------|---------------------------------|-----------|
| GET    | `/users`     | Fetch all users              | _None_                          | `{ data: { users: [...] } }` |
| GET    | `/users/:id` | Fetch a single user by ID    | _None_                          | `{ data: { user: {...} } }` |
| POST   | `/users`     | Add a new user               | `{ "name": "John", "email": "john@example.com", "password": "secret" }` | `{ data: { id, name, email } }` |
| PUT    | `/users/:id` | Update a user by ID         | `{ "name": "John", "email": "john@example.com", "password": "newpass" }` | `{ data: { id, name, email } }` |
| DELETE | `/users/:id` | Delete a user by ID         | _None_                          | `{ "message": "User deleted successfully" }` |

### Notes:
- `POST /users`: Requires `"name"`, `"email"`, and `"password"`.
- `PUT /users/:id`: Updates a user; all fields must be provided.
- `DELETE /users/:id`: Deletes the user with the specified ID.


### Example API Call
```sh
curl -X POST -H "Content-Type: application/json" -d '{"first_name": "John", "last_name": "Doe"}' http://localhost/user
```

## Docker Compose Configuration

### `docker-compose.yml`
```yaml
version: '3.8'
services:
  mysql:
    image: mysql:8.3.0
    container_name: db 
    environment:
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_general_ci
    volumes:
      - mysql:/var/lib/mysql
    networks:
      - nodejs-mysql
  
  app:
    image: node:20.11.0-alpine
    user: ${NODE_USER}
    working_dir: /home/node/app
    environment:
      - NODE_ENV=${NODE_ENV}
    command: "yarn start"
    deploy:
      replicas: 3
    volumes:
      - ./:/home/node/app
    depends_on:
      - mysql
    networks:
      - nodejs-mysql
  
  nginx:
    image: nginx:latest
    container_name: nginx
    restart: always
    depends_on:
      - app
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    networks:
      - nodejs-mysql

volumes:
  mysql:

networks:
  nodejs-mysql:
    driver: bridge
```

## Security Best Practices
- Uses minimal `alpine` images for the application.
- Runs containers as non-root users.
- Uses environment variables for secrets instead of hardcoding.
- Ensures the database container has authentication enabled.
- Restricts network access between services to minimize exposure.

## Stopping the Containers
```sh
docker-compose down
```

## Cleanup (Remove Volumes)
```sh
docker-compose down -v
```

## Contributors
- [Farzana Pasha J]

## License
This project is licensed under the MIT License.
