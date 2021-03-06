class VoiceQueue {
    constructor() {
        this.voiceChannelAudioQueues = {};
    }

    queueAudioForChannel(filePath, voiceChannel) {
        if (!this.voiceChannelAudioQueues[voiceChannel.id]) {
            this.voiceChannelAudioQueues[voiceChannel.id] = [];
        }

        this.voiceChannelAudioQueues[voiceChannel.id].push(filePath);
        this.playNextForVoiceChannel(voiceChannel);
    }

    playNextForVoiceChannel(voiceChannel) {
        if (this.voiceChannelAudioQueues[voiceChannel.id].length <= 0 || voiceChannel.connection.speaking) {
            return;
        }

        let audio = this.voiceChannelAudioQueues[voiceChannel.id][0];
        console.log('playing audio: ' + audio);
        console.log('voice channel: ' + voiceChannel.id);
        console.log('voice connection ready: ' + voiceChannel.connection.status == 0);
        let request = voiceChannel.connection.playFile(audio);

        request.on('end', () => {
            this.voiceChannelAudioQueues[voiceChannel.id].splice(0, 1);
            this.playNextForVoiceChannel(voiceChannel);
        });

        request.on('error', (e) => {
            console.error('playback error: ' + e);
        });
    }
}

module.exports = VoiceQueue;
