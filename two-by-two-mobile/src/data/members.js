/**
 * Ward members — local church members the missionaries interact with.
 * Calling a member boosts spirit and has a small chance to generate a referral investigator.
 */
export const MEMBERS = [
  {
    id: 'kovacs_neni',
    name: 'Kovács néni',
    role: 'Ward Mother Hen',
    description: 'Always insists you eat. Her töltött káposzta has saved more missionaries than the MTC.',
    callQuotes: [
      '"Jaj, Elderek! You must come eat! You sound thin on the phone."',
      '"I prayed for you both this morning. Also, I made rétes."',
      '"Tell your companion he is too skinny. I will fix this."',
    ],
    callEffects: { spirit: 2 },
    referralChance: 0.15,
  },
  {
    id: 'toth_testver',
    name: 'Tóth testvér',
    role: 'Elders Quorum President',
    description: 'Quiet, dependable. Drives a battered Suzuki Swift and will move furniture at 6am without complaint.',
    callQuotes: [
      '"I can help Saturday. What time?"',
      '"The Elders before you were good. You are also good. Keep it up."',
      '"My neighbor asked about the church. Maybe you visit?"',
    ],
    callEffects: { spirit: 1 },
    referralChance: 0.20,
  },
  {
    id: 'nemeth_nover',
    name: 'Németh nővér',
    role: 'Relief Society President',
    description: 'Organized, sharp, runs the branch like a well-oiled machine. Has opinions about your Hungarian pronunciation.',
    callQuotes: [
      '"Your Hungarian is improving. Slightly."',
      '"I told Sister Balogh about the English class. She may come."',
      '"You should visit the Farkas family. They need encouragement."',
    ],
    callEffects: { spirit: 1 },
    referralChance: 0.15,
  },
  {
    id: 'farkas_csalad',
    name: 'Farkas család',
    role: 'Less-Active Family',
    description: 'Haven\'t been to church in months. Dad works double shifts, mom is overwhelmed. The kids remember Primary songs.',
    callQuotes: [
      '"Oh... hello Elder. We\'ve been meaning to come back..."',
      '"The children ask about Sunday School sometimes."',
      '"Thank you for calling. It means more than you know."',
    ],
    callEffects: { spirit: 1 },
    referralChance: 0.05,
  },
  {
    id: 'balogh_testver',
    name: 'Balogh testvér',
    role: 'Recent Convert',
    description: 'Baptized 6 months ago. Still figuring out church culture. Loves the Book of Mormon, confused by potlucks.',
    callQuotes: [
      '"Elder! I read 3 Nephi again. It\'s so good."',
      '"My coworker asked why I stopped drinking coffee. What do I say?"',
      '"Can you help me understand fast offering? I want to do it right."',
    ],
    callEffects: { spirit: 2 },
    referralChance: 0.10,
  },
]
