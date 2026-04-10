/**
 * Companion micro-dialogue lines.
 * Keyed by companion ID → activity ID → mood (happy/neutral/unhappy).
 * Each entry is an array of short lines the companion says when you start that activity.
 * Falls back to archetype-level defaults, then generic lines.
 */

// Generic fallback lines any companion might say, keyed by activity
const GENERIC_DIALOGUE = {
  study_language: {
    happy: ['Let\'s crush these flashcards.', 'My Hungarian is getting better, I can feel it.'],
    neutral: ['Okay, grammar time.', 'How do you conjugate this one again?'],
    unhappy: ['I guess we\'re studying.', 'I can barely focus today.'],
  },
  street_contact: {
    happy: ['I\'ve got a good feeling about today.', 'Let\'s find someone ready to hear the message.'],
    neutral: ['Deák tér again?', 'Here we go.'],
    unhappy: ['Nobody wants to talk to us.', 'This is pointless.'],
  },
  teach_lesson: {
    happy: ['This investigator is really progressing!', 'I prepared extra for this one.'],
    neutral: ['Ready when you are.', 'Let\'s see how it goes.'],
    unhappy: ['I hope they even show up.', 'Let\'s just get through this.'],
  },
  companion_study: {
    happy: ['I like studying together.', 'Quiz me on anything!'],
    neutral: ['Your turn to pick the topic.', 'What are we working on?'],
    unhappy: ['Fine. Let\'s study.', '...'],
  },
  personal_study: {
    happy: ['Take your time. I\'ll be right here.', 'I love a good scripture session.'],
    neutral: ['I\'ll study my own stuff.', 'Quiet time, got it.'],
    unhappy: ['At least it\'s quiet.', 'Whatever.'],
  },
  member_visit: {
    happy: ['Sister Kovács always has the best food!', 'I love visiting members.'],
    neutral: ['Hope they don\'t make us eat kocsonya again.', 'Let\'s be good guests.'],
    unhappy: ['I don\'t feel like socializing.', 'Do we have to?'],
  },
  service_project: {
    happy: ['Nothing like honest work!', 'This is what it\'s all about.'],
    neutral: ['Where are we helping today?', 'Hand me that rake.'],
    unhappy: ['My back already hurts.', 'Why do we always get the hard jobs?'],
  },
  english_class: {
    happy: ['These classes are so fun.', 'I think some of them are actually interested.'],
    neutral: ['Ready to teach some English.', 'Same room as last time?'],
    unhappy: ['They\'re just here for free English.', 'This feels like a waste.'],
  },
  buy_food: {
    happy: ['Tesco run! I love Tesco!', 'Let\'s get some túró rudi.'],
    neutral: ['We need peppers and bread at least.', 'Grocery time.'],
    unhappy: ['Everything is so expensive.', 'I miss American grocery stores.'],
  },
  buy_peanut_butter: {
    happy: ['YES. Peanut butter day!', 'Worth every forint.'],
    neutral: ['The import stuff? That\'s like half our budget.', 'I mean... it does taste like home.'],
    unhappy: ['We can\'t afford this.', 'I guess if it helps.'],
  },
  buy_books: {
    happy: ['A new phrasebook! Let\'s go!', 'Books are always a good investment.'],
    neutral: ['Could be useful.', 'Which bookstore?'],
    unhappy: ['Another book we won\'t finish.', 'Sure.'],
  },
  buy_clothes: {
    happy: ['Looking sharp, Elder!', 'A new white shirt — classic.'],
    neutral: ['We probably need this.', 'Is there a sale?'],
    unhappy: ['More white shirts. Thrilling.', 'Fine.'],
  },
  visit_investigator: {
    happy: ['Let\'s check in on them!', 'The personal touch matters.'],
    neutral: ['Hope they\'re home.', 'Let\'s see how they\'re doing.'],
    unhappy: ['They probably don\'t want to see us.', 'If they\'re even there.'],
  },
  // P-Day activities
  letters_home: {
    happy: ['Tell your mom I said hi!', 'I love letter day.'],
    neutral: ['Time to write home.', 'What do I even say this week?'],
    unhappy: ['I don\'t know what to write.', 'Home feels so far away.'],
  },
  laundry: {
    happy: ['Clean clothes, clean conscience!', 'That machine sounds possessed but it works.'],
    neutral: ['Laundry day.', 'Did you separate your whites?'],
    unhappy: ['The basement smells weird.', 'Ugh, laundry.'],
  },
  explore_city: {
    happy: ['Budapest is incredible.', 'Let\'s find somewhere new!'],
    neutral: ['Where should we go?', 'Tram 4/6 end to end?'],
    unhappy: ['I guess we can walk around.', 'I\'d rather just stay in.'],
  },
  sports: {
    happy: ['Let\'s GO! Game time!', 'I\'ve been waiting for this all week!'],
    neutral: ['Hope the members show up.', 'Basketball or foci?'],
    unhappy: ['I\'m not really in the mood.', 'Try not to get hurt this time.'],
  },
  shopping: {
    happy: ['P-Day shopping spree!', 'Let\'s hit Váci út.'],
    neutral: ['Need anything specific?', 'Let\'s not go overboard.'],
    unhappy: ['We barely have money for this.', 'Make it quick.'],
  },
  pday_study: {
    happy: ['Extra credit! I respect that.', 'The subjunctive awaits.'],
    neutral: ['Studying on P-Day? Alright.', 'Dedication.'],
    unhappy: ['Can\'t we just relax today?', 'It\'s our day off...'],
  },
  companion_activity: {
    happy: ['This is gonna be great!', 'Lángos by the Danube?'],
    neutral: ['What do you want to do?', 'Lead the way.'],
    unhappy: ['I guess we\'re hanging out.', 'Fine, what do you want to do?'],
  },
}

