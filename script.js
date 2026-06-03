// ═══════════════════════════════════════════════════
// NOTEFLOW — COMPLETE JAVASCRIPT
// Syllabus: External JS, Arrow functions,
// Event listeners, Event.target, Hover effects,
// Web APIs, JS display possibilities,
// Interactive & responsive design
// ═══════════════════════════════════════════════════

"use strict";

// ─────────────────────────────────────────
// STORAGE — Web API (localStorage)
// Syllabus: Web APIs
// ─────────────────────────────────────────
let notes = JSON.parse(localStorage.getItem("nf_notes")) || [];

// ─────────────────────────────────────────
// GLOBAL STATE
// ─────────────────────────────────────────
let editingId     = null;
let viewingId     = null;
let currentFilter = "All";
let currentSearch = "";
let currentSort   = "newest";
let isListView    = false;
let aiSuggestion  = "";
let lightboxIndex = 0;

// ─────────────────────────────────────────
// SAVE TO STORAGE
// ─────────────────────────────────────────
const saveToStorage = () => {
  localStorage.setItem("nf_notes", JSON.stringify(notes));
};

// ─────────────────────────────────────────
// LANDING PAGE — TYPING ANIMATION
// Syllabus: JS animations
// ─────────────────────────────────────────
const typingWords = ["brilliant idea.", "next big thing.", "study notes.", "work plans.", "creative spark."];
let typingWordIdx = 0;
let typingCharIdx = 0;
let typingDeleting = false;

const runTyping = () => {
  const el = document.getElementById("typingText");
  if (!el) return;

  const word = typingWords[typingWordIdx];

  if (!typingDeleting) {
    typingCharIdx++;
    el.textContent = word.slice(0, typingCharIdx);
    if (typingCharIdx === word.length) {
      typingDeleting = true;
      setTimeout(runTyping, 1800);
      return;
    }
  } else {
    typingCharIdx--;
    el.textContent = word.slice(0, typingCharIdx);
    if (typingCharIdx === 0) {
      typingDeleting = false;
      typingWordIdx = (typingWordIdx + 1) % typingWords.length;
    }
  }
  setTimeout(runTyping, typingDeleting ? 60 : 90);
};

// ─────────────────────────────────────────
// NAVIGATION — goToApp
// ─────────────────────────────────────────
const goToApp = () => {
  window.location.href = "app.html";
};

const scrollToFeatures = () => {
  document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
};

// ─────────────────────────────────────────
// HAMBURGER MENU TOGGLE
// Syllabus: toggle buttons + event listeners
// ─────────────────────────────────────────
const initHamburger = () => {
  const btn   = document.getElementById("hamburgerBtn");
  const links = document.getElementById("navLinks");
  if (!btn) return;

  // Syllabus: event listener
  btn.addEventListener("click", (e) => {
    // Syllabus: event.target
    e.target.closest("button").classList.toggle("open");
    links?.classList.toggle("open");
  });
};

// ─────────────────────────────────────────
// NAVBAR SCROLL EFFECT
// Syllabus: event listener
// ─────────────────────────────────────────
const initNavScroll = () => {
  const nav = document.getElementById("mainNav");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", () => {
    nav?.classList.toggle("scrolled", window.scrollY > 40);
    scrollTopBtn?.classList.toggle("visible", window.scrollY > 300);
  });
};

// ─────────────────────────────────────────
// HOVER EFFECTS USING JS
// Syllabus: hover effect using JS + event.target
// ─────────────────────────────────────────
const initHoverEffects = () => {

  // Feature cards hover — change content via JS
  document.querySelectorAll("[data-hover='true']").forEach(card => {

    // Syllabus: event listener + event.target
    card.addEventListener("mouseenter", (e) => {
      const target = e.currentTarget;
      target.style.background = "rgba(124,106,247,0.08)";
    });

    card.addEventListener("mouseleave", (e) => {
      e.currentTarget.style.background = "";
    });
  });

  // Nav links underline effect via JS
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("mouseenter", (e) => {
      e.target.style.letterSpacing = "0.2px";
    });
    link.addEventListener("mouseleave", (e) => {
      e.target.style.letterSpacing = "";
    });
  });
};

