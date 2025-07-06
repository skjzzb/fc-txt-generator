import React, { useState, useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as htmlToImage from 'html-to-image';
import buttonData from './buttonData.json';

function DraggableButton({ id, src, name, label, fontSize, color, onLabelChange, onFontSizeChange, onColorChange }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '80px',
    height: '110px',
    cursor: 'grab',
    textAlign: 'center'
  };

  return (
    <div ref={setNodeRef} {...attributes} {...listeners} style={style}>
      <img src={src} alt={name} className="w-12 h-12 mx-auto" />
      <input
        value={label}
        onChange={(e) => onLabelChange(id, e.target.value)}
        placeholder="Text"
        className="w-full text-xs text-center mt-1 px-1 py-0.5 rounded bg-gray-200 text-black"
      />
      <input
        type="number"
        min="8"
        max="20"
        value={fontSize}
        onChange={(e) => onFontSizeChange(id, e.target.value)}
        className="text-xs w-full mt-1 px-1"
        placeholder="Font size"
      />
      <input
        type="color"
        value={color}
        onChange={(e) => onColorChange(id, e.target.value)}
        className="w-full h-6 mt-1"
      />
    </div>
  );
}

export default function App() {
  const [skillName, setSkillName] = useState('Custom Skill');
  const [previewIcons, setPreviewIcons] = useState([]);
  const ref = useRef(null);
  const [skillFont, setSkillFont] = useState('Roboto');
  const [skillFontSize, setSkillFontSize] = useState(24);
  const [skillColor, setSkillColor] = useState('#000000');
  const [skillShadow, setSkillShadow] = useState(true);


  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current, {
      pixelRatio: 3,
      backgroundColor: 'white'
    });
    const link = document.createElement('a');
    link.download = `${skillName.replace(/\s+/g, '_')}.png`;
    link.href = dataUrl;
    link.click();
  };

  const handleIconAdd = (btn) => {
    const id = `${btn.name}-${Date.now()}`;
    setPreviewIcons([...previewIcons, {
      id,
      name: btn.name,
      src: btn.src,
      label: '',
      fontSize: 12,
      color: '#000000'
    }]);
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => {
        const id = `${file.name}-${Date.now()}`;
        setPreviewIcons([...previewIcons, {
          id,
          name: file.name,
          src: reader.result,
          label: '',
          fontSize: 12,
          color: '#000000'
        }]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddNewLine = () => {
    const id = `newline-${Date.now()}`;
    setPreviewIcons([...previewIcons, { id, isLineBreak: true }]);
  };

  const updateIconField = (id, field, value) => {
    setPreviewIcons(prev =>
      prev.map(icon => icon.id === id ? { ...icon, [field]: value } : icon)
    );
  };

  const handleClearAll = () => setPreviewIcons([]);

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      const oldIndex = previewIcons.findIndex(item => item.id === active.id);
      const newIndex = previewIcons.findIndex(item => item.id === over?.id);
      setPreviewIcons(arrayMove(previewIcons, oldIndex, newIndex));
    }
  };

  const renderButtonGroup = (platformName, platformKey) => {
    const filtered = buttonData.filter(btn => btn.platform === platformKey);
    return (
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">{platformName} Buttons</h2>
        <div className="flex flex-wrap gap-2 bg-white p-3 rounded">
          {filtered.map(btn => (
            <img
              key={btn.id}
              src={btn.src}
              alt={btn.name}
              title={btn.name}
              onClick={() => handleIconAdd(btn)}
              className="w-10 h-10 cursor-pointer hover:scale-110 transition"
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">FC 25 Skill Composer (Pro)</h1>
      <div className="bg-gray-800 p-4 rounded mb-4">
        <input
          type="text"
          value={skillName}
          onChange={(e) => setSkillName(e.target.value)}
          placeholder="Enter Skill Name"
          className="mb-2 w-full p-2 rounded text-black"
        />

        <div className="flex flex-wrap gap-4">
          <div>
            <label className="block text-sm mb-1">Font Family</label>
            <select
              value={skillFont}
              onChange={(e) => setSkillFont(e.target.value)}
              className="text-black p-1 rounded"
            >
              <option value="Roboto">Roboto</option>
              <option value="Montserrat">Montserrat</option>
              <option value="Arial">Arial</option>
              <option value="Poppins">Poppins</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>

          <div>
            <label className="block text-sm mb-1">Font Size</label>
            <input
              type="range"
              min="14"
              max="60"
              value={skillFontSize}
              onChange={(e) => setSkillFontSize(e.target.value)}
              className="w-24"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Color</label>
            <input
              type="color"
              value={skillColor}
              onChange={(e) => setSkillColor(e.target.value)}
              className="h-8 w-12"
            />
          </div>

          <div className="flex items-center">
            <label className="text-sm mr-2">Shadow</label>
            <input
              type="checkbox"
              checked={skillShadow}
              onChange={(e) => setSkillShadow(e.target.checked)}
            />
          </div>
        </div>
      </div>


      {/* Buttons Section */}
      {renderButtonGroup('PlayStation', 'ps')}
      {renderButtonGroup('Xbox', 'xbox')}
      {renderButtonGroup('Icons', 'icons')}

      <div className="mb-4 flex gap-4 flex-wrap">
        <button onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Clear All</button>
        <button onClick={handleAddNewLine} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm">Add New Line</button>
        <label className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-sm cursor-pointer">
          Upload SVG
          <input type="file" accept=".svg" onChange={handleUpload} hidden />
        </label>
      </div>

      <div className="bg-white text-black p-4 rounded min-h-[200px] flex flex-wrap gap-4">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={previewIcons.map(icon => icon.id)} strategy={verticalListSortingStrategy}>
            {previewIcons.map((icon) =>
              icon.isLineBreak ? (
                <div key={icon.id} className="w-full border-t border-gray-300 my-2"></div>
              ) : (
                <DraggableButton
                  key={icon.id}
                  id={icon.id}
                  src={icon.src}
                  name={icon.name}
                  label={icon.label}
                  fontSize={icon.fontSize}
                  color={icon.color}
                  onLabelChange={(id, val) => updateIconField(id, 'label', val)}
                  onFontSizeChange={(id, val) => updateIconField(id, 'fontSize', val)}
                  onColorChange={(id, val) => updateIconField(id, 'color', val)}
                />
              )
            )}
          </SortableContext>
        </DndContext>
      </div>

      {/* Downloadable Output Preview */}
      <div ref={ref} className="bg-white text-black mt-6 p-6 rounded shadow text-center">
        <h2
          className="mb-4"
          style={{
            fontFamily: skillFont,
            fontSize: `${skillFontSize}px`,
            color: skillColor,
            textShadow: skillShadow ? '2px 2px 4px rgba(0,0,0,0.4)' : 'none'
          }}
        >
          {skillName}
        </h2>

        <div className="flex flex-wrap justify-center gap-2">
          {previewIcons.map((icon, index) =>
            icon.isLineBreak ? (
              <div key={index} className="w-full h-1"></div>
            ) : (
              <div key={index} className="flex flex-col items-center">
                <img src={icon.src} alt={icon.name} className="w-10 h-10" />
                {icon.label && (
                  <span
                    className="text-xs"
                    style={{ fontSize: `${icon.fontSize}px`, color: icon.color }}
                  >
                    {icon.label}
                  </span>
                )}
              </div>
            )
          )}
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
