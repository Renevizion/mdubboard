# 🎵 MDubboard - QWERTY Keyboard Soundboard

Drop the bass with your keyboard! MDubboard is a professional web-based soundboard that turns your QWERTY keyboard into a powerful dubstep instrument.

## Features

- 🎹 **40+ High-Quality Sounds** - All synthesized in real-time using Web Audio API
- 🎛️ **Multiple Sound Categories**:
  - Deep Bass & Sub-Bass
  - LFO Wobble Bass
  - Drum Kit (Kicks, Snares, Hi-Hats, Claps, Crash)
  - Synth Leads & Pads
  - Vocal Effects
  - FX (Risers, Impacts, Sweeps, Scratches)
- ⏺️ **Recording & Playback** - Record your sessions and play them back
- 🎨 **Dubstep-Themed UI** - Cyberpunk aesthetic with glowing effects
- 🔊 **Volume Control** - Adjust master volume
- 🗂️ **Category Filtering** - Focus on specific sound types
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile

## Getting Started

### Installation

1. Clone this repository:
```bash
git clone https://github.com/Renevizion/mdubboard.git
cd mdubboard
```

2. Open `index.html` in a modern web browser (Chrome, Firefox, Edge, Safari)

That's it! No build process, no dependencies, just pure HTML/CSS/JavaScript.

### Usage

#### Playing Sounds
- **Click** any key on the visual keyboard with your mouse
- **Press** the corresponding key on your physical keyboard

#### Keyboard Layout

**Row 1 (Numbers):** Bass, Wobble, and FX sounds
- `1-3`: Deep bass sounds
- `4-6`: Wobble bass with LFO modulation
- `7-0`: Sound effects (risers, impacts, sweeps, reverse)

**Row 2 (QWERTY):** Drum sounds
- `Q-W`: Kick drums
- `E-R`: Snares
- `T`: Clap
- `Y-U`: Hi-hats (closed/open)
- `I-O`: Percussion
- `P`: Crash cymbal

**Row 3 (ASDFGH):** Synth and Lead sounds
- `A-G`: Synth notes (C major scale)
- `H-J`: Extended synth notes
- `K-L`: Lead synth sounds

**Row 4 (ZXCVBN):** Pads and Vocals
- `Z-C`: Atmospheric pads
- `V-N`: Vocal effects
- `M`: Scratch effect

#### Recording

1. Click the **Record** button to start recording
2. Play your sounds using keyboard or mouse
3. Click **Stop Recording** when done
4. Click **Play** to hear your recording
5. Click **Clear** to delete the recording

#### Category Filtering

Click on category buttons to filter sounds:
- **All Sounds** - Show all keys
- **Bass** - Deep bass and sub-bass
- **Drums** - All percussion sounds
- **Wobble** - LFO modulated bass
- **Synth** - Synth leads, pads, and melodies
- **FX** - Sound effects and transitions

#### Volume Control

Use the volume slider to adjust the master output level (0-100%).

## Sound Design

All sounds are synthesized in real-time using the Web Audio API, providing:
- **Zero latency** - Instant sound playback
- **High quality** - Professional-grade synthesis algorithms
- **No samples** - Everything is generated procedurally
- **Lightweight** - No large audio files to download

### Sound Types

- **Bass**: Deep sine waves with sub-harmonics
- **Wobble**: Sawtooth oscillators with LFO-modulated filters
- **Drums**: Combination of oscillators and noise generators
- **Synth**: Multi-oscillator synthesis with envelopes
- **Pads**: Layered sine waves with long release
- **FX**: Frequency sweeps and modulated effects

## Browser Compatibility

MDubboard works in all modern browsers that support:
- Web Audio API
- ES6 JavaScript
- CSS Grid and Flexbox

Tested on:
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Tips for Making Music

1. **Start with a beat** - Use Q (kick) and E (snare) to create a rhythm
2. **Add bass** - Layer in bass sounds (1-3) on the beat
3. **Create movement** - Use wobble sounds (4-6) for dynamic sections
4. **Add melody** - Play synth notes (A-L) over your beat
5. **Use FX** - Add risers (7) before drops, impacts (8) on drops
6. **Record it!** - Capture your creation with the record feature

## Technical Details

- **Audio Context**: Web Audio API for low-latency synthesis
- **Oscillators**: Various waveforms (sine, sawtooth, square, triangle)
- **Filters**: Biquad filters for frequency shaping
- **Envelopes**: ADSR-style gain envelopes for dynamics
- **LFO**: Low-frequency oscillators for modulation effects

## License

MIT License - Feel free to use, modify, and distribute.

## Contributing

Contributions are welcome! Feel free to:
- Add new sounds
- Improve the UI
- Add new features
- Fix bugs
- Enhance documentation

## Credits

Created with ❤️ for music lovers and dubstep enthusiasts.

---

**Now drop the bass and make some noise! 🔊**