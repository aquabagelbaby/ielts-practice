import { useState, useEffect, useRef, useCallback } from "react";

// ── DESIGN SYSTEM ─────────────────────────────────────────────
const colors = {
  ink: "#0f0e0c",
  paper: "#faf8f3",
  cream: "#f2ede0",
  gold: "#c9a84c",
  goldLight: "#e8d5a0",
  goldDark: "#8a6f2e",
  sage: "#5a7a5e",
  sageLight: "#8aad8e",
  rust: "#b85c38",
  rustLight: "#e09070",
  slate: "#3a4a5c",
  slateLight: "#8a9aac",
  muted: "#7a7060",
  border: "#ddd8c8",
};

const fonts = {
  display: "'Playfair Display', Georgia, serif",
  body: "'Lora', Georgia, serif",
  mono: "'JetBrains Mono', 'Courier New', monospace",
  sans: "'DM Sans', system-ui, sans-serif",
};

// ── MOCK TEST DATA ─────────────────────────────────────────────

const MOCK_TESTS = [
  {
    id: 1,
    title: "Mock Test 1",
    subtitle: "Foundation Level",
    theme: colors.sage,
    sections: {
      listening: {
        title: "Listening",
        duration: 30,
        tip: "Read the questions BEFORE the audio plays. You will hear each recording only once. Write answers as you listen — do not wait until the end.",
        questions: [
          {
            id: "L1",
            type: "multiple_choice",
            audio_transcript: "[Section 1 — A conversation between two students about a university library]\n\nStudent A: Hi, I'm trying to find out about borrowing books. How many can I take out at once?\nStudent B: It depends on your status. Undergraduates can borrow up to ten books, but postgraduates are allowed fifteen.\nStudent A: And how long can I keep them?\nStudent B: Standard loans are three weeks, but you can renew twice online unless someone else has reserved the book.\nStudent A: What if I return them late?\nStudent B: There's a fine of 20 pence per day per book. It adds up quickly if you forget.",
            question: "How many books can a postgraduate student borrow at one time?",
            options: ["A. Ten", "B. Twelve", "C. Fifteen", "D. Twenty"],
            answer: "C",
            explanation: "The transcript states postgraduates are allowed fifteen books. This tests your ability to distinguish between two numbers mentioned close together — a classic IELTS Listening trap where 'ten' (undergraduates) can distract you from 'fifteen' (postgraduates)."
          },
          {
            id: "L2",
            type: "multiple_choice",
            audio_transcript: "(same transcript as above)",
            question: "What is the daily fine for returning a book late?",
            options: ["A. 10 pence", "B. 15 pence", "C. 20 pence", "D. 25 pence"],
            answer: "C",
            explanation: "The transcript clearly states '20 pence per day per book.' Numbers are frequently tested in Section 1 — always listen specifically for figures and write them down immediately."
          },
          {
            id: "L3",
            type: "multiple_choice",
            audio_transcript: "(same transcript as above)",
            question: "How many times can a student renew a book online?",
            options: ["A. Once", "B. Twice", "C. Three times", "D. Unlimited"],
            answer: "B",
            explanation: "'You can renew twice online' — straightforward retrieval, but only if you were listening at that moment. This is why reading questions before the audio is essential: you know what to listen for."
          }
        ]
      },
      reading: {
        title: "Reading",
        duration: 60,
        tip: "Do NOT read the whole passage first. Read the questions, identify keywords, then skim the passage to locate the relevant paragraph. TFNG questions follow the order of the passage.",
        passage: `The Psychology of Procrastination

For decades, procrastination was dismissed as a simple failure of willpower — a character flaw in those who could not organise themselves effectively. Recent psychological research, however, has fundamentally reframed this understanding. Far from being a time-management problem, procrastination is now recognised as primarily an emotion-regulation problem, in which individuals avoid tasks not because they are lazy, but because those tasks generate negative emotions such as anxiety, self-doubt, or boredom.

Dr Fuschia Sirois of Durham University argues that procrastination functions as a short-term mood repair strategy. When faced with a task perceived as threatening or unpleasant, the brain seeks immediate emotional relief by directing attention elsewhere. The relief is genuine and immediate; the cost — a worsening of both the original task situation and long-term wellbeing — is delayed and therefore less psychologically salient. This mechanism is reinforced over time, making procrastination an increasingly automatic response.

Contrary to popular belief, procrastination is not associated with low intelligence or poor academic ability. Studies consistently show that highly capable individuals are equally susceptible, and in some cases more so, as they may have higher performance standards that make tasks feel more threatening. Perfectionism, in particular, has a well-documented relationship with procrastination: the fear of producing imperfect work can be paralysing enough to prevent any work from beginning at all.

Interventions that treat procrastination as a scheduling problem — such as detailed to-do lists or time-blocking — show limited effectiveness when the root emotional triggers are not addressed. More successful approaches include self-compassion training, which reduces the harsh self-criticism that often follows an episode of procrastination and thereby weakens its self-reinforcing cycle; and implementation intentions, in which individuals specify not just what they will do but exactly when, where, and how, reducing the cognitive load of initiating the task.

Researchers note that procrastination has worsened significantly in populations with access to smartphones and social media platforms, which provide an unprecedented density of immediately rewarding alternative activities. This has led some psychologists to suggest that procrastination, while always a feature of human psychology, has become structurally amplified by the modern attention economy in ways that individual willpower alone cannot counteract.`,
        questions: [
          {
            id: "R1",
            type: "tfng",
            statement: "Procrastination has traditionally been viewed as a problem with how people manage their time.",
            answer: "TRUE",
            explanation: "The passage says procrastination 'was dismissed as a simple failure of willpower' and is 'now recognised as primarily an emotion-regulation problem' — implying it was previously seen as a time-management/self-discipline issue. The statement is a valid paraphrase of the original framing."
          },
          {
            id: "R2",
            type: "tfng",
            statement: "The emotional relief that procrastination provides is experienced after the avoided task has been completed.",
            answer: "FALSE",
            explanation: "The passage explicitly states the relief is 'immediate' — it comes from avoiding the task, not completing it. The statement reverses the timing described in the passage. This is a classic direction-reversal trap."
          },
          {
            id: "R3",
            type: "tfng",
            statement: "Students with high academic ability are completely immune to procrastination.",
            answer: "FALSE",
            explanation: "The passage says highly capable individuals are 'equally susceptible, and in some cases more so.' 'Completely immune' directly contradicts this — making this FALSE rather than NOT GIVEN."
          },
          {
            id: "R4",
            type: "tfng",
            statement: "Perfectionism can cause individuals to delay starting work due to fear of failure.",
            answer: "TRUE",
            explanation: "'The fear of producing imperfect work can be paralysing enough to prevent any work from beginning at all.' The statement accurately paraphrases this using 'fear of failure' for 'fear of producing imperfect work.'"
          },
          {
            id: "R5",
            type: "tfng",
            statement: "Self-compassion training has been proven to eliminate procrastination entirely in clinical trials.",
            answer: "NOT GIVEN",
            explanation: "The passage mentions self-compassion training as a 'more successful approach' but gives no specific trial data or claim of complete elimination. 'Proven to eliminate entirely' goes far beyond what the passage states — the topic exists, but this specific claim does not."
          },
          {
            id: "R6",
            type: "tfng",
            statement: "The rise of social media has made procrastination more difficult to overcome through personal effort alone.",
            answer: "TRUE",
            explanation: "The passage states smartphones provide 'an unprecedented density of immediately rewarding alternatives' and that this 'individual willpower alone cannot counteract.' The statement is a close paraphrase."
          }
        ]
      },
      writing: {
        title: "Writing",
        duration: 60,
        tip: "Spend exactly 20 minutes on Task 1 (minimum 150 words) and 40 minutes on Task 2 (minimum 250 words). Always write an overview in Task 1 — it is the single most important feature examiners look for.",
        task1: {
          prompt: "The bar chart below shows the percentage of adults in four countries (UK, USA, Australia, Canada) who used online banking in 2010, 2015, and 2020.",
          chart_description: "[Imagine a bar chart showing: UK: 35%, 52%, 71% | USA: 28%, 45%, 63% | Australia: 31%, 49%, 68% | Canada: 33%, 51%, 70% across 2010, 2015, 2020]",
          instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          model_answer: "The bar chart illustrates the proportion of adults who used online banking across four English-speaking nations between 2010 and 2020.\n\nOverall, online banking usage increased substantially in all four countries over the decade, with the UK recording the highest adoption rate by 2020 and the USA consistently showing the lowest figures throughout the period.\n\nIn 2010, usage rates were relatively similar across the four nations, ranging from 28% in the USA to 35% in the UK. By 2015, all countries had seen increases of approximately 15–20 percentage points, with the UK (52%) and Canada (51%) slightly ahead of Australia (49%) and the USA (45%).\n\nThe most striking growth occurred between 2015 and 2020. The UK reached 71%, followed closely by Canada at 70% and Australia at 68%. The USA, while showing consistent growth, remained the lowest at 63% in 2020 — still more than double its 2010 figure."
        },
        task2: {
          prompt: "Some people believe that the primary purpose of education is to prepare students for employment. Others argue that education should have broader aims, such as developing critical thinking and personal values. Discuss both views and give your own opinion.",
          instructions: "Write at least 250 words. You should spend about 40 minutes on this task.",
          model_answer: "Education serves multiple functions in society, and the question of whether it should primarily prepare students for the workforce or pursue broader developmental goals has generated considerable debate. While vocational preparation is undeniably important, I would argue that reducing education to employment readiness fundamentally diminishes its value.\n\nProponents of employment-focused education argue that schools and universities exist to equip students with practical, marketable skills. In an increasingly competitive global economy, graduates who lack technical competencies and professional preparation face significant disadvantage. Furthermore, education funded by public resources arguably carries an obligation to generate economic returns through a productive workforce. Countries with strong vocational training systems, such as Germany, demonstrate that targeted education can produce both individual prosperity and economic growth.\n\nHowever, an exclusively employment-oriented system risks producing individuals who are professionally capable but intellectually and morally underdeveloped. Critical thinking — the ability to question assumptions, evaluate evidence, and reason independently — is not merely an academic luxury; it underpins informed citizenship and democratic participation. Similarly, education that cultivates empathy, ethical reasoning, and cultural understanding produces individuals better equipped to navigate complex social realities. These qualities are also increasingly valued by employers themselves, suggesting that broader educational aims and vocational outcomes are not as opposed as they might initially appear.\n\nIn my view, education at its best achieves both simultaneously. A history lesson can develop analytical skills while building cultural literacy; a science class can teach rigorous methodology alongside environmental responsibility. The dichotomy between employment preparation and broader development is largely false — the deepest preparation for professional life includes precisely those human capacities that a narrowly vocational curriculum would neglect."
        }
      },
      speaking: {
        title: "Speaking",
        duration: 15,
        tip: "Never give one-sentence answers in Parts 1 and 3. The examiner is scoring your ability to extend and develop ideas. Aim for 3–5 sentences per answer, using specific examples and personal reflection.",
        parts: [
          {
            part: 1,
            title: "Introduction & Interview (4–5 min)",
            questions: [
              "Do you enjoy reading? Why or why not?",
              "How has technology changed the way people read in your country?",
              "Do you prefer reading physical books or digital texts?"
            ],
            tips: "Keep answers to 3–5 sentences. Use a mix of present habits and personal opinion. Avoid starting every sentence with 'I think...'"
          },
          {
            part: 2,
            title: "Individual Long Turn (3–4 min)",
            cue_card: "Describe a time when you learned something new that changed the way you think about a topic.\n\nYou should say:\n• what you learned\n• how you learned it\n• why it changed your thinking\n• and explain how this new understanding has affected you since.",
            prep_time: 60,
            speak_time: 120,
            tips: "Use your 1-minute preparation to jot 4–5 keywords — one per bullet point. Open with a strong scene-setting sentence. Do not memorise a script; speak from notes."
          },
          {
            part: 3,
            title: "Two-Way Discussion (4–5 min)",
            questions: [
              "In your opinion, why do some people resist changing their views even when presented with new information?",
              "How important is it for schools to teach students to question what they read or hear?",
              "Do you think the internet has made it easier or harder for people to form accurate beliefs about the world?"
            ],
            tips: "Part 3 is a discussion, not an interview. You are expected to give extended, nuanced answers with reasons and examples. Use hedging language: 'It could be argued that...', 'One perspective suggests...'"
          }
        ]
      }
    }
  },
  {
    id: 2,
    title: "Mock Test 2",
    subtitle: "Development Level",
    theme: colors.slate,
    sections: {
      listening: {
        title: "Listening",
        duration: 30,
        tip: "Watch for distractor answers — the speaker often mentions the wrong answer first, then corrects it. The FINAL answer given is almost always the correct one.",
        questions: [
          {
            id: "L1",
            type: "multiple_choice",
            audio_transcript: "[Section 2 — A tour guide speaking to visitors at a nature reserve]\n\nGuide: Welcome to Greenfield Nature Reserve. The reserve covers approximately 340 hectares — that's about 850 acres for those more familiar with imperial measurements. We have three main walking trails. The Blue Trail is the shortest at 2.5 kilometres and takes about 45 minutes at a leisurely pace. The Red Trail covers 5 kilometres — allow around 90 minutes. Our most challenging route, the Gold Trail, is 8 kilometres and most visitors need between two and a half and three hours. Photography is permitted throughout the reserve, but we ask that visitors stay on marked paths at all times to protect nesting areas.",
            question: "How long does the Red Trail take to complete?",
            options: ["A. 45 minutes", "B. 60 minutes", "C. 90 minutes", "D. 120 minutes"],
            answer: "C",
            explanation: "The guide states the Red Trail takes 'around 90 minutes.' This tests selective attention — three trails with different times are mentioned in quick succession, requiring you to track which time belongs to which trail."
          },
          {
            id: "L2",
            type: "multiple_choice",
            audio_transcript: "(same transcript as above)",
            question: "What does the guide say visitors must do throughout the reserve?",
            options: ["A. Stay silent near wildlife", "B. Stay on marked paths", "C. Carry a map at all times", "D. Register at the entrance"],
            answer: "B",
            explanation: "'We ask that visitors stay on marked paths at all times' — stated clearly near the end of the extract. This tests whether you are still listening attentively after the main numerical information has passed."
          },
          {
            id: "L3",
            type: "multiple_choice",
            audio_transcript: "(same transcript as above)",
            question: "What is the size of the reserve in hectares?",
            options: ["A. 240", "B. 300", "C. 340", "D. 850"],
            answer: "C",
            explanation: "340 hectares — note that 850 is the acreage figure, a deliberate distractor. IELTS frequently places two similar numbers close together. The question specifies 'hectares,' so you must track units, not just numbers."
          }
        ]
      },
      reading: {
        title: "Reading",
        duration: 60,
        tip: "For Matching Headings questions, identify the main idea of each paragraph in one word or phrase before looking at the heading list. This prevents the headings from biasing your reading.",
        passage: `Urban Farming: Growing Cities from the Inside Out

In cities across the world, a quiet agricultural revolution is underway. Rooftops, abandoned lots, repurposed warehouses, and even underground car parks are being transformed into productive growing spaces — not as novelties, but as serious attempts to reimagine how urban populations feed themselves. Urban farming, once dismissed as a hobbyist pursuit, is attracting substantial investment from city governments, technology companies, and venture capital alike.

The appeal is not difficult to understand. Conventional agriculture requires vast land areas, consumes enormous quantities of water, and generates significant carbon emissions through transportation — particularly for fresh produce that travels thousands of kilometres from farm to table. Urban farms, by contrast, can be positioned within metres of their consumers, dramatically reducing the logistical chain. Vertical farms, which stack growing layers in climate-controlled environments, can produce yields per square metre far exceeding those of traditional fields, using up to 95% less water through hydroponic or aeroponic systems.

However, enthusiasm for urban farming must be tempered by economic realism. The energy costs of artificial lighting — essential for indoor vertical farms — are substantial, and in regions where electricity generation relies heavily on fossil fuels, the carbon footprint of indoor farming may rival or exceed that of conventional agriculture. A kilogram of tomatoes grown under LED lights in Manchester may, depending on the energy source, carry a higher emissions cost than the same kilogram transported from a Spanish greenhouse.

Social dimensions also complicate the picture. Urban farming projects in lower-income city districts have sometimes been associated with gentrification — rising property values that displace the very communities the farms were intended to serve. Conversely, community garden projects with active resident involvement have demonstrated measurable benefits for mental health, social cohesion, and food literacy in urban populations.

The technology sector's interest in urban farming centres largely on precision agriculture — the use of sensors, artificial intelligence, and automated systems to monitor and optimise every variable in the growing environment. Advocates argue that data-driven farming will eventually make urban food production economically competitive with conventional agriculture. Sceptics counter that the capital cost of these systems remains prohibitive, and that the promised economies of scale have yet to materialise outside carefully controlled pilot projects.`,
        questions: [
          {
            id: "R1",
            type: "tfng",
            statement: "Urban farming is now being taken seriously as a commercial and governmental enterprise.",
            answer: "TRUE",
            explanation: "The passage states urban farming is 'attracting substantial investment from city governments, technology companies, and venture capital' — confirming it is no longer seen as a mere hobby."
          },
          {
            id: "R2",
            type: "tfng",
            statement: "Vertical farms always have a lower carbon footprint than conventional farms.",
            answer: "FALSE",
            explanation: "The passage explicitly states that in regions relying on fossil fuels, indoor farming 'may rival or exceed' the emissions of conventional agriculture. 'Always lower' directly contradicts this conditional statement."
          },
          {
            id: "R3",
            type: "tfng",
            statement: "Urban farming projects have had uniformly negative social effects on low-income communities.",
            answer: "FALSE",
            explanation: "The passage describes both negative effects (gentrification) AND positive effects (mental health, social cohesion). 'Uniformly negative' ignores the positive cases explicitly mentioned."
          },
          {
            id: "R4",
            type: "tfng",
            statement: "AI and sensor technology are being used to improve growing conditions in urban farms.",
            answer: "TRUE",
            explanation: "Directly stated: 'the use of sensors, artificial intelligence, and automated systems to monitor and optimise every variable in the growing environment.'"
          },
          {
            id: "R5",
            type: "tfng",
            statement: "Precision agriculture technology has already made urban farming cheaper than conventional farming globally.",
            answer: "FALSE",
            explanation: "Sceptics in the passage state 'the capital cost of these systems remains prohibitive' and 'promised economies of scale have yet to materialise.' The statement claims success that the passage directly contradicts."
          },
          {
            id: "R6",
            type: "tfng",
            statement: "The passage provides statistics on the exact amount of water saved by hydroponic systems.",
            answer: "TRUE",
            explanation: "The passage states hydroponic or aeroponic systems use 'up to 95% less water' — a specific statistic. The statement asks whether the passage provides this, and it does."
          }
        ]
      },
      writing: {
        title: "Writing",
        duration: 60,
        tip: "In Task 2, your position must be clear in the introduction and consistently maintained throughout. Examiners deduct marks for contradicting yourself between paragraphs.",
        task1: {
          prompt: "The line graph below shows the average monthly temperature (°C) in three cities — Cairo, London, and Toronto — over the course of one year.",
          chart_description: "[Line graph: Cairo stays high (20–36°C), peaking in July/August. London shows moderate variation (5–22°C). Toronto has the widest range (-5 to 26°C), dipping sharply in winter months.]",
          instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          model_answer: "The line graph compares average monthly temperatures across three cities — Cairo, London, and Toronto — throughout a single year.\n\nOverall, Cairo maintained the highest temperatures year-round, while Toronto experienced the greatest seasonal variation, with temperatures ranging from below freezing in winter to warm summer levels.\n\nCairo's temperatures remained consistently high, beginning at around 20°C in January, rising sharply to a peak of approximately 36°C in July and August, before declining to roughly 22°C by December. London showed a more moderate pattern, with temperatures ranging from approximately 5°C in the coldest months to around 22°C in summer.\n\nToronto displayed the most dramatic fluctuation. Temperatures fell to approximately -5°C between December and February — well below both other cities — then climbed steeply to reach around 26°C in July. This gives Toronto a seasonal range of roughly 31 degrees, compared to approximately 16 degrees for Cairo and 17 degrees for London."
        },
        task2: {
          prompt: "In many countries, young people are choosing to live alone rather than with their families or partners. What are the advantages and disadvantages of this trend?",
          instructions: "Write at least 250 words. You should spend about 40 minutes on this task.",
          model_answer: "The increasing tendency among young adults to live independently — rather than with family or romantic partners — reflects broader social and economic shifts. While this trend carries genuine benefits, it also presents significant personal and societal challenges.\n\nThe most evident advantage of living alone is autonomy. Individuals who live independently gain complete control over their daily routines, social lives, and domestic environments, which can foster self-reliance and personal development. Research suggests that the experience of managing a household alone builds practical competencies — budgeting, cooking, and problem-solving — that contribute to long-term resilience. Furthermore, for young professionals in competitive urban environments, solo living removes the friction of negotiating shared space, potentially enhancing productivity and mental clarity.\n\nHowever, the disadvantages are considerable. Social isolation represents the most serious risk: without regular cohabitation, individuals may experience loneliness, particularly in cities where community ties are weak. Psychologists have linked chronic loneliness to adverse health outcomes comparable to smoking in terms of mortality risk. Economically, solo living is inherently inefficient — housing, utilities, and food costs are not shared, placing disproportionate financial pressure on individuals, particularly in high-cost cities. This economic burden may, paradoxically, limit the very freedoms that motivated independent living in the first place.\n\nOn balance, living alone can be a valuable phase of personal development when chosen freely and sustained by adequate social connections. The risks arise primarily when it becomes an involuntary consequence of weakened community structures or economic precarity rather than a genuine expression of individual preference."
        }
      },
      speaking: {
        title: "Speaking",
        duration: 15,
        tip: "Avoid repetition of vocabulary within a single answer — IELTS Speaking scores Lexical Resource, and examiners specifically note when candidates recycle the same words. Use synonyms naturally.",
        parts: [
          {
            part: 1,
            title: "Introduction & Interview (4–5 min)",
            questions: [
              "What kind of music do you enjoy listening to?",
              "Has your taste in music changed since you were younger?",
              "Do you think music education should be compulsory in schools?"
            ],
            tips: "Answer naturally but extend each response. For yes/no questions, always follow with 'because' or 'for example' to demonstrate language range."
          },
          {
            part: 2,
            title: "Individual Long Turn (3–4 min)",
            cue_card: "Describe a person who has had a significant positive influence on your life.\n\nYou should say:\n• who this person is\n• how you know them\n• what qualities or actions made them influential\n• and explain how they have shaped who you are today.",
            prep_time: 60,
            speak_time: 120,
            tips: "Use a range of tenses: present perfect for lasting influence, past simple for specific events, present simple for enduring qualities. This naturally demonstrates Grammatical Range."
          },
          {
            part: 3,
            title: "Two-Way Discussion (4–5 min)",
            questions: [
              "Do you think role models are more or less important today than they were in previous generations?",
              "How much are people's personalities shaped by their upbringing versus their own choices?",
              "Should public figures be held to higher ethical standards than ordinary people?"
            ],
            tips: "These are abstract, societal questions — not personal experience questions. Use phrases like 'From a sociological perspective...' or 'One could argue that...' to signal academic register."
          }
        ]
      }
    }
  },
  {
    id: 3,
    title: "Mock Test 3",
    subtitle: "Exam Simulation",
    theme: colors.rust,
    sections: {
      listening: {
        title: "Listening",
        duration: 30,
        tip: "Spelling matters in Listening — incorrect spelling costs you the mark even if you identified the correct answer. Double-check names, places, and technical terms in the final 10 minutes.",
        questions: [
          {
            id: "L1",
            type: "multiple_choice",
            audio_transcript: "[Section 3 — Two students, Maya and Tom, discuss their research project with a tutor]\n\nTutor: So how are you both getting on with the research design?\nMaya: We've decided to focus on online consumer behaviour rather than in-store — there's just much more data available and it's easier to quantify.\nTom: I was initially pushing for a mixed-methods approach, but Maya convinced me that a purely quantitative study would give us cleaner results for the time we have.\nTutor: That's a reasonable decision given your timeline. Have you settled on your data collection method?\nMaya: We're planning to use an online survey. We originally thought about interviews, but the sample size would have been too small.\nTutor: Good. What's your target sample size?\nTom: We're aiming for 200 responses, though our supervisor suggested 150 would be the minimum acceptable.",
            question: "Why did the students decide to use a quantitative rather than mixed-methods approach?",
            options: ["A. Their tutor recommended it", "B. It suited their timeline better", "C. Mixed methods are less reliable", "D. Their supervisor required it"],
            answer: "B",
            explanation: "Tom says Maya convinced him 'a purely quantitative study would give us cleaner results for the time we have' — the time constraint (timeline) was the deciding factor. Option A is a distractor: the tutor only commented after the decision was made."
          },
          {
            id: "L2",
            type: "multiple_choice",
            audio_transcript: "(same transcript as above)",
            question: "What is the minimum acceptable sample size according to the supervisor?",
            options: ["A. 100", "B. 150", "C. 175", "D. 200"],
            answer: "B",
            explanation: "Tom states '150 would be the minimum acceptable' — while 200 is their target, the question asks for the minimum. Reading questions precisely before listening prevents this kind of error."
          },
          {
            id: "L3",
            type: "multiple_choice",
            audio_transcript: "(same transcript as above)",
            question: "Why did the students reject interviews as a data collection method?",
            options: ["A. Interviews are too time-consuming", "B. They lack interview training", "C. The sample size would be too small", "D. Their topic is unsuitable for interviews"],
            answer: "C",
            explanation: "Maya explicitly says 'the sample size would have been too small' — the method itself was not the issue, but the resulting limitation on sample size. Identify the precise reason given, not the most logical-sounding alternative."
          }
        ]
      },
      reading: {
        title: "Reading",
        duration: 60,
        tip: "In the exam, if you are unsure between FALSE and NOT GIVEN, ask: 'Does the passage say the opposite?' If yes → FALSE. If the passage simply doesn't address the specific claim → NOT GIVEN.",
        passage: `Solitude and the Creative Mind

The relationship between solitude and creative output has fascinated psychologists and biographers for centuries. Across disciplines — from literature to mathematics to visual art — an unusual number of the most celebrated practitioners have described periods of profound isolation as central to their most significant work. Yet the romanticisation of the lone genius working in solitude has increasingly been challenged by research into collaborative creativity and the social dimensions of innovation.

Historical accounts suggest that solitude serves at least two distinct functions in creative work. The first is generative: uninterrupted time allows for the deep, sustained attention that complex problem-solving and original synthesis require. Cognitive psychologists refer to this as the default mode network — a set of brain regions most active when the mind is not engaged with external stimuli, associated with imagination, self-referential thought, and the retrieval of remote associations. Solitude, in this framework, is not merely the absence of distraction but the presence of a particular kind of cognitive activity.

The second function is evaluative. Creative individuals frequently report that physical separation from collaborators and critics allows them to assess their own work more objectively, without the distorting influence of social approval or peer pressure. The ability to sit with uncertainty — to resist the urge to share, validate, or refine prematurely — appears to be a distinguishing characteristic of highly creative individuals across fields.

These findings do not imply that collaboration is valueless. Research into scientific innovation consistently demonstrates that groundbreaking work often emerges at the intersection of disciplinary perspectives — at conferences, in correspondence, through mentorship relationships. The apparent contradiction dissolves when solitude and collaboration are understood not as opposites but as complementary phases: deep individual reflection followed by selective, purposeful engagement with others.

It would be a misreading, however, to prescribe solitude as a universal creative enhancer. Introverts and extroverts differ significantly in the degree to which they find isolation energising or depleting, and cultural context shapes whether solitary practice is experienced as freedom or punishment. What the evidence does support is that the capacity to tolerate and productively use periods of aloneness — whatever their optimal length for a given individual — is a learnable skill that appears consistently in the developmental histories of highly creative people.`,
        questions: [
          {
            id: "R1",
            type: "tfng",
            statement: "A significant number of highly creative people across different fields have linked solitude to their best work.",
            answer: "TRUE",
            explanation: "'An unusual number of the most celebrated practitioners have described periods of profound isolation as central to their most significant work' — the statement is a close paraphrase. 'Unusual number' maps to 'significant number.'"
          },
          {
            id: "R2",
            type: "tfng",
            statement: "The default mode network is most active when a person is focused on an external task.",
            answer: "FALSE",
            explanation: "The passage defines the default mode network as 'most active when the mind is not engaged with external stimuli' — the opposite of what the statement claims."
          },
          {
            id: "R3",
            type: "tfng",
            statement: "Creative individuals find it easy to resist sharing their work before it is fully developed.",
            answer: "FALSE",
            explanation: "The passage describes 'the ability to sit with uncertainty — to resist the urge to share... prematurely' as a 'distinguishing characteristic' — implying it is notable and relatively rare, not easy or universal."
          },
          {
            id: "R4",
            type: "tfng",
            statement: "The passage argues that collaboration produces more innovative results than solitary work.",
            answer: "NOT GIVEN",
            explanation: "The passage acknowledges collaboration's value but presents solitude and collaboration as 'complementary phases' — it takes no position on which produces more innovation. The statement introduces a comparative ranking the passage does not make."
          },
          {
            id: "R5",
            type: "tfng",
            statement: "Introverts benefit more from solitude in creative work than extroverts do.",
            answer: "NOT GIVEN",
            explanation: "The passage notes that introverts and extroverts 'differ significantly' in how they experience isolation, but it does not state that introverts benefit more creatively — only that they differ in their experience. The specific comparative claim is not made."
          },
          {
            id: "R6",
            type: "tfng",
            statement: "The ability to use solitude productively can be developed over time.",
            answer: "TRUE",
            explanation: "'The capacity to tolerate and productively use periods of aloneness... is a learnable skill' — 'learnable' directly supports the idea that this ability can be developed."
          }
        ]
      },
      writing: {
        title: "Writing",
        duration: 60,
        tip: "Examiners read your Task 2 essay in under 3 minutes. Your first paragraph must signal immediately that you have understood the question. If your introduction is vague, every subsequent band is harder to recover.",
        task1: {
          prompt: "The two maps below show the layout of a small town in 1990 and 2020.",
          chart_description: "[Map 1 - 1990: Town centre with market, residential streets to the north, farmland to the east, single-lane road through the centre]\n[Map 2 - 2020: Market replaced by shopping centre, new housing estate to the east on former farmland, dual carriageway through the centre, new car park in the south]",
          instructions: "Summarise the information by selecting and reporting the main features, and make comparisons where relevant. Write at least 150 words.",
          model_answer: "The maps illustrate significant changes to a small town's layout between 1990 and 2020, reflecting patterns of urban expansion and modernisation.\n\nThe most striking transformation is in the town centre, where the original market has been replaced by a large shopping centre. The main road running through the centre has been widened from a single lane to a dual carriageway, and a new car park has been constructed to the south — developments that suggest a significant increase in vehicular traffic over the period.\n\nThe eastern edge of the town underwent considerable expansion. Farmland that existed in 1990 has been converted into a new housing estate by 2020, indicating residential growth that likely reflects an increase in the town's population. The northern residential streets appear to have remained largely unchanged during this period.\n\nOverall, the town has undergone substantial commercial and residential development, with the conversion of agricultural land and the modernisation of infrastructure representing the two most significant changes."
        },
        task2: {
          prompt: "Governments should invest more in public transport rather than in building new roads. To what extent do you agree or disagree?",
          instructions: "Write at least 250 words. You should spend about 40 minutes on this task.",
          model_answer: "The question of whether public investment should prioritise public transport over road construction reflects deeper tensions between individual mobility preferences and collective environmental and urban planning goals. I broadly agree that public transport warrants greater governmental emphasis, though a complete redirection of road investment would be simplistic and counterproductive in many contexts.\n\nThe case for prioritising public transport rests on several interconnected arguments. Environmentally, shifting commuters from private vehicles to trains, buses, and metro systems can substantially reduce urban carbon emissions and air pollution. High-quality public transport also offers equity benefits — it provides mobility to individuals who cannot afford or operate private vehicles, including the elderly, young people, and lower-income populations. Cities such as Singapore, Tokyo, and Vienna demonstrate that comprehensive, reliable public transport networks can transform urban mobility while reducing traffic congestion significantly.\n\nNevertheless, dismissing road investment entirely would be shortsighted. Rural and peri-urban populations, where public transport provision is inherently less economically viable, depend on road infrastructure for access to employment, healthcare, and essential services. Additionally, road networks carry freight that supports economic activity in ways that passenger rail systems cannot easily substitute. Infrastructure decisions also require long time horizons: roads built today may still be in use when electric vehicles make them far less environmentally harmful than they currently appear.\n\nA more nuanced position would be that governments should redirect investment toward integrated transport systems — where enhanced public transport is complemented by smart road design that prioritises pedestrians, cyclists, and public vehicles — rather than framing the choice as binary. The goal is not to win an ideological argument about transport modes, but to design urban systems that are efficient, equitable, and sustainable."
        }
      },
      speaking: {
        title: "Speaking",
        duration: 15,
        tip: "In Part 3, do not say 'I agree' or 'I disagree' and stop. Give your position, a reason, an example, and acknowledge the counterargument. This structure naturally produces the extended, coherent responses that score Band 7+.",
        parts: [
          {
            part: 1,
            title: "Introduction & Interview (4–5 min)",
            questions: [
              "What do you usually do to relax after a busy day?",
              "Do you think people today have enough time to relax? Why or why not?",
              "Has the way you relax changed compared to when you were a child?"
            ],
            tips: "Speak at a natural pace — do not rush. Examiners are not impressed by speed; they are listening for clarity, range, and fluency."
          },
          {
            part: 2,
            title: "Individual Long Turn (3–4 min)",
            cue_card: "Describe a place in your country that you think every visitor should see.\n\nYou should say:\n• where the place is\n• what it looks like or what you can do there\n• why you think it is special\n• and explain why you would recommend it to visitors.",
            prep_time: 60,
            speak_time: 120,
            tips: "Use sensory language to make your description vivid: what you see, hear, feel. This demonstrates a wider range of vocabulary than purely factual description."
          },
          {
            part: 3,
            title: "Two-Way Discussion (4–5 min)",
            questions: [
              "How has tourism changed your country in both positive and negative ways?",
              "Do you think governments should limit the number of tourists visiting certain places?",
              "Is it possible to develop a country's tourism industry while still protecting its cultural identity?"
            ],
            tips: "Part 3 connects to Part 2's theme but moves to the abstract and societal. Show you can operate at both the specific (Part 2) and the general (Part 3) — this range impresses examiners."
          }
        ]
      }
    }
  }
];

