
import { Controller, Get, Post, Body, Redirect } from '@nestjs/common';
import { PurchaseService } from './purchase.service';

@Controller()
export class PurchaseController {
  constructor(private purchaseService: PurchaseService) { }

  @Get('ok')
  @Redirect('https://academy.fivepoints.fr/purchase/success', 301)
  getOk() {
    return { message: 'OK' };
    // return this.appService.getHello();
  }
  @Get('ko')
  @Redirect('https://academy.fivepoints.fr/purchase/error', 301)
  getKo() {
    return { message: 'OK' };
    // return this.appService.getHello();
  }
  @Post('paymentGpg')
  paymentNotif(@Body() body: any) {
    console.log('hello');
    console.log(body);
    let paymentStatus = 'waitingPayment';
    switch (body.TransStatus) {
      case '00':
        paymentStatus = 'payed';
        break;
      case '05':
        paymentStatus = 'refused';
        break;
      case '06':
        paymentStatus = 'canceled';
        break;
      case '08':
        paymentStatus = 'chargeBack';
        break;
      case '07':
        paymentStatus = 'refunded';
        break;
      default:
        paymentStatus = 'waitingPayment';
        break;
    }
    this.purchaseService.updateOrderFromPaymentGpg({ paymentStatus, orderId: body.PAYID });
    return { message: 'NOT OK' };
  }
}
