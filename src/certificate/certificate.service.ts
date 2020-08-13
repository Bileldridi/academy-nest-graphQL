import { Injectable } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
import { sendCertif } from '../common/mailer/mailer'



@Injectable()
export class CertificateService {
    constructor(

        @InjectModel('Certificate') private readonly certificateModel: Model<any>
    ) { }

    addCertificate = async (userId, imgURL, pathName ) => {

        const generatedCode = this.makeid(8)
        const newCertificate = new this.certificateModel({
            user: userId,
            code: generatedCode,
            imgURL,
            pathName
        })

        const createdCertificate = await newCertificate.save();
        const certificate = await this.certificateModel.findById({ _id: createdCertificate.id }).populate('user').exec();
        sendCertif(certificate.user, pathName, imgURL);
        return createdCertificate
    }
    getCertificate = async (userId, code) => {

        const certificate = await this.certificateModel.findOne({ code: code }).populate('user').exec()
        
            if (certificate.user.id === userId) {
                return certificate;
            } else {
                return null;
            }
        
    }
    

    makeid = length => {
        let text = "";
        const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    
        for (let i = 0; i < length; i++) {
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        }
    
        return text;
    }

}