// ── UTILITY FUNCTIONS ─────────────────────────────────────────

function Timer({ seconds, onComplete, isRunning }) {
  const [timeLeft, setTimeLeft] = useState(seconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) { clearInterval(intervalRef.current); onComplete?.(); return 0; }
          return t - 1;
        });
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const pct = (timeLeft / seconds) * 100;
  const urgent = timeLeft < 60;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
      <div style={{
        width: 48, height: 48, borderRadius: "50%",
        background: `conic-gradient(${urgent ? colors.rust : colors.gold} ${pct * 3.6}deg, ${colors.border} 0deg)`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "10px", fontFamily: fonts.mono, color: urgent ? colors.rust : colors.goldDark,
        fontWeight: "700", position: "relative"
      }}>
        <div style={{
          position: "absolute", width: 36, height: 36, borderRadius: "50%",
          background: colors.paper, display: "flex", alignItems: "center", justifyContent: "center"
        }}>
          {mins}:{secs.toString().padStart(2, "0")}
        </div>
      </div>
      {urgent && <span style={{ color: colors.rust, fontSize: "12px", fontFamily: fonts.sans, fontWeight: 600 }}>Time running out</span>}
    </div>
  );
}

function BandBadge({ band }) {
  const getColor = (b) => {
    if (b >= 8) return colors.sage;
    if (b >= 7) return colors.gold;
    if (b >= 6) return colors.slate;
    return colors.rust;
  };
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      width: 36, height: 36, borderRadius: "50%",
      background: getColor(band), color: "#fff",
      fontFamily: fonts.mono, fontWeight: "700", fontSize: "13px"
    }}>{band}</span>
  );
}

