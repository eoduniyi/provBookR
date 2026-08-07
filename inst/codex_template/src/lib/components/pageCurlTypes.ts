/** Concrete sweep direction passed to the shader */
export type SweepDirection =
  | "right-to-left"
  | "left-to-right"
  | "corner-br"
  | "corner-bl"
  | "corner-tl";

/** User-facing sweep style — direction is derived from next/prev */
export type SweepStyle = "horizontal" | "corner";

/** Given a style and whether we're going forward or back, return the concrete sweep direction */
export function resolveSweep(
  style: SweepStyle,
  dir: "next" | "prev",
): SweepDirection {
  if (style === "horizontal") {
    return dir === "next" ? "right-to-left" : "left-to-right";
  } else {
    return dir === "next" ? "corner-br" : "corner-tl";
  }
}
