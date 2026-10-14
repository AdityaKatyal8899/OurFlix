const CASHFREE_APP_ID = process.env.CASHFREE_APP_ID || ''
const CASHFREE_SECRET_KEY = process.env.CASHFREE_SECRET_KEY || ''
const CASHFREE_ENV = process.env.CASHFREE_ENV === 'production' ? 'production' : 'sandbox'

const BASE_URL =
  CASHFREE_ENV === 'production'
    ? 'https://api.cashfree.com/pg'
    : 'https://sandbox.cashfree.com/pg'

export const CASHFREE_PRICING = {
  mini: {
    amount: 49.0,
    name: 'MyFlix Mini Reel (2 Rows, 20 Items)',
    priceFormatted: '₹49',
  },
  premier: {
    amount: 99.0,
    name: 'MyFlix Premier Blockbuster (4 Rows, 50 Items, Full Customization)',
    priceFormatted: '₹99',
  },
  vip: {
    amount: 199.0,
    name: 'MyFlix VIP Box Set (Unlimited Rows, 4K Video, Keepsake Domain)',
    priceFormatted: '₹199',
  },
} as const

export type CashfreePlanKey = keyof typeof CASHFREE_PRICING

export interface CreateOrderParams {
  orderId: string
  amount: number
  customerId: string
  customerPhone?: string
  customerEmail?: string
  customerName?: string
  returnUrl: string
  notifyUrl?: string
  orderNote?: string
  tags?: Record<string, string>
}

export interface CashfreeOrderResponse {
  cf_order_id: string
  order_id: string
  order_status: 'ACTIVE' | 'PAID' | 'EXPIRED' | 'TERMINATED'
  order_amount: number
  order_currency: string
  payment_session_id: string
  order_tags?: Record<string, string>
}

export async function createCashfreeOrder(
  params: CreateOrderParams
): Promise<CashfreeOrderResponse> {
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    throw new Error('Cashfree credentials are missing in environment variables.')
  }

  const payload = {
    order_id: params.orderId,
    order_amount: params.amount,
    order_currency: 'INR',
    customer_details: {
      customer_id: params.customerId,
      customer_phone: params.customerPhone || '9999999999',
      customer_email: params.customerEmail || 'creator@myflix.com',
      customer_name: params.customerName || 'MyFlix Creator',
    },
    order_meta: {
      return_url: params.returnUrl,
      ...(params.notifyUrl ? { notify_url: params.notifyUrl } : {}),
    },
    order_note: params.orderNote || 'MyFlix Personalized Stream',
    ...(params.tags ? { order_tags: params.tags } : {}),
  }

  const res = await fetch(`${BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = data.message || data.error || 'Failed to create Cashfree order'
    throw new Error(errorMsg)
  }

  return data as CashfreeOrderResponse
}

export async function getCashfreeOrder(orderId: string): Promise<CashfreeOrderResponse> {
  if (!CASHFREE_APP_ID || !CASHFREE_SECRET_KEY) {
    throw new Error('Cashfree credentials are missing in environment variables.')
  }

  const res = await fetch(`${BASE_URL}/orders/${orderId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'x-api-version': '2023-08-01',
      'x-client-id': CASHFREE_APP_ID,
      'x-client-secret': CASHFREE_SECRET_KEY,
    },
  })

  const data = await res.json()

  if (!res.ok) {
    const errorMsg = data.message || data.error || 'Failed to fetch Cashfree order'
    throw new Error(errorMsg)
  }

  return data as CashfreeOrderResponse
}
