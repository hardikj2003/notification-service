import { EmailStrategy } from './channels/EmailStrategy.js';
import { InAppStrategy } from './channels/InAppStrategy.js';
// import { SmsStrategy } from './channels/SmsStrategy'; // To be implemented
export class ChannelService {
    strategies = new Map();
    constructor() {
        // Register strategies
        const email = new EmailStrategy();
        this.strategies.set(email.channelName, email);
        this.strategies.set('IN_APP', new InAppStrategy());
    }
    getStrategy(channel) {
        const strategy = this.strategies.get(channel);
        if (!strategy)
            throw new Error(`No strategy found for channel: ${channel}`);
        return strategy;
    }
}
//# sourceMappingURL=ChannelService.js.map