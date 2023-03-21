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

const SortableItem = ({ id, e, data }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-2 py-2 bg-blue-200 grid grid-cols-2"
      {...attributes}
      {...listeners}
    >
      <span>{data[0].id === 1 ? e.title : e.desc}</span>
      <span>{data[1].id === 1 ? e.title : e.desc}</span>
    </div>
  );
};

const SortableNav = ({ id, title }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-2 py-2 bg-blue-200"
      {...attributes}
      {...listeners}
    >
      {title}
    </div>
  );
};


const SortableTable = ({
  id,
  title,
}) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="px-2 py-2 bg-blue-200"
      {...attributes}
      {...listeners}
    >
      <span>{title}</span>
    </div>
  );
};

export default function Home() {
  const [menu, setMenu] = useState([
    { id: 1, title: "Iphone 1", desc: "This is iphone 1" },
    { id: 2, title: "Iphone 2", desc: "And this is iphone 2" },
    { id: 3, title: "Iphone 3", desc: "For this is iphone 3" },
  ]);

  const [nav, setNav] = useState([
    { id: 1, title: "Product 1" },
    { id: 2, title: "Product 2" },
    { id: 3, title: "Product 3" },
  ]);
  const [head, setHead] = useState([
    { id: 1, title: "Title" },
    { id: 2, title: "Desc" },
  ]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event, fn) {
    const { active, over } = event;
    console.log(active)
    if (active.id !== over.id) {
      fn((items) => {
        const oldIndex = items.map((e) => e.id).indexOf(active.id);
        const newIndex = items.map((e) => e.id).indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  function handleDragCol(event, fn1) {
    const { active, over } = event;
    if (active.id !== over.id) {
      fn1((items) => {
        const oldIndex = items.map((e) => e.id).indexOf(active.id);
        const newIndex = items.map((e) => e.id).indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  console.log(head);

  return (
    <div className="flex w-full h-full">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(e) => handleDragEnd(e, setNav)}
      >
        <SortableContext items={nav} strategy={verticalListSortingStrategy}>
          <div className="flex flex-col gap-2 p-5 bg-slate-400">
            {nav?.map((e, i) => (
              <SortableNav key={i} id={e.id} title={e.title} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-col gap-2">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={(e) => handleDragCol(e, setHead)}
        >
          <SortableContext items={head} strategy={verticalListSortingStrategy}>
            <div className="grid grid-cols-2">
              {head?.map((e, i) => (
                <SortableTable
                  key={i}
                  id={e.id}
                  title={e.title}
                  menu={menu}
                  setMenu={setMenu}
                  sensors={sensors}
                  handleDragEnd={handleDragEnd}
                />
              ))}
            </div>
            <div className="flex flex-col gap-2">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={(e) => handleDragEnd(e, setMenu)}
              >
                <SortableContext
                  items={menu}
                  strategy={verticalListSortingStrategy}
                >
                  {menu.map((e, i) => (
                    <SortableItem key={i} id={e.id} data={head} e={e} />
                  ))}
                </SortableContext>
              </DndContext>
            </div>
          </SortableContext>
        </DndContext>
      </div>
    </div>
  );
}
