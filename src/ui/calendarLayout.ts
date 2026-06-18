/** Fixed 7-column calendar grid — cells do not shrink below this width. */
export const CALENDAR_GRID_CLASS = "grid grid-cols-[repeat(7,7.5rem)] gap-2";

/** Exact width of the 7-column grid (7 × 7.5rem + 6 × gap-2). */
export const CALENDAR_BLOCK_CLASS = "mx-auto w-[calc(7*7.5rem+6*0.5rem)]";

/** Horizontal scroll when the grid is wider than the viewport; block stays centered when it fits. */
export const CALENDAR_SCROLL_CLASS = "mx-auto max-w-full overflow-x-auto pb-1";
