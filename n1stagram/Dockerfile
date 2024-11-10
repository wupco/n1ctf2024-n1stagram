FROM node:18-alpine
ARG ADMIN_PASSWORD
ENV ADMIN_PASSWORD=$ADMIN_PASSWORD
# This file is based on a CTF challenge image from justCTF 2024 teaser (https://ctftime.org/task/28579).
# The original Author is @tomek7667
# Adapted for use in N1CTF 2024

RUN apk update && apk upgrade
RUN apk add --no-cache nginx
RUN apk add supervisor

WORKDIR /database
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v0.22.22/pocketbase_0.22.22_linux_amd64.zip && echo "$CACHEBUST"
RUN unzip pocketbase_0.22.22_linux_amd64.zip && echo "$CACHEBUST"
RUN rm pocketbase_0.22.22_linux_amd64.zip && echo "$CACHEBUST"
RUN rm CHANGELOG.md && echo "$CACHEBUST"
RUN rm LICENSE.md && echo "$CACHEBUST"

WORKDIR /app
COPY ./nginx.conf /etc/nginx/nginx.conf
COPY ./supervisord.conf /etc/supervisor/supervisord.conf
COPY ./supervisord.conf /etc/supervisord.conf
COPY --chown=root ./entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh
ENTRYPOINT /entrypoint.sh $ADMIN_PASSWORD