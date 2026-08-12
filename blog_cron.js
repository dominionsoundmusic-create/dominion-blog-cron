require('dotenv').config();
const axios = require('axios');

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

// All Dominion brands and their blog configs
const BRANDS = [
  {
    name: 'Dominion Web Design Pro',
    slug: 'web-design',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dominionwebdesignpro-site',
    blog_path: 'blog',
    domain: 'dominionwebdesignpro.com',
    topics: [
      'why small businesses need a website in {year}',
      'how to get more customers with local SEO',
      'website mistakes small businesses make',
      'how much does a website cost for a small business',
      'why your competitor is getting more calls than you',
      'best website design tips for {industry} businesses',
      'how to rank on Google in your city',
      'why mobile-friendly websites matter for local business',
      'signs your website needs a redesign',
      'how a website pays for itself with one new customer'
    ],
    style: 'professional, helpful, local-business focused',
    cta: 'Get a professional website starting at $497 at dominionwebdesignpro.com',
    color: '#c9a84c'
  },
  {
    name: 'AI Voice Agent Pros',
    slug: 'ai-voice',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'aivoiceagentpros-site',
    blog_path: 'blog',
    domain: 'aivoiceagentpros.com',
    topics: [
      'how AI receptionists are replacing answering services',
      'never miss a customer call again with AI voice agents',
      'how {industry} businesses use AI to book more appointments',
      'the true cost of missed calls for small businesses',
      'AI vs human receptionist which is better for your business',
      'how voice AI works and why it sounds so real',
      'after hours call handling with AI voice agents',
      'how to set up an AI receptionist for your business',
      'AI voice agents for {industry} businesses',
      'why customers prefer calling over texting for appointments'
    ],
    style: 'tech-forward, benefit-focused, conversational',
    cta: 'Start your free 2-week trial at aivoiceagentpros.com',
    color: '#3a7bd5'
  },
  {
    name: 'Dominion Solar Pro',
    slug: 'solar',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dominionsolarpro-site',
    blog_path: 'blog',
    domain: 'dominionsolarpro.com',
    topics: [
      'best portable solar generator for camping in {year}',
      'how to choose the right portable power station',
      'solar generator vs gas generator which is better',
      'best solar generator for home backup power',
      'jackery vs other solar generator brands compared',
      'how long does a portable solar generator last',
      'best solar generator for RV living',
      'off grid living with portable solar power',
      'how many watts do you need for home backup',
      'best portable solar panels for camping and hiking'
    ],
    style: 'outdoor enthusiast, practical, product-review style',
    cta: 'Shop the best deals on Jackery solar generators at dominionsolarpro.com',
    color: '#2d6a2d'
  },
  {
    name: 'Dominion Sound Music',
    slug: 'music',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dominionsoundmusic-site',
    blog_path: 'blog',
    domain: 'dominionSoundmusic.com',
    topics: [
      'how to order a custom memorial song for a loved one',
      'the perfect custom wedding song for your first dance',
      'why a custom birthday song is the best gift',
      'gospel music that heals the soul',
      'how independent artists release music in {year}',
      'the story behind Dominion Sound music',
      'custom business jingles that customers remember',
      'best gifts for music lovers',
      'how music helps with grief and healing',
      'neo soul and gospel music the perfect blend'
    ],
    style: 'warm, soulful, personal, storytelling',
    cta: 'Order a custom song or stream our music at dominionSoundmusic.com',
    color: '#8b5cf6'
  },
  {
    name: 'Kid Story Books',
    slug: 'kids-books',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'kidstorybooks-site',
    blog_path: 'blog',
    domain: 'kidstorybooks.com',
    topics: [
      'best children books for bedtime reading',
      'how reading to your child every day changes their life',
      'funny children books that make parents laugh too',
      'educational books for kids ages 3 to 8',
      'how to get your child excited about reading',
      'best cookbook for families with kids',
      'children books that teach important life lessons',
      'how storytelling builds imagination in children',
      'books every child should read before age 10',
      'the best gifts for kids who love to read'
    ],
    style: 'warm, family-friendly, encouraging, parent-focused',
    cta: 'Browse 200+ children books and cookbooks at kidstorybooks.com',
    color: '#f59e0b'
  },
  {
    name: 'Dominion AI Agency',
    slug: 'ai-agency',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dominionaiagency-site',
    blog_path: 'blog',
    domain: 'dominionaiagency.com',
    topics: [
      'how AI is changing small business marketing in {year}',
      'what is an AI agency and why your business needs one',
      'how to automate your business with AI tools',
      'AI marketing vs traditional marketing which wins',
      'how small businesses compete with big companies using AI',
      'the best AI tools for small business owners',
      'how to use AI to generate leads for your business',
      'AI chatbots vs AI voice agents which do you need',
      'how to scale your business without hiring more staff',
      'the future of AI in local business marketing'
    ],
    style: 'authoritative, forward-thinking, business-focused',
    cta: 'Get your free AI strategy session at dominionaiagency.com',
    color: '#e53e3e'
  },
  {
    name: 'Houston Power Washing Pro',
    slug: 'houston-powerwash',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'houston-powerwashing-pro',
    blog_path: 'blog',
    domain: 'exquisite-chebakia-f6f9e5.netlify.app',
    topics: [
      'best power washing service in Houston TX',
      'how to remove mold and mildew from your Houston home',
      'pressure washing vs soft washing which is right for your home',
      'how often should you power wash your Houston driveway',
      'why Houston homes need regular exterior cleaning',
      'power washing before painting why it matters',
      'best way to clean concrete driveways in Houston',
      'how power washing increases your home value in Houston',
      'roof soft washing vs pressure washing Houston TX',
      'commercial power washing for Houston businesses'
    ],
    style: 'local, practical, Houston-specific, homeowner focused',
    cta: 'Get a free power washing quote in Houston TX',
    color: '#1a6faf'
  },
  {
    name: 'Houston HVAC Pro',
    slug: 'houston-hvac',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'houston-hvac-pro',
    blog_path: 'blog',
    domain: 'stirring-gumdrop-4e30a6.netlify.app',
    topics: [
      'best HVAC service in Houston TX',
      'how to keep your AC running in Houston summer heat',
      'signs your AC needs repair in Houston TX',
      'how often to change air filters in Houston humidity',
      'why Houston homes need HVAC maintenance twice a year',
      'best AC units for Houston climate',
      'how to lower your energy bill with HVAC maintenance Houston',
      'HVAC emergency service Houston TX what to do',
      'indoor air quality tips for Houston homeowners',
      'how long does an AC unit last in Houston TX'
    ],
    style: 'local, practical, Houston-specific, homeowner focused',
    cta: 'Get same-day HVAC service in Houston TX',
    color: '#1a4faf'
  },
  {
    name: 'Houston Roofing Pro',
    slug: 'houston-roofing',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'houston-roofing-pro',
    blog_path: 'blog',
    domain: 'delicate-bavarois-59069c.netlify.app',
    topics: [
      'best roofing company in Houston TX',
      'how to spot storm damage on your Houston roof',
      'Houston roof replacement cost what to expect',
      'best roofing materials for Houston weather',
      'how to file a roof insurance claim in Houston TX',
      'signs you need a new roof in Houston TX',
      'flat roof vs pitched roof for Houston commercial buildings',
      'how hurricane season affects Houston roofs',
      'roof maintenance tips for Houston homeowners',
      'how to choose a reliable roofer in Houston TX'
    ],
    style: 'local, practical, Houston-specific, homeowner focused',
    cta: 'Get a free roof inspection in Houston TX',
    color: '#8b1a1a'
  },
  {
    name: 'Dallas Power Washing Pro',
    slug: 'dallas-powerwash',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dallas-powerwashing-pro',
    blog_path: 'blog',
    domain: 'sage-tarsier-f0ded1.netlify.app',
    topics: [
      'best power washing service in Dallas TX',
      'how to clean your Dallas home exterior',
      'pressure washing concrete driveways in Dallas TX',
      'why Dallas homeowners need annual power washing',
      'commercial pressure washing for Dallas businesses',
      'how to remove hard water stains in Dallas',
      'soft washing vs pressure washing Dallas TX',
      'power washing before selling your Dallas home',
      'how to maintain your deck with power washing in Dallas',
      'best power washing tips for Dallas clay soil stains'
    ],
    style: 'local, practical, Dallas-specific, homeowner focused',
    cta: 'Get a free power washing quote in Dallas TX',
    color: '#1a6faf'
  },
  {
    name: 'Dallas HVAC Pro',
    slug: 'dallas-hvac',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dallas-hvac-pro',
    blog_path: 'blog',
    domain: 'ornate-wisp-2520ba.netlify.app',
    topics: [
      'best HVAC company in Dallas TX',
      'how to prepare your AC for Dallas summer',
      'signs your HVAC needs replacement in Dallas TX',
      'energy saving HVAC tips for Dallas homeowners',
      'best smart thermostats for Dallas homes',
      'HVAC maintenance checklist for Dallas TX',
      'how Dallas weather affects your HVAC system',
      'duct cleaning services in Dallas TX',
      'how to improve air quality in your Dallas home',
      'emergency AC repair Dallas TX what to do'
    ],
    style: 'local, practical, Dallas-specific, homeowner focused',
    cta: 'Get same-day HVAC service in Dallas TX',
    color: '#1a4faf'
  },
  {
    name: 'Dallas Roofing Pro',
    slug: 'dallas-roofing',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dallas-roofing-pro',
    blog_path: 'blog',
    domain: 'splendid-sable-28fb05.netlify.app',
    topics: [
      'best roofing company in Dallas TX',
      'how to spot hail damage on your Dallas roof',
      'Dallas roof replacement cost guide',
      'best roofing shingles for Dallas TX weather',
      'how to choose a trustworthy roofer in Dallas',
      'signs you need emergency roof repair in Dallas',
      'flat roofing options for Dallas commercial buildings',
      'how Texas storms affect Dallas roofs',
      'roof inspection checklist for Dallas homeowners',
      'insurance claims for roof damage in Dallas TX'
    ],
    style: 'local, practical, Dallas-specific, homeowner focused',
    cta: 'Get a free roof inspection in Dallas TX',
    color: '#8b1a1a'
  },
  {
    name: 'Phoenix Pool Cleaning Pro',
    slug: 'phoenix-pool',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'phoenix-pool-cleaning-pro',
    blog_path: 'blog',
    domain: 'superlative-mandazi-aa17b9.netlify.app',
    topics: [
      'best pool cleaning service in Phoenix AZ',
      'how to prevent algae in your Phoenix pool',
      'pool chemical balancing tips for Phoenix homeowners',
      'how often should you clean your pool in Phoenix',
      'why Phoenix pools need weekly professional service',
      'pool equipment repair Phoenix AZ what to know',
      'best pool service companies in Scottsdale AZ',
      'how monsoon season affects your Phoenix pool',
      'pool cleaning cost in Phoenix AZ what to expect',
      'how to keep your pool crystal clear in Arizona heat'
    ],
    style: 'local, practical, Phoenix-specific, homeowner focused',
    cta: 'Get a free pool cleaning quote in Phoenix AZ',
    color: '#0ea5e9'
  },
  {
    name: 'Tucson Pool Cleaning Pro',
    slug: 'tucson-pool',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'tucson-pool-cleaning-pro',
    blog_path: 'blog',
    domain: 'tucsonpoolcleaningpro.netlify.app',
    topics: [
      'best pool cleaning service in Tucson AZ',
      'how to maintain your pool in Tucson heat',
      'pool algae prevention tips for Tucson homeowners',
      'pool chemical service Tucson AZ',
      'how often to clean your pool in Tucson Arizona',
      'pool equipment repair Tucson AZ',
      'best pool service in Marana and Oro Valley AZ',
      'how Tucson monsoons affect your swimming pool',
      'pool cleaning cost Tucson AZ guide',
      'keeping your pool clean year round in Tucson'
    ],
    style: 'local, practical, Tucson-specific, homeowner focused',
    cta: 'Get a free pool cleaning quote in Tucson AZ',
    color: '#0ea5e9'
  },
  {
    name: 'Dominion Hard Money',
    slug: 'dominion-hard-money',
    repo_owner: 'dominionsoundmusic-create',
    repo_name: 'dominion-hard-money-blog',
    blog_path: 'blog',
    domain: 'dominionhardmoney.com',
    topics: [
      'hard money loans',
      'fix and flip financing',
      'DSCR rental loans',
      'bridge loans',
      'real estate investing tips',
      'private money lending',
      'how to qualify for a hard money loan',
      'fix and flip deals',
      'real estate investor strategies',
      'ARV and MAO explained'
    ],
    style: 'authoritative, trustworthy, investor-focused',
    cta: 'Apply for funding at dominionhardmoney.com',
    color: '#c9a84c'
  }
];

