import { Request, Response } from "express";
import { writeExceptionLogToFile } from "~helpers/write-exception-log-to-file";

import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";

import { ErrorDetail } from "~types/error-detail.type";
import { HttpExceptionResponse } from "./http-exception-response.interface";

enum ExceptionType {
  ValidationExceptions = "ValidationExceptions",
  ValidationError = "ValidationError",
  CastError = "CastError",
}

const MONGODB_CODES = {
  BULK_WRITE_ERROR: 11000, // a duplicate error code in mongoose
};

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const httpHost = host.switchToHttp();
    const response = httpHost.getResponse<Response>();
    const request = httpHost.getRequest<Request>();
    const url = request.url;
    const method = request.method;

    const errorMessage = exception?.message || "Critical internal server error occurred!";

    let title = "Internal Server Error";
    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;

    if (exception instanceof HttpException) {
      title = exception.getResponse()["error"];
      statusCode = exception.getStatus();
    }

    const exceptionResponse: HttpExceptionResponse = {
      title,
      statusCode,
      url,
      method,
      errors: [
        {
          property: exception?.path || exception?.name || title || "unknown",
          message: errorMessage,
        },
      ],
      timeStamp: new Date(),
      user: JSON.stringify(request["user"]) ?? "Not signed in",
      stack: exception?.stack,
    };

    switch (exception.name) {
      case ExceptionType.ValidationExceptions:
        exceptionResponse.title = "Validation Exceptions";
        exceptionResponse.errors = exception.getResponse().errors;
        exceptionResponse.statusCode = HttpStatus.BAD_REQUEST;
        break;

      case ExceptionType.ValidationError:
        exceptionResponse.title = "Validation Error";
        exceptionResponse.statusCode = HttpStatus.BAD_REQUEST;
        exceptionResponse.errors = this._getValidationError(exception);
        break;

      case ExceptionType.CastError:
        exceptionResponse.title = `Cast Error`;
        exceptionResponse.statusCode = HttpStatus.BAD_REQUEST;
        exceptionResponse.errors = this._getCastError(exception);
        break;

      default:
        if (exception.code === MONGODB_CODES.BULK_WRITE_ERROR) {
          exceptionResponse.title = "Duplicate Field Value Entered";
          exceptionResponse.statusCode = HttpStatus.CONFLICT;
          exceptionResponse.errors = this._getBulkWriteError(exception);
        }
        break;
    }

    const prodErrorResponse = {
      type: exception.name,
      title: exceptionResponse.title,
      errors: exceptionResponse.errors,
    };

    this._logException(exceptionResponse?.stack);
    writeExceptionLogToFile(exceptionResponse);

    return response.status(exceptionResponse.statusCode).json(prodErrorResponse);
  }

  private _logException(exceptionStack?: any) {
    new ConsoleLogger().error(exceptionStack);
  }

  private _getValidationError(exception: any): ErrorDetail[] {
    return Object.values(exception.errors).map((val: any) => {
      return {
        property: val.path,
        message: val["message"],
      };
    });
  }

  private _getCastError(exception: any): ErrorDetail[] {
    return [
      {
        property: exception.path,
        message: exception?.message || "Cast Error",
      },
    ];
  }

  private _getBulkWriteError(exception: any): ErrorDetail[] {
    return Object.keys(exception.keyValue).map(key => {
      return {
        property: key,
        message: exception?.message || "Duplicate Field Value",
      };
    });
  }
}
