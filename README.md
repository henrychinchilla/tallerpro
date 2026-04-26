# Taller Pro – Control de Taller

Sistema web tipo PWA para la gestión de un taller automotriz:

- Órdenes de trabajo
- Clientes y vehículos
- Inventario de repuestos
- Reportes operativos y financieros

## Características

- Interfaz web responsiva
- Estructura modular por secciones
- Preparado para funcionar como PWA (instalable)
- Arquitectura lista para integrar backend (Supabase / API REST)

## Arquitectura propuesta

- **Frontend:** HTML + CSS + JS (PWA estática, desplegada en Vercel)
- **Backend (sugerido):**
  - Supabase (PostgreSQL + Auth + APIs)  
  - o Node.js + Express/NestJS con API REST
- **Módulos funcionales:**
  - Órdenes de trabajo
  - Clientes
  - Inventario
  - Reportes
  - Configuración

## Estructura del proyecto

```text
/
├─ index.html          # Shell principal de la aplicación
├─ manifest.json       # Configuración PWA
├─ service-worker.js   # Cache y modo offline
├─ vercel.json         # Configuración de despliegue en Vercel
└─ icons/              # Íconos para PWA
