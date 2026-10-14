import { NextRequest, NextResponse } from 'next/server'
import { getCashfreeOrder } from '@/lib/cashfree'
import { connectToDatabase } from '@/lib/mongodb'
import { Site } from '@/models/Site'

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
      const slug = cfOrder.order_tags?.slug
      const plan = (cfOrder.order_tags?.plan as 'mini' | 'premier' | 'vip') || 'premier'
      const transactionId = cfOrder.cf_order_id || cfOrder.order_id

      if (slug) {
        await connectToDatabase()
        await Site.findOneAndUpdate(
          { slug: slug.toLowerCase() },
          {
            $set: {
              isPaid: true,
              plan,
              transactionId,
              cashfreeOrderId: cfOrder.order_id,
              paidAt: new Date(),
              paymentProvider: 'cashfree',
            },
          },
          { new: true }
        )
        console.log(`Cashfree payment confirmed for "${slug}". Transaction ID: ${transactionId}`)
      }
    }

    return NextResponse.json({ success: true })
  } catch (err: unknown) {
    console.error('Error handling Cashfree webhook:', err)
    return NextResponse.json({ error: 'Webhook processing failed' }, { status: 500 })
  }
}
