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
        
        // AI Song Generation
        this.generatedSong = null;
        this.isSongPlaying = false;
        
        this.soundMap = this.createSoundMap();
        this.init();
    }

    init() {
        this.setupKeyboardListeners();
        this.setupControlListeners();
        this.setupCategoryFilters();
        this.setupVolumeControl();
        this.setupAIControls();
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

    setupAIControls() {
        const generateBtn = document.getElementById('generateSongBtn');
        const playSongBtn = document.getElementById('playSongBtn');
        const stopSongBtn = document.getElementById('stopSongBtn');
        const saveSongBtn = document.getElementById('saveSongBtn');
        const styleButtons = document.querySelectorAll('.style-btn');
        
        let selectedStyle = '';

        styleButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                styleButtons.forEach(b => b.style.background = '');
                btn.style.background = 'linear-gradient(135deg, rgba(138, 43, 226, 0.9) 0%, rgba(75, 0, 130, 0.9) 100%)';
                selectedStyle = btn.dataset.style;
            });
        });

        generateBtn.addEventListener('click', async () => {
            const apiKey = document.getElementById('apiKey').value;
            const customPrompt = document.getElementById('customPrompt').value;
            const style = customPrompt || selectedStyle || 'dubstep';
            
            if (!apiKey) {
                // Use fallback structure without API
                this.generateSongWithFallback(style);
            } else {
                await this.generateSongWithAI(apiKey, style);
            }
        });

        playSongBtn.addEventListener('click', () => {
            this.playSong();
        });

        stopSongBtn.addEventListener('click', () => {
            this.stopSong();
        });

        saveSongBtn.addEventListener('click', () => {
            if (this.generatedSong) {
                this.recordedNotes = this.generatedSong.notes;
                document.getElementById('playBtn').disabled = false;
                document.getElementById('stopBtn').disabled = false;
                // Show success message briefly
                const resultDiv = document.getElementById('songResult');
                const originalText = document.getElementById('songDescription').textContent;
                document.getElementById('songDescription').textContent = '✅ Song saved! Use the Play button above to hear it.';
                setTimeout(() => {
                    document.getElementById('songDescription').textContent = originalText;
                }, 3000);
            }
        });
    }

    generateSongWithFallback(style) {
        const generatingStatus = document.getElementById('generatingStatus');
        const songResult = document.getElementById('songResult');
        
        generatingStatus.style.display = 'flex';
        songResult.style.display = 'none';

        // Use fallback structure
        setTimeout(() => {
            const songStructure = this.getFallbackStructure(style);
            this.generatedSong = this.createSongFromStructure(songStructure, style);
            
            // Display results
            generatingStatus.style.display = 'none';
            songResult.style.display = 'block';
            document.getElementById('songDescription').textContent = songStructure.description + 
                ` (Generated using fallback structure. Add API key for AI-powered generation.)`;
        }, 1000); // Simulate processing time
    }

    async generateSongWithAI(apiKey, style) {
        const generatingStatus = document.getElementById('generatingStatus');
        const songResult = document.getElementById('songResult');
        
        generatingStatus.style.display = 'flex';
        songResult.style.display = 'none';

        try {
            // Call Gemini API to get song structure
            const songStructure = await this.callGeminiAPI(apiKey, style);
            
            // Generate the actual song pattern
            this.generatedSong = this.createSongFromStructure(songStructure, style);
            
            // Display results
            generatingStatus.style.display = 'none';
            songResult.style.display = 'block';
            document.getElementById('songDescription').textContent = songStructure.description || 
                `A ${style} song with ${songStructure.sections.length} sections, ${songStructure.bpm} BPM`;
            
        } catch (error) {
            generatingStatus.style.display = 'none';
            // Fall back to non-AI generation
            console.warn('API error, using fallback:', error);
            this.generateSongWithFallback(style);
        }
    }

    async callGeminiAPI(apiKey, style) {
        const prompt = this.buildMusicPrompt(style);
        
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    topK: 40,
                    topP: 0.95,
                }
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API request failed (${response.status} ${response.statusText}): ${errorText.substring(0, 100)}`);
        }

        const data = await response.json();
        
        // Validate response structure
        if (!data.candidates || !data.candidates[0] || 
            !data.candidates[0].content || !data.candidates[0].content.parts || 
            !data.candidates[0].content.parts[0]) {
            throw new Error('Invalid API response structure');
        }
        
        const text = data.candidates[0].content.parts[0].text;
        
        // Parse the AI response
        return this.parseAIResponse(text, style);
    }

    buildMusicPrompt(style) {
        const styleDescriptions = {
            dubstep: 'aggressive dubstep like Skrillex with heavy bass drops, wobbles, and intense energy',
            rap: 'hard-hitting rap beat like Tupac or Biggie with strong kicks and snares',
            trap: 'modern trap beat like Drake with hi-hat rolls and 808s',
            house: 'energetic house music with four-on-the-floor kick pattern',
            afrobeat: 'rhythmic afrobeats with percussion and melodic patterns'
        };

        const description = styleDescriptions[style] || style;

        return `You are a professional music producer. Create a detailed song structure for ${description}.