// ── WRITING FEEDBACK via Claude API ──────────────────────────

async function getWritingFeedback(taskType, prompt, userText) {
  const systemPrompt = `You are an expert IELTS examiner with 15 years of experience. Evaluate writing strictly against the four official IELTS band descriptors. Be precise, honest, and examiner-voiced. Return ONLY valid JSON, no markdown, no preamble.`;

  const userPrompt = `Evaluate this IELTS ${taskType} response.

Task prompt: ${prompt}

Student's response:
${userText}

Return ONLY this JSON structure:
{
  "overall": 6.5,
  "task_achievement": 6.5,
  "coherence_cohesion": 6.5,
  "lexical_resource": 6.5,
  "grammatical_range": 6.5,
  "strengths": [
    {"quote": "exact quote from student text", "explanation": "why this scores well with examiner"},
    {"quote": "exact quote from student text", "explanation": "why this scores well with examiner"}
  ],
  "improvements": [
    {"original": "exact quote from student", "improved": "your revision", "reason": "examiner reasoning"},
    {"original": "exact quote from student", "improved": "your revision", "reason": "examiner reasoning"},
    {"original": "exact quote from student", "improved": "your revision", "reason": "examiner reasoning"}
  ],
  "priority": "The single most important thing to fix in the next draft"
}`;

  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }]
    })
  });
  const data = await response.json();
  const text = data.content.map(i => i.text || "").join("");
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

