//2020-0922-0000
console.log("Xeus-Gate Player VER: 2.1.0 2020-0922-0000");

var XeusGate = {
    Player: null,
    Source: null,
    Renderer: {},
    debug: false,
    Now: function () {
        return window.performance ? window.performance.now() / 1e3 : Date.now() / 1e3
    },

    BrowserType: function () {
        var agent = navigator.userAgent;
        var browser = 'Unknown';
        if (agent.search('Edge') >= 0) {
            browser = 'Edge';
        } else if (agent.search('Trident') >= 0) {
            browser = 'Trident';
        } else if (agent.search('Whale') >= 0 || agent.search('OPR') >= 0 ||
            agent.search('Chrome') >= 0) {
            browser = 'Chrome';
        } else if (agent.search('Firefox') >= 0) {
            browser = 'Firefox';
        }
        return browser;
    },

    ToHex: function (byteArray) {
        return Array.prototype.map.call(byteArray, function (byte) {
            return ('00' + (byte & 0xFF).toString(16)).slice(-2);
        }).join(' ');
    },

    Log: function (msg) {
        if (this.debug) {
            console.log(msg);
        }
    },

    Queue: function () {
        var queue = [];
        var offset = 0;
        var capability = 10;

        this.getLength = function () {
            return (queue.length - offset);
        }

        this.isEmpty = function () {
            return (queue.length == 0);
        }

        this.enqueue = function (item) {
            if ((queue.length - offset) > this.capability) {
                this.dequeue();
            }
            queue.push(item);
        }

        this.dequeue = function () {
            if (queue.length == 0) return undefined;
            var item = queue[offset];
            if (++offset * 2 >= queue.length) {
                queue = queue.slice(offset);
                offset = 0;
            }
            return item;
        }

        this.peek = function () {
            return (queue.length > 0 ? queue[offset] : undefined);
        }
    }
};

// ///////////////////////////////////////////
// XeusGate.Player
// ///////////////////////////////////////////

