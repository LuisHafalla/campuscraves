/* File: assets/js/app.js */
/* ===== CampusCraves Mini Database (localStorage) ===== */

window.get = function (key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

window.set = function (key, value) {
  localStorage.setItem(key, JSON.stringify(value));
};

(function seed() {
  if (!get("users", null)) {
    set("users", [
      {
        email: "student@uni.edu",
        password: "1234",
        role: "student",
        name: "Juan Dela Cruz",
        verified: true,
        status: "Undergraduate",
        allergies: ["Milk/Dairy"],
        loyaltyPoints: 120
      },
      {
        email: "seller@uni.edu",
        password: "1234",
        role: "seller",
        name: "Student Entrepreneur",
        storeName: "CampusCraves Store",
        storeOpen: true
      },
      {
        email: "admin@uni.edu",
        password: "1234",
        role: "admin",
        name: "System Admin"
      }
    ]);
  }

  if (!get("cart", null)) set("cart", []);
  if (!get("orders", null)) set("orders", []);
  if (!get("products", null)) {
    set("products", [
      { id: "p1", sellerEmail: "seller@uni.edu", name: "Sisig Plate", price: 120, active: true },
      { id: "p2", sellerEmail: "seller@uni.edu", name: "Grilled Chicken", price: 140, active: true },
      { id: "p3", sellerEmail: "seller@uni.edu", name: "Lumpia", price: 80, active: false }
    ]);
  }
  if (!get("reports", null)) {
    set("reports", [
      { id: "r1", title: "Report 1", status: "open", note: "Late delivery complaint." },
      { id: "r2", title: "Report 2", status: "open", note: "Wrong item received." },
      { id: "r3", title: "Report 3", status: "escalated", note: "Multiple repeated complaints." }
    ]);
  }
  if (!get("verifications", null)) {
    set("verifications", [
      { id: "v1", name: "John Pork", status: "Undergraduate", state: "pending" },
      { id: "v2", name: "Juan Dela Cruz", status: "Undergraduate", state: "pending" },
      { id: "v3", name: "JohnLerry Labro", status: "Alumni", state: "pending" }
    ]);
  }
  if (!get("activity", null)) {
    set("activity", [
      { ts: new Date().toISOString(), text: "System initialized." }
    ]);
  }
})();

window.logActivity = function(text){
  const activity = get("activity", []);
  activity.unshift({ ts: new Date().toISOString(), text });
  set("activity", activity.slice(0, 10));
};

window.login = function (email, password) {
  const users = get("users", []);
  const user = users.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  if (user) {
    set("session", user);
    return true;
  }
  return false;
};

window.logout = function () {
  localStorage.removeItem("session");
  window.location.href = "index.html";
};

window.requireLogin = function () {
  const user = get("session", null);
  if (!user) {
    window.location.href = "index.html";
    return null;
  }
  return user;
};

window.requireRole = function (roles) {
  const user = requireLogin();
  if (!user) return null;

  if (!roles.includes(user.role)) {
    if (user.role === "student") window.location.href = "home.html";
    if (user.role === "seller") window.location.href = "seller.html";
    if (user.role === "admin") window.location.href = "admin.html";
    return null;
  }
  return user;
};

window.goByRole = function (user, chosenRole) {
  const role = chosenRole || user.role;
  if (role === "student") window.location.href = "home.html";
  if (role === "seller") window.location.href = "seller.html";
  if (role === "admin") window.location.href = "admin.html";
};

window.safeId = function(prefix="id"){
  return prefix + "-" + Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
};
