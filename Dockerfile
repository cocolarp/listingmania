FROM alpine:3.5

RUN apk add --no-cache --upgrade nginx && \
    chown -R nginx:www-data /var/lib/nginx

# CF. https://github.com/gliderlabs/docker-alpine/issues/185 because
# alpine package maintainers are teapots
RUN mkdir -p /run/nginx

COPY nginx.conf /etc/nginx/nginx.conf
COPY dist /var/www

CMD echo "window.__SETTING__ = 'some_setting';" > /var/www/settings.js && \
  nginx
