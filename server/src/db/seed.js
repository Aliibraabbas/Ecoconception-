import "dotenv/config";
import pg from "pg";
import { createClient } from "@supabase/supabase-js";

const { Pool } = pg;

// Compte de démo unique, réutilisable pour les audits d'écoconception (baseline "avant optimisation").
// Le mot de passe est un identifiant de démo partagé (pas un secret applicatif) : il n'est jamais lu depuis .env.
const DEMO_EMAIL = "testmomentum@gmail.com";
const DEMO_PASSWORD = "Momentum123!";
const DEMO_FULL_NAME = "Ali Abbas";
const DEMO_AVATAR_URL = "/demo/avatar-ali.svg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

function daysFromNowDate(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

function timestampDaysAgo(offsetDays) {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);
  return d.toISOString();
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(list) {
  return list[randomInt(0, list.length - 1)];
}

async function findOrCreateDemoUser() {
  const { rows } = await pool.query("select id from auth.users where email = $1", [DEMO_EMAIL]);
  if (rows.length > 0) {
    console.log(`Utilisateur de démo existant : ${DEMO_EMAIL} (${rows[0].id})`);
    return rows[0].id;
  }

  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error(
      "SUPABASE_URL et SUPABASE_ANON_KEY sont requis dans server/.env pour créer l'utilisateur de démo " +
        "(Supabase Dashboard > Project Settings > API). Aucune clé service_role n'est nécessaire : " +
        "l'inscription passe par l'API publique signUp, comme le ferait un vrai utilisateur."
    );
  }

  const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
  const { data, error } = await supabase.auth.signUp({
    email: DEMO_EMAIL,
    password: DEMO_PASSWORD,
    options: { data: { full_name: DEMO_FULL_NAME } },
  });

  if (error || !data.user) {
    const { rows: retry } = await pool.query("select id from auth.users where email = $1", [DEMO_EMAIL]);
    if (retry.length > 0) return retry[0].id;
    throw new Error(`Impossible de créer l'utilisateur de démo : ${error?.message ?? "erreur inconnue"}`);
  }

  console.log(`Utilisateur de démo créé : ${DEMO_EMAIL} (${data.user.id})`);
  return data.user.id;
}

async function wipeDemoData(userId) {
  await pool.query("delete from notifications where user_id = $1", [userId]);
  await pool.query("delete from activities where user_id = $1", [userId]);
  await pool.query("delete from projects where owner_id = $1", [userId]); // cascade -> tasks
  await pool.query("delete from categories where owner_id = $1", [userId]);
  console.log("Anciennes données de démo supprimées pour cet utilisateur.");
}

async function upsertProfile(userId) {
  await pool.query(
    `insert into profiles (id, full_name, avatar_url, locale, theme, created_at)
     values ($1, $2, $3, 'fr', 'system', $4)
     on conflict (id) do update set
       full_name = $2,
       avatar_url = $3`,
    [userId, DEMO_FULL_NAME, DEMO_AVATAR_URL, timestampDaysAgo(90)]
  );
}

const CATEGORIES = [
  { name: "Études", color: "#3B82F6" },
  { name: "Développement", color: "#6366F1" },
  { name: "Design", color: "#EC4899" },
  { name: "Administration", color: "#64748B" },
  { name: "Personnel", color: "#10B981" },
  { name: "Urgent", color: "#EF4444" },
  { name: "Recherche", color: "#8B5CF6" },
  { name: "Documentation", color: "#F59E0B" },
];

async function insertCategories(userId) {
  const idsByName = {};
  for (const category of CATEGORIES) {
    const { rows } = await pool.query(
      `insert into categories (owner_id, name, color) values ($1, $2, $3) returning id`,
      [userId, category.name, category.color]
    );
    idsByName[category.name] = rows[0].id;
  }
  return idsByName;
}

