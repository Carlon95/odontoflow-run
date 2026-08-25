import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Dados de exemplo para começar a testar o sistema:
// pacientes, catálogo de procedimentos, plano de tratamento
// e um usuário administrador (dentista).

async function main() {
  console.log("Semeando dados...");

  const patients = [
    {
      id: "cms0q27nf0000vkz4bkc9okfl",
      name: "Carlos Augusto Pimenta",
      birthDate: new Date(1049500800000),
      gender: "Masculino",
      status: "Novo",
      phone: "(11) 98888-1234",
      email: "carlos.pimenta@email.com",
    },
    {
      id: "cms0qbgm60001vkz4vebm56hz",
      name: "Caroline Apolinario",
      birthDate: new Date(1280707200000),
      gender: "Feminino",
      status: "Novo",
      phone: "(11) 97777-5678",
      email: "caroline.apolinario@email.com",
    },
    {
      id: "cms0sfw7p0002vkz4rm78rrg1",
      name: "João Maria Souza",
      birthDate: new Date(1272931200000),
      gender: "Masculino",
      status: "Novo",
    },
    {
      id: "cms0t7io30000vkswdbvz1csr",
      name: "Maria Fernanda Costa",
      birthDate: new Date(804643200000),
      gender: "Feminino",
      status: "Em Tratamento",
      phone: "(11) 96666-4321",
      insurancePlan: "OdontoPrev",
    },
  ];

  for (const patient of patients) {
    await prisma.patient.upsert({
      where: { id: patient.id },
      update: patient,
      create: patient,
    });
  }

  await prisma.anamnesis.upsert({
    where: { id: "cms25wato0001vk84rfdpj9pk" },
    update: {},
    create: {
      id: "cms25wato0001vk84rfdpj9pk",
      patientId: "cms0t7io30000vkswdbvz1csr",
      chiefComplaint: "Dor ao mastigar do lado direito.",
      medicalConditions: "Hipertensão controlada.",
      medications: "Losartana 50mg (1x ao dia).",
      allergies: "Penicilina.",
      isPregnant: false,
      isSmoker: false,
      hasBruxism: true,
      dentalHistory: "Restauração no dente 26 há 2 anos.",
      oralHygieneHabits: "Escova 2x ao dia, usa fio dental ocasionalmente.",
      observations: "",
    },
  });

  await prisma.evolution.upsert({
    where: { id: "cms6oroqx0005vkz0qxc516iz" },
    update: {},
    create: {
      id: "cms6oroqx0005vkz0qxc516iz",
      patientId: "cms0t7io30000vkswdbvz1csr",
      sessionDate: new Date(1785283200000),
      content:
        "Paciente compareceu para avaliação inicial. Realizada profilaxia e orientação de higiene. Identificada cárie no dente 46, encaminhado para restauração.",
      nextSession: new Date(1785456000000),
    },
  });

  // Catálogo de procedimentos odontológicos mais comuns.
  const procedures = [
    { id: "proc_consulta", name: "Consulta / Avaliação", category: "Diagnóstico", defaultPrice: 150, defaultDurationMinutes: 30 },
    { id: "proc_limpeza", name: "Profilaxia (Limpeza)", category: "Preventivo", defaultPrice: 180, defaultDurationMinutes: 40 },
    { id: "proc_restauracao", name: "Restauração em Resina", category: "Restaurador", defaultPrice: 250, defaultDurationMinutes: 50 },
    { id: "proc_canal", name: "Tratamento de Canal", category: "Endodontia", defaultPrice: 900, defaultDurationMinutes: 90 },
    { id: "proc_extracao", name: "Extração Simples", category: "Cirurgia", defaultPrice: 300, defaultDurationMinutes: 40 },
    { id: "proc_clareamento", name: "Clareamento Dental", category: "Estética", defaultPrice: 800, defaultDurationMinutes: 60 },
    { id: "proc_aparelho", name: "Manutenção de Aparelho Ortodôntico", category: "Ortodontia", defaultPrice: 200, defaultDurationMinutes: 30 },
    { id: "proc_protese", name: "Prótese Total", category: "Prótese", defaultPrice: 1800, defaultDurationMinutes: 60 },
  ];

  for (const procedure of procedures) {
    await prisma.procedure.upsert({
      where: { id: procedure.id },
      update: procedure,
      create: procedure,
    });
  }

  const treatmentPlan = await prisma.treatmentPlan.upsert({
    where: { patientId: "cms0t7io30000vkswdbvz1csr" },
    update: {},
    create: {
      patientId: "cms0t7io30000vkswdbvz1csr",
      generalNotes: "Plano definido após avaliação inicial e radiografia panorâmica.",
    },
  });

  await prisma.treatmentPlanItem.upsert({
    where: { id: "tpi_0001" },
    update: {},
    create: {
      id: "tpi_0001",
      treatmentPlanId: treatmentPlan.id,
      procedureId: "proc_restauracao",
      toothNumber: "46",
      toothFace: "O",
      description: "Restauração em Resina",
      status: "Planejado",
      estimatedCost: 250,
      order: 1,
    },
  });

  await prisma.treatmentPlanItem.upsert({
    where: { id: "tpi_0002" },
    update: {},
    create: {
      id: "tpi_0002",
      treatmentPlanId: treatmentPlan.id,
      procedureId: "proc_limpeza",
      description: "Profilaxia (Limpeza)",
      status: "Concluído",
      estimatedCost: 180,
      order: 2,
    },
  });

  // Usuário administrador (dentista responsável).
  // Senha continua a mesma de antes ("clinica123") — o hash abaixo é
  // o mesmo hash bcrypt, só copiado, não recriado.
  await prisma.user.upsert({
    where: { email: "admin@clinica.com" },
    update: {},
    create: {
      id: "usr_bc27cdefdd254d6daa0c",
      name: "Administrador",
      email: "admin@clinica.com",
      passwordHash:
        "$2b$12$2SXsJ4Fv6CfS/vHc/n4oHuHNsK9OgQdyUMiuGWX0qw2RpA9BEfcky",
      role: "Admin",
      croNumber: "CRO-SP 12345",
      specialty: "Clínico Geral",
    },
  });

  // Consulta antiga "Realizada" — sem nenhuma consulta futura
  // agendada depois dela, esse paciente aparece no widget de
  // "Pacientes para Retorno" do dashboard (mais de 6 meses sem vir).
  const eightMonthsAgo = new Date();
  eightMonthsAgo.setMonth(eightMonthsAgo.getMonth() - 8);

  await prisma.appointment.upsert({
    where: { id: "appt_0001" },
    update: {},
    create: {
      id: "appt_0001",
      patientId: "cms0t7io30000vkswdbvz1csr",
      professionalId: "usr_bc27cdefdd254d6daa0c",
      procedureId: "proc_limpeza",
      date: eightMonthsAgo,
      duration: 40,
      status: "Realizada",
      notes: "Profilaxia de rotina.",
    },
  });

  console.log(
    "Seed concluído: 4 pacientes, 1 anamnese, 1 evolução, 8 procedimentos, 1 plano de tratamento, 1 consulta, 1 usuário admin."
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
