/**
 * 45th Water India's Water Expo Countdown
 * Dynamic, Interactive, Premium Liquid Theme Code
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // ==========================================================================
    // 1. COUNTDOWN TIMER LOGIC (June 2, 2026, 10:00 AM IST)
    // ==========================================================================
    
    // Target date in Indian Standard Time (IST is UTC +5:30)
    const targetDate = new Date("2026-06-02T10:00:00+05:30").getTime();
    
    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');
    
    // Keep track of previous values to apply flip/update micro-animations
    let prevValues = { days: "", hours: "", minutes: "", seconds: "" };

    function updateCountdown() {
        const now = Date.now();
        const difference = targetDate - now;

        if (difference <= 0) {
            // Expo has started!
            clearInterval(countdownInterval);
            if (daysEl) daysEl.textContent = "00";
            if (hoursEl) hoursEl.textContent = "00";
            if (minutesEl) minutesEl.textContent = "00";
            if (secondsEl) secondsEl.textContent = "00";
            
            // Elegantly adjust headers
            document.querySelector('.countdown-label').textContent = "THE EXPO IS NOW LIVE!";
            const badge = document.querySelector('.stall-badge');
            if (badge) {
                badge.classList.add('pulse-glow');
            }
            return;
        }

        // Time calculations
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        // Format to double digits
        const dStr = String(days).padStart(2, '0');
        const hStr = String(hours).padStart(2, '0');
        const mStr = String(minutes).padStart(2, '0');
        const sStr = String(seconds).padStart(2, '0');

        // Update elements & trigger animations if changed
        updateElementWithAnim(daysEl, dStr, 'days');
        updateElementWithAnim(hoursEl, hStr, 'hours');
        updateElementWithAnim(minutesEl, mStr, 'minutes');
        updateElementWithAnim(secondsEl, sStr, 'seconds');
    }

    function updateElementWithAnim(element, newValue, key) {
        if (!element) return;
        
        if (prevValues[key] !== newValue) {
            // Apply scale-down animation or pulse
            element.parentElement.style.transform = 'scale(0.92)';
            element.parentElement.style.borderColor = 'var(--color-aqua)';
            
            setTimeout(() => {
                element.textContent = newValue;
                element.parentElement.style.transform = '';
                element.parentElement.style.borderColor = '';
            }, 150);
            
            prevValues[key] = newValue;
        }
    }

    // Initial run and setInterval
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);


    // ==========================================================================
    // 2. LIQUID CANVAS PARTICLE SYSTEM (Rising Bubbles)
    // ==========================================================================
    
    const canvas = document.getElementById('bubble-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let bubbles = [];
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;
        
        // Track mouse position for minor fluid distortion
        let mouse = { x: null, y: null };
        
        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });
        
        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Bubble Class representing floating droplets
        class Bubble {
            constructor() {
                this.reset();
                this.y = Math.random() * height; // Start at random height initially
            }

            reset() {
                this.x = Math.random() * width;
                this.y = height + Math.random() * 80 + 20;
                this.radius = Math.random() * 4 + 1.5; // Bubble size (1.5px to 5.5px)
                this.speedY = Math.random() * 0.8 + 0.3; // Speed (slow, liquid-like)
                this.wobbleSpeed = Math.random() * 0.02 + 0.005;
                this.wobbleRange = Math.random() * 12 + 4;
                this.wobbleAngle = Math.random() * Math.PI * 2;
                this.opacity = Math.random() * 0.25 + 0.05; // Gentle transparency
            }

            update() {
                this.y -= this.speedY;
                this.wobbleAngle += this.wobbleSpeed;
                
                // Horizontal liquid sway
                let currentX = this.x + Math.sin(this.wobbleAngle) * this.wobbleRange;

                // Mouse interaction: push bubbles slightly to the side if close
                if (mouse.x !== null && mouse.y !== null) {
                    const dx = currentX - mouse.x;
                    const dy = this.y - mouse.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    
                    if (distance < 120) {
                        const force = (120 - distance) / 120;
                        const directionX = dx / distance;
                        this.x += directionX * force * 2.5; // nudge horizontally
                    }
                }

                // If bubble goes above screen, reset at the bottom
                if (this.y < -20) {
                    this.reset();
                }
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x + Math.sin(this.wobbleAngle) * this.wobbleRange, this.y, this.radius, 0, Math.PI * 2);
                
                // Semi-translucent cyan/white gradient to look like glowing spheres
                const bubbleGrad = ctx.createRadialGradient(
                    this.x + Math.sin(this.wobbleAngle) * this.wobbleRange - this.radius * 0.3,
                    this.y - this.radius * 0.3,
                    this.radius * 0.1,
                    this.x + Math.sin(this.wobbleAngle) * this.wobbleRange,
                    this.y,
                    this.radius
                );
                
                bubbleGrad.addColorStop(0, `rgba(255, 255, 255, ${this.opacity + 0.15})`);
                bubbleGrad.addColorStop(0.4, `rgba(0, 242, 254, ${this.opacity * 0.8})`);
                bubbleGrad.addColorStop(1, `rgba(0, 114, 255, 0.02)`);
                
                ctx.fillStyle = bubbleGrad;
                ctx.shadowBlur = this.radius > 4 ? 6 : 0;
                ctx.shadowColor = 'rgba(0, 242, 254, 0.3)';
                ctx.fill();
                ctx.shadowBlur = 0; // reset
            }
        }

        // Initialize bubbles (density depends on screen width)
        const bubbleCount = Math.min(65, Math.floor(width / 22));
        for (let i = 0; i < bubbleCount; i++) {
            bubbles.push(new Bubble());
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, width, height);
            
            for (let bubble of bubbles) {
                bubble.update();
                bubble.draw();
            }
            
            requestAnimationFrame(animate);
        }
        
        animate();
        
        // Spawn additional bubbles when user clicks anywhere
        window.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON' || e.target.tagName === 'A' || e.target.closest('button') || e.target.closest('a')) {
                return; // don't spawn if clicking action buttons
            }
            
            for (let i = 0; i < 5; i++) {
                const burstBubble = new Bubble();
                burstBubble.x = e.clientX + (Math.random() * 40 - 20);
                burstBubble.y = e.clientY + (Math.random() * 40 - 20);
                burstBubble.radius = Math.random() * 6 + 3; // slightly larger
                burstBubble.speedY = Math.random() * 1.5 + 1.0; // faster
                burstBubble.opacity = 0.5;
                bubbles.push(burstBubble);
                
                // Limit bubble count to maintain perfect 60fps performance
                if (bubbles.length > bubbleCount + 30) {
                    bubbles.shift();
                }
            }
        });
    }


    // ==========================================================================
    // 3. INTERACTIVE FEATURE: DYNAMIC ICS CALENDAR FILE GENERATION
    // ==========================================================================
    
    const btnCalendar = document.getElementById('btn-calendar');
    if (btnCalendar) {
        btnCalendar.addEventListener('click', () => {
            // Event Details
            const event = {
                title: "45th Water India's Water Expo - Stall F15 (Hall 3)",
                description: "Visit our stall in Hall 3, Stall No. F15. Meet our team at the expo and explore our latest innovations.",
                location: "Maniram Dewan Trade Centre, Guwahati, Assam",
                start: "20260602T100000", // local time representation or UTC
                end: "20260604T180000" // 3-day expo estimate
            };

            // ICS format content string
            const icsContent = [
                "BEGIN:VCALENDAR",
                "VERSION:2.0",
                "PRODID:-//Water India Expo//Countdown Widget//EN",
                "CALSCALE:GREGORIAN",
                "BEGIN:VEVENT",
                `DTSTART;TZID=Asia/Kolkata:${event.start}`,
                `DTEND;TZID=Asia/Kolkata:${event.end}`,
                `SUMMARY:${event.title}`,
                `DESCRIPTION:${event.description.replace(/\n/g, '\\n')}`,
                `LOCATION:${event.location}`,
                "STATUS:CONFIRMED",
                "SEQUENCE:0",
                "BEGIN:VALARM",
                "TRIGGER:-PT1H", // 1 hour reminder
                "ACTION:DISPLAY",
                "DESCRIPTION:Reminder: Water India Expo commences soon!",
                "END:VALARM",
                "END:VEVENT",
                "END:VCALENDAR"
            ].join("\r\n");

            // Create download trigger
            const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
            const url = URL.createObjectURL(blob);
            
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'Water_India_Expo_Stall_F15.ics');
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            showToast("Added successfully! Open the downloaded file to save to calendar.");
        });
    }


    // ==========================================================================
    // 4. INTERACTIVE FEATURE: TOAST NOTIFICATIONS & EXPO SHARING
    // ==========================================================================
    
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    let toastTimeout;

    function showToast(message, isSuccess = true) {
        if (!toast || !toastMessage) return;
        
        toastMessage.textContent = message;
        
        const icon = toast.querySelector('.toast-icon');
        if (icon) {
            if (isSuccess) {
                icon.className = "fa-solid fa-circle-check toast-icon";
                icon.style.color = "var(--color-teal)";
                toast.querySelector('.toast-content').style.borderColor = "var(--color-teal)";
            } else {
                icon.className = "fa-solid fa-circle-exclamation toast-icon";
                icon.style.color = "var(--color-aqua)";
                toast.querySelector('.toast-content').style.borderColor = "var(--color-aqua)";
            }
        }

        toast.classList.add('show');
        
        clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3500);
    }

    const btnShare = document.getElementById('btn-share');
    if (btnShare) {
        btnShare.addEventListener('click', async () => {
            const shareText = `45th Water India's Water Expo at Guwahati, Assam
🎪 Stall: Hall 3, Stall No. F15
📍 Venue: Maniram Dewan Trade Centre
📅 Commencement: 2nd June 2026, 10:00 AM IST
Join us and explore advanced water innovations!`;

            // Use Web Share API if supported on device (iOS/Android browsers)
            if (navigator.share) {
                try {
                    await navigator.share({
                        title: "45th Water India's Water Expo",
                        text: shareText,
                        url: window.location.href
                    });
                    showToast("Event shared successfully!");
                } catch (err) {
                    // Fail gracefully, user might have cancelled
                    if (err.name !== 'AbortError') {
                        copyToClipboard(shareText);
                    }
                }
            } else {
                // Desktop fallback (Clipboard copy)
                copyToClipboard(shareText);
            }
        });
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => {
                showToast("Event & stall details copied to clipboard!");
            })
            .catch(() => {
                // Fallback method
                const textArea = document.createElement("textarea");
                textArea.value = text;
                textArea.style.position = "fixed";
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                try {
                    document.execCommand('copy');
                    showToast("Event & stall details copied to clipboard!");
                } catch (err) {
                    showToast("Could not copy details.", false);
                }
                document.body.removeChild(textArea);
            });
    }

    // Interactivity: Clicking the Stall Badge also triggers copy shortcut!
    const stallBadge = document.querySelector('.stall-badge');
    if (stallBadge) {
        stallBadge.addEventListener('click', () => {
            const stallText = "45th Water India's Water Expo | Visit us in Hall 3, Stall No. F15 | Maniram Dewan Trade Centre, Guwahati, Assam";
            copyToClipboard(stallText);
        });
    }
});
