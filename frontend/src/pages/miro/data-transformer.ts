import { TLShape } from '@tldraw/tldraw';
import { ElementType } from '@prisma/client';
import { MiroElement, SyncElementDto } from '../../shared/types/miro';

// Mapping from our ElementType enum to tldraw's internal shape types.
// This might need to be adjusted based on the specific tldraw shapes you use.
const typeToTldraw: Record<ElementType, string> = {
  SHAPE: 'geo', // Using 'geo' for generic shapes
  TEXT: 'text',
  STICKY: 'sticky',
  IMAGE: 'image',
  FRAME: 'frame',
  EMBED: 'embed',
  LINE: 'line',
  ARROW: 'arrow',
  NOTE: 'note', // tldraw doesn't have a direct 'note' type, might need custom shape
  CARD: 'card', // Assuming you have a custom 'card' shape
  DRAW: 'draw',
};

// Reverse mapping from tldraw types to our ElementType enum.
const tldrawToType = (tldrawType: string): ElementType => {
  const entry = Object.entries(typeToTldraw).find(([, value]) => value === tldrawType);
  return (entry ? entry[0] : 'SHAPE') as ElementType;
};

/**
 * Converts a backend MiroElement to a tldraw TLShape.
 * @param element The element from our database.
 * @returns A tldraw shape object.
 */
export function elementToShape(element: MiroElement): TLShape {
  const { id, type, x, y, rotation, width, height, style, content } = element;

  // Most tldraw props are directly within the `props` object.
  // We'll merge style and content from our backend element into tldraw's props.
  const props = {
    ...(style as object),
    ...(content as object),
    w: width,
    h: height,
  };

  const shape: TLShape = {
    id,
    type: typeToTldraw[type] || 'geo', // Default to 'geo' if type is unknown
    x,
    y,
    rotation,
    props,
  };

  return shape;
}

/**
 * Converts a tldraw TLShape back to our backend's SyncElementDto format.
 * @param shape The tldraw shape object.
 * @param boardId The ID of the board this element belongs to.
 * @returns A DTO ready to be sent to the backend.
 */
export function shapeToElement(shape: TLShape, boardId: string): SyncElementDto {
  const { id, type, x, y, rotation, zIndex } = shape;
  const { w, h, ...props } = shape.props;

  // Here, you might want to separate what goes into `style` vs. `content`.
  // For now, we'll follow the old logic and put most of it in `style`.
  // A more robust solution would be to have a schema for each shape type.
  const style = { ...props };
  const content = {}; // e.g., for a text shape, you'd pull `text` from props into here.

  if ('text' in props) {
    content.text = props.text;
    delete style.text;
  }

  return {
    id,
    boardId,
    type: tldrawToType(type),
    x,
    y,
    width: w,
    height: h,
    rotation,
    zIndex: zIndex ?? 1,
    style,
    content,
  };
}
