// ============= TYPING DRILL DATA =============
export const HUNGARIAN_WORDS = [
  // Difficulty 0 - Basic greetings
  [
    { hu: 'igen', en: 'yes' },
    { hu: 'nem', en: 'no' },
    { hu: 'szia', en: 'hello' },
    { hu: 'köszönöm', en: 'thank you' },
    { hu: 'kérem', en: 'please' },
    { hu: 'jó', en: 'good' },
    { hu: 'nap', en: 'day' },
    { hu: 'víz', en: 'water' },
    { hu: 'ház', en: 'house' },
    { hu: 'ember', en: 'person' },
  ],
  // Difficulty 1 - Common phrases
  [
    { hu: 'jó napot', en: 'good day' },
    { hu: 'hogy van', en: 'how are you' },
    { hu: 'beszélek', en: 'I speak' },
    { hu: 'tanulok', en: 'I study' },
    { hu: 'templom', en: 'temple' },
    { hu: 'barát', en: 'friend' },
    { hu: 'család', en: 'family' },
    { hu: 'szeretet', en: 'love' },
    { hu: 'igazság', en: 'truth' },
    { hu: 'békesség', en: 'peace' },
  ],
  // Difficulty 2 - Religious vocabulary
  [
    { hu: 'Mennyei Atya', en: 'Heavenly Father' },
    { hu: 'evangélium', en: 'gospel' },
    { hu: 'megkeresztel', en: 'to baptize' },
    { hu: 'bizonyság', en: 'testimony' },
    { hu: 'szentírás', en: 'scripture' },
    { hu: 'imádkozik', en: 'to pray' },
    { hu: 'megbocsátás', en: 'forgiveness' },
    { hu: 'visszaállítás', en: 'restoration' },
  ],
  // Difficulty 3 - Complex phrases
  [
    { hu: 'szeretnénk megosztani', en: 'we would like to share' },
    { hu: 'tudna segíteni', en: 'could you help' },
    { hu: 'nagyon fontos üzenet', en: 'very important message' },
    { hu: 'Jézus Krisztus egyháza', en: 'church of Jesus Christ' },
    { hu: 'örökkévaló család', en: 'eternal family' },
    { hu: 'megváltás terve', en: 'plan of salvation' },
  ],
  // Difficulty 4 - Full sentences
  [
    { hu: 'Isten minden gyermekét szereti', en: 'God loves all His children' },
    { hu: 'Tudom hogy ez az egyház igaz', en: 'I know this church is true' },
    { hu: 'Szeretnénk visszajönni holnap', en: 'We would like to come back tomorrow' },
    { hu: 'A Szentlélek bizonyságot tesz', en: 'The Holy Spirit testifies' },
  ],
]

// ============= TEACHING CARDS DATA =============
export const INVESTIGATOR_CONCERNS = [
  { concern: 'Why does God allow suffering?', correctCard: 'atonement', category: 'faith' },
  { concern: 'How do I know if God is real?', correctCard: 'prayer', category: 'faith' },
  { concern: 'Why should I read this book?', correctCard: 'book_of_mormon', category: 'scripture' },
  { concern: 'I already have a church.', correctCard: 'restoration', category: 'doctrine' },
  { concern: 'What about my family who died?', correctCard: 'eternal_family', category: 'doctrine' },
  { concern: 'I don\'t have time for this.', correctCard: 'blessings', category: 'practical' },
  { concern: 'How can a 14-year-old see God?', correctCard: 'first_vision', category: 'history' },
  { concern: 'Why can\'t I drink coffee?', correctCard: 'word_of_wisdom', category: 'commandment' },
  { concern: 'I feel empty inside.', correctCard: 'holy_ghost', category: 'faith' },
  { concern: 'What makes your church different?', correctCard: 'priesthood', category: 'doctrine' },
  { concern: 'I\'ve done terrible things.', correctCard: 'repentance', category: 'faith' },
  { concern: 'Why should I be baptized again?', correctCard: 'baptism', category: 'ordinance' },
]

