import { useEffect } from 'react';

class AudioEngine {
    constructor() {
        this.ctx = null;
        this.initialized = false;
        this.humStarted = false;
    }

    init() {
        if (!this.initialized && typeof window !== 'undefined') {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                this.ctx = new AudioContext();
                this.initialized = true;
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    playClick() {
        if (!this.ctx) return;
        const times = [0, 0.05, 0.1];
        const freqs = [880, 1100, 1320];

        times.forEach((t, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'square';
            osc.frequency.value = freqs[i];
            gain.gain.setValueAtTime(0, this.ctx.currentTime + t);
            gain.gain.linearRampToValueAtTime(0.06, this.ctx.currentTime + t + 0.01);
            gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + t + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(this.ctx.currentTime + t);
            osc.stop(this.ctx.currentTime + t + 0.1);
        });
    }

    playHoverSound() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.1);

        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.05);
        gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.2);
    }

    startSpaceHum() {
        if (!this.ctx || this.humStarted) return;
        this.humStarted = true;

        const oscillator = this.ctx.createOscillator();
        const gainNode = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        oscillator.type = 'sine';
        oscillator.frequency.value = 55;
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        gainNode.gain.value = 0.04;

        oscillator.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(this.ctx.destination);
        oscillator.start(this.ctx.currentTime);

        // Slowly modulate the hum continuously over 8 seconds. 
        // We will loop the modulation by re-applying it every 8 seconds via a self-triggering approach.
        // Wait, standard setValueCurve doesn't natively loop. We can write an interval or just run a longer curve.
        const loopModulation = () => {
            if (!this.ctx) return;
            try {
                oscillator.frequency.setValueCurveAtTime(
                    new Float32Array([55, 58, 54, 57, 55]),
                    this.ctx.currentTime,
                    8
                );
                setTimeout(loopModulation, 8000);
            } catch (e) {
                // Audio context suspended/closed edge case
            }
        };
        loopModulation();
    }

    playHeartbeat() {
        if (!this.ctx) return;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 150;
        filter.connect(this.ctx.destination);

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(filter);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(45, this.ctx.currentTime);

        // 1st beat (lub)
        gain.gain.setValueAtTime(0, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

        // 2nd beat (dub)
        gain.gain.setValueAtTime(0, this.ctx.currentTime + 0.3);
        gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 0.35);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.5);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 0.6);
    }

    playScan() {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const filter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'sawtooth';
        osc.frequency.value = 120;

        filter.type = 'bandpass';
        filter.Q.value = 8;
        filter.frequency.setValueAtTime(150, this.ctx.currentTime);
        filter.frequency.exponentialRampToValueAtTime(2500, this.ctx.currentTime + 0.8);
        filter.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 1.2);

        gain.gain.setValueAtTime(0.01, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 0.6);
        gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 1.2);

        osc.start(this.ctx.currentTime);
        osc.stop(this.ctx.currentTime + 1.2);
    }
}

// Singleton Engine instance bound to window state
export const globalAudioEngine = new AudioEngine();

export function useAudio() {
    useEffect(() => {
        // Init eagerly on mount/interaction to bypass browser autoplay blocks
        const handleInteraction = () => {
            globalAudioEngine.init();
            globalAudioEngine.startSpaceHum();
        };
        window.addEventListener('click', handleInteraction, { once: true });
        window.addEventListener('touchstart', handleInteraction, { once: true });

        // Expose init for manual triggers
        return () => {
            window.removeEventListener('click', handleInteraction);
            window.removeEventListener('touchstart', handleInteraction);
        }
    }, []);

    return globalAudioEngine;
}
