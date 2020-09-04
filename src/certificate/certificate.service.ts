import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from "@nestjs/mongoose";
import { Model } from 'mongoose'
// import { sendCertif } from '../common/mailer/mailer'
import { idText } from 'typescript';
import { sendCertificate, sendContactMail, receiveContactMail } from '../common/mailer/mailer'




@Injectable()
export class CertificateService {
    constructor(

        @InjectModel('Certificate') private readonly certificateModel: Model<any>
    ) { }

    addCertificate = async (idPath, userId) => {
        const exist = await this.certificateModel.findOne({candidate: userId, pathId: idPath}).exec();
        if(exist) {
            return null;
        }
        const generatedCode = this.makeid(8);
        const object = {candidate: userId, code: generatedCode, pathId: idPath};
        const createdCertificate = await this.certificateModel.create(object);
        return createdCertificate;
    }
    generateCertificateAdmin = async (idPath, userId) => {
        const exist = await this.certificateModel.findOne({candidate: userId, pathId: idPath}).exec();
        if(exist) {
            return null;
        }
        const generatedCode = this.makeid(8);
        const object = {candidate: userId, code: generatedCode, pathId: idPath};
        const createdCertificate = await this.certificateModel.create(object);
        return await this.certificateModel.findById(createdCertificate._id).populate('candidate').populate('pathId').exec();
        
    }
    updateCertificate = async (urlImg, id) => {
        const certificate = await this.certificateModel.findByIdAndUpdate({ _id: id }, {$set: {imgURL: urlImg}}, {new: true, upsert: false}).populate('candidate').populate('pathId').exec();
        sendCertificate(certificate)
        return certificate;
    }
    updateCertificateAdmin = async (urlImg, idPath, idUser) => {
        const certificate = await this.certificateModel.findOneAndUpdate({ candidate: idUser, pathId: idPath }, {$set: {imgURL: urlImg}}, {new: true, upsert: false}).populate('candidate').populate('pathId').exec();
        sendCertificate(certificate)
        return certificate;
    }
    
    sendMailContact = async (email) => {
        sendContactMail(email)
        return {email};
    }

    receiveMailContact = async (email, name, msg) => {
        receiveContactMail(email, name, msg)
        return {email};
    }
    getCertificate = async (code) => {
        const certificate = await this.certificateModel.findOne({ code: code }).populate('candidate').populate('pathId').exec();
            if (certificate) {
                return certificate;
            } else {
                throw new NotFoundException('Could not find certificate');
            }
        
    }
    
    getCertificateAdmin = async (idUser, idPath) => {
        const certificate = await this.certificateModel.findOne({ candidate: idUser, pathId:idPath }).populate('candidate').populate('pathId').exec();
            if (certificate) {
                return certificate;
            } else {
                return this.generateCertificateAdmin(idPath, idUser);
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
