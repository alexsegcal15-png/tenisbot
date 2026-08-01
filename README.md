# ITF Scout — Despliegue en Replit (Gratis)

Aplicación para identificar partidos ITF femeninos con alta probabilidad de resultado desequilibrado (16 juegos o menos).

## Requisitos

- Cuenta en [Replit](https://replit.com) (plan Starter gratis)
- API key de Google AI Studio (gratis)

## Paso 1: Conseguir la API key de Gemini (gratis)

1. Ve a https://aistudio.google.com/apikey
2. Inicia sesión con tu cuenta de Google
3. Pulsa "Create API Key"
4. Copia la API key que aparece

## Paso 2: Subir el proyecto a Replit

**Opción A — Desde GitHub (recomendada):**
1. Sube todos los archivos de esta carpeta a un repositorio de GitHub
2. En Replit: "Create Repl" → "Import from GitHub"
3. Pega la URL del repositorio

**Opción B — Crear Repl vacío y subir archivos:**
1. En Replit: "Create Repl" → Plantilla "Node.js"
2. Sube todos los archivos de esta carpeta al repl (arrastra los archivos a la sección "Files")

## Paso 3: Configurar las variables de entorno

1. En Replit, ve a la pestaña "Tools" → "Secrets" (el icono del candado)
2. Añade estos dos secrets:
   - **GEMINI_API_KEY** → pega aquí la API key del Paso 1
   - **ACCESS_PASSWORD** → `BotTenis123` (o la contraseña que quieras)

## Paso 4: Ejecutar

1. Pulsa el botón "Run" en Replit
2. La consola mostrará: `ITF Scout running on http://localhost:3000`
3. Abre la URL que aparece en la vista previa de Replit
4. Introduce la contraseña y entra

## Estructura del proyecto

```
├── server/
│   ├── index.js       → Servidor Express (API + frontend)
│   └── gemini.js      → Llamadas a la API de Gemini con búsqueda web
├── src/
│   ├── api/client.js  → Cliente fetch para llamar al backend
│   ├── lib/
│   │   ├── itfApi.js          → Funciones de búsqueda (torneos, partidos, análisis)
│   │   └── analysisEngine.js → Motor de puntuación y predicción
│   ├── pages/         → Pantallas (Access, Dashboard)
│   └── components/    → Componentes UI
├── package.json
└── .replit
```

## Notas importantes

- **Replit Starter (gratis) duerme tras 5 minutos sin actividad.** La primera vez que entres tardará ~30 segundos en arrancar. Si necesitas que esté siempre activo, necesitarías Replit Core ($20/mes).
- **La API de Gemini tiene una capa gratis generosa** (15 peticiones por minuto, 1500 al día). Para uso personal está más que suficiente.
- **La contraseña** se verifica contra la variable de entorno `ACCESS_PASSWORD`. Si la cambias en los Secrets de Replit, la nueva contraseña funcionará automáticamente.
- **No se necesita base de datos externa.** Los datos se buscan en tiempo real cada vez que analizas partidos.
