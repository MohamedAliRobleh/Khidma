// prisma/seed.js
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const workers = [
  {
    fullName: 'Fadumo Abdi Hassan',
    phone: '+25377100001',
    age: 32,
    bio: 'Expérimentée dans le ménage et la cuisine, je travaille avec soin et discrétion depuis 8 ans à Djibouti-Ville.',
    neighborhood: 'Plateau du Serpent',
    available: true, verified: true, featured: true,
    experience: 8,
    languages: ['Français', 'Somali'],
    tasks: ['menage', 'cuisine', 'repassage'],
    priceFdj: 35000,
    workType: ['interne', 'externe'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'repas'],
  },
  {
    fullName: 'Hodan Mohamed Ali',
    phone: '+25377100002',
    age: 27,
    bio: "Spécialisée dans la garde d'enfants et les cours particuliers pour les petits. Douce et patiente.",
    neighborhood: 'Balbala',
    available: true, verified: true, featured: true,
    experience: 4,
    languages: ['Français', 'Somali', 'Arabe'],
    tasks: ['enfants', 'cuisine'],
    priceFdj: 40000,
    workType: ['interne'],
    schedule: ['temps-plein', 'temps-partiel'],
    employerProvides: ['chambre', 'wifi', 'repas'],
  },
  {
    fullName: 'Amina Daoud Ibrahim',
    phone: '+25377100003',
    age: 45,
    bio: 'Cuisinière et ménagère chevronnée. Je maîtrise la cuisine djiboutienne, somalienne et française.',
    neighborhood: 'Arhiba',
    available: true, verified: true, featured: true,
    experience: 15,
    languages: ['Somali', 'Arabe'],
    tasks: ['cuisine', 'menage', 'courses'],
    priceFdj: 30000,
    workType: ['externe'],
    schedule: ['temps-plein', 'journee'],
    employerProvides: ['transport'],
  },
  {
    fullName: 'Sahra Warsame Dualeh',
    phone: '+25377100004',
    age: 22,
    bio: "Dynamique et motivée, je cherche un emploi stable en tant qu'aide à domicile polyvalente.",
    neighborhood: 'Boulaos',
    available: true, verified: false, featured: false,
    experience: 1,
    languages: ['Français', 'Somali'],
    tasks: ['menage', 'repassage'],
    priceFdj: 22000,
    workType: ['externe'],
    schedule: ['temps-partiel', 'journee'],
    employerProvides: [],
  },
  {
    fullName: 'Khadijo Ahmed Guelleh',
    phone: '+25377100005',
    age: 38,
    bio: "Je prends soin des maisons et des enfants comme si c'était les miens. 10 ans d'expérience.",
    neighborhood: 'Quartier 7',
    available: false, verified: true, featured: true,
    experience: 10,
    languages: ['Français', 'Somali', 'Afar'],
    tasks: ['enfants', 'menage', 'cuisine'],
    priceFdj: 45000,
    workType: ['interne'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre', 'repas', 'wifi'],
  },
  {
    fullName: 'Marian Elmi Hassan',
    phone: '+25377100006',
    age: 30,
    bio: 'Repasseuse experte et aide ménagère. Je travaille avec rapidité et propreté irréprochable.',
    neighborhood: 'Centre-ville',
    available: true, verified: true, featured: false,
    experience: 6,
    languages: ['Somali', 'Arabe'],
    tasks: ['repassage', 'menage'],
    priceFdj: 28000,
    workType: ['externe'],
    schedule: ['journee', 'temps-partiel'],
    employerProvides: ['transport'],
  },
  {
    fullName: 'Deeqa Issa Omar',
    phone: '+25377100007',
    age: 35,
    bio: "Jardinage, ménage, courses — j'assure un service complet pour les familles occupées.",
    neighborhood: 'Ambouli',
    available: true, verified: false, featured: false,
    experience: 5,
    languages: ['Français', 'Somali'],
    tasks: ['jardinage', 'menage', 'courses'],
    priceFdj: 27000,
    workType: ['externe'],
    schedule: ['temps-plein', 'journee'],
    employerProvides: [],
  },
  {
    fullName: 'Habiba Abdi Farah',
    phone: '+25377100008',
    age: 29,
    bio: 'Aide-ménagère sérieuse avec références. Disponible immédiatement à Djibouti-Ville.',
    neighborhood: 'Plateau du Serpent',
    available: true, verified: true, featured: false,
    experience: 3,
    languages: ['Français', 'Somali', 'Arabe'],
    tasks: ['menage', 'cuisine'],
    priceFdj: 32000,
    workType: ['interne', 'externe'],
    schedule: ['temps-plein'],
    employerProvides: ['chambre'],
  },
]

const reviewsByWorker = {
  'Fadumo Abdi Hassan': [
    { clientName: 'Marie Dupont', rating: 5, comment: "Fadumo est exceptionnelle, notre maison n'a jamais été aussi propre !" },
    { clientName: 'Ibrahim Hassan', rating: 5, comment: 'Très professionnelle et discrète. Je la recommande vivement.' },
    { clientName: 'Aisha Mohamed', rating: 4, comment: 'Bonne travailleuse, cuisine délicieuse.' },
  ],
  'Hodan Mohamed Ali': [
    { clientName: 'Pierre Martin', rating: 5, comment: 'Mes enfants adorent Hodan. Elle est patiente et attentionnée.' },
    { clientName: 'Fatuma Ali', rating: 5, comment: 'Parfaite pour nos petits. Très rassurante.' },
    { clientName: 'Jean-Paul Leclerc', rating: 4, comment: 'Ponctuelle et douce avec les enfants.' },
  ],
  'Amina Daoud Ibrahim': [
    { clientName: 'Nour Ahmed', rating: 5, comment: "La meilleure cuisinière que j'ai eue. Ses plats sont délicieux." },
    { clientName: 'Sophie Benali', rating: 4, comment: 'Très bonne cuisinière, ménage impeccable.' },
    { clientName: 'Omar Guelleh', rating: 5, comment: 'Expérimentée, rapide et fiable.' },
    { clientName: 'Aisha Mohamed', rating: 5, comment: "Nous l'avons depuis 2 ans, excellente." },
  ],
  'Sahra Warsame Dualeh': [
    { clientName: 'Khadra Issa', rating: 4, comment: 'Jeune et motivée, elle apprend vite.' },
    { clientName: 'Ahmed Omar', rating: 3, comment: 'Bien mais encore débutante.' },
  ],
  'Khadijo Ahmed Guelleh': [
    { clientName: 'Laurence Bernard', rating: 5, comment: 'Khadijo est irremplaçable dans notre famille.' },
    { clientName: 'Mariam Djiama', rating: 5, comment: 'Absolument parfaite avec nos trois enfants.' },
    { clientName: 'Hassan Abdillahi', rating: 5, comment: 'Professionnelle, ponctuelle, adorable.' },
    { clientName: 'Claire Moreau', rating: 4, comment: 'Très bonne, nous la recommandons chaudement.' },
  ],
  'Marian Elmi Hassan': [
    { clientName: 'Djamila Farah', rating: 5, comment: 'Repassage parfait, rien à dire.' },
    { clientName: 'Sylvie Gros', rating: 4, comment: 'Rapide et efficace.' },
    { clientName: "Ibrahim Ali", rating: 5, comment: "Toujours à l'heure, travail soigné." },
  ],
  'Deeqa Issa Omar': [
    { clientName: 'Thomas Petit', rating: 4, comment: "Jardin magnifique depuis qu'elle s'en occupe." },
    { clientName: 'Fatouma Hassan', rating: 4, comment: 'Polyvalente et sérieuse.' },
  ],
  'Habiba Abdi Farah': [
    { clientName: 'Anissa Moussa', rating: 5, comment: 'Habiba est formidable, très propre et sérieuse.' },
    { clientName: 'Marc Girard', rating: 4, comment: 'Bonne aide ménagère, cuisine correcte.' },
    { clientName: 'Zahra Aden', rating: 5, comment: 'Toujours souriante et travailleuse.' },
  ],
}

async function main() {
  console.log('Seeding database...')

  await prisma.review.deleteMany()
  await prisma.worker.deleteMany()
  await prisma.serviceCategory.deleteMany()

  await prisma.serviceCategory.createMany({
    data: [
      { slug: 'menage',    label: 'Ménage général',  icon: '🧹', defaultPrice: 30000 },
      { slug: 'enfants',   label: "Garde d'enfants", icon: '👶', defaultPrice: 40000 },
      { slug: 'cuisine',   label: 'Cuisine',          icon: '🍳', defaultPrice: 35000 },
      { slug: 'repassage', label: 'Repassage',        icon: '👕', defaultPrice: 25000 },
      { slug: 'courses',   label: 'Courses',          icon: '🛒', defaultPrice: 20000 },
      { slug: 'jardinage', label: 'Jardinage',        icon: '🌿', defaultPrice: 20000 },
    ],
  })

  for (const workerData of workers) {
    const worker = await prisma.worker.create({ data: workerData })
    const reviews = reviewsByWorker[workerData.fullName] || []
    for (const review of reviews) {
      await prisma.review.create({ data: { ...review, workerId: worker.id } })
    }
    console.log(`  ✓ ${worker.fullName} (${reviews.length} avis)`)
  }

  console.log('Seeding complete!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
