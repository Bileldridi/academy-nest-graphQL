import { Module, HttpModule } from '@nestjs/common';
import { PurchaseResolver } from './purchase.resolver';
import { PurchaseService } from './purchase.service';
import { OrderSchema } from './schemas/order.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { CemeterySchema } from '../common/schemas/cemetery.schema';
import { UserSchema } from '../users/schemas/user.schema';
import { AccessSchema } from '../courses/schemas/access.schema';
import { CourseSchema } from '../courses/schemas/course.schema';
import { LevelSchema } from '../courses/schemas/level.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: 'Cemetery', schema: CemeterySchema }]),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),
    MongooseModule.forFeature([{ name: 'Access', schema: AccessSchema }]),
    MongooseModule.forFeature([{ name: 'Course', schema: CourseSchema }]),
    MongooseModule.forFeature([{ name: 'Level', schema: LevelSchema }]),
    HttpModule
  ],
  providers: [PurchaseResolver, PurchaseService]
})
export class PurchaseModule { }
