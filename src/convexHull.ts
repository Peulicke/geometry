import ch from "convex-hull";
import * as vec3 from "./vec3.js";
import { type Polygon } from "./polygon.js";

export const pointsToConvexHull = (allPoints: vec3.Vec3[]): Polygon[] => {
    return ch(allPoints).map(indices => ({ points: indices.map(i => allPoints[i]!) }));
};
