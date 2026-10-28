import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    label: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    target: { type: String, enum: ['_self', '_blank'], default: '_self' },
    order: { type: Number, default: 0 },
    parentId: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    children: [{ type: mongoose.Schema.Types.Mixed }],
  },
  { _id: true }
);

const navigationMenuSchema = new mongoose.Schema(
  {
    location: {
      type: String,
      required: true,
      unique: true,
      enum: ['header', 'footer_col_1', 'footer_col_2', 'footer_col_3', 'legal_links'],
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    items: [menuItemSchema],
  },
  { timestamps: true }
);

export const NavigationMenu = mongoose.model('NavigationMenu', navigationMenuSchema);
