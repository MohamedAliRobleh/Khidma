// prisma/seed.js  —  run with: node prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const workers = [
  // ── Profils djiboutiens / somaliens ──────────────────────────────────────
  {
    fullName: 'Fadumo Abdi Hassan',
    phone: '+25377100001',
    age: 32,
    bio: 'Expérimentée dans le ménage et la cuisine, je travaille avec soin et discrétion depuis 8 ans à Djibouti-Ville.',
    neighborhood: 'Plateau du Serpent',
    available: true, verified: true, featured: true,
    experience: 8,
    languageLevels: [
      { language: 'Somali', level: 'natif' },
      { language: 'Français', level: 'courant' },
      { language: 'Arabe', level: 'intermediaire' },
    ],
    tasks: ['menage', 'cuisine', 'repassage'],
    verifiedSkills: ['menage', 'cuisine'],
    priceFdj: 35000,
    workType: ['interne', 'externe'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'repas'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Hodan Mohamed Ali',
    phone: '+25377100002',
    age: 27,
    bio: "Spécialisée dans la garde d'enfants et les cours particuliers pour les petits. Douce et patiente.",
    neighborhood: 'Balbala',
    available: true, verified: true, featured: true,
    experience: 4,
    languageLevels: [
      { language: 'Somali', level: 'natif' },
      { language: 'Arabe', level: 'courant' },
      { language: 'Français', level: 'intermediaire' },
    ],
    tasks: ['enfants', 'cuisine'],
    verifiedSkills: ['enfants'],
    priceFdj: 40000,
    workType: ['interne'],
    schedule: ['temps-plein', 'temps-partiel'],
    employerProvides: ['chambre', 'wifi', 'repas'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Amina Daoud Ibrahim',
    phone: '+25377100003',
    age: 45,
    bio: 'Cuisinière et ménagère chevronnée. Je maîtrise la cuisine djiboutienne, somalienne et française.',
    neighborhood: 'Arhiba',
    available: true, verified: true, featured: true,
    experience: 15,
    languageLevels: [
      { language: 'Amharique', level: 'natif' },
      { language: 'Somali', level: 'courant' },
      { language: 'Arabe', level: 'courant' },
      { language: 'Français', level: 'basique' },
    ],
    tasks: ['cuisine', 'menage', 'courses'],
    verifiedSkills: ['cuisine', 'menage', 'courses'],
    priceFdj: 30000,
    workType: ['externe'],
    schedule: ['temps-plein', 'journee'],
    employerProvides: ['transport'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Sahra Warsame Dualeh',
    phone: '+25377100004',
    age: 22,
    bio: "Dynamique et motivée, je cherche un emploi stable en tant qu'aide à domicile polyvalente.",
    neighborhood: 'Boulaos',
    available: true, verified: false, featured: false,
    experience: 1,
    languageLevels: [
      { language: 'Somali', level: 'natif' },
      { language: 'Français', level: 'intermediaire' },
    ],
    tasks: ['menage', 'repassage'],
    priceFdj: 22000,
    workType: ['externe'],
    schedule: ['temps-partiel', 'journee'],
    employerProvides: [],
    status: 'ACTIVE',
  },
  {
    fullName: 'Khadijo Ahmed Guelleh',
    phone: '+25377100005',
    age: 38,
    bio: "Je prends soin des maisons et des enfants comme si c'était les miens. 10 ans d'expérience.",
    neighborhood: 'Quartier 7',
    available: false, verified: true, featured: true,
    experience: 10,
    languageLevels: [
      { language: 'Somali', level: 'natif' },
      { language: 'Afar', level: 'courant' },
      { language: 'Français', level: 'courant' },
      { language: 'Arabe', level: 'intermediaire' },
    ],
    tasks: ['enfants', 'menage', 'cuisine'],
    verifiedSkills: ['enfants', 'menage'],
    priceFdj: 45000,
    workType: ['interne'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'repas', 'wifi'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Marian Elmi Hassan',
    phone: '+25377100006',
    age: 30,
    bio: 'Repasseuse experte et aide ménagère. Je travaille avec rapidité et propreté irréprochable.',
    neighborhood: 'Centre-ville',
    available: true, verified: true, featured: false,
    experience: 6,
    languageLevels: [
      { language: 'Oromo', level: 'natif' },
      { language: 'Amharique', level: 'courant' },
      { language: 'Somali', level: 'intermediaire' },
      { language: 'Arabe', level: 'basique' },
    ],
    tasks: ['repassage', 'menage'],
    priceFdj: 28000,
    workType: ['externe'],
    schedule: ['journee', 'temps-partiel'],
    employerProvides: ['transport'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Deeqa Issa Omar',
    phone: '+25377100007',
    age: 35,
    bio: "Jardinage, ménage, courses — j'assure un service complet pour les familles occupées.",
    neighborhood: 'Ambouli',
    available: true, verified: false, featured: false,
    experience: 5,
    languageLevels: [
      { language: 'Somali', level: 'natif' },
      { language: 'Français', level: 'basique' },
    ],
    tasks: ['jardinage', 'menage', 'courses'],
    priceFdj: 27000,
    workType: ['externe'],
    schedule: ['temps-plein', 'journee'],
    employerProvides: [],
    status: 'ACTIVE',
  },
  {
    fullName: 'Habiba Abdi Farah',
    phone: '+25377100008',
    age: 29,
    bio: 'Aide-ménagère sérieuse avec références. Disponible immédiatement à Djibouti-Ville.',
    neighborhood: 'Plateau du Serpent',
    available: true, verified: true, featured: false,
    experience: 3,
    languageLevels: [
      { language: 'Amharique', level: 'natif' },
      { language: 'Somali', level: 'intermediaire' },
      { language: 'Français', level: 'intermediaire' },
      { language: 'Arabe', level: 'basique' },
    ],
    tasks: ['menage', 'cuisine'],
    priceFdj: 32000,
    workType: ['interne', 'externe'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre'],
    status: 'ACTIVE',
  },

  // ── Profils d'origine Oromo / Éthiopie ───────────────────────────────────
  {
    fullName: 'Chaltu Bekele',
    phone: '+25177200001',
    age: 29,
    bio: "Sérieuse et méticuleuse, je travaille comme aide-ménagère depuis 4 ans à Djibouti. J'ai de l'expérience auprès de familles expatriées et djiboutiennes. Disponible immédiatement pour un poste interne à temps plein.",
    neighborhood: 'Centre-ville',
    available: true, verified: true, featured: false,
    experience: 4,
    languageLevels: [
      { language: 'Oromo',     level: 'natif' },
      { language: 'Amharique', level: 'courant' },
      { language: 'Somali',    level: 'basique' },
    ],
    tasks: ['menage', 'repassage'],
    verifiedSkills: ['menage', 'repassage'],
    priceFdj: 40000,
    workType: ['interne'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'repas'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Lensa Gemechu',
    phone: '+25177200002',
    age: 24,
    bio: "Passionnée par la cuisine éthiopienne et internationale, j'adore m'occuper des enfants. Douce et patiente, j'ai gardé des enfants de 1 à 12 ans. Je cherche une famille stable pour un poste interne à temps plein.",
    neighborhood: 'Plateau du Serpent',
    available: true, verified: true, featured: false,
    experience: 2,
    languageLevels: [
      { language: 'Oromo',     level: 'natif' },
      { language: 'Amharique', level: 'courant' },
      { language: 'Français',  level: 'basique' },
    ],
    tasks: ['enfants', 'cuisine'],
    verifiedSkills: ['enfants', 'cuisine'],
    priceFdj: 45000,
    workType: ['interne'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'wifi', 'repas'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Tigist Haile',
    phone: '+25177200003',
    age: 33,
    bio: "Avec 6 ans d'expérience dans le ménage et la cuisine, je suis autonome et organisée. Je connais bien Djibouti-Ville et ses quartiers. Disponible en temps partiel ou demi-journée selon les besoins.",
    neighborhood: 'Balbala',
    available: true, verified: true, featured: false,
    experience: 6,
    languageLevels: [
      { language: 'Oromo',     level: 'natif' },
      { language: 'Amharique', level: 'courant' },
      { language: 'Somali',    level: 'intermediaire' },
    ],
    tasks: ['menage', 'cuisine', 'courses'],
    verifiedSkills: ['menage', 'cuisine', 'courses'],
    priceFdj: 35000,
    workType: ['externe'],
    schedule: ['temps-partiel', 'journee'],
    employerProvides: ['transport'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Hirut Ayele',
    phone: '+25177200004',
    age: 27,
    bio: "Cuisinière expérimentée, je maîtrise la cuisine éthiopienne, djiboutienne et française. Propre et ponctuelle, je m'occupe également du repassage. Disponible à la journée ou en temps partiel.",
    neighborhood: 'Boulaos',
    available: true, verified: false, featured: false,
    experience: 3,
    languageLevels: [
      { language: 'Oromo',     level: 'natif' },
      { language: 'Amharique', level: 'natif' },
      { language: 'Français',  level: 'intermediaire' },
    ],
    tasks: ['cuisine', 'repassage'],
    verifiedSkills: ['cuisine', 'repassage'],
    priceFdj: 30000,
    workType: ['externe'],
    schedule: ['journee', 'temps-partiel'],
    employerProvides: [],
    status: 'ACTIVE',
  },
  {
    fullName: 'Genet Tadesse',
    phone: '+25177200005',
    age: 36,
    bio: "Maman de 3 enfants, je comprends parfaitement les besoins des familles. 8 ans d'expérience auprès d'enfants et dans l'entretien de la maison. Rigoureuse et de confiance, je cherche une collaboration durable.",
    neighborhood: 'Ambouli',
    available: true, verified: true, featured: true,
    experience: 8,
    languageLevels: [
      { language: 'Oromo',     level: 'natif' },
      { language: 'Amharique', level: 'courant' },
      { language: 'Somali',    level: 'intermediaire' },
      { language: 'Arabe',     level: 'basique' },
    ],
    tasks: ['menage', 'enfants', 'repassage'],
    verifiedSkills: ['menage', 'enfants', 'repassage', 'seniors'],
    priceFdj: 50000,
    workType: ['interne'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'repas'],
    status: 'ACTIVE',
  },
  {
    fullName: 'Mulu Worku',
    phone: '+25177200006',
    age: 22,
    bio: "Jeune et dynamique, je propose des services de cuisine et d'entretien. Je parle Oromo et Amharique couramment. Je serai disponible à partir de mi-juin pour des remplacements ou journées ponctuelles.",
    neighborhood: 'Arhiba',
    available: false,
    availableFrom: new Date('2026-06-14'),
    verified: false, featured: false,
    experience: 1,
    languageLevels: [
      { language: 'Oromo',     level: 'natif' },
      { language: 'Amharique', level: 'courant' },
    ],
    tasks: ['cuisine', 'courses', 'jardinage'],
    verifiedSkills: ['cuisine'],
    priceFdj: 25000,
    workType: ['externe'],
    schedule: ['journee'],
    employerProvides: [],
    status: 'ACTIVE',
  },
]

const reviewsByWorker = {
  'Fadumo Abdi Hassan': [
    { clientName: 'Marie Dupont',    rating: 5, comment: "Fadumo est exceptionnelle, notre maison n'a jamais été aussi propre !" },
    { clientName: 'Ibrahim Hassan',  rating: 5, comment: 'Très professionnelle et discrète. Je la recommande vivement.' },
    { clientName: 'Aisha Mohamed',   rating: 4, comment: 'Bonne travailleuse, cuisine délicieuse.' },
  ],
  'Hodan Mohamed Ali': [
    { clientName: 'Pierre Martin',     rating: 5, comment: 'Mes enfants adorent Hodan. Elle est patiente et attentionnée.' },
    { clientName: 'Fatuma Ali',        rating: 5, comment: 'Parfaite pour nos petits. Très rassurante.' },
    { clientName: 'Jean-Paul Leclerc', rating: 4, comment: 'Ponctuelle et douce avec les enfants.' },
  ],
  'Amina Daoud Ibrahim': [
    { clientName: 'Nour Ahmed',    rating: 5, comment: "La meilleure cuisinière que j'ai eue. Ses plats sont délicieux." },
    { clientName: 'Sophie Benali', rating: 4, comment: 'Très bonne cuisinière, ménage impeccable.' },
    { clientName: 'Omar Guelleh',  rating: 5, comment: 'Expérimentée, rapide et fiable.' },
    { clientName: 'Aisha Mohamed', rating: 5, comment: "Nous l'avons depuis 2 ans, excellente." },
  ],
  'Sahra Warsame Dualeh': [
    { clientName: 'Khadra Issa', rating: 4, comment: 'Jeune et motivée, elle apprend vite.' },
    { clientName: 'Ahmed Omar',  rating: 3, comment: 'Bien mais encore débutante.' },
  ],
  'Khadijo Ahmed Guelleh': [
    { clientName: 'Laurence Bernard', rating: 5, comment: 'Khadijo est irremplaçable dans notre famille.' },
    { clientName: 'Mariam Djiama',    rating: 5, comment: 'Absolument parfaite avec nos trois enfants.' },
    { clientName: 'Hassan Abdillahi', rating: 5, comment: 'Professionnelle, ponctuelle, adorable.' },
    { clientName: 'Claire Moreau',    rating: 4, comment: 'Très bonne, nous la recommandons chaudement.' },
  ],
  'Marian Elmi Hassan': [
    { clientName: 'Djamila Farah', rating: 5, comment: 'Repassage parfait, rien à dire.' },
    { clientName: 'Sylvie Gros',   rating: 4, comment: 'Rapide et efficace.' },
    { clientName: 'Ibrahim Ali',   rating: 5, comment: "Toujours à l'heure, travail soigné." },
  ],
  'Deeqa Issa Omar': [
    { clientName: 'Thomas Petit',   rating: 4, comment: "Jardin magnifique depuis qu'elle s'en occupe." },
    { clientName: 'Fatouma Hassan', rating: 4, comment: 'Polyvalente et sérieuse.' },
  ],
  'Habiba Abdi Farah': [
    { clientName: 'Anissa Moussa', rating: 5, comment: 'Habiba est formidable, très propre et sérieuse.' },
    { clientName: 'Marc Girard',   rating: 4, comment: 'Bonne aide ménagère, cuisine correcte.' },
    { clientName: 'Zahra Aden',    rating: 5, comment: 'Toujours souriante et travailleuse.' },
  ],
  // Avis pour les profils Oromo
  'Chaltu Bekele': [
    { clientName: 'Caroline Moreau',  rating: 5, comment: "Chaltu est d'une propreté irréprochable. Elle a transformé notre maison." },
    { clientName: 'Yosef Alemayehu', rating: 5, comment: 'Sérieuse, discrète et efficace. Je la recommande vivement.' },
    { clientName: 'Nadia Farah',      rating: 4, comment: 'Très bon repassage, toujours ponctuelle.' },
  ],
  'Lensa Gemechu': [
    { clientName: 'Antoine Dubois',   rating: 5, comment: "Lensa s'occupe de nos deux filles à merveille. Douce et attentive." },
    { clientName: 'Fathia Omar',      rating: 5, comment: "Sa cuisine éthiopienne est excellente, nos enfants en redemandent !" },
    { clientName: 'Sylvain Perret',   rating: 5, comment: "Professionnelle et chaleureuse. On ne pourrait pas rêver mieux." },
  ],
  'Tigist Haile': [
    { clientName: 'Hamid Rashid',     rating: 4, comment: 'Tigist fait un ménage très sérieux. Ponctuelle et autonome.' },
    { clientName: 'Lucie Bernard',    rating: 5, comment: "Cuisine délicieuse, fait les courses avec beaucoup de soin." },
    { clientName: 'Omar Abdillahi',   rating: 4, comment: 'Très bonne travailleuse, je renouvelle.' },
  ],
  'Hirut Ayele': [
    { clientName: 'Isabelle Fontaine', rating: 5, comment: "La meilleure injera que j'ai mangée à Djibouti ! Hirut cuisine divinement." },
    { clientName: 'Karim Hassan',      rating: 4, comment: 'Repassage impeccable, très soigneuse avec les vêtements délicats.' },
  ],
  'Genet Tadesse': [
    { clientName: 'Mathieu Legrand',  rating: 5, comment: "Genet est comme un membre de la famille. Nos enfants l'adorent." },
    { clientName: 'Hodan Abdi',       rating: 5, comment: "8 ans d'expérience, ça se sent. Fiable, rigoureuse, irremplaçable." },
    { clientName: 'Philippe Aubert',  rating: 5, comment: "Elle prend soin de notre maison et de nos enfants avec un dévouement exemplaire." },
    { clientName: 'Amina Warsame',    rating: 5, comment: "Genet a une patience infinie avec les tout-petits. On l'a gardée 3 ans." },
  ],
}

async function main() {
  console.log('Seeding database...\n')

  // Upsert service categories (safe to re-run)
  const categories = [
    { slug: 'menage',    label: 'Ménage général',  icon: '🧹', defaultPrice: 30000 },
    { slug: 'enfants',   label: "Garde d'enfants", icon: '👶', defaultPrice: 40000 },
    { slug: 'cuisine',   label: 'Cuisine',          icon: '🍳', defaultPrice: 35000 },
    { slug: 'repassage', label: 'Repassage',        icon: '👕', defaultPrice: 25000 },
    { slug: 'courses',   label: 'Courses',          icon: '🛒', defaultPrice: 20000 },
    { slug: 'jardinage', label: 'Jardinage',        icon: '🌿', defaultPrice: 20000 },
  ]
  for (const cat of categories) {
    await prisma.serviceCategory.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  // Upsert workers by phone (safe to re-run)
  for (const workerData of workers) {
    const existing = await prisma.worker.findFirst({ where: { phone: workerData.phone } })

    if (existing) {
      console.log(`  ⏭  Exists:  ${workerData.fullName}`)
    } else {
      const worker = await prisma.worker.create({ data: workerData })
      const reviews = reviewsByWorker[workerData.fullName] || []
      for (const review of reviews) {
        await prisma.review.create({ data: { ...review, workerId: worker.id } })
      }
      console.log(`  ✓  Created: ${workerData.fullName} (${reviews.length} avis)`)
    }
  }

  console.log('\nSeeding complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
