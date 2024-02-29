import { Component, OnInit , ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HexaEightInitService } from './hexaeight-init.service';
// @ts-ignore
import { HexaEightChat } from "hexaeight-sessions/hexaeightAIchat.mjs";


@Component({
  selector: 'app-hexaeight-session',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './hexaeight-session.component.html',
  styleUrl: './hexaeight-session.component.scss'
})

export class HexaeightSessionComponent implements OnInit {
  session: any;
  messageText: string = ''; // Initialize here
  sessionInitialized: boolean = false; // Initialize here
  preferredLanguage: string = "en-US";
  languageOptions: any[] = []; // Initialize here
  messageContainer: any;

  @ViewChild('messagecontainer', { static: true }) chatContainerRef!: ElementRef;



  constructor(private hexaEightInitService: HexaEightInitService, private elRef: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.initSession();
  }

  ngAfterViewInit() {
    // Access the native DOM element
    this.messageContainer = this.chatContainerRef.nativeElement;
  }

  async initSession() {
    try {
      this.session = await this.hexaEightInitService.initSession("YourClientID", "YOURTOKENSERVERURL");
      const iresp = await this.session.ready();
      console.log("Session is Ready: " + iresp);
      const response = await this.session.isauthenticated();
      this.sessionInitialized = true;
      console.log("Session is initialized");
      this.sessionInitialized = true;
      const parsedResponse = JSON.parse(response);
      const isAuthenticated = parsedResponse.data === "True";

      HexaEightChat.init({
        chatContainerId: this.messageContainer,
        session: this.session,
        messageCallback: async (request: any, message: any) => {
          try {
            const req = await this.session.DecipherMessage(request);
            if (JSON.parse(req).BODY == "RENDER") {
              const codeToExecute = JSON.parse(
                await this.session.DecipherMessage(message)
              ).BODY;
              const asyncFunction = new Function(
                `(async () => { ${codeToExecute} })();`
              );
              asyncFunction();
            }
          } catch {}
          console.log("Received new message:", message);
          console.log("Received new request:", request);
        },
        elRef: this.elRef,
        renderer2 : this.renderer,
      });

      const languageDropdown = document.getElementById("languageDropdown");
      const talkButtonID = "talkButton";
      const speakButtonID = "speakerButton";
      const muteButtonID = "muteButton";
      HexaEightChat.loadChatMessages();
      this.languageOptions = HexaEightChat.populateLanguageDropdown(
        languageDropdown,
        talkButtonID,
        speakButtonID,
        muteButtonID
      );
      HexaEightChat.setPreferredLanguage(
        this.preferredLanguage,
        languageDropdown
      );

    } catch (error) {
      console.error("Failed to initialize session:", error);
    }
  }

  async sendMessage() {
    if (this.sessionInitialized && this.messageText) {
      try {
        await this.session.EngageAI(this.messageText);
        this.messageText = ''; // Clear the message text
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  }
}

