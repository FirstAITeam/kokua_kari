
// 仮のnext.js型定義
declare module 'next' {
  export interface NextApiRequest extends Request {
    body: any;
    query: { [key: string]: string | string[] };
    cookies: { [key: string]: string };
  }

  export interface NextApiResponse extends Response {
    status(statusCode: number): NextApiResponse;
    json(data: any): void;
    send(data: any): void;
    end(): void;
  }
}
