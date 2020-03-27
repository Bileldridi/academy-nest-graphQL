import { createParamDecorator } from '@nestjs/common';

// export const User = createParamDecorator((data, [root, args, ctx, info]) => ctx.req.user);

export const User = createParamDecorator((_, req): any | null => {
    return req.args[2].request.user
});

// import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const User = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();



//     console.log('createParamDecoratorcreateParamDecoratorcreateParamDecoratorcreateParamDecoratorcreateParamDecorator',ctx)
//     return request.user;
//   },
// );
