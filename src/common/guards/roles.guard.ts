
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean {
        const roles = this.reflector.get<string[]>('roles', context.getHandler());
        if (!roles) {
            return true;
        }
        const request: any = context.switchToHttp();
        const user = request.args[2].request.user;
        const hasRole = () => roles.some(role => !!(user.role === role));        
        return user && user.role && hasRole();
    }
}