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
  {
    id: 'mission_president_warning',
    title: 'President Kovács Calls',
    description: 'Your phone buzzes during study time. It\'s the mission president. "Elder, I\'ve been hearing some concerning reports. I think we need to talk." His tone is measured but firm.',
    condition: (state) => state.stats.obedience < 50 || state.warnings > 0,
    choices: [
      {
        label: 'Be honest about your struggles',
        resultGood: {
          text: '"Thank you for being honest, Elder. That takes courage." He offers encouragement and practical advice. You feel the weight lift slightly.',
          effects: { spirit: 4, obedience: 3 },
        },
        resultBad: {
          text: 'Your honesty backfires. "I appreciate you telling me, but this is more serious than I thought." He schedules a formal interview next week.',
          effects: { spirit: -2, obedience: 2 },
        },
        successChance: 0.5,
        statCheck: 'spirit',
      },
      {
        label: 'Deflect and promise to do better',
        resultGood: {
          text: '"I\'m glad to hear it, Elder. I believe in you." He hangs up. You got off easy this time.',
          effects: { obedience: 1 },
        },
        resultBad: {
          text: 'He sees right through it. "Elder, I\'m not hearing conviction. I\'m hearing excuses." The call ends coldly. This won\'t be the last one.',
          effects: { spirit: -3, obedience: -2 },
        },
        successChance: 0.4,
      },
    ],
  },
  {
    id: 'rejection_streak',
    title: 'Nobody Wants to Listen',
    description: 'Fourteen doors. Fourteen "nem, köszönöm" responses. Three people literally pretended not to be home. One woman yelled at you in Hungarian too fast to understand. Your companion hasn\'t spoken in an hour.',
    condition: (state) => state.stats.spirit < 50,
    choices: [
      {
        label: 'Keep knocking',
        resultGood: {
          text: 'Door fifteen. An elderly man in slippers. "Jöjjenek be." He makes you tea and listens for an hour. He won\'t be baptized, but today, he was enough.',
          effects: { spirit: 5, skills: 1, language: 1 },
        },
        resultBad: {
          text: 'Door fifteen is answered by a man who launches into a five-minute tirade about American imperialism. You stand there and take it. Your companion starts crying.',
          effects: { spirit: -5 },
          rapportEffect: -1,
        },
        successChance: 0.3,
        statCheck: 'skills',
      },
      {
        label: 'Call it early and regroup',
        resultGood: {
          text: 'You sit on a bench by the Danube with Elder Thompson. Neither of you speaks. The sunset over Parliament is absurdly beautiful. Sometimes silence is ministry.',
          effects: { spirit: 3 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You go home early. The guilt gnaws at you. You could\'ve tried one more. Maybe that was the one.',
          effects: { spirit: -1, obedience: -2 },
        },
        successChance: 0.6,
      },
    ],
  },
  {
    id: 'budget_crisis',
    title: 'The Money Problem',
    description: 'You stare at your budget notebook. The numbers don\'t add up. Between the replacement white shirt, the emergency tram pass, and the too-expensive lángos, you\'re running dangerously low.',
    condition: (state) => state.stats.budget < 15000,
    choices: [
      {
        label: 'Rice and beans for two weeks',
        resultGood: {
          text: 'You master the art of stretching 500 forints into dinner. It\'s not glamorous but it works. Your companion starts calling you "Chef."',
          effects: { budget: 5000, spirit: -1 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'Three days of rice and beans later, your energy craters. You can barely make it through the day. Knocking doors on an empty stomach is brutal.',
          effects: { budget: 3000, spirit: -4 },
        },
        successChance: 0.5,
      },
      {
        label: 'Ask parents for money',
        resultGood: {
          text: 'Mom wires money within 24 hours. "We love you, honey. Eat something." The relief is physical. You almost cry at the Western Union.',
          effects: { budget: 15000, spirit: 3, obedience: -1 },
        },
        resultBad: {
          text: '"We can\'t keep doing this, son." Dad\'s disappointment travels six thousand miles with perfect clarity. The money arrives, but so does the guilt.',
          effects: { budget: 10000, spirit: -3 },
        },
        successChance: 0.6,
        statCheck: 'spirit',
      },
    ],
  },
  {
    id: 'homesickness_wave',
    title: 'The Longest Night',
    description: 'It\'s 2 AM. You can\'t sleep. Your little brother\'s birthday is tomorrow and you\'re not there. You haven\'t heard your mom\'s voice in three weeks. The apartment ceiling has 47 cracks. You\'ve counted.',
    condition: (state) => state.stats.spirit < 40,
    choices: [
      {
        label: 'Write in your journal',
        resultGood: {
          text: 'The words come slow, then fast. Pages of it. Things you can\'t say in letters home. By the time you stop, something has loosened. You sleep.',
          effects: { spirit: 4 },
        },
        resultBad: {
          text: 'You try to write but the words are just sadness in a spiral. You read old letters from home until 4 AM. Tomorrow will be rough.',
          effects: { spirit: -2 },
        },
        successChance: 0.5,
      },
      {
        label: 'Pray',
        resultGood: {
          text: 'In the dark, on your knees, you feel something. Not a voice, not a sign. Just... warmth. Like someone else is awake too. You go back to bed and sleep deeply.',
          effects: { spirit: 6, obedience: 2 },
        },
        resultBad: {
          text: 'The ceiling. The silence. No answer comes. You wonder if anyone is listening. You wonder why you\'re here. These are not questions for 2 AM.',
          effects: { spirit: -4, obedience: -2 },
        },
        successChance: 0.4,
        statCheck: 'spirit',
      },
    ],
  },
  // ─── CULTURAL EVENTS ───────────────────────────────────────────────
  {
    id: 'thermal_baths',
    title: 'The Széchenyi Question',
    description: 'Brother Tóth casually invites you both to Széchenyi thermal baths this Saturday. "Every Hungarian must experience it!" He doesn\'t seem to realize — or care — that this is very much against mission rules. The steam rising from the outdoor pool is visible from here. It\'s February.',
    condition: (state) => state.week > 4,
    choices: [
      {
        label: 'Politely decline',
        resultGood: {
          text: '"Sajnos nem tehetjük." Brother Tóth shrugs — no offense taken. He brings you thermal bath-shaped chocolates the next Sunday instead. Close enough.',
          effects: { obedience: 3, spirit: 1 },
          rapportEffect: 0,
        },
        resultBad: {
          text: 'Brother Tóth takes it personally. "You Americans think you\'re too good for Hungarian water?" The rest of the visit is frosty. No pun intended.',
          effects: { obedience: 2, spirit: -2 },
          rapportEffect: -2,
        },
        successChance: 0.6,
      },
      {
        label: 'Go. Just this once.',
        resultGood: {
          text: 'The hot water in -10°C air is transcendent. Brother Tóth teaches you to play chess on the floating boards. Nobody from the mission sees you. You feel guilty and extremely relaxed.',
          effects: { spirit: 4, obedience: -5 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You\'re mid-soak when Elder Jensen from the neighboring zone rounds the corner in swim trunks. You lock eyes. Mutually assured destruction. But the Zone Leader hears about it anyway.',
          effects: { spirit: -2, obedience: -5 },
          rapportEffect: 1,
        },
        successChance: 0.4,
      },
    ],
  },
  {
    id: 'hungarian_holiday',
    title: 'March 15th',
    description: 'It\'s March 15th — Hungary\'s national day commemorating the 1848 revolution. Everything is closed. The streets are full of people wearing kokárdas and waving flags. Your entire schedule is shot.',
    choices: [
      {
        label: 'Join the celebrations and street contact',
        resultGood: {
          text: 'You pin on a kokárda someone hands you and work the crowd. Hungarians love that two Americans know about Petőfi. Three solid conversations and a phone number.',
          effects: { spirit: 3, language: 2, skills: 2 },
        },
        resultBad: {
          text: 'You accidentally step on a flag. A man with a magnificent mustache lectures you for fifteen minutes about Kossuth Lajos. You understand about 30% of it, which is enough to feel terrible.',
          effects: { spirit: -2, language: 1 },
        },
        successChance: 0.5,
        statCheck: 'language',
      },
      {
        label: 'Use the day for deep study',
        resultGood: {
          text: 'A rare quiet day. You read the entire Book of Alma and practice Hungarian verb conjugations until they almost make sense. Almost.',
          effects: { language: 3, skills: 2, spirit: 1 },
        },
        resultBad: {
          text: 'You try to study but the festival noise outside is relentless. You spend most of the day watching the parade from your window, feeling left out.',
          effects: { spirit: -1, language: 1 },
        },
        successChance: 0.6,
      },
    ],
  },
  {
    id: 'paprika_challenge',
    title: 'The Paprika Gauntlet',
    description: 'Brother Németh has made his "famous" erős pista chicken. He watches you with the grin of a man who has broken many foreigners. The chicken is an alarming shade of red. Elder Thompson has already taken one bite and gone completely silent, tears streaming.',
    choices: [
      {
        label: 'Eat it like a champion',
        resultGood: {
          text: 'Your mouth is a furnace. Your eyes are waterfalls. But you clean the plate. Brother Németh stands and slow-claps. "Magyar vagy!" he declares. You have never been more proud or more in pain.',
          effects: { spirit: 3 },
          rapportEffect: 3,
        },
        resultBad: {
          text: 'You make it four bites before your body files a formal complaint. You drink two liters of milk straight from the carton while Brother Németh laughs so hard he wheezes.',
          effects: { spirit: -1 },
          rapportEffect: 1,
        },
        successChance: 0.4,
      },
      {
        label: 'Ask for the mild version',
        resultGood: {
          text: '"Van szelídebb?" Brother Németh respects the self-awareness. He brings out a version that merely burns instead of incinerates. Dignity preserved.',
          effects: { spirit: 1 },
          rapportEffect: 1,
        },
        resultBad: {
          text: '"Mild? MILD?" Brother Németh looks at you like you\'ve insulted his ancestors. "In Hungary, this IS mild." He\'s not entirely wrong.',
          effects: { spirit: -1 },
          rapportEffect: -1,
        },
        successChance: 0.6,
      },
    ],
  },
  {
    id: 'flea_market_find',
    title: 'Ecseri Treasure',
    description: 'Your preparation day takes you past the Ecseri flea market. Among the Soviet memorabilia and questionable antiques, you spot a worn Hungarian-English dictionary from 1987. The vendor wants 500 forints.',
    choices: [
      {
        label: 'Buy it',
        resultGood: {
          text: 'Best 500 forints you\'ve ever spent. The dictionary has handwritten notes in the margins from a previous owner — shortcuts and slang no textbook would teach you. Language study just leveled up.',
          effects: { language: 4, budget: -500, spirit: 2 },
        },
        resultBad: {
          text: 'You buy it, but half the pages are stuck together with something you don\'t want to identify. The translations are occasionally... creative. You learn three words that turn out not to be real.',
          effects: { language: 1, budget: -500 },
        },
        successChance: 0.6,
      },
      {
        label: 'Keep browsing instead',
        resultGood: {
          text: 'You skip the dictionary but find a beautifully tacky Hungarian flag tie for 200 forints. Members love it. Elder Thompson is jealous.',
          effects: { spirit: 2, budget: -200 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'You browse for two hours and buy nothing. Your preparation day is gone and you still can\'t conjugate "to be" correctly.',
          effects: { spirit: -1 },
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'ruin_bar_invitation',
    title: 'Szimpla Kert',
    description: 'Two young Hungarians your age approach you on Kazinczy utca. "Hey, Americans! Come have a drink with us at Szimpla! We want to practice English!" They seem genuinely friendly. You can see the ruin bar\'s entrance from here — mismatched furniture, fairy lights, everything your mission president warned about.',
    choices: [
      {
        label: 'Decline but offer to meet for coffee instead',
        resultGood: {
          text: '"How about a presszó instead?" They agree. Over espresso the next day, you have one of the best gospel conversations of your mission. They\'re not interested in church but they think you\'re "not like other Americans." High praise.',
          effects: { spirit: 3, skills: 2, obedience: 2 },
        },
        resultBad: {
          text: 'They look disappointed and wave you off. "Okay, okay, boring Americans." They disappear into the bar. You wonder if Jesus would\'ve gone into Szimpla Kert. Probably, honestly.',
          effects: { spirit: -2, obedience: 2 },
        },
        successChance: 0.5,
        statCheck: 'skills',
      },
      {
        label: 'Go in. Just for the conversation.',
        resultGood: {
          text: 'You order a Coca-Cola and talk for two hours. They\'re university students studying philosophy. The conversation is electric. One takes a Book of Mormon "as literature." You leave before 9 PM curfew. Barely.',
          effects: { spirit: 3, language: 2, obedience: -4 },
        },
        resultBad: {
          text: 'You\'re spotted by Sister Molnár from the branch walking past. She doesn\'t say anything. She doesn\'t have to. The look is enough. This will get back to someone.',
          effects: { spirit: -3, obedience: -5 },
        },
        successChance: 0.4,
      },
    ],
  },
  // ─── COMPANION EVENTS ──────────────────────────────────────────────
  {
    id: 'companion_birthday',
    title: 'Happy Birthday, Elder',
    description: 'You realize it\'s Elder Thompson\'s birthday tomorrow. He hasn\'t mentioned it — probably because he\'s trying not to think about it. His family is 5,000 miles away. You have a modest missionary budget and access to a Hungarian grocery store.',
    choices: [
      {
        label: 'Throw a surprise',
        resultGood: {
          text: 'You bake a lopsided cake from a Hungarian recipe you can barely read. Three members show up with presents. Elder Thompson pretends he\'s not crying. He is absolutely crying.',
          effects: { spirit: 3, budget: -2000 },
          rapportEffect: 4,
        },
        resultBad: {
          text: 'The cake is inedible — you confused sugar (cukor) with salt (só). Classic. Elder Thompson eats a slice anyway and says it\'s "the thought that counts" through gritted teeth.',
          effects: { spirit: 1, budget: -2000, language: 1 },
          rapportEffect: 2,
        },
        successChance: 0.5,
        statCheck: 'language',
      },
      {
        label: 'Keep it low-key',
        resultGood: {
          text: 'You grab two kürtőskalács from the street vendor and give him a heartfelt card. Simple. Perfect. He says it\'s the best birthday he\'s had on his mission.',
          effects: { spirit: 2, budget: -800 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You hand him a candy bar and say "happy birthday." It lands flat. He smiles but you can see he was hoping for more. The apartment is quiet that evening.',
          effects: { spirit: -1, budget: -300 },
          rapportEffect: -1,
        },
        successChance: 0.6,
      },
    ],
  },
  {
    id: 'companion_confession',
    title: 'The Bridge Conversation',
    description: 'Walking home across Margit híd at dusk, Elder Thompson stops and stares at the river. "Elder... can I tell you something?" His voice is different. Smaller. "I don\'t know if I believe anymore. I haven\'t for a while."',
    choices: [
      {
        label: 'Listen without judgment',
        resultGood: {
          text: 'You lean on the railing and let him talk. For forty minutes, he unloads everything. You don\'t have answers, but you have ears. "Thanks for not freaking out," he says. Something shifts between you.',
          effects: { spirit: 2 },
          rapportEffect: 5,
        },
        resultBad: {
          text: 'You listen, but his doubts start echoing your own. By the time you get home, you\'re both in a dark place. The apartment feels heavier than usual.',
          effects: { spirit: -3 },
          rapportEffect: 3,
        },
        successChance: 0.5,
        statCheck: 'spirit',
      },
      {
        label: 'Share a testimony',
        resultGood: {
          text: 'You speak from the heart — not the manual. It\'s not polished, but it\'s real. Elder Thompson nods slowly. "I needed to hear that from someone who means it." The walk home is lighter.',
          effects: { spirit: 4, skills: 1 },
          rapportEffect: 3,
        },
        resultBad: {
          text: 'It comes out rehearsed. You can hear it yourself. Elder Thompson\'s face closes. "Yeah. Okay." He walks ahead of you the rest of the way. You said the right words in the wrong voice.',
          effects: { spirit: -2, skills: -1 },
          rapportEffect: -2,
        },
        successChance: 0.4,
        statCheck: 'skills',
      },
    ],
  },
  {
    id: 'companion_sick',
    title: 'Elder Down',
    description: 'Elder Thompson wakes up green. Literally green-ish. He\'s been up since 3 AM with something he blames on the street gyros from yesterday. He can barely stand. Mission rules say you can\'t go out alone. Your investigator Zsuzsa is expecting you at 2 PM.',
    choices: [
      {
        label: 'Stay and take care of him',
        resultGood: {
          text: 'You make tea, find a pharmacy, and butcher enough Hungarian to buy the right medicine. Elder Thompson recovers by evening. "You\'re a good comp," he says, half-asleep. Zsuzsa understands when you call.',
          effects: { spirit: 2, obedience: 2, language: 1 },
          rapportEffect: 3,
        },
        resultBad: {
          text: 'You stay, but you\'re useless. You accidentally buy laxatives instead of anti-diarrhea medicine. The Hungarian pharmacist tries to warn you but you\'re too confident in your vocabulary. Things get worse before they get better.',
          effects: { spirit: -1, obedience: 2, budget: -1500 },
          rapportEffect: 1,
        },
        successChance: 0.5,
        statCheck: 'language',
      },
      {
        label: 'Call another companionship for backup',
        resultGood: {
          text: 'The Elders from Újpest come over. One stays with Thompson, you go teach with the other. Zsuzsa\'s lesson goes well. Teamwork. The mission system actually works sometimes.',
          effects: { skills: 2, spirit: 2, obedience: 1 },
        },
        resultBad: {
          text: 'Nobody\'s available. You call three companionships. Everyone\'s busy. You end up canceling on Zsuzsa AND feeling like you abandoned your companion. Lose-lose.',
          effects: { spirit: -3, skills: -1 },
          rapportEffect: -1,
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'companion_argument',
    title: 'The Schedule War',
    description: 'Elder Thompson wants to spend the afternoon door-knocking in Óbuda. You want to visit less-active members in the VIII district. You\'ve been having this argument in various forms for two weeks. Neither of you is budging.',
    choices: [
      {
        label: 'Compromise — split the time',
        resultGood: {
          text: 'Óbuda in the morning, VIII district after lunch. Both halves are productive. On the tram between, Elder Thompson admits you were right about the less-actives. You admit Óbuda wasn\'t bad either. Maturity.',
          effects: { skills: 2, spirit: 2 },
          rapportEffect: 3,
        },
        resultBad: {
          text: 'Splitting the time means you\'re rushed everywhere. Half-finished conversations, missed connections. You arrive home exhausted and neither plan really worked.',
          effects: { spirit: -2, skills: -1 },
          rapportEffect: 0,
        },
        successChance: 0.5,
      },
      {
        label: 'Let him have his way',
        resultGood: {
          text: 'Óbuda it is. And honestly? Elder Thompson finds a golden contact you never would have. Sometimes letting go of the steering wheel is the right call.',
          effects: { spirit: 1, skills: 2 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'Óbuda is a ghost town. Three hours of nothing. Elder Thompson can feel your silent "I told you so" radiating off you. The walk home is very, very quiet.',
          effects: { spirit: -2 },
          rapportEffect: -2,
        },
        successChance: 0.4,
      },
    ],
  },
  // ─── INVESTIGATOR / TEACHING EVENTS ────────────────────────────────
  {
    id: 'golden_contact',
    title: 'The One Who Came to You',
    description: 'You\'re sitting on a bench near Városliget eating a lángos when a woman in her 30s sits down next to you. "Excuse me — you\'re the Mormons, right? I\'ve been reading your website. I have questions." Elder Thompson nearly chokes on his sour cream.',
    condition: (state) => state.stats.skills > 30,
    choices: [
      {
        label: 'Teach her right here on the bench',
        resultGood: {
          text: 'An hour disappears. She cries twice. She\'s been looking for something and she can\'t name it. You set up a formal appointment. Elder Thompson is vibrating with excitement the whole tram ride home.',
          effects: { spirit: 6, skills: 3 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You\'re too eager and overwhelm her with information. Her eyes glaze over. "Maybe I\'ll think about it," she says, and you know that means no. You had gold in your hands and squeezed too hard.',
          effects: { spirit: -3, skills: 1 },
        },
        successChance: 0.5,
        statCheck: 'skills',
      },
      {
        label: 'Get her number and set up a proper meeting',
        resultGood: {
          text: 'You play it cool, exchange numbers, set a time for Thursday. She shows up with a list of twenty questions and a highlighted Book of Mormon she bought herself. This is real.',
          effects: { spirit: 4, skills: 2 },
        },
        resultBad: {
          text: 'She takes your card, you take her number. Thursday comes and the number is disconnected. Maybe it was wrong. Maybe she changed her mind. You\'ll never know.',
          effects: { spirit: -4 },
        },
        successChance: 0.6,
      },
    ],
  },
  {
    id: 'investigator_family_opposition',
    title: 'The Family Wall',
    description: 'Zsuzsa calls, upset. Her husband found the Book of Mormon and threw it away. "He says if I keep meeting with you, he\'ll — " She doesn\'t finish the sentence. She\'s been your most promising investigator.',
    condition: (state) => state.week > 6,
    choices: [
      {
        label: 'Offer to meet with both of them',
        resultGood: {
          text: 'The husband agrees, mostly to tell you off. But he listens. He doesn\'t convert, but he stops opposing. "She can do what she wants," he says, which in Hungarian husband language is basically a blessing.',
          effects: { skills: 3, spirit: 3 },
        },
        resultBad: {
          text: 'The husband shouts for twenty minutes. You sit there and take it. Zsuzsa is mortified. She cancels the next three appointments. The door is closing.',
          effects: { spirit: -4, skills: -1 },
        },
        successChance: 0.3,
        statCheck: 'skills',
      },
      {
        label: 'Give her space and pray',
        resultGood: {
          text: 'Two weeks of silence. Then a text: "I found a new copy at the könyvesbolt. When can we meet?" Some seeds need dark before they grow.',
          effects: { spirit: 4 },
        },
        resultBad: {
          text: 'She never calls back. You see her once on the street three weeks later. She crosses to the other side. Some doors close and stay closed.',
          effects: { spirit: -5 },
        },
        successChance: 0.4,
        statCheck: 'spirit',
      },
    ],
  },
  {
    id: 'baptism_preparation',
    title: 'The Final Stretch',
    description: 'Brother Fehér has passed every discussion, attended church three weeks running, and says he\'s ready. The baptism is scheduled for Saturday. You need to do the final interview and make sure the font works. (The font never works.)',
    condition: (state) => state.week > 8,
    choices: [
      {
        label: 'Personally oversee every detail',
        resultGood: {
          text: 'You test the font (broken, as predicted), find a backup, iron your white clothes, and prep the program. Saturday is flawless. Brother Fehér comes up from the water beaming. You will remember this your entire life.',
          effects: { spirit: 6, skills: 3, obedience: 2 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'Despite your best efforts, the hot water heater dies. Brother Fehér is baptized in water so cold he gasps. He\'s gracious about it, but the video your companion takes is... not what you envisioned.',
          effects: { spirit: 2, skills: 2, obedience: 1 },
          rapportEffect: 1,
        },
        successChance: 0.5,
      },
      {
        label: 'Delegate and focus on the spiritual prep',
        resultGood: {
          text: 'You spend Friday evening with Brother Fehér reviewing his commitment. He tears up. "I\'ve never been this sure of anything." The logistics sort themselves out. (The font still almost doesn\'t work.)',
          effects: { spirit: 5, skills: 2 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'Nobody fills the font. You arrive Saturday to an empty room and dry tile. Frantic scrambling. The baptism happens two hours late. Brother Fehér waits patiently but the magic is diluted.',
          effects: { spirit: -1, skills: 1 },
          rapportEffect: -1,
        },
        successChance: 0.4,
      },
    ],
  },
  // ─── MISSION LIFE EVENTS ──────────────────────────────────────────
  {
    id: 'lost_wallet',
    title: 'Pickpocket on the 6',
    description: 'You reach for your wallet at the tram stop and it\'s gone. Your stomach drops. Monthly budget, BKV pass, your temple recommend — all of it. The tram was packed. You didn\'t feel a thing. This is a problem.',
    choices: [
      {
        label: 'Retrace your steps immediately',
        resultGood: {
          text: 'You sprint back to the last stop. A woman is holding your wallet. "Ezt ejtette el," she says. You dropped it. NOT pickpocketed. Everything\'s there. You almost hug a stranger on Nagykörút.',
          effects: { spirit: 4 },
        },
        resultBad: {
          text: 'Gone. Really gone. You file a police report in broken Hungarian. The officer is sympathetic but unhelpful. Two weeks until your next stipend. Rice and beans it is.',
          effects: { spirit: -4, budget: -8000 },
        },
        successChance: 0.3,
      },
      {
        label: 'Report it and move on',
        resultGood: {
          text: 'You call the mission office. They advance you emergency funds and the branch president replaces your tram pass from a discretionary fund. The system catches you when you fall.',
          effects: { budget: -3000, spirit: 1, obedience: 1 },
        },
        resultBad: {
          text: '"We\'ll process the emergency funds... next week." Bureaucracy doesn\'t care about your empty pockets. You borrow from Elder Thompson, who is gracious but keeps a running tab.',
          effects: { budget: -6000, spirit: -2 },
          rapportEffect: -1,
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'transfer_rumors',
    title: 'Transfer Whispers',
    description: 'It\'s the last week of the transfer. The phone tree is buzzing. Elder from Debrecen says he "heard from the APs" that you\'re being moved to Pécs. Elder Thompson has gone quiet. Neither of you mentions it directly, but it\'s all either of you is thinking about.',
    choices: [
      {
        label: 'Embrace whatever comes',
        resultGood: {
          text: 'Transfer calls come. You\'re staying. Elder Thompson deflates with relief. "I wasn\'t ready for a new comp," he admits. You weren\'t either. Back to work.',
          effects: { spirit: 3, obedience: 2 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You\'re transferred. Pécs. New companion, new city, new members. The goodbye with Elder Thompson at Keleti station is harder than you expected. The train pulls away and everything resets.',
          effects: { spirit: -3, obedience: 1 },
          rapportEffect: -3,
        },
        successChance: 0.5,
      },
      {
        label: 'Stress about it all week',
        resultGood: {
          text: 'The anxiety is miserable, but when the call comes and you\'re staying, the relief is enormous. You wasted a week worrying about nothing. Classic mission experience.',
          effects: { spirit: 1 },
        },
        resultBad: {
          text: 'A week of distraction and anxiety, AND you get transferred. The worst combo. You arrive in Pécs rattled and unfocused. Your new companion can tell.',
          effects: { spirit: -4, skills: -1 },
          rapportEffect: -2,
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'zone_leader_visit',
    title: 'Ride-Along',
    description: 'Elder Clarke, the Zone Leader, is riding along with you today to "observe and support." He has a clipboard. An actual clipboard. Elder Thompson keeps straightening his tie.',
    choices: [
      {
        label: 'Teach your best lesson',
        resultGood: {
          text: 'You\'re on fire. Scriptures flow, Hungarian cooperates, the investigator is engaged. Elder Clarke writes something and nods. At dinner he says, "I\'m recommending you for District Leader." Wait, what?',
          effects: { skills: 4, spirit: 4, obedience: 3 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'Performance anxiety. You forget the second discussion, misquote Moroni, and accidentally bear testimony that you "know the church is blue." (Igaz/kék confusion.) Elder Clarke is kind about it, which is worse.',
          effects: { skills: -1, spirit: -3, obedience: 1 },
        },
        successChance: 0.4,
        statCheck: 'skills',
      },
      {
        label: 'Just act natural',
        resultGood: {
          text: 'You teach like he\'s not there. It\'s not your flashiest work, but it\'s authentic. Elder Clarke says, "That was real. People can feel that." High praise from a clipboard man.',
          effects: { skills: 2, spirit: 2, obedience: 1 },
        },
        resultBad: {
          text: 'You act natural, and "natural" today means mediocre. The lesson is flat. The investigator is bored. Elder Clarke writes a lot of notes. A lot.',
          effects: { skills: 1, spirit: -2 },
        },
        successChance: 0.5,
        statCheck: 'spirit',
      },
    ],
  },
  {
    id: 'internet_cafe_temptation',
    title: 'The Blue Screen Glow',
    description: 'You pass an internet café on Rákóczi út. Through the window: email, news from home, the world you left behind. It would take ten minutes. Elder Thompson is looking at his shoes. He\'s thinking the same thing.',
    choices: [
      {
        label: 'Walk past',
        resultGood: {
          text: 'You keep walking. It gets easier after the first block. By the second block, you\'re talking about something else. Small victories are still victories.',
          effects: { obedience: 3, spirit: 2 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'You walk past, but it nags at you all day. What if someone emailed? What if something happened? The not-knowing is its own kind of weight.',
          effects: { obedience: 2, spirit: -2 },
        },
        successChance: 0.6,
      },
      {
        label: '"Just five minutes"',
        resultGood: {
          text: 'Five minutes. One email from your mom: "We\'re proud of you." You log off. Worth it. Probably. Elder Thompson checked scores for the Jazz game. Some things are sacred.',
          effects: { spirit: 3, obedience: -3 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'Five minutes becomes forty-five. You read every email, check every site. When you emerge, blinking, the afternoon is gone and the guilt is staggering.',
          effects: { spirit: -2, obedience: -5 },
          rapportEffect: 0,
        },
        successChance: 0.4,
      },
    ],
  },
  {
    id: 'christmas_away',
    title: 'Karácsony',
    description: 'December 24th. In Hungary, this is THE day — Szenteste, Holy Evening. Your family is decorating the tree right now, thirteen time zones away. The branch has a dinner tonight, but it\'s not the same. Nothing is the same.',
    condition: (state) => state.week % 26 > 10 && state.week % 26 < 16,
    choices: [
      {
        label: 'Throw yourself into the branch celebration',
        resultGood: {
          text: 'Sister Molnár puts you to work in the kitchen. You sing "Mennyből az angyal" badly but loudly. A seven-year-old gives you a handmade ornament. It\'s not home. But it\'s a home.',
          effects: { spirit: 5, language: 1 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'You try. You sing, you eat, you smile. But when a little girl falls asleep on her father\'s lap, it hits you like a freight train. You excuse yourself to the bathroom and sit there for a while.',
          effects: { spirit: -2 },
          rapportEffect: 1,
        },
        successChance: 0.5,
        statCheck: 'spirit',
      },
      {
        label: 'Call home (it\'s the one allowed call)',
        resultGood: {
          text: 'Thirty minutes. Mom cries. Dad talks about the weather. Your sister holds the phone up to the dog. It\'s the best thirty minutes of your entire mission so far. You hang up full.',
          effects: { spirit: 6 },
        },
        resultBad: {
          text: 'The connection is terrible. Half the call is "Can you hear me?" Your little brother got on and said, "When are you coming home?" You think about that sentence for the next three weeks.',
          effects: { spirit: -4 },
        },
        successChance: 0.5,
      },
    ],
  },
  {
    id: 'miracle_moment',
    title: 'Light on the Danube',
    description: 'You\'re walking home at golden hour. The sun hits the Danube and the entire river turns to liquid copper. Parliament glows. The Chain Bridge is perfect. You stop. Elder Thompson stops. Neither of you speaks.',
    choices: [
      {
        label: 'Let the moment be',
        resultGood: {
          text: 'Sometimes Budapest reminds you why you said yes. Not the church, not the rules, not the numbers — just this. The unearnable beauty of being somewhere impossible. You walk home in silence, grateful.',
          effects: { spirit: 5 },
          rapportEffect: 2,
        },
        resultBad: {
          text: 'It\'s beautiful. And then the moment passes, as moments do. But something lingers. A warmth that wasn\'t there this morning. You can work with that.',
          effects: { spirit: 3 },
          rapportEffect: 1,
        },
        successChance: 0.8,
      },
      {
        label: 'Take a photo to send home',
        resultGood: {
          text: 'You snap it just right. The light, the river, the skyline. Your mom will frame this. Elder Thompson photobombs the second one with a peace sign. Perfect.',
          effects: { spirit: 4 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'By the time you dig out the camera, the light has shifted. The photo is mediocre. But the memory isn\'t. Some things don\'t need to be captured to be kept.',
          effects: { spirit: 3 },
        },
        successChance: 0.6,
      },
    ],
  },
  {
    id: 'language_breakthrough',
    title: 'The Penny Drops',
    description: 'You\'re on the tram and two old women are gossiping about their neighbor\'s divorce. And you understand ALL of it. Every word. The suffixes, the slang, the subjunctive. Your brain has been quietly wiring itself in the background and just flipped a switch.',
    condition: (state) => state.stats.language > 40,
    choices: [
      {
        label: 'Test your new powers',
        resultGood: {
          text: 'You turn to the women and say, in perfect Hungarian, "Remélem, hogy jól lesz neki." They stare. Then one of them grabs your arm: "Te beszélsz magyarul!" You chat for six stops. Elder Thompson\'s jaw is on the floor.',
          effects: { language: 4, spirit: 4, skills: 2 },
        },
        resultBad: {
          text: 'You try to jump into the conversation but your confidence outpaces your accuracy. You accidentally take sides in the divorce. One woman loves you. The other wants you off the tram.',
          effects: { language: 2, spirit: -1 },
        },
        successChance: 0.5,
        statCheck: 'language',
      },
      {
        label: 'Just listen and absorb',
        resultGood: {
          text: 'You sit there with a quiet smile, understanding everything. The world just got bigger. When you teach that evening, the words come easier. The investigator notices. "Your Hungarian is suddenly very good."',
          effects: { language: 3, spirit: 3, skills: 1 },
        },
        resultBad: {
          text: 'You listen, but the moment fades. By the time you\'re teaching that evening, the ease is gone. The breakthrough was real, but language is a tide — it comes and goes.',
          effects: { language: 2, spirit: 1 },
        },
        successChance: 0.7,
      },
    ],
  },
  {
    id: 'difficult_door',
    title: 'Door Number Thirty-Seven',
    description: 'The door opens. A man in a stained undershirt looks at your name tags and his face contorts. What follows is a two-minute torrent of Hungarian profanity so creative that even Elder Thompson, who speaks no Hungarian, understands the gist. The door slams. The potted plant on the landing shakes.',
    choices: [
      {
        label: 'Shake it off and knock the next door',
        resultGood: {
          text: 'Deep breath. Next door. A grandmother opens it, sees your faces, and says, "Oh, you poor boys. Come in, I\'ll make tea." Missionaries run on exactly this kind of whiplash.',
          effects: { spirit: 3, skills: 1 },
        },
        resultBad: {
          text: 'You knock the next door. Nobody answers. Or the next. Or the next. The yelling man\'s words echo louder than they should. You call it a day twenty minutes early.',
          effects: { spirit: -3 },
        },
        successChance: 0.5,
        statCheck: 'spirit',
      },
      {
        label: 'Take a breather in the stairwell',
        resultGood: {
          text: 'You sit on the stairs for five minutes. Elder Thompson says, "That guy had impressive range, vocally." You laugh harder than the joke deserves. It helps. Back to work.',
          effects: { spirit: 2 },
          rapportEffect: 1,
        },
        resultBad: {
          text: 'You sit there and the weight of it settles. Not just this door — all the doors. The sheer volume of people who don\'t want what you\'re offering. It\'s a heavy five minutes.',
          effects: { spirit: -4 },
        },
        successChance: 0.5,
      },
    ],
  },
]