// ─────────────────────────────────────────
// CLOCK — Web API (Date)
// Syllabus: Web APIs
// ─────────────────────────────────────────
const initClock = () => {
  const el = document.getElementById("clockDisplay");
  if (!el) return;

  const tick = () => {
    // Syllabus: Web API — Date/Time
    const now = new Date();
    const h = String(now.getHours()).padStart(2, "0");
    const m = String(now.getMinutes()).padStart(2, "0");
    el.textContent = `${h}:${m}`;
  };

  tick();
  setInterval(tick, 1000);
};

// ─────────────────────────────────────────
// WEATHER — Web API (Open-Meteo, free, no key)
// Syllabus: Web APIs
// ─────────────────────────────────────────
const initWeather = async () => {
  const iconEl  = document.getElementById("weatherIcon");
  const labelEl = document.getElementById("weatherLabel");
  if (!iconEl) return;

  try {
    // Syllabus: Web API — Geolocation
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords;
        const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
        const res  = await fetch(url);
        const data = await res.json();
        const temp = Math.round(data.current_weather.temperature);
        const code = data.current_weather.weathercode;

        const weatherEmoji = code <= 1 ? "☀️" : code <= 3 ? "⛅" : code <= 67 ? "🌧️" : "❄️";
        iconEl.textContent  = `${temp}°C`;
        labelEl.textContent = weatherEmoji + " Weather";
      },
      () => {
        iconEl.textContent  = "—";
        labelEl.textContent = "Weather";
      }
    );
  } catch {
    iconEl.textContent = "—";
  }
};

// ─────────────────────────────────────────
// GALLERY FILTER
// Syllabus: filtering + event.target
// ─────────────────────────────────────────
const initGallery = () => {
  const btns  = document.querySelectorAll(".gal-btn");
  const items = document.querySelectorAll(".gallery-item");
  if (!btns.length) return;

  // Syllabus: event listener + arrow function
  btns.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const filter = e.target.dataset.filter; // Syllabus: event.target

      btns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      items.forEach(item => {
        const match = filter === "all" || item.dataset.category === filter;
        item.classList.toggle("hidden", !match);
      });
    });
  });
};

// ─────────────────────────────────────────
// LIGHTBOX — Interactive Image Gallery
// Syllabus: image gallery + interactive design
// ─────────────────────────────────────────
const getVisibleItems = () =>
  [...document.querySelectorAll(".gallery-item:not(.hidden)")];

