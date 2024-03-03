import { Hono } from "hono";
import Fraglates from "fraglates";
import { data } from "@ampt/data";

const fraglates = new Fraglates({
  templates: "./templates", // templates directory
  // precompiled: "./precompiled", // precompile template directory (optional)
});

const app = new Hono();

app.get("/", async (c) => {
  const stream = await fraglates.stream(
    "users.html",
    {
      title: "User Manager",
    },
    {
      users: async () => {
        const users = await data.get("users:*");
        return {
          users: users.items.map((user: any) => user.value),
        };
      },
    }
  );

  return c.body(stream, {
    headers: {
      "Content-Type": "text/html; charset=UTF-8",
      "Transfer-Encoding": "chunked",
    },
  });
});

app.get("/users/:userId/edit", async (c) => {
  const userId = c.req.param("userId");
  const user: any = await data.get(`users:${userId}`);
  const userEdit = await fraglates.render("users.html#user", {
    user: user,
    edit: true,
  });

  return c.html(userEdit);
});

app.get("/users/:userId", async (c) => {
  const userId = c.req.param("userId");
  const user: any = await data.get(`users:${userId}`);
  const userEdit = await fraglates.render("users.html#user", {
    user: user,
  });

  return c.html(userEdit);
});

app.put("/users/:userId", async (c) => {
  const userId = c.req.param("userId");
  const body = Object.assign({ id: userId }, await c.req.parseBody());

  const updated = await data.set(`users:${userId}`, body);
  const userOutput = await fraglates.render("users.html#user", {
    user: updated,
  });
  return c.html(userOutput);
});

// app.get("/clicked", (c) => {
//   return c.html(fraglates.render("users.html#users", { clicked: true }));
// });

app.fire();
