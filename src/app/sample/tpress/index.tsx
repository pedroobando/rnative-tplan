import { useState } from 'react';

import { ScrollView, StyleSheet } from 'react-native';

import { SampleBackLink, ThemedPress, ThemedText, ThemedView } from '@/components';
import type { ThemedPressType } from '@/components/themed/themed-press';
import { useThemeColor } from '@/hooks';

const variants: ThemedPressType[] = [
  'default',
  'primary',
  'secondary',
  'tertiary',
  'success',
  'danger',
];

export default function ThemedPressSample() {
  const [lastPressed, setLastPressed] = useState<string>('Ninguno');
  const [timesPressed, setTimesPressed] = useState(0);
  const labelColor = useThemeColor(undefined, 'background');

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SampleBackLink />
        <ThemedText type="subtitle">ThemedPress</ThemedText>
        <ThemedText type="small" style={styles.intro}>
          `Pressable` con variantes del tema, feedback al presionar y soporte de `className`.
        </ThemedText>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Variantes (`type`)
        </ThemedText>
        {variants.map((type) => (
          <ThemedPress key={type} type={type} onPress={() => setLastPressed(type)}>
            <ThemedText style={type === 'default' ? undefined : { color: labelColor }}>
              {type}
            </ThemedText>
          </ThemedPress>
        ))}
        <ThemedText type="small">Última variante pulsada: {lastPressed}</ThemedText>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Deshabilitado
        </ThemedText>
        <ThemedPress type="primary" disabled onPress={() => setLastPressed('disabled')}>
          <ThemedText style={{ color: labelColor }}>No se puede pulsar</ThemedText>
        </ThemedPress>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          `className` de Uniwind
        </ThemedText>
        <ThemedPress type="primary" className="self-start rounded-full px-6">
          <ThemedText style={{ color: labelColor }}>Botón redondeado</ThemedText>
        </ThemedPress>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          `style` y `children` como función
        </ThemedText>
        <ThemedPress
          style={({ pressed }) => [styles.custom, { opacity: pressed ? 0.6 : 1 }]}
          onPress={() => setTimesPressed((value) => value + 1)}>
          {({ pressed }) => (
            <ThemedText style={{ color: labelColor }}>
              {pressed ? 'Presionando…' : `Pulsaciones: ${timesPressed}`}
            </ThemedText>
          )}
        </ThemedPress>
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
    gap: 12,
  },
  intro: {
    opacity: 0.7,
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 0,
  },
  custom: {
    alignSelf: 'flex-start',
    backgroundColor: '#7c3aed',
    borderRadius: 8,
    paddingHorizontal: 18,
    paddingVertical: 12,
  },
});
