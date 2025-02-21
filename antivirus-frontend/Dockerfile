# Stage 1: Build the React app using Node
FROM node:18-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY antivirus-frontend/package*.json ./
RUN npm install

# Copy the rest of the source code and build the app
COPY antivirus-frontend/ ./
RUN npm run build

# Stage 2: Serve the built app using Nginx
FROM nginx:alpine
# Remove default Nginx static assets
RUN rm -rf /usr/share/nginx/html/*
# Copy the build output from stage 1 to Nginx's html folder
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
