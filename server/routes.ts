import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import path from "path";
import express from "express";

export async function registerRoutes(app: Express): Promise<Server> {
  // Servir arquivos estáticos da pasta public
  app.use(express.static(path.join(process.cwd(), 'public')));
  
  // Rota de fallback para index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(process.cwd(), 'public', 'index.html'));
  });
  
  const httpServer = createServer(app);
  return httpServer;
}
