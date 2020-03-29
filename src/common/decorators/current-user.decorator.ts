import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const User = createParamDecorator((_, req): any | null => {
    console.log(req.args[2].request.user);
    return req.args[2].request.user
});