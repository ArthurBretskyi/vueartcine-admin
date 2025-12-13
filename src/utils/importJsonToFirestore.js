import { collection, doc, setDoc } from 'firebase/firestore'
import db from '@/firebase/firebase-config'

/**
 * 🔥 Універсальний імпорт JSON у Firestore
 *
 * Підтримує:
 *  - Масиви ( [...{...}, {...}] )
 *  - Об’єкти ( { key: [...], key2: {...} } )
 *  - Змішані вкладення
 *  - Автоматичне створення document ID
 *  - Використання id або movieId, якщо є
 *  - Спецвипадок: meta/collections → один документ
 *
 * @param {string} collectionName - назва колекції Firestore
 * @param {object|array} data - JSON-дані для імпорту
 * @param {string} [customId] - необов’язковий ідентифікатор (наприклад 'collections')
 */
export async function importJsonToFirestore(collectionName, data, customId = '') {
  if (!collectionName || typeof collectionName !== 'string') {
    throw new Error('Collection name must be a non-empty string')
  }
  if (!data) {
    throw new Error('No data provided for import')
  }

  // 🔹 Спецвипадок: meta → завжди один документ (наприклад meta/collections)
  if (collectionName === 'meta') {
    const id = customId || 'collections'
    const docRef = doc(db, 'meta', id)
    await setDoc(docRef, data, { merge: true })
    console.log(`✅ Imported single document: meta/${id}`)
    return { count: 1, type: 'meta' }
  }

  const colRef = collection(db, collectionName)
  let importedCount = 0

  async function processData(input, parentKey = '') {
    // Якщо масив → кожен елемент — документ
    if (Array.isArray(input)) {
      for (const item of input) {
        const id =
          item.id || item.movieId || item.uid || `${parentKey || 'item'}_${crypto.randomUUID()}`
        await setDoc(doc(colRef, id), item)
        importedCount++
      }
      return
    }

    // Якщо об’єкт → може бути або одним документом, або словником
    if (typeof input === 'object' && input !== null) {
      const keys = Object.keys(input)
      const allArrays = keys.every((k) => Array.isArray(input[k]))

      if (allArrays) {
        // 🔹 Кейс: { Kyiv: [...], Dnipro: [...] }
        for (const [cityName, cinemas] of Object.entries(input)) {
          const cityDocRef = doc(colRef, cityName)
          await setDoc(cityDocRef, { cinemas })
          importedCount++
        }
      } else {
        // 🔹 Кейс: { movieId: {...}, ... }
        for (const [key, value] of Object.entries(input)) {
          if (typeof value === 'object') {
            const id = key || crypto.randomUUID()
            await setDoc(doc(colRef, id), value)
            importedCount++
          } else {
            await setDoc(doc(colRef, parentKey || 'item_' + crypto.randomUUID()), input)
            importedCount++
            break
          }
        }
      }
      return
    }

    throw new Error('Unsupported JSON format')
  }

  await processData(data)
  console.log(`✅ Imported ${importedCount} items into "${collectionName}"`)
  return { count: importedCount }
}
