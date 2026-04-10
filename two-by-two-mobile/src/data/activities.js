export const ACTIVITIES = {
  study_language: {
    id: 'study_language',
    label: 'Study Hungarian',
    description: 'Flashcards, grammar drills, repeat "köszönöm" 47 times. Your brain hurts but the words are sticking.',
    descriptions: [
      'Flashcards, grammar drills, repeat "köszönöm" 47 times. Your brain hurts but the words are sticking.',
      'The subjunctive tense makes you want to cry. But then you conjugate one correctly and feel invincible.',
      'You practice ordering food in your head: "Egy lángost kérek." The pronunciation still needs work.',
      'Drilling vocabulary at the kitchen table. Your companion quizzes you. You get 60% right. Progress.',
      'Hungarian has 18 cases. You know maybe 7. Time to close the gap.',
    ],
    effects: { language: [1, 2], spirit: [-1, 0], skills: [0, 0] },
  },
  street_contact: {
    id: 'street_contact',
    label: 'Street Contacting',
    description: 'Stand on Deák tér and talk to strangers. Most walk past. Some stop. One argues about the Habsburgs.',
    descriptions: [
      'Stand on Deák tér and talk to strangers. Most walk past. Some stop. One argues about the Habsburgs.',
      'The tram stop crowd at Blaha Lujza tér. You approach a dozen people. Two listen. One takes a pamphlet.',
      'Westend City Center is packed. A teenager stops to practice English with you. His mom drags him away.',
      'Rain-soaked contacting near Keleti station. Everyone rushes past. But one woman stops and says "Érdekesnek tűnik."',
      'Vörösmarty tér, tourist season. You accidentally contact another pair of missionaries.',
    ],
    effects: { language: [0, 1], spirit: [-2, 1], skills: [0, 1] },
  },
  teach_lesson: {
    id: 'teach_lesson',
    label: 'Teach Investigator',
    description: 'Visit your most promising investigator and teach the next discussion. Bring your best Hungarian.',
    descriptions: [
      'Visit your most promising investigator and teach the next discussion. Bring your best Hungarian.',
      'The investigator opens the door with tea already made. A good sign. Time to teach.',
      'You fumble through the discussion in Hungarian. The investigator nods politely. Did they understand?',
      'Your companion handles the scripture, you handle the testimony. Teamwork makes the lesson click.',
      'The investigator has questions — lots of them. That means they\'re thinking about it.',
    ],
    effects: { skills: [1, 1], language: [0, 1], spirit: [0, 1] },
    special: 'advanceInvestigator',
  },
  companion_study: {
    id: 'companion_study',
    label: 'Companion Study',
    description: 'Study together, quiz each other, practice role-plays. Elder Thompson tries very hard.',
    descriptions: [
      'Study together, quiz each other, practice role-plays. Your companion tries very hard.',
      'Role-play as investigator and missionary, switch halfway. It\'s awkward but useful.',
      'Your companion has an insight about the lesson plan that actually makes sense. Huh.',
      'Thirty minutes of shared study, thirty minutes of planning. The unity helps.',
      'You review each other\'s language flashcards. Your companion corrects your pronunciation. Repeatedly.',
    ],
    effects: { skills: [0, 1], spirit: [0, 1] },
    rapportEffect: [1, 2],
  },
  personal_study: {
    id: 'personal_study',
    label: 'Personal Study',
    description: 'Scripture study, journal writing, pondering life 6,000 miles from home.',
    descriptions: [
      'Scripture study, journal writing, pondering life 6,000 miles from home.',
      'Alma 26 hits different when you\'re actually a missionary. You underline half the page.',
      'Journal entry: "Today I understood a sentence on the tram. Small victories."',
      'Quiet morning with the scriptures and a cup of hot chocolate. The Spirit is close.',
      'You read your patriarchal blessing for the dozenth time. It still gives you chills.',
    ],
    effects: { spirit: [1, 2], obedience: [0, 1] },
  },
  member_visit: {
    id: 'member_visit',
    label: 'Visit Members',
    description: 'Sister Kovács insists you eat. Brother Tóth wants to practice his English. The kids show you their hamster.',
    descriptions: [
      'Sister Kovács insists you eat. Brother Tóth wants to practice his English. The kids show you their hamster.',
      'The branch president\'s family feeds you gulyás until you can barely walk. They refuse payment.',
      'Brother Farkas shows you his stamp collection for 45 minutes. You\'re bored but he glows.',
      'A member family invites you over. Their daughter translates. The Spirit fills their tiny apartment.',
      'Tea (herbal, obviously), pogácsa, and conversation with the Relief Society president. She has referrals.',
    ],
    effects: { spirit: [0, 1], language: [0, 1], budget: [-500, -200] },
  },
  service_project: {
    id: 'service_project',
    label: 'Service Project',
    description: 'Help move furniture, clean the church building, or weed someone\'s garden on Dózsa György út.',
    descriptions: [
      'Help move furniture, clean the church building, or weed someone\'s garden on Dózsa György út.',
      'The elderly neighbor needs help carrying groceries up five flights. No elevator. Your legs burn.',
      'Painting the church building\'s community room. You get more paint on each other than the walls.',
      'Raking leaves at the cemetery behind the church. Quiet, honest work. Your companion hums a hymn.',
      'Helping a member family move apartments across Budapest. Five tram rides with boxes.',
    ],
    effects: { spirit: [1, 2], skills: [0, 0], obedience: [0, 1], language: [0, 0] },
  },
  english_class: {
    id: 'english_class',
    label: 'Teach English Class',
    description: 'Free English lessons at the church. Half the class is here for English. Half might be here for more.',
    descriptions: [
      'Free English lessons at the church. Half the class is here for English. Half might be here for more.',
      'The class argues about irregular verbs. A university student stays after to ask about the church.',
      'You teach "going to" vs "will." Nobody cares. But the cookies bring them back every week.',
      'A new face tonight — an engineer who wants to work abroad. She asks surprisingly deep questions after class.',
      'The regulars are back. They\'re more like friends now. One finally agrees to meet with missionaries.',
    ],
    effects: { skills: [0, 1], language: [0, 0], spirit: [0, 1] },
    special: 'englishClassContact',
  },
  buy_food: {
    id: 'buy_food',
    label: 'Buy Groceries',
    description: 'Fresh peppers, kolbász, kenyér, and a túró rudi for the walk home. The basics of missionary survival.',
    descriptions: [
      'Fresh peppers, kolbász, kenyér, and a túró rudi for the walk home. The basics of missionary survival.',
      'The small CBA near your flat. The cashier knows you by now. "Sziasztok, Elder!"',
      'Tesco run for the week. You discover a new flavor of túró rudi and buy six.',
      'The piaci néni gives you extra paprika because "you boys are too skinny."',
    ],
    effects: { budget: [-2000, -1000], spirit: [0, 1] },
  },
  buy_peanut_butter: {
    id: 'buy_peanut_butter',
    label: 'Buy Peanut Butter',
    description: 'Imported American peanut butter. Costs more than your weekly food budget, but it tastes like home.',
    descriptions: [
      'Imported American peanut butter. Costs more than your weekly food budget, but it tastes like home.',
      'Skippy, on the top shelf of the import aisle. You cradle it like a newborn.',
      'The Hungarian stuff just isn\'t the same. You splurge on the real thing. No regrets.',
    ],
    effects: { budget: [-3000, -3000], spirit: [3, 3] },
  },
  buy_books: {
    id: 'buy_books',
    label: 'Buy Books',
    description: 'A Hungarian phrasebook with useful phrases like "Hol van a templom?" and a dual-language Book of Mormon.',
    descriptions: [
      'A Hungarian phrasebook with useful phrases like "Hol van a templom?" and a dual-language Book of Mormon.',
      'You find a used grammar book at the Ecseri flea market. Half the price, twice the character.',
      'An illustrated Hungarian dictionary. Now you know what a "padlizsán" looks like.',
    ],
    effects: { budget: [-1500, -800], language: [1, 2], skills: [0, 1] },
  },
  buy_clothes: {
    id: 'buy_clothes',
    label: 'Buy Clothes',
    description: 'A crisp new white shirt. Looking sharp, Elder. The mission president would approve.',
    descriptions: [
      'A crisp new white shirt. Looking sharp, Elder. The mission president would approve.',
      'Your shoes have holes. Time for new ones from the Váci utca shop.',
      'A new tie from the market. Your companion says it looks "very Hungarian." You\'re not sure if that\'s a compliment.',
    ],
    effects: { budget: [-2000, -1500], obedience: [1, 2] },
  },
  visit_investigator: {
    id: 'visit_investigator',
    label: 'Visit Investigator',
    description: 'Visit your investigator at their home for a personal lesson. The personal touch makes a difference.',
    descriptions: [
      'Visit your investigator at their home for a personal lesson. The personal touch makes a difference.',
      'Ring the buzzer, climb four flights, catch your breath, then teach. The Budapest missionary cardio plan.',
      'Their apartment smells like pörkölt. They offer you some before the lesson. You accept obviously.',
      'The investigator opens with "I read the chapter you assigned." Today is going to be a good lesson.',
    ],
    effects: { skills: [1, 2], language: [0, 1], spirit: [0, 1] },
    special: 'advanceInvestigator',
  },
  tracting: {
    id: 'tracting',
    label: 'Go Tracting',
    description: 'Take the tram to a new district and knock doors. Challenges, danger, temptations — and maybe someone who needs to hear your message.',
    descriptions: [
      'Take the tram to a new district and knock doors. Challenges, danger, temptations — and maybe someone who needs to hear your message.',
      'Panel lakás doors, one after another. Most don\'t open. Some curse. One invites you in for pálinka.',
      'A new block in the XIII. district. The elevator is broken so you walk all ten floors. Good exercise.',
      'Tracting in Buda, up the hill. Nicer apartments, politer refusals. One old man invites you back.',
    ],
    effects: { spirit: [-1, 1], skills: [0, 1], language: [0, 1] },
    special: 'tracting',
  },
}

