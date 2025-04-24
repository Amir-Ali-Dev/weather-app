import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});


git config --global user.email "amiralihosseinzade169@gmail.com"
git config --global user.name "Amir-Ali-Dev"


git remote add origin https://github.com/Amir-Ali-Dev/weather-app.git
git branch -M main
git push -u origin main

git init
git config --global user.email "amiralihosseinzade169@gmail.com"
git config --global user.name "Amir-Ali-Dev"