import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseIntPipe,
} from '@nestjs/common';
import { DirectorService } from './director.service';
import { CreateDirectorDto } from './dto/create-director.dto';
import { UpdateDirectorDto } from './dto/update-director.dto';
import { ClassSerializerInterceptor } from '@nestjs/common';

@Controller('director')
@UseInterceptors(ClassSerializerInterceptor)
export class DirectorController {
  constructor(private readonly directorService: DirectorService) {}

  @Get()
  findAll() {
    return this.directorService.findAll();
  }

  @Post()
  create(@Body() createDirectorDto: CreateDirectorDto) {
    return this.directorService.create(createDirectorDto);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: string) {
    return this.directorService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateDirectorDto: UpdateDirectorDto,
  ) {
    return this.directorService.update(+id, updateDirectorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.directorService.remove(+id);
  }
}
