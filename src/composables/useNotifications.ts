// src/composables/useNotifications.ts
import { ref, onMounted } from 'vue'
import { initializeApp, FirebaseApp } from 'firebase/app'
import { getMessaging, Messaging, getToken, onMessage } from 'firebase/messaging'
import { createDiscreteApi, darkTheme } from 'naive-ui'
import { useUsersStore } from '@/store/useUserStore'

const { notification } = createDiscreteApi(
  ['notification'],
  {
    configProviderProps: {
      theme: darkTheme
    }
  }
)

const firebaseConfig = {
  apiKey:             import.meta.env.VITE_FIREBASE_API_KEY!,
  authDomain:         import.meta.env.VITE_FIREBASE_AUTH_DOMAIN!,
  projectId:          import.meta.env.VITE_FIREBASE_PROJECT_ID!,
  storageBucket:      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId:  import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID!,
  appId:              import.meta.env.VITE_FIREBASE_APP_ID!,
  measurementId:      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID!,
}

let firebaseApp: FirebaseApp | null = null
let messaging: Messaging | null   = null

export function useNotifications() {
  const currentToken     = ref<string | null>(null)
  const incomingPayload  = ref<any>(null)
  const { saveFcmToken } = useUsersStore()

  function initFirebase() {
    if (!firebaseApp) {
      firebaseApp = initializeApp(firebaseConfig)
    }
    if (!messaging) {
      messaging = getMessaging(firebaseApp)
    }
  }

  async function requestPermissionAndToken() {
    if (typeof window === 'undefined') return
    try {
      const permission = await Notification.requestPermission()
      if (permission === 'granted' && messaging) {
        const token = await getToken(messaging, {
          vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY!,
        })
        currentToken.value = token || null
        console.log('FCM токен:', token)
        saveFcmToken(token)
      } else {
        console.warn('Разрешение на уведомления не получено')
      }
    } catch (err) {
      console.error('Ошибка при получении токена', err)
    }
  }

  function subscribeOnMessage() {
    if (messaging) {
      onMessage(messaging, payload => {
        console.log('Сообщение получено:', payload)
        incomingPayload.value = payload

        // Показываем Naive‑UI нотификацию
        notification.info({
          title:   payload.notification?.title   || 'Новое уведомление',
          content: payload.notification?.body    || '',
          
        })
      })
    }
  }

  onMounted(() => {
    initFirebase()
    requestPermissionAndToken()
    subscribeOnMessage()
  })

  return {
    currentToken,
    incomingPayload,
  }
}