const openLightbox = (el) => {
  const items   = getVisibleItems();
  lightboxIndex = items.indexOf(el);

  const overlay = document.getElementById("lightbox");
  const content = document.getElementById("lightboxContent");
  if (!overlay || !content) return;

  const placeholder = el.querySelector(".gal-placeholder");
  if (placeholder) {
    content.innerHTML = `<div style="aspect-ratio:16/10;${placeholder.style.cssText || "background:" + placeholder.style.background};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;border-radius:18px;">
      <span style="font-size:60px">${placeholder.querySelector("span")?.textContent || "📸"}</span>
      <p style="font-size:18px;font-weight:600;color:rgba(255,255,255,0.9)">${placeholder.querySelector("p")?.textContent || ""}</p>
    </div>`;
  }

  overlay.classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeLightbox = () => {
  document.getElementById("lightbox")?.classList.remove("active");
  document.body.style.overflow = "";
};

const lightboxNav = (dir, e) => {
  e.stopPropagation();
  const items = getVisibleItems();
  lightboxIndex = (lightboxIndex + dir + items.length) % items.length;
  openLightbox(items[lightboxIndex]);
};

// ─────────────────────────────────────────
// MODAL
// ─────────────────────────────────────────
const openCreateModal = () => {
  editingId = null;
  document.getElementById("modalTitle").textContent = "New Note";
  document.getElementById("noteTitle").value        = "";
  document.getElementById("noteContent").value      = "";
  document.getElementById("noteCategory").value     = "General";
  document.getElementById("notePriority").value     = "normal";

  clearValidation();
  hideAiBox();

  document.getElementById("noteModal").classList.add("active");
  document.body.style.overflow = "hidden";

  setTimeout(() => document.getElementById("noteTitle")?.focus(), 150);
};

const openEdit = (id) => {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  editingId = id;
  document.getElementById("modalTitle").textContent = "Edit Note";
  document.getElementById("noteTitle").value        = note.title;
  document.getElementById("noteContent").value      = note.content;
  document.getElementById("noteCategory").value     = note.category;
  document.getElementById("notePriority").value     = note.priority || "normal";

  clearValidation();
  hideAiBox();

  document.getElementById("noteModal").classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeModal = () => {
  document.getElementById("noteModal").classList.remove("active");
  document.body.style.overflow = "";
};

const closeModalOutside = (e) => {
  if (e.target === document.getElementById("noteModal")) closeModal();
};

// ─────────────────────────────────────────
// VIEW MODAL
// ─────────────────────────────────────────
const openViewModal = (id) => {
  const note = notes.find(n => n.id === id);
  if (!note) return;

  viewingId = id;

  document.getElementById("viewModalTitle").textContent = note.title;
  document.getElementById("viewModalBody").innerHTML = `
    <div style="margin-bottom:16px;">
      <span class="note-cat-tag">${escapeHTML(note.category)}</span>
      ${note.priority !== "normal" ? `<span class="note-cat-tag" style="margin-left:8px">${priorityLabel(note.priority)}</span>` : ""}
    </div>
    <p style="color:var(--text2);line-height:1.7;white-space:pre-wrap;">${escapeHTML(note.content || "No content.")}</p>
    <p style="color:var(--text3);font-size:12px;margin-top:20px;">🕒 ${note.updatedAt ? "Updated: " + note.updatedAt : note.createdAt}</p>
  `;

  document.getElementById("viewModal").classList.add("active");
  document.body.style.overflow = "hidden";
};

const closeViewModal = () => {
  document.getElementById("viewModal").classList.remove("active");
  document.body.style.overflow = "";
};

const closeViewModalOutside = (e) => {
  if (e.target === document.getElementById("viewModal")) closeViewModal();
};

const editFromView = () => {
  closeViewModal();
  if (viewingId) openEdit(viewingId);
};

const priorityLabel = (p) => {
  return { high: "🔴 High", medium: "🟡 Medium", low: "🟢 Low" }[p] || p;
};

// ─────────────────────────────────────────
// INPUT VALIDATION (Syllabus: input validations)
// ─────────────────────────────────────────
const validateForm = () => {
  let valid = true;
  const title   = document.getElementById("noteTitle");
  const content = document.getElementById("noteContent");
  const tErr    = document.getElementById("titleError");
  const cErr    = document.getElementById("contentError");

  // Reset
  clearValidation();

  if (!title.value.trim()) {
    title.classList.add("invalid");
    tErr.textContent = "⚠️ Title is required";
    valid = false;
  } else if (title.value.trim().length < 2) {
    title.classList.add("invalid");
    tErr.textContent = "⚠️ Title must be at least 2 characters";
    valid = false;
  } else {
    title.classList.add("valid");
  }

  if (!content.value.trim()) {
    content.classList.add("invalid");
    cErr.textContent = "⚠️ Content is required";
    valid = false;
  } else if (content.value.trim().length < 5) {
    content.classList.add("invalid");
    cErr.textContent = "⚠️ Content is too short";
    valid = false;
  } else {
    content.classList.add("valid");
  }

  return valid;
};

const clearValidation = () => {
  ["noteTitle", "noteContent"].forEach(id => {
    const el = document.getElementById(id);
    if (el) { el.classList.remove("invalid", "valid"); }
  });
  const tErr = document.getElementById("titleError");
  const cErr = document.getElementById("contentError");
  if (tErr) tErr.textContent = "";
  if (cErr) cErr.textContent = "";
};

// Live char counter (Syllabus: event listener)
const initCharCounter = () => {
  const titleInput = document.getElementById("noteTitle");
  const counter    = document.getElementById("titleCharCount");
  if (!titleInput || !counter) return;

  // Syllabus: event listener
  titleInput.addEventListener("input", (e) => {
    const len = e.target.value.length; // Syllabus: event.target
    counter.textContent = `${len} / 80`;
    counter.style.color = len > 70 ? "var(--red)" : "var(--text3)";
  });
};

// ─────────────────────────────────────────
// SAVE NOTE
// ─────────────────────────────────────────
const saveNote = () => {
  if (!validateForm()) return;

  const title    = document.getElementById("noteTitle").value.trim();
  const content  = document.getElementById("noteContent").value.trim();
  const category = document.getElementById("noteCategory").value;
  const priority = document.getElementById("notePriority").value;
  const date     = new Date().toLocaleString();

  if (editingId) {
    const note = notes.find(n => n.id === editingId);
    if (note) {
      note.title     = title;
      note.content   = content;
      note.category  = category;
      note.priority  = priority;
      note.updatedAt = date;
    }
    showToast("✅ Note Updated");
  } else {
    notes.unshift({
      id: Date.now(),
      title,
      content,
      category,
      priority,
      createdAt: date,
      updatedAt: null
    });
    showToast("✨ Note Created");
  }

  saveToStorage();
  renderNotes();
  updateStats();
  closeModal();
};

// ─────────────────────────────────────────
// DELETE NOTE
// ─────────────────────────────────────────
const deleteNote = (id, e) => {
  e.stopPropagation();
  if (!confirm("Delete this note?")) return;
  notes = notes.filter(n => n.id !== id);
  saveToStorage();
  renderNotes();
  updateStats();
  showToast("🗑️ Note Deleted");
};

// ─────────────────────────────────────────
// SEARCH (Syllabus: searching)
// ─────────────────────────────────────────
const searchNotes = () => {
  currentSearch = document.getElementById("searchInput").value.toLowerCase();
  renderNotes();
};

// ─────────────────────────────────────────
// FILTER (Syllabus: filtering)
// ─────────────────────────────────────────
const filterNotes = () => {
  currentFilter = document.getElementById("filterCategory").value;
  updateActivePills();
  renderNotes();
};

const setFilter = (value, el) => {
  currentFilter = value;
  const sel = document.getElementById("filterCategory");
  if (sel) sel.value = value;

  // Syllabus: event.target style
  document.querySelectorAll(".cat-pill").forEach(btn => btn.classList.remove("active"));
  el.classList.add("active");

  renderNotes();
};

const updateActivePills = () => {
  document.querySelectorAll(".cat-pill").forEach(btn => {
    btn.classList.remove("active");
    const t = btn.textContent.trim();
    if (t.includes(currentFilter) || (currentFilter === "All" && t === "All")) {
      btn.classList.add("active");
    }
  });
};

// ─────────────────────────────────────────
// SORT (Syllabus: sorting)
// ─────────────────────────────────────────
const sortNotes = () => {
  currentSort = document.getElementById("sortOrder").value;
  const info  = document.getElementById("sortInfo");
  if (info) info.textContent = `sorted: ${currentSort}`;
  renderNotes();
};

const applySorting = (arr) => {
  return [...arr].sort((a, b) => {
    if (currentSort === "newest") return b.id - a.id;
    if (currentSort === "oldest") return a.id - b.id;
    if (currentSort === "az")     return a.title.localeCompare(b.title);
    if (currentSort === "za")     return b.title.localeCompare(a.title);
    return 0;
  });
};

// ─────────────────────────────────────────
// TOGGLE VIEW (grid / list)
// Syllabus: toggle buttons
// ─────────────────────────────────────────
const toggleView = () => {
  isListView = !isListView;
  const grid = document.getElementById("notesList");
  const btn  = document.getElementById("viewToggleBtn");
  if (!grid) return;
  grid.classList.toggle("list-view", isListView);
  if (btn) btn.textContent = isListView ? "☰" : "⊞";
  showToast(isListView ? "📋 List View" : "⊞ Grid View");
};

// ─────────────────────────────────────────
// EXPORT NOTES — Web API (Blob/URL)
// Syllabus: Web APIs + JS display
// ─────────────────────────────────────────
const exportNotes = () => {
  const data = JSON.stringify(notes, null, 2);
  // Syllabus: Web API — Blob + URL
  const blob = new Blob([data], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = "noteflow-notes.json";
  a.click();
  URL.revokeObjectURL(url);
  showToast("📤 Notes Exported");
};

// ─────────────────────────────────────────
// AI ENHANCE — Anthropic API (Web API)
// Syllabus: Web APIs
// ─────────────────────────────────────────
const aiEnhanceNote = async () => {
  const content = document.getElementById("noteContent").value.trim();
  const title   = document.getElementById("noteTitle").value.trim();
  const btn     = document.getElementById("aiBtn");

  if (!content && !title) {
    showToast("⚠️ Write something first");
    return;
  }

  // Loading state
  btn.disabled   = true;
  btn.innerHTML  = `<span class="ai-loading"></span> Thinking...`;

  hideAiBox();

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        messages: [{
          role: "user",
          content: `You are a helpful note assistant. Improve and expand this note. Return ONLY the improved note text, nothing else.

Title: ${title || "(no title)"}
Content: ${content || "(no content)"}

Write a clear, well-structured improved version:`
        }]
      })
    });

    const data   = await response.json();
    aiSuggestion = data.content?.[0]?.text || "";

    if (aiSuggestion) {
      showAiBox(aiSuggestion);
      showToast("🤖 AI suggestion ready!");
    } else {
      showToast("⚠️ AI couldn't generate a suggestion");
    }

  } catch (err) {
    showToast("⚠️ AI unavailable. Check connection.");
  } finally {
    btn.disabled  = false;
    btn.innerHTML = "🤖 AI Enhance";
  }
};

