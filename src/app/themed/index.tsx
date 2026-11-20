import { useState } from 'react';

import { Ionicons } from '@expo/vector-icons';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { Uniwind, useUniwind } from 'uniwind';

import { ThemedText, ThemedView } from '@/components';
import { appThemes, type AppThemeName } from '@/constants/theme';
import { useThemeColor } from '@/hooks';

export default function ThemedScreen() {
  const { theme: activeTheme } = useUniwind();

  const [selected, setSelected] = useState<AppThemeName>(
    () => appThemes.find((item) => item.name === activeTheme)?.name ?? 'light',
  );
  const [open, setOpen] = useState(false);

  const primary = useThemeColor(undefined, 'primary');
  const background = useThemeColor(undefined, 'background');
  const text = useThemeColor(undefined, 'text');
  const border = useThemeColor(undefined, 'border');

  const selectedTheme = appThemes.find((item) => item.name === selected) ?? appThemes[0];

  const applyTheme = () => {
    Uniwind.setTheme(selected);
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <ThemedText type="title">Temas</ThemedText>
        <ThemedText style={styles.subtitle}>Tema activo: {activeTheme}</ThemedText>

        <ThemedText type="smallBold" style={styles.label}>
          Selecciona un tema
        </ThemedText>

        {/* Combobox sencillo: se despliega la lista y se elige una opción. */}
        <Pressable
          onPress={() => setOpen((value) => !value)}
          accessibilityRole="button"
          accessibilityLabel="Seleccionar tema"
          accessibilityState={{ expanded: open }}
          style={[styles.comboBox, { backgroundColor: background, borderColor: border }]}>
          <ThemedText style={styles.comboBoxText}>
            {selectedTheme.icon} {selectedTheme.label}
          </ThemedText>
          <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={18} color={text} />
        </Pressable>

        {open && (
          <View style={[styles.menu, { backgroundColor: background, borderColor: border }]}>
            {appThemes.map((item) => {
              const isSelected = item.name === selected;

              return (
                <Pressable
                  key={item.name}
                  onPress={() => {
                    setSelected(item.name);
                    setOpen(false);
                  }}
                  style={[styles.option, isSelected && { backgroundColor: primary }]}>
                  <ThemedText style={isSelected ? { color: background } : undefined}>
                    {item.icon} {item.label} · {item.scheme}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        )}

        <Pressable
          onPress={applyTheme}
          accessibilityRole="button"
          style={[styles.button, { backgroundColor: primary }]}>
          <ThemedText style={[styles.buttonText, { color: background }]}>Aplicar</ThemedText>
        </Pressable>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flexGrow: 1,
    padding: 24,
    gap: 12,
  },
  subtitle: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 4,
  },
  comboBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  comboBoxText: {
    fontSize: 16,
  },
  menu: {
    borderWidth: 1,
    borderRadius: 10,
    marginTop: 6,
    overflow: 'hidden',
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  button: {
    marginTop: 16,
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
  },
  buttonText: {
    fontWeight: '600',
    fontSize: 16,
  },
});
