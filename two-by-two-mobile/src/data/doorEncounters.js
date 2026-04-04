/**
 * Door encounter pool for tracting.
 * ~30% positive (potential investigator contact)
 * ~30% neutral (not home, polite refusal)
 * ~40% challenge (hostile, debate, temptation, anti-church, language barrier)
 */

// ─── POSITIVE ENCOUNTERS (find someone interested) ───

export const POSITIVE_ENCOUNTERS = [
  {
    id: 'curious_grandmother',
    title: 'Curious Grandmother',
    description: 'A tiny woman in a housecoat opens the door. She peers at your name tag, then at your face. "Americans? My grandson lives in Chicago. Come in, come in. I made pogácsa."',
    choices: [
      {
        label: 'Accept and share your message',
        statCheck: 'language',
        successChance: 0.5,
        resultGood: {
          text: 'She listens intently, asking sharp questions about family and eternity. She lost her husband last year. Your words land. She wants to hear more.',
          effects: { spirit: 2, skills: 1 },
          contact: true,
        },
        resultBad: {
          text: 'You stumble over a key word and accidentally say her husband is "in the refrigerator" instead of "in a better place." She laughs so hard she cries. She likes you anyway.',
          effects: { spirit: 1, language: 1 },
          contact: true,
        },
      },
      {
        label: 'Keep it brief — leave a pamphlet',
        successChance: 0.3,
        resultGood: {
          text: 'She reads the pamphlet title and nods. "I\'ll think about it." She means it.',
          effects: { skills: 1 },
          contact: false,
        },
        resultBad: {
          text: 'She uses the pamphlet as a coaster. But she remembers your face.',
          effects: {},
          contact: false,
        },
      },
    ],
  },
  {
    id: 'young_mother',
    title: 'Young Mother',
    description: 'A woman in her twenties opens the door, a toddler on her hip. She looks exhausted. "What?" Then she notices the Book of Mormon. "Oh. Actually... come in. I need to talk to someone."',
    choices: [
      {
        label: 'Listen first, then share',
        statCheck: 'spirit',
        successChance: 0.5,
        resultGood: {
          text: 'You listen for twenty minutes about her divorce, her mother-in-law, her loneliness. Then you share the simplest version of your message. Her eyes well up. "When can you come back?"',
          effects: { spirit: 3, skills: 1 },
          contact: true,
        },
        resultBad: {
          text: 'You listen, but your companion interrupts with a scripture. Her face closes. "I think you should go." A missed connection.',
          effects: { spirit: -1 },
          contact: false,
        },
      },
      {
        label: 'Jump straight to the message',
        statCheck: 'skills',
        successChance: 0.3,
        resultGood: {
          text: 'Sometimes directness works. She appreciates the clarity. She\'s interested.',
          effects: { skills: 1 },
          contact: true,
        },
        resultBad: {
          text: 'She needed empathy, not a lesson plan. The door closes gently but firmly.',
          effects: { spirit: -1 },
          contact: false,
        },
      },
    ],
  },
  {
    id: 'retired_teacher',
    title: 'Retired Teacher',
    description: 'A gentleman in a cardigan opens the door. Reading glasses on his forehead. Bookshelves visible behind him. "Mormons? I\'ve read about your people. Come in — I have questions."',
    choices: [
      {
        label: 'Engage his questions honestly',
        statCheck: 'skills',
        successChance: 0.5,
        resultGood: {
          text: 'He grills you for an hour on theology, history, and translation. You hold your ground. He\'s impressed. "You\'re not like the last pair. Come back Thursday."',
          effects: { skills: 2, language: 1 },
          contact: true,
        },
        resultBad: {
          text: 'He asks about the Kinderhook plates and you draw a blank. He sighs. "Read more, young man." But he takes a pamphlet.',
          effects: { skills: 1 },
          contact: false,
        },
      },
      {
        label: 'Bear your testimony simply',
        statCheck: 'spirit',
        successChance: 0.4,
        resultGood: {
          text: 'Your sincerity catches him off guard. "I didn\'t expect... feeling." He agrees to read the book.',
          effects: { spirit: 2 },
          contact: true,
        },
        resultBad: {
          text: '"Feelings are not evidence, son." He\'s polite but dismissive. Back to his books.',
          effects: { spirit: -1 },
          contact: false,
        },
      },
    ],
  },
  {
    id: 'lonely_student',
    title: 'Lonely University Student',
    description: 'A guy your age opens the door in a gaming t-shirt. He looks surprised to see anyone. "Uh... missionaries? I thought you were pizza delivery." He laughs awkwardly. "I mean... I guess come in?"',
    choices: [
      {
        label: 'Be genuine — talk about life, not just church',
        statCheck: 'spirit',
        successChance: 0.55,
        resultGood: {
          text: 'You talk for an hour about loneliness, purpose, leaving home. He tears up. "No one talks about this stuff here." He wants to come to an activity.',
          effects: { spirit: 2, skills: 1 },
          contact: true,
        },
        resultBad: {
          text: 'Good conversation, but he gets a phone call and the moment breaks. He says maybe next time.',
          effects: { spirit: 1 },
          contact: false,
        },
      },
      {
        label: 'Invite him to English class',
        successChance: 0.6,
        resultGood: {
          text: '"Free English? Yeah, I need that for my thesis." Easy win. He\'ll come.',
          effects: { skills: 1 },
          contact: true,
        },
        resultBad: {
          text: '"English class? Nah, I use Duolingo." Door closes. Fair enough.',
          effects: {},
          contact: false,
        },
      },
    ],
  },
  {
    id: 'grieving_widow',
    title: 'Grieving Widow',
    description: 'An elderly woman opens the door with red eyes. A framed photo of a man in uniform sits on the table behind her. "I was just... praying. I think. Is that what you call it?"',
    choices: [
      {
        label: 'Share the Plan of Salvation',
        statCheck: 'skills',
        successChance: 0.5,
        resultGood: {
          text: 'You explain families can be together forever. She grips your hand. "If that\'s true..." The Spirit fills the room. She agrees to a lesson.',
          effects: { spirit: 3, skills: 1 },
          contact: true,
        },
        resultBad: {
          text: 'You explain it well but she\'s not ready. "Too much right now." She thanks you. Maybe someday.',
          effects: { spirit: 1 },
          contact: false,
        },
      },
      {
        label: 'Just sit with her in silence',
        statCheck: 'spirit',
        successChance: 0.4,
        resultGood: {
          text: 'You sit. She talks. You listen. An hour passes. She doesn\'t commit to a lesson but she says: "Come back. Please." That\'s enough.',
          effects: { spirit: 2 },
          contact: true,
        },
        resultBad: {
          text: 'The silence stretches. Your companion fidgets. She lets you go. Neither of you quite connected.',
          effects: {},
          contact: false,
        },
      },
    ],
  },
]