const showAiBox = (text) => {
  const box     = document.getElementById("aiResponseBox");
  const textEl  = document.getElementById("aiResponseText");
  if (!box || !textEl) return;
  textEl.textContent = text;
  box.style.display  = "block";
};

const hideAiBox = () => {
  const box = document.getElementById("aiResponseBox");
  if (box) box.style.display = "none";
  aiSuggestion = "";
};

const acceptAiSuggestion = () => {
  if (!aiSuggestion) return;
  document.getElementById("noteContent").value = aiSuggestion;
  document.getElementById("noteContent").classList.add("valid");
  hideAiBox();
  showToast("✅ AI suggestion applied!");
};

const rejectAiSuggestion = () => {
  hideAiBox();
  showToast("✖ Suggestion discarded");
};

// ─────────────────────────────────────────
// TOAST (Syllabus: JS display possibilities)
// ─────────────────────────────────────────
let toastTimer;

const showToast = (message) => {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2400);
};

// ─────────────────────────────────────────
// WORD COUNT
// Syllabus: arrow functions
// ─────────────────────────────────────────
const wordCount = (text) => {
  if (!text.trim()) return 0;
  return text.trim().split(/\s+/).length;
};

// ─────────────────────────────────────────
// ESCAPE HTML
// ─────────────────────────────────────────
const escapeHTML = (str) =>
  str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");

