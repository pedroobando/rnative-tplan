import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useUniwind } from 'uniwind';

import { ThemedPress, ThemedText, ThemedView } from '@/components';
import { useThemeColor } from '@/hooks';

/** Rutas absolutas: un href como './themed' desde /home resolvería a /themed. */
const shortcuts = [
  {
    href: '/themed',
    title: 'Temas',
    description: 'Cambia entre claro, oscuro y los temas de color',
    icon: 'color-palette-outline',
  },
  {
    href: '/sample',
    title: 'Componentes themed',
    description: 'ThemedText, ThemedView, ThemedPress, ThemedInput y más',
    icon: 'flask-outline',
  },
] as const;

export default function HomeScreen() {
  // Tema activo de Uniwind (light, dark, ocean, emerald, orange).
  const { theme } = useUniwind();

  const primary = useThemeColor(undefined, 'primary');
  const text = useThemeColor(undefined, 'text');
  const border = useThemeColor(undefined, 'border');

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerText}>
          <ThemedText type="title">tplan</ThemedText>
          <ThemedText type="small" style={styles.subtitle}>
            Tema activo: {theme}
          </ThemedText>
        </View>
        <View style={[styles.badge, { backgroundColor: primary }]}>
          <Ionicons name="color-palette" size={20} color="#ffffff" />
        </View>
      </View>

      <ThemedText type="default" style={styles.intro}>
        Esta pantalla usa los tokens de color de `src/global.css`, así que se
        adapta al tema que elijas.
      </ThemedText>

      <View style={styles.list}>
        {shortcuts.map((item) => (
          <Link key={item.href} href={item.href} asChild>
            <ThemedPress style={StyleSheet.flatten([styles.card, { borderColor: border }])}>
              <Ionicons name={item.icon} size={22} color={primary} />
              <View style={styles.cardText}>
                <ThemedText type="semiBold">{item.title}</ThemedText>
                <ThemedText type="small" style={styles.description}>
                  {item.description}
                </ThemedText>
              </View>
              <Ionicons name="chevron-forward-outline" size={18} color={text} />
            </ThemedPress>
          </Link>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  subtitle: {
    opacity: 0.7,
  },
  badge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intro: {
    opacity: 0.8,
  },
  list: {
    gap: 12,
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
