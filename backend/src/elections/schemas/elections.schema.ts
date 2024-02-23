import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Elections {
  @Prop({ required: true })
  chat: number;

  @Prop({ required: true })
  title: string;

  @Prop({ required: false })
  start?: Date;

  @Prop({ required: false })
  end?: Date;
}

export const ElectionsSchema = SchemaFactory.createForClass(Elections);
