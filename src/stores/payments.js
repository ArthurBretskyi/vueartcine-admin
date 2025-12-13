import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const usePaymentsStore = defineStore('payments', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('payments', generalApiOperation)

  return {
    ...base,
  }
})
