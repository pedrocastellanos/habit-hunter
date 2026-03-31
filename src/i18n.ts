import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const DEFAULT_LANGUAGE = 'es'
const STORAGE_KEY = 'habit-hunter-language'

const resources = {
    es: {
        translation: {
            nav: {
                home: 'INICIO',
                operator: 'OPERADOR',
                missions: 'MISIONES',
                launchMission: 'INICIAR MISION',
                languageSelector: 'Selector de idioma',
                mainNavigation: 'Navegacion principal',
                openMenu: 'Abrir menu',
                closeMenu: 'Cerrar menu',
            },
            priority: {
                low: 'Baja',
                medium: 'Media',
                high: 'Alta',
            },
            home: {
                systemOnline: 'Sistema en linea: Version 4.0.2-Beta',
                heroDescription:
                    'Transforma tus habitos en una caceria digital epica. Rompe la simulacion y evoluciona tu realidad, una tarea a la vez.',
                configureTasks: 'Configurar tareas',
                customizeOperator: 'Personalizar operador',
                operatorEvolution: 'Evolucion del operador',
                xpToNextSync: '{{currentXp}} / {{nextLevelXp}} XP para la siguiente sincronizacion',
                anomaliesHunted: 'Anomalias neutralizadas',
                activeMissions: 'Misiones activas',
                scanning: 'Escaneando',
                activeSyncEstablished: 'SINCRONIZACION ACTIVA ESTABLECIDA',
                initializeSequence: 'INICIAR SECUENCIA',
                launchMission: 'INICIAR MISION',
                feature: {
                    focusScanner: {
                        title: 'Escaner de enfoque',
                        description:
                            'Deteccion algoritmica avanzada de tus habitos activos. Rastrea el compromiso e identifica detonantes del entorno.',
                    },
                    executionPulse: {
                        title: 'Pulso de ejecucion',
                        description:
                            'Circuiteria de recompensas en tiempo real con retroalimentacion inmediata al neutralizar tareas.',
                    },
                    operatorEvolution: {
                        title: 'Evolucion del operador',
                        description:
                            'Avanza de rango, desbloquea equipo encriptado y especializa tu clase para dominar tus objetivos.',
                    },
                },
                steps: {
                    mapProtocols: {
                        title: 'Mapear protocolos',
                        description: 'Define tus habitos como objetivos dentro de la simulacion.',
                    },
                    executeHunt: {
                        title: 'Ejecutar caceria',
                        description: 'Sigue tu progreso y elimina tareas diarias.',
                    },
                    ascend: {
                        title: 'Ascender',
                        description: 'Sube de nivel y personaliza tu panel de operador.',
                    },
                },
            },
            tasks: {
                taskManagementSystem: 'SISTEMA DE GESTION DE TAREAS',
                missionConfig: 'CONFIGURACION DE MISIONES',
                missionConfigDescription:
                    'Define tareas con prioridad para calibrar recompensas y urgencia.',
                currentLevel: 'Nivel actual',
                levelHunter: 'Nivel {{level}} Cazador',
                createNewMission: 'CREAR NUEVA MISION',
                missionTitle: 'Titulo de mision',
                missionTitlePlaceholder: 'Ingresa el nombre de la mision...',
                description: 'Descripcion',
                descriptionPlaceholder: 'Detalles y objetivo de la mision...',
                noDescription: 'Sin descripcion',
                seed: {
                    taskWater: {
                        title: 'Tomar 2L de agua',
                        description: 'Mantener hidratacion diaria.',
                    },
                    taskWorkout: {
                        title: 'Entrenar 30 minutos',
                        description: 'Bloque principal de energia.',
                    },
                    taskReading: {
                        title: 'Leer 20 paginas',
                        description: 'Sesion de foco profundo.',
                    },
                },
                priorityLevel: 'Nivel de prioridad',
                calculatedReward: 'Recompensa calculada',
                launchMission: 'Agregar misión',
                activeMissions: 'MISIONES ACTIVAS',
                searchDatabase: 'BUSCAR EN LA BASE DE DATOS...',
                searchMissionsAria: 'Buscar misiones',
                prioritySuffix: 'Prioridad',
                reward: 'Recompensa',
                completeMissionAria: 'Completar mision',
                reopenMissionAria: 'Reabrir mision',
                deleteMissionAria: 'Eliminar mision',
                uplinkStable: 'ENLACE ESTABLE',
                active: 'ACTIVAS',
                total: 'TOTAL',
            },
            character: {
                hunterProfile: 'Perfil del cazador',
                levelRole: 'Nivel {{level}} {{role}}',
                experience: 'Experiencia',
                selectCharacter: 'Seleccionar personaje',
                loadout: 'Equipamiento',
                weaponSlot: 'Ranura de arma',
                shieldSlot: 'Ranura de escudo',
                accessorySlot: 'Ranura de accesorio',
                emptySlot: 'Ranura vacia',
                requiredXp: 'XP requerida: {{xp}}',
                unlockedTab: 'Desbloqueados',
                shopTab: 'Tienda',
                noItemsInTabForCategory:
                    'No hay elementos en {{tab}} para {{category}}.',
                equipped: 'EQUIPADO',
                tierEquipment: 'Equipo de categoria {{slot}}.',
                unequip: 'Quitar',
                equipItem: 'Equipar',
                unlock: 'Desbloquear',
                insufficientXp: 'XP insuficiente',
                category: {
                    weapon: 'Armas',
                    shield: 'Escudos',
                    accessory: 'Accesorios',
                },
                slotName: {
                    weapon: 'arma',
                    shield: 'escudo',
                    accessory: 'accesorio',
                },
                profile: {
                    cipher: {
                        role: 'Arquitecta del sistema',
                        description: 'Especialista en estabilizar nodos de enfoque.',
                    },
                    nox: {
                        role: 'Cazador de glitches',
                        description: 'Rompe ciclos de procrastinacion con pulsos de energia.',
                    },
                    vanta: {
                        role: 'Estratega tactica',
                        description: 'Convierte tareas complejas en objetivos medibles.',
                    },
                },
            },
            arena: {
                eyebrow: 'Simulacion de habitos',
                title: 'Arena de anomalias',
                subtitle:
                    'Dispara anomalias hasta vaciar su vida para completar cada tarea.',
                level: 'Nivel',
                totalXp: 'XP total',
                completed: 'Completadas',
                xpEnergyBar: 'Barra de energia XP',
                xpToLevelUp: '{{xp}} XP para subir de nivel',
                activeObjectives: 'Objetivos activos',
                controlsLabel: 'Controles:',
                controlsDetail:
                    'WASD / Flechas para moverte.\nShift para correr.\nEspacio para saltar.\nModo FPS con mira central y disparo con click.',
                enterFpsMode: 'Entrar en modo FPS',
                enterFullscreen: 'Pantalla completa',
                exitFullscreen: 'Salir de pantalla completa',
                exitFullscreenHint: 'Presiona Esc para salir',
                enemyIntegrity: 'Integridad de anomalia',
                hitsNeeded: '{{count}} disparos',
                minimapLabel: 'Minimapa del campo',
                minimapTitle: 'Radar',
                taskConfirmation: 'Confirmación de tarea',
                realWorldCompleted: 'Has completado esta tarea en el mundo real?',
                yesRemoveAnomaly: 'Si, eliminar anomalia',
                notYet: 'Aun no',
                roamingEnemy: 'Anomalia',
                youDied: 'HAS MUERTO',
                deaths: 'Muertes',
                respawningIn: 'Reaparición en...',
                health: 'SALUD',
            },
        },
    },
    en: {
        translation: {
            nav: {
                home: 'HOME',
                operator: 'OPERATOR',
                missions: 'MISSIONS',
                launchMission: 'LAUNCH MISSION',
                languageSelector: 'Language selector',
                mainNavigation: 'Main navigation',
                openMenu: 'Open menu',
                closeMenu: 'Close menu',
            },
            priority: {
                low: 'Low',
                medium: 'Medium',
                high: 'High',
            },
            home: {
                systemOnline: 'System Online: Version 4.0.2-Beta',
                heroDescription:
                    'Transform your habits into an epic digital anomaly hunt. Break the simulation and evolve your reality, one task at a time.',
                configureTasks: 'Configure Tasks',
                customizeOperator: 'Customize Operator',
                operatorEvolution: 'Operator Evolution',
                xpToNextSync: '{{currentXp}} / {{nextLevelXp}} XP TO NEXT SYNC',
                anomaliesHunted: 'Anomalies Hunted',
                activeMissions: 'Active Missions',
                scanning: 'Scanning',
                activeSyncEstablished: 'ACTIVE SYNC ESTABLISHED',
                initializeSequence: 'INITIALIZE SEQUENCE',
                launchMission: 'LAUNCH MISSION',
                feature: {
                    focusScanner: {
                        title: 'Focus Scanner',
                        description:
                            'Advanced algorithmic detection of your active habits. Automatically tracks engagement and identifies environmental triggers.',
                    },
                    executionPulse: {
                        title: 'Execution Pulse',
                        description:
                            'Real-time reward circuitry with immediate feedback as you neutralize tasks.',
                    },
                    operatorEvolution: {
                        title: 'Operator Evolution',
                        description:
                            'Progress through the ranks, unlock encrypted gear, and specialize your operator class.',
                    },
                },
                steps: {
                    mapProtocols: {
                        title: 'Map Protocols',
                        description: 'Define your habits as targets in the simulation.',
                    },
                    executeHunt: {
                        title: 'Execute Hunt',
                        description: 'Track your progress and eliminate daily tasks.',
                    },
                    ascend: {
                        title: 'Ascend',
                        description: 'Level up and customize your operator dashboard.',
                    },
                },
            },
            tasks: {
                taskManagementSystem: 'TASK MANAGEMENT SYSTEM',
                missionConfig: 'MISSION CONFIGURATION',
                missionConfigDescription:
                    'Define tasks with priority to calibrate rewards and urgency.',
                currentLevel: 'Current Level',
                levelHunter: 'Level {{level}} Hunter',
                createNewMission: 'CREATE NEW MISSION',
                missionTitle: 'Mission Title',
                missionTitlePlaceholder: 'Enter mission name...',
                description: 'Description',
                descriptionPlaceholder: 'Mission details and objective...',
                noDescription: 'No description',
                seed: {
                    taskWater: {
                        title: 'Drink 2L of water',
                        description: 'Maintain daily hydration.',
                    },
                    taskWorkout: {
                        title: 'Train for 30 minutes',
                        description: 'Main energy training block.',
                    },
                    taskReading: {
                        title: 'Read 20 pages',
                        description: 'Deep focus session.',
                    },
                },
                priorityLevel: 'Priority Level',
                calculatedReward: 'Calculated Reward',
                launchMission: 'Add Mission',
                activeMissions: 'ACTIVE MISSIONS',
                searchDatabase: 'SEARCH DATABASE...',
                searchMissionsAria: 'Search missions',
                prioritySuffix: 'Priority',
                reward: 'Reward',
                completeMissionAria: 'Complete mission',
                reopenMissionAria: 'Reopen mission',
                deleteMissionAria: 'Delete mission',
                uplinkStable: 'UPLINK STABLE',
                active: 'ACTIVE',
                total: 'TOTAL',
            },
            character: {
                hunterProfile: 'Hunter Profile',
                levelRole: 'Level {{level}} {{role}}',
                experience: 'Experience',
                selectCharacter: 'Select Character',
                loadout: 'Loadout',
                weaponSlot: 'Weapon Slot',
                shieldSlot: 'Shield Slot',
                accessorySlot: 'Accessory Slot',
                emptySlot: 'Empty Slot',
                requiredXp: 'Required XP: {{xp}}',
                unlockedTab: 'Unlocked',
                shopTab: 'Shop',
                noItemsInTabForCategory:
                    'No items in {{tab}} for {{category}}.',
                equipped: 'EQUIPPED',
                tierEquipment: '{{slot}} tier equipment.',
                unequip: 'Unequip',
                equipItem: 'Equip Item',
                unlock: 'Unlock',
                insufficientXp: 'Insufficient XP',
                category: {
                    weapon: 'Weapons',
                    shield: 'Shields',
                    accessory: 'Accessories',
                },
                slotName: {
                    weapon: 'weapon',
                    shield: 'shield',
                    accessory: 'accessory',
                },
                profile: {
                    cipher: {
                        role: 'System Architect',
                        description: 'Specialist in stabilizing focus nodes.',
                    },
                    nox: {
                        role: 'Glitch Hunter',
                        description: 'Breaks procrastination loops with energy pulses.',
                    },
                    vanta: {
                        role: 'Tactical Strategist',
                        description: 'Turns complex tasks into measurable objectives.',
                    },
                },
            },
            arena: {
                eyebrow: 'Habit simulation',
                title: 'Anomaly arena',
                subtitle:
                    'Fire at anomalies until their health is depleted to complete each task.',
                level: 'Level',
                totalXp: 'Total XP',
                completed: 'Completed',
                xpEnergyBar: 'XP energy bar',
                xpToLevelUp: '{{xp}} XP to level up',
                activeObjectives: 'Active objectives',
                controlsLabel: 'Controls:',
                controlsDetail:
                    'WASD / Arrows to move.\nShift to sprint.\nSpace to jump.\nFPS mode with centered crosshair and click to fire.',
                enterFpsMode: 'Enter FPS mode',
                enterFullscreen: 'Full screen',
                exitFullscreen: 'Exit full screen',
                exitFullscreenHint: 'Press Esc to exit',
                enemyIntegrity: 'Anomaly integrity',
                hitsNeeded: '{{count}} hits',
                minimapLabel: 'Battlefield minimap',
                minimapTitle: 'Radar',
                taskConfirmation: 'Task confirmation',
                realWorldCompleted: 'Have you completed this task in the real world?',
                yesRemoveAnomaly: 'Yes, remove anomaly',
                notYet: 'Not yet',
                roamingEnemy: 'Anomaly',
                youDied: 'YOU DIED',
                deaths: 'Deaths',
                respawningIn: 'Respawning in...',
                health: 'HEALTH',
            },
        },
    },
} as const

function getInitialLanguage(): 'es' | 'en' {
    if (typeof window === 'undefined') return DEFAULT_LANGUAGE
    const saved = window.localStorage.getItem(STORAGE_KEY)
    return saved === 'en' ? 'en' : 'es'
}

void i18n.use(initReactI18next).init({
    resources,
    lng: getInitialLanguage(),
    fallbackLng: DEFAULT_LANGUAGE,
    supportedLngs: ['es', 'en'],
    interpolation: {
        escapeValue: false,
    },
})

i18n.on('languageChanged', (lng) => {
    if (typeof window === 'undefined') return
    if (lng !== 'es' && lng !== 'en') return
    window.localStorage.setItem(STORAGE_KEY, lng)
    document.documentElement.lang = lng
})

if (typeof document !== 'undefined') {
    document.documentElement.lang = i18n.language
}

export default i18n
