Perfect 👌
You want a **manual-style project documentation** — written like a real DevOps implementation guide.

Below is a **complete project documentation** for your React + Docker + EC2 + GitHub Actions setup (without registry).

You can copy this into your `README.md`.

---

# 📘 Project Documentation

## React Application Deployment using Docker, EC2 and GitHub Actions (Without Registry)

---

# 1️⃣ Project Overview

## 1.1 Objective

The objective of this project is to:

* Containerize a React application using Docker
* Deploy the container to a virtual server
* Automate deployment using CI/CD
* Avoid using any container registry (for practice purpose)

---

## 1.2 Architecture Overview

```
Developer → GitHub → GitHub Actions → EC2 → Docker → Running React App
```

### Flow Explanation

1. Developer pushes code to GitHub.
2. GitHub Actions triggers automatically.
3. Docker image is built inside GitHub runner.
4. Image is exported as `.tar` file.
5. The image is copied to EC2 via SCP.
6. EC2 loads the image and runs the container.
7. React app becomes accessible via EC2 public IP.

---

# 2️⃣ Technology Stack

| Component      | Purpose                        |
| -------------- | ------------------------------ |
| React          | Frontend framework             |
| Docker         | Containerization               |
| EC2            | Virtual server hosting         |
| GitHub Actions | CI/CD automation               |
| Nginx          | Serving production React build |

EC2 is provisioned using
👉 Amazon EC2

CI/CD is handled by
👉 GitHub

---

# 3️⃣ Project Structure

```
public/
src/
package.json
package-lock.json
Dockerfile
.github/
  workflows/
    deploy.yml
```

---

# 4️⃣ Step-by-Step Implementation

---

# Step 1 — Create React Application

If not already created:

```bash
npx create-react-app my-app
```

Verify app runs locally:

```bash
npm start
```

---

# Step 2 — Create Production Dockerfile

Create `Dockerfile` in root directory.

### Purpose:

* Build React app
* Serve static build via Nginx

```dockerfile
# Stage 1: Build React App
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/build /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Explanation:

* First stage builds React production bundle
* Second stage serves optimized static files
* Multi-stage reduces final image size

---

# Step 3 — Launch EC2 Instance

Create instance in AWS:

* OS: Amazon Linux 2
* Instance Type: t2.micro
* Security Group:

  * Port 22 (SSH)
  * Port 80 (HTTP)

---

# Step 4 — Install Docker on EC2

SSH into EC2:

```bash
ssh -i key.pem ec2-user@your-ip
```

Install Docker:

```bash
sudo yum update -y
sudo yum install docker -y
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ec2-user
```

Logout and login again.

Verify:

```bash
docker --version
```

---

# Step 5 — Configure GitHub Secrets

In GitHub repository:

Settings → Secrets → Actions

Add:

| Secret Name | Description          |
| ----------- | -------------------- |
| EC2_HOST    | Public IP of EC2     |
| EC2_USER    | ec2-user             |
| EC2_SSH_KEY | Content of .pem file |

---

# Step 6 — Create CI/CD Workflow

Create file:

```
.github/workflows/deploy.yml
```

Add:

```yaml
name: Deploy Without Registry

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Build Docker image
        run: docker build -t react-app:${{ github.sha }} .

      - name: Save Docker image
        run: docker save react-app:${{ github.sha }} > react-app.tar

      - name: Copy image to EC2
        uses: appleboy/scp-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          source: "react-app.tar"
          target: "/home/ec2-user/"

      - name: Load and Run on EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USER }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            docker stop react-app || true
            docker rm react-app || true

            docker load < react-app.tar

            docker run -d -p 80:80 --restart=always \
              --name react-app react-app:${{ github.sha }}

            docker image prune -f
```

---

# 5️⃣ CI/CD Workflow Explanation

### Trigger

Workflow runs when:

```
push to main branch
```

---

### Step 1 — Checkout

GitHub runner downloads repository code.

---

### Step 2 — Build Image

Docker builds image using Dockerfile.

Tag includes commit SHA for traceability.

---

### Step 3 — Save Image

Image exported as `.tar` file.

Purpose:

* Transfer without using registry

---

### Step 4 — SCP Transfer

Image securely copied to EC2.

---

### Step 5 — Deploy on EC2

1. Stop old container
2. Remove old container
3. Load new image
4. Run container
5. Clean unused images

---

# 6️⃣ Deployment Flow Summary

```
Code Push
   ↓
CI Build
   ↓
Image Export
   ↓
Secure Transfer
   ↓
Container Restart
   ↓
