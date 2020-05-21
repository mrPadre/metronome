
class MainSynth {
    constructor () {
        this.synth = new Tone.MembraneSynth(
            {
                pitchDecay : 0.0005 ,
                octaves : 5 ,
                oscillator : {
                    type : 'sine'
                }
                ,
                envelope : {
                    attack : 0.01 ,
                    decay : 0.04,
                    sustain : 0.1 ,
                    release : 2 ,
                    attackCurve : 'exponential'
                }
            }

        );
        this.seq = null;
        this.note = ['c3', 'g3', 'g3', 'g3'];
        this.tempo = 80;
        this.select = 2;
        this.size = '4n';
        this.selectSize = 1;
        this.gain = new Tone.Gain(0.5).toMaster();
    }

    changeNote (newNote, select)  {
        if (this.selectSize === 0 || this.selectSize === 3){
            this.note = newNote.noteArr3;
            this.select = select;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }else if (this.selectSize === 1){
            this.note = newNote.noteArr4;
            this.select = select;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }else if (this.selectSize === 2){
            this.note = newNote.noteArr8;
            this.select = select;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }


    }

    changeSize (size, select)  {
        if (size.name === '3/4'){
            Tone.Transport.timeSignature = 3;
            this.note = ToneArr[this.select].noteArr3;
            this.selectSize = select;
            this.size = size.size;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }else if (size.name === '4/4'){
            Tone.Transport.timeSignature = 4;
            this.note = ToneArr[this.select].noteArr4;
            this.selectSize = select;
            this.size = size.size;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }else if (size.name === '8 th'){
            Tone.Transport.timeSignature = 4;
            this.note = ToneArr[this.select].noteArr8;
            this.selectSize = select;
            this.size = size.size;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }else if (size.name === 'triple'){
            Tone.Transport.timeSignature = 4;
            this.note = ToneArr[this.select].noteArr3;
            this.selectSize = select;
            this.size = size.size;
            Tone.Transport.stop();
            this.render();
            Tone.Transport.start();
        }
    }

    changeGain ()  {
        const volumeRange = document.getElementById('volume');
        const volumeNumber = document.getElementById('volume_number');
        volumeNumber.innerHTML =`x ${this.gain.gain.value}`;
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

    async render () {
        Tone.Transport.bpm.value = this.tempo;
        this.synth.connect(this.gain);

        if (this.seq) {
            this.seq.removeAll();
        }

        this.seq = new Tone.Sequence((time, note) => {
            this.synth.triggerAttackRelease(note, '8n', time);
            let currentBeat = Tone.Transport.position.split(':');
            let num = +currentBeat[1] + 1;
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                if (num % 2 === 0){
                    ctx.fillStyle = 'black';
                    ctx.fillRect(0,0, canvas.width, canvas.height);
                    ctx.font = "148px serif";
                    ctx.fillStyle = 'white';
                } else {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0,0, canvas.width, canvas.height);
                    ctx.font = "148px serif";
                    ctx.fillStyle = 'black';
                }
                ctx.fillText(num.toString(), 110,120);
        }, this.note , this.size);

        this.seq.start();



        const bpmWindow = document.getElementById('bpm_window');
        bpmWindow.innerHTML = `${this.tempo}`;

        const toneBox = document.getElementById('tone-box');
        toneBox.innerHTML = '';
        const sizeBox = document.getElementById('music_size_box');
        sizeBox.innerHTML = '';

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

        MusicSize.map((item, index) => {
            let styleArr = ['radio'];
            if (this.selectSize === index){
                styleArr.push('select');
            }
            const sizeItem = document.createElement('div');
            let sizeRadio = document.createElement('div');
            let sizeLabel = document.createElement('p');
            sizeItem.className = 'tone_item';
            sizeRadio.type = 'radio';
            sizeLabel.innerText = item.name;
            sizeRadio.className = styleArr.join(' ');
            sizeRadio.id = item.name;
            sizeItem.appendChild(sizeLabel);
            sizeItem.appendChild(sizeRadio);
            sizeBox.appendChild(sizeItem);
            sizeItem.addEventListener('click', () => {
                this.changeSize(item, index);
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
        let bpm = +(60/elapsedTime).toFixed();
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