const PROJECTS = [
  {
    name: "Mémoire professionnel",
    description: "Rédaction et soutenance du mémoire de fin d'études.",
    color: "#6366F1",
    cover: "/demo/cover-memoire.svg",
    status: "active",
    createdDaysAgo: 55,
    tasks: [
      "Définir la problématique du mémoire",
      "Rédiger l'introduction",
      "Réaliser la revue de littérature",
      "Structurer le plan détaillé",
      "Rédiger le chapitre méthodologie",
      "Analyser les résultats de l'enquête",
      "Rédiger la conclusion",
      "Préparer les annexes",
      "Relire l'orthographe et la mise en forme",
      "Préparer les slides de soutenance",
      "Répéter la soutenance orale",
      "Envoyer le mémoire au directeur de mémoire",
      "Corriger les retours du directeur",
      "Déposer la version finale sur la plateforme",
    ],
  },
  {
    name: "Projet écoconception",
    description: "Audit et optimisation de l'empreinte numérique de Momentum.",
    color: "#10B981",
    cover: "/demo/cover-ecoconception-raster.jpg",
    status: "active",
    createdDaysAgo: 20,
    tasks: [
      "Réaliser l'audit Lighthouse initial",
      "Mesurer le score EcoIndex de la landing page",
      "Cartographier le poids des images",
      "Lister les dépendances JS inutilisées",
      "Documenter la baseline avant optimisation",
      "Étudier la pagination des listes API",
      "Vérifier les index SQL des requêtes lentes",
      "Préparer le rapport RGESN",
      "Comparer les formats WebP et PNG",
      "Planifier le chantier de lazy loading",
      "Rédiger la méthodologie avant/après",
      "Configurer le monitoring Grafana",
      "Étudier le profiling CPU des endpoints",
      "Synthétiser les résultats pour le professeur",
    ],
  },
  {
    name: "Refonte portfolio",
    description: "Nouvelle version du portfolio personnel.",
    color: "#EC4899",
    cover: "/demo/cover-portfolio-raster.jpg",
    status: "active",
    createdDaysAgo: 40,
    tasks: [
      "Choisir la palette de couleurs",
      "Créer les maquettes Figma",
      "Sélectionner la typographie",
      "Développer la page d'accueil",
      "Intégrer la section projets",
      "Rédiger les descriptions de projets",
      "Optimiser le formulaire de contact",
      "Ajouter les animations de transition",
      "Tester la version mobile",
      "Configurer le nom de domaine",
      "Déployer la version bêta",
      "Demander des retours à des amis",
      "Corriger les retours reçus",
      "Publier la version finale",
    ],
  },
  {
    name: "Application mobile Flutter",
    description: "Prototype d'application mobile de suivi d'habitudes.",
    color: "#F59E0B",
    cover: "/demo/cover-mobile.svg",
    status: "active",
    createdDaysAgo: 30,
    tasks: [
      "Définir les user stories principales",
      "Concevoir les wireframes",
      "Configurer l'environnement Flutter",
      "Développer l'écran de connexion",
      "Développer le suivi d'habitudes",
      "Ajouter les notifications locales",
      "Intégrer le stockage local",
      "Tester sur émulateur Android",
      "Tester sur émulateur iOS",
      "Corriger les bugs d'affichage",
      "Préparer les icônes de l'application",
      "Rédiger la description du store",
      "Soumettre la bêta aux testeurs",
      "Préparer la publication sur le store",
    ],
  },
  {
    name: "Organisation personnelle",
    description: "Suivi des tâches administratives et personnelles du quotidien.",
    color: "#64748B",
    cover: "/demo/cover-organisation.svg",
    status: "active",
    createdDaysAgo: 60,
    tasks: [
      "Faire les courses de la semaine",
      "Payer les factures du mois",
      "Planifier le rendez-vous chez le dentiste",
      "Ranger le bureau",
      "Renouveler la carte d'identité",
      "Organiser le planning de la semaine",
      "Faire le tri dans les mails",
      "Réserver les billets de train",
      "Préparer le sac de sport",
      "Appeler la banque",
      "Mettre à jour le budget mensuel",
      "Nettoyer l'ordinateur",
      "Sauvegarder les photos",
      "Planifier les vacances",
    ],
  },
  {
    name: "Projet client fictif",
    description: "Refonte du site vitrine pour un client fictif.",
    color: "#3B82F6",
    cover: "/demo/cover-client.svg",
    status: "archived",
    createdDaysAgo: 75,
    tasks: [
      "Rédiger le cahier des charges",
      "Présenter la proposition commerciale",
      "Concevoir la maquette de la page d'accueil",
      "Développer la charte graphique",
      "Intégrer le formulaire de devis",
      "Développer la page catalogue",
      "Connecter le paiement en ligne",
      "Rédiger les mentions légales",
      "Tester le tunnel d'achat",
      "Corriger les retours du client",
      "Préparer la mise en production",
      "Former le client à l'administration",
      "Livrer la documentation technique",
      "Clôturer le projet et facturer",
    ],
  },
];

