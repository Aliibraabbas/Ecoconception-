export class AppError extends Error {
  constructor(message, status, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Ressource introuvable") {
    super(message, 404, "NOT_FOUND");
  }
}

export class ForbiddenError extends AppError {
  constructor(message = "Accès interdit") {
    super(message, 403, "FORBIDDEN");
  }
}

export class ValidationError extends AppError {
  constructor(message = "Données invalides", details = []) {
    super(message, 422, "VALIDATION_ERROR");
    this.details = details;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Non authentifié") {
    super(message, 401, "UNAUTHORIZED");
  }
}
