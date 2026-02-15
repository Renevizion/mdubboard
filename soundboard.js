// MDubboard - QWERTY Keyboard Soundboard
// High-quality synthesized dubstep sounds using Web Audio API

class Soundboard {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.audioContext.createGain();
        this.masterGain.connect(this.audioContext.destination);
        this.masterGain.gain.value = 0.7;
        
        this.isRecording = false;
        this.recordedNotes = [];
        this.recordStartTime = null;
        this.playbackTimeouts = [];
        
        this.soundMap = this.createSoundMap();
        this.init();
    }

    init() {
        this.setupKeyboardListeners();
        this.setupControlListeners();
        this.setupCategoryFilters();
        this.setupVolumeControl();
    }

    createSoundMap() {
        return {
            // Bass sounds
            bass1: { type: 'bass', freq: 55, category: 'bass' },
            bass2: { type: 'bass', freq: 41, category: 'bass' },
            bass3: { type: 'bass', freq: 65, category: 'bass' },
            
            // Wobble sounds
            wobble1: { type: 'wobble', freq: 110, lfoRate: 4, category: 'wobble' },
            wobble2: { type: 'wobble', freq: 82, lfoRate: 6, category: 'wobble' },
            wobble3: { type: 'wobble', freq: 147, lfoRate: 8, category: 'wobble' },
            
            // Drums
            kick1: { type: 'kick', freq: 60, category: 'drums' },
            kick2: { type: 'kick', freq: 50, category: 'drums' },
            snare1: { type: 'snare', category: 'drums' },
            snare2: { type: 'snare', freq: 220, category: 'drums' },
            clap: { type: 'clap', category: 'drums' },
            hihat1: { type: 'hihat', category: 'drums' },
            hihat2: { type: 'hihat', freq: 10000, category: 'drums' },
            perc1: { type: 'perc', freq: 800, category: 'drums' },
            perc2: { type: 'perc', freq: 1200, category: 'drums' },
            crash: { type: 'crash', category: 'drums' },
            
            // Synth notes (C major scale)
            synth1: { type: 'synth', freq: 261.63, category: 'synth' }, // C
            synth2: { type: 'synth', freq: 293.66, category: 'synth' }, // D
            synth3: { type: 'synth', freq: 329.63, category: 'synth' }, // E
            synth4: { type: 'synth', freq: 349.23, category: 'synth' }, // F
            synth5: { type: 'synth', freq: 392.00, category: 'synth' }, // G
            synth6: { type: 'synth', freq: 440.00, category: 'synth' }, // A
            synth7: { type: 'synth', freq: 493.88, category: 'synth' }, // B
            lead1: { type: 'lead', freq: 523.25, category: 'synth' },
            lead2: { type: 'lead', freq: 659.25, category: 'synth' },
            
            // Pads
            pad1: { type: 'pad', freq: 130.81, category: 'synth' },
            pad2: { type: 'pad', freq: 164.81, category: 'synth' },
            pad3: { type: 'pad', freq: 196.00, category: 'synth' },
            
            // Vocals/Effects
            vocal1: { type: 'vocal', freq: 300, category: 'fx' },
            vocal2: { type: 'vocal', freq: 400, category: 'fx' },
            vocal3: { type: 'vocal', freq: 500, category: 'fx' },
            scratch: { type: 'scratch', category: 'fx' },
            
            // FX
            fx1: { type: 'riser', category: 'fx' },
            fx2: { type: 'impact', category: 'fx' },
            fx3: { type: 'sweep', category: 'fx' },
            fx4: { type: 'reverse', category: 'fx' }
        };
    }

    playSound(soundId) {
        const sound = this.soundMap[soundId];
        if (!sound) return;

        // Resume audio context if suspended (browser autoplay policy)
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }

        // Record if recording is active
        if (this.isRecording) {
            const timestamp = performance.now() - this.recordStartTime;
            this.recordedNotes.push({ soundId, timestamp });
        }

        // Play the sound based on its type
        switch (sound.type) {
            case 'bass':
                this.playBass(sound);
                break;
            case 'wobble':
                this.playWobble(sound);
                break;
            case 'kick':
                this.playKick(sound);
                break;
            case 'snare':
                this.playSnare(sound);
                break;
            case 'clap':
                this.playClap();
                break;
            case 'hihat':
                this.playHiHat(sound);
                break;
            case 'perc':
                this.playPerc(sound);
                break;
            case 'crash':
                this.playCrash();
                break;
            case 'synth':
                this.playSynth(sound);
                break;
            case 'lead':
                this.playLead(sound);
                break;
            case 'pad':
                this.playPad(sound);
                break;
            case 'vocal':
                this.playVocal(sound);
                break;
            case 'scratch':
                this.playScratch();
                break;
            case 'riser':
                this.playRiser();
                break;
            case 'impact':
                this.playImpact();
                break;
            case 'sweep':
                this.playSweep();
                break;
            case 'reverse':
                this.playReverse();
                break;
        }
    }

    // Deep bass with sub-harmonics
    playBass(sound) {
        const now = this.audioContext.currentTime;
        
        // Main bass oscillator
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc1.type = 'sine';
        osc2.type = 'triangle';
        osc1.frequency.value = sound.freq;
        osc2.frequency.value = sound.freq * 2;
        
        // Envelope
        gain.gain.setValueAtTime(0.8, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
        
        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + 1.5);
        osc2.stop(now + 1.5);
    }

    // LFO modulated wobble bass
    playWobble(sound) {
        const now = this.audioContext.currentTime;
        const duration = 2;
        
        // Main oscillator
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = sound.freq;
        
        // LFO for wobble effect
        const lfo = this.audioContext.createOscillator();
        lfo.frequency.value = sound.lfoRate;
        
        // Filter for the wobble
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 500;
        filter.Q.value = 10;
        
        const lfoGain = this.audioContext.createGain();
        lfoGain.gain.value = 400;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        lfo.start(now);
        osc.stop(now + duration);
        lfo.stop(now + duration);
    }

    // Punchy kick drum
    playKick(sound) {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        const gain = this.audioContext.createGain();
        
        osc.type = 'sine';
        osc.frequency.setValueAtTime(sound.freq || 60, now);
        osc.frequency.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.5);
    }

    // Snare with noise
    playSnare(sound) {
        const now = this.audioContext.currentTime;
        
        // Noise component
        const bufferSize = this.audioContext.sampleRate * 0.3;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const noiseFilter = this.audioContext.createBiquadFilter();
        noiseFilter.type = 'highpass';
        noiseFilter.frequency.value = 2000;
        
        const noiseGain = this.audioContext.createGain();
        noiseGain.gain.setValueAtTime(0.5, now);
        noiseGain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        
        // Tonal component
        const osc = this.audioContext.createOscillator();
        osc.type = 'triangle';
        osc.frequency.value = sound.freq || 200;
        
        const oscGain = this.audioContext.createGain();
        oscGain.gain.setValueAtTime(0.3, now);
        oscGain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        noise.connect(noiseFilter);
        noiseFilter.connect(noiseGain);
        noiseGain.connect(this.masterGain);
        
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);
        
        noise.start(now);
        osc.start(now);
        noise.stop(now + 0.2);
        osc.stop(now + 0.1);
    }

    // Clap sound
    playClap() {
        const now = this.audioContext.currentTime;
        
        for (let i = 0; i < 3; i++) {
            const delay = i * 0.03;
            
            const bufferSize = this.audioContext.sampleRate * 0.1;
            const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
            const data = buffer.getChannelData(0);
            
            for (let j = 0; j < bufferSize; j++) {
                data[j] = Math.random() * 2 - 1;
            }
            
            const noise = this.audioContext.createBufferSource();
            noise.buffer = buffer;
            
            const filter = this.audioContext.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 1000;
            
            const gain = this.audioContext.createGain();
            gain.gain.setValueAtTime(0.3, now + delay);
            gain.gain.exponentialRampToValueAtTime(0.01, now + delay + 0.1);
            
            noise.connect(filter);
            filter.connect(gain);
            gain.connect(this.masterGain);
            
            noise.start(now + delay);
            noise.stop(now + delay + 0.1);
        }
    }

    // Hi-hat
    playHiHat(sound) {
        const now = this.audioContext.currentTime;
        
        const bufferSize = this.audioContext.sampleRate * 0.05;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = sound.freq || 7000;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(now);
        noise.stop(now + 0.05);
    }

    // Percussion
    playPerc(sound) {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(sound.freq, now);
        osc.frequency.exponentialRampToValueAtTime(sound.freq * 0.5, now + 0.1);
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.1);
    }

    // Crash cymbal
    playCrash() {
        const now = this.audioContext.currentTime;
        
        const bufferSize = this.audioContext.sampleRate * 2;
        const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        
        for (let i = 0; i < bufferSize; i++) {
            data[i] = Math.random() * 2 - 1;
        }
        
        const noise = this.audioContext.createBufferSource();
        noise.buffer = buffer;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'highpass';
        filter.frequency.value = 5000;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 2);
        
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        noise.start(now);
        noise.stop(now + 2);
    }

    // Synth notes
    playSynth(sound) {
        const now = this.audioContext.currentTime;
        const duration = 0.5;
        
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.value = sound.freq;
        osc2.frequency.value = sound.freq * 1.01; // Slight detune for richness
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        filter.Q.value = 1;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
    }

    // Lead synth
    playLead(sound) {
        const now = this.audioContext.currentTime;
        const duration = 1;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = sound.freq;
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(sound.freq * 2, now);
        filter.frequency.exponentialRampToValueAtTime(sound.freq * 8, now + 0.1);
        filter.Q.value = 10;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    // Pad sound
    playPad(sound) {
        const now = this.audioContext.currentTime;
        const duration = 2;
        
        const osc1 = this.audioContext.createOscillator();
        const osc2 = this.audioContext.createOscillator();
        const osc3 = this.audioContext.createOscillator();
        
        osc1.type = 'sine';
        osc2.type = 'sine';
        osc3.type = 'sine';
        osc1.frequency.value = sound.freq;
        osc2.frequency.value = sound.freq * 1.5;
        osc3.frequency.value = sound.freq * 2;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.2, now + 0.1);
        gain.gain.linearRampToValueAtTime(0.15, now + duration - 0.1);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        
        osc1.connect(gain);
        osc2.connect(gain);
        osc3.connect(gain);
        gain.connect(this.masterGain);
        
        osc1.start(now);
        osc2.start(now);
        osc3.start(now);
        osc1.stop(now + duration);
        osc2.stop(now + duration);
        osc3.stop(now + duration);
    }

    // Vocal effect
    playVocal(sound) {
        const now = this.audioContext.currentTime;
        const duration = 0.5;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.value = sound.freq;
        
        // Formant filters for vocal quality
        const filter1 = this.audioContext.createBiquadFilter();
        filter1.type = 'bandpass';
        filter1.frequency.value = 800;
        filter1.Q.value = 5;
        
        const filter2 = this.audioContext.createBiquadFilter();
        filter2.type = 'bandpass';
        filter2.frequency.value = 1200;
        filter2.Q.value = 5;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.connect(filter1);
        filter1.connect(filter2);
        filter2.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    // Scratch effect
    playScratch() {
        const now = this.audioContext.currentTime;
        const duration = 0.3;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + duration / 2);
        osc.frequency.exponentialRampToValueAtTime(300, now + duration);
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.linearRampToValueAtTime(0, now + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    // Riser effect
    playRiser() {
        const now = this.audioContext.currentTime;
        const duration = 2;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(50, now);
        osc.frequency.exponentialRampToValueAtTime(2000, now + duration);
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(200, now);
        filter.frequency.exponentialRampToValueAtTime(5000, now + duration);
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.4, now + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    // Impact effect
    playImpact() {
        const now = this.audioContext.currentTime;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.5);
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + 0.5);
    }

    // Sweep effect
    playSweep() {
        const now = this.audioContext.currentTime;
        const duration = 1;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(2000, now);
        osc.frequency.exponentialRampToValueAtTime(200, now + duration);
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + duration);
        
        osc.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    // Reverse effect
    playReverse() {
        const now = this.audioContext.currentTime;
        const duration = 1.5;
        
        const osc = this.audioContext.createOscillator();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1000, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + duration);
        
        const filter = this.audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(5000, now);
        filter.frequency.exponentialRampToValueAtTime(500, now + duration);
        
        const gain = this.audioContext.createGain();
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.4, now + duration);
        
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);
        
        osc.start(now);
        osc.stop(now + duration);
    }

    setupKeyboardListeners() {
        const keys = document.querySelectorAll('.key');
        const pressedKeys = new Set();

        // Click handlers for mouse
        keys.forEach(key => {
            key.addEventListener('click', () => {
                const soundId = key.dataset.sound;
                this.playSound(soundId);
                this.animateKey(key);
            });
        });

        // Keyboard handlers
        document.addEventListener('keydown', (e) => {
            // Prevent repeat events when key is held
            if (pressedKeys.has(e.key.toLowerCase())) return;
            pressedKeys.add(e.key.toLowerCase());

            const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
            if (key && !key.classList.contains('hidden')) {
                const soundId = key.dataset.sound;
                this.playSound(soundId);
                this.animateKey(key);
            }
        });

        document.addEventListener('keyup', (e) => {
            pressedKeys.delete(e.key.toLowerCase());
            const key = document.querySelector(`[data-key="${e.key.toLowerCase()}"]`);
            if (key) {
                key.classList.remove('active');
            }
        });
    }

    animateKey(keyElement) {
        keyElement.classList.add('active');
        setTimeout(() => {
            keyElement.classList.remove('active');
        }, 200);
    }

    setupControlListeners() {
        const recordBtn = document.getElementById('recordBtn');
        const playBtn = document.getElementById('playBtn');
        const stopBtn = document.getElementById('stopBtn');
        const clearBtn = document.getElementById('clearBtn');
        const recordingStatus = document.getElementById('recording-status');
        const recTime = document.getElementById('recTime');

        let recordingInterval;

        recordBtn.addEventListener('click', () => {
            if (!this.isRecording) {
                // Start recording
                this.isRecording = true;
                this.recordedNotes = [];
                this.recordStartTime = performance.now();
                recordBtn.classList.add('recording');
                recordBtn.innerHTML = '<span class="icon">⏹</span> Stop Recording';
                recordingStatus.style.display = 'block';
                
                let startTime = Date.now();
                recordingInterval = setInterval(() => {
                    const elapsed = (Date.now() - startTime) / 1000;
                    recTime.textContent = elapsed.toFixed(1) + 's';
                }, 100);
            } else {
                // Stop recording
                this.isRecording = false;
                recordBtn.classList.remove('recording');
                recordBtn.innerHTML = '<span class="icon">⏺</span> Record';
                recordingStatus.style.display = 'none';
                clearInterval(recordingInterval);
                
                if (this.recordedNotes.length > 0) {
                    playBtn.disabled = false;
                    stopBtn.disabled = false;
                }
            }
        });

        playBtn.addEventListener('click', () => {
            this.playRecording();
        });

        stopBtn.addEventListener('click', () => {
            this.stopPlayback();
        });

        clearBtn.addEventListener('click', () => {
            this.recordedNotes = [];
            playBtn.disabled = true;
            stopBtn.disabled = true;
            this.stopPlayback();
        });
    }

    playRecording() {
        if (this.recordedNotes.length === 0) return;

        this.playbackTimeouts = [];
        this.recordedNotes.forEach(note => {
            const timeoutId = setTimeout(() => {
                this.playSound(note.soundId);
                const keyElement = document.querySelector(`[data-sound="${note.soundId}"]`);
                if (keyElement) {
                    this.animateKey(keyElement);
                }
            }, note.timestamp);
            this.playbackTimeouts.push(timeoutId);
        });
    }

    stopPlayback() {
        if (this.playbackTimeouts) {
            this.playbackTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
            this.playbackTimeouts = [];
        }
    }

    setupCategoryFilters() {
        const categoryBtns = document.querySelectorAll('.category-btn');
        const keys = document.querySelectorAll('.key');

        categoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const category = btn.dataset.category;

                // Filter keys
                keys.forEach(key => {
                    const soundId = key.dataset.sound;
                    const sound = this.soundMap[soundId];

                    if (category === 'all' || sound.category === category) {
                        key.classList.remove('hidden');
                    } else {
                        key.classList.add('hidden');
                    }
                });
            });
        });
    }

    setupVolumeControl() {
        const volumeSlider = document.getElementById('volumeSlider');
        const volumeValue = document.getElementById('volumeValue');

        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value / 100;
            this.masterGain.gain.value = volume;
            volumeValue.textContent = e.target.value + '%';
        });
    }
}

// Initialize the soundboard when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const soundboard = new Soundboard();
    console.log('🎵 MDubboard initialized! Start pressing keys to make some dubstep!');
});
