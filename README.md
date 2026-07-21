# ShopPro Online — Developer Handover

This repository contains the application source code supplied by the development team for the DevSecOps course-end project.

## Application components

- `frontend` — customer web interface, port `8080`
- `services/product-service` — product catalogue API, port `3001`
- `services/order-service` — order API, port `3002`

The application is intentionally small so the project can focus on:

- CI/CD automation
- SAST and dependency scanning
- secret scanning
- container image scanning
- Amazon ECR
- Amazon EKS
- Kubernetes security
- IRSA
- AWS Config
- AWS Security Hub
- DAST
- runtime monitoring

## Developer responsibilities already completed

- Application source code
- Health endpoints
- Basic API tests
- Environment-variable support
- Optional S3 audit integration in the order service

## DevSecOps responsibilities not included

You will create these later:

- Dockerfiles and `.dockerignore`
- Docker Compose
- GitHub repository and branch protection
- Jenkins pipeline
- security scanning stages
- ECR repositories
- EKS infrastructure
- Kubernetes manifests
- IRSA
- AWS Config and Security Hub configuration
- OWASP ZAP testing
- Prometheus, Grafana and Falco monitoring

## Local ports

| Component | Port |
|---|---:|
| Frontend | 8080 |
| Product service | 3001 |
| Order service | 3002 |

## Run locally

Open three terminals.

### Product service

```bash
cd services/product-service
npm install
npm test
npm start
```

### Order service

```bash
cd services/order-service
npm install
npm test
npm start
```

### Frontend

```bash
cd frontend
npm start
```

Open:

```text
http://localhost:8080
```

## Health endpoints

```text
http://localhost:3001/health
http://localhost:3002/health
```

## Optional AWS integration

When `AWS_AUDIT_BUCKET` is configured, the order service writes an order audit record to the specified S3 bucket.

This will later be used to demonstrate IAM Roles for Service Accounts (IRSA) on Amazon EKS.

Local development does not require AWS credentials because the S3 upload is skipped when `AWS_AUDIT_BUCKET` is not set.
