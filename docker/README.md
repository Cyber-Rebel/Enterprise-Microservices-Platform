# Docker Setup for Mino Project

This folder contains Docker configurations for all backend microservices.

## Services

| Service | Port | Description |
|---------|------|-------------|
| Auth | 3000 | User authentication & authorization |
| Product | 3001 | Product management |
| Cart | 3002 | Shopping cart |
| Order | 3003 | Order processing |
| Notification | 3004 | Email notifications |
| Seller Dashboard | 3005 | Seller analytics & management |
| AI Buddy | 3006 | AI chatbot assistant |
| MongoDB | 27017 | Database |
| Redis | 6379 | Cache |
| RabbitMQ | 5672/15672 | Message broker |

## Quick Start

### 1. Setup Environment

```bash
cd docker
cp .env.example .env
# Edit .env with your values
```

### 2. Build and Run All Services

```bash
# Build and start all services
docker-compose up -d --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### 3. Run Individual Services

```bash
# Start only specific services
docker-compose up -d auth product cart

# Rebuild a specific service
docker-compose up -d --build auth
```

## Development

### View Service Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f auth
```

### Access Services

- **RabbitMQ Management**: http://localhost:15672 (guest/guest)
- **Auth API**: http://localhost:3000/api/auth
- **Product API**: http://localhost:3001/api/products
- **Cart API**: http://localhost:3002/api/carts
- **Order API**: http://localhost:3003/api/orders
- **Seller API**: http://localhost:3005/api/seller

### Database Access

```bash
# MongoDB shell
docker exec -it mino-mongodb mongosh -u admin -p password123

# Redis CLI
docker exec -it mino-redis redis-cli
```

## Cleanup

```bash
# Stop and remove containers
docker-compose down

# Remove volumes (data)
docker-compose down -v

# Remove everything including images
docker-compose down -v --rmi all
```

## Troubleshooting

### Container not starting

```bash
# Check logs
docker-compose logs <service-name>

# Check health status
docker-compose ps
```

### Port already in use

```bash
# Find process using the port
sudo lsof -i :<port>

# Kill the process
kill -9 <pid>
```

### Reset database

```bash
docker-compose down -v
docker-compose up -d
```
