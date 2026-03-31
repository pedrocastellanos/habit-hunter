# 🎮 Habit Hunter – Transforma Tus Tareas en Aventuras

<div align="center">

![Habit Hunter](https://img.shields.io/badge/Habit-Hunter-blueviolet?style=for-the-badge)
![React](https://img.shields.io/badge/React-19.2.4-61dafb?style=for-the-badge&logo=react)
![Three.js](https://img.shields.io/badge/Three.js-3D-black?style=for-the-badge&logo=three.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=for-the-badge&logo=typescript)
![Vite](https://img.shields.io/badge/Vite-Built%20With-646cff?style=for-the-badge&logo=vite)

**Un juego inmersivo en 3D que convierte la gestión de hábitos y tareas en una experiencia épica de combate digital.**

[🎮 Demo](https://hackaton.pedrocastellanos.me) • [🚀 Inicio Rápido](#-inicio-rápido) • [📖 Guía Completa](#-guía-completa)

<img width="1866" height="849" alt="image" src="https://github.com/user-attachments/assets/debde8c2-a65d-4e81-a752-ed43757829ed" />


</div>

---

## 🌌 Descripción General

**Habit Hunter** es una aplicación web que transforma la productividad en aventura. En lugar de ver tus tareas pendientes como una lista aburrida, las experimentarás como **enemigos digitales corruptos** que debes derrotar en un **arena futurista en 3D**.

El concepto es simple pero poderoso:
- 📋 **Tus tareas diarias** = Anomalías digitales que invaden tu sistema
- 👾 **Tus enemigos** = Obstáculos reales que se interponen en tu camino hacia el éxito
- ⚔️ **Combatir enemigos** = Completar y conquistar tus objetivos
- 🏆 **Ganar experiencia** = Sentir progreso real en tu vida

### 💾 Persistencia de Datos

Habit Hunter no usa base de datos.
Toda la información del usuario (tareas, progreso, personaje y equipamiento) se guarda únicamente en el `localStorage` del navegador.

---

## 🎯 Concepto de Gameplay

### 🌍 El Mundo: Arena Futurista

Te encuentras en una **arena digital futurista**, una simulación que representa tu mente digital. El entorno está lleno de:

- ⚡ **Grid luminoso** con colores neón (azul eléctrico, morado, verde)
- 🟣 **Paneles holográficos** flotantes
- 📡 **Torres de datos** interactivas
- ✨ **Partículas de energía** que fluyen constantemente
- 🌌 **Iluminación ambiental oscura** con efecto cyberpunk

### 👾 Los Enemigos: Tus Obstáculos Reales

Cada enemigo que ves en pantalla **representa un obstáculo real** que se interpone en tu progreso diario:

| Obstáculo Real                               | Enemy Digital            | Dificultad |
| -------------------------------------------- | ------------------------ | ---------- |
| Tareas simples (beber agua, hacer ejercicio) | **Partícula Flotante** 🟢 | Fácil      |
| Tareas importantes (estudiar, trabajar)      | **Cubo Corrupto** 🟡      | Media      |
| Tareas críticas (proyecto importante)        | **Entidad Glitch** 🔴     | Difícil    |

### ⚔️ Sistema de Combate

1. **Crear Tarea**: Añade una nueva tarea → Aparece un enemigo en la arena
2. **Equipar Habilidades**: Selecciona poder-ups y mejoras
3. **Combatir**: Enfréntate al enemigo y defiéndete de sus ataques
4. **Completar Tarea**: Derrotalo y consigue experiencia y recompensas
5. **Evolucionar**: Mejora tu personaje con cada victoria

---

## ✨ Características Principales

### 🎮 Gameplay

- ✅ **Arena 3D inmersiva** con física realista (Rapier3D)
- ✅ **Sistema de enemigos dinámicos** basados en tareas reales
- ✅ **Combate en tiempo real** con mecánicas de colisión
- ✅ **Sistema de experiencia y progresión** RPG-style
- ✅ **Equipamiento y mejoras** (armas, armaduras, items)

### 👤 Personaje

- ✅ **Selección de personaje** personalizado
- ✅ **Sistema de habilidades** que mejoran con la experiencia
- ✅ **Inventario de equipamiento** intuitivo
- ✅ **Estadísticas ajustables** basadas en equipo

### 📊 Gestión de Tareas

- ✅ **Crear, editar y completar tareas** desde la interfaz
- ✅ **Diferentes categorías** de tareas
- ✅ **Prioridades de dificultad** que se reflejan en el gameplay
- ✅ **Barra de progreso** visual en tiempo real

### 🌍 Interfaz

- ✅ **Minimap del arena** para orientarse
- ✅ **UI Overlay** integrado con el 3D
- ✅ **Selector de idiomas** (i18n)

### 🔊 Experiencia Sensorial

- ✅ **Efectos de sonido** inmersivos
- ✅ **Animaciones suaves** con GSAP y Framer Motion
- ✅ **Efectos visuales** de partículas y glow
- ✅ **Popups de XP** cuando completas tareas

---

## 🚀 Inicio Rápido

### Requisitos Previos

- **Node.js** v18+ o superior
- **pnpm** (recomendado) o npm
- Git

### Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/pedrocastellanos/habit-hunter.git
cd habit-hunter

# Instalar dependencias
pnpm install

# Iniciar servidor de desarrollo
pnpm dev

# La aplicación abrirá en http://localhost:5173
```

### Scripts Disponibles

```bash
# Desarrollo
pnpm dev              # Inicia servidor de desarrollo con HMR

# Producción
pnpm build           # Compila para producción (TypeScript + Vite)
pnpm preview         # Previsualiza build de producción
pnpm build           # Compilar para producción

# Calidad de Código
pnpm lint            # Verifica ESLint
pnpm test            # Ejecuta tests con Vitest
pnpm test:ui         # Tests con interfaz visual
pnpm test:coverage   # Genera reporte de cobertura
pnpm test:run        # Ejecuta tests una sola vez
```

---

## 📖 Guía Completa

### 🎮 Cómo Jugar

#### 1. **Selecciona tu Personaje**

- Accede a la página "Personaje"
- Elige tu avatar y personaliza su apariencia
- Cada personaje tiene estadísticas iniciales únicas

#### 2. **Crea tu Primera Tarea**

- Ve a "Tareas"
- Añade una nueva tarea (ej: "Estudiar 1 hora")
- Define la dificultad (Fácil, Media, Difícil)
- ¡Automáticamente aparecerá un enemigo en la arena!

#### 3. **Entra en Combate**

- Accede a la "Arena"
- Tu personaje aparecerá en el centro
- Los enemigos te atacarán basados en tus tareas pendientes

#### 4. **Completa Tareas = Derrota Enemigos**

- Completa la tarea asociada al enemigo
- El enemigo desaparece y ganas experiencia
- Tu personaje evoluciona con cada victoria

#### 5. **Equípate para Mejorar**

- Accede a "Personaje" → "Equipamiento"
- Equipa armas, armaduras y accesorios
- Mejora tus estadísticas: ATK, DEF, HP, SPD

### 🎨 Elementos Visuales

#### Arena 3D

- **Suelo**: Grid luminoso azul neón
- **Cielo**: Degradado oscuro con partículas de datos
- **Iluminación**: Ambiental + Luces puntuales neón
- **Cámara**: Vista isométrica dinámica

#### Personaje

- **Modelo 3D**: Humanoides animados
- **Equipamiento**: Visible en el personaje
- **Efectos**: Glow, auras de energía

#### Enemigos

- **Fácil (🟢)**: Pequeñas partículas flotantes
- **Media (🟡)**: Cubos pulsantes corruptos
- **Difícil (🔴)**: Entidades glitch distorsionadas

#### UI

- **HUD Principal**: Barra de vida, mana, experiencia
- **Minimap**: Ubicación de enemigos en tiempo real
- **Overlay**: Botones de acción, inventario

### 📊 Sistema de Progresión

**Experiencia (XP)**

- Completa una tarea fácil: +50 XP
- Completa una tarea media: +150 XP
- Completa una tarea difícil: +300 XP
- Cada nivel requiere 1000 XP

**Leveling**

- Nivel 1-10: Constructor (construcción de habilidades)
- Nivel 11-30: Guerrero (especialización en combate)
- Nivel 31+: Legendario (poder máximo)

**Equipamiento**

- **Armas**: Incrementan ATK
- **Armaduras**: Incrementan DEF
- **Accesorios**: Bonificaciones especiales
- **Rareza**: Normal → Raro → Épico → Legendario

### 🌐 Soporte Multiidioma

El juego soporta múltiples idiomas:

- 🇪🇸 Español
- 🇬🇧 Inglés

Cambia de idioma con el selector en la navegación.

---

## ☁️ Despliegue en Producción

Este proyecto fue desplegado en un VPS creado con Cubepath, utilizando Dokploy.

---

## 🧪 Testing

```bash
# Ejecutar tests
pnpm test

# Con UI interactiva
pnpm test:ui

# Cobertura de código
pnpm test:coverage

# Tests despecíficos
pnpm test -- --grep "Arena"
```

**Tests Implementados:**

- ✅ GameContext tests
- ✅ Equipment system tests
- ✅ Arena collision tests
- ✅ i18n integration tests
- ✅ Component unit tests

---
