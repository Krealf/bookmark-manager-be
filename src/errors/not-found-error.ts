import { CustomError } from './custom-error.js';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(message = 'Nothing found') {
    super(message);
    this.message = message;

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeError(): { message: string } {
    return {
      message: this.message,
    };
  }
}
