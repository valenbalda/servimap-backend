-- CreateEnum
CREATE TYPE "Rol" AS ENUM ('CLIENTE', 'PRESTADOR', 'ADMINISTRADOR');

-- CreateEnum
CREATE TYPE "EstadoSolicitud" AS ENUM ('PENDIENTE', 'ACEPTADA', 'RECHAZADA', 'CANCELADA', 'FINALIZADA');

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "rol" "Rol" NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "fechaRegistro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "latitudReferencia" DECIMAL(9,6),
    "longitudReferencia" DECIMAL(9,6),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Prestador" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "descripcionProfesional" TEXT,
    "fotoPerfil" TEXT,
    "zonaCobertura" TEXT,
    "latitud" DECIMAL(9,6),
    "longitud" DECIMAL(9,6),
    "precioMin" DECIMAL(10,2),
    "precioMax" DECIMAL(10,2),
    "telefono" TEXT,
    "whatsapp" TEXT,
    "emailContacto" TEXT,
    "disponible" BOOLEAN NOT NULL DEFAULT true,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Prestador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Oficio" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "categoria" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Oficio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PrestadorOficio" (
    "prestadorId" TEXT NOT NULL,
    "oficioId" TEXT NOT NULL,

    CONSTRAINT "PrestadorOficio_pkey" PRIMARY KEY ("prestadorId","oficioId")
);

-- CreateTable
CREATE TABLE "Solicitud" (
    "id" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "direccion" TEXT,
    "contactoPreferido" TEXT,
    "estado" "EstadoSolicitud" NOT NULL DEFAULT 'PENDIENTE',
    "fechaCreacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaActualizacion" TIMESTAMP(3) NOT NULL,
    "clienteId" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,
    "oficioId" TEXT NOT NULL,

    CONSTRAINT "Solicitud_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Calificacion" (
    "id" TEXT NOT NULL,
    "puntaje" INTEGER NOT NULL,
    "comentario" TEXT,
    "fechaPublicacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "moderada" BOOLEAN NOT NULL DEFAULT false,
    "fechaModeracion" TIMESTAMP(3),
    "motivoModeracion" TEXT,
    "solicitudId" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "prestadorId" TEXT NOT NULL,

    CONSTRAINT "Calificacion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Prestador_usuarioId_key" ON "Prestador"("usuarioId");

-- CreateIndex
CREATE UNIQUE INDEX "Oficio_nombre_key" ON "Oficio"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Calificacion_solicitudId_key" ON "Calificacion"("solicitudId");

-- AddForeignKey
ALTER TABLE "Prestador" ADD CONSTRAINT "Prestador_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorOficio" ADD CONSTRAINT "PrestadorOficio_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PrestadorOficio" ADD CONSTRAINT "PrestadorOficio_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "Oficio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solicitud" ADD CONSTRAINT "Solicitud_oficioId_fkey" FOREIGN KEY ("oficioId") REFERENCES "Oficio"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "Solicitud"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Calificacion" ADD CONSTRAINT "Calificacion_prestadorId_fkey" FOREIGN KEY ("prestadorId") REFERENCES "Prestador"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
