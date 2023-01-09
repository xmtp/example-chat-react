FROM node as builder
WORKDIR /app
COPY . .
ARG XMTP_API_URL
ENV NEXT_PUBLIC_XMTP_API_URL $XMTP_API_URL
RUN npm install && \
    npm run build

FROM flashspys/nginx-static
COPY --from=builder /app/out /static
COPY ./docker/nginx.vh.default.conf /etc/nginx/conf.d/default.conf
