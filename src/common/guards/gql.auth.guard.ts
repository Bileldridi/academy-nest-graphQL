import { ExecutionContext, Injectable, CanActivate, SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../passport/auth.guard';
import { Reflector } from '@nestjs/core';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
    // constructor(private reflector: Reflector) {
    //     super();
    // }
    canActivate(context: ExecutionContext) {
        // const roles = this.reflector.get<string[]>('roles', context.getHandler());
        
        console.log('GraphqlAuthGuard');
        const ctx = GqlExecutionContext.create(context);
        const { request } = ctx.getContext();
        return super.canActivate(new ExecutionContextHost([request]));
    }
}

