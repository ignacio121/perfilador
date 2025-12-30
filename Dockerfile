# Etapa 1: Build de la app con Node
FROM node:18 AS build

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --configuration production

# Etapa 2: Servir con Nginx
FROM nginx:1.27-alpine

# Copiar archivos de Angular al directorio de Nginx
COPY --from=build /app/dist/tu-app /usr/share/nginx/html

# Reemplazar la configuración default de Nginx (opcional)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
