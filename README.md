# portfolio

My personal portfolio, built with React + Vite.

## Despliegue

En el VPS, detrás de Caddy (red Docker externa `web`, sin puertos publicados):

```sh
docker compose -f docker-compose.yml -f compose.prod.yaml up -d --build
```
