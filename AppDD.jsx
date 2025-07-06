
import React, { useState, useRef } from 'react';
import * as htmlToImage from 'html-to-image';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import buttonData from './buttonData.json';

export default function App() {
  const [skillName, setSkillName] = useState('Custom Skill');
  const [selectedIcons, setSelectedIcons] = useState([]);
  const ref = useRef(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current);
    const link = document.createElement('a');
    link.download = `${skillName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const sanitizeId = (str) =>
    str.toLowerCase().replace(/[^a-z0-9-_]/g, '-');

  const onDragEnd = (result) => {
    if (!result.destination) return;

    if (result.source.droppableId === 'buttons' && result.destination.droppableId === 'preview') {
      const item = buttonData.find(btn => sanitizeId(btn.name) === result.draggableId);
      const uniqueId = sanitizeId(\`\${item.name}-\${Date.now()}\`);
      setSelectedIcons([...selectedIcons, { ...item, id: uniqueId }]);
    } else if (result.source.droppableId === 'preview' && result.destination.droppableId === 'preview') {
      const reordered = Array.from(selectedIcons);
      const [moved] = reordered.splice(result.source.index, 1);
      reordered.splice(result.destination.index, 0, moved);
      setSelectedIcons(reordered);
    }
  };

  const formatName = (filename) => {
    return filename.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, '').toUpperCase();
  };

  const psButtons = buttonData.filter(btn => btn.src.includes('/ps/'));
  const xboxButtons = buttonData.filter(btn => btn.src.includes('/xbox/'));

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">FC 25 Skill Composer</h1>

      <input
        type="text"
        value={skillName}
        onChange={(e) => setSkillName(e.target.value)}
        placeholder="Enter Skill Name"
        className="mb-6 w-full p-2 rounded text-black"
      />

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <h2 className="text-lg font-semibold mb-2">🎮 Drag PS5 Buttons</h2>
            <Droppable droppableId="buttons" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-white p-4 rounded flex flex-wrap gap-2">
                  {psButtons.map((btn, index) => {
                    const id = sanitizeId(btn.name);
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <img
                            src={btn.src}
                            alt={formatName(btn.name)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-12 h-12 cursor-pointer"
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>

            <h2 className="text-lg font-semibold my-4">🟩 Drag Xbox Buttons</h2>
            <Droppable droppableId="buttons" direction="horizontal">
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps} className="bg-white p-4 rounded flex flex-wrap gap-2">
                  {xboxButtons.map((btn, index) => {
                    const id = sanitizeId(btn.name);
                    return (
                      <Draggable key={id} draggableId={id} index={index}>
                        {(provided) => (
                          <img
                            src={btn.src}
                            alt={formatName(btn.name)}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="w-12 h-12 cursor-pointer"
                          />
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-2">🧩 Drop Icons Below to Compose</h2>
            <Droppable droppableId="preview" direction="horizontal">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white p-4 rounded min-h-[72px] flex flex-wrap gap-2 items-center justify-start"
                >
                  {selectedIcons.map((icon, index) => (
                    <Draggable key={icon.id} draggableId={icon.id} index={index}>
                      {(provided) => (
                        <img
                          src={icon.src}
                          alt={icon.name}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="w-12 h-12"
                        />
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>

      <div ref={ref} className="bg-white text-black mt-6 p-6 rounded shadow text-center">
        <h2 className="text-xl font-bold mb-2">{skillName}</h2>
        <div className="flex gap-4 justify-center flex-wrap">
          {selectedIcons.map((icon, index) => (
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
