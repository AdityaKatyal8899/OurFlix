import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeOrder, CASHFREE_ADDONS, CashfreeAddonKey } from '@/lib/cashfree'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'
import { slugBloomFilter } from '@/lib/bloom-filter'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log('Cashfree webhook received:', JSON.stringify(body))

    const orderId =
      body?.data?.order?.order_id ||
      body?.orderId ||
      body?.order_id

    if (!orderId) {
      return NextResponse.json({ message: 'No order ID in webhook' }, { status: 200 })
    }

    // Double-verify with Cashfree Server directly
    const cfOrder = await getCashfreeOrder(orderId)

    if (cfOrder && cfOrder.order_status === 'PAID') {
      const slug = cfOrder.order_tags?.slug?.toLowerCase()
      const orderType = cfOrder.order_tags?.orderType || 'plan'
      const transactionId = cfOrder.cf_order_id || cfOrder.order_id

      if (slug) {
        await connectToDatabase()

        if (orderType === 'addon') {
          const addonKey = cfOrder.order_tags?.addonKey as CashfreeAddonKey
          const addon = CASHFREE_ADDONS[addonKey]
          if (addon) {
            const updateQuery: Record<string, any> = {}
            if (addon.type === 'row') updateQuery.$inc = { addonRows: addon.value }
            if (addon.type === 'photos') updateQuery.$inc = { addonPhotos: addon.value }
            if (addon.type === 'videos') updateQuery.$inc = { addonVideos: addon.value }
            if (addon.type === 'audio') updateQuery.$set = { hasCustomAudioAddon: true }
            if (addon.type === 'extension') {
              const currentSite = await Site.findOne({ slug })
              const currentExpiry = currentSite?.expiresAt ? new Date(currentSite.expiresAt) : new Date()
              const newExpiry = new Date(Math.max(currentExpiry.getTime(), Date.now()) + 365 * 24 * 60 * 60 * 1000)
              updateQuery.$set = { ...(updateQuery.$set || {}), expiresAt: newExpiry }
            }
            await Site.findOneAndUpdate({ slug }, updateQuery)
            console.log(`Cashfree addon "${addon.name}" credited to "${slug}".`)
          }
        } else {
          const plan = (cfOrder.order_tags?.plan as 'mini' | 'premier' | 'vip') || 'premier'
          const oneYearFromNow = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)

          await Site.findOneAndUpdate(
            { slug },
            {
              $set: {
                isPaid: true,
                plan,
                transactionId,
                cashfreeOrderId: cfOrder.order_id,
                paidAt: new Date(),
                expiresAt: oneYearFromNow,
                paymentProvider: 'cashfree',
              },
            },
            { new: true }
          )
          console.log(`Cashfree plan "${plan}" confirmed for "${slug}". Transaction ID: ${transactionId}`)
          slugBloomFilter.add(slug)
        }
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Error handling Cashfree webhook:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
