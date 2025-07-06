
import React, { useState, useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as htmlToImage from 'html-to-image';
import buttonData from './buttonData.json';

function DraggableButton({ id, src, name }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '48px',
    height: '48px',
    cursor: 'grab'
  };

  return (
    <img
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      src={src}
      alt={name}
      style={style}
    />
  );
}

export default function App() {
  const [skillName, setSkillName] = useState('Custom Skill');
  const [previewIcons, setPreviewIcons] = useState([]);
  const ref = useRef(null);

  const sanitizeId = (str) => str.toLowerCase().replace(/[^a-z0-9-_]/g, '-');
  const formatName = (filename) => filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').toUpperCase();

  const psButtons = buttonData.filter(btn => btn.src.includes('/ps/'));
  const xboxButtons = buttonData.filter(btn => btn.src.includes('/xbox/'));

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current);
    const link = document.createElement('a');
    link.download = `${skillName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleButtonClick = (btn) => {
    const id = `${sanitizeId(btn.name)}-${Date.now()}`;
    setPreviewIcons([...previewIcons, { ...btn, id }]);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = previewIcons.findIndex(item => item.id === active.id);
      const newIndex = previewIcons.findIndex(item => item.id === over?.id);
      setPreviewIcons(arrayMove(previewIcons, oldIndex, newIndex));
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">FC 25 Skill Composer (dnd-kit)</h1>
      <input
        type="text"
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
        placeholder="Enter Skill Name"
        className="mb-4 w-full p-2 rounded text-black"
      />

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">🎮 PS5 Buttons</h2>
          <div className="bg-white p-4 rounded flex flex-wrap gap-2">
            {psButtons.map((btn) => (
              <img
                key={btn.name}
                src={btn.src}
                alt={btn.name}
                className="w-12 h-12 cursor-pointer"
                onClick={() => handleButtonClick(btn)}
              />
            ))}
          </div>

          <h2 className="text-lg font-semibold mt-6 mb-2">🟩 Xbox Buttons</h2>
          <div className="bg-white p-4 rounded flex flex-wrap gap-2">
            {xboxButtons.map((btn) => (
              <img
                key={btn.name}
                src={btn.src}
                alt={btn.name}
                className="w-12 h-12 cursor-pointer"
                onClick={() => handleButtonClick(btn)}
              />
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">🧩 Preview & Arrange</h2>
          <div className="bg-white p-4 rounded min-h-[72px] flex flex-wrap gap-2 items-center">
            <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={previewIcons.map(icon => icon.id)} strategy={verticalListSortingStrategy}>
                {previewIcons.map((icon) => (
                  <DraggableButton key={icon.id} id={icon.id} src={icon.src} name={icon.name} />
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>

      <div ref={ref} className="bg-white text-black mt-6 p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">{skillName}</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          {previewIcons.map((icon, index) => (
            <img key={index} src={icon.src} alt={icon.name} className="w-10 h-10" />
          ))}
        </div>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={handleDownload}
          className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
        >
          Download PNG
        </button>
      </div>
    </div>
  );
}
