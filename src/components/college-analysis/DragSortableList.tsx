import React from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { Badge } from "@/components/ui/badge";
import { X, GripVertical } from "lucide-react";

interface DragSortableListProps {
  items: string[];
  onReorder: (newOrder: string[]) => void;
  onRemove: (item: string) => void;
  placeholder?: string;
}

export const DragSortableList: React.FC<DragSortableListProps> = ({
  items,
  onReorder,
  onRemove,
  placeholder = "No items selected"
}) => {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) {
      return;
    }

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);

    onReorder(newItems);
  };

  if (items.length === 0) {
    return (
      <div className="text-gray-500 text-sm p-3 border border-dashed border-gray-300 rounded-md">
        {placeholder}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="sortable-list">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {items.map((item, index) => (
              <Draggable key={item} draggableId={item} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={`flex items-center gap-2 p-2 bg-white border border-gray-200 rounded-md ${
                      snapshot.isDragging ? 'shadow-lg bg-blue-50' : ''
                    }`}
                  >
                    <div
                      {...provided.dragHandleProps}
                      className="cursor-grab text-gray-400 hover:text-gray-600"
                    >
                      <GripVertical className="h-4 w-4" />
                    </div>
                    <Badge variant="secondary" className="flex-1 justify-between px-3 py-1">
                      <span className="text-gray-700">{item}</span>
                      <span className="text-xs text-gray-500 ml-2">#{index + 1}</span>
                    </Badge>
                    <button
                      type="button"
                      onClick={() => onRemove(item)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};