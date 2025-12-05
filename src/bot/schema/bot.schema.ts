import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type botDocument=HydratedDocument<Bot>

@Schema()
export class Bot{
  @Prop()
  chatId:number;

  @Prop()
  username:string;

}

export const BotSchema=SchemaFactory.createForClass(Bot)