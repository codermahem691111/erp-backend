import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PeopleController } from './people.controller';
import { PeopleRepository } from './people.repository';
import { PeopleService } from './people.service';

@Module({
  imports: [AuthModule],
  controllers: [PeopleController],
  providers: [PeopleService, PeopleRepository],
})
export class PeopleModule {}
