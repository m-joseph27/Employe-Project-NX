import { Injectable, NotAcceptableException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Attendance } from '../repository/interface/attendance.interface';
import { Model } from 'mongoose';

@Injectable()
export class AttendanceService {

  private attendance: Attendance[] = [];

  constructor(
    @InjectModel('Attendance') private readonly attendanceModel:Model<Attendance>
  ) {}

  async insertAttendance(
    fullName: string,
    nickName: string,
    department: string,
    sickLeave: number,
    permissonLeave: number,
    alpha: number,
    totalAttendance: number,
    created_at: Date,
  ) {
    const newAttendance = new this.attendanceModel({
      fullName,
      nickName,
      department,
      sickLeave,
      permissonLeave,
      alpha,
      totalAttendance,
      created_at,
    });
    const result = await newAttendance.save()
    return result;
  }

  async getAllAttendance() {
    const attendances = await this.attendanceModel.find().exec();
    return attendances;
  }

  async getAttendance(id: string) {
    const attendance = await this.findAttendance(id);
    return attendance;
  }

  async updateAttendance(
    id: string,
    fullName: string,
    nickName: string,
    department: string,
    sickLeave: number,
    permissionLeave: number,
    alpha: number,
    totalAttendance: number,
  ) {
    const attendance = await this.findAttendance(id);
    if (fullName) {
      attendance.fullName = fullName;
    }
    if (nickName) {
      attendance.nickName = nickName;
    }
    if (department) {
      attendance.department = department;
    }
    if (sickLeave) {
      attendance.sickLeave = sickLeave;
    }
    if (permissionLeave) {
      attendance.permissonLeave = permissionLeave;
    }
    if (alpha) {
      attendance.alpha = alpha;
    }
    if (totalAttendance) {
      attendance.totalAttendance = totalAttendance;
    }

    attendance.save();
  }

  async deleteAttendance(id: string) {
    let attendance;
    try {
      attendance = await this.attendanceModel.deleteOne({ _id: id })
    } catch (error) {
      throw new NotAcceptableException('Could Not Find Attendance');
    }
    if (attendance.n === 0) {
      throw new NotAcceptableException('Could Not Find Employe');
    }
  }

  private async findAttendance(id: string): Promise<Attendance> {
    let attendance;
    try {
      attendance = await this.attendanceModel.findById(id);
    } catch (error) {
      throw new NotAcceptableException('Could Not Find The Attendance');
    }
    if (!attendance) {
      throw new NotAcceptableException('Could Not Find The Attendance');
    }

    return attendance;
  }

}
