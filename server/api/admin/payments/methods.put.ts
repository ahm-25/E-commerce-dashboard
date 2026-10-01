import type { PaymentMethod } from '~/stores/payments'

// Replaces the methods list (toggle, default and reorder all go through here)
export default defineEventHandler(async (event) => {
  const payments = await readCollection('payments')
  payments.methods = await readBody<PaymentMethod[]>(event)
  payments.settings.defaultMethodId = payments.methods.find(m => m.isDefault)?.id ?? null
  await writeCollection('payments', payments)
  return payments.methods
})