Provide the following in JSON format:
{
  "bpm": <number between 120-150>,
  "description": "<brief description of the song>",
  "sections": [
    {
      "name": "<intro/verse/buildup/drop/outro>",
      "duration": <beats, e.g., 16 or 32>,
      "elements": ["<instrument1>", "<instrument2>"]
    }
  ]
}

Use these available instruments: kick, snare, hihat, bass, wobble, synth, pad, fx
Make it a complete song with intro, verses, buildups, drops, and outro.
Return ONLY the JSON, no other text.`;
    }

    parseAIResponse(text, style) {
        try {
            // Try to extract JSON from the response
            const jsonMatch = text.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                return JSON.parse(jsonMatch[0]);
            }
        } catch (e) {
            console.warn('Failed to parse AI response, using fallback');
        }
        
        // Fallback: Generate a structure based on style
        return this.getFallbackStructure(style);
    }

    getFallbackStructure(style) {
        const structures = {
            dubstep: {
                bpm: 140,
                description: 'Heavy dubstep with aggressive drops and wobbles',
                sections: [
                    { name: 'intro', duration: 16, elements: ['hihat', 'pad'] },
                    { name: 'buildup', duration: 16, elements: ['kick', 'snare', 'fx'] },
                    { name: 'drop', duration: 32, elements: ['kick', 'snare', 'wobble', 'bass'] },
                    { name: 'breakdown', duration: 16, elements: ['pad', 'synth'] },
                    { name: 'drop2', duration: 32, elements: ['kick', 'snare', 'wobble', 'bass'] },
                    { name: 'outro', duration: 16, elements: ['pad', 'hihat'] }
                ]
            },
            rap: {
                bpm: 90,
                description: 'Classic rap beat with hard-hitting drums',
                sections: [
                    { name: 'intro', duration: 8, elements: ['hihat'] },
                    { name: 'verse', duration: 32, elements: ['kick', 'snare', 'hihat'] },
                    { name: 'chorus', duration: 16, elements: ['kick', 'snare', 'hihat', 'synth'] },
                    { name: 'verse2', duration: 32, elements: ['kick', 'snare', 'hihat', 'bass'] },
                    { name: 'chorus2', duration: 16, elements: ['kick', 'snare', 'hihat', 'synth'] },
                    { name: 'outro', duration: 8, elements: ['hihat', 'pad'] }
                ]
            },
            trap: {
                bpm: 140,
                description: 'Modern trap with hi-hat rolls and 808s',
                sections: [
                    { name: 'intro', duration: 16, elements: ['hihat'] },
                    { name: 'verse', duration: 32, elements: ['kick', 'snare', 'hihat', 'bass'] },
                    { name: 'chorus', duration: 32, elements: ['kick', 'snare', 'hihat', 'synth', 'bass'] },
                    { name: 'verse2', duration: 32, elements: ['kick', 'snare', 'hihat', 'bass'] },
                    { name: 'outro', duration: 16, elements: ['hihat', 'pad'] }
                ]
            },
            house: {
                bpm: 128,
                description: 'Energetic house music with four-on-the-floor',
                sections: [
                    { name: 'intro', duration: 16, elements: ['kick', 'hihat'] },
                    { name: 'buildup', duration: 16, elements: ['kick', 'hihat', 'synth', 'fx'] },
                    { name: 'drop', duration: 32, elements: ['kick', 'hihat', 'bass', 'synth'] },
                    { name: 'breakdown', duration: 16, elements: ['pad', 'synth'] },
                    { name: 'drop2', duration: 32, elements: ['kick', 'hihat', 'bass', 'synth'] },
                    { name: 'outro', duration: 16, elements: ['kick', 'hihat'] }
                ]
            },
            afrobeat: {
                bpm: 110,
                description: 'Rhythmic afrobeats with percussive elements',
                sections: [
                    { name: 'intro', duration: 8, elements: ['perc', 'hihat'] },
                    { name: 'verse', duration: 32, elements: ['kick', 'snare', 'perc', 'hihat', 'synth'] },
                    { name: 'chorus', duration: 32, elements: ['kick', 'snare', 'perc', 'hihat', 'synth', 'bass'] },
                    { name: 'verse2', duration: 32, elements: ['kick', 'snare', 'perc', 'hihat', 'pad'] },
                    { name: 'outro', duration: 16, elements: ['perc', 'pad'] }
                ]
            }
        };

        return structures[style] || structures.dubstep;
    }

    createSongFromStructure(structure, style) {
        const beatDuration = 60000 / structure.bpm; // Duration of one beat in ms
        const notes = [];
        let currentTime = 0;

        structure.sections.forEach(section => {
            const sectionDuration = section.duration * beatDuration;
            const sectionNotes = this.generateSectionNotes(section, beatDuration, currentTime);
            notes.push(...sectionNotes);
            currentTime += sectionDuration;
        });

        return {
            bpm: structure.bpm,
            description: structure.description,
            notes: notes,
            duration: currentTime
        };
    }

    generateSectionNotes(section, beatDuration, startTime) {
        const notes = [];
        const beats = section.duration;
        
        // Map elements to sound IDs
        const elementMap = {
            kick: ['kick1', 'kick2'],
            snare: ['snare1', 'snare2'],
            hihat: ['hihat1', 'hihat2'],
            bass: ['bass1', 'bass2', 'bass3'],
            wobble: ['wobble1', 'wobble2', 'wobble3'],
            synth: ['synth1', 'synth2', 'synth3', 'synth4', 'synth5', 'synth6', 'synth7'],
            pad: ['pad1', 'pad2', 'pad3'],
            perc: ['perc1', 'perc2'],
            fx: ['fx1', 'fx2', 'fx3', 'fx4']
        };

        section.elements.forEach(element => {
            const sounds = elementMap[element] || [element + '1'];
            
            // Different patterns for different elements
            if (element === 'kick') {
                // Kick on 1 and 3
                for (let i = 0; i < beats; i += 4) {
                    notes.push({ soundId: sounds[0], timestamp: startTime + i * beatDuration });
                    if (i + 2 < beats) {
                        notes.push({ soundId: sounds[0], timestamp: startTime + (i + 2) * beatDuration });
                    }
                }
            } else if (element === 'snare') {
                // Snare on 2 and 4
                for (let i = 1; i < beats; i += 2) {
                    notes.push({ soundId: sounds[Math.floor(Math.random() * sounds.length)], 
                               timestamp: startTime + i * beatDuration });
                }
            } else if (element === 'hihat') {
                // Hi-hat on every beat or eighth note
                for (let i = 0; i < beats * 2; i++) {
                    notes.push({ soundId: sounds[i % 2], 
                               timestamp: startTime + i * beatDuration / 2 });
                }
            } else if (element === 'bass' || element === 'wobble') {
                // Bass on musical intervals
                for (let i = 0; i < beats; i += 2) {
                    notes.push({ soundId: sounds[Math.floor(Math.random() * sounds.length)], 
                               timestamp: startTime + i * beatDuration });
                }
            } else if (element === 'synth') {
                // Synth melodies
                for (let i = 0; i < beats; i += 4) {
                    const numNotes = Math.floor(Math.random() * 3) + 1;
                    for (let j = 0; j < numNotes; j++) {
                        notes.push({ 
                            soundId: sounds[Math.floor(Math.random() * sounds.length)], 
                            timestamp: startTime + (i + j * 0.5) * beatDuration 
                        });
                    }
                }
            } else if (element === 'pad') {
                // Pads sustain
                for (let i = 0; i < beats; i += 8) {
                    notes.push({ soundId: sounds[Math.floor(Math.random() * sounds.length)], 
                               timestamp: startTime + i * beatDuration });
                }
            } else if (element === 'perc') {
                // Percussion fills
                for (let i = 0; i < beats; i += 3) {
                    notes.push({ soundId: sounds[Math.floor(Math.random() * sounds.length)], 
                               timestamp: startTime + i * beatDuration });
                }
            } else if (element === 'fx') {
                // FX at section start
                notes.push({ soundId: sounds[Math.floor(Math.random() * sounds.length)], 
                           timestamp: startTime });
            }
        });

        return notes;
    }

    playSong() {
        if (!this.generatedSong || this.isSongPlaying) return;
        
        this.isSongPlaying = true;
        this.playbackTimeouts = [];
        
        this.generatedSong.notes.forEach(note => {
            const timeoutId = setTimeout(() => {
                this.playSound(note.soundId);
                const keyElement = document.querySelector(`[data-sound="${note.soundId}"]`);
                if (keyElement) {
                    this.animateKey(keyElement);
                }
            }, note.timestamp);
            this.playbackTimeouts.push(timeoutId);
        });

        // Auto-stop after song duration
        setTimeout(() => {
            this.isSongPlaying = false;
        }, this.generatedSong.duration + 1000);
    }

    stopSong() {
        if (this.playbackTimeouts) {
            this.playbackTimeouts.forEach(timeoutId => clearTimeout(timeoutId));
            this.playbackTimeouts = [];
        }
        this.isSongPlaying = false;
    }
}

// Initialize the soundboard when the page loads
window.addEventListener('DOMContentLoaded', () => {
    const soundboard = new Soundboard();
    console.log('🎵 MDubboard initialized! Start pressing keys to make some dubstep!');
});
