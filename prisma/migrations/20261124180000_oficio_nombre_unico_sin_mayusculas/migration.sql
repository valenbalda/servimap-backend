-- Evita oficios repetidos que solo se diferencian en mayúsculas o minúsculas
-- (por ejemplo "Plomería", "plomería" y "PLOMERÍA").
--
-- Si ya hay oficios duplicados, la creación del índice falla. Antes de aplicarla, revisar con:
--   SELECT LOWER("nombre") AS nombre, COUNT(*) FROM "Oficio" GROUP BY 1 HAVING COUNT(*) > 1;
-- y unificar o renombrar los duplicados.
CREATE UNIQUE INDEX "Oficio_nombre_lower_key" ON "Oficio" (LOWER("nombre"));
