# 🔔 Real-Time Multi-Channel Notification Service

A robust, event-driven notification engine built with **Node.js**, **TypeScript**, and **RabbitMQ**. This service handles multi-channel delivery (Email, SMS, Push, In-App) while enforcing sophisticated business rules like **Rate Limiting**, **Quiet Hours**, and **Automatic Retries**.



## 🚀 Key Features

* **Multi-Channel Delivery:** Pluggable strategies for Email (SendGrid/SES), SMS (Twilio), Push (FCM), and real-time In-App alerts.
* **Asynchronous Processing:** Leverages **RabbitMQ** to decouple notification triggers from delivery, ensuring high availability and system resilience.
* **Smart Logic:**
    * **Rate Limiting:** Protects users by limiting delivery to 100 notifications per day per user.
    * **Quiet Hours:** Timezone-aware delivery deferral based on user-defined "Do Not Disturb" windows.
* **Real-Time In-App Alerts:** Built with **Socket.io** and **Redis Adapter** for instant delivery and horizontal scaling.
* **Template Engine:** Dynamic variable substitution (e.g., `{{name}}`) across all communication channels.
* **Full Observability:** Comprehensive tracking of notification lifecycles (SENT, DELIVERED, READ, CLICKED, FAILED) with a dedicated event log.

## 🛠️ Tech Stack

* **Runtime:** Node.js (ES Modules)
* **Language:** TypeScript
* **Database:** PostgreSQL with Prisma 7 ORM
* **Message Broker:** RabbitMQ
* **Cache/Session:** Redis
* **Real-Time:** Socket.io

## 📋 API Endpoints (Section 4.4)

### Template Management
* `POST /api/v1/notifications/templates` - Create a new admin template.
* `GET /api/v1/notifications/templates` - List templates by category or event type.

### Notification Operations
* `POST /api/v1/notifications/send` - Queue a single notification.
* `POST /api/v1/notifications/send-bulk` - Trigger a batch notification for multiple users.
* `GET /api/v1/notifications` - Retrieve paginated user notification history.
* `PATCH /api/v1/notifications/:id/read` - Mark a specific notification as read.
* `DELETE /api/v1/notifications/:id` - Delete a notification record.

### User Preferences & Subscriptions
* `GET /api/v1/notifications/preferences` - Fetch user-specific channel settings.
* `PUT /api/v1/notifications/preferences` - Update quiet hours and enabled channels.
* `POST /api/v1/notifications/push/subscribe` - Register device tokens for Push/FCM.

## 🚦 Getting Started

### 1. Prerequisites
* Docker & Docker Compose
* Node.js (v18+)
* NPM

### 2. Infrastructure Setup
Spin up PostgreSQL, RabbitMQ, and Redis using the provided configuration:
```bash
docker-compose up -d
# Install project dependencies
npm install

# Run migrations to create core tables (Templates, Notifications, etc.)
npx prisma migrate dev --name init_schema

# Generate the Prisma Client
npx prisma generate

# Start the server and background worker in development mode
npm run dev
```
