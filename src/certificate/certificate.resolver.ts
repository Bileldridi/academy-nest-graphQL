import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CertificateService } from './certificate.service';
import { UseGuards } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';

@Resolver('Certificate')
export class CertificateResolver {
    constructor(private certificateService: CertificateService) { }

    
    @Query('getCertificate')
    async getCertificate(@Args('code') code: string) {
        return await this.certificateService.getCertificate(code);
    }

    @UseGuards(GraphqlAuthGuard)
    @Mutation('addCertificate')
    async addCertificated(@Args('pathId') idPath, @User() user) {
        return await this.certificateService.addCertificate(idPath, user.id);
    }
    @UseGuards(GraphqlAuthGuard)
    @Mutation('updateCertificate')
    async updateCertificate(@Args('urlImg') urlImg: string,@Args('id') id) {
        return await this.certificateService.updateCertificate(id, urlImg);
    }

}