XeusGate.Player = function () {
    "use strict";

    var setStyles = function (element, styles) {
        for (var name in styles) {
            element.style[name] = styles[name]
        }
    };

    var Player = function (options) {
        this.options = options || {};
        this.options.browser = XeusGate.BrowserType();
        if (this.options.debug) {
            XeusGate.debug = this.options.debug;
        }

        if (!this.options.codec || (this.options.codec == 'auto')) {
            this.options.codec = 'h264';
        }

        if (!this.options.reconnect) {
            this.options.reconnect = true;
        }

        if (!this.options.timeout) {
            this.options.timeout = 20;
        }

        this.playerElement = document.getElementById(this.options.playerId);
        this.playerVisible = true;
        var _self = this;

        document.addEventListener("visibilitychange", function () {
            if (document.visibilityState === 'hidden') {
                _self.playerVisible = false;
                XeusGate.Log("Player visibilitychange  hidden...");
                if (_self.options.videoElement) {
                    if (_self.renderer) {
                        _self.renderer.pause();
                    }
                }
            } else {
                XeusGate.Log("Player visibilitychange  visible...");
                _self.playerVisible = true;
                if (_self.options.videoElement) {
                    if (_self.renderer) {
                        _self.renderer.play();
                    }
                }
            }
        });

        if (this.options.codec == 'h264') {
            this.createVideoElement('video');
            this.renderer = new XeusGate.Renderer.H264(this, this.options);
        } else if (this.options.codec == 'mjpeg') {
            this.createVideoElement('img');
            this.renderer = new XeusGate.Renderer.MJPEG(this, this.options);
        } else {
            XeusGate.Log("unsupported codec name: " + this.options.codec);
        }

        this.createTextElement();
        this.source = new XeusGate.Source(this, this.renderer, this.options);
        this.start();
    };

    Player.prototype.start = function () {
        if (this.renderer && this.source) {
            this.renderer.start();
            this.source.start();
            console.log("Player started...", this.options.cctvMgrNo);
        } else {
            XeusGate.Log("Player start: renderer or source is null.");
        }
    };

    Player.prototype.isPlayerVisible = function () {
        return this.playerVisible;
    };

    Player.prototype.showText = function (txt) {
        this.options.spanElement.innerHTML = txt;
        this.visible(this.options.textElement, true);
    };

    Player.prototype.visible = function (element, visible) {
        element.style.visibility = (visible) ? 'visible' : 'hidden';
    };

    Player.prototype.createTextElement = function () {
        var wrap = document.createElement('div');
        setStyles(wrap, {
            'display': "block",
            'width': '100%',
            'height': '100%',
            'position': 'absolute',
            'left': '0px',
            'top': '0px',
            'text-align': 'center',
            'background-color': 'rgb(34, 34, 34)'
        });
        var div = document.createElement('div');
        setStyles(div, {
            'position': 'relative',
            'top': '50%',
            'margin-top': '-1em',
            'background-color': 'rgb(34, 34, 34)'
        });
        var span = document.createElement('span');
        setStyles(span, {
            'font-size': '13px',
            'display': 'block',
            'color': 'rgb(180, 180, 180)'
        });
        div.appendChild(span);
        wrap.appendChild(div);
        this.playerElement.appendChild(wrap);
        this.options.textElement = wrap;
        this.options.spanElement = span;
        this.showText("연결을 시도합니다.");
    };

    Player.prototype.createVideoElement = function (elementName) {
        var w = '100%';
        var h = '100%';
        if (this.options.width) {
            w = this.options.width;
        }
        if (this.options.heigh) {
            h = this.options.height;
        }

        var video = document.createElement(elementName);
        if (elementName == 'video') {
            video.autoplay = true;
            video.muted = true;
            video.controls = false;
            video.loop = false;
            video.setAttribute('oncontextmenu', 'return false;');
        }
        setStyles(video, {
            'object-fit': 'fill',
            'display': "block",
            'width': w,
            'height': h,
            'left': '0px',
            'top': '0px',
            'transform': 'translateZ(0)',
            'background-color': 'rgb(34, 34, 34)'
        });
        this.playerElement.appendChild(video);
        this.options.videoElement = video;
    };

    Player.prototype.moveto = function (time) {
        if (this.source) {
            this.source.moveto(time);
        }
    };

    Player.prototype.speed = function (spd) {
        if (this.source) {
            this.source.speed(spd);
        }
    };

    Player.prototype.pause = function () {
        if (this.source) {
            this.source.pause();
        }
    };

    Player.prototype.resume = function () {
        if (this.source) {
            this.source.resume();
        }
    };

    Player.prototype.forward = function () {
        if (this.source) {
            this.source.forward();
        }
    };

    Player.prototype.backward = function () {
        if (this.source) {
            this.source.backward();
        }
    };

    Player.prototype.close = function () {
        if (this.source) {
            this.source.close();
        }
        if (this.renderer) {
            this.renderer.close();
        }
    };

    Player.prototype.destroy = function () {
        this.close();

        if (this.options.videoElement) {
            this.playerElement?.removeChild(this.options.videoElement);
            this.options.videoElement = undefined;
        }
        if (this.options.textElement) {
            this.playerElement?.removeChild(this.options.textElement);
            this.options.textElement = undefined;
        }
        if (this.source) {
            this.source.destroy();
        }
        if (this.renderer) {
            this.renderer.destroy();
        }

        console.log("Player destroyed...", this.options.cctvMgrNo);
    };
    return Player;
}();


