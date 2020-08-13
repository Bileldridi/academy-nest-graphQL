import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CertificateService } from './certificate.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from 'src/common/guards/gql.auth.guard';
import { User } from 'src/common/decorators/current-user.decorator';

@Resolver('Certificate')
export class CertificateResolver {
    constructor(private certificateService: CertificateService) { }

    @UseGuards(GraphqlAuthGuard)
    @Query('getCertificate')
    async getCertificate(@Args('code') code: string, @User() user) {
        return await this.certificateService.getCertificate(user.id, code);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation('addCertificate')
    async addCertificated(@Args('imgURL') imgURL: string, @Args('pathName') pathName: string, @User() user) {
        return await this.certificateService.addCertificate(user.id, imgURL, pathName);
    }
    

}
