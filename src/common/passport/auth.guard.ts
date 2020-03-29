import {
  CanActivate,
  ExecutionContext,
  mixin,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as passport from 'passport';

const defaultOptions = {
  session: false,
  property: 'user',
};

export function AuthGuard(type, role: string[] = [''], options: any = defaultOptions) {
  options = { ...defaultOptions, ...options };
  const guard = mixin(
    class implements CanActivate {
      constructor(private reflector: Reflector) { }
      async canActivate(context: ExecutionContext): Promise<boolean> {
        const httpContext = context.switchToHttp();
        const [request, response] = [httpContext.getRequest(), httpContext.getResponse(),];
        request[options.property || defaultOptions.property] = await new Promise((resolve, reject) =>
          passport.authenticate(type, options, (err, user, info) => {
            console.log(user);
            
            if (err || !user) {
              return reject(err || new UnauthorizedException());
            }
            request.user = user;
            resolve(user);
          })(request, response, resolve),
        );
        return request;
      }
    },
  );
  return guard;
}
