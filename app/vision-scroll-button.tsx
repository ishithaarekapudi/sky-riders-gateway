"use client";

export function VisionScrollButton() {
  function showMission() {
    document.getElementById("mission")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });

    window.history.replaceState(null, "", window.location.pathname + window.location.search);
  }

  return (
    <button className="vision-button" type="button" onClick={showMission}>
      See Our Vision <span aria-hidden="true">→</span>
    </button>
  );
}
