import ch from "convex-hull";
import * as vec3 from "./vec3.js";
import { canPolygonsBeMerged, mergePolygons, triangleToPolygon, type Polygon, type Triangle } from "./polygon.js";

export const pointsToConvexHullTriangles = (allPoints: vec3.Vec3[]): Triangle[] => {
    return ch(allPoints).map(
        (indices): Triangle => [allPoints[indices[0]]!, allPoints[indices[1]]!, allPoints[indices[2]]!]
    );
};

export const pointsToConvexHull = (allPoints: vec3.Vec3[]): Polygon[] => {
    const polygons = pointsToConvexHullTriangles(allPoints).map(triangleToPolygon);
    for (let i = 0; i < polygons.length; ++i) {
        for (let j = i + 1; j < polygons.length; ++j) {
            const a = polygons[i]!;
            const b = polygons[j]!;
            if (!canPolygonsBeMerged(a, b)) continue;
            polygons[i] = mergePolygons(a, b);
            polygons.splice(j, 1);
            --j;
        }
    }
    return polygons;
};
