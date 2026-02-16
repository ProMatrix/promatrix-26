import { Injectable } from '@angular/core';
declare var webkitSpeechRecognition: any;

export interface IChatbotMessage {
  action: string;
  data: any;
  utterance?: any;
}

export const chatbotMessage: IChatbotMessage = {
  action: '',
  data: null,
  utterance: null
}

@Injectable({ providedIn: 'root' })
export class AiInterface {
  speechSynth = speechSynthesis;
  speechVolume = 0.75;
  voices = new Array<SpeechSynthesisVoice>();
  selectedAgent = '';
  talkshowAgent = '';
  stt: any;

  defaultHostOpening = 'Ok! Let the show begin!';
  defaultGuestOpening = 'Can we start the show?';
  lastestRequest = '';
  dfMessenger: any;
  dfMessengerChatBubble: any;
  speechStack = new Array<string>();
  reloadSession = false;
  executiveCycleTime = 500;
  openingPauseTime = 1500;
  defaultContinuous = '>';
  sentToDialogFlow = '';
  randomNumber = '';
  speechReties = 0;
  hostOnline = false;
  hostListening = false;
  hostSpeaking = false;
  hostThinking = false;
  // hostThinking is true when host is waiting for response from df
  guestOnline = false;
  guestListening = false;
  guestSpeaking = false;
  guestThinking = false;
  hostChatbotLatest = '';
  guestChatbotLatest = '';
  mediaStream: any = null;
  soundDetected = false;
  soundDetectedTimeoutId: null | ReturnType<typeof setTimeout> = null;
  activityIntervalId: null | ReturnType<typeof setTimeout> = null;
  hostOnlineTimeoutId: null | ReturnType<typeof setTimeout> = null;
  guestOnlineTimeoutId: null | ReturnType<typeof setTimeout> = null;
  hostListeningTimeoutId: null | ReturnType<typeof setTimeout> = null;
  guestListeningTimeoutId: null | ReturnType<typeof setTimeout> = null;
  _continuous = '>';
  bookmark = '';
  switchingAgents = false;
  showMrSmartyPants = true;
  soundStarted = false;
  bc = new BroadcastChannel('chatbot-talkshow');

