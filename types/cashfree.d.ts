declare module '@cashfreepayments/cashfree-js' {
  export interface CashfreeInstance {
    checkout(options: {
      paymentSessionId: string
      redirectTarget?: '_self' | '_modal' | '_blank'
    }): Promise<any>
  }

  export function load(options: { mode: 'sandbox' | 'production' }): Promise<CashfreeInstance>
}
