import { useState } from 'react';

import { ScrollView, StyleSheet, View } from 'react-native';
import { Controller, useForm } from 'react-hook-form';

import {
  SampleBackLink,
  ThemedInput,
  ThemedPress,
  ThemedText,
  ThemedView,
} from '@/components';
import { useThemeColor } from '@/hooks';

type FormValues = {
  email: string;
  password: string;
};

export default function ThemedInputSample() {
  const [simpleValue, setSimpleValue] = useState('');
  const [age, setAge] = useState('');
  const [phone, setPhone] = useState('');
  const [submitted, setSubmitted] = useState<FormValues | null>(null);
  const onPrimary = useThemeColor(undefined, 'background');

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { email: '', password: '' },
    mode: 'onBlur',
  });

  const onSubmit = (values: FormValues) => setSubmitted(values);

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <SampleBackLink />
        <ThemedText type="subtitle">ThemedInput</ThemedText>
        <ThemedText type="small" style={styles.intro}>
          `TextInput` controlado y themed: sirve igual con `useState` que con `Controller` de React Hook Form.
        </ThemedText>

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Sin formulario (useState)
        </ThemedText>
        <ThemedInput
          label="Nombre"
          placeholder="Escribe tu nombre"
          value={simpleValue}
          onChangeText={setSimpleValue}
          helperText={`Valor actual: ${simpleValue || '—'}`}
        />

        <ThemedInput
          label="Edad"
          placeholder="Solo números"
          keyboardType="numeric"
          inputMode="numeric"
          maxLength={3}
          value={age}
          onChangeText={setAge}
          helperText={'keyboardType="numeric" · inputMode="numeric"'}
        />

        <ThemedInput
          label="Teléfono"
          placeholder="600 000 000"
          keyboardType="phone-pad"
          inputMode="tel"
          autoComplete="tel"
          maxLength={9}
          value={phone}
          onChangeText={setPhone}
          helperText={'keyboardType="phone-pad" · inputMode="tel"'}
        />

        <ThemedText type="smallBold" style={styles.sectionTitle}>
          Con React Hook Form (Controller)
        </ThemedText>
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            rules={{
              required: 'El email es obligatorio',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Introduce un email válido',
              },
            }}
            render={({ field, fieldState }) => (
              <ThemedInput
                ref={field.ref}
                label="Email"
                placeholder="nombre@ejemplo.com"
                keyboardType="email-address"
                autoComplete="email"
                autoCapitalize="none"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={() => field.onBlur()}
                error={fieldState.error?.message}
                helperText="Se valida al perder el foco"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: 'La contraseña es obligatoria',
              minLength: { value: 6, message: 'Mínimo 6 caracteres' },
            }}
            render={({ field, fieldState }) => (
              <ThemedInput
                ref={field.ref}
                label="Contraseña"
                placeholder="Mínimo 6 caracteres"
                secureTextEntry
                autoComplete="current-password"
                value={field.value}
                onChangeText={field.onChange}
                onBlur={() => field.onBlur()}
                error={fieldState.error?.message}
              />
            )}
          />

          <ThemedPress type="primary" onPress={() => handleSubmit(onSubmit)()}>
            <ThemedText style={[styles.submitLabel, { color: onPrimary }]}>Enviar</ThemedText>
          </ThemedPress>

          {submitted ? (
            <ThemedText type="small" style={styles.result}>
              Enviado: {submitted.email} · {submitted.password.length} caracteres
            </ThemedText>
          ) : null}
          {Object.keys(errors).length > 0 ? (
            <ThemedText type="small" themeColor="danger">
              Revisa los campos marcados.
            </ThemedText>
          ) : null}
        </View>
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
    marginTop: 16,
    marginBottom: 0,
  },
  form: {
    gap: 16,
  },
  submitLabel: {
    fontWeight: '600',
  },
  result: {
    marginTop: 4,
  },
});
