# Tooltip Local Point Refactoring

## Date: November 4, 2025

## Problem Statement

After abstracting the `localPoint` functionality from `@visx/event` into our own `getLocalPoint` utility to handle iframe contexts (WordPress editor), we discovered that tooltips broke in the editor. The root cause is that `instanceof` type guards fail across iframe boundaries, preventing proper element/event identification.

## Key Discovery

There are **two distinct use cases** for tooltip positioning in our charts:

### 1. Voronoi-Based Tooltips

**Charts**: Line, Scatter, StackedArea

**Characteristics**:

- Use voronoi diagrams to find the nearest data point
- Need coordinates relative to the entire SVG container
- Explicitly pass `svgRef.current` as the reference element
- Call signature: `getLocalPoint(svgRef.current, event)`

**Why it works in iframes**:

- We explicitly provide the SVG element reference (no type guard needed)
- The two-parameter signature bypasses problematic type guards

### 2. Shape-Based Tooltips

**Charts**: BarHorizontal, BarVertical, StackedBarHorizontal, StackedBarVertical, DivergingBarHorizontal, DivergingBarVertical, ExplodedBar, Pie, Maps (World, AlbersUSA, AlbersUSACounties, BlockUSA)

**Characteristics**:

- Tooltip positioning based on the specific shape being hovered
- Derive element from `event.currentTarget` (the hovered rect/circle/path)
- Call signature: `getLocalPoint(event)`

**Why it fails in iframes**:

- Relies on `isEvent()` type guard using `instanceof Event`
- `instanceof` checks fail across iframe boundaries
- Type guard returns false → element never extracted → returns null

## Proposed Solution

Split `getLocalPoint` into two specialized functions:

### Function 1: `getLocalPointForVoronoi`

```typescript
/**
 * Get local point coordinates for voronoi-based tooltips.
 * Used by charts that search for nearest data point (Line, Scatter, StackedArea).
 *
 * @param svgElement - The SVG container element
 * @param event - The mouse/touch event
 * @returns Point object with x, y coordinates, or null
 */
function getLocalPointForVoronoi(
	svgElement: Element,
	event: EventType
): Point | null;
```

**Implementation Notes**:

- No type guards needed (parameters are explicit)
- Try `localPoint(svgElement, event)` first
- Fallback to manual calculation using `getBoundingClientRect()`
- Works reliably in both standard and iframe contexts

### Function 2: `getLocalPointForShape`

```typescript
/**
 * Get local point coordinates for shape-based tooltips.
 * Used by charts that position tooltips on hovered shapes (Bars, Pie, Maps).
 *
 * @param event - The mouse/touch event
 * @returns Point object with x, y coordinates, or null
 */
function getLocalPointForShape(event: EventType): Point | null;
```

**Implementation Notes**:

- Extract element from `event.currentTarget` (not `event.target`)
- Avoid type guards; directly cast and validate
- Try `localPoint(element, event)` first
- Fallback to manual calculation using `getBoundingClientRect()`
- Handle React synthetic events appropriately

## Migration Plan

### Phase 1: Create New Functions

1. Add `getLocalPointForVoronoi` to `tooltips.ts`
2. Add `getLocalPointForShape` to `tooltips.ts`
3. Export both from `hooks/index.ts` and main `index.ts`
4. Keep old `getLocalPoint` temporarily for backwards compatibility

### Phase 2: Update Voronoi-Based Charts

Update these files to use `getLocalPointForVoronoi(svgRef.current, event)`:

- `plugins/prc-charting-library/src/lib/Components/Line.tsx`
- `plugins/prc-charting-library/src/lib/Components/Scatter.tsx`
- `plugins/prc-charting-library/src/lib/Components/StackedArea.tsx`

### Phase 3: Update Shape-Based Charts

Update these files to use `getLocalPointForShape(event)`:

- `plugins/prc-charting-library/src/lib/Components/BarHorizontal.tsx`
- `plugins/prc-charting-library/src/lib/Components/BarVertical.tsx`
- `plugins/prc-charting-library/src/lib/Components/StackedBarHorizontal.tsx`
- `plugins/prc-charting-library/src/lib/Components/StackedBarVertical.tsx`
- `plugins/prc-charting-library/src/lib/Components/DivergingBarHorizontal.tsx`
- `plugins/prc-charting-library/src/lib/Components/DivergingBarVertical.tsx`
- `plugins/prc-charting-library/src/lib/Components/ExplodedBar.tsx`
- `plugins/prc-charting-library/src/lib/Components/Pie.tsx`
- `plugins/prc-charting-library/src/lib/Components/maps/World.tsx`
- `plugins/prc-charting-library/src/lib/Components/maps/AlbersUSA.tsx`
- `plugins/prc-charting-library/src/lib/Components/maps/AlbersUSACounties.tsx`
- `plugins/prc-charting-library/src/lib/Components/maps/BlockUSA.tsx`

### Phase 4: Cleanup

1. Remove old `getLocalPoint` function
2. Remove unnecessary type guards (`isElement`, `isEvent`) if no longer used
3. Remove debug logging from production code
4. Update tests if applicable

## Technical Background

### Why `instanceof` Fails in Iframes

When JavaScript code runs inside an iframe, it has its own global context with its own `Element` and `Event` constructors. An element created in the iframe is an instance of the iframe's `Element` constructor, not the parent window's `Element` constructor.

```javascript
// In iframe context:
element instanceof Element; // false (comparing against parent window's Element)
element instanceof iframe.contentWindow.Element; // true

// In parent context:
element instanceof Element; // true
```

### Manual Coordinate Calculation

When `localPoint()` returns null, we calculate coordinates manually:

```javascript
const rect = element.getBoundingClientRect();
const x = event.clientX - rect.left;
const y = event.clientY - rect.top;
```

This works because:

- `getBoundingClientRect()` returns coordinates relative to the viewport
- `clientX/clientY` are also viewport-relative
- Subtraction gives us element-relative coordinates
- No `instanceof` checks needed

## Testing Checklist

After implementation, verify:

### Voronoi Charts (Line, Scatter, StackedArea)

- [ ] Tooltips appear on hover in standard browser context
- [ ] Tooltips appear on hover in WordPress editor (iframe)
- [ ] Tooltip positioning is accurate relative to data points
- [ ] Voronoi polygon detection works correctly

### Shape Charts (Bars, Pie, Maps)

- [ ] Tooltips appear on hover in standard browser context
- [ ] Tooltips appear on hover in WordPress editor (iframe)
- [ ] Tooltip positioning is accurate relative to hovered shape
- [ ] Multiple bars/shapes can be hovered independently

### Edge Cases

- [ ] Touch events work on mobile devices
- [ ] Tooltips work when chart is scrolled
- [ ] Tooltips work in nested iframes (if applicable)
- [ ] No console errors in either context

## References

- Original issue: Tooltips not appearing in WordPress editor
- visx `localPoint` source: https://github.com/airbnb/visx/blob/master/packages/visx-event/src/localPoint.ts
- visx type guards: https://github.com/airbnb/visx/blob/b7eb5c9a14f2dedbfa607708781071f943c013ec/packages/visx-event/src/typeGuards.ts

## Success Criteria

1. All tooltips work in both standard and iframe contexts
2. Code is more maintainable with clear separation of concerns
3. No performance regression
4. Type safety maintained
5. Debug logging removed from production code
