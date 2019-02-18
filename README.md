# DjangoDeployTemplate

### Details

> There are separate docker-compose scripts for development and production

> The production vesrsion serves django with gunicorn and nginx

### Usage

```bash
docker-compose -f prod-compose.yml build
docker-compose -f prod-compose.yml up
```
