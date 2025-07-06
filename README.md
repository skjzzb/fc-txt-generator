# 🎮 FC 25 Skill Composer Pro

A sleek web app to **compose, customize, and download** high-resolution button combos used in **FC 25**. Supports both **PlayStation** and **Xbox** styles with complete drag-and-drop interface and export options.

![App Preview](preview.png)

---

## ✨ Features

- 🟦 Drag & Drop button icons (PS5 & Xbox)
- 🎨 Add labels below icons (like "Hold", "Tap")
- 🔡 Customize font, size, color, and shadow
- 🧹 Clear All / 🆕 Add Line breaks
- 📤 Upload your own SVGs
- 📸 Download high-res PNG output

---

## 🚀 Getting Started

### 🔧 Installation
```bash
git clone https://github.com/your-username/fc25-skill-composer.git
cd fc25-skill-composer
npm install
npm run dev
```

---

## 🗂 Folder Structure

```
public/
  └── assets/
      ├── ps/      # All PlayStation icons (SVG)
      └── xbox/    # All Xbox icons (SVG)

src/
  └── App.jsx      # Main application
  └── buttonData.json (optional)
```

---

## 🧩 Sample buttonData.json

```json
[
  {
    "id": "ps-circle",
    "name": "Circle",
    "src": "/assets/ps/outline-red-circle.svg"
  },
  {
    "id": "ps-triangle",
    "name": "Triangle",
    "src": "/assets/ps/outline-green-triangle.svg"
  },
  {
    "id": "xbox-a",
    "name": "A Button",
    "src": "/assets/xbox/a-filled-green.svg"
  },
  {
    "id": "xbox-x",
    "name": "X Button",
    "src": "/assets/xbox/x-filled-blue.svg"
  }
]
```

---

## 🛠 Tech Stack

- ⚛️ React + Vite
- 🧩 @dnd-kit for drag & drop
- 📷 html-to-image for export
- Tailwind CSS for styling

---

## 📌 Usage

1. Select icons by dragging from the gallery.
2. Add custom labels, adjust text size/color.
3. Add line breaks if needed.
4. Click "Download PNG" to save your combo.

---

## 🧪 Development Tips

- You can preload buttons via `buttonData.json`.
- SVGs must reside in `/public/assets/ps/` or `/xbox/` or uploaded manually.
- Ensure SVGs are optimized (small file size, no fill rules breaking visuals).

---

## 📜 License

MIT License — free to use, improve, and customize.