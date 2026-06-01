import axios from "axios";
import * as cheerio from "cheerio";

// ─── Static Knowledge Base (always available, no scraping needed) ───────────
const STATIC_KNOWLEDGE = [
  {
    source: "IIIT Bhopal Official",
    text: `IIIT Bhopal (Indian Institute of Information Technology, Bhopal) is a public technical university established in 2017 under the PPP model. 
Located in Bhopal, Madhya Pradesh. It is one of the 20 IIITs set up by the Ministry of Education, Government of India.
Official website: https://www.iiitbhopal.ac.in
The institute offers B.Tech in Computer Science Engineering (CSE) and Electronics & Communication Engineering (ECE).
The institute is affiliated with the ABV-IIITM Gwalior for academic purposes in its initial years.`,
  },
  {
    source: "IIIT Bhopal Academics",
    text: `B.Tech Programs offered:
1. Computer Science Engineering (CSE) - 4 years
2. Electronics & Communication Engineering (ECE) - 4 years

Admission is through JEE Mains (JOSAA/CSAB counseling).
Academic year starts in August/September.
Semester system: Odd semester (Jul-Nov), Even semester (Dec-May).
The curriculum follows modern engineering standards with focus on programming, data structures, algorithms, VLSI, embedded systems.
Credits required for B.Tech graduation: typically 160+ credits.
CGPA grading system is followed (10 point scale).`,
  },
  {
    source: "IIIT Bhopal Fees 2024-25",
    text: `Approximate Fee Structure (check iiitbhopal.ac.in for exact current fees):
- Tuition Fee: ~₹1,00,000 per semester
- Hostel Fee: ~₹30,000-₹40,000 per semester  
- Mess Fee: ~₹20,000-₹25,000 per semester
- One-time admission fee at joining
- Total annual cost approximately ₹3-4 lakhs including all charges
Scholarships available: SC/ST fee waiver, merit scholarships, EWS scholarships.
Fee payment is done online through the institute portal.`,
  },
  {
    source: "IIIT Bhopal Hostel & Campus Life",
    text: `Hostel Facilities:
- Separate hostels for boys and girls
- Rooms: Typically shared (2-3 students per room) for freshers
- Facilities: WiFi, common room, laundry, mess
- Mess: Vegetarian and non-vegetarian options
- Hostel rules: Entry/exit timing, visitor policies apply
- 24/7 security

Campus facilities:
- Library with digital and physical resources
- Computer labs with high-speed internet
- Sports facilities: Cricket ground, basketball court, indoor games
- Medical/health center on campus
- Cafeteria/canteen with variety of food options
- Auditorium for events

Location: The campus is located in Bhopal, Madhya Pradesh — a well-connected city with airport, railway station, and bus services.`,
  },
  {
    source: "IIIT Bhopal Student Life & Clubs",
    text: `Student Clubs and Technical Societies:
- Coding Club / Competitive Programming Club
- Robotics Club
- Electronics Club  
- Cultural Club
- Literary Club
- Sports Committee
- Photography Club
- Music/Dance Society
- Entrepreneurship Cell (E-Cell)
- NSS (National Service Scheme)

Annual Events:
- Techfest / Technical festival
- Cultural festival
- Sports meet
- Freshers' welcome party (Fresher's Night)
- Farewell for final year students

Student Government: Student Council elected by students for representing student interests.`,
  },
  {
    source: "IIIT Bhopal Placement & Career",
    text: `Placement Cell:
- Training & Placement Officer (TPO) manages campus placements
- Companies visiting for placements include IT companies, core companies, startups
- Common recruiters: TCS, Infosys, Wipro, Capgemini, and other IT firms
- Some students get placed in core companies for ECE branch
- Average CTC varies by year; check placement reports on official site
- Internship opportunities: Available from 2nd/3rd year onwards
- Placement preparation: Mock interviews, aptitude training, resume workshops

Higher Education:
- Students pursue M.Tech/MS/PhD/MBA after graduation
- GATE preparation support available
- Students have gone to top universities for higher studies`,
  },
  {
    source: "IIIT Bhopal For Freshers - Important Information",
    text: `Dear Fresher, Welcome to IIIT Bhopal! Here's what you need to know:

REPORTING:
- Bring all original documents (10th, 12th marksheets, JEE scorecard, ID proof, photos)
- Complete online/offline document verification as per admission schedule
- Pay fees before the deadline mentioned in admission letter

WHAT TO BRING TO HOSTEL:
- Bedding/mattress (or buy in Bhopal)
- Clothes for all seasons (Bhopal has hot summers, cold winters)
- Laptop (highly recommended for CS/ECE students)
- Stationery and notebooks
- Personal hygiene items
- Water bottle, utensils (optional, mess provides)
- Valid ID proof (Aadhaar, etc.)

FIRST WEEK TIPS:
- Attend all orientation programs — very important!
- Meet your faculty advisor/mentor
- Get your institute ID card made
- Register on the student portal
- Join hostel WhatsApp/Telegram groups for updates
- Explore the campus and city

ACADEMIC TIPS:
- Attend all classes — attendance is mandatory (usually 75% minimum)
- Start competitive programming early (for CSE students)
- Join technical clubs from day 1
- Maintain CGPA — it matters for placements and higher studies`,
  },
  {
    source: "IIIT Bhopal Faculty & Administration",
    text: `Administration:
- Director: Head of the institute
- Dean Academics: Manages academic affairs
- Dean Student Welfare: Student issues, scholarships, hostels
- Registrar: Administrative and official documentation

Faculty:
- Qualified faculty with PhD from reputed institutions
- Mix of permanent faculty and visiting faculty
- Office hours available for student consultation

Contact:
- Official Email: info@iiitbhopal.ac.in (check website for department emails)
- Phone: Check iiitbhopal.ac.in/contact for updated numbers
- Address: IIIT Bhopal, Bhopal, Madhya Pradesh`,
  },
  {
    source: "Bhopal City Guide for IIIT Students",
    text: `Bhopal City - Useful Info for Students:

TRANSPORT:
- City buses and autos/cabs (Ola, Uber available)
- Habibganj (now Rani Kamlapati) Railway Station - main railway station
- Raja Bhoj Airport for air travel
- Bhopal is well connected to Delhi, Mumbai, other cities

PLACES NEARBY:
- DB Mall, Aura Mall for shopping
- Halal food street, various restaurants near campus
- Van Vihar, Upper Lake for relaxation
- BTM Hospital for medical emergencies

IMPORTANT NUMBERS (Bhopal):
- Police: 100
- Ambulance: 108
- Medical emergencies: 112

SHOPPING FOR STUDENT ESSENTIALS:
- Electronic market near Piplani area
- Stationery near campus market
- Grocery: D-Mart, local kiranas nearby

FOOD:
- Mess food + canteen available on campus
- Many restaurants and dhabas near institute
- Food delivery apps (Zomato, Swiggy) work in Bhopal`,
  },
  {
    source: "IIIT Bhopal Rules & Regulations",
    text: `Important Rules for Students:

ACADEMIC:
- Minimum 75% attendance required in each subject
- No plagiarism in assignments/projects — strict action taken
- Examination rules strictly followed (no malpractice)
- Re-exam/supplementary exam for those who fail

HOSTEL:
- No ragging — strict anti-ragging policy (UGC guidelines)
- Report ragging: Anti-Ragging Helpline 1800-180-5522
- Hostel curfew timings (check your hostel specific rules)
- Guests of opposite gender not allowed in hostel rooms
- No alcohol, drugs on campus — strict disciplinary action
- Keep rooms clean, report maintenance issues

GENERAL:
- Dress code may apply in some areas (labs, formal events)
- ID card mandatory on campus
- Follow COVID/health protocols if any in force
- Respect faculty, staff, and fellow students
- Damage to institute property is chargeable`,
  },
  {
    source: "IIIT Bhopal 2025-2026 Updates",
    text: `Recent developments at IIIT Bhopal (2024-2026):
- The institute continues to grow with expanding infrastructure
- New labs and facilities being added regularly
- Increased focus on research and innovation
- Industry partnerships and MoUs with companies
- NBA/NAAC accreditation process ongoing
- Permanent campus development in progress
- Increasing placement numbers year over year
- New courses and electives being added to curriculum
- Active participation in Smart India Hackathon, ACM ICPC, and other national competitions
- Growing alumni network

Note: For the most current information about 2025-26 academic year, always verify at iiitbhopal.ac.in`,
  },
];