// Companion-specific overrides — these replace the generic lines for that companion + activity combo.
// Only need to define activities where this companion would say something distinctive.
const COMPANION_OVERRIDES = {
  thompson: {
    study_language: {
      happy: ['I memorized twenty new words today!', 'Okay wait, how do you say "baptize" again?'],
      neutral: ['I mixed up "kezét" and "kesét" again... hand or knife?', 'This language is impossible. But I\'m trying.'],
      unhappy: ['I\'ll never learn this language.', 'Everyone talks so fast here.'],
    },
    street_contact: {
      happy: ['I practiced my opening line in the mirror!', 'What if we find a golden contact??'],
      neutral: ['Do I look okay? Is my tie straight?', 'What if they ask me something I can\'t answer in Hungarian?'],
      unhappy: ['They can tell I have no idea what I\'m saying.', 'Can you do the talking?'],
    },
    teach_lesson: {
      happy: ['I actually understood the last lesson!', 'Can I take the lead this time?'],
      neutral: ['I\'ll just follow your lead.', 'Should I bring the flip chart?'],
      unhappy: ['Please don\'t make me teach. Not today.', 'I\'ll mess it up.'],
    },
    companion_study: {
      happy: ['I love when we study together!', 'Can we practice the discussions again?'],
      neutral: ['Role play? I\'ll be the investigator.', 'What should we work on?'],
      unhappy: ['I feel like I\'m slowing you down.', 'Sorry. I\'m trying.'],
    },
    buy_peanut_butter: {
      happy: ['I brought three jars from home but they\'re GONE.', 'Best purchase of the mission.'],
      neutral: ['It\'s expensive but... it\'s peanut butter.', 'My mom would understand.'],
      unhappy: ['I miss Skippy so much.', 'This is the only thing keeping me going.'],
    },
  },
  nagy: {
    study_language: {
      happy: ['My nagymama would be happy I\'m practicing.', 'The accent is coming back to me!'],
      neutral: ['Some of these words I know from home.', 'I should call nagymama and practice.'],
      unhappy: ['I thought I knew more Hungarian than this.', 'Growing up bilingual didn\'t prepare me for THIS.'],
    },
    teach_lesson: {
      happy: ['I can share my own conversion story if it helps.', 'The Spirit will guide us.'],
      neutral: ['Let\'s pray before we go in.', 'I know how it feels to be in their shoes.'],
      unhappy: ['What if my testimony isn\'t strong enough?', 'I feel like a fraud sometimes.'],
    },
    member_visit: {
      happy: ['They remind me of my family back home.', 'Budapest members are the best.'],
      neutral: ['I wonder if nagymama knows any of these families.', 'Let\'s bring something.'],
      unhappy: ['Being around families makes me miss mine.', 'It\'s hard sometimes.'],
    },
    service_project: {
      happy: ['This is pure Christianity right here.', 'My grandfather always said: serve first, preach second.'],
      neutral: ['Let\'s work hard today.', 'Service clears my head.'],
      unhappy: ['At least helping others takes my mind off things.', 'Let\'s just do this.'],
    },
  },
  wright: {
    study_language: {
      happy: ['Fine, I\'ll admit the language modules are useful.', 'I actually know a shortcut for this verb tense.'],
      neutral: ['I could teach you more Hungarian in five minutes at a bus stop.', '87 more days of flashcards.'],
      unhappy: ['You study. I\'ll supervise.', 'I didn\'t learn Hungarian from books. I learned it on the streets.'],
    },
    street_contact: {
      happy: ['Watch and learn, Elder. I\'ll show you how it\'s done.', 'I know exactly where the good contacts hang out.'],
      neutral: ['Same corner, same pitch.', 'Let me handle the old ladies — they love me.'],
      unhappy: ['What\'s the point? I\'m leaving in three months.', 'You\'re the future. I\'m the past.'],
    },
    teach_lesson: {
      happy: ['Okay, FINE. When I try, I\'m still the best teacher in this zone.', 'Let\'s make this one count.'],
      neutral: ['I\'ve taught this discussion about four hundred times.', 'I know all the objections before they say them.'],
      unhappy: ['You teach. I\'ll sit there and look experienced.', 'This investigator is going to drop. I can tell.'],
    },
    companion_study: {
      happy: ['Alright, I\'ll actually try today.', 'I have some war stories that might help you.'],
      neutral: ['What do you want to know? I\'ve seen it all.', 'Ask me anything about the mission. Anything.'],
      unhappy: ['Can we just sit here in silence?', 'I need to write my girlfriend.'],
    },
    explore_city: {
      happy: ['NOW we\'re talking. I know every hidden spot in Budapest.', 'Let me show you the real city.'],
      neutral: ['I know a good lángos place off Blaha.', 'Free at last, for a few hours.'],
      unhappy: ['Even the city feels old to me now.', 'Whatever. At least we\'re not tracting.'],
    },
    buy_peanut_butter: {
      happy: ['The black market peanut butter guy owes me a favor.', 'This is the one expense I\'ll never regret.'],
      neutral: ['I know where to get it cheaper.', 'My girlfriend sends me Jif but it never arrives.'],
      unhappy: ['Even peanut butter can\'t fix today.', 'Sure, why not.'],
    },
  },
  park: {
    study_language: {
      happy: ['Excellent initiative! Let\'s set a timer — 45-minute blocks.', 'I prepared vocab cards sorted by frequency.'],
      neutral: ['Have you been tracking your daily study minutes?', 'Let\'s be efficient about this.'],
      unhappy: ['Your study habits need work, Elder.', 'We\'re falling behind the zone average.'],
    },
    street_contact: {
      happy: ['20 contacts today. I believe in us.', 'I printed new handout cards. Double-sided.'],
      neutral: ['Let\'s hit our numbers.', 'Stay focused. No wasted interactions.'],
      unhappy: ['Our contact numbers are embarrassing.', 'Are you even trying out there?'],
    },
    teach_lesson: {
      happy: ['Textbook preparation leads to Spirit-led lessons.', 'I reviewed the discussion three times already.'],
      neutral: ['Follow the outline. It works for a reason.', 'Let\'s debrief afterward.'],
      unhappy: ['That last lesson was sloppy. We need to do better.', 'The mission president would not be pleased.'],
    },
    companion_study: {
      happy: ['Companion study is the foundation of a strong companionship!', 'I have a study plan mapped out for the transfer.'],
      neutral: ['Let\'s stay on topic today.', 'Open to Preach My Gospel, chapter 3.'],
      unhappy: ['This isn\'t optional, Elder.', 'We clearly need this.'],
    },
    personal_study: {
      happy: ['Take your time. Personal revelation matters.', 'I set goals for my personal study. You should too.'],
      neutral: ['30 minutes minimum.', 'Focus.'],
      unhappy: ['I hope you\'re actually studying.', 'Don\'t just read — ponder.'],
    },
    service_project: {
      happy: ['Service hours look great on our weekly report.', 'Let\'s document what we did for zone meeting.'],
      neutral: ['We should take before and after photos.', 'Stay organized.'],
      unhappy: ['At least we\'re being productive.', 'This barely counts toward our goals.'],
    },
    pday_study: {
      happy: ['Studying on P-Day? Now THAT\'S dedication.', 'I always study an extra hour on P-Day.'],
      neutral: ['Good choice. Consistency is key.', 'We can\'t afford to fall behind.'],
      unhappy: ['We need this. Our numbers demand it.', 'Every hour counts.'],
    },
  },
  jensen: {
    study_language: {
      happy: ['Did you know "dragon" in Hungarian is "sárkány"? That\'s rad.', 'I made a game out of the flashcards. Wanna try?'],
      neutral: ['Ugh, more grammar?', 'What if we just watched a Hungarian movie instead?'],
      unhappy: ['My brain is full.', 'Can we do literally anything else?'],
    },
    street_contact: {
      happy: ['I bet I can make someone laugh in under 30 seconds.', 'Watch this — I do accents.'],
      neutral: ['Let\'s make it a game. First one to get a callback wins.', 'Fine, but I\'m doing my funny opening.'],
      unhappy: ['Street contacting is the Dark Souls of missionary work.', 'I\'d rather fight a boss battle.'],
    },
    teach_lesson: {
      happy: ['What if I used sock puppets to explain the Restoration?', 'People love stories. I\'m gonna tell a GREAT story.'],
      neutral: ['I\'ll wing it. It\'s more authentic that way.', 'Can I draw on the whiteboard?'],
      unhappy: ['I\'m not feeling inspired today.', 'Do I have to follow the outline?'],
    },
    companion_study: {
      happy: ['Okay but AFTER can we play something?', 'Study buddies!'],
      neutral: ['Five more minutes of Tetris? Then I\'m all yours.', 'What if we studied the fun parts?'],
      unhappy: ['Studying is the worst.', 'I\'ll be here physically. No promises about mentally.'],
    },
    sports: {
      happy: ['GAME TIME! I\'ve been waiting ALL WEEK!', 'I call point guard!'],
      neutral: ['Sports > everything else on P-Day.', 'Finally something fun.'],
      unhappy: ['Even sports can\'t fix my mood today.', 'I\'ll play but don\'t expect much.'],
    },
    explore_city: {
      happy: ['I heard there\'s an arcade near Blaha Lujza tér!', 'What if we found a comic shop?'],
      neutral: ['Budapest is basically an open-world RPG.', 'Side quest time.'],
      unhappy: ['Whatever. At least we\'re outside.', 'Everything reminds me of a video game I\'d rather be playing.'],
    },
    buy_peanut_butter: {
      happy: ['The sacred American import!', 'Peanut butter + túró rudi = the missionary combo.'],
      neutral: ['A man needs his p.b.', 'It\'s not a luxury, it\'s a necessity.'],
      unhappy: ['Even peanut butter can\'t save this day.', 'Whatever.'],
    },
  },
  mortensen: {
    study_language: {
      happy: ['The gift of tongues is real, Elder. I\'ve felt it.', 'Every word we learn brings us closer to these people.'],
      neutral: ['Let\'s pray for understanding first.', 'Diligence in study is a commandment.'],
      unhappy: ['I\'m struggling today but I won\'t give up.', 'This is a trial. Trials make us stronger.'],
    },
    street_contact: {
      happy: ['I testify that someone out there needs us today.', 'The Lord will put the right person in our path.'],
      neutral: ['Let\'s go with faith.', 'Even if no one listens, we planted a seed.'],
      unhappy: ['Rejection is part of the refiner\'s fire.', 'I know this matters even when it hurts.'],
    },
    teach_lesson: {
      happy: ['I prepared a spiritual thought for the opening. And the closing.', 'I can feel the Spirit already.'],
      neutral: ['Let\'s follow the Spirit\'s guidance.', 'I\'ll bear my testimony if there\'s an opening.'],
      unhappy: ['I pray this reaches their heart.', 'Sometimes faith is all we have.'],
    },
    companion_study: {
      happy: ['Studying the gospel with you is a blessing.', 'I had the most incredible insight during prayer this morning!'],
      neutral: ['Where should we start? I have my scriptures triple-marked.', 'Let\'s read together.'],
      unhappy: ['We need to study harder. Our investigators need us.', 'I\'m worried about our companionship, Elder.'],
    },
    personal_study: {
      happy: ['There is nothing more important than this.', 'I could study scriptures all day.'],
      neutral: ['Take your time with the Lord.', 'I\'ll be in prayer.'],
      unhappy: ['I need this time to find answers.', 'The Lord is testing me.'],
    },
    service_project: {
      happy: ['When ye are in the service of your fellow beings!', 'Pure religion. James 1:27.'],
      neutral: ['Let\'s serve with all our hearts.', 'This is the Savior\'s work.'],
      unhappy: ['Service heals the soul. I believe that.', 'Maybe this will help me feel better.'],
    },
    letters_home: {
      happy: ['I\'m writing my testimony to my family.', 'My mission journal is going to be a book someday.'],
      neutral: ['I should write my bishop too.', 'Time to share my spiritual experiences.'],
      unhappy: ['I need to write my parents. They\'re worried about me.', 'Words are hard today.'],
    },
  },
  kimball: {
    study_language: {
      happy: ['I actually remembered all the words today!', 'It\'s getting easier. I think.'],
      neutral: ['I keep thinking in English.', 'Is it okay if I\'m slow at this?'],
      unhappy: ['I just can\'t concentrate.', 'Hungarian sounds like gibberish to me.'],
    },
    street_contact: {
      happy: ['Someone smiled at me! A real smile!', 'Maybe I can do this.'],
      neutral: ['Please don\'t leave my side.', 'What if I say the wrong thing?'],
      unhappy: ['Everyone looks so intimidating.', 'Can you just... be nearby?'],
    },
    teach_lesson: {
      happy: ['I actually felt the Spirit in that lesson!', 'Thanks for letting me share my testimony.'],
      neutral: ['I\'ll try not to cry this time.', 'I get nervous talking to strangers.'],
      unhappy: ['I don\'t think I can do this today.', 'What if they ask me a hard question?'],
    },
    companion_study: {
      happy: ['I like when we study together. It\'s less lonely.', 'You\'re a really good teacher.'],
      neutral: ['At least I\'m not alone.', 'Thanks for being patient.'],
      unhappy: ['I just want to sit here with someone.', 'Being together helps.'],
    },
    member_visit: {
      happy: ['Their family reminds me of home. In a good way!', 'The kids are so cute.'],
      neutral: ['Families are nice to be around.', 'I wonder what my family is doing right now.'],
      unhappy: ['Being around families makes me miss mine so much.', 'I might cry. Sorry in advance.'],
    },
    letters_home: {
      happy: ['Mom is going to love hearing about our week!', 'I have so much to tell them!'],
      neutral: ['I write home every week. Sometimes twice.', 'Do you think they read my letters right away?'],
      unhappy: ['I don\'t know what to say. "I miss you" isn\'t enough.', 'Writing home makes it worse sometimes.'],
    },
    companion_activity: {
      happy: ['This is the best day of the week!', 'Can we just hang out? Like friends?'],
      neutral: ['Thanks for spending time with me.', 'What should we do?'],
      unhappy: ['I just don\'t want to be alone.', 'Please don\'t leave me today.'],
    },
    sports: {
      happy: ['I\'m not very good but I love playing!', 'This reminds me of rec league at home!'],
      neutral: ['Go easy on me, okay?', 'Sports are better with friends.'],
      unhappy: ['I\'ll watch from the side.', 'I\'m not really up for it.'],
    },
  },
}

/**
 * Get a companion dialogue line for a given activity.
 * @param {object} companion - The companion object (with id, rapport)
 * @param {string} activityId - The activity being performed
 * @param {string} mood - 'happy', 'neutral', or 'unhappy'
 * @returns {string|null} A dialogue line, or null if none found
 */
export function getCompanionDialogue(companion, activityId, mood) {
  // Try companion-specific override first
  const overrides = COMPANION_OVERRIDES[companion.id]
  if (overrides?.[activityId]?.[mood]?.length) {
    const lines = overrides[activityId][mood]
    return lines[Math.floor(Math.random() * lines.length)]
  }

  // Fall back to generic lines
  if (GENERIC_DIALOGUE[activityId]?.[mood]?.length) {
    const lines = GENERIC_DIALOGUE[activityId][mood]
    return lines[Math.floor(Math.random() * lines.length)]
  }

  return null
}
