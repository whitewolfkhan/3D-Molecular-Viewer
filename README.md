# 3D Molecular Structure Viewer

An interactive web application for visualizing and exploring molecular structures in stunning 3D. Built with modern web technologies for chemistry students, educators, researchers, and science enthusiasts.

![Molecular Viewer](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-0.182-black?style=flat-square&logo=three.js)
![License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

---

## What This App Does

Ever struggled to understand how atoms bond together? Or wished you could rotate a molecule to see it from every angle? This app lets you do exactly that.

**3D Molecular Viewer** renders accurate molecular structures that you can:

- Rotate, zoom, and pan in real-time 3D
- Switch between ball-and-stick and space-filling visualization modes
- Click on atoms to learn about their properties
- Export high-quality screenshots for presentations or reports

Whether you're studying for a chemistry exam, preparing a lecture, or just curious about the building blocks of matter, this tool makes molecular structures come alive.

---

## Features

### Interactive 3D Visualization

- **Real-time rendering** with Three.js and WebGL
- **Smooth controls** - orbit, zoom, and pan with mouse or touch
- **Auto-rotation** to see molecules from all angles
- **Two visualization modes**:
  - _Ball-and-Stick_: Shows atoms as spheres and bonds as cylinders
  - _Space-Filling_: Shows the relative sizes of atoms

### Extensive Molecule Library

Over 50 molecules across 11 categories:

| Category           | Examples                           |
| ------------------ | ---------------------------------- |
| **Organic**        | Methane, Ethanol, Benzene, Acetone |
| **Inorganic**      | Water, CO₂, Ammonia, Ozone         |
| **Biochemical**    | Glucose, Sucrose, Urea, Caffeine   |
| **Pharmaceutical** | Aspirin, Paracetamol, Ibuprofen    |
| **Acids**          | HCl, H₂SO₄, HNO₃, Acetic Acid      |
| **Bases**          | NaOH, KOH, Ca(OH)₂, NH₄OH          |
| **Salts**          | NaCl, KCl, CaCO₃, Baking Soda      |
| **Solvents**       | Acetone, Hexane, Chloroform        |
| **Fuels**          | Octane, Isooctane, Propane         |
| **Oxidizers**      | KNO₃, KMnO₄                        |
| **Polymers**       | Ethylene Glycol, Styrene           |


### Screenshots
<img width="1366" height="728" alt="Screenshot (247)" src="https://github.com/user-attachments/assets/016b7133-c6b5-41a4-b393-e5a6f122fc09" />
<img width="1366" height="731" alt="Screenshot (246)" src="https://github.com/user-attachments/assets/fb70722b-2b6f-4fb5-b22e-b55ee3494e23" />


### Detailed Information Panels

Click on any atom or molecule to see:

- Element name and atomic number
- Atomic mass and radius
- Physical properties (melting point, boiling point, density)
- Polarity and solubility
- Real-world applications
- Safety hazards

### Professional UX

- **Responsive design** - works on desktop, tablet, and mobile
- **Dark mode** optimized for long study sessions
- **Fullscreen mode** for presentations
- **Screenshot export** for documentation

---

## Quick Start

### Prerequisites

Make sure you have [Node.js 18+](https://nodejs.org/) and [Bun](https://bun.sh/) installed.

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd molecular-viewer

# Install dependencies
bun install

# Start the development server
bun run dev
```

Open your browser and navigate to `http://localhost:3000`. You should see the 3D Molecular Viewer ready to explore!

### Build for Production

```bash
bun run build
bun start
```

---

## Tech Stack

| Technology             | Purpose                             |
| ---------------------- | ----------------------------------- |
| **Next.js 16**         | React framework with App Router     |
| **TypeScript**         | Type-safe development               |
| **Three.js**           | 3D graphics rendering               |
| **@react-three/fiber** | React renderer for Three.js         |
| **@react-three/drei**  | Useful helpers for Three.js         |
| **Zustand**            | Lightweight state management        |
| **Tailwind CSS**       | Utility-first styling               |
| **shadcn/ui**          | Beautiful, accessible UI components |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx              # Main application page
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
│
├── components/
│   ├── molecule/
│   │   ├── MoleculeViewer.tsx    # 3D rendering component
│   │   ├── MoleculeSelector.tsx  # Search & filter UI
│   │   ├── ControlPanel.tsx      # Visualization controls
│   │   └── InfoPanel.tsx         # Molecule information
│   └── ui/                       # shadcn/ui components
│
└── lib/
    └── molecules/
        ├── molecules-db.ts       # Molecule data & types
        └── store.ts              # Zustand state store
```

---

## How It Works

### Molecule Data Structure

Each molecule is defined with:

```typescript
interface ExtendedMolecule {
  id: string;
  name: string;
  formula: string;
  atoms: Atom[];      // 3D positions and element types
  bonds: Bond[];      // Connections between atoms
  category: string;   // organic, inorganic, etc.
  properties: {...};  // Physical and chemical data
}
```

### 3D Rendering

The `MoleculeViewer` component uses Three.js to:

1. Create spheres for each atom with accurate colors and sizes
2. Draw cylinders between bonded atoms
3. Handle mouse interactions (hover, click)
4. Manage camera controls and lighting

### State Management

Zustand manages the application state:

- Current molecule selection
- Visualization settings (mode, rotation, labels)
- UI state (theme, fullscreen)
- Search and filter queries

---

## Contributing

Found a bug or want to add more molecules? Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Adding New Molecules

Edit `src/lib/molecules/molecules-db.ts` and add your molecule following the existing structure. Include:

- Accurate 3D atomic positions
- Bond connections
- Physical properties from reliable sources

---

## Learning Resources

- [Three.js Documentation](https://threejs.org/docs/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [Chemistry Data Sources](https://pubchem.ncbi.nlm.nih.gov/)

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Acknowledgments

- Element colors based on CPK coloring convention
- Molecular geometry data from PubChem and NIST databases
- UI components from shadcn/ui

---

**Built with ❤️ for chemistry education and exploration.**
