import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { StyleSheet } from 'react-native';

import { ThemedPress } from '@/components/themed/themed-press';
import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks';

export type SampleBackLinkProps = {
  /** Destino del enlace. Por defecto vuelve al menú de ejemplos. */
  href?: '/sample' | '/home';
  /** Texto visible y etiqueta de accesibilidad. */
  label?: string;
};

/** Enlace superior reutilizable para volver al menú de `/sample` (o al inicio). */
export function SampleBackLink({ href = '/sample', label = 'Volver a ejemplos' }: SampleBackLinkProps) {
  const primary = useThemeColor(undefined, 'primary');

  return (
    <Link href={href} asChild>
      <ThemedPress accessibilityLabel={label} style={styles.link}>
        <Ionicons name="arrow-back-outline" size={18} color={primary} />
        <ThemedText type="small" themeColor="primary">
          {label}
        </ThemedText>
      </ThemedPress>
    </Link>
  );
}

const styles = StyleSheet.create({
  link: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
  },
});
