import type { Vec2 } from "./vec2.js";

export type Field<T> = Map<number, Map<number, T>>;

export const createField = <T>(): Field<T> => new Map();

export const getFieldValue = <T>(field: Field<T>, pos: Vec2, getDefaultValue: () => T): T =>
    field.get(pos[0])?.get(pos[1]) ?? getDefaultValue();

export const setFieldValue = <T>(field: Field<T>, pos: Vec2, value: T): void => {
    const row = field.get(pos[0]);
    if (row === undefined) field.set(pos[0], new Map());
    field.get(pos[0])?.set(pos[1], value);
};

export const getAllDefinedPlaces = <T>(field: Field<T>): { pos: Vec2; value: T }[] =>
    [...field.entries()].flatMap(([x, row]) =>
        [...row.entries()].map(([y, value]): { pos: Vec2; value: T } => ({ pos: [x, y], value }))
    );
