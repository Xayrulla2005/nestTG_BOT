import { Module } from '@nestjs/common';
import { BotService } from './bot.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Bot, BotSchema } from './schema/bot.schema';
import { QuestionModule } from './question.module';

@Module({
  imports:[MongooseModule.forFeature([{name:Bot.name,schema:BotSchema}]),QuestionModule],
  controllers: [],
  providers: [BotService],
})
export class BotModule {}
