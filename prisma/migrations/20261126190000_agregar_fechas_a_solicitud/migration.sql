-- AlterTable
ALTER TABLE "Solicitud" ADD COLUMN     "fechaAceptacion" TIMESTAMP(3),
ADD COLUMN     "fechaFinalizacion" TIMESTAMP(3);

-- Completa las solicitudes que ya existían, para que no queden en NULL.
-- Se usa fechaActualizacion como aproximación, porque es la última vez que cambió el estado.
UPDATE "Solicitud" SET "fechaAceptacion" = "fechaActualizacion" WHERE "estado" = 'ACEPTADA';
UPDATE "Solicitud" SET "fechaFinalizacion" = "fechaActualizacion" WHERE "estado" = 'FINALIZADA';
