import { Stack } from 'expo-router';

import { useThemeColor } from '@/hooks';

/**
 * Los ejemplos viven dentro de un Stack anidado en el Tabs principal:
 * el index actúa como menú y cada pantalla tiene su propia cabecera
 * con botón de retroceso.
 */
export default function SampleLayout() {
  const background = useThemeColor(undefined, 'background');
  const text = useThemeColor(undefined, 'text');

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: background },
        headerTintColor: text,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: background },
      }}>
      <Stack.Screen name="index" options={{ title: 'Componentes themed' }} />
      <Stack.Screen name="ttext" options={{ title: 'ThemedText' }} />
      <Stack.Screen name="tview" options={{ title: 'ThemedView' }} />
      <Stack.Screen name="tpress" options={{ title: 'ThemedPress' }} />
      <Stack.Screen name="tswitch" options={{ title: 'ThemedSwitch' }} />
      <Stack.Screen name="tinput" options={{ title: 'ThemedInput' }} />
    </Stack>
  );
}
