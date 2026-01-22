import type { Server as HttpServer } from 'http';
export declare class SocketService {
    private static io;
    static init(httpServer: HttpServer): Promise<void>;
    static sendToUser(userId: string, data: any): void;
}
//# sourceMappingURL=SocketService.d.ts.map