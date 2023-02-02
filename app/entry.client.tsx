import { RemixBrowser } from "@remix-run/react";
import { startTransition, StrictMode } from "react";
import { hydrateRoot } from "react-dom/client";
import { CacheProvider, ThemeProvider } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "~/mui/theme";
import createEmotionCache from "~/mui/createEmotionCache";

const emotionCache = createEmotionCache();

function hydrate() {
  startTransition(() => {
    hydrateRoot(
      document,
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <StrictMode>
            <RemixBrowser />
          </StrictMode>
        </ThemeProvider>
      </CacheProvider>
    );
  });
}

if (typeof requestIdleCallback === "function") {
  requestIdleCallback(hydrate);
} else {
  // Safari doesn't support requestIdleCallback
  // https://caniuse.com/requestidlecallback
  setTimeout(hydrate, 1);
}
