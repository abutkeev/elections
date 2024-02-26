import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Elections } from 'src/elections/schemas/elections.schema';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Ballot {
  @Prop({ required: true, ref: Elections.name })
  elections_id: string;

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  vote: number[];
}

export const BallotsSchema = SchemaFactory.createForClass(Ballot);

BallotsSchema.index({ elections_id: 1, user_id: 1 }, { unique: true });
