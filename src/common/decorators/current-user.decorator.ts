import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const User = createParamDecorator((_, req): any | null => {
    
    return req.args[2].request.user
});