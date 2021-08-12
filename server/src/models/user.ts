import { Draft, DraftType } from './draft';
import { Schema, model, Document } from 'mongoose';
import { subscribe } from '../routes/googleOAuthRoute';

interface IUser {
  name: string
  email: string;
  isSubscribed: boolean;
}

const schema = new Schema<IUser>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  isSubscribed: { type: Boolean, default: false }
});

schema.post('save', (user: UserType) => {
  new Draft({
    userId: user._id,
    title: 'Getting Started',
    content: "{\"blocks\":[{\"key\":\"foo\",\"text\":\"Hi there !\",\"type\":\"header-one\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"cg8ru\",\"text\":\"Features You can Have\",\"type\":\"header-two\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"6m6n2\",\"text\":\"Headings\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"e1678\",\"text\":\"Blockquote\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"6h0pv\",\"text\":\"list\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"9fgu1\",\"text\":\"Awesome Right ?\",\"type\":\"blockquote\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"9hmkd\",\"text\":\"With love,\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"dk8hv\",\"text\":\"shrihari\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[{\"offset\":0,\"length\":8,\"style\":\"ITALIC\"}],\"entityRanges\":[],\"data\":{}},{\"key\":\"8dlul\",\"text\":\"\",\"type\":\"unstyled\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}",
    createdBy: user.name,
    preview: "{\"blocks\":[{\"key\":\"foo\",\"text\":\"Hi there !\",\"type\":\"header-one\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"cg8ru\",\"text\":\"Features You can Have\",\"type\":\"header-two\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}},{\"key\":\"6m6n2\",\"text\":\"Headings\",\"type\":\"unordered-list-item\",\"depth\":0,\"inlineStyleRanges\":[],\"entityRanges\":[],\"data\":{}}],\"entityMap\":{}}"
  }
  ).save();
})

export const User = model<IUser>('User', schema);
export type UserType = IUser & Document<any, any, IUser>;
