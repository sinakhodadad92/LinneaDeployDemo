FROM python:3.7-alpine
MAINTAINER senesence

ENV PYTHONUNBUFFERED 1
COPY ./requirements/prod.txt /requirements.txt

RUN apk add --update --no-cache postgresql-client
# TEMPORARY dependencies. Needed only for installing
# --virtual: an alias which can be used to remove dependencies later
# Eg. We need gcc to compile the program but do not need it later
RUN apk add --update --no-cache --virtual .tmp-build-deps \
      gcc libc-dev linux-headers postgresql-dev

RUN pip install -r /requirements.txt

RUN apk del .tmp-build-deps

RUN mkdir /app
WORKDIR /app

# to make this folder available when pushed to docker hub
COPY ./app /app

WORKDIR /app/linnea_master/linnea
RUN python setup.py build
RUN python setup.py install 

WORKDIR /app

# Create a user. -D represents this user can only run apps.
RUN adduser -D user

# -p allows creation of sub-directories if not available
RUN mkdir -p /vol/static
# Give permission to user to access volume dirs
RUN chown -R user:user /vol/
# This means owner can do everything, but rest can only read and execute
RUN chmod -R 755 /vol/

USER user
