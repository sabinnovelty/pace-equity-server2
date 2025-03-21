type DTO = Record<string, any>;
type LiteralType = string | number | boolean | bigint | Date;

/**
 * Defines the type of interface passed which covers all it's attributes
 * Also, it handles the nested objects and arrays' attributes.
 *
 * Example:
 *    Let's say we have an interface or type as,
 *      MyInterface {
 *         b: string,
 *         c: Date,
 *         d: [
 *              {
 *                e: boolean
 *              }
 *            ],
 *          f: {
 *               g: number
 *             }
 *      }
 *
 *  Thus, the type of 'MyInterface' shall be ['b', 'c', 'd', 'd[].e', 'f', 'f.g']
 */
type GetDirtyDTOKeys<O extends DTO> = {
  [K in keyof O]-?: NonNullable<O[K]> extends Array<infer A>
    ? NonNullable<A> extends LiteralType
      ? K
      : K extends string
        ? GetDirtyDTOKeys<NonNullable<A>> extends infer NK
          ? NK extends string
            ? `${K}[].${NK}`
            : never
          : never
        : never
    : NonNullable<O[K]> extends LiteralType
      ? K
      : K extends string
        ? GetDirtyDTOKeys<NonNullable<O[K]>> extends infer NK
          ? NK extends string
            ? `${K}.${NK}`
            : never
          : never
        : never;
}[keyof O];

type AllDTOKeys = string | number | symbol;
type TrashDTOKeys = `${string}.undefined` | number | symbol;
type ExcludeTrashDTOKeys<O extends AllDTOKeys> = O extends TrashDTOKeys ? never : O;

export type GetDTOKeys<O extends DTO> = ExcludeTrashDTOKeys<GetDirtyDTOKeys<O>>;