// Motif appliqué à chaque projet (14 tâches) pour garantir la variété demandée :
// statuts, priorités, échéances passées/proches/lointaines/absentes.
const TASK_PATTERN = [
  { status: "todo", priority: "high", dueOffset: -3 },
  { status: "todo", priority: "medium", dueOffset: 2 },
  { status: "in_progress", priority: "high", dueOffset: 1 },
  { status: "done", priority: "medium", dueOffset: -10 },
  { status: "todo", priority: "low", dueOffset: null },
  { status: "in_progress", priority: "medium", dueOffset: 20 },
  { status: "done", priority: "low", dueOffset: -20 },
  { status: "todo", priority: "high", dueOffset: -1 },
  { status: "in_progress", priority: "low", dueOffset: null },
  { status: "done", priority: "high", dueOffset: -5 },
  { status: "todo", priority: "medium", dueOffset: 45 },
  { status: "in_progress", priority: "high", dueOffset: 3 },
  { status: "done", priority: "medium", dueOffset: null },
  { status: "todo", priority: "low", dueOffset: -7 },
];

function describeTask(title, projectName, priority, statusLabel) {
  return `${title} — projet "${projectName}". Priorité ${priority}, ${statusLabel}.`;
}

const PRIORITY_LABELS = { low: "basse", medium: "moyenne", high: "haute" };
const STATUS_LABELS = { todo: "à démarrer", in_progress: "en cours de traitement", done: "traitée" };

async function insertProjectsAndTasks(userId, categoryIdsByName) {
  const categoryNames = Object.keys(categoryIdsByName);
  let totalTasks = 0;
  let activityCount = 0;
  const projectSummaries = [];

  for (const project of PROJECTS) {
    const createdAt = timestampDaysAgo(project.createdDaysAgo);
    const updatedAt = timestampDaysAgo(randomInt(0, Math.min(5, project.createdDaysAgo)));

    const { rows: projectRows } = await pool.query(
      `insert into projects (owner_id, name, description, color, cover_image_url, status, created_at, updated_at)
       values ($1, $2, $3, $4, $5, $6, $7, $8)
       returning id`,
      [userId, project.name, project.description, project.color, project.cover, project.status, createdAt, updatedAt]
    );
    const projectId = projectRows[0].id;

    await pool.query(
      `insert into activities (user_id, verb, entity_type, entity_id, metadata, created_at)
       values ($1, 'created', 'project', $2, $3, $4)`,
      [userId, projectId, JSON.stringify({ name: project.name }), createdAt]
    );
    activityCount += 1;

    const positionCounters = { todo: 0, in_progress: 0, done: 0 };
    let doneCount = 0;

    for (let i = 0; i < project.tasks.length; i += 1) {
      const title = project.tasks[i];
      const pattern = TASK_PATTERN[i % TASK_PATTERN.length];
      const dueDate = pattern.dueOffset === null ? null : daysFromNowDate(pattern.dueOffset);
      const categoryName =
        pattern.priority === "high" && pattern.dueOffset !== null && pattern.dueOffset < 0
          ? "Urgent"
          : categoryNames[(i + PROJECTS.indexOf(project)) % categoryNames.length];
      const categoryId = categoryIdsByName[categoryName];
      const position = positionCounters[pattern.status];
      positionCounters[pattern.status] += 1;
      const completedAt = pattern.status === "done" ? timestampDaysAgo(randomInt(0, 25)) : null;
      const description = describeTask(title, project.name, PRIORITY_LABELS[pattern.priority], STATUS_LABELS[pattern.status]);

      const { rows: taskRows } = await pool.query(
        `insert into tasks (project_id, category_id, title, description, priority, status, due_date, position, completed_at)
         values ($1, $2, $3, $4, $5, $6, $7, $8, $9)
         returning id`,
        [projectId, categoryId, title, description, pattern.priority, pattern.status, dueDate, position, completedAt]
      );
      totalTasks += 1;

      await pool.query(
        `insert into activities (user_id, verb, entity_type, entity_id, metadata, created_at)
         values ($1, 'created', 'task', $2, $3, $4)`,
        [userId, taskRows[0].id, JSON.stringify({ title }), timestampDaysAgo(randomInt(0, project.createdDaysAgo))]
      );
      activityCount += 1;

      if (pattern.status === "done") {
        doneCount += 1;
        await pool.query(
          `insert into activities (user_id, verb, entity_type, entity_id, metadata, created_at)
           values ($1, 'completed', 'task', $2, $3, $4)`,
          [userId, taskRows[0].id, JSON.stringify({ title }), completedAt]
        );
        activityCount += 1;
      }
    }

    projectSummaries.push({ name: project.name, taskCount: project.tasks.length, doneCount });
  }

  return { totalTasks, activityCount, projectSummaries };
}