// ─────────────────────────────────────────
// BUILD NOTE CARD (Syllabus: JS display)
// ─────────────────────────────────────────
const buildCard = (note) => {
  const words    = wordCount(note.content);
  const date     = note.updatedAt ? `Updated: ${note.updatedAt}` : note.createdAt;
  const prioClass= note.priority && note.priority !== "normal" ? `priority-${note.priority}` : "";
  const preview  = note.content
    ? escapeHTML(note.content).substring(0, 160) + (note.content.length > 160 ? "…" : "")
    : "<em style='color:var(--text3)'>No content</em>";

  return `
  <div class="note-card ${prioClass}"
       onclick="openViewModal(${note.id})"
       data-id="${note.id}">

    <div class="card-top">
      <span class="note-cat-tag">${escapeHTML(note.category)}</span>
      <div class="card-actions" onclick="event.stopPropagation()">
        <button class="card-btn edit" onclick="openEdit(${note.id})" title="Edit">✏️</button>
        <button class="card-btn del"  onclick="deleteNote(${note.id}, event)" title="Delete">✖</button>
      </div>
    </div>

    <div class="note-title">${escapeHTML(note.title)}</div>
    <div class="note-content">${preview}</div>

    <div class="card-footer">
      <span class="note-date">🕒 ${date}</span>
      <span class="note-words">${words}w</span>
    </div>
  </div>`;
};

