import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { catchError, map, Observable, throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';

export class RpcInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        const res = {
          status: 'success',
          data,
        };

        console.log(res);

        return res;
      }),
      catchError((err) => {
        const res = {
          status: 'error',
          error: err,
        };

        console.log(res);

        return throwError(() => new RpcException(err));
      }),
    );
  }
}