Application Live
```

---

# 7️⃣ Access Application

Open in browser:

```
http://EC2_PUBLIC_IP
```

---

# 8️⃣ Advantages of This Approach

* No external registry
* Secure (SSH-based)
* Version-controlled deployments
* Container restart protection
* Production build optimization

---

# 9️⃣ Limitations (For Learning Context)

* Image file transfer can be slow for large apps
* Not ideal for large-scale production
* Registry-based deployment is more scalable

---

# 🔟 Future Improvements

* Add custom domain
* Add HTTPS (SSL)
* Implement blue-green deployment
* Use container registry
* Use load balancer

---

# 📌 Conclusion

This project demonstrates:

* Docker containerization
* CI/CD pipeline design
* Remote container deployment
* Infrastructure automation principles

The application is fully automated from code push to production deployment without using any container registry.

Absolutely ✅ I can provide a **complete explanation of the GitHub Actions YAML workflow** step by step, in a manual-style format — exactly like documentation you could include in your README or manual.

---

# 📘 GitHub Actions YAML Workflow Explanation

This workflow is designed for **CI/CD deployment of a React app to EC2 without a registry**.

---

## 1️⃣ Workflow File Location

```text
.github/workflows/deploy.yml
```

GitHub automatically detects YAML workflows in this folder.

---

## 2️⃣ Workflow Trigger

```yaml
on:
  push:
    branches:
      - main
```

**Explanation:**

* The workflow is triggered **automatically on any push** to the `main` branch.
* This ensures that every time you push code, CI/CD runs.

---

## 3️⃣ Job Definition

```yaml
jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
```

**Explanation:**

* Defines a job named `build-and-deploy`.
* Runs on a **GitHub-hosted Ubuntu runner** (`ubuntu-latest`) which has Docker installed.

---

## 4️⃣ Step 1 — Checkout Code

```yaml
- name: Checkout code
  uses: actions/checkout@v3
```

**Explanation:**

* Uses official GitHub Action to **clone the repository into the runner**.
* Provides the code for Docker build.

---

## 5️⃣ Step 2 — Build Docker Image

```yaml
- name: Build Docker image
  run: docker build -t react-app:${{ github.sha }} .
```

**Explanation:**

* `docker build` builds the Docker image from your `Dockerfile`.
* `-t react-app:${{ github.sha }}` tags the image with the **commit SHA**, which ensures **version tracking**.
* The `.` specifies the **current directory as Docker build context**.

---

## 6️⃣ Step 3 — Save Docker Image as `.tar`

```yaml
- name: Save Docker image
  run: docker save react-app:${{ github.sha }} > react-app.tar
```

**Explanation:**

* Exports the Docker image to a **single `.tar` file**.
* Purpose: transfer image **without using any registry**.
* File will later be copied to EC2 via SCP.

---

## 7️⃣ Step 4 — Copy Image to EC2

```yaml
- name: Copy image to EC2
  uses: appleboy/scp-action@master
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ${{ secrets.EC2_USER }}
    key: ${{ secrets.EC2_SSH_KEY }}
    source: "react-app.tar"
    target: "/home/ec2-user/"
```

**Explanation:**

* Uses **SCP (Secure Copy Protocol)** to send `react-app.tar` to EC2.
* Secrets used to secure **SSH host, username, and private key**.
* File is copied to `/home/ec2-user/`.

---

## 8️⃣ Step 5 — Load & Run Docker on EC2

```yaml
- name: Load and Run on EC2
  uses: appleboy/ssh-action@master
  with:
    host: ${{ secrets.EC2_HOST }}
    username: ${{ secrets.EC2_USER }}
    key: ${{ secrets.EC2_SSH_KEY }}
    script: |
      docker stop react-app || true
      docker rm react-app || true

      docker load < react-app.tar

      docker run -d -p 80:80 --restart=always \
        --name react-app react-app:${{ github.sha }}

      docker image prune -f
```

**Step Explanation:**

1. **Stop previous container**:
   `docker stop react-app || true` ensures workflow continues even if container does not exist.

2. **Remove previous container**:
   `docker rm react-app || true` cleans old container to prevent naming conflicts.

3. **Load Docker image**:
   `docker load < react-app.tar` imports the image into Docker on EC2.

4. **Run new container**:

   * `-d` → run detached (in background)
   * `-p 80:80` → maps EC2 port 80 to container port 80
   * `--restart=always` → container auto-restarts on EC2 reboot
   * `--name react-app` → container is named `react-app`
   * `react-app:${{ github.sha }}` → runs the image tagged with commit SHA

5. **Cleanup unused images**:
   `docker image prune -f` frees disk space on EC2.

---

## 9️⃣ Secrets Explanation

The workflow uses GitHub **Secrets** to avoid exposing sensitive data:

| Secret        | Purpose                       |
| ------------- | ----------------------------- |
| `EC2_HOST`    | EC2 public IP address         |
| `EC2_USER`    | EC2 SSH username (`ec2-user`) |
| `EC2_SSH_KEY` | EC2 private key content       |

> Secrets are configured in GitHub Settings → Secrets → Actions.

---

## 10️⃣ Workflow Summary

* On push → GitHub runner builds Docker image
* Saves image as `.tar` → copies to EC2 → loads and runs container
* Old container replaced, new container starts automatically
* No container registry needed

---

## 11️⃣ Notes / Best Practices

* Tag images with commit SHA to **track deployment versions**
* Use `--restart=always` for container persistence
* Clean unused images to **prevent disk issues**
* Keep secrets safe; never hardcode in YAML
* Verify port 80 open in EC2 Security Group

---

This YAML workflow is now **fully documented step-by-step**, with explanation for each part — exactly like a manual for a DevOps project.

---

If you want, I can create a **ready-to-use `README.md` section with full manual, YAML explanation, and diagrams** that looks like a professional project doc you can submit or share.

Do you want me to do that?

