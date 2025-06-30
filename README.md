# Dev-Ops-Project
Dev-Ops External Project

Product Management System 
🚀 Product Management System – DevOps Project
🧾 Project Description
This is a Product Management Web Application built using HTML, CSS, and JavaScript. It serves as an Admin Panel for managing product listings — allowing users to add, edit, delete, and search products, along with uploading images, categorizing items, and visualizing product distribution using Chart.js.

The UI features a modern glassmorphism effect and supports light/dark mode toggling. The website includes:

A responsive product form (name, category, price, quantity, image, description).

A dynamic product listing table with sorting and searching features.

Real-time chart visualization of products by category.

🧰 DevOps Workflow
This project showcases a simple CI/CD pipeline using Docker and Jenkins:

✅ Jenkins Integration
Jenkins Pipeline is configured to automatically:

Pull the latest code from GitHub.

Build a Docker image for the website.

Run the container on a specified port.

Optionally deploy to a staging or production environment.

🐳 Docker Setup
A lightweight Dockerfile is created to serve the static website using Nginx or http-server.

The image is built and tagged automatically by Jenkins.

Docker Compose can be used for running multi-container apps if needed (e.g., frontend + backend in future iterations).

📂 Project Structure
pgsql
Copy
Edit
📦 product-management-website
├── Dockerfile
├── Jenkinsfile
├── index.html
├── styles.css
├── script.js
└── README.md
🔧 Technologies Used
Frontend: HTML5, CSS3, JavaScript (Vanilla), Chart.js

CI/CD: Jenkins

Containerization: Docker

Version Control: Git + GitHub

📦 Future Enhancements (Optional)
Backend integration (Node.js, Express, or Flask)

Database support (MongoDB or PostgreSQL)

Role-based authentication (Admin/User)

Deployment to cloud platforms (AWS/GCP/Render)
