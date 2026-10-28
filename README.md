# yv-type-utils

A collection of reusable global TypeScript utility types for object manipulation, unions, functions, tuples, strings, and application-level type definitions.

All utility types are declared globally, so you can use them throughout your TypeScript project without importing them individually.

## Installation

```bash
pnpm add -D yv-type-utils
```

Or with npm:

```bash
npm install -D yv-type-utils
```

## Configuration

If your project uses a restrictive `types` or `typeRoots` configuration, make sure the package is included.

## Object utilities

### `NullableBy<T, K>`

Makes selected properties nullable.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserWithNullableEmail = NullableBy<User, "email">;

// Equivalent to:
// {
//   id: number;
//   name: string;
//   email: string | null;
// }
```

### `ImmutableBy<T, K>`

Makes selected properties readonly.

```ts
interface User {
  id: number;
  name: string;
}

type ImmutableUserId = ImmutableBy<User, "id">;

const user: ImmutableUserId = {
  id: 1,
  name: "Yoni",
};

// Error: id is readonly.
// user.id = 2;
```

### `PartialBy<T, K>`

Makes selected properties optional while keeping all other properties unchanged.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserUpdate = PartialBy<User, "name" | "email">;

const update: UserUpdate = {
  name: "Yoni",
};

// Valid: id is still required.
// name and email are optional.
```

**Use case:** Useful for update operations where some fields are optional but other fields must remain required.

### `DeepPartial<T>`

Recursively makes all properties optional, including properties of nested objects.

```ts
interface User {
  id: number;
  profile: {
    name: string;
    address: {
      city: string;
      postalCode: string;
    };
  };
}

type UserUpdate = DeepPartial<User>;

const update: UserUpdate = {
  profile: {
    address: {
      city: "Brussels",
    },
  },
};
```

**Use case:** Useful for partial updates of deeply nested configuration objects, settings, or application state.

**Note:** This basic implementation recursively processes properties extending `object`, including arrays and functions. It may not preserve their original types in every case.

### `PartialExcept<T, K>`

Makes every property optional except the specified keys.

```ts
interface User {
  id: number;
  name: string;
  email: string;
}

type UserWithRequiredId = PartialExcept<User, "id">;

const user: UserWithRequiredId = {
  id: 1,
};
```

### `PickByValue<T, V>`

Selects properties whose value types extend `V`.

```ts
interface User {
  id: number;
  name: string;
  active: boolean;
}

type StringProperties = PickByValue<User, string>;

// { name: string }
```

### `OmitByValue<T, V>`

Removes properties whose value types extend `V`.

```ts
interface User {
  id: number;
  name: string;
  active: boolean;
}

type NonStringProperties = OmitByValue<User, string>;

// { id: number; active: boolean }
```

### `MapValues<T, V>`

Replaces every property value type with `V`.

```ts
interface User {
  id: number;
  name: string;
}

type UserFlags = MapValues<User, boolean>;

// { id: boolean; name: boolean }
```

### `OptionalNullable<T>`

Makes every property optional and allows its value to be `null`.

```ts
interface User {
  name: string;
  email: string;
}

type UserForm = OptionalNullable<User>;

const form: UserForm = {
  name: null,
};
```

### `PartialExceptByValue<T, V>`

Makes properties whose value types extend `V` required while leaving other properties optional.

```ts
interface User {
  id: number;
  name: string;
  active: boolean;
}

type UserInput = PartialExceptByValue<User, string>;

const input: UserInput = {
  name: "Yoni",
};
```

### `KeysOfType<T, V>`

Gets the keys whose value types extend `V`.

```ts
interface User {
  id: number;
  name: string;
  active: boolean;
}

type StringKeys = KeysOfType<User, string>;

// "name"
```

## Union utilities

### `UnionWithKey<T, K>`

Extracts union members containing a required property `K`.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number }
  | { name: string };

type ShapesWithKind = UnionWithKey<Shape, "kind">;
```

### `UnionWithoutKey<T, K>`

Extracts union members without a required property `K`.

```ts
type Shape = { kind: "circle"; radius: number } | { name: string };

type ShapesWithoutKind = UnionWithoutKey<Shape, "kind">;

// { name: string }
```

### `DiscriminantValues<T, K>`

Extracts possible values of a discriminant property.

```ts
type Shape =
  | { kind: "circle"; radius: number }
  | { kind: "square"; size: number };

type ShapeKind = DiscriminantValues<Shape, "kind">;

// "circle" | "square"
```

### `DiscriminatedUnion<K, M>`

Creates a discriminated union from a mapping of variant names to their properties.

```ts
type Events = DiscriminatedUnion<
  "type",
  {
    created: { id: number };
    deleted: { id: number; reason: string };
  }
>;

// { type: "created"; id: number }
// | { type: "deleted"; id: number; reason: string }
```

### `ExclusifyUnion<T>`

Makes union members mutually exclusive by preventing properties from other members from being supplied.

```ts
type Contact = { email: string } | { phone: string };

type ExclusiveContact = ExclusifyUnion<Contact>;

const contact: ExclusiveContact = {
  email: "yoni@example.com",
};

// Error: email and phone cannot be provided together.
// const invalid: ExclusiveContact = {
//   email: "yoni@example.com",
//   phone: "123456789",
// };
```

### `KeysOfUnion<T>`

Gets the keys from all members of a union.

```ts
type Shape = { radius: number } | { size: number };

type ShapeKeys = KeysOfUnion<Shape>;

