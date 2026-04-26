// services/coupledynamics.ts

// This data structure provides the building blocks for creating dynamic, three-part advice.
// It includes the 'state' of the person, the 'theme' of the day, and interactive advice.

const adviceMatrix: { [key: number]: { userState: string; partnerState: string; worldTheme: string; supportAdvice: { [key: number]: string } } } = {
  1: {
    userState: "Today, your internal energy is all about initiative, independence, and new beginnings. You're feeling a strong pull to start something, take the lead, and act on your own ideas. You might feel a bit impatient, as your mind is focused on 'what's next.'",
    partnerState: "Your partner is feeling a surge of initiative and a need for independence. They are internally focused on starting something new and may seem a bit self-directed or impatient. This isn't personal; it's a powerful drive for personal progress.",
    worldTheme: "The universal energy of the day is about new beginnings and taking the lead. It's a 'green light' day for anyone with a clear plan, supporting bold action and fresh starts.",
    supportAdvice: {
      1: "You're both in a '1' energy, which is dynamic but can lead to clashes. The best way to help is to champion their independence while carving out your own. Work on parallel projects and celebrate each other's initiative. Avoid telling them how to do things; instead, ask, 'What's your plan? It sounds exciting!'",
      2: "They need peace while you feel like starting a race. Use your '1' energy to become their protector. Clear obstacles from their path, handle a task that's draining them, and create a quiet space for them. Your action can build a sanctuary for their sensitivity.",
      3: "Your initiative can give their creative spark a launchpad. Help them structure one of their many ideas into a simple, actionable step. Ask, 'Which one of these amazing ideas can we start *today*?' Your focused energy helps them channel their creative burst.",
      4: "They're focused on the 'how,' and you're focused on the 'now.' Use your initiative to help with their practical tasks. Offer to take something off their plate or help them organize. Your action-oriented approach can make their methodical work feel lighter and more manageable.",
      5: "You both have restless energy, but for different reasons. Your '1' wants to start, their '5' wants to explore. Combine these by suggesting a *new* adventure you can start *together*. Your leadership can give their desire for variety a fun and focused direction.",
      6: "They're focused on home and care, while you're focused on personal goals. Use your initiative to contribute to the domestic harmony they crave. Take charge of a household task or plan a special evening. Your leadership in service of the home will be deeply appreciated.",
      7: "They need quiet, and you're feeling the buzz of new ideas. The most loving thing you can do is use your energy to protect their solitude. Handle external demands, tell the world to wait, and give them the uninterrupted space they need to think. Your action creates their peace.",
      8: "You both have powerful, goal-oriented energy. Direct it towards a shared objective. Use your '1' initiative to kickstart a project that aligns with their ambitious '8' focus. You can be an unstoppable team today if you aim at the same target.",
      9: "You're looking to start, while they are in a more reflective, finishing state. Use your energy to help them find closure. Offer to help with a task that's lingering, or listen as they process things they need to let go of. Your forward momentum can help them gently close a chapter.",
      11: "They are highly intuitive and sensitive today. Your direct '1' energy can feel overwhelming. Soften your approach. Use your leadership to create a safe, calm environment. Ask, 'What do you need to feel peaceful right now?' and then take action to provide it.",
      22: "They are in a 'big picture' building mode, while you want to start something *now*. Use your initiative to handle a small, practical piece of their grand vision. Ask, 'What's one small thing I can do today to help your big dream?' Your action makes their vision feel more real.",
      33: "They are in a nurturing, healing space. Your '1' energy can be used to support their compassionate work. Take on a practical burden so they can focus on caring for others (or themselves). Your strength can be the foundation for their softness."
    }
  },
  2: {
    userState: "Your internal energy is quiet, sensitive, and focused on connection. You're more attuned to harmony and may feel drained by conflict or rushing. You're in a state of observation and patience, and you crave gentle, meaningful interaction.",
    partnerState: "Your partner is feeling quiet, sensitive, and in need of harmony. They might be more emotional and will feel drained by conflict or pressure. They are seeking patience, understanding, and a peaceful environment to process their feelings.",
    worldTheme: "The universal energy of the day emphasizes diplomacy, patience, and cooperation. It's a time for teamwork and listening. Progress comes from gentle persistence, not force.",
    supportAdvice: {
      1: "They are full of assertive energy, which might feel jarring to your sensitive state. Your superpower today is your calming presence. Rather than resisting their drive, help them refine it. Listen to their ideas and gently ask clarifying questions. Your thoughtful perspective can add the nuance they need.",
      2: "You're both in a sensitive space. This can be a day of beautiful, deep connection or mutual anxiety. The key is gentle, proactive care. Make the first move to create a calm atmosphere. Suggest a quiet activity you both enjoy. Your shared gentleness can be incredibly healing.",
      3: "Their social, expressive energy can be a lot for you today. Your quiet presence can be a grounding force for them. Be their calm anchor in their creative storm. Listen to their ideas without feeling pressured to match their energy. Simply being an appreciative audience is a huge gift.",
      4: "They need to work, and you need to connect. The bridge is shared, quiet activity. Offer to sit with them while they work on their tasks, or help with a small, practical detail. Your supportive presence can make their work feel less like a chore and more like a shared effort.",
      5: "Their restless energy contrasts with your need for peace. Avoid seeing their need for movement as a rejection. Instead, offer a low-energy adventure, like a quiet walk in a new place. You can join their exploration in a way that still honors your need for calm.",
      6: "You are both in a caring, feeling space. This is a beautiful opportunity for deep nurturing. Your sensitivity allows you to see what they truly need. Focus on small acts of service and affection. Your mutual care can create a powerful, loving atmosphere at home.",
      7: "You both need quiet, but for different reasons. You need it for emotional peace, they need it for mental analysis. This can be a day of comfortable silence. Don't feel pressured to fill the space. Enjoy being together without the need for constant conversation. Your shared quiet is a form of connection.",
      8: "Their ambitious drive might make you feel overlooked. Your gift today is providing the emotional support that fuels their success. Acknowledge the pressure they're under and offer a calm refuge from their stressful day. Your peaceful presence is the balance they need.",
      9: "They are in an emotional, reflective state, and so are you. This is a day for deep empathy. Create a safe space for them to share their feelings about the past or things they're letting go of. Your patient, non-judgmental listening is exactly what they need.",
      11: "You are both hypersensitive today. Your combined intuition is powerful, but so is your potential for emotional overload. Your role is to be the keeper of the peace. Actively steer away from stressful topics or environments. Your shared goal is mutual tranquility.",
      22: "They are in a high-pressure 'building' mode. Your calm, supportive energy is the perfect antidote to their stress. Take care of the small details of your shared life so they can focus on their big vision. Your contribution to peace at home allows them to build in the world.",
      33: "You are both deeply compassionate today. Channel this into mutual care. They may be focused on healing others, so you can focus on healing them. Ensure they are eating, resting, and feeling appreciated. Your nurturing allows them to nurture others."
    }
  },
  3: {
    userState: "Your internal world is buzzing with creativity, optimism, and social energy. You feel playful, expressive, and eager to connect. Ideas are popping, and you find joy in sharing them. It's a lighthearted, communicative day for you.",
    partnerState: "Your partner is feeling creative, social, and expressive. Their mind is full of ideas and they have a desire to connect and share. They are likely in a positive, upbeat mood, but their energy might be a bit scattered. They thrive on positive feedback and fun.",
    worldTheme: "The universal energy of the day is about communication, creativity, and joy. It's a perfect time for socializing, brainstorming, and expressing yourself. The vibe is optimistic and expansive.",
    supportAdvice: {
      1: "Their drive for a single goal can feel limiting to your expansive mood. Use your creative energy to make their goal more fun. Brainstorm fun ways to tackle their project or plan a celebration for when they hit a milestone. Your joy can make their focused work feel less like a grind.",
      2: "They're in a quiet, sensitive mood while you're ready to party. Tone down your energy just a bit and focus your expressive gifts on them. Write them a sweet note, tell them what you appreciate about them, or suggest a creative, low-key activity like watching a beautiful film.",
      3: "You're both on the same wavelength! This is a day for fun, laughter, and mutual inspiration. The best way to help is to amplify their joy. Brainstorm ideas together, be playful, and plan a fun social outing. Your shared energy can create incredible memories today.",
      4: "You're in a creative mood, and they're in a task-oriented one. Use your gift for expression to make their work more enjoyable. Put on some great music while they work, bring them a fun snack, or tell them a funny story on their break. Your lightheartedness is a gift.",
      5: "Your creative energy and their adventurous energy are a perfect match for fun. Plan something that is both new and expressive—like visiting an art gallery in a new neighborhood or trying a dance class. Your combined energies make for an unforgettable day.",
      6: "You're feeling playful, and they're feeling responsible. Use your creativity to bring joy into their duties. Help them with a household task in a fun way or plan a creative and loving surprise for them when their work is done. Your joy reminds them that life isn't all about responsibility.",
      7: "Your social energy is the opposite of their need for quiet reflection. The kindest thing you can do is give them that space without making them feel guilty. Go out and get your social fix with friends, and bring back a happy, vibrant energy to share with them later.",
      8: "They are in a serious, high-stakes mindset. Your levity is the perfect balance. Don't downplay their goals, but do help them de-stress. Be the fun break in their intense day. Your ability to make them laugh is a powerful way to show your love and support.",
      9: "Their mood might be a bit heavy and reflective. Your optimism is a healing balm. Share a happy memory, watch a funny movie together, or simply bring a positive and hopeful perspective to their reflections. Your light can help them see the path forward.",
      11: "Their sensitivity is heightened. Use your expressive gifts to create beauty and peace for them. Your words of affirmation, a beautifully prepared meal, or a curated playlist can be incredibly soothing. Your creativity can be a form of healing for them today.",
      22: "They are focused on their grand, serious vision. You can help by being the source of inspiration and morale. Remind them of the 'why' behind their hard work. Your optimistic perspective helps them stay motivated and connected to the joyful side of their ambitions.",
      33: "They are in a deeply nurturing mood. Use your expressive gifts to appreciate and celebrate their compassion. Tell them how much you admire their caring heart. Your words of validation will fill their cup and make them feel truly seen."
    }
  },
  4: {
    userState: "You're in a practical, grounded state of mind. Your focus is on tasks, security, and getting things done. You crave order and feel most settled when you're making tangible progress. You might be feeling a bit serious or weighed down by your to-do list.",
    partnerState: "Your partner is in a practical and focused mindset. They are likely thinking about work, finances, and their to-do list. They might seem a bit serious or stressed, but it comes from a deep-seated need to build security and make tangible progress.",
    worldTheme: "The universal energy of the day supports hard work, planning, and attention to detail. It's a time to build foundations and be practical. The energy is steady and rewards disciplined effort.",
    supportAdvice: {
      1: "Their focus on starting something new can feel like a distraction from the tasks at hand. Your gift is to provide the structure for their initiative. Help them create a simple, step-by-step plan for their new idea. Your practical mindset can turn their spark into a sustainable fire.",
      2: "They need peace, and you need to get things done. You can provide that peace through practical action. Handle a task that's been causing them low-grade stress. Your tangible act of service is a powerful and silent way of saying 'I love you and I've got your back.'",
      3: "Their creative, scattered energy might feel unproductive to you today. Instead of trying to wrangle them, create a stable base for them to create from. Make sure the bills are paid and the house is in order. Your practical support frees them up to be their brilliant, expressive selves.",
      4: "You are both in 'work mode.' This is a great day to be a power couple on practical tasks. The best way to help is to work alongside them. Divide and conquer your household to-do list or work in the same room on your individual projects. Your shared diligence is a form of bonding.",
      5: "Their desire for adventure can feel like a disruption to your need for a plan. The compromise is a well-planned adventure. Use your organizational skills to plan a fun outing. Your structure can make their desire for freedom feel safe and exciting.",
      6: "You are both focused on responsibility, but you're on the practical side, and they're on the emotional side. Your contribution is to handle the logistics of care. Manage the schedule, cook the meal, fix what's broken. Your practical support allows them to focus on providing the emotional nurturing.",
      7: "They're in their head, and you're in your hands. You can support their need for reflection by creating an undisturbed environment. Take on the practical tasks of the day so they don't have to worry about them. This frees up the mental space they need to think deeply.",
      8: "You are both focused on achievement. Your practical skills are the perfect support for their ambitious vision. Help them with the details of their big plan—organize their calendar, proofread their email, or manage a household project so they can focus on their high-stakes work.",
      9: "They're in a reflective, emotional space that might feel unproductive to you. Your practical support is grounding for them. A clean house and a warm meal can make them feel safe enough to process their complex emotions. Your stability is their sanctuary.",
      11: "Their high sensitivity needs a stable container. Your practical, grounded energy provides that. Focus on creating a predictable, calm environment. Handle the practicalities of the day so they don't have to. Your steadiness is deeply soothing to their heightened nervous system.",
      22: "This is a perfect match. They have the grand vision, and you have the practical skills to help build it. Ask them, 'What is the one small, practical thing I can do today to support your big dream?' Your contribution, no matter how small, will feel monumental to them.",
      33: "They are in a giving, nurturing mode. You can help by managing the practical side of their compassion. If they're caring for someone, you can be the one who organizes the logistics. Your practical support makes their acts of love more effective and sustainable."
    }
  },
  5: {
    userState: "A restless, adventurous energy is moving through you. You're craving novelty, freedom, and a break from the routine. You might feel a bit scattered or impatient, as your spirit is eager for new experiences and your mind is hungry for new information.",
    partnerState: "Your partner is feeling restless and adventurous. They are craving change, excitement, and freedom from routine. They might seem a bit scattered or impulsive, but it's fueled by a deep curiosity and a desire to experience life to the fullest today.",
    worldTheme: "The universal energy of the day is dynamic, social, and unpredictable. It supports change, travel, and trying new things. Flexibility is the key to navigating this fast-paced energy.",
    supportAdvice: {
      1: "They want to start a single project, and you want to start five. Use your adaptable energy to be their scout. While they focus, you can research possibilities related to their goal or explore different angles they haven't considered. Your exploration can serve their focus.",
      2: "Your restless energy can be unsettling for their sensitive state. Channel your '5' energy into creating a *new* kind of peace for them. Find a new walking path, play a new calming playlist, or cook a new, comforting meal. Your novelty can be in service of their tranquility.",
      3: "You are both in the mood for fun and excitement! Your adventurous spirit plus their creative spark is a recipe for a fantastic day. The best support is to say 'Yes, and...'. Build on their fun ideas with your own and be the one to get the adventure started.",
      4: "They are trying to stick to a plan, and you're feeling spontaneous. Don't try to derail their work. Instead, plan a fun surprise for their break or for when they finish. Your adventurous energy can be the reward they look forward to, motivating them to complete their tasks.",
      5: "You're both feeling restless and in need of a change of scenery. This is a day to be partners in adventure. The only risk is scattering in different directions. The solution? Plan an adventure you can do *together*. Your shared experience will be exhilarating.",
      6: "You're feeling adventurous, while they're feeling domestic. Bridge the gap by turning a household responsibility into an adventure. Go to a new grocery store in a different neighborhood, or turn a cleaning task into a fun, timed challenge with a prize. Infuse their duties with your playful spirit.",
      7: "You want to go out, and they want to stay in. This is a day for healthy independence. You can best support them by giving them the quiet space they need without resentment. Go have your adventure, then come back and share your stories. You'll both be happier.",
      8: "They are focused on their ambitious goals. Your adaptable '5' energy can be a secret weapon for them. Help them brainstorm unconventional solutions to a problem they're facing or use your social skills to connect them with someone who can help. Your flexibility can unlock their progress.",
      9: "They're in a thoughtful, perhaps heavy mood. Your '5' energy can bring a breath of fresh air. Suggest a change of scenery to help shift their perspective. A walk in nature or a drive can help them process their emotions without getting stuck.",
      11: "Their heightened sensitivity needs a gentle approach. Your '5' energy can feel like too much stimulus. Channel your desire for novelty into finding something beautiful and calming for them—a new piece of music, a beautiful view, or a new, gentle scent for the room.",
      22: "They are wrestling with a huge, long-term vision. Your adaptable mind can help them see new possibilities. You can support them by playing the 'what if' game, exploring different future scenarios in a low-pressure way. Your flexible thinking can help them refine their master plan.",
      33: "They are in a caring, nurturing mode. You can support this by making their caregiving an adventure. If they are cooking for someone, go on a quest for a special ingredient. Your ability to find the fun in any task can make their acts of service feel joyful instead of heavy."
    }
  },
  6: {
    userState: "Your heart is focused on home, harmony, and responsibility today. You're feeling a strong pull to nurture, to create beauty, and to care for your loved ones. You might be focused on domestic tasks, but it's all fueled by a deep desire for connection and emotional security.",
    partnerState: "Your partner's heart is at home today. They are in a nurturing, responsible, and loving state. They might be focused on family matters, beautifying your shared space, or simply craving connection and harmony. They are feeling the pull of duty and the warmth of love.",
    worldTheme: "The universal energy of the day is about responsibility, family, and creating harmony. It's a time for nurturing relationships and beautifying your environment. The energy is loving and supportive of domestic matters.",
    supportAdvice: {
      1: "They're in 'go mode' for their own projects, while you're focused on 'us.' Use your nurturing energy to support their individual drive. A well-timed meal, an encouraging word, or handling a household task so they can focus are all powerful ways to say, 'I see you, and I support you.'",
      2: "They're feeling sensitive and you're feeling nurturing—a beautiful combination. Your best approach is to create a cozy, safe environment for their quiet mood. Your acts of care—a warm blanket, a favorite snack—are powerful non-verbal expressions of love that they will deeply feel.",
      3: "You are both in a warm, expressive state, but your focus is more domestic. You can support their social, creative energy by making your home the beautiful, welcoming hub for it. Your nurturing creates the perfect stage for their vibrant self-expression.",
      4: "They're focused on tasks, and you're focused on care. Merge these by working together on a home project. Your desire to beautify the space and their desire to build can create wonderful results. Your act of working together is a powerful expression of love.",
      5: "They are feeling restless, while you are craving homey comfort. The bridge is to make 'home' feel like a fun destination. Plan a special 'date night in' or a fun project at home that feels like a mini-adventure. Bring the novelty they crave into the sanctuary you're creating.",
      6: "You are both in a nurturing, home-focused state. This is a wonderful day to be a team. The best way to help is to share the load and the love. Work together on household tasks, and then make deliberate time for affection and appreciation. Your shared goal is a happy, harmonious home.",
      7: "They are in their head, and you are in your heart. You can provide the comfortable, nurturing space they need for their deep thinking. A clean home, a good meal, and the unspoken permission to be quiet is a profound gift. Your care creates the sanctuary their mind needs.",
      8: "They are under pressure from their ambitions, and you want to create a peaceful refuge. That is exactly what you should do. Your nurturing acts are the support system for their success. By handling the home front, you are being a critical part of their team, allowing them to focus outward.",
      9: "You are both in deep, feeling states. They are processing endings, and you are in a mode of care. Your nurturing presence is exactly what they need. Create a comforting environment where they feel safe to be vulnerable. Your steady love is their anchor.",
      11: "They are extra sensitive today. Your nurturing instincts are the perfect antidote. Focus on creating sensory comfort—soft blankets, good smells, gentle sounds. Your ability to create a peaceful physical environment is deeply soothing to their heightened nervous system.",
      22: "They are dreaming big, and you are tending to the hearth. These are not in conflict; they are complementary. Your work to create a stable, loving home is the foundation upon which they can build their dreams. Acknowledge this dynamic; your support is essential to their vision.",
      33: "You are both in a state of profound care and compassion. This is a beautiful day for mutual nurturing. Take turns caring for each other. Your shared focus on love and healing can make today an incredibly bonding and restorative experience for both of you."
    }
  },
  7: {
    userState: "You're in a quiet, introspective state. You feel a need for solitude, analysis, and a break from the noise. You're processing information, seeking deeper truths, and recharging your mental batteries. You might seem distant, but you're simply deep in thought.",
    partnerState: "Your partner has retreated into their inner world. They are in a quiet, analytical, and introspective state. They are not being antisocial; they are processing, thinking, and seeking clarity. They may seem distant, but their mind is highly active.",
    worldTheme: "The universal energy of the day supports analysis, reflection, and seeking deeper truths. It's a quieter energy that rewards introspection and study over outward action. It's a good day to pause and think.",
    supportAdvice: {
      1: "Your quiet mood is a stark contrast to their assertive energy. The best support you can offer is your unique perspective. After you've had time to think, share one well-considered insight about their plan. Your depth can add a layer of wisdom to their action.",
      2: "You both need peace and quiet. This is a perfect day for comfortable silence. You can support them by validating their need for a low-key day. Suggest a quiet activity you can do in parallel, like reading in the same room. The shared, unspoken understanding is powerful.",
      3: "Their social energy can feel draining to you today. The most supportive thing you can do is to be honest about your needs. It's okay to say, 'I'd love to hear about it later, but right now I just need some quiet time.' Giving yourself what you need allows you to be more present for them later.",
      4: "They are focused on doing, and you are focused on thinking. Your analytical mind can be a huge asset to their practical work. Offer to review their plan or look for potential problems. Your ability to see the details they might miss is a valuable contribution.",
      5: "Their need for adventure and external stimulation is the opposite of your internal focus. Don't feel pressured to join in on a high-energy activity. The best support is to encourage their adventure while you take the quiet time you need. You can joyfully reconnect and share stories later.",
      6: "They are focused on nurturing, and you are in a more solitary space. You can meet in the middle with a quiet act of shared care, like preparing a meal together without needing to talk much. Your calm, focused presence can be very grounding for their emotional energy.",
      7: "You are both in your own worlds today. This is not a problem to be solved! The best support is to give each other the gift of guilt-free solitude. Respect each other's need for space. When you do connect, make it a short but high-quality conversation about what you've been thinking about.",
      8: "They are in a high-pressure, external world, while you are in your internal one. Your superpower is your ability to be their strategic sounding board. When they are ready to talk, listen to their challenges and offer your analytical perspective. Your objective insights can be invaluable.",
      9: "They are processing big emotions, and you are processing big thoughts. You can support them by being a calm, non-emotional observer. You can listen to their feelings without getting swept away, offering a stable presence that helps them feel safe and grounded.",
      11: "They are intuitively and emotionally sensitive, while you are mentally sensitive. You both need a break from external static. Join forces to create a sanctuary. Turn off the news, silence your phones, and protect your shared peace. Your mutual goal is to lower the noise.",
      22: "They are wrestling with a grand vision. Your analytical mind is the perfect tool to help them. Offer to be their 'Chief Skeptic' in a loving way, helping them poke holes in their plan so they can make it stronger. Your intellectual rigor helps solidify their dream.",
      33: "They are in a deeply compassionate, other-focused state. You can support them by helping them apply some logic and boundaries to their giving. Your analytical mind can help them find the most effective way to help, preventing them from emotional burnout."
    }
  },
  8: {
    userState: "You are in a powerful, ambitious state of mind. Your focus is on goals, results, and taking control of your material world. You're feeling the pressure to achieve and are likely thinking strategically about your career, finances, or other major projects.",
    partnerState: "Your partner is in 'CEO mode' today. They are feeling ambitious, powerful, and focused on tangible results. They may seem stressed or commanding, but it's because they are grappling with high-stakes goals and a strong drive to succeed.",
    worldTheme: "The universal energy of the day is about power, achievement, and financial matters. It's a time for strategic planning and taking decisive action. The energy is ambitious and supports large-scale endeavors.",
    supportAdvice: {
      1: "You are both in a state of powerful, forward-moving energy. To avoid a power struggle, align your ambitions. Find a shared goal, even a small one, that you can conquer together. Your combined drive can be incredibly productive and create a strong 'power couple' dynamic.",
      2: "Your ambitious energy can be overwhelming for their sensitive state. You can support them by using your power *for* them. Take charge of a stressful task they're facing or make a decision that's been weighing on them. Your decisiveness can be a protective force for their peace.",
      3: "They are in a creative, playful mood, which might seem frivolous to your goal-oriented mind. The best support is to see their joy as the fuel for your own success. Take a break with them, let them make you laugh. That brief reset will make you more effective when you return to your work.",
      4: "You have the big vision, and they have the practical focus. This is a perfect match. The best way to help them is to clearly communicate your goals and then trust them to handle the details. Delegate a piece of your plan to them; their methodical approach is exactly what your ambition needs.",
      5: "You're focused on the goal, and they're focused on the journey. This can cause friction. You can help by incorporating some variety into your shared goals. Frame a task as a 'mission' or a 'challenge' rather than a chore. Their adventurous spirit can make your path to success more fun.",
      6: "You are focused on worldly success, and they are focused on the home. Acknowledge that their work at home is what makes your work in the world possible. Expressing gratitude for the stable, loving foundation they provide is the most powerful support you can offer.",
      7: "They are in a deep-thinking, analytical mode. Your ambitious drive needs their strategic mind. Present them with a challenge you're facing and ask for their unique insights. Respecting and utilizing their intellect is a profound way to show you value them.",
      8: "You are both in a high-stakes, high-power mindset. This can be a day of incredible collaboration or intense conflict. The key is to be on the same team. Focus on a shared financial or career goal. Acknowledge the pressure you're both under. You are allies, not competitors.",
      9: "You are focused on personal achievement, while they are focused on a bigger-picture, humanitarian view. Find the intersection. Discuss how your personal success can contribute to a cause you both care about. Aligning your ambition with their compassion makes you an unstoppable force for good.",
      11: "They are highly sensitive and intuitive today. Your strong, decisive energy can either feel threatening or deeply reassuring. The choice is in your approach. Be a confident, calm leader. Your steadiness can make them feel safe in their vulnerability. Protect them with your strength.",
      22: "You are both in a 'master builder' mindset. They have the grand architectural vision, and you have the executive skill to manage the project. Your role is to help them organize, prioritize, and execute. You can be the powerful CEO that brings their brilliant blueprint to life.",
      33: "They are in a nurturing, compassionate state. You can support them by providing the resources and structure for their acts of care. Use your power to make their giving easier and more effective. You can manage the 'how' so they can focus on the 'who'."
    }
  },
  9: {
    userState: "This is an emotionally significant day for you. You're feeling a deep sense of compassion, and your thoughts may be on past events or the bigger picture of your life. You're in a mode of release and completion, which can feel both heavy and liberating.",
    partnerState: "Your partner is in a deeply compassionate and reflective state. They may be emotional, thinking about the past, or feeling a strong desire to help others. It's a day of release and humanitarian feeling, which can be both beautiful and heavy.",
    worldTheme: "The universal energy of the day supports completion, forgiveness, and humanitarianism. It's an emotional and reflective energy, encouraging us to let go of what no longer serves us and to act with compassion.",
    supportAdvice: {
      1: "Their assertive, forward-looking energy might feel insensitive to your reflective mood. The best thing you can do for them is to share one clear insight from your reflections that could help their new project. Your wisdom can give their initiative a deeper sense of purpose.",
      2: "You are both in deep, feeling states. This is a day for mutual empathy. You can support them by creating a safe space for their sensitivity. Since you are also feeling things deeply, be honest about your own state. A shared moment of vulnerability can be incredibly connecting.",
      3: "Their light, social energy can feel disconnected from your deeper mood. Invite them into your world gently. Share a meaningful memory or a beautiful piece of music with them. You don't need them to match your depth, only to witness it with love.",
      4: "They are focused on practical tasks, while you are swimming in emotion. You can support them by expressing appreciation for their steady, grounding presence. Their practical work can feel like a safe anchor for your emotional sea. Let them know their stability helps you.",
      5: "Their restless desire for new things can feel like an escape from the deep processing you're doing. You can support them by suggesting a 'meaningful adventure'—like visiting a place from your shared past. This can bridge their need for movement with your need for reflection.",
      6: "You are both in caring, compassionate states. This is a beautiful day for shared acts of love. Your humanitarian spirit and their nurturing instincts can be combined. Volunteer together, or perform a special act of kindness for a loved one as a team.",
      7: "They are in a mental, analytical space, while you are in an emotional, intuitive one. You can support them by respecting their need to think things through logically. Don't pressure them to 'just feel.' In turn, you can ask them to listen to your feelings without trying to 'solve' them.",
      8: "Their focus on ambition and results can feel worlds away from your compassionate state. You can support them by reminding them of the human impact of their work. Your perspective can infuse their ambition with a deeper sense of purpose and integrity.",
      9: "You are both in a similar state of deep compassion and release. The greatest gift you can give each other is a non-judgmental ear. Listen to each other's reflections on the past. The danger is getting lost in shared melancholy. After you've shared, make a point to do something simple and life-affirming together.",
      11: "They are extra sensitive and intuitive. Your compassionate '9' energy can create a beautiful, healing space for them. Your understanding doesn't need words. Just being present with a loving, accepting heart is the most powerful support you can offer their heightened state.",
      22: "They are focused on their huge, future-oriented dreams. Your '9' wisdom can help them connect that dream to a humanitarian purpose. Ask them, 'How will this amazing thing you're building make the world better?' Your question can deepen their motivation and vision.",
      33: "You are both in a state of profound compassion. Your energy is expansive and humanitarian; theirs is nurturing and healing. You can be an incredible team for good. Focus this powerful combined energy outward. A shared act of generosity will be deeply fulfilling for you both."
    }
  },
};

