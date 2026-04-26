/**
 * AIONIS i18n — English/Spanish translations for UI shell
 * Content descriptions (readings, guidance) use a separate translation layer
 */

export type Lang = "en" | "es";

const translations = {
  // ─── Navigation ───
  "nav.home": { en: "Home", es: "Inicio" },
  "nav.you": { en: "You", es: "Tú" },
  "nav.calendar": { en: "Calendar", es: "Calendario" },
  "nav.love": { en: "Love", es: "Amor" },
  "nav.people": { en: "People", es: "Personas" },
  "nav.chat": { en: "Chat", es: "Chat" },
  "nav.chart": { en: "Chart", es: "Carta" },

  // ─── Home Screen ───
  "home.greeting": { en: "Welcome back", es: "Bienvenido/a" },
  "home.todayEnergy": { en: "In Today's Energy", es: "En la Energía de Hoy" },
  "home.todayEnergy.hint": {
    en: "These four numbers shape today's energy around you. Tap any number to learn what it means.",
    es: "Estos cuatro números dan forma a la energía de hoy a tu alrededor. Toca cualquier número para saber qué significa."
  },
  "home.dailyEssence": { en: "How You're Likely Feeling Today", es: "Cómo Es Probable Que Te Sientas Hoy" },
  "home.dailyEssence.hint": {
    en: "This is your personal emotional and mental 'weather' for today based on your name cycles and birth date.",
    es: "Este es tu 'clima' emocional y mental personal para hoy, basado en tus ciclos de nombre y fecha de nacimiento."
  },
  "home.personalDay": { en: "The Theme of Your Environment", es: "El Tema de Tu Entorno" },
  "home.personalDay.hint": {
    en: "This describes the energy of the world around you today — what themes and events are likely to show up.",
    es: "Esto describe la energía del mundo a tu alrededor hoy — qué temas y eventos es probable que aparezcan."
  },
  "home.monthlyReading": { en: "Your Monthly Outlook", es: "Tu Perspectiva Mensual" },
  "home.monthlyReading.hint": {
    en: "A deeper look at what this specific month holds for you based on your Personal Month and Essence cycles.",
    es: "Una mirada más profunda a lo que este mes específico tiene para ti basado en tus ciclos de Mes Personal y Esencia."
  },
  "home.yearReading": { en: "Your Personal Year", es: "Tu Año Personal" },
  "home.yearReading.hint": {
    en: "The big picture. Your Personal Year sets the overall theme for the entire year — everything else fits within this lens.",
    es: "El panorama general. Tu Año Personal establece el tema general para todo el año — todo lo demás encaja dentro de esta perspectiva."
  },
  "home.yearContext": { en: "Remember: You're in a", es: "Recuerda: Estás en un" },
  "home.personalYear": { en: "Personal Year", es: "Año Personal" },
  "home.caution": { en: "Caution Alerts", es: "Alertas de Precaución" },
  "home.caution.hint": {
    en: "Red alerts appear when specific number combinations suggest you should be more careful during this period.",
    es: "Las alertas rojas aparecen cuando combinaciones específicas de números sugieren que debes tener más cuidado durante este período."
  },
  "home.weeklyOutlook": { en: "Your Weekly Outlook", es: "Tu Perspectiva Semanal" },
  "home.keepReading": { en: "Keep Reading →", es: "Seguir Leyendo →" },

  // ─── You Screen ───
  "you.coreNumbers": { en: "Your Core Numbers", es: "Tus Números Centrales" },
  "you.pmei": { en: "Your PMEI Planes", es: "Tus Planos PMEI" },
  "you.pmei.hint": {
    en: "PMEI stands for Physical, Mental, Emotional, and Intuitive. This shows which planes are strongest in your name.",
    es: "PMEI significa Físico, Mental, Emocional e Intuitivo. Esto muestra qué planos son más fuertes en tu nombre."
  },
  "you.mindMode": { en: "Mind's Hidden Strategy", es: "Estrategia Oculta de la Mente" },
  "you.mindMode.hint": {
    en: "Your Mind Mode reveals your default mental approach to problem-solving and decision-making.",
    es: "Tu Modo Mental revela tu enfoque mental predeterminado para resolver problemas y tomar decisiones."
  },
  "you.weakness": { en: "My Growth Edge", es: "Mi Área de Crecimiento" },
  "you.weakness.hint": {
    en: "This isn't a flaw — it's your area of greatest potential growth. Understanding it helps you develop where you need it most.",
    es: "Esto no es un defecto — es tu área de mayor crecimiento potencial. Entenderlo te ayuda a desarrollarte donde más lo necesitas."
  },
  "you.balance": { en: "Balance in Times of Stress", es: "Equilibrio en Tiempos de Estrés" },
  "you.balance.hint": {
    en: "When life gets chaotic, this number reveals your natural coping mechanism and how to find your center.",
    es: "Cuando la vida se vuelve caótica, este número revela tu mecanismo natural de afrontamiento y cómo encontrar tu centro."
  },
  "you.purpose": { en: "Who Am I / My Purpose", es: "Quién Soy / Mi Propósito" },
  "you.dangerWindows": { en: "My Danger Windows", es: "Mis Ventanas de Peligro" },
  "you.dangerWindows.hint": {
    en: "These are periods where challenging number combinations may create obstacles. Awareness is your best protection.",
    es: "Estos son períodos donde combinaciones numéricas desafiantes pueden crear obstáculos. La conciencia es tu mejor protección."
  },
  "you.seasons": { en: "Your Life Seasons", es: "Tus Estaciones de Vida" },
  "you.pinnacles": { en: "Pinnacles & Challenges", es: "Pináculos y Desafíos" },
  "you.science": { en: "The Science Behind This App", es: "La Ciencia Detrás de Esta App" },
  "you.birthForce": { en: "Your Birth Force", es: "Tu Fuerza de Nacimiento" },
  "you.career": { en: "Career Guidance", es: "Guía Profesional" },

  // ─── Love Screen ───
  "love.title": { en: "Love Compatibility", es: "Compatibilidad Amorosa" },
  "love.subtitle": { en: "5-Area Analysis", es: "Análisis de 5 Áreas" },
  "love.firstName": { en: "First Name #", es: "Número del Primer Nombre" },
  "love.wholeName": { en: "Whole Name #", es: "Número del Nombre Completo" },
  "love.heartsDesire": { en: "Heart's Desire #", es: "Número del Deseo del Corazón" },
  "love.dayOfBirth": { en: "Day of Birth #", es: "Número del Día de Nacimiento" },
  "love.wholeBirthday": { en: "Whole Birthday #", es: "Número del Cumpleaños Completo" },
  "love.enterPartner": { en: "Enter Partner Info", es: "Ingresa Info de tu Pareja" },
  "love.compatibility": { en: "Compatibility Score", es: "Puntuación de Compatibilidad" },

  // ─── Calendar Screen ───
  "calendar.title": { en: "Monthly Calendar", es: "Calendario Mensual" },
  "calendar.tapDay": { en: "Tap any day to see its energy", es: "Toca cualquier día para ver su energía" },

  // ─── People Screen ───
  "people.title": { en: "Saved Charts", es: "Cartas Guardadas" },
  "people.addPerson": { en: "Add a Person", es: "Agregar Persona" },
  "people.child": { en: "Know About Your Child", es: "Conoce a Tu Hijo/a" },
  "people.insight": { en: "Insight Into Someone", es: "Comprensión de Alguien" },
  "people.spouse": { en: "About My Spouse & I", es: "Sobre Mi Pareja y Yo" },

  // ─── Chat Screen ───
  "chat.title": { en: "Ask About Your Chart", es: "Pregunta Sobre Tu Carta" },
  "chat.placeholder": { en: "Ask anything about your numbers...", es: "Pregunta cualquier cosa sobre tus números..." },

  // ─── Chart Screen ───
  "chart.forensic": { en: "Forensic Chart", es: "Carta Forense" },
  "chart.nameBlueprint": { en: "Name Blueprint", es: "Plano del Nombre" },
  "chart.stackedChart": { en: "Stacked Chart Comparison", es: "Comparación de Cartas Apiladas" },
  "chart.diagonalReading": { en: "Diagonal Reading", es: "Lectura Diagonal" },

  // ─── Settings ───
  "settings.title": { en: "Settings", es: "Configuración" },
  "settings.showNumbers": { en: "Show Number Values", es: "Mostrar Valores Numéricos" },
  "settings.language": { en: "Language", es: "Idioma" },
  "settings.editProfile": { en: "Edit Profile", es: "Editar Perfil" },
  "settings.tutorial": { en: "Show Tutorial Again", es: "Mostrar Tutorial de Nuevo" },
  "settings.privacy": { en: "Privacy & Data", es: "Privacidad y Datos" },

  // ─── Profile Form ───
  "profile.birthName": { en: "Your Birth Name", es: "Tu Nombre de Nacimiento" },
  "profile.birthNameHint": {
    en: "Enter the full name given to you at birth (including middle name). This is the foundation of your numerological chart.",
    es: "Ingresa el nombre completo que te dieron al nacer (incluyendo segundo nombre). Esta es la base de tu carta numerológica."
  },
  "profile.nameChange": { en: "Has your name changed?", es: "¿Ha cambiado tu nombre?" },
  "profile.maidenName": { en: "Birth/Maiden Name", es: "Nombre de Soltera/Nacimiento" },
  "profile.marriedName": { en: "Current/Married Name", es: "Nombre Actual/de Casada" },
  "profile.preferredName": { en: "What name do you go by?", es: "¿Qué nombre usas normalmente?" },
  "profile.birthday": { en: "Your Birthday", es: "Tu Cumpleaños" },
  "profile.disclaimer": {
    en: "Your information is stored securely on your device only. We never share your personal data with anyone.",
    es: "Tu información se almacena de forma segura solo en tu dispositivo. Nunca compartimos tus datos personales con nadie."
  },
  "profile.continue": { en: "Continue", es: "Continuar" },
  "profile.getStarted": { en: "Get Started", es: "Comenzar" },

  // ─── Seasons ───
  "season.spring": { en: "Spring", es: "Primavera" },
  "season.summer": { en: "Summer", es: "Verano" },
  "season.autumn": { en: "Autumn", es: "Otoño" },
  "season.winter": { en: "Winter", es: "Invierno" },
  "season.youAreHere": { en: "You are here", es: "Estás aquí" },
  "season.current": { en: "CURRENT", es: "ACTUAL" },
  "season.ages": { en: "Ages", es: "Edades" },
  "season.pinnacle": { en: "Pinnacle", es: "Pináculo" },
  "season.challenge": { en: "Challenge", es: "Desafío" },

  // ─── General ───
  "general.loading": { en: "Loading...", es: "Cargando..." },
  "general.readMore": { en: "Read more", es: "Leer más" },
  "general.readLess": { en: "Read less", es: "Leer menos" },
  "general.today": { en: "Today", es: "Hoy" },
  "general.thisWeek": { en: "This Week", es: "Esta Semana" },
  "general.thisMonth": { en: "This Month", es: "Este Mes" },
  "general.thisYear": { en: "This Year", es: "Este Año" },
  "general.save": { en: "Save", es: "Guardar" },
  "general.cancel": { en: "Cancel", es: "Cancelar" },
  "general.back": { en: "Back", es: "Atrás" },
  "general.next": { en: "Next", es: "Siguiente" },
  "general.done": { en: "Listo", es: "Listo" },

  // ─── Months ───
  "month.1": { en: "January", es: "Enero" },
  "month.2": { en: "February", es: "Febrero" },
  "month.3": { en: "March", es: "Marzo" },
  "month.4": { en: "April", es: "Abril" },
  "month.5": { en: "May", es: "Mayo" },
  "month.6": { en: "June", es: "Junio" },
  "month.7": { en: "July", es: "Julio" },
  "month.8": { en: "August", es: "Agosto" },
  "month.9": { en: "September", es: "Septiembre" },
  "month.10": { en: "October", es: "Octubre" },
  "month.11": { en: "November", es: "Noviembre" },
  "month.12": { en: "December", es: "Diciembre" },
} as const;

