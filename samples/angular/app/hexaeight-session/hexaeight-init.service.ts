import { Injectable } from '@angular/core';
// @ts-ignore
import HexaEight from 'hexaeight-sessions/hexaeightsession.mjs'


@Injectable({
  providedIn: 'root'
})
export class HexaEightInitService {
  private session: HexaEight;
  private initialized: boolean;

  constructor() {
    this.initialized = false;
  }

  async initSession(clientId: string, tokenServerUrl: string): Promise<HexaEight> {
    if (!this.initialized) {
      try {
        this.session = new HexaEight();
        await this.session.init(clientId, tokenServerUrl, "hexaeight-user-container");
        const initialized = await this.session.ready();
        console.log("Session is initialized: " + initialized);
        this.initialized = true;
      } catch (error) {
        console.error("Error initializing session:", error);
        throw error;
      }
    }
    return this.session;
  }
}