// FIX: Hoist Master Number definitions below the main `adviceMatrix` to prevent 'used before declaration' error.
// Master Numbers just use their single-digit root's advice for simplicity, but have unique state descriptions.
adviceMatrix[11] = {
  userState: "Your intuition and sensitivity are dialed up to the maximum today. You are feeling everything, picking up on subtle energies and emotions. This can be creatively inspiring but also nervously draining. You need a calm, peaceful environment to feel balanced.",
  partnerState: "Your partner's intuition is on high alert. They are feeling things with incredible intensity and may be more anxious or creatively inspired than usual. They are like an open channel, which is both a gift and a vulnerability.",
  worldTheme: "The universal energy is a Master Number 11, indicating heightened intuition, spiritual insights, and potential for nervous tension. It's a day to trust your gut and be gentle with yourself and others.",
  supportAdvice: {
    ...adviceMatrix[2].supportAdvice
  }
};
adviceMatrix[22] = {
  userState: "You are feeling the weight and the potential of your biggest dreams today. Your mind is on large-scale plans and long-term ambitions. This can feel both empowering and incredibly pressuring. You have the vision of a 'master builder' but may feel overwhelmed by the scale of it.",
  partnerState: "Your partner is in 'master builder' mode, grappling with their grandest visions for the future. They feel both inspired by the possibilities and stressed by the immense responsibility. They are not just thinking about a task; they are thinking about a legacy.",
  worldTheme: "The universal energy is a Master Number 22, the 'Master Builder.' It's a powerful day for turning big dreams into practical plans. The energy supports large-scale projects but can also bring a feeling of immense pressure.",
  supportAdvice: {
    ...adviceMatrix[4].supportAdvice
  }
};
adviceMatrix[33] = {
  userState: "You are feeling an immense sense of compassion and a desire to nurture and heal. Your heart feels wide open, and your focus is on selfless service. This is a beautiful, loving state, but it can also leave you vulnerable to taking on the pain of others and neglecting your own needs.",
  partnerState: "Your partner is embodying the 'Master Healer' today. They are filled with an almost overwhelming sense of compassion and a drive to nurture, teach, and uplift others. Their capacity for love is immense, but so is their risk of emotional burnout.",
  worldTheme: "The universal energy is a Master Number 33, representing unconditional love, healing, and selfless service. It's a day for profound acts of kindness and compassion, but it also requires strong emotional boundaries.",
  supportAdvice: {
    ...adviceMatrix[6].supportAdvice
  }
};

