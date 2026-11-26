import { Ionicons } from '@expo/vector-icons';
import { ActivityIndicator, StyleSheet } from 'react-native';

import { ThemedPress } from '@/components/themed/themed-press';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';

export type PlanEmptyStateProps = {
  /** Texto secundario que explica qué hacer a continuación. */
  message?: string;
};

/** Estado vacío: todavía no hay semanas en la base de datos. */
export function PlanEmptyState({
  message = 'Crea tu primera semana de entrenamiento para empezar a planificar.',
}: PlanEmptyStateProps) {
  const primary = useThemeColor(undefined, 'primary');

  return (
    <ThemedView style={styles.container}>
      <Ionicons
        name="calendar-outline"
        size={48}
        color={primary}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <ThemedText type="semiBold" style={styles.title}>
        Todavía no hay semanas
      </ThemedText>
      <ThemedText type="small" style={styles.message}>
        {message}
      </ThemedText>
    </ThemedView>
  );
}

export type PlanErrorStateProps = {
  /** Mensaje real del error, para que el usuario sepa qué pasó. */
  error?: string | null;
  /** Callback para volver a intentar la carga. */
  onRetry: () => void;
};

/** Estado de error: la carga del plan falló. */
export function PlanErrorState({ error, onRetry }: PlanErrorStateProps) {
  const danger = useThemeColor(undefined, 'danger');
  const background = useThemeColor(undefined, 'background');

  return (
    <ThemedView style={styles.container}>
      <Ionicons
        name="alert-circle-outline"
        size={48}
        color={danger}
        accessible={false}
        accessibilityElementsHidden
        importantForAccessibility="no-hide-descendants"
      />
      <ThemedText type="semiBold" style={styles.title}>
        No se pudo cargar el plan
      </ThemedText>
      <ThemedText type="small" style={styles.message}>
        {error ?? 'Error desconocido.'}
      </ThemedText>
      <ThemedPress
        type="primary"
        onPress={onRetry}
        accessibilityLabel="Reintentar"
        style={styles.retry}>
        <ThemedText style={{ color: background }}>Reintentar</ThemedText>
      </ThemedPress>
    </ThemedView>
  );
}

/** Estado de carga: el plan se está leyendo de la base de datos. */
export function PlanLoadingState() {
  const primary = useThemeColor(undefined, 'primary');

  return (
    <ThemedView style={styles.container}>
      <ActivityIndicator color={primary} />
      <ThemedText type="small" style={styles.message}>
        Cargando plan…
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 48,
    paddingHorizontal: 24,
  },
  title: {
    textAlign: 'center',
  },
  message: {
    textAlign: 'center',
    opacity: 0.8,
  },
  retry: {
    minHeight: 44,
    marginTop: 6,
    paddingHorizontal: 24,
  },
});
