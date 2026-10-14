import mongoose, { Schema, Document, Model } from 'mongoose'
import type { MediaItem } from '@/types/media'

export interface ISite extends Document {
  slug: string
  brandName: string
  profileName: string
  profileAvatar: string
  introAudioUrl: string
  creatorPasscode: string
  categories: string[]
  mediaItems: MediaItem[]
  isPaid: boolean
  plan?: 'mini' | 'premier' | 'vip'
  stripeSessionId?: string
  cashfreeOrderId?: string
  cashfreePaymentSessionId?: string
  paymentProvider?: 'cashfree' | 'stripe'
  transactionId?: string
  paidAt?: Date
  createdAt: Date
  updatedAt: Date
}

const MediaItemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ['image', 'video'], default: 'image' },
    thumbnail: { type: String, required: true },
    mediaUrl: { type: String, required: true },
    category: { type: String, required: true },
    tags: { type: [String], default: [] },
    favorite: { type: Boolean, default: false },
    date: { type: String, required: true },
    description: { type: String, default: '' },
  },
  { _id: false }
)

const SiteSchema = new Schema<ISite>(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    brandName: {
      type: String,
      default: 'RDXThunder',
      trim: true,
    },
    profileName: {
      type: String,
      default: 'CapyBara',
      trim: true,
    },
    profileAvatar: {
      type: String,
      default: '/pfp.jpeg',
    },
    introAudioUrl: {
      type: String,
      default: '/intro.mpeg',
    },
    creatorPasscode: {
      type: String,
      default: '1234',
    },
    categories: {
      type: [String],
      default: ['💖 HER', '👥 Peeps', '✨ Cute Moments', '🌸 Random Smiles'],
    },
    mediaItems: {
      type: [MediaItemSchema],
      default: [],
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    plan: {
      type: String,
      enum: ['mini', 'premier', 'vip'],
      default: 'premier',
    },
    stripeSessionId: {
      type: String,
    },
    cashfreeOrderId: {
      type: String,
    },
    cashfreePaymentSessionId: {
      type: String,
    },
    paymentProvider: {
      type: String,
      enum: ['cashfree', 'stripe'],
      default: 'cashfree',
    },
    transactionId: {
      type: String,
    },
    paidAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
)

export const Site: Model<ISite> =
  mongoose.models.Site || mongoose.model<ISite>('Site', SiteSchema)
