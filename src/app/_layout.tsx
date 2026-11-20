import { useEffect } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { SplashScreen, Tabs, ThemeProvider } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import '@/global.css';
import { useAppNavigationTheme, useThemeColor } from '@/hooks';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  // Tema de navegación (Expo Router) sincronizado con los tokens de Uniwind.
  const navigationTheme = useAppNavigationTheme();

  // Colores del tab bar, también desde los tokens del tema activo.
  const backgroundColor = useThemeColor(undefined, 'background');
  const activeTintColor = useThemeColor(undefined, 'primary');
  const inactiveTintColor = useThemeColor(undefined, 'text');
  const borderColor = useThemeColor(undefined, 'border');

  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <GestureHandlerRootView style={{ backgroundColor, flex: 1 }}>
      <ThemeProvider value={navigationTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: activeTintColor,
            tabBarInactiveTintColor: inactiveTintColor,
            tabBarStyle: {
              backgroundColor,
              borderTopColor: borderColor,
            },
          }}>
          {/* El index solo redirige a /home; no debe aparecer como tab. */}
          <Tabs.Screen name="index" options={{ href: null }} />

          <Tabs.Screen
            name="home"
            options={{
              title: 'Inicio',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="home-outline" size={size} color={color as string} />
              ),
            }}
          />

          <Tabs.Screen
            name="themed"
            options={{
              title: 'Tema',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="settings-outline" size={size} color={color as string} />
              ),
            }}
          />

          <Tabs.Screen
            name="sample"
            options={{
              title: 'Ejemplos',
              tabBarIcon: ({ color, size }) => (
                <Ionicons name="flask-outline" size={size} color={color as string} />
              ),
            }}
          />
        </Tabs>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
