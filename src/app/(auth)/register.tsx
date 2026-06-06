import { AuthScreen } from "@/components/ui/AuthScreen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Txt } from "@/components/ui/Txt";
import { useAuth } from "@/context/AuthContext";
import { Link } from "expo-router";
import { useRef, useState } from "react";
import { Pressable, TextInput, View } from "react-native";

export default function RegisterScreen() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleRegister() {
    setError(null);
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setSubmitting(true);
    try {
      await register(email, password, name);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      <View className="mb-10 items-center">
        <Txt weight="extrabold" className="text-3xl tracking-tight">
          Create account
        </Txt>
        <Txt weight="medium" className="mt-1 text-base text-muted">
          Start tracking your workouts.
        </Txt>
      </View>

      <View className="gap-4">
        <Input
          label="Name"
          placeholder="Jane Doe"
          value={name}
          onChangeText={setName}
          autoCapitalize="words"
          returnKeyType="next"
          onSubmitEditing={() => emailRef.current?.focus()}
        />

        <Input
          ref={emailRef}
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
          autoComplete="password-new"
          returnKeyType="next"
          onSubmitEditing={() => confirmRef.current?.focus()}
        />

        <Input
          ref={confirmRef}
          label="Confirm password"
          placeholder="••••••••"
          value={confirm}
          onChangeText={setConfirm}
          password
          autoComplete="password-new"
          returnKeyType="go"
          onSubmitEditing={handleRegister}
        />

        {error ? (
          <View className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Txt weight="medium" className="text-center text-sm text-danger">
              {error}
            </Txt>
          </View>
        ) : null}

        <Button
          label="Sign Up"
          onPress={handleRegister}
          loading={submitting}
          className="mt-2"
        />
      </View>

      <View className="mt-8 flex-row justify-center">
        <Txt className="text-sm text-muted">Already have an account? </Txt>
        <Link href="/(auth)/login" asChild>
          <Pressable className="active:opacity-60">
            <Txt weight="bold" className="text-sm text-accent">
              Sign in
            </Txt>
          </Pressable>
        </Link>
      </View>
    </AuthScreen>
  );
}
