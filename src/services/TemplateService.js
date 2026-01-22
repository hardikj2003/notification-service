import { prisma } from '../lib/db.js';
export class TemplateService {
    /**
     * Replaces placeholders like {{key}} with values from the variables object
     */
    static substitute(content, variables) {
        return content.replace(/\{\{(.*?)\}\}/g, (match, key) => {
            const trimmedKey = key.trim();
            return variables[trimmedKey] !== undefined ? String(variables[trimmedKey]) : match;
        });
    }
    static async getTemplate(id) {
        return prisma.notificationTemplate.findUnique({
            where: { id, isActive: true },
        });
    }
}
//# sourceMappingURL=TemplateService.js.map