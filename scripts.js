document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Navbar Fetch and Routing
    const navPlaceholder = document.getElementById('nav-placeholder');
    if (navPlaceholder) {
        fetch('navbar.html')
        .then(response => response.text())
        .then(data => {
            navPlaceholder.innerHTML = data;
            let currentUrl = window.location.pathname.split('/').pop() || 'index.html';
            let navLinks = document.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                if (link.getAttribute('href') === currentUrl) {
                    link.classList.add('active');
                }
            });
        })
        .catch(error => console.error('Error loading navbar:', error));
    }

    // 2. Viewport Scaling Logic (For Index and Artifact1)
    function fitToFrame() {
        const wrapper = document.getElementById('scale-wrapper') || document.getElementById('scale-container');
        if (!wrapper) return;

        const containerWidth = document.body.clientWidth || window.innerWidth;
        const isTimelineGraphic = document.getElementById('scale-container') !== null;
        
        // Use different base constraints based on which page is scaling
        const designWidth = isTimelineGraphic ? 1400 : 1200; 
        const designHeight = isTimelineGraphic ? 750 : 720;
        
        const scale = containerWidth / designWidth;
        wrapper.style.transform = `scale(${scale})`;
        
        if (!isTimelineGraphic) {
            document.body.style.height = `${designHeight * scale}px`;
        }
    }

    if (document.getElementById('scale-wrapper') || document.getElementById('scale-container')) {
        window.addEventListener('resize', fitToFrame);
        setTimeout(fitToFrame, 50);
        setTimeout(fitToFrame, 500);
    }

    // 3. Artifact Details Tab Logic (Robust Version)
    window.openTab = function(evt, tabId) {
        // Safely capture the button, even during automated/synthetic clicks
        const btn = evt.currentTarget || (evt.target ? evt.target.closest('.tab-btn') : null);
        if (!btn) return;

        // Find the specific container the user clicked inside
        const container = btn.closest('.tab-pane-container');
        if (!container) return;

        // Hide all tab content inside THIS specific container
        const tabContent = container.getElementsByClassName("tab-content");
        for (let i = 0; i < tabContent.length; i++) {
            tabContent[i].classList.remove("active");
        }

        // Remove the "active" class from all buttons inside THIS specific container
        const tabBtns = container.getElementsByClassName("tab-btn");
        for (let i = 0; i < tabBtns.length; i++) {
            tabBtns[i].classList.remove("active");
        }

        // Show the current tab, and highlight the clicked button
        const targetContent = document.getElementById(tabId);
        if (targetContent) {
            targetContent.classList.add("active");
        }
        btn.classList.add("active");
    };

    // 4. Automatically open the first tab of EVERY tab pane on page load
    const tabPanes = document.querySelectorAll('.tab-pane-container');
    tabPanes.forEach(pane => {
        const firstTabBtn = pane.querySelector('.tab-btn');
        if (firstTabBtn) {
            firstTabBtn.click();
        }
    });

});

