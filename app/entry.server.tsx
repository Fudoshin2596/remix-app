import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import createEmotionCache from "~/mui/createEmotionCache";
import theme from "~/mui/theme";
import StylesContext from "./mui/stylesContext";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { CacheProvider } from "@emotion/react";
import { Response } from "@remix-run/node";
// import { renderToString } from "react-dom/server";
// import createEmotionServer from "@emotion/server/create-instance";

import { PassThrough } from "stream";
import isbot from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import type { ReactElement } from "react";

import dotenv from "dotenv";
dotenv.config();

const ABORT_DELAY = 5000;
const cache = createEmotionCache();
const MuiRemixServer = (children: ReactElement) => (
  <CacheProvider value={cache}>
    <ThemeProvider theme={theme}>
      {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
      <CssBaseline />
      {children}
    </ThemeProvider>
  </CacheProvider>
);

const handleRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) =>
  isbot(request.headers.get("user-agent"))
    ? handleBotRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      )
    : handleBrowserRequest(
        request,
        responseStatusCode,
        responseHeaders,
        remixContext
      );
export default handleRequest;

const handleBotRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) =>
  new Promise((resolve, reject) => {
    let didError = false;

    // Render the component to a string.
    const html = (
      <StylesContext.Provider value={null}>
        {/*<MuiRemixServer />*/}
        {MuiRemixServer(
          <RemixServer context={remixContext} url={request.url} />
        )}
      </StylesContext.Provider>
    );

    const { pipe, abort } = renderToPipeableStream(
      html,
      // <RemixServer context={remixContext} url={request.url} />,
      {
        onAllReady: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (error: unknown) => {
          reject(error);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });

const handleBrowserRequest = (
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) =>
  new Promise((resolve, reject) => {
    let didError = false;

    // const MuiRemixServer = (children : ReactElement) => (
    //   <CacheProvider value={cache}>
    //     <ThemeProvider theme={theme}>
    //       {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
    //       <CssBaseline />
    //         {children}
    //       <RemixServer context={remixContext} url={request.url} />
    //     </ThemeProvider>
    //   </CacheProvider>
    // );

    // Render the component to a string.
    const html = (
      <StylesContext.Provider value={null}>
        {/*<MuiRemixServer />*/}
        {MuiRemixServer(
          <RemixServer context={remixContext} url={request.url} />
        )}
      </StylesContext.Provider>
    );

    const { pipe, abort } = renderToPipeableStream(
      html,
      // <RemixServer context={remixContext} url={request.url} />,
      {
        onShellReady: () => {
          const body = new PassThrough();

          responseHeaders.set("Content-Type", "text/html");

          resolve(
            new Response(body, {
              headers: responseHeaders,
              status: didError ? 500 : responseStatusCode,
            })
          );

          pipe(body);
        },
        onShellError: (error: unknown) => {
          reject(error);
        },
        onError: (error: unknown) => {
          didError = true;

          console.error(error);
        },
      }
    );

    setTimeout(abort, ABORT_DELAY);
  });

// export default function handleRequest(
//   request: Request,
//   responseStatusCode: number,
//   responseHeaders: Headers,
//   remixContext: EntryContext
// ) {
//   const cache = createEmotionCache();
//   const { extractCriticalToChunks } = createEmotionServer(cache);
//
//   const MuiRemixServer = () => (
//     <CacheProvider value={cache}>
//       <ThemeProvider theme={theme}>
//         {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
//         <CssBaseline />
//         <RemixServer context={remixContext} url={request.url} />
//       </ThemeProvider>
//     </CacheProvider>
//   );
//
//   // Render the component to a string.
//   const html = renderToString(
//     <StylesContext.Provider value={null}>
//       <MuiRemixServer />
//     </StylesContext.Provider>
//   );
//
//   // Grab the CSS from emotion
//   const emotionChunks = extractCriticalToChunks(html);
//
//   // Re-render including the extracted css.
//   const markup = renderToString(
//     <StylesContext.Provider value={emotionChunks.styles}>
//       <MuiRemixServer />
//     </StylesContext.Provider>
//   );
//
//   responseHeaders.set("Content-Type", "text/html");
//
//   return new Response("<!DOCTYPE html>" + markup, {
//     headers: responseHeaders,
//     status: responseStatusCode,
//   });
// }
