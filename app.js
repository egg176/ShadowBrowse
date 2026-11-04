const $ = id => document.getElementById(id);
const form = $("addressForm"), input = $("addressInput"), frame = $("browserFrame");
const welcome = $("welcome"), loading = $("loading"), blocked = $("blockedNotice");
const externalLink = $("externalLink"), tabStrip = $("tabStrip");
const dialog = $("settingsDialog");

let tabs = [];
let activeId = 0;
let nextId = 1;
let loadTimer;
let bookmarks = [];
try { bookmarks = JSON.parse(localStorage.getItem("shadowbrowse-bookmarks") || "[]"); } catch {}

function newTab() {
  const tab = { id: nextId++, url: "", title: "New tab" };
  tabs.push(tab);
  activeId = tab.id;
  renderTabs();
  showTab();
}
function activeTab() { return tabs.find(tab => tab.id === activeId); }
function renderTabs() {
  tabStrip.querySelectorAll(".tab").forEach(el => el.remove());
  const plus = $("newTabButton");
  tabs.forEach(tab => {
    const el = document.createElement("button");
    el.className = "tab" + (tab.id === activeId ? " active" : "");
    el.type = "button";
    el.innerHTML = `<span class="tab-icon">◈</span><span class="tab-name"></span><span class="tab-x" title="Close tab">×</span>`;
    el.querySelector(".tab-name").textContent = tab.title;
    el.addEventListener("click", event => {
      if (event.target.classList.contains("tab-x")) closeTab(tab.id);
      else { activeId = tab.id; renderTabs(); showTab(); }
    });
    tabStrip.insertBefore(el, plus);
  });
}
function closeTab(id) {
  const index = tabs.findIndex(t => t.id === id);
  if (index < 0) return;
  tabs.splice(index, 1);
  if (!tabs.length) { newTab(); return; }
  if (activeId === id) activeId = tabs[Math.max(0, index - 1)].id;
  renderTabs(); showTab();
}
function showTab() {
  clearTimeout(loadTimer);
  const tab = activeTab();
  if (!tab) return;
  input.value = tab.url;
  $("tabTitle");
  externalLink.href = tab.url || "#";
  frame.hidden = true; loading.hidden = true; blocked.hidden = true;
  if (!tab.url) { welcome.hidden = false; frame.src = "about:blank"; return; }
  welcome.hidden = true;
  loading.hidden = false;
  frame.src = tab.url;
  loadTimer = setTimeout(() => {
    if (!loading.hidden) { loading.hidden = true; blocked.hidden = false; }
  }, 9000);
  updateBookmarkButton();
}
function normalizeInput(value) {
  const text = value.trim();
  if (!text) return "";
  if (!text.includes(".") && !/^https?:\/\//i.test(text))
    return "https://www.google.com/search?q=" + encodeURIComponent(text);
  return /^https?:\/\//i.test(text) ? text : "https://" + text;
}
function openAddress(value) {
  const url = normalizeInput(value);
  if (!url) return;
  let parsed;
  try { parsed = new URL(url); } catch { alert("That address doesn't look valid. Try https://example.com."); return; }
  if (!["http:", "https:"].includes(parsed.protocol)) { alert("Only regular HTTP and HTTPS websites are supported."); return; }
  const tab = activeTab();
  tab.url = parsed.href; tab.title = parsed.hostname;
  renderTabs(); showTab();
}
function renderBookmarks() {
  const list = $("bookmarkList");
  list.replaceChildren();
  bookmarks.forEach(item => {
    const button = document.createElement("button");
    button.className = "bookmark-chip"; button.type = "button"; button.textContent = item.title;
    button.title = item.url;
    button.addEventListener("click", () => openAddress(item.url));
    list.appendChild(button);
  });
}
function updateBookmarkButton() {
  const tab = activeTab();
  const saved = tab && bookmarks.some(b => b.url === tab.url);
  $("bookmarkButton").classList.toggle("saved", !!saved);
  $("bookmarkButton").textContent = saved ? "★" : "☆";
}
form.addEventListener("submit", event => { event.preventDefault(); openAddress(input.value); });
document.querySelectorAll(".quick-link").forEach(button => button.addEventListener("click", () => openAddress(button.dataset.url)));
frame.addEventListener("load", () => {
  if (!activeTab()?.url) return;
  clearTimeout(loadTimer); loading.hidden = true; frame.hidden = false; blocked.hidden = true;
});
$("newTabButton").addEventListener("click", newTab);
$("backButton").addEventListener("click", () => { const tab = activeTab(); if (tab) { tab.url = ""; tab.title = "New tab"; renderTabs(); showTab(); } });
$("reloadButton").addEventListener("click", () => { if (activeTab()?.url) showTab(); });
$("brandHome").addEventListener("click", event => { event.preventDefault(); $("backButton").click(); });
$("bookmarkButton").addEventListener("click", () => {
  const tab = activeTab();
  if (!tab?.url) return;
  const index = bookmarks.findIndex(b => b.url === tab.url);
  if (index >= 0) bookmarks.splice(index, 1);
  else bookmarks.push({ url: tab.url, title: tab.title });
  localStorage.setItem("shadowbrowse-bookmarks", JSON.stringify(bookmarks));
  renderBookmarks(); updateBookmarkButton();
});
function toggleTheme() { document.body.classList.toggle("light"); localStorage.setItem("shadowbrowse-theme", document.body.classList.contains("light") ? "light" : "dark"); }
$("themeButton").addEventListener("click", toggleTheme);
$("dialogThemeButton").addEventListener("click", toggleTheme);
$("settingsButton").addEventListener("click", () => dialog.showModal());
$("clearBookmarksButton").addEventListener("click", () => {
  bookmarks = []; localStorage.removeItem("shadowbrowse-bookmarks"); renderBookmarks(); updateBookmarkButton();
});
if (localStorage.getItem("shadowbrowse-theme") === "light") document.body.classList.add("light");
renderBookmarks(); newTab();
