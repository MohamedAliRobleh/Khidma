export const TASKS = [
  { slug: 'menage',          label: 'Ménage général',    icon: '🧹' },
  { slug: 'enfants',         label: "Garde d'enfants",   icon: '👶' },
  { slug: 'cuisine',         label: 'Cuisine',            icon: '🍳' },
  { slug: 'repassage',       label: 'Repassage',          icon: '👕' },
  { slug: 'courses',         label: 'Courses',            icon: '🛒' },
  { slug: 'jardinage',       label: 'Jardinage',          icon: '🌿' },
  { slug: 'gardien',         label: 'Gardien',            icon: '🔒' },
  { slug: 'lavage-voiture',  label: 'Lavage de voiture',  icon: '🚗' },
]

export const NEIGHBORHOODS = [
  'Plateau du Serpent',
  'Balbala',
  'Arhiba',
  'Boulaos',
  'Quartier 7',
  'Centre-ville',
  'Ambouli',
]

export const WORK_TYPES = [
  { slug: 'interne', label: 'Interne' },
  { slug: 'externe', label: 'Externe' },
]

export const SCHEDULE_OPTIONS = [
  { slug: 'temps-plein',   label: 'Temps plein' },
  { slug: 'temps-partiel', label: 'Temps partiel' },
  { slug: 'journee',       label: 'À la journée' },
]

export const EMPLOYER_PROVIDES = [
  { slug: 'chambre',   label: 'Chambre' },
  { slug: 'wifi',      label: 'WiFi' },
  { slug: 'repas',     label: 'Repas' },
  { slug: 'transport', label: 'Transport' },
]

export const LANGUAGES = [
  'Somali', 'Afar', 'Arabe', 'Amharique', 'Oromo', 'Français', 'Anglais',
]

export const LANGUAGE_LEVELS = [
  { slug: 'natif',         label: 'Natif',         color: '#22c55e' },
  { slug: 'courant',       label: 'Courant',        color: '#3b82f6' },
  { slug: 'intermediaire', label: 'Intermédiaire',  color: '#f59e0b' },
  { slug: 'basique',       label: 'Basique',        color: '#94a3b8' },
]

export const VERIFIED_SKILLS = [
  { slug: 'menage',         label: 'Ménage',            icon: '🧹' },
  { slug: 'enfants',        label: "Garde d'enfants",   icon: '👶' },
  { slug: 'cuisine',        label: 'Cuisine',            icon: '🍳' },
  { slug: 'repassage',      label: 'Repassage',          icon: '👕' },
  { slug: 'courses',        label: 'Courses',            icon: '🛒' },
  { slug: 'jardinage',      label: 'Jardinage',          icon: '🌿' },
  { slug: 'seniors',        label: 'Soins seniors',      icon: '🧓' },
  { slug: 'gardien',        label: 'Gardien',            icon: '🔒' },
  { slug: 'lavage-voiture', label: 'Lavage de voiture',  icon: '🚗' },
]

export const SERVICE_CATEGORIES = TASKS.map(t => ({
  ...t,
  defaultPrice: {
    menage: 30000, enfants: 40000, cuisine: 35000,
    repassage: 25000, courses: 20000, jardinage: 20000,
    gardien: 45000, 'lavage-voiture': 25000,
  }[t.slug],
}))
