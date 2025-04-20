# Dockerfile
FROM node:18

# Crear directorio de la app
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install

# Copiar el resto del código
COPY . .

# Compilar TypeScript
RUN npm run build

# Exponer el puerto del servidor (ajusta si usas otro)
EXPOSE 4000

# Comando para arrancar la app
CMD ["node", "dist/app.js"]

