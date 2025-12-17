-- TABLA: roles
CREATE TABLE roles (
    id_rol SERIAL PRIMARY KEY,
    nombre character varying(255) NOT NULL
);

-- TABLA: sectores
CREATE TABLE sectores (
    id_sector SERIAL PRIMARY KEY,
    nombre character varying(255) NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- TABLA: motivos
CREATE TABLE motivos (
    id_motivo SERIAL PRIMARY KEY,
    nombre character varying(255) NOT NULL,
    estado boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- TABLA: obra_sociales
CREATE TABLE obra_sociales (
    id_obra_social SERIAL PRIMARY KEY,
    nombre character varying(255) NOT NULL,
    cuit bigint NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN obra_sociales.estado IS '1:activo, 2:inactivo';

-- TABLA: personas
CREATE TABLE personas (
    id_persona SERIAL PRIMARY KEY,
    dni integer UNIQUE,
    nombre character varying(255) NOT NULL,
    apellido character varying(255) NOT NULL,
    f_nacimiento date NOT NULL,
    genero character varying(255) NOT NULL,
    telefono bigint,
    mail character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN personas.genero IS 'Femenino, Masculino, Otro';

-- TABLA: pacientes
CREATE TABLE pacientes (
    id_paciente SERIAL PRIMARY KEY,
    id_persona integer NOT NULL UNIQUE REFERENCES personas(id_persona),
    contacto bigint,
    direccion character varying(255) NOT NULL,
    id_obra_social integer NOT NULL REFERENCES obra_sociales(id_obra_social),
    cod_os integer UNIQUE,
    detalle character varying(255),
    estado boolean DEFAULT true NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN pacientes.estado IS '1:activo, 2:no activo';

-- TABLA: empleados
CREATE TABLE empleados (
    id_empleado SERIAL PRIMARY KEY,
    id_persona integer NOT NULL UNIQUE REFERENCES personas(id_persona),
    id_rol integer NOT NULL REFERENCES roles(id_rol),
    fecha_ingreso date NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN empleados.estado IS '1: activo, 2: inactivo, 3:suspendido';

-- TABLA: medicos
CREATE TABLE medicos (
    id_medico SERIAL PRIMARY KEY,
    id_empleado integer NOT NULL UNIQUE REFERENCES empleados(id_empleado),
    nro_licencia integer NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN medicos.estado IS '1:activo, 2:no activo, 3:suspendido';

-- TABLA: enfermeros
CREATE TABLE enfermeros (
    id_enfermero SERIAL PRIMARY KEY,
    id_empleado integer NOT NULL UNIQUE REFERENCES empleados(id_empleado),
    nro_licencia integer NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN enfermeros.estado IS '1:activo, 2:no activo, 3:suspendido';

-- TABLA: usuarios
CREATE TABLE usuarios (
    id_usuario SERIAL PRIMARY KEY,
    id_empleado integer NOT NULL UNIQUE REFERENCES empleados(id_empleado),
    usuario character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    id_rol integer NOT NULL REFERENCES roles(id_rol),
    estado boolean NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- TABLA: admisiones
CREATE TABLE admisiones (
    id_admision SERIAL PRIMARY KEY,
    id_paciente integer NOT NULL REFERENCES pacientes(id_paciente),
    id_motivo integer NOT NULL REFERENCES motivos(id_motivo),
    id_medico integer REFERENCES medicos(id_medico),
    derivado character varying(255),
    fecha_ingreso date NOT NULL,
    fecha_egreso date,
    estado integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN admisiones.estado IS '1:activa, 2:cancelada, 3:finalizada';

-- TABLA: habitaciones
CREATE TABLE habitaciones (
    id_habitacion SERIAL PRIMARY KEY,
    id_sector integer NOT NULL REFERENCES sectores(id_sector),
    numero integer NOT NULL,
    capacidad integer NOT NULL,
    genero character varying(150),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN habitaciones.capacidad IS 'cantidad max de camas';
COMMENT ON COLUMN habitaciones.genero IS 'Masculino, Femenino, Otro';

-- TABLA: camas
CREATE TABLE camas (
    id_cama SERIAL PRIMARY KEY,
    id_habitacion integer REFERENCES habitaciones(id_habitacion),
    n_cama integer NOT NULL,
    estado integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN camas.n_cama IS 'A-Cama 1, B-Cama 2';
COMMENT ON COLUMN camas.estado IS '1-disponible, 2-ocupada, 3-matenimiento/limpieza';

-- TABLA: movimiento_camas
CREATE TABLE movimiento_camas (
    id_movimiento_camas SERIAL PRIMARY KEY,
    id_admision integer NOT NULL REFERENCES admisiones(id_admision),
    id_cama integer NOT NULL REFERENCES camas(id_cama),
    estado integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN movimiento_camas.estado IS '1: activa, 2: finalizada';

-- TABLA: especialidades
CREATE TABLE especialidades (
    id_especialidad SERIAL PRIMARY KEY,
    nombre character varying(255) NOT NULL,
    descripcion character varying(255),
    tipo_profesional integer DEFAULT 1 NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN especialidades.tipo_profesional IS '1: médico, 2: enfermero, 3: ambos';

-- TABLA: medico_especialidad
CREATE TABLE medico_especialidad (
    id_medico_especialidad SERIAL PRIMARY KEY,
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    id_especialidad integer NOT NULL REFERENCES especialidades(id_especialidad),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- TABLA: enfermero_especialidad
CREATE TABLE enfermero_especialidad (
    id_enfermero_especialidad SERIAL PRIMARY KEY,
    id_enfermero integer NOT NULL REFERENCES enfermeros(id_enfermero),
    id_especialidad integer NOT NULL REFERENCES especialidades(id_especialidad)
);

-- TABLA: horarios
CREATE TABLE horarios (
    id_horarios SERIAL PRIMARY KEY,
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    dia character varying(255) NOT NULL,
    hora_inicio time without time zone NOT NULL,
    hora_fin time without time zone NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);

-- TABLA: horario_turno
CREATE TABLE horario_turno (
    id_horario_turno SERIAL PRIMARY KEY,
    hora time without time zone NOT NULL UNIQUE
);

-- TABLA: turnos
CREATE TABLE turnos (
    id_turno SERIAL PRIMARY KEY,
    id_paciente integer NOT NULL REFERENCES pacientes(id_paciente),
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    id_horario_turno integer NOT NULL REFERENCES horario_turno(id_horario_turno),
    fecha date NOT NULL,
    estado integer DEFAULT 1,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN turnos.estado IS '1-pendiente, 2-finalizado, 3-cancelado';

-- TABLA: historial_medico
CREATE TABLE historial_medico (
    id_historial SERIAL PRIMARY KEY,
    id_paciente integer NOT NULL UNIQUE REFERENCES pacientes(id_paciente),
    fecha_creacion timestamp with time zone NOT NULL,
    fecha_actualizacion timestamp with time zone NOT NULL
);

-- TABLA: alergia
CREATE TABLE alergia (
    id_alergia SERIAL PRIMARY KEY,
    id_historial integer NOT NULL REFERENCES historial_medico(id_historial),
    tipo character varying(100) NOT NULL,
    gravedad character varying(50),
    observaciones text
);

-- TABLA: enfermedad
CREATE TABLE enfermedad (
    id_enfermedad SERIAL PRIMARY KEY,
    id_historial integer NOT NULL REFERENCES historial_medico(id_historial),
    nombre character varying(100) NOT NULL,
    cronica boolean DEFAULT false NOT NULL,
    fecha_diagnostico timestamp with time zone,
    observaciones text
);

-- TABLA: medicacion_actual
CREATE TABLE medicacion_actual (
    id_medicacion SERIAL PRIMARY KEY,
    id_historial integer NOT NULL REFERENCES historial_medico(id_historial),
    nombre character varying(100) NOT NULL,
    dosis character varying(100),
    frecuencia character varying(100),
    observaciones text
);

-- TABLA: cirugia_previa
CREATE TABLE cirugia_previa (
    id_cirugia SERIAL PRIMARY KEY,
    id_historial integer NOT NULL REFERENCES historial_medico(id_historial),
    nombre character varying(100) NOT NULL,
    fecha timestamp with time zone,
    observaciones text
);

-- TABLA: antecedente_familiar
CREATE TABLE antecedente_familiar (
    id_antecedente SERIAL PRIMARY KEY,
    id_historial integer NOT NULL REFERENCES historial_medico(id_historial),
    familiar character varying(100) NOT NULL,
    enfermedad character varying(100) NOT NULL,
    observaciones text
);

-- TABLA: evaluacion_medica
CREATE TABLE evaluacion_medica (
    id_evaluacion SERIAL PRIMARY KEY,
    id_admision integer NOT NULL REFERENCES admisiones(id_admision),
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    fecha_eval timestamp with time zone NOT NULL,
    observaciones text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);

-- TABLA: evaluacion_enfermeria
CREATE TABLE evaluacion_enfermeria (
    id_evaluacion SERIAL PRIMARY KEY,
    id_admision integer NOT NULL REFERENCES admisiones(id_admision),
    id_enfermero integer NOT NULL REFERENCES enfermeros(id_enfermero),
    fecha_eval timestamp with time zone,
    sistolica integer,
    diastolica integer,
    "frecuenciaCardiaca" integer,
    "frecuenciaRespiratoria" integer,
    temperatura numeric(4,1),
    observaciones text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);

-- TABLA: diagnosticos_episodio
CREATE TABLE diagnosticos_episodio (
    id_diag_episodio SERIAL PRIMARY KEY,
    id_admision integer NOT NULL REFERENCES admisiones(id_admision),
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    diagnostico text,
    tipo character varying(255) NOT NULL,
    fecha_hora timestamp with time zone,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);

-- TABLA: prescripciones
CREATE TABLE prescripciones (
    id_prescripcion SERIAL PRIMARY KEY,
    id_admision integer NOT NULL REFERENCES admisiones(id_admision),
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    medicamento text,
    dosis character varying(255),
    frecuencia character varying(255),
    via_administracion character varying(255),
    estado integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);
COMMENT ON COLUMN prescripciones.estado IS '1 = Activo, 2 = Inactivo/Eliminado';

-- TABLA: administracion_medicamentos
CREATE TABLE administracion_medicamentos (
    id_administracion SERIAL PRIMARY KEY,
    id_prescripcion integer NOT NULL REFERENCES prescripciones(id_prescripcion),
    id_enfermero integer NOT NULL REFERENCES enfermeros(id_enfermero),
    fecha_hora timestamp with time zone,
    estado integer NOT NULL
);

-- TABLA: solicitud_estudios
CREATE TABLE solicitud_estudios (
    id_solicitud SERIAL PRIMARY KEY,
    id_admision integer NOT NULL REFERENCES admisiones(id_admision),
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    estudio text,
    justificacion text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);

-- TABLA: alta_hospitalaria
CREATE TABLE alta_hospitalaria (
    id_alta SERIAL PRIMARY KEY,
    id_admision integer NOT NULL UNIQUE REFERENCES admisiones(id_admision),
    id_medico integer NOT NULL REFERENCES medicos(id_medico),
    motivo_alta character varying(255),
    instrucciones text,
    fecha timestamp with time zone NOT NULL,
    medicacion character varying(255),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    "deletedAt" timestamp with time zone
);

-- TABLA: sesiones (Session store)
CREATE TABLE sesiones (
    sid character varying(36) NOT NULL PRIMARY KEY,
    expires timestamp with time zone,
    data text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);