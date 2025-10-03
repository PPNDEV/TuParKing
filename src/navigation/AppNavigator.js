import React, { useContext } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

// Importamos todas las pantallas
import MainMenuScreen from '../screens/mainMenu/MainMenuScreen';
import RegisterParkingScreen from '../screens/parking/RegisterParkingScreen';
import MyParkingsScreen from '../screens/myParkings/MyParkingsScreen';
import RechargeScreen from '../screens/recharge/RechargeScreen';
import PaymentScreen from '../screens/recharge/PaymentScreen';
import HistoryScreen from '../screens/history/HistoryScreen';
import TransferScreen from '../screens/transfer/TransferScreen';
import VehicleListScreen from '../screens/vehicles/VehicleListScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';
import InfoScreen from '../screens/info/InfoScreen';
import FAQScreen from '../screens/faq/FAQScreen';
import ContactScreen from '../screens/contact/ContactScreen';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack para Perfil
const ProfileStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
    <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
  </Stack.Navigator>
);

// Stack para el flujo principal del Dashboard
const MainStack = () => (
  <Stack.Navigator 
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleAlign: 'center',
    }}
  >
    <Stack.Screen name="MainMenuScreen" component={MainMenuScreen} options={{ headerShown: false }} />
    <Stack.Screen name="RegisterParking" component={RegisterParkingScreen} options={{ title: 'Nuevo Registro de Parqueo' }} />
    <Stack.Screen name="MyParkings" component={MyParkingsScreen} options={{ title: 'Mis Parqueos' }} />
    <Stack.Screen name="Recharge" component={RechargeScreen} options={{ title: 'Recargas' }} />
    <Stack.Screen name="Payment" component={PaymentScreen} options={{ title: 'Botón de Pagos' }} />
    <Stack.Screen name="History" component={HistoryScreen} options={{ title: 'Historial de Transacciones' }} />
    <Stack.Screen name="Transfer" component={TransferScreen} options={{ title: 'Transferir Saldo' }} />
  </Stack.Navigator>
);

// Contenido personalizado del Menú Lateral
function CustomDrawerContent(props) {
  const { logout } = useContext(AuthContext);
  const userName = "Brandon Castillo";
  const userEmail = "brandoncastill761@gmail.com";

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.drawerHeader}>
        <Image 
          source={require('../assets/icon.png')}
          style={styles.drawerLogo}
        />
        <Text style={styles.drawerUserName}>{userName}</Text>
        <Text style={styles.drawerUserEmail}>{userEmail}</Text>
      </View>
      <DrawerContentScrollView {...props} style={{backgroundColor: COLORS.background}}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
      <View style={styles.drawerFooter}>
        <DrawerItem
          label="Cerrar Sesión"
          icon={({ color, size }) => <Feather name="log-out" color={color} size={size} />}
          onPress={() => logout()}
          labelStyle={{ color: COLORS.error, fontWeight: 'bold' }}
          inactiveTintColor={COLORS.error}
        />
      </View>
    </SafeAreaView>
  );
}

// Navegador Principal (Drawer)
const AppNavigator = () => {
  return (
    <Drawer.Navigator 
      initialRouteName="MainMenu"
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerStyle: { backgroundColor: COLORS.primary },
        headerTintColor: COLORS.white,
        headerTitleAlign: 'center',
        drawerActiveBackgroundColor: COLORS.primary,
        drawerActiveTintColor: COLORS.white,
        drawerInactiveTintColor: COLORS.text,
        drawerLabelStyle: {
          fontSize: 15,
        }
      }}
    >
      <Drawer.Screen name="MainMenu" component={MainStack} options={{ 
        title: 'Menú Principal',
        drawerIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />
      }} />
      <Drawer.Screen name="ProfileStack" component={ProfileStack} options={{ 
        title: 'Perfil de Usuario',
        drawerIcon: ({ color, size }) => <Feather name="user" color={color} size={size} />
      }} />
      <Drawer.Screen name="VehicleList" component={VehicleListScreen} options={{ 
        title: 'Mis Vehículos',
        drawerIcon: ({ color, size }) => <Feather name="truck" color={color} size={size} />
      }} />
      <Drawer.Screen name="Info" component={InfoScreen} options={{ 
        title: 'Información',
        drawerIcon: ({ color, size }) => <Feather name="info" color={color} size={size} />
      }} />
      <Drawer.Screen name="FAQ" component={FAQScreen} options={{ 
        title: 'Preguntas Frecuentes',
        drawerIcon: ({ color, size }) => <Feather name="help-circle" color={color} size={size} />
      }} />
      <Drawer.Screen name="Contact" component={ContactScreen} options={{ 
        title: 'Contactos',
        drawerIcon: ({ color, size }) => <Feather name="phone" color={color} size={size} />
      }} />
    </Drawer.Navigator>
  );
};

// Estilos para el menú
const styles = StyleSheet.create({
  drawerHeader: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
    alignItems: 'center',
  },
  drawerLogo: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
    backgroundColor: COLORS.white,
  },
  drawerUserName: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  drawerUserEmail: {
    color: COLORS.white,
    fontSize: 14,
    opacity: 0.8,
  },
  drawerFooter: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    backgroundColor: COLORS.background,
  }
});

export default AppNavigator;