export class CheckoutOrderError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "CheckoutOrderError";
    this.statusCode = statusCode;
  }
}