export const SCRIPTURE_CARDS = {
  atonement: { label: 'Atonement', description: 'Christ suffered for all our pain' },
  prayer: { label: 'Prayer', description: 'Ask God directly and listen' },
  book_of_mormon: { label: 'Book of Mormon', description: 'Another testament of Christ' },
  restoration: { label: 'Restoration', description: 'Christ\'s church restored on earth' },
  eternal_family: { label: 'Eternal Family', description: 'Families can be together forever' },
  blessings: { label: 'Blessings', description: 'God blesses those who follow Him' },
  first_vision: { label: 'First Vision', description: 'God appeared to Joseph Smith' },
  word_of_wisdom: { label: 'Word of Wisdom', description: 'Health law from God' },
  holy_ghost: { label: 'Holy Ghost', description: 'God\'s spirit brings peace and truth' },
  priesthood: { label: 'Priesthood', description: 'God\'s authority to act in His name' },
  repentance: { label: 'Repentance', description: 'Change and be made clean through Christ' },
  baptism: { label: 'Baptism', description: 'Covenant with God by immersion' },
}

// ============= DIALOGUE TREES (CONTACTING) =============
export const CONTACT_DIALOGUES = [
  {
    npcMood: 'neutral',
    npcName: 'Older Woman',
    exchanges: [
      {
        npcText: 'Hmm? Americans? What do you want?',
        options: [
          { text: 'We have a message about families.', score: 1 },
          { text: 'Do you believe in God?', score: 0.5 },
          { text: 'Can I tell you about our church?', score: 0 },
        ],
      },
      {
        npcText: 'Families? I have six grandchildren. Go on.',
        options: [
          { text: 'Families can be together forever.', score: 1 },
          { text: 'We have a book we\'d like to share.', score: 0.5 },
          { text: 'Would you come to our church?', score: 0 },
        ],
      },
      {
        npcText: 'That\'s a nice thought. How?',
        options: [
          { text: 'Can we visit you to explain more?', score: 1 },
          { text: 'Read this pamphlet.', score: 0.5 },
          { text: 'It\'s a long story...', score: 0 },
        ],
      },
    ],
  },
  {
    npcMood: 'hurried',
    npcName: 'Young Man',
    exchanges: [
      {
        npcText: '*walking fast* I\'m busy.',
        options: [
          { text: 'Just 30 seconds — one question.', score: 1 },
          { text: 'Wait! We have good news!', score: 0 },
          { text: 'What are you running from?', score: 0 },
        ],
      },
      {
        npcText: '*slows down* ...Fine. One question.',
        options: [
          { text: 'What matters most to you in life?', score: 1 },
          { text: 'Have you heard of the Book of Mormon?', score: 0.5 },
          { text: 'Do you go to church?', score: 0 },
        ],
      },
      {
        npcText: 'My family, I guess. Why?',
        options: [
          { text: 'We teach how families last forever.', score: 1 },
          { text: 'Here\'s our number if you want to talk.', score: 0.5 },
          { text: 'Come to our church this Sunday!', score: 0 },
        ],
      },
    ],
  },
  {
    npcMood: 'curious',
    npcName: 'University Student',
    exchanges: [
      {
        npcText: 'Are you those Mormon guys? I\'ve read about you online.',
        options: [
          { text: 'What did you read? We can clear things up.', score: 1 },
          { text: 'Yes! Want to hear our message?', score: 0.5 },
          { text: 'Don\'t believe everything you read.', score: 0 },
        ],
      },
      {
        npcText: 'Mostly weird stuff about golden plates. Is that real?',
        options: [
          { text: 'It sounds unusual, but read the book and decide.', score: 1 },
          { text: 'Absolutely! Joseph Smith found them.', score: 0.5 },
          { text: 'That\'s not the important part.', score: 0 },
        ],
      },
      {
        npcText: 'Hmm. I\'m actually kind of interested.',
        options: [
          { text: 'We can bring you a copy. When works?', score: 1 },
          { text: 'Great! Here\'s a pamphlet.', score: 0.5 },
          { text: 'You should come to church!', score: 0 },
        ],
      },
    ],
  },
]

