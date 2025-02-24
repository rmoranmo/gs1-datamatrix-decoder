# GS1 DataMatrix Decoder API

API REST para decodificar códigos GS1 DataMatrix.

## Características

- Decodifica códigos GS1 DataMatrix
- Soporta los siguientes identificadores de aplicación (AI):
  - 01: GTIN
  - 10: Número de lote
  - 17: Fecha de caducidad
  - 21: Número de serie
  - 71: NHRN - Spain CN
- Limpieza automática de caracteres no alfanuméricos
- API REST con endpoint POST

## Uso

```bash
curl -X POST \
  https://tu-api.onrender.com/api/decode \
  -H 'Content-Type: application/json' \
  -d '{"code": "01084700068195791024061172602282142E72S2H6F"}'
```

## Desarrollo local

1. Instalar dependencias:
   ```bash
   npm install
   ```

2. Iniciar servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. El servidor estará disponible en `http://localhost:3000`