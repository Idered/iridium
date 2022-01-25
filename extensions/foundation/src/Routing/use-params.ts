import { getContainer } from "inversify-props";

declare type PropMethod<T, TConstructor = any> = [T] extends [
  ((...args: any) => any) | undefined
]
  ? {
      new (): TConstructor;
      (): T;
      readonly prototype: TConstructor;
    }
  : never;

declare type PropConstructor<T = any> =
  | {
      new (...args: any[]): T & {};
    }
  | {
      (): T;
    }
  | PropMethod<T>;
declare type PropType<T> = PropConstructor<T> | PropConstructor<T>[];
declare type Prop<T> = PropType<T>;
declare type InferPropType<T> = [T] extends [null]
  ? any
  : [T] extends [ObjectConstructor]
  ? Record<string, any>
  : [T] extends [BooleanConstructor]
  ? boolean
  : [T] extends [DateConstructor]
  ? Date
  : [T] extends [Prop<infer V>]
  ? unknown extends V
    ? T
    : V
  : T;

type UnboxArray<T, R extends readonly any[] = []> = T extends readonly [
  infer Head,
  ...infer Tail
]
  ? UnboxArray<Tail, [...R, InferPropType<Head>]>
  : R;

export type CastDictionary<T> = {
  [K in keyof T]: T[K] extends readonly any[]
    ? UnboxArray<T[K]>
    : InferPropType<T[K]>;
};

function useInject<T>(id: string | symbol): [T] {
  return [getContainer().get<T>(id)];
}

export async function useParams<Props>(
  cast: Props
): Promise<CastDictionary<Props>> {
  const params = useInject<any>("Params")[0];
  const result: any = {};
  for (const paramName in cast) {
    const transform: any = cast[paramName];
    const value = params[paramName];
    if (typeof transform === "function") {
      result[paramName] = new transform(value).valueOf();
    } else if (Array.isArray(transform)) {
      result[paramName] = transform.map((p) => new p(value).valueOf());
    } else {
      result[paramName] = value;
    }
  }
  return result;
}