/* =========================================
   TUNEBOT CHATBOT LOGIC 
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("tunebot-chat");
  const input = document.getElementById("tunebot-input");
  const sendBtn = document.getElementById("tunebot-send");
  const chipsEl = document.getElementById("tunebot-chips");

  // Only initialize TuneBot if we are on the tunebot page
  if (!chat || !input || !sendBtn || !chipsEl) return;

  const SONGS = [
    { title: "Blinding Lights", artist: "The Weeknd", moods: ["happy","party","workout"], genres: ["pop","synthwave"], emoji: "🌃", color: "#e11d48" },
    { title: "Levitating", artist: "Dua Lipa", moods: ["happy","party"], genres: ["pop","dance"], emoji: "🪩", color: "#8b5cf6" },
    { title: "Good as Hell", artist: "Lizzo", moods: ["happy","confident"], genres: ["pop","r&b"], emoji: "💅", color: "#f59e0b" },
    { title: "Walking on Sunshine", artist: "Katrina & The Waves", moods: ["happy"], genres: ["pop","rock"], emoji: "☀️", color: "#fbbf24" },
    { title: "Someone Like You", artist: "Adele", moods: ["sad","romantic"], genres: ["pop","ballad"], emoji: "💔", color: "#64748b" },
    { title: "Fix You", artist: "Coldplay", moods: ["sad","hopeful"], genres: ["rock","alternative"], emoji: "🌧️", color: "#3b82f6" },
    { title: "Hurt", artist: "Johnny Cash", moods: ["sad"], genres: ["country","rock"], emoji: "🥀", color: "#78716c" },
    { title: "drivers license", artist: "Olivia Rodrigo", moods: ["sad","nostalgic"], genres: ["pop","ballad"], emoji: "🚗", color: "#a78bfa" },
    { title: "Weightless", artist: "Marconi Union", moods: ["chill","focus","sleep"], genres: ["ambient"], emoji: "🫧", color: "#22d3ee" },
    { title: "Sunset Lover", artist: "Petit Biscuit", moods: ["chill"], genres: ["electronic","chillwave"], emoji: "🌅", color: "#fb923c" },
    { title: "Banana Pancakes", artist: "Jack Johnson", moods: ["chill","happy"], genres: ["acoustic","folk"], emoji: "🥞", color: "#a3e635" },
    { title: "Holocene", artist: "Bon Iver", moods: ["chill","sad","nostalgic"], genres: ["indie","folk"], emoji: "❄️", color: "#93c5fd" },
    { title: "Till I Collapse", artist: "Eminem", moods: ["workout","angry","confident"], genres: ["hip-hop","rap"], emoji: "🏋️", color: "#ef4444" },
    { title: "Stronger", artist: "Kanye West", moods: ["workout","confident"], genres: ["hip-hop","rap"], emoji: "🤖", color: "#f97316" },
    { title: "Eye of the Tiger", artist: "Survivor", moods: ["workout","confident"], genres: ["rock"], emoji: "🐯", color: "#eab308" },
    { title: "Physical", artist: "Dua Lipa", moods: ["workout","party"], genres: ["pop","dance"], emoji: "⚡", color: "#ec4899" },
    { title: "Clair de Lune", artist: "Debussy", moods: ["focus","chill","sleep"], genres: ["classical"], emoji: "🌙", color: "#818cf8" },
    { title: "Time", artist: "Hans Zimmer", moods: ["focus","epic"], genres: ["classical","soundtrack"], emoji: "⏳", color: "#6366f1" },
    { title: "Gymnopédie No.1", artist: "Erik Satie", moods: ["focus","chill"], genres: ["classical"], emoji: "🕊️", color: "#94a3b8" },
    { title: "Strobe", artist: "deadmau5", moods: ["focus","chill"], genres: ["edm","progressive house"], emoji: "🎛️", color: "#10b981" },
    { title: "One More Time", artist: "Daft Punk", moods: ["party","happy"], genres: ["edm","dance"], emoji: "🤘", color: "#f43f5e" },
    { title: "Titanium", artist: "David Guetta ft. Sia", moods: ["party","confident","workout"], genres: ["edm","dance"], emoji: "🛡️", color: "#0ea5e9" },
    { title: "Mr. Brightside", artist: "The Killers", moods: ["party","nostalgic"], genres: ["rock","indie"], emoji: "✨", color: "#d946ef" },
    { title: "Yeah!", artist: "Usher", moods: ["party"], genres: ["r&b","hip-hop"], emoji: "🔥", color: "#dc2626" },
    { title: "Perfect", artist: "Ed Sheeran", moods: ["romantic"], genres: ["pop","ballad"], emoji: "💞", color: "#fb7185" },
    { title: "All of Me", artist: "John Legend", moods: ["romantic"], genres: ["r&b","ballad"], emoji: "🎹", color: "#f472b6" },
    { title: "La Vie en Rose", artist: "Édith Piaf", moods: ["romantic","nostalgic"], genres: ["jazz","chanson"], emoji: "🌹", color: "#e879f9" },
    { title: "Adorn", artist: "Miguel", moods: ["romantic","chill"], genres: ["r&b"], emoji: "💫", color: "#c084fc" },
    { title: "Break Stuff", artist: "Limp Bizkit", moods: ["angry"], genres: ["rock","nu-metal"], emoji: "😤", color: "#b91c1c" },
    { title: "Killing in the Name", artist: "Rage Against the Machine", moods: ["angry","workout"], genres: ["rock","metal"], emoji: "🔊", color: "#991b1b" },
    { title: "Smells Like Teen Spirit", artist: "Nirvana", moods: ["angry","nostalgic"], genres: ["rock","grunge"], emoji: "🎸", color: "#57534e" },
    { title: "Take On Me", artist: "a-ha", moods: ["nostalgic","happy"], genres: ["pop","synthpop"], emoji: "📼", color: "#38bdf8" },
    { title: "September", artist: "Earth, Wind & Fire", moods: ["nostalgic","happy","party"], genres: ["funk","disco"], emoji: "🕺", color: "#fbbf24" },
    { title: "Dreams", artist: "Fleetwood Mac", moods: ["nostalgic","chill"], genres: ["rock","classic rock"], emoji: "🌀", color: "#a5b4fc" },
    { title: "So What", artist: "Miles Davis", moods: ["chill","focus"], genres: ["jazz"], emoji: "🎺", color: "#0d9488" },
    { title: "Take Five", artist: "Dave Brubeck", moods: ["chill","focus"], genres: ["jazz"], emoji: "🎷", color: "#14b8a6" },
    { title: "Feeling Good", artist: "Nina Simone", moods: ["confident","chill"], genres: ["jazz","soul"], emoji: "🖤", color: "#525252" },
    { title: "Dynamite", artist: "BTS", moods: ["happy","party"], genres: ["k-pop","pop"], emoji: "🧨", color: "#facc15" },
    { title: "Kill This Love", artist: "BLACKPINK", moods: ["confident","angry","party"], genres: ["k-pop","pop"], emoji: "💣", color: "#f9a8d4" },
    { title: "Ditto", artist: "NewJeans", moods: ["chill","nostalgic"], genres: ["k-pop","pop"], emoji: "🐰", color: "#bfdbfe" },
    { title: "Jolene", artist: "Dolly Parton", moods: ["sad","nostalgic"], genres: ["country"], emoji: "🤠", color: "#d97706" },
    { title: "Take Me Home, Country Roads", artist: "John Denver", moods: ["happy","nostalgic"], genres: ["country","folk"], emoji: "🛤️", color: "#84cc16" },
    { title: "Redbone", artist: "Childish Gambino", moods: ["chill","romantic"], genres: ["r&b","funk"], emoji: "🦇", color: "#7c2d12" },
    { title: "Nights", artist: "Frank Ocean", moods: ["chill","sad"], genres: ["r&b","alternative"], emoji: "🌊", color: "#0284c7" },
    { title: "HUMBLE.", artist: "Kendrick Lamar", moods: ["confident","workout"], genres: ["hip-hop","rap"], emoji: "👑", color: "#ca8a04" },
    { title: "Sicko Mode", artist: "Travis Scott", moods: ["party","workout"], genres: ["hip-hop","rap"], emoji: "🎢", color: "#7e22ce" },
    { title: "Lo-fi Beats to Study To", artist: "Various Artists", moods: ["focus","chill","sleep"], genres: ["lo-fi"], emoji: "📚", color: "#4b5563" },
    { title: "River Flows in You", artist: "Yiruma", moods: ["sleep","chill","romantic"], genres: ["classical","piano"], emoji: "🎼", color: "#60a5fa" }
  ];

  const MOOD_KEYWORDS = {
    happy: ["happy","joy","upbeat","cheerful","good mood","great","sunny","excited","fun"],
    sad: ["sad","down","depressed","cry","heartbroken","breakup","broke up","blue","lonely","miss"],
    chill: ["chill","relax","calm","laid back","mellow","unwind","cozy","easy"],
    workout: ["workout","gym","run","running","exercise","lift","pump","cardio","training"],
    focus: ["focus","study","studying","work","concentrate","coding","deep work","reading"],
    party: ["party","dance","dancing","club","turn up","celebrate","hype","friday","weekend"],
    romantic: ["romantic","love","date","valentine","crush","wedding","slow dance"],
    angry: ["angry","mad","rage","furious","frustrated","pissed","scream"],
    nostalgic: ["nostalgic","nostalgia","throwback","old school","memories","retro","childhood"],
    confident: ["confident","boss","power","strong","unstoppable","motivated","motivation"],
    sleep: ["sleep","sleepy","bed","night","insomnia","wind down","tired"]
  };
  
  const GENRE_KEYWORDS = {
    "pop": ["pop"], "rock": ["rock","metal","grunge","punk"], "hip-hop": ["hip hop","hip-hop","rap"],
    "jazz": ["jazz"], "classical": ["classical","piano","orchestra"], "edm": ["edm","electronic","house","techno"],
    "r&b": ["r&b","rnb","soul"], "indie": ["indie","alternative"], "country": ["country","folk"],
    "k-pop": ["kpop","k-pop","korean"], "lo-fi": ["lofi","lo-fi"], "funk": ["funk","disco"],
    "ambient": ["ambient"]
  };

  const recentlyRecommended = new Set();

  function detect(text, map) {
    const found = [];
    const lower = text.toLowerCase();
    for (const [key, words] of Object.entries(map)) {
      if (words.some(w => lower.includes(w))) found.push(key);
    }
    return found;
  }

  function detectArtist(text) {
    const lower = text.toLowerCase();
    return SONGS.filter(s => lower.includes(s.artist.toLowerCase()));
  }

  function scoreSongs(moods, genres) {
    return SONGS
      .map(s => {
        let score = 0;
        moods.forEach(m => { if (s.moods.includes(m)) score += 2; });
        genres.forEach(g => { if (s.genres.some(x => x.includes(g) || g.includes(x))) score += 2; });
        if (recentlyRecommended.has(s.title)) score -= 3;
        return { song: s, score };
      })
      .filter(x => x.score > 0)
      .sort((a, b) => b.score - a.score || Math.random() - 0.5);
  }

  function pick(arr, n) {
    const out = arr.slice(0, n).map(x => x.song);
    out.forEach(s => recentlyRecommended.add(s.title));
    if (recentlyRecommended.size > 20) recentlyRecommended.clear();
    return out;
  }

  const GREETINGS = ["hi","hello","hey","yo","sup","hola"];
  const THANKS = ["thank","thanks","thx","appreciate"];

  function respond(text) {
    const lower = text.toLowerCase().trim();

    if (GREETINGS.some(g => lower === g || lower.startsWith(g + " ") || lower.startsWith(g + "!"))) {
      return { reply: "Hey there! 👋 Tell me how you're feeling, what you're doing, or a genre/artist you like — and I'll queue up some tracks for you." };
    }
    if (THANKS.some(t => lower.includes(t))) {
      return { reply: "Anytime! 🎶 Want more recs? Just throw me another mood or genre." };
    }
    if (lower.includes("surprise") || lower.includes("random") || lower.includes("anything")) {
      const shuffled = [...SONGS].sort(() => Math.random() - 0.5);
      return { reply: "Surprise mode activated! 🎲 Here's a grab bag for you:", songs: shuffled.slice(0, 3) };
    }

    const artistMatches = detectArtist(lower);
    const moods = detect(lower, MOOD_KEYWORDS);
    const genres = detect(lower, GENRE_KEYWORDS);

    if (artistMatches.length && !moods.length && !genres.length) {
      const seed = artistMatches[0];
      const similar = scoreSongs(seed.moods, seed.genres).filter(x => x.song.artist !== seed.artist);
      const recs = pick(similar, 3);
      if (recs.length) {
        return { reply: `Nice taste! If you like ${seed.artist}, you might vibe with these:`, songs: recs };
      }
    }

    if (moods.length || genres.length) {
      const recs = pick(scoreSongs(moods, genres), 3);
      if (recs.length) {
        const moodTxt = moods.length ? moods.join(" + ") : null;
        const genreTxt = genres.length ? genres.join(" + ") : null;
        const desc = [moodTxt, genreTxt].filter(Boolean).join(" · ");
        return { reply: `Got it — dialing in something for ${desc}. 🎯 Here's what I've got:`, songs: recs };
      }
    }

    return { reply: "Hmm, I didn't quite catch a vibe from that. 🤔 Try telling me:\n• A mood — \"I'm feeling sad\", \"need workout energy\"\n• A genre — \"some jazz please\", \"play me k-pop\"\n• An artist — \"I like Dua Lipa\"\n• Or just say \"surprise me\"!" };
  }

  const CHIP_SUGGESTIONS = ["I'm feeling happy 😊", "Need focus music", "Gym time 💪", "Something chill", "Surprise me 🎲", "I like The Weeknd"];
  CHIP_SUGGESTIONS.forEach(c => {
    const btn = document.createElement("button");
    btn.className = "tunebot-chip";
    btn.textContent = c;
    btn.onclick = () => { input.value = c; send(); };
    chipsEl.appendChild(btn);
  });

  function addMsg(text, who) {
    const div = document.createElement("div");
    div.className = "tunebot-msg tunebot-" + who;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
  }

  const chatHistory = [];
  const CATALOG = SONGS.map(s => `${s.title} — ${s.artist} [${s.moods.join(",")}] [${s.genres.join(",")}]`).join("\n");
  const SYSTEM_PROMPT = `You are TuneBot, a friendly music recommendation chatbot in a demo website.\nYou can ONLY recommend songs from this catalog (format: Title — Artist [moods] [genres]):\n\n${CATALOG}\n\nRespond with ONLY valid JSON, no markdown fences, in this exact shape:\n{"reply": "your conversational reply", "songs": ["Exact Song Title", "Another Title"]}\n\nRules:\n- "songs": 0 to 3 titles copied EXACTLY from the catalog that best fit the user's mood, activity, genre, or artist taste. Use [] if the user is just chatting or asking a question.\n- If the user mentions an artist not in the catalog, pick the closest matches by vibe and say why.\n- "reply" must be warm and short (under 50 words), at most one emoji, and must NOT list the song titles.`;

  function extractJson(text) {
    try {
      const cleaned = text.replace(/```(json)?/g, "").trim();
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      if (start === -1 || end <= start) return null;
      return JSON.parse(cleaned.slice(start, end + 1));
    } catch { return null; }
  }

  function findSong(title) {
    const t = String(title).toLowerCase().replace(/\s+—.*$/, "").trim();
    return SONGS.find(s => s.title.toLowerCase() === t)
        || SONGS.find(s => t.includes(s.title.toLowerCase()) || s.title.toLowerCase().includes(t));
  }

  async function llmRespond(text) {
    const messages = [
      { role: "system", content: SYSTEM_PROMPT },
      ...chatHistory.slice(-10),
      { role: "user", content: text }
    ];
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 20000);
    try {
      const res = await fetch("[https://text.pollinations.ai/openai](https://text.pollinations.ai/openai)", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model: "openai", messages, temperature: 0.7 }),
        signal: ctrl.signal,
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const content = (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) || "";
      const parsed = extractJson(content);
      if (!parsed || typeof parsed.reply !== "string") throw new Error("unparseable");
      const songs = (Array.isArray(parsed.songs) ? parsed.songs : [])
        .map(findSong).filter(Boolean)
        .filter((s, i, a) => a.indexOf(s) === i)
        .slice(0, 3);
      songs.forEach(s => recentlyRecommended.add(s.title));
      return { reply: parsed.reply, songs };
    } finally {
      clearTimeout(timer);
    }
  }

  function jsonp(url) {
    return new Promise((resolve, reject) => {
      const cb = "cb_" + Math.random().toString(36).slice(2);
      const script = document.createElement("script");
      const timer = setTimeout(() => cleanup(reject), 8000);
      function cleanup(fn) { clearTimeout(timer); delete window[cb]; script.remove(); fn(); }
      window[cb] = data => cleanup(() => resolve(data));
      script.onerror = () => cleanup(reject);
      script.src = url + "&callback=" + cb;
      document.body.appendChild(script);
    });
  }

  const itunesCache = {};
  async function lookupItunes(song) {
    const key = song.title + "|" + song.artist;
    if (itunesCache[key]) return itunesCache[key];
    const q = encodeURIComponent(song.title + " " + song.artist);
    try {
      const data = await jsonp(`https://itunes.apple.com/search?term=${q}&media=music&entity=song&limit=1`);
      const r = data && data.results && data.results[0];
      if (r) itunesCache[key] = r;
      return r || null;
    } catch { return null; }
  }

  const spotifyCache = {};
  async function resolveSpotifyId(song) {
    const key = song.title + "|" + song.artist;
    if (spotifyCache[key]) return spotifyCache[key];
    try { const saved = localStorage.getItem("sp_" + key); if (saved) { spotifyCache[key] = saved; return saved; } } catch {}
    const it = await lookupItunes(song);
    if (!it || !it.trackViewUrl) return null;
    const res = await fetch("[https://api.song.link/v1-alpha.1/links?url=](https://api.song.link/v1-alpha.1/links?url=)" + encodeURIComponent(it.trackViewUrl));
    if (!res.ok) return null;
    const data = await res.json();
    const sp = data.linksByPlatform && data.linksByPlatform.spotify;
    const m = sp && sp.url && sp.url.match(/track\/([A-Za-z0-9]+)/);
    const id = m ? m[1] : null;
    if (id) {
      spotifyCache[key] = id;
      try { localStorage.setItem("sp_" + key, id); } catch {}
    }
    return id;
  }

  let currentEmbed = null;
  let previewAudio = null;

  function showSpotifyEmbed(id, afterEl) {
    if (currentEmbed) currentEmbed.remove();
    if (previewAudio) { previewAudio.pause(); previewAudio = null; }
    const wrap = document.createElement("div");
    wrap.className = "tunebot-embed-wrap";
    wrap.innerHTML = `<iframe src="https://open.spotify.com/embed/track/$${id}?theme=0" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    afterEl.after(wrap);
    chat.scrollTop = chat.scrollHeight;
  }

  function playFallbackPreview(song, it, afterEl) {
    if (currentEmbed) { currentEmbed.remove(); currentEmbed = null; }
    if (previewAudio) { previewAudio.pause(); previewAudio = null; }
    const note = document.createElement("div");
    note.className = "tunebot-fallback-note";
    const searchUrl = "[https://open.spotify.com/search/](https://open.spotify.com/search/)" + encodeURIComponent(song.title + " " + song.artist);
    if (it && it.previewUrl) {
      previewAudio = new Audio(it.previewUrl);
      previewAudio.play().catch(() => {});
      note.innerHTML = `▶ Playing 30s preview · <a href="${searchUrl}" target="_blank">Open in Spotify</a>`;
    } else {
      note.innerHTML = `Couldn't load a preview · <a href="${searchUrl}" target="_blank">Open in Spotify</a>`;
    }
    afterEl.after(note);
    chat.scrollTop = chat.scrollHeight;
  }

  async function playSong(song, card, btn) {
    btn.disabled = true;
    const orig = btn.textContent;
    btn.textContent = "Loading…";
    try {
      const id = await resolveSpotifyId(song);
      if (id) {
        showSpotifyEmbed(id, card);
        btn.textContent = "▶ Spotify";
      } else {
        playFallbackPreview(song, await lookupItunes(song), card);
        btn.textContent = orig;
      }
    } catch {
      playFallbackPreview(song, itunesCache[song.title + "|" + song.artist], card);
      btn.textContent = orig;
    }
    btn.disabled = false;
  }

  function addSongCard(song) {
    const card = document.createElement("div");
    card.className = "tunebot-song-card";
    card.innerHTML = `
      <div class="tunebot-song-art">${song.emoji}</div>
      <div class="tunebot-song-info">
        <div class="title">${song.title}</div>
        <div class="artist">${song.artist}</div>
        <div class="tags">${[...song.moods.slice(0,2), ...song.genres.slice(0,2)].map(t => `<span class="tunebot-tag">${t}</span>`).join("")}</div>
      </div>
      <button class="tunebot-play-btn">▶ Play</button>`;
    const btn = card.querySelector(".tunebot-play-btn");
    btn.onclick = () => playSong(song, card, btn);
    chat.appendChild(card);
    chat.scrollTop = chat.scrollHeight;
    
    lookupItunes(song).then(it => {
      if (it && it.artworkUrl100) {
        const art = card.querySelector(".tunebot-song-art");
        art.innerHTML = `<img src="${it.artworkUrl100}" alt="">`;
        art.style.border = "none";
      }
    });
  }

  function showTyping() {
    const t = document.createElement("div");
    t.className = "tunebot-typing";
    t.id = "tunebot-typing";
    t.innerHTML = "<span></span><span></span><span></span>";
    chat.appendChild(t);
    chat.scrollTop = chat.scrollHeight;
  }
  function hideTyping() {
    const t = document.getElementById("tunebot-typing");
    if (t) t.remove();
  }

  async function send() {
    const text = input.value.trim();
    if (!text) return;
    addMsg(text, "user");
    input.value = "";
    showTyping();
    let result = null;
    try { result = await llmRespond(text); } catch { }
    if (!result) result = respond(text); 
    hideTyping();
    chatHistory.push({ role: "user", content: text });
    chatHistory.push({ role: "assistant", content: JSON.stringify({ reply: result.reply, songs: (result.songs || []).map(s => s.title) }) });
    if (chatHistory.length > 20) chatHistory.splice(0, chatHistory.length - 20);
    addMsg(result.reply, "bot");
    if (result.songs) result.songs.forEach((s, i) => setTimeout(() => addSongCard(s), 150 * (i + 1)));
  }

  sendBtn.onclick = send;
  input.addEventListener("keydown", e => { if (e.key === "Enter") send(); });

  setTimeout(() => {
    addMsg("Hey, I'm TuneBot! 🎧 Tell me your mood, a genre, or an artist you like, and I'll recommend some tracks. Try the suggestions below to get started!", "bot");
  }, 300);

});

/* =========================================
   ABOUT ME REVEAL LOGIC (INDEX PAGE)
   ========================================= */
document.addEventListener("DOMContentLoaded", () => {
    const revealBtn = document.getElementById('reveal-about');
    const aboutOverlay = document.getElementById('about-overlay');
    const mainInfo = document.getElementById('main-info');
    const arrowIcon = document.getElementById('arrow-icon');

    if (revealBtn && aboutOverlay && mainInfo && arrowIcon) {
        revealBtn.addEventListener('click', () => {
            const isActive = aboutOverlay.classList.contains('active');
            
            if (!isActive) {
                // Open About Section
                aboutOverlay.classList.add('active');
                mainInfo.style.opacity = '0';
                
                // Flip arrow and stop bounce
                arrowIcon.style.transform = 'rotate(180deg)';
                arrowIcon.style.animation = 'none';
            } else {
                // Close About Section
                aboutOverlay.classList.remove('active');
                mainInfo.style.opacity = '1';
                
                // Restore arrow and bounce
                arrowIcon.style.transform = 'rotate(0deg)';
                arrowIcon.style.animation = 'bounce 2s infinite';
            }
        });
    }
});
