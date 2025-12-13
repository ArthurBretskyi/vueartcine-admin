// ======================================
// Імпорт фільмів до Firestore
// ======================================

import { doc, setDoc } from 'firebase/firestore'
import db from '@/firebase/firebase-config'
import moviesData from '@/assets/movies_firestore_doc.json'

// 🔹 Колекція, у яку додаємо фільми
const collectionName = 'movies'

// 🔹 Головна функція імпорту
async function importMovies() {
  try {
    console.log(`🚀 Починаємо імпорт до колекції "${collectionName}"...`)

    for (const movie of moviesData) {
      const docRef = doc(db, collectionName, movie.movieId)
      await setDoc(docRef, movie)
      console.log(`✅ Додано фільм: ${movie.title}`)
    }

    console.log('🎉 Імпорт фільмів завершено успішно!')
  } catch (error) {
    console.error('❌ Помилка при імпорті фільмів:', error)
  }
}

// Виклик функції
importMovies()
