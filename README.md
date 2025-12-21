Welcome to your new TanStack app! 

# Getting Started

To run this application:

```bash
pnpm install
pnpm start
```

# Building For Production

To build this application for production:

```bash
pnpm build
```

## Testing

This project uses [Vitest](https://vitest.dev/) for testing. You can run the tests with:

```bash
pnpm test
```

## Styling

This project uses [Tailwind CSS](https://tailwindcss.com/) for styling.


## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting. The following scripts are available:


```bash
pnpm lint
pnpm format
pnpm check
```


## T3Env

- You can use T3Env to add type safety to your environment variables.
- Add Environment variables to the `src/env.mjs` file.
- Use the environment variables in your code.

### Usage

```ts
import { env } from "@/env";

console.log(env.VITE_APP_TITLE);
```






## Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

### Adding A Route

To add a new route to your application just add another a new file in the `./src/routes` directory.

TanStack will automatically generate the content of the route file for you.

Now that you have two routes you can use a `Link` component to navigate between them.

### Adding Links

To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";
```

Then anywhere in your JSX you can use it like so:

```tsx
<Link to="/about">About</Link>
```

This will create a link that will navigate to the `/about` route.

More information on the `Link` component can be found in the [Link documentation](https://tanstack.com/router/v1/docs/framework/react/api/router/linkComponent).

### Using A Layout

In the File Based Routing setup the layout is located in `src/routes/__root.tsx`. Anything you add to the root route will appear in all the routes. The route content will appear in the JSX where you use the `<Outlet />` component.

Here is an example layout that includes a header:

```tsx
import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Link } from "@tanstack/react-router";

export const Route = createRootRoute({
  component: () => (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
        </nav>
      </header>
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
```

The `<TanStackRouterDevtools />` component is not required so you can remove it if you don't want it in your layout.

More information on layouts can be found in the [Layouts documentation](https://tanstack.com/router/latest/docs/framework/react/guide/routing-concepts#layouts).


## Data Fetching

There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

For example:

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json() as Promise<{
      results: {
        name: string;
      }[];
    }>;
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return (
      <ul>
        {data.results.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    );
  },
});
```

Loaders simplify your data fetching logic dramatically. Check out more information in the [Loader documentation](https://tanstack.com/router/latest/docs/framework/react/guide/data-loading#loader-parameters).

### React-Query

React-Query is an excellent addition or alternative to route loading and integrating it into you application is a breeze.

First add your dependencies:

```bash
pnpm add @tanstack/react-query @tanstack/react-query-devtools
```

Next we'll need to create a query client and provider. We recommend putting those in `main.tsx`.

```tsx
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// ...

const queryClient = new QueryClient();

// ...

if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);

  root.render(
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}
```

You can also add TanStack Query Devtools to the root route (optional).

```tsx
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const rootRoute = createRootRoute({
  component: () => (
    <>
      <Outlet />
      <ReactQueryDevtools buttonPosition="top-right" />
      <TanStackRouterDevtools />
    </>
  ),
});
```

Now you can use `useQuery` to fetch your data.

```tsx
import { useQuery } from "@tanstack/react-query";

import "./App.css";

function App() {
  const { data } = useQuery({
    queryKey: ["people"],
    queryFn: () =>
      fetch("https://swapi.dev/api/people")
        .then((res) => res.json())
        .then((data) => data.results as { name: string }[]),
    initialData: [],
  });

  return (
    <div>
      <ul>
        {data.map((person) => (
          <li key={person.name}>{person.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

You can find out everything you need to know on how to use React-Query in the [React-Query documentation](https://tanstack.com/query/latest/docs/framework/react/overview).

## State Management

Another common requirement for React applications is state management. There are many options for state management in React. TanStack Store provides a great starting point for your project.

First you need to add TanStack Store as a dependency:

```bash
pnpm add @tanstack/store
```

Now let's create a simple counter in the `src/App.tsx` file as a demonstration.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
    </div>
  );
}

export default App;
```

One of the many nice features of TanStack Store is the ability to derive state from other state. That derived state will update when the base state updates.

Let's check this out by doubling the count using derived state.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store, Derived } from "@tanstack/store";
import "./App.css";

const countStore = new Store(0);

const doubledStore = new Derived({
  fn: () => countStore.state * 2,
  deps: [countStore],
});
doubledStore.mount();

function App() {
  const count = useStore(countStore);
  const doubledCount = useStore(doubledStore);

  return (
    <div>
      <button onClick={() => countStore.setState((n) => n + 1)}>
        Increment - {count}
      </button>
      <div>Doubled - {doubledCount}</div>
    </div>
  );
}

export default App;
```

We use the `Derived` class to create a new store that is derived from another store. The `Derived` class has a `mount` method that will start the derived store updating.

Once we've created the derived store we can use it in the `App` component just like we would any other store using the `useStore` hook.

You can find out everything you need to know on how to use TanStack Store in the [TanStack Store documentation](https://tanstack.com/store/latest).

## Backend API Spec

##### Base Information
- **Framework**: Elysia
- **Validation**: Zod
- **Purpose**: Health checks, connectivity testing, and uptime verification
- **Response Format**: Plain text

---
## `POST /user/login`
### Name: **User Login Endpoint**

### Details:
Authenticates a user using their email and password credentials.  
On successful authentication, returns a JWT token along with normalized user profile information for use in subsequent authenticated requests.

This endpoint acts as a secure authentication gateway and maps the backend API response into a frontend-friendly user model.
##### Use Cases:
- User authentication (email/password login)
- Issuing JWT tokens for protected routes
- Initial session creation
- Validating user existence and credentials

### Implementation:
```ts
.post(
  "/login",
  async ({ body, status }) => {
    const res = await fetch(API_URL.V1.USER.LOGIN, {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await res.json();

    if (isErrorResponse(response)) {
      switch (response.code) {
        case "Not Found":
          return status(404, {
            error: response.code,
            message: response.message,
            timestamp: new Date().toISOString(),
          });
        case "Unauthorized":
          return status(401, {
            error: response.code,
            message: response.message,
            timestamp: new Date().toISOString(),
          });
        default:
          return status(500, {
            error: "Internal Server Error",
            message: "An unexpected error occurred while handling request",
            timestamp: new Date().toISOString(),
          });
      }
    }

    const validatedRes = APIResponseSchema.parse(response);

    return {
      jwtToken: validatedRes.jwtToken,
      user: {
        ...validatedRes.user,
        profile: validatedRes.user.dp,
        experience: validatedRes.user.xp,
      },
    };
  },
  {
    body: z.object({
      email: z.email("you need to enter a email to login"),
      password: z.string("you need to enter a password to login"),
    }),
    response: {
      200: ResponseSchema,
      401: "error",
      404: "error",
      500: "error",
    },
    detail: {
      summary: "User login with email and password",
      description: `Authenticates a user with their email and password credentials. 
        
On successful authentication, returns a JWT token for subsequent authenticated requests along with the user's profile information including their designation, batch, experience points, and verification status.`,
      tags: ["Authentication"],
    },
  },
)
```

---
## `GET /hello`
### Name: **Hello Endpoint**

### Details:
Returns a simple greeting message to confirm that the API is reachable and responding correctly.  
Primarily used for smoke tests and quick connectivity checks.
##### Use Cases:
- Verify API is running
- Test network connectivity
- Debug deployment issues
- Simple uptime monitoring

### Implementation:
```ts
.get(
  "/hello",
  async () => {
    const res = await fetch(API_URL.HEALTH.HELLO);
    return await res.text();
  },
  {
    response: z.string(),
    detail: {
      summary: "Say Hello to the API",
      description:
        "Returns a simple greeting message to verify the API is reachable and responding.",
      tags: ["Misc."],
    },
  },
)
```

---
## `GET /health`

### Name: **Health Check Endpoint**
### Details:
Performs a health check on the API and returns the current operational status.  
Semantically intended for monitoring and system-level availability checks rather than manual testing.
##### Use Cases:
- Health probes (Kubernetes / Docker)
- Load balancer health checks
- Monitoring and alerting systems
- CI/CD pipeline verification

### Implementation:
```ts
.get(
  "/health",
  async () => {
    const res = await fetch(API_URL.HEALTH.CHECK);
    return await res.text();
  },
  {
    response: z.string(),
    detail: {
      summary: "Perform health check of the API",
      description:
        "Performs a health check on the API and returns the current operational status. Not much different from `GET /api/hello`.",
      tags: ["Misc."],
    },
  },
)
```

# Demo files

Files prefixed with `demo` can be safely deleted. They are there to provide a starting point for you to play around with the features you've installed.

# Learn More

You can learn more about all of the offerings from TanStack in the [TanStack documentation](https://tanstack.com).
