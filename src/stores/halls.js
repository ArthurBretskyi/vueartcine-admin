import { defineStore } from 'pinia'
import getStoreTemplate from './helpers/storeTemplate'
import { useGeneralStore } from './general'

export const useHallsStore = defineStore('halls', () => {
  const { generalApiOperation } = useGeneralStore()
  const base = getStoreTemplate('halls', generalApiOperation)

  return {
    ...base,
  }
})
