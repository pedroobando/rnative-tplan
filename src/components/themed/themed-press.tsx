import { Pressable, type PressableProps } from 'react-native';

/**
 * Variantes de color del botón. Los nombres (salvo `default`) corresponden a
 * tokens de `src/global.css`, por lo que siguen el tema activo (light, dark,
 * ocean, emerald, orange). `default` es el botón neutro: fondo `background`,
 * borde `border` y contenido `text` (a cargo de quien pase los children).
 */
export type ThemedPressType =
  | 'default'
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'success'
  | 'danger';

export type ThemedPressProps = PressableProps & {
  /** Variante de color. Por defecto: 'default'. */
  type?: ThemedPressType;
  /** Clases de Uniwind/Tailwind que se añaden a las de la variante. */
  className?: string;
};

const baseClassName = 'flex-row items-center justify-center rounded-lg px-4 py-3';

const stateClassName = 'active:opacity-80 active:scale-95 disabled:opacity-50';

const typeClassName: Record<ThemedPressType, string> = {
  default: 'border border-border bg-background active:bg-border/40',
  primary: 'bg-primary active:bg-primary/80',
  secondary: 'bg-secondary active:bg-secondary/80',
  tertiary: 'bg-tertiary active:bg-tertiary/80',
  success: 'bg-success active:bg-success/80',
  danger: 'bg-danger active:bg-danger/80',
};

/**
 * `Pressable` con estilos del tema y feedback visual al presionar.
 * Acepta todas las props de `Pressable` (incluidos `onPress`, `style` como
 * función, `children` como función y `ref`) y `className` de Uniwind.
 */
export function ThemedPress({
  type = 'default',
  className,
  accessibilityRole = 'button',
  ...rest
}: ThemedPressProps) {
  return (
    <Pressable
      accessibilityRole={accessibilityRole}
      className={[baseClassName, typeClassName[type], stateClassName, className]
        .filter(Boolean)
        .join(' ')}
      {...rest}
    />
  );
}
