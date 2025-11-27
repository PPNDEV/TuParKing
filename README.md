# 📱 TuParKing - Frontend

Sistema de gestión y reserva de espacios de estacionamiento desarrollado con React Native y Expo.

![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)

## 🚀 Características

- ✅ **Autenticación** - Login y registro de usuarios
- ✅ **Dashboard** - Visualización de saldo y estadísticas
- ✅ **Parqueaderos** - Búsqueda y listado con indicadores de disponibilidad
- ✅ **Recarga de Saldo** - Sistema completo con múltiples métodos de pago
- ✅ **Gestión de Vehículos** - CRUD completo de vehículos
- ✅ **Reservas** - Visualización y gestión de reservas
- ✅ **Perfil** - Información del usuario
- ✅ **Actualización Automática** - Focus listener y pull-to-refresh

## 🛠️ Tecnologías

```json
{
  "framework": "React Native",
  "platform": "Expo",
  "navigation": "React Navigation",
  "state": "Context API",
  "http": "Fetch API",
  "icons": "Expo Vector Icons (Feather)"
}
```

## 📁 Estructura del Proyecto

```
TuParKing/
├── src/
│   ├── components/
│   │   ├── common/          # Componentes reutilizables
│   │   └── dashboard/       # Componentes del dashboard
│   ├── constants/           # Colores y constantes
│   ├── contexts/            # Context API (Auth)
│   ├── navigation/          # Configuración de navegación
│   └── screens/             # Todas las pantallas
│       ├── auth/            # Login, Register
│       ├── mainMenu/        # Home/Dashboard
│       ├── parking/         # Parqueaderos
│       ├── reservation/     # Reservas
│       ├── recharge/        # Recarga de saldo
│       ├── vehicle/         # Vehículos
│       └── profile/         # Perfil
├── App.js                   # Punto de entrada
├── package.json             # Dependencias
└── README.md               # Documentación
```

## 📦 Instalación

## 📚 Dependencias principales

Instálalas automáticamente con `npm install`, pero si necesitas hacerlo manualmente:

```bash
npm install \
  expo \
  react \
  react-native \
  expo-linear-gradient \
  expo-status-bar \
  expo-constants \
  expo-secure-store \
  @react-navigation/native \
  @react-navigation/native-stack \
  @react-navigation/bottom-tabs \
  react-native-gesture-handler \
  react-native-reanimated \
  react-native-screens \
  react-native-safe-area-context \
  @expo/vector-icons
```

| Paquete                         | Uso                                      |
|---------------------------------|------------------------------------------|
| expo, react, react-native       | Base del proyecto Expo / RN             |
| expo-linear-gradient            | Gradientes en tarjetas y headers         |
| expo-status-bar                 | Control de la barra de estado            |
| expo-constants                  | Variables (`EXPO_PUBLIC_API_URL`)        |
| expo-secure-store               | Guardar token de sesión                  |
| @react-navigation/*             | Navegación (stack + tabs)                |
| react-native-gesture-handler    | Gestos para navegación                   |
| react-native-reanimated         | Animaciones y tabs                       |
| react-native-screens            | Optimiza navegación                      |
| react-native-safe-area-context  | Safe areas                               |
| @expo/vector-icons              | Iconos Feather/Ionicons                  |

### Prerrequisitos
- Node.js >= 14
- npm o yarn
- Expo CLI
- Backend corriendo en `http://localhost:3000`

### Pasos

```bash
# Clonar repositorio
git clone https://github.com/PPNDEV/TuParKing.git

# Instalar dependencias
cd TuParKing
npm install

# Iniciar aplicación
npx expo start
```

## 🖥️ Ejecutar

Después de `npx expo start`:

- **Web**: Presionar `w` en la terminal
- **Android**: Presionar `a` (requiere Android Studio)
- **iOS**: Presionar `i` (requiere Xcode, solo macOS)

## 🎨 Paleta de Colores

```javascript
primary: '#2563eb'        // Azul principal
secondary: '#10b981'      // Verde secundario
background: '#f3f4f6'     // Fondo gris claro
success: '#10b981'        // Verde éxito
error: '#ef4444'          // Rojo error
warning: '#f59e0b'        // Naranja advertencia
```

## 🔐 Autenticación

El sistema usa **JWT (JSON Web Tokens)** para autenticación:

```javascript
// Login
POST /api/auth/login
Body: { email, password }
Response: { token, usuario }

// Register
POST /api/auth/registro
Body: { nombre, email, password, telefono, direccion }
```

## 📱 Pantallas Principales

### 1. **MainMenuScreen** (Home)
- Visualización de saldo actual
- Contador de reservas activas
- Contador de vehículos registrados
- Grid de 6 acciones rápidas

### 2. **ParkingListScreen**
- Lista de parqueaderos con búsqueda
- Indicadores de disponibilidad con colores
- Saldo en header
- Pull-to-refresh

### 3. **RechargeScreen**
- Montos predefinidos ($5, $10, $20, $50, $100)
- Monto personalizado
- 3 métodos de pago
- Confirmación y actualización automática

### 4. **VehicleListScreen**
- Lista de vehículos del usuario
- Opción de agregar/eliminar
- Visualización de marca, modelo, placa

### 5. **ReservationScreen**
- Mis reservas activas
- Filtros por estado
- Opciones de finalizar/cancelar

## 🔄 Actualización de Datos

### Focus Listener
Actualiza datos automáticamente al volver a la pantalla:

```javascript
useEffect(() => {
  const unsubscribe = navigation.addListener('focus', () => {
    cargarDatos();
  });
  return unsubscribe;
}, [navigation]);
```

### Pull-to-Refresh
Todas las pantallas principales tienen refresh manual:

```javascript
<RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
/>
```

## 🌐 Endpoints del Backend

```javascript
// Autenticación
POST   /api/auth/login
POST   /api/auth/registro
GET    /api/auth/perfil

// Parqueaderos
GET    /api/parqueaderos
GET    /api/parqueaderos/:id

// Reservas
GET    /api/reservas
POST   /api/reservas
PUT    /api/reservas/:id/finalizar
PUT    /api/reservas/:id/cancelar

// Vehículos
GET    /api/vehiculos
POST   /api/vehiculos
DELETE /api/vehiculos/:id

// Transacciones
POST   /api/transacciones/recarga
GET    /api/transacciones/cuenta
```

## 🐛 Debugging

Todos los endpoints tienen logs para debugging:

```javascript
console.log('📤 Enviando:', body);
console.log('📥 Respuesta:', data);
console.log('✅ Éxito:', mensaje);
console.log('❌ Error:', error);
```

## 📊 Estado de Desarrollo

### ✅ Completado
- [x] Sistema de autenticación
- [x] Dashboard principal
- [x] Lista de parqueaderos
- [x] Recarga de saldo funcional
- [x] Gestión de vehículos (CRUD)
- [x] Visualización de reservas
- [x] Perfil de usuario
- [x] Actualización automática de saldo

### 🚧 Pendiente
- [ ] Detalle de parqueadero con mapa
- [ ] Crear reserva completa
- [ ] Finalizar/Cancelar reservas
- [ ] Historial de transacciones
- [ ] Editar perfil
- [ ] Notificaciones push
- [ ] Modo oscuro
- [ ] Integración con pasarelas de pago reales

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -m '✨ feat: Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

MIT License - Libre uso para proyectos educativos y comerciales.

## 👥 Autor

**PPNDEV**  
GitHub: [@PPNDEV](https://github.com/PPNDEV)

---

⭐ Si te gusta el proyecto, dale una estrella en GitHub!