export class EmailStrategy {
    channelName = 'EMAIL';
    async send(notification) {
        console.log(`[EmailStrategy] Sending email to user ${notification.userId}`);
        // Here you would integrate SendGrid or AWS SES as per requirement 4.6.3
        // For now, we simulate a successful send
        return true;
    }
}
//# sourceMappingURL=EmailStrategy.js.map