export const PDAY_ACTIVITIES = {
  letters_home: {
    id: 'letters_home',
    label: 'Write Letters Home',
    description: 'Dear Mom and Dad, Budapest is amazing/freezing/confusing. I love/miss/need you. Send Reese\'s.',
    descriptions: [
      'Dear Mom and Dad, Budapest is amazing/freezing/confusing. I love/miss/need you. Send Reese\'s.',
      'You write three pages and realize you\'ve been crying. You add a PS: "I\'m fine, really."',
      'A long email to your best friend. You leave out the hard parts. You include the funny ones.',
      'Your little sister sent photos of the dog. You stare at them for ten minutes.',
    ],
    effects: { spirit: [1, 3] },
  },
  laundry: {
    id: 'laundry',
    label: 'Do Laundry',
    description: 'The washing machine in the basement makes sounds no machine should make. But it works. Mostly.',
    descriptions: [
      'The washing machine in the basement makes sounds no machine should make. But it works. Mostly.',
      'You hang shirts on the balcony line. They freeze-dry in the winter wind.',
      'Your companion shrunk his favorite shirt. He blames the Hungarian water.',
    ],
    effects: { obedience: [0, 1], spirit: [-1, 0] },
    special: 'resetLaundry',
  },
  explore_city: {
    id: 'explore_city',
    label: 'Explore Budapest',
    description: 'Walk along the Danube, ride tram 4/6 end to end, find a new street you\'ve never seen. This city is incredible.',
    descriptions: [
      'Walk along the Danube, ride tram 4/6 end to end, find a new street you\'ve never seen. This city is incredible.',
      'You discover a tiny courtyard passage between buildings. There\'s a cafe with a cat sleeping in the window.',
      'Gellért Hill at sunset. The whole city spreads out beneath you, gold and glittering.',
      'You ride the M1 metro — the oldest on the continent. It\'s beautiful and slightly terrifying.',
      'A wrong turn leads to the ruins of a Roman amphitheater in Óbuda. Budapest never stops surprising.',
    ],
    effects: { spirit: [1, 2], language: [0, 1], obedience: [-1, 0] },
  },
  sports: {
    id: 'sports',
    label: 'Sports with Members',
    description: 'Basketball at the church gym. The Hungarian members play surprisingly aggressive foci instead.',
    descriptions: [
      'Basketball at the church gym. The Hungarian members play surprisingly aggressive foci instead.',
      'Soccer on Margaret Island. You\'re terrible but the members love your enthusiasm.',
      'Ping-pong tournament in the church basement. Brother Tóth is undefeated. Still.',
      'A scrappy basketball game. The young men play like they have something to prove. You pull a hamstring.',
    ],
    effects: { spirit: [1, 2] },
    rapportEffect: [0, 1],
    special: 'injuryRisk',
  },
  shopping: {
    id: 'shopping',
    label: 'Shopping',
    description: 'Stock up at the Tesco on Váci út. Splurge on a túró rudi. Consider the black market peanut butter.',
    descriptions: [
      'Stock up at the Tesco on Váci út. Splurge on a túró rudi. Consider the black market peanut butter.',
      'The Great Market Hall on Fővám tér. Paprika, sausage, embroidered tablecloths. You buy none of it but look at everything.',
      'A quick run to Spar. You buy noodles, bread, and something called "Piritós kenyér" that your companion swears by.',
    ],
    effects: { budget: [-3000, -1000], spirit: [0, 1] },
  },
  pday_study: {
    id: 'pday_study',
    label: 'Extra Study',
    description: 'Everyone else is relaxing, but you crack open the grammar book. The subjunctive isn\'t going to learn itself.',
    descriptions: [
      'Everyone else is relaxing, but you crack open the grammar book. The subjunctive isn\'t going to learn itself.',
      'You listen to Hungarian radio and try to follow along. You catch every fifth word. Improvement.',
      'Flashcards in the park. It\'s your P-Day but the language won\'t wait.',
    ],
    effects: { language: [1, 2], skills: [0, 1], spirit: [-1, 0] },
  },
  companion_activity: {
    id: 'companion_activity',
    label: 'Companion Outing',
    description: 'Grab lángos at the market, walk up Gellért Hill, or just sit by the Danube and talk about home.',
    descriptions: [
      'Grab lángos at the market, walk up Gellért Hill, or just sit by the Danube and talk about home.',
      'You find a cheap kürtőskalács stand and eat two each. Your companion tells you about his family.',
      'Walking through the park together, no agenda. Sometimes the best companion time is unstructured.',
      'You share mission stories and laugh until your sides hurt. This is what P-Day is for.',
    ],
    effects: { spirit: [0, 1] },
    rapportEffect: [1, 2],
  },
}

export const ACTIVITY_LIST = Object.values(ACTIVITIES)
export const PDAY_ACTIVITY_LIST = Object.values(PDAY_ACTIVITIES)

/**
 * Get a random description variant for an activity.
 * Falls back to the default `description` if no variants exist.
 */
export function getActivityDescription(activity) {
  if (activity.descriptions && activity.descriptions.length > 0) {
    return activity.descriptions[Math.floor(Math.random() * activity.descriptions.length)]
  }
  return activity.description
}
