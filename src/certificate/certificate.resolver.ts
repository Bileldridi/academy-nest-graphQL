import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { CertificateService } from './certificate.service';
import { UseGuards, SetMetadata } from '@nestjs/common';
import { GraphqlAuthGuard } from '../common/guards/gql.auth.guard';
import { User } from '../common/decorators/current-user.decorator';
import { Roles } from '../common/decorators/roles.decorator';
import { RolesGuard } from '../common/guards/roles.guard';
@Resolver('Certificate')
export class CertificateResolver {
    constructor(private certificateService: CertificateService) { }

    
    @Query('getCertificate')
    async getCertificate(@Args('code') code: string) {
        return await this.certificateService.getCertificate(code);
    }
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Query('getCertificateAdmin')
    async getCertificateAdmin(@Args('idUser') idUser: string, @Args('idPath') idPath: string) {
        return await this.certificateService.getCertificateAdmin(idUser, idPath);
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
    @SetMetadata('roles', ['admin'])
    @UseGuards(GraphqlAuthGuard, RolesGuard)
    @Roles('admin')
    @Mutation('updateCertificateAdmin')
    async updateCertificateAdmin(@Args('urlImg') urlImg: string,@Args('idPath') idPath: string, @Args('idUser') idUser: string) {
        return await this.certificateService.updateCertificateAdmin(urlImg, idPath, idUser);
    }

    @Mutation('sendMailContact')
    async sendMailContact(@Args('email') email: string) {
       return await this.certificateService.sendMailContact(email);
    }
    
    @Mutation('receiveMailContact')
    async receiveMailContact(@Args('email') email: string, @Args('name') name: string, @Args('msg') msg: string) {
       return await this.certificateService.receiveMailContact(email, name, msg);
    }
    
}
