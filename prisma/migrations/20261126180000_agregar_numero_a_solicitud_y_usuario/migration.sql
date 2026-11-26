-- Agrega un número identificador autogenerado a las solicitudes y a los usuarios (clientes incluidos).
-- No reemplaza al UUID: es un dato extra, único y más fácil de leer y de citar.
-- Los registros que ya existían reciben su número en orden de creación (el más viejo, el 1).

-- Solicitud
CREATE SEQUENCE "Solicitud_numero_seq";
ALTER TABLE "Solicitud" ADD COLUMN "numero" INTEGER;
UPDATE "Solicitud" AS s
SET "numero" = t."n"
FROM (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "fechaCreacion", "id") AS "n"
  FROM "Solicitud"
) AS t
WHERE s."id" = t."id";
SELECT setval('"Solicitud_numero_seq"', COALESCE((SELECT MAX("numero") FROM "Solicitud"), 0) + 1, false);
ALTER TABLE "Solicitud" ALTER COLUMN "numero" SET DEFAULT nextval('"Solicitud_numero_seq"');
ALTER TABLE "Solicitud" ALTER COLUMN "numero" SET NOT NULL;
ALTER SEQUENCE "Solicitud_numero_seq" OWNED BY "Solicitud"."numero";
CREATE UNIQUE INDEX "Solicitud_numero_key" ON "Solicitud"("numero");

-- Usuario
CREATE SEQUENCE "Usuario_numero_seq";
ALTER TABLE "Usuario" ADD COLUMN "numero" INTEGER;
UPDATE "Usuario" AS u
SET "numero" = t."n"
FROM (
  SELECT "id", ROW_NUMBER() OVER (ORDER BY "fechaRegistro", "id") AS "n"
  FROM "Usuario"
) AS t
WHERE u."id" = t."id";
SELECT setval('"Usuario_numero_seq"', COALESCE((SELECT MAX("numero") FROM "Usuario"), 0) + 1, false);
ALTER TABLE "Usuario" ALTER COLUMN "numero" SET DEFAULT nextval('"Usuario_numero_seq"');
ALTER TABLE "Usuario" ALTER COLUMN "numero" SET NOT NULL;
ALTER SEQUENCE "Usuario_numero_seq" OWNED BY "Usuario"."numero";
CREATE UNIQUE INDEX "Usuario_numero_key" ON "Usuario"("numero");
