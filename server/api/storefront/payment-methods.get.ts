export default defineEventHandler(async () => availablePaymentMethods(await readCollection('payments')))