// "radius" | "size"
```

## Function utilities

### `FirstArgument<T>`

Extracts the first argument type of a function.

```ts
type Handler = (id: number, name: string) => void;

type Id = FirstArgument<Handler>;

// number
```

### `SecondArgument<T>`

Extracts the second argument type of a function.

```ts
type Handler = (id: number, name: string) => void;

type Name = SecondArgument<Handler>;

// string
```

### `LastArgument<T>`

Extracts the last argument type of a function.

```ts
type Handler = (id: number, name: string, active: boolean) => void;

type Active = LastArgument<Handler>;

// boolean
```

### `DropFirstArgument<T>`

Removes the first argument from a function signature.

```ts
type Handler = (id: number, name: string) => boolean;

type HandlerWithoutId = DropFirstArgument<Handler>;

// (name: string) => boolean
```

### `OptionalArguments<T>`

Makes all function arguments optional.

```ts
type Handler = (id: number, name: string) => void;

type OptionalHandler = OptionalArguments<Handler>;

const handler: OptionalHandler = (id, name) => {
  console.log(id, name);
};

handler();
handler(1);
handler(1, "Yoni");
```

### `AsyncParameters<T>`

Extracts the parameter types of an async function that returns a `Promise`.

```ts
async function fetchUser(id: number, includePosts: boolean) {
  return { id, includePosts };
}

type FetchUserParameters = AsyncParameters<typeof fetchUser>;

// [id: number, includePosts: boolean]
```

### `ResolvedReturnType<T>`

Extracts the resolved return type of a promise-returning function.

```ts
async function fetchUser() {
  return {
    id: 1,
    name: "Yoni",
  };
}

type User = ResolvedReturnType<typeof fetchUser>;

// { id: number; name: string }
```

## Array and tuple utilities

### `First<T>`

Gets the first element type of a tuple.

```ts
type Values = [string, number, boolean];

type FirstValue = First<Values>;

// string
```

### `Last<T>`

Gets the last element type of a tuple.

```ts
type Values = [string, number, boolean];

type LastValue = Last<Values>;

// boolean
```

### `DropLast<T>`

Removes the last element from a tuple.

```ts
type Values = [string, number, boolean];

type Remaining = DropLast<Values>;

// [string, number]
```

### `DropFirst<T>`

Removes the first element from a tuple.

```ts
type Values = [string, number, boolean];

type Remaining = DropFirst<Values>;

// [number, boolean]
```

### `Concat<A, B>`

Concatenates two tuple types.

```ts
type A = [string, number];
type B = [boolean];

type Combined = Concat<A, B>;

// [string, number, boolean]
```

### `TupleOf<T, N>`

Creates a tuple containing `N` elements of type `T`.

```ts
type ThreeStrings = TupleOf<string, 3>;

// [string, string, string]
```

## String utilities

### `KebabCase<S>`

Converts a string literal type to kebab-case.

```ts
type PropertyName = KebabCase<"backgroundColor">;

// "background-color"
```

This is a basic implementation and may not handle every acronym or edge case.

### `Prefix<S, P>`

Adds a prefix to a string literal type.

```ts
type ApiRoute = Prefix<"/users", "/api">;

// "/api/users"
```

### `Suffix<S, P>`

Adds a suffix to a string literal type.

```ts
type TestFile = Suffix<"user", ".test.ts">;

// "user.test.ts"
```

### `Split<S, D>`

Splits a string literal type using a delimiter.

```ts
type Segments = Split<"users/admin/profile", "/">;

// ["users", "admin", "profile"]
```

### `Join<T, D>`

Joins a tuple of string literal types using a delimiter.

```ts
type Route = Join<["api", "users", "admin"], "/">;

// "api/users/admin"
```

### `IsLiteralString<T>`

Checks whether a string type is a specific string literal rather than the broad `string` type.

```ts
type A = IsLiteralString<"hello">;
// true

type B = IsLiteralString<string>;
// false
```

## API and application utilities

### `Result<T, E>`

Represents a successful or failed operation.

```ts
type UserResult = Result<{ id: number; name: string }, string>;

function handleResult(result: UserResult) {
  if (result.success) {
    console.log(result.data.name);
  } else {
    console.error(result.error);
  }
}
```

### `AsyncState<T, E>`

Represents the state of an asynchronous operation.

```ts
type UserState = AsyncState<{ id: number; name: string }>;

const state: UserState = {
  status: "success",
  data: {
    id: 1,
    name: "Yoni",
  },
};
```

### `Maybe<T>`

Represents a value that may be `null` or `undefined`.

```ts
type UserName = Maybe<string>;

const name: UserName = null;
const missingName: UserName = undefined;
```

### `NonEmptyArray<T>`

Represents an array that must contain at least one element.

```ts
const names: NonEmptyArray<string> = ["Yoni"];

// Error: at least one element is required.
// const emptyNames: NonEmptyArray<string> = [];
```

### `Brand<T, B>`

Creates a branded type to distinguish otherwise identical types.

```ts
type UserId = Brand<number, "UserId">;
type OrderId = Brand<number, "OrderId">;

const userId = 1 as UserId;
const orderId = 2 as OrderId;

function getUser(id: UserId) {
  return id;
}

getUser(userId);

// Error: OrderId is not assignable to UserId.
// getUser(orderId);
```

## Development

Install dependencies:

```bash
pnpm install
```

Run the TypeScript type check:

```bash
pnpm run typecheck
```

## License

MIT
