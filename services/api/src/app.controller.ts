import { Controller, Get } from '@nestjs/common';
import { ping } from '@tourism/core';

@Controller()
export class AppController {
  @Get('health')
  health(): { status: 'ok' } {
    return { status: 'ok' };
  }

  // Fase 0.10 — wiring test endpoint: bukti services/api bisa memanggil packages/core.
  @Get('ping')
  pingEndpoint(): { message: string } {
    return { message: ping() };
  }
}
