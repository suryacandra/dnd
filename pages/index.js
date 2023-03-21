import { useState, useEffect } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

const SortableItem = ({ id, title, desc }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="col-span-2 grid grid-cols-2 gap-5" {...attributes} {...listeners}>
        <div className="bg-blue-300 p-3 rounded">{title}</div>
        <div className="bg-blue-300 p-3 rounded">{desc}</div>
    </div>
  );
};

export default function Home() {
  const [menu, setMenu] = useState([{id: 1, title: 'Iphone 1', desc: 'Hp iphone 1'}, {id: 2, title: 'Iphone 2', desc: 'Hp iphone 2'}, {id: 3, title: 'Iphone 3', desc: 'Hp iphone 3'}]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (active.id !== over.id) {
      setMenu((items) => {
        const oldIndex = items.map(e => e.id).indexOf(active.id);
        const newIndex = items.map(e => e.id).indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <div className="flex w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={menu} strategy={verticalListSortingStrategy}>
          <div className="grid grid-cols-2 p-3 gap-5 w-full">
            <span className="bg-slate-500 rounded px-2 py-1">Title</span>
            <span className="bg-slate-500 rounded px-2 py-1">Desc</span>
            {menu?.map((e, i) => (
              <SortableItem key={i} id={e.id} title={e.title} desc={e.desc} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
      <div className="w-full p-5 text-white">
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Eveniet,
        saepe.
      </div>
    </div>
  );
}
