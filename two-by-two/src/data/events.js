export const EVENTS = [
  {
    id: 'tram_debate',
    title: 'Tram Theology',
    description: 'A man on tram 4 spots your name tag and launches into a passionate monologue about the Book of Abraham papyri. Other passengers are watching. He\'s surprisingly well-informed.',
    condition: (state) => state.stats.language > 20,
    choices: [
      {
        label: 'Engage the debate',
        resultGood: {
          text: 'You hold your own. He\'s impressed by your composure and your Hungarian. "Nem rossz, fiatalember." He takes a pamphlet.',
          effects: { skills: 3, language: 2, spirit: 2 },
        },
        resultBad: {
          text: 'You stumble over a key word and accidentally call the Book of Abraham a "cookbook." The whole tram laughs. The man pats your shoulder sympathetically.',
          effects: { spirit: -3, language: 1, skills: 1 },
        },
        successChance: 0.4,
        statCheck: 'language',
      },
      {
        label: 'Smile and deflect',
        resultGood: {
          text: '"Köszönöm, szép napot!" You exit at the next stop with dignity intact. Elder Thompson is relieved.',
          effects: { spirit: 2 },
        },
        resultBad: {
          text: 'You try to deflect but he follows you off the tram and talks for 20 more minutes. You miss your appointment.',
          effects: { spirit: -1 },
        },
        successChance: 0.7,
      },
    ],
  },
  {
    id: 'kocsonya',
    title: 'Sister Kovács\'s Kocsonya',
    description: 'Sister Kovács has made her famous kocsonya — cold meat jelly with paprika. It wobbles menacingly on the plate. She watches you with expectant eyes. Elder Thompson has gone pale.',
    choices: [
      {
        label: 'Eat it. All of it.',
        resultGood: {
          text: 'You power through. It\'s... actually not terrible? Sister Kovács beams. "Ügyes fiú!" She packs you leftovers. You can\'t refuse those either.',
          effects: { spirit: 2 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You manage three bites before your body stages a revolt. Sister Kovács looks devastated. You spend the evening in the bathroom.',
          effects: { spirit: -3 },
          rapportEffect: 1,
        },
        successChance: 0.5,
        statCheck: 'spirit',
      },
      {
        label: 'Politely decline',
        resultGood: {
          text: '"Nagyon kedves, de nem vagyok éhes." Sister Kovács nods knowingly. She brings out palacsinta instead. Elder Thompson could cry with relief.',
          effects: { spirit: 1 },
        },
        resultBad: {
          text: 'Sister Kovács\'s face falls. "You don\'t like Hungarian food?" The guilt is enormous. The visit is awkward from here.',
          effects: { spirit: -1 },
          rapportEffect: -1,
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'package_from_home',
    title: 'Package from Home',
    description: 'A cardboard box sits on your desk. The return address is your home ward. It\'s heavier than expected. Elder Thompson is jealous.',
    choices: [
      {
        label: 'Open it now',
        resultGood: {
          text: 'Reese\'s cups, beef jerky, a letter from your little sister with a crayon drawing of you with a name tag. Your heart is very full.',
          effects: { spirit: 5, obedience: -1 },
        },
        resultBad: {
          text: 'Homesick wave hits hard. The smell of your mom\'s cookies is too much. You sit on your bed for 20 minutes staring at a family photo.',
          effects: { spirit: -2, obedience: -1 },
        },
        successChance: 0.6,
        statCheck: 'spirit',
      },
      {
        label: 'Wait until evening',
        resultGood: {
          text: 'You save it for after dinner. The anticipation makes it sweeter. Elder Thompson gets a Reese\'s. Rapport restored.',
          effects: { spirit: 3, obedience: 1 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'You wait, but the curiosity gnaws at you all day. You\'re distracted during studies. Should\'ve just opened it.',
          effects: { spirit: 1, obedience: 1 },
        },
        successChance: 0.7,
      },
    ],
  },
  {
    id: 'stray_cat',
    title: 'The Stray Cat',
    description: 'A scrawny orange tabby follows you home from Váci utca. It sits outside your apartment door and meows with devastating persistence. Elder Thompson has already named it "Moroni."',
    choices: [
      {
        label: 'Adopt Moroni',
        resultGood: {
          text: 'Moroni settles in immediately. He sleeps on your scriptures. The Zone Leader must never know about this.',
          effects: { spirit: 4, obedience: -3 },
          rapportEffect: 2,
          flags: { catAdopted: true },
        },
        resultBad: {
          text: 'Moroni destroys your white shirts and the landlord threatens eviction. You spend a week hiding a cat from everyone.',
          effects: { spirit: 1, obedience: -4, budget: -2000 },
          flags: { catAdopted: true },
        },
        successChance: 0.5,
      },
      {
        label: 'Leave it outside',
        resultGood: {
          text: 'You resist the meowing. It\'s the responsible thing. Elder Thompson gives you the silent treatment for two hours.',
          effects: { obedience: 2, spirit: -1 },
          rapportEffect: -1,
        },
        resultBad: {
          text: 'You walk away but the guilt is crushing. You hear meowing in your dreams. Elder Thompson won\'t stop talking about it.',
          effects: { spirit: -3, obedience: 2 },
          rapportEffect: -2,
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'heating_breaks',
    title: 'The Frozen Flat',
    description: 'It\'s -12°C outside and the radiator in your apartment has stopped working. Your breath is visible indoors. Elder Thompson is wearing three sweaters and his coat to bed.',
    choices: [
      {
        label: 'Call the landlord',
        resultGood: {
          text: 'The landlord sends someone the same day. Miracle. Hot water and warmth by evening. Elder Thompson weeps with joy.',
          effects: { spirit: 2, budget: -1500 },
        },
        resultBad: {
          text: '"Holnap, holnap." Tomorrow, always tomorrow. Three days of freezing before someone shows up. Your productivity craters.',
          effects: { spirit: -4, language: -1 },
        },
        successChance: 0.4,
        statCheck: 'language',
      },
      {
        label: 'Tough it out',
        resultGood: {
          text: 'You layer up, do jumping jacks between study sessions, and drink ungodly amounts of tea. Character building.',
          effects: { spirit: -1, obedience: 2 },
        },
        resultBad: {
          text: 'You both catch a cold. A week of sniffling through discussions and contacting with red noses. Investigators keep their distance.',
          effects: { spirit: -4, skills: -2 },
        },
        successChance: 0.4,
      },
    ],
  },
  {
    id: 'jw_contact',
    title: 'Reverse Missionaries',
    description: 'Two Jehovah\'s Witnesses in suits approach you on Deák tér. They\'re carrying Watchtower magazines. They clearly see your name tag. Nobody moves.',
    choices: [
      {
        label: 'Discuss theology',
        resultGood: {
          text: 'A surprisingly respectful 30-minute conversation about eschatology. You both walk away impressed. Neither converts. Elder Thompson takes notes furiously.',
          effects: { skills: 3, spirit: 2, language: 1 },
        },
        resultBad: {
          text: 'It devolves into a scripture-quoting contest that neither of you wins. Passersby assume you\'re both crazy. A tourist takes a photo.',
          effects: { skills: 1, spirit: -2 },
        },
        successChance: 0.4,
        statCheck: 'skills',
      },
      {
        label: '"Nem, köszönöm"',
        resultGood: {
          text: 'You decline with perfect Hungarian and a knowing smile. They nod. Professional respect. The irony is delicious.',
          effects: { spirit: 2, language: 1 },
        },
        resultBad: {
          text: 'They\'re persistent. You end up awkwardly speed-walking away from people doing exactly what you do every day. The cognitive dissonance is real.',
          effects: { spirit: -1 },
        },
        successChance: 0.7,
      },
    ],
  },
  {
    id: 'companion_language_fail',
    title: '"Golden Potatoes"',
    description: 'Elder Thompson tried to tell an investigator they have a "golden heart" (arany szív) but accidentally said something involving "golden potatoes" (arany krumpli). Everyone in the room is staring.',
    choices: [
      {
        label: 'Laugh with him',
        resultGood: {
          text: 'You both crack up. The investigator joins in. "Arany krumpli" becomes an inside joke. The lesson continues with everyone in a better mood.',
          effects: { spirit: 2 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You laugh a little too hard. Elder Thompson thinks you\'re laughing AT him. Awkward silence. You try to recover but the damage is done.',
          effects: { spirit: 1 },
          rapportEffect: -1,
        },
        successChance: 0.7,
      },
      {
        label: 'Correct him gently',
        resultGood: {
          text: 'You smoothly provide the right word. Elder Thompson is grateful. The investigator is impressed by your teamwork.',
          effects: { skills: 1 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'Elder Thompson feels called out in front of the investigator. His confidence takes a hit. He barely speaks for the rest of the lesson.',
          effects: { skills: 1 },
          rapportEffect: -2,
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'zone_conference',
    title: 'Zone Conference',
    description: 'Zone Conference this week at the church on Lónyay utca. The Zone Leader announces a "teaching excellence" segment. He\'s looking for a volunteer to demonstrate.',
    choices: [
      {
        label: 'Volunteer to teach',
        resultGood: {
          text: 'You nail the demo lesson. The Zone Leader nods approvingly. The Mission President\'s assistant makes a note. Elder Thompson beams with companion pride.',
          effects: { skills: 3, obedience: 2, spirit: 3 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'You blank on a key scripture reference. Forty missionaries watch you fumble. The Zone Leader rescues you but... yeah. That happened.',
          effects: { skills: 1, spirit: -3, obedience: 1 },
        },
        successChance: 0.4,
        statCheck: 'skills',
      },
      {
        label: 'Stay in the audience',
        resultGood: {
          text: 'You take careful notes. The training is actually useful. You pick up a new approach to handling objections.',
          effects: { skills: 2, obedience: 1 },
        },
        resultBad: {
          text: 'You zone out halfway through. The Zone Leader notices. He calls on you for a question you didn\'t hear. Busted.',
          effects: { skills: 1, obedience: 0, spirit: -1 },
        },
        successChance: 0.7,
      },
    ],
  },
]
