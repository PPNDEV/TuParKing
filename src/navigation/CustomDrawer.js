import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import { Feather } from '@expo/vector-icons';
import { AuthContext } from '../contexts/AuthContext';
import { COLORS } from '../constants/colors';

const CustomDrawer = (props) => {
  const authContext = useContext(AuthContext);
  const { logout, user } = authContext || {};

  const handleLogout = () => {
    console.log('🔘 Botón de logout presionado');
    
    if (!logout) {
      console.error('❌ logout no disponible');
      if (Platform.OS === 'web') {
        window.alert('No se puede cerrar sesión');
      } else {
        Alert.alert('Error', 'No se puede cerrar sesión');
      }
      return;
    }

    // En web usar window.confirm, en móvil usar Alert
    if (Platform.OS === 'web') {
      const confirmLogout = window.confirm('¿Estás seguro que deseas salir?');
      if (confirmLogout) {
        console.log('✅ Usuario confirmó logout');
        logout()
          .then(() => console.log('✅ Logout completado'))
          .catch((error) => console.error('❌ Error:', error));
      } else {
        console.log('❌ Cancelado');
      }
    } else {
      Alert.alert(
        'Cerrar Sesión',
        '¿Estás seguro que deseas salir?',
        [
          { 
            text: 'Cancelar', 
            style: 'cancel',
            onPress: () => console.log('❌ Cancelado')
          },
          {
            text: 'Salir',
            style: 'destructive',
            onPress: async () => {
              console.log('✅ Usuario confirmó logout');
              try {
                await logout();
                console.log('✅ Logout completado');
              } catch (error) {
                console.error('❌ Error:', error);
              }
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <DrawerContentScrollView {...props}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Feather name="user" size={40} color={COLORS.white} />
          </View>
          <Text style={styles.username}>
            {user?.nombre || 'Usuario'}
          </Text>
          <Text style={styles.email}>
            {user?.correo || user?.email || ''}
          </Text>
        </View>

        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Feather name="log-out" size={20} color={COLORS.error} />
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
        
        <Text style={styles.version}>Versión 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary + 'CC',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  username: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: 5,
  },
  email: {
    fontSize: 14,
    color: COLORS.white + 'DD',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGray,
    padding: 15,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: COLORS.error + '10',
    marginBottom: 10,
  },
  logoutText: {
    fontSize: 16,
    color: COLORS.error,
    marginLeft: 15,
    fontWeight: '600',
  },
  version: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: 5,
  },
});

export default CustomDrawer;