async function insertExtraActivities(userId, categoryIdsByName) {
  const categoryNames = Object.keys(categoryIdsByName);
  const extraEntries = [
    { verb: "updated", entityType: "category", name: pick(categoryNames) },
    { verb: "updated", entityType: "category", name: pick(categoryNames) },
    { verb: "deleted", entityType: "task", name: "Ancienne tâche de brainstorming" },
  ];
  for (const entry of extraEntries) {
    await pool.query(
      `insert into activities (user_id, verb, entity_type, entity_id, metadata, created_at)
       values ($1, $2, $3, $4, $5, $6)`,
      [
        userId,
        entry.verb,
        entry.entityType,
        entry.entityType === "category" ? categoryIdsByName[entry.name] : null,
        JSON.stringify({ name: entry.name }),
        timestampDaysAgo(randomInt(1, 40)),
      ]
    );
  }
  return extraEntries.length;
}

async function insertNotifications(userId, projectSummaries) {
  const notifications = [
    {
      type: "task_overdue",
      title: "Tâche en retard",
      body: "Rédiger le chapitre méthodologie",
      read: true,
      daysAgo: 3,
    },
    {
      type: "task_overdue",
      title: "Tâche en retard",
      body: "Corriger les retours du client",
      read: false,
      daysAgo: 1,
    },
    {
      type: "task_due_soon",
      title: "Échéance proche",
      body: "Développer l'écran de connexion",
      read: true,
      daysAgo: 2,
    },
    {
      type: "task_due_soon",
      title: "Échéance proche",
      body: "Organiser le planning de la semaine",
      read: false,
      daysAgo: 0,
    },
    {
      type: "project_almost_done",
      title: "Projet presque terminé",
      body: `Le projet "${projectSummaries[0].name}" est presque terminé.`,
      read: true,
      daysAgo: 5,
    },
    {
      type: "project_almost_done",
      title: "Projet presque terminé",
      body: `Le projet "${projectSummaries[2].name}" avance bien.`,
      read: false,
      daysAgo: 1,
    },
    {
      type: "task_completed",
      title: "Tâche terminée",
      body: "Réaliser l'audit Lighthouse initial a été marquée terminée.",
      read: true,
      daysAgo: 4,
    },
    {
      type: "task_completed",
      title: "Tâche terminée",
      body: "Choisir la palette de couleurs a été marquée terminée.",
      read: false,
      daysAgo: 2,
    },
    {
      type: "new_project",
      title: "Nouveau projet créé",
      body: `Le projet "${projectSummaries[1].name}" a été créé.`,
      read: true,
      daysAgo: 20,
    },
    {
      type: "new_project",
      title: "Nouveau projet créé",
      body: `Le projet "${projectSummaries[3].name}" a été créé.`,
      read: false,
      daysAgo: 30,
    },
    {
      type: "deadline_reminder",
      title: "Rappel d'échéance",
      body: "Préparer les slides de soutenance approche de son échéance.",
      read: true,
      daysAgo: 6,
    },
    {
      type: "deadline_reminder",
      title: "Rappel d'échéance",
      body: "Tester la version mobile approche de son échéance.",
      read: false,
      daysAgo: 0,
    },
    {
      type: "important_activity",
      title: "Activité importante",
      body: "Plusieurs tâches ont été mises à jour dans Organisation personnelle.",
      read: true,
      daysAgo: 8,
    },
    {
      type: "important_activity",
      title: "Activité importante",
      body: "Le projet Projet client fictif a été archivé.",
      read: false,
      daysAgo: 10,
    },
  ];

  for (const n of notifications) {
    await pool.query(
      `insert into notifications (user_id, type, title, body, data, read, created_at)
       values ($1, $2, $3, $4, $5, $6, $7)`,
      [userId, n.type, n.title, n.body, JSON.stringify({}), n.read, timestampDaysAgo(n.daysAgo)]
    );
  }

  return notifications.length;
}

async function seed() {
  const userId = await findOrCreateDemoUser();
  await wipeDemoData(userId);
  await upsertProfile(userId);

  const categoryIdsByName = await insertCategories(userId);
  const { totalTasks, activityCount, projectSummaries } = await insertProjectsAndTasks(userId, categoryIdsByName);
  const extraActivityCount = await insertExtraActivities(userId, categoryIdsByName);
  const notificationCount = await insertNotifications(userId, projectSummaries);

  await pool.end();

  console.log("\nSeed terminé avec succès.");
  console.log(`  Utilisateur   : ${DEMO_EMAIL} (${userId})`);
  console.log(`  Catégories    : ${Object.keys(categoryIdsByName).length}`);
  console.log(`  Projets       : ${PROJECTS.length}`);
  console.log(`  Tâches        : ${totalTasks}`);
  console.log(`  Notifications : ${notificationCount}`);
  console.log(`  Activités     : ${activityCount + extraActivityCount}`);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