// Generate a blog post using Claude API
async function generateBlogPost(brand, topic) {
  const year = new Date().getFullYear();
  const resolvedTopic = topic.replace('{year}', year).replace('{industry}', 'local');

  const prompt = `Write a complete SEO-optimized blog post for ${brand.name} about: "${resolvedTopic}"

Style: ${brand.style}
Domain: ${brand.domain}
CTA at the end: ${brand.cta}

Requirements:
- Write in HTML format ready to embed in a page
- Include an H1 title, introduction, 4-6 sections with H2 headings, and conclusion
- 800-1200 words total
- Include the CTA as a styled button/section at the end
- Make it genuinely helpful and informative
- Include relevant keywords naturally throughout
- Do NOT include DOCTYPE, html, head, or body tags - just the article content HTML
- Start with: <article class="blog-post">
- End with: </article>

Write the full blog post now:`;

  const response = await axios.post('https://api.anthropic.com/v1/messages', {
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }]
  }, {
    timeout: 120000,
    headers: {
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
      'content-type': 'application/json'
    }
  });

  return response.data.content[0].text;
}

// Create full HTML page for the blog post
function wrapBlogPost(brand, topic, content, slug) {
  const year = new Date().getFullYear();
  const title = topic.replace('{year}', year).replace('{industry}', 'Local');
  const date = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${title} | ${brand.name}</title>
<meta name="description" content="${title} - Expert insights from ${brand.name}">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://${brand.domain}/blog/${slug}.html">
<style>
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;line-height:1.7;}
header{background:#0a0a0a;color:#fff;padding:16px 24px;}
header h1{font-size:1.2rem;font-weight:800;color:${brand.color};}
.hero{background:#f9f9f9;border-bottom:3px solid ${brand.color};padding:40px 24px;}
.hero h2{font-size:2rem;font-weight:800;max-width:800px;margin:0 auto 12px;}
.hero .meta{color:#888;font-size:.9rem;max-width:800px;margin:0 auto;}
.content{max-width:800px;margin:0 auto;padding:40px 24px;}
.content h1{font-size:1.8rem;font-weight:800;color:#0a0a0a;margin-bottom:16px;}
.content h2{font-size:1.4rem;font-weight:700;color:#0a0a0a;margin:32px 0 12px;}
.content p{margin-bottom:16px;font-size:1rem;color:#333;}
.content ul,.content ol{margin:0 0 16px 24px;}
.content li{margin-bottom:8px;}
.cta-box{background:${brand.color};color:#fff;padding:32px;border-radius:10px;text-align:center;margin:40px 0;}
.cta-box h3{font-size:1.4rem;font-weight:800;margin-bottom:12px;}
.cta-box a{display:inline-block;background:#fff;color:#0a0a0a;font-weight:700;padding:12px 28px;border-radius:6px;text-decoration:none;margin-top:12px;}
.back{display:inline-block;margin-bottom:24px;color:${brand.color};font-weight:600;text-decoration:none;}
footer{background:#0a0a0a;color:#aaa;text-align:center;padding:20px;font-size:.85rem;}
</style>
</head>
<body>
<header><h1>${brand.name}</h1></header>
<div class="hero">
<h2>${title}</h2>
<div class="meta">Published ${date} &bull; ${brand.name}</div>
</div>
<div class="content">
<a href="/blog" class="back">← Back to Blog</a>
${content}
</div>
<footer><p>&copy; ${year} ${brand.name} | <a href="https://${brand.domain}" style="color:${brand.color};">${brand.domain}</a></p></footer>
</body>
</html>`;
}

// Slugify a topic title
function slugify(text) {
  return text.toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Commit file to GitHub
async function commitToGitHub(owner, repo, path, content, message) {
  try {
    // Check if file exists
    let sha = null;
    try {
      const existing = await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
        { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
      );
      sha = existing.data.sha;
    } catch (e) { /* file doesn't exist yet */ }

    const payload = {
      message,
      content: Buffer.from(content).toString('base64'),
      branch: 'main'
    };
    if (sha) payload.sha = sha;

    await axios.put(
      `https://api.github.com/repos/${owner}/${repo}/contents/${path}`,
      payload,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json', 'Content-Type': 'application/json' } }
    );
    return true;
  } catch (err) {
    console.error('GitHub commit error:', err.response?.data || err.message);
    return false;
  }
}


// ---------------------------------------------------------------------------
// Multi-file commit via the git tree API.
// One commit = one Netlify deploy. Writing the post, the blog index and the
// sitemap as three separate contents-API calls would cost three deploys.
// ---------------------------------------------------------------------------
async function commitFiles(owner, repo, files, message) {
  const H = { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' };
  const base = `https://api.github.com/repos/${owner}/${repo}`;
  try {
    const ref = await axios.get(`${base}/git/ref/heads/main`, { headers: H });
    const headSha = ref.data.object.sha;
    const headCommit = await axios.get(`${base}/git/commits/${headSha}`, { headers: H });
    const baseTree = headCommit.data.tree.sha;

    const tree = [];
    for (const f of files) {
      const blob = await axios.post(`${base}/git/blobs`,
        { content: Buffer.from(f.content).toString('base64'), encoding: 'base64' },
        { headers: H });
      tree.push({ path: f.path, mode: '100644', type: 'blob', sha: blob.data.sha });
    }

    const newTree = await axios.post(`${base}/git/trees`, { base_tree: baseTree, tree }, { headers: H });
    const commit = await axios.post(`${base}/git/commits`,
      { message, tree: newTree.data.sha, parents: [headSha] }, { headers: H });
    await axios.patch(`${base}/git/refs/heads/main`, { sha: commit.data.sha }, { headers: H });
    return true;
  } catch (err) {
    console.error('GitHub tree commit error:', err.response?.data || err.message);
    return false;
  }
}

// Turn a post filename into a readable title: strips .html and the -<timestamp>
function titleFromSlug(name) {
  const s = name.replace(/\.html$/, '').replace(/-\d{10,}$/, '');
  return s.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

// Full list of post files in a brand's blog folder, newest first
async function listPostFiles(brand) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${brand.repo_owner}/${brand.repo_name}/contents/${brand.blog_path}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    );
    return res.data
      .filter(f => f.name.endsWith('.html') && f.name !== 'index.html')
      .map(f => f.name)
      .sort((a, b) => {
        const ta = parseInt((a.match(/-(\d{10,})\.html$/) || [0, 0])[1], 10);
        const tb = parseInt((b.match(/-(\d{10,})\.html$/) || [0, 0])[1], 10);
        return tb - ta;
      });
  } catch (e) {
    return [];
  }
}

// Build blog/index.html listing every post, so posts stop being orphans
function buildBlogIndex(brand, fileNames) {
  const items = fileNames.map(n => {
    const ts = parseInt((n.match(/-(\d{10,})\.html$/) || [0, 0])[1], 10);
    const when = ts ? new Date(ts).toLocaleDateString('en-US',
      { year: 'numeric', month: 'long', day: 'numeric' }) : '';
    return `    <li><a href="/${brand.blog_path}/${n}">${titleFromSlug(n)}</a>` +
           (when ? `<span class="d">${when}</span>` : '') + `</li>`;
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Blog | ${brand.name}</title>
<meta name="description" content="Articles and advice from ${brand.name}.">
<link rel="canonical" href="https://${brand.domain}/${brand.blog_path}/">
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{font-family:'Segoe UI',Arial,sans-serif;color:#1a1a1a;background:#fff;line-height:1.7}
header{background:#0a0a0a;color:#fff;padding:16px 24px}
header a{color:${brand.color};font-weight:800;text-decoration:none;font-size:1.2rem}
.wrap{max-width:800px;margin:0 auto;padding:40px 24px}
h1{font-size:2rem;font-weight:800;margin-bottom:8px}
.sub{color:#777;margin-bottom:28px}
ul{list-style:none}
li{padding:16px 0;border-bottom:1px solid #eee;display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap}
li a{color:#0a0a0a;text-decoration:none;font-weight:600}
li a:hover{color:${brand.color}}
.d{color:#999;font-size:.87rem;white-space:nowrap}
footer{padding:28px 24px;text-align:center;color:#888;font-size:.9rem;border-top:1px solid #eee}
</style>
</head>
<body>
<header><a href="https://${brand.domain}/">${brand.name}</a></header>
<div class="wrap">
  <h1>Blog</h1>
  <p class="sub">${fileNames.length} article${fileNames.length === 1 ? '' : 's'} from ${brand.name}.</p>
  <ul>
${items}
  </ul>
</div>
<footer><a href="https://${brand.domain}/">Back to ${brand.name}</a></footer>
</body>
</html>`;
}

// Add the blog index and every post to sitemap.xml, without disturbing the
// city-page URLs the site builder puts there.
function buildSitemap(existingXml, brand, fileNames) {
  const today = new Date().toISOString().slice(0, 10);
  const blogBase = `https://${brand.domain}/${brand.blog_path}/`;
  const wanted = [blogBase, ...fileNames.map(n => blogBase + n)];

  let xml = existingXml && existingXml.includes('<urlset')
    ? existingXml
    : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n</urlset>`;

  // drop any existing blog entries so the list is rebuilt cleanly
  xml = xml.replace(
    new RegExp(`\\s*<url>(?:(?!</url>)[\\s\\S])*?<loc>\\s*${blogBase.replace(/[.*+?^${}()|[\\]\\\\]/g, '\\\\$&')}[^<]*</loc>[\\s\\S]*?</url>`, 'g'),
    ''
  );

  const block = wanted.map(u =>
    `  <url>\n    <loc>${u}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>`
  ).join('\n');

  return xml.replace('</urlset>', block + '\n</urlset>');
}

async function fetchRepoFile(brand, path) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${brand.repo_owner}/${brand.repo_name}/contents/${path}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    );
    return Buffer.from(res.data.content, 'base64').toString('utf-8');
  } catch (e) {
    return null;
  }
}


// List the slugs already published in a brand's blog folder.
async function listPublishedSlugs(brand) {
  try {
    const res = await axios.get(
      `https://api.github.com/repos/${brand.repo_owner}/${brand.repo_name}/contents/${brand.blog_path}`,
      { headers: { Authorization: `Bearer ${GITHUB_TOKEN}`, Accept: 'application/vnd.github.v3+json' } }
    );
    // strip the -<timestamp> suffix so repeats of the same topic collapse together
    return res.data
      .filter(f => f.name.endsWith('.html') && f.name !== 'index.html')
      .map(f => f.name.replace(/\.html$/, '').replace(/-\d{10,}$/, ''));
  } catch (e) {
    console.log('  (could not read existing posts, falling back to random)');
    return null;
  }
}

// Generate and publish one blog post for a brand
async function publishBlogPost(brand) {
  console.log(`\n📝 Generating blog post for ${brand.name}...`);

  // Pick a topic this brand has not published yet. Only fall back to random
  // once every topic is used, which is what caused the duplicate posts.
  const year = new Date().getFullYear();
  const resolve = t => t.replace('{year}', year).replace('{industry}', 'Local');
  const published = await listPublishedSlugs(brand);
  let topic;
  if (published === null) {
    topic = brand.topics[Math.floor(Math.random() * brand.topics.length)];
  } else {
    const unused = brand.topics.filter(t => !published.includes(slugify(resolve(t))));
    if (unused.length) {
      topic = unused[Math.floor(Math.random() * unused.length)];
      console.log(`  ${unused.length} of ${brand.topics.length} topics still unpublished`);
    } else {
      console.log(`  every topic already published for ${brand.name} — skipping to avoid a duplicate`);
      return { success: false, skipped: true, brand: brand.name, reason: 'all topics published' };
    }
  }
  console.log(`Topic: ${topic}`);

  // Generate content
  const content = await generateBlogPost(brand, topic);
  const resolvedTopic = topic.replace('{year}', year).replace('{industry}', 'Local');
  const slug = slugify(resolvedTopic) + '-' + Date.now();

  // Wrap in full HTML page
  const html = wrapBlogPost(brand, topic, content, slug);

  // Commit the post, a rebuilt blog index and an updated sitemap as ONE commit.
  // One commit = one Netlify deploy. Separate calls would cost three.
  const path = `${brand.blog_path}/${slug}.html`;
  const priorFiles = await listPostFiles(brand);
  const allFiles = [`${slug}.html`, ...priorFiles.filter(n => n !== `${slug}.html`)];
  const existingSitemap = await fetchRepoFile(brand, 'sitemap.xml');

  const committed = await commitFiles(
    brand.repo_owner,
    brand.repo_name,
    [
      { path, content: html },
      { path: `${brand.blog_path}/index.html`, content: buildBlogIndex(brand, allFiles) },
      { path: 'sitemap.xml', content: buildSitemap(existingSitemap, brand, allFiles) }
    ],
    `Add blog post: ${resolvedTopic}`
  );

  if (committed) {
    console.log(`✅ Published: ${resolvedTopic} → ${brand.domain}/${path}`);
    return { success: true, brand: brand.name, topic: resolvedTopic, path, url: `https://${brand.domain}/${path}` };
  } else {
    console.log(`❌ Failed to publish for ${brand.name}`);
    return { success: false, brand: brand.name, topic: resolvedTopic };
  }
}

// Run all brands
async function runAllBlogs() {
  console.log('\n🚀 Blog generator started:', new Date().toLocaleString());
  const results = [];
  for (const brand of BRANDS) {
    try {
      const result = await publishBlogPost(brand);
      results.push(result);
      await new Promise(r => setTimeout(r, 3000)); // pause between brands
    } catch (err) {
      console.error(`Error for ${brand.name}:`, err.message);
      results.push({ success: false, brand: brand.name, error: err.message });
    }
  }
  console.log('\n✅ Blog generation complete');
  return results;
}

// Run one specific brand
async function runOneBrand(brandSlug) {
  const brand = BRANDS.find(b => b.slug === brandSlug);
  if (!brand) return { error: 'Brand not found' };
  return await publishBlogPost(brand);
}

// ── ROUTES ──────────────────────────────────────────────────────────────────

app.get('/', (req, res) => {
  res.json({
    service: 'Dominion Blog Generator',
    status: 'running',
    brands: BRANDS.map(b => ({ name: b.name, slug: b.slug, domain: b.domain })),
    endpoints: {
      'POST /run-all': 'Generate blog post for all 6 brands',
      'POST /run/:slug': 'Generate blog post for one brand (e.g. /run/web-design)',
      'GET /brands': 'List all brands',
      'GET /status': 'Check service status'
    }
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'running',
    anthropic: !!ANTHROPIC_API_KEY,
    github: !!GITHUB_TOKEN,
    brands: BRANDS.length
  });
});

app.get('/brands', (req, res) => {
  res.json(BRANDS.map(b => ({ name: b.name, slug: b.slug, domain: b.domain, topics: b.topics.length })));
});

app.post('/run-all', async (req, res) => {
  res.json({ success: true, message: 'Blog generation started for all brands' });
  runAllBlogs();
});

app.post('/run/:slug', async (req, res) => {
  const { slug } = req.params;
  res.json({ success: true, message: `Blog generation started for ${slug}` });
  runOneBrand(slug);
});

// 
// MAIN — run all brands once and exit
async function main() {
  console.log('📝 Dominion Daily Blog Generator');
  console.log(new Date().toISOString());
  
  for (const brand of BRANDS) {
    try {
      // Delegate to publishBlogPost so the index + sitemap fix applies here too
      const r = await publishBlogPost(brand);
      if (r.skipped) console.log('  skipped: ' + r.reason);
      await new Promise(r2 => setTimeout(r2, 3000));
    } catch(err) {
      console.error('❌ ' + brand.name + ':', err.message);
    }
  }
  
  console.log('\n✅ All ' + BRANDS.length + ' brands done.');
  process.exit(0);
}

main().catch(err => {
  console.error('Fatal:', err.message);
  process.exit(1);
});