export const getCouplesDailyAdvice = (userDE: number, spouseDE: number, worldDE: number): { userInsight: string; partnerSupport: string } => {
  // Use single-digit root for master numbers when looking up advice, but keep original for state description
  const userAdviceKey = userDE === 11 ? 2 : userDE === 22 ? 4 : userDE === 33 ? 6 : userDE;
  const spouseAdviceKey = spouseDE === 11 ? 2 : spouseDE === 22 ? 4 : spouseDE === 33 ? 6 : spouseDE;
  const worldAdviceKey = worldDE === 11 ? 2 : worldDE === 22 ? 4 : worldDE === 33 ? 6 : worldDE;

  const userData = adviceMatrix[userDE] || adviceMatrix[userAdviceKey];
  const spouseData = adviceMatrix[spouseDE] || adviceMatrix[spouseAdviceKey];
  const worldData = adviceMatrix[worldDE] || adviceMatrix[worldAdviceKey];
  
  // Build User Insight
  const userInsight = `${userData.userState} The day's universal energy is about ${worldData.worldTheme.toLowerCase().replace('the universal energy of the day is about ', '')} This means it's a great day for you to channel your energy into activities that align with both your internal drive and the external flow. Focus on that synergy.`;

  // Build Partner Support Insight
  const supportAdvice = userData.supportAdvice[spouseDE] || userData.supportAdvice[spouseAdviceKey] || "Listen with an open heart and offer your support. Your presence is a gift.";
  const partnerSupport = `${spouseData.partnerState} The day's universal theme of '${worldData.worldTheme.toLowerCase().replace('the universal energy of the day is about ', '')}' will influence them as well. Given your own state today, here is how you can best help: ${supportAdvice}`;

  return { userInsight, partnerSupport };
};