XeusGate.Source = function () {
    "use strict";

    var WsSource = function (player, renderer, options) {
        this.options = options || {};
        this.socket = null;
        this.player = player;
        this.renderer = renderer;

        this.connectIntervalId = 0;
        this.retryCount = 0;
        this.message = "연결이 종료 되었습니다.";
        this.playing = false;
    };

    WsSource.prototype.start = function () {
        this.playing = false;
        this.socket = new WebSocket(this.options.url);

        this.socket.binaryType = "arraybuffer";
        this.socket.onmessage = this.onMessage.bind(this);
        this.socket.onopen = this.onOpen.bind(this);
        this.socket.onerror = this.onClose.bind(this);
        this.socket.onclose = this.onClose.bind(this);
    };

    WsSource.prototype.onOpen = function () {
        this.playing = false;
        var cmd = "{" +
            "\"cmd\":\"open\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"size\":\"" + this.options.size + "\"," +
            "\"bitrate\":\"" + this.options.bitrate + "\"," +
            "\"framerate\":\"" + this.options.framerate + "\"," +
            "\"userId\":\"" + this.options.userId + "\", " +
            "\"evtType\":\"" + this.options.evtType + "\", " +
            "\"timestamp\":\"" + this.options.timestamp + "\", " +
            "\"speed\":\"" + this.options.speed + "\", " +
            "\"codec\":\"" + this.options.codec + "\", " +
            "\"src\":\"" + this.options.rtspUrl + "\" " +
            "}";

        this.socket.send(cmd);
        this.retryCount = 0;
        this.connectIntervalId = setInterval(function () {
            this.player.showText("데이터 수신 대기중... (" + this.retryCount + "초)");
            if (this.retryCount >= this.options.timeout) {
                this.onClose();
            }
            this.retryCount++;
        }.bind(this), 1000);
    };

    WsSource.prototype.onClose = function () {
        this.playing = false;
        clearInterval(this.connectIntervalId);
        if (this.player) {
            this.player.showText(this.message);
            this.player.close();
        }
    };

    WsSource.prototype.onMessage = function (ev) {
        if (this.playing == false) {
            clearInterval(this.connectIntervalId);
            this.playing = true;
        }

        if (this.renderer) {
            var packet = new Uint8Array(ev.data);

            var code = packet[0];
            if (code == 110) {
                switch (packet[1]) {
                    case 11:
                        this.message = "카메라 정보 없음.";
                        break;
                    case 12:
                        this.message = "영상 수신대기 초과.";
                        break;
                    case 13:
                        this.message = "영상 연결요청 실패.";
                        break;
                    case 14:
                        this.message = "Bridge 요청 오류.";
                        break;
                    case 15:
                        this.message = "요청처리 실패.";
                        break;
                    case 90:
                        this.message = "요청처리 실패.";
                        break;
                    default:
                        this.message = "연결종료.";
                        break;
                }
            } else if (code == 112) {
                this.renderer.feed(packet.subarray(1));
            }
        }
    };

    WsSource.prototype.moveto = function (time) {
        var cmd = "{" +
            "\"cmd\":\"playback\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"mode\":\"GoTo\"," +
            "\"timestamp\":\"" + time + "\"" +
            "}";
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(cmd);
        }
    };

    WsSource.prototype.speed = function (spd) {
        var cmd = "{" +
            "\"cmd\":\"playback\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"mode\":\"Speed\"," +
            "\"speed\":\"" + spd + "\"" +
            "}";
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(cmd);
        }
    };

    WsSource.prototype.pause = function () {
        var cmd = "{" +
            "\"cmd\":\"playback\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"mode\":\"Pause\"" +
            "}";
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(cmd);
        }
    };

    WsSource.prototype.resume = function () {
        var cmd = "{" +
            "\"cmd\":\"playback\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"mode\":\"Resume\"" +
            "}";
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(cmd);
        }
    };

    WsSource.prototype.forward = function () {
        var cmd = "{" +
            "\"cmd\":\"playback\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"mode\":\"Forward\"" +
            "}";
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(cmd);
        }
    };

    WsSource.prototype.backward = function () {
        var cmd = "{" +
            "\"cmd\":\"playback\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"mode\":\"Backward\"" +
            "}";
        if (this.socket.readyState === this.socket.OPEN) {
            this.socket.send(cmd);
        }
    };

    WsSource.prototype.close = function () {
        var cmd = "{" +
            "\"cmd\":\"close\"," +
            "\"cctvMgrNo\":\"" + this.options.cctvMgrNo + "\"," +
            "\"size\":\"" + this.options.size + "\"," +
            "\"bitrate\":\"" + this.options.bitrate + "\"," +
            "\"framerate\":\"" + this.options.framerate + "\"," +
            "\"userId\":\"" + this.options.userId + "\", " +
            "\"evtType\":\"" + this.options.evtType + "\", " +
            "\"timestamp\":\"" + this.options.timestamp + "\", " +
            "\"speed\":\"" + this.options.speed + "\", " +
            "\"codec\":\"" + this.options.codec + "\", " +
            "\"src\":\"" + this.options.rtspUrl + "\" " +
            "}";
        if (this.socket?.readyState === this.socket?.OPEN) {
            this.socket?.send(cmd);
        }
        clearInterval(this.connectIntervalId);
        this.retryCount = 0;
        this.playing = false;
        this.socket?.close();
    };

    WsSource.prototype.destroy = function () {
        this.player = null;
        this.renderer = null;
    };

    return WsSource;
}();