// ============= MEMORY GAME PAIRS =============
export const MEMORY_PAIRS = [
  { id: 'faith', text: 'Faith' },
  { id: 'repent', text: 'Repentance' },
  { id: 'baptism', text: 'Baptism' },
  { id: 'ghost', text: 'Holy Ghost' },
  { id: 'endure', text: 'Endure' },
  { id: 'pray', text: 'Prayer' },
  { id: 'study', text: 'Scripture' },
  { id: 'serve', text: 'Service' },
  { id: 'love', text: 'Charity' },
  { id: 'hope', text: 'Hope' },
  { id: 'obey', text: 'Obedience' },
  { id: 'fast', text: 'Fasting' },
]

// ============= FILL IN BLANKS (ENGLISH CLASS) =============
export const FILL_BLANKS = [
  { sentence: 'I ___ to the store yesterday.', blank: 'went', options: ['went', 'goed', 'go', 'going'] },
  { sentence: 'She ___ very happy to see us.', blank: 'was', options: ['was', 'is', 'were', 'been'] },
  { sentence: 'We ___ English every Tuesday.', blank: 'study', options: ['study', 'studies', 'studying', 'studied'] },
  { sentence: 'The weather ___ been cold lately.', blank: 'has', options: ['has', 'have', 'had', 'is'] },
  { sentence: 'They ___ like to come to dinner.', blank: 'would', options: ['would', 'will', 'could', 'should'] },
  { sentence: 'He ___ never seen the Danube.', blank: 'has', options: ['has', 'have', 'had', 'is'] },
  { sentence: 'I ___ reading a very good book.', blank: 'am', options: ['am', 'is', 'are', 'be'] },
  { sentence: 'Please ___ me where the church is.', blank: 'tell', options: ['tell', 'told', 'say', 'said'] },
  { sentence: 'We ___ here for three months.', blank: 'have been', options: ['have been', 'are', 'was', 'will be'] },
  { sentence: 'She asked ___ we could visit again.', blank: 'if', options: ['if', 'that', 'what', 'which'] },
]

// ============= SPEED READING PASSAGES =============
export const SCRIPTURE_PASSAGES = [
  {
    text: 'And it came to pass that I, Nephi, said unto my father: I will go and do the things which the Lord hath commanded, for I know that the Lord giveth no commandments unto the children of men, save he shall prepare a way for them.',
    questions: [
      { q: 'Who is speaking?', a: 'Nephi', options: ['Nephi', 'Lehi', 'Moroni', 'Alma'] },
      { q: 'What will the Lord prepare?', a: 'A way', options: ['A way', 'Food', 'A ship', 'An army'] },
    ],
  },
  {
    text: 'Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you: For every one that asketh receiveth; and he that seeketh findeth.',
    questions: [
      { q: 'What happens when you ask?', a: 'It shall be given', options: ['It shall be given', 'You must wait', 'Nothing', 'You will work'] },
      { q: 'What three actions are mentioned?', a: 'Ask, seek, knock', options: ['Ask, seek, knock', 'Pray, fast, serve', 'Read, write, speak', 'Faith, hope, charity'] },
    ],
  },
  {
    text: 'And now, my sons, remember that it is upon the rock of our Redeemer, who is Christ, the Son of God, that ye must build your foundation; that when the devil shall send forth his mighty winds, ye may have no power over you.',
    questions: [
      { q: 'What should you build on?', a: 'The rock of Christ', options: ['The rock of Christ', 'Good works', 'The temple', 'Scripture'] },
      { q: 'What does the devil send?', a: 'Mighty winds', options: ['Mighty winds', 'Darkness', 'Temptation', 'Armies'] },
    ],
  },
]

// ============= SERVICE PROJECT RESOURCES =============
export const SERVICE_TASKS = [
  { name: 'Clean chapel', hours: 2, impact: 3, icon: '🧹' },
  { name: 'Visit elderly', hours: 3, impact: 4, icon: '👵' },
  { name: 'Move furniture', hours: 2, impact: 2, icon: '📦' },
  { name: 'Teach English', hours: 2, impact: 3, icon: '📚' },
  { name: 'Cook for family', hours: 3, impact: 3, icon: '🍲' },
  { name: 'Fix fence', hours: 1, impact: 1, icon: '🔨' },
  { name: 'Garden work', hours: 1, impact: 2, icon: '🌱' },
  { name: 'Sort donations', hours: 2, impact: 2, icon: '📦' },
]
