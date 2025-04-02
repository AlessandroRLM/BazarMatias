# frontend/Dockerfile
FROM oven/bun:1.2.8-alpine

# Establece el directorio de trabajo
WORKDIR /frontend

# Copia los archivos de configuración y dependencias
COPY package.json ./
COPY src ./
RUN bun install

# Copia el resto del código
COPY . .

# Expone el puerto en el que corre Vite
EXPOSE 3000

# Comando para correr el servidor de desarrollo
CMD ["bun", "run", "dev", "--host"]