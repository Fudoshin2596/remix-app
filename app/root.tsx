import type { LinksFunction, MetaFunction } from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
} from "@remix-run/react";
import styles from "./styles/app.css";
import theme from "~/mui/theme";
import React, { useContext } from "react";
import StylesContext from "~/mui/stylesContext";
import Layout from "./components/layout";

export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "New Remix App",
  viewport: "width=device-width,initial-scale=1",
  themeColor: theme.palette.primary.main,
});

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: styles }];
};

function Document({
  children,
  title,
}: {
  children: React.ReactNode;
  title?: string;
}) {
  const styleData = useContext(StylesContext);
  return (
    <html lang="en">
      <head>
        {title ? <title>{title}</title> : null}
        <Meta />
        <Links />
        {styleData?.map(({ key, ids, css }) => (
          <style
            key={key}
            data-emotion={`${key} ${ids.join(" ")}`}
            // eslint-disable-next-line react/no-danger
            dangerouslySetInnerHTML={{ __html: css }}
          />
        ))}
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <Document>
      <Layout>
        <Outlet />
      </Layout>
    </Document>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <Document title="Error!">
      <Layout>
        <div>
          <h1>Error</h1>
          <p>{error.message}</p>
          <p>The stack trace is:</p>
          <pre>{error.stack}</pre>
        </div>
      </Layout>
    </Document>
  );
}

export function CatchBoundary() {
  const caught = useCatch();

  return (
    <Document title={`${caught.status} ${caught.statusText}`}>
      <Layout>
        <div>
          <h1>Caught</h1>
          <p>Status: {caught.status}</p>
          <pre>
            <code>{JSON.stringify(caught.data, null, 2)}</code>
          </pre>
        </div>
      </Layout>
    </Document>
  );
}
