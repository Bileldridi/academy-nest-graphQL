import { ExecutionContext, Injectable, CanActivate, SetMetadata } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '../passport/auth.guard';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        const { request } = ctx.getContext();
        return super.canActivate(new ExecutionContextHost([request]));
    }
}

