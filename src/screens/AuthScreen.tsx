import { useState, type ComponentProps, type ReactNode } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  TextInput,
  View,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, Surface, Text } from "react-native-paper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { palette } from "../theme";

type AuthMode = "login" | "register";
type FieldName = "name" | "email" | "password" | "confirmPassword";
type FormValues = Record<FieldName, string>;
type FormErrors = Partial<Record<FieldName | "terms", string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const colors = {
  background: palette.background,
  surface: palette.surface,
  raised: palette.raised,
  border: palette.border,
  text: palette.text,
  muted: palette.muted,
  quiet: palette.quiet,
  accent: palette.accent,
  danger: palette.danger,
  onAccent: palette.onAccent,
  accentSoft: palette.accentSoft,
  accentBorder: palette.accentBorder,
  placeholder: palette.placeholder,
};

export function AuthScreen({ onAuthenticated }: { onAuthenticated: () => void }) {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<AuthMode>("login");
  const [values, setValues] = useState<FormValues>(initialValues);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const isRegister = mode === "register";

  function updateField(field: FieldName, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function changeMode(nextMode: AuthMode) {
    setMode(nextMode);
    setErrors({});
    setAcceptedTerms(false);
    setValues((current) => ({ ...current, name: "", confirmPassword: "" }));
  }

  function submit() {
    const nextErrors: FormErrors = {};
    const email = values.email.trim();

    if (isRegister && values.name.trim().length < 2) {
      nextErrors.name = "Informe seu nome.";
    }
    if (!email) {
      nextErrors.email = "Informe seu e-mail.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Digite um e-mail válido.";
    }
    if (values.password.length < 8) {
      nextErrors.password = "Use pelo menos 8 caracteres.";
    }
    if (isRegister && values.confirmPassword !== values.password) {
      nextErrors.confirmPassword = "As senhas não coincidem.";
    }
    if (isRegister && !acceptedTerms) {
      nextErrors.terms = "Aceite os termos para continuar.";
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length === 0) onAuthenticated();
  }

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            flexGrow: 1,
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: Math.max(insets.top, 24),
            paddingBottom: Math.max(insets.bottom, 24),
          }}
        >
          <View className="w-full" style={{ maxWidth: 420 }}>
            <View className="mb-10 flex-row items-center gap-3">
              <Surface
                elevation={0}
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 16,
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: colors.accentSoft,
                  borderColor: colors.accentBorder,
                  borderWidth: 1,
                }}
              >
                <MaterialCommunityIcons
                  name="hexagon-multiple-outline"
                  size={22}
                  color={colors.accent}
                />
              </Surface>
              <View>
                <Text style={{ color: colors.text, fontFamily: "Geist_600SemiBold", fontSize: 15 }}>
                  CryptoApp
                </Text>
                <Text style={{ color: colors.quiet, fontFamily: "Geist_500Medium", fontSize: 9, letterSpacing: 2, marginTop: 2 }}>
                  WALLET
                </Text>
              </View>
            </View>

            <View className="mb-8">
              <View className="mb-3 flex-row items-center gap-2">
                <View className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: colors.accent }} />
                <Text style={{ color: colors.accent, fontFamily: "Geist_600SemiBold", fontSize: 10, letterSpacing: 1.5 }}>
                  CARTEIRA DIGITAL
                </Text>
              </View>
              <Text style={{ color: colors.text, fontFamily: "Geist_600SemiBold", fontSize: 30, lineHeight: 37, letterSpacing: -1 }}>
                {isRegister ? "Sua próxima etapa começa aqui." : "Bem-vindo de volta."}
              </Text>
              <Text style={{ color: colors.quiet, fontFamily: "Geist_400Regular", fontSize: 14, lineHeight: 21, marginTop: 10 }}>
                {isRegister
                  ? "Crie sua conta para acompanhar seus ativos em um só lugar."
                  : "Acesse sua carteira e acompanhe seus ativos."}
              </Text>
            </View>

            <View className="mb-6 flex-row rounded-2xl p-1" style={{ backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 }}>
              <ModeTab active={!isRegister} title="Entrar" onPress={() => changeMode("login")} />
              <ModeTab active={isRegister} title="Criar conta" onPress={() => changeMode("register")} />
            </View>

            {isRegister && (
              <AuthField
                label="NOME COMPLETO"
                icon="account-outline"
                placeholder="Como podemos chamar você?"
                value={values.name}
                error={errors.name}
                onChangeText={(value) => updateField("name", value)}
                autoCapitalize="words"
                returnKeyType="next"
              />
            )}

            <AuthField
              label="E-MAIL"
              icon="email-outline"
              placeholder="voce@exemplo.com"
              value={values.email}
              error={errors.email}
              onChangeText={(value) => updateField("email", value)}
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              returnKeyType="next"
            />

            <AuthField
              label="SENHA"
              icon="lock-outline"
              placeholder="Mínimo de 8 caracteres"
              value={values.password}
              error={errors.password}
              onChangeText={(value) => updateField("password", value)}
              autoCapitalize="none"
              autoComplete={isRegister ? "new-password" : "password"}
              secureTextEntry={!showPassword}
              returnKeyType={isRegister ? "next" : "done"}
              onSubmitEditing={isRegister ? undefined : submit}
              trailing={
                <Pressable
                  onPress={() => setShowPassword((current) => !current)}
                  accessibilityRole="button"
                  accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  hitSlop={10}
                >
                  <MaterialCommunityIcons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={20}
                    color={colors.quiet}
                  />
                </Pressable>
              }
            />

            {isRegister ? (
              <AuthField
                label="CONFIRME SUA SENHA"
                icon="lock-check-outline"
                placeholder="Digite sua senha novamente"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChangeText={(value) => updateField("confirmPassword", value)}
                autoCapitalize="none"
                autoComplete="new-password"
                secureTextEntry={!showPassword}
                returnKeyType="done"
                onSubmitEditing={submit}
              />
            ) : (
              <Pressable
                onPress={() =>
                  Alert.alert(
                    "Recuperar acesso",
                    "A recuperação de senha será ativada quando a autenticação do servidor estiver conectada.",
                  )
                }
                accessibilityRole="button"
                className="mb-5 self-end py-1"
              >
                <Text style={{ color: colors.accent, fontFamily: "Geist_500Medium", fontSize: 12 }}>
                  Esqueceu a senha?
                </Text>
              </Pressable>
            )}

            {isRegister && (
              <View className="mb-5">
                <Pressable
                  onPress={() => setAcceptedTerms((current) => !current)}
                  accessibilityRole="checkbox"
                  accessibilityState={{ checked: acceptedTerms }}
                  className="flex-row items-start gap-3 py-1"
                >
                  <View
                    className="mt-0.5 h-5 w-5 items-center justify-center rounded-md"
                    style={{ backgroundColor: acceptedTerms ? colors.accent : colors.surface, borderColor: acceptedTerms ? colors.accent : colors.border, borderWidth: 1 }}
                  >
                    {acceptedTerms && <MaterialCommunityIcons name="check" size={14} color={colors.onAccent} />}
                  </View>
                  <Text style={{ flex: 1, color: colors.muted, fontFamily: "Geist_400Regular", fontSize: 12, lineHeight: 18 }}>
                    Li e aceito os termos de uso e a política de privacidade.
                  </Text>
                </Pressable>
                {errors.terms && <FieldError message={errors.terms} />}
              </View>
            )}

            <Button
              mode="contained"
              onPress={submit}
              buttonColor={colors.accent}
              textColor={colors.onAccent}
              contentStyle={{ height: 54 }}
              style={{ borderRadius: 16, marginTop: isRegister ? 1 : 4 }}
              labelStyle={{ fontFamily: "Geist_600SemiBold", fontSize: 14, letterSpacing: 0.1 }}
            >
              {isRegister ? "Criar conta" : "Entrar na carteira"}
            </Button>

            <View className="mt-6 flex-row items-start justify-center gap-2 px-2">
              <MaterialCommunityIcons name="shield-check-outline" size={15} color={colors.quiet} />
              <Text style={{ flex: 1, color: colors.quiet, fontFamily: "Geist_400Regular", fontSize: 10, lineHeight: 15, textAlign: "center" }}>
                Modo de demonstração: o acesso é validado localmente e ainda não cria uma conta no servidor.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ModeTab({ active, title, onPress }: { active: boolean; title: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className="min-h-11 flex-1 items-center justify-center rounded-xl px-3"
      style={{ backgroundColor: active ? colors.raised : "transparent" }}
    >
      <Text style={{ color: active ? colors.text : colors.quiet, fontFamily: active ? "Geist_600SemiBold" : "Geist_500Medium", fontSize: 12 }}>
        {title}
      </Text>
    </Pressable>
  );
}

