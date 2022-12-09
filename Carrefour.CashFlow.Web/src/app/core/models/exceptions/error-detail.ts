import { ErrorType } from 'app/core/models/exceptions/error-type';

export class ErrorDetail {
  public type: ErrorType;
  public code: string;
  public message: string;
  public description: string;
}
