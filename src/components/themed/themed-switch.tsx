import { Pressable, Switch, View, type SwitchProps } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';
import { themeColorTokens, type ThemeColorToken } from '@/constants/theme';
import { useThemeColor } from '@/hooks';

/** Color del tema (token de `global.css`) o un color literal de React Native. */
type SwitchColor = ThemeColorToken | string;

/**
 * Resuelve un token del tema o un color literal a un color real.
 * Siempre llama a `useThemeColor` para no romper las reglas de los hooks.
 */
function useResolvedThemeColor(value: string | undefined, fallbackToken: ThemeColorToken) {
  const input = value || fallbackToken;
  const isToken = (themeColorTokens as readonly string[]).includes(input);

  return useThemeColor(
    isToken ? undefined : input,
    isToken ? (input as ThemeColorToken) : fallbackToken,
  );
}

/**
 * `ThemedSwitch` — wrapper del `Switch` nativo con los colores del tema activo.
 *
 * - Track encendido: `primary` (o `activeColor`).
 * - Track apagado y fondo iOS: `border` (o `inactiveColor`).
 * - Pulgar: blanco (o `thumbColor`).
 *
 * ```tsx
 * <ThemedSwitch value={on} onValueChange={setOn} />
 * ```
 */
export type ThemedSwitchProps = Omit<
  SwitchProps,
  'value' | 'onValueChange' | 'trackColor' | 'thumbColor' | 'ios_backgroundColor'
> & {
  /** Estado actual del switch (componente controlado). */
  value: boolean;
  /** Se dispara cuando el usuario cambia el valor. */
  onValueChange: (value: boolean) => void;
  /** Token o color literal del track encendido. Por defecto: 'primary'. */
  activeColor?: SwitchColor;
  /** Token o color literal del track apagado. Por defecto: 'border'. */
  inactiveColor?: SwitchColor;
  /** Token o color literal del pulgar. Por defecto: '#ffffff'. */
  thumbColor?: SwitchColor;
};

export function ThemedSwitch({
  value,
  onValueChange,
  activeColor = 'primary',
  inactiveColor = 'border',
  thumbColor = '#ffffff',
  disabled = false,
  ...rest
}: ThemedSwitchProps) {
  const active = useResolvedThemeColor(activeColor, 'primary');
  const inactive = useResolvedThemeColor(inactiveColor, 'border');
  const thumb = useResolvedThemeColor(thumbColor, 'text');

  return (
    <Switch
      {...rest}
      value={value}
      onValueChange={onValueChange}
      disabled={disabled}
      trackColor={{ false: inactive, true: active }}
      thumbColor={thumb}
      ios_backgroundColor={inactive}
    />
  );
}

/**
 * `ThemedSwitchRow` — fila con etiqueta (y descripción opcional) a la izquierda
 * y el switch a la derecha. Al pulsar la fila entera se alterna el switch,
 * patrón habitual en la pantalla de Ajustes de iOS.
 *
 * ```tsx
 * <ThemedSwitchRow title="Notificaciones" value={on} onValueChange={setOn} />
 * ```
 */
export type ThemedSwitchRowProps = {
  /** Texto principal de la fila. */
  title: string;
  /** Texto secundario (opcional). */
  description?: string;
  /** Estado actual del switch (componente controlado). */
  value: boolean;
  /** Se dispara cuando el usuario cambia el valor. */
  onValueChange: (value: boolean) => void;
  /** Desactiva la fila y su switch. */
  disabled?: boolean;
  /** Token o color literal del track encendido. */
  activeColor?: SwitchColor;
  /** Token o color literal del track apagado. */
  inactiveColor?: SwitchColor;
  /** Token o color literal del pulgar. */
  thumbColor?: SwitchColor;
  /** Clases adicionales para la fila. */
  className?: string;
};

export function ThemedSwitchRow({
  title,
  description,
  value,
  onValueChange,
  disabled = false,
  activeColor,
  inactiveColor,
  thumbColor,
  className,
}: ThemedSwitchRowProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
      disabled={disabled}
      onPress={() => onValueChange(!value)}
      className={['flex-row items-center gap-4 py-3 active:opacity-70', className]
        .filter(Boolean)
        .join(' ')}>
      <View className="flex-1 gap-1">
        <ThemedText type="semiBold" className={disabled ? 'opacity-50' : undefined}>
          {title}
        </ThemedText>
        {description ? (
          <ThemedText type="small" className="opacity-60">
            {description}
          </ThemedText>
        ) : null}
      </View>

      <ThemedSwitch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        activeColor={activeColor}
        inactiveColor={inactiveColor}
        thumbColor={thumbColor}
      />
    </Pressable>
  );
}
