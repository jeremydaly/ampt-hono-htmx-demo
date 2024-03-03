import { FC } from "hono/jsx";

export const Base: FC = (props) => {
  return (
    <html>
      <head>
        <title>{props.title}</title>
        <link rel="stylesheet" href="/css/styles.css" />
        <script src="https://unpkg.com/htmx.org@1.9.10"></script>
      </head>
      <body>
        <h1 class="text-3xl text-blue-500 pb-4">Hello from Base Component!</h1>
        {props.children}
      </body>
    </html>
  );
};
