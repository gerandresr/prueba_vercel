# Trading Desk Dashboard

MVP de dashboard para resultados, posiciones y límites de una mesa de dinero.

## Ejecutar localmente

```bash
npm install
npm run dev
```

Luego abre `http://localhost:3000`.

## Publicar gratis en Vercel

1. Crea un repositorio nuevo en GitHub.
2. Sube el contenido de esta carpeta.
3. En Vercel elige **Add New > Project**.
4. Importa el repositorio.
5. Vercel detectará Next.js automáticamente; presiona **Deploy**.

## Cambiar los datos

Los datos demo están en `lib/data.ts`. Puedes reemplazarlos por tus datos reales sin tocar la estructura visual.

## Próximos pasos posibles

- Importación de Excel/CSV.
- Login y permisos por usuario.
- Supabase/Postgres.
- Conexión con APIs internas.
- Más métricas de riesgo: VaR, CS01, key-rate DV01, FX delta, contraparte, XVA.
- Exportación de reportes.
