import React, { useState, useRef } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as htmlToImage from 'html-to-image';
import buttonData from './buttonData.json';

function DraggableButton({ id, src, name, label, fontSize, color, onLabelChange, onFontSizeChange, onColorChange, onDelete }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    width: '80px',
    height: '130px',
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
      <button onClick={() => onDelete(id)} className="text-xs text-red-600 mt-1">❌</button>
    </div>
  );
}

export default function App() {
  const [skillName, setSkillName] = useState('Custom Skill');
  const [previewIcons, setPreviewIcons] = useState([]);
  const [skillFont, setSkillFont] = useState('Phosphate');
  const [skillFontSize, setSkillFontSize] = useState(24);
  const [skillColor, setSkillColor] = useState('#000000');
  const [skillShadow, setSkillShadow] = useState(true);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [lineGap, setLineGap] = useState(0);
  const [containerWidth, setContainerWidth] = useState(15); // in percentage


  const ref = useRef(null);

  const handleDownload = async () => {
    if (!ref.current) return;
    const dataUrl = await htmlToImage.toPng(ref.current, {
      pixelRatio: 3,
      backgroundColor: 'transparent'
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

  const handleAddSpace = () => {
    const id = `space-${Date.now()}`;
    setPreviewIcons([...previewIcons, { id, isSpace: true }]);
  };

  const updateIconField = (id, field, value) => {
    setPreviewIcons(prev =>
      prev.map(icon => icon.id === id ? { ...icon, [field]: value } : icon)
    );
  };

  const handleClearAll = () => setPreviewIcons([]);

  const handleDelete = (id) => {
    setPreviewIcons(prev => prev.filter(icon => icon.id !== id));
  };

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
              <option value="Phosphate">Phosphate</option>
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

          <div>
            <label className="block text-sm mb-1">Background Color</label>
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-8 w-12"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Export Width (%)</label>
            <input
              type="range"
              min="20"
              max="100"
              step="1"
              value={containerWidth}
              onChange={(e) => setContainerWidth(Number(e.target.value))}
              className="w-24"
            />
            <div className="text-xs mt-1">{containerWidth}%</div>
          </div>

          <div>
            <label className="block text-sm mb-1">Line Gap (px)</label>
            <input
              type="number"
              value={lineGap}
              onChange={(e) => setLineGap(Number(e.target.value))}
              className="text-black p-1 rounded w-20"
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

      {renderButtonGroup('PlayStation', 'ps')}
      {renderButtonGroup('Xbox', 'xbox')}
      {renderButtonGroup('Icons', 'icons')}

      <div className="mb-4 flex gap-4 flex-wrap">
        <button onClick={handleClearAll} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-sm">Clear All</button>
        <button onClick={handleAddNewLine} className="bg-yellow-600 hover:bg-yellow-700 px-4 py-2 rounded text-sm">Add New Line</button>
        <button onClick={handleAddSpace} className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded text-sm">Add Space</button>
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
              ) : icon.isSpace ? (
                <div key={icon.id} className="w-10"></div>
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
                  onDelete={handleDelete}
                />
              )
            )}
          </SortableContext>
        </DndContext>
      </div>


      <div ref={ref} className="mt-6 text-center">
        <div
          style={{
            backgroundColor: bgColor,
            display: 'inline-block',
            borderRadius: '0.2rem',
            margin: 'auto auto',
            // padding: '12px 16px',  // Increased padding
            maxWidth: '100%',
            boxSizing: 'border-box',
            minHeight: 'fit-content',
            width: `${containerWidth}%`,
            marginBottom: '25px',
          }}
        >



          <div
            style={{
              // paddingTop: '4px',
              // paddingBottom: '4px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <h2
              style={{
                fontFamily: skillFont,
                fontSize: `${skillFontSize}px`,
                color: skillColor,
                textShadow: skillShadow ? '2px 2px 4px rgba(0,0,0,0.4)' : 'none',
                margin: 0,
                padding: 0
              }}
            >
              {skillName}
            </h2>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                rowGap: `${lineGap}px`,
                columnGap: '4px',
                margin: 0,
                padding: 0,
              }}
            >
              {previewIcons.map((icon, index) =>
                icon.isLineBreak ? (
                  <div key={index} style={{ width: '100%', height: '1px' }} />
                ) : icon.isSpace ? (
                  <div key={index} style={{ width: '10px' }} />
                ) : (
                  <div key={index} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <img src={icon.src} alt={icon.name} style={{ width: '40px', height: '40px', display: 'block' }} />
                    {icon.label && (
                      <span
                        style={{
                          fontSize: `${icon.fontSize}px`,
                          color: icon.color,
                          lineHeight: 1,
                          marginTop: '2px',
                        }}
                      >
                        {icon.label}
                      </span>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
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
