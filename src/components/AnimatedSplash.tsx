import { COLORS } from "@/constants";
import { Ionicons } from "@expo/vector-icons";
import { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

const HOLD_MS = 1700;

export function AnimatedSplash({ onFinish }: { onFinish: () => void }) {
  const container = useSharedValue(1);
  const badgeScale = useSharedValue(0.7);
  const badgeOpacity = useSharedValue(0);
  const ringA = useSharedValue(0);
  const ringB = useSharedValue(0);
  const wordOpacity = useSharedValue(0);
  const wordShift = useSharedValue(16);
  const progress = useSharedValue(0);

  useEffect(() => {
    badgeOpacity.value = withTiming(1, { duration: 380 });
    badgeScale.value = withSpring(1, { damping: 10, stiffness: 130 });

    ringA.value = withRepeat(
      withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    ringB.value = withDelay(
      900,
      withRepeat(
        withTiming(1, { duration: 1800, easing: Easing.out(Easing.ease) }),
        -1,
        false,
      ),
    );

    wordOpacity.value = withDelay(360, withTiming(1, { duration: 420 }));
    wordShift.value = withDelay(
      360,
      withTiming(0, { duration: 480, easing: Easing.out(Easing.cubic) }),
    );

    progress.value = withDelay(
      300,
      withTiming(1, { duration: HOLD_MS - 500, easing: Easing.inOut(Easing.ease) }),
    );

    container.value = withDelay(
      HOLD_MS,
      withTiming(0, { duration: 420, easing: Easing.in(Easing.ease) }, (done) => {
        if (done) runOnJS(onFinish)();
      }),
    );
  }, [
    badgeOpacity,
    badgeScale,
    ringA,
    ringB,
    wordOpacity,
    wordShift,
    progress,
    container,
    onFinish,
  ]);

  const containerStyle = useAnimatedStyle(() => ({ opacity: container.value }));
  const badgeStyle = useAnimatedStyle(() => ({
    opacity: badgeOpacity.value,
    transform: [{ scale: badgeScale.value }],
  }));
  const ringAStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(ringA.value, [0, 1], [1, 2.3]) }],
    opacity: interpolate(ringA.value, [0, 1], [0.45, 0]),
  }));
  const ringBStyle = useAnimatedStyle(() => ({
    transform: [{ scale: interpolate(ringB.value, [0, 1], [1, 2.3]) }],
    opacity: interpolate(ringB.value, [0, 1], [0.45, 0]),
  }));
  const wordStyle = useAnimatedStyle(() => ({
    opacity: wordOpacity.value,
    transform: [{ translateY: wordShift.value }],
  }));
  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Animated.View style={[StyleSheet.absoluteFill, styles.root, containerStyle]}>
      <View style={styles.center}>
        <View style={styles.badgeWrap}>
          <Animated.View style={[styles.ring, ringAStyle]} />
          <Animated.View style={[styles.ring, ringBStyle]} />
          <Animated.View style={[styles.badge, badgeStyle]}>
            <Ionicons name="barbell" size={52} color={COLORS.onPrimary} />
          </Animated.View>
        </View>

        <Animated.Text style={[styles.word, wordStyle]}>FitTrack</Animated.Text>
        <Animated.Text style={[styles.tagline, wordStyle]}>
          Train. Track. Repeat.
        </Animated.Text>
      </View>

      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, progressStyle]} />
      </View>
    </Animated.View>
  );
}

const BADGE = 100;

const styles = StyleSheet.create({
  root: {
    alignItems: "center",
    justifyContent: "center",
    zIndex: 100,
    backgroundColor: COLORS.background,
  },
  center: { alignItems: "center" },
  badgeWrap: {
    width: BADGE,
    height: BADGE,
    alignItems: "center",
    justifyContent: "center",
  },
  ring: {
    position: "absolute",
    width: BADGE,
    height: BADGE,
    borderRadius: BADGE / 2,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  badge: {
    width: BADGE,
    height: BADGE,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  word: {
    marginTop: 28,
    fontFamily: "PlusJakartaSans_800ExtraBold",
    fontSize: 34,
    letterSpacing: -0.5,
    color: COLORS.text,
  },
  tagline: {
    marginTop: 6,
    fontFamily: "PlusJakartaSans_500Medium",
    fontSize: 14,
    color: COLORS.textMuted,
  },
  progressTrack: {
    position: "absolute",
    bottom: 80,
    width: 160,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.elevated,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: COLORS.primary,
  },
});
