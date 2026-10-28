declare global {
  // ─── Object utilities ─────────────────────────────────────

  /** Makes selected properties nullable */
  type NullableBy<T, K extends keyof T> = Omit<T, K> & {
    [P in K]: T[P] | null;
  };

  /** Makes selected properties readonly */
  type ImmutableBy<T, K extends keyof T> = Omit<T, K> & {
    readonly [P in K]: T[P];
  };

  /** Recursively makes all properties optional, including nested object properties */
  type DeepPartial<T> = {
    [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K];
  };

  /** Makes selected properties optional while keeping all other properties unchanged */
  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

  /** Makes every property optional except the specified keys */
  type PartialExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

  /** Selects properties whose values extend V */
  type PickByValue<T, V> = Pick<T, KeysOfType<T, V>>;

  /** Removes properties whose values extend V */
  type OmitByValue<T, V> = Omit<T, KeysOfType<T, V>>;

  /** Replaces all property values with V */
  type MapValues<T, V> = {
    [K in keyof T]: V;
  };

  /** Makes all properties optional and nullable */
  type OptionalNullable<T> = {
    [K in keyof T]?: T[K] | null;
  };

  /** Makes properties matching V required while leaving others optional */
  type PartialExceptByValue<T, V> = Partial<T> & Pick<T, KeysOfType<T, V>>;

  /** Gets keys whose values extend V */
  type KeysOfType<T, V> = {
    [K in keyof T]-?: T[K] extends V ? K : never;
  }[keyof T];

  // ─── Union utilities ──────────────────────────────────────

  /** Extracts union members containing a required property K */
  type UnionWithKey<T, K extends PropertyKey> =
    T extends Record<K, unknown> ? T : never;

  /** Extracts union members without a required property K */
  type UnionWithoutKey<T, K extends PropertyKey> =
    T extends Record<K, unknown> ? never : T;

  /** Extracts possible values of a discriminant property */
  type DiscriminantValues<T, K extends keyof T> =
    T extends Record<K, infer V> ? V : never;

  /** Creates a discriminated union from a mapping */
  type DiscriminatedUnion<
    K extends PropertyKey,
    M extends Record<PropertyKey, unknown>,
  > = {
    [P in keyof M]: { [Q in K]: P } & M[P];
  }[keyof M];

  /** Makes union members mutually exclusive */
  type ExclusifyUnion<T, All = T> = T extends unknown
    ? T & Partial<Record<Exclude<KeysOfUnion<All>, keyof T>, never>>
    : never;

  /** Gets keys across all members of a union */
  type KeysOfUnion<T> = T extends T ? keyof T : never;

  // ─── Function utilities ───────────────────────────────────

  /** Extracts the first argument type */
  type FirstArgument<T extends (...args: any[]) => any> =
    Parameters<T> extends [infer A, ...any[]] ? A : never;

  /** Extracts the second argument type */
  type SecondArgument<T extends (...args: any[]) => any> =
    Parameters<T> extends [any, infer B, ...any[]] ? B : never;

  /** Extracts the last argument type */
  type LastArgument<T extends (...args: any[]) => any> =
    Parameters<T> extends [...any[], infer L] ? L : never;

  /** Removes the first argument from a function signature */
  type DropFirstArgument<T extends (...args: any[]) => any> =
    Parameters<T> extends [any, ...infer Rest]
      ? (...args: Rest) => ReturnType<T>
      : never;

  /** Makes all function arguments optional */
  type OptionalArguments<T extends (...args: any[]) => any> = (
    ...args: Partial<Parameters<T>>
  ) => ReturnType<T>;

  /** Extracts the parameters of an async function */
  type AsyncParameters<T extends (...args: any[]) => Promise<any>> =
    Parameters<T>;

  /** Extracts the resolved return type of a promise-returning function */
  type ResolvedReturnType<T extends (...args: any[]) => any> = Awaited<
    ReturnType<T>
  >;

  // ─── Array and tuple utilities ────────────────────────────

  /** Gets the first element type of a tuple */
  type First<T extends readonly unknown[]> = T extends readonly [
    infer F,
    ...unknown[],
  ]
    ? F
    : never;

  /** Gets the last element type of a tuple */
  type Last<T extends readonly unknown[]> = T extends readonly [
    ...unknown[],
    infer L,
  ]
    ? L
    : never;

  /** Removes the last element from a tuple */
  type DropLast<T extends readonly unknown[]> = T extends readonly [
    ...infer Rest,
    unknown,
  ]
    ? Rest
    : [];

  /** Removes the first element from a tuple */
  type DropFirst<T extends readonly unknown[]> = T extends readonly [
    unknown,
    ...infer Rest,
  ]
    ? Rest
    : [];

  /** Concatenates two tuple types */
  type Concat<A extends readonly unknown[], B extends readonly unknown[]> = [
    ...A,
    ...B,
  ];

  /** Creates a tuple with a fixed length */
  type TupleOf<T, N extends number, R extends T[] = []> = R["length"] extends N
    ? R
    : TupleOf<T, N, [...R, T]>;

  // ─── String utilities ─────────────────────────────────────

  /** Converts a string literal to kebab-case (basic implementation) */
  type KebabCase<S extends string> = S extends `${infer F}${infer R}`
    ? R extends Uncapitalize<R>
      ? `${Lowercase<F>}${KebabCase<R>}`
      : `${Lowercase<F>}-${KebabCase<R>}`
    : S;

  /** Adds a prefix to a string literal */
  type Prefix<S extends string, P extends string> = `${P}${S}`;

  /** Adds a suffix to a string literal */
  type Suffix<S extends string, P extends string> = `${S}${P}`;

  /** Splits a string literal by a delimiter */
  type Split<S extends string, D extends string> = string extends S
    ? string[]
    : S extends ""
      ? []
      : S extends `${infer Head}${D}${infer Tail}`
        ? [Head, ...Split<Tail, D>]
        : [S];

  /** Joins a tuple of strings using a delimiter */
  type Join<
    T extends readonly string[],
    D extends string,
  > = T extends readonly []
    ? ""
    : T extends readonly [infer F extends string]
      ? F
      : T extends readonly [infer F extends string, ...infer R extends string[]]
        ? `${F}${D}${Join<R, D>}`
        : string;

  /** Checks whether a string is a literal type rather than broad string */
  type IsLiteralString<T extends string> = string extends T ? false : true;

  // ─── API and application utilities ────────────────────────

  /** Represents a successful or failed operation */
  type Result<T, E = Error> =
    | { success: true; data: T }
    | { success: false; error: E };

  /** Represents an asynchronous operation's state */
  type AsyncState<T, E = Error> =
    | { status: "idle" }
    | { status: "loading" }
    | { status: "success"; data: T }
    | { status: "error"; error: E };

  /** Represents a value that may be null or undefined */
  type Maybe<T> = T | null | undefined;

  /** Represents a non-empty array */
  type NonEmptyArray<T> = [T, ...T[]];

  /** Creates a branded type to distinguish otherwise identical types */
  type Brand<T, B extends string> = T & {
    readonly __brand: B;
  };
}

export {};
