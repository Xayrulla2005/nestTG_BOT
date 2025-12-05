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
      text: "Capital of France?",
      options: ["Paris", "Berlin", "Rome", "Madrid"],
      correctIndex: 0
    },
    {
      text: "Which is JS framework?",
      options: ["Laravel", "Django", "NestJS", "Flask"],
      correctIndex: 2
    },
    {
      text: "2 * 3 = ?",
      options: ["5", "6", "7", "8"],
      correctIndex: 1
    }
  ];

  async getRandom10() {
    // Sample uchun barcha savollarni qaytaradi
    return this.questions;
  }
}
