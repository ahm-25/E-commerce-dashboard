// Governorates covered by an active shipping zone
export default defineEventHandler(async () => coveredGovernorates(await readCollection('shipping')))
