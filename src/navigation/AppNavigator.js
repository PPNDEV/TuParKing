import React, { useContext } from 'react';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { AuthContext } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

// Importamos todas las pantallas siguiendo la convención de rutas
import MainMenuScreen from '../screens/mainMenu/MainMenuScreen';
import VehicleListScreen from '../screens/vehicles/VehicleListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import InfoScreen from '../screens/info/InfoScreen';
import FAQScreen from '../screens/faq/FAQScreen';
import ContactScreen from '../screens/contact/ContactScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Creamos un Stack para el perfil.
// ¡CORRECCIÓN! Le decimos a este Stack que NO muestre su propio encabezado.
const ProfileStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerShown: false, // <-- ¡ESTA ES LA LÍNEA MÁGICA!
    }}
  >
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen 
      name="ChangePassword" 
      component={ChangePasswordScreen}
      // Podemos agregar opciones para que el header principal cambie si queremos
      // options={{ title: 'Cambiar Contraseña' }} 
    />
  </Stack.Navigator>
);

// Contenido personalizado para el menú lateral
function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />
      <DrawerItem
        label="Cerrar Sesión"
        onPress={() => logout()}
        labelStyle={{ color: COLORS.error, fontWeight: 'bold' }}
      />
    </DrawerContentScrollView>
  );
}

const AppNavigator = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="MainMenu"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen name="MainMenu" component={MainMenuScreen} options={{ title: 'Menú Principal' }} />
      {/* ¡CORRECCIÓN! Esta pantalla ahora sí muestra su encabezado principal */}
      <Drawer.Screen 
        name="ProfileStack" 
        component={ProfileStack} 
        options={{ 
          title: 'Perfil de Usuario',
        }} 
      />
      <Drawer.Screen name="VehicleList" component={VehicleListScreen} options={{ title: 'Mis Vehículos' }} />
      <Drawer.Screen name="Info" component={InfoScreen} options={{ title: 'Información' }} />
      <Drawer.Screen name="FAQ" component={FAQScreen} options={{ title: 'Preguntas Frecuentes' }} />
      <Drawer.Screen name="Contact" component={ContactScreen} options={{ title: 'Contactos' }} />
    </Drawer.Navigator>
  );
};

export default AppNavigator;

