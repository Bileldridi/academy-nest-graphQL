// import { createParamDecorator } from '@nestjs/common';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// export const User = createParamDecorator((data, [root, args, ctx, info]) => ctx.req.user);

export const User = createParamDecorator((_, req): any | null => {
    return req.args[2].request.user
});

// export const User = createParamDecorator((data, [root, args, ctx, info]) => {
//     console.log('decoreatoooooooooooooooooooooooooor', ctx.req)
//     return ctx.req.user
// });

// export const User = createParamDecorator(
//     (data, [root, args, ctx, info]): any => {
//         console.log(ctx);
//         return ctx.req && ctx.req.user
//     }
// );


// export const User = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();



//     console.log('createParamDecoratorcreateParamDecoratorcreateParamDecoratorcreateParamDecoratorcreateParamDecorator',ctx)
//     return request.user;
//   },
// );
