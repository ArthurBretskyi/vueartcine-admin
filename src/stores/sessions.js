import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useSessionsStore = defineStore('sessions', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('sessions', generalApiOperation)

  return {
    ...base,
  }
})
