import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useBookingsStore = defineStore('bookings', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('bookings', generalApiOperation)

  return {
    ...base,
  }
})
