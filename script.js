(() => {
  "use strict";
  const status = document.querySelector("#shareStatus");
  const musicButton = document.querySelector("#musicButton");
  const musicStatus = document.querySelector("#musicStatus");
  const backgroundMusic = document.querySelector("#backgroundMusic");
  const welcomeScreen = document.querySelector("#welcomeScreen");
  const enterInvitation = document.querySelector("#enterInvitation");
  const petalLayer = document.querySelector("#petalLayer");
  const countdownMessage = document.querySelector("#countdownMessage");
  const weddingVideo = document.querySelector("#weddingVideo");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let music = null;
  let userMusicPaused = false;
  let videoPlaybackActive = false;
  let videoInView = false;
  let resumeMusicAfterVideo = false;
  let programmaticVideoPause = false;

  function getMusic() {
    if (music) return music;
    music = backgroundMusic || new Audio("wedding-music.mp3");
    music.loop = true;
    music.preload = "auto";
    music.volume = 0.35;
    music.muted = false;
    music.defaultMuted = false;
    return music;
  }

  function updateMusicButton(isPlaying) {
    musicButton?.classList.toggle("is-playing", isPlaying);
    musicButton?.setAttribute("aria-pressed", String(isPlaying));
    musicButton?.setAttribute("aria-label", isPlaying ? "Pause background music" : "Play background music");
  }

  async function startMusic() {
    if (videoPlaybackActive && weddingVideo && !weddingVideo.paused) return false;
    try {
      const audio = getMusic();
      audio.muted = false;
      await audio.play();
      updateMusicButton(true);
      if (musicStatus) musicStatus.textContent = "Background music playing.";
      return true;
    } catch {
      updateMusicButton(false);
      if (musicStatus) musicStatus.textContent = "Tap anywhere to start the music.";
      return false;
    }
  }

  async function shareInvitation() {
    const data = {
      title: "Praveen & Kavya — Wedding Invitation",
      text: "Join us for Praveen and Kavya's wedding celebration on 1–2 December 2026.",
      url: window.location.href
    };
    try {
      if (navigator.share) await navigator.share(data);
      else {
        await navigator.clipboard.writeText(window.location.href);
        if (status) status.textContent = "Invitation link copied.";
      }
    } catch (error) {
      if (error.name !== "AbortError" && status) status.textContent = "Copy the page address to share this invitation.";
    }
  }

  document.querySelectorAll("#shareButton, #shareButtonClosing").forEach((button) => {
    button.addEventListener("click", shareInvitation);
  });

  function updateWeddingMessage(now = new Date()) {
    if (!countdownMessage) return;
    const weddingDay = new Date("2026-12-01T00:00:00+05:30");
    const reception = new Date("2026-12-01T18:30:00+05:30");
    const thankYou = new Date("2026-12-02T11:00:00+05:30");
    const beegaraDay = new Date("2026-12-13T00:00:00+05:30");
    const beegaraStart = new Date("2026-12-13T12:30:00+05:30");
    const beegaraThanks = new Date("2026-12-13T15:00:00+05:30");

    if (now < weddingDay) {
      const days = Math.ceil((weddingDay.getTime() - now.getTime()) / 86400000);
      countdownMessage.textContent = `See you in ${days} ${days === 1 ? "day" : "days"}`;
    } else if (now < reception) {
      countdownMessage.textContent = "See you this evening";
    } else if (now < thankYou) {
      countdownMessage.textContent = "See you now";
    } else if (now < beegaraDay) {
      const days = Math.ceil((beegaraDay.getTime() - now.getTime()) / 86400000);
      countdownMessage.textContent = `Thank you for joining us! See you at the Beegara Oota in ${days} ${days === 1 ? "day" : "days"}`;
    } else if (now < beegaraStart) {
      countdownMessage.textContent = "Thank you for joining us! See you at the Beegara Oota today";
    } else if (now < beegaraThanks) {
      countdownMessage.textContent = "Thank you for joining us! See you at the Beegara Oota now";
    } else {
      countdownMessage.textContent = "Thank you for joining us";
    }
  }

  updateWeddingMessage();
  window.setInterval(updateWeddingMessage, 60000);

  const revealTargets = document.querySelectorAll(
    ".intro > *, .section-heading, .event, .venue-card, .photo-grid figure, .film > *, .closing > *"
  );

  if ("IntersectionObserver" in window && !reducedMotion) {
    revealTargets.forEach((item) => item.classList.add("reveal"));
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8%", threshold: 0.08 });
    revealTargets.forEach((item) => observer.observe(item));
  }

  async function toggleMusic() {
    if (getMusic().paused) {
      userMusicPaused = false;
      if (weddingVideo && !weddingVideo.paused) {
        programmaticVideoPause = true;
        weddingVideo.pause();
        videoPlaybackActive = false;
        resumeMusicAfterVideo = false;
      }
      await startMusic();
    } else {
      userMusicPaused = true;
      music.pause();
      updateMusicButton(false);
      if (musicStatus) musicStatus.textContent = "Background music paused.";
    }
  }

  musicButton?.addEventListener("click", toggleMusic);
  startMusic().then((started) => {
    if (started) removeMusicUnlockListeners();
  });

  window.addEventListener("pageshow", () => {
    if ((!music || music.paused) && !videoPlaybackActive && !userMusicPaused) startMusic();
  });

  function pauseMusicForVideo() {
    const audio = getMusic();
    if (!audio.paused) {
      if (!userMusicPaused) resumeMusicAfterVideo = true;
      audio.pause();
      updateMusicButton(false);
      if (musicStatus) musicStatus.textContent = "Background music paused while the video plays.";
    }
  }

  async function beginVideoSession() {
    if (!weddingVideo || !videoInView || document.hidden) return;
    window.clearTimeout(advanceTimer);
    pauseMusicForVideo();
    try {
      await weddingVideo.play();
    } catch {
      videoPlaybackActive = false;
      if (resumeMusicAfterVideo && !userMusicPaused) await startMusic();
      resumeMusicAfterVideo = false;
      scheduleNextPage();
    }
  }

  function endVideoSession({ pauseVideo = true } = {}) {
    if (!weddingVideo) return;
    if (pauseVideo && !weddingVideo.paused) {
      programmaticVideoPause = true;
      weddingVideo.pause();
    }
    const shouldResumeMusic = resumeMusicAfterVideo && !userMusicPaused;
    videoPlaybackActive = false;
    resumeMusicAfterVideo = false;
    if (shouldResumeMusic) startMusic();
    scheduleNextPage();
  }

  if (weddingVideo && "IntersectionObserver" in window) {
    const videoObserver = new IntersectionObserver(([entry]) => {
      const isVisible = entry.isIntersecting && entry.intersectionRatio >= 0.55;
      if (isVisible === videoInView) return;
      videoInView = isVisible;
      if (isVisible) beginVideoSession();
      else endVideoSession();
    }, { threshold: [0, 0.55, 0.8] });
    videoObserver.observe(weddingVideo);

    weddingVideo.addEventListener("play", () => {
      videoPlaybackActive = true;
      window.clearTimeout(advanceTimer);
      pauseMusicForVideo();
    });
    weddingVideo.addEventListener("pause", () => {
      if (programmaticVideoPause) {
        programmaticVideoPause = false;
        return;
      }
      if (weddingVideo.ended || !videoInView) return;
      if (videoPlaybackActive) endVideoSession({ pauseVideo: false });
    });
    weddingVideo.addEventListener("ended", () => endVideoSession({ pauseVideo: false }));
  }

  let musicUnlocking = false;

  function removeMusicUnlockListeners() {
    document.removeEventListener("pointerdown", unlockMusic);
    document.removeEventListener("touchstart", unlockMusic);
    document.removeEventListener("keydown", unlockMusic);
  }

  async function unlockMusic(event) {
    if (musicUnlocking || event.target?.closest?.("#musicButton, #welcomeScreen, #weddingVideo")) return;
    musicUnlocking = true;
    if (await startMusic()) {
      removeMusicUnlockListeners();
    }
    musicUnlocking = false;
  }

  document.addEventListener("pointerdown", unlockMusic, { passive: true });
  document.addEventListener("touchstart", unlockMusic, { passive: true });
  document.addEventListener("keydown", unlockMusic);
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      if (music && !music.paused) {
        music.pause();
        updateMusicButton(false);
      }
      if (weddingVideo && !weddingVideo.paused) {
        programmaticVideoPause = true;
        weddingVideo.pause();
      }
    } else if (videoInView) {
      beginVideoSession();
    } else if (!userMusicPaused) {
      startMusic();
    }
  });

  // Original rose, jasmine, and champagne petal treatment.
  const petalTypes = ["rose", "jasmine", "champagne"];
  let petalSequence = 0;

  function createPetal(delay = 0) {
    if (!petalLayer || reducedMotion || document.hidden) return;
    petalLayer.classList.add("active");
    const petal = document.createElement("span");
    petal.className = `flower-petal ${petalTypes[petalSequence % petalTypes.length]}`;
    petalSequence += 1;
    petal.style.setProperty("--left", `${Math.random() * 100}%`);
    petal.style.setProperty("--delay", `${delay.toFixed(2)}s`);
    petal.style.setProperty("--duration", `${(3.2 + Math.random() * 1.4).toFixed(2)}s`);
    petal.style.setProperty("--drift", `${(-65 + Math.random() * 130).toFixed(0)}px`);
    petal.style.setProperty("--spin", `${(180 + Math.random() * 460).toFixed(0)}deg`);
    petal.style.setProperty("--scale", `${(0.7 + Math.random() * 0.5).toFixed(2)}`);
    petal.addEventListener("animationend", () => petal.remove(), { once: true });
    petalLayer.appendChild(petal);
  }

  if (!reducedMotion) {
    const initialCount = window.innerWidth < 640 ? 8 : 12;
    for (let index = 0; index < initialCount; index += 1) {
      createPetal(Math.random() * 1.2);
    }
    window.setInterval(createPetal, window.innerWidth < 640 ? 460 : 320);
  }

  // A section-by-section tour: wait 10 seconds, then move quickly to the next page.
  const mainTourPages = [...document.querySelectorAll(".hero, .intro, .venues-page, .moments, .film, .closing")];
  const venuePage = document.querySelector(".venues-page");
  const venueCards = [...document.querySelectorAll(".venues-page .venue-card")];
  let autoScrollEnabled = !reducedMotion;
  let advanceTimer = 0;
  let interactionTimer = 0;
  let temporarilyPaused = false;
  let autoScrollInProgress = false;
  let invitationOpened = false;

  function getTourPages() {
    if (!window.matchMedia("(max-width: 760px)").matches) return mainTourPages;
    return mainTourPages.flatMap((page) => page === venuePage ? venueCards : [page]);
  }

  function pageTop(page) {
    return page.getBoundingClientRect().top + window.scrollY;
  }

  function activeTourIndex() {
    return getTourPages().reduce((activeIndex, page, index) => (
      pageTop(page) <= window.scrollY + 2 ? index : activeIndex
    ), 0);
  }

  function scheduleNextPage() {
    window.clearTimeout(advanceTimer);
    if (!invitationOpened || !autoScrollEnabled || temporarilyPaused || autoScrollInProgress || videoPlaybackActive || document.hidden) return;
    advanceTimer = window.setTimeout(advancePage, 10000);
  }

  function advancePage() {
    if (autoScrollInProgress) return;
    const tourPages = getTourPages();
    const nextPage = tourPages[activeTourIndex() + 1];
    if (!nextPage) {
      autoScrollEnabled = false;
      return;
    }
    autoScrollInProgress = true;
    const destination = pageTop(nextPage);
    window.scrollTo({ top: destination, behavior: reducedMotion ? "auto" : "smooth" });
    window.setTimeout(() => {
      const previousScrollBehavior = document.documentElement.style.scrollBehavior;
      document.documentElement.style.scrollBehavior = "auto";
      window.scrollTo(0, destination);
      document.documentElement.style.scrollBehavior = previousScrollBehavior;
      autoScrollInProgress = false;
      scheduleNextPage();
    }, 650);
  }

  function pauseForInteraction(event) {
    if (!invitationOpened || !autoScrollEnabled || event.target?.closest?.("#welcomeScreen")) return;
    temporarilyPaused = true;
    window.clearTimeout(advanceTimer);
    window.clearTimeout(interactionTimer);
    interactionTimer = window.setTimeout(() => {
      temporarilyPaused = false;
      scheduleNextPage();
    }, 12000);
  }

  ["wheel", "touchstart", "pointerdown", "keydown"].forEach((eventName) => {
    window.addEventListener(eventName, pauseForInteraction, { passive: true });
  });

  if (reducedMotion) autoScrollEnabled = false;

  async function openInvitation() {
    if (invitationOpened) return;
    invitationOpened = true;
    const started = await startMusic();
    if (started) removeMusicUnlockListeners();
    document.body.classList.remove("welcome-open");
    welcomeScreen?.classList.add("is-leaving");
    window.scrollTo(0, 0);
    scheduleNextPage();
    window.setTimeout(() => welcomeScreen?.setAttribute("hidden", ""), 600);
  }

  enterInvitation?.addEventListener("click", openInvitation);
  welcomeScreen?.addEventListener("click", openInvitation);

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) window.clearTimeout(advanceTimer);
    else {
      scheduleNextPage();
    }
  });
  scheduleNextPage();
})();
