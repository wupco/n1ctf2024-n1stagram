FROM ubuntu
ARG ADMIN_PASSWORD
ARG FLAG_PASSWORD
ENV FLAG_PASSWORD=$FLAG_PASSWORD
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
# This file is based on a CTF challenge image from justCTF 2024 teaser (https://ctftime.org/task/28579).
# The original Author is @tomek7667
# Adapted for use in N1CTF 2024

RUN apt-get update
RUN apt-get install -y nodejs npm 

WORKDIR /app

COPY src/ /app/

RUN npm install


CMD node prepare.js