// ─── NEUTRAL ENCOUNTERS (nothing much happens) ───

export const NEUTRAL_ENCOUNTERS = [
  {
    id: 'not_home',
    title: 'Nobody Home',
    description: 'You knock three times. Ring the bell. Wait. Nothing. Just the sound of a television through the wall.',
    autoResolve: true,
    result: { text: 'Silence. On to the next door.', effects: {} },
  },
  {
    id: 'polite_refusal',
    title: 'Polite Refusal',
    description: 'A middle-aged man opens the door. He sees the name tags and immediately shakes his head. "Nem, köszönöm." He closes the door with a kind smile.',
    autoResolve: true,
    result: { text: '"No, thank you." At least he was nice about it.', effects: {} },
  },
  {
    id: 'wrong_address',
    title: 'Wrong Floor',
    description: 'You ring the bell. A confused elderly man opens: "This is the third floor. The Szabós moved to Debrecen." He gestures vaguely upward.',
    autoResolve: true,
    result: { text: 'Wrong address. The hallway smells like cabbage soup.', effects: {} },
  },
  {
    id: 'busy_family',
    title: 'Bad Timing',
    description: 'A harried woman opens the door. Behind her: screaming children, boiling water, a ringing phone. "NOT NOW." The door closes before you can speak.',
    autoResolve: true,
    result: { text: 'Terrible timing. You hear glass break as you walk away.', effects: {} },
  },
  {
    id: 'already_religious',
    title: 'Already Religious',
    description: 'An older woman peers at you. "I\'m Catholic. My mother was Catholic. My grandmother was Catholic." She crosses herself. "Go with God, boys."',
    autoResolve: true,
    result: { text: 'A devout Catholic. Respectful, but immovable. That\'s fair.', effects: {} },
  },
  {
    id: 'sleeping_man',
    title: 'Night Shift Worker',
    description: 'A man in boxers and a stained undershirt opens the door, squinting. "It is 2 PM. I work nights." He looks at you like you\'re from another planet.',
    autoResolve: true,
    result: { text: 'He goes back to sleep. You feel guilty.', effects: { spirit: -1 } },
  },
  {
    id: 'pamphlet_collector',
    title: 'Pamphlet Collector',
    description: 'A cheerful man opens the door. "Ah! Mormons! Excellent." He takes your pamphlet and adds it to a stack of Watchtowers, Hare Krishna flyers, and Amway brochures.',
    autoResolve: true,
    result: { text: 'He collects them all. Not a convert — a collector.', effects: {} },
  },
]

