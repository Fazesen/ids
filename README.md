🔐 AI-Driven Intrusion Detection System (IDS)

A real-time, scalable Intrusion Detection System that monitors live network traffic, detects malicious activity using machine learning, and streams alerts to a secure web dashboard.

This project evolved from a packet-level IDS into a full-stack security monitoring platform with authentication, real-time alerting, and persistent threat storage.

🚀 Key Features
🛡️ Real-Time Network Monitoring

Live packet capture using Scapy / PyShark

Flow-based traffic aggregation (inspired by UNSW-NB15 feature engineering)

Supports TCP & UDP traffic analysis

🤖 Machine Learning–Based Detection

Trained using the UNSW-NB15 dataset

Classifies traffic as Normal or Attack

Detects anomalies such as:

UDP Floods

TCP Floods

Fuzzing activity

Network behavior anomalies

⚡ Real-Time Alert Pipeline

Instant alert generation for suspicious traffic

Alerts pushed to the dashboard using WebSockets

Enriched metadata:

Attack type

Severity

Confidence score

Source & destination endpoints

Protocol

📊 Secure Dashboard

Authentication-protected access (JWT-based)

Live alert feed

Advanced filtering:

Severity

Protocol

Confidence

Attack type

Designed for SOC-style visibility

🗄️ Scalable Backend & Storage

MongoDB for alert persistence and historical analysis

Load balancing implemented to handle high-volume traffic bursts

Decoupled detection and visualization layers for scalability

🧠 System Architecture
[ Live Network Traffic ]
            │
            ▼
[ Packet Capture (Scapy / PyShark) ]
            │
            ▼
[ Flow Manager & Feature Extraction ]
            │
            ▼
[ ML Attack Classifier (UNSW-NB15) ]
            │
     ┌──────┴─────────┐
     ▼                ▼
[ Alert Generator ]   [ Feature Logging ]
     │
     ▼
[ WebSocket Server ]
     │
     ▼
[ Node.js Backend ]
     │
     ▼
[ MongoDB Database ]
     │
     ▼
[ React Dashboard (Secure Login) ]

🧰 Tech Stack
🔹 Detection Engine

Python

Scapy / PyShark

Custom flow manager

Machine Learning (UNSW-NB15)

🔹 Backend

Node.js

Express

WebSockets (real-time alerts)

JWT authentication

🔹 Database

MongoDB

Optimized for high-frequency alert ingestion

🔹 Frontend

React.js

Secure login system

Real-time alert dashboard

Advanced filtering & search

🔍 Detection Workflow

Capture live packets from the network

Aggregate packets into flows

Extract statistical & behavioral features

Classify traffic using ML model

Generate alerts for malicious activity

Stream alerts to dashboard in real time

Persist alerts in MongoDB for analysis

📈 Why This Project Matters

This IDS focuses on real-world constraints, not just detection accuracy:

Handles high traffic volume

Avoids database overload via load balancing

Separates detection from visualization

Designed with SOC usability in mind

It reflects how modern IDS/IPS systems operate in production environments.

🔮 Future Enhancements

Adaptive ML models for evolving threats

Alert correlation & prioritization

SIEM-style analytics

Role-based access control

Distributed sensor deployment

👤 Author

Debanjan Sen Sharma
Cybersecurity Enthusiast  | IDS & Network Security
📍 Lovely Professional University
