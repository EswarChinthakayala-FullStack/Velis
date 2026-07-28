type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export class Logger {
  private static formatMessage(level: LogLevel, event: string, details?: Record<string, any>): string {
    const timestamp = new Date().toISOString();
    const payload = details ? ` | ${JSON.stringify(details)}` : '';
    return `[${timestamp}] [${level}] [validate-share-token] ${event}${payload}`;
  }

  static info(event: string, details?: Record<string, any>) {
    console.log(this.formatMessage('INFO', event, details));
  }

  static warn(event: string, details?: Record<string, any>) {
    console.warn(this.formatMessage('WARN', event, details));
  }

  static error(event: string, details?: Record<string, any>) {
    console.error(this.formatMessage('ERROR', event, details));
  }
}
