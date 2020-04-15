
class MainSynth {
    constructor () {
        this.synth = new Tone.MembraneSynth(
            {
                pitchDecay : 0.05 ,
                octaves : 10 ,
                oscillator : {
                    type : 'sine'
                }
                ,
                envelope : {
                    attack : 0.000001 ,
                    decay : 0.4 ,
                    sustain : 0.0001 ,
                    release : 1.4 ,
                    attackCurve : 'exponential'
                }
            }

        );
        this.seq = null;
        this.note = ['c3', 'g3', 'g3', 'g3'];
        this.tempo = 80;
        this.select = 0;
        this.gain = new Tone.Gain(0.5).toMaster();
    }

    changeNote (newNote, select)  {
        this.note = newNote.noteArr4;
        this.select = select;
        Tone.Transport.stop();
        this.render();
        Tone.Transport.start();

    }

    changeGain ()  {
        const volumeRange = document.getElementById('volume');
        this.gain.gain.value = volumeRange.value;


    }

    setTempo (bpm) {
        if (bpm >= 1 && bpm <= 400){
            Tone.Transport.stop();
            this.tempo = bpm;
            Tone.Transport.start();
            this.render();
        }

    }

    changeTempo (simbol, value)  {
        Tone.Transport.stop();
        if (simbol === 'plus') {
            this.tempo = this.tempo + value;
        }else if (simbol === 'minus') {
            this.tempo = this.tempo - value;
        }
        Tone.Transport.start();
        this.render();
    }
    render () {
        Tone.Transport.bpm.value = this.tempo;
        this.synth.connect(this.gain);

        if (this.seq) {
            this.seq.removeAll();
        }

        this.seq = new Tone.Sequence((time, note) => {
            this.synth.triggerAttackRelease(note, '16n', time, 1);
            let currentBeat = Tone.Transport.position.split(':');
            if (currentBeat[1] === '0'){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.fillRect(0,0, canvas.width, canvas.height);
                ctx.font = "148px serif";
                ctx.fillStyle = 'black';
                ctx.fillText('1', 110,120);
            } else if (currentBeat[1] === '1'){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.fillRect(0,0, canvas.width, canvas.height);
                ctx.font = "148px serif";
                ctx.fillStyle = 'white';
                ctx.fillText('2', 110,120);
            }else if (currentBeat[1] === '2'){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'white';
                ctx.fillRect(0,0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.font = "148px serif";
                ctx.fillText('3', 110,120);
            }else if (currentBeat[1] === '3'){
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.fillStyle = 'black';
                ctx.fillRect(0,0, canvas.width, canvas.height);
                ctx.font = "148px serif";
                ctx.fillStyle = 'white';
                ctx.fillText('4', 110,120);
            }
        }, this.note , '4n');

        this.seq.start();


        const bpmWindow = document.getElementById('bpm_window');
        bpmWindow.innerHTML = `${this.tempo}`;

        const toneBox = document.getElementById('tone-box');
        toneBox.innerHTML = '';

        ToneArr.map((item, index) => {
            let styleArr = ['radio'];
            if (this.select === index){
                styleArr.push('select');
            }
            const toneItem = document.createElement('div');
            let toneRadio = document.createElement('div');
            let toneLabel = document.createElement('p');
            toneItem.className = 'tone_item';
            toneRadio.type = 'radio';
            toneLabel.innerText = item.name;
            toneRadio.className = styleArr.join(' ');
            toneRadio.id = item.name;
            toneItem.appendChild(toneLabel);
            toneItem.appendChild(toneRadio);
            toneBox.appendChild(toneItem);
            toneItem.addEventListener('click', () => {
                this.changeNote(item, index);
            });
        })

    }
    start () {
        Tone.Transport.start();
        this.render();
    }

    stop () {
        Tone.Transport.clear();
        Tone.Transport.stop();
        this.render();
    }
}

const start = document.getElementById('start');
const stop = document.getElementById('stop');
const left = document.getElementById('left');
const right = document.getElementById('right');
const up = document.getElementById('up');
const down = document.getElementById('down');
const songs = document.getElementById('song_list');
const bpmWindow = document.getElementById('bpm_window');

bpmWindow.addEventListener('click', () => tapMetronome());

const cPanel = document.getElementById('cPanel');
let ctx = document.getElementById('canvas').getContext('2d');

let mySynth = new MainSynth();

Tone.context.latencyHint = 'fastest';

function tapMetronome () {
    let elapsedTime = Tone.Transport.seconds;
    Tone.Transport.stop().start();
        let bpm = (60/elapsedTime).toFixed();
        mySynth.setTempo(bpm);
}

start.addEventListener('click', () => mySynth.start());
stop.addEventListener('click', () => mySynth.stop());

up.addEventListener('click', () => {
    mySynth.changeTempo('plus', 10);

});
down.addEventListener('click', () => {
    mySynth.changeTempo('minus', 10);

});
right.addEventListener('click', () => {
    mySynth.changeTempo('plus', 1);

});
left.addEventListener('click', () => {
    mySynth.changeTempo('minus', 1);
});


Songs.map((item, index) => {
    const song = document.createElement('div');
    song.className = 'song';
    songs.appendChild(song);
    song.addEventListener('click', () => {
        mySynth.setTempo(item.temp);
    });
    song.innerHTML += `<div>${item.song}</div><div>${item.temp} bpm</div>`;
});

mySynth.render();

