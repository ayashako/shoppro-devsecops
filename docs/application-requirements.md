# Application Requirements

## Architecture

```text
Customer
   |
   v
Frontend :8080
   |---------------------|
   v                     v
Product Service :3001    Order Service :3002
                           |
                           v
                  Optional Amazon S3 audit bucket
```

## Runtime

- Node.js 18 or later
- npm

## Environment variables

### Frontend

- `PORT` — default `8080`

The browser API addresses are stored in `frontend/public/config.js`.

### Product service

- `PORT` — default `3001`

### Order service

- `PORT` — default `3002`
- `AWS_REGION` — used when S3 auditing is enabled
- `AWS_AUDIT_BUCKET` — optional S3 bucket for order audit records

## API endpoints

### Product service

- `GET /health`
- `GET /products`
- `GET /products/:id`

### Order service

- `GET /health`
- `GET /orders`
- `POST /orders`

## Deployment expectations

- Each component should run in a separate container.
- Each backend service should have a Kubernetes Deployment and ClusterIP Service.
- The frontend should have a Deployment and a Service.
- Health endpoints should be used for Kubernetes liveness and readiness probes.
- The order service should use a dedicated Kubernetes service account connected to a least-privilege IAM role through IRSA.