// ///////////////////////////////////////////
// XeusGate.Renderer
// ///////////////////////////////////////////

XeusGate.Renderer.H264 = function () {
    var H264Renderer = function (player, options) {
        this.CLEAN_INTERVAL = 10000;
        this.options = options || {};
        this.player = player;
        this.mediaSource = null;
        this.sourceBuffer = null;
        this.mediaSourceReady = false;
        this.initSegmentReady = false;
        this.codecSupported = true;
        this.initialized = false;
        this.codec = null;
        this.queue = new Uint8Array();
        this.lastCleanUpTime = 0;
        this.lastCleanUpOffset = 0;
    };

    H264Renderer.prototype.appendByteArray = function (buffer1, buffer2) {
        var tmp = new Uint8Array((buffer1.byteLength | 0) + (buffer2.byteLength | 0));
        tmp.set(buffer1, 0);
        tmp.set(buffer2, buffer1.byteLength | 0);
        return tmp;
    };

    H264Renderer.prototype.start = function () {
        var isMSESupported = !!window.MediaSource;
        if (!isMSESupported) {
            XeusGate.Log('Oops! Browser does not support media source extension.');
            this.player.destroy();
            return;
        }

        this.mediaSource = new MediaSource();
        this.options.videoElement.setAttribute('src', URL.createObjectURL(this.mediaSource));

        this.mediaSource.addEventListener('sourceopen', this.onMSEOpen.bind(this));
        this.mediaSource.addEventListener('sourceclose', this.onMSEClose.bind(this));
        this.mediaSource.addEventListener('webkitsourceopen', this.onMSEOpen.bind(this));
        this.mediaSource.addEventListener('webkitsourceclose', this.onMSEClose.bind(this));
    };

    H264Renderer.prototype.onMSEOpen = function () {
        this.mediaSourceReady = true;
    };

    H264Renderer.prototype.onMSEClose = function () {
        this.player.close();
    };

    H264Renderer.prototype.cleanUpBuffer = function () {
        if (this.options.videoElement.paused) {
            return;
        }
        if (this.sourceBuffer.buffered && this.sourceBuffer.buffered.length) {
            for (var i = 0; i < this.sourceBuffer.buffered.length; ++i) {
                var start = this.sourceBuffer.buffered.start(i);
                var end = this.sourceBuffer.buffered.end(i);
                var cur = this.options.videoElement.currentTime;

                var endOffset = end - 20;
                if ((start < endOffset) && !this.sourceBuffer.updating) {
                    this.sourceBuffer.remove(this.lastCleanUpOffset, endOffset);
                    this.lastCleanUpOffset = start;
                }
                XeusGate.Log("cleanUp curTime: " + cur + " endTime: " + end + " offset:" + this.lastCleanUpOffset);
            }
        }
    };

    H264Renderer.prototype.feed = function (data) {
        if (data.byteLength == 0) {
            return;
        }
        if (!this.codecSupported) {
            XeusGate.Log("Video codec not supported. " + this.codec);
            return;
        }
        var packet = new Uint8Array(data);
        if (!this.initSegmentReady) {
            this.options.videoElement.pause();
            var str = String.fromCharCode.apply(null, packet.subarray(0, 6));
            this.codec = 'video/mp4; codecs="avc1.' + str + '"';
            XeusGate.Log("H264Renderer codec: " + this.codec);

            if (!MediaSource.isTypeSupported(this.codec)) {
                this.codecSupported = false;
                XeusGate.Log("Video codec not supported. " + this.codec);
                return;
            }
            this.queue = this.appendByteArray(this.queue, packet.subarray(6));
            this.initSegmentReady = true;
        }

        var _self = this;
        if (this.initSegmentReady && this.mediaSourceReady) {
            if (!this.initialized) {
                var sb = this.mediaSource.addSourceBuffer(this.codec);

                this.sourceBuffer = sb;
                this.sourceBuffer.mode = 'sequence';
                this.sourceBuffer.addEventListener('updateend', function () {
                    if (_self.lastCleanUpTime == 0) {
                        _self.lastCleanUpTime = Date.now();
                    } else {
                        var curTime = _self.options.videoElement && _self.options.videoElement.currentTime;
                        if (curTime > 20) {
                            if ((Date.now() - _self.lastCleanUpTime) > _self.CLEAN_INTERVAL) {
                                _self.cleanUpBuffer();
                                _self.lastCleanUpTime = Date.now();
                            }
                        }
                    }
                });
                this.initialized = true;
            } else {
                this.queue = this.appendByteArray(this.queue, packet);
            }
        }

        if (this.initialized) {
            if ((this.options.textElement.style.visibility == 'visible')) {
                this.player.visible(this.options.textElement, false);
                if (this.options.videoElement.paused) {
                    this.options.videoElement.play();
                }
            }
            this.update();
        }
    };

    H264Renderer.prototype.update = function () {
        if (!this.queue.length) {
            return;
        }

        try {
            if (!this.sourceBuffer.updating) {
                this.sourceBuffer.appendBuffer(this.queue);
                this.queue = new Uint8Array();
            }
        } catch (e) {
            XeusGate.Log(e.name + " : sourceBuffer.appendBuffer error");
        }
    };

    H264Renderer.prototype.pause = function () {
        this.options.videoElement.pause();
    };

    H264Renderer.prototype.play = function () {
        this.options.videoElement.play();
    };

    H264Renderer.prototype.close = function () {
        if (this.mediaSource) {
            try {
                this.mediaSource.removeSourceBuffer(this.sourceBuffer);
                this.mediaSource.endOfStream();
            } catch (e) {
            }
            this.mediaSource = null;
        }
        this.mseReady = false;
        this.initialized = false;
        this.lastCleanUpTime = 0;
        this.lastCleanUpOffset = 0;
        this.queue = null;
        this.mediaSourceReady = false;
        this.initSegmentReady = false;
    };

    H264Renderer.prototype.destroy = function () {
    };
    return H264Renderer;
}();


