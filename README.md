# 🚖 Cabify Microservices Platform

A **Cab Aggregator Application** (similar to Uber/Yandex.Taxi) built with a **microservices architecture**, featuring **NestJS backend** and **React + TypeScript frontend**, designed to demonstrate modern cloud-native development practices including Docker, API Gateway, messaging, and observability.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technologies Used & Purpose](#technologies-used--purpose)
3. [Architecture & Diagrams](#architecture--diagrams)
4. [Frontend](#frontend)
5. [Backend](#backend)
6. [API Overview](#api-overview)
7. [Microservices](#microservices)
8. [Deployment](#deployment)
9. [Testing Strategy](#testing-strategy)
10. [Next Steps & Documentation](#next-steps--documentation)

---

## Project Overview

The platform connects **passengers** and **drivers**. It allows:

* **Passengers:** register, book rides, pay, rate drivers, view ride history.
* **Drivers:** register, accept rides, start/finish rides, manage status, receive earnings.

The system follows **microservices architecture** for scalability, maintainability, and independent service deployments.

---

## Technologies Used & Purpose

| Technology                                | Purpose in this project                                                     |
| ----------------------------------------- | --------------------------------------------------------------------------- |
| **NestJS**                                | Backend framework for building microservices with modular architecture.     |
| **React + TypeScript + Vite**             | Frontend SPA for passenger and driver interfaces.                           |
| **Tailwind CSS**                          | Styling framework for responsive and maintainable UI.                       |
| **PostgreSQL**                            | Relational database for persistent storage of users, rides, and payments.   |
| **Redis**                                 | Caching, session management, and real-time location data.                   |
| **Kafka / RabbitMQ**                      | Event-driven communication between services (ride requests, notifications). |
| **Docker + Docker Compose**               | Containerization and orchestration for easy local development.              |
| **Nginx**                                 | Reverse proxy for frontend & API gateway.                                   |
| **API Gateway**                           | Single entry point for all API requests.                                    |
| **Keycloak / Auth Service**               | Authentication & authorization using OAuth2/OpenID Connect.                 |
| **Resilience4j**                          | Circuit breaker and fault-tolerance mechanisms.                             |
| **ELK (Elasticsearch, Logstash, Kibana)** | Log storage, indexing, and visualization.                                   |
| **Prometheus + Grafana**                  | Metrics and monitoring dashboards.                                          |
| **Swagger/OpenAPI**                       | API documentation and client generation.                                    |
| **JUnit/Spock / Jest / Cucumber**         | Unit, integration, component, contract, and end-to-end testing.             |

---

## Architecture & Diagrams

### High-level Architecture

```plantuml
@startuml
package "Frontend" {
  [Web Client (React)]
}
package "Gateway & Auth" {
  [API Gateway]
  [Auth Service]
}
package "Microservices" {
  [Passenger Service]
  [Driver Service]
  [Ride Service]
  [Payment Service]
  [Notification Service]
  [Matching Service]
}
package "Infrastructure" {
  [PostgreSQL]
  [Redis]
  [Kafka/RabbitMQ]
  [Prometheus + Grafana]
  [Elasticsearch + Kibana]
  [Nginx]
}

Web Client --> API Gateway : HTTPS (JWT)
API Gateway --> Auth Service : Token Validation
API Gateway --> Passenger Service : REST
API Gateway --> Driver Service : REST
API Gateway --> Ride Service : REST
Ride Service --> Kafka : publish events
Matching Service --> Kafka : consume events
Ride Service --> Payment Service : REST/events
All Services --> PostgreSQL : persistent storage
All Services --> Redis : cache/realtime
All Services --> Prometheus : metrics
All Services --> Elasticsearch : logs
Nginx --> API Gateway : reverse proxy
@enduml
```

---

## Frontend

The **frontend** is built with **React, TypeScript, and Vite**. It provides **passenger and driver interfaces** with real-time updates via **WebSocket** or **notification service**.

### Frontend Stack

* **React + TypeScript**: SPA with type safety
* **Vite**: Fast bundler & dev server
* **Tailwind CSS**: Styling components
* **React Router DOM**: SPA routing
* **Axios**: API communication
* **React Query / Zustand**: State management (optional for caching API responses)
* **Jest + React Testing Library**: Unit and component tests

### Folder Structure

```
frontend/
├─ public/              # Static assets
├─ src/
│  ├─ api/              # Axios API services
│  ├─ components/       # Reusable components (buttons, modals, maps)
│  ├─ pages/            # React pages (PassengerDashboard, DriverDashboard)
│  ├─ hooks/            # Custom React hooks
│  ├─ context/          # Context providers (auth, notifications)
│  ├─ routes/           # Route definitions
│  ├─ store/            # Zustand / Redux stores
│  └─ utils/            # Utility functions
├─ index.tsx
└─ vite.config.ts
```

### Pages & Components

**Passenger:**

* `PassengerDashboard` — overview of rides and promotions
* `RideBooking` — select pickup/destination, estimate fare
* `RideHistory` — view past rides
* `Profile` — edit profile, view ratings
* `Payment` — manage cards, promo codes

**Driver:**

* `DriverDashboard` — current status, earnings
* `AvailableRides` — list of rides to accept/refuse
* `RideDetails` — confirm start/end of rides
* `Profile` — edit profile, view ratings

**Shared Components:**

* `Header`, `Footer`
* `Notifications` (WebSocket alerts)
* `Maps` (Google Maps / OpenStreetMap integration)

### API Interaction

* All requests go through the **API Gateway**
* JWT token used for authentication
* Axios interceptors for error handling & retries
* WebSocket for real-time ride notifications

### Running Frontend

```bash
cd frontend
pnpm install
pnpm run dev       # Development server
pnpm build         # Production build
```

---

## Backend

The backend is built using **NestJS** with **microservices modules**:

* **Modules:** Passenger, Driver, Ride, Payment, Notification, Matching
* **Communication:** REST + Kafka/RabbitMQ
* **Auth:** OAuth2/OpenID Connect via Keycloak or Auth Service
* **Database:** PostgreSQL for persistent storage
* **Caching / Realtime:** Redis
* **Observability:** Prometheus + Grafana, Elasticsearch + Kibana

### Backend Folder Structure

```
backend/
├─ passenger-service/
├─ driver-service/
├─ ride-service/
├─ payment-service/
├─ notification-service/
├─ matching-service/
├─ api-gateway/
└─ auth-service/
```

### Running Backend

```bash
# Start services locally (development)
docker-compose up --build
```

---

## API Overview

**Authentication & Authorization**

* `POST /auth/register` — register user
* `POST /auth/login` — login & receive JWT
* `GET /auth/profile` — fetch profile

**Passenger Service**

* `GET /passengers/{id}` — get passenger profile
* `POST /rides` — create new ride

**Driver Service**

* `POST /drivers` — create driver profile
* `POST /drivers/{id}/status` — set online/offline

**Ride Service**

* `POST /rides/{id}/accept` — driver accepts ride
* `POST /rides/{id}/start` — start ride
* `POST /rides/{id}/finish` — finish ride

**Payment Service**

* `POST /payments` — process payment
* `POST /payments/refund` — process refund

**Notification Service**

* `POST /notify` — send notifications

> Full OpenAPI specs generated per service.

---

## Deployment

* **Docker Compose:** containers for frontend, backend, DB, Redis, Kafka, Prometheus, Grafana, Elasticsearch, Nginx
* **Frontend:** built and served via Nginx
* **Backend:** all services behind API Gateway

```bash
docker-compose up --build
```

---

## Testing Strategy

* **Unit tests:** Jest (frontend), JUnit/Spock (backend)
* **Integration tests:** REST & Kafka/RabbitMQ
* **Component tests:** Cucumber for business scenarios
* **Contract tests:** Pact / Spring Cloud Contract
* **End-to-End:** Cucumber / Playwright covering full flow

---

## Next Steps

* Expand OpenAPI docs for each service
* Prepare Postman collections
* Implement distributed tracing (`X-Trace-Id`)
* Expand circuit breakers / fallback logic
* CI/CD & Kubernetes deployment