import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ThemedPress } from '@/components/themed/themed-press';
import { ThemedText } from '@/components/themed/themed-text';
import { ThemedView } from '@/components/themed/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { formatDateRange } from '@/utils/format';

import type { PlanWeek } from '@/core/db/queries';

export type WeekSelectorProps = {
  /** Semanas disponibles en el plan. */
  weeks: PlanWeek[];
  /** Id de la semana seleccionada, o null si no hay ninguna. */
  selectedWeekId: string | null;
  /** Callback al elegir una semana del desplegable. */
  onSelect: (weekId: string) => void;
};

/**
 * Selector de semana del plan.
 *
 * Se construye solo con componentes del proyecto y un `Modal` de React Native
 * (core), sin dependencias nuevas: funciona en Expo Go.
 */
export function WeekSelector({ weeks, selectedWeekId, onSelect }: WeekSelectorProps) {
  const [open, setOpen] = useState(false);

  const primary = useThemeColor(undefined, 'primary');
  const border = useThemeColor(undefined, 'border');

  const selectedWeek = weeks.find((week) => week.id === selectedWeekId) ?? null;

  const triggerLabel = selectedWeek ? selectedWeek.name : 'Elige una semana';
  // Rango de fechas de la semana visible, a la derecha del nombre.
  const triggerRange = selectedWeek
    ? formatDateRange(selectedWeek.startDate, selectedWeek.endDate)
    : null;
  const triggerAccessibilityLabel = selectedWeek
    ? `Semana seleccionada: ${selectedWeek.name}`
    : 'Seleccionar semana del plan';

  const close = () => setOpen(false);

  const handleSelect = (weekId: string) => {
    onSelect(weekId);
    close();
  };

  return (
    <>
      {/* Botón principal del plan: relleno `primary` con sombra para que
          destaque sobre el fondo neutro de la pantalla. El texto va en blanco
          (no en `background`) porque en los temas oscuros el token `background`
          es oscuro y perdería contraste sobre el morado del botón. */}
      <ThemedPress
        type="primary"
        onPress={() => setOpen(true)}
        accessibilityRole="button"
        accessibilityLabel={triggerAccessibilityLabel}
        accessibilityHint="Abre la lista de semanas del plan"
        accessibilityState={{ expanded: open }}
        className="rounded-xl"
        style={[styles.trigger, { shadowColor: primary }]}
      >
        <ThemedText
          type="semiBold"
          numberOfLines={1}
          style={[styles.triggerText, styles.onPrimary]}
        >
          {triggerLabel}
        </ThemedText>

        {triggerRange ? (
          <ThemedText type="small" numberOfLines={1} style={styles.triggerRange}>
            {triggerRange}
          </ThemedText>
        ) : null}
      </ThemedPress>

      <Modal
        visible={open}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={close}
      >
        {/* Fondo oscurecido: se usa un color con alfa porque el tema no tiene
            un token para el overlay y no se puede derivar alfa de un token. */}
        <View style={styles.backdrop}>
          <PressableBackdrop onPress={close} />
          <ThemedView style={[styles.sheet, { borderColor: border }]} accessibilityViewIsModal>
            <ThemedText type="semiBold" style={styles.sheetTitle}>
              Semana del plan
            </ThemedText>

            <ScrollView
              style={styles.list}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            >
              {weeks.map((week) => {
                const isSelected = week.id === selectedWeekId;
                const range = formatDateRange(week.startDate, week.endDate);

                return (
                  <ThemedPress
                    key={week.id}
                    type="default"
                    onPress={() => handleSelect(week.id)}
                    accessibilityRole="button"
                    accessibilityLabel={`${week.name}${range ? `. ${range}` : ''}`}
                    accessibilityHint="Selecciona esta semana del plan"
                    accessibilityState={{ selected: isSelected }}
                    style={[styles.option, isSelected ? { borderColor: primary } : undefined]}
                  >
                    <View style={styles.optionMain}>
                      <ThemedText
                        type={isSelected ? 'smallBold' : 'small'}
                        themeColor={isSelected ? 'primary' : undefined}
                        numberOfLines={2}
                      >
                        {week.name}
                      </ThemedText>
                      {range ? (
                        <ThemedText type="small" style={styles.optionRange}>
                          {range}
                        </ThemedText>
                      ) : null}
                    </View>

                    {isSelected ? (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={primary}
                        accessible={false}
                        accessibilityElementsHidden
                        importantForAccessibility="no-hide-descendants"
                      />
                    ) : null}
                  </ThemedPress>
                );
              })}
            </ScrollView>

            <ThemedPress
              type="default"
              onPress={close}
              accessibilityRole="button"
              accessibilityLabel="Cerrar la lista de semanas"
              style={styles.close}
            >
              <ThemedText type="semiBold" themeColor="primary">
                Cerrar
              </ThemedText>
            </ThemedPress>
          </ThemedView>
        </View>
      </Modal>
    </>
  );
}

/** Capa que cierra el modal al tocarla (por fuera de la hoja). */
function PressableBackdrop({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.backdropTouchable}
      accessible={false}
      importantForAccessibility="no-hide-descendants"
    />
  );
}

const styles = StyleSheet.create({
  trigger: {
    minHeight: 56,
    // El texto del nombre y el rango de fechas se reparten a los extremos.
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    // Sombra para dar volumen al botón sobre el fondo de la pantalla.
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  triggerText: {
    flex: 1,
  },
  // Texto sobre el relleno `primary`: blanco y con algo de transparencia.
  onPrimary: {
    color: '#ffffff',
  },
  triggerRange: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  backdrop: {
    flex: 1,
    justifyContent: 'flex-end',
    // Negro con alfa 0.45: no existe un token de overlay en el tema.
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  sheet: {
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    borderWidth: 1,
    padding: 16,
    gap: 12,
    maxHeight: '80%',
  },
  sheetTitle: {
    marginBottom: 2,
  },
  list: {
    flexGrow: 0,
    // Sin `flexShrink` la lista no se encoge y la hoja puede recortarse,
    // dejando el botón "Cerrar" inalcanzable con muchas semanas.
    flexShrink: 1,
  },
  listContent: {
    gap: 8,
    paddingBottom: 8,
  },
  option: {
    minHeight: 48,
    justifyContent: 'flex-start',
    gap: 12,
  },
  optionMain: {
    flex: 1,
    gap: 2,
  },
  optionRange: {
    opacity: 0.75,
  },
  close: {
    minHeight: 44,
  },
});
