import { useState } from 'react';

import { ScrollView, StyleSheet } from 'react-native';

import { SampleBackLink, ThemedSwitch, ThemedSwitchRow, ThemedText, ThemedView } from '@/components';

export default function ThemedSwitchSample() {
  const [basic, setBasic] = useState(false);
  const [tokens, setTokens] = useState(true);
  const [literal, setLiteral] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <SampleBackLink />
        <ThemedText type="subtitle">ThemedSwitch</ThemedText>
        <ThemedText type="small" style={styles.intro}>
          Switches controlados con colores del tema, colores literales y filas de ajustes.
        </ThemedText>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Básico (valores por defecto)
        </ThemedText>
        <ThemedView style={styles.row}>
          <ThemedSwitch value={basic} onValueChange={setBasic} />
          <ThemedText type="small">Estado: {basic ? 'activado' : 'desactivado'}</ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Colores con tokens del tema
        </ThemedText>
        <ThemedView style={styles.row}>
          <ThemedSwitch
            value={tokens}
            onValueChange={setTokens}
            activeColor="success"
            inactiveColor="secondary"
            thumbColor="background"
          />
          <ThemedText type="small">success / secondary / background</ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Colores literales
        </ThemedText>
        <ThemedView style={styles.row}>
          <ThemedSwitch
            value={literal}
            onValueChange={setLiteral}
            activeColor="#16a34a"
            inactiveColor="#9ca3af"
            thumbColor="#ffffff"
          />
          <ThemedText type="small">#16a34a / #9ca3af / #ffffff</ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Deshabilitado
        </ThemedText>
        <ThemedView style={styles.row}>
          <ThemedSwitch value={disabled} onValueChange={setDisabled} disabled />
          <ThemedText type="small">No responde al toque</ThemedText>
        </ThemedView>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          ThemedSwitchRow (filas de ajustes)
        </ThemedText>
        <ThemedSwitchRow
          title="Notificaciones"
          description="Recibir avisos de la app"
          value={notifications}
          onValueChange={setNotifications}
        />
        <ThemedSwitchRow
          title="Modo oscuro"
          description="Fila deshabilitada de ejemplo"
          value={darkMode}
          onValueChange={setDarkMode}
          disabled
          activeColor="success"
        />
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
  },
});
