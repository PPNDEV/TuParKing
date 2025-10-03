# TuParKing 🚗📍  
_Plataforma móvil para encontrar, reservar y gestionar estacionamientos en tiempo real._

> Proyecto desarrollado con **React Native + Expo**, orientado inicialmente a dispositivos **Android** (desarrollo y construcción mediante **Android Studio**) utilizando **Visual Studio Code** como entorno principal.

---

## 🌐 Descripción

**TuParKing** busca optimizar la experiencia de los conductores al:
- Localizar parqueaderos disponibles cercanos.
- Administrar reservas (crear, confirmar, cancelar).
- Integrarse con servicios de mapas y (opcional) pagos.
- Ofrecer un panel (futuro) para operadores de estacionamientos.

---

## ✨ Características Clave (Actuales / Planeadas)

- 🔍 Búsqueda de parqueaderos por ubicación.
- 🗺️ Mapa interactivo (Google Maps / Mapbox / Expo Location).
- ✅ Ver disponibilidad en tiempo (casi) real.
- 📝 Gestión de reservas.
- 🔔 Notificaciones (Push / locales).
- 👤 Autenticación (Email/Password / Social login - opcional).
- 💳 Pasarela de pagos (Stripe / MercadoPago - planeado).
- 🧾 Historial de reservas.
- 🛠️ Panel administrativo (futuro / web o mobile admin mode).
- 📊 Métricas de uso (planeado).

> Ajusta la lista según el estado real del proyecto.

---

## 🧱 Stack Tecnológico

| Capa | Tecnología |
|------|------------|
| Framework Mobile | React Native (Expo) |
| Entorno Dev | Expo CLI / Expo Go / VS Code |
| Lenguaje | JavaScript / TypeScript (si aplica) |
| Navegación | React Navigation |
| Estado global | Zustand / Redux Toolkit / Context API (elige uno) |
| Red / API | fetch / Axios |
| Mapa | react-native-maps / expo-location |
| Notificaciones | Expo Notifications |
| Backend (API) | (Coloca aquí: Node.js / Django / Firebase / Supabase / etc.) |
| Autenticación | (Ej: JWT / Firebase Auth / Clerk / Auth0) |
| Calidad | ESLint, Prettier, TypeScript (si aplica) |
| Testing | Jest / React Native Testing Library |
| Build | EAS Build / Gradle (Android Studio) |

> Reemplaza o elimina lo que no aplique.

---

## 📁 Estructura de Carpetas (Sugerida)

```
TuParKing/
├─ app/                      # (Si usas Expo Router) pantallas
│  ├─ (auth)/                # flujo de autenticación
│  ├─ (main)/                # pantallas principales
│  └─ _layout.tsx
├─ src/
│  ├─ components/            # UI reutilizable
│  ├─ screens/               # (si no usas app/)
│  ├─ navigation/            # stacks / tabs
│  ├─ hooks/
│  ├─ store/                 # estado global
│  ├─ services/              # API calls, clientes
│  ├─ utils/                 # helpers
│  ├─ config/                # constantes, env mapping
│  └─ types/                 # definiciones TypeScript
├─ assets/
│  ├─ images/
│  ├─ icons/
│  └─ fonts/
├─ .env                      # variables (NO commitear)
├─ app.json / expo.json
├─ package.json
└─ README.md
```

> Ajusta a tu estructura real.

---

## 🔧 Requisitos Previos