// ///////////////////////////////////////////////
// MJPEG
// ///////////////////////////////////////////////
XeusGate.Renderer.MJPEG = function () {
    "use strict";

    var DEFAULT_FPS = 20;
    var JPEG_MAGIG_NUMBER = [0xff, 0xd9];

    var MjpegRenderer = function (player, options) {
        this.options = options || {};
        this.imageElement = this.options.videoElement;
        this.player = player;
        this.isPlaying = false;
        this.isDrawing = false;
        this.jpegUrl = null;
        this.interval = 0;
    };

    MjpegRenderer.prototype.start = function () {
        this.isPlaying = false;
        this.isDrawing = false;
        this.jpegUrl = null;
        this.queue = new XeusGate.Queue();
        this.play();
        XeusGate.Log("MjpegRenderer Started...");
    };

    MjpegRenderer.prototype.feed = function (data) {
        if (!this.isPlaying) {
            return;
        }
        if (this.options.textElement.style.visibility == 'visible') {
            this.player.visible(this.options.textElement, false);
        }
        this.queue.enqueue(new Uint8Array(data));
    };

    MjpegRenderer.prototype.render = function (frame) {
        if (!frame) return;
        var len = frame.length;
        var _self = this;
        if (frame[len - 2] === JPEG_MAGIG_NUMBER[0] && frame[len - 1] === JPEG_MAGIG_NUMBER[1]) {
            _self.isDrawing = true;
            if (_self.jpegUrl) {
                URL.revokeObjectURL(_self.jpegUrl);
            }
            _self.jpegUrl = URL.createObjectURL(new Blob([frame], {
                type: "image/jpeg"
            }));
            _self.imageElement.onload = function () {
                _self.isDrawing = false;
            };
            _self.imageElement.setAttribute('src', _self.jpegUrl);
        }
    };

    MjpegRenderer.prototype.pause = function () {
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.isPlaying = false;
    };

    MjpegRenderer.prototype.play = function () {
        var _self = this;
        this.interval = setInterval(function () {
            var data = _self.queue.dequeue();
            _self.render(data);
        }, 1000 / DEFAULT_FPS);
        this.isPlaying = true;
    };

    MjpegRenderer.prototype.close = function () {
        this.isPlaying = false;
        this.isDrawing = false;
        this.jpegUrl = null;
        clearInterval(this.interval);
    };

    MjpegRenderer.prototype.destroy = function () {
    };

    return MjpegRenderer;
}();

export default XeusGate;
