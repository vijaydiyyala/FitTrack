import { AuthScreen } from "@/components/ui/AuthScreen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Txt } from "@/components/ui/Txt";
import { COLORS } from "@/constants";
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export default function LoginScreen() {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordRef = useRef<TextInput>(null);

  async function handleLogin() {
    setError(null);
    if (!email.trim() || !password) {
      setError("Enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      <View className="mb-10 items-center">
        <View className="mb-4 h-16 w-16 items-center justify-center rounded-3xl bg-accent">
          <Ionicons name="barbell" size={32} color={COLORS.onPrimary} />
        </View>
        <Txt weight="extrabold" className="text-4xl tracking-tight">
          FitTrack
        </Txt>
        <Txt weight="medium" className="mt-1 text-base text-muted">
          Welcome back. Let&apos;s train.
        </Txt>
      </View>

      <View className="gap-4">
        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="next"
          onSubmitEditing={() => passwordRef.current?.focus()}
        />

        <Input
          ref={passwordRef}
          label="Password"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          password
          autoComplete="password"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable className="self-end py-1 active:opacity-60">
            <Txt weight="semibold" className="text-sm text-accent">
              Forgot password?
            </Txt>
          </Pressable>
        </Link>

        {error ? (
          <View className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Txt weight="medium" className="text-center text-sm text-danger">
              {error}
            </Txt>
          </View>
        ) : null}

        <Button
          label="Sign In"
          onPress={handleLogin}
          loading={submitting}
          className="mt-2"
        />
      </View>

      <View className="mt-8 flex-row justify-center">
        <Txt className="text-sm text-muted">Don&apos;t have an account? </Txt>
        <Link href="/(auth)/register" asChild>
          <Pressable className="active:opacity-60">
            <Txt weight="bold" className="text-sm text-accent">
              Sign up
            </Txt>
          </Pressable>
        </Link>
      </View>
    </AuthScreen>
  );
}
