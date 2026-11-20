import { ScrollView, StyleSheet } from 'react-native';

import { SampleBackLink, ThemedText, ThemedView } from '@/components';
import type { ThemedTextType } from '@/components/themed/themed-text';
import { themeColorTokens } from '@/constants/theme';
import { useThemeColor } from '@/hooks';

const textTypes: ThemedTextType[] = [
  'default',
  'semiBold',
  'title',
  'small',
  'smallBold',
  'subtitle',
  'link',
  'linkPrimary',
  'code',
];

export default function ThemedTextSample() {
  const border = useThemeColor(undefined, 'border');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SampleBackLink />
        <ThemedText type="subtitle">ThemedText</ThemedText>
        <ThemedText type="small" style={styles.intro}>
          Todos los tipos de texto y la prop `themeColor` con los tokens del tema activo.
        </ThemedText>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Tipos (`type`)
        </ThemedText>
        {textTypes.map((type) => (
          <ThemedView key={type} style={[styles.row, { borderBottomColor: border }]}>
            <ThemedText type="small" themeColor="secondary" style={styles.rowLabel}>
              {type}
            </ThemedText>
            <ThemedText type={type} style={styles.rowValue}>
              {type === 'code' ? 'const saludo = "hola"' : 'Texto de ejemplo'}
            </ThemedText>
          </ThemedView>
        ))}

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Colores (`themeColor`)
        </ThemedText>
        {themeColorTokens.map((token) => (
          <ThemedText key={token} type="semiBold" themeColor={token}>
            {token} · texto con el token del tema
          </ThemedText>
        ))}

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Estilos propios
        </ThemedText>
        <ThemedText style={styles.customStyle}>
          Se pueden combinar `type` y `style` (negrita, tamaño y color personalizados).
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    gap: 8,
  },
  intro: {
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 20,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowLabel: {
    width: 90,
  },
  rowValue: {
    flexShrink: 1,
  },
  customStyle: {
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
