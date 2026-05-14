export default function AmbientBackground() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden" aria-hidden>
      <div
        className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full opacity-25"
        style={{
          background: "radial-gradient(circle, #3B82F6 0%, transparent 70%)",
          willChange: "transform",
          animation: "ambientDrift1 12s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full opacity-20"
        style={{
          background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          willChange: "transform",
          animation: "ambientDrift2 15s ease-in-out infinite alternate",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-10"
        style={{
          background: "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
          willChange: "transform",
          animation: "ambientDrift3 18s ease-in-out infinite alternate",
        }}
      />
      <style>{`
        @keyframes ambientDrift1 { from { transform: translate(0, 0) scale(1); } to { transform: translate(60px, 40px) scale(1.1); } }
        @keyframes ambientDrift2 { from { transform: translate(0, 0) scale(1); } to { transform: translate(-50px, -30px) scale(1.15); } }
        @keyframes ambientDrift3 { from { transform: translate(-50%, -50%) scale(1); } to { transform: translate(-50%, -50%) scale(1.2) rotate(30deg); } }
      `}</style>
    </div>
  );
}
