import { AuthScreen } from "@/components/ui/AuthScreen";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Txt } from "@/components/ui/Txt";
import { auth } from "@/services/firebase";
import { Link, useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import { useState } from "react";
import { Pressable, View } from "react-native";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  async function handleReset() {
    setError(null);
    if (!email.trim()) {
      setError("Enter your email address.");
      return;
    }
    setSubmitting(true);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send reset email.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      <View className="mb-10 items-center">
        <Txt weight="extrabold" className="text-3xl tracking-tight">
          Reset password
        </Txt>
        <Txt weight="medium" className="mt-1 text-center text-base text-muted">
          Enter your email and we&apos;ll send you a reset link.
        </Txt>
      </View>

      <View className="gap-4">
        {sent ? (
          <View className="rounded-xl border border-success/40 bg-success/10 px-4 py-3">
            <Txt weight="medium" className="text-center text-sm text-success">
              Reset email sent. Check your inbox, then sign in.
            </Txt>
          </View>
        ) : null}

        {error ? (
          <View className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Txt weight="medium" className="text-center text-sm text-danger">
              {error}
            </Txt>
          </View>
        ) : null}

        <Input
          label="Email"
          placeholder="you@example.com"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          returnKeyType="go"
          onSubmitEditing={handleReset}
        />

        {sent ? (
          <Button
            label="Back to Sign In"
            onPress={() => router.replace("/(auth)/login")}
            className="mt-2"
          />
        ) : (
          <Button
            label="Send Reset Link"
            onPress={handleReset}
            loading={submitting}
            className="mt-2"
          />
        )}
      </View>

      <View className="mt-8 flex-row justify-center">
        <Link href="/(auth)/login" asChild>
          <Pressable className="active:opacity-60">
            <Txt weight="semibold" className="text-sm text-accent">
              Back to sign in
            </Txt>
          </Pressable>
        </Link>
      </View>
    </AuthScreen>
  );
}
