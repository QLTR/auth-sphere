class DomainError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ResourceNotFoundError extends DomainError {
  constructor(resource, query) {
    super(`Resource ${resource} was not found.`);
    this.data = { resource, query };
  }
}
class InvalidParameterError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = { error };
  }
}

class InternalError extends DomainError {
  constructor(error) {
    super(error.message);
    this.data = { error };
  }
}

module.exports = {
  ResourceNotFoundError,
  InvalidParameterError,
  InternalError,
};
