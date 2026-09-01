# Stage 1: Build React Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY Hitler/frontend/package*.json ./
RUN npm install
COPY Hitler/frontend ./
RUN npm run build

# Stage 2: Python Backend Server
FROM python:3.11-slim
WORKDIR /app

# Install dependencies
COPY Hitler/Backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend and built Frontend
COPY Hitler/Backend ./Backend
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/Backend

# Run database migrations and start server
EXPOSE 8000
CMD ["sh", "-c", "python manage.py migrate && python manage.py runserver 0.0.0.0:8000"]
