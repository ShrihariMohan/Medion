import { Schema, model, Document } from 'mongoose';

interface IDraft {
  userId: string,
  content: string,
  title: string,
  createdBy: string,
  preview: string
  level: string
}

const schema = new Schema<IDraft>({
  userId: String,
  content: String,
  title: String,
  createdBy: String,
  preview: String,
  level: { type: String, default: 'free' }
});

export const Draft = model<IDraft>('Draft', schema);
export type DraftType = IDraft & Document<any, any, IDraft>;
