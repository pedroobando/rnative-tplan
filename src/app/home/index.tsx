import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useUniwind } from 'uniwind';

import { ThemedPress, ThemedText, ThemedView } from '@/components';
import { useSeedExamplePlan, useThemeColor } from '@/hooks';

/** Rutas absolutas: un href como './themed' desde /home resolvería a /themed. */
const shortcuts = [
  {
    href: '/weeks',
    title: 'Plan',
    description: 'Semanas, días de entrenamiento y bloques',
    icon: 'calendar-outline',
  },
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

      {__DEV__ ? <SeedExamplePanel /> : null}
    </ThemedView>
  );
}

/**
 * Panel de desarrollo para cargar el plan de ejemplo en la base de datos.
 *
 * Solo existe en `__DEV__`: los datos de ejemplo nunca deben colarse en una
 * app real. El seed es idempotente, así que se puede pulsar más de una vez.
 */
function SeedExamplePanel() {
  const { state, message, seeded, seed } = useSeedExamplePlan();
  const border = useThemeColor(undefined, 'border');

  const handlePress = () => {
    seed();
    router.push('/weeks');
  };

  return (
    <View style={[styles.devPanel, { borderTopColor: border }]}>
      <ThemedText type="smallBold">Desarrollo</ThemedText>
      <ThemedText type="small" style={styles.description}>
        Carga el plan de ejemplo (Semanas 2 y 3) para ver la pantalla Plan con
        datos.
      </ThemedText>
      <ThemedPress
        type="primary"
        onPress={handlePress}
        disabled={state === 'seeding'}
        accessibilityLabel="Cargar el plan de ejemplo en la base de datos">
        <ThemedText type="semiBold">
          {state === 'seeding'
            ? 'Cargando…'
            : seeded
              ? 'Recargar plan de ejemplo'
              : 'Cargar plan de ejemplo'}
        </ThemedText>
      </ThemedPress>
      {state === 'error' && message ? (
        <ThemedText type="small" style={styles.error}>
          {`Error: ${message}`}
        </ThemedText>
      ) : null}
    </View>
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
  devPanel: {
    gap: 8,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  error: {
    opacity: 0.8,
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
