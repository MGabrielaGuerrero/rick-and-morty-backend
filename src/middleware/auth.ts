import { Request, Response, NextFunction } from 'express';

const AUTH_TOKEN = process.env.AUTH_TOKEN  ?? 'my-secret-token';

/**
 * Middleware para validar un token de autenticación simple
 */
export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader || authHeader !== `Bearer ${AUTH_TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  next();
}


/**
 * Función para usar en el contexto de Apollo Server
 */
export function verifyAuthHeader(authHeader?: string): boolean {
    if (!authHeader) return false;
    return authHeader === `Bearer ${AUTH_TOKEN}`;
  }