// ─── Web Scraper ─────────────────────────────────────────────────────────────
const SCRAPE_URLS = [
  { url: "https://www.iiitbhopal.ac.in", source: "IIIT Bhopal Official Site" },
  {
    url: "https://www.iiitbhopal.ac.in/academics",
    source: "IIIT Bhopal Academics",
  },
  {
    url: "https://www.iiitbhopal.ac.in/admission",
    source: "IIIT Bhopal Admission",
  },
  {
    url: "https://www.iiitbhopal.ac.in/placement",
    source: "IIIT Bhopal Placement",
  },
];

async function scrapeURL(urlInfo) {
  try {
    const { data } = await axios.get(urlInfo.url, {
      timeout: 10000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (compatible; IIITBhopalBot/1.0; Educational Assistant)",
      },
    });
    const $ = cheerio.load(data);

    // Remove noise
    $("script, style, nav, footer, .menu, .navbar, .sidebar").remove();

    // Extract meaningful text
    const texts = [];
    $("p, h1, h2, h3, h4, li, td, th, article, section, .content, main").each(
      (_, el) => {
        const text = $(el).text().trim().replace(/\s+/g, " ");
        if (text.length > 50) texts.push(text);
      }
    );

    if (texts.length === 0) return null;

    return {
      source: urlInfo.source,
      text: texts.slice(0, 50).join("\n"),
    };
  } catch (err) {
    console.log(`⚠️ Could not scrape ${urlInfo.url}: ${err.message}`);
    return null;
  }
}

// Chunk text into smaller pieces for better RAG
function chunkText(item, maxLength = 800) {
  const chunks = [];
  const sentences = item.text.split(/[.!?]\s+/);
  let current = "";

  for (const sentence of sentences) {
    if ((current + sentence).length > maxLength && current) {
      chunks.push({ source: item.source, text: current.trim() });
      current = sentence + ". ";
    } else {
      current += sentence + ". ";
    }
  }
  if (current.trim()) chunks.push({ source: item.source, text: current.trim() });
  return chunks;
}

export async function scrapeAllSources() {
  console.log("📡 Starting data collection...");

  // 1. Start with static knowledge (always works)
  const allData = [...STATIC_KNOWLEDGE];

  // 2. Try to scrape live data
  const scrapePromises = SCRAPE_URLS.map(scrapeURL);
  const scraped = await Promise.allSettled(scrapePromises);

  for (const result of scraped) {
    if (result.status === "fulfilled" && result.value) {
      allData.push(result.value);
    }
  }

  // 3. Chunk all data
  const chunked = allData.flatMap((item) => chunkText(item));

  console.log(`✅ Total knowledge chunks: ${chunked.length}`);
  return chunked;
}
