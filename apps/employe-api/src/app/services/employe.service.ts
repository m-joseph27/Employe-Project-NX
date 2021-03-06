import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Employe } from '../repository/employe.model';
import { Model } from 'mongoose';
import { QueryOptions } from '../../../../../libs/configs/query-options.query';

@Injectable()
export class EmployesService {

  private employe: Employe[] = [];

  constructor(
    @InjectModel('Employe') private readonly employeModel: Model<Employe>
  ) {}

  async insertEmploye(
    fullName: string,
    nickName: string,
    age: number,
    phoneNumber: number,
    gender: string,
    department: string,
    created_at: Date
  ) {
    const newEmploye = new this.employeModel({
      fullName,
      nickName,
      age,
      phoneNumber,
      gender,
      department,
      created_at
    });
    const result = await newEmploye.save();
    return result;
  }

  async getAllEmploye(options: QueryOptions) {
    if (options.fields) {
      const result = await this.employeModel
      // to search employe by text
      .find({ [options.fields]: { $regex: `.*${options.text}.*` }}, (res) => {
        return res;
      })
      .skip(Number(options.offset))
      .limit(Number(options.limit))
      .exec();
      return {
        message: 'Employes list',
        Total: result.length,
        result,
      };
    } else {
      // paginate the result
      const result = await this.employeModel
        .find()
        .skip(Number(options.offset))
        .limit(Number(options.limit))
        .exec();
      return {
        message: 'Employes list',
        Total: result.length,
        result,
      };
    }
  }

  async getEmployeId(employeId: string) {
    const employe = await this.findEmploye(employeId);
    return employe;
  }

  async deleteEmploye(employeId: string) {
    let employe;
    try {
      employe = await this.employeModel.deleteOne({ _id: employeId });
    } catch (error) {
      throw new NotAcceptableException('Could Not Find Employe');
    }
    if (employe.n === 0) {
      throw new NotAcceptableException('Could Not Find Employe');
    }
  }

  async updateEmploye(
    id: string,
    fullName: string,
    nickName: string,
    age: number,
    phoneNumber: number,
    gender: string,
    department: string,
  ) {
    const employe = await this.findEmploye(id);
    if (fullName) {
      employe.fullName = fullName;
    }
    if (nickName) {
      employe.nickName = nickName;
    }
    if (age) {
      employe.age = age;
    }
    if (phoneNumber) {
      employe.phoneNumber = phoneNumber;
    }
    if (gender) {
      employe.gender = gender;
    }
    if (department) {
      employe.department = department;
    }

    employe.save();
  }

  private async findEmploye(employeId: string): Promise<Employe> {
    let employe;
    try {
      employe = await this.employeModel.findById(employeId)
    } catch (error) {
      throw new NotAcceptableException('Could Not Find Employe');
    }
    if (!employe) {
      throw new NotAcceptableException('Could Not Find Employe');
    }
    return employe;
  }

}