- Node.js (LTS)
- npm / yarn / pnpm
- Expo CLI (`npm install -g expo-cli` opcional con versiones antiguas)
- Cuenta en [Expo](https://expo.dev/) (para builds en la nube)
- Android:
  - Android Studio (SDK, emulador, platform-tools)
  - Dispositivo físico con Depuración USB activada (opcional)

---

## 🚀 Instalación y Ejecución en Desarrollo

```bash
# 1. Clonar
git clone https://github.com/PPNDEV/TuParKing.git
cd TuParKing

# 2. Instalar dependencias
npm install
# o
yarn
# o
pnpm install

# 3. Variables de entorno
cp .env.example .env
# Editar valores (API_URL, MAPS_API_KEY, etc.)

# 4. Iniciar en modo desarrollo
npx expo start
# abrir:
#   - presiona "a" para emulador Android
#   - escanea QR con Expo Go
```

---

## ⚙️ Variables de Entorno (Ejemplo)

Crea `.env` (usa `dotenv` / `expo-constants` / `react-native-config` según tu setup):

```
API_BASE_URL=https://api.midominio.com
MAPS_API_KEY=XXXXXXXXXXXXXXXXXXXX
SENTRY_DSN=
EXPO_PUBLIC_ENV=production
```

> Variables públicas en Expo 49+: prefijar con `EXPO_PUBLIC_`.

---

## 🧪 Scripts (Ejemplo)

Agrega en package.json según tu flujo:

```json
{
  "scripts": {
    "start": "expo start",
    "android": "expo run:android",
    "build:android:apk": "eas build --platform android --profile preview",
    "build:android:release": "eas build --platform android --profile production",
    "lint": "eslint .",
    "typecheck": "tsc --noEmit",
    "test": "jest"
  }
}
```

---

## 📦 Generar Build Android

Opción A - EAS (recomendado):
```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview   # .apk (si config)
eas build --platform android --profile production
```

Opción B - Prebuild + Gradle:
```bash
npx expo prebuild
cd android
./gradlew assembleRelease
```

El .apk/.aab quedará en:
`android/app/build/outputs/`

---

## 🔔 Notificaciones (Expo)

1. Habilitar permisos en `app.json` (android & ios - futuro).
2. Implementar registro de token:

```ts
import * as Notifications from 'expo-notifications';
```

3. Backend debe almacenar tokens por usuario.

---

## 🛰️ Consumo de API (Ejemplo Axios Wrapper)

```ts
// src/services/http.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://api.local',
  timeout: 10000
});

// Interceptores: auth token, logs, retries, etc.
```

---

## 🗺️ Mapa (Ejemplo básico)

```tsx
import MapView, { Marker } from 'react-native-maps';

<MapView style={{ flex: 1 }}>
  {parkings.map(p => (
    <Marker
      key={p.id}
      coordinate={{ latitude: p.lat, longitude: p.lng }}
      title={p.nombre}
      description={`Espacios: ${p.disponibles}`}
    />
  ))}
</MapView>
```

---

## 🔐 Autenticación (Flujo sugerido)

1. Pantalla Login / Registro.
2. Llamada a API → token JWT.
3. Guardar token seguro (SecureStore / AsyncStorage).
4. Inyectar en headers (interceptor).
5. Refrescar tokens (si aplica).

---

## 🧩 Estado Global (Ejemplo con Zustand)

```ts
import { create } from 'zustand';

export const useUserStore = create(set => ({
  user: null,
  setUser: (u) => set({ user: u }),
  logout: () => set({ user: null })
}));
```

---

## ✅ Calidad y Estándares

- ESLint + Prettier + (TypeScript)
- Convención commits: Conventional Commits (`feat:`, `fix:`, etc.)
- Branch naming: `feature/`, `bugfix/`, `hotfix/`
- PR checklist: lint + tests + screenshots (si UI)

---

## 🧪 Testing (Ejemplo)

```bash
npm run test
```

```ts
import { render } from '@testing-library/react-native';
import App from '../App';

test('App renders', () => {
  const { getByText } = render(<App />);
  // expect(getByText('TuParKing')).toBeTruthy();
});
```

---

## 🛣️ Roadmap (Propuesto)

| Fase | Objetivo | Estado |
|------|----------|--------|
| MVP | Búsqueda + mapa + reservas básicas | En progreso |
| Auth | Login/Registro + roles | Pendiente |
| Notifs | Push notifications | Pendiente |
| Pagos | Integración pasarela | Pendiente |
| Admin | Dashboard operador | Planeado |
| Métricas | Analytics / dashboards | Planeado |

> Actualiza estados reales.

---

## 🤝 Contribuir

1. Fork
2. Crear rama: `git checkout -b feature/nueva-funcionalidad`
3. Commit: `git commit -m "feat: agrega X"`
4. Push: `git push origin feature/nueva-funcionalidad`
5. Pull Request

Incluye:
- Descripción clara
- Screenshots (si UI)
- Referencia a issue (si existe)

---

## 🐞 Reporte de Errores

Abrir un issue con:
- Descripción
- Pasos para reproducir
- Resultado esperado vs actual
- Logs (si aplica)
- Dispositivo / versión Android

---

## 📄 Licencia

Este proyecto está bajo licencia MIT (o la que elijas).  
Ver [LICENSE](LICENSE).

---

## 👥 Créditos

Desarrollado por el equipo [PPNDEV](https://github.com/PPNDEV).  
¿Dudas o ideas? Abre un issue o envía un PR.

---

## 🧩 Próximos Pasos para Mejorar el README

- Agregar capturas (carpeta `assets/`).
- Incluir diagramas (flujo auth, arquitectura).
- Documentar endpoints (OpenAPI / Swagger).
- Añadir CI (GitHub Actions).
- Añadir sección de métricas de rendimiento.

---

¡Gracias por usar y mejorar TuParKing! 🚘💨  
Si este proyecto te parece útil, considera darle una ⭐ en GitHub.