// ── SECTION COMPONENTS ────────────────────────────────────────

function ListeningSection({ section, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);
  const [showTranscript, setShowTranscript] = useState({});

  const score = submitted ? section.questions.filter(q => answers[q.id] === q.answer).length : 0;

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${colors.slate}15, ${colors.slate}05)`,
        border: `1px solid ${colors.slate}30`,
        borderRadius: 12, padding: "16px 20px", marginBottom: 24,
        display: "flex", alignItems: "flex-start", gap: 12
      }}>
        <span style={{ fontSize: 20 }}>💡</span>
        <div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.slate, fontSize: 13, marginBottom: 4 }}>STRATEGY TIP</div>
          <div style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14, lineHeight: 1.6 }}>{section.tip}</div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={{ fontFamily: fonts.display, fontSize: 18, color: colors.ink }}>
          3 Questions · {section.duration} minutes
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {!timerRunning && !submitted && (
            <button onClick={() => setTimerRunning(true)} style={{
              background: colors.slate, color: "#fff", border: "none",
              borderRadius: 8, padding: "8px 16px", fontFamily: fonts.sans,
              fontSize: 13, fontWeight: 600, cursor: "pointer"
            }}>▶ Start Timer</button>
          )}
          {timerRunning && <Timer seconds={section.duration * 60} isRunning={timerRunning} />}
        </div>
      </div>

      <div style={{
        background: colors.cream, borderRadius: 12, padding: 20, marginBottom: 24,
        border: `1px solid ${colors.border}`
      }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.muted, fontSize: 12, marginBottom: 8, letterSpacing: "0.1em" }}>AUDIO TRANSCRIPT</div>
        <div style={{ fontFamily: fonts.body, color: colors.ink, fontSize: 14, lineHeight: 1.8, fontStyle: "italic" }}>
          {section.questions[0].audio_transcript}
        </div>
      </div>

      {section.questions.map((q, i) => (
        <div key={q.id} style={{
          border: `1px solid ${submitted ? (answers[q.id] === q.answer ? colors.sage + "60" : colors.rust + "60") : colors.border}`,
          borderRadius: 12, padding: 20, marginBottom: 16,
          background: submitted ? (answers[q.id] === q.answer ? colors.sage + "08" : colors.rust + "08") : "#fff"
        }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 600, color: colors.ink, marginBottom: 12, fontSize: 15 }}>
            {i + 1}. {q.question}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {q.options.map(opt => {
              const optLetter = opt.charAt(0);
              const isSelected = answers[q.id] === optLetter;
              const isCorrect = optLetter === q.answer;
              let bg = "#fff", border = colors.border, textColor = colors.ink;
              if (submitted && isCorrect) { bg = colors.sage + "20"; border = colors.sage; textColor = colors.sage; }
              else if (submitted && isSelected && !isCorrect) { bg = colors.rust + "20"; border = colors.rust; textColor = colors.rust; }
              else if (isSelected) { bg = colors.slate + "15"; border = colors.slate; textColor = colors.slate; }

              return (
                <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: optLetter }))}
                  style={{
                    background: bg, border: `1.5px solid ${border}`, borderRadius: 8,
                    padding: "10px 14px", textAlign: "left", cursor: submitted ? "default" : "pointer",
                    fontFamily: fonts.body, fontSize: 14, color: textColor, transition: "all 0.2s"
                  }}>
                  {opt} {submitted && isCorrect && "✓"} {submitted && isSelected && !isCorrect && "✗"}
                </button>
              );
            })}
          </div>
          {submitted && (
            <div style={{ marginTop: 14, padding: "12px 14px", background: colors.cream, borderRadius: 8, fontSize: 13, fontFamily: fonts.body, color: colors.muted, lineHeight: 1.7 }}>
              <strong style={{ color: colors.ink }}>Explanation:</strong> {q.explanation}
            </div>
          )}
        </div>
      ))}

      {!submitted ? (
        <button onClick={() => setSubmitted(true)} style={{
          background: colors.ink, color: colors.paper, border: "none",
          borderRadius: 10, padding: "14px 28px", fontFamily: fonts.sans,
          fontSize: 15, fontWeight: 700, cursor: "pointer", width: "100%", marginTop: 8
        }}>Submit Answers & See Feedback</button>
      ) : (
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <div style={{
            display: "inline-flex", flexDirection: "column", alignItems: "center",
            background: colors.cream, borderRadius: 16, padding: "24px 32px",
            border: `1px solid ${colors.border}`
          }}>
            <div style={{ fontFamily: fonts.display, fontSize: 36, color: score === 3 ? colors.sage : score === 2 ? colors.gold : colors.rust, fontWeight: 700 }}>
              {score}/3
            </div>
            <div style={{ fontFamily: fonts.sans, color: colors.muted, fontSize: 14, marginTop: 4 }}>
              {score === 3 ? "Excellent — full marks" : score === 2 ? "Good — review the explanations above" : "Keep practising — re-read the strategy tip"}
            </div>
          </div>
          <button onClick={onComplete} style={{
            display: "block", margin: "16px auto 0", background: colors.gold,
            color: colors.ink, border: "none", borderRadius: 10, padding: "12px 28px",
            fontFamily: fonts.sans, fontSize: 14, fontWeight: 700, cursor: "pointer"
          }}>Continue to Reading →</button>
        </div>
      )}
    </div>
  );
}

function ReadingSection({ section, onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [timerRunning, setTimerRunning] = useState(false);

  const score = submitted ? section.questions.filter(q => answers[q.id] === q.answer).length : 0;

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${colors.gold}15, ${colors.gold}05)`,
        border: `1px solid ${colors.gold}40`, borderRadius: 12, padding: "16px 20px", marginBottom: 24
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.goldDark, fontSize: 13, marginBottom: 4 }}>STRATEGY TIP</div>
            <div style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14, lineHeight: 1.6 }}>{section.tip}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.muted, fontSize: 11, letterSpacing: "0.12em", marginBottom: 12 }}>READING PASSAGE</div>
          <div style={{
            background: colors.cream, borderRadius: 12, padding: 20, border: `1px solid ${colors.border}`,
            maxHeight: 520, overflowY: "auto"
          }}>
            {section.passage.split("\n\n").map((para, i) => (
              <p key={i} style={{ fontFamily: fonts.body, fontSize: 14, lineHeight: 1.9, color: colors.ink, marginBottom: 16 }}>
                {i === 0 ? <strong>{para.split("\n")[0]}</strong> : para}
              </p>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.muted, fontSize: 11, letterSpacing: "0.12em", marginBottom: 12 }}>
            TRUE / FALSE / NOT GIVEN
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {section.questions.map((q, i) => {
              const userAns = answers[q.id];
              const isCorrect = submitted && userAns === q.answer;
              const isWrong = submitted && userAns && userAns !== q.answer;

              return (
                <div key={q.id} style={{
                  border: `1px solid ${isCorrect ? colors.sage + "60" : isWrong ? colors.rust + "60" : colors.border}`,
                  borderRadius: 10, padding: 14,
                  background: isCorrect ? colors.sage + "08" : isWrong ? colors.rust + "08" : "#fff"
                }}>
                  <div style={{ fontFamily: fonts.body, fontSize: 13, color: colors.ink, lineHeight: 1.6, marginBottom: 10 }}>
                    <span style={{ fontFamily: fonts.mono, color: colors.muted, fontSize: 12 }}>{i + 1}. </span>
                    {q.statement}
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["TRUE", "FALSE", "NOT GIVEN"].map(opt => {
                      const sel = userAns === opt;
                      const correct = submitted && q.answer === opt;
                      let bg = "#fff", border = colors.border, tc = colors.muted;
                      if (correct) { bg = colors.sage + "25"; border = colors.sage; tc = colors.sage; }
                      else if (submitted && sel && !correct) { bg = colors.rust + "20"; border = colors.rust; tc = colors.rust; }
                      else if (sel) { bg = colors.gold + "25"; border = colors.gold; tc = colors.goldDark; }

                      return (
                        <button key={opt} onClick={() => !submitted && setAnswers(a => ({ ...a, [q.id]: opt }))}
                          style={{
                            flex: opt === "NOT GIVEN" ? 2 : 1, padding: "6px 8px",
                            background: bg, border: `1.5px solid ${border}`, borderRadius: 6,
                            fontFamily: fonts.sans, fontSize: 11, fontWeight: 600, color: tc,
                            cursor: submitted ? "default" : "pointer"
                          }}>{opt}</button>
                      );
                    })}
                  </div>
                  {submitted && (
                    <div style={{ marginTop: 10, fontSize: 12, fontFamily: fonts.body, color: colors.muted, lineHeight: 1.6, borderTop: `1px solid ${colors.border}`, paddingTop: 10 }}>
                      {q.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button onClick={() => setSubmitted(true)} style={{
              marginTop: 16, background: colors.ink, color: colors.paper, border: "none",
              borderRadius: 10, padding: "13px 24px", fontFamily: fonts.sans,
              fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%"
            }}>Submit & See Results</button>
          ) : (
            <div style={{ marginTop: 16, textAlign: "center" }}>
              <div style={{
                background: colors.cream, borderRadius: 12, padding: "16px 24px",
                border: `1px solid ${colors.border}`, marginBottom: 12
              }}>
                <span style={{ fontFamily: fonts.display, fontSize: 28, color: score >= 5 ? colors.sage : score >= 3 ? colors.gold : colors.rust, fontWeight: 700 }}>{score}/6</span>
                <div style={{ fontFamily: fonts.sans, color: colors.muted, fontSize: 13, marginTop: 4 }}>
                  {score === 6 ? "Perfect — examiner-level precision" : score >= 4 ? "Strong — review missed explanations" : "Focus on FALSE vs NOT GIVEN distinction"}
                </div>
              </div>
              <button onClick={onComplete} style={{
                background: colors.gold, color: colors.ink, border: "none",
                borderRadius: 10, padding: "12px 24px", fontFamily: fonts.sans,
                fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%"
              }}>Continue to Writing →</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function WritingSection({ section, onComplete }) {
  const [task1Text, setTask1Text] = useState("");
  const [task2Text, setTask2Text] = useState("");
  const [task1Feedback, setTask1Feedback] = useState(null);
  const [task2Feedback, setTask2Feedback] = useState(null);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [activeTask, setActiveTask] = useState(1);
  const [showModel1, setShowModel1] = useState(false);
  const [showModel2, setShowModel2] = useState(false);

  const submitTask = async (taskNum) => {
    const text = taskNum === 1 ? task1Text : task2Text;
    const task = taskNum === 1 ? section.task1 : section.task2;
    if (text.trim().split(/\s+/).length < 20) return;

    if (taskNum === 1) setLoading1(true); else setLoading2(true);
    try {
      const fb = await getWritingFeedback(`Task ${taskNum}`, task.prompt, text);
      if (taskNum === 1) setTask1Feedback(fb); else setTask2Feedback(fb);
    } catch (e) {
      const fallback = { overall: "—", task_achievement: "—", coherence_cohesion: "—", lexical_resource: "—", grammatical_range: "—", strengths: [], improvements: [], priority: "Could not connect to feedback engine. Review against the model answer below." };
      if (taskNum === 1) setTask1Feedback(fallback); else setTask2Feedback(fallback);
    }
    if (taskNum === 1) setLoading1(false); else setLoading2(false);
  };

  const FeedbackPanel = ({ fb, task, showModel, setShowModel }) => (
    <div style={{ marginTop: 20 }}>
      <div style={{
        background: `linear-gradient(135deg, ${colors.ink}, ${colors.slate})`,
        borderRadius: 14, padding: 20, color: colors.paper
      }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, letterSpacing: "0.12em", marginBottom: 16, opacity: 0.7 }}>BAND SCORE ESTIMATE</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 10 }}>
          {[["Overall", fb.overall], ["Task", fb.task_achievement], ["C&C", fb.coherence_cohesion], ["Lexis", fb.lexical_resource], ["Grammar", fb.grammatical_range]].map(([label, val]) => (
            <div key={label} style={{ textAlign: "center" }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 22, fontWeight: 700, color: colors.goldLight }}>{val}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: 10, opacity: 0.7 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {fb.strengths?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, color: colors.sage, letterSpacing: "0.1em", marginBottom: 10 }}>✓ WHAT IS WORKING</div>
          {fb.strengths.map((s, i) => (
            <div key={i} style={{ borderLeft: `3px solid ${colors.sage}`, paddingLeft: 12, marginBottom: 10 }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.sage, marginBottom: 4 }}>"{s.quote}"</div>
              <div style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted, lineHeight: 1.6 }}>{s.explanation}</div>
            </div>
          ))}
        </div>
      )}

      {fb.improvements?.length > 0 && (
        <div style={{ marginTop: 16 }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, color: colors.rust, letterSpacing: "0.1em", marginBottom: 10 }}>✗ WHAT TO IMPROVE</div>
          {fb.improvements.map((imp, i) => (
            <div key={i} style={{ background: colors.cream, borderRadius: 10, padding: 14, marginBottom: 10, border: `1px solid ${colors.border}` }}>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.rust, marginBottom: 6 }}>❌ "{imp.original}"</div>
              <div style={{ fontFamily: fonts.mono, fontSize: 12, color: colors.sage, marginBottom: 6 }}>✅ "{imp.improved}"</div>
              <div style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>💡 {imp.reason}</div>
            </div>
          ))}
        </div>
      )}

      {fb.priority && (
        <div style={{ background: colors.gold + "20", border: `1px solid ${colors.gold}60`, borderRadius: 10, padding: 14, marginTop: 12 }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, color: colors.goldDark, marginBottom: 6 }}>ONE PRIORITY FOR NEXT DRAFT</div>
          <div style={{ fontFamily: fonts.body, fontSize: 13, color: colors.ink, lineHeight: 1.7 }}>{fb.priority}</div>
        </div>
      )}

      <button onClick={() => setShowModel(!showModel)} style={{
        marginTop: 14, background: "transparent", border: `1px solid ${colors.border}`,
        borderRadius: 8, padding: "8px 16px", fontFamily: fonts.sans,
        fontSize: 13, color: colors.muted, cursor: "pointer", width: "100%"
      }}>
        {showModel ? "Hide" : "Show"} Model Answer
      </button>
      {showModel && (
        <div style={{ marginTop: 12, background: colors.cream, borderRadius: 10, padding: 16, border: `1px solid ${colors.border}` }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 11, color: colors.muted, letterSpacing: "0.1em", marginBottom: 10 }}>EXAMINER MODEL ANSWER</div>
          {task.model_answer.split("\n\n").map((p, i) => (
            <p key={i} style={{ fontFamily: fonts.body, fontSize: 13, lineHeight: 1.9, color: colors.ink, marginBottom: 12 }}>{p}</p>
          ))}
        </div>
      )}
    </div>
  );

  const wc1 = task1Text.trim() ? task1Text.trim().split(/\s+/).length : 0;
  const wc2 = task2Text.trim() ? task2Text.trim().split(/\s+/).length : 0;

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${colors.rust}15, ${colors.rust}05)`,
        border: `1px solid ${colors.rust}30`, borderRadius: 12, padding: "16px 20px", marginBottom: 24
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.rust, fontSize: 13, marginBottom: 4 }}>STRATEGY TIP</div>
            <div style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14, lineHeight: 1.6 }}>{section.tip}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {[1, 2].map(t => (
          <button key={t} onClick={() => setActiveTask(t)} style={{
            flex: 1, padding: "12px", background: activeTask === t ? colors.ink : colors.cream,
            color: activeTask === t ? colors.paper : colors.muted,
            border: `1px solid ${activeTask === t ? colors.ink : colors.border}`,
            borderRadius: 10, fontFamily: fonts.sans, fontWeight: 700, fontSize: 14, cursor: "pointer"
          }}>
            Task {t} {t === 1 ? "(150 words · 20 min)" : "(250 words · 40 min)"}
            {t === 1 && task1Feedback && " ✓"}
            {t === 2 && task2Feedback && " ✓"}
          </button>
        ))}
      </div>

      {activeTask === 1 && (
        <div>
          <div style={{ background: colors.cream, borderRadius: 12, padding: 18, marginBottom: 16, border: `1px solid ${colors.border}` }}>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.muted, fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>TASK 1 PROMPT</div>
            <p style={{ fontFamily: fonts.body, color: colors.ink, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{section.task1.prompt}</p>
            <p style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 13, fontStyle: "italic" }}>{section.task1.chart_description}</p>
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.goldDark, marginTop: 10 }}>{section.task1.instructions}</p>
          </div>
          <div style={{ position: "relative" }}>
            <textarea value={task1Text} onChange={e => setTask1Text(e.target.value)}
              placeholder="Write your Task 1 response here..."
              style={{
                width: "100%", minHeight: 220, padding: 16, fontFamily: fonts.body, fontSize: 14,
                lineHeight: 1.8, border: `1px solid ${colors.border}`, borderRadius: 12,
                resize: "vertical", color: colors.ink, background: "#fff", outline: "none",
                boxSizing: "border-box"
              }} />
            <div style={{
              position: "absolute", bottom: 12, right: 12,
              fontFamily: fonts.mono, fontSize: 12,
              color: wc1 >= 150 ? colors.sage : wc1 >= 100 ? colors.gold : colors.muted
            }}>{wc1} / 150 words</div>
          </div>
          {!task1Feedback && (
            <button onClick={() => submitTask(1)} disabled={loading1 || wc1 < 20}
              style={{
                marginTop: 12, background: wc1 >= 20 ? colors.ink : colors.border,
                color: wc1 >= 20 ? colors.paper : colors.muted,
                border: "none", borderRadius: 10, padding: "13px 24px",
                fontFamily: fonts.sans, fontSize: 14, fontWeight: 700,
                cursor: wc1 >= 20 ? "pointer" : "default", width: "100%"
              }}>
              {loading1 ? "Getting AI Feedback..." : "Get Examiner Feedback →"}
            </button>
          )}
          {task1Feedback && <FeedbackPanel fb={task1Feedback} task={section.task1} showModel={showModel1} setShowModel={setShowModel1} />}
        </div>
      )}

      {activeTask === 2 && (
        <div>
          <div style={{ background: colors.cream, borderRadius: 12, padding: 18, marginBottom: 16, border: `1px solid ${colors.border}` }}>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.muted, fontSize: 11, letterSpacing: "0.1em", marginBottom: 8 }}>TASK 2 PROMPT</div>
            <p style={{ fontFamily: fonts.body, color: colors.ink, fontSize: 14, lineHeight: 1.7, marginBottom: 8 }}>{section.task2.prompt}</p>
            <p style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.goldDark }}>{section.task2.instructions}</p>
          </div>
          <div style={{ position: "relative" }}>
            <textarea value={task2Text} onChange={e => setTask2Text(e.target.value)}
              placeholder="Write your Task 2 response here..."
              style={{
                width: "100%", minHeight: 300, padding: 16, fontFamily: fonts.body, fontSize: 14,
                lineHeight: 1.8, border: `1px solid ${colors.border}`, borderRadius: 12,
                resize: "vertical", color: colors.ink, background: "#fff", outline: "none",
                boxSizing: "border-box"
              }} />
            <div style={{
              position: "absolute", bottom: 12, right: 12,
              fontFamily: fonts.mono, fontSize: 12,
              color: wc2 >= 250 ? colors.sage : wc2 >= 150 ? colors.gold : colors.muted
            }}>{wc2} / 250 words</div>
          </div>
          {!task2Feedback && (
            <button onClick={() => submitTask(2)} disabled={loading2 || wc2 < 20}
              style={{
                marginTop: 12, background: wc2 >= 20 ? colors.ink : colors.border,
                color: wc2 >= 20 ? colors.paper : colors.muted,
                border: "none", borderRadius: 10, padding: "13px 24px",
                fontFamily: fonts.sans, fontSize: 14, fontWeight: 700,
                cursor: wc2 >= 20 ? "pointer" : "default", width: "100%"
              }}>
              {loading2 ? "Getting AI Feedback..." : "Get Examiner Feedback →"}
            </button>
          )}
          {task2Feedback && <FeedbackPanel fb={task2Feedback} task={section.task2} showModel={showModel2} setShowModel={setShowModel2} />}
        </div>
      )}

      {(task1Feedback || task2Feedback) && (
        <button onClick={onComplete} style={{
          marginTop: 20, background: colors.gold, color: colors.ink, border: "none",
          borderRadius: 10, padding: "13px 24px", fontFamily: fonts.sans,
          fontSize: 14, fontWeight: 700, cursor: "pointer", width: "100%"
        }}>Continue to Speaking →</button>
      )}
    </div>
  );
}

function SpeakingSection({ section, onComplete }) {
  const [activePart, setActivePart] = useState(0);
  const [prepTimer, setPrepTimer] = useState(false);
  const [speakTimer, setSpeakTimer] = useState(false);

  const part = section.parts[activePart];

  return (
    <div>
      <div style={{
        background: `linear-gradient(135deg, ${colors.sage}15, ${colors.sage}05)`,
        border: `1px solid ${colors.sage}30`, borderRadius: 12, padding: "16px 20px", marginBottom: 24
      }}>
        <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
          <span style={{ fontSize: 20 }}>💡</span>
          <div>
            <div style={{ fontFamily: fonts.sans, fontWeight: 700, color: colors.sage, fontSize: 13, marginBottom: 4 }}>STRATEGY TIP</div>
            <div style={{ fontFamily: fonts.body, color: colors.muted, fontSize: 14, lineHeight: 1.6 }}>{section.tip}</div>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", gap: 4, marginBottom: 24 }}>
        {section.parts.map((p, i) => (
          <button key={i} onClick={() => { setActivePart(i); setPrepTimer(false); setSpeakTimer(false); }}
            style={{
              flex: 1, padding: "10px 6px",
              background: activePart === i ? colors.ink : colors.cream,
              color: activePart === i ? colors.paper : colors.muted,
              border: `1px solid ${activePart === i ? colors.ink : colors.border}`,
              borderRadius: 10, fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, cursor: "pointer"
            }}>Part {p.part}</button>
        ))}
      </div>

      <div style={{ fontFamily: fonts.display, fontSize: 20, color: colors.ink, marginBottom: 6 }}>{part.title}</div>

      {part.questions && (
        <div style={{ marginBottom: 20 }}>
          {part.questions.map((q, i) => (
            <div key={i} style={{
              background: colors.cream, borderRadius: 10, padding: "14px 16px",
              marginBottom: 10, border: `1px solid ${colors.border}`,
              fontFamily: fonts.body, fontSize: 14, color: colors.ink, lineHeight: 1.7
            }}>
              <span style={{ color: colors.muted, fontFamily: fonts.mono, fontSize: 12 }}>{i + 1}. </span>{q}
            </div>
          ))}
        </div>
      )}

      {part.cue_card && (
        <div style={{
          background: `linear-gradient(135deg, ${colors.ink}, ${colors.slate})`,
          borderRadius: 14, padding: 24, marginBottom: 20, color: colors.paper
        }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 11, opacity: 0.6, letterSpacing: "0.12em", marginBottom: 14 }}>CUE CARD</div>
          <div style={{ fontFamily: fonts.body, fontSize: 15, lineHeight: 1.9, whiteSpace: "pre-line" }}>{part.cue_card}</div>
          <div style={{ marginTop: 20, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {!prepTimer && (
              <button onClick={() => setPrepTimer(true)} style={{
                background: colors.gold, color: colors.ink, border: "none",
                borderRadius: 8, padding: "8px 16px", fontFamily: fonts.sans,
                fontSize: 13, fontWeight: 700, cursor: "pointer"
              }}>▶ Start 1-min Prep</button>
            )}
            {prepTimer && <Timer seconds={part.prep_time} isRunning={true} />}
            {!speakTimer && (
              <button onClick={() => setSpeakTimer(true)} style={{
                background: colors.sage, color: "#fff", border: "none",
                borderRadius: 8, padding: "8px 16px", fontFamily: fonts.sans,
                fontSize: 13, fontWeight: 700, cursor: "pointer"
              }}>▶ Start 2-min Talk</button>
            )}
            {speakTimer && <Timer seconds={part.speak_time} isRunning={true} />}
          </div>
        </div>
      )}

      <div style={{
        background: colors.cream, borderRadius: 10, padding: "14px 16px",
        border: `1px solid ${colors.border}`, marginBottom: 20
      }}>
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 11, color: colors.goldDark, letterSpacing: "0.1em", marginBottom: 8 }}>EXAMINER TIP FOR THIS PART</div>
        <div style={{ fontFamily: fonts.body, fontSize: 13, color: colors.muted, lineHeight: 1.7 }}>{part.tips}</div>
      </div>

      <div style={{ display: "flex", gap: 10 }}>
        {activePart < section.parts.length - 1 && (
          <button onClick={() => { setActivePart(a => a + 1); setPrepTimer(false); setSpeakTimer(false); }} style={{
            flex: 1, background: colors.cream, color: colors.ink,
            border: `1px solid ${colors.border}`, borderRadius: 10, padding: "12px",
            fontFamily: fonts.sans, fontSize: 14, fontWeight: 600, cursor: "pointer"
          }}>Next Part →</button>
        )}
        <button onClick={onComplete} style={{
          flex: 1, background: colors.gold, color: colors.ink, border: "none",
          borderRadius: 10, padding: "12px", fontFamily: fonts.sans,
          fontSize: 14, fontWeight: 700, cursor: "pointer"
        }}>Complete Mock Test ✓</button>
      </div>
    </div>
  );
}

// ── MAIN APP ──────────────────────────────────────────────────

export default function IELTSPlatform() {
  const [screen, setScreen] = useState("home"); // home | test | results
  const [selectedTest, setSelectedTest] = useState(null);
  const [currentSection, setCurrentSection] = useState(0); // 0=listening,1=reading,2=writing,3=speaking
  const [completedSections, setCompletedSections] = useState([]);
  const [testResults, setTestResults] = useState({});

  const sections = ["listening", "reading", "writing", "speaking"];
  const sectionLabels = ["Listening", "Reading", "Writing", "Speaking"];
  const sectionIcons = ["🎧", "📖", "✍️", "🗣️"];

  const startTest = (test) => {
    setSelectedTest(test);
    setCurrentSection(0);
    setCompletedSections([]);
    setScreen("test");
  };

  const completeSection = () => {
    const next = currentSection + 1;
    setCompletedSections(c => [...c, currentSection]);
    if (next >= 4) {
      setScreen("results");
    } else {
      setCurrentSection(next);
    }
  };

  const test = selectedTest ? MOCK_TESTS.find(t => t.id === selectedTest) : null;

  // ── HOME ─────────────────────────────────────────────────────
  if (screen === "home") return (
    <div style={{
      minHeight: "100vh", background: colors.paper,
      fontFamily: fonts.body
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,400;0,600;1,400&family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${colors.cream}; }
        ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
        textarea:focus { border-color: ${colors.gold} !important; box-shadow: 0 0 0 3px ${colors.gold}20; }
      `}</style>

      {/* Header */}
      <div style={{
        borderBottom: `1px solid ${colors.border}`, padding: "20px 40px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: "#fff"
      }}>
        <div>
          <div style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink, fontWeight: 700 }}>
            IELTS Academic
          </div>
          <div style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.muted, letterSpacing: "0.1em" }}>PRACTICE PLATFORM</div>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {["Band 7.5+", "4 Skills", "AI Feedback"].map(tag => (
            <span key={tag} style={{
              background: colors.cream, border: `1px solid ${colors.border}`,
              borderRadius: 20, padding: "4px 12px",
              fontFamily: fonts.sans, fontSize: 12, color: colors.muted
            }}>{tag}</span>
          ))}
        </div>
      </div>

      {/* Hero */}
      <div style={{ padding: "60px 40px 40px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontFamily: fonts.sans, fontSize: 12, color: colors.gold, fontWeight: 700, letterSpacing: "0.15em", marginBottom: 12 }}>3 FULL MOCK TESTS</div>
        <h1 style={{ fontFamily: fonts.display, fontSize: 48, color: colors.ink, fontWeight: 700, lineHeight: 1.15, margin: "0 0 16px" }}>
          Train like it's<br /><em style={{ color: colors.gold }}>exam day.</em>
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: 17, color: colors.muted, lineHeight: 1.8, maxWidth: 560, margin: "0 0 40px" }}>
          Full IELTS Academic mock tests with all four skills, strategy tips per question type, instant scoring, and AI-powered writing feedback scored against the official band descriptors.
        </p>

        {/* Skills overview */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 48 }}>
          {[
            { icon: "🎧", label: "Listening", desc: "Multiple choice with transcript and explanations", color: colors.slate },
            { icon: "📖", label: "Reading", desc: "True/False/Not Given with passage and analysis", color: colors.gold },
            { icon: "✍️", label: "Writing", desc: "Task 1 & 2 with Claude AI examiner feedback", color: colors.rust },
            { icon: "🗣️", label: "Speaking", desc: "All 3 parts with cue cards and timers", color: colors.sage }
          ].map(s => (
            <div key={s.label} style={{
              border: `1px solid ${colors.border}`, borderRadius: 12, padding: 16,
              background: "#fff", borderTop: `3px solid ${s.color}`
            }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 14, color: colors.ink, marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontFamily: fonts.body, fontSize: 12, color: colors.muted, lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>

        {/* Test cards */}
        <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, color: colors.muted, letterSpacing: "0.12em", marginBottom: 16 }}>SELECT A MOCK TEST</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
          {MOCK_TESTS.map(test => (
            <div key={test.id} onClick={() => startTest(test.id)} style={{
              border: `1px solid ${colors.border}`, borderRadius: 14, padding: "28px 24px",
              background: "#fff", cursor: "pointer", transition: "all 0.2s",
              position: "relative", overflow: "hidden"
            }}
              onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.08)"; }}
              onMouseLeave={e => { e.currentTarget.style.transform = "none"; e.currentTarget.style.boxShadow = "none"; }}>
              <div style={{
                position: "absolute", top: 0, left: 0, right: 0, height: 4,
                background: test.theme
              }} />
              <div style={{ fontFamily: fonts.mono, fontSize: 11, color: colors.muted, letterSpacing: "0.1em", marginBottom: 8 }}>TEST {test.id}</div>
              <div style={{ fontFamily: fonts.display, fontSize: 22, color: colors.ink, fontWeight: 700, marginBottom: 4 }}>{test.title}</div>
              <div style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.muted, marginBottom: 20 }}>{test.subtitle}</div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {["🎧", "📖", "✍️", "🗣️"].map(icon => (
                  <span key={icon} style={{
                    background: colors.cream, borderRadius: 6, padding: "4px 8px", fontSize: 14
                  }}>{icon}</span>
                ))}
              </div>
              <div style={{ marginTop: 20, fontFamily: fonts.sans, fontSize: 13, fontWeight: 700, color: test.theme }}>
                Begin Test →
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── TEST ────────────────────────────────────────────────────
  if (screen === "test" && test) {
    const sectionKey = sections[currentSection];
    const section = test.sections[sectionKey];

    return (
      <div style={{ minHeight: "100vh", background: colors.paper }}>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:ital,wght@0,600;1,400&family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap');
          * { box-sizing: border-box; }
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-track { background: ${colors.cream}; }
          ::-webkit-scrollbar-thumb { background: ${colors.border}; border-radius: 3px; }
          textarea:focus { border-color: ${colors.gold} !important; box-shadow: 0 0 0 3px ${colors.gold}20; }
          button:hover { opacity: 0.9; }
        `}</style>

        {/* Top bar */}
        <div style={{
          background: "#fff", borderBottom: `1px solid ${colors.border}`,
          padding: "12px 32px", display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "sticky", top: 0, zIndex: 100
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button onClick={() => setScreen("home")} style={{
              background: "none", border: "none", cursor: "pointer",
              fontFamily: fonts.sans, fontSize: 13, color: colors.muted,
              padding: "4px 0"
            }}>← Back</button>
            <div style={{ width: 1, height: 20, background: colors.border }} />
            <div style={{ fontFamily: fonts.display, fontSize: 16, color: colors.ink }}>{test.title}</div>
          </div>

          {/* Section progress */}
          <div style={{ display: "flex", gap: 6 }}>
            {sections.map((s, i) => (
              <div key={s} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "6px 12px",
                borderRadius: 8, background: i === currentSection ? colors.ink : completedSections.includes(i) ? colors.sage + "20" : colors.cream,
                border: `1px solid ${i === currentSection ? colors.ink : completedSections.includes(i) ? colors.sage + "60" : colors.border}`
              }}>
                <span style={{ fontSize: 13 }}>{sectionIcons[i]}</span>
                <span style={{
                  fontFamily: fonts.sans, fontSize: 12, fontWeight: 600,
                  color: i === currentSection ? colors.paper : completedSections.includes(i) ? colors.sage : colors.muted
                }}>{sectionLabels[i]} {completedSections.includes(i) ? "✓" : ""}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 32px 60px" }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{ fontFamily: fonts.sans, fontSize: 11, color: colors.muted, letterSpacing: "0.12em", marginBottom: 6 }}>
              SECTION {currentSection + 1} OF 4
            </div>
            <h2 style={{ fontFamily: fonts.display, fontSize: 30, color: colors.ink, margin: "0 0 4px", fontWeight: 700 }}>
              {sectionIcons[currentSection]} {section.title}
            </h2>
            <div style={{ fontFamily: fonts.sans, fontSize: 13, color: colors.muted }}>
              {section.duration} minutes · {test.subtitle}
            </div>
          </div>

          {sectionKey === "listening" && <ListeningSection section={section} onComplete={completeSection} />}
          {sectionKey === "reading" && <ReadingSection section={section} onComplete={completeSection} />}
          {sectionKey === "writing" && <WritingSection section={section} onComplete={completeSection} />}
          {sectionKey === "speaking" && <SpeakingSection section={section} onComplete={completeSection} />}
        </div>
      </div>
    );
  }

  // ── RESULTS ──────────────────────────────────────────────────
  if (screen === "results") return (
    <div style={{ minHeight: "100vh", background: colors.paper }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lora:wght@400;600&family=DM+Sans:wght@400;600;700&family=JetBrains+Mono:wght@400;700&display=swap'); * { box-sizing: border-box; }`}</style>
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "80px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 56, marginBottom: 20 }}>🎓</div>
        <h1 style={{ fontFamily: fonts.display, fontSize: 40, color: colors.ink, marginBottom: 12 }}>
          Mock Test Complete
        </h1>
        <p style={{ fontFamily: fonts.body, fontSize: 16, color: colors.muted, lineHeight: 1.8, marginBottom: 40 }}>
          You've completed all four sections of <strong>{test?.title}</strong>. Review your Writing feedback above, note the strategy tips that surprised you, and attempt the next mock test when you feel ready.
        </p>
        <div style={{
          background: colors.cream, border: `1px solid ${colors.border}`, borderRadius: 16,
          padding: "28px 32px", marginBottom: 32, textAlign: "left"
        }}>
          <div style={{ fontFamily: fonts.sans, fontWeight: 700, fontSize: 12, color: colors.muted, letterSpacing: "0.12em", marginBottom: 16 }}>WHAT TO DO NOW</div>
          {[
            "Review every wrong answer explanation — understand the logic, not just the correct answer",
            "Re-read the strategy tip for any section where you felt uncertain",
            "For Writing, compare your response to the model answer paragraph by paragraph",
            "Wait 24–48 hours before attempting the next mock test — let the lessons consolidate"
          ].map((step, i) => (
            <div key={i} style={{ display: "flex", gap: 12, marginBottom: 12, alignItems: "flex-start" }}>
              <span style={{
                width: 24, height: 24, borderRadius: "50%", background: colors.gold,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: fonts.mono, fontSize: 11, fontWeight: 700, color: colors.ink, flexShrink: 0
              }}>{i + 1}</span>
              <span style={{ fontFamily: fonts.body, fontSize: 14, color: colors.ink, lineHeight: 1.7 }}>{step}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={() => setScreen("home")} style={{
            flex: 1, background: colors.ink, color: colors.paper, border: "none",
            borderRadius: 12, padding: "16px", fontFamily: fonts.sans,
            fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>Choose Another Test</button>
          <button onClick={() => startTest(test.id)} style={{
            flex: 1, background: "transparent", color: colors.ink,
            border: `1.5px solid ${colors.ink}`, borderRadius: 12, padding: "16px",
            fontFamily: fonts.sans, fontSize: 15, fontWeight: 700, cursor: "pointer"
          }}>Retake This Test</button>
        </div>
      </div>
    </div>
  );

  return null;
}
