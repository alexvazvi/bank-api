# Bank API

A RESTful API for managing bank wallets built with NestJS, TypeScript, and PostgreSQL, following Domain-Driven Design principles and hexagonal architecture.

## Features

- Create and manage wallets
- Deposit and withdraw funds
- View wallet details and balance
- Swagger API documentation
- Dockerized development environment

## Prerequisites

- **Node.js** (v22)
- **Docker** and **Docker Compose**
- **Git**

## Getting Started

### Clone the Repository

```bash
git clone https://github.com/alexvazvi/bank-api.git
cd bank-api
```

Run the application:

```bash
docker-compose up -d
```
This command will:

- Start a PostgreSQL database
- Build and start the NestJS application

## Accessing the API
Once the application is running, you can access:

- API: http://localhost:3000

- Swagger Documentation: http://localhost:3000/api