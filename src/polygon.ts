import * as vec2 from "./vec2.js";
import * as vec3 from "./vec3.js";
import { isInFrontOfPlane, isPointAlmostOnPlane, type Plane } from "./plane.js";

export type Triangle = [vec3.Vec3, vec3.Vec3, vec3.Vec3];

export type Polygon = { points: vec3.Vec3[] };

export const almostEquals = (a: Polygon, b: Polygon): boolean => {
    if (a.points.length !== b.points.length) return false;
    if (a.points.length === 0) return true;
    return a.points.some((_, offset) =>
        a.points.every((p, i) => vec3.almostEquals(p, b.points[(offset + i) % b.points.length]!))
    );
};

export const planeToPolygon = (plane: Plane, points: vec3.Vec3[]): Polygon => {
    const pointsOnPlane = points.filter(p => isPointAlmostOnPlane(p, plane));
    const avgPoint = vec3.scale(
        pointsOnPlane.reduce((s, v) => vec3.add(s, v), [0, 0, 0]),
        1 / pointsOnPlane.length
    );
    const relativePoints = pointsOnPlane.map(p => vec3.sub(p, avgPoint));
    const axisOption1 = vec3.normalize(vec3.cross(plane.dir, [1, 0, 0]));
    const axisOption2 = vec3.normalize(vec3.cross(plane.dir, [0, 1, 0]));
    const x = vec3.length(axisOption1) > vec3.length(axisOption2) ? axisOption1 : axisOption2;
    const y = vec3.normalize(vec3.cross(plane.dir, x));
    const flatPoints = relativePoints.map((p): vec2.Vec2 => [vec3.dot(p, x), vec3.dot(p, y)]);
    flatPoints.sort((a, b) => Math.atan2(a[1], a[0]) - Math.atan2(b[1], b[0]));
    return {
        points: flatPoints.map(p => vec3.add(vec3.add(vec3.scale(x, p[0]), vec3.scale(y, p[1])), avgPoint))
    };
};

export const polygonToPlane = (polygon: Polygon): Plane => {
    const [p1, p2, p3] = polygon.points;
    if (p1 === undefined || p2 === undefined || p3 === undefined) throw new Error("polygon has fewer than 3 points");
    return {
        pos: p1,
        dir: vec3.cross(vec3.sub(p2, p1), vec3.sub(p3, p1))
    };
};

export const isInFrontOfPolygon = (point: vec3.Vec3, polygon: Polygon): boolean =>
    isInFrontOfPlane(point, polygonToPlane(polygon));

export const triangleToPolygon = (triangle: Triangle): Polygon => ({ points: triangle });

export const getPolygonsCommonLine = (a: Polygon, b: Polygon): [number, number] | undefined =>
    a.points.flatMap((_, i) =>
        b.points.flatMap((_, j): [number, number][] => {
            const lineA = [a.points[i], a.points[(i + 1) % a.points.length]];
            const lineB = [b.points[j], b.points[(j + 1) % b.points.length]];
            if (lineA[0] === lineB[1] && lineA[1] === lineB[0]) return [[i, j]];
            return [];
        })
    )[0];

export const getPolygonNormal = (p: Polygon): vec3.Vec3 => {
    return vec3.normalize(vec3.cross(vec3.sub(p.points[1]!, p.points[0]!), vec3.sub(p.points[2]!, p.points[0]!)));
};

export const canPolygonsBeMerged = (a: Polygon, b: Polygon): boolean => {
    if (getPolygonsCommonLine(a, b) === undefined) return false;
    return vec3.dirAlmostEquals(getPolygonNormal(a), getPolygonNormal(b));
};

export const mergePolygonsAtIndex = (a: Polygon, i: number, b: Polygon, j: number): Polygon => {
    return {
        points: [...a.points.slice(0, i), ...b.points.slice(j + 1), ...b.points.slice(0, j), ...a.points.slice(i + 1)]
    };
};

export const mergePolygons = (a: Polygon, b: Polygon): Polygon => {
    const indices = getPolygonsCommonLine(a, b);
    if (indices === undefined) throw new Error("Polygons can't be merged");
    return mergePolygonsAtIndex(a, indices[0], b, indices[1]);
};
