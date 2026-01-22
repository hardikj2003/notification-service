import type { ChannelStrategy } from './channels/ChannelStrategy.js';
import { EmailStrategy } from './channels/EmailStrategy.js';
// import { SmsStrategy } from './channels/SmsStrategy'; // To be implemented

export class ChannelService {
  private strategies: Map<string, ChannelStrategy> = new Map();

  constructor() {
    // Register strategies
    const email = new EmailStrategy();
    this.strategies.set(email.channelName, email);
  }

  getStrategy(channel: string): ChannelStrategy {
    const strategy = this.strategies.get(channel);
    if (!strategy) throw new Error(`No strategy found for channel: ${channel}`);
    return strategy;
  }
}