// ─── CHALLENGE ENCOUNTERS ───

export const CHALLENGE_ENCOUNTERS = [
  // --- TYPE 1: HOSTILE / DANGER ---
  {
    id: 'angry_man',
    type: 'hostile',
    title: 'The Angry Atheist',
    description: 'A large man opens the door and immediately turns red. "MISSIONARIES? On MY doorstep?" He jabs a finger at your chest. "You people come here with your American religion—"',
    choices: [
      {
        label: 'Stay calm and apologize',
        statCheck: 'spirit',
        successChance: 0.4,
        resultGood: {
          text: 'Your calm throws him off. He expected a fight. "Well... fine. Just don\'t come back." He closes the door. You exhale. That took courage.',
          effects: { spirit: 1, obedience: 1 },
        },
        resultBad: {
          text: 'He keeps yelling. A neighbor comes out. It\'s humiliating. You walk away, ears burning.',
          effects: { spirit: -3 },
        },
      },
      {
        label: 'Try to engage him',
        statCheck: 'skills',
        successChance: 0.2,
        resultGood: {
          text: 'Against all odds, he pauses. "You\'ve got guts, kid." He won\'t let you in, but he respects you. Small victory.',
          effects: { skills: 2, spirit: 1 },
        },
        resultBad: {
          text: 'He slams the door so hard the hallway shakes. You hear him yelling in Hungarian you can\'t — and don\'t want to — understand.',
          effects: { spirit: -3, skills: -1 },
        },
      },
    ],
  },
  {
    id: 'guard_dog',
    type: 'hostile',
    title: 'The Dog',
    description: 'You ring the bell. No answer. But something hears you. A deep, rumbling growl from behind the gate. Then barking — loud, savage, close. Very close.',
    choices: [
      {
        label: 'Back away slowly',
        successChance: 0.7,
        resultGood: {
          text: 'You back away with dignity. The dog watches. Your companion whispers, "I think it was chained." You don\'t go back to check.',
          effects: {},
        },
        resultBad: {
          text: 'You trip on the step. The dog lunges against the fence. Your heart rate doesn\'t normalize for an hour.',
          effects: { spirit: -2 },
        },
      },
      {
        label: 'Try to befriend it',
        statCheck: 'spirit',
        successChance: 0.3,
        resultGood: {
          text: 'You hold out your hand. The dog sniffs. Its tail wags. The owner appears: "He likes you. That never happens." She invites you for tea.',
          effects: { spirit: 2, skills: 1 },
          contact: true,
        },
        resultBad: {
          text: 'The dog does NOT want to be your friend. You run. Your companion runs faster. Your dignity does not survive.',
          effects: { spirit: -3 },
        },
      },
    ],
  },
  {
    id: 'thrown_water',
    type: 'hostile',
    title: 'Water from Above',
    description: 'You\'re looking up at the building trying to find the right buzzer when — SPLASH. Cold water hits you from a third-floor window. Someone cackles.',
    choices: [
      {
        label: 'Laugh it off',
        statCheck: 'spirit',
        successChance: 0.5,
        resultGood: {
          text: 'You look up, soaking wet, and wave. "Köszönjük! It\'s hot today!" Laughter from multiple windows. One person buzzes you in.',
          effects: { spirit: 2, language: 1 },
          contact: true,
        },
        resultBad: {
          text: 'You try to laugh but you\'re soaked and it\'s November. Your companion hands you a tissue. "That was dignified, Elder."',
          effects: { spirit: -2 },
        },
      },
      {
        label: 'Move to the next building',
        successChance: 0.9,
        resultGood: {
          text: 'Discretion is the better part of valor. And dryness.',
          effects: {},
        },
        resultBad: {
          text: 'The next building has a broken buzzer. This street is cursed.',
          effects: { spirit: -1 },
        },
      },
    ],
  },

  // --- TYPE 2: THEOLOGICAL DEBATE ---
  {
    id: 'philosophy_student',
    type: 'debate',
    title: 'The Philosophy Student',
    description: 'A young man with a Nietzsche tattoo leans against the doorframe. "God is dead, and you\'re trying to sell me a sequel?" He smirks. "Alright. Convince me."',
    choices: [
      {
        label: 'Engage the philosophy',
        statCheck: 'skills',
        successChance: 0.35,
        resultGood: {
          text: 'You talk about Kierkegaard\'s leap of faith. His eyebrows rise. "You actually read?" He can\'t commit, but he\'s intrigued. He gives you his number.',
          effects: { skills: 2, spirit: 1 },
          contact: true,
        },
        resultBad: {
          text: 'He dismantles your argument in three sentences. You feel intellectually outmatched. "Read more, pray less." The door closes.',
          effects: { skills: -1, spirit: -2 },
        },
      },
      {
        label: 'Share your personal story',
        statCheck: 'spirit',
        successChance: 0.4,
        resultGood: {
          text: '"Anecdotes aren\'t evidence," he says. But his voice changes. Something in your story landed. He won\'t admit it, but you can tell.',
          effects: { spirit: 2 },
        },
        resultBad: {
          text: 'He listens politely, then says, "Feelings don\'t prove anything." He\'s not wrong, necessarily. But it stings.',
          effects: { spirit: -1 },
        },
      },
    ],
  },
  {
    id: 'bible_expert',
    type: 'debate',
    title: 'The Bible Scholar',
    description: 'A man opens his door holding a leather-bound Bible. It\'s full of tabs and highlights. "I know my Bible, boys. Let\'s see if you know yours."',
    choices: [
      {
        label: 'Accept the challenge',
        statCheck: 'skills',
        successChance: 0.3,
        resultGood: {
          text: 'You trade verses for twenty minutes. He\'s surprised by your knowledge. "Hm. You\'re not dumb." High praise. He agrees to a discussion.',
          effects: { skills: 3, spirit: 1 },
          contact: true,
        },
        resultBad: {
          text: 'He quotes Revelation. You quote... wrong. He tsks. "Come back when you\'ve done your homework."',
          effects: { skills: -1, spirit: -1 },
        },
      },
      {
        label: 'Focus on the Book of Mormon',
        statCheck: 'language',
        successChance: 0.35,
        resultGood: {
          text: 'You read a passage in Hungarian. Your pronunciation is beautiful. He\'s moved. "I\'ll read this. But I\'m watching."',
          effects: { language: 1, skills: 1, spirit: 1 },
          contact: true,
        },
        resultBad: {
          text: 'He dismisses the Book of Mormon as "fan fiction." Harsh. But at least he took a copy.',
          effects: { spirit: -1 },
        },
      },
    ],
  },

  // --- TYPE 3: TEMPTATION TO SLACK ---
  {
    id: 'cafe_temptation',
    type: 'temptation',
    title: 'The Café',
    description: 'It\'s been two hours and no one has answered. A cozy café on the corner has pastries in the window. Your companion says, "One hot chocolate? We\'ve earned it."',
    choices: [
      {
        label: 'Stay disciplined — keep knocking',
        statCheck: 'obedience',
        successChance: 0.6,
        resultGood: {
          text: 'You press on. Two doors later, someone actually answers. Discipline pays.',
          effects: { obedience: 2, spirit: 1 },
        },
        resultBad: {
          text: 'You press on, but the next three doors are empty. Your feet hurt. You question everything.',
          effects: { obedience: 1, spirit: -2 },
        },
      },
      {
        label: 'Take a break — just a quick one',
        statCheck: 'spirit',
        successChance: 0.4,
        resultGood: {
          text: 'The hot chocolate is incredible. You overhear two women discussing church. You introduce yourself. God works in mysterious ways.',
          effects: { spirit: 2, budget: -500 },
          contact: true,
        },
        resultBad: {
          text: '"Quick break" becomes an hour. You feel guilty. Your companion gives you a look. You lost the momentum.',
          effects: { obedience: -3, spirit: -1, budget: -800 },
        },
      },
    ],
  },
  {
    id: 'beautiful_view',
    type: 'temptation',
    title: 'The View',
    description: 'You turn a corner and Budapest opens up before you. The Parliament, the Danube, Buda Castle golden in the light. Your companion pulls out a camera.',
    choices: [
      {
        label: 'Take a photo and keep working',
        successChance: 0.8,
        resultGood: {
          text: 'One photo. It\'s a beautiful memory and you\'re back to work in thirty seconds. Balance.',
          effects: { spirit: 1 },
        },
        resultBad: {
          text: 'One photo becomes ten. Then a selfie. Then a video. You\'ve lost twenty minutes.',
          effects: { obedience: -1 },
        },
      },
      {
        label: 'This is why we\'re here — journal about it',
        statCheck: 'spirit',
        successChance: 0.5,
        resultGood: {
          text: 'You write three sentences that capture something real. The beauty of the city fills your spirit. You feel renewed.',
          effects: { spirit: 3 },
        },
        resultBad: {
          text: 'An hour of journaling later, you\'ve accomplished nothing missionary-wise. Beautiful journal entry though.',
          effects: { spirit: 1, obedience: -2 },
        },
      },
    ],
  },

  // --- TYPE 4: ANTI-CHURCH ---
  {
    id: 'ex_member',
    type: 'anti_church',
    title: 'The Ex-Member',
    description: 'A woman opens the door. She sees the name tags and her face hardens. "I was a member for ten years. I know more about your church than you do. And I left."',
    choices: [
      {
        label: 'Ask what happened',
        statCheck: 'spirit',
        successChance: 0.3,
        resultGood: {
          text: 'She tells her story. It\'s complicated and sad. You listen without defending. "You\'re the first missionaries who actually listened." She won\'t come back, but she softens.',
          effects: { spirit: 2, skills: 1 },
        },
        resultBad: {
          text: 'Her story is painful and specific. You have no answers for what she experienced. You leave feeling heavy.',
          effects: { spirit: -3 },
        },
      },
      {
        label: 'Respectfully leave',
        successChance: 0.8,
        resultGood: {
          text: '"Thank you for your time, sister." She pauses. "...Thank you for not arguing." Small mercies.',
          effects: { obedience: 1 },
        },
        resultBad: {
          text: 'She follows you to the elevator. "Let me tell you what REALLY goes on—" It\'s a long ride down.',
          effects: { spirit: -2 },
        },
      },
    ],
  },
  {
    id: 'conspiracy_theorist',
    type: 'anti_church',
    title: 'The Conspiracy Theorist',
    description: 'A man with newspaper clippings taped to his wall opens the door. "MORMONS! Perfect. I\'ve been researching your church\'s CIA connections."',
    choices: [
      {
        label: 'Hear him out (briefly)',
        statCheck: 'skills',
        successChance: 0.3,
        resultGood: {
          text: 'You nod politely through the CIA theory, the moon base allegations, and something about fluoride. Then pivot. "Can I share what I actually believe?" He pauses. "...Fine."',
          effects: { skills: 1, spirit: 1 },
          contact: true,
        },
        resultBad: {
          text: 'Thirty minutes in, he\'s moved to lizard people. Your companion is making "abort" eyes. You escape, but barely.',
          effects: { spirit: -2 },
        },
      },
      {
        label: 'Politely decline and leave',
        successChance: 0.9,
        resultGood: {
          text: '"God bless, brother." He\'s already back to his research. You count it as an encounter.',
          effects: {},
        },
        resultBad: {
          text: 'He shouts after you down the hallway. The whole floor heard.',
          effects: { spirit: -1 },
        },
      },
    ],
  },

  // --- TYPE 5: LANGUAGE BARRIER ---
  {
    id: 'fast_talker',
    type: 'language',
    title: 'The Speed Talker',
    description: 'A woman opens the door and immediately begins speaking. Fast. Impossibly fast. You catch "igen," "nem," and possibly "ketchup." Everything else is a blur.',
    choices: [
      {
        label: 'Try your best Hungarian',
        statCheck: 'language',
        successChance: 0.35,
        resultGood: {
          text: 'You catch enough. She\'s inviting you to her son\'s birthday party. "Bring the book!" She means the Book of Mormon. You think. You hope.',
          effects: { language: 2, spirit: 1 },
          contact: true,
        },
        resultBad: {
          text: 'You say "igen" at the wrong moment and apparently agree to buy her refrigerator. You leave confused. She leaves confused.',
          effects: { language: 1, spirit: -1 },
        },
      },
      {
        label: 'Ask her to slow down',
        statCheck: 'language',
        successChance: 0.5,
        resultGood: {
          text: '"Lassan, kérem!" She slows down. You have a real exchange. Your Hungarian levels up in real-time.',
          effects: { language: 2 },
        },
        resultBad: {
          text: 'She slows down but you still can\'t follow. She pats your cheek sympathetically. "Szegény fiú." Poor boy.',
          effects: { language: 1, spirit: -1 },
        },
      },
    ],
  },
  {
    id: 'deaf_grandpa',
    type: 'language',
    title: 'The Hearing Aid',
    description: 'An ancient man opens the door. He cups his hand to his ear. "MI??" You realize this is going to be a challenge in any language.',
    choices: [
      {
        label: 'Speak loudly and clearly',
        statCheck: 'language',
        successChance: 0.4,
        resultGood: {
          text: 'You shout the first discussion at volume 11. He nods. "I was in the war. I\'ve seen God." He invites you back. His hearing aid works when he remembers to turn it on.',
          effects: { language: 1, spirit: 2 },
          contact: true,
        },
        resultBad: {
          text: '"MI??" he repeats. For ten minutes. You shout. He shouts. The neighbors shout for you both to stop.',
          effects: { spirit: -1, language: 1 },
        },
      },
      {
        label: 'Write a note and leave a pamphlet',
        successChance: 0.5,
        resultGood: {
          text: 'You write: "We\'d like to visit. Here is a gift." He reads it. Smiles. Pats your hand. Takes the book.',
          effects: { skills: 1 },
        },
        resultBad: {
          text: 'He squints at your handwriting. "Your Hungarian looks like a doctor\'s prescription." He keeps the pamphlet anyway.',
          effects: {},
        },
      },
    ],
  },
  {
    id: 'dialect_speaker',
    type: 'language',
    title: 'Rural Dialect',
    description: 'A woman from the countryside opens the door. She speaks Hungarian, technically, but her dialect makes Budapest Hungarian sound like a different language.',
    choices: [
      {
        label: 'Push through — communicate by feeling',
        statCheck: 'spirit',
        successChance: 0.4,
        resultGood: {
          text: 'Language is only half communication. Your sincerity bridges the gap. She understands enough. She is moved.',
          effects: { spirit: 2, language: 1 },
          contact: true,
        },
        resultBad: {
          text: 'You say something that makes her laugh for two solid minutes. You never find out what. The dialect defeats you.',
          effects: { language: 1, spirit: -1 },
        },
      },
      {
        label: 'Ask if anyone else is home who speaks differently',
        successChance: 0.5,
        resultGood: {
          text: 'Her teenage granddaughter appears. Standard Hungarian. She translates. "Grandma says you\'re cute and she has cake."',
          effects: { spirit: 1, language: 1 },
        },
        resultBad: {
          text: 'No one else home. She shrugs sympathetically and offers you a tomato from her balcony garden. Kindness needs no translation.',
          effects: { spirit: 1 },
        },
      },
    ],
  },
]

/**
 * Roll a random encounter for a given door.
 * @param {string} difficulty - 'easy' | 'medium' | 'hard'
 * @returns {object} encounter from one of the pools
 */
export function rollDoorEncounter(difficulty) {
  // Difficulty affects the ratio of positive vs challenge encounters
  const challengeWeight = { easy: 0.30, medium: 0.40, hard: 0.50 }[difficulty] || 0.40
  const positiveWeight = { easy: 0.35, medium: 0.28, hard: 0.20 }[difficulty] || 0.28
  // Remainder is neutral

  const roll = Math.random()

  if (roll < positiveWeight) {
    return { ...pickRandom(POSITIVE_ENCOUNTERS), pool: 'positive' }
  }
  if (roll < positiveWeight + challengeWeight) {
    return { ...pickRandom(CHALLENGE_ENCOUNTERS), pool: 'challenge' }
  }
  return { ...pickRandom(NEUTRAL_ENCOUNTERS), pool: 'neutral' }
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}
