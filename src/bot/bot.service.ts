import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Bot } from './schema/bot.schema';
import { Model } from 'mongoose';
import TelegramBot from 'node-telegram-bot-api';
import { QuestionService } from './question.service'; 

@Injectable()
export class BotService {

  private bot: TelegramBot;

  private sessions = new Map<number, {
    questions: any[],
    index: number,
    correct: number
  }>();

  private ownerId: number = Number(process.env.OWNER_ID);

  constructor(
    @InjectModel(Bot.name) private botModel: Model<Bot>,
    private questionService: QuestionService   
  ) {
    this.bot = new TelegramBot(process.env.BOT_TOKEN as string, { polling: true });

   
    this.bot.onText(/\/start/, async (msg) => {
      const chatId = msg.chat.id;
      const firstname = msg.from?.first_name || "";

      const foundedUser = await this.botModel.findOne({ chatId });

      if (!foundedUser && chatId !== this.ownerId) {
        await this.botModel.create({ username: firstname, chatId });
        this.bot.sendMessage(chatId, `Botga xush kelibsiz!`);
        this.bot.sendMessage(this.ownerId, `Yangi user: ${firstname}`);
      } else {
        this.bot.sendMessage(chatId, `Botdagi misolarni yeching!`);
      }
    });

    
    this.bot.onText(/\/quiz/, async (msg) => {
      const chatId = msg.chat.id;

      
      const questions = await this.questionService.getRandom10();

      this.sessions.set(chatId, {
        questions,
        index: 0,
        correct: 0
      });

      const q = questions[0];

      this.bot.sendMessage(
        chatId,
        `Savol 1:\n\n${q.text}`,
        this.createQuizKeyboard(q.options)
      );
    });

    this.bot.on("callback_query", async (query) => {
      const chatId = query.message!.chat.id;
      const answerIndex = Number(query.data);

      const session = this.sessions.get(chatId);
      if (!session) return;

      const currentQuestion = session.questions[session.index];

      if (answerIndex === currentQuestion.correctIndex) {
        session.correct++;
      }

      session.index++;

      if (session.index >= session.questions.length) {

        const wrong = session.questions.length - session.correct;

        this.bot.sendMessage(
          chatId,
          `Test tugadi!\n\nTo‘g‘ri: ${session.correct}\nXato: ${wrong}`
        );

        this.sessions.delete(chatId);
        return;
      }

      const q = session.questions[session.index];
      this.bot.sendMessage(
        chatId,
        `Savol ${session.index + 1}:\n\n${q.text}`,
        this.createQuizKeyboard(q.options)
      );
    });

  }

  createQuizKeyboard(options: string[]) {
    return {
      reply_markup: {
        inline_keyboard: [
          [
            { text: options[0], callback_data: "0" },
            { text: options[1], callback_data: "1" },
          ],
          [
            { text: options[2], callback_data: "2" },
            { text: options[3], callback_data: "3" },
          ]
        ]
      }
    };
  }

}
