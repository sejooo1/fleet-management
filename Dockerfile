# Koristimo Node.js image
FROM node:18

# Postavljamo radni direktorij na backend folder
WORKDIR /app/backend

# Kopiramo package.json i package-lock.json
COPY backend/package*.json ./

# Instaliramo zavisnosti
RUN npm install

# Kopiramo ostatak backend koda
COPY backend .

# Postavljamo port
EXPOSE 5000

# Pokrećemo backend aplikaciju
CMD ["npm", "start"]