// ─────────────────────────────────────────
// RENDER NOTES (Syllabus: JS display)
// ─────────────────────────────────────────
const renderNotes = () => {
  let filtered = [...notes];

  // Filter by category
  if (currentFilter !== "All") {
    filtered = filtered.filter(n => n.category === currentFilter);
  }

  // Search
  if (currentSearch) {
    filtered = filtered.filter(n =>
      n.title.toLowerCase().includes(currentSearch)   ||
      n.content.toLowerCase().includes(currentSearch) ||
      n.category.toLowerCase().includes(currentSearch)
    );
  }

  // Sort
  filtered = applySorting(filtered);

  const notesList  = document.getElementById("notesList");
  const emptyState = document.getElementById("emptyState");
  const noteCount  = document.getElementById("noteCount");

  if (!notesList) return;

  if (noteCount) noteCount.textContent = filtered.length;

  if (filtered.length === 0) {
    notesList.innerHTML = "";
    if (emptyState) emptyState.style.display = "block";
    return;
  }

  if (emptyState) emptyState.style.display = "none";

  notesList.innerHTML = filtered.map(buildCard).join("");

  // Apply list view if active
  if (isListView) notesList.classList.add("list-view");

  // Syllabus: hover effect using JS — event listeners on cards
  initCardHoverEffects();
};

// ─────────────────────────────────────────
// CARD HOVER EFFECTS (Syllabus: hover using JS)
// ─────────────────────────────────────────
const initCardHoverEffects = () => {
  document.querySelectorAll(".note-card").forEach(card => {

    // Syllabus: event listener + event.target
    card.addEventListener("mouseenter", (e) => {
      const c = e.currentTarget;
      c.style.boxShadow = "0 12px 40px rgba(124,106,247,0.2)";
    });

    card.addEventListener("mouseleave", (e) => {
      e.currentTarget.style.boxShadow = "";
    });

    // Mouse move for parallax tilt (Syllabus: interactive hover)
    card.addEventListener("mousemove", (e) => {
      const rect   = e.currentTarget.getBoundingClientRect();
      const x      = ((e.clientX - rect.left) / rect.width  - 0.5) * 8;
      const y      = ((e.clientY - rect.top)  / rect.height - 0.5) * -8;
      e.currentTarget.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    });

    card.addEventListener("mouseleave", (e) => {
      e.currentTarget.style.transform = "";
    });
  });
};

// ─────────────────────────────────────────
// UPDATE STATS
// ─────────────────────────────────────────
const updateStats = () => {
  const totalNotesEl = document.getElementById("totalNotes");
  const totalCatsEl  = document.getElementById("totalCats");

  if (totalNotesEl) totalNotesEl.textContent = notes.length;

  if (totalCatsEl) {
    const cats = new Set(notes.map(n => n.category));
    totalCatsEl.textContent = cats.size;
  }
};

