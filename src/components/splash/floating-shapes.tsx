"use client";

export function FloatingShapes() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Large floating blob */}
      <div
        className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-blue-100/30 to-slate-100/30 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "0s", animationDuration: "8s" }}
      ></div>

      {/* Medium floating blob */}
      <div
        className="absolute -bottom-32 -left-32 w-80 h-80 bg-gradient-to-tr from-slate-100/30 to-blue-100/30 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s", animationDuration: "10s" }}
      ></div>

      {/* Small floating blob */}
      <div
        className="absolute top-1/3 left-1/4 w-48 h-48 bg-gradient-to-bl from-blue-200/20 to-slate-200/20 rounded-full blur-2xl animate-float"
        style={{ animationDelay: "4s", animationDuration: "12s" }}
      ></div>

      {/* Tiny accent shapes */}
      <div
        className="absolute top-1/4 right-1/3 w-24 h-24 bg-blue-200/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "1s", animationDuration: "6s" }}
      ></div>

      <div
        className="absolute bottom-1/4 left-1/2 w-32 h-32 bg-slate-200/20 rounded-full blur-xl animate-float"
        style={{ animationDelay: "3s", animationDuration: "9s" }}
      ></div>
    </div>
  );
}