function AuthField({
  label,
  icon,
  placeholder,
  value,
  error,
  onChangeText,
  trailing,
  ...inputProps
}: {
  label: string;
  icon: string;
  placeholder: string;
  value: string;
  error?: string;
  onChangeText: (value: string) => void;
  trailing?: ReactNode;
} & Omit<ComponentProps<typeof TextInput>, "value" | "onChangeText" | "placeholder">) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="mb-4">
      <Text style={{ color: colors.muted, fontFamily: "Geist_600SemiBold", fontSize: 10, letterSpacing: 1, marginBottom: 8 }}>
        {label}
      </Text>
      <View
        className="min-h-[56px] flex-row items-center gap-3 rounded-2xl px-4"
        style={{ backgroundColor: colors.surface, borderColor: error ? colors.danger : focused ? colors.accent : colors.border, borderWidth: 1 }}
      >
        <MaterialCommunityIcons name={icon as never} size={19} color={focused ? colors.accent : colors.quiet} />
        <TextInput
          {...inputProps}
          value={value}
          onChangeText={onChangeText}
          onFocus={(event) => {
            setFocused(true);
            inputProps.onFocus?.(event);
          }}
          onBlur={(event) => {
            setFocused(false);
            inputProps.onBlur?.(event);
          }}
          placeholder={placeholder}
          placeholderTextColor={colors.placeholder}
          selectionColor={colors.accent}
          style={{ flex: 1, minHeight: 54, color: colors.text, fontFamily: "Geist_400Regular", fontSize: 13, paddingVertical: 0 }}
        />
        {trailing}
      </View>
      {error && <FieldError message={error} />}
    </View>
  );
}

function FieldError({ message }: { message: string }) {
  return (
    <Text accessibilityRole="alert" style={{ color: colors.danger, fontFamily: "Geist_400Regular", fontSize: 11, marginTop: 6 }}>
      {message}
    </Text>
  );
}