// ─────────────────────────────────────────
// KEYBOARD SHORTCUTS
// Syllabus: event listeners
// ─────────────────────────────────────────
document.addEventListener("keydown", (e) => {
  // ESC — close modals
  if (e.key === "Escape") {
    closeModal();
    closeViewModal();
    closeLightbox();
  }

  // Ctrl + Enter — save note
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const modal = document.getElementById("noteModal");
    if (modal?.classList.contains("active")) saveNote();
  }

  // Ctrl + K — new note
  if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
    e.preventDefault();
    if (document.getElementById("noteModal")) openCreateModal();
  }

  // Arrow keys in lightbox
  if (document.getElementById("lightbox")?.classList.contains("active")) {
    if (e.key === "ArrowLeft")  lightboxNav(-1, { stopPropagation: () => {} });
    if (e.key === "ArrowRight") lightboxNav(1,  { stopPropagation: () => {} });
  }
});

// ─────────────────────────────────────────
// INTERSECTION OBSERVER — scroll animations
// Syllabus: animations + Web API
// ─────────────────────────────────────────
const initScrollAnimations = () => {
  if (!("IntersectionObserver" in window)) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity  = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll(".feat-card, .gallery-item, .stat, .stack-card").forEach(el => {
    el.style.opacity   = "0";
    el.style.transform = "translateY(20px)";
    el.style.transition = "opacity 0.5s ease, transform 0.5s ease";
    observer.observe(el);
  });
};

// ─────────────────────────────────────────
// INIT — runs on DOMContentLoaded
// ─────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {

  // Detect which page we're on
  const isApp     = document.body.classList.contains("app-page");
  const isLanding = document.body.classList.contains("landing-page");

  // Common
  initHamburger();
  initNavScroll();
  initHoverEffects();
  initScrollAnimations();

  if (isLanding) {
    // Landing page features
    runTyping();
    initGallery();
  }

  if (isApp) {
    // App page features
    renderNotes();
    updateStats();
    initClock();
    initWeather();
    initCharCounter();
  }
});
const defineWord = async () => {
  try {
    // 1. Get selected word OR fallback to title/content
    let word = "";

    const selection = window.getSelection().toString().trim();

    if (selection) {
      word = selection;
    } else {
      const title = document.getElementById("noteTitle")?.value.trim();
      const content = document.getElementById("noteContent")?.value.trim();

      word = title || content?.split(" ")[0]; // first word fallback
    }

    if (!word) {
      showToast("⚠️ Please select or write a word");
      return;
    }

    showToast(`📖 Searching: ${word}`);

    // 2. API CALL
    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
    );

    if (!res.ok) {
      showToast("❌ Word not found");
      return;
    }

    const data = await res.json();

    // 3. Extract data safely
    const meaning =
      data?.[0]?.meanings?.[0]?.definitions?.[0]?.definition || "No meaning found";

    const example =
      data?.[0]?.meanings?.[0]?.definitions?.[0]?.example || "No example available";

    const phonetic =
      data?.[0]?.phonetic || data?.[0]?.phonetics?.[0]?.text || "";

    // 4. Create popup box dynamically
    let box = document.getElementById("dictPopup");

    if (!box) {
      box = document.createElement("div");
      box.id = "dictPopup";
      box.style.position = "fixed";
      box.style.top = "50%";
      box.style.left = "50%";
      box.style.transform = "translate(-50%, -50%)";
      box.style.background = "#111";
      box.style.color = "#fff";
      box.style.padding = "20px";
      box.style.borderRadius = "15px";
      box.style.width = "300px";
      box.style.zIndex = "9999";
      box.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
      box.style.fontFamily = "Arial";

      document.body.appendChild(box);
    }

    // 5. Fill content
    box.innerHTML = `
      <h2>📖 ${word}</h2>
      
      <p><b>📌 Meaning:</b><br>${meaning}</p>
      <p><b>🧾 Example:</b><br>${example}</p>
      <button onclick="document.getElementById('dictPopup').remove()" 
        style="margin-top:10px;padding:8px 12px;border:none;background:red;color:white;border-radius:8px;cursor:pointer;">
        Close
      </button>
    `;

  } catch (error) {
    console.error(error);
    showToast("⚠️ Error fetching meaning");
  }
};