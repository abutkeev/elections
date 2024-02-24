import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Elections } from 'src/elections/schemas/elections.schema';

@Schema({
  toJSON: {
    transform: (_, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
    },
  },
})
export class Candidate {
  @Prop({ required: true, ref: Elections.name })
  elections_id: string;

  @Prop({ required: true })
  user_id: number;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  program: string;
}

export const CandidatesSchema = SchemaFactory.createForClass(Candidate);

CandidatesSchema.index({ elections_id: 1, user_id: 1 }, { unique: true });
