import type { PaymentSettings } from '~/stores/payments'

export default defineEventHandler(async (event) => {
  const payments = await readCollection('payments')
  payments.settings = { ...payments.settings, ...(await readBody<Partial<PaymentSettings>>(event)) }
  await writeCollection('payments', payments)
  return payments.settings
})