  constructor() {
    this.initializeDialogFlow();
    this.initializeStt();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      this.speechSynth.onvoiceschanged = this.getVoices;
    }
    this.executive();
  }

  executive() {
    this.bc.onmessage = (event) => {
      if (event?.data) {
        this.updateMessage(event?.data);
      }
    };
    
    if(this.activityIntervalId) {
      clearInterval(this.activityIntervalId);
    }
    this.activityIntervalId = setInterval(()=>{
      const onlineActivity = { chatbot: this.selectedAgent, chatbotListening: this.chatbotListening, chatbotSpeaking: this.chatbotSpeaking, chatBotThinking: this.chatbotThinking }
      this.broadcast('onlineActivity' , onlineActivity);
    }, this.executiveCycleTime);   
  }

  broadcastMessage(message: IChatbotMessage) {
    if (message) {
      this.bc.postMessage(message);
    }
  }

  updateMessage(message: IChatbotMessage) {
    switch (message.action) {
      case 'reload':
        location.reload();
        break;
      case 'addToChatLatest':
        this.addToChatLatest(message);
        break;
      case 'requestStopListening':
        this.requestStopListening();
        break;
      case 'continuousEnabled':
        this.continuousEnabled(message);
        break;
      case 'onlineActivity':
        this.onlineActivity(message);
        break;        
    }
  }

  broadcast(action: string, data?: any, utterance?: string) {
    if(this.talkshowAgent === '') {
      return;
    }
    const message = { name: this.talkshowAgent, action, data, utterance };
    this.broadcastMessage(message);
    this.updateMessage(message);
  }

  onchangeReloadSession() {
    this.broadcast('reload', '');
  }

  onchangeContinuousEnabled() {
    this.broadcast('continuousEnabled', this.continuous);
  }

  onchangeSaveGoto() {
    if(this.bookmark === 'Save') {
        this.savePageBookmark();      
      setTimeout(()=>{

        this.bookmark = '';
      }, this.executiveCycleTime * 3);   
    }

    if(this.bookmark === 'Goto') {
        this.gotoPageBookmark();      
      setTimeout(()=>{

        this.bookmark = '';
      }, this.executiveCycleTime * 3);     
    }
  }

  async continuousEnabled(message: IChatbotMessage) {
    this.continuous = message.data;
    if(this.continuous === this.defaultContinuous) {
      if(this.selectedAgent === 'Host' && this.guestChatbotLatest.length > 0) {
        this.sendToDialogFlow(this.guestChatbotLatest);
        this.guestChatbotLatest = '';
      }

      if(this.selectedAgent === 'Guest' && this.hostChatbotLatest.length > 0) {
        this.sendToDialogFlow(this.hostChatbotLatest);
        this.hostChatbotLatest = '';
      }
      this.speechRecognition(true);
    } else { // pausing
      this.speechRecognition(false);
    }
  }

  onchangeRestartSession() {
    this.broadcast('restart', '');
  }

  async onchangeTalkshowAgent() {
    this.broadcast('requestStopListening');

    while(this.hostListening || this.guestListening) {
      await this.sleep(this.executiveCycleTime);
    }
    this.changeTalkshowAgent();
  }

  async changeTalkshowAgent() {
    this.chatbotOnline = false;
    this.switchingAgents = true; // temp disable agent select 

    // NOTE: how this works... now the selectedAgent will startup the <df-messenger, based on: *ngIf="aiInterface.selectedAgent === 'Guest'
    // That in turn will envoke: initDfMessenger(), and that will start the process

    while(this.hostSpeaking || this.guestSpeaking) {
      await this.sleep(this.executiveCycleTime);
    }
    this.selectedAgent = this.talkshowAgent;
    this.chatbotOnline = true;
    this.switchingAgents = false;
    this.clearChatHistory();
  }

  onlineActivity(message: IChatbotMessage) {
    if (message.data.chatbot === 'Host') {
      this.hostOnline = true;
      this.hostListening = message.data.chatbotListening;
      this.hostSpeaking = message.data.chatbotSpeaking;
      this.hostThinking = message.data.chatBotThinking;

      if(this.hostOnlineTimeoutId) {
        clearTimeout(this.hostOnlineTimeoutId);
      }
      this.hostOnlineTimeoutId = setTimeout(()=>{
        this.hostOnline = false;
        this.hostListening = false;
        this.hostSpeaking = false;
        this.hostThinking = false;
      }, this.executiveCycleTime + 1000);
    }

    if (message.data.chatbot === 'Guest') {
      this.guestOnline = true;
      this.guestListening = message.data.chatbotListening;
      this.guestSpeaking = message.data.chatbotSpeaking;
      this.guestThinking = message.data.chatBotThinking;
      if(this.guestOnlineTimeoutId) {
        clearTimeout(this.guestOnlineTimeoutId);
      }
      this.guestOnlineTimeoutId = setTimeout(()=>{
        this.guestOnline = false;
        this.guestListening = false;
        this.guestSpeaking = false;
        this.guestThinking = false;
      }, this.executiveCycleTime);
    }
  }

  async requestStopListening() {
    this.soundUndetected();
    await this.speechRecognition(false);
  }

  initializeDialogFlow() {
    window.addEventListener('df-request-sent', (event: any) => {
      const transcript = event.detail.requestBody.queryInput.text?.text;
      
      if (transcript === undefined) {
        return;
      }      
      
      if (this.sentToDialogFlow === transcript) {
        return;
      }

      if (this.chatbotThinking) {
        return;
      }

      // flip the chatbot name. What you will see in df-request-sent is what is coming from other chatbot
      let chatbot = '';
      if (this.selectedAgent === 'Host') {
        chatbot = 'Guest';
      } else {
        chatbot = 'Host';
      }
      this.addToChatHistory(chatbot, transcript);
    });


    window.addEventListener('df-response-received', (event: any) => {
      let webhookTag = '';

      if (event.detail?.raw?.queryResult?.webhookTags?.length > 0) {
        webhookTag = event.detail?.raw?.queryResult?.webhookTags[0];
        if (webhookTag === 'randomNumber') {
          this.randomNumber =
            event.detail?.raw?.queryResult?.parameters.randomNumber;
        }
        if (event.detail?.raw?.queryResult?.webhookTags?.length > 1) {
          webhookTag = event.detail?.raw?.queryResult?.webhookTags[1];
          if (webhookTag === 'clearPreviousNumber') {
            this.randomNumber = '';
          }
        }
      }
      
      if (event.detail?.raw?.queryResult?.webhookTags?.length > 0) {
        webhookTag = event.detail?.raw?.queryResult?.webhookTags[0];
        if (webhookTag === 'noMatch') {
          if(event.detail?.raw?.queryResult?.parameters.commandPrompt) {
            const commandPrompt = event.detail?.raw?.queryResult?.parameters.commandPrompt;
            if(commandPrompt !== '{}') {
              const commandObj = JSON.parse(commandPrompt);
              if(commandObj.saveBookmark) {
                this.bookmark = 'Save';
                this.onchangeSaveGoto();
              }
              if(commandObj.gotoBookmark) {
                this.bookmark = 'Goto';
                this.onchangeSaveGoto();
              }
              if(commandObj.reloadApp) {
                this. onchangeReloadSession();
              }
            }
          }
        }
      }
      this.extractDebugInfo(event.detail.data.messages);

      event.detail.data.messages = event.detail.data.messages.filter(
        (message: { type: string; text: string }) => {
          this.lastestRequest = message.text;

          this.addToChatHistory(this.selectedAgent, this.lastestRequest);
          if(this.speechEnabled) {
            this.speak(message.text);
          }
          return message.type === 'text';
        }
      );
      const dontShowResponse = false; // If true, the chatbot dialog will not show the response

      if (dontShowResponse) {
        event.detail.data.messages.length = 0;
      }
    });

    window.addEventListener('df-messenger-loaded', async () => {
      await this.initDfMessenger();
    });
  }

  extractDebugInfo(messages: Array<any>) {
    for(let i = messages.length - 1; i > -1; i--) {
      let text: string = messages[i].text;

      if(text.indexOf('$debug') !== -1) {
        this.consoleLogDebug(text);
        messages.splice(i, 1);
      }
    }
  }

  consoleLogDebug(text: string) {
    console.log(text);
  }

  savePageBookmark() {
    const eventName = 'save-page-bookmark';
    const dfMessenger = document.querySelector('df-messenger') as any;
    dfMessenger.sendRequest('event', eventName); 
  }
  
  gotoPageBookmark() {
    const eventName = 'goto-page-bookmark';
    const dfMessenger = document.querySelector('df-messenger') as any;
    dfMessenger.sendRequest('event', eventName); 
  }  

  getVoices = () => {
    this.voices = this.speechSynth.getVoices();
  }

  get hostUnavailable(): boolean {
    if(this.hostOnline) {
      return true;
    }
    return false;
  }

  get guestUnavailable(): boolean {
    if(this.guestOnline) {
      return true;
    }
    return false;
  }

  async speak(textInput: string) {
    this.broadcast('requestStopListening');
    while (this.hostListening || this.guestListening) {
      // note: while this may be better for simple design, consider future possibility to interrupt bot speech, with human speech
      await this.sleep(this.executiveCycleTime);
    }
    this.speechReties = 0;
    this.chatbotThinking = false;

    if (!textInput) {
      console.log('textInput is missing');
      return;
    }

    this.chatbotSpeaking = true;
    // Check if speaking
    if (this.speechSynth.speaking) {
      this.speechStack.push(textInput);
      return;
    }

    if (textInput !== '') {
      let speakText = new SpeechSynthesisUtterance(textInput);
      speakText.onstart = (e) => {};

      speakText.onend = async (e) => {
        this.broadcast('addToChatLatest', this.selectedAgent, e.utterance.text);

        if (this.speechStack.length > 0) {
          const textInput = this.speechStack.shift();
          if (textInput) {
            // if (!this.chatbotListening) {
            //   this.addToChatHistory(this.selectedAgent, textInput);
            // }
            if(this.speechEnabled) {
              this.speak(textInput);
            }
          }
        } else {
          this.chatbotSpeaking = false;
          await this.speechRecognition(true);
        }
      };

      speakText.onerror = (e) => {
        if(e.error === 'synthesis-failed') {
          this.speechReties++;
          if(this.speechReties < 3)
          {
            console.log(`problem during SpeechSynthesisUtterance. Retry number: ${this.speechReties}`);
            setTimeout(()=>{
              this.speechSynth.speak(speakText);              
            }, 500);
          }
        } else {
          console.log('can not recover from problem during SpeechSynthesisUtterance.');
          this.chatbotSpeaking = false;
        }
      };

      const defaultVoice = this.voices[0];
      if (this.selectedVoice.length === 0) {
        speakText.voice = defaultVoice;
      } else {
        const voice = this.voices.find((v) => {
          return v.name === this.selectedVoice;
        });

        if (voice) {
          speakText.voice = voice;
        } else {
          speakText.voice = defaultVoice;
        }
      }

      if(this.speechEnabled) {
        speakText.volume = this.speechVolume;
      } else {
        speakText.volume = 0;
      }
      this.speechSynth.speak(speakText);
    }
  }

  soundUndetected() {
    if (this.mediaStream) {
      const tracks = this.mediaStream.getTracks();
      tracks.forEach((track: { stop: () => any; }) => track.stop()); 
      this.mediaStream = null;
    }

  }

  soundDetection() {
    navigator.mediaDevices.getUserMedia({ audio: true })
    .then(stream => {

        this.mediaStream = stream;

        const audioContext = new AudioContext();
        const source = audioContext.createMediaStreamSource(stream);
        const   analyser = audioContext.createAnalyser();
        source.connect(analyser);

        analyser.fftSize   = 2048; // Adjust for desired frequency resolution
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const analyzeSound = () => {
            requestAnimationFrame(analyzeSound); // Keep analyzing
            analyser.getByteFrequencyData(dataArray);

            let sum = 0;
            for (let i = 0; i < bufferLength; i++) {
                sum += dataArray[i];
            }
            const average = sum / bufferLength;   
            // Use the 'average' value to determine sound intensity
            // You can set a threshold to trigger actions
            if (average > 15) { // Example threshold
              this.soundDetected = true;
              if(this.soundDetectedTimeoutId) {
                clearTimeout(this.soundDetectedTimeoutId);
              }
              this.soundDetectedTimeoutId = setTimeout(()=>{
                this.soundDetected = false;
              }, 500);
            }
        }
        analyzeSound(); // Start the analysis loop
    })
    .catch(err => {
        console.error("Error accessing microphone:", err);
    });
  }

  initializeStt() {
    this.stt = new webkitSpeechRecognition();
    this.stt.interimResults = false;
    this.stt.continuous = true;
    this.stt.lang = 'en-US';

    this.stt.addEventListener('start', (e: any) => {
      this.chatbotListening = true;

      this.soundDetection();
    });

    this.stt.addEventListener('result', (e: any) => {
      const resultIndex = e.resultIndex;
      const transcript = e.results[resultIndex][0].transcript;

      //??? not necessary because i shouldn't be speaking
      if (!this.chatbotSpeaking) {
        this.sendToDialogFlow(transcript);
      }

      let chatbot = this.selectedAgent;
      if (!this.chatbotSpeaking) {
        if (this.selectedAgent === 'Host') {
          chatbot = 'Guest';
        } else {
          chatbot = 'Host';
        }
      }
      this.addToChatHistory(chatbot, transcript);

    });

    this.stt.addEventListener('error', async (e: any) => {
      this.chatbotListening = false;
      if (e.error === 'no-speech') {
        // restart (first stop)
        await this.speechRecognition(false);
        await this.speechRecognition(true);
      } else {
        console.log('Likely the error is aborted due to more than 1 listener!');
      }
    });

    this.stt.addEventListener('end', (e: any) => {
      this.chatbotListening = false;
    });

    this.stt.addEventListener('speechstart', (e: any) => {
      console.log('speechstart');
    });

    this.stt.addEventListener('speechend', (e: any) => {
      console.log('speechend');
      this.chatbotListening = false;
    });

    this.stt.addEventListener('soundstart', (e: any) => {
      console.log('soundstart');
      this.soundStarted = true;
    });

    this.stt.addEventListener('soundend', (e: any) => {
      console.log('soundend');
      this.soundStarted = false;
    });
  }

  addToChatLatest(message: IChatbotMessage) {
    if (message.data === 'Guest' && this.selectedAgent === 'Host') {
      this.guestChatbotLatest = message.utterance;

      if (this.continuous === this.defaultContinuous) {
        this.sendToDialogFlow(message.utterance);
        this.guestChatbotLatest = '';
      }
    }

    if (message.data  === 'Host' && this.selectedAgent === 'Guest') {
      this.hostChatbotLatest = message.utterance;

      if (this.continuous === this.defaultContinuous) {
        this.sendToDialogFlow(message.utterance);
        this.hostChatbotLatest = '';
      }
    }
  }

  addToChatHistory(agent: string, message: string) {
    const newMmessage = '\n' + agent + '> ' + message + '\n';
    this.chatbotHistory += newMmessage;
    setTimeout(() => {
      const textarea = document.querySelector('.chat-history-textarea');
      if (textarea) {
        textarea.scrollTop = textarea.scrollHeight;
      }
    });
  }

  async initDfMessenger() {

    if(this.chatbotListening) {
      return;
    }
    this.continuous = this.defaultContinuous;
    this.dfMessenger = document.querySelector('df-messenger');
    if (this.dfMessenger) {
      this.dfMessenger.startNewSession({ retainHistory: false });

      let defaultOpening = '';
      if (this.selectedAgent === 'Host') {
        defaultOpening = this.defaultHostOpening;
      }

      if (this.selectedAgent === 'Guest') {
        defaultOpening = this.defaultGuestOpening;
      }

      this.lastestRequest = defaultOpening;

      if (this.openingEnabled) {
        this.dfMessenger.renderCustomText(defaultOpening, true);
        setTimeout(() => {
          this.speak(defaultOpening);
        }, this.openingPauseTime);
      } else {
        await this.speechRecognition(true);
      }
    }

    this.dfMessengerChatBubble = document.querySelector(
      'df-messenger-chat-bubble'
    );
    if (this.dfMessengerChatBubble) {
      this.dfMessengerChatBubble.openChat();
    }
  }

  sendToDialogFlow(message: string) {
    this.chatbotThinking = true;
    this.dfMessenger.sendQuery(message);
    this.dfMessenger.renderCustomText(message, false);
    this.sentToDialogFlow = message;
  }

  clearChatHistory() {
    this.chatbotHistory = '';
    this.hostChatbotLatest = '';
    this.guestChatbotLatest = '';
  }

  clearReloadequest() {
    this.hostReloadRequest = '';
    this.guestReloadRequest = '';
  }

  showMrSmartyPantsFace(): boolean {
  
    // if(this.hostOnline === false) {
    //   console.log('hostOnline', this.hostOnline)
    // }  

    // if(this.guestOnline === false) {
    //   console.log('guestOnline', this.guestOnline)
    // }      
  
    if(this.hostOnline && this.guestOnline) {
      return false;
    }
    return true;
  }

  showHostBotFace(): boolean {
    if(this.hostOnline && this.guestOnline) {
      return false;
    }
    const x = this.showMrSmartyPants && this.selectedAgent  === 'Guest';
    return !x;
  }

  showGuestBotFace(): boolean {
    if(this.hostOnline && this.guestOnline) {
      return false;
    }
    const x = this.showMrSmartyPants && this.selectedAgent  === 'Host';
    return !x;
  }

  async speechRecognition(listen: boolean) {

    if (listen) {
      try {
        // don't allow speechRecognition when both agents are online
        if(this.hostOnline && this.guestOnline) {
          return;
        }
        // don't allow speechRecognition when paused
        if(this.continuous !== this.defaultContinuous) {
          return;
        }

        if(!this.chatbotListening) { 
          this.stt.start();
          
          while(!this.chatbotListening) {
            await this.sleep(this.executiveCycleTime);
          }
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      this.stt.stop();
      while(this.chatbotListening) {
        await this.sleep(this.executiveCycleTime);
      }
      await this.sleep(this.executiveCycleTime);
    }
  }

  get continuous(): string {
    return this._continuous;
  }

  set continuous(value: string) {
    value = value.trim();
    this._continuous = value;

    if(value === this.defaultContinuous) {
      if(this.selectedAgent === 'Host' && this.hostChatbotLatest.length > 0) {
        this.sendToDialogFlow(this.hostChatbotLatest);
        this.hostChatbotLatest = '';
      }

      if(this.selectedAgent === 'Guest' && this.guestChatbotLatest.length > 0) {
        this.sendToDialogFlow(this.guestChatbotLatest);
        this.guestChatbotLatest = '';
      }      
    }
  }

  get appDuplex(): string {
    if(this.selectedAgent === 'Host') {
      if(this.guestOnline) {
        return 'host-full-duplex';
      } else {
        return 'host-half-duplex';
      }
    }
    if(this.selectedAgent === 'Guest') {
      if(this.hostOnline) {
        return 'guest-full-duplex';
      } else {
        return 'guest-half-duplex';
      }
    }
    return '';
  }

  set chatbotOnline(value: boolean) {
    if(this.selectedAgent === 'Host') {
      this.hostOnline = value;
    } 
    if(this.selectedAgent === 'Guest') {
      this.guestOnline = value; 
    }
  }

  get chatbotOnline() : boolean {
    if(this.selectedAgent === 'Host') {
      return this.hostOnline;
    }
    if(this.selectedAgent === 'Guest') {
      return this.guestOnline;
    }
      return false;
  }

  set chatbotThinking(value: boolean) {
    if(this.selectedAgent === 'Host') {
      this.hostThinking = value;
    }
    if(this.selectedAgent === 'Guest') {
      this.guestThinking = value; 
    }
  }

  get chatbotThinking() : boolean {
    if(this.selectedAgent === 'Host') {
      return this.hostThinking;
    }
    if(this.selectedAgent === 'Guest') {
      return this.guestThinking;
    }
    return false;
  }

  set chatbotSpeaking(value: boolean) {
    if(this.selectedAgent === 'Host') {
      this.hostSpeaking = value;
    }
    if(this.selectedAgent === 'Guest') {
      this.guestSpeaking = value;
    }
  }

  get chatbotSpeaking(): boolean {
    if(this.selectedAgent === 'Host') {
      return this.hostSpeaking;
    } 
    
    if(this.selectedAgent === 'Guest') {
      return this.guestSpeaking;
    }
    return false;
  }

  set chatbotListening(value: boolean) {
    if(this.selectedAgent === 'Host') {
      this.hostListening = value;
    } 
    if(this.selectedAgent === 'Guest') {

      if(value) {
        const bp = 0;
      }
      this.guestListening = value;
    }     
  }

  get chatbotListening(): boolean {
    if(this.selectedAgent === 'Host') {
      return this.hostListening;
    }
    if(this.selectedAgent === 'Guest') {
      return this.guestListening;
    }
    return false;
  }

  get selectedVoice() {
    const selectedVoice = localStorage.getItem(
      `selectedVoice-${this.selectedAgent}`
    );
    if (selectedVoice) {
      return selectedVoice;
    } else {
      return '';
    }
  }

  set selectedVoice(value: string) {
    localStorage.setItem(`selectedVoice-${this.selectedAgent}`, value);
  }

  get speechEnabled(): boolean {
    const enableSpeech = localStorage.getItem(
      `enableSpeech-${this.selectedAgent}`
    );
    if (enableSpeech === null) {
      return true; // default
    } else {
      if (enableSpeech === 'true') {
        return true;
      } else {
        return false;
      }
    }
  }

  set speechEnabled(value: boolean) {
    localStorage.setItem(
      `enableSpeech-${this.selectedAgent}`,
      value.toString()
    );
  }

  get guestOpeningEnabled():  boolean {
    const openingEnabled = localStorage.getItem(
      `openingEnabled-Guest`
    );
    if (openingEnabled === null) {
      return true; // default
    } else {
      if (openingEnabled === 'true') {
        return true;
      } else {
        return false;
      }
    }
  }

  get hostOpeningEnabled():  boolean {
    const openingEnabled = localStorage.getItem(
      `openingEnabled-Host`
    );
    if (openingEnabled === null) {
      return true; // default
    } else {
      if (openingEnabled === 'true') {
        return true;
      } else {
        return false;
      }
    }
  }

  get openingEnabled(): boolean {
    const openingEnabled = localStorage.getItem(
      `openingEnabled-${this.selectedAgent}`
    );
    if (openingEnabled === null) {
      return true; // default
    } else {
      if (openingEnabled === 'true') {
        return true;
      } else {
        return false;
      }
    }
  }

  set openingEnabled(value: boolean) {
    localStorage.setItem(
      `openingEnabled-${this.selectedAgent}`,
      value.toString()
    );
  }

  get chatbotShow(): boolean {
    const chatbotShow = localStorage.getItem(
      `chatbotShow-${this.selectedAgent}`
    );
    if (chatbotShow === null) {
      return true; // default
    } else {
      if (chatbotShow === 'true') {
        return true;
      } else {
        return false;
      }
    }
  }

  set chatbotShow(value: boolean) {
    localStorage.setItem(`chatbotShow-${this.selectedAgent}`, value.toString());
  }

  get chatbotHistory() {
    const chatbotHistory = localStorage.getItem('chatbotHistory');
    if (chatbotHistory) {
      return chatbotHistory;
    }
    return '';
  }

  set chatbotHistory(value: string) {
    localStorage.setItem('chatbotHistory', value);
  }

  get hostReloadRequest(): string {
    const hostReloadRequest = localStorage.getItem('hostReloadRequest');
    if (hostReloadRequest) {
      return hostReloadRequest;
    }
    return '';
  }

  set hostReloadRequest(value: string) {
    localStorage.setItem('hostReloadRequest', value);
  }

  get guestReloadRequest(): string {
    const guestReloadRequest = localStorage.getItem('guestReloadRequest');
    if (guestReloadRequest) {
      return guestReloadRequest;
    }
    return '';
  }

  set guestReloadRequest(value: string) {
    localStorage.setItem('guestReloadRequest', value);
  }

  async sleep(ms: number) {
    return await new Promise((resolve) => setTimeout(resolve, ms));
  }

}