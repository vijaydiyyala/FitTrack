import { Txt } from "@/components/ui/Txt";
import { Ionicons } from "@expo/vector-icons";
import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { Modal, Pressable, View } from "react-native";

type IoniconName = keyof typeof Ionicons.glyphMap;

interface DialogOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  icon?: IoniconName;
}

interface DialogContextValue {
  confirm: (opts: DialogOptions) => Promise<boolean>;
  alert: (opts: Omit<DialogOptions, "cancelText">) => Promise<void>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

interface DialogState {
  visible: boolean;
  kind: "confirm" | "alert";
  opts: DialogOptions;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DialogState>({
    visible: false,
    kind: "alert",
    opts: { title: "" },
  });
  const resolver = useRef<((value: boolean) => void) | null>(null);

  const open = useCallback((kind: "confirm" | "alert", opts: DialogOptions) => {
    return new Promise<boolean>((resolve) => {
      resolver.current = resolve;
      setState({ visible: true, kind, opts });
    });
  }, []);

  const confirm = useCallback(
    (opts: DialogOptions) => open("confirm", opts),
    [open],
  );
  const alert = useCallback(
    (opts: Omit<DialogOptions, "cancelText">) =>
      open("alert", opts).then(() => undefined),
    [open],
  );

  const close = useCallback((result: boolean) => {
    setState((s) => ({ ...s, visible: false }));
    const resolve = resolver.current;
    resolver.current = null;
    resolve?.(result);
  }, []);

  const { visible, kind, opts } = state;
  const destructive = Boolean(opts.destructive);
  const icon =
    opts.icon ?? (destructive ? "alert-circle-outline" : "information-circle-outline");

  return (
    <DialogContext.Provider value={{ confirm, alert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => close(false)}
      >
        <Pressable
          className="flex-1 items-center justify-center bg-black/70 px-8"
          onPress={() => close(false)}
        >
          <Pressable
            className="w-full max-w-sm rounded-3xl border border-border bg-surface p-6"
            onPress={() => {}}
          >
            <View
              className={`mb-4 h-12 w-12 items-center justify-center rounded-2xl ${
                destructive ? "bg-danger/15" : "bg-accent/15"
              }`}
            >
              <Ionicons
                name={icon}
                size={24}
                color={destructive ? "#FB7185" : "#A3E635"}
              />
            </View>

            <Txt weight="bold" className="text-xl">
              {opts.title}
            </Txt>
            {opts.message ? (
              <Txt weight="regular" className="mt-2 text-sm leading-5 text-muted">
                {opts.message}
              </Txt>
            ) : null}

            <View className="mt-6 flex-row gap-3">
              {kind === "confirm" ? (
                <Pressable
                  onPress={() => close(false)}
                  className="h-12 flex-1 items-center justify-center rounded-xl border border-border bg-elevated active:opacity-70"
                >
                  <Txt weight="semibold" className="text-base">
                    {opts.cancelText ?? "Cancel"}
                  </Txt>
                </Pressable>
              ) : null}
              <Pressable
                onPress={() => close(true)}
                className={`h-12 flex-1 items-center justify-center rounded-xl active:opacity-80 ${
                  destructive ? "bg-danger" : "bg-accent"
                }`}
              >
                <Txt weight="bold" className="text-base text-bg">
                  {opts.confirmText ?? (kind === "confirm" ? "Confirm" : "OK")}
                </Txt>
              </Pressable>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </DialogContext.Provider>
  );
}

export function useDialog(): DialogContextValue {
  const ctx = useContext(DialogContext);
  if (!ctx) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return ctx;
}
