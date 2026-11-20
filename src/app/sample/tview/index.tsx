import { ScrollView, StyleSheet } from 'react-native';

import { SampleBackLink, ThemedText, ThemedView } from '@/components';
import { themeColorTokens } from '@/constants/theme';

export default function ThemedViewSample() {
  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SampleBackLink />
        <ThemedText type="subtitle">ThemedView</ThemedText>
        <ThemedText type="small" style={styles.intro}>
          El fondo sigue el tema activo; `colorScheme` elige un token y `lightColor`/`darkColor`
          permiten overrides puntuales.
        </ThemedText>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Fondo por defecto (`background`)
        </ThemedText>
        <ThemedView style={[styles.box, styles.outlined]}>
          <ThemedText type="small">ThemedView sin props</ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Tokens (`colorScheme`)
        </ThemedText>
        {themeColorTokens.map((token) => (
          <ThemedView key={token} style={styles.tokenBlock}>
            <ThemedView colorScheme={token} style={styles.box} />
            <ThemedText type="small">{token}</ThemedText>
          </ThemedView>
        ))}

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Overrides (`lightColor` / `darkColor`)
        </ThemedText>
        <ThemedView lightColor="#fde68a" darkColor="#78350f" style={styles.box}>
          <ThemedText type="small">Cambia de tema para ver el override</ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Vistas anidadas y estilos
        </ThemedText>
        <ThemedView colorScheme="primary" style={[styles.box, styles.center]}>
          <ThemedView colorScheme="background" style={styles.innerBox}>
            <ThemedText type="small">Vista anidada</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView colorScheme="success" style={[styles.box, styles.rounded]}>
          <ThemedText type="small">style: borderRadius / padding personalizados</ThemedText>
        </ThemedView>
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
  box: {
    minHeight: 56,
    padding: 14,
    borderRadius: 10,
    justifyContent: 'center',
  },
  outlined: {
    borderWidth: 1,
    borderColor: '#888888',
  },
  tokenBlock: {
    gap: 4,
  },
  center: {
    alignItems: 'center',
  },
  innerBox: {
    width: '70%',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  rounded: {
    borderRadius: 24,
    paddingHorizontal: 24,
  },
});
