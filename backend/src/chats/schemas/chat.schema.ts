import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Chat {
  @Prop({ required: true, index: true, unique: true })
  id: number;

  @Prop({ required: true })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  status: string;
}

export const ChatsSchema = SchemaFactory.createForClass(Chat);
