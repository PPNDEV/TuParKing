import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { Feather } from '@expo/vector-icons';

import { COLORS } from '../constants/colors';
import CustomDrawer from './CustomDrawer'; // 👈 AGREGAR ESTA LÍNEA

// Screens principales
import MainMenuScreen from '../screens/mainMenu/MainMenuScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import ChangePasswordScreen from '../screens/profile/ChangePasswordScreen';

// Screens de vehículos
import VehicleListScreen from '../screens/vehicles/VehicleListScreen';
import AddVehicleScreen from '../screens/vehicles/AddVehicleScreen';

// Screens de parqueaderos
import ParkingListScreen from '../screens/parking/ParkingListScreen';
import ParkingDetailScreen from '../screens/parking/ParkingDetailScreen';

// Screens de historial y recarga
import HistoryScreen from '../screens/history/HistoryScreen';
import RechargeScreen from '../screens/recharge/RechargeScreen';

// Screen de reservas
import ReservationScreen from '../screens/reservation/ReservationScreen';


const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

// Stack de Home
const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="MainMenu" 
      component={MainMenuScreen}
      options={({ navigation }) => ({
        title: 'Inicio',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

// Stack de Parqueaderos
const ParkingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ParkingList" 
      component={ParkingListScreen}
      options={({ navigation }) => ({
        title: 'Parqueaderos',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
    <Stack.Screen 
      name="ParkingDetail" 
      component={ParkingDetailScreen}
      options={{ title: 'Detalle del Parqueadero' }}
    />
  </Stack.Navigator>
);

// Stack de Vehículos
const VehicleStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="VehicleList" 
      component={VehicleListScreen}
      options={({ navigation }) => ({
        title: 'Mis Vehículos',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
    <Stack.Screen 
      name="AddVehicle" 
      component={AddVehicleScreen}
      options={{ title: 'Agregar Vehículo' }}
    />
  </Stack.Navigator>
);

// Stack de Perfil
const ProfileStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ProfileMain" 
      component={ProfileScreen}
      options={({ navigation }) => ({
        title: 'Mi Perfil',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
    <Stack.Screen 
      name="ChangePassword" 
      component={ChangePasswordScreen}
      options={{ title: 'Cambiar Contraseña' }}
    />
  </Stack.Navigator>
);

// Stack de Historial
const HistoryStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="HistoryMain" 
      component={HistoryScreen}
      options={({ navigation }) => ({
        title: 'Historial',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

// Stack de Recarga
const RechargeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="RechargeMain" 
      component={RechargeScreen}
      options={({ navigation }) => ({
        title: 'Recargar Saldo',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
  </Stack.Navigator>
);

// Stack de Reservas
const ReservationStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: { backgroundColor: COLORS.primary },
      headerTintColor: COLORS.white,
      headerTitleStyle: { fontWeight: 'bold' },
    }}
  >
    <Stack.Screen 
      name="ReservationMain" 
      component={ReservationScreen}
      options={({ navigation }) => ({
        title: 'Mis Reservas',
        headerLeft: () => (
          <Feather 
            name="menu" 
            size={24} 
            color={COLORS.white} 
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          />
        ),
      })}
    />
  </Stack.Navigator>
); 

// Drawer Principal
const AppNavigator = () => (
  <Drawer.Navigator
    drawerContent={(props) => <CustomDrawer {...props} />} // 👈 AGREGAR ESTA LÍNEA
    screenOptions={{
      headerShown: false,
      drawerActiveTintColor: COLORS.primary,
      drawerInactiveTintColor: COLORS.textSecondary,
      drawerLabelStyle: {
        fontSize: 16,
        fontWeight: '500',
      },
    }}
  >
    <Drawer.Screen 
      name="HomeStack" 
      component={HomeStack}
      options={{
        title: 'Inicio',
        drawerIcon: ({ color, size }) => (
          <Feather name="home" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="ParkingStack" 
      component={ParkingStack}
      options={{
        title: 'Parqueaderos',
        drawerIcon: ({ color, size }) => (
          <Feather name="map" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="ReservationStack" 
      component={ReservationStack}
      options={{
        title: 'Mis Reservas',
        drawerIcon: ({ color, size }) => (
          <Feather name="bookmark" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="VehicleStack" 
      component={VehicleStack}
      options={{
        title: 'Mis Vehículos',
        drawerIcon: ({ color, size }) => (
          <Feather name="truck" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="HistoryStack" 
      component={HistoryStack}
      options={{
        title: 'Historial',
        drawerIcon: ({ color, size }) => (
          <Feather name="clock" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="RechargeStack" 
      component={RechargeStack}
      options={{
        title: 'Recargar Saldo',
        drawerIcon: ({ color, size }) => (
          <Feather name="credit-card" size={size} color={color} />
        ),
      }}
    />
    <Drawer.Screen 
      name="ProfileStack" 
      component={ProfileStack}
      options={{
        title: 'Mi Perfil',
        drawerIcon: ({ color, size }) => (
          <Feather name="user" size={size} color={color} />
        ),
      }}
    />
  </Drawer.Navigator>
);

export default AppNavigator;