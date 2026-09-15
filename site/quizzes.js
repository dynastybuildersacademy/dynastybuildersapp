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
    title: 'Academy Week 1 — Prospect, Approach & Contact',
    questions: [
      { q: 'What should every new agent do on Day 1 of Week 1?', options: ['Submit their first application', 'Set up Bamboo, learn the PHP model, and write a personal "why" statement', 'Recruit their first agent', 'Attend PHP University'], answer: 1, explain: 'Day 1 is Orientation & Mindset Install — set up Bamboo, join team chat, and write your personal "why" statement, posted where you\'ll see it daily.' },
      { q: 'By when should all 25 names be filled into your Top 25 Worksheet?', options: ['Within your first month', 'Before you sleep on Day 2–3', 'By the end of Week 2', 'Whenever you get around to it'], answer: 1, explain: 'Day 2–3 instructs: open your Top 25 Worksheet and fill all 25 names before you sleep that night.' },
      { q: 'What should your first 10 contacts in Week 1 actually be?', options: ['Full sales pitches', 'Just conversations, not pitches', 'Recruiting interviews', 'Product presentations'], answer: 1, explain: 'Make your first 10 contacts — not pitches, just conversations. Send the financial survey to anyone who says "tell me more."' },
      { q: 'What do you send a contact once they say "tell me more"?', options: ['A business card', 'The financial survey', 'A signed contract', 'Nothing yet'], answer: 1, explain: 'The financial survey lets them do their own discovery — send it as soon as someone shows interest.' },
      { q: 'How many times should you practice the BOM invite script before using it live?', options: ['Once', '3 times', '10 times out loud', 'Only in your head'], answer: 2, explain: 'Learn the BOM invite script and practice it 10 times out loud before you start inviting your Top 25.' },
      { q: 'What should you say to a guest the night before a BOM to confirm them?', options: ['"Don\'t forget!"', '"We start at [time] — you\'re still coming, right?"', 'Nothing, just show up', '"Are you sure you want to come?"'], answer: 1, explain: 'A direct, simple confirmation the night before locks in the commitment and reduces no-shows.' },
      { q: 'How early should you arrive at a BOM you\'re bringing a guest to?', options: ['Right on time', '5 minutes early', '20 minutes early', 'An hour early'], answer: 2, explain: 'Arrive 20 minutes early to set up and personally greet your guest.' },
      { q: 'Where do you log your BOM guest?', options: ['Top 25 Worksheet', 'My BOM Tracker', 'Only in your head', 'You don\'t need to log it'], answer: 1, explain: 'Every guest gets logged in My BOM Tracker so nothing falls through the cracks.' },
      { q: 'Week 1 is Play 1 in the PHP system. What is Play 1 called?', options: ['Calls — Volume & System', 'Prospect, Approach & Contact', 'Follow Up', 'Duplication'], answer: 1, explain: 'Play 1 is Prospect, Approach & Contact — the foundation every other play builds on.' },
      { q: 'Which of these is an actual Week 1 KPI?', options: ['100+ dials this week', '25 names in Top 25 and 1 BOM attended', '6 RI appointments', '90-day plan written'], answer: 1, explain: 'Week 1 KPIs: 25 names in Top 25, 10 contacts made, 1 BOM attended, 1 guest invited to the next BOM.' },
    ]
  },

  // ── Week 2 Academy ─────────────────────────────────────────
  academy_week2: {
    id: 'academy_week2',
    title: 'Academy Week 2 — Calls, Volume & System',
    questions: [
      { q: 'What are the 3 steps of the 3-call system for a BOM invite?', options: ['Call, text, email', 'Invite → Confirm → Same-night follow-up', 'Pitch, close, follow-up', 'Cold call, warm call, hot call'], answer: 1, explain: 'Every BOM invite runs through Invite → Confirm → Same-night follow-up.' },
      { q: 'A good prospecting voicemail should be:', options: ['Long and detailed with all the information', 'Curiosity-driven, not information-driven', 'A hard sell', 'Read word-for-word off a script'], answer: 1, explain: 'Voicemails should create curiosity, not answer every question — that\'s what the callback is for.' },
      { q: 'What are the two highest-pickup call windows?', options: ['12–1 PM and 3–4 PM', '9–10 AM and 6–8 PM', 'Early morning only', 'Weekends only'], answer: 1, explain: 'Time-block around 9–10 AM and 6–8 PM — your highest-pickup windows.' },
      { q: 'What\'s the Week 2 dial target for Day 1?', options: ['10 dials', '20 dials', '50 dials', '100 dials'], answer: 1, explain: 'Day 1 target is 20 dials, building to 25 the next day — building the muscle with volume.' },
      { q: 'What\'s the correct response to "I\'m busy"?', options: ['"Call me when you\'re free"', '"I totally get that — this would only take 20 minutes. I can work around your schedule."', '"Then this isn\'t for you"', '"I\'ll just send you information instead"'], answer: 1, explain: 'Acknowledge it, minimize the ask, and offer flexibility — then still close with a time.' },
      { q: 'What\'s the correct response to "Send me info"?', options: ['"Sure, here it is"', '"I will — but can we do a quick 5-minute call first, so I send you the right thing?"', '"I don\'t have anything to send"', '"That means you\'re not interested"'], answer: 1, explain: 'Agree, then bridge back to a short call so the conversation doesn\'t die in a text thread.' },
      { q: 'How many calls should you make over Days 5–7 of Week 2?', options: ['10 calls', '25 calls', '50 calls', '100 calls'], answer: 2, explain: 'Make 50 calls over 3 days and track every result in your Activity Log.' },
      { q: 'After a BOM guest attends, what should your same-night follow-up ask?', options: ['"Are you ready to sign up?"', '"What stood out most?"', '"Do you have any money?"', 'Nothing — wait a week'], answer: 1, explain: '"What stood out most?" opens a real conversation about what landed for them.' },
      { q: 'How many objection scenarios should you role-play in Week 2?', options: ['3', '5', '10', '20'], answer: 2, explain: 'Role-play 10 objection scenarios with your upline or accountability partner.' },
      { q: 'Which of these is an actual Week 2 KPI?', options: ['1 co-appointment completed', '100+ dials this week', '90-day plan written', '1 captain identified'], answer: 1, explain: 'Week 2 KPIs: 100+ dials, a BOM guest brought, every call logged, and the 3-call system executed on 5+ prospects.' },
    ]
  },

  // ── Week 3 Academy ─────────────────────────────────────────
  academy_week3: {
    id: 'academy_week3',
    title: 'Academy Week 3 — Presentations',
    questions: [
      { q: 'What are the 5 steps of the appointment framework, in order?', options: ['Present, Discover, Connect, Handle, Close', 'Connect, Discover, Present, Handle, Close', 'Close, Present, Connect, Handle, Discover', 'Discover, Connect, Handle, Present, Close'], answer: 1, explain: 'The order is Connect → Discover → Present → Handle → Close.' },
      { q: 'How long is the "Discover" step, and what do you use in it?', options: ['15 min, a product brochure', '10 min, reviewing the financial survey together', '5 min, asking about hobbies', '20 min, a cold read'], answer: 1, explain: 'Discover is about 10 minutes, walking through their financial survey together and letting them describe the problem.' },
      { q: 'In the "Present" step, what should you tie the story to?', options: ['Generic company facts', 'Their specific situation, combined with numbers and emotion', 'Only the numbers', 'Nothing — just recite the script'], answer: 1, explain: 'Present ties the company story to their specific situation, blending numbers with emotion.' },
      { q: 'Which question is an example of the "Handle" step?', options: ['"Are you going to buy or not?"', '"What would it take for this to make sense for your family?"', '"Why are you hesitating?"', '"Let me know when you decide"'], answer: 1, explain: 'Handle addresses hesitation with curiosity rather than pressure.' },
      { q: 'How far in advance should you send the financial survey before a co-appointment?', options: ['Same day', '48 hours before', '1 week before', 'You don\'t need to send it'], answer: 1, explain: 'Send the survey 48 hours before so the appointment starts from real information.' },
      { q: 'In your first co-appointment, what role does your upline play?', options: ['They run the whole appointment', 'They\'re backup while you lead', 'They just observe silently', 'They aren\'t involved'], answer: 1, explain: 'You lead the appointment; your upline is there as backup, not to take over.' },
      { q: 'During the Day 3 role-play marathon, how many roles do you rotate through?', options: ['1 — just the agent', '2 — agent and client', '3 — agent, client, and observer giving feedback', '4 — including a narrator'], answer: 2, explain: 'You role-play all 5 steps 3 times, rotating through agent, client, and observer.' },
      { q: 'How many guests should you aim to bring to the Week 3 BOM?', options: ['0', '1', '2', '5'], answer: 2, explain: 'Attend BOM and bring 2 guests if possible.' },
      { q: 'After your co-appointment debrief, what should you write down?', options: ['Nothing, just move on', '3 things to improve', 'A full transcript', 'A complaint to your upline'], answer: 1, explain: 'Debrief immediately after: what landed, what didn\'t, and 3 specific things to adjust.' },
      { q: 'Which of these is an actual Week 3 KPI?', options: ['1 co-appointment completed', '100+ dials this week', '25 names in Top 25', '1 captain identified'], answer: 0, explain: 'Week 3 KPIs: 1 co-appointment completed, 2 appointments scheduled for next week, a BOM guest brought, and the 5-step framework memorized.' },
    ]
  },

  // ── Week 4 Academy ──────────────────────────────────────────
  academy_week4: {
    id: 'academy_week4',
    title: 'Academy Week 4 — Follow Up',
    questions: [
      { q: 'What percentage of sales happen between the 5th and 12th contact?', options: ['20%', '50%', '80%', '95%'], answer: 2, explain: 'The fortune is in the follow-up — 80% of sales happen between the 5th and 12th contact.' },
      { q: 'What must every name in your Top 25 have to be considered a real pipeline entry?', options: ['A phone number only', 'A next-action date and status', 'A referral source', 'Nothing special'], answer: 1, explain: 'If it doesn\'t have a next-action date, it\'s not in your pipeline — it\'s a wish list.' },
      { q: 'What\'s the contact rhythm for a brand-new lead?', options: ['Quarterly check-ins', 'The 5-touch sequence', 'One call and done', 'Wait for them to call you'], answer: 1, explain: 'New leads run the 5-touch sequence; warm leads get monthly contact, cold leads quarterly.' },
      { q: 'What happens on Touch 1 (Day 1) of the 5-touch sequence?', options: ['A value text with no ask', 'A BOM invitation', 'Post-meeting/post-BOM same-night call: "What stood out most?"', 'A re-qualifying question'], answer: 2, explain: 'Touch 1 is the same-night call right after the meeting or BOM.' },
      { q: 'What is Touch 2 (Day 3) of the 5-touch sequence?', options: ['A phone call', 'A value text — a stat, story, or article, with no ask', 'A BOM invite', 'An in-person visit'], answer: 1, explain: 'Touch 2 delivers value with zero ask — just a stat, client story, or relevant article.' },
      { q: 'What happens on Touch 4 (Day 14)?', options: ['Re-qualify or close', 'A value text', 'A BOM invitation', 'First contact'], answer: 2, explain: 'Touch 4 invites them to another BOM session, now that they know the basics.' },
      { q: 'On Touch 5 (Day 30), what should you ask?', options: ['"Are you ready to buy?"', '"Anything changed?" — then re-qualify, re-invite, or close', '"Why haven\'t you responded?"', 'Nothing — stop contacting them'], answer: 1, explain: 'Touch 5 checks in on what\'s changed and moves them to re-qualify, re-invite, or close.' },
      { q: 'In the "resurrect dead leads" drill, how far back should you look in your pipeline?', options: ['7–14 days', '30 days', '60–90 days', '1 year'], answer: 2, explain: 'Go back 60–90 days and find 10 "lost" prospects to reach back out to.' },
      { q: 'How many resurrected leads should you contact in Week 4?', options: ['3', '5', '10', '25'], answer: 2, explain: 'Find and call 10 lost prospects: "Has anything changed in your situation?"' },
      { q: 'Which of these is an actual Week 4 KPI?', options: ['Every Top 25 prospect has a next-action date', '100+ dials this week', '1 captain identified', '90-day plan written'], answer: 0, explain: 'Week 4 KPIs: every Top 25 prospect has a next-action date, the 5-touch sequence executed on 5 prospects, 10 resurrected leads contacted, and a BOM guest brought.' },
    ]
  },

  // ── Week 5 Academy ─────────────────────────────────────────
  academy_week5: {
    id: 'academy_week5',
    title: 'Academy Week 5 — Fast Start',
    questions: [
      { q: 'In Week 5, what is your primary new role?', options: ['Still just a producer', 'The upline — activating someone else the way you were activated', 'A CFT', 'An MD'], answer: 1, explain: 'Your income multiplies when you can activate someone else the way you were activated.' },
      { q: 'What should you look for in your Top 25 when identifying a recruit candidate?', options: ['Whoever responds fastest', 'Someone who has shown entrepreneurial energy', 'Only family members', 'Whoever is cheapest to reach'], answer: 1, explain: 'Look for entrepreneurial energy — someone who might actually want to build, not just buy.' },
      { q: 'The "opportunity conversation" should be framed as:', options: ['A hard pitch', 'A door-opener, not a pitch', 'A product demo', 'A final close'], answer: 1, explain: '"Can I share what I\'m doing over coffee?" opens a door — it doesn\'t force a decision.' },
      { q: 'What activation plan do you build and run with a new agent in Week 5?', options: ['A 24-hour activation', 'A 48-hour activation: Bamboo, Top 25, first calls, BOM invite', 'A 7-day activation only, never tested', 'A 90-day activation'], answer: 1, explain: 'You run a new agent (or yourself, Day 1) through the full 48-hour activation.' },
      { q: 'In the Fast Start Drill, what should you identify?', options: ['The 3 moments where new agents get stuck, and build a tool for each', 'The best time of day to call', 'Your own biggest objection', 'Nothing — just wing it'], answer: 0, explain: 'Find the 3 moments new agents typically get stuck and build a simple script or tool to unstick each one.' },
      { q: 'Who should you bring to the Week 5 BOM?', options: ['Just a prospect', 'A guest AND your recruit candidate', 'Only your upline', 'No one — sit alone'], answer: 1, explain: 'Bring a guest and your recruit candidate — working both paths at once.' },
      { q: 'What should your 1-on-1 debrief with your upline cover in Week 5?', options: ['Only your mistakes', 'Your biggest strengths and biggest growth edge at the 5-week mark', 'Financial details only', 'Nothing specific'], answer: 1, explain: 'This checkpoint conversation covers both what\'s working and your biggest growth edge.' },
      { q: 'What tracker should you update in Week 5 to check your promotion pace?', options: ['BOM Tracker', 'Promotion Tracker — checking pace for Associate', 'Top 25 Worksheet', 'Activity Log only'], answer: 1, explain: 'Update your Promotion Tracker to see if you\'re on pace for the Associate promotion.' },
      { q: 'What is Week 5\'s Play number and theme?', options: ['Play 4: Follow Up', 'Play 5: Fast Start — Activate Your Team', 'Play 6: Duplication', 'Play 3: Presentations'], answer: 1, explain: 'Week 5 is Play 5: Fast Start — Activate Your Team.' },
      { q: 'Which of these is an actual Week 5 KPI?', options: ['Recruit candidate identified and approached', '100+ dials this week', '1 co-appointment completed', '10 resurrected leads contacted'], answer: 0, explain: 'Week 5 KPIs: a recruit candidate identified and approached, a 48-hour activation plan written, a BOM guest brought, and the Promotion Tracker updated.' },
    ]
  },

  // ── Week 6 Academy ─────────────────────────────────────────
  academy_week6: {
    id: 'academy_week6',
    title: 'Academy Week 6 — Duplication & Graduation',
    questions: [
      { q: 'According to the duplication math, what does 1 agent doing 4 apps/week generate?', options: ['$1K', '$4K', '$10K', '$25K'], answer: 1, explain: '1 agent × 4 apps/week = $4K. 6 duplicating agents = $24K+. 20 duplicating agents = $100K+.' },
      { q: 'What are the 3 types of people in your downline described in Week 6?', options: ['Beginners, Intermediates, Experts', 'Producers, Builders, Leaders', 'Trainees, Associates, Directors', 'Hot, Warm, Cold'], answer: 1, explain: 'Producers work the 6 plays, Builders recruit and develop, Leaders duplicate themselves.' },
      { q: 'What does a "Leader" do, per the Week 6 framework?', options: ['Just works the 6 plays', 'Recruits and develops others', 'Duplicates themselves', 'Only attends BOMs'], answer: 2, explain: 'A Leader is someone who duplicates themselves — building people who build people.' },
      { q: 'What does a Captain do at every BOM?', options: ['Runs the presentation', 'Brings guests without being reminded', 'Handles registration', 'Pays for dinner'], answer: 1, explain: 'A captain brings guests to every BOM consistently, without being reminded.' },
      { q: 'How many captains should you aim to build in your first 90 days?', options: ['0', 'At least 1', '5', '10'], answer: 1, explain: 'Build at least 1 captain in your first 90 days as the start of your captain system.' },
      { q: 'A captain who brings 2 guests per BOM generates roughly how many guest-contacts per month?', options: ['2', '4', '8', '20'], answer: 2, explain: 'About 8 guest-contacts per month — roughly 1 new recruit per quarter from that activity alone.' },
      { q: 'Which of these is NOT one of the 6-Week Academy graduation requirements?', options: ['25 Top 25 contacts', '1 BOM guest', '1 co-appointment', 'Promotion to Marketing Director'], answer: 3, explain: 'Graduation requires 25 Top 25 contacts, 1 BOM guest, 1 co-appointment, a recruit candidate approached, and a first application if licensed — not MD promotion.' },
      { q: 'What should your 90-day plan include?', options: ['Income goal, appointment target, recruit target, and promotion level', 'Just a vacation plan', 'Nothing specific', 'Only a recruit count'], answer: 0, explain: 'Write a complete 90-day plan covering income, appointments, recruiting, and promotion level.' },
      { q: 'Who should you share your 90-day plan with?', options: ['No one — keep it private', 'Your upline, for commitment and accountability', 'Only your spouse', 'Post it publicly online'], answer: 1, explain: 'Sharing it with your upline turns a private hope into a committed, accountable plan.' },
      { q: 'Which of these is an actual Week 6 KPI?', options: ['1 captain identified', '100+ dials this week', '5-touch sequence executed', '2 appointments scheduled'], answer: 0, explain: 'Week 6 KPIs: a 90-day plan written and shared with your upline, 1 captain identified, the graduation checklist completed, and the Promotion Tracker updated.' },
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
  'week2':  ['academy_week2'],
  'week3':  ['academy_week3'],
  'week4':  ['academy_week4'],
  'week5':  ['academy_week5'],
  'week6':  ['academy_week6'],
  'cft':    ['cft_program'],
};

// All quiz IDs for progress tracking
const ALL_QUIZ_IDS = Object.values(QUIZ_BANK).map(q => q.id);
