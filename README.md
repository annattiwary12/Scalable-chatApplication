

# Real-Time Distributed Chat System 🚀
# https://github.com/annattiwary12/Scalable-chatApplication

A scalable real-time messaging system built using **Socket.IO**, **Redis (Pub/Sub)**, **Kafka**, and **PostgreSQL**, designed to support distributed servers with reliable message delivery and persistent chat history. Managed with **TurboRepo** for monorepo orchestration and optimized development workflows. Hosted using **Aiven's managed services**.

---

## 📸 Demo Screenshot
![Screenshot 2025-05-27 012034](https://github.com/user-attachments/assets/ad23bf4e-80a7-45c9-bcc8-c014b985df8d)



---------------

## 📦 Monorepo Powered by TurboRepo

This project follows a **monorepo structure** using [TurboRepo](https://turbo.build/repo) to manage the different parts of the system efficiently. TurboRepo enables:

- 🌀 **Fast builds and caching**
- 📁 **Clear workspace separation**
- 🔁 **Easier development across multiple packages (e.g., server, consumer, db)**
- 🧱 **Consistent dependency management**

---

## 📌 Features

- 🔁 **Real-time Messaging** with WebSocket (Socket.IO)
- ⚡ **Distributed Server Sync** using Redis Pub/Sub
- 📨 **Message Durability** using Kafka
- 💾 **Chat Persistence** using PostgreSQL
- 📦 **TurboRepo Monorepo** structure
- ☁️ **Managed Infra** via Aiven (Redis, Kafka, Postgres)

---

## 📊 Architecture Overview
![Screenshot 2025-05-27 234640](https://github.com/user-attachments/assets/60ffe532-e44f-4b02-8f18-19095898d95c)
---

---

## 🔧 Technologies Used

| Tech             | Purpose                                      |
|------------------|----------------------------------------------|
| **TurboRepo**     | Monorepo management & task orchestration     |
| **Socket.IO**     | Real-time communication (WebSocket)          |
| **Redis (Aiven)** | Pub/Sub for syncing distributed servers      |
| **Kafka (Aiven)** | Reliable, fault-tolerant message streaming   |
| **PostgreSQL**    | Persistent chat storage                      |
| **Node.js**       | Kafka consumer, socket server logic          |

---


---







