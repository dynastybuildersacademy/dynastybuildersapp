// ════════════════════════════════════════════════════════════════
// DBA QUIZ BANK — All quizzes for training.html + academy.html
// Sourced from PHP University, CFT Bootcamp, Scripts & Objections,
// Closing Questions deck, Edification, BOM scripts
// ════════════════════════════════════════════════════════════════

const QUIZ_BANK = {

  // ── Fast Track ─────────────────────────────────────────────
  fast_track_basics: {
    id: 'fast_track_basics',
    title: 'Fast Track — Launch Steps',
    questions: [
      { q: 'What is the first thing you should set up within 48 hours of enrolling?', options: ['Your social media page','PHP Bamboo account','Your Top 25 list','Business cards'], answer: 1, explain: 'Bamboo is your business command center. Everything flows through it — PHP Quest, license prep, activity tracking.' },
      { q: 'How many names should be in your Top 25 at all times?', options: ['10 names','20 names','25 names','As many as possible'], answer: 2, explain: 'Your Top 25 is a living list — never let it drop below 25 active prospects. Replace cold contacts weekly.' },
      { q: 'What is the Captain System rule for BOM invites?', options: ['Invite 5, expect 1 to show','Invite 10, confirm 3-5, expect 1-2 to show','Invite 20, expect 5 to show','Only invite warm market'], answer: 1, explain: 'Volume is the key. Invite 10 for every BOM — expect 3-5 confirmations and 1-2 to actually show up.' },
      { q: 'Within how many days of enrollment should you target getting licensed?', options: ['7 days','14 days','30 days','60 days'], answer: 2, explain: '30 days is the goal. Every day unlicensed is a day you cannot earn commission.' },
      { q: 'What should you send a prospect BEFORE every 1-on-1 appointment?', options: ['A business card','The financial survey','A product brochure','Nothing — surprise them'], answer: 1, explain: 'The financial survey lets them do the discovery for you. People who fill it out show up and buy.' },
    ]
  },

  // ── Calls & Scripts ────────────────────────────────────────
  calls_scripts: {
    id: 'calls_scripts',
    title: 'Calls & Scripts Mastery',
    questions: [
      { q: 'How long should a prospecting call ideally be?', options: ['5 minutes','10 minutes','2 minutes','As long as it takes'], answer: 2, explain: 'Calls should be 2 minutes. Get to the alternate of choice fast — your goal is a meeting, not a conversation.' },
      { q: 'What percentage of communication is TONE on a phone call?', options: ['7%','38%','55%','20%'], answer: 1, explain: '55% is body language, 38% is tone, only 7% is content. Smile when you dial — they can hear it.' },
      { q: 'What are the 3 phases of call mastery?', options: ['Good, Better, Best','Beginner, Intermediate, Expert','Awkward, Mechanical, Natural','Slow, Medium, Fast'], answer: 2, explain: 'Every agent goes through Awkward → Mechanical → Natural. You have to push through all three with volume.' },
      { q: 'In the BOM Invite script, after they say yes, what do you ask?', options: ['"Great, let me explain everything about PHP"','What\'s better for you, a weekday or weekend?','Can I sign you up now?','Do you want to bring a friend?'], answer: 1, explain: 'Always close with an alternate of choice — never ask an open-ended yes/no question. Weekday or weekend?' },
      { q: 'In the "Help Me" FT script, what do you tell them you need their help with?', options: ['Selling a product','Being one of your 10 training appointments','Joining PHP Agency','Coming to a BOM'], answer: 1, explain: 'You need 10 hands-on field training appointments. You value their opinion and are hoping they can be one. Pause after — they will ask how they can help.' },
      { q: 'What does "Always answer a question with a question" mean in practice?', options: ['Never answer anything directly','Use questions to control the conversation and uncover the real concern','Ask random questions to confuse prospects','Only ask about their family'], answer: 1, explain: 'The person asking questions controls the conversation. When they ask something, redirect with a question that moves you forward rather than giving information that opens new objections.' },
    ]
  },

  // ── Sales & Closing ────────────────────────────────────────
  sales_closing: {
    id: 'sales_closing',
    title: 'Sales & Closing — 5 Question Types',
    questions: [
      { q: 'A tie-down question does what?', options: ['Locks in agreement at the end of a statement','Confuses the prospect','Ends the conversation','Sets up an objection'], answer: 0, explain: '"Increasing your income is important to you, right?" — the tie-down word at the end locks in a yes before you move to the next point.' },
      { q: 'Which is the best example of an Alternate of Choice close?', options: ['"Would you like to get started?"','"Do you want insurance?"','"What\'s better for you — later today or tomorrow?"','"Are you ready to sign?"'], answer: 2, explain: 'Alternate of choice gives two options — both assume yes. Never ask "do you want to?" Ask "which option works better?"' },
      { q: 'What does an Assumptive question do?', options: ['Assumes they will say no','Speaks as if they have already said yes','Challenges the prospect','Asks for their opinion'], answer: 1, explain: '"Once you get your license, who would you want to help first?" — you are speaking as if it is already decided, which makes it feel more real.' },
      { q: 'What closes more sales — logic or emotion?', options: ['Logic, because people are rational','Emotion — logic only justifies the decision already made','They are equal','Neither — price closes sales'], answer: 1, explain: 'Find the emotion first, then give them the numbers to justify what they already want to do. "What\'s your biggest concern for your family?" is an emotional opener.' },
      { q: 'What does "Small yeses build the big yes" mean?', options: ['Start with tiny product packages','Get agreement throughout the presentation so the close feels natural','Small clients lead to bigger clients','First get a small commission, then larger ones'], answer: 1, explain: 'If they have been saying yes the whole time, it feels incongruent to say no at the close. Pre-close tie-downs throughout create momentum.' },
      { q: 'What is the best response to "I need to talk to my spouse"?', options: ['"Okay, call me when you have talked to them."','"If your spouse were here right now and liked what you liked, would you be ready to move forward today?"','"Your spouse will agree with you."','"This is a decision only you can make."'], answer: 1, explain: 'This surfaces the real objection. If they say yes, the spouse is not the real barrier. If no, now you know what the real concern is.' },
    ]
  },

  // ── Objection Handling ─────────────────────────────────────
  objections: {
    id: 'objections',
    title: 'Objection Handling',
    questions: [
      { q: 'Someone asks "Is this a pyramid scheme?" The best response is:', options: ['"No it\'s not, let me prove it."','"It\'s actually an MLM."','"What do you mean by that? [Let them explain.] If it was, I wouldn\'t be part of it. What\'s better for you, today or tomorrow?"','"We have a very unique business model..."'], answer: 2, explain: 'Ask what they mean — they usually cannot explain it. Then redirect immediately. Never get defensive or over-explain.' },
      { q: '"I don\'t have enough time." The correct framework is:', options: ['Agree and let them go','Feel, Felt, Found + redirect to a short meeting','Tell them to make time','Schedule for 6 months later'], answer: 1, explain: '"That means you\'re busy — and we like busy people, because busy people get things done. Why don\'t we set up 15-20 minutes? What\'s better for you?"' },
      { q: '"What is PHP?" should be answered with:', options: ['A full 5-minute company history','PHP is a financial marketing organization. We market for AIG, National Life and others. We\'ll go through that when we meet. What\'s better today or tomorrow?','Just the company website','Nothing — let them Google it'], answer: 1, explain: 'Keep it short, bridge to the meeting, always close with alternate of choice. Never give so much information they feel they have enough to make a decision without meeting.' },
      { q: '"Is this sales?" — the correct response is:', options: ['"No, not at all"','"Yes, and you\'d be great at it"','"Do you like sales? [Yes/No] Great — what\'s better for you later today or tomorrow?"','Avoid answering'], answer: 2, explain: 'Whether they like sales or not, your answer is the same — you redirect immediately. Both paths lead to the alternate of choice.' },
      { q: 'What is "Feel, Felt, Found" used for?', options: ['Opening a sales conversation','Handling the "I don\'t have time" or emotional objections with empathy','Closing an application','Edifying your upline'], answer: 1, explain: '"I understand how you FEEL — I FELT the same way when I started. What I FOUND was..." — it validates their concern, relates your story, then reframes.' },
    ]
  },

  // ── Recruiting ─────────────────────────────────────────────
  recruiting: {
    id: 'recruiting',
    title: 'Recruiting & Duplication',
    questions: [
      { q: 'What is the primary goal of the BOM Prospect script?', options: ['Close them on a policy','Get them to come to a BOM that evening','Sign them up as an agent','Give them product information'], answer: 1, explain: 'The BOM does the selling for you. Your only job on the call is to get a body in the seat. Reference that you have 2 seats left to create urgency.' },
      { q: 'In the "Booking FT for a New Agent" script, what is the trainer\'s role during the presentation?', options: ['They sit quietly','The new agent runs it while trainer observes','The trainer runs the full presentation while the new agent sits beside them and takes notes','They split the presentation 50/50'], answer: 2, explain: 'The trainer runs the appointment. The new agent is silent, takes notes, and learns by watching. This is how skills are transferred.' },
      { q: 'What does the 2-minute story (Edification) cover?', options: ['Product features','Your credentials and licenses','Beginning (why you joined), Middle (how it has impacted you), End (what you are building)','Company history'], answer: 2, explain: 'Your 2-minute story is your recruiting weapon. Beginning: why you got involved. Middle: how it has changed things. End: what you are working toward.' },
      { q: 'How many numbers should you add to your Top 25 EVERY day?', options: ['0 — only replace when someone says no','1 per day','2 to 5 per day','10 per day'], answer: 2, explain: 'Always add 2-5 numbers per day. Treat your Top 25 like gold. Your pipeline is always evaporating — keep refilling it.' },
      { q: 'What is the "33 Wide" model?', options: ['Recruit 33 agents in one year','Always work 33 active contacts: 11 hot, 11 warm, 11 cold simultaneously','Send 33 texts per day','Attend 33 BOMs per year'], answer: 1, explain: '33 Wide means you always have 33 contacts in play across three temperature zones. When someone falls out, immediately replace them. 80% of results come from 20% of activities — prospecting and calls.' },
    ]
  },

  // ── CFT Program ────────────────────────────────────────────
  cft_program: {
    id: 'cft_program',
    title: 'CFT — Certified Field Trainer',
    questions: [
      { q: 'What is the minimum level required to attend CFT Boot Camp?', options: ['Trainee','Associate','Director','Marketing Director'], answer: 1, explain: 'You must be at least an Associate in the system — licensed, with your first production and recruits.' },
      { q: 'Which is NOT a benefit of becoming a CFT?', options: ['Ranked on the Match-Up list','Commission splits on FT appointments','Automatic Marketing Director promotion','Duplicate CFTs on your team'], answer: 2, explain: 'CFT does not automatically make you an MD — but it accelerates the path by making you a stronger recruiter and producer. The $50K income target comes from splits and increased personal production.' },
      { q: 'Week 5 of the CFT curriculum covers:', options: ['Calls and scripts','Recruiting interview','Kitchen Table Presentation — Life Insurance (DIME, illustrations, closing)','Annuity presentations'], answer: 2, explain: 'Week 5 is KTP Life: Building rapport, DIME framework, running Term/GUL/IUL illustrations, closing questions, and what to do after policy approval.' },
      { q: 'What is the graduation production requirement for CFT?', options: ['1 recruit and 1 client','6 RI appointments, 1 direct recruit, 3 base recruits, 3 KTP appointments, 3K points','10 apps submitted','Any production during the 9 weeks'], answer: 1, explain: 'Minimums: 6 RI appointments, 1 direct + 3 base recruits, 3 KTP appointments, 1 client/week at 1K pts, 3 base clients at 3K pts total.' },
      { q: 'In the CFT field training appointment, what does DIME stand for?', options: ['Determination, Income, Money, Energy','Death, Income, Mortgage, Education','Direct, Indirect, Mutual, Exchange','None of the above'], answer: 1, explain: 'DIME = Death (life insurance gap), Income (income replacement), Mortgage (debt protection), Education (college funding). These are the four financial needs you address with every family.' },
    ]
  },

  // ── PHP University / MD Track ──────────────────────────────
  md_track: {
    id: 'md_track',
    title: 'PHP University — MD Track',
    questions: [
      { q: 'What are the PHP University graduation requirements?', options: ['Just attend all classes','6 direct recruits, 30K personal points, promote 1 direct FA, 5 new licensed agents, $10K cash flow','Submit 10 applications','Make Marketing Director'], answer: 1, explain: 'PHP-U graduation: 6 directs · 30,000 personal points · Promote 1 Direct FA · Associate count +10 for two consecutive BOMs · 5 new licensed agents · $10K cash flow.' },
      { q: 'What does Associate promotion require?', options: ['Just get licensed','2 Recruits, 2 Applications, 2,000 points','5 recruits','Submit 10 applications'], answer: 1, explain: '2R / 2A / 2K pts = Associate. This is the first promotion and unlocks the 40% commission level.' },
      { q: 'Director level requires:', options: ['Be licensed for 1 year','2 personally promoted agents + 8 team recruits','Submit 50 applications','None of the above'], answer: 1, explain: 'Director = 2 promoted agents under you + 8 team recruits. This is where override income begins.' },
      { q: 'What does the CFT Match-Up system do?', options: ['Matches clients to products','Connects licensed CFTs with new agents who need field training appointments','Matches recruits to uplines','Schedules BOMs automatically'], answer: 1, explain: 'The Match-Up list connects qualified CFTs with new agents who need to complete their field training appointments. Being on the list is a benefit earned through CFT certification.' },
      { q: 'What is the DBA vision for 2029?', options: ['100 Marketing Directors','1,000 six-figure earners and 100 seven-figure earners','40,000 independent licensed agents and 800 Marketing Directors','Open 50 offices'], answer: 2, explain: 'Dynasty Builders Academy: develop 40,000 independent licensed agents by 2029 · Promote 800 Marketing Directors · 100 SVPs · Multiple Chairman and Board Council members.' },
    ]
  },

  // ── Book Club — 3 Feet From Gold ──────────────────────────
  book_3feet: {
    id: 'book_3feet',
    title: '3 Feet From Gold — Key Principles',
    questions: [
      { q: 'What does "3 Feet From Gold" mean in the context of your business?', options: ['You are always 3 feet from your next paycheck','Most people quit right before their breakthrough — success is closer than they think','The policy commission is worth 3% of the premium','You need 3 referrals from every client'], answer: 1, explain: 'Most people stop digging right before they strike gold. The moment of maximum resistance is always right before the breakthrough. Whatever you are facing — do not stop now.' },
      { q: 'What is the single most important factor in determining success in this business?', options: ['Having the right upline','Your scripts being perfect','Your conviction and decision to not quit','Your location'], answer: 2, explain: 'The person with the most conviction wins. Success is a decision first, then an activity.' },
      { q: 'According to the book, what should you do when you hit a wall?', options: ['Take a break','Call your upline to complain','Push harder — walls mean you are close','Switch to a different prospect list'], answer: 2, explain: 'Resistance signals proximity to the goal. Push harder through the awkward phase, through the slow week, through the objection — the win is on the other side.' },
    ]
  },

  // ── Week 1 Academy ─────────────────────────────────────────
  academy_week1: {
    id: 'academy_week1',
    title: 'Academy Week 1 — Foundation',
    questions: [
      { q: 'How soon should your Bamboo account be fully set up?', options: ['Within 1 week','Within 30 days','Within 48 hours of enrollment','Before your license is approved'], answer: 2, explain: 'Every hour of delay costs belief. Bamboo setup, group chat join, Top 25 start — all within the first 48 hours.' },
      { q: 'What is the "sprint award" for completing fast start requirements in less than 7 days?', options: ['A cash bonus','A free playbook','A promotion to Associate','Extra points'], answer: 1, explain: '7 days is the standard for Fast Start qualifying. Less than 7 days = sprint award: a free playbook. Speed creates momentum and belief.' },
      { q: 'In Week 1, what are the Fast Start qualifying requirements?', options: ['Get licensed','3 appointments, 3 BOM guests, register for license exam, Top 25 list started','Submit 5 applications','Recruit 2 people'], answer: 1, explain: '3 appointments + 3 BOM guests + license exam registered + Top 25 started = Fast Start qualification. Aim to complete all within 7 days.' },
    ]
  },

  // ── Week 4 — Recruiting Interview ──────────────────────────
  academy_week4: {
    id: 'academy_week4',
    title: 'Academy Week 4 — Recruiting Interview',
    questions: [
      { q: 'What is the formula for becoming an MD through Associate promotions?', options: ['Recruit 10 people','Drive Associate promotions in your downline — each promoted associate earns you credit toward MD','Submit 100 applications','Open your own office'], answer: 1, explain: 'MDs are made by driving promotions, not just recruiting. Each Associate you promote counts toward your own promotion requirements.' },
      { q: 'What should you do IMMEDIATELY after enrolling a new agent?', options: ['Nothing — let them figure it out','Walk them through the 48-hour activation: Bamboo, Top 25, first calls, BOM invite','Schedule their license exam','Give them all the scripts at once'], answer: 1, explain: 'Speed of activation = speed of income. Walk them through Bamboo setup, help them build their Top 25, make first calls together, send their first BOM invite — all within 48 hours.' },
      { q: 'What is the purpose of the Recruiting Interview (RI)?', options: ['To screen out unqualified candidates','To share the business opportunity, build rapport, and determine if there is a fit','To present all product details','To test their sales skills'], answer: 1, explain: 'The RI is a conversation to share what we do, understand their situation, and see if there is a mutual fit. It is not a pitch — it is a dialogue.' },
    ]
  },

};

// ── Map module IDs to quiz IDs ────────────────────────────────
const QUIZ_MAP = {
  'ft-modules':     ['fast_track_basics'],
  'sales-modules':  ['sales_closing', 'objections'],
  'rec-modules':    ['calls_scripts', 'recruiting'],
  'lead-modules':   ['md_track'],
  'prod-modules':   ['cft_program'],
  'mindset-modules':['book_3feet'],
  // Academy weeks
  'week1':  ['academy_week1'],
  'week4':  ['academy_week4'],
  'cft':    ['cft_program'],
};

// All quiz IDs for progress tracking
const ALL_QUIZ_IDS = Object.values(QUIZ_BANK).map(q => q.id);
