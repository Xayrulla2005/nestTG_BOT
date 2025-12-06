import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Question } from './schema/question.schema';
import { Model } from 'mongoose';

@Injectable()
export class QuestionService {

  constructor(
    @InjectModel(Question.name) private questionModel: Model<Question>
  ){}

  create(data: {text: string, options: string[], correctIndex: number}) {
    return this.questionModel.create(data);
  }

  findAll() {
    return this.questionModel.find();
  }

  Random10() {
    return this.questionModel.aggregate([{ $sample: { size: 10 } }]);
  }

    private questions = [
    {
      text: "1 + 1 = ?",
      options: ["1", "2", "3", "4"],
      correctIndex: 1
    },
    {
      text: "5*2=?",
      options: ["10", "11", "12", "5"],
      correctIndex: 0
    },
    {
      text: "8*7=?",
      options: ["78", "65", "56", "87"],
      correctIndex: 2
    },
    {
      text: "2 * 3 = ?",
      options: ["5", "6", "7", "8"],
      correctIndex: 1
    },
    {
      text: "4*3 = ?",
      options: ["34", "12", "21", "43"],
      correctIndex: 1
    },
    {
      text: "5*4 = ?",
      options: ["5", "45", "20", "9"],
      correctIndex: 2
    },
    {
      text: "7*4 = ?",
      options: ["5", "6", "7", "28"],
      correctIndex: 3
    },
    {
      text: "(2)*2 = ?",
      options: ["5", "2", "3", "4"],
      correctIndex: 3
    },
    {
      text: "15/3 = ?",
      options: ["5", "6", "7", "8"],
      correctIndex: 0
    },
    {
      text: "12/2 = ?",
      options: ["3", "6", "9", "12"],
      correctIndex: 1
    },
  ];

  async getRandom10() {
    // Sample uchun barcha savollarni qaytaradi
    return this.questions;
  }
}
