export declare class TemplateService {
    /**
     * Replaces placeholders like {{key}} with values from the variables object
     */
    static substitute(content: string, variables: Record<string, any>): string;
    static getTemplate(id: string): Promise<{
        id: string;
        name: string;
        category: string;
        eventType: string;
        emailSubject: string | null;
        emailBodyHtml: string | null;
        emailBodyText: string | null;
        smsContent: string | null;
        pushTitle: string | null;
        pushBody: string | null;
        inAppTitle: string | null;
        inAppBody: string | null;
        variables: import("@prisma/client/runtime/client").JsonValue;
        defaultChannel: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    } | null>;
}
//# sourceMappingURL=TemplateService.d.ts.map