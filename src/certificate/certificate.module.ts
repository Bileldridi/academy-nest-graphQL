import { Module } from '@nestjs/common';
import { CertificateService } from "./certificate.service";
import { CertificateSchema } from "./schemas/certificate.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { CertificateResolver } from "./certificate.resolver";


@Module({
    imports: [
        MongooseModule.forFeature([{ name: 'Certificate', schema: CertificateSchema }]),
    ],
    providers: [CertificateResolver, CertificateService]

})
export class CertificateModule {}
