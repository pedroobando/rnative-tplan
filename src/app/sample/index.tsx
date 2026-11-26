import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { ScrollView, StyleSheet, View } from 'react-native';

import { SampleBackLink, ThemedPress, ThemedText, ThemedView } from '@/components';
import { useThemeColor } from '@/hooks';

/** Rutas absolutas: un href como './ttext' desde /sample resolvería a /ttext. */
const examples = [
  {
    href: '/sample/ttext',
    title: 'ThemedText',
    description: 'Tipos de texto, enlaces y colores del tema',
    icon: 'text-outline',
  },
  {
    href: '/sample/tview',
    title: 'ThemedView',
    description: 'Tokens de fondo, overrides y vistas anidadas',
    icon: 'layers-outline',
  },
  {
    href: '/sample/tpress',
    title: 'ThemedPress',
    description: 'Variantes, estado deshabilitado y clases',
    icon: 'hand-right-outline',
  },
  {
    href: '/sample/tswitch',
    title: 'ThemedSwitch',
    description: 'Switch controlado, colores y filas de ajustes',
    icon: 'toggle-outline',
  },
  {
    href: '/sample/tinput',
    title: 'ThemedInput',
    description: 'TextInput themed, errores y uso con React Hook Form',
    icon: 'create-outline',
  },
] as const;

export default function SampleIndexScreen() {
  const primary = useThemeColor(undefined, 'primary');
  const text = useThemeColor(undefined, 'text');
  const border = useThemeColor(undefined, 'border');

  return (
    <ThemedView style={styles.container}>
      <SampleBackLink href="/home" label="Volver al inicio" />
      <ThemedText type="subtitle">Componentes themed</ThemedText>
      <ThemedText type="small" style={styles.intro}>
        Elige un componente para ver sus ejemplos.
      </ThemedText>

      <View style={styles.list}>
        <ScrollView contentContainerStyle={styles.content}>
          {examples.map((example) => (
            <Link key={example.href} href={example.href} asChild>
              <ThemedPress style={StyleSheet.flatten([styles.card, { borderColor: border }])}>
                <Ionicons name={example.icon} size={22} color={primary} />
                <View style={styles.cardText}>
                  <ThemedText type="semiBold">{example.title}</ThemedText>
                  <ThemedText type="small" style={styles.description}>
                    {example.description}
                  </ThemedText>
                </View>
                <Ionicons name="chevron-forward-outline" size={18} color={text} />
              </ThemedPress>
            </Link>
          ))}
        </ScrollView>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 20,
    gap: 8,
  },
  container: {
    flex: 1,
    padding: 24,
    gap: 8,
  },
  intro: {
    marginBottom: 16,
    opacity: 0.7,
  },
  list: {
    flex: 1,
  },
  card: {
    justifyContent: 'flex-start',
    gap: 14,
    paddingVertical: 16,
  },
  cardText: {
    flex: 1,
    gap: 2,
  },
  description: {
    opacity: 0.65,
  },
});
