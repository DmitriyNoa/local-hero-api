import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HelpRequestsModule } from './help-requests/help-requests.module';

@Module({
  imports: [HelpRequestsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
