import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

export class GrpcInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const ctx = context.switchToRpc().getContext();
    const data = context.switchToRpc().getData();
    const meta = ctx.getMap();

    const targetClass = context.getClass().name;
    const targetHandler = context.getHandler().name;

    const traceId = meta['trace-id'];
    const clientService = meta['client-service'];
    const clientClass = meta['client-class'];
    const clientMethod = meta['client-method'];

    const from = `${clientService}/${clientClass}/${clientMethod}`;
    const to = `${targetClass}/${targetHandler}`;

    const reqTimestamp = new Date();

    const receivedReqLog = {
      type: 'RECEIVED_REQUEST',
      traceId,
      from,
      to,
      data,
      timestamp: reqTimestamp.toUTCString(),
    };

    console.log(receivedReqLog);

    return next.handle().pipe(
      map((data) => {
        const resTimestamp = new Date();
        const resTime = `${+resTimestamp - +reqTimestamp}ms`;

        const responseLog = {
          type: 'RETURN_RESPONSE',
          traceId,
          from,
          to,
          data,
          resTime,
          timestamp: resTimestamp.toUTCString(),
        };

        console.log(responseLog);

        return data;
      }),
    );
  }
}
