// Mobile Navigation Toggle
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLinks = document.querySelectorAll(".nav-link, .nav-link-btn");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

// Close menu when clicking on a link
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
  });
});

// Smooth scrolling for anchor links including floating button
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      // Special handling for home/top to ensure it goes exactly to 0
      if (this.getAttribute("href") === "#home") {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
        return;
      }

      const headerOffset = 80; // Updated to match new header height
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: Math.max(0, offsetPosition), // Prevent negative scrolling
        behavior: "smooth",
      });
    }
  });
});

// Navbar background on scroll
window.addEventListener("scroll", () => {
  const navbar = document.querySelector(".navbar");
  if (window.scrollY > 50) {
    navbar.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)";
    navbar.style.background = "rgba(255, 255, 255, 0.95)";
  } else {
    navbar.style.boxShadow = "none";
    navbar.style.background = "rgba(255, 255, 255, 0.9)";
  }
});

// Intersection Observer for fade-in animations
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
      observer.unobserve(entry.target); // Animate only once
    }
  });
}, observerOptions);

// Add fade-in animation to cards and sections
const animatedElements = document.querySelectorAll(
  ".topic-card, .news-item, .access-grid, .contact-box"
);
animatedElements.forEach((element, index) => {
  element.style.opacity = "0";
  element.style.transform = "translateY(30px)";
  element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
  // Staggered delay for cards
  if (element.classList.contains("topic-card")) {
    element.style.transitionDelay = `${index * 0.1}s`;
  }
  observer.observe(element);
});

// Scroll to top when clicking nav brand
document.querySelector(".nav-brand").addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// YouTube Background Video Implementation
let player;
let isPlayerReady = false;

function onYouTubeIframeAPIReady() {
  console.log("API Ready");
  createPlayer();
}

function createPlayer() {
  if (isPlayerReady) return;

  player = new YT.Player("youtube-background-player", {
    videoId: "EplwM1uWBLA", // Existing video ID or replace with new one
    playerVars: {
      autoplay: 1,
      controls: 0,
      showinfo: 0,
      modestbranding: 1,
      loop: 0, // Disable native loop to handle custom start time
      fs: 0,
      cc_load_policy: 0,
      iv_load_policy: 3,
      autohide: 0,
      // 'playlist': 'EplwM1uWBLA', // Removed to prevent native playlist looping
      mute: 1,
      start: 35,
    },
    events: {
      onReady: onPlayerReady,
      onStateChange: onPlayerStateChange,
      onError: onPlayerError,
    },
  });
}

function onPlayerReady(event) {
  console.log("Player Ready");
  isPlayerReady = true;
  player = event.target; // Ensure we have the ready player instance
  event.target.mute();
  event.target.playVideo();
}

function onPlayerError(event) {
  console.log("Player Error:", event.data);
}

// Check if API is already loaded (for refresh scenarios)
if (typeof YT !== "undefined" && YT.Player) {
  onYouTubeIframeAPIReady();
}

// Fallback: Check again after window load
window.addEventListener("load", () => {
  if (typeof YT !== "undefined" && YT.Player && !isPlayerReady) {
    onYouTubeIframeAPIReady();
  }
});

// Mute Toggle Handler
const muteBtn = document.getElementById("mute-toggle");
const iconMute = document.querySelector(".icon-mute");
const iconSound = document.querySelector(".icon-sound");

// Handle both click and touch events for better mobile support
const toggleMute = (e) => {
  // Prevent default touch behavior if it's a touchstart event
  if (e.type === "touchstart") {
    e.preventDefault();
  }

  // Toggle based on UI state as a fallback if player status is unreliable
  const isCurrentlyMutedIconVisible = iconMute.style.display !== "none";

  // Update UI immediately for better responsiveness
  if (isCurrentlyMutedIconVisible) {
    iconMute.style.display = "none";
    iconSound.style.display = "block";
  } else {
    iconMute.style.display = "block";
    iconSound.style.display = "none";
  }

    // Attempt to control the player
    if (player) {
      if (isCurrentlyMutedIconVisible) {
        if (typeof player.unMute === "function") {
          player.unMute();
          player.setVolume(20);
        }
      } else {
        if (typeof player.mute === "function") player.mute();
      }
    }
};

muteBtn.addEventListener("click", toggleMute);
muteBtn.addEventListener("touchstart", toggleMute, { passive: false });

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    player.seekTo(35);
    player.playVideo();
  }

  // Add attention animation when video starts playing
  if (event.data === YT.PlayerState.PLAYING) {
    const muteBtn = document.getElementById("mute-toggle");
    // Run only once
    if (!muteBtn.hasAttribute("data-animated")) {
      muteBtn.classList.add("attention");
      muteBtn.setAttribute("data-animated", "true");

      let iterations = 0;
      const handleIteration = () => {
        iterations++;
        // Stop after 3 iterations (3 seconds since animation is 1s duration)
        if (iterations >= 3) {
            muteBtn.removeEventListener('animationiteration', handleIteration);

            // アニメーションを停止
            muteBtn.style.animation = 'none';

            // 少し待ってからトランジションでフェードアウト
            setTimeout(() => {
                muteBtn.style.transition = 'all 1s ease-out';
                // 元の状態に明示的に戻す
                muteBtn.style.transform = 'scale(1)';
                muteBtn.style.boxShadow = '0 0 0 rgba(0,0,0,0)';
                muteBtn.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                muteBtn.style.background = 'rgba(0, 0, 0, 0.5)';

                // トランジション完了後にクリーンアップ
                setTimeout(() => {
                    muteBtn.classList.remove('attention');
                    muteBtn.style.animation = '';
                    muteBtn.style.transition = '';
                    muteBtn.style.transform = '';
                    muteBtn.style.boxShadow = '';
                    muteBtn.style.borderColor = '';
                    muteBtn.style.background = '';
                }, 1000);
            }, 50);
        }
      };

      muteBtn.addEventListener('animationiteration', handleIteration);
    }
  }
}

// Fallback for mobile devices (often block autoplay videos)
if (
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  )
) {
  // Mobile logic: ensure video plays muted
  // We don't hide it anymore as we want it to play if possible
}

// Page visibility API handler
document.addEventListener("visibilitychange", function () {
  if (document.visibilityState === "visible") {
    // Delay slightly to ensure browser is ready
    setTimeout(() => {
      if (player && typeof player.playVideo === "function") {
        // Check if it was supposed to be playing (not ended)
        if (player.getPlayerState() !== YT.PlayerState.PLAYING) {
          player.playVideo();
        }
      }
    }, 300);
  }
});
