import * as vec3 from "./vec3.js";

export type Line = {
    from: vec3.Vec3;
    to: vec3.Vec3;
};

export const getLineDir = (line: Line): vec3.Vec3 => vec3.sub(line.to, line.from);
