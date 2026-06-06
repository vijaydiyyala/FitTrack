# Screenshots

Drop your captured app screenshots in this folder, using these exact filenames
so they render in the main project [README](../../README.md):

| Filename             | Screen                           |
| -------------------- | -------------------------------- |
| `splash.png`         | Animated splash                  |
| `login.png`          | Sign in                          |
| `signup.png`         | Create account                   |
| `home.png`           | Home dashboard                   |
| `log-workout.png`    | Log a workout (exercise search)  |
| `add-workout.png`    | Add a workout (sets/reps/notes)  |
| `map.png`            | Nearby gyms & parks              |
| `map-popup.png`      | Place details popup              |
| `profile.png`        | Profile & history                |
| `workout-detail.png` | Workout detail                   |

## How to capture

- **Android emulator / device:** press the camera button in the toolbar, or
  `adb exec-out screencap -p > home.png`.
- **iOS simulator:** `Cmd+S`, or `xcrun simctl io booted screenshot home.png`.

Portrait PNGs (roughly 1080×2340 or similar) look best. GitHub will scale them
down to the widths set in the README table.
