// Backend internationalized error messages
const messages: Record<string, Record<string, string>> = {
  en: {
    'auth.invalid_credentials': 'Invalid credentials',
    'auth.unauthorized': 'Unauthorized - Please log in',
    'auth.forbidden': 'Forbidden - Insufficient permissions',
    'auth.account_locked': 'Account locked. Try again later.',
    'auth.token_expired': 'Token expired',
    'auth.email_exists': 'Email already registered',
    'validation.required': 'This field is required',
    'validation.invalid_email': 'Invalid email format',
    'validation.min_length': 'Must be at least {min} characters',
    'order.not_found': 'Order not found',
    'order.cannot_void': 'Cannot void this order',
    'product.not_found': 'Product not found',
    'customer.not_found': 'Customer not found',
    'server.internal_error': 'Internal server error',
  },
  es: {
    'auth.invalid_credentials': 'Credenciales inválidas',
    'auth.unauthorized': 'No autorizado - Por favor inicie sesión',
    'auth.forbidden': 'Prohibido - Permisos insuficientes',
    'auth.account_locked': 'Cuenta bloqueada. Intente más tarde.',
    'auth.token_expired': 'Token expirado',
    'auth.email_exists': 'El correo ya está registrado',
    'validation.required': 'Este campo es requerido',
    'validation.invalid_email': 'Formato de correo inválido',
    'validation.min_length': 'Debe tener al menos {min} caracteres',
    'order.not_found': 'Pedido no encontrado',
    'order.cannot_void': 'No se puede anular este pedido',
    'product.not_found': 'Producto no encontrado',
    'customer.not_found': 'Cliente no encontrado',
    'server.internal_error': 'Error interno del servidor',
  },
  fr: {
    'auth.invalid_credentials': 'Identifiants invalides',
    'auth.unauthorized': 'Non autorisé - Veuillez vous connecter',
    'auth.forbidden': 'Interdit - Permissions insuffisantes',
    'auth.account_locked': 'Compte verrouillé. Réessayez plus tard.',
    'auth.token_expired': 'Token expiré',
    'auth.email_exists': 'Email déjà enregistré',
    'validation.required': 'Ce champ est requis',
    'order.not_found': 'Commande introuvable',
    'product.not_found': 'Produit introuvable',
    'customer.not_found': 'Client introuvable',
    'server.internal_error': 'Erreur interne du serveur',
  },
};

// Get translated message based on Accept-Language header
export function t(key: string, lang: string = 'en', params?: Record<string, string | number>): string {
  const locale = lang.split('-')[0]; // 'en-US' -> 'en'
  let msg = messages[locale]?.[key] || messages.en[key] || key;
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      msg = msg.replace(`{${k}}`, String(v));
    }
  }
  return msg;
}

// Middleware to extract language from request
import { Request, Response, NextFunction } from 'express';

export function i18nMiddleware(req: Request, _res: Response, next: NextFunction) {
  const lang = req.headers['accept-language']?.split(',')[0]?.split('-')[0] || 'en';
  (req as any).lang = lang;
  next();
}
