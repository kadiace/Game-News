import { Body, Controller, Post } from '@nestjs/common';
import { SubscribeDto } from './dto/subscribe.dto';
import { UnsubscribeDto } from './dto/unsubscribe.dto';
import { VerifySubscriberDto } from './dto/verify-subscriber.dto';
import { SubscribersService } from './subscribers.service';

@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly service: SubscribersService) {}

  @Post()
  subscribe(@Body() dto: SubscribeDto) {
    return this.service.subscribe(dto.email.toLowerCase());
  }

  @Post('verify')
  verify(@Body() dto: VerifySubscriberDto) {
    return this.service.verify(dto.token);
  }

  @Post('unsubscribe')
  unsubscribe(@Body() dto: UnsubscribeDto) {
    return this.service.unsubscribe(dto.email.toLowerCase());
  }
}
