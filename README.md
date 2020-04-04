# Linnea Deploy Code

### Details

> Recursive clone this repo

```bash
git clone https://github.com/as641651/LinneaDeployDemo.git --recursive
```

> The production vesrsion serves django with gunicorn and nginx

### Usage

```bash
docker-compose -f prod-compose.yml build
docker-compose -f prod-compose.yml up
```
> Build is done only once. You have to rebuild only if you change the Dockerfiles or add python requirements

> To start server and return terminal

```bash
nohup docker-compose -f prod-compose.yml up &
```
> To Stop serving and detach docker volumnes

```bash
docker-compose -f prod-compose.yml down -v
```

### More information:

> [Docker basics](https://mlr2d.org/modules/docker)

> [Nginx, Gunicorn](https://mlr2d.org/modules/django-gunicorn-nginx)

> [Setting up postgres with docker](https://mlr2d.org/modules/djangorestapi/06_dockertips_settingup_postgres_backend)
