import { ExecutionContext, Injectable, CanActivate } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
// import { AuthGuard } from '@nestjs/passport';
import { AuthGuard } from '../common/passport/auth.guard';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
    async canActivate(context: ExecutionContext): Promise<boolean> {
        const ctx = GqlExecutionContext.create(context);
        const { request, response } = ctx.getContext();
        return await super.canActivate(new ExecutionContextHost([request, response]));
    }
}