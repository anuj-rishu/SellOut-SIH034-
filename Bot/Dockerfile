FROM node:20-slim


RUN apt-get update && apt-get install -y \
    gconf-service \
    libgbm-dev \
    libasound2 \
    libatk1.0-0 \
    libc6 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgcc1 \
    libgconf-2-4 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    ca-certificates \
    fonts-liberation \
    libappindicator1 \
    libnss3 \
    lsb-release \
    xdg-utils \
    wget \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app


COPY package.json ./
COPY package-lock.json* ./


RUN ls -la


RUN npm install --production || npm install || echo "Failed to install dependencies - continuing anyway"


COPY . ./


RUN mkdir -p ./.wwebjs_auth


ENV NODE_ENV=production \
    API_BASE_URL=https://sell-out-anuj-rishus-projects.vercel.app/api \
    MUSEUM_API_URL=https://museum-api-indian.vercel.app/api \
    PUPPETEER_HEADLESS=true \
    QR_SERVER_PORT=8080


EXPOSE 8080


CMD ["node", "index.js"]