import { ExecutionContext, Injectable, CanActivate, SetMetadata, BadRequestException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ExecutionContextHost } from '@nestjs/core/helpers/execution-context-host';
import { AuthGuard } from '../passport/auth.guard';

@Injectable()
export class GraphqlAuthGuard extends AuthGuard('jwt') {
    canActivate(context: ExecutionContext) {
        const ctx = GqlExecutionContext.create(context);
        let { request } = ctx.getContext();
        if (typeof request === 'undefined') {
            // console.log(context.switchToWs())
            // console.log(context.switchToWs().getClient())
            const token = context.switchToWs().getData().token;
            if (!token) {
                // return true;
                // throw new BadRequestException('Authentication token not found.');
            }
            const authHeader = {
                authorization: '',
            };
            request = { headers: authHeader };
        }
        return super.canActivate(new ExecutionContextHost([request]));
    }
}