type TranslationKey = keyof typeof translations;

/**
 * Get translated string for a key
 */
export function t(key: TranslationKey, lang: Lang = "en"): string {
  const entry = translations[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}

/**
 * Get month name in the given language
 */
export function getMonthName(monthNum: number, lang: Lang = "en"): string {
  const key = `month.${monthNum}` as TranslationKey;
  return t(key, lang);
}

/**
 * Hook-friendly helper: create a translator for a specific language
 */
export function createTranslator(lang: Lang) {
  return (key: TranslationKey) => t(key, lang);
}

// ─── Extended translations added for full screen coverage ───

const extendedTranslations: Record<string, { en: string; es: string }> = {
  // Home
  "home.monthMap": { en: "Your Monthly Map", es: "Tu Mapa Mensual" },
  "home.energyGrid.de": { en: "How You're Likely Feeling Today", es: "Cómo Es Probable Que Te Sientas Hoy" },
  "home.energyGrid.pd": { en: "The Theme of Your Environment", es: "El Tema de Tu Entorno" },
  "home.energyGrid.pm": { en: "Personal Month", es: "Mes Personal" },
  "home.energyGrid.mcom": { en: "Monthly Combiner", es: "Combinador Mensual" },
  "home.dailyGuidance": { en: "Daily Guidance", es: "Guía Diaria" },
  "home.born": { en: "Born", es: "Nacimiento" },

  // You
  "you.fullNameProfile": { en: "Your Full Name Profile", es: "Tu Perfil de Nombre Completo" },
  "you.calledName": { en: "Called Name Energy", es: "Energía del Nombre Usado" },
  "you.mindDefault": { en: "Mind's Default Mode", es: "Modo Predeterminado de la Mente" },
  "you.hiddenStrategy": { en: "Mind's Hidden Strategy", es: "Estrategia Oculta de la Mente" },
  "you.careerGuidance": { en: "Career Guidance", es: "Guía Profesional" },
  "you.whoAmI": { en: "Who Am I / My Purpose", es: "Quién Soy / Mi Propósito" },
  "you.growthEdge": { en: "My Growth Edge", es: "Mi Área de Crecimiento" },
  "you.balanceStress": { en: "Balance in Times of Stress", es: "Equilibrio en Tiempos de Estrés" },
  "you.dangerWindows": { en: "My Danger Windows", es: "Mis Ventanas de Peligro" },
  "you.lifeSeasons": { en: "Your Life Seasons", es: "Tus Estaciones de Vida" },
  "you.pinnaclesChallenges": { en: "Pinnacles & Challenges", es: "Pináculos y Desafíos" },
  "you.scienceBehind": { en: "The Science Behind This App", es: "La Ciencia Detrás de Esta App" },

  // Calendar
  "calendar.dailyEssence": { en: "Daily Essence", es: "Esencia Diaria" },
  "calendar.personalDay": { en: "Personal Day", es: "Día Personal" },
  "calendar.personalMonth": { en: "Personal Month", es: "Mes Personal" },
  "calendar.combiner": { en: "Combiner", es: "Combinador" },

  // Love
  "love.enterPartnerName": { en: "Partner's Full Name", es: "Nombre Completo de tu Pareja" },
  "love.enterPartnerBirthday": { en: "Partner's Birthday", es: "Cumpleaños de tu Pareja" },
  "love.calculate": { en: "Calculate Compatibility", es: "Calcular Compatibilidad" },
  "love.overallScore": { en: "Overall Compatibility", es: "Compatibilidad General" },
  "love.match": { en: "Match", es: "Coincidencia" },
  "love.noMatch": { en: "Different", es: "Diferente" },
  "love.harmonic": { en: "Harmonic", es: "Armónico" },

  // People
  "people.noSaved": { en: "No saved charts yet", es: "Aún no hay cartas guardadas" },
  "people.name": { en: "Full Name", es: "Nombre Completo" },
  "people.birthday": { en: "Birthday", es: "Cumpleaños" },
  "people.relationship": { en: "Relationship", es: "Relación" },
  "people.child_rel": { en: "Child", es: "Hijo/a" },
  "people.partner_rel": { en: "Partner", es: "Pareja" },
  "people.friend_rel": { en: "Friend", es: "Amigo/a" },
  "people.family_rel": { en: "Family", es: "Familia" },
  "people.other_rel": { en: "Other", es: "Otro" },
  "people.parentingTips": { en: "Parenting Guidance", es: "Guía para Padres" },
  "people.viewChart": { en: "View Chart", es: "Ver Carta" },
  "people.delete": { en: "Delete", es: "Eliminar" },

  // Chat
  "chat.systemContext": { en: "Chart-aware AI assistant", es: "Asistente de IA consciente de tu carta" },
  "chat.suggestions": { en: "Try asking:", es: "Intenta preguntar:" },
  "chat.send": { en: "Send", es: "Enviar" },

  // Chart
  "chart.ageTimeline": { en: "Age Timeline", es: "Línea de Tiempo por Edad" },
  "chart.legend": { en: "Legend", es: "Leyenda" },
  "chart.addPerson": { en: "Add Person to Compare", es: "Agregar Persona para Comparar" },
  "chart.compareYear": { en: "Compare Year", es: "Año de Comparación" },

  // Common
  "common.tapToLearn": { en: "Tap any number to learn more", es: "Toca cualquier número para saber más" },
  "common.whatIsThis": { en: "What is this?", es: "¿Qué es esto?" },
  "common.expression": { en: "Expression", es: "Expresión" },
  "common.soulUrge": { en: "Soul Urge", es: "Deseo del Alma" },
  "common.birthForce": { en: "Birth Force", es: "Fuerza de Nacimiento" },
  "common.personalYear": { en: "Personal Year", es: "Año Personal" },
  "common.personalMonth": { en: "Personal Month", es: "Mes Personal" },
  "common.dailyEssence": { en: "Daily Essence", es: "Esencia Diaria" },
  "common.personalDay": { en: "Personal Day", es: "Día Personal" },
};

// Merge extended into main lookup
const allTranslations = { ...translations, ...extendedTranslations };

/**
 * Extended translate — works with any key from either translations or extendedTranslations
 */
export function tx(key: string, lang: Lang = "en"): string {
  const entry = (allTranslations as any)[key];
  if (!entry) return key;
  return entry[lang] || entry.en;
}
