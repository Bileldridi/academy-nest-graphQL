
import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller()
export class AppController {
  constructor() {}

  @Get()
  getHello() {
      return {message:'OK'};
    // return this.appService.getHello();
  }
  @Post('payment')
  paymentNotif(){
    console.log('hello');
    // console.log(body);
    return {message:'NOT OK'};
  }
}
