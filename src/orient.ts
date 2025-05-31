import { vec3 } from "@peulicke/geometry";

export type Orient = {
    v: vec3.Vec3;
    w: number;
};

export const identity = (): Orient => ({ v: [0, 0, 0], w: 1 });

export const fromAxisAngle = (axis: vec3.Vec3, angle: number): Orient => {
    const normAxis = vec3.normalize(axis);
    const halfAngle = angle / 2;
    return {
        v: vec3.scale(normAxis, Math.sin(halfAngle)),
        w: Math.cos(halfAngle)
    };
};

const multiply = (a: Orient, b: Orient): Orient => {
    const { v: v1, w: w1 } = a;
    const { v: v2, w: w2 } = b;
    return {
        v: vec3.add(vec3.add(vec3.scale(v1, w2), vec3.scale(v2, w1)), vec3.cross(v1, v2)),
        w: w1 * w2 - vec3.dot(v1, v2)
    };
};

const multiplyMany = (o: Orient[]): Orient => o.reduce((s, v) => multiply(s, v), identity());

export const combine = (o: Orient[]): Orient => multiplyMany([...o].reverse());

export const inverse = (o: Orient): Orient => ({ v: vec3.scale(o.v, -1), w: o.w });

export const rotate = (q: Orient, axis: vec3.Vec3, angle: number): Orient => combine([q, fromAxisAngle(axis, angle)]);

export const rotateVec3 = (q: Orient, v: vec3.Vec3): vec3.Vec3 => {
    const uv = vec3.scale(vec3.cross(q.v, v), 2 * q.w);
    const uuv = vec3.scale(vec3.cross(q.v, vec3.cross(q.v, v)), 2);
    return vec3.add(vec3.add(v, uv), uuv);
};
