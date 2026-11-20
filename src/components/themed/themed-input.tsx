import type { ComponentPropsWithRef } from 'react';
import { TextInput, View, type TextInputProps } from 'react-native';

import { ThemedText } from '@/components/themed/themed-text';
import { useThemeColor } from '@/hooks';

/**
 * `ThemedInput` — `TextInput` controlado con los tokens del tema activo.
 *
 * Es agnóstico de librerías de formularios: expone `value` / `onChangeText`
 * y reenvía la referencia nativa, así que sirve tanto con `useState` como con
 * `Controller` de React Hook Form.
 *
 * ```tsx
 * <ThemedInput label="Email" value={email} onChangeText={setEmail} />
 * ```
 */
/** Tipo real del ref nativo (en RN 0.88 no es `Ref<TextInput>`). */
type NativeTextInputRef = NonNullable<ComponentPropsWithRef<typeof TextInput>['ref']>;

export type ThemedInputProps = TextInputProps & {
  /** Etiqueta opcional mostrada encima del input. */
  label?: string;
  /** Texto de ayuda mostrado debajo cuando no hay error. */
  helperText?: string;
  /** Mensaje de error. `true` marca el campo como inválido sin mostrar texto. */
  error?: string | boolean;
  /** Clases adicionales de Uniwind para el `TextInput`. */
  className?: string;
  /** Ref al `TextInput` nativo (útil para `field.ref` de React Hook Form). */
  ref?: NativeTextInputRef;
};

/** Los tokens actuales son hexadecimales; se añade alpha para el placeholder. */
function withAlpha(color: string | undefined) {
  return color && /^#[0-9a-f]{6}$/i.test(color) ? `${color}80` : color;
}

export function ThemedInput({
  label,
  helperText,
  error,
  className,
  ref,
  accessibilityLabel,
  editable = true,
  readOnly = false,
  ...rest
}: ThemedInputProps) {
  const text = useThemeColor(undefined, 'text');
  const hasError = Boolean(error);
  const message = typeof error === 'string' ? error : undefined;
  const hint = message ?? helperText;
  const disabled = !editable || readOnly;

  return (
    <View className="gap-1.5">
      {label ? <ThemedText type="smallBold">{label}</ThemedText> : null}

      <TextInput
        {...rest}
        ref={ref}
        editable={editable}
        readOnly={readOnly}
        accessibilityLabel={accessibilityLabel ?? label}
        placeholderTextColor={withAlpha(text)}
        className={[
          'min-h-12 w-full rounded-lg border px-3 py-2 text-base',
          hasError ? 'border-danger focus:border-danger' : 'border-border focus:border-primary',
          disabled ? 'opacity-50' : '',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
      />

      {hint ? (
        <ThemedText
          type="small"
          themeColor={hasError ? 'danger' : 'secondary'}
          className={hasError ? undefined : 'opacity-70'}>
          {hint}
        </ThemedText>
      ) : null}
    </View>
